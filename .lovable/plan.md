

# Agent Stability and Session Resilience Plan

## Problem Summary

Three root causes are confirmed by both Codex and Jules:

1. **WebSocket dies mid-lesson** (code 1006). Cloud Run has a 300s timeout, but no ping/pong keepalive exists. The sequential beat pipeline (narrate + TTS = 30-40s per beat) creates long silent periods where no frames are exchanged, so the infrastructure kills the connection.

2. **Reconnect restarts everything**. `handleHistoryExplainerSession` creates brand-new `ContentFetcher`, `LessonPreparer`, `BeatSequencer` per WebSocket connection. On reconnect, the 67s pipeline re-runs and the lesson starts from Beat 0 again.

3. **Sequential beat generation blocks playback**. Each beat does: narrator call (~10s) → TTS call (~7-10s with throttle) → send. The student hears nothing while the next beat is being prepared.

---

## Implementation: Phase A — Stop the Bleeding (3 files, agent-only)

### A1. Ping/Pong Heartbeat (`agent/src/server.ts`)
- Add a 25-second interval ping from server to each WebSocket client.
- On pong timeout (10s), log warning but do not kill — Cloud Run infrastructure decides.
- Clear interval on close/error.
- This keeps the connection alive through Cloud Run's idle detection.

### A2. Session Runtime Store (`agent/src/sessionStore.ts` — new file)
- In-memory Map keyed by `${canonicalLessonId}:${learnerId}:${band}`.
- Stores: `preparedManifest`, `nextBeatIndex`, `previousNarratedText`, `completedBeatIds[]`, `createdAt`, `expiresAt` (20min TTL).
- Methods: `get()`, `set()`, `checkpoint(beatIndex, narratedText)`, `expire()`.
- Garbage-collect expired entries every 5 minutes.

### A3. Resume-Aware Session Handler (`agent/src/historyExplainerSession.ts`)
- On connect, check `SessionRuntimeStore` for an existing session.
- If found and not expired: skip `ContentFetcher` + `LessonPreparer`, bind the stored manifest to a new `BeatSequencer`, set `currentBeatIndex` to the checkpoint, send `pipeline_status: resuming`.
- If not found: run the full pipeline as today, then store the result.
- After each beat is sent, call `store.checkpoint(beatIndex, narratedText)`.
- Emit a `resumeToken` (the store key) to the client with each `beat_payload`.

### A4. Client Resume Token (`src/lib/session/useSession.ts`)
- Store the latest `resumeToken` from `beat_payload` messages.
- On reconnect, append `resumeToken` as a query parameter.
- On successful resume, skip the pipeline loading UI and go straight to playback.

---

## Implementation: Phase B — Eliminate Dead Air (2 files)

### B1. Look-Ahead Buffer in BeatSequencer (`agent/src/beatSequencer.ts`)
- Split `processBeat` into two stages: `prepareBeat` (narrator + TTS) and `deliverBeat` (send payload).
- Maintain a `preparedBuffer: BeatPayload[]` of depth 1-2.
- Producer loop: always stay 1 beat ahead — start preparing Beat N+1 as soon as Beat N is delivered.
- Consumer loop: deliver from buffer immediately when available, wait if not.
- On lesson start: prepare Beat 1, deliver it, immediately start preparing Beat 2.
- Net effect: dead air between beats drops from ~20s to near-zero after Beat 1.

### B2. Collapse Preparer Phases (`agent/src/lessonPreparer.ts`)
- Merge phases 0+1+2 into a single AI call that returns `{profile, theologicalFrame, lessonPlan}` in one JSON response. This cuts 3 sequential Gemini calls (~40s) down to 1 (~15s).
- Keep Phase 3 as context tagging (no change).
- Make Phase 4 (critique) optional — skip for bands 0-2 where the critique adds little value but costs 10s.
- Rename status messages: `phase_0` → `preparing`, remove intermediate phase statuses.
- Net effect: pipeline time drops from ~67s to ~25-30s.

---

## Implementation: Phase C — Prompt Truthfulness (1 file)

### C1. Split System Prompt (`agent/src/historyExplainerTools.ts`)
- The current prompt tells the narrator to use `set_scene()`, `zoom_to()`, etc. But `GenAINarrator` is a plain `generateContent` call — it cannot execute tools. Tool calls come from the manifest's pre-authored `toolSequence`. This mismatch wastes tokens and causes tool-syntax leakage into narration text.
- Create two separate prompts:
  - `buildNarrationPrompt()`: Voice, tone, theological guardrails, age-band depth, continuity rules. No tool references.
  - `buildToolPlannerPrompt()` (future): For when we want AI-driven tool choreography.
- Update `BeatSequencer` to use `buildNarrationPrompt()` for the narrator.
- Keep the full tool-aware prompt available for future Phase 3 "true draft generation."

---

## Implementation: Phase D — Cloud Run Configuration (1 file)

### D1. Update `cloudbuild.yaml`
- Add `--session-affinity` flag to the `gcloud run deploy` command.
- Increase `--timeout` to `900s` (15 minutes) to cover full lesson duration.
- Add `--cpu-boost` for faster cold starts.

---

## Files Changed Summary

| File | Change |
|---|---|
| `agent/src/server.ts` | Add ping/pong heartbeat interval |
| `agent/src/sessionStore.ts` | **New** — in-memory session cache |
| `agent/src/historyExplainerSession.ts` | Resume logic + checkpoint calls |
| `agent/src/beatSequencer.ts` | Look-ahead buffer producer/consumer |
| `agent/src/lessonPreparer.ts` | Collapse phases 0-2 into single call, optional phase 4 |
| `agent/src/historyExplainerTools.ts` | Split prompt into narration-only vs tool-planning |
| `agent/cloudbuild.yaml` | Session affinity + timeout + cpu-boost |
| `src/lib/session/useSession.ts` | Store/send resumeToken on reconnect |

## Priority Order

**Phase A first** (A1-A4). This alone stops the circling. Then B (eliminates dead air). Then C and D (polish). Phases A+B are the deployment that makes lessons completable end-to-end.

