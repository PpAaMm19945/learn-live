# Phase 2: Frontend Auth Migration

Completed migration of `src/lib/auth.ts` to a server-backed session state via Zustand.

## Summary of Changes
- Archived old auth store and login pages into `src/archive/`.
- Created a new `useAuthStore` connected to `/api/auth/me` to check state on load.
- Re-routed App mount to call `checkSession()` dynamically.
- Implemented `/login`, `/register`, `/forgot-password`, `/reset-password` UI forms interacting with worker endpoints.
- Updated `ProtectedRoute` to use multi-role array structure.
- Resolved `familyId` dependencies dynamically since backend `/api/auth/me` does not explicitly provide it.

## Issues / Caveats
- **CORS Requirements**: Cross-origin cookies to `learn-live.antmwes104-1.workers.dev` demand `SameSite=None; Secure`. The worker's `cookies.ts` **MUST** be updated to reflect this, or cookie auth will silently fail in production due to third-party cookie blocks. Additionally, all frontend fetch requests to the worker use `credentials: 'include'`.
