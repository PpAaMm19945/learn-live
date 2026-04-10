# Learn Live — Issue Tracker

> **Last updated:** 2026-04-10

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
| 53 | Thinking Text Mixed with Transcript | Eliminated — Beat Sequencer uses `generateContent` (clean text), no `outputAudioTranscription` parsing | Phase 3 |
| 57 | `RecordedEvent` type missing from `types.ts` | Added interface to `types.ts` | Phase 6 |
| 58 | Empty PCM audio chunks cause `createBuffer(0)` errors | Added empty-string guard in `playAudioChunk` | Phase 6 |

---

## Open Issues

### 54. Transcript / Audio Synchronization Drift
- **Status:** OPEN — HIGH
- **Description:** Audio is now present, but the transcript still needs to be adjusted to the audible pacing. The learner sees text advancing independently of the spoken beat, so the visual truth and audio truth diverge.
- **Likely cause:** `beat_payload` text is rendered immediately while audio playback and/or dwell continue asynchronously. The older `nextPlayTimeRef` drift risk in `useSession.ts` may still contribute when audio queues back up.
- **Fix:** Make audio completion (or explicit dwell fallback) the pacing authority for beat advancement. Add the lag guardrail in `playAudioChunk`, and ensure transcript progression is keyed to actual playback lifecycle rather than immediate receipt alone.

### 55. Transcript Not Scrollable
- **Status:** OPEN — MEDIUM
- **Description:** `TranscriptView` replaces text rather than scrolling. Long sessions have no way to review earlier content.
- **Fix:** Phase 6 (Frontend Integration & Polish) — add scrollable transcript history.

### 56. No Microphone for Band 2
- **Status:** OPEN — LOW (by design)
- **Description:** `useSession.ts` line 102: `if (band < 3) return;` — Band 2 learners are listen-only. This is correct for the Beat Sequencer model (no Q&A for young learners). The agent prompt must not ask questions that require verbal response from Band 2.
- **Fix:** Handled by Beat Sequencer prompt design — narration-only for Band 2, no Socratic pauses.

### 62. Visual Tool Calls Not Rendering; Commands Leak Into Transcript
- **Status:** OPEN — HIGH
- **Description:** In real lesson runs, the visual teaching layer is not appearing. User screenshots show literal command text such as `show_scripture("Genesis 1:1")`, `show_timeline([...])`, and `set_scene("image", ...)` inside the transcript surface instead of visible scene changes.
- **Likely cause:** Broken separation between narration text and visual instruction channel — either the model is emitting tool syntax as plain text, the frontend is not dispatching `toolCalls` from `beat_payload`, or `set_scene` / canvas execution is failing at runtime.
- **Fix:** Audit the beat payload pipeline end-to-end. Spoken text must never contain executable tool syntax. `toolCalls` must be dispatched separately and `set_scene` must switch visual mode before map / overlay tools execute.

### 63. Beat Continuity Broken — Fresh Greeting / Recap Each Beat
- **Status:** OPEN — HIGH
- **Description:** From the learner's perspective, the narrator pauses and then starts again with a greeting and recap, as if each beat were a new lesson on a different day. This breaks immersion and makes the lesson feel stitched together.
- **Likely cause:** Each beat is narrated too independently, without hard continuity guardrails. The prompt likely allows or encourages reorientation language on every beat.
- **Fix:** Add explicit same-lesson continuity instructions to the narrator prompt: no greetings, no fresh introductions, no summary reset, and no recap unless the beat is intentionally marked as recap / wrap-up. Include concise prior-beat context so the next beat can continue naturally.

### 64. Lesson Ending Broken / Apparent Restart After Completion
- **Status:** OPEN — HIGH
- **Description:** The ending is not landing correctly. In at least one full run, the agent appeared to restart from the beginning after the lesson finished. User evidence also shows the client receiving a lesson-finished signal.
- **Likely cause:** `lesson_complete` is arriving, but frontend session state, queued beats/audio, reconnect logic, or replay state is not being treated as terminal and idempotent.
- **Fix:** Make `lesson_complete` a hard terminal state. Clear beat/audio queues, cancel timers and animation frames, prevent stale reconnect/restart logic from reopening playback, and verify that the end screen consumes the terminal state exactly once.

### 59. Session Shows "Session Ended" Prematurely
- **Status:** RESOLVED
- **Description:** Lesson text appeared cut off; the canvas showed "Session Ended" before all beats were displayed. Root cause: `GenAINarrator` used deprecated model `gemini-2.0-flash-exp` which returned 404 on every `generateContent` call, causing the sequencer to produce no narration and immediately signal `lesson_complete`.
- **Fix:** Upgraded `GenAINarrator` model to `gemini-3-flash-preview` and `GeminiSession` Live model to `gemini-3.1-flash-live-preview`. Requires agent redeploy.

### 60. Gemini Model Upgrade — 2.x → 3.x
- **Status:** RESOLVED
- **Description:** Both AI models were outdated. `gemini-2.0-flash-exp` (REST narration) returned 404. `gemini-2.5-flash-native-audio-latest` (Live Q&A) was functional but superseded.
- **Fix:** `GenAINarrator` → `gemini-3-flash-preview`, `GeminiSession` → `gemini-3.1-flash-live-preview`. Both use `v1beta` endpoint.

### 61. No Audio — Google Cloud TTS Key Missing
- **Status:** RESOLVED
- **Description:** `GOOGLE_TTS_KEY` was never added to Cloud Run secrets. TTS returned null for every call, causing beats to fire instantly with no pacing, leading to premature lesson end.
- **Fix:** Replaced Google Cloud TTS entirely with Gemini TTS (`gemini-2.5-flash-preview-tts`) using existing `GEMINI_API_KEY`. Added dwell-time safety net in both agent (beat sequencer) and frontend (browser `speechSynthesis` fallback + text dwell).

---

## Notes
- Issues 52–53 are the architectural diagnosis that triggered the Beat Sequencer pivot. Now resolved.
- Issues 47–51 are now resolved but the underlying architecture was wrong — working connections to a broken narration model.
- Issue 54 is now a user-visible transcript/audio truthfulness problem, not merely a silent-audio problem.
- Issues 62–64 were captured from a full real-user lesson run after audio was restored; these are the current Phase 6 blockers.
- Issues 57–58 were build/runtime bugs fixed in Phase 6.
