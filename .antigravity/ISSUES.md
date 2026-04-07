# Learn Live — Issue Tracker

> **Last updated:** 2026-04-07

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
| 47 | Agent WebSocket Connection Broken | Resolved in Phase 23 (connection works, but architecture was wrong) | 23 |
| 48 | SessionCanvas Not Wired to useSession Hook | Resolved in Phase 21 | 21 |
| 49 | TranscriptView Kinetic Typography Not Built | Resolved in Phase 22 | 22 |
| 50 | TeachingCanvas Not Integrated into SessionCanvas | Resolved in Phase 21 | 21 |
| 51 | StorybookPlayer Images Assume Landscape Layout | Resolved in Phase 24A | 24A |

---

## Open Issues

### 52. Gemini Live API Cannot Serve as Lesson Narrator
- **Status:** OPEN — CRITICAL (architectural)
- **Description:** The audio-native model (`gemini-2.5-flash-native-audio-latest` with `responseModalities: ['AUDIO']`) does not produce structured text, reliable tool calls, or clean transcripts. `outputAudioTranscription` is speech-to-text of what the model spoke — not structured output. The model is designed for conversational ping-pong, not 10–15 minute autonomous narration. This was the root cause of all Phase 21–23 testing failures.
- **Fix:** Beat Sequencer architecture (Phases 1–6 of new roadmap). Regular `generateContent` streaming API for narration, Gemini Live reserved for student Q&A only.

### 53. Thinking Text Mixed with Transcript
- **Status:** OPEN — HIGH
- **Description:** The `**bold**` regex in `gemini.ts` catches the model's natural emphasis markers in audio transcription, misclassifying them as "thinking" tokens. Remaining non-bold text from `outputAudioTranscription` leaks into the transcript view.
- **Root cause:** `outputAudioTranscription` is not a structured output — it's a speech transcript that includes the model's formatting habits. There is no reliable way to separate "thinking" from "spoken" in this stream.
- **Fix:** Eliminated by Beat Sequencer — regular `generateContent` produces clean text output. No `outputAudioTranscription` parsing needed.

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

---

## Notes
- Issues 52–53 are the architectural diagnosis that triggered the Beat Sequencer pivot.
- Issues 47–51 are now resolved but the underlying architecture was wrong — working connections to a broken narration model.
- Issue 54 will be re-evaluated once TTS audio replaces native audio model output.
