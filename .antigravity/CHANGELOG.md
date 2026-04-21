# Learn Live — Changelog

> **Last updated:** 2026-04-21
> One-line-per-decision log, consolidated from phase notes, walkthroughs, and logs.

---

## 2026-04-21 — Phase 1.6: Live Failure UX + Negotiator Scoring Fix + Data-Driven Chapters

- **Live failure visibility:** Fallbacks (timeouts) and errors in Gatekeeper/Negotiator now trigger student-facing Sonner toasts and muted "System" cards in the transcript activity log.
- **Negotiator finalization fixed:** Moved phase finalization and scaffolding scoring to a server-side `onNegotiatorComplete` hook. This ensures that natural slice completion (which does not send a `negotiator_complete` message from client) correctly triggers phase advance and telemetry scoring.
- **Data-driven Dashboard chapters:** Removed hardcoded chapter readiness. Tiles are now enabled based on backend topic visibility, with an optional code-level `PILOT_ALLOWLIST` for granular rollout control.
- **Redundant completion guard:** Maintained inbound `negotiator_complete` message handler as a defensive duplicate for robustness.

## 2026-04-21 — Session Lifecycle Stabilization + Chapter 1 Test Harness


### Agent-Side Lifecycle Fixes
- **Resume token protocol:** `resumeToken` is now parsed from the WS URL and used as the primary session lookup key. Falls back to the legacy `sessionKey(lesson, learner, band)` for fresh sessions. Structured logging added for resume decisions (token present/absent, cache hit/miss, beat index).
- **60-second stale override removed:** The `isStale = sessionAge > 60_000` check that was force-expiring sessions and causing full-lesson restarts has been deleted. The 20-minute TTL in `sessionStore.ts` is now the sole expiry mechanism.
- **Gatekeeper skip on resume:** Valid resume sessions now skip the gatekeeper and go straight to the performer slice, avoiding redundant warm-up conversations.
- **Performer-drain handshake:** `onLessonComplete` no longer starts the negotiator immediately. Instead it emits `performer_complete`, sets phase to `AWAITING_NEGOTIATOR_START`, and waits for a `performer_drain_complete` message from the client confirming that all queued audio has finished playing. Only then does it start the negotiator.
- **`AWAITING_NEGOTIATOR_START` phase:** Added to both `SessionPhase` (controller) and `LifecycleState` (lifecycle) as the explicit holding state between performer and negotiator.
- **Negotiator self-finalization:** `startNegotiator()` now calls `completeNegotiator()` after `await negotiator.start()` returns, ensuring `slice_change: complete` and `session_complete` are always emitted on the normal path.
- **Idempotent lifecycle helpers:** `completeGatekeeper()` and `completeNegotiator()` now guard against double-fire with state checks.
- **Failure-aware live slices:** `LiveConversationHandler.complete()` now tracks `completionReason` (success/timeout/connect_failed/model_error) and emits `live_slice_fallback` or `live_slice_error` events before the main completion event. Lifecycle still proceeds, but the client gets advance warning.

### Frontend Session Fixes
- **`performer_drain_complete` handshake:** `useSession.ts` now tracks whether `performer_complete` has been received and sends `performer_drain_complete` exactly once when the beat queue is empty and beat state is IDLE.
- **Live slice failure visibility:** New message handlers for `live_slice_fallback` and `live_slice_error` log to the debug stream with appropriate categorization.
- **Reconnect loop brake:** If `pipeline_status: loading` arrives after `performer_complete` was already received, a high-priority debug event is logged as a suspicious restart signal.
- **New message types:** `AgentMessage` union includes `live_slice_fallback` and `live_slice_error`. `ClientMessage` union includes `performer_drain_complete`.

### Chapter 1 Test Harness
- **TopicDetail routing fixed:** Lesson cards now navigate to `/play/${playId}` instead of the dead `/lessons/${lesson.id}` redirect.
- **Dashboard dynamic continue:** "Continue Lesson" button derives the actual next lesson URL from topic/lesson progress data instead of hardcoding `/play/ch01`.
- **Dashboard chapter tiles → topic detail:** Ready chapter tiles navigate to `/topics/topic_${chapter.id}` to show all sections, instead of auto-playing section 1.
- **Learner context propagated:** Both TopicDetail and Dashboard now include learner ID in navigation URLs.

## 2026-04-20 — Phase 1 (Sandwich Lite) Shipped + Phase 1.5 Audit Fixes
- **Sandwich Lite shipped:** Gatekeeper/Performer/Negotiator slice orchestration is now live for Bands 2–5, with frontend slice routing, top-bar slice status, and per-slice transcript handling. Bands 0–1 continue on Performer-first flow.
- **Audit fix — performer transition signal:** Added explicit handoff to `slice_change: performer` on both fresh and resume paths before sequencer start, eliminating stuck "Getting Ready" / Welcome-cover deadlocks.
- **Audit fix — controller phase wiring:** Session controller now explicitly enters `PERFORMER` during performer handoff so raise-hand eligibility correctly enables for Bands 3+.
- **Audit fix — completion choreography:** Removed duplicate negotiator completion call; added explicit `performer_complete` event and moved completion rendering trigger to final session completion for Bands 2–5.
- **Audit fix — timeout survivability verified:** Confirmed Live slice timeout path still emits `gatekeeper_complete` / `negotiator_complete`, ensuring lifecycle fallback progresses when Gemini Live fails.


## 2026-04-20 — Phase 0.5: Session UX Polish Pass
- **Transcript readability:** Removed faded historical cards; all beat cards now render at full opacity. Active beat keeps the left accent + stronger card styling while older beats remain secondary but readable.
- **Lesson end UX:** Removed the left-panel full-bleed completion overlay. Added a transcript-native completion card (`kind: 'completion'`) with **Back to Dashboard** and **Save as Golden Script** actions, plus a persistent top-bar **REVIEW** pill while ended.
- **Artifact inspection:** Added a read-only `ArtifactInspector` modal and made activity tool chips clickable when visualizable. Inspecting artifacts is display-only (no tool re-dispatch, no canvas mutation, no audio replay).
- **Welcome flow fixed:** Restored `WelcomeCover` rendering in the left panel, removed connecting early-return spinner takeover, and added transcript empty-state copy while waiting for first beat. Welcome auto-dismisses on first beat for Bands 2+.
- **Session controls cleanup:** Replaced misleading ended-state “End Session” affordance with “Exit” behavior/icon and removed dead replay prop chain remnants.
- **Stability fix:** Cleared `pendingThinkingRef` on `lesson_complete` to avoid stale thought text being attached to future beats.

## 2026-04-19 — Phase 0 (Revised): Transcript Stripped to Read-Only Activity Log
- **Decision:** Killed the pause/play/replay duality entirely. The transcript is now a passive, scrollable record — no controls, no replay, no review-mode buttons. Eliminates the two-week regression cycle around audio double-firing and silent replays.
- **Removed (frontend):** `pauseSession`, `resumeSession`, `paused` state, `isReviewMode`, `handleReplayBeatVisuals`, `onReplayVisuals` prop chain, all card-level Pause/Play/Replay buttons, and the bottom-bar Pause/Play toggle. Bottom bar = **Stop only** during live (mic stays for Band ≥3).
- **Added:** `BeatActivityDropdown` component — collapsible per-card "Activity" panel listing every tool call the agent fired (with one-line human summary), blocked tools (muted with "blocked" badge), and the agent's thinking text for that beat. Pure visibility — clicks are no-ops.
- **Thinking pipeline → transcript:** Streamed `AgentThinking` chunks now buffer in `pendingThinkingRef` and flush onto the next `BeatRecord`, surfacing inside the per-card dropdown. Live `ThinkingBanner` retained for in-flight reasoning.
- **Inter-beat pacing retained:** Band-aware cooldown in `useSession.ts` — 4500ms (B0/1), 3500ms (B2/3), 3000ms (B4/5).
- **Files changed:** `TranscriptView.tsx` (rewrite), `BeatActivityDropdown.tsx` (new), `useSession.ts` (strip pause/resume, capture thinking), `SessionCanvas.tsx` (strip replay handler + props).
- **Next:** Sandwich Lite (Phase 1A+1B combined, no homework persistence) — Gatekeeper + Negotiator wrapping the existing Performer.

## 2026-04-18 — Architectural Pivot: The Sandwich Model (Phase 0 Closeout)
- **Strategic decision:** Wrap the existing `BeatSequencer` ("Performer") with two short Gemini Live conversational agents — **Gatekeeper** (pre-lesson readiness + assignment review) and **Negotiator** (post-lesson synthesis + dynamic homework). Bands 2–5 only; Bands 0–1 stay on pure narrative model.
- **Reuse path identified:** New agents are scoped reuses of existing `agent/src/liveHandler.ts` (`LiveQAHandler`) — no new agent stack, just two new system prompts and two new lifecycle triggers.
- **Phase 0 closure:** In-flight playback/transcript stabilization is the prerequisite. Confirmed Issue #92 (double playback) and #93 (Band 0/1 blank-screen) are RESOLVED. Live sessions now have Stop-only controls; replay is visual-only and gated to post-lesson Review Mode.
- **Phasing locked:** 1A Gatekeeper (no assignments) → 1B Negotiator (no persistence) → 1C Assignment persistence (D1 `learner_assignments` table + parent override) → 1D Polish (adaptive scaffolding hooks + telemetry).
- **State-machine implication:** `historySessionController.ts` will gain `AWAITING_GATEKEEPER_GREENLIGHT` to defer `BeatSequencer` kickoff until the Gatekeeper signals `begin_lesson`.
- **Cost note:** Gemini Live is ~5–10× per-minute cost of TTS-narrated beats; two ~2–4 min slices add ~$0.10–0.20/session. Accepted pedagogical tradeoff.
- **Open questions parked for user input:** assignment input modality (spoken / typed / photo / hybrid), gating strictness when prior assignment missing, and persona/voice continuity across the three agents.
- **Plan of record:** `.lovable/plan.md` (Sandwich Model — Architectural Response & Plan).

## 2026-04-17 — Live Session UX Hardening (Band 0-3 Focus)
- **Phase 1 (Tool Gate)**: Added `isToolAllowedForBand` in `bandConfig.client.ts` to cleanly drop unsupported tool calls without crashing the UI, drastically smoothing Band 0/1 runs.
- **Phase 2 (Experience Flow)**: Implemented per-beat playback states via `BeatRecord` inside the active `useSession.ts` hook. Changed `TranscriptView.tsx` to handle visual persistence of past beats while playing the live beat.
- **Phase 2.5 (Visual Polish)**: Swapped single End button for a rich Pause/Play/Stop control bar. Added image thumbnail preservation & timeout tags. Styled duration-mapped shrink bars within `CanvasOverlays` using fresh CSS keyframes. 
- **Phase 3 (Welcome Screen)**: Dropped simple loading indicators in favor of an immersive `WelcomeCover.tsx` featuring `bg-african-warm` / `-dusk` themes, looping `storybook` graphics, and historical loading facts.

## 2026-04-17 — Ch01 Audit Complete; Chapters 2–9 Visually Locked
- Re-ran `agent/scripts/lint-manifest.ts` on `ch01_s01..ch01_s05`: **0 warnings, 0 errors** across all 6 bands
- Confirmed Chapter 1 is teach-ready end-to-end (manifests, image registry, `bandOverrides`, `syncTrigger`, content resolution all verified)
- `src/pages/parent/Dashboard.tsx`: added `ready` flag to `CHAPTERS` array; chapters 2–9 render disabled with muted styling, "Coming soon" badge, `aria-disabled`, and `title` tooltip
- Issue #91 confirmed RESOLVED (audit pass)

## 2026-04-17 — Ch01 Band 0-3 Tailoring Scaffolded
- Added `agent/scripts/scaffold-band-overrides.ts` (source-of-truth scaffolder) and runtime-friendly `agent/scripts/scaffold-band-overrides.js`
- Generated/updated Band 0-3 overrides for all 35 beats across `ch01_s01..ch01_s05` (140 override blocks)
- Enforced mechanical policy constraints in overrides: removed blocked tools, trimmed timeline/comparison/genealogy/slide arrays, and capped narration by band word maxima
- For map-disabled bands (0-1), converted map scenes to storybook image scenes with existing `band0_*` / `band1_*` assets
- Local manifest lint parity check reports 0 warnings / 0 errors for Chapter 1 manifests

## 2026-04-16 — Ch01 Image Wiring Complete
- Registered 22 new Nano Banana 2 images in `agent/src/imageRegistry.ts` (geo_*, art_*, doc_* descriptive keys)
- Added `bandOverrides` to 12 beats across all 5 Ch01 manifests (48 band-specific image swaps)
- Verified `syncTrigger: "start_of_beat"` is correctly set on all tool calls (was previously misdiagnosed as missing)
- Lint passes with 0 errors; 343 pre-existing band-policy warnings (word counts, bullet limits) flagged for future content tailoring
- **Decision:** Filename convention for Ch01 Bands 2-5 storybook is descriptive (`art_creation_first_light.jpg`), not numeric (`band4_page01.jpg` was a stale Jules log)
- **Decision:** Bands 4-5 get `art_taharqa_pharaoh.jpg` for Cush and Egypt-idolatry beats; Bands 2-3 see geo/art alternatives
- Ch01 is fully teachable end-to-end across all 6 bands pending Cloud Run redeploy


## 2026-04-15 — Phase 7 (Band Differentiation): Planning Complete
- Synthesized input from Codex, Antigravity, and Claude on age-band differentiation
- Created `BandProfile` interface spec with narration, TTS, tools, visuals, interactivity, and theology gate dimensions
- Defined 3-sprint implementation plan in ROADMAP.md (Core Agent → Frontend Delivery → Quality/Testing)
- Saved architecture docs: `docs/architecture/band-differentiation-antigravity.md`, `band-differentiation-claude.md`
- **Decision:** StorybookPlayer for Bands 0-1, full SessionCanvas for Bands 2-5
- **Decision:** Theology Gate — abstract concepts unlock progressively by band (e.g., "Providence" at Band 4, "Eschatological implications" at Band 5)
- **Decision:** TTS voice mapping: Kore (0-1), Leda (2), Orus (3), Charon (4-5)

## 2026-04-14 — Phase 9: Overlay Positioning & Map Interactivity
- Unified all small overlays (key term, question, quote, reflection) to shared bottom-left slot
- Removed casual emojis (🤔, 📚) from overlay cards, replaced with styled text labels
- Fixed image thumbnail cropping — changed from `object-cover` to `aspect-square object-contain`
- Removed 20s image auto-dismiss timer — images persist until beat ends
- Added scroll-wheel zoom (1x-4x) and pinch-to-zoom to `AutoScrollMap`
- Added 2D drag panning and zoom percentage indicator to map

## 2026-04-13 — Phase 8+: Sequential Overlay Queue
- Built overlay queue system in `CanvasOverlays.tsx` — one overlay at a time, 15s dwell, auto-advance
- `dismiss_overlay("all")` clears queue and resets
- Image thumbnail system for storybook images during map/transcript scenes
- Increased inter-overlay delay for sequential tool calls within a beat

## 2026-04-12 — Phase 8: Overlay Extraction & Transcript Cards
- Extracted overlay rendering from TeachingCanvas into `CanvasOverlays.tsx` at SessionCanvas level (z-40)
- Overlays now visible in ALL scene modes, not just map (Issue 79, 81)
- Transcript rewritten from SRT-style subtitles to scrollable card stack (Issue 77)
- Latest card prominent with border/shadow; older cards fade to 40% opacity

## 2026-04-11 — Phase 7: Debug Tooling & Runtime Fixes
- Built `DebugDrawer.tsx` — slide-out panel with category filters, expandable details, copy-all (Issue 72)
- Added `document.execCommand('copy')` fallback for iframe contexts (Issue 73)
- Lightened map theme colors by ~40% — land/water/borders now distinguishable (Issue 74)
- Moved lesson-complete to `AnimatePresence` overlay so debug drawer stays accessible (Issue 75)
- Added image test presets dropdown in Canvas Workbench (Issue 76)
- Strip tool-call text from transcript via client-side regex (Issue 65)
- Fixed image scene race condition — set URL before scene mode switch (Issue 66)
- Added `map.getLayer()` guard for `highlight_region` calls (Issue 67)
- Added exponential backoff retry for Gemini 503 errors (Issue 68)
- Created `textFilter.ts` for stripping tool call syntax from narration
- Added `cush_region` alias to NAMED_LOCATIONS

## 2026-04-10 — Phase 6C: Runtime Stabilization Fixes
- **Issue 54 (transcript sync):** Text now appends when audio starts, not when beat_payload arrives
- **Issue 62 (visuals):** New `ImageScene` component renders full-bleed storybook images; beat JSON updated to 80/20 visual ratio (3 image beats + 1 map beat)
- **Issue 63 (continuity):** Narrator prompt rewritten with beat index, previous text context, and hard anti-greeting/recap rules
- **Issue 64 (restart loop):** `statusRef` set to `'ended'` immediately on `lesson_complete`, blocking reconnection
- **PROMPTS.md:** Collapsed from 916 lines to ~80 lines; all completed phases summarized as one-liners
- **Action required:** Redeploy agent to Cloud Run

## 2026-04-10 — Phase 6C: Full Lesson Runtime Audit
- Audio confirmed working in real user lesson runs end-to-end
- User captured a full beat-by-beat session showing four remaining blockers: transcript/audio desync, no visual scene rendering, beat-to-beat greeting/recap resets, and broken lesson ending / apparent restart
- **Decision:** Prioritize runtime stabilization before implementing the full teaching-philosophy-driven LessonPreparer pipeline

## 2026-04-10 — Phase 6B: TTS Provider Migration & Pacing Hardening
- **TTS pivot (Issue 61)**: Replaced Google Cloud TTS (`GOOGLE_TTS_KEY`) with Gemini TTS (`gemini-2.5-flash-preview-tts`) — uses existing `GEMINI_API_KEY`, no new secrets
- Voice: `Charon` (warm informative narrator)
- Beat Sequencer dwell time: if TTS fails, agent waits ~150 WPM reading pace before advancing
- Frontend fallback: browser `speechSynthesis` speaks beat text if server audio is empty
- Frontend dwell time: if no speech synthesis available, text dwells on screen proportional to word count
- **Action required:** Redeploy agent to Cloud Run

## 2026-04-09 — Phase 6: Frontend Bug Fixes, Audit & Model Upgrade
- Fixed missing `RecordedEvent` type in `types.ts` (Issue 57 — build blocker)
- Fixed empty PCM audio chunks causing `createBuffer(0)` errors in `playAudioChunk` (Issue 58)
- Resolved Issues 52, 53 (architectural — superseded by Beat Sequencer)
- **Root cause of Issue 59 found**: `gemini-2.0-flash-exp` model returns 404, causing empty narration → premature `lesson_complete`
- **Model upgrade (Issue 60)**: `GenAINarrator` → `gemini-3-flash-preview`, `GeminiSession` Live → `gemini-3.1-flash-live-preview`
- Full phase audit: Phases 1–4 verified complete, Phase 5 partial, Phase 6 in progress
- **Action required:** Redeploy agent to Cloud Run

## 2026-04-08 — Phases 3–4: Beat Sequencer & Live Q&A Complete
- Beat Sequencer (`beatSequencer.ts`) iterates beats, calls Gemini `generateContent` per beat, streams transcript + tool calls
- ContentLoader, TTSService, ContentFetcher implemented
- HistorySessionController state machine manages sequencer ↔ live Q&A transitions
- LiveHandler (`liveHandler.ts`) opens short Gemini Live sessions for Band 3+ Q&A on `raise_hand`
- Agent deployed to Cloud Run

## 2026-04-07 — Beat Sequencer Pivot
- **Decision:** Pivot from Gemini Live narration to Beat Sequencer architecture
- **Reason:** Gemini Live audio-native model cannot produce structured text, reliable tool calls, or clean transcripts. It is designed for conversational ping-pong, not 10–15 minute autonomous narration.
- **What stays:** Entire frontend (SessionCanvas, TranscriptView, TeachingCanvas, useSession, toolCallHandler), WebSocket protocol, GeoJSON data, content manifest
- **What changes:** Agent side — replace GeminiSession Live with BeatSequencer using regular generateContent streaming API. Gemini Live reserved for student Q&A only (Band 3+).
- Archived: `ARCHITECTURE_LIVE.md` → `.antigravity/archive/`, `JULES_PLAN_PHASE21.md` → `.antigravity/archive/`
- Updated: ROADMAP.md with 6-phase Beat Sequencer plan, ISSUES.md with architectural diagnosis (issues 52–56)

---

## Pre-Beat-Sequencer Phases (Summary)

- Built math curriculum engine with DAG system, 377 constraint templates across 5 strands
- Evidence Witness (Gemini Live bidi-streaming agent) for watching children do math
- Split Judgment Model, AI Permission Rules, Noise Injection system
- **Decision:** Pivot to African History. All math code archived, not deleted.

| Phase | When | What |
|-------|------|------|
| 2 | Mar 11 | Auth: D1 schema, JWT sessions, magic link, Google OAuth, PBKDF2 passwords, account linking |
| 3 | Mar 11 | History schema: 6 D1 tables, R2 content pipeline, Dashboard/TopicDetail/LessonView |
| 4 | Mar 12 | AI adaptation: Band adaptation via Gemini 2.5 Flash, Adapted_Content cache |
| 5 | Mar 12 | Assessment: Oral Examiner (Socratic), exam sessions, artifact verification |
| 6 | Mar 12 | Explainer canvas: MapOverlay, Timeline, FigurePrimitives, agent integration |
| 7 | Mar 13 | Worker cleanup: monolithic split to modular routes, Families table |
| 8 | Mar 14 | Pilot readiness: content pipeline scripts, admin analytics, onboarding wizard |
| 9 | Mar 15 | Content expansion: glossary system, world history context sidebars |
| 10 | Mar 16 | UI/UX overhaul: global learner store (Zustand), unified AppShell |
| 11 | Mar 17 | Post-merge cleanup: progress page, loadFamily() resilience, stripMarkdown() |
| 12 | Mar 18 | Data quality: D1 migration 014, reading polish, error handling |
| 13 | Mar 18 | Content production: 30 SVG map overlays, pronunciation dictionary, component data |
| 14 | Mar 19 | SVG alignment tool |
| 15 | Mar 20 | Session engine: LessonScript, ScriptPlayer, StorybookPlayer, 9 visual components |
| 16 | Mar 22 | MapLibre: TeachingCanvas (16A), GeoJSON all 9 chapters (16B), agent tool rewrite (16C) |
| 20 | Mar 31 | Live-first pivot: deleted ScriptPlayer, created SessionCanvas, ARCHITECTURE_LIVE.md |
| 21–25 | Apr 1–3 | useSession, TranscriptView, agent WS fix, StorybookPlayer redesign, Golden Script |

---

*This document is the single source of truth for decisions. Update it as decisions change.*

## 2026-04-20 — Phase 1: Sandwich Lite (Gatekeeper + Negotiator)
- Added Live conversational slice prompts: `agent/src/prompts/gatekeeper.ts` and `agent/src/prompts/negotiator.ts`.
- Added `SessionLifecycle` state machine (`agent/src/sessionLifecycle.ts`) with slice transitions and timeout-backed handoffs.
- Extended live tool handling with `complete_gatekeeper` and `complete_negotiator` through `LiveConversationHandler`.
- Updated history session orchestration to run Bands 2+ as Gatekeeper → Performer → Negotiator and keep Bands 0–1 performer-first behavior.
- Added beat summary capture in `BeatSequencer` for negotiator context and hooked completion chaining via `onLessonComplete`.
- Frontend now tracks `activeSlice`, buffers per-slice live transcripts, routes left panel to `LiveConversationView`, and shows top-bar slice pill.
- Added transcript cards for Gatekeeper and Negotiator streams while preserving existing beat + completion cards.

## 2026-04-20 — Phase 1D: Adaptive Scaffolding + Telemetry + Pilot Polish
- Added a session-level adaptive scaffolding tracker with rolling 5-signal average, activation below 0.50, and deactivation above 0.70 with hysteresis protection.
- Wired live `scaffolding_change` signaling so frontend can present a neutral “Easy Mode” indicator when support mode activates.
- Updated performer pacing in scaffolding mode: narration prompt simplification and beat cooldown overrides sent via `beat_payload.cooldownMs`.
- Added assignment telemetry write path: new `assignment_telemetry` migration, service-key protected Worker endpoint, and best-effort session-end agent POST.
- Polish shipped: top-bar slice pill crossfade keyed by active slice, negotiator transcript card now correctly flips to Done on `negotiator_complete`, and assignment artifacts can be inspected via ArtifactInspector.
- Audit note: listed C1 parent-assignment modal files are not present in this repo tree; no code change applied for those paths.
