# Phase 7: Production Readiness — Parallel Prompts

> **Goal:** Clean up legacy code, finish remaining backend tasks, polish the frontend for pilot readiness, and verify all migrations/seeds.

---

## Instance A — Legacy Worker Cleanup

**Scope:** Refactor `worker/src/index.ts` (~1800 lines) by migrating all active routes into the modular router pattern at `worker/src/routes/index.ts`, and archiving ~1300 lines of dead math curriculum routes.

**Context:**
- `worker/src/routes/index.ts` is the modular router (Phase 4–6 routes already here)
- `worker/src/index.ts` still contains: auth routes (lines 108–400+), curriculum CRUD routes (topics, lessons, progress, quiz), and ~1300 lines of legacy math routes (arc, DAG, taskGen, splitJudgment, weeklyPlan, enrichTask, evaluateEvidence, nanoBanana, parentPrimer, aiPermissions)
- Legacy math imports at top: `advanceArc`, `resolveDependencies`, `generateTask`, `generateDiagram`, `getSplitJudgmentMode`, `evaluateCompetence`, `generateParentPrimer`, `checkAIPermission`, `getOrCreateWeeklyPlan`, `completeWeeklyTask`, `getEnrichedTask`, `evaluateEvidence`

**Tasks:**
1. Create `worker/src/routes/auth.ts` — extract all auth route handlers (`/api/auth/me`, `/login`, `/register`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`, `/magic-link`, `/magic-link/verify`, `/google`, `/google/callback`, `/set-password`) from `index.ts` into standalone handler functions. Wire them into `routeRequest()` in `worker/src/routes/index.ts`.

2. Create `worker/src/routes/curriculum.ts` — extract curriculum CRUD routes (`GET /api/topics`, `GET /api/topics/:id`, `GET /api/lessons/:id`, `POST /api/progress`, `GET /api/progress`, `POST /api/quiz/complete`) from `index.ts` into handler functions. Wire into `routeRequest()`.

3. Move all legacy math route code (everything using `advanceArc`, `resolveDependencies`, `generateTask`, `generateDiagram`, `getSplitJudgmentMode`, `evaluateCompetence`, `generateParentPrimer`, `checkAIPermission`, `getOrCreateWeeklyPlan`, `completeWeeklyTask`, `getEnrichedTask`, `evaluateEvidence`) into `worker/src/archive/legacyMathRoutes.ts`. Do NOT delete — archive only. Remove the imports from `index.ts`.

4. After extraction, `worker/src/index.ts` should be ~100 lines: imports, Env interface, CORS helpers, and the single `routeRequest()` call. All route logic lives in `worker/src/routes/`.

5. Remove the legacy `isAuthorized()` bearer token function and `API_AUTH_TOKEN` from `Env` (all clients use cookie auth now).

**Do NOT touch:** `worker/src/lib/auth/` (auth utilities), `worker/src/routes/content.ts`, `worker/src/routes/examiner.ts`, `worker/src/routes/artifacts.ts`, `worker/src/routes/maps.ts`.

**Verify:** `cd worker && npx wrangler deploy --dry-run` must pass. All existing API endpoints must remain functional.

---

## Instance B — Chapter Content API & Family Management

**Scope:** Implement the remaining Phase 7 backend tasks: chapter-level content serving and family/learner management APIs.

**Context:**
- `worker/src/routes/content.ts` already has `handleGetAdaptedContent` (lesson-level) and `handleGetChapterContent`
- The chapter endpoint exists but may not serve cached adapted content optimally
- D1 tables: `Topics`, `Lessons`, `Sources`, `RAG_Chunks`, `Learner_Progress`, `Adaptation_Cache`
- Band adaptation pipeline: `worker/src/lib/content/adapt.ts`

**Tasks:**
1. **Chapter content serving** (`GET /api/chapters/:id/content?band=N`): Review `handleGetChapterContent` in `worker/src/routes/content.ts`. Ensure it:
   - Accepts `band` query param (0-5, default 5)
   - Checks `Adaptation_Cache` table first for cached adapted content
   - If cache miss: fetches all lessons for the chapter, retrieves RAG chunks, calls adaptation pipeline, caches result in `Adaptation_Cache`
   - Returns structured JSON: `{ chapterId, band, title, sections: [{ lessonId, title, adaptedContent, vocabularyWords, discussionQuestions }] }`

2. **Family & Learner management APIs:** Create `worker/src/routes/family.ts` with:
   - `POST /api/family` — create a family (parent user becomes family owner)
   - `GET /api/family` — get current user's family with all learners
   - `POST /api/family/learners` — add a learner to family `{ name, birthDate, band }`
   - `PUT /api/family/learners/:id` — update learner (name, band)
   - `DELETE /api/family/learners/:id` — remove learner
   - D1 migration `008_families.sql`: `Families` table (id, owner_user_id, name, created_at), `Learners` table (id, family_id, name, birth_date, band, created_at)

3. **Learner-scoped progress:** Update progress APIs so that progress is tracked per-learner (not per-user). Add `learner_id` to `Learner_Progress` table via migration `009_progress_learner.sql` (ALTER TABLE ADD COLUMN, nullable for backward compatibility).

4. Wire all new routes into `worker/src/routes/index.ts`.

**Verify:** `cd worker && npx wrangler deploy --dry-run` must pass.

---

## Instance C — Frontend Polish & Mobile Readiness

**Scope:** Polish all frontend pages for mobile-first experience, add loading/error states, and improve navigation flow.

**Context:**
- Pages: Dashboard, TopicDetail, LessonView, ReadingView, ExamView, NarratedLessonView
- Design tokens in `src/index.css` and `tailwind.config.ts`
- Mobile breakpoint target: 360px minimum
- Components use shadcn/ui + Tailwind

**Tasks:**
1. **Mobile responsive audit:** Review every page at 360px width. Fix:
   - Dashboard topic grid → single column on mobile
   - TopicDetail lesson list → full-width cards on mobile
   - LessonView → collapsible sidebar for key dates/figures on mobile
   - ReadingView → BandSelector as sticky top bar, content fills viewport
   - ExamView → full-width question cards
   - NarratedLessonView → canvas stacks above transcript on mobile (not side-by-side)

2. **Loading states:** Add skeleton loaders (using shadcn Skeleton) to:
   - Dashboard (topic grid skeleton)
   - TopicDetail (lesson list skeleton)
   - LessonView (content skeleton)
   - ReadingView (adapted content loading with band indicator)

3. **Error states:** Add error boundary and inline error UI to:
   - API fetch failures (network errors, 500s) → retry button + friendly message
   - Empty states (no topics, no progress, no exams) → illustrated empty state with CTA

4. **Navigation improvements:**
   - Add breadcrumb component to TopicDetail, LessonView, ReadingView, ExamView
   - Add "Back to Course" button on all sub-pages
   - Ensure all protected routes redirect to `/login` with return URL

5. **Accessibility:** Add `aria-label` to interactive elements, ensure tab order is logical, add `alt` text to all map images.

**Do NOT touch:** API calls, business logic, canvas primitives, worker code.

**Verify:** `npm run build` must pass with 0 errors.

---

## Instance D — Deployment Pipeline & Data Seeding

**Scope:** Create deployment scripts, verify all migrations, and prepare seed data for pilot.

**Context:**
- Pending migrations: `003_history_curriculum.sql`, `004_adaptation_cache.sql`, `005_exam_sessions.sql`, `006_artifacts.sql`, `007_map_assets.sql`
- Pending seeds: `seed_curriculum.sql`, `seed_rag_chunks.sql`
- New migrations from Instance B: `008_families.sql`, `009_progress_learner.sql`
- Worker config: `worker/wrangler.toml`
- All migrations run via: `cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/<FILE>.sql`

**Tasks:**
1. **Migration runner script:** Create `worker/scripts/run-migrations.sh` that executes all pending migrations in order:
   ```bash
   #!/bin/bash
   set -e
   cd "$(dirname "$0")/.."
   echo "Running all pending D1 migrations..."
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/003_history_curriculum.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/004_adaptation_cache.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/005_exam_sessions.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/006_artifacts.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/007_map_assets.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/008_families.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/009_progress_learner.sql
   echo "Running seed data..."
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/seeds/seed_curriculum.sql
   npx wrangler d1 execute learnlive-db-prod --remote --file=db/seeds/seed_rag_chunks.sql
   echo "All migrations complete!"
   ```

2. **Seed data verification:** Review `worker/db/seeds/seed_curriculum.sql` and `seed_rag_chunks.sql`. Ensure:
   - All 10 chapters have corresponding topic entries
   - Each topic has at least one lesson
   - RAG chunks reference valid lesson IDs
   - Map assets seed file exists: create `worker/db/seeds/seed_map_assets.sql` linking the 34 maps to their respective lessons

3. **Environment verification script:** Create `worker/scripts/verify-env.sh` that checks all required secrets are set:
   ```bash
   #!/bin/bash
   echo "Checking required secrets..."
   npx wrangler secret list | grep -q "JWT_SECRET" && echo "✅ JWT_SECRET" || echo "❌ JWT_SECRET missing"
   npx wrangler secret list | grep -q "Google_Client_ID" && echo "✅ Google_Client_ID" || echo "❌ Google_Client_ID missing"
   npx wrangler secret list | grep -q "Google_Client_Secret" && echo "✅ Google_Client_Secret" || echo "❌ Google_Client_Secret missing"
   npx wrangler secret list | grep -q "Resend_API_Key" && echo "✅ Resend_API_Key" || echo "❌ Resend_API_Key missing"
   npx wrangler secret list | grep -q "GEMINI_API_KEY" && echo "✅ GEMINI_API_KEY" || echo "❌ GEMINI_API_KEY missing"
   ```

4. **Deployment checklist doc:** Create `docs/deployment-checklist.md`:
   - Pre-deploy: run migrations, verify secrets, seed data
   - Deploy worker: `cd worker && npx wrangler deploy`
   - Deploy frontend: Cloudflare Pages auto-deploy from main branch
   - Post-deploy: verify `/api/auth/me`, `/api/topics`, `/api/lessons/:id/content?band=2`
   - Rollback procedure

5. **Update blocker table in ROADMAP.md** — mark all migration blockers as RESOLVED once scripts are ready.

**Verify:** Scripts are executable and syntactically correct. `npm run build` and `cd worker && npx wrangler deploy --dry-run` both pass.

---

## After All 4 Instances Complete — Integration Step

One final prompt will:

1. **Verify all route registrations:** Ensure `worker/src/routes/index.ts` imports and routes handlers from `auth.ts`, `curriculum.ts`, `family.ts`, `content.ts`, `examiner.ts`, `artifacts.ts`, `maps.ts`.

2. **Verify `worker/src/index.ts` is clean:** Should be ~100 lines — Env interface, CORS, and single `routeRequest()` delegation. No route logic.

3. **Frontend integration:** Ensure Dashboard fetches family/learner data. Add learner selector to Dashboard if family has multiple learners. BandSelector should default to learner's assigned band.

4. **Build verification:**
   - `npm run build` from root — 0 errors
   - `cd worker && npx wrangler deploy --dry-run` — clean output

5. **Documentation updates:**
   - Update `ROADMAP.md`: Phase 7 → ✅ COMPLETE, update blocker table
   - Update `.antigravity/prompts.md` with Phase 7 completion log
   - Create `.antigravity/notes/P7_integration.md` documenting all integration fixes

6. **Smoke test endpoints** (manual or via curl examples in integration notes):
   - `GET /api/auth/me` → returns user
   - `GET /api/topics` → returns 10 chapters
   - `GET /api/chapters/1/content?band=2` → returns adapted content
   - `POST /api/family` → creates family
   - `GET /api/family` → returns family with learners
