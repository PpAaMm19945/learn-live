# Jules Plan: Phases 16D → 17 → 18 → 19

> **Created:** 2026-03-24
> **Scope:** Complete the live AI integration, Chapter 1 E2E, multi-band support, and UI redesign
> **Estimated Jules instances:** 6 (dependency order noted)

---

## Status Summary

### Already Complete
- ✅ **16A:** TeachingCanvas with MapLibre GL JS (imperative API, overlay panels)
- ✅ **16B:** GeoJSON data for all 9 chapters (regions, routes, markers, locations registry)
- ✅ **16C:** Agent tool-call rewrite (`MAPLIBRE_TEACHING_TOOLS`, session handler, prompt builder)
- ✅ **Stream B:** Lesson script generator updated + band 3 scripts for all 9 chapters
- ✅ **Stream C:** E2E wiring (adaptRawScript, lesson loader, ScriptPlayer tool-call bridge)

### What Exists But Needs Work
- `src/lib/canvas/useWebSocketCanvas.ts` — skeleton hook, needs Web Audio API for audio streaming
- `src/lib/canvas/toolCallHandler.ts` — complete, dispatches all 9 tool types
- `src/components/player/VoiceIndicator.tsx` — exists, needs integration
- `src/components/player/TranscriptPanel.tsx` — exists, needs integration
- `src/components/player/CanvasActionLog.tsx` — exists, needs integration

### What's Remaining
1. **Phase 16D:** Live WebSocket audio + ScriptPlayer layout integration
2. **Phase 17:** Cloud Run deployment + Chapter 1 full E2E test
3. **Phase 18:** Multi-band support (Bands 0-2, 4-5)
4. **Phase 19:** UI Redesign (library shelf dashboard, page cleanup)

---

## Phase 16D: Live WebSocket + Audio Integration

**1 Jules instance. Can start immediately.**

### Prompt for Jules Instance 16D

```
You are completing the live WebSocket audio integration for an African History curriculum app.

## Context — Read these files first:
- src/lib/canvas/useWebSocketCanvas.ts (skeleton — you're completing this)
- src/lib/canvas/toolCallHandler.ts (complete — dispatches tool calls to TeachingCanvas)
- src/components/canvas/TeachingCanvas.tsx (MapLibre canvas with imperative API)
- src/components/player/ScriptPlayer.tsx (current player — you're adding live mode)
- src/components/player/VoiceIndicator.tsx (exists — wire into player)
- src/components/player/TranscriptPanel.tsx (exists — wire into player)
- src/components/player/CanvasActionLog.tsx (exists — wire into player)
- agent/src/historyExplainerSession.ts (WebSocket message format reference)
- src/pages/LessonPlayerPage.tsx (page that renders ScriptPlayer)

## What the agent sends via WebSocket:
The Cloud Run agent sends two types of messages:
1. JSON tool calls: `{ "type": "tool_call", "tool": "zoom_to", "args": { "location": "memphis" } }`
2. Model turns: `{ "type": "modelTurn", "parts": [{ "text": "..." }] }` or binary audio chunks

## Task 1: Complete useWebSocketCanvas.ts

Add Web Audio API playback for streaming audio:
- Create an AudioContext on session start
- When binary WebSocket messages arrive (audio chunks), decode and play via AudioBufferSourceNode
- Queue chunks to avoid gaps — use a simple buffer queue
- Track speaking state for VoiceIndicator (isPlaying = audio is actively playing)
- Parse model turn text into transcript state
- Handle reconnection gracefully

The hook should accept session config:
```typescript
interface SessionConfig {
  lessonId: string;
  familyId: string;
  learnerId: string;
  band: number;
}
```

And the WebSocket URL should be constructed from `VITE_AGENT_URL` env var:
`${agentUrl}/ws/history-explainer?lesson=${lessonId}&family=${familyId}&learner=${learnerId}&band=${band}`

## Task 2: Add "Live Session" mode to ScriptPlayer

ScriptPlayer currently has a "Teaching" phase that plays scripted cues. Add a transition to "Dialogue" phase that uses the live WebSocket:

1. Add a "Go Live" button that appears after the scripted teaching phase completes (or can be triggered manually)
2. When activated:
   - Connect via useWebSocketCanvas
   - Hide scripted controls (play/pause/seek) — the AI is now driving
   - Show live UI: VoiceIndicator, TranscriptPanel, CanvasActionLog in the sidebar
   - TeachingCanvas continues to respond to tool calls (same ref)
3. Layout for live mode:
   - Main area: TeachingCanvas (same as teaching phase)
   - Right sidebar (320px, scrollable): TranscriptPanel on top, CanvasActionLog below
   - Bottom bar: VoiceIndicator (left), "End Session" button (right), elapsed time
   - Top bar: same as teaching phase but phase pill shows "Dialogue" (purple)

## Task 3: Wire microphone input

For dialogue mode, the learner needs to speak:
- Request microphone permission when entering dialogue phase
- Stream audio to WebSocket as base64 chunks (matching what the agent expects: `{ type: "audio", data: "<base64>" }`)
- Use MediaRecorder or AudioWorklet for capture
- Show a mute/unmute toggle in the bottom bar
- Visual indicator when mic is active

## Build verification
- `npm run build` must pass
- Player should render both scripted and live modes
- Without a running agent, the "Go Live" button should show a connection error gracefully
```

---

## Phase 17: Chapter 1 E2E Deployment & Test

**1 Jules instance. Depends on 16D merge.**

### Prompt for Jules Instance 17

```
You are deploying and testing the Chapter 1 end-to-end lesson flow.

## Context — Read these files first:
- agent/src/server.ts (Express server with WebSocket upgrade)
- agent/src/gemini.ts (Gemini session wrapper)
- agent/package.json (dependencies)
- src/pages/LessonPlayerPage.tsx
- src/components/player/ScriptPlayer.tsx
- .antigravity/ROADMAP.md (current status)

## Task 1: Agent Deployment Preparation

Ensure the agent is ready for Cloud Run deployment:

1. Verify `agent/Dockerfile` exists and is correct:
   - Node 20 base image
   - Install dependencies
   - Expose port 8080 (Cloud Run default)
   - CMD: `node dist/server.js`

2. Verify `agent/cloudbuild.yaml` or create it:
   ```yaml
   steps:
     - name: 'gcr.io/cloud-builders/docker'
       args: ['build', '-t', 'gcr.io/$PROJECT_ID/learnlive-agent', './agent']
     - name: 'gcr.io/cloud-builders/docker'
       args: ['push', 'gcr.io/$PROJECT_ID/learnlive-agent']
     - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
       args: ['gcloud', 'run', 'deploy', 'learnlive-agent', '--image', 'gcr.io/$PROJECT_ID/learnlive-agent', '--region', 'us-central1', '--allow-unauthenticated', '--set-secrets', 'GEMINI_API_KEY=GEMINI_API_KEY:latest']
   ```

3. Add `VITE_AGENT_URL` to the frontend `.env.example`:
   ```
   VITE_AGENT_URL=https://learnlive-agent-XXXXX.run.app
   ```

## Task 2: Progress Saving

Wire lesson completion to save progress:

1. When the scripted teaching phase completes, call the worker API:
   ```
   POST /api/progress
   { learnerId, lessonId, status: 'completed', band }
   ```

2. When the dialogue phase ends, update session duration:
   ```
   POST /api/sessions
   { learnerId, lessonId, type: 'dialogue', durationMs }
   ```

3. On the dashboard, reflect completed lessons with a check icon

## Task 3: Error Handling & Fallback

- If the agent WebSocket fails to connect, show a toast + fallback to scripted-only mode
- If audio streaming drops, attempt reconnection once before showing error
- If TeachingCanvas fails to render (MapLibre tile load failure), show a static map image fallback
- Add retry logic to lesson script loading

## Build verification
- `npm run build` must pass
- The flow: Dashboard → tap Chapter 1 → TeachingCanvas renders with map → scripted teaching plays → "Go Live" available (or graceful fallback if no agent)
```

---

## Phase 18: Multi-Band Support

**2 Jules instances (can run in parallel).**

### Prompt for Jules Instance 18A (Bands 0-1: StorybookPlayer)

```
You are building the Band 0-1 storybook experience for Chapter 1.

## Context — Read these files first:
- src/components/player/StorybookPlayer.tsx (existing storybook player)
- src/lib/player/types.ts (StorybookScript type)
- docs/curriculum/history/my-first-textbook/chapter_01/ (source text)
- src/pages/LessonPlayerPage.tsx (route handler)

## Task 1: Generate Band 0 and Band 1 Storybook Scripts

Create JSON storybook scripts for Chapter 1:

### Band 0 (ages 3-5): `public/scripts/lesson_ch01_band0.json`
- 8-10 pages maximum
- Each page: one simple sentence + image prompt
- Story: "Long, long ago, God made everything. He made the sky, the land, and the water..." → Tower of Babel → families spread out → Mizraim went to Egypt, Cush went to Nubia, Phut went to Libya
- Use proper names (Mizraim, Cush, Phut) — same names as Band 3+
- Warm, bedtime-story tone
- Image prompts should describe full-page illustrations (warm, child-friendly, diverse characters)

### Band 1 (ages 6-7): `public/scripts/lesson_ch01_band1.json`
- 12-15 pages
- Each page: 2-3 sentences + image prompt
- More detail: mentions specific places, introduces "Table of Nations" concept
- Adds 2-3 simple review questions ("Can you remember which son went to Egypt?")
- Same names and sequence as Band 0 and Band 3

## Task 2: Generate Storybook Illustrations

For each storybook page, generate an illustration using the image generation tool.
- Style: warm watercolor, diverse African characters, historically inspired but child-friendly
- Size: 1024x768 (landscape, full-bleed)
- Save to: `public/images/storybook/ch01/band0_page01.jpg` etc.
- Update the script JSONs with the correct image paths

## Task 3: Wire into LessonPlayerPage

The existing code already routes Band 0-1 to StorybookPlayer. Verify:
- `isStorybook = activeLearnerBand <= 1` correctly triggers StorybookPlayer
- The fetch path `public/scripts/lesson_ch01_band${band}.json` works
- StorybookPlayer renders the pages with images and text
- "Read aloud" functionality works (uses browser TTS as fallback)

## Build verification
- `npm run build` must pass
- Navigate to /play/ch01 with a Band 0 learner → StorybookPlayer renders with illustrations
```

### Prompt for Jules Instance 18B (Bands 2, 4-5: Adapted Players)

```
You are building band-specific lesson experiences for Chapter 1.

## Context — Read these files first:
- src/data/lessons/lesson_ch01_band3.json (Band 3 script — template)
- src/lib/player/adaptRawScript.ts (script adapter)
- src/components/player/ScriptPlayer.tsx (current player)
- scripts/generate_lesson_script.ts (generator)
- docs/curriculum/history/my-first-textbook/chapter_01/ (source text)

## Task 1: Generate Band 2 Script (ages 8-9)

Run the lesson script generator with band=2 adaptations:
- Simplified vocabulary (no "progenitor", use "ancestor" or "father of")
- Shorter narration segments (max 2 sentences per speak cue)
- Fewer tool calls (skip show_genealogy, use only zoom_to, highlight_region, place_marker)
- Slower pacing (longer gaps between cues)
- Output: `src/data/lessons/lesson_ch02_band2.json` (wait — should be ch01_band2)

Generate `src/data/lessons/lesson_ch01_band2.json`

## Task 2: Generate Band 4 Script (ages 13-17)

Run the generator with band=4 adaptations:
- Full academic vocabulary
- Longer narration with analytical connections ("Notice how the Table of Nations in Genesis 10 correlates with...")
- All tool calls including show_genealogy, show_timeline, show_scripture
- Add ComparisonView cues comparing biblical and conventional chronology
- Add Socratic questions embedded in narration ("Why do you think Moses organized the nations this way?")
- Output: `src/data/lessons/lesson_ch01_band4.json`

## Task 3: Generate Band 5 Script (ages 18+)

Run the generator with band=5 adaptations:
- Verbatim master text where possible
- Historiographic commentary ("Scholars like Kenneth Kitchen argue...")
- Full tool call usage with additional academic overlays
- Essay prompts at section transitions
- Seminar-style discussion questions
- Output: `src/data/lessons/lesson_ch01_band5.json`

## Task 4: Update Lesson Loader

Update `src/data/lessons/index.ts` to include the new band-specific imports:
```typescript
const RAW_IMPORTS: Record<string, () => Promise<any>> = {
  'ch01_band2': () => import('./lesson_ch01_band2.json'),
  'ch01_band3': () => import('./lesson_ch01_band3.json'),
  'ch01_band4': () => import('./lesson_ch01_band4.json'),
  'ch01_band5': () => import('./lesson_ch01_band5.json'),
  // ... existing ch02-09 band3 entries
};
```

## Build verification
- `npm run build` must pass
- Band 2 learner sees simplified lesson with fewer visual components
- Band 4 learner sees full complexity with Socratic questions
- Band 5 learner sees verbatim text with academic commentary
```

---

## Phase 19: UI Redesign

**2 Jules instances (can run in parallel after Phase 17).**

### Prompt for Jules Instance 19A (Dashboard Library Shelf)

```
You are redesigning the Dashboard as a library shelf for an African History curriculum app.

## Context — Read these files first:
- src/pages/parent/Dashboard.tsx (current dashboard — you're replacing the content area)
- src/components/layout/AppShell.tsx (layout wrapper — keep as is)
- src/components/layout/AppSidebar.tsx (sidebar nav — keep as is)
- src/data/geojson/index.ts (to see available chapters)
- tailwind.config.ts (design tokens)
- src/index.css (CSS variables)

## Design Direction

Replace the current accordion-based topic list with a **library shelf** metaphor:

### Layout
- A warm, textured shelf background (subtle wood grain or leather texture via CSS gradient)
- 9 book spines arranged on 2 shelves (5 top, 4 bottom) — one per chapter
- Each "book" is a vertical card (~80px wide, ~200px tall on desktop) with:
  - Chapter number on the spine
  - Short title (vertical text or angled)
  - Color-coded by era/region (use chapter GeoJSON region colors)
  - Progress indicator (spine fill from bottom)
  - Subtle glow/highlight on hover
  - The active/current chapter slightly pulled out from the shelf

### Interactions
- Click a book → flies out with a framer-motion animation → shows chapter detail card:
  - Chapter title, description, era badge
  - List of lessons with completion status
  - "Start Lesson" / "Continue" button → navigates to `/play/ch{NN}`
  - "Back to Shelf" button → book slides back
- The "continue" hero card at the top stays (the one with "Start Live Lesson")

### Mobile
- On mobile (<768px), books are horizontal scroll with snap points
- Each book is a card (not spine view) showing chapter art/color + title + progress

### Technical Requirements
- Use framer-motion for all animations (book pull-out, card expand, page transitions)
- Use design tokens from index.css (bg-card, text-foreground, etc.)
- Keep the learner selector and "Start Live Lesson" hero card above the shelf
- Remove the old Accordion-based topic list
- The chapter data should come from a static config (not API) since we have all 9 chapters defined

### Chapter metadata
```typescript
const CHAPTERS = [
  { id: 'ch01', num: 1, title: 'Creation, Babel & Table of Nations', era: 'Ancient', color: '#fac775' },
  { id: 'ch02', num: 2, title: 'Ancient Egypt', era: 'Ancient', color: '#e8a87c' },
  { id: 'ch03', num: 3, title: 'Kingdom of Kush & Nubia', era: 'Ancient', color: '#c47cb8' },
  { id: 'ch04', num: 4, title: 'Phoenicians & Carthage', era: 'Classical', color: '#7cc4a8' },
  { id: 'ch05', num: 5, title: 'Church in Roman Africa', era: 'Classical', color: '#c4a87c' },
  { id: 'ch06', num: 6, title: 'Aksum & Ethiopian Christianity', era: 'Classical', color: '#c4a87c' },
  { id: 'ch07', num: 7, title: 'Rise of Islam in Africa', era: 'Medieval', color: '#8ac47c' },
  { id: 'ch08', num: 8, title: 'Bantu Migrations', era: 'Medieval', color: '#c47c7c' },
  { id: 'ch09', num: 9, title: 'Medieval African Kingdoms', era: 'Medieval', color: '#e8c87c' },
];
```

## Build verification
- `npm run build` must pass
- Dashboard renders library shelf on desktop and horizontal scroll on mobile
- Clicking a book opens the detail card with lessons and play button
- "Start Live Lesson" hero card still works
```

### Prompt for Jules Instance 19B (Page Cleanup & Polish)

```
You are cleaning up deprecated pages and polishing the app.

## Context — Read these files first:
- src/App.tsx (all routes)
- src/pages/ (list all pages)
- src/components/layout/AppShell.tsx
- src/components/layout/AppSidebar.tsx
- .antigravity/ROADMAP.md (Phase 19 requirements)

## Task 1: Remove Deprecated Pages

These pages are no longer needed (their functionality is replaced by the Session player):

1. `src/pages/LessonView.tsx` — old lesson wrapper, replaced by `/play/:chapterId`
2. `src/pages/ReadingView.tsx` — old reading view, replaced by Session player
3. `src/pages/ExamView.tsx` — old standalone exam, will be integrated into Session dialogue phase

For each:
- Remove the page file
- Remove the route from App.tsx
- Remove any imports
- Add redirect routes for old URLs:
  - `/lessons/:lessonId` → `/dashboard` (with toast: "Lessons are now accessed from the dashboard")
  - `/read/:lessonId` → `/dashboard`
  - `/exam/:lessonId` → `/dashboard`

## Task 2: Remove Admin Content Tools (Deprecated)

The admin content tools page (`src/pages/admin/ContentTools.tsx`) was for SVG alignment and content management that's no longer needed:
- Remove the page
- Remove the route from App.tsx
- Keep `src/pages/admin/Dashboard.tsx` (admin dashboard with analytics is still useful)

## Task 3: Simplify Onboarding

Read `src/pages/Onboarding.tsx` and simplify to 3 steps:
1. **Welcome** — "Welcome to Learn Live. Let's set up your family." + parent name input
2. **Add Learner** — name + age (band auto-calculated from age) + "Add another learner" button
3. **Ready** — summary of family + "Start Learning" button → navigate to dashboard

Remove any steps related to curriculum selection, subject preferences, or other legacy fields.

## Task 4: Build PostLessonSummary

Create `src/components/player/PostLessonSummary.tsx`:
- Shows after a lesson completes (both scripted and dialogue phases)
- Non-blocking — parent can dismiss and go back to dashboard
- Contents:
  - "Lesson Complete!" header with celebration animation (confetti or sparkle)
  - Time spent (total duration)
  - Topics covered (list of main narration topics)
  - "Continue to Next Lesson" button
  - "Back to Dashboard" button
- Use framer-motion for enter animation
- Wire into ScriptPlayer as the "Review" phase (phase 3)

## Task 5: Fix forwardRef Warnings

Wrap these page components with React.forwardRef to eliminate console warnings:
- Index
- Login
- Register
- ForgotPassword
- ResetPassword
- Onboarding
- NotFound

## Build verification
- `npm run build` must pass with zero errors
- Old routes redirect gracefully with toasts
- Onboarding flow is 3 steps
- PostLessonSummary renders after lesson completion
- No forwardRef console warnings
```

---

## Execution Order

```
Phase 16D (1 instance) ← Start immediately
    ↓
Phase 17 (1 instance) ← After 16D merges
    ↓
Phase 18A + 18B (2 instances, parallel) ← After 17 merges
Phase 19A + 19B (2 instances, parallel) ← After 17 merges (can also run parallel with 18)
```

Total: 6 Jules instances, 3 sequential gates.

---

## Post-Phase 19 Priorities

After these phases complete, the app will have:
- ✅ Full Chapter 1 experience across all 6 bands
- ✅ Live AI narration with interactive map
- ✅ Library shelf dashboard
- ✅ Clean, polished UI

Next priorities (Phase 20+):
1. **Audio generation** — Pre-generate TTS audio for scripted cues (fallback when agent is unavailable)
2. **Chapters 2-9 multi-band** — Generate band 0-2 and 4-5 scripts for remaining chapters
3. **Progress analytics** — Detailed parent dashboard with per-learner progress charts
4. **Offline mode** — Service worker + cached lesson scripts for offline playback
5. **Mobile app** — Capacitor wrapper for iOS/Android
