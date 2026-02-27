# Executed Prompts Log

## Phase 1
- **Prompt 1 executed on:** 2026-02-27
    - **Goal:** Phase 1.1 & 1.2 - Global Logging & D1 Schema Initialization.
    - **Outcome:** Created `Logger.ts`, `db/schema.sql`, `worker/wrangler.toml`, `worker/src/index.ts`, and updated `package.json`/`index.html` to reflect the name "Learn Live".

- **Prompt 2 executed on:** 2026-02-27
    - **Goal:** Phase 1 Completion - R2, API Contracts, & Matrix Design.
    - **Outcome:** Created `worker/src/lib/r2.ts`, `/api/upload` endpoint in `worker/src/index.ts`, `docs/API_Contract.md`, `docs/Matrix_Schema.md`, `.env.example`, and `worker/.dev.vars.example`.

## Phase 2
- **Prompt 3 executed on:** 2026-02-27
    - **Goal:** Phase 2.1 & 2.2 - Authentication & Parent Command Center.
    - **Outcome:** Created Zustand `auth.ts`, `ProtectedRoute.tsx`, `Login.tsx`, `Dashboard.tsx`.

- **Prompt 4 executed on:** 2026-02-27
    - **Goal:** Phase 2 Completion — Global State, Seeding, & Profile Switching.
    - **Outcome:** Created `db/seed.sql`, `uiStore.ts`, `ProfileSelect.tsx`. D1 remote applied with real emails.

## Phase 3
- **Prompt 5 executed on:** 2026-02-27
    - **Goal:** Phase 3 — Learner Interface, Task Display, & Witness Button.
    - **Outcome:** Built `LearnerDashboard.tsx` (task-fetching), `TaskCard.tsx`, `TaskBriefing.tsx`, `WitnessButton.tsx`, `PermissionsFlow.tsx`. Added `/api` proxy in `vite.config.ts`. Fixed `DefaultIcon` import.

---

# Queued Prompts

### 📋 PROMPT 6: Phase 4.1 & 4.2 — Cloud Run Scaffold + GenAI SDK

**Objective:** Scaffold the Google Cloud Run microservice that bridges the React frontend to the Gemini Live API. This is the hardest engineering lift of the project.

**Context you need:** The app already has:
- `worker/` — Cloudflare Worker handling D1/R2 (runs on `localhost:8787`)
- `vite.config.ts` — proxies `/api` to `localhost:8787`
- `src/components/learner/WitnessButton.tsx` — triggers the permissions flow but has no session connection yet
- `docs/API_Contract.md` — documents the WebSocket protocol for `/v1/agent/session`
- `db/seed.sql` — 4 Matrix Tasks with full constraint JSON including `role_instruction` objects

**Instructions for the AI:**
1. **Cloud Run Microservice (`agent/`):**
    * Create a new `agent/` directory at the project root (separate from `worker/`). This is a standalone Node.js service.
    * Create `agent/package.json` with dependencies: `express`, `ws`, `@google/genai` (Google GenAI SDK), `dotenv`.
    * Create `agent/tsconfig.json` for TypeScript compilation.
    * Create `agent/Dockerfile` targeting Node.js 20 alpine, exposing port 8080 (Cloud Run default).
    * Create `agent/cloudbuild.yaml` for GCP Cloud Build deployment.
2. **WebSocket Server (`agent/src/server.ts`):**
    * Express server with WebSocket upgrade on `/v1/agent/session`. Accept query params: `taskId` and `learnerId`.
    * On connection, log `[AGENT] Session initiated for learner: <id>, task: <taskId>`.
    * Include a `GET /health` endpoint returning `{ status: 'ok', service: 'learnlive-agent' }`.
3. **Gemini Live SDK Wrapper (`agent/src/gemini.ts`):**
    * Create a module that wraps the Google GenAI SDK's `Live` API (bidirectional streaming). It should:
      - Accept a `systemInstruction` string (the constraint JSON from D1).
      - Open a `BidiGenerateContent` session using model `gemini-2.0-flash-live-001` (or latest live model).
      - Expose methods: `sendAudio(chunk)`, `sendImage(frame)`, `onResponse(callback)`, `close()`.
    * Log all interactions via console with `[AGENT]` context markers.
4. **Environment Setup (`agent/.env.example`):**
    * Template file showing: `GEMINI_API_KEY=`, `PORT=8080`, `WORKER_API_URL=https://learn-live.antmwes104-1.workers.dev`.
5. **Tracking:** Update `.antigravity/progress.md` marking Tasks 4.1 and 4.2 as Complete. Log Prompt 6 in `prompts.md`. Provide walkthrough.

---

### 📋 PROMPT 7: Phase 4.3, 4.4 & 4.5 — Constraint Pipeline, Validation, & Rate Limiting

**Objective:** Complete the Agent Engine by adding constraint fetching from D1, JSON validation, and cost controls.

**Context you need:** After Prompt 6, the `agent/` directory will exist with `server.ts` (WebSocket) and `gemini.ts` (SDK wrapper).

**Instructions for the AI:**
1. **Constraint Fetcher (`agent/src/constraints.ts`):**
    * On WebSocket connection, before starting the Gemini session, fetch the task's constraint JSON from the Cloudflare Worker: `GET <WORKER_API_URL>/api/task/<taskId>`.
    * Parse the response and build the `systemInstruction` string by combining `role_instruction` fields with `constraint_to_enforce`, `failure_condition`, and `success_condition`.
    * Log the assembled instruction (truncated) with `[AGENT] System instruction assembled for task: <taskId>`.
2. **Worker API Endpoint (`worker/src/index.ts`):**
    * Add `GET /api/task/:id` — queries D1 for a single `Matrix_Tasks` row by ID. Returns the full task object as JSON.
3. **Constraint Validator (`agent/src/validate.ts`):**
    * Before injecting into Gemini, validate the constraint JSON has: `constraint_to_enforce`, `failure_condition`, `success_condition`, and `role_instruction` (with sub-fields `role`, `instruction`, `greeting`).
    * If validation fails, log `[AGENT] ⛔ INVALID CONSTRAINT — blocking session` and close the WebSocket with an error message.
4. **Rate Limiter (`agent/src/rateLimit.ts`):**
    * In-memory rate limiter: max 10 sessions per family per day. Track by `familyId` (passed as query param on WebSocket connect).
    * Log `[AGENT] Rate limit: family <id> has used <n>/10 sessions today`.
    * If exceeded, reject the WebSocket connection with `{ error: 'Daily session limit reached' }`.
5. **Tracking:** Update `.antigravity/progress.md` marking Tasks 4.3, 4.4, and 4.5 as Complete. Log Prompt 7 in `prompts.md`. Provide walkthrough.
