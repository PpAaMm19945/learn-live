# Learn Live — Issue Tracker

> **Last updated:** 2026-04-10

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
| 47 | Agent WebSocket Connection Broken | Resolved in Phase 23 | 23 |
| 48 | SessionCanvas Not Wired to useSession Hook | Resolved in Phase 21 | 21 |
| 49 | TranscriptView Kinetic Typography Not Built | Resolved in Phase 22 | 22 |
| 50 | TeachingCanvas Not Integrated into SessionCanvas | Resolved in Phase 21 | 21 |
| 51 | StorybookPlayer Images Assume Landscape Layout | Resolved in Phase 24A | 24A |
| 52 | Gemini Live API Cannot Serve as Lesson Narrator | Beat Sequencer architecture replaces Live narration | Phase 3 |
| 53 | Thinking Text Mixed with Transcript | Eliminated — Beat Sequencer uses `generateContent` (clean text) | Phase 3 |
| 54 | Transcript / Audio Synchronization Drift | Moved transcript append to AFTER audio playback begins | Phase 6 |
| 55 | Transcript Not Scrollable | SRT-style subtitle paradigm (2-3 sentence window) | Phase 6 |
| 57 | `RecordedEvent` type missing from `types.ts` | Added interface | Phase 6 |
| 58 | Empty PCM audio chunks cause `createBuffer(0)` errors | Added empty-string guard | Phase 6 |
| 59 | Session Shows "Session Ended" Prematurely | Upgraded Gemini model + pending completion queue | Phase 6 |
| 60 | Gemini Model Upgrade — 2.x → 3.x | `gemini-3-flash-preview` + `gemini-3.1-flash-live-preview` | Phase 6 |
| 61 | No Audio — Google Cloud TTS Key Missing | Replaced with Gemini TTS + dwell-time fallback | Phase 6 |
| 62 | Visual Tool Calls Not Rendering | `ImageScene` component + beat `sceneMode` field | Phase 6C |
| 63 | Beat Continuity Broken — Fresh Greeting Each Beat | Anti-greeting prompt with beat context | Phase 6C |
| 64 | Lesson Ending / Apparent Restart After Completion | `statusRef.current = 'ended'` immediately on `lesson_complete` | Phase 6C |

---

## Open Issues

### 65. Tool Call Text Leaking Into Transcript
- **Status:** OPEN — HIGH
- **Description:** Screenshot shows "dismiss_overlay() set_scene("transcript")" appearing as literal text in the student transcript. When the Gemini narrator succeeds, it sometimes includes tool call syntax in its narration output because the system prompt mentions tool names.
- **Evidence:** Screenshot image-116.png — tool call names visible in transcript overlay text.
- **Fix (agent):** Strip tool-call patterns (`set_scene(...)`, `dismiss_overlay()`, etc.) from narrated text before sending to frontend. Add explicit prompt instruction: "Never output tool call names in your narration."
- **Fix (frontend):** Add a client-side regex filter to strip any remaining tool call text from transcript chunks.

### 66. Image Scenes Not Displaying
- **Status:** OPEN — HIGH
- **Description:** Beats 1-3 have `sceneMode: "image"` with storybook URLs but images never appear. Only transcript text is shown throughout the lesson.
- **Root Cause:** Race condition in beat processor — `sceneMode` is set to `"image"` before `imageSceneUrl` is populated. The `handleAgentToolCall` intercepts `set_scene("image")` and sets `imageSceneUrl`, but React batching means the scene mode switch happens before the URL state updates.
- **Evidence:** Screenshots image-120, image-121, image-122 — all show transcript text only, no images.
- **Fix:** Set `imageSceneUrl` synchronously before `sceneMode` switches to `"image"`. Restructure beat processor tool call handling.

### 67. Map Highlights Not Rendering — `getPaintProperty` Crash
- **Status:** PARTIALLY FIXED — Phase 7+
- **Description:** `highlight_region("canaan")` etc. crash with `Cannot read properties of undefined (reading 'getPaintProperty')` because the `chapter-regions-fill` layer only exists when `chapterGeoJSON` is passed to `TeachingCanvas`. Neither the Workbench nor SessionCanvas currently provide GeoJSON.
- **Root Cause:** `highlightRegion()` called `map.getPaintProperty()` on a non-existent layer. No guard check.
- **Fix applied:** Added `map.getLayer('chapter-regions-fill')` guard — now returns silently instead of crashing, and the fallback marker from `toolCallHandler` still renders.
- **Remaining:** To actually highlight polygonal regions, GeoJSON data for ancient regions (Canaan, Mizraim, Cush, Phut) must be created and passed as `chapterGeoJSON`. Without it, only the fallback marker + label renders.
- **Evidence:** Admin workbench logs show repeated `getPaintProperty` errors for every `highlight_region` call.

### 68. Gemini Narrator 503 — No Retry Logic
- **Status:** OPEN — HIGH
- **Description:** Gemini REST API returns 503 "high demand" errors frequently. `GenAINarrator.narrate()` returns null on first failure, falling back to raw curriculum text with no retry.
- **Evidence:** Agent logs show 503 errors on beats 1, 2 of multiple sessions. Raw text fallback loses age-band adaptation.
- **Impact:** Raw curriculum text used instead of age-adapted narration. Continuity prompt (anti-greeting rules) is bypassed.
- **Fix (agent):** Add exponential backoff retry (3 attempts, 2s/4s/8s) for 503 errors in `GenAINarrator`.

### 69. Raise Hand / Q&A Silently Fails
- **Status:** OPEN — MEDIUM
- **Description:** When student raises hand, the agent pauses the lesson and starts a Gemini Live session for Q&A. If the Live API fails (503, connection error, or timeout), the Q&A session silently ends via `stopQA()` after the 10-second silence timeout. No error is shown to the student. The lesson continues on the next beat.
- **Evidence:** User report: "It just listens... after a few moments, the lesson just continued."
- **Fix (agent):** Send `{ type: 'qa_error', message: '...' }` to client when Q&A fails to start. Frontend should show a toast notification.

### 70. No End-of-Lesson Quiz or Summary
- **Status:** OPEN — LOW (Feature Request)
- **Description:** Lesson ends abruptly with "Session Ended" screen. No quiz, recap, or "Think It Through" questions are presented, despite `thinkItThrough` data existing in the section manifest.
- **Fix:** After `lesson_complete`, display the `thinkItThrough` questions from the manifest before showing the ended screen.

### 71. Long Pauses Between Beats
- **Status:** OPEN — MEDIUM
- **Description:** Each beat is processed sequentially: narrate (Gemini REST, 2-30s) → TTS (10-20s) → send → wait 800ms → next beat. Total processing time per beat: 15-60 seconds. Student hears silence during processing.
- **Evidence:** Agent logs show 30-60s gaps between beats. User report: "the pauses are long."
- **Fix (agent):** Pre-process the next beat while current beat audio is playing. Pipeline architecture.

### 72. Need Agent Debug Drawer
- **Status:** RESOLVED — Phase 7
- **Description:** No way to observe agent state, tool calls, beat progress, or errors from the frontend during a session.
- **Resolution:** `DebugDrawer.tsx` fully wired with category filters, expandable details, copy-all, and ~25 debug event emissions from `useSession.ts` covering connection, beats, tools, audio, Q&A, scenes, and errors. Toggle via Bug icon in session top bar.
- **Future:** Agent should emit `{ type: 'debug', message: '...' }` WebSocket messages for server-side visibility (Gemini retries, TTS progress, narrator prompts).

### 73. Copy Buttons Fail in Preview/Iframe Contexts
- **Status:** RESOLVED — Phase 7
- **Description:** Both DebugDrawer and ToolCallLog "Copy All" buttons use `navigator.clipboard.writeText()` which silently fails in cross-origin iframes and non-HTTPS contexts.
- **Resolution:** Added `document.execCommand('copy')` fallback + visual feedback ("Copied!" / "Failed").

### 74. Map Theme Too Dark — Regions/Land Invisible
- **Status:** RESOLVED — Phase 7
- **Description:** The `applyAncientTheme` recoloring made background `#1a1610` and land `#1f1a14` — nearly indistinguishable. Regions, borders, and terrain features invisible.
- **Resolution:** Lightened all base colors by ~40%: background `#2e2820`, land `#352e24`, water `#1a2e40`, borders `#8a6a4a`.

### 75. Debug Drawer Hidden Behind Lesson Complete Overlay
- **Status:** RESOLVED — Phase 7+
- **Description:** Lesson-complete screen used an early `return` with `fixed inset-0`, completely replacing the component tree and hiding the debug drawer.
- **Resolution:** Moved lesson-complete into an `AnimatePresence` overlay at `z-[90]` inside the main layout. Debug drawer at `z-[9999]` renders alongside it. Bug icon in top bar remains clickable.

### 76. No Image Test Presets in Canvas Workbench
- **Status:** RESOLVED — Phase 7
- **Description:** SceneControls only had a raw URL input — no way to quickly test R2 image loading.
- **Resolution:** Added dropdown with R2 storybook paths and an external Unsplash test URL.

### 77. Transcript Should Use Card-Based Layout
- **Status:** OPEN — MEDIUM (Feature Request)
- **Description:** User suggests transcript chunks should display as cards rather than streaming text, to better sync with audio and enable timestamped review.
- **Notes:** Would require reworking `TranscriptView.tsx` to render discrete beat-aligned cards with timestamps. Could aid audio sync debugging.

### 78. Agent Thinking/Reasoning Not Visible
- **Status:** OPEN — LOW (Feature Request)
- **Description:** User wants to see the agent's internal reasoning/thinking steps in the debug feed.
- **Notes:** Requires agent to emit `{ type: 'debug', category: 'thinking', message: '...' }` messages. Frontend DebugDrawer already supports arbitrary categories.

### 79. Scene Transitions Only Firing for Map
- **Status:** OPEN — HIGH
- **Description:** Debug drawer shows SCENE events only for `map` transitions. Image scenes are not triggering SCENE debug events, confirming the race condition in Issue 66 where `sceneMode` changes but `imageSceneUrl` is not yet set.
- **Evidence:** User screenshots — purple SCENE badge only appears for map transitions.

### 80. Multi-Tool Coordination Missing
- **Status:** OPEN — HIGH
- **Description:** Individual tools work (`zoom_to`, `draw_route`, `place_marker`) but they don't compose well. A route is drawn without zooming to show the full extent. A marker is placed without zooming in. The agent fires tools independently without spatial awareness.
- **Evidence:** Admin workbench testing confirms individual tools work, but manual composition (zoom + highlight + route) is needed.
- **Fix (agent):** Agent system prompt should instruct coordinated tool calls — e.g., `zoom_to` with appropriate zoom level before/after `draw_route`. Frontend could also auto-fit bounds after `draw_route`.

### 81. Scripture/Timeline/Figure Overlays Not Visible
- **Status:** OPEN — HIGH
- **Description:** `show_scripture`, `show_timeline`, `show_figure`, `show_genealogy` tools dispatch without error in the workbench log but produce no visible output. The overlay rendering in `TeachingCanvas` may not be connected to the DOM, or state is not triggering a re-render.
- **Evidence:** Workbench logs show `dispatched` for all overlay tools, but canvas area shows only the map. Session logs show `show_scripture` and `show_timeline` fired but nothing appears.
- **Root Cause:** Needs investigation — likely the overlay state (`scripture`, `timeline`, etc.) is set via `useImperativeHandle` but the JSX rendering those overlays may be missing or conditionally hidden.

### 82. GeoJSON Data Needed for Ancient Regions
- **Status:** OPEN — MEDIUM
- **Description:** To enable proper polygonal region highlighting (filled, bordered areas on the map), GeoJSON `FeatureCollection` data must be created for ancient regions: Canaan, Mizraim (Egypt), Cush (Nubia), Phut (Libya), Babel (Mesopotamia), Aksum, Carthage.
- **Notes:** Without this, `highlight_region` only places a fallback marker. Polygons would enable proper filled highlighting with opacity.

---

## Notes
- Issues 65, 66, 79, 80, 81 are the current critical blockers.
- Issues 68, 69, 71 require agent redeployment.
- Issues 65 (partial), 66, 67, 79, 81 can be fixed frontend-only.
- Issues 70, 77, 78, 82 are feature requests or data tasks.
