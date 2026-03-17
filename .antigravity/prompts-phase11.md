# Phase 11: Post-Merge Cleanup & Shell Integration

**Context:** Phase 10 introduced an `AppShell` (sidebar + header + bottom nav) that wraps all authenticated routes in `App.tsx`. However, several pages still render their own redundant headers, back buttons, and navigation chrome. Additionally, the `LessonView` hardcodes learner info instead of reading from the global store. This phase resolves all remaining inconsistencies.

---

## Instance A — Remove Redundant Headers from Pages Inside AppShell

### Goal
Pages wrapped in `<AppShell>` should NOT render their own `<header>` elements — the shell already provides persistent navigation, the learner switcher, and sign-out. Redundant headers create double-chrome and confuse users.

### Files to Modify

**1. `src/pages/LessonView.tsx`**
- **Remove** lines 107-119 (the sticky `<header>` with "Back to Topic" button). The AppShell sidebar and breadcrumbs already handle navigation.
- **Fix** lines 40-41: Replace hardcoded `learnerName = "Learner"` and `bandLabel = "Band"` with store values:
  ```typescript
  import { useLearnerStore } from '@/lib/learnerStore';
  // inside the component:
  const { activeLearnerName, activeLearnerBand } = useLearnerStore();
  const BAND_LABELS = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice', 'University'];
  const learnerName = activeLearnerName || 'Learner';
  const bandLabel = BAND_LABELS[activeLearnerBand] || `Band ${activeLearnerBand}`;
  ```
- The Step 1 description on line 164 says "Read the lesson text adapted for {learnerName}'s level ({bandLabel})." — this will now show the real learner name and band label.

**2. `src/pages/ReadingView.tsx`**
- **Remove** the sticky `<header>` block (lines 74-92). The `BandBadge` and "World Context" button should move into the main content area instead:
  - Place `<BandBadge />` above the breadcrumb or next to the lesson title.
  - Keep the "World Context" button as a floating button (already exists for mobile on lines 95-105) — extend it to show on desktop too, or place it inline near the title.
- The page already has breadcrumbs (lines 122-147) which handle navigation.

**3. `src/pages/NarratedLessonView.tsx`**
- This page is special — it's a full-screen immersive experience (canvas + playback controls). It should **NOT** be inside AppShell at all.
- **Modify `src/App.tsx`**: Remove the `<AppShell>` wrapper from the `/narrate/:lessonId` route. The NarratedLessonView should render standalone (it already has its own header on lines 183-218).
- Similarly, **remove AppShell from `/exam/:lessonId`** route — the ExamView is also an immersive full-screen experience.
- Both NarratedLessonView and ExamView should keep their own minimal headers with a "Back" button since they're outside the shell.

**4. `src/App.tsx` route changes:**
```tsx
// These should NOT be wrapped in AppShell (immersive experiences):
<Route path="/narrate/:lessonId" element={
  <ProtectedRoute><NarratedLessonView /></ProtectedRoute>
} />
<Route path="/exam/:lessonId" element={
  <ProtectedRoute><ExamView /></ProtectedRoute>
} />
```

### Testing
- Verify: Dashboard, TopicDetail, LessonView, ReadingView, Glossary all show inside AppShell with sidebar (desktop) or bottom nav (mobile). No double headers.
- Verify: NarratedLessonView and ExamView render full-screen without AppShell chrome.
- Verify: LessonView Step 1 shows the real learner name and band label from the store.

---

## Instance B — Create Progress Page (Placeholder)

### Goal
The sidebar and bottom nav link to `/progress` but no page exists. Create a placeholder Progress page so navigation doesn't break.

### Files to Create
- **CREATE** `src/pages/Progress.tsx`

### Specifications
```tsx
export default function Progress() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Learning Progress</h1>
      <p className="text-muted-foreground">
        Track your family's learning journey across all topics and lessons.
      </p>
      {/* Placeholder content */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl border-dashed bg-card">
        <TrendingUp className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground max-w-sm">
          Progress tracking across lessons, topics, and exam results will appear here.
        </p>
      </div>
    </div>
  );
}
```

### Files to Modify
- **MODIFY** `src/App.tsx`: Add a route for `/progress` wrapped in `<ProtectedRoute><AppShell><Progress /></AppShell></ProtectedRoute>`.

### Testing
- Verify: Clicking "Progress" in the sidebar or bottom nav navigates to the page without errors.

---

## Instance C — Onboarding → Dashboard Continuity

### Goal
When onboarding completes, save the selected topic as the family's `current_topic_id` so the Dashboard hero section can show "Continue from: [Topic]".

### Files to Modify

**1. `src/pages/Onboarding.tsx`**
- In the `handleFinish()` function (or equivalent), after creating the family and learners, make an additional API call:
  ```typescript
  await fetch(`${apiUrl}/api/family`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ current_topic_id: selectedTopicId }),
    credentials: 'include',
  });
  ```

**2. Worker: Add `PATCH /api/family` endpoint**
- **MODIFY** the family API route handler in the worker to accept PATCH requests.
- Update the `Families` table: `UPDATE Families SET current_topic_id = ? WHERE id = ?`.
- The migration `014_family_current_topic.sql` already added the `current_topic_id` column.

**3. `GET /api/family` response**
- Ensure the response includes `current_topic_id` from the Families table.

**4. `src/lib/learnerStore.ts`**
- Add `currentTopicId: string | null` to the store state.
- Populate it from the `GET /api/family` response in `loadFamily()`.

**5. `src/pages/parent/Dashboard.tsx`**
- Read `currentTopicId` from `useLearnerStore`.
- Use it to determine which topic to highlight in the hero section when no lesson is in-progress.

### Testing
- Verify: After completing onboarding with a topic selected, the Dashboard hero shows that topic.
- Verify: `GET /api/family` response includes `current_topic_id`.

---

## Instance D — Pre-Generate Content Script

### Goal
Create the seed-time script that pre-generates band-adapted content for all lessons × bands, eliminating any need for on-the-fly AI calls during reading.

### Files to Create
- **CREATE** `worker/scripts/pre-generate-content.ts`

### Specifications
```
Usage: npx tsx worker/scripts/pre-generate-content.ts

1. Connect to D1 via Wrangler REST API or local binding
2. Fetch all lesson IDs from Lessons table
3. For each lesson, for each band [0, 1, 2, 3, 4]:
   a. Check if Adapted_Content row exists for (lesson_id, band)
   b. If not, call the Gemini adaptation pipeline with the lesson's narrative_text
   c. Insert the adapted text into Adapted_Content table
4. Band 5 = master text — insert a row copying narrative_text directly
5. Log progress: "Generated band 2 for lesson abc123 (14/60)"
6. Handle rate limits with exponential backoff
7. Exit with summary: "Generated X new adaptations, Y already existed, Z failed"
```

### Dependencies
- The script needs access to the Gemini API key (from environment or .env)
- It uses the same adaptation prompt logic as `worker/src/lib/content/adapt.ts`

### Important Notes
- This script runs OFFLINE at deploy/seed time, not at runtime.
- After running, all `GET /api/lessons/:id/content?band=N` requests will hit the cache and return instantly.
- The `serve.ts` file already handles the fallback case (returns master text if no adaptation exists).

### Testing
- Run the script against a test D1 database with at least 2 lessons.
- Verify: Adapted_Content table has rows for each lesson × band combination.
- Verify: `GET /api/lessons/:id/content?band=2` returns pre-generated content without any Gemini API call.

---

## Execution Order

These instances have minimal dependencies and can mostly run in parallel:

1. **Instance A (Remove Redundant Headers)** — No dependencies. Highest impact on UX.
2. **Instance B (Progress Page)** — No dependencies. Quick task.
3. **Instance C (Onboarding Continuity)** — Requires worker changes. Independent of A/B.
4. **Instance D (Pre-Generate Script)** — Fully independent. Backend-only.

**Recommended parallel groups:**
- **Group 1:** Instance A + Instance B (frontend only, no conflicts)
- **Group 2:** Instance C + Instance D (backend + store changes, no conflicts)
