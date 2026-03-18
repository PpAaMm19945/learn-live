# Learn Live Project Audit Summary

## Status: Phase 12 Complete — Phase 13 Ready

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

### Phase 12: Dependency and Lockfile Updates — Complete
- [x] Resolved build frozen lockfile mismatches and updated `bun.lock`.
- [x] Ran D1 migration `014_family_current_topic.sql` on production.

### Open Issues

#### 37. ReadingView "Failed to load content" (content API returns null)
* **Status:** OPEN — HIGH (Code Fix & Manual Action)
* **Description:** The `/api/lessons/:id/content?band=0` returns HTTP 200 with `content: null` because no `Adapted_Content` row exists for band 0. The frontend throws an error.
* **Fix:** Frontend modified to gracefully handle null adapted content and fallback to master narrative text. Manual action needed to run `worker/scripts/pre-generate-content.ts` against production D1.

#### 38. Glossary API returns 500
* **Status:** OPEN — MEDIUM (Code Fix)
* **Description:** The `/api/glossary` endpoint returns 500 when `params` is empty, as D1's `.bind()` throws with zero arguments.
* **Fix:** Conditional check added in `worker/src/routes/glossary.ts` to skip `.bind()` when params is empty.

#### 39. World Context API returns 500
* **Status:** OPEN — MEDIUM (Code Fix)
* **Description:** The `/api/chapters/:id/world-context` returns 500. `World_Context` table (migration 013) may not have been run or throws an error.
* **Fix:** Frontend updated to handle fetch errors gracefully and return an empty array. Migrations run via wrangler.

#### 40. No pre-generated content in D1
* **Status:** OPEN — STRATEGIC (Manual Action)
* **Description:** The `Adapted_Content` table has no rows for any band other than possibly band 5. The pre-generate script exists but hasn't been executed.
* **Fix:** User must run the pre-generation script or manually seed adapted content.

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
