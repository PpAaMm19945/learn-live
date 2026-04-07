# Learn Live — Archived Roadmap (Live-Agent-First Approach)

> **Archived:** 2026-04-07
> **Reason:** This roadmap assumed the Gemini Live API (`gemini-2.5-flash-native-audio-latest` with `responseModalities: ['AUDIO']`) would handle all lesson narration, tool calls, and transcripts in a single autonomous session. After extensive implementation and testing (Phases 20–23), we discovered that the audio-native model does not produce structured text output or reliable tool calls — it outputs audio + internal thinking tokens only. The "hello world" diagnostic breakdown was not a code bug; it was a fundamental mismatch between the Live API's conversational design and our lesson-narration use case.
>
> **Superseded by:** `.antigravity/ROADMAP.md` (Beat Sequencer architecture — regular Gemini streaming API for narration, Gemini Live reserved for student Q&A only).

---

> **Original last updated:** 2026-03-31

## What was attempted (Phases 20–25)

- **Phase 20 (completed):** Live-First Pivot — deleted ScriptPlayer pipeline, created SessionCanvas, added `set_scene` tool
- **Phase 21 (completed):** Wired SessionCanvas to useSession WebSocket hook, integrated TeachingCanvas, added golden script fallback
- **Phase 22 (completed):** TranscriptView kinetic typography component
- **Phase 23 (completed):** Agent WebSocket connection, structured logging, kickoff/nudge timers
- **Phase 24A:** StorybookPlayer split-screen (pending)
- **Phase 24B:** Dashboard & page cleanup (pending)
- **Phase 25:** Golden Script recording infrastructure (implemented but untested with real content)

## What we learned

1. `gemini-2.5-flash-native-audio-latest` with `responseModalities: ['AUDIO']` produces audio output but **does not produce text in `modelTurn.parts`**. The only text returned is `outputAudioTranscription` — a transcription of what the model spoke, not structured output.
2. Tool calls do not fire reliably from the audio model. The model was designed for conversational ping-pong, not 10–15 minute autonomous narration.
3. The `**bold**` regex in `gemini.ts` that parsed "thinking" was catching the model's natural emphasis markers in the audio transcription, stripping content from the transcript.
4. Audio playback (`playAudioChunk` in `useSession.ts`) works correctly when audio actually arrives.
5. The frontend (SessionCanvas, TranscriptView, TeachingCanvas, toolCallHandler, useSession) is correct and complete — it is waiting for real, structured content to flow through it.

## What carried forward

- All frontend components (no changes needed)
- The 11-tool MapLibre API (zoom_to, highlight_region, etc.)
- The WebSocket message protocol (tool_call, transcript, audio)
- The content manifest with chapter/section structure
- The GeoJSON data for all 9 chapters
- The golden script recording/playback hooks (will be re-verified)

## What was discarded

- The assumption that one Gemini Live session can narrate an entire lesson autonomously
- The "kickoff + pray" agent pattern (send one message, hope model talks for 15 minutes)
- The hello-world diagnostic prompt in `historyExplainerSession.ts`
