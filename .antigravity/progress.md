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
*   [x] **Task 3.5:** Add React Error Boundary wrapper.
*   [x] **Task 3.6:** Wire offline detection to `uiStore.isOffline`.

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

## Phase 6: Assessment Logging & Evidence Pipeline
*   [x] **Task 6.1:** Modify Worker API `(worker/src/index.ts)` to handle POST `/api/portfolio` insertions and execute `UPDATE Matrix_Tasks` query.
*   [x] **Task 6.2:** Modify WebRTC frontend UI `(src/components/learner/EvidenceWitness.tsx)` to extract an Image frame using Canvas API before track destruction.
*   [x] **Task 6.3:** Call `POST /api/upload` then `POST /api/portfolio` asynchronously handling loading UI.
*   [x] **Task 6.4:** Map global Logger integrations locally across these API calls.
*   [x] **Task 6.5:** Add Lightweight Learner Portfolio View (`LearnerPortfolio.tsx`).

## Phase 7: Parent Review & Progression Mechanics
*   [x] **Task 7.1:** Update the Parent Dashboard to display "Awaiting Judgment" tasks.
*   [x] **Task 7.2:** Build the Evidence Review UI (playback audio snippet, view transcript, view snapshot).
*   [x] **Task 7.3:** Implement the Authority Actions ("Authorize Advancement" vs. "Require Revision").
*   [x] **Task 7.4:** Trigger the 3D Matrix progression logic based on the parent's judgment.
*   [x] **Task 7.5:** Build pattern tracking dashboard — learner stats, approval rate, revision rate, AI confidence, recent activity history.
*   [x] **Task 7.6:** Build revision flow — RevisionModal with parent notes, worker re-queues tasks, revision context stored.

## Phase 8: Hackathon Polish, Scripts, & Submission
*   [x] **Task 8.1:** Write and test spin-up instructions & automated deployment scripts.
*   [x] **Task 8.2:** Generate the final Architecture Diagram (`docs/Architecture.md` with Mermaid sequence diagram).
*   [ ] **Task 8.3:** Record the 4-minute demo video.
*   [ ] **Task 8.4:** Final audit of all codebase logs.
*   [x] **Task 8.5:** Set up CI/CD pipeline or reproducible deployment script.
*   [x] **Task 8.6:** Write README / blog post for hackathon submission (polished `README.md` with concept, tech stack, architecture, and run instructions).
*   [ ] **Task 8.7:** Run final end-to-end smoke test.

## Phase 9: Parent-Primary UI & Evidence Capture
*   [x] **Task 9.1:** Redesign entry flow — parent opens app, sees today's tasks. Three evidence paths unified.
*   [x] **Task 9.2:** Build Parent Task View with constraint prompts. *(Done: `ParentTaskCard.tsx`)*
*   [x] **Task 9.3:** Build Parent Report Flow — guided two-step observation + assessment form (`ParentReportModal.tsx`).
*   [x] **Task 9.4:** Build Async AI Evidence Capture. *(Done: `AsyncEvidenceModal.tsx`)*
*   [x] **Task 9.5:** Refactored Live AI Witness — parent-initiated, clearly marked as premium with Crown badge.
*   [x] **Task 9.6:** Unified all evidence types (parent reports, async AI, live AI) in single dashboard with three action buttons.
*   [x] **Task 9.7:** Progression logic accepts all evidence sources via shared `/api/portfolio` endpoint.

## Phase 13: Explainer Canvas — Digital Whiteboard Agent (Creative Storyteller)
*   [x] **Task 13.1:** Build `ExplainerCanvas.tsx` — fullscreen digital whiteboard with framer-motion, element registry (CountingBlock, TextElement, ShapeElement, ImageElement), scene management (max 7 elements).
*   [x] **Task 13.2:** Build `ExplainerClient.ts` — WebSocket bridge handling voice + canvas tool call parsing.
*   [x] **Task 13.3:** Add `/v1/agent/explainer` Cloud Run endpoint — separate WebSocket from Evidence Witness, with canvas tool declarations (show_element, animate_element, remove_element, clear_canvas, generate_diagram).
*   [x] **Task 13.4:** Build learner-context-rich system prompts — age/band/name-aware, pedagogically mature instructions.
*   [ ] **Task 13.5:** Build Math counting/blocks demo flow with pre-built SVG primitives.
*   [x] **Task 13.6:** Wire "Explain This" entry point from TaskBriefing → PermissionsFlow → ExplainerCanvas.
*   [ ] **Task 13.7:** Audio-canvas sync (atomic payloads).
*   [ ] **Task 13.8:** Demo mode (recorded WebSocket replay fallback).
*   [ ] **Task 13.9:** Nano Banana image generation integration.
