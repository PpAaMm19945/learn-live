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
*   **[ ] Task 1.5:** Set up Cloudflare R2 bucket policies and upload utility functions (for future evidence snapshots and transcripts).
*   **[ ] Task 1.6:** Define the API contract / interface between the React frontend and Cloud Run backend (request/response shapes, auth headers, WebSocket message protocol). Document in `docs/API_Contract.md`.
*   **[ ] Task 1.7:** Set up environment & secrets management (Gemini API keys, GCP service account credentials, D1 bindings, R2 tokens). Document which secrets are needed and where they live.
*   **[ ] Task 1.8:** Design the 3D Responsibility Matrix schema in detail — map the X (Arena), Y (Capacity/Level), and Z (Repetition Arc) axes to concrete D1 tables and relationships. Validate the JSON Cell Structure from the Blueprint against the schema. Document in `docs/Matrix_Schema.md`.

## Phase 2: Authentication, State, & Data Access
*Focus: Secure access, distinguishing role authorities, and populating the educational matrix.*
*   **[x] Task 2.1:** Implement secure Auth flow (Parent vs. Learner modes).
*   **[x] Task 2.2:** Build out the Parent Command Center (Dashboard shell, fetching family state).
*   **[x] Task 2.3:** Implement Global State Management (e.g., Zustand or Context) with embedded state-change logging.
*   **[x] Task 2.4:** Build D1 seeding scripts to populate the 3D Responsibility Matrix (specifically the Language & Literacy "Narrative Sequencing" constraints for the MVP).
*   **[x] Task 2.5:** Implement multi-learner profile switching on a shared device. The Blueprint emphasizes device sharing — parents and multiple children must seamlessly switch between their views on a single tablet/phone without full re-authentication (e.g., parent PIN unlock, learner profile tap).
*   **[x] Task 2.6:** Build a role-based access guard — ensure learners cannot access parent dashboard routes, and parents see the correct dashboard for the active family. Log all role transitions.

## Phase 3: The Learner Interface & Task Selection
*Focus: The "Spartan" environment where children execute tasks.*
*   **Task 3.1:** Build the Learner UI Shell (Distraction-free, pure focus). Must be mobile-first / tablet-optimized — the Blueprint specifies families often use a single phone or tablet. Test at 768px, 414px, and 360px widths.
*   **Task 3.2:** Display active/stalled tasks for the specific learner based on their current arc stage.
*   **Task 3.3:** Build the "Witness Button" and task briefing component (pre-AI interaction screen).
*   **Task 3.4:** Build a camera/microphone permissions flow with clear, child-friendly consent prompts. Handle denied permissions gracefully (explain what's needed and why, offer retry). This is critical since the app accesses camera/mic for minors.

## Phase 4: The Agent Engine & Gemini Live Integration
*Focus: The heavy lifting for the Hackathon—bridging GCP and Gemini.*
*   **Task 4.1:** Scaffold Google Cloud Run microservice (Node.js/Python) with WebSocket support.
*   **Task 4.2:** Integrate Google GenAI SDK / ADK to handle bidirectional audio and video streaming.
*   **Task 4.3:** Create the dynamic Prompt Injection pipeline (fetching the strict JSON constraints from D1 and feeding them as `systemInstruction` to Gemini).
*   **Task 4.4:** Validate constraint JSON before sending to Gemini — ensure the cell structure from D1 is well-formed (has required fields: `constraint_to_enforce`, `failure_condition`, `success_condition`, `role`). Log malformed constraints and block the session from starting with a clear error.
*   **Task 4.5:** Implement Gemini API rate limiting and cost controls. The Blueprint emphasizes cost sensitivity — add per-family daily session limits, track API token usage, and alert when approaching budget thresholds. Log all API costs.

## Phase 5: The "Evidence Witness" Execution Flow
*Focus: Binding the frontend camera/mic to the Gemini Live agent in real-time.*
*   **Task 5.1:** Frontend WebRTC/MediaStream integration to capture camera and microphone data.
*   **Task 5.2:** Establish the active session loop: Learner connects ↔ Cloud Run Bridge ↔ Gemini Live.
*   **Task 5.3:** Implement real-time interruption handling and conversational turn-taking.
*   **Task 5.4:** Enforce constraints and log verification outputs directly to the Cloud Run service.
*   **Task 5.5:** Implement session resilience — handle network drops, WebSocket disconnections, and browser tab closures mid-session. Save partial session state so it can be resumed or at minimum logged as incomplete. This is essential for low-bandwidth African contexts.
*   **Task 5.6:** Add session timeout and maximum duration limits to prevent runaway Gemini sessions (both for cost and child welfare — a 4-year-old shouldn't be in a session for 30 minutes).

## Phase 6: Assessment Logging & Evidence Portfolio
*Focus: Packaging the session into immutable proof of formation.*
*   **Task 6.1:** Generate session transcripts and AI confidence summaries.
*   **Task 6.2:** Capture visual snapshots of the submitted work during the session.
*   **Task 6.3:** Transmit and save all artifacts to Cloudflare R2.
*   **Task 6.4:** Update D1 to flag the current task milestone as "Awaiting Judgment."
*   **Task 6.5:** Build a lightweight learner-facing portfolio view — while the parent holds judgment authority, the Philosophy doc (Section 36-37) affirms portfolios as a "testimony of formation." Learners should see their own completed work history (read-only, no scores/grades).

## Phase 7: Parent Review & Progression Mechanics
*Focus: Human authority finalizing the loop.*
*   **Task 7.1:** Update the Parent Dashboard to display "Awaiting Judgment" tasks.
*   **Task 7.2:** Build the Evidence Review UI (playback audio snippet, view transcript, view snapshot).
*   **Task 7.3:** Implement the Authority Actions ("Authorize Advancement" vs. "Require Revision").
*   **Task 7.4:** Trigger the 3D Matrix progression logic based on the parent's judgment (adjusting the Repetition Arc).
*   **Task 7.5:** Build pattern tracking dashboard for parents — the Philosophy (Section 39) emphasizes observing patterns of behavior (consistency of effort, willingness to revise, response to correction). Surface these patterns visually over time so parents can make informed advancement decisions rather than judging single sessions in isolation.
*   **Task 7.6:** Implement revision flow — when a parent clicks "Require Revision," the task must re-appear in the learner's active queue with the parent's notes attached. The AI's next Evidence Witness session for that task should reference the revision requirement in its system instructions.

## Phase 8: Hackathon Polish, Scripts, & Submission
*Focus: Ensuring we ace the Devpost checklist.*
*   **Task 8.1:** Write and test spin-up instructions & automated deployment scripts (`deploy.sh`).
*   **Task 8.2:** Generate the final Architecture Diagram.
*   **Task 8.3:** Record the 4-minute demo video featuring the "Evidence Witness" in action with Learner A and Learner B.
*   **Task 8.4:** Final audit of all codebase logs to ensure they narrate the app's behavior clearly.
*   **Task 8.5:** Set up CI/CD pipeline or at minimum a reproducible deployment script that judges can run. The Devpost checklist requires "spin-up instructions" — test these from a clean environment to ensure nothing is assumed.
*   **Task 8.6:** Write the blog post for bonus points (African-centric, faith-rooted AI platform on Google Cloud). Link GDG profile.
*   **Task 8.7:** Run a final end-to-end smoke test of the complete loop: Parent creates family → adds learner → learner sees task → learner taps Witness → Gemini session runs → evidence saved → parent reviews → parent advances/revises. Log the entire flow and confirm no dead ends.

---

## Cross-Cutting Concerns (Apply to ALL Phases)

These are not phase-specific but must be addressed continuously:

*   **CC.1: Mobile-First / Tablet-Optimized Design.** Every UI component must be tested at phone (360px) and tablet (768px) widths. The Blueprint explicitly states families share a single device.
*   **CC.2: Low-Bandwidth Resilience.** Minimize payload sizes. Lazy-load non-critical assets. The Evidence Witness session is the only "heavy" network operation — everything else should be edge-cached and lightweight.
*   **CC.3: Testing Strategy.** Each phase must include unit tests for critical logic (matrix progression, constraint validation, role guards) and at least one integration test for the phase's primary user flow. Don't leave testing to Phase 8.
*   **CC.4: Accessibility.** The Learner UI serves children ages 3-7+. Use large touch targets (min 48px), high contrast, clear iconography, and minimal text. Screen reader support is secondary but semantic HTML is required.
*   **CC.5: Data Privacy & Consent.** Camera/mic recordings of minors are stored. Ensure R2 storage is access-controlled per family. No cross-family data leakage. Parents must explicitly consent to recording before the first Evidence Witness session.
*   **CC.6: No AI Authority Violations.** At every integration point, verify the AI cannot: auto-advance a learner, generate grades/scores, bypass parental judgment, or lower task difficulty. These are hard prohibitions from the Philosophy doc (Section 48).
