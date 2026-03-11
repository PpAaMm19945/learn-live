# Executed Prompts Log

## Phase 1
- **Prompt 1 & 2 executed on:** 2026-02-27
    - **Goal:** Phase 1 (Base & Utils)
    - **Outcome:** Setup D1 schema, Logger.ts, basic Cloudflare Worker, R2 endpoints, API contracts.

## Phase 2
- **Prompt 3 & 4 executed on:** 2026-02-27
    - **Goal:** Phase 2 (Auth & Data)
    - **Outcome:** Auth state, Parent UI scaffold, User switching, D1 Seeding (families, learners, task matrix).

## Phase 3
- **Prompt 5 executed on:** 2026-02-27
    - **Goal:** Phase 3 (Learner UI)
    - **Outcome:** Learner Dashboard, Task Briefing, Witness Button, Permissions Flow.

## Phase 4
- **Prompt 6 & 7 executed on:** 2026-02-27
    - **Goal:** Phase 4 (Agent Engine & Configs)
    - **Outcome:** Scaffolded `agent/`. WebSocket Server, Gemini GenAI wrapper, Constraint Fetcher, Validation logic, Rate Limiting.

## Phase 5
- **Prompt 8 & 9 executed on:** 2026-02-27
    - **Goal:** Phase 5 (Learner Agent Interface & Control Flow)
    - **Outcome:** Built `EvidenceWitness.tsx`, `GeminiLiveClient` WebRTC capture, and agent `session_end` teardown loops.

## Phase 6
- **Prompt 10 & 11 executed on:** 2026-02-27
    - **Goal:** Phase 6 (Assessment Logging & Learner Portfolio)
    - **Outcome:** Worker APIs for portfolio upload, Evidence pipeline, Learner Portfolio view.

## Phase 7
- **Prompt 12 & 13 executed on:** 2026-02-27
    - **Goal:** Phase 7 (Parent Judgment UI & Matrix Progression)
    - **Outcome:** Judgment Modal, Dashboard integration, POST `/api/portfolio/:id/judge`, automated L1->L2 matrix progression engine.

---

# Queued Prompts — Phase 2 (New): Authentication & Account System

> **Context:** We are pivoting Learn Live to an African History curriculum. Phase 2 (new numbering) implements custom authentication on Cloudflare Workers. The math-specific code is being archived. All progress must be logged in `.antigravity/progress.md`. All issues must be logged in `.antigravity/issues.md`. Detailed walkthroughs go in `.antigravity/walkthroughs/`.

> **Cloudflare Worker Secrets (already configured):**
> - `Google_Client_ID` — Google OAuth client ID
> - `Google_Client_Secret` — Google OAuth client secret
> - `Resend_API_Key` — Resend API key for transactional emails
> - `JWT_SECRET` — for signing session JWTs (add via `wrangler secret put JWT_SECRET`)

> **File Management Rules (apply to ALL prompts below):**
> 1. **Old math-specific files:** Move to `src/archive/` (frontend) or `worker/src/archive/` (worker). NEVER delete — archive for future reactivation.
> 2. **Old auth system (`src/lib/auth.ts`):** Archive to `src/archive/auth-v1.ts` before replacing. The new auth store must call `/api/auth/me` instead of using client-side-only state.
> 3. **Progress:** After completing each prompt, append a section to `.antigravity/progress.md` with: task IDs completed, files created/modified/archived, and a one-line summary.
> 4. **Issues:** If you encounter blockers, compatibility problems, or design decisions that need user input, append to `.antigravity/issues.md` with date, description, and status (open/resolved).
> 5. **Walkthroughs:** For complex implementations, create a walkthrough in `.antigravity/walkthroughs/` (e.g., `Phase2_Auth_Schema.md`).

---

### 📋 PROMPT 16: Task 2.1 — D1 Auth Schema Design & Migration

**Objective:** Design and deploy the new authentication tables to D1.

**Instructions:**
1. **Archive** the old math-specific D1 schema definitions (if they exist as SQL files in `db/` or `worker/`). Move them to `worker/src/archive/schema-v1/`.
2. **Create** `worker/db/migrations/002_auth_tables.sql` with the following tables:
   - `Users` — `id TEXT PRIMARY KEY` (UUID), `email TEXT UNIQUE NOT NULL`, `name TEXT`, `password_hash TEXT` (nullable — null for OAuth-only and magic-link-only users), `email_verified INTEGER DEFAULT 0`, `created_at TEXT DEFAULT (datetime('now'))`, `updated_at TEXT DEFAULT (datetime('now'))`.
   - `Auth_Tokens` — `id TEXT PRIMARY KEY` (UUID), `user_id TEXT REFERENCES Users(id) ON DELETE CASCADE`, `token TEXT UNIQUE NOT NULL`, `type TEXT NOT NULL` (CHECK: 'magic_link', 'email_verify', 'password_reset'), `expires_at TEXT NOT NULL`, `used_at TEXT` (nullable).
   - `Sessions` — `id TEXT PRIMARY KEY`, `user_id TEXT REFERENCES Users(id) ON DELETE CASCADE`, `token_hash TEXT UNIQUE NOT NULL`, `expires_at TEXT NOT NULL`, `created_at TEXT DEFAULT (datetime('now'))`. *(Optional but recommended for token revocation.)*
   - `User_Roles` — `id TEXT PRIMARY KEY`, `user_id TEXT REFERENCES Users(id) ON DELETE CASCADE`, `role TEXT NOT NULL` (CHECK: 'parent', 'learner'), `UNIQUE(user_id, role)`.
3. **Update** the `Env` interface in `worker/src/index.ts` to include the new secrets:
   ```typescript
   export interface Env {
       DB: D1Database;
       EVIDENCE_VAULT: R2Bucket;
       JWT_SECRET: string;
       Google_Client_ID: string;
       Google_Client_Secret: string;
       Resend_API_Key: string;
       // Legacy — keep for backward compat during migration
       API_AUTH_TOKEN?: string;
       GEMINI_API_KEY?: string;
   }
   ```
4. **Run** the migration against D1: `npx wrangler d1 execute learnlive-db-prod --file=worker/db/migrations/002_auth_tables.sql`
5. **Walkthrough:** Create `.antigravity/walkthroughs/Phase2_Auth_Schema.md` documenting the schema design decisions (why nullable `password_hash`, why separate `User_Roles` table, why `Sessions` table exists despite JWT being stateless).
6. **Progress:** Update `.antigravity/progress.md` with Task 2.1 completion.

---

### 📋 PROMPT 17: Task 2.2 — JWT Session Utilities & Cookie Helpers

**Objective:** Build the core session infrastructure that all auth methods share.

**Instructions:**
1. **Create** `worker/src/lib/auth/jwt.ts`:
   - `signToken(payload: { sub: string; email: string; role?: string }, secret: string, expiresInSeconds?: number): Promise<string>` — uses Web Crypto API (`HMAC` + `SHA-256`) to sign a JWT. Default expiry: 7 days.
   - `verifyToken(token: string, secret: string): Promise<JWTPayload | null>` — verifies signature + expiry. Returns null if invalid.
   - Do NOT use any npm JWT libraries. Cloudflare Workers have native Web Crypto. Use `crypto.subtle.importKey` and `crypto.subtle.sign/verify`.
2. **Create** `worker/src/lib/auth/cookies.ts`:
   - `setSessionCookie(response: Response, token: string): Response` — sets `Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`.
   - `getSessionToken(request: Request): string | null` — parses `Cookie` header, extracts `session` value.
   - `clearSessionCookie(response: Response): Response` — sets expired cookie to clear it.
3. **Create** `worker/src/lib/auth/middleware.ts`:
   - `authenticateRequest(request: Request, env: Env): Promise<{ userId: string; email: string } | null>` — extracts cookie → verifies JWT → returns user info or null.
   - This will be used as middleware on all protected routes.
4. **Do NOT touch** any existing worker routes yet. This prompt only creates utilities.
5. **Progress:** Update `.antigravity/progress.md` with Task 2.2 completion.
6. **Issues:** If Web Crypto HMAC signing has any gotchas on Cloudflare Workers runtime, document in `.antigravity/issues.md`.

---

### 📋 PROMPT 18: Task 2.3 — Magic Link Flow

**Objective:** Implement the full magic link authentication flow (send → verify → session).

**Instructions:**
1. **Create** `worker/src/lib/auth/magicLink.ts`:
   - `generateMagicLinkToken(): string` — generates a cryptographically random token (use `crypto.randomUUID()` or `crypto.getRandomValues`).
   - `sendMagicLinkEmail(email: string, token: string, env: Env): Promise<boolean>` — calls Resend API (`https://api.resend.com/emails`) with:
     - `Authorization: Bearer ${env.Resend_API_Key}`
     - From address: `noreply@yourdomain.com` (configure appropriately)
     - Subject: "Sign in to Learn Live"
     - HTML body with the magic link URL pointing to the worker callback endpoint.
   - `storeMagicLinkToken(db: D1Database, userId: string | null, email: string, token: string): Promise<void>` — inserts into `Auth_Tokens` with type `'magic_link'`, expires in 15 minutes.
   - `verifyMagicLinkToken(db: D1Database, token: string): Promise<{ userId: string; email: string } | null>` — looks up token, checks not expired, checks not used, marks as used. If no user exists yet, creates one in `Users`.
2. **Add Worker routes** in `worker/src/index.ts`:
   - `POST /api/auth/magic-link` — accepts `{ email }`, generates token, stores it, sends email. Returns `{ success: true }`. No authentication required.
   - `GET /api/auth/magic-link/verify?token=xxx` — validates token, creates session JWT, sets cookie, redirects to frontend (`/`).
3. **Old file handling:** The existing `isAuthorized()` function in `worker/src/index.ts` (lines 42-47) uses `API_AUTH_TOKEN` bearer auth. Do NOT remove it yet — it's used by existing routes. Add new auth routes alongside it.
4. **Progress:** Update `.antigravity/progress.md`.
5. **Walkthrough:** Create `.antigravity/walkthroughs/Phase2_Magic_Link_Flow.md` with the full request flow diagram (frontend → worker → Resend → user email → worker verify → cookie set → frontend redirect).

---

### 📋 PROMPT 19: Task 2.4 — Google OAuth Flow

**Objective:** Implement Google OAuth login/signup via the Cloudflare Worker.

**Instructions:**
1. **Create** `worker/src/lib/auth/google.ts`:
   - `getGoogleAuthURL(env: Env, state: string): string` — constructs the Google OAuth consent URL with:
     - `client_id`: `env.Google_Client_ID`
     - `redirect_uri`: `https://learn-live.antmwes104-1.workers.dev/api/auth/google/callback`
     - `scope`: `openid email profile`
     - `response_type`: `code`
     - `state`: CSRF protection token (store in D1 or sign as JWT)
   - `exchangeCodeForTokens(code: string, env: Env): Promise<GoogleTokens>` — POST to `https://oauth2.googleapis.com/token` with `client_id`, `client_secret` (`env.Google_Client_Secret`), `code`, `redirect_uri`, `grant_type: 'authorization_code'`.
   - `getGoogleUserInfo(accessToken: string): Promise<{ email: string; name: string; picture: string }>` — GET `https://www.googleapis.com/oauth2/v2/userinfo`.
   - `upsertGoogleUser(db: D1Database, userInfo: { email: string; name: string }): Promise<string>` — finds user by email. If exists, returns ID (account linking!). If not, creates new `Users` row. Returns user ID.
2. **Add Worker routes:**
   - `GET /api/auth/google` — generates state token, stores/signs it, redirects to Google.
   - `GET /api/auth/google/callback?code=xxx&state=xxx` — validates state, exchanges code, upserts user, creates session JWT, sets cookie, redirects to frontend (`/`).
3. **Account linking:** If a user previously signed up via magic link and later clicks "Sign in with Google" using the same email, `upsertGoogleUser` finds the existing user — no duplicate account created. Document this behavior in the walkthrough.
4. **Google OAuth redirect URIs** (already configured in Google Cloud Console, per user's screenshot):
   - `https://learn-live.antmwes104-1.workers.dev` (origin)
   - `https://learn-live.antmwes104-1.workers.dev/api/auth/google/callback` (add this if not already there)
   - `https://learn-live-4az.pages.dev` and `https://learn-live-4az.pages.dev/login` (frontend)
5. **Progress:** Update `.antigravity/progress.md`.
6. **Walkthrough:** Create `.antigravity/walkthroughs/Phase2_Google_OAuth.md`.

---

### 📋 PROMPT 20: Task 2.5 & 2.6 — Email + Password Flow & Password Reset

**Objective:** Implement email/password registration, login, email verification, and password reset.

**Instructions:**
1. **Create** `worker/src/lib/auth/password.ts`:
   - `hashPassword(password: string): Promise<string>` — use Web Crypto API with PBKDF2 (SHA-256, 100k iterations, random salt). Store as `salt:hash` format (both base64-encoded).
   - `verifyPassword(password: string, storedHash: string): Promise<boolean>` — extracts salt, re-derives, compares.
   - Do NOT use bcrypt (not available in Workers runtime). PBKDF2 via `crypto.subtle.deriveBits` is the correct approach.
2. **Create** `worker/src/lib/auth/emailVerification.ts`:
   - `sendVerificationEmail(email: string, token: string, env: Env): Promise<boolean>` — similar to magic link email but with different copy. Uses `env.Resend_API_Key`.
   - `sendPasswordResetEmail(email: string, token: string, env: Env): Promise<boolean>` — sends a password reset link. Uses `env.Resend_API_Key`.
3. **Add Worker routes:**
   - `POST /api/auth/register` — accepts `{ email, password, name }`. Validates input (email format, password min 8 chars). Hashes password. Creates user with `email_verified = 0`. Generates verification token, sends email. Returns `{ success: true, message: "Check your email" }`.
   - `POST /api/auth/login` — accepts `{ email, password }`. Finds user by email. Verifies password. Checks `email_verified = 1`. Creates session JWT, sets cookie. Returns `{ success: true, user: { id, email, name } }`.
   - `POST /api/auth/forgot-password` — accepts `{ email }`. Generates password_reset token, stores in `Auth_Tokens`, sends reset email. Always returns success (don't leak whether email exists).
   - `POST /api/auth/reset-password` — accepts `{ token, newPassword }`. Validates token (type = 'password_reset', not expired, not used). Updates `password_hash` in `Users`. Marks token used.
   - `GET /api/auth/verify-email?token=xxx` — validates email_verify token, sets `email_verified = 1`, redirects to login.
4. **Account linking consideration:** If a Google OAuth user tries to register with email+password using the same email, check if user exists. If yes and `password_hash` is null, set the password (linking). If yes and `password_hash` exists, return "Account already exists, try logging in."
5. **Archive note:** The old `isAuthorized()` bearer token check remains for now. New routes don't use it.
6. **Progress:** Update `.antigravity/progress.md` with Tasks 2.5 & 2.6.
7. **Issues:** Document PBKDF2 iteration count choice and any Workers runtime limitations in `.antigravity/issues.md`.

---

### 📋 PROMPT 21: Task 2.7 — Account Linking Logic

**Objective:** Ensure all three auth methods (magic link, Google OAuth, email+password) resolve to the same user when the email matches.

**Instructions:**
1. **Create** `worker/src/lib/auth/accountLink.ts`:
   - `findOrCreateUser(db: D1Database, email: string, options?: { name?: string; passwordHash?: string; emailVerified?: boolean }): Promise<{ id: string; isNew: boolean }>` — the single function all auth methods call to resolve a user.
     - Looks up by email. If found, returns existing ID (`isNew: false`).
     - If found and `options.passwordHash` is provided and existing `password_hash` is null, updates it (linking password to OAuth/magic-link account).
     - If found and `options.name` is provided and existing `name` is null, updates it.
     - If not found, creates new user with provided fields.
   - This replaces the ad-hoc user creation in magic link, Google OAuth, and registration flows.
2. **Refactor** the auth flows from Prompts 18-20 to use `findOrCreateUser` instead of direct INSERT queries.
3. **Add route:** `POST /api/auth/set-password` — for users who signed up via magic link or Google OAuth and want to add a password. Requires active session (authenticated). Accepts `{ password }`. Hashes and stores.
4. **Test scenarios** to document in walkthrough:
   - Magic link signup → Google OAuth with same email → should be same user.
   - Google OAuth signup → set password → can now login with email+password.
   - Email+password signup → magic link with same email → should be same user.
5. **Walkthrough:** Create `.antigravity/walkthroughs/Phase2_Account_Linking.md`.
6. **Progress:** Update `.antigravity/progress.md`.

---

### 📋 PROMPT 22: Task 2.8 — Auth Middleware & `/api/auth/me`

**Objective:** Protect API routes and provide a session check endpoint for the frontend.

**Instructions:**
1. **Add Worker routes:**
   - `GET /api/auth/me` — uses `authenticateRequest()` from Prompt 17. If valid session, queries `Users` + `User_Roles` tables and returns `{ id, email, name, roles: ['parent'], emailVerified: true }`. If no valid session, returns `401`.
   - `POST /api/auth/logout` — clears session cookie. Returns `{ success: true }`.
2. **Create** a route protection helper in `worker/src/lib/auth/middleware.ts`:
   - `requireAuth(request: Request, env: Env): Promise<Response | { userId: string; email: string }>` — returns a 401 Response if not authenticated, or user info if authenticated. Used at the top of protected route handlers.
3. **Migrate existing routes:** Identify which existing routes in `worker/src/index.ts` currently use `isAuthorized()` (bearer token). For now, keep both auth methods working (cookie-based for new routes, bearer for legacy). Add a comment marking legacy routes for future migration.
4. **Old file handling:** Do NOT remove `isAuthorized()` yet. Add `// LEGACY: Remove when all clients migrate to cookie auth` comment.
5. **Progress:** Update `.antigravity/progress.md`.

---

### 📋 PROMPT 23: Task 2.9 — Frontend Auth Store Migration

**Objective:** Replace the client-side-only Zustand auth store with one that talks to the Worker.

**Instructions:**
1. **Archive** `src/lib/auth.ts` → `src/archive/auth-v1.ts`.
2. **Create new** `src/lib/auth.ts`:
   - Same Zustand store shape but:
     - `login()` is removed (no longer client-driven).
     - `checkSession()` — calls `GET /api/auth/me` (using `VITE_WORKER_URL`). If 200, sets `isAuthenticated: true`, populates `role`, `userId`, `email`. If 401, sets `isAuthenticated: false`.
     - `logout()` — calls `POST /api/auth/logout`, then clears local state.
     - `isLoading: boolean` — true while `checkSession` is in flight.
   - On app mount, `checkSession()` runs automatically.
   - Cookie is sent automatically by the browser (same-site or CORS with credentials).
3. **Update** `src/App.tsx` (or wherever routes are defined):
   - On mount, call `useAuthStore.getState().checkSession()`.
   - Show a loading spinner while `isLoading` is true.
4. **Update** `src/pages/Login.tsx`:
   - Replace the old family-code form with three auth options:
     - **Magic link form:** email input → POST `/api/auth/magic-link` → show "Check your email" message.
     - **Google sign-in button:** redirects to `GET /api/auth/google` (worker URL).
     - **Email + password form:** email + password inputs → POST `/api/auth/login`.
   - Add a "Create account" link to a registration page.
5. **Create** `src/pages/Register.tsx` — email, name, password → POST `/api/auth/register`.
6. **Create** `src/pages/ForgotPassword.tsx` — email → POST `/api/auth/forgot-password`.
7. **Create** `src/pages/ResetPassword.tsx` — reads token from URL → new password form → POST `/api/auth/reset-password`.
8. **CORS consideration:** The frontend (`learn-live-4az.pages.dev`) and worker (`learn-live.antmwes104-1.workers.dev`) are on different origins. Cookie auth requires:
   - Worker sets CORS headers: `Access-Control-Allow-Origin: https://learn-live-4az.pages.dev`, `Access-Control-Allow-Credentials: true`.
   - Frontend fetch calls use `credentials: 'include'`.
   - Cookie must use `SameSite=None; Secure` (not `Lax`) for cross-origin. Update `cookies.ts` from Prompt 17 accordingly.
   - **Document this cross-origin cookie requirement in `.antigravity/issues.md`** — it's a common source of bugs.
9. **Old file handling:**
   - Archive `src/pages/Login.tsx` → `src/archive/Login-v1.tsx` before rewriting.
   - Archive `src/pages/ProfileSelect.tsx` → `src/archive/ProfileSelect-v1.tsx` (old family code selector).
   - Archive `src/pages/Onboarding.tsx` → `src/archive/Onboarding-v1.tsx`.
10. **Progress:** Update `.antigravity/progress.md` with Task 2.9.
11. **Walkthrough:** Create `.antigravity/walkthroughs/Phase2_Frontend_Auth.md` covering the full login/session/logout flow from the user's perspective.

---

### 📋 PROMPT 24: Task 2.10 — Login/Register UI Polish & Route Guards

**Objective:** Build production-quality auth UI and wire up route protection.

**Instructions:**
1. **Login page (`src/pages/Login.tsx`):**
   - Clean, mobile-first layout (360px minimum).
   - Three sections: magic link input, "or" divider, Google button, "or" divider, email+password form.
   - Use existing design system tokens from `index.css` and `tailwind.config.ts`. No hardcoded colors.
   - Loading states on all buttons during API calls.
   - Error messages displayed inline (toast for network errors, inline for validation).
   - "Forgot password?" link under the password field.
   - "Don't have an account? Sign up" link at the bottom.
2. **Register page (`src/pages/Register.tsx`):**
   - Name, email, password, confirm password fields.
   - Client-side validation (password match, min 8 chars, valid email).
   - Success state: "Check your email to verify your account."
   - "Already have an account? Sign in" link.
3. **Update** `ProtectedRoute.tsx`:
   - Check `useAuthStore` for `isAuthenticated` and `isLoading`.
   - If loading, show spinner.
   - If not authenticated, redirect to `/login`.
4. **Update** route definitions in `App.tsx`:
   - Public routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/verify-email`.
   - Protected routes: everything else.
5. **Old file handling:** If any components reference the old `useAuthStore.login()` method, update them to use the new session-based flow. Search for `useAuthStore` across all files and fix any breaking references.
6. **Progress:** Update `.antigravity/progress.md` with Task 2.10.
7. **Final verification:** List all files created, modified, and archived during the entire Phase 2 auth implementation.

---

### 📋 PROMPT 25: Phase 2 Smoke Test & Cleanup

**Objective:** Verify the full auth system works end-to-end and clean up.

**Instructions:**
1. **Verify Worker builds:** Run `cd worker && npx wrangler dev` and confirm no TypeScript errors.
2. **Verify Frontend builds:** Run `npm run build` and confirm no errors.
3. **Test each auth flow mentally** (or document test steps):
   - Magic link: POST `/api/auth/magic-link` → check Resend dashboard → click link → verify cookie is set → GET `/api/auth/me` returns user.
   - Google OAuth: navigate to `/api/auth/google` → complete consent → verify redirect + cookie.
   - Email+password: POST `/api/auth/register` → verify email → POST `/api/auth/login` → verify cookie.
   - Password reset: POST `/api/auth/forgot-password` → click email link → POST `/api/auth/reset-password`.
   - Account linking: sign up with magic link → sign in with Google (same email) → verify same user ID.
4. **Clean up:**
   - Remove any `console.log` debugging statements added during development.
   - Ensure all archived files are in `src/archive/` or `worker/src/archive/`.
   - Verify `.antigravity/progress.md` has all tasks checked off.
   - Verify `.antigravity/issues.md` has all encountered issues documented with resolution status.
5. **Create** `.antigravity/walkthroughs/Phase2_Auth_Summary.md` — a high-level summary of the entire auth system: architecture, secret names, endpoints, cookie strategy, account linking rules, and known limitations.
6. **Progress:** Update `.antigravity/progress.md` marking Phase 2 complete.
