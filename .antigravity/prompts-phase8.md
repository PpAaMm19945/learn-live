# Phase 8: Content Pipeline & Pilot Readiness — Parallel Prompts

> **Goal:** Upload actual curriculum content to R2, process maps for interactive use, remove access restrictions (open registration), build admin analytics dashboard, and add in-app feedback widget — everything needed to hand the app to real families.

> **Instance Strategy:** 3 parallel instances + integration step. Task weight drives instance count — each instance is substantial but not unwieldy.

---

## Instance A — Content Pipeline & R2 Upload

**Scope:** Process the 10-chapter master text and 34 maps into structured assets, upload to Cloudflare R2, and seed the D1 database with real curriculum data (replacing placeholder seeds).

**Context:**
- Master text: `docs/curriculum/history/my-first-textbook/` — 10 chapters, each in `chapter_XX/chapters/Chapter_XX_REBUILT.md`
- Maps: `docs/curriculum/history/Maps/` — 34 map description files (`map_001_*.md` through `map_034_*.md`)
- Map images: `docs/curriculum/history/Maps/Maps/` — actual image files
- Metadata: `docs/curriculum/history/my-first-textbook/metadata.json`
- Existing content utilities: `worker/src/lib/content/ingest.ts` (upload/chunk), `retrieve.ts` (RAG retrieval), `serve.ts`, `cache.ts`
- Existing seed files: `worker/db/seeds/seed_curriculum.sql`, `seed_rag_chunks.sql`, `seed_map_assets.sql` — currently placeholder data
- Content pipeline scripts referenced in memory: `prepare-content.ts`, `seed-curriculum.ts`, `upload-to-r2.ts`

**Tasks:**

1. **Content preparation script** (`worker/scripts/prepare-content.ts`):
   - Parse all 10 chapter markdown files into a normalized JSON manifest
   - Extract frontmatter metadata (title, period, key figures, key dates, geographic regions)
   - Split each chapter into logical sections/lessons (use heading structure)
   - Generate chunk boundaries for RAG (500-800 token chunks with overlap)
   - Output: `worker/scripts/output/content-manifest.json`

2. **Map metadata processor** (`worker/scripts/prepare-maps.ts`):
   - Parse all 34 map description files from `docs/curriculum/history/Maps/`
   - Extract geographic metadata: climate zones, physical features, trade routes, vegetation, regions
   - Link each map to its relevant chapter(s) and lesson(s)
   - Output: `worker/scripts/output/map-manifest.json` with image paths, metadata, and chapter associations

3. **R2 upload script** (`worker/scripts/upload-to-r2.ts`):
   - Upload chapter markdown files to R2 at `content/chapters/chapter_XX.md`
   - Upload map images to R2 at `assets/maps/map_XXX.png`
   - Upload map metadata to R2 at `assets/maps/map_XXX.json`
   - Use wrangler R2 API or direct S3-compatible upload
   - Verify uploads with list/head operations
   - Output upload manifest with R2 keys

4. **Real seed data generation** (`worker/scripts/seed-curriculum.ts`):
   - Read `content-manifest.json` and `map-manifest.json`
   - Generate `worker/db/seeds/seed_curriculum.sql` — real INSERT statements for all 10 Topics (chapters) with actual titles, periods, descriptions from the master text
   - Generate lessons within each topic based on chapter section structure
   - Generate `worker/db/seeds/seed_rag_chunks.sql` — real RAG chunks from the parsed chapter content, referencing valid lesson IDs
   - Generate `worker/db/seeds/seed_map_assets.sql` — link all 34 maps to their lessons with real metadata
   - All IDs should be deterministic (e.g., `topic_ch01`, `lesson_ch01_s01`) for reproducibility

5. **RAG retrieval layer verification:**
   - Verify `worker/src/lib/content/retrieve.ts` can fetch chunks by lesson ID and return relevant context
   - Ensure the retrieval function handles the actual chunk format from the seed data
   - Add a simple relevance scoring function if not present (keyword match + chunk proximity)

**Do NOT touch:** Frontend code, auth system, route handlers, migration files.

**Verify:** All scripts run without errors. Generated seed SQL is valid. `npm run build` passes.

---

## Instance B — Admin Analytics Dashboard

**Scope:** Build an admin analytics dashboard showing pilot usage metrics and a role-based admin access system.

**Context:**
- Existing auth: cookie-based JWT sessions via `worker/src/lib/auth/`
- Existing tables: `Users`, `Families`, `Learners`, `Learner_Progress`, `Topics`, `Lessons`, `Exam_Sessions`, `Artifacts`
- Route pattern: handler functions in `worker/src/routes/`, wired in `worker/src/routes/index.ts`
- Frontend pattern: React pages in `src/pages/`, shadcn/ui components, Tailwind design tokens
- User roles guidance: roles stored in separate `User_Roles` table (already exists from `002_auth_tables.sql`), use `has_role()` security definer function

**Tasks:**

1. **Admin role check utility** (`worker/src/lib/auth/roles.ts`):
   - Create `isAdmin(env, userId)` function that checks `User_Roles` table for `admin` role
   - Use security definer pattern to avoid RLS recursion (follows project user-roles guidance)
   - Create admin middleware wrapper: `requireAdmin(request, env)` — calls `requireAuth` then `isAdmin`

2. **Analytics API routes** (`worker/src/routes/analytics.ts`):
   - `GET /api/admin/analytics/overview` — returns:
     - Total families, total learners, total active users (last 7 days)
     - Lessons completed (total + last 7 days)
     - Exams taken (total + last 7 days)
     - Band distribution (count of learners per band 0-5)
   - `GET /api/admin/analytics/engagement` — returns:
     - Daily active users (last 30 days, grouped by date)
     - Lessons completed per day (last 30 days)
     - Average lessons per learner
     - Most/least popular topics by completion count
   - `GET /api/admin/analytics/families` — returns:
     - List of all families with: family name, learner count, total lessons completed, last active date
     - Sortable by last active, completion count
   - All routes require admin role via `requireAdmin`

3. **D1 migration** (`worker/db/migrations/010_analytics.sql`):
   - Create `Activity_Log` table: `id TEXT PRIMARY KEY, user_id TEXT, action TEXT, resource_type TEXT, resource_id TEXT, metadata TEXT, created_at TEXT DEFAULT (datetime('now'))`
   - FK to Users, index on `created_at` and `user_id`
   - This enables time-series queries without scanning large tables

4. **Activity logging utility** (`worker/src/lib/analytics/logger.ts`):
   - `logActivity(env, userId, action, resourceType, resourceId, metadata?)` function
   - Actions: `lesson_completed`, `exam_started`, `exam_completed`, `artifact_uploaded`, `login`, `content_viewed`
   - Non-blocking: use `ctx.waitUntil()` pattern for fire-and-forget logging
   - Wire into existing route handlers: add `logActivity` calls to lesson completion, exam routes, auth login

5. **Admin Dashboard page** (`src/pages/admin/Dashboard.tsx`):
   - Protected route — redirect non-admins to parent dashboard
   - Overview cards: Total Families, Total Learners, Active Users (7d), Lessons Completed (7d)
   - Engagement chart: line chart (recharts) showing daily active users + lessons completed over 30 days
   - Band distribution: bar chart showing learner count per band
   - Families table: sortable list with family name, learners, completion count, last active
   - Use existing design tokens from `src/index.css`, shadcn Card, Table components
   - Add `/admin` route to `src/App.tsx`

6. **Admin navigation:**
   - Add admin link to navigation (only visible if user has admin role)
   - Create `useIsAdmin()` hook that checks `/api/admin/check` endpoint
   - `GET /api/admin/check` — returns `{ isAdmin: boolean }` (requires auth, checks role)

**Do NOT touch:** Existing auth flows, curriculum routes, content adaptation, canvas/explainer code.

**Verify:** `npm run build` passes. Admin routes return 403 for non-admin users.

---

## Instance C — Onboarding Flow & In-App Feedback

**Scope:** Build a family onboarding wizard for new signups, remove invite code restrictions, and add an in-app feedback/bug-report widget.

**Context:**
- Current registration: `src/pages/Register.tsx` — may reference `PILOT_INVITE_CODE` 
- Family management: `worker/src/routes/family.ts` — `POST /api/family`, `POST /api/family/learners`
- Existing pages: Dashboard at `src/pages/parent/Dashboard.tsx`
- Design tokens in `src/index.css`, shadcn/ui components

**Tasks:**

1. **Remove invite code gate:**
   - Check `src/pages/Register.tsx` and `worker/src/routes/auth.ts` for any invite code validation
   - Remove or bypass the `PILOT_INVITE_CODE` check — open registration for all
   - Keep the `PILOT_INVITE_CODE` env var in `Env` interface but don't enforce it
   - Update any UI that shows an invite code field

2. **Onboarding wizard** (`src/pages/Onboarding.tsx`):
   - Multi-step wizard shown after first registration (when user has no family):
     - **Step 1: Welcome** — brief intro to Learn Live, what to expect
     - **Step 2: Create Family** — family name input → calls `POST /api/family`
     - **Step 3: Add Learners** — add 1+ learners with name, birth date, suggested band (auto-calculated from age) → calls `POST /api/family/learners` for each
     - **Step 4: Choose Starting Chapter** — show the 10 chapters as cards, let parent pick where to start (or start from Chapter 1 by default)
     - **Step 5: Ready!** — summary of family + learners + starting point, "Go to Dashboard" button
   - Use framer-motion for step transitions
   - Progress indicator at top (step dots or progress bar)
   - Persist progress in component state (no backend needed for wizard state)
   - After completion, redirect to Dashboard

3. **Onboarding redirect logic:**
   - In Dashboard (`src/pages/parent/Dashboard.tsx`): check if user has a family (`GET /api/family`)
   - If no family exists, redirect to `/onboarding`
   - Add `/onboarding` route to `src/App.tsx` (protected route)

4. **Band auto-calculation utility** (`src/lib/bandCalculator.ts`):
   - Given a birth date, calculate suggested band:
     - Age 3-5 → Band 0 (Picture Book)
     - Age 6-8 → Band 1 (Story Mode)
     - Age 9-11 → Band 2 (Explorer)
     - Age 12-14 → Band 3 (Scholar)
     - Age 15-17 → Band 4 (Apprentice Historian)
     - Age 18+ → Band 5 (University Prep)
   - Return `{ band: number, label: string, description: string }`
   - Used in onboarding Step 3 to suggest a band when birth date is entered

5. **Feedback widget** (`src/components/feedback/FeedbackWidget.tsx`):
   - Floating action button (bottom-right corner) on all authenticated pages
   - Click opens a modal/drawer with:
     - Type selector: Bug Report, Feature Request, Content Feedback, General
     - Text area for description
     - Optional screenshot annotation (just text description of what they see)
     - Current page URL auto-captured
     - Submit button
   - On submit: `POST /api/feedback` with `{ type, description, page_url, user_id }`

6. **Feedback API** (`worker/src/routes/feedback.ts`):
   - `POST /api/feedback` — create feedback entry (requires auth)
   - `GET /api/admin/feedback` — list all feedback (requires admin role)
   - `PUT /api/admin/feedback/:id` — update feedback status (open/acknowledged/resolved)
   - D1 migration `011_feedback.sql`: `Feedback` table (id, user_id, type, description, page_url, status, created_at)

7. **Wire feedback widget into app layout:**
   - Add `<FeedbackWidget />` to the authenticated layout wrapper (shows on all pages after login)
   - Widget should not appear on login/register/onboarding pages

**Do NOT touch:** Admin dashboard, content pipeline, canvas/explainer, exam system.

**Verify:** `npm run build` passes. Registration works without invite code. Onboarding flow completes and creates family + learners.

---

## After All 3 Instances Complete — Integration Step

One final prompt will:

1. **Wire new routes into `worker/src/routes/index.ts`:**
   - Import and wire analytics routes from `analytics.ts`
   - Import and wire feedback routes from `feedback.ts`
   - Ensure admin check endpoint is registered

2. **Wire activity logging into existing handlers:**
   - Add `logActivity()` calls to: lesson completion (`curriculum.ts`), exam start/complete (`examiner.ts`), artifact upload (`artifacts.ts`), login (`auth.ts`), content view (`content.ts`)
   - Use fire-and-forget pattern (`ctx.waitUntil`) to avoid slowing down responses

3. **Frontend route registration:**
   - Verify `/onboarding` route is in `src/App.tsx` (protected)
   - Verify `/admin` route is in `src/App.tsx` (protected + admin-only)
   - Verify `<FeedbackWidget />` is in the authenticated layout

4. **Dashboard integration:**
   - Dashboard checks family status → redirects to onboarding if needed
   - Dashboard shows learner selector if family has multiple learners
   - Admin users see "Admin Dashboard" link in navigation

5. **Migration sequencing:**
   - Update `worker/scripts/run-migrations.sh` to include `010_analytics.sql` and `011_feedback.sql`
   - Update seed scripts to use real content data from Instance A

6. **Build verification:**
   - `npm run build` from root — 0 errors
   - `cd worker && npx wrangler deploy --dry-run` — clean output

7. **Documentation updates:**
   - Update `ROADMAP.md`: Phase 8 → ✅ COMPLETE
   - Update `.antigravity/prompts.md` with Phase 8 completion log
   - Create `.antigravity/notes/P8_integration.md` documenting all integration fixes
   - Update `docs/deployment-checklist.md` with new migrations (010, 011)

8. **Smoke test endpoints:**
   - `POST /register` → creates account (no invite code needed)
   - `GET /api/family` → returns 404 (no family yet)
   - `POST /api/family` → creates family
   - `POST /api/family/learners` → adds learner
   - `GET /api/admin/analytics/overview` → returns metrics (admin only)
   - `POST /api/feedback` → creates feedback entry
   - `GET /api/admin/feedback` → lists feedback (admin only)
