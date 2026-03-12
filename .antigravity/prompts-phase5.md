# Phase 5: Assessment & Oral Examiner — Parallel Prompts

> **Goal:** Repurpose the Evidence Witness bidi-streaming agent for history-specific oral examination and artifact verification. 4 parallel Jules instances.

---

## Instance A — Oral Examiner Agent Prompt & RAG Integration

**Task:** Adapt the Evidence Witness Gemini Live agent for Socratic questioning on history content.

**Context files to read first:**
- `ROADMAP.md` (Phase 5 tasks, Band Model section, "Evidence Witness → Oral Examiner" section)
- `worker/src/lib/content/retrieve.ts` (RAG retrieval layer)
- `worker/src/archive/` (original Evidence Witness agent — reference for bidi-streaming pattern)

**Deliverables:**
1. `worker/src/lib/examiner/agent.ts` — Gemini Live agent prompt builder that:
   - Takes a `lessonId`, `band`, and `userId`
   - Retrieves RAG context for the lesson via `retrieve.ts`
   - Builds a band-aware system prompt:
     - Band 0–1: Conversational, encouraging. "Can you tell me about...?" Simple recall.
     - Band 2–3: Guided discussion. "Why do you think...?" Compare/contrast.
     - Band 4–5: Socratic. "How does Augustine's argument compare to...?" Thesis-level.
   - Returns the system instruction string and RAG context for the bidi session
2. `worker/src/lib/examiner/types.ts` — TypeScript interfaces for exam session, question, assessment draft

**Constraints:**
- Reuse the existing Gemini Live bidi-streaming infrastructure from the archived Evidence Witness
- Do NOT create new WebSocket infrastructure — adapt the existing pattern
- The agent witnesses understanding, not task execution

---

## Instance B — Exam Session API Routes

**Task:** Build the API routes for starting, managing, and completing oral exam sessions.

**Context files to read first:**
- `ROADMAP.md` (Phase 5 tasks)
- `worker/src/index.ts` (existing route patterns, `Env` interface)
- `worker/src/routes/index.ts` (modular router pattern — add new routes here)
- `worker/src/lib/auth/middleware.ts` (`requireAuth`)

**Deliverables:**
1. `worker/db/migrations/005_exam_sessions.sql` — D1 schema:
   - `Exam_Sessions` table: id, user_id, lesson_id, band, status (pending/active/completed/reviewed), started_at, completed_at, ai_assessment_draft (TEXT/JSON), parent_review (TEXT/JSON), parent_approved (BOOLEAN)
   - `Exam_Recordings` table: id, session_id, r2_key, duration_seconds, created_at
2. `worker/src/routes/examiner.ts` — Route handlers:
   - `POST /api/exams/start` — create session, return session ID + agent config
   - `GET /api/exams/:sessionId` — get session details + assessment
   - `POST /api/exams/:sessionId/complete` — mark session complete, trigger AI assessment draft
   - `POST /api/exams/:sessionId/review` — parent submits review/approval
   - `GET /api/exams?lesson_id=X` — list exam sessions for a lesson
3. Wire routes into `worker/src/routes/index.ts`

**Constraints:**
- All routes require auth via `requireAuth`
- Parent review/approval is mandatory before exam "counts" (CC.3: Parental Sovereignty)
- AI assessment is a draft — parent has final judgment

---

## Instance C — Frontend Exam UI Components

**Task:** Build the React components for the oral exam experience.

**Context files to read first:**
- `ROADMAP.md` (Phase 5 tasks, Band Model)
- `src/pages/LessonView.tsx` (where exam button will be added)
- `src/components/content/BandSelector.tsx` (band-aware UI pattern reference)
- `src/lib/auth.ts` (auth store, user roles)

**Deliverables:**
1. `src/pages/ExamView.tsx` — Full exam page:
   - Header with lesson title, band indicator, session timer
   - Audio visualization (reuse/adapt from archived Evidence Witness if applicable)
   - Start/Stop exam controls
   - Post-exam: display AI assessment draft
   - Navigation back to lesson
2. `src/components/exam/ExamCard.tsx` — Card showing exam session status on lesson page (pending, completed, reviewed)
3. `src/components/exam/ParentReviewModal.tsx` — Modal for parent to review AI assessment draft:
   - Shows AI's assessment text
   - Approve / Request Redo / Add Notes
   - Submit review via API
4. Add exam route to routing suggestions (document where `/exam/:lessonId` should go in App.tsx)

**Constraints:**
- Use existing shadcn/ui components (Card, Button, Dialog, Badge)
- Use semantic design tokens from the design system, no hardcoded colors
- Mobile-first (CC.1), test at 360px mentally
- Band-aware UI: simpler interface for Band 0–1 exams

---

## Instance D — Artifact Verification System

**Task:** Build the photo-based artifact checking pipeline for drawn maps, timelines, etc.

**Context files to read first:**
- `ROADMAP.md` (Phase 5 Task 5.4, "Async Evidence → Artifact Verification" section)
- `worker/src/lib/r2.ts` (R2 helper for file storage)
- `worker/src/lib/content/retrieve.ts` (RAG retrieval for reference comparison)

**Deliverables:**
1. `worker/src/lib/examiner/artifact.ts` — Artifact verification logic:
   - Accept uploaded image (R2 key) + lessonId + band
   - Retrieve reference content (maps, timelines) from RAG context
   - Build Gemini prompt to compare student artifact against reference
   - Return structured assessment: accuracy score, feedback, areas to improve
2. `worker/src/routes/artifacts.ts` — API routes:
   - `POST /api/artifacts/upload` — upload photo to R2, return r2_key
   - `POST /api/artifacts/verify` — trigger AI comparison, return assessment draft
   - `GET /api/artifacts?lesson_id=X` — list artifacts for a lesson
3. `src/components/exam/ArtifactUpload.tsx` — Frontend component:
   - Camera/file upload button
   - Preview of uploaded image
   - "Check My Work" button to trigger verification
   - Display AI feedback with parent review option
4. Wire artifact routes into `worker/src/routes/index.ts`

**Constraints:**
- Photos stored in R2 `evidence-vault` bucket (existing)
- AI assessment is always a draft — parent reviews before it counts
- Support common image formats (JPEG, PNG, HEIC)

---

## After All 4 Instances Complete — Integration Step

One more prompt will:
1. Wire exam + artifact routes into `worker/src/routes/index.ts` (if not already done by instances)
2. Apply `005_exam_sessions.sql` migration to D1
3. Add `/exam/:lessonId` route to `src/App.tsx` (protected)
4. Add "Start Oral Exam" button to `LessonView.tsx`
5. Connect Gemini bidi-streaming imports in agent handlers
6. Build verification
7. Update `ROADMAP.md`, `issues.md`, `.antigravity/prompts.md`
