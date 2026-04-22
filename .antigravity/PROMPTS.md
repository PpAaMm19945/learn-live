# Learn Live — Prompt Execution Log

> **Last updated:** 2026-04-21
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

### Phase 6C — Runtime Stabilization ✅ COMPLETE
Four runtime issues identified and fixed:
1. **Beat continuity** — Narrator prompt rewritten with beat index context and anti-greeting rules.
2. **Transcript-audio sync** — Text now appends when audio starts, not when beat_payload arrives.
3. **Image scene** — Implemented `ImageScene` component; beats 1-3 now show storybook illustrations (80/20 visual ratio).
4. **Lesson restart loop** — `statusRef` set immediately on `lesson_complete` to block reconnection.

---

## Post-Beat-Sequencer Stabilization

### Phase 7 — Debug Tooling & Runtime Fixes ✅ COMPLETE
- DebugDrawer with category filters, expandable details, copy-all
- Clipboard fallback for iframe contexts
- Map theme lightened, lesson-complete overlay fix
- Tool-call text stripping (client + agent), image scene race condition fix
- `highlight_region` guard, Gemini 503 retry with exponential backoff

### Phase 8 — Overlay System & Transcript Cards ✅ COMPLETE
- Extracted overlays from TeachingCanvas into `CanvasOverlays.tsx` at SessionCanvas level
- Overlays now visible in all scene modes (not just map)
- Transcript rewritten to scrollable card stack
- Sequential overlay queue — one overlay at a time, 15s dwell, auto-advance
- Image thumbnail system for storybook images

### Phase 9 — Overlay Positioning & Map Interactivity ✅ COMPLETE
- Unified all small overlays to shared bottom-left card slot
- Removed casual emojis, replaced with styled text labels
- Image thumbnail: `aspect-square object-contain`, removed 20s auto-dismiss
- AutoScrollMap: scroll-wheel zoom (1x-4x), pinch-to-zoom, 2D drag panning

---

## Phase 7 — Band Differentiation (3 Sprints)

> Full spec in `.antigravity/ROADMAP.md`. Architecture inputs in `docs/architecture/band-differentiation-*.md`.

### Sprint 1 — Core Agent Differentiation 🔜 NEXT
- [ ] Create `agent/src/bandConfig.ts` with `BandProfile` for all 6 bands
- [ ] Implement `applyBandToolPolicy()` in `beatSequencer.ts`
- [ ] Inject word/sentence/vocabulary constraints into `buildNarrationPrompt`
- [ ] Add band-specific TTS voice and rate in `tts.ts`
- [ ] Implement Theology Gate with concept unlock table
- [ ] Add visual mix telemetry logging

### Sprint 2 — Frontend Delivery Modes
- [ ] Build `StoryBookPlayer.tsx` for Bands 0-1
- [ ] Route branching: Band ≤ 1 → StoryBookPlayer, Band ≥ 2 → SessionCanvas
- [ ] New interaction tools: `show_comprehension_check`, `show_debate_prompt`, `show_essay_prompt`
- [ ] Per-band interaction policy in `HistorySessionController`

### Sprint 3 — Quality & Testing
- [ ] Update `beat-schema.md` with per-band tool constraints
- [ ] Build manifest lint script (`agent/scripts/lint-manifest.ts`)
- [ ] Snapshot tests for tool filtering across all 6 bands
- [ ] Comprehension scoring tracker (`agent/src/comprehensionTracker.ts`)

---

## Teaching Philosophy Pipeline (Planned)

> See `docs/TEACHING_PHILOSOPHY.md` for the full 5-phase pipeline spec.
> Implementation deferred until Band Differentiation Sprint 1 is deployed and verified.

| Phase | Purpose | Status |
|-------|---------|--------|
| Phase 0 | Profile Intake — student age/band/prior knowledge | Planned |
| Phase 1 | Theological Framing — covenant principles, Africa connection | Planned |
| Phase 2 | Lesson Architecture — 4-beat hook/story/theology/question structure | Planned |
| Phase 3 | Draft Generation — age-adapted narration, no sermon language | Planned |
| Phase 4 | Critique — preachy check, forced-connection check, engagement check | Planned |
| Phase 5 | Finalize — output to beatSequencer | Planned |

---

## Ch01 Image Wiring (2026-04-16)

### Phase: Final wiring of 22 Nano Banana 2 images
**Prompt:** "Please go ahead and execute the plan. And do not forget to update all documentation files in the .antigravity folder."

### Steps executed (no LLM prompt — direct code edits)
1. **`agent/src/imageRegistry.ts`**: Inserted 22 entries after the band1 storybook block. Categorized:
   - Geographic (8): `geo_*.jpg` — Heinrich Berann panoramas, `minBand:2 maxBand:5`
   - Artistic-narrative (12): `art_*.jpg` — Turner-style oil paintings, `minBand:2 maxBand:5`
   - Documentary/scholarly (2): `art_taharqa_pharaoh.jpg`, `doc_curse_myth_analysis.jpg` — `minBand:4 maxBand:5`
2. **`docs/curriculum/history/ch01_s0{1..5}.json`**: Programmatic patch via `/tmp/manifest-patches/patch.mjs`:
   - 12 image-mode beats received `bandOverrides` for bands 2-5
   - 48 band-specific image swaps total
   - Narrower band-ranges (4-5) win over wider (2-5) so e.g. Cush beats show `art_taharqa_pharaoh.jpg` to Bands 4-5 only
3. **Lint:** `npx tsx agent/scripts/lint-manifest.ts` per file → 0 errors, 343 pre-existing band-policy warnings (filed as Issue #91)

## Sandwich Lite (Phase 1) — Apr 2026

Implemented the Sandwich Lite orchestration for Bands 2–5 with Gatekeeper (pre-lesson live readiness), Performer (`BeatSequencer` lesson body), and Negotiator (post-lesson live reflection), while keeping Bands 0–1 on performer-only flow; chose voice/persona continuity across slices, and explicitly deferred homework persistence and assignment storage to Phase 1C.

## Phase 1D — Adaptive Scaffolding
Implemented a rolling-window comprehension approach where the session tracks the latest five scored interaction signals and only evaluates scaffolding once at least three signals exist; support mode activates when average drops below 0.50 and clears only once performance rises above 0.70 (with hysteresis guard at 0.65 to reduce mode flapping). Frontend framing is intentionally neutral ("Easy Mode") to keep the intervention pedagogically supportive rather than alarming.

## Phase 1.5 & 1.6 — Lifecycle Stabilization (2026-04-21)

- **Phase 1.5 (Lifecycle Stabilization):** Hardened the resume protocol, added the performer-drain handshake, and removed the 60s stale override. Navigation updated for Chapter 1 testing.
- **Phase 1.6 (Failure UX + Scoring Fix):** Surfaced live slice failures via toasts and system cards. Implemented server-side `onNegotiatorComplete` hook to ensure scoring on natural completion. Converted Dashboard to data-driven chapter readiness.

## Audio Engine Recovery (2026-04-21)

Restored the core audio engine by splitting playback into two distinct contracts:

- **Live Stream Scheduling**: Uses `scheduleLiveChunk` for small native-audio chunks. Resolves immediately for gapless scheduling. Managed via `liveStreamGenerationRef` and tracked in `currentLiveSourcesRef` for immediate teardown on slice transitions.
- **Performer Playback**: Uses `playBeatAudio` for complete beat blobs. Resolves only when audio actually ends, ensuring beat synchronization and correct cooldown timing.
- **Hard Teardown**: `flushAudioQueue` now stops all active live sources and resets the scheduler clock, preventing audio bleed across slices.

- **Resume protocol**: `resumeToken` parsed from WS URL as primary session lookup key; 60-second stale override deleted; gatekeeper skipped on valid resume.
- **Performer-drain handshake**: Server emits `performer_complete` and enters `AWAITING_NEGOTIATOR_START` phase. Client sends `performer_drain_complete` only after beat queue + audio fully drain. Only then does the negotiator start.
- **Negotiator self-finalization**: `startNegotiator()` calls `completeNegotiator()` after the live slice ends naturally, ensuring `slice_change: complete` and `session_complete` always emit.
- **Failure-aware slices**: `LiveConversationHandler` tracks `completionReason` (success/timeout/connect_failed/model_error) and emits `live_slice_fallback` or `live_slice_error` before the lifecycle-advancing event.
- **Chapter 1 test harness**: TopicDetail routes to `/play/${playId}` instead of dead `/lessons/:id`. Dashboard derives next lesson URL from progress data. Chapter tiles navigate to topic detail page.
- **Model baseline retained**: `gemini-2.5-flash-native-audio-latest` for live slices; `gemini-1.5-flash` for narration. No model changes.
