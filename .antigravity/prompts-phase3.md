# Phase 3 Parallel Jules Prompts
# These prompts can be run simultaneously — zero file overlap

---

### 📋 INSTANCE A: New D1 Schema for African History Curriculum

**Objective:** Design and create the database migration for the new African History RAG-based curriculum.

**READ FIRST:**
- `.antigravity/issues.md` (for current DB state — wiped clean)
- `worker/db/migrations/002_auth_tables.sql` (for existing auth tables pattern)
- `worker/src/index.ts` (for `Env` interface)

**Instructions:**
1. **Create** `worker/db/migrations/003_history_curriculum.sql`:
   - `Topics` — id, title, era, region, summary, display_order, parent_topic_id (self-referencing for sub-topics)
   - `Lessons` — id, topic_id (FK), title, narrative_text, key_dates, key_figures, difficulty_band (1-5), estimated_minutes
   - `Sources` — id, lesson_id (FK), title, author, type (primary/secondary/oral), url, r2_key, excerpt
   - `RAG_Chunks` — id, source_id (FK), chunk_text, chunk_index, embedding_key (for future vector search)
   - `Learner_Progress` — id, user_id (FK to Users), lesson_id (FK), status (not_started/in_progress/completed), score, started_at, completed_at
   - `Quiz_Questions` — id, lesson_id (FK), question_text, correct_answer, distractors (JSON), explanation, difficulty_band

2. **Add RLS-style comments** to each table noting access patterns (who reads/writes).

3. **DO NOT** modify `worker/src/index.ts` — routes will be added in a later integration step.

4. **Create** `.antigravity/notes/P3A_history_schema.md` (5-line summary of tables and design decisions).

**WHEN DONE:** List files created. STOP.

---

### 📋 INSTANCE B: R2 Content Ingestion Utilities

**Objective:** Build utility functions for uploading and indexing African History content in R2 + D1.

**READ FIRST:**
- `worker/src/lib/r2.ts` (existing R2 helper pattern)
- `worker/src/index.ts` (for `Env` interface)

**Instructions:**
1. **Create** `worker/src/lib/content/ingest.ts`:
   - `uploadSourceDocument(env, file, metadata): Promise<{r2Key, sourceId}>` — uploads to R2 under `content/sources/`, creates Source record in D1
   - `chunkText(text, maxChunkSize=500): string[]` — splits text into overlapping chunks for RAG
   - `indexChunks(env, sourceId, chunks): Promise<void>` — inserts RAG_Chunks into D1
   - `ingestDocument(env, file, lessonId, metadata): Promise<void>` — orchestrates upload → chunk → index

2. **Create** `worker/src/lib/content/retrieve.ts`:
   - `searchChunks(env, query, limit=5): Promise<RAGChunk[]>` — basic keyword search across RAG_Chunks (full-text LIKE query; vector search is a later upgrade)
   - `getSourceContext(env, chunkIds): Promise<Source[]>` — fetches full source records for citation
   - `buildRAGContext(env, query): Promise<string>` — combines search + source fetch into a formatted context string for LLM prompts

3. **DO NOT** modify `worker/src/index.ts` or any existing files.

4. **Create** `.antigravity/notes/P3B_content_pipeline.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

### 📋 INSTANCE C: Parent Dashboard & Content Explorer UI

**Objective:** Build the new parent dashboard shell and topic/lesson browsing UI for the African History curriculum.

**READ FIRST:**
- `src/pages/parent/Dashboard.tsx` (current placeholder)
- `src/lib/auth.ts` (auth store shape)
- `src/components/ProtectedRoute.tsx`
- `src/index.css` and `tailwind.config.ts` (for design tokens)

**Instructions:**
1. **Replace** `src/pages/parent/Dashboard.tsx` with a real dashboard:
   - Header: app name, user greeting (name from auth store), logout button
   - Main content: grid of Topic cards fetched from `GET /api/topics` (use react-query, show loading state)
   - Each topic card: title, era badge, region badge, lesson count, click navigates to `/topics/:topicId`
   - Empty state: "No topics available yet. Content is being prepared."
   - All fetch calls use `credentials: 'include'` and `VITE_WORKER_URL`

2. **Create** `src/pages/TopicDetail.tsx`:
   - Fetches topic + lessons from `GET /api/topics/:id`
   - Lists lessons as cards: title, difficulty band badge, estimated time, status (not started/in progress/completed)
   - Click navigates to `/lessons/:lessonId`

3. **Create** `src/pages/LessonView.tsx`:
   - Fetches lesson from `GET /api/lessons/:id`
   - Renders: title, narrative text (prose), key dates sidebar, key figures, source citations at bottom
   - "Ask a Question" button (placeholder — will connect to AI Q&A later)
   - "Mark Complete" button → POST `/api/progress` (credentials: 'include')

4. **Update** `src/App.tsx` to add routes:
   - `/topics/:topicId` → TopicDetail (protected)
   - `/lessons/:lessonId` → LessonView (protected)

5. **Use semantic design tokens only** — no hardcoded colors.

6. **Create** `.antigravity/notes/P3C_frontend_ui.md` (5-line summary).

**WHEN DONE:** List files created/modified. STOP.

---

### 📋 INSTANCE D: Quiz & Progress System

**Objective:** Build quiz UI components and learner progress tracking.

**READ FIRST:**
- `src/lib/auth.ts` (for userId)
- `src/index.css` and `tailwind.config.ts` (for design tokens)

**Instructions:**
1. **Create** `src/components/quiz/QuizCard.tsx`:
   - Displays a single quiz question with 4 multiple-choice options
   - Shows correct/incorrect feedback after selection with explanation
   - Tracks score locally

2. **Create** `src/components/quiz/QuizSession.tsx`:
   - Takes an array of quiz questions
   - Cycles through them one at a time
   - Shows progress bar (question X of Y)
   - At end: shows score summary, "Try Again" or "Continue" buttons
   - On completion: POST `/api/quiz/complete` with score (credentials: 'include')

3. **Create** `src/components/progress/ProgressOverview.tsx`:
   - Fetches learner progress from `GET /api/progress` (credentials: 'include')
   - Displays: total lessons completed, topics in progress, quiz scores
   - Uses recharts for a simple bar chart of scores by topic

4. **Create** `src/components/progress/LessonProgress.tsx`:
   - Small badge/indicator component showing lesson completion status
   - Used inside lesson cards on TopicDetail page

5. **DO NOT** modify `src/App.tsx` or any existing pages — these are standalone components.

6. **Use semantic design tokens only**.

7. **Create** `.antigravity/notes/P3D_quiz_progress.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

## After All 4 Instances Complete — Integration Step

One more prompt will:
1. Wire API routes for topics, lessons, progress, and quiz into `worker/src/index.ts`
2. Apply `003_history_curriculum.sql` migration to D1
3. Connect frontend pages to real API endpoints
4. Run build verification
5. Update all documentation files

---

## Files Each Instance Touches (No Overlap)

| Instance | Creates | Modifies |
|----------|---------|----------|
| A | `worker/db/migrations/003_history_curriculum.sql`, `.antigravity/notes/P3A_*` | Nothing |
| B | `worker/src/lib/content/ingest.ts`, `worker/src/lib/content/retrieve.ts`, `.antigravity/notes/P3B_*` | Nothing |
| C | `src/pages/TopicDetail.tsx`, `src/pages/LessonView.tsx`, `.antigravity/notes/P3C_*` | `src/pages/parent/Dashboard.tsx`, `src/App.tsx` |
| D | `src/components/quiz/*`, `src/components/progress/*`, `.antigravity/notes/P3D_*` | Nothing |
