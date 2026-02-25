# SchoolOS: Master Development Roadmap

This roadmap outlines the phased development of the SchoolOS application. Our methodology ensures rigorous testing and verification before advancing to the next phase. All components will feature deeply embedded markers and robust console logging to track state, flow, and constraints transparently.

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
*   **Task 1.1:** Scaffold React/Vite frontend with Tailwind CSS (Dark Mode, Spartan design system).
*   **Task 1.2:** Implement a robust Global Logger Utility (`Logger.ts`) for frontend and backend (capturing trace, debug, info, warn, error with timestamps and context markers).
*   **Task 1.3:** Initialize Cloudflare D1 schema (Families, Learners, Domains, Capacities, Matrix Tasks, Portfolios).
*   **Task 1.4:** Initialize Cloudflare Workers or Hono API wrapper for basic D1 CRUD operations.
*   **Task 1.5:** Set up Cloudflare R2 bucket policies and upload utility functions (for future evidence snapshots and transcripts).

## Phase 2: Authentication, State, & Data Access
*Focus: Secure access, distinguishing role authorities, and populating the educational matrix.*
*   **Task 2.1:** Implement secure Auth flow (Parent vs. Learner modes).
*   **Task 2.2:** Build out the Parent Command Center (Dashboard shell, fetching family state).
*   **Task 2.3:** Implement Global State Management (e.g., Zustand or Context) with embedded state-change logging.
*   **Task 2.4:** Build D1 seeding scripts to populate the 3D Responsibility Matrix (specifically the Language & Literacy "Narrative Sequencing" constraints for the MVP).

## Phase 3: The Learner Interface & Task Selection
*Focus: The "Spartan" environment where children execute tasks.*
*   **Task 3.1:** Build the Learner UI Shell (Distraction-free, pure focus).
*   **Task 3.2:** Display active/stalled tasks for the specific learner based on their current arc stage.
*   **Task 3.3:** Build the "Witness Button" and task briefing component (pre-AI interaction screen).

## Phase 4: The Agent Engine & Gemini Live Integration
*Focus: The heavy lifting for the Hackathon—bridging GCP and Gemini.*
*   **Task 4.1:** Scaffold Google Cloud Run microservice (Node.js/Python) with WebSocket support.
*   **Task 4.2:** Integrate Google GenAI SDK / ADK to handle bidirectional audio and video streaming.
*   **Task 4.3:** Create the dynamic Prompt Injection pipeline (fetching the strict JSON constraints from D1 and feeding them as `systemInstruction` to Gemini).

## Phase 5: The "Evidence Witness" Execution Flow
*Focus: Binding the frontend camera/mic to the Gemini Live agent in real-time.*
*   **Task 5.1:** Frontend WebRTC/MediaStream integration to capture camera and microphone data.
*   **Task 5.2:** Establish the active session loop: Learner connects ↔ Cloud Run Bridge ↔ Gemini Live.
*   **Task 5.3:** Implement real-time interruption handling and conversational turn-taking.
*   **Task 5.4:** Enforce constraints and log verification outputs directly to the Cloud Run service.

## Phase 6: Assessment Logging & Evidence Portfolio
*Focus: Packaging the session into immutable proof of formation.*
*   **Task 6.1:** Generate session transcripts and AI confidence summaries.
*   **Task 6.2:** Capture visual snapshots of the submitted work during the session.
*   **Task 6.3:** Transmit and save all artifacts to Cloudflare R2.
*   **Task 6.4:** Update D1 to flag the current task milestone as "Awaiting Judgment."

## Phase 7: Parent Review & Progression Mechanics
*Focus: Human authority finalizing the loop.*
*   **Task 7.1:** Update the Parent Dashboard to display "Awaiting Judgment" tasks.
*   **Task 7.2:** Build the Evidence Review UI (playback audio snippet, view transcript, view snapshot).
*   **Task 7.3:** Implement the Authority Actions ("Authorize Advancement" vs. "Require Revision").
*   **Task 7.4:** Trigger the 3D Matrix progression logic based on the parent's judgment (adjusting the Repetition Arc).

## Phase 8: Hackathon Polish, Scripts, & Submission
*Focus: Ensuring we ace the Devpost checklist.*
*   **Task 8.1:** Write and test spin-up instructions & automated deployment scripts (`deploy.sh`).
*   **Task 8.2:** Generate the final Architecture Diagram.
*   **Task 8.3:** Record the 4-minute demo video featuring the "Evidence Witness" in action with Learner A and Learner B.
*   **Task 8.4:** Final audit of all codebase logs to ensure they narrate the app's behavior clearly.
