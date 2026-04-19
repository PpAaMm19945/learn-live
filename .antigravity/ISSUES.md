# Learn Live — Issue Tracker

> **Last updated:** 2026-04-19

---

## Resolved Issues (Summary)

| # | Issue | Resolution | Phase |
|---|-------|-----------|-------|
| 1–33 | Phase 10 merge conflict debris | All fixed | 10–11 |
| 34 | D1 Migration 014 not run on production | Migration run manually | 12 |
| 35 | Build frozen lockfile mismatch | `bun install` + commit lockfile | 12 |
| 36 | Lesson titles stored with markdown in D1 | `stripMarkdown()` utility | 11 |
| 37 | R2 bucket binding mismatch | Fixed `wrangler.toml` | 15 |
| 38 | SVG overlays not loading | Fixed worker route | 15 |
| 39 | Map admin page disconnected | Unified into single card | 15 |
| 40 | SVG overlays invisible | Decision: pivot to MapLibre GL JS | 15 |
| 41 | MapLibre GL JS Migration | TeachingCanvas built | 16A/B |
| 42 | Admin Role Check Uses Client-Side Storage | LOW — deferred | — |
| 43 | Cloud Run Agent Not Deployed with API Key | Resolved during Phase 23 | 23 |
| 44 | Agent Tool Definitions Still Use Legacy Names | Resolved in Phase 16C | 16C |
| 45 | WebSocket Not Yet Wired to TeachingCanvas | Resolved in Phase 20 | 20 |
| 46 | forwardRef Warnings on Routes/Login | LOW — cosmetic | — |
| 47 | Agent WebSocket Connection Broken | Resolved in Phase 23 | 23 |
| 48 | SessionCanvas Not Wired to useSession Hook | Resolved in Phase 21 | 21 |
| 49 | TranscriptView Kinetic Typography Not Built | Resolved in Phase 22 | 22 |
| 50 | TeachingCanvas Not Integrated into SessionCanvas | Resolved in Phase 21 | 21 |
| 51 | StorybookPlayer Images Assume Landscape Layout | Resolved in Phase 24A | 24A |
| 52 | Gemini Live API Cannot Serve as Lesson Narrator | Beat Sequencer architecture replaces Live narration | Phase 3 |
| 53 | Thinking Text Mixed with Transcript | Eliminated — Beat Sequencer uses `generateContent` (clean text) | Phase 3 |
| 54 | Transcript / Audio Synchronization Drift | Moved transcript append to AFTER audio playback begins | Phase 6 |
| 55 | Transcript Not Scrollable | SRT-style subtitle paradigm (2-3 sentence window) | Phase 6 |
| 57 | `RecordedEvent` type missing from `types.ts` | Added interface | Phase 6 |
| 58 | Empty PCM audio chunks cause `createBuffer(0)` errors | Added empty-string guard | Phase 6 |
| 59 | Session Shows "Session Ended" Prematurely | Upgraded Gemini model + pending completion queue | Phase 6 |
| 60 | Gemini Model Upgrade — 2.x → 3.x | `gemini-3-flash-preview` + `gemini-3.1-flash-live-preview` | Phase 6 |
| 61 | No Audio — Google Cloud TTS Key Missing | Replaced with Gemini TTS + dwell-time fallback | Phase 6 |
| 62 | Visual Tool Calls Not Rendering | `ImageScene` component + beat `sceneMode` field | Phase 6C |
| 63 | Beat Continuity Broken — Fresh Greeting Each Beat | Anti-greeting prompt with beat context | Phase 6C |
| 64 | Lesson Ending / Apparent Restart After Completion | `statusRef.current = 'ended'` immediately on `lesson_complete` | Phase 6C |
| 65 | Tool Call Text Leaking Into Transcript | Client-side regex filter + agent prompt instruction | Phase 7 |
| 66 | Image Scenes Not Displaying | Race condition fixed — set imageSceneUrl before sceneMode switch | Phase 7 |
| 67 | Map Highlights — `getPaintProperty` Crash | Added `map.getLayer()` guard; fallback marker renders | Phase 7 |
| 68 | Gemini Narrator 503 — No Retry Logic | Exponential backoff retry (3 attempts) in `GenAINarrator` | Phase 7 |
| 72 | Need Agent Debug Drawer | `DebugDrawer.tsx` with category filters, expandable details, copy-all | Phase 7 |
| 73 | Copy Buttons Fail in Iframe Contexts | `document.execCommand('copy')` fallback + visual feedback | Phase 7 |
| 74 | Map Theme Too Dark — Regions Invisible | Lightened base colors by ~40% | Phase 7 |
| 75 | Debug Drawer Hidden Behind Lesson Complete | Moved lesson-complete to `AnimatePresence` overlay at `z-[90]` | Phase 7 |
| 76 | No Image Test Presets in Canvas Workbench | Added dropdown with R2 storybook paths + Unsplash test URL | Phase 7 |
| 77 | Transcript Should Use Card-Based Layout | Rewrote to scrollable card stack with fading older cards | Phase 8 |
| 79 | Scene Transitions Only Firing for Map | `CanvasOverlays.tsx` renders at SessionCanvas level, all modes | Phase 8 |
| 81 | Scripture/Timeline/Figure Overlays Not Visible | Extracted overlay rendering into `CanvasOverlays.tsx` at z-40 | Phase 8 |
| 83 | Gemini Narrator Leaks JSON Into Beat Text | JSON-guard prompt + server-side regex + frontend fallback | Phase 9 |
| 84 | Timeline Overlay Clipped by Viewport Edge | Responsive positioning with `left-4 right-4` | Phase 9 |

---

## Open Issues

### 69. Raise Hand / Q&A Silently Fails
- **Status:** OPEN — MEDIUM
- **Description:** When student raises hand, the agent pauses the lesson and starts a Gemini Live session for Q&A. If the Live API fails (503, connection error, or timeout), the Q&A session silently ends via `stopQA()` after the 10-second silence timeout. No error is shown to the student. The lesson continues on the next beat.
- **Evidence:** User report: "It just listens... after a few moments, the lesson just continued."
- **Fix (agent):** Send `{ type: 'qa_error', message: '...' }` to client when Q&A fails to start. Frontend should show a toast notification.

### 70. No End-of-Lesson Quiz or Summary
- **Status:** OPEN — LOW (Feature Request)
- **Description:** Lesson ends abruptly with "Session Ended" screen. No quiz, recap, or "Think It Through" questions are presented, despite `thinkItThrough` data existing in the section manifest.
- **Fix:** After `lesson_complete`, display the `thinkItThrough` questions from the manifest before showing the ended screen.

### 71. Long Pauses Between Beats
- **Status:** OPEN — MEDIUM
- **Description:** Each beat is processed sequentially: narrate (Gemini REST, 2-30s) → TTS (10-20s) → send → wait 800ms → next beat. Total processing time per beat: 15-60 seconds. Student hears silence during processing.
- **Evidence:** Agent logs show 30-60s gaps between beats. User report: "the pauses are long."
- **Fix (agent):** Pre-process the next beat while current beat audio is playing. Pipeline architecture.

### 78. Agent Thinking/Reasoning Not Visible
- **Status:** OPEN — LOW (Feature Request)
- **Description:** User wants to see the agent's internal reasoning/thinking steps in the debug feed.
- **Notes:** Requires agent to emit `{ type: 'debug', category: 'thinking', message: '...' }` messages. Frontend DebugDrawer already supports arbitrary categories.

### 80. Multi-Tool Coordination Missing
- **Status:** OPEN — HIGH
- **Description:** Individual tools work (`zoom_to`, `draw_route`, `place_marker`) but they don't compose well. A route is drawn without zooming to show the full extent. A marker is placed without zooming in. The agent fires tools independently without spatial awareness.
- **Evidence:** Admin workbench testing confirms individual tools work, but manual composition (zoom + highlight + route) is needed.
- **Fix (agent):** Agent system prompt should instruct coordinated tool calls — e.g., `zoom_to` with appropriate zoom level before/after `draw_route`. Frontend could also auto-fit bounds after `draw_route`.

### 85. Session Stops Advancing After Beat 3
- **Status:** OPEN — HIGH (agent-side investigation needed)
- **Description:** After 3 beats play successfully, no more beats arrive from the agent. The frontend shows "beat IDLE" but no new `beat_payload` messages come over WebSocket. Likely the agent's Gemini narration call hangs or errors silently on beat 4+.
- **Investigation:** Check agent logs for errors after beat 3. May be related to #83 — if the narrator returns pure JSON, the TTS may fail, causing the agent to hang.

### 86. Overlay Queue System Needed
- **Status:** RESOLVED — Phase 8+
- **Description:** Multiple tool calls in a single beat (e.g., `show_scripture` + `show_key_term` + `show_question`) all fire simultaneously, overlapping each other. Only the last one is visible.
- **Resolution:** Built sequential overlay queue in `CanvasOverlays.tsx` — overlays display one at a time with 15s dwell, auto-advancing through the queue. `dismiss_overlay("all")` clears the queue.

### 87. Small Overlays Scattered Across Canvas
- **Status:** RESOLVED — Phase 9
- **Description:** Key term, question, quote, and reflection cards rendered at different positions (top-center, bottom-center, dead-center). Should all use the same bottom-left card slot.
- **Resolution:** Unified all small overlays to `absolute bottom-24 left-6 right-6 md:right-auto md:max-w-md`. Removed casual emojis, replaced with styled text labels.

### 88. Image Thumbnail Cropping and Auto-Dismiss
- **Status:** RESOLVED — Phase 9
- **Description:** Image thumbnails used `object-cover` which cropped square illustrations. Also auto-dismissed after 20s regardless of beat length.
- **Resolution:** Changed to `aspect-square object-contain`. Removed 20s timer — images persist until `dismiss_overlay("all")` at next beat.

### 89. AutoScrollMap Not Zoomable
- **Status:** RESOLVED — Phase 9
- **Description:** PNG map in `AutoScrollMap` only auto-scrolled horizontally. No user interaction for zoom or vertical pan.
- **Resolution:** Added scroll-wheel zoom (1x–4x), pinch-to-zoom, full 2D drag panning, and zoom percentage indicator.

### 90. Ch01 Bands 2-5 Images Generated but Not Wired
- **Status:** RESOLVED — 2026-04-16
- **Description:** Jules generated 22 new Nano Banana 2 images (`geo_*`, `art_*`, `doc_*`) and uploaded them to R2, but they were not registered in `agent/src/imageRegistry.ts` and no `bandOverrides` existed on Ch01 manifests, so the agent never selected them per band.
- **Resolution:** (1) Added all 22 entries to `imageRegistry.ts` with correct `minBand`/`maxBand`. (2) Patched 12 image-mode beats across all 5 Ch01 manifests with `bandOverrides` for bands 2-5 (48 overrides total). (3) Lint: 0 errors. Deploy pending.

### 91. Pre-existing Band 0/1 Content Tailoring Gap
- **Status:** RESOLVED — 2026-04-17
- **Description:** Chapter 1 manifests had no complete Bands 0-3 overrides, causing extensive policy warnings (word counts, blocked tools, map-tool usage, oversized arrays).
- **Resolution:** Added a reusable scaffolder (`agent/scripts/scaffold-band-overrides.js` + TypeScript source) and generated Bands 0-3 overrides across all 35 Ch01 beats. Tool sequences are now pruned by band policy, map-disabled bands are image-forced, and content is capped to per-band word limits. Local policy lint check now reports 0 warnings and 0 errors for `ch01_s01..s05`.

### 92. Conflicting/Double Playback UI in Live Sessions
- **Status:** RESOLVED — 2026-04-17
- **Description:** Transcript cards showed pause/play while session also had a master pause/play. Triggering old beats caused double-audio playback conflicting with live audio.
- **Resolution:** Removed pause capability entirely from live session handling. Beats play sequentially with forced COOLDOWN blocks. Replay on older beats was restricted to `handleReplayBeatVisuals` (visual-only) and is only available in a dedicated post-lesson Review Mode (when `isEnded` is true).

### 93. Blank Screen Collapses for Seedlings on Map Tools
- **Status:** RESOLVED — 2026-04-17
- **Description:** For Band 0/1, invalid `set_scene(image)` strings, or agent-forced map tools would break the layout or replace the fallback Welcome Cover with empty space.
- **Resolution:** Hardened image tool processing to ignore calls with falsey `imageUrl`s. Removed thumbnail "X" dismiss button for Seedling/Sprouts so users cannot accidentally dismiss the only visual.

---

## Notes
- **2026-04-19 — Phase 0 (Revised) shipped:** All pause/replay infrastructure removed. Transcript is now read-only with collapsible per-beat Activity dropdown surfacing tool calls + agent thinking. Issues #92 and #93 confirmed RESOLVED; review-mode replay path also removed (no longer needed). Next: Sandwich Lite (Gatekeeper + Negotiator, no homework persistence).
- Issue 85 is the current critical blocker (agent-side).
- Issues 80 and 71 remain open for future work.
- **2026-04-18 — Strategic pivot:** Engineering direction shifts to the **Sandwich Model** (Gatekeeper → Performer → Negotiator). See ROADMAP "Sandwich Model" section and `.lovable/plan.md`. Phase 0 (playback/transcript stabilization) is closed; Phase 1A (Gatekeeper, no assignments) is the next active workstream pending answers to four open questions (assignment modality, gating strictness, persona continuity, scope confirmation).
- Phase 7 (Band Differentiation) is complete through Sprint 1; Sprints 2–3 will be revisited after Sandwich Model 1A/1B land.
- Ch01 image pipeline complete (Issue 90 resolved); Ch02 manifests staged in `.antigravity/manifests/`.

---

## Sandwich Model — Tracking Items (opened 2026-04-18)

### 94. Gatekeeper agent not yet implemented
- **Status:** OPEN — Phase 1A scoped, awaiting kickoff
- **Description:** New Gemini Live persona for pre-lesson readiness check + (eventually) prior-assignment review. Speaks first with initiative, hands off to `BeatSequencer` via a `begin_lesson` signal.
- **Files (planned):** `agent/src/gatekeeperHandler.ts` (or extension of `liveHandler.ts`), new state in `agent/src/historySessionController.ts` (`AWAITING_GATEKEEPER_GREENLIGHT`), new frontend Gatekeeper screen sharing `liveHandler` plumbing.
- **Blockers:** Awaiting user answers on persona/voice continuity and Phase 0 vs. straight-to-1A scope confirmation.

### 95. Negotiator agent not yet implemented
- **Status:** OPEN — Phase 1B scoped
- **Description:** Post-lesson Live agent for synthesis check + dynamic homework negotiation. Triggered automatically on `lesson_complete`. Phase 1B is verbal-only (no persistence); Phase 1C wires the D1 store.
- **Dependency:** Phase 1A must land first.

### 96. `learner_assignments` table does not exist
- **Status:** OPEN — Phase 1C scoped
- **Description:** No assignment concept anywhere in the system today. Required schema (minimum): `learner_id`, `chapter_id`, `section_id`, `prompt`, `student_response` (nullable), `evaluated_at`, `evaluation_notes`. Negotiator writes; Gatekeeper reads most-recent-unreviewed at next session.
- **UX dependencies:** Parent override per `mem://principles/ai-governance` (No AI Authority); first-lesson-ever bypass; not-done-assignment policy (allow / refuse / mini-recovery — pending user decision).

### 97. Frontend lacks Gatekeeper / Negotiator screens
- **Status:** OPEN — tied to 1A and 1B
- **Description:** `SessionCanvas` today has only one mode (Performer + raise-hand). Sandwich Model needs two new full-duplex Live screens with no beat queue: a "your teacher is talking to you" cover for Gatekeeper, and a "proposed assignment" card UI for Negotiator.

