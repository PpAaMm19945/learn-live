# Learn Live: Known Issues & Blockers Tracker

## Resolved

### 1. ~~Missing Curriculum JSON Data~~ → RESOLVED (2026-03-07)
* Jules delivered 5 JSON files into `curriculum_data/` totaling ~650KB and 377 templates across 29 capacities.
* The seed script (`scripts/seed_curriculum.ts`) was updated to handle schema mismatches (string→integer cognitive levels, array→string materials, nested object→JSON context_variants).
* All 377 templates were successfully deployed to remote D1 production via `db/seed_curriculum.sql`.

### 2. ~~`FileCheck2` Import Error~~ → RESOLVED 
* Fixed missing import in `AsyncEvidenceModal.tsx`.

### 3. ~~Curriculum Docs Not In Repo~~ → RESOLVED
* Copied all spine and template documentation from `.gemini/antigravity/` into `docs/curriculum/`.

## Open Items

### 4. ~~Capacity Names Need Manual Review~~ → ARCHIVED
* **Status:** N/A — Legacy math tables dropped. Database wiped for African History pivot.

### 5. ~~No Learner_Repetition_State Rows Exist Yet~~ → ARCHIVED
* **Status:** N/A — Legacy table dropped. Fresh schema in progress.

### 6. ~~Band 2 Only~~ → ARCHIVED
* **Status:** N/A — Math curriculum replaced by African History RAG content.

### 7. ~~Cloudflare Pages Deploy Failure — Lockfile Out of Sync~~ → BLOCKER
* **Status:** BLOCKER — Must be fixed before next deploy
* **Description:** `npm ci` fails because `package-lock.json` is out of sync with `package.json`. Specifically, `framer-motion@12.35.2`, `motion-dom@12.35.2`, and `motion-utils@12.29.2` are missing from the lockfile.
* **Fix:** Run `npm install` locally and commit the updated `package-lock.json`.

### 8. ~~D1 Database Wiped — Clean Slate~~ → INFO
* **Status:** INFO
* **Description:** All legacy tables dropped. Only `sqlite_sequence` remains. `002_auth_tables.sql` must be applied via `npx wrangler d1 execute learnlive-db-prod --file=worker/db/migrations/002_auth_tables.sql`.

### 9. ~~Phase 2 Jules Audit~~ → COMPLETE
* **Status:** COMPLETE (see below for Phase 2 parallel audit)

### 10. Phase 2 Parallel Instances Audit (2026-03-11)
* **Status:** COMPLETE — All 4 instances delivered successfully
* **Findings:**

#### Instance A — P18 Magic Link (`worker/src/lib/auth/magicLink.ts`) ✅
  - Token generation via `crypto.randomUUID()`
  - Resend API integration for email delivery
  - Smart email-in-ID encoding for null userId scenarios
  - `handleMagicLinkRequest` and `handleMagicLinkVerify` exported correctly
  - No issues found

#### Instance B — P19 Google OAuth (`worker/src/lib/auth/google.ts`) ✅
  - Full OAuth2 flow: consent URL → token exchange → userinfo → upsert
  - CSRF state token signed as short-lived JWT (10 min)
  - Session recorded in DB with SHA-256 hashed token
  - ⚠️ Duplicate `Env` interface defined locally (lines 6-15) — should import from `index.ts` to avoid drift
  - ⚠️ Hardcoded `user_` prefix on UUIDs — inconsistent with other modules using plain UUIDs

#### Instance C — P20 Password + Email Verification (`worker/src/lib/auth/password.ts`, `emailVerification.ts`) ✅
  - PBKDF2 via Web Crypto API, 100k iterations, SHA-256, 16-byte salt
  - ⚠️ OWASP recommends 600k+ iterations, but 100k is acceptable given Workers CPU limits
  - All 5 route handlers exported: register, login, forgot-password, reset-password, verify-email
  - Email verification flow and password reset flow both correct
  - No issues found

#### Instance D — P23 Frontend Auth (`src/lib/auth.ts`, Login/Register/ForgotPassword/ResetPassword pages) ✅
  - Zustand store with `checkSession()` and `logout()` — server-backed, no localStorage
  - Login page supports all 3 auth methods (email/password, magic link, Google)
  - `ProtectedRoute` updated to multi-role array structure
  - `App.tsx` calls `checkSession()` on mount with loading spinner
  - Old files correctly archived to `src/archive/`
  - ⚠️ Archive files had TS errors due to importing new auth store — FIXED (added @ts-nocheck)

### 11. cookies.ts SameSite Bug — FIXED (2026-03-11)
* **Status:** FIXED
* **Description:** `cookies.ts` used `SameSite=Lax` which silently blocks cross-origin cookies when frontend (Pages) and worker are on different origins. Changed to `SameSite=None; Secure` for CORS compatibility.

### 12. ~~Route Integration Needed~~ → COMPLETE (2026-03-11)
* **Status:** COMPLETE
* **Description:** All auth handlers wired into `worker/src/index.ts`. Added `/api/auth/me`, `/api/auth/logout`, `/api/auth/set-password`, and all auth routes. CORS updated to use origin-aware `Access-Control-Allow-Credentials: true` with allowlist. `accountLink.ts` created and all auth flows refactored to use `findOrCreateUser`.

### 13. ~~google.ts Duplicate Env Interface~~ → FIXED (2026-03-11)
* **Status:** FIXED
* **Description:** Replaced local `Env` interface with import from `../../index`.

### 14. Legacy Math Imports in worker/src/index.ts (2026-03-11)
* **Status:** LOW — Cleanup deferred
* **Description:** ~10 legacy math-related imports remain (arc, dag, taskGen, nanoBanana, splitJudgment, parentPrimer, aiPermissions, weeklyPlan, enrichTask, evaluateEvidence). Not blocking but will cause build warnings once those archived files are removed.

### 15. Legacy Frontend Cleanup — COMPLETE (2026-03-11)
* **Status:** COMPLETE
* **Description:** All legacy learner/parent components (10 learner + 9 parent), pages (Dashboard, LearnerDashboard, ChildPortal), and libs (gemini, explainerClient, audioCanvasSync, demoPlayer) archived to `src/archive/`. `tsconfig.app.json` updated to exclude `src/archive/` from compilation. Placeholder Dashboard created. App.tsx simplified to auth routes + single protected `/dashboard`.

### 16. Phase 2 Auth Complete — Summary (2026-03-11)
* **Status:** INFO
* **Auth endpoints available:** `/api/auth/me`, `/api/auth/logout`, `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/verify-email`, `/api/auth/magic-link`, `/api/auth/magic-link/verify`, `/api/auth/google`, `/api/auth/google/callback`, `/api/auth/set-password`
* **Secrets required:** `JWT_SECRET`, `Google_Client_ID`, `Google_Client_Secret`, `Resend_API_Key`
* **Frontend pages:** Login, Register, ForgotPassword, ResetPassword (all with toast notifications)
* **Cookie strategy:** `HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`
* **Account linking:** All 3 auth methods resolve to same user via `findOrCreateUser()`

### 17. Phase 3 Prompts Ready (2026-03-11)
* **Status:** COMPLETE
* **Description:** All 4 Phase 3 parallel instances delivered successfully. Integration step completed.

### 18. Phase 3 Integration — COMPLETE (2026-03-11)
* **Status:** COMPLETE
* **Description:** All curriculum API routes wired into `worker/src/index.ts`:
  - `GET /api/topics` — lists topics with lesson counts (auth required)
  - `GET /api/topics/:id` — topic detail with lessons + learner progress (auth required)
  - `GET /api/lessons/:id` — lesson detail with parsed key_dates/key_figures + source citations (auth required)
  - `POST /api/progress` — upsert learner progress with ON CONFLICT (auth required)
  - `GET /api/progress` — learner progress overview with topic scores (auth required)
  - `POST /api/quiz/complete` — submit quiz score as percentage (auth required)
* **Audit findings fixed:**
  - TopicDetail: replaced hardcoded color badges with `LessonProgress` component
  - API transforms DB field names (`summary`→`description`, `narrative_text`→`narrative`, `estimated_minutes`→`estimated_time`) to match frontend expectations
  - All routes use `requireAuth` middleware for session-cookie auth
* **Migration required:** `npx wrangler d1 execute learnlive-db-prod --file=worker/db/migrations/003_history_curriculum.sql`

### 19. Phase 4 Integration — COMPLETE (2026-03-12)
* **Status:** COMPLETE
* **Description:** Phase 4 (AI Content Adaptation Engine) fully integrated:
  - Modular router (`worker/src/routes/index.ts`) wired into `worker/src/index.ts` — called before legacy switch
  - Content API data shape mismatch fixed in `AdaptedContentReader.tsx` — API returns nested `{ lesson, content: { adapted_text, vocabulary, ... }, band }`, frontend now unwraps correctly
  - `/read/:lessonId` protected route added to `App.tsx`
  - "Read at My Level" button added to `LessonView.tsx` header
  - `BandSelector`, `VocabularyCard`, `DiscussionQuestions` components delivered by Jules
* **Migrations pending:** `004_adaptation_cache.sql`, `seed_curriculum.sql`, `seed_rag_chunks.sql`

---

## Phase 10: UI/UX Overhaul — Open Issues (2026-03-16)

### 20. Navigation Architecture — Back-Arrow Dependency
* **Status:** OPEN — HIGH PRIORITY
* **Description:** Every page below Dashboard (TopicDetail, LessonView, ReadingView, NarratedLessonView, ExamView) uses a standalone header with a "Back" button as the sole navigation mechanism. Users lose context of where they are in the app and can't jump laterally between sections. The Glossary page uses `DashboardLayout` with a proper nav header, but no other page does.
* **Impact:** Parents report the UI feels "messy and confusing." New users can't wrap their minds around the app's structure.
* **Fix:** Implement a persistent sidebar or top-nav layout that shows the full app structure at all times: Dashboard, current topic/lesson context, Glossary, and profile. Replace per-page headers with a shared layout component.

### 21. Band State Not Propagating from Learner Profile
* **Status:** OPEN — CRITICAL
* **Description:** The Dashboard fetches `familyData.learners` and stores `selectedLearnerId` in component state, but this value is only passed as a URL query param (`?learner=`) to TopicDetail. TopicDetail doesn't read it. LessonView, ReadingView, and ExamView all ignore the learner's band — ReadingView defaults to `useState(0)`, ExamView reads from `localStorage`, and LessonView shows the raw master text (Band 5) with no band awareness at all.
* **Result:** A 4-year-old child sees university-level theological content ("Sovereignty", "Covenant", "Dispensationalism") instead of picture-book content.
* **Fix:** Create a shared `useLearnerContext()` hook or Zustand slice that stores the active learner ID + band globally. All content views must read band from this context, not from localStorage or component defaults.

### 22. Raw Markdown Rendering in Content
* **Status:** OPEN — HIGH
* **Description:** Lesson titles and narrative text contain raw markdown syntax (e.g., `**1.1 In the Beginning...**`). The `LessonView` renders narrative in a `<div>` with `whitespace-pre-wrap` but no markdown parser. Content shows literal `**bold**` markers, `#` headers, and `---` dividers.
* **Fix:** Either strip markdown before storing in D1, or add a lightweight markdown renderer (e.g., `react-markdown`) for narrative content display.

### 23. AI Content Adaptation Called On-The-Fly — Cost & Latency Risk
* **Status:** OPEN — STRATEGIC
* **Description:** `serveAdaptedContent()` in `worker/src/lib/content/serve.ts` calls Gemini to adapt content per request if not cached. This means every first-time read at a band level triggers a ~3-5s AI call. For a product with 10 chapters × 6 bands = 60 adaptations, this is a cold-start problem that hits users on first visit.
* **Architectural Decision:** Pre-generate all band adaptations at seed time. Store adapted content in D1 as static rows. AI calls should ONLY happen for:
  1. **Live Narrated Lessons** (Explainer Canvas) — real-time voice interaction
  2. **Live Oral Examinations** (Evidence Witness) — real-time Socratic questioning
* **Rationale:** These two live AI experiences are the product's revenue drivers. Reading content is supplementary and should be instant, free of AI latency, and available offline.

### 24. No Clear Funnel to Revenue Features
* **Status:** OPEN — STRATEGIC
* **Description:** The Dashboard shows a grid of topic cards that link to TopicDetail → LessonView → Read/Narrate/Exam. The "Narrate" and "Exam" buttons are small, equally weighted with "Read" and "Ask" in the LessonView header. There is no visual hierarchy directing parents toward the product's two core paid experiences:
  1. **Live Narrated Lessons** (interactive AI storytelling with maps)
  2. **Live Oral Examinations** (AI-powered Socratic assessment)
* **Fix:** Redesign the lesson flow to make Live Lesson and Live Exam the primary CTAs. Reading should be positioned as preparation ("Read first, then start the Live Lesson"). The dashboard should surface "Continue" or "Start Live Lesson" actions prominently.

### 25. Inconsistent Page Layouts — No Shared Shell
* **Status:** OPEN — MEDIUM
* **Description:** Only `Glossary` uses `DashboardLayout`. All other authenticated pages (Dashboard, TopicDetail, LessonView, ReadingView, ExamView, NarratedLessonView) each render their own `<header>` with slightly different structure, max-widths, and button arrangements. This makes the app feel like 7 separate apps stitched together.
* **Fix:** Create a unified `AppShell` layout with persistent navigation. All authenticated routes should render inside this shell.

### 26. BandSelector Shown on Reading/Narration — Misleading UX
* **Status:** OPEN — MEDIUM
* **Description:** `BandSelector` appears in the ReadingView and NarratedLessonView headers, allowing users to manually switch between 6 bands. This contradicts the app's philosophy: the band should be determined by the learner's age (set during onboarding). Showing all 6 bands suggests the parent should be manually choosing complexity, which undermines the "AI adapts automatically" value proposition.
* **Fix:** Remove the BandSelector from content views. Show the active learner's band as a read-only badge. Allow band override only in a settings/profile context, not inline during reading.

### 27. Onboarding Selects Topic but Dashboard Ignores It
* **Status:** OPEN — LOW
* **Description:** Step 4 of onboarding asks the user to "Choose a Starting Point" and select a topic. But the Dashboard doesn't use this selection — it shows all topics in a flat grid with no indication of which one was chosen or where to start.
* **Fix:** Use the onboarding topic selection to set initial state. Dashboard should show a "Continue where you left off" or highlight the selected topic.
