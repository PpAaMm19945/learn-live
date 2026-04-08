# Learn Live — Roadmap

> **Canonical location:** `.antigravity/ROADMAP.md`
>
> This file is a pointer. The full roadmap with all phases, architecture decisions, and definitions of done lives at [`.antigravity/ROADMAP.md`](.antigravity/ROADMAP.md).

## Current Status (April 2026)

**Architecture:** Beat Sequencer — regular Gemini streaming API for lesson narration (one call per teaching beat), Gemini Live reserved for student Q&A only.

**Current phase:** Phase 4 — Live Handler for Student Q&A.

**Previous approach (archived):** Gemini Live for all narration was superseded because the audio-native model does not produce structured text output, tool calls, or transcripts. See `.antigravity/archive/roadmap-live-agent-approach.md` and `.antigravity/archive/ARCHITECTURE_LIVE.md`.

## Active Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | Three Isolation Tests | ✅ Complete |
| 2 | Beat Data Schema | ✅ Complete |
| 3 | Beat Sequencer (agent) | ✅ Complete |
| 4 | Live Handler for Q&A | **Next** — prompts written |
| 5 | Content Pipeline | Not started |
| 6 | Frontend Integration & Polish | Not started |

All phases are strictly sequential. See `.antigravity/ROADMAP.md` for full details.
