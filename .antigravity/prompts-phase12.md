# Phase 12: Data Quality, Deployment & Polish

**Context:** Phase 11 resolved all merge conflict debris and established a clean AppShell architecture. The app compiles and runs, but there are data quality issues (markdown in titles), a pending D1 migration, and the content reading experience needs polish. This phase focuses on production readiness.

---

## Instance A — Run Pending Migration & Fix Data Quality

### Goal
Get the production D1 database in sync and clean up lesson title data.

### Manual Steps (User Must Run)
```bash
# 1. Run the pending migration
cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/014_family_current_topic.sql

# 2. Fix lockfile
cd .. && bun install
# Commit bun.lock

# 3. Redeploy worker
cd worker && npx wrangler deploy
```

### Files to Create
- **CREATE** `worker/db/migrations/015_strip_title_markdown.sql`

```sql
-- Strip markdown bold markers from lesson titles
UPDATE Lessons SET title = REPLACE(REPLACE(title, '**', ''), '*', '') WHERE title LIKE '%**%' OR title LIKE '%*%';
```

### Testing
- Verify: `GET /api/family` returns 200 with `current_topic_id` field.
- Verify: `GET /api/topics/:id` returns lesson titles without `**` markers.

---

## Instance B — Reading Experience Polish

### Goal
Improve the reading flow: better typography, reading progress indicator, and smoother transitions.

### Files to Modify

**1. `src/components/content/AdaptedContentReader.tsx`**
- Add a reading progress bar at the top of the content area (scroll-based).
- Ensure all band layouts render consistently with proper spacing.
- Add estimated reading time calculation (words / 200 wpm).

**2. `src/pages/ReadingView.tsx`**
- Add a floating "Back to Lesson" button at the bottom after scrolling past the content.
- Improve the "Mark Complete" section: show a congratulations state after marking complete.

### Testing
- Verify: Reading progress bar fills as user scrolls.
- Verify: "Mark Complete" shows success state and navigates back.

---

## Instance C — Dashboard Continue-Learning Enhancement

### Goal
Make the "Continue Learning" hero card more useful by showing actual lesson progress and a preview of the next lesson.

### Files to Modify

**1. `src/pages/parent/Dashboard.tsx`**
- When `currentTopicId` is set, show the topic title and first incomplete lesson in the hero card.
- Add a subtle progress indicator (X of Y lessons complete) to each topic in the accordion.
- Add a "Last studied: [date]" line if progress data is available.

### Testing
- Verify: Hero card shows the correct topic and next lesson based on `currentTopicId`.
- Verify: Topic accordion shows lesson completion counts.

---

## Instance D — Error Handling & Edge Cases

### Goal
Handle edge cases that currently cause poor UX.

### Files to Modify

**1. `src/lib/learnerStore.ts`**
- If `loadFamily()` gets a 404 (no family), redirect to onboarding instead of showing an empty dashboard.
- Add a `hasFamily` boolean to the store state.

**2. `src/pages/parent/Dashboard.tsx`**
- If `!hasFamily && isLoaded`, show a CTA to complete onboarding instead of an empty topic list.
- Handle the case where topics API returns empty array gracefully.

**3. `src/components/layout/AppShell.tsx`**
- Show a minimal skeleton in the sidebar while `loadFamily()` is pending.
- Handle the no-family state by hiding the learner switcher.

### Testing
- Verify: New user who hasn't onboarded sees onboarding prompt on dashboard.
- Verify: User with family but no topics sees a helpful empty state.

---

## Execution Order

1. **Instance A** — Manual steps first (migration + deploy). No code changes needed beyond the SQL migration.
2. **Instance B + C** — Frontend-only, can run in parallel after Instance A.
3. **Instance D** — After B+C, as it touches shared components.

**Critical path:** Instance A must complete first — without the migration, the family API returns 500 and the rest of the app is degraded.
