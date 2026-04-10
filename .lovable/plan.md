

# Plan: Wire the Debug Drawer as a Live Agent Activity Feed

## What You Asked For
A real-time, timestamped activity log that shows exactly what the agent is doing, when, and how -- similar to Lovable's own activity feed where you can see file reads, writes, and tool calls streaming in. This will let you diagnose every issue (map highlights, image scenes, transcript timing, raise hand) by seeing the raw event flow instead of guessing.

## Current State
- `DebugDrawer.tsx` exists with full UI (categories, badges, timestamps, auto-scroll)
- `createDebugEvent()` helper exists
- `SessionCanvas.tsx` has `debugEvents` state and an `addDebug()` helper
- **Problem**: Only tool calls are logged via `handleAgentToolCall`. Nothing else feeds into the drawer -- no beat arrivals, no audio playback events, no connection state changes, no scene transitions, no errors.

## What Gets Wired (Frontend-Only, No Agent Redeploy)

### Step 1: Instrument `useSession.ts` to emit debug events

Add an `onDebug` callback parameter to `useSession` (same pattern as `onToolCall`). Fire it at every significant moment:

| Event | Category | Example Label |
|-------|----------|--------------|
| WebSocket connected | `connection` | `Connected to agent` |
| WebSocket disconnected | `connection` | `Disconnected (code=1007)` |
| Reconnect attempt | `connection` | `Reconnect 2/3 in 4s` |
| Beat payload received | `beat` | `Beat ch01_s01_b02 queued (3 tools)` |
| Beat processing started | `beat` | `Processing beat: The Fracture of Creation` |
| Tool calls fired | `tool_call` | `set_scene("image", imageUrl=...)` |
| Scene mode changed | `scene` | `Scene: transcript → image` |
| Audio playback started | `audio` | `Playing audio (24000 samples)` |
| Audio playback ended | `audio` | `Audio complete, beat IDLE` |
| SpeechSynthesis fallback | `audio` | `Browser TTS fallback (142 words)` |
| No audio dwell | `audio` | `No audio — dwelling 8s` |
| Transcript chunk appended | `beat` | `Transcript: "In the beginning..."` (first 60 chars) |
| QA started | `qa` | `Q&A session started` |
| QA completed | `qa` | `Q&A session complete` |
| Lesson complete received | `beat` | `lesson_complete received` |
| Lesson complete applied | `beat` | `Lesson ended (queue drained)` |
| Error from agent | `error` | `Agent error: SEQUENCER_FAILURE` |
| Raise hand sent | `qa` | `raise_hand sent` |
| Mute toggled | `audio` | `Microphone muted` |

This is done by adding `onDebug?: (evt: DebugEvent) => void` to the hook's config, and calling it inline at each point -- no architectural change, just ~25 one-liner insertions.

### Step 2: Wire `SessionCanvas.tsx` to pass `addDebug` into `useSession`

Currently `useSession` doesn't accept a debug callback. We'll add it so that `SessionCanvas` passes its existing `addDebug` function through, making every internal event flow into the drawer automatically.

Also add debug events for:
- `handleAgentToolCall` (already done, but enhance with more detail)
- Scene mode transitions
- Image URL/caption updates
- Raise hand button pressed

### Step 3: Enhance the Debug Drawer UI slightly

- Add a **category filter row** at the top (toggleable chips for tool_call, beat, scene, audio, qa, connection, error) so you can isolate what you care about
- Add an **event counter per category** in the filter chips
- Make detail text **expandable on click** instead of truncated, so you can see full tool call args or full error messages
- Add a **"Copy All"** button to export the event log as JSON for sharing

### Step 4: Add a `debug` message type to the agent protocol (future, documented)

Document in `ISSUES.md` that the agent should eventually emit `{ type: 'debug', message: '...' }` for server-side events (Gemini retries, TTS progress, narrator prompt sent). For now, the frontend instrumentation covers everything the client can observe.

## Files Changed

| File | Change |
|------|--------|
| `src/lib/session/useSession.ts` | Add `onDebug` callback, ~25 debug event emissions |
| `src/components/session/SessionCanvas.tsx` | Pass `addDebug` into `useSession`, add raise-hand/scene debug calls |
| `src/components/session/DebugDrawer.tsx` | Add category filter chips, expandable details, copy button |
| `.antigravity/ISSUES.md` | Update issue 72 as RESOLVED, add note about server-side debug channel |

## What This Does NOT Fix

This is purely observability tooling. It does not fix:
- Map highlight rendering (Issue 67)
- Image scene race condition (Issue 66) 
- Beat pauses (Issue 71)
- Raise hand failures (Issue 69)

But it gives you the exact data to diagnose all of them. After one lesson with the drawer open, you'll know exactly which tool calls fire, when scenes switch, whether images URLs are populated, and what happens when you raise your hand.

## Estimated Scope
~200 lines of changes across 4 files. Frontend-only, no agent redeploy needed.

