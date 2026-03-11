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

## Phase 1: Content Pipeline & R2 Setup
*Focus: Clean up the history dump, structure it for RAG, upload to R2.*

- [ ] **Task 1.1:** Clean and standardize all 10 chapters — consistent markdown structure, frontmatter with metadata (period, regions, key figures, geographic concepts).
- [ ] **Task 1.2:** Process all 34 maps — convert map description files to actionable metadata (regions covered, geographic concepts, related chapters). Ensure all referenced images exist.
- [ ] **Task 1.3:** Design the R2 content structure: `curriculum/history/chapters/{ch}/master.md`, `curriculum/history/chapters/{ch}/images/*`, `curriculum/history/maps/{map_id}.md`, `curriculum/history/maps/{map_id}.png`.
- [ ] **Task 1.4:** Build an upload script to push all content to R2 with proper content types and metadata.
- [ ] **Task 1.5:** Design and implement the RAG retrieval layer — given a chapter + band, fetch the master text and return relevant chunks for AI adaptation.

## Phase 2: Authentication & Account System
*Focus: Custom auth on Cloudflare Workers — magic links, Google OAuth, email-password. No third-party auth providers.*

**External Setup (Complete):**
- Resend account configured — secret stored as `resend-api` in Worker (note: hyphen requires `env['resend-api']` bracket notation in code)
- Google OAuth app configured — secrets stored as `Google_Client_ID` and `Google_Client_Secret` in Worker
- `JWT_SECRET` in Worker for signing session tokens

**D1 Schema:**
- `Users` — `id`, `email`, `name`, `password_hash` (nullable, null for OAuth-only users), `created_at`
- `Auth_Tokens` — `id`, `user_id`, `token`, `type` (magic_link | email_verify | password_reset), `expires_at`, `used_at`
- `Sessions` — `id`, `user_id`, `token_hash`, `expires_at` (optional — JWT cookies are stateless, but enables revocation)
- `Families` — links users to families (existing table, adapted)
- `User_Roles` — `user_id`, `role` (parent | learner) — separate table per security best practice

**Auth Methods (all three supported):**
1. **Magic Links** — User enters email → Worker generates signed token, stores in `Auth_Tokens`, sends via Resend (`env['resend-api']`) → User clicks link → Worker validates, sets HttpOnly session cookie
2. **Google OAuth** — `/api/auth/google` redirects to Google (`env.Google_Client_ID`) → callback exchanges code using `env.Google_Client_Secret` → creates/finds user → sets session cookie
3. **Email + Password** — User signs up with email + password → Worker hashes password (bcrypt/scrypt via Web Crypto), stores in `Users`, sends verification email via Resend → Login validates password, sets session cookie

**Worker Endpoints:**
- `POST /api/auth/magic-link` — send magic link email
- `GET /api/auth/magic-link/verify?token=` — validate token, set cookie
- `GET /api/auth/google` — initiate OAuth redirect
- `GET /api/auth/google/callback` — handle OAuth callback
- `POST /api/auth/register` — email + password signup
- `POST /api/auth/login` — email + password login
- `POST /api/auth/forgot-password` — send password reset email
- `POST /api/auth/reset-password` — validate token + set new password
- `GET /api/auth/me` — return current user from session cookie
- `POST /api/auth/logout` — clear session cookie

**Account Syncing / Linking:**
- Users are identified by email. If a user signs up with magic link, then later uses Google OAuth with the same email, the accounts merge (same `Users` row).
- If a magic-link-only user later sets a password, `password_hash` is populated — they can now use either method.
- Google OAuth users can add a password via a "Set Password" flow.
- All three auth methods resolve to the same session cookie format.

**Tasks:**
- [ ] **Task 2.1:** Design and migrate D1 schema — `Users`, `Auth_Tokens`, `Sessions`, `User_Roles` tables.
- [ ] **Task 2.2:** Build JWT session utilities — sign/verify with `JWT_SECRET`, cookie helpers (HttpOnly, Secure, SameSite=Lax).
- [ ] **Task 2.3:** Build magic link flow — token generation, Resend email sending (via `env['resend-api']`), verification endpoint, session creation.
- [ ] **Task 2.4:** Build Google OAuth flow — redirect, callback, user upsert by email, session creation. Uses `env.Google_Client_ID` and `env.Google_Client_Secret`.
- [ ] **Task 2.5:** Build email + password flow — registration with email verification, login, password hashing via Web Crypto API.
- [ ] **Task 2.6:** Build password reset flow — forgot-password email via Resend, reset-password token validation.
- [ ] **Task 2.7:** Build account linking logic — merge by email across auth methods, allow adding password to OAuth-only accounts.
- [ ] **Task 2.8:** Build `/api/auth/me` and session middleware — protect all other API routes.
- [ ] **Task 2.9:** Update frontend auth store — replace client-side-only `useAuthStore` with cookie-based session that calls `/api/auth/me`.
- [ ] **Task 2.10:** Build login/register UI — magic link form, Google sign-in button, email+password form, password reset pages.

---

## Phase 3: Frontend Pivot
*Focus: Strip the math-specific UI, build the history course experience.*

- [ ] **Task 2.1:** Archive math-specific components and pages (move to `src/archive/`). Keep shared infrastructure (auth, family management, state, design system).
- [ ] **Task 2.2:** Build the **Course Home** page — chapter list with progress indicators, band selector, family context.
- [ ] **Task 2.3:** Build the **Chapter View** — displays AI-adapted content for the selected band. Includes embedded maps, "Think It Through" prompts, and vocabulary highlights.
- [ ] **Task 2.4:** Build the **Map Explorer** component — interactive map viewer that overlays geographic annotations. Reuses Explainer Canvas architecture.
- [ ] **Task 2.5:** Build the **Band Selector** — parent chooses the reading level. Stored per-learner in D1. Can be changed anytime.

## Phase 3: AI Content Adaptation Engine
*Focus: The core differentiator — one source text, adapted per band via AI.*

- [ ] **Task 3.1:** Build the **band adaptation prompt pipeline** — given master text chunks + band level, generate age-appropriate content. Cache aggressively in D1 (like existing `Enriched_Task_Cache`).
- [ ] **Task 3.2:** Band 0 (Picture Book) — AI generates 2-3 sentence summaries per chapter section + image generation prompts. Flux generates illustrations. Cache results.
- [ ] **Task 3.3:** Band 1–2 (Story/Explorer) — AI condenses and simplifies text, adds vocabulary scaffolding, generates discussion questions.
- [ ] **Task 3.4:** Band 3–4 (Scholar/Apprentice) — AI preserves most of the master text, adds critical thinking prompts, primary source analysis guides, and essay topics.
- [ ] **Task 3.5:** Band 5 (University Prep) — Master text served directly from R2 with supplementary reading lists and research prompts.

## Phase 4: Assessment & Oral Examiner
*Focus: Repurpose the Evidence Witness for history-specific oral examination.*

- [ ] **Task 4.1:** Adapt the Evidence Witness agent prompt — from math constraint enforcement to Socratic questioning based on chapter RAG context.
- [ ] **Task 4.2:** Build band-aware question generation — AI generates questions appropriate to the reading level from chapter content.
- [ ] **Task 4.3:** Build the **Oral Exam flow** — parent initiates, child converses with AI, session recorded, AI drafts assessment, parent reviews.
- [ ] **Task 4.4:** Build the **Artifact Check flow** — child photographs drawn maps/timelines, AI compares against reference material from R2.
- [ ] **Task 4.5:** Adapt the parent judgment flow — parent reviews AI assessment, approves or requests revision. Progression is chapter-based, not capacity-based.

## Phase 5: Explainer Canvas for History
*Focus: Repurpose the interactive whiteboard for animated history narration.*

- [ ] **Task 5.1:** Build history-specific canvas elements — map overlays, timeline bars, kingdom boundaries, trade route animations, portrait cards for key figures.
- [ ] **Task 5.2:** Adapt the Explainer agent prompt — from math counting blocks to historical narration with map manipulation.
- [ ] **Task 5.3:** Build the **Narrated Lesson flow** — parent taps "Start Lesson" on a chapter section, AI narrates while animating the canvas. Band-aware pacing and vocabulary.
- [ ] **Task 5.4:** Wire map assets from R2 into the canvas as base layers.

## Phase 6: Worker & Schema Updates
*Focus: Adapt the backend for chapter-based progression instead of capacity-based.*

- [ ] **Task 6.1:** Design new D1 schema: `Chapters`, `Learner_Chapter_Progress`, `Band_Adapted_Content_Cache`, `Oral_Exam_Sessions`. Migrate from capacity-based tables.
- [ ] **Task 6.2:** Build chapter progression API — track per-learner: which chapters completed, which band, oral exam results, parent judgments.
- [ ] **Task 6.3:** Build content serving API — `GET /api/chapter/:id/content?band=2` returns cached adapted content or triggers generation.
- [ ] **Task 6.4:** Adapt the weekly plan engine (optional) — instead of daily math tasks, suggest a weekly chapter reading pace based on the family's chosen schedule.

## Phase 7: Pilot with Families
*Focus: Ship to the families who asked for this.*

- [ ] **Task 7.1:** Onboard 5–10 pilot families. Parent creates account, selects band per child, begins Chapter 1.
- [ ] **Task 7.2:** Measure: time per chapter, engagement with maps, oral exam completion rate, parent satisfaction.
- [ ] **Task 7.3:** Calibrate band adaptation quality — is Band 0 actually suitable for a 4-year-old? Is Band 4 challenging enough for a 16-year-old?
- [ ] **Task 7.4:** Collect feedback on the Explainer Canvas narration — is it helpful or distracting?
- [ ] **Task 7.5:** Identify content gaps — which chapters need more maps, more primary sources, more illustrations?

## Phase 8: Content Expansion
*Focus: Complete the textbook and expand geographic coverage.*

- [ ] **Task 8.1:** Complete Chapter 10 and beyond — East African city-states, Great Zimbabwe, pre-colonial Southern Africa.
- [ ] **Task 8.2:** Add world history context sidebars — "While Aksum was trading with Rome, what was happening in China?" These are short, AI-generatable inserts that place Africa in global context without requiring a full world history curriculum.
- [ ] **Task 8.3:** Expand the map library — commission or generate maps for chapters currently lacking visual assets.
- [ ] **Task 8.4:** Build a glossary and index system — searchable, cross-referenced, band-aware definitions.

---

## Archived (For Future Reactivation)

The following systems are built, tested, and preserved in the codebase but not active in the history curriculum:

| System | Location | Reactivation Path |
|--------|----------|-------------------|
| Math Curriculum Spine (377 templates, 5 strands) | `worker/src/lib/`, `db/` | Load JSON seeds, re-enable math strand in curriculum selector |
| DAG Dependency Resolver | `worker/src/lib/dag.ts` | Applicable if history adds prerequisite chapters |
| Repetition Arc Engine | `worker/src/lib/arc.ts` | Applicable for skill-based subjects (math, language) |
| Split Judgment Model | `worker/src/lib/splitJudgment.ts` | Applicable when AI and parent assess different dimensions |
| AI Permission Rules | `worker/src/lib/aiPermissions.ts` | Applicable for gradual child autonomy |
| Noise Injection / Endurance Tasks | `worker/src/lib/taskGen.ts` | Math-specific, not applicable to history |
| Child Portal Access Levels | `src/pages/learner/ChildPortal.tsx` | Re-enable when child-led history exploration is desired |

---

## Cross-Cutting Concerns (Unchanged)

- **CC.1: Mobile-First.** Every component tested at 360px and 768px. Families share a single device.
- **CC.2: Low-Bandwidth Resilience.** Cache adapted content aggressively. Only the Oral Examiner and Explainer Canvas need live connections.
- **CC.3: Cultural Authenticity.** Ugandan names, East African contexts, local references in AI-generated content.
- **CC.4: Cost Control.** RAG + caching means most content is served from D1/R2, not generated per-request. Live AI sessions are optional/premium.
- **CC.5: Accessibility.** ARIA labels, keyboard navigation, screen reader support for all new components.
- **CC.6: Offline-First Content.** Adapted chapter text should be cacheable for offline reading. Only AI interactions require connectivity.
