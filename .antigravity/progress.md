# Project Progress

## Phase 1: Foundation, Infrastructure, & Core Utilities ✅
*   [x] All tasks complete.

## Phase 2: Authentication, State, & Data Access ✅
*   [x] **Task 2.1:** D1 Auth Schema (`002_auth_tables.sql` — Users, Auth_Tokens, Sessions, User_Roles)
*   [x] **Task 2.2:** JWT Session Utilities & Cookie Helpers (`jwt.ts`, `cookies.ts`, `middleware.ts`)
*   [x] **Task 2.3:** Magic Link Auth (`magicLink.ts` — token generation, Resend email, verify flow)
*   [x] **Task 2.4:** Google OAuth (`google.ts` — consent URL, token exchange, user upsert)
*   [x] **Task 2.5:** Password Auth + Email Verification (`password.ts`, `emailVerification.ts`)
*   [x] **Task 2.6:** Account Linking (`accountLink.ts` — `findOrCreateUser` resolves all methods to one user)
*   [x] **Task 2.7:** Auth Middleware + Route Wiring (`/api/auth/me`, `/api/auth/logout`, all auth routes in `index.ts`)
*   [x] **Task 2.8:** Frontend Auth Store (Zustand `checkSession()` + `logout()`, no localStorage)
*   [x] **Task 2.9:** Auth UI Pages (Login, Register, ForgotPassword, ResetPassword with toast notifications)
*   [x] **Task 2.10:** UI Polish + Route Guards (magic link sent state, invalid token state, `ProtectedRoute` updated)
*   [x] **Task 2.11:** CORS fix (`SameSite=None; Secure`, origin-aware allowlist with credentials)
*   [x] **Task 2.12:** Legacy cleanup (all math/science/english components archived, placeholder Dashboard created)

## Legacy Phases (Pre-Pivot) — Archived
All Phase 3-13 work (multi-subject math/science/english curriculum, Explainer Canvas, Evidence Witness, etc.) has been archived to `src/archive/` and `worker/src/archive/`. Components will be rebuilt for the African History RAG curriculum.

## Phase 3: African History RAG Curriculum — NOT STARTED
*   [ ] **Task 3.1:** Design new D1 schema for history content (Topics, Lessons, Sources, RAG chunks)
*   [ ] **Task 3.2:** Build RAG ingestion pipeline (R2 storage + chunk indexing)
*   [ ] **Task 3.3:** Build content explorer UI (topic browser, lesson view)
*   [ ] **Task 3.4:** Build AI-powered Q&A with source citations
*   [ ] **Task 3.5:** Build learner progress tracking for history curriculum
