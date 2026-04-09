

# Audit & Fix Plan — All Phases Complete, Two Live Issues

## Phase Audit Summary

| Phase | Name | Status | Verdict |
|-------|------|--------|---------|
| 1 | Isolation Tests | ✅ Complete | All 3 tests pass. Results documented. |
| 2 | Beat Data Schema | ✅ Complete | `beat-schema.md` exists with schema definition. `ch01_s01.json` authored. |
| 3 | Beat Sequencer (Agent) | ✅ Complete | `beatSequencer.ts`, `content.ts`, `tts.ts`, `contentFetcher.ts`, `historySessionController.ts`, `liveHandler.ts` all implemented. `historyExplainerSession.ts` wired to sequencer. Agent builds and deploys. |
| 4 | Live Q&A Handler | ✅ Complete | `liveHandler.ts` exists, `raise_hand` flow wired in session, `HistorySessionController` manages state. |
| 5 | Content Pipeline | Partial | `contentFetcher.ts` reads local files; Worker API endpoint not yet built. |
| 6 | Frontend Integration | Partial | SessionCanvas works but has two active bugs (see below). |

**Correction needed:** Root `ROADMAP.md` says Phase 4 is "Next" but Phase 4 code is already implemented. The status table is stale.

---

## Two Active Bugs

### Bug 1: Build Error — Missing `RecordedEvent` type (BLOCKS BUILD)

`src/lib/session/types.ts` line 77 references `RecordedEvent` but it is never defined. `useRecorder.ts` imports it.

**Fix:** Add the interface to `types.ts` before the `GoldenScript` interface:

```typescript
export interface RecordedEvent {
  timestamp: number;
  message: AgentMessage;
}
```

### Bug 2: Empty PCM Audio Chunks (Console errors, no audio playback)

The agent sends `beat_payload` messages with `audioData` as base64. When the TTS service fails or returns empty data, `audioData` is an empty string `''`. The `playAudioChunk` function decodes `atob('')` which produces 0 bytes, passes the `bytes.length < 2` guard (0 < 2 is true), and correctly returns early with a warning — **but the error logs show it reaching `createBuffer` with 0 frames**, meaning the guard is not catching all cases.

Looking at the code path: the beat queue processor at line 451 calls `playAudioChunk(currentBeat.audioData)`. But there's also the legacy `msg.type === 'audio'` handler at line 265 which calls `playAudioChunk(msg.data)`. The agent may be sending both `beat_payload` AND separate `audio` messages, or the `audioData` field contains a base64 string that decodes to an odd number of bytes (1 byte = 0 samples after `Math.floor(1/2)`).

**Fix:** Add an early return at the top of `playAudioChunk` for empty/whitespace strings:

```typescript
const playAudioChunk = useCallback(async (base64Audio: string) => {
    if (!base64Audio || base64Audio.trim().length === 0) {
        return Promise.resolve();
    }
    // ... rest of function
```

---

## `.antigravity/` File Updates Needed

### 1. `ROADMAP.md` (canonical)
- Update "Last updated" to 2026-04-09
- Mark Phases 4 as complete (code exists and is wired)
- Mark Phase 5 as "Partial — local file loading works, Worker API not built"
- Mark Phase 6 as "In Progress — two bugs to fix"

### 2. Root `ROADMAP.md`
- Update Phase 4 row to "✅ Complete"
- Update Phase 6 row to "In Progress"

### 3. `ISSUES.md`
- Update "Last updated" to 2026-04-09
- Mark Issue 52 as **Resolved** (Beat Sequencer replaces Live narration)
- Mark Issue 53 as **Resolved** (no more `outputAudioTranscription` parsing)
- Add **Issue 57**: `RecordedEvent` type missing from `types.ts` — build-breaking
- Add **Issue 58**: Empty PCM audio chunks cause `createBuffer(0)` errors — `playAudioChunk` needs empty-string guard
- Add **Issue 59**: Session shows "Session Ended" prematurely with lesson text cut off — likely the lesson_complete message arrives before all beats are processed, or the beat queue drains before audio finishes

### 4. `CHANGELOG.md`
- Add entry for April 9: Phase 3-4 implementation complete, Beat Sequencer deployed, two frontend bugs identified

### 5. `PROMPTS.md`
- Add Phase 6 bug-fix prompts for Issues 57-59

---

## Implementation Steps

1. **Add `RecordedEvent` interface** to `src/lib/session/types.ts` — fixes build error
2. **Add empty-string guard** to `playAudioChunk` in `src/lib/session/useSession.ts` — fixes audio errors
3. **Update `.antigravity/ROADMAP.md`** — mark phases 1-4 complete, 5 partial, 6 in progress
4. **Update root `ROADMAP.md`** — sync phase table
5. **Update `.antigravity/ISSUES.md`** — resolve 52-53, add 57-59
6. **Update `.antigravity/CHANGELOG.md`** — add April 9 entry

