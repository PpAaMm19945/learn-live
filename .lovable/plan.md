# Plan: Agent Stability and Session Resilience — IMPLEMENTED

## What Was Done

### Phase A: Stop the Bleeding ✅
- **A1**: Ping/pong heartbeat (25s interval) added to `server.ts` for all WebSocket servers
- **A2**: `sessionStore.ts` created — in-memory Map with 20min TTL, GC every 5min
- **A3**: `historyExplainerSession.ts` now checks session store on connect; resumes from checkpoint if available, skipping the full pipeline
- **A4**: `useSession.ts` stores `resumeToken` from server and sends it on reconnect

### Phase B: Eliminate Dead Air ✅
- **B1**: `beatSequencer.ts` rewritten with look-ahead buffer (depth 1-2). Producer prepares Beat N+1 while Beat N plays. New `startFromIndex()` method for resume.
- **B2**: `lessonPreparer.ts` collapsed phases 0-2 into a single AI call. Phase 4 critique is now optional (skipped for bands 0-2).

### Phase C: Prompt Truthfulness ✅
- **C1**: `historyExplainerTools.ts` now exports `buildNarrationPrompt()` — a clean narration-only prompt with no tool references. The full tool-aware prompt (`buildHistoryExplainerPrompt`) is preserved for the LessonPreparer.

### Phase D: Cloud Run Configuration ✅
- **D1**: `cloudbuild.yaml` updated with `--session-affinity`, `--timeout=900`, `--cpu-boost`

## Files Changed
| File | Change |
|---|---|
| `agent/src/server.ts` | Ping/pong heartbeat |
| `agent/src/sessionStore.ts` | **New** — session cache |
| `agent/src/historyExplainerSession.ts` | Resume logic + checkpoint |
| `agent/src/beatSequencer.ts` | Look-ahead buffer + startFromIndex |
| `agent/src/lessonPreparer.ts` | Collapsed phases 0-2, optional phase 4 |
| `agent/src/historyExplainerTools.ts` | Split prompts |
| `agent/cloudbuild.yaml` | Session affinity + timeout + cpu-boost |
| `src/lib/session/useSession.ts` | resumeToken storage + reconnect |

## Next Steps
Deploy the agent: `cd agent && gcloud builds submit --config=cloudbuild.yaml --project=learn-live-488609`
