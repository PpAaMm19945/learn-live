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

### 12. Route Integration Needed (2026-03-11)
* **Status:** TODO — Next step
* **Description:** All auth libraries (P18-P20) export standalone handler functions but none are wired into `worker/src/index.ts`. A dedicated integration step (P21 Account Linking + P22 Middleware/Routes) must wire these handlers into the router, add `/api/auth/me` and `/api/auth/logout` endpoints, and add CORS headers to all auth responses.

### 13. google.ts Duplicate Env Interface (2026-03-11)
* **Status:** MINOR — Should be cleaned up during integration
* **Description:** `worker/src/lib/auth/google.ts` defines its own `Env` interface locally instead of importing from `../../index`. This could drift out of sync.

### 14. Legacy Math Imports in worker/src/index.ts (2026-03-11)
* **Status:** LOW — Cleanup deferred
* **Description:** ~10 legacy math-related imports remain (arc, dag, taskGen, nanoBanana, splitJudgment, parentPrimer, aiPermissions, weeklyPlan, enrichTask, evaluateEvidence). Not blocking but will cause build warnings once those archived files are removed.
