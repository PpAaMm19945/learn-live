# Project Progress

## Phase 1: Foundation, Infrastructure, & Core Utilities ✅
*   [x] **Task 1.1:** Scaffold React/Vite frontend with Tailwind CSS (Dark Mode, Spartan design system).
*   [x] **Task 1.2:** Implement a robust Global Logger Utility (`Logger.ts`) for frontend and backend.
*   [x] **Task 1.3:** Initialize Cloudflare D1 schema (Families, Learners, Domains, Capacities, Matrix Tasks, Portfolios).
*   [x] **Task 1.4:** Initialize Cloudflare Workers or Hono API wrapper for basic D1 CRUD operations.
*   [x] **Task 1.5:** Set up Cloudflare R2 bucket policies and upload utility functions.
*   [x] **Task 1.6:** Define the API contract / interface between the React frontend and Cloud Run backend.
*   [x] **Task 1.7:** Set up environment & secrets management.
*   [x] **Task 1.8:** Design the 3D Responsibility Matrix schema in detail.

## Phase 2: Authentication, State, & Data Access ✅ *(Scaffolded/Mocked)*
*   [x] **Task 2.1:** Implement secure Auth flow (Parent vs. Learner modes).
    *   [x] **Task 2.1a:** Persist auth state across refreshes (Zustand persist + sessionStorage).
*   [x] **Task 2.2:** Build out the Parent Command Center (Dashboard shell). *(Scaffolded — fetches mocked data.)*
    *   [ ] **Task 2.2a:** Fetch family profiles from D1 (`GET /api/family/:id/profiles`).
*   [x] **Task 2.3:** Implement Global State Management (Zustand) with embedded state-change logging.
*   [x] **Task 2.4:** Build D1 seeding scripts to populate the 3D Responsibility Matrix.
*   [x] **Task 2.5:** Implement multi-learner profile switching on a shared device.
*   [x] **Task 2.6:** Build a role-based access guard.
*   [ ] **Task 2.7:** Configure production API URL via `VITE_API_URL` environment variable.

## Phase 3: The Learner Interface & Task Selection ✅
*   [x] **Task 3.1:** Build the Learner UI Shell (Distraction-free, mobile-first).
*   [x] **Task 3.2:** Display active/stalled tasks for the specific learner.
*   [x] **Task 3.3:** Build the "Witness Button" and task briefing component.
*   [x] **Task 3.4:** Build camera/microphone permissions flow.
*   [ ] **Task 3.5:** Add React Error Boundary wrapper.
*   [ ] **Task 3.6:** Wire offline detection to `uiStore.isOffline`.

## Audit Fixes Applied (2026-02-27)
*   [x] **Fix 1:** Added `[SEC]` to `LogContext` in `Logger.ts`.
*   [x] **Fix 2:** Fixed `ProtectedRoute.tsx` — removed `useAuthStore.getState()` in render, used hook-destructured `userId`.
*   [x] **Fix 3:** Fixed `Dashboard.tsx` — replaced hardcoded "Smith Family" with dynamic `familyId` display.
*   [x] **Fix 4:** Added `persist` middleware to `auth.ts` using `sessionStorage`.
*   [x] **Fix 5:** Added missing sub-tasks (2.1a, 2.2a, 2.7, 3.5, 3.6) to `ROADMAP.md`.

## Phase 4: The Agent Engine
*   [x] **Task 4.1:** Scaffold Cloud Run Microservice (`agent/`).
*   [x] **Task 4.2:** WebSocket Server & Gemini Live SDK Wrapper.
*   [x] **Task 4.3:** Constraint Fetcher (`agent/src/constraints.ts`).
*   [x] **Task 4.4:** Worker API Endpoint (`/api/task/:id`).
*   [x] **Task 4.5:** Constraint Validator & Rate Limiter (`agent/src/validate.ts`, `agent/src/rateLimit.ts`).

## Phase 5: The Agent WebRTC Connection & Full Session Flow
*   [x] **Task 5.1:** Capture Frontend MediaStreams & Proxy WebSocket.
*   [x] **Task 5.2:** Build standalone fullscreen `<EvidenceWitness>` component holding active streams.
*   [x] **Task 5.3:** Mock/Intercept constraint evaluation function calls in Agent (`gemini.ts` & `server.ts`).
*   [x] **Task 5.4:** Handle `session_end` WebSocket message to terminate streams and show UI overlay gracefully before returning to Dashboard.
