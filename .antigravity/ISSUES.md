# Learn Live — Issue Tracker

> **Last updated:** 2026-04-09

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

### 54. Audio Playback Lag / Delayed Speech
- **Status:** OPEN — MEDIUM
- **Description:** Audio chunks queue up and play minutes after the corresponding transcript appears. The `nextPlayTimeRef` scheduling in `useSession.ts` allows unbounded drift.
- **Fix:** Add a lag guardrail in `playAudioChunk` — if `nextPlayTimeRef` exceeds `currentTime + threshold`, reset to `currentTime`. Will be re-verified after Beat Sequencer produces audio via TTS.

### 55. Transcript Not Scrollable
- **Status:** OPEN — MEDIUM
- **Description:** `TranscriptView` replaces text rather than scrolling. Long sessions have no way to review earlier content.
- **Fix:** Phase 6 (Frontend Integration & Polish) — add scrollable transcript history.

### 56. No Microphone for Band 2
- **Status:** OPEN — LOW (by design)
- **Description:** `useSession.ts` line 102: `if (band < 3) return;` — Band 2 learners are listen-only. This is correct for the Beat Sequencer model (no Q&A for young learners). The agent prompt must not ask questions that require verbal response from Band 2.
- **Fix:** Handled by Beat Sequencer prompt design — narration-only for Band 2, no Socratic pauses.

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
- Issue 54 will be re-evaluated once TTS audio replaces native audio model output.
- Issues 57–58 were build/runtime bugs fixed in Phase 6.
