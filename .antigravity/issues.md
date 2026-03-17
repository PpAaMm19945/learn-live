# Learn Live Project Audit Summary

## Status: Phase 11 Complete — Phase 12 Ready

### Phase 10: Merge Conflict Debris — All Resolved
- [x] **learnerStore.ts triple definition** — Consolidated to single Instance A version with `loadFamily()`.
- [x] **Dashboard duplicate imports** — Cleaned to single set of imports using `useLearnerStore`.
- [x] **ReadingView orphaned tags** — Fixed JSX tree, removed duplicate `useActiveBand` import.
- [x] **NarratedLessonView duplicate import** — Removed duplicate `useActiveBand`.
- [x] **Markdown rendering** — Added `react-markdown` with Tailwind prose classes to `AdaptedContentReader.tsx`.
- [x] **BandSelector removed from content views** — Replaced with read-only `BandBadge` component.

### Phase 11: Post-Merge Cleanup & Shell Integration — Complete
- [x] **Instance A: Remove redundant headers** — LessonView and ReadingView no longer render own headers. NarratedLessonView and ExamView excluded from AppShell (immersive). LessonView uses `useLearnerStore` for learner name/band.
- [x] **Instance B: Progress page** — `Progress.tsx` created with placeholder. Route added at `/progress` inside AppShell.
- [x] **Instance C: Onboarding continuity** — `PATCH /api/family` endpoint created. `currentTopicId` added to learnerStore. Dashboard uses it for continue-learning logic.
- [x] **Instance D: Pre-generate script** — `worker/scripts/pre-generate-content.ts` created.
- [x] **LogContext type** — Added `'[APP]'` and `'[LEARNER_STORE]'` to Logger.ts.
- [x] **TopicDetail.tsx** — Fixed `selectedLearner?.id` → `activeLearnerId`.

### Phase 11 Post-Audit Fixes
- [x] **Raw markdown in titles** — Created `stripMarkdown()` utility. Applied to LessonView, ReadingView, TopicDetail, Dashboard title rendering.
- [x] **loadFamily crash resilience** — `loadFamily()` no longer throws on API failure; sets `isLoaded: true` with defaults so app doesn't crash.

### Open Issues

#### 34. D1 Migration 014 Not Run on Production
* **Status:** OPEN — CRITICAL (Manual Action Required)
* **Description:** Migration `014_family_current_topic.sql` has not been run on the remote D1 database. The `GET /api/family` endpoint queries `current_topic_id` which doesn't exist, returning a 500 error. The frontend now handles this gracefully (doesn't crash), but family data won't load until the migration is run.
* **Fix:** Run: `cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/014_family_current_topic.sql`

#### 35. Build Frozen Lockfile Mismatch
* **Status:** OPEN — MEDIUM (Manual Action Required)
* **Description:** Production build fails with `lockfile had changes, but lockfile is frozen`. This happens because `react-markdown` was added but the lockfile wasn't regenerated locally before deploy.
* **Fix:** Run `bun install` locally, commit the updated `bun.lock`, and redeploy.

#### 36. Lesson Titles Stored with Markdown in D1
* **Status:** OPEN — LOW (Data Quality)
* **Description:** Lesson titles in the D1 database contain markdown formatting (e.g., `**1.1 In the Beginning...**`). The frontend now strips this at render time via `stripMarkdown()`, but ideally the titles should be clean in the database.
* **Fix:** Run a one-time D1 update script to strip markdown from all lesson titles. Or fix at seed time.

### Notes
- Task 8.3 (Demo Video) requires user recording.
- Task 8.7 (Final E2E) is awaiting live environment testing with real Gemini API keys.
