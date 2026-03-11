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

### 7. Cloudflare Pages Deploy Failure — Lockfile Out of Sync (2026-03-11)
* **Status:** BLOCKER
* **Description:** `npm ci` fails because `package-lock.json` is out of sync with `package.json`. Specifically, `framer-motion@12.35.2`, `motion-dom@12.35.2`, and `motion-utils@12.29.2` are missing from the lockfile. Jules likely updated `package.json` without regenerating the lockfile.
* **Fix:** Run `npm install` locally and commit the updated `package-lock.json`, OR the next Jules instance must not modify dependencies without ensuring lockfile consistency.
* **Deploy log:** `npm error Missing: framer-motion@12.35.2 from lock file`

### 8. D1 Database Wiped — Clean Slate (2026-03-11)
* **Status:** INFO
* **Description:** All legacy tables have been manually dropped from `learnlive-db-prod`. Only `sqlite_sequence` remains. The new auth schema (`002_auth_tables.sql`) needs to be applied via `npx wrangler d1 execute learnlive-db-prod --file=worker/db/migrations/002_auth_tables.sql`.

### 9. Phase 2 Jules Audit (2026-03-11)
* **Status:** COMPLETE
* **Findings:**
  - ✅ `002_auth_tables.sql` created correctly with Users, Auth_Tokens, Sessions, User_Roles tables.
  - ✅ `Env` interface updated with JWT_SECRET, Google_Client_ID, Google_Client_Secret, Resend_API_Key.
  - ✅ Legacy schema files archived to `worker/src/archive/schema-v1/`.
  - ✅ Walkthrough created at `.antigravity/walkthroughs/Phase2_Auth_Schema.md`.
  - ✅ Progress logged in `.antigravity/progress.md`.
  - ⚠️ Lockfile not updated after dependency changes — caused Cloudflare Pages deploy failure (Issue #7).
  - ⚠️ Legacy math imports still present in `worker/src/index.ts` (arc, dag, taskGen, nanoBanana, splitJudgment, parentPrimer, aiPermissions, weeklyPlan, enrichTask, evaluateEvidence). These will need cleanup but are not blocking.
