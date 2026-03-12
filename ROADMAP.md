# Learn Live: African History Curriculum — Development Roadmap

> **Pivot Note (March 2026):** Learn Live is pivoting from a general-purpose math curriculum platform to a focused **African History curriculum** adapted for all ages. The core philosophy remains: *AI as Witness, not Authority — Parents hold sovereignty.* The math curriculum engine, DAG system, and constraint templates are archived (not deleted) for future reuse. The previous roadmap is preserved in `docs/archive/ROADMAP_v1.md`.

---

## Vision

**One deeply researched African History source, AI-adapted for any age — from picture books to university prep.**

Parents already committed to established curricula (Saxon, Classical Conversations, etc.) unanimously report one gap: **African History.** Learn Live fills that gap as a standalone, supplementary course families plug into whatever else they're doing.

---

## Philosophy (Unchanged)

- **Parent as Authority.** The parent chooses the band, reviews AI-generated content, and holds judgment over progression.
- **AI as Steward.** AI adapts content to reading levels, narrates interactive maps, conducts oral examinations — but never grades or advances a child without parental consent.
- **Physical-First.** AI supplements; it doesn't replace books, maps, narration, and discussion at the kitchen table.
- **Confessional Framework.** The source text is written from a 1689 Reformed Baptist perspective with YEC chronology. Conventional dates are provided transparently for reference.

---

## The Master Text

The source material is a 10-chapter, university-level African History textbook located in `docs/curriculum/history/my-first-textbook/`. This is the **single source of truth** that all band-level content is derived from.

| Chapter | Title | Period |
|---------|-------|--------|
| 1 | Creation, Babel, & the Table of Nations | Origins – c. 2250 BC |
| 2 | Ancient Egypt | c. 2100–1000 BC |
| 3 | The Kingdom of Kush & Nubia | c. 1900–300 BC |
| 4 | The Phoenicians & Carthage in Africa | c. 1100–146 BC |
| 5 | The Church in Roman Africa | 30 AD – 700 AD |
| 6 | The Kingdom of Aksum & Ethiopian Christianity | c. 100–940 AD |
| 7 | The Rise of Islam in Africa | 632–1100 AD |
| 8 | The Bantu Migrations | c. 1000 BC – 1500 AD |
| 9 | Medieval African Kingdoms (Ghana, Mali, Songhai, Zimbabwe) | c. 300–1600 AD |
| 10 | *(In progress)* | TBD |

**Supporting Assets:** 34 detailed maps in `docs/curriculum/history/Maps/`, chapter images, and `metadata.json`.

---

## Band Model (Content Adaptation, Not Skill Progression)

Unlike math, history doesn't follow a skill-repetition arc. Instead, **every band covers the same chapters** but the AI adapts delivery to the reading/comprehension level:

| Band | Ages | Label | Delivery Style |
|------|------|-------|---------------|
| 0 | 3–5 | Picture Book | AI generates simple narration + illustrated scenes. 2-3 key facts per chapter. Parents read aloud. |
| 1 | 6–8 | Story Mode | Short narrative retellings with vocabulary scaffolding. Interactive map exploration. Simple narration questions. |
| 2 | 9–11 | Explorer | Condensed chapter text with primary source excerpts. Map-based activities. Guided discussion questions. |
| 3 | 12–14 | Scholar | Near-full chapter text with critical thinking prompts. Timeline construction. Compare/contrast exercises. |
| 4 | 15–17 | Apprentice Historian | Full academic text. Primary source analysis. Essay prompts. Historiographical awareness (why sources disagree). |
| 5 | 18+ | University Prep | Master text as-is + supplementary reading lists. Research methodology. Thesis-level discussion. |

**Key Insight:** We don't write 6 versions of the textbook. The master text lives in R2. The AI reads it via RAG and adapts output dynamically per band. One source, infinite adaptations.

---

## Geography Integration

Rather than a separate geography curriculum, geographic concepts are embedded into the history timeline:

- Every map in `Maps/` is tagged with geographic metadata (climate zones, physical features, trade routes, vegetation).
- The Explainer Canvas renders these maps interactively — overlaying terrain, trade routes, migration arrows.
- Assessment includes geographic reasoning: "Why did Aksum control Red Sea trade?" requires understanding of physical geography.
- This gives parents a **two-for-one**: African History + African Geography in a single course.

---

## Repurposed AI Integrations

### 1. Explainer Canvas → Interactive Narrator & Map Explorer
The existing tool-calling architecture (`show_element`, `animate_element`, `generate_diagram`) is repurposed:
- AI narrates a chapter segment while animating trade routes, migration paths, and kingdom boundaries on the canvas.
- Band-aware: Band 0 gets slow, simple narration with big illustrations. Band 4 gets detailed analysis with primary source overlays.
- Maps from R2 are the base layer; AI overlays dynamic annotations.
- **Parent value:** A self-running lesson. Parent starts it, child watches and listens, parent reviews comprehension afterward.

### 2. Evidence Witness → Oral Examiner
The existing Gemini Live bidi-streaming agent is repurposed:
- Instead of watching a child do math, it **asks questions** about what they learned.
- Uses RAG context from the chapter to ask age-appropriate questions.
- Band 0–1: "Can you tell me who built the pyramids?" (conversational, encouraging).
- Band 3–4: "Compare Augustine's City of God with the Donatist position on church purity." (Socratic).
- Records the conversation. AI drafts an assessment. Parent reviews and judges.
- **This is the "Evidence Witness" reframed:** it witnesses the child's understanding, not their task execution.

### 3. Async Evidence → Artifact Verification
The existing photo+audio capture pipeline is repurposed:
- Child draws a map of Bantu migration routes → takes a photo → AI compares against reference maps in R2.
- Child builds a timeline on paper → photographs it → AI checks accuracy against chapter content.
- Parent reviews AI assessment before it counts.

---

## Tech Stack (Mostly Unchanged)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React, Vite, Tailwind CSS | Deployed to Cloudflare Pages |
| Data | Cloudflare D1 | Families, learners, progress, session summaries |
| Content Storage | Cloudflare R2 | Master text (markdown), maps (images), generated assets |
| AI Bridge | Google Cloud Run | Gemini Live for Explainer & Oral Examiner |
| Content Adaptation | Gemini 2.5 Flash | RAG-based band adaptation, quiz generation, assessment |
| Image Generation | Flux (via existing pipeline) | Band 0–1 picture book illustrations |

---

## Phase 1: Content Pipeline & R2 Setup — 🔲 NOT STARTED
*Focus: Clean up the history dump, structure it for RAG, upload to R2.*

- [ ] **Task 1.1:** Clean and standardize all 10 chapters — consistent markdown structure, frontmatter with metadata.
- [ ] **Task 1.2:** Process all 34 maps — convert description files to actionable metadata.
- [ ] **Task 1.3:** Design the R2 content structure and upload all content.
- [ ] **Task 1.4:** Build upload script to push content to R2 with proper content types.
- [ ] **Task 1.5:** Design and implement the RAG retrieval layer.

> **Note:** R2 content pipeline utilities already built in Phase 3B (`worker/src/lib/content/ingest.ts`, `retrieve.ts`). This phase focuses on preparing and uploading actual content.

## Phase 2: Authentication & Account System — ✅ COMPLETE
*Focus: Custom auth on Cloudflare Workers — magic links, Google OAuth, email-password.*

- [x] **Task 2.1:** D1 Auth Schema — `Users`, `Auth_Tokens`, `Sessions`, `User_Roles` tables.
- [x] **Task 2.2:** JWT session utilities & cookie helpers.
- [x] **Task 2.3:** Magic link flow — token generation, Resend email, verification, session creation.
- [x] **Task 2.4:** Google OAuth flow — redirect, callback, user upsert, session creation.
- [x] **Task 2.5:** Email + password flow — registration, email verification, login, PBKDF2 hashing.
- [x] **Task 2.6:** Password reset flow — forgot-password email, reset token validation.
- [x] **Task 2.7:** Account linking — merge by email across all 3 auth methods.
- [x] **Task 2.8:** Auth middleware & `/api/auth/me` endpoint.
- [x] **Task 2.9:** Frontend auth store — Zustand cookie-based sessions, `checkSession()`, `logout()`.
- [x] **Task 2.10:** Login/Register UI polish, route guards, loading states, toasts.

## Phase 3: Frontend & Schema Pivot — ✅ COMPLETE
*Focus: Strip math UI, build history course experience, create curriculum schema.*

- [x] **Task 3.1:** Archive math-specific components and pages to `src/archive/`.
- [x] **Task 3.2:** D1 schema for curriculum — Topics, Lessons, Sources, RAG_Chunks, Learner_Progress, Quiz_Questions.
- [x] **Task 3.3:** R2 content ingestion utilities — upload, chunk, index, retrieve.
- [x] **Task 3.4:** Course Home (Dashboard) — topic grid with era/region badges, lesson counts.
- [x] **Task 3.5:** Topic Detail page — lesson list with progress indicators and difficulty bands.
- [x] **Task 3.6:** Lesson View page — narrative, key dates sidebar, key figures, source citations, mark complete.
- [x] **Task 3.7:** Quiz components — QuizCard, QuizSession with scoring and API submission.
- [x] **Task 3.8:** Progress components — ProgressOverview with recharts, LessonProgress badge.
- [x] **Task 3.9:** API routes — topics, lessons, progress, quiz wired into worker.

## Phase 4: AI Content Adaptation Engine — ✅ COMPLETE
*Focus: The core differentiator — one source text, adapted per band via AI.*

- [x] **Task 4.1:** Build band adaptation prompt pipeline — master text chunks + band → age-appropriate content.
- [x] **Task 4.2:** Band 0 (Picture Book) — 2-3 sentence summaries + Flux illustrations.
- [x] **Task 4.3:** Band 1–2 (Story/Explorer) — condensed text, vocabulary scaffolding, discussion questions.
- [x] **Task 4.4:** Band 3–4 (Scholar/Apprentice) — critical thinking prompts, primary source analysis.
- [x] **Task 4.5:** Band 5 (University Prep) — master text from R2 + supplementary reading lists.
- [x] **Task 4.6:** Content serving API — `GET /api/lessons/:id/content?band=N` with D1 cache.
- [x] **Task 4.7:** Frontend BandSelector + AdaptedContentReader + ReadingView.
- [x] **Task 4.8:** Integration — modular router wired, data shape fixed, `/read/:lessonId` route added.

## Phase 5: Assessment & Oral Examiner — 🔲 NOT STARTED
*Focus: Repurpose Evidence Witness for history-specific oral examination.*

- [ ] **Task 5.1:** Adapt Evidence Witness agent prompt for Socratic questioning.
- [ ] **Task 5.2:** Band-aware question generation from chapter RAG context.
- [ ] **Task 5.3:** Oral Exam flow — parent initiates, child converses, AI drafts assessment.
- [ ] **Task 5.4:** Artifact Check flow — photo of drawn maps/timelines, AI comparison.
- [ ] **Task 5.5:** Parent judgment flow adapted for chapter-based progression.

## Phase 6: Explainer Canvas for History — 🔲 NOT STARTED
*Focus: Repurpose interactive whiteboard for animated history narration.*

- [ ] **Task 6.1:** History canvas elements — map overlays, timelines, trade routes, key figure cards.
- [ ] **Task 6.2:** Adapt Explainer agent prompt for historical narration.
- [ ] **Task 6.3:** Narrated Lesson flow — band-aware pacing and vocabulary.
- [ ] **Task 6.4:** Wire map assets from R2 into canvas as base layers.

## Phase 7: Worker & Schema Updates — 🔲 PARTIALLY DONE
*Focus: Adapt backend for chapter-based progression.*

- [x] **Task 7.1:** D1 schema for curriculum (done in Phase 3).
- [x] **Task 7.2:** Chapter/lesson progress API (done in Phase 3).
- [ ] **Task 7.3:** Content serving API — `GET /api/chapter/:id/content?band=2` with cached adapted content.
- [ ] **Task 7.4:** Weekly plan engine adaptation (optional).

## Phase 8: Pilot with Families — 🔲 NOT STARTED
*Focus: Ship to families.*

- [ ] **Task 8.1:** Onboard 5–10 pilot families.
- [ ] **Task 8.2:** Measure engagement and completion rates.
- [ ] **Task 8.3:** Calibrate band adaptation quality.
- [ ] **Task 8.4:** Collect feedback on Explainer Canvas.
- [ ] **Task 8.5:** Identify content gaps.

## Phase 9: Content Expansion — 🔲 NOT STARTED
*Focus: Complete textbook and expand coverage.*

- [ ] **Task 9.1:** Complete Chapter 10+.
- [ ] **Task 9.2:** World history context sidebars.
- [ ] **Task 9.3:** Expand map library.
- [ ] **Task 9.4:** Glossary and index system.

---

## Archived (For Future Reactivation)

| System | Location | Reactivation Path |
|--------|----------|-------------------|
| Math Curriculum Spine (377 templates, 5 strands) | `worker/src/lib/`, `db/` | Load JSON seeds, re-enable math strand |
| DAG Dependency Resolver | `worker/src/lib/dag.ts` | Applicable if history adds prerequisites |
| Repetition Arc Engine | `worker/src/lib/arc.ts` | Applicable for skill-based subjects |
| Split Judgment Model | `worker/src/lib/splitJudgment.ts` | Applicable for multi-dimension assessment |
| AI Permission Rules | `worker/src/lib/aiPermissions.ts` | Applicable for gradual child autonomy |
| Noise Injection / Endurance Tasks | `worker/src/lib/taskGen.ts` | Math-specific |
| Child Portal Access Levels | `src/archive/pages/ChildPortal.tsx` | Re-enable for child-led exploration |
| Legacy Learner Components (10) | `src/archive/` | Various math/science primitives |
| Legacy Parent Components (9) | `src/archive/` | Judgment, quiz, revision modals |

---

## Cross-Cutting Concerns (Unchanged)

- **CC.1: Mobile-First.** Every component tested at 360px and 768px.
- **CC.2: Low-Bandwidth Resilience.** Cache adapted content aggressively.
- **CC.3: Parental Sovereignty.** No progression without parent approval.
- **CC.4: Offline-Safe Content.** Adapted text cached in D1 for offline reading.
- **CC.5: Confessional Integrity.** AI may not contradict the master text's theological framework.

---

## Current Blockers

| # | Issue | Status | Fix |
|---|-------|--------|-----|
| 7 | `package-lock.json` out of sync | BLOCKER | Run `npm install` locally, commit lockfile |
| 8 | D1 migration `003_history_curriculum.sql` | PENDING | `npx wrangler d1 execute learnlive-db-prod --file=worker/db/migrations/003_history_curriculum.sql` |
| 14 | ~1300 lines legacy math routes in worker | LOW | Cleanup deferred — not blocking |
