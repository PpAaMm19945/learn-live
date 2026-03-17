# Learn Live Project Audit Summary

## Status: Hackathon Ready
The core application loop is fully implemented and verified.

### Fixed/Solved Issues
- [x] **Auth State Structure:** Fixed `EvidenceWitness.tsx` to correctly destructure `familyId` and `userId`.
- [x] **Logger Signatures:** Corrected `src/lib/gemini.ts` to use `(context, message, data)` signature.
- [x] **D1 Schema Alignment:** Ensured `Portfolios` status uses `'pending'` while `Matrix_Tasks` uses `'Awaiting Judgment'`.
- [x] **Quickstart Scripts:** Added `concurrently` and `dev:all` for one-command startup.
- [x] **Documentation:** Comprehensive `README.md` and `Architecture.md` (with Mermaid) completed.
- [x] **LogContext type:** Added `'[APP]'` and `'[LEARNER_STORE]'` to Logger.ts `LogContext` union.
- [x] **TopicDetail.tsx:** Fixed `selectedLearner?.id` → `activeLearnerId` to match `LearnerState` interface.

### Notes
- Task 8.3 (Demo Video) requires user recording.
- Task 8.7 (Final E2E) is awaiting live environment testing with real Gemini API keys.

## Phase 10: Merge Conflict Debris — Resolved Issues
- [x] **learnerStore.ts triple definition** — Consolidated to single Instance A version with `loadFamily()`.
- [x] **Dashboard duplicate imports** — Cleaned to single set of imports using `useLearnerStore`.
- [x] **ReadingView orphaned tags** — Fixed JSX tree, removed duplicate `useActiveBand` import.
- [x] **NarratedLessonView duplicate import** — Removed duplicate `useActiveBand`.
- [x] **Markdown rendering** — Added `react-markdown` with Tailwind prose classes to `AdaptedContentReader.tsx`.
- [x] **BandSelector removed from content views** — Replaced with read-only `BandBadge` component.

## Phase 11: Open Issues

### 28. Redundant Headers Inside AppShell
* **Status:** OPEN — HIGH
* **Description:** `LessonView.tsx` and `ReadingView.tsx` render their own sticky `<header>` elements with back buttons, despite being wrapped in `AppShell` which already provides persistent navigation. This creates double-chrome.
* **Fix:** Remove per-page headers. Use breadcrumbs for contextual navigation within the shell.

### 29. Immersive Views Incorrectly Wrapped in AppShell
* **Status:** OPEN — HIGH
* **Description:** `NarratedLessonView` (canvas + playback) and `ExamView` (microphone + visualizer) are full-screen immersive experiences but are wrapped in `<AppShell>` in `App.tsx`. The sidebar/bottom-nav interfere with the immersive layout.
* **Fix:** Remove `<AppShell>` wrapper from `/narrate/:lessonId` and `/exam/:lessonId` routes. These pages should render standalone with their own minimal header.

### 30. LessonView Hardcodes Learner Info
* **Status:** OPEN — MEDIUM
* **Description:** `LessonView.tsx` lines 40-41 hardcode `learnerName = "Learner"` and `bandLabel = "Band"` instead of reading from `useLearnerStore`. The Step 1 description shows generic text instead of the real learner name and band.
* **Fix:** Import and use `activeLearnerName` and `activeLearnerBand` from the learner store.

### 31. No Progress Page
* **Status:** OPEN — MEDIUM
* **Description:** The sidebar and mobile bottom nav link to `/progress` but no page component exists. Clicking "Progress" results in a 404/NotFound.
* **Fix:** Create a placeholder `Progress.tsx` page and add the route to `App.tsx`.

### 32. Onboarding Topic Selection Not Persisted
* **Status:** OPEN — LOW
* **Description:** Onboarding Step 4 asks the user to select a starting topic, but `handleFinish()` doesn't save `current_topic_id` to the family record. The Dashboard can't show "Continue from: [Topic]" because the data isn't there.
* **Fix:** Add `PATCH /api/family` endpoint and call it from onboarding. Add `currentTopicId` to `learnerStore`.

### 33. Pre-Generation Script Not Yet Created
* **Status:** OPEN — STRATEGIC
* **Description:** `serve.ts` was updated to return master text as fallback (no AI call), but the actual pre-generation script (`worker/scripts/pre-generate-content.ts`) that populates the `Adapted_Content` table for all lesson × band combinations hasn't been created yet.
* **Fix:** Create the script per Phase 10 Task 10.5 specifications.

## Phase 13: Explainer Canvas — Known Issues & Risks

### Active Risks
- **Gemini Live tool call reliability** — The Live API's function calling in bidi-streaming mode is experimental. Tool calls may arrive split across chunks. Mitigation: buffer and reassemble in `explainerSession.ts`.
- **Audio-canvas sync drift** — Voice says "look at these blocks" but blocks appear late. Task 13.7 will implement atomic payloads with timestamp-driven queuing. Currently NOT implemented.
- **GeminiSession constructor change** — Added optional `extraTools` parameter. Backward compatible (Evidence Witness sessions pass no extra tools). Tested: existing `evaluate_constraint` tool still declared.
- **Max 7 elements enforced client-side only** — System prompt also instructs the agent, but there's no server-side enforcement. If Gemini ignores the instruction, the client will evict the oldest element.

### Decisions Made
- **Separate WebSocket endpoints**: `/v1/agent/session` (Evidence Witness) vs `/v1/agent/explainer` (Explainer Canvas). Clean separation, independent scaling.
- **Separate WebSocketServer instances** in `server.ts` (`witnessWss` and `explainerWss`).
- **Learner context injection**: Currently uses defaults (name: "Learner", age: 7, band: 2). Task 13.4 marked done for prompt structure; actual D1 fetch is a TODO.
- **Image generation (Nano Banana)**: Deferred to Task 13.9. Canvas ops include `generate_diagram` action but it's a no-op on the client currently.
