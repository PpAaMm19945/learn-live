# Phase 4 Parallel Jules Prompts
# These prompts can be run simultaneously — zero file overlap

---

### 📋 INSTANCE A: Content Preparation & R2 Upload Scripts

**Objective:** Clean, standardize, and build tooling to upload all 10 master text chapters + 34 maps to R2 with proper metadata.

**READ FIRST:**
- `docs/curriculum/history/my-first-textbook/metadata.json` (chapter list)
- `docs/curriculum/history/my-first-textbook/chapter_01/chapters/Chapter_01_FINAL_UPGRADED.md` (chapter format sample)
- `worker/src/lib/r2.ts` (R2 helper)
- `worker/src/lib/content/ingest.ts` (existing ingest utilities)
- `worker/db/migrations/003_history_curriculum.sql` (schema for Topics, Lessons, Sources, RAG_Chunks)

**Instructions:**
1. **Create** `scripts/prepare-content.ts`:
   - Reads all 10 chapters from `docs/curriculum/history/my-first-textbook/chapter_*/chapters/*.md`
   - Parses each chapter into sections (split on `## ` headings)
   - Extracts frontmatter: title, key terms, scripture thread, chapter summary, section headings
   - Outputs a normalized JSON manifest: `scripts/output/content-manifest.json` with structure:
     ```
     { chapters: [{ id, title, era, region, sections: [{ heading, text, keyDates, keyFigures, thinkItThrough }] }] }
     ```
   - Era and region should be inferred from chapter content (e.g., Chapter 1 = "Origins – c. 2242 BC", "Pan-African")

2. **Create** `scripts/seed-curriculum.ts`:
   - Reads `content-manifest.json`
   - Generates SQL INSERT statements for:
     - `Topics` — one per chapter (id = `topic_ch01` etc., display_order = chapter number)
     - `Lessons` — one per section within each chapter (id = `lesson_ch01_s01` etc.)
   - Populates `narrative_text` with the section text, `key_dates` and `key_figures` as JSON strings
   - Sets `difficulty_band = 5` (master text is university level; adaptation happens at serving time)
   - Estimates `estimated_minutes` based on word count (~200 words/min)
   - Outputs `scripts/output/seed_curriculum.sql`

3. **Create** `scripts/upload-to-r2.ts`:
   - Reads each chapter markdown file
   - Uses `chunkText()` from `worker/src/lib/content/ingest.ts` (import the function directly)
   - Generates SQL INSERT statements for `Sources` (one per chapter, type='primary') and `RAG_Chunks` (one per chunk)
   - Outputs `scripts/output/seed_rag_chunks.sql`
   - Also outputs a report: total chunks, average chunk size, chapters processed

4. **Create** `scripts/upload-maps.ts`:
   - Reads all 34 map description files from `docs/curriculum/history/Maps/*.md`
   - Parses each map's metadata (title, geographic features, time period) from the markdown
   - Generates a `scripts/output/map-manifest.json` with structured map metadata
   - Maps will be uploaded to R2 manually later; this script prepares the manifest

5. **DO NOT** modify any existing files.

6. **Create** `.antigravity/notes/P4A_content_prep.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

### 📋 INSTANCE B: Band Adaptation Prompt Engine

**Objective:** Build the AI prompt pipeline that takes master text chunks + a band level and produces age-appropriate adapted content.

**READ FIRST:**
- `ROADMAP.md` (Band Model section — ages, labels, delivery styles for Bands 0–5)
- `worker/src/lib/content/retrieve.ts` (RAG retrieval: `buildRAGContext`, `searchChunks`)
- `worker/src/lib/nanoBanana.ts` (existing Gemini API call pattern)
- `worker/src/index.ts` lines 1-50 (Env interface)

**Instructions:**
1. **Create** `worker/src/lib/content/adapt.ts`:
   - `getBandPrompt(band: number): string` — returns the system prompt for each band:
     - Band 0 (Picture Book): "Rewrite for ages 3-5. Use 2-3 simple sentences. Short words. No complex concepts. Focus on one key fact."
     - Band 1 (Story Mode): "Rewrite as a short story for ages 6-8. Simple vocabulary. Include one 'Did You Know?' fact. Max 150 words."
     - Band 2 (Explorer): "Condense for ages 9-11. Include key vocabulary with brief definitions. Add 2 discussion questions. Max 300 words."
     - Band 3 (Scholar): "Adapt for ages 12-14. Preserve most detail. Add critical thinking prompts. Include primary source excerpts where relevant. Max 500 words."
     - Band 4 (Apprentice Historian): "Present at high-school level. Full academic detail. Add historiographical context. Include essay prompt. Preserve all dates and figures."
     - Band 5 (University Prep): "Return the source text unchanged. Append supplementary reading suggestions if relevant."
   - `adaptContent(env: Env, chunkText: string, band: number, chapterContext: string): Promise<AdaptedContent>` — calls Gemini 2.5 Flash via API with band prompt + chunk + chapter context
   - `AdaptedContent` interface: `{ text: string; vocabulary?: string[]; discussionQuestions?: string[]; essayPrompt?: string; thinkingPrompts?: string[] }`
   - Uses `GEMINI_API_KEY` from env
   - Includes retry logic (1 retry on 429/500)
   - Response parsed as JSON (instruct model to return structured JSON)

2. **Create** `worker/src/lib/content/cache.ts`:
   - `getCachedAdaptation(env: Env, lessonId: string, band: number): Promise<AdaptedContent | null>` — checks D1 for cached adapted content
   - `cacheAdaptation(env: Env, lessonId: string, band: number, content: AdaptedContent): Promise<void>` — stores in D1
   - Uses a new table (migration in Instance A won't conflict — this is code-only, table created in integration step)
   - Cache key: `lesson_id + band` (unique constraint)

3. **Create** `worker/src/lib/content/serve.ts`:
   - `serveAdaptedContent(env: Env, lessonId: string, band: number): Promise<AdaptedContent>` — orchestration function:
     1. Check cache → return if hit
     2. Fetch lesson's `narrative_text` from D1
     3. Build RAG context via `buildRAGContext(env, lesson.title)`
     4. Call `adaptContent()` with chunk + band + context
     5. Cache result
     6. Return adapted content
   - If band === 5, skip AI and return raw `narrative_text` directly

4. **DO NOT** modify `worker/src/index.ts` or any existing files.

5. **Create** `.antigravity/notes/P4B_adaptation_engine.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

### 📋 INSTANCE C: Content Serving API & Migration

**Objective:** Create the API route for serving band-adapted content and the D1 migration for the adaptation cache table.

**READ FIRST:**
- `worker/db/migrations/003_history_curriculum.sql` (existing schema)
- `worker/src/index.ts` lines 1-50 (Env interface, imports)
- `worker/src/lib/auth/middleware.ts` (requireAuth pattern)

**Instructions:**
1. **Create** `worker/db/migrations/004_adaptation_cache.sql`:
   - `Adapted_Content` table:
     - `id TEXT PRIMARY KEY`
     - `lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE`
     - `band INTEGER NOT NULL CHECK (band BETWEEN 0 AND 5)`
     - `adapted_text TEXT NOT NULL`
     - `vocabulary TEXT` (JSON array)
     - `discussion_questions TEXT` (JSON array)
     - `essay_prompt TEXT`
     - `thinking_prompts TEXT` (JSON array)
     - `created_at TEXT DEFAULT (datetime('now'))`
     - `UNIQUE(lesson_id, band)`
   - Add RLS-style comments

2. **Create** `worker/src/routes/content.ts`:
   - `handleGetAdaptedContent(request: Request, env: Env, userId: string): Promise<Response>`:
     - Route: `GET /api/lessons/:lessonId/content?band=2`
     - Validates `band` param (0-5, defaults to 5)
     - Returns JSON: `{ lesson: { title, topic }, content: AdaptedContent, band }`
     - Must be auth-protected (receives userId from middleware)
   - `handleGetChapterContent(request: Request, env: Env, userId: string): Promise<Response>`:
     - Route: `GET /api/chapters/:chapterId/content?band=2`
     - Fetches all lessons for a topic, adapts each, returns array
     - Useful for reading an entire chapter at a given band

3. **Create** `worker/src/routes/index.ts`:
   - Central route registry that exports a `routeRequest(request, env)` function
   - Maps URL patterns to handlers
   - This will be the future pattern for all routes (cleaner than the 1800-line switch in index.ts)
   - For now, only registers the two content routes above
   - Documents pattern for future migration of existing routes

4. **DO NOT** modify `worker/src/index.ts` — routes will be wired in the integration step.

5. **Create** `.antigravity/notes/P4C_content_api.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

### 📋 INSTANCE D: Band Selector UI & Adapted Content Reader

**Objective:** Build the frontend components for selecting a reading band and displaying adapted content.

**READ FIRST:**
- `src/pages/LessonView.tsx` (current lesson page)
- `src/pages/TopicDetail.tsx` (topic page with lesson list)
- `src/pages/parent/Dashboard.tsx` (dashboard layout pattern)
- `src/index.css` and `tailwind.config.ts` (design tokens)
- `src/lib/auth.ts` (auth store)

**Instructions:**
1. **Create** `src/components/content/BandSelector.tsx`:
   - Displays 6 band options (0–5) as a horizontal toggle group
   - Each option shows: band number, label (Picture Book, Story Mode, Explorer, Scholar, Apprentice, University), and age range
   - Selected band is highlighted with primary color
   - Fires `onBandChange(band: number)` callback
   - Persists selected band to localStorage under `learn-live-band`
   - Responsive: horizontal scroll on mobile, grid on desktop
   - Use semantic design tokens only

2. **Create** `src/components/content/AdaptedContentReader.tsx`:
   - Takes `lessonId: string` and `band: number` as props
   - Fetches adapted content from `GET /api/lessons/:lessonId/content?band=X` (react-query, credentials: 'include')
   - Renders based on band:
     - Band 0–1: Large text, generous spacing, optional illustration placeholder
     - Band 2–3: Standard prose with vocabulary sidebar, discussion questions section
     - Band 4–5: Dense academic text with essay prompt callout
   - Shows vocabulary terms as highlighted inline tooltips
   - Discussion questions in a collapsible section
   - Loading state with skeleton
   - Error state with retry button

3. **Create** `src/components/content/VocabularyCard.tsx`:
   - Displays a vocabulary term with definition
   - Used inline in adapted content or as a sidebar list
   - Hover/click to expand definition
   - Styled with accent color tokens

4. **Create** `src/components/content/DiscussionQuestions.tsx`:
   - Collapsible section showing discussion questions
   - Each question in a numbered card
   - "Think about this..." header with icon
   - Uses Accordion from shadcn/ui

5. **Create** `src/pages/ReadingView.tsx`:
   - New page: `/read/:lessonId`
   - Combines BandSelector (sticky top) + AdaptedContentReader
   - Back button to topic
   - "Mark Complete" button at bottom (same API as LessonView)
   - Clean, distraction-free reading layout (max-w-2xl centered prose)

6. **DO NOT** modify `src/App.tsx`, `src/pages/LessonView.tsx`, or any existing files.

7. **Use semantic design tokens only** — no hardcoded colors.

8. **Create** `.antigravity/notes/P4D_reader_ui.md` (5-line summary).

**WHEN DONE:** List files created. STOP.

---

## After All 4 Instances Complete — Integration Step

One more prompt will:
1. Wire content routes into `worker/src/index.ts` (or migrate to new router pattern)
2. Apply `004_adaptation_cache.sql` migration to D1
3. Run seed scripts: `seed_curriculum.sql` → `seed_rag_chunks.sql` (user applies via wrangler)
4. Add `/read/:lessonId` route to `src/App.tsx` (protected)
5. Add "Read at my level" button to `LessonView.tsx` linking to ReadingView
6. Connect `serve.ts` imports in content route handlers
7. Build verification
8. Update `ROADMAP.md`, `issues.md`, `.antigravity/prompts.md`

---

## Files Each Instance Touches (No Overlap)

| Instance | Creates | Modifies |
|----------|---------|----------|
| A | `scripts/prepare-content.ts`, `scripts/seed-curriculum.ts`, `scripts/upload-to-r2.ts`, `scripts/upload-maps.ts`, `scripts/output/` (generated), `.antigravity/notes/P4A_*` | Nothing |
| B | `worker/src/lib/content/adapt.ts`, `worker/src/lib/content/cache.ts`, `worker/src/lib/content/serve.ts`, `.antigravity/notes/P4B_*` | Nothing |
| C | `worker/db/migrations/004_adaptation_cache.sql`, `worker/src/routes/content.ts`, `worker/src/routes/index.ts`, `.antigravity/notes/P4C_*` | Nothing |
| D | `src/components/content/BandSelector.tsx`, `src/components/content/AdaptedContentReader.tsx`, `src/components/content/VocabularyCard.tsx`, `src/components/content/DiscussionQuestions.tsx`, `src/pages/ReadingView.tsx`, `.antigravity/notes/P4D_*` | Nothing |

---

## Dependencies

- Instance B depends on Instance A only for the *data* (seed SQL), not for code. All code is independent.
- Instance C creates the migration that Instance B's cache module will use — but B writes code against the schema, C creates the schema. No conflict.
- Instance D calls the API that Instance C defines — but D just needs the URL contract, not the implementation.
- **All 4 can run in parallel.**
