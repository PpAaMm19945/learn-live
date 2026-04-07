# Jules Plan: Phases 21 → 22 → 23 → 24 → 25

> **Created:** 2026-03-31
> **Scope:** Live-first implementation — wire SessionCanvas to agent, build kinetic typography, fix WebSocket, polish StorybookPlayer, clean up deprecated pages, add golden script recording
> **Estimated Jules instances:** 6 (dependency order noted)

---

## Execution Order

```text
Phase 23 (fix agent WS)  ─┐
Phase 22 (TranscriptView) ─┤── all start immediately (parallel)
Phase 24A (Storybook)     ─┤
Phase 24B (Page cleanup)  ─┘
         ↓
Phase 21 (wire SessionCanvas) ← after 22 + 23 merge
         ↓
Phase 25 (golden script)      ← after 21 merges
```

Total: 6 instances, 2 sequential gates.

---

## Status Summary

### Already Complete (Phase 20 — Live-First Pivot)
- ✅ `SessionCanvas.tsx` — full-bleed teaching viewport with scene transitions (transcript/map/image/overlay)
- ✅ `src/lib/session/types.ts` — SceneMode, AgentMessage, TranscriptChunk, AgentAudio types
- ✅ `toolCallHandler.ts` — routes tool calls to TeachingCanvas + handles `set_scene`
- ✅ `TeachingCanvas.tsx` — MapLibre GL JS map with imperative API
- ✅ `historyExplainerTools.ts` — 10 MapLibre-native tools + `set_scene` + scene-balance prompt
- ✅ GeoJSON data for all 9 chapters (regions, routes, markers)
- ✅ `StorybookPlayer.tsx` — Band 0-1 storybook (needs layout redesign)
- ✅ `LessonPlayerPage.tsx` — routes Band 2+ to SessionCanvas, Band 0-1 to StorybookPlayer

### What's Remaining
1. **Phase 21:** Wire SessionCanvas to WebSocket agent (depends on 22 + 23)
2. **Phase 22:** TranscriptView kinetic typography component
3. **Phase 23:** Fix agent WebSocket connection (agent/ directory)
4. **Phase 24A:** StorybookPlayer split-screen layout
5. **Phase 24B:** Dashboard & page cleanup
6. **Phase 25:** Golden Script recording infrastructure (depends on 21)

---

## Phase 21: Wire SessionCanvas to Live Agent

**1 Jules instance. Start after Phase 22 and Phase 23 merge.**

### Prompt for Jules Instance 21

```
You are wiring the SessionCanvas to the live AI agent for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made. Use the same one-line-per-decision format as existing entries.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview — READ THIS FIRST)
- .antigravity/ROADMAP.md (current phase status)
- src/components/session/SessionCanvas.tsx (teaching viewport — you're wiring this)
- src/components/session/TranscriptView.tsx (kinetic typography — created in Phase 22)
- src/lib/session/types.ts (SceneMode, AgentMessage types)
- src/lib/canvas/toolCallHandler.ts (routes tool calls to TeachingCanvas)
- src/components/canvas/TeachingCanvas.tsx (MapLibre map — mount inside map scene)
- src/pages/LessonPlayerPage.tsx (page that renders SessionCanvas)
- agent/src/historyExplainerSession.ts (WebSocket message format reference)
- agent/src/historyExplainerTools.ts (tool definitions + system prompt)

## What the agent sends via WebSocket:
The Cloud Run agent sends these message types:
1. Tool calls: `{ "type": "tool_call", "tool": "zoom_to", "args": { "location": "memphis" } }`
2. Transcript chunks: `{ "type": "transcript", "text": "...", "isFinal": true/false }`
3. Audio data: `{ "type": "audio", "data": "<base64 PCM>" }`
4. Model turns: `{ "type": "modelTurn", "data": ... }`

## Task 1: Create useSession hook

Create `src/lib/session/useSession.ts`:

```typescript
interface SessionConfig {
  chapterId: string;
  familyId: string;
  learnerId: string;
  band: number;
  agentUrl: string; // from VITE_AGENT_URL
}

interface SessionState {
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'ended';
  transcriptChunks: TranscriptChunk[];
  sceneMode: SceneMode;
  error?: string;
}
```

The hook should:
- Open WebSocket to `${agentUrl}/ws/history-explainer?chapter=${chapterId}&family=${familyId}&learner=${learnerId}&band=${band}`
- Parse incoming JSON messages into AgentMessage types
- For `tool_call` messages: call `handleToolCall()` from toolCallHandler.ts
- For `tool_call` with tool=`set_scene`: update `sceneMode` state
- For `transcript` messages: append to `transcriptChunks` array
- For `audio` messages: decode base64 PCM and play via Web Audio API (AudioContext + AudioBufferSourceNode, queue chunks to avoid gaps)
- Handle reconnection: on close, attempt reconnect once after 2s, then show error
- Return: `{ status, transcriptChunks, sceneMode, connect, disconnect }`

## Task 2: Wire SessionCanvas to useSession

Update `SessionCanvas.tsx`:
- Import and call `useSession` with config from learner store + env
- Pass `sceneMode` to drive which scene is visible (transcript / map / image / overlay)
- Pass `transcriptChunks` to `TranscriptView`
- Mount `TeachingCanvas` inside the map scene (pass ref so tool calls can reach it)
- Show connection status overlay (spinner during 'connecting', error message on 'error')
- Add "End Session" button that calls `disconnect()` and navigates back

## Task 3: Wire microphone input

For learner speech during Socratic questioning:
- Request microphone permission on session connect
- Capture audio via MediaRecorder (webm/opus) or AudioWorklet
- Send to WebSocket as `{ type: "audio", data: "<base64>" }` chunks
- Add mute/unmute toggle in bottom controls
- Only activate mic for Band 3+ (younger bands are listen-only)

## Task 4: Connection lifecycle UI

- `connecting`: full-screen spinner with "Connecting to your teacher..."
- `connected`: fade in SessionCanvas normally
- `error`: retry button + "Your teacher is unavailable. Try again?" + option to go back
- `ended`: brief summary screen + "Back to Dashboard" button

## Build verification
- `npm run build` must pass with zero errors
- The flow: LessonPlayerPage → SessionCanvas → useSession connects → transcript renders → tool calls hit TeachingCanvas
- Without a running agent, error state renders gracefully
```

---

## Phase 22: TranscriptView Kinetic Typography

**1 Jules instance. Can start immediately (no dependencies).**

### Prompt for Jules Instance 22

```
You are building the kinetic typography component for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview — READ THIS FIRST)
- src/components/session/SessionCanvas.tsx (parent component — you're replacing the inline transcript)
- src/lib/session/types.ts (TranscriptChunk type)
- src/index.css (design tokens — use these, NOT raw colors)
- tailwind.config.ts (Tailwind theme tokens)

## What TranscriptView receives:
- `chunks: TranscriptChunk[]` — array of transcript segments from the AI agent
- `band: number` — learner's band (2-5), determines typography style
- `isActive: boolean` — whether the session is actively streaming

## Design Direction:
The transcript is the PRIMARY visual surface. Students watch this 60-80% of the time. It must be:
- **Magnetic** — bold, cinematic text that demands attention
- **Readable** — clear hierarchy, generous line spacing
- **Age-adaptive** — different typography for each band range

## Task 1: Create TranscriptView component

Create `src/components/session/TranscriptView.tsx`:

### Typography by band:
- **Band 2-3 (ages 8-12):**
  - Font: system serif at 2rem (32px)
  - Line height: 1.8
  - Max 6-8 words visible at once (larger chunks, fewer on screen)
  - Each new sentence replaces the previous (not scrolling list)
  - Word color: use `--foreground` token

- **Band 4-5 (ages 13+):**
  - Font: system serif at 1.5rem (24px)
  - Line height: 1.6
  - Up to 3 sentences visible (most recent on top)
  - Previous sentences fade to 40% opacity
  - Denser, more academic feel

### Animations (framer-motion):
- New words enter with `opacity: 0 → 1` and slight `y: 8 → 0` over 150ms
- Words appear one at a time, 80ms stagger (synced with speech rate)
- When a sentence is "final" (isFinal=true), it locks in place and the next sentence starts below
- Previous sentences animate to reduced opacity over 500ms
- When scene changes away from transcript, the text should remain in state (not reset) so returning to transcript shows continuity

### Layout:
- Full viewport height, centered vertically
- Max width: 720px, centered horizontally
- Dark background (use `--background` token)
- Subtle vignette at top/bottom edges (CSS gradient)
- No scrollbar — text replaces, doesn't scroll

## Task 2: Update SessionCanvas

Replace the inline placeholder text in `SessionCanvas.tsx`'s transcript scene with `<TranscriptView>`. Pass the required props.

## Task 3: Add a "resting state" for before session starts

When `chunks` is empty and `isActive` is false, show:
- Chapter title in large text (centered, 40% opacity)
- "Waiting for your teacher..." subtitle
- Subtle breathing animation (scale 1.0 → 1.02, 3s loop)

## Build verification
- `npm run build` must pass with zero errors
- TranscriptView renders placeholder state when no chunks
- When chunks are provided, words animate in with stagger
- Band 2-3 shows larger text than Band 4-5
```

---

## Phase 23: Fix Agent WebSocket Connection

**1 Jules instance. Can start immediately (no dependencies). Works in `agent/` directory.**

### Prompt for Jules Instance 23

```
You are fixing the WebSocket connection to the Gemini Live API for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview — READ THIS FIRST)
- agent/src/server.ts (Express server with WebSocket upgrade)
- agent/src/gemini.ts (Gemini session wrapper — THE MAIN FILE TO FIX)
- agent/src/historyExplainerSession.ts (session handler — bridges WS to Gemini)
- agent/src/historyExplainerTools.ts (tool definitions — what gets sent to Gemini)
- agent/package.json (dependencies)

## Known Issues:
1. `agent/src/gemini.ts` contains an `evaluate_constraint` tool declaration hardcoded alongside history tools. This is from the legacy math engine and causes tool declaration conflicts with the Gemini Live API. Remove it from history sessions.
2. The WebSocket upgrade path may not properly route to `handleHistoryExplainerSession`.
3. No structured logging exists — when the connection fails, there's no way to diagnose where.

## Task 1: Fix gemini.ts

- Remove the `evaluate_constraint` tool declaration from the history session path
- Ensure the Gemini Live API config uses `MAPLIBRE_TEACHING_TOOLS` from `historyExplainerTools.ts`
- Verify the model name is `gemini-2.0-flash-live` (or current Live API model)
- Ensure the system prompt is injected via `buildHistoryExplainerPrompt(band)`
- Handle Gemini session events:
  - `toolCall` → forward as `{ type: "tool_call", tool, args }` to client WS
  - `text` / `modelTurn` → forward as `{ type: "transcript", text, isFinal }` to client WS
  - `audio` → forward as `{ type: "audio", data: "<base64>" }` to client WS
  - `error` → log + forward as `{ type: "error", message }` to client WS

## Task 2: Fix server.ts WebSocket routing

- Verify the Express server handles WebSocket upgrade for `/ws/history-explainer`
- Parse query params: `chapter`, `family`, `learner`, `band`
- Pass params to `handleHistoryExplainerSession(ws, { chapter, family, learner, band })`
- Handle upgrade errors gracefully (return 400 for missing params)

## Task 3: Add structured logging

Add logging at every stage of the connection lifecycle:
```
[WS] Client connected: chapter=ch01 band=3
[GEMINI] Connecting to Live API...
[GEMINI] Session established, model=gemini-2.0-flash-live
[GEMINI] Tool call received: zoom_to({ location: "memphis" })
[GEMINI] Audio chunk: 4096 bytes
[GEMINI] Transcript: "In the beginning..." (partial)
[GEMINI] Session ended: reason=client_disconnect
[WS] Client disconnected
```

Use a simple tagged logger (console.log with prefixes is fine for Cloud Run).

## Task 4: Handle client-to-agent audio

When the client sends `{ type: "audio", data: "<base64>" }`:
- Decode base64 to buffer
- Forward to Gemini Live API as audio input
- This enables the Socratic dialogue feature (learner speaks, AI responds)

## Build verification
- `cd agent && npm run build` must pass
- Test locally with `GEMINI_API_KEY` set:
  - `cd agent && npm start`
  - Connect via wscat: `wscat -c "ws://localhost:8080/ws/history-explainer?chapter=ch01&band=3&family=test&learner=test"`
  - Verify: connection established, AI starts speaking, tool calls arrive as JSON
  - If no API key available, verify build passes and logging is in place
```

---

## Phase 24A: StorybookPlayer Split-Screen Layout

**1 Jules instance. Can start immediately (no dependencies).**

### Prompt for Jules Instance 24A

```
You are redesigning the StorybookPlayer layout for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview)
- src/components/player/StorybookPlayer.tsx (current player — you're redesigning this)
- src/lib/session/types.ts (StorybookScript, StorybookScene types)
- src/index.css (design tokens)
- tailwind.config.ts (theme)

## Problem:
Chapter 1 illustrations are square (1024x1024, "Warm Codex" style). The current StorybookPlayer uses a full-bleed layout that expects landscape images. Images appear cropped or surrounded by empty space.

## Task 1: Redesign layout as split-screen

### Desktop (≥768px):
- **Left 60%:** Image area
  - Square image centered vertically
  - Subtle border/frame using `--border` token
  - Dark background behind image using `--background` token
- **Right 40%:** Text area
  - Story text in large, readable serif font (1.75rem)
  - Line height 2.0
  - Vertically centered
  - Background uses `--card` token
  - Highlighted words bolded with `--primary` color
  - Generous padding (3rem)

### Mobile (<768px):
- **Top 55%:** Image area (same styling)
- **Bottom 45%:** Text area (same styling, reduced padding 1.5rem)

### Shared:
- Remove the gradient overlay on images (text is now separate)
- Progress dots at the very bottom (centered, small)
- Tap/click left half = previous, right half = next (keep existing behavior)
- Exit button (X) top-right corner, semi-transparent

## Task 2: Add page turn animation

- Use framer-motion AnimatePresence
- Page transition: old page slides left + fades, new page slides in from right + fades in
- Duration: 400ms, ease: easeInOut
- Image and text animate together as one unit

## Task 3: Read-aloud highlight

When `audioFileId` exists on a scene (future feature), highlight the current word being spoken. For now, just bold the `highlightedWords` array with the `--primary` color.

## Build verification
- `npm run build` must pass with zero errors
- StorybookPlayer renders split-screen on desktop, stacked on mobile
- Square images display correctly without cropping
- Tap to advance works, progress dots update
```

---

## Phase 24B: Dashboard & Page Cleanup

**1 Jules instance. Can start immediately (no dependencies).**

### Prompt for Jules Instance 24B

```
You are cleaning up deprecated pages and routes for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview)
- .antigravity/ROADMAP.md (Phase 24B requirements)
- src/App.tsx (all routes — THE MAIN FILE TO EDIT)
- src/pages/ (list all page files)
- src/components/layout/AppShell.tsx
- src/components/layout/AppSidebar.tsx

## Task 1: Remove deprecated pages

These pages are replaced by the SessionCanvas + StorybookPlayer architecture:

1. `src/pages/LessonView.tsx` — if it exists, delete it
2. `src/pages/ReadingView.tsx` — if it exists, delete it  
3. `src/pages/ExamView.tsx` — if standalone exam page exists, delete it
4. `src/pages/admin/ContentTools.tsx` — if it exists, delete it (SVG alignment tools are deprecated)

For each deleted page:
- Remove the file
- Remove the route from App.tsx
- Remove any imports
- Add a redirect route that navigates to `/dashboard` with a toast: "This page has moved. Find your lessons on the dashboard."

Use `sonner` (already installed) for toast notifications.

## Task 2: Clean up orphaned imports

Search the entire `src/` directory for imports referencing any deleted files:
- `ScriptPlayer`
- `useScriptPlayer`
- `ComponentRenderer`
- `LessonDrawer`
- `adaptRawScript`
- `src/data/lessons`
- `useAudioPlayback`
- `PostLessonSummary`

Remove any found imports and the code that uses them.

## Task 3: Simplify onboarding

Read `src/pages/Onboarding.tsx` and simplify to 3 steps:
1. **Welcome** — "Welcome to Learn Live" + parent name input
2. **Add Learner** — child name + age (band auto-calculated) + "Add another" button
3. **Ready** — family summary + "Start Learning" → navigate to /dashboard

Remove any steps related to curriculum selection, subject preferences, or other legacy fields.

## Task 4: Verify route integrity

After cleanup, verify all routes in App.tsx:
- `/` → Landing or Login
- `/login`, `/register` → Auth pages
- `/onboarding` → Simplified onboarding
- `/dashboard` → Main dashboard (inside AppShell)
- `/progress` → Progress page (inside AppShell)
- `/play/:chapterId` → LessonPlayerPage (SessionCanvas or StorybookPlayer)
- `/admin/*` → Admin pages (keep admin dashboard)
- All removed page URLs → redirect to /dashboard

## Build verification
- `npm run build` must pass with zero errors
- No console errors about missing modules
- Navigating to old URLs (e.g., /lessons/xyz) redirects to dashboard with toast
- Onboarding flow completes in 3 steps
```

---

## Phase 25: Golden Script Recording

**1 Jules instance. Start after Phase 21 merges.**

### Prompt for Jules Instance 25

```
You are building the Golden Script recording infrastructure for an African History curriculum app.

## IMPORTANT: Logging Requirement
After completing all tasks, read `.antigravity/CHANGELOG.md` and append a dated entry summarizing what you built, what files you created/modified, and any decisions you made.

## Context — Read these files first:
- .antigravity/ARCHITECTURE_LIVE.md (architecture overview — READ THIS FIRST)
- src/lib/session/types.ts (AgentMessage, TranscriptChunk, AgentToolCall types)
- src/lib/session/useSession.ts (live session hook — created in Phase 21)
- src/components/session/SessionCanvas.tsx (teaching viewport)
- worker/src/routes/ (worker API routes — for saving to R2)

## What is a Golden Script?
When a live AI session runs successfully, the full sequence of AgentMessages (tool calls + transcript chunks + audio references + timing) is recorded as a JSON file. This "golden script" can be replayed later without a WebSocket connection — zero-latency cached playback.

Golden scripts are:
- Recorded automatically during live sessions
- Saved to R2 via worker API
- Used as fallback when the agent is unavailable
- The path to static content (the best live session becomes the canonical version)

## Task 1: Create recording infrastructure

Create `src/lib/session/useRecorder.ts`:

```typescript
interface RecordedEvent {
  timestamp: number;  // ms since session start
  message: AgentMessage;
}

interface GoldenScript {
  version: '1.0';
  chapterId: string;
  band: number;
  recordedAt: string;  // ISO date
  durationMs: number;
  events: RecordedEvent[];
}
```

The hook should:
- Accept a flag: `recording: boolean`
- When recording, capture every AgentMessage with relative timestamp
- On `stop()`, return the complete GoldenScript JSON
- Exclude raw audio data from the JSON (too large) — instead, note audio event timings

## Task 2: Create useGoldenScript playback hook

Create `src/lib/session/useGoldenScript.ts`:

The hook should:
- Accept a `GoldenScript` object
- Play back events with the same timing as the original session
- Use `setTimeout` chain or `requestAnimationFrame` loop for timing
- Dispatch tool calls to `handleToolCall()` at the correct moments
- Feed transcript chunks to TranscriptView at the correct moments
- Support play/pause/seek (seek snaps to nearest event)
- Return: `{ status, currentTime, totalTime, play, pause, seek }`

## Task 3: Save golden scripts via worker API

Create a worker route `POST /api/golden-scripts`:
- Accepts `GoldenScript` JSON body
- Saves to R2 at `golden-scripts/${chapterId}/band${band}/${timestamp}.json`
- Returns the R2 key

Create `GET /api/golden-scripts/:chapterId/:band`:
- Returns the most recent golden script for a chapter+band combo
- Returns 404 if none exists

## Task 4: Integrate fallback into SessionCanvas

Update `SessionCanvas.tsx` (or `LessonPlayerPage.tsx`):
- On session start, try WebSocket connection first
- If connection fails after 5s, check for a golden script via `GET /api/golden-scripts/${chapterId}/${band}`
- If golden script exists, use `useGoldenScript` for playback (show a small "Recorded session" badge)
- If neither works, show error state

## Task 5: Add "Save this session" admin control

For admin users:
- After a live session ends, show "Save as Golden Script" button
- Calls `POST /api/golden-scripts` with the recorded data
- Shows confirmation toast

## Build verification
- `npm run build` must pass with zero errors (both frontend and `cd worker && npx wrangler deploy --dry-run`)
- Recording captures events during simulated session
- Playback replays events with correct timing
- Fallback flow: WS fail → try golden script → play or show error
```

---

## Notes for All Jules Instances

1. **Design tokens**: Use CSS variables from `src/index.css` (`--background`, `--foreground`, `--primary`, `--card`, `--border`, etc.). Never use raw color values.
2. **Build verification**: Every instance must end with `npm run build` passing with zero TypeScript errors.
3. **Changelog**: Every instance MUST append to `.antigravity/CHANGELOG.md` after completing work.
4. **No new dependencies** unless absolutely necessary. The project already has: react, framer-motion, maplibre-gl, zustand, react-router-dom, sonner, @tanstack/react-query.
5. **File naming**: New files go in `src/components/session/` for session UI, `src/lib/session/` for hooks/logic.
