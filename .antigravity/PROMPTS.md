# Learn Live — Prompt Execution Log

> **Last updated:** 2026-04-10
> Consolidated record of all prompts executed across all phases.

---

## Legacy Phases (Summary)

| Phase | What | When |
|-------|------|------|
| 1–7 | Math curriculum engine, DAG, constraints, auth, schema | Feb–Mar 2026 |
| 8–14 | Content pipeline, analytics, onboarding, SVGs, alignment tool | Mar 2026 |
| 15 | Session engine (ScriptPlayer, StorybookPlayer, 9 components) | Mar 20 |
| 16A/B/C | MapLibre TeachingCanvas, GeoJSON (all 9 chapters), agent tool rewrite | Mar 22–24 |
| 20 | Live-First Pivot (deleted ScriptPlayer pipeline, created SessionCanvas) | Mar 31 |
| 21–25 | SessionCanvas wiring, TranscriptView, agent WS fix, StorybookPlayer, Golden Script | Apr 1–3 |

Full prompt details for Phases 1–25 archived. See `.antigravity/archive/JULES_PLAN_PHASE21.md` for Phase 21–25 prompts.

---

## Beat Sequencer Architecture

### Phase 1 — Isolation Tests ✅ COMPLETE
Three standalone scripts proving: (A) Gemini `generateContent` produces clean narration + tool calls, (B) WebSocket tool calls render on TeachingCanvas, (C) base64 PCM audio plays in browser. Files: `agent/tests/test-narration.ts`, `test-fake-toolcall.ts`, `test-audio-playback.ts`.

### Phase 2 — Beat Data Schema ✅ COMPLETE
Beat/SectionManifest JSON schema with `syncTrigger: "start_of_beat"`, Young Earth anchoring, `reformedReflection` fields. Files: `docs/curriculum/history/beat-schema.md`, `ch01_s01.json`.

### Phase 3 — Beat Sequencer (Agent) ✅ COMPLETE
Core sequencer loop, GenAINarrator (Gemini REST), TTSService (Gemini TTS), beat_payload atomic delivery. Files: `agent/src/beatSequencer.ts`, `content.ts`, `tts.ts`, `gemini.ts`.

### Phase 4 — Live Q&A Handler ✅ COMPLETE
LiveQAHandler with pause/resume, 2-minute hard cap, Band 3+ gating, fail-safe resume. Files: `agent/src/liveHandler.ts`, `historyExplainerSession.ts`, `historySessionController.ts`.

### Phase 5 — Content Pipeline ✅ COMPLETE
ContentFetcher (local/remote), Worker R2 endpoint, service key auth. Files: `agent/src/contentFetcher.ts`, `worker/src/routes/content.ts`.

### Phase 6 — Frontend Integration ✅ COMPLETE
Section-level lesson picker, lesson complete screen, progress recording, end-to-end flow verification.

### Phase 6B — TTS Migration ✅ COMPLETE
Migrated from Google Cloud TTS (`GOOGLE_TTS_KEY`) to Gemini TTS (`gemini-2.5-flash-preview-tts`). Zero new secrets needed — uses existing `GEMINI_API_KEY`.

### Phase 6C — Runtime Stabilization 🔧 IN PROGRESS
Four runtime issues identified and fixed:
1. **Beat continuity** — Narrator prompt rewritten with beat index context and anti-greeting rules.
2. **Transcript-audio sync** — Text now appends when audio starts, not when beat_payload arrives.
3. **Image scene** — Implemented `ImageScene` component; beats 1-3 now show storybook illustrations (80/20 visual ratio).
4. **Lesson restart loop** — `statusRef` set immediately on `lesson_complete` to block reconnection.

---

## Teaching Philosophy Pipeline (Planned)

> See `docs/TEACHING_PHILOSOPHY.md` for the full 5-phase pipeline spec.
> Implementation deferred until Phase 6C stabilization is deployed and verified.

| Phase | Purpose | Status |
|-------|---------|--------|
| Phase 0 | Profile Intake — student age/band/prior knowledge | Planned |
| Phase 1 | Theological Framing — covenant principles, Africa connection | Planned |
| Phase 2 | Lesson Architecture — 4-beat hook/story/theology/question structure | Planned |
| Phase 3 | Draft Generation — age-adapted narration, no sermon language | Planned |
| Phase 4 | Critique — preachy check, forced-connection check, engagement check | Planned |
| Phase 5 | Finalize — output to beatSequencer | Planned |
