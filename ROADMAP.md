# Learn Live: Master Development Roadmap

This roadmap outlines the phased development of the Learn Live application. Our methodology ensures rigorous testing and verification before advancing to the next phase. All components will feature deeply embedded markers and robust console logging to track state, flow, and constraints transparently.

## Philosophical & Architecture Alignment
*   **Goal:** Form faithful, responsible adults through structured friction and real-world task execution.
*   **Role of AI:** "Evidence Witness" & "Steward of Structure" — it enforces constraints and logs evidence, but possesses no moral authority.
*   **Tech Stack:** 
    *   **Frontend:** React, Vite, Tailwind CSS (Cloudflare Pages)
    *   **Backend / AI Bridge:** Google Cloud Run (Node.js/Python) bridging Gemini Live API
    *   **Data & Storage:** Cloudflare D1 (Relational) & R2 (Evidence/Portfolio)

---

## Phase 1: Foundation, Infrastructure, & Core Utilities
*Focus: Setting up the skeleton, routing, database schemas, and the robust logging infrastructure.*
*   **[x] Task 1.1:** Scaffold React/Vite frontend with Tailwind CSS (Dark Mode, Spartan design system).
*   **[x] Task 1.2:** Implement a robust Global Logger Utility (`Logger.ts`) for frontend and backend (capturing trace, debug, info, warn, error with timestamps and context markers).
*   **[x] Task 1.3:** Initialize Cloudflare D1 schema (Families, Learners, Domains, Capacities, Matrix Tasks, Portfolios).
*   **[x] Task 1.4:** Initialize Cloudflare Workers or Hono API wrapper for basic D1 CRUD operations.
*   **[x] Task 1.5:** Set up Cloudflare R2 bucket policies and upload utility functions (for future evidence snapshots and transcripts).
*   **[x] Task 1.6:** Define the API contract / interface between the React frontend and Cloud Run backend (request/response shapes, auth headers, WebSocket message protocol). Document in `docs/API_Contract.md`.
*   **[x] Task 1.7:** Set up environment & secrets management (Gemini API keys, GCP service account credentials, D1 bindings, R2 tokens). Document which secrets are needed and where they live.
*   **[x] Task 1.8:** Design the 3D Responsibility Matrix schema in detail — map the X (Arena), Y (Capacity/Level), and Z (Repetition Arc) axes to concrete D1 tables and relationships. Validate the JSON Cell Structure from the Blueprint against the schema. Document in `docs/Matrix_Schema.md`.

## Phase 2: Authentication, State, & Data Access
*Focus: Secure access, distinguishing role authorities, and populating the educational matrix.*
*   **[x] Task 2.1:** Implement secure Auth flow (Parent vs. Learner modes).
    *   **[x] Task 2.1a:** Persist auth state across refreshes (Zustand persist middleware with sessionStorage).
*   **[x] Task 2.2:** Build out the Parent Command Center (Dashboard shell, fetching family state). *(Scaffolded/mocked — will fetch live data when Worker endpoints are wired.)*
    *   **[x] Task 2.2a:** Fetch family profiles from D1 (`GET /api/family/:id/profiles`).
*   **[x] Task 2.3:** Implement Global State Management (e.g., Zustand or Context) with embedded state-change logging.
*   **[x] Task 2.4:** Build D1 seeding scripts to populate the 3D Responsibility Matrix (specifically the Language & Literacy "Narrative Sequencing" constraints for the MVP).
*   **[x] Task 2.5:** Implement multi-learner profile switching on a shared device.
*   **[x] Task 2.6:** Build a role-based access guard — ensure learners cannot access parent dashboard routes, and parents see the correct dashboard for the active family. Log all role transitions.
*   **[x] Task 2.7:** Configure production API URL via `VITE_API_URL` environment variable.

## Phase 3: The Learner Interface & Task Selection
*Focus: The "Spartan" environment where children execute tasks.*
*   **[x] Task 3.1:** Build the Learner UI Shell (Distraction-free, pure focus). Must be mobile-first / tablet-optimized — the Blueprint specifies families often use a single phone or tablet. Test at 768px, 414px, and 360px widths.
*   **[x] Task 3.2:** Display active/stalled tasks for the specific learner based on their current arc stage.
*   **[x] Task 3.3:** Build the "Witness Button" and task briefing component (pre-AI interaction screen).
*   **[x] Task 3.4:** Build a camera/microphone permissions flow with clear, child-friendly consent prompts. Handle denied permissions gracefully (explain what’s needed and why, offer retry). This is critical since the app accesses camera/mic for minors.
*   **[x] Task 3.5:** Add React Error Boundary wrapper for graceful crash handling.
*   **[x] Task 3.6:** Wire offline detection to `uiStore.isOffline` for low-bandwidth resilience.

## Phase 4: The Agent Engine & Gemini Live Integration
*Focus: The heavy lifting for the Hackathon—bridging GCP and Gemini.*
*   **Task 4.1:** Scaffold Google Cloud Run microservice (Node.js/Python) with WebSocket support.
*   **Task 4.2:** Integrate Google GenAI SDK / ADK to handle bidirectional audio and video streaming.
*   **Task 4.3:** Create the dynamic Prompt Injection pipeline (fetching the strict JSON constraints from D1 and feeding them as `systemInstruction` to Gemini).
*   **Task 4.4:** Validate constraint JSON before sending to Gemini — ensure the cell structure from D1 is well-formed (has required fields: `constraint_to_enforce`, `failure_condition`, `success_condition`, `role`). Log malformed constraints and block the session from starting with a clear error.
*   **Task 4.5:** Implement Gemini API rate limiting and cost controls. The Blueprint emphasizes cost sensitivity — add per-family daily session limits, track API token usage, and alert when approaching budget thresholds. Log all API costs.

## Phase 5: The "Evidence Witness" Execution Flow
*Focus: Binding the frontend camera/mic to the Gemini Live agent in real-time.*
*   **[x] Task 5.1:** Frontend WebRTC/MediaStream integration to capture camera and microphone data.
*   **[x] Task 5.2:** Establish the active session loop: Learner connects ↔ Cloud Run Bridge ↔ Gemini Live.
*   **[x] Task 5.3:** Implement real-time interruption handling and conversational turn-taking.
*   **[x] Task 5.4:** Enforce constraints and log verification outputs directly to the Cloud Run service.
*   **[x] Task 5.5:** Implement session resilience — handle network drops, WebSocket disconnections, and browser tab closures mid-session. Save partial session state so it can be resumed or at minimum logged as incomplete. This is essential for low-bandwidth African contexts.
*   **[x] Task 5.6:** Add session timeout and maximum duration limits to prevent runaway Gemini sessions (both for cost and child welfare — a 4-year-old shouldn't be in a session for 30 minutes).

## Phase 6: Assessment Logging & Evidence Portfolio
*Focus: Packaging the session into immutable proof of formation.*
*   **Task 6.1:** Generate session transcripts and AI confidence summaries.
*   **Task 6.2:** Capture visual snapshots of the submitted work during the session.
*   **Task 6.3:** Transmit and save all artifacts to Cloudflare R2.
*   **Task 6.4:** Update D1 to flag the current task milestone as "Awaiting Judgment."
*   **Task 6.5:** Build a lightweight learner-facing portfolio view — while the parent holds judgment authority, the Philosophy doc (Section 36-37) affirms portfolios as a "testimony of formation." Learners should see their own completed work history (read-only, no scores/grades).

## Phase 7: Parent Review & Progression Mechanics
*Focus: Human authority finalizing the loop.*
*   **[x] Task 7.1:** Update the Parent Dashboard to display "Awaiting Judgment" tasks.
*   **[x] Task 7.2:** Build the Evidence Review UI (playback audio snippet, view transcript, view snapshot).
*   **[x] Task 7.3:** Implement the Authority Actions ("Authorize Advancement" vs. "Require Revision").
*   **[x] Task 7.4:** Trigger the 3D Matrix progression logic based on the parent's judgment (adjusting the Repetition Arc).
*   **[ ] Task 7.5:** Build pattern tracking dashboard for parents — the Philosophy (Section 39) emphasizes observing patterns of behavior (consistency of effort, willingness to revise, response to correction). Surface these patterns visually over time so parents can make informed advancement decisions rather than judging single sessions in isolation.
*   **[ ] Task 7.6:** Implement revision flow — when a parent clicks "Require Revision," the task must re-appear in the learner's active queue with the parent's notes attached. The AI's next Evidence Witness session for that task should reference the revision requirement in its system instructions.

## Phase 8: Hackathon Polish, Scripts, & Submission
*Focus: Ensuring we ace the Devpost checklist.*
*   **[x] Task 8.1:** Write and test spin-up instructions & automated deployment scripts (`deploy.sh`).
*   **[x] Task 8.2:** Generate the final Architecture Diagram.
*   **Task 8.3:** Record the 4-minute demo video featuring the "Evidence Witness" in action with Learner A and Learner B.
*   **[x] Task 8.4:** Final audit of all codebase logs to ensure they narrate the app's behavior clearly.
*   **[x] Task 8.5:** Set up CI/CD pipeline or at minimum a reproducible deployment script that judges can run. The Devpost checklist requires "spin-up instructions" — test these from a clean environment to ensure nothing is assumed.
*   **[x] Task 8.6:** Write the blog post for bonus points (African-centric, faith-rooted AI platform on Google Cloud). Link GDG profile.
*   **[x] Task 8.7:** Run a final end-to-end smoke test of the complete loop: Parent creates family → adds learner → learner sees task → learner taps Witness → Gemini session runs → evidence saved → parent reviews → parent advances/revises. Log the entire flow and confirm no dead ends.

## Phase 9: Parent-Primary UI & Evidence Capture
*Focus: Parent-facing app with four witness modes. Async AI as the workhorse, Live AI as premium option.*

*   **[ ] Task 9.1:** Redesign the main app entry flow — parent opens app, sees today's tasks with constraint prompts. Current Learner Dashboard becomes the secondary "Child Portal" (parent optionally enables).
*   **[x] Task 9.2:** Build the **Parent Task View** — display constraint prompt as parent guidance (what to ask, what to look for, success/failure conditions). Two optional buttons: "Capture Evidence (Photo + Audio)" and "Invoke Live AI Witness." *(Done: `ParentTaskCard.tsx` wired into `Dashboard.tsx`)*
*   **[ ] Task 9.3:** Build the **Parent Report Flow** — parent writes a brief guided report (what happened, success/failure, notes). This is the default evidence path.
*   **[x] Task 9.4:** Build **Async AI Evidence Capture** — parent takes a photo of the child's work + records a 10-second audio clip of the child explaining. This is batched, sent to AI asynchronously, AI drafts a report. Parent reviews and edits before submission. This is the primary AI witness mode — lower cost, lower bandwidth, more reliable than live. *(Done: `AsyncEvidenceModal.tsx` handles capture; mock submit wired)*
*   **[ ] Task 9.5:** Refactor the **Live AI Witness** to be parent-initiated and clearly marked as premium/optional.
*   **[ ] Task 9.6:** Update the Parent Dashboard to unify all evidence types (parent reports, async AI reports, live AI reports) in a single review flow.
*   **[ ] Task 9.7:** Update progression logic — advancement triggered by parent judgment, regardless of evidence source.

## Phase 10: Curriculum Spine Integration
*Focus: Loading the Mathematics Curriculum Spine into the data model. Spine feeds constraint prompts to parents (and optionally AI). Includes DAG engine, repetition arc, and split judgment.*

*   **[x] Task 10.1:** Extend the D1 schema to support: Strands, Capacities (with DAG dependencies including shared cross-strand nodes), Cognitive Levels, Developmental Bands, Constraint Templates, and Repetition Arc state per learner per capacity. *(Done in `db/schema.sql`)*
*   **[ ] Task 10.2:** Build a seeding pipeline — loads the Math Spine (Strand 1 + Strand 2 first) into D1 from structured JSON/YAML source files. *(Blocked: Script `scripts/seed_curriculum.ts` is ready, waiting for Jules to output JSON into `curriculum_data/`)*
*   **[ ] Task 10.3:** Implement the **task generation engine** — reads a spine cell + constraint template, randomizes parameters, produces a task instance with parent-facing prompt and AI-facing systemInstruction.
*   **[ ] Task 10.4:** Build the **DAG dependency resolver** with cross-strand support — a learner can't access a Capacity until prerequisites are met, but can advance in other strands (no deadlocks). Lateral movement suggested when blocked.
*   **[ ] Task 10.5:** Implement the **Repetition Arc engine** — tracks per-capacity: Exposure (1x) → Execution (N, capacity-dependent) → Endurance (noise-injected tasks) → Milestone (cross-strand, unlabeled).
*   **[ ] Task 10.6:** Build **noise injection for Endurance tasks** — the task generation engine adds irrelevant data, distracting context, or mixed-domain elements.
*   **[ ] Task 10.7:** Build **cross-strand Milestone tasks** — the engine generates tasks that don't label which capacity is being tested.
*   **[ ] Task 10.8:** Implement the **Split Judgment model** for Band 4–5 — AI evaluates mathematical competence, parent evaluates formation.
*   **[ ] Task 10.9:** Build **Parent Primers** for Band 3+ — brief concept orientations explaining the math.
*   **[ ] Task 10.10:** Build the AI Permission Rule enforcement — tracks predict/diagnose/specify demonstration per learner per capacity, gating AI tool access.

## Phase 11: Child Portal & Gradual Handoff
*Focus: Building the optional child-facing portal with parent-controlled access levels and split judgment integration.*

*   **[ ] Task 11.1:** Build the Child Portal shell — simplified view of active tasks. Initially read-only.
*   **[ ] Task 11.2:** Implement parent-controlled portal access levels: None → Read-Only → Task Execution → Child-Led Mode. Parent toggles per-child.
*   **[ ] Task 11.3:** In Task Execution mode, child can submit evidence (photos, audio). All submissions route to parent review.
*   **[ ] Task 11.4:** In Child-Led mode (Band 4+), child can invoke AI Witness and Async AI independently. Reports still route to parent for formation judgment (split judgment active).
*   **[ ] Task 11.5:** Build portfolio view — expands from parent-curated to self-viewable as child gains independence (read-only, no scores/grades).

## Phase 12: Field Testing & Calibration
*Focus: Pilot one band with real families. Validate the repetition arc, parent competence model, and task generation quality.*

*   **[ ] Task 12.1:** Recruit 5–10 families with children in Band 2 (ages 6–9) for pilot testing.
*   **[ ] Task 12.2:** Run the full loop for Number & Quantity, Band 2 capacities. Measure: time per task, parent completion rate, evidence quality, advancement accuracy.
*   **[ ] Task 12.3:** Calibrate the Repetition Arc — are Execution counts right? Is Endurance noise appropriate? Do Milestone tasks genuinely test transfer?
*   **[ ] Task 12.4:** Validate parent competence — can parents at Band 2 effectively use constraint prompts without math anxiety? Identify friction points.
*   **[ ] Task 12.5:** Test Async AI evidence capture reliability — photo+audio quality in real home environments (kitchen tables, outdoor spaces). Measure AI report accuracy.
*   **[ ] Task 12.6:** Collect parent feedback on Parent Primers (Band 3 preview). Are they too long? Too short? Confusing? Adjust.

---

## Cross-Cutting Concerns (Apply to ALL Phases)

These are not phase-specific but must be addressed continuously:

*   **CC.1: Mobile-First / Tablet-Optimized Design.** Every UI component must be tested at phone (360px) and tablet (768px) widths. The Blueprint explicitly states families share a single device.
*   **CC.2: Low-Bandwidth Resilience.** Minimize payload sizes. Lazy-load non-critical assets. The Evidence Witness session is the only "heavy" network operation — everything else should be edge-cached and lightweight.
*   **CC.3: Testing Strategy.** Each phase must include unit tests for critical logic (matrix progression, constraint validation, role guards) and at least one integration test for the phase's primary user flow. Don't leave testing to Phase 8.
*   **CC.4: Accessibility.** The Learner UI serves children ages 3-7+. Use large touch targets (min 48px), high contrast, clear iconography, and minimal text. Screen reader support is secondary but semantic HTML is required.
*   **CC.5: Data Privacy & Consent.** Camera/mic recordings of minors are stored. Ensure R2 storage is access-controlled per family. No cross-family data leakage. Parents must explicitly consent to recording before the first Evidence Witness session.
*   **CC.6: No AI Authority Violations.** At every integration point, verify the AI cannot: auto-advance a learner, generate grades/scores, bypass parental judgment, or lower task difficulty. These are hard prohibitions from the Philosophy doc (Section 48).
