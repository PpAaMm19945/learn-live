# Phase 15: Session Engine — Player Architecture & Visual Components

**Context:** Learn Live is an African History curriculum app. Parents sign in, add learners (children), and explore a 9-chapter curriculum adapted by band (age-appropriate reading level, 0–5). The app's core experience is an interactive AI-narrated lesson driven by a pre-generated JSON script that syncs canvas visuals, audio, and transcripts. The tech stack is React + Vite + Tailwind + shadcn/ui (frontend), Cloudflare Workers + D1 (backend), and a Google Cloud Run Express agent (agent/). The master roadmap for this phase is at `.antigravity/roadmap.md` Sections 13–15 (Dual Player Architecture, Visual Component Shells, Lesson Script Generator).

---

## CRITICAL INSTRUCTIONS FOR ALL INSTANCES

### Documentation Requirements
Every Jules instance MUST, before marking the task complete:
1. Create or update `.antigravity/logs/phase15_progress.md` with:
   - Which files were created or modified
   - Key decisions made during implementation
   - Any deviations from this spec and why
   - List of all exports (functions, types, components) for downstream consumers
2. Update `.antigravity/progress.md` — mark their sub-phase status
3. Ensure `npx tsc --noEmit` passes with zero errors in the relevant project directory (`./` for frontend, `agent/` for backend)
4. Commit message format: `Phase 15 Instance X: [short description]`

---

## Instance A — LessonScript Types & useScriptPlayer Hook (Phase 3.2 Types + Hook)

### Goal
Define the canonical TypeScript interfaces for lesson scripts and build the core `useScriptPlayer` hook that drives playback.

### Files to Create
- **CREATE** `src/lib/player/types.ts`
- **CREATE** `src/lib/player/useScriptPlayer.ts`

### Specifications

```typescript
// src/lib/player/types.ts

export interface LessonScript {
  version: '1.0';
  chapterId: string;
  band: number;
  title: string;
  estimatedDurationMs: number;
  pronunciationOverrides: Record<string, string>;
  cues: Cue[];
}

export interface Cue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'speak' | 'show_component' | 'hide_component' | 'pan_map' | 'animate_route' | 'pause_for_response';
  params: SpeakParams | ShowComponentParams | HideComponentParams | PanMapParams | AnimateRouteParams | PauseParams;
}

export interface SpeakParams {
  text: string;
  audioFileId: string;
  ssml?: string;
}

export interface ShowComponentParams {
  componentType: 'map' | 'scene_image' | 'genealogy_tree' | 'dual_timeline' | 'scripture_card' | 'portrait_card' | 'definition_card' | 'comparison_view';
  componentId: string;
  data: Record<string, any>;
  transition: 'fade' | 'slide_up' | 'none';
}

export interface HideComponentParams {
  componentId: string;
  transition: 'fade' | 'slide_down' | 'none';
}

export interface PanMapParams {
  targetRegion: string;
  zoomLevel: number;
  durationMs: number;
}

export interface AnimateRouteParams {
  routeId: string;
  durationMs: number;
  style: 'dotted' | 'solid' | 'arrow';
}

export interface PauseParams {
  promptText: string;
  maxWaitMs: number;
  expectedResponseType: 'voice' | 'tap' | 'any';
}

export interface StorybookScript {
  version: '1.0';
  chapterId: string;
  band: 0 | 1;
  title: string;
  scenes: StorybookScene[];
}

export interface StorybookScene {
  id: string;
  imageUrl: string;
  altText: string;
  captionText: string;
  highlightedWords: string[];
  audioFileId: string;
}
```

```typescript
// src/lib/player/useScriptPlayer.ts
// Custom hook that drives cue-based playback using requestAnimationFrame.
//
// State:
//   phase: 'idle' | 'playing' | 'paused' | 'dialogue' | 'review' | 'complete'
//   currentTimeMs: number
//   activeCues: Cue[] — cues currently active (timestampMs <= currentTime < timestampMs + durationMs)
//   visibleComponents: Map<string, ShowComponentParams> — components currently rendered
//   transcriptText: string — current SpeakParams.text
//
// Methods:
//   play(): starts or resumes the RAF loop
//   pause(): stops the RAF loop, preserves currentTimeMs
//   seek(ms: number): jumps to a specific time
//   reset(): returns to idle state
//
// The hook does NOT play audio — it emits an `onAudioCue(audioFileId)` callback
// when a speak cue fires so the player component can handle <audio> playback.
//
// Export: useScriptPlayer(script: LessonScript | null, options: { onAudioCue?, onComplete? })
```

### Documentation
- Log all exported types and their purposes to `.antigravity/logs/phase15_progress.md`.
- Document the `useScriptPlayer` hook API (params, return value, callbacks).

### Testing
- Import `useScriptPlayer` in a scratch component, feed it a dummy 3-cue script, and verify `activeCues` changes as `currentTimeMs` advances.
- Verify `play()`, `pause()`, `seek()` all work correctly.
- Run `npx tsc --noEmit` — zero errors.

---

## Instance B — ScriptPlayer & StorybookPlayer Components (Phase 3.2 UI)

### Goal
Build two fluid, borderless, immersive player components inspired by modern video players (YouTube 2024/2025, Vimeo). ScriptPlayer is for Bands 2–5. StorybookPlayer is for Bands 0–1. Both are full-screen, edge-to-edge experiences completely excluded from the AppShell.

### Files to Create
- **CREATE** `src/components/player/ScriptPlayer.tsx`
- **CREATE** `src/components/player/StorybookPlayer.tsx`
- **CREATE** `src/components/player/OverlayControls.tsx`
- **CREATE** `src/components/player/OverlayCaption.tsx`
- **CREATE** `src/components/player/LessonDrawer.tsx`
- **CREATE** `src/components/player/useAutoHide.ts`

### Design Philosophy — The YouTube/Vimeo Lessons

Study how modern video players solved these exact problems. Apply the same patterns:

1. **Content fills 100% of the viewport.** No fixed percentages. No empty space beside the content. The canvas IS the entire screen — maps, illustrations, timelines render edge-to-edge. Like a YouTube video filling 100% width with dynamic height.
2. **Controls overlay the content and auto-hide.** Tap/hover to reveal, disappear after 3 seconds of inactivity. Semi-transparent gradient backdrop so controls are readable over any content. Like YouTube's bottom gradient bar.
3. **Captions/transcript overlays the content.** Not a separate bar. Text appears as translucent subtitle overlays on the bottom third of the canvas. Like YouTube closed captions.
4. **Metadata is accessible but not always visible.** Chapter title, phase badge, learner name — these live in a top overlay that appears with the controls and hides with them. Like YouTube's top-left title overlay.
5. **Navigation to other lessons is a slide-up drawer, not a separate page.** Like YouTube's "Up Next" queue. A bottom-sheet or side drawer shows the lesson list within the current chapter. User can peek it without leaving the player.
6. **Gesture-based interaction on mobile.** Tap = show/hide controls. Double-tap left/right = skip back/forward. Swipe up from bottom = lesson drawer. These are natural mobile patterns.
7. **No borders, no cards, no chrome.** The player is a dark, immersive surface. Visual components (scripture cards, portrait cards, etc.) float over the canvas with translucent backgrounds — they ARE part of the visual experience, not separate UI panels.

### ScriptPlayer Layout (Bands 2–5)

```
IDLE STATE (controls hidden — this is 95% of the viewing experience):
┌───────────────────────────────────────────────┐
│                                               │
│          CANVAS FILLS ENTIRE VIEWPORT         │
│     (map + visual components, edge-to-edge)   │
│                                               │
│                                               │
│                                               │
│   "Mizraim settled in the land we call Egypt" │  ← OverlayCaption (translucent, bottom)
└───────────────────────────────────────────────┘

ON TAP / HOVER (controls visible — auto-hide after 3s):
┌───────────────────────────────────────────────┐
│ ← Ch 1 · Section 2   ● Teaching   Amara (3) ✕│  ← Top overlay (gradient ↓)
│                                               │
│          CANVAS FILLS ENTIRE VIEWPORT         │
│                                               │
│                                               │
│   "Mizraim settled in the land we call Egypt" │  ← OverlayCaption
│ ▶ ━━━━━━━●━━━━━━━ 3:42/12:15  ⚙ ❓ 📋      │  ← OverlayControls (gradient ↑)
└───────────────────────────────────────────────┘

LESSON DRAWER (swipe up from bottom / tap 📋 icon):
┌───────────────────────────────────────────────┐
│          CANVAS (dimmed)                      │
│                                               │
├───────────────────────────────────────────────┤
│  ▾ Chapter 1: Creation, Babel & Table of...   │  ← Drag handle
│  ✓ 1.1 In the Beginning          ✓ Complete   │
│  ▶ 1.2 The Table of Nations      ● Playing    │
│    1.3 The Hamitic Line             Locked     │
│    1.4 Nimrod & the Tower           Locked     │
└───────────────────────────────────────────────┘
```

### ScriptPlayer Implementation Details

**Canvas area:**
- `width: 100vw; height: 100vh; position: fixed; top: 0; left: 0;`
- Background: `bg-black` (dark surface for maps to render cleanly against).
- Visual components from `useScriptPlayer.visibleComponents` render as absolutely-positioned children within the canvas. They float, fade in/out, and animate using `framer-motion`.
- Maps fill the full viewport background. Cards (ScriptureCard, PortraitCard, DefinitionCard) render as floating overlays with `bg-black/60 backdrop-blur-md` backgrounds.

**OverlayControls.tsx:**
- Fixed to bottom of viewport.
- Background: `transparent` → `linear-gradient(transparent, rgba(0,0,0,0.7) 80%)` — gradient appears only when controls are visible.
- Contains: play/pause toggle, thin progress bar (full-width, like YouTube), current time / total time, settings gear icon (speed), ask-question button (❓), lesson drawer toggle (📋).
- Progress bar: full viewport width, 3px height idle, expands to 5px on hover. Bright accent color. Draggable scrubber dot.
- Pill-shaped, translucent button containers (YouTube 2024 style).

**OverlayCaption.tsx:**
- Positioned at bottom-center of viewport, above the controls.
- Text rendered with `text-shadow: 0 1px 4px rgba(0,0,0,0.8)` for readability over any background.
- Background: `bg-black/50 rounded-lg px-4 py-2`.
- Font size: `text-lg md:text-xl`. Max-width: `max-w-prose`. Centered.
- Animates text changes with a subtle fade.

**Top overlay (metadata):**
- Back arrow (←), chapter + section title, phase badge (pill), learner name + band, close button (✕).
- Background: `linear-gradient(rgba(0,0,0,0.6), transparent)`.
- Same auto-hide timing as controls.

**useAutoHide.ts:**
- Custom hook: `useAutoHide(timeoutMs = 3000)`.
- Returns `{ isVisible, show, hide, toggle }`.
- On any user interaction (mousemove, touchstart, keypress), calls `show()` → starts timeout → `hide()` after `timeoutMs`.
- Controls, captions, and top overlay all read `isVisible`.
- During 'dialogue' or 'review' phase, controls are always visible (auto-hide disabled).

**LessonDrawer.tsx:**
- Bottom sheet / slide-up panel (use `framer-motion` `drag` for drag-to-dismiss).
- Shows all lessons in the current chapter with completion status.
- Tapping a lesson starts playing it (if unlocked).
- Drawer can be peeked (shows 2-3 lessons) or fully expanded.
- Like YouTube's "Up Next" queue panel.

**Mobile-specific (< 768px):**
- Tap anywhere = toggle controls visibility
- Double-tap left half = skip back 10 seconds
- Double-tap right half = skip forward 10 seconds
- Swipe up from bottom edge = open lesson drawer
- No hover states — everything is tap-based
- No cursor needed on any element

**Desktop-specific (≥ 768px):**
- Mouse move reveals controls
- Keyboard shortcuts: Space = play/pause, Left/Right = seek ±10s, F = fullscreen, Esc = exit
- Cursor hides after 3s of inactivity (like YouTube)

**Phase transitions:**
- Teaching (playing script): controls auto-hide, caption shows narration text
- Dialogue (child asks question): controls always visible, canvas dims to 70% opacity, speech bubble overlay appears, caption color shifts to purple
- Review (oral questions): controls always visible, canvas shows relevant visual per question, microphone icon pulses in center of canvas

**Props:** `script: LessonScript`, `lessonTitle: string`, `chapterTitle: string`, `band: number`, `lessons: Array<{id, title, status}>`.

### StorybookPlayer Layout (Bands 0–1)

```
IDLE (child is listening — full immersion):
┌───────────────────────────────────────────────┐
│                                               │
│                                               │
│        FULL-SCREEN ILLUSTRATION               │
│        (fills entire viewport)                │
│                                               │
│              ✨ Mizraim ✨                     │  ← Highlighted word (gold, large)
│                                               │
│ "Mizraim went to a land of wide rivers..."    │  ← Caption (translucent overlay)
│          ● ● ● ○ ○ ○   tap to continue →     │  ← Progress dots (subtle)
└───────────────────────────────────────────────┘
```

- **Completely different component** from ScriptPlayer. Not a mode switch.
- Full-screen illustration fills the entire viewport as a background image (`object-cover`).
- Dark gradient at bottom for caption readability.
- Caption text: large (24–28px), warm font, 1–2 sentences max.
- Highlighted word: appears large and gold/amber over the illustration as the AI speaks it.
- Tap anywhere = advance to next scene (like turning a page).
- Tap a highlighted word = replay that word's audio.
- Progress dots: small, subtle, at the very bottom. Show scene count.
- No controls bar, no progress bar, no settings — pure storybook experience.
- **Props:** `script: StorybookScript`.
- Band 1 additions: slightly more caption text, 3 picture-based review questions at the end.

### Documentation
- Log all component file paths, their props, and their intended usage to `.antigravity/logs/phase15_progress.md`.
- Document the auto-hide timing, gesture handling, and responsive breakpoint decisions.
- Note how visual components from Instance C are rendered inside the canvas (position, backdrop, animation).

### Testing
- Verify: ScriptPlayer fills the entire viewport edge-to-edge with no borders or chrome.
- Verify: Tapping/hovering reveals controls; they auto-hide after 3 seconds.
- Verify: Captions appear as translucent overlays, not separate bars.
- Verify: Lesson drawer slides up from bottom and shows chapter lessons.
- Verify: StorybookPlayer shows a full-screen image with tap-to-advance.
- Verify: On mobile (360px), no dead space, no horizontal scroll, all controls accessible via tap.
- Run `npx tsc --noEmit` — zero errors.

---

## Instance C — Visual Components (Phase 3.4 — All 9 Components)

### Goal
Build all 9 reusable visual components that the ScriptPlayer renders inside its canvas area. Each component is purely presentational — data passed via props, no data fetching.

### Files to Create
- **CREATE** `src/components/visuals/MapOverlay.tsx`
- **CREATE** `src/components/visuals/SceneImage.tsx`
- **CREATE** `src/components/visuals/GenealogyTree.tsx`
- **CREATE** `src/components/visuals/DualTimeline.tsx`
- **CREATE** `src/components/visuals/ScriptureCard.tsx`
- **CREATE** `src/components/visuals/PortraitCard.tsx`
- **CREATE** `src/components/visuals/DefinitionCard.tsx`
- **CREATE** `src/components/visuals/RouteAnimation.tsx`
- **CREATE** `src/components/visuals/ComparisonView.tsx`

### Specifications

Every component:
- Accept a `band` prop (0–5) that adjusts visual complexity per the band definitions in `.antigravity/roadmap.md` Section 4.
- Use Tailwind CSS + shadcn/ui design tokens (semantic colors only: `bg-card`, `text-foreground`, `border-border`, etc.).
- Use `framer-motion` for enter/exit animations (`motion.div` with `initial`, `animate`, `exit`).
- Render gracefully with missing/partial data — never crash on undefined fields.
- No component fetches its own data. All data comes via props.

| # | Component | Key Props | Notes |
|---|---|---|---|
| 1 | MapOverlay | `pngUrl, svgUrl, transform: {translateX, translateY, scaleX, scaleY, rotate}, highlights: string[], activeRegion?: string, band` | PNG as `<img>`, SVG as overlay `<div>` with CSS transform. Band 0: no SVG, just image. |
| 2 | SceneImage | `imageUrl, altText, caption?` | Full-width responsive image. Used in Band 0–1 only. |
| 3 | GenealogyTree | `treeData: {nodes: TreeNode[]}, revealUpTo?: string, band` | Band 0: hidden. Band 1: names only. Band 3+: names + dates + descriptors. Render as nested `<ul>` or SVG. |
| 4 | DualTimeline | `events: TimelineEvent[], mode: 'biblical' \| 'dual' \| 'historiography', activeEventId?: string, band` | Band 2: single row (biblical). Band 3–4: dual rows. Horizontal scrollable track. |
| 5 | ScriptureCard | `reference: string, text: string, connection?: string, band` | All bands. Band 0: very large text. Band 3+: text + 2-sentence connection. Card with amber/gold border. |
| 6 | PortraitCard | `name, title, dates, imageUrl, quote?` | Historical figure card. Image on left, text on right. |
| 7 | DefinitionCard | `term, definition, scriptureRef?, originalLanguage?: {script, transliteration, language}, band` | Band 2: plain definition. Band 3+: full definition + scripture + original language. |
| 8 | RouteAnimation | `svgPathId, style: 'dotted' \| 'solid' \| 'arrow', durationMs, isPlaying` | Animate an SVG `<path>` using CSS `stroke-dashoffset` animation. |
| 9 | ComparisonView | `biblicalData: {date, framework, evidence}, conventionalData: {date, framework, evidence}, resolution?, activeHighlight?` | Band 4–5 only. Side-by-side layout. Biblical side styled with primary colors, conventional side muted. |

### Documentation
- Log all 9 component file paths, their prop interfaces, and band-specific rendering behavior to `.antigravity/logs/phase15_progress.md`.
- For each component, note which bands it is visible in and which bands hide it.

### Testing
- Each component renders without errors when given minimal props.
- Band 0 vs Band 3 shows clear visual differences (e.g., GenealogyTree hidden vs full).
- Run `npx tsc --noEmit` — zero errors.

---

## Instance D — Cloud Run Deployment Fix & Band Param Wiring (Phase 3.1)

### Goal
Fix the signature mismatch in `server.ts` that prevents the History Explainer from receiving the `band` parameter, and ensure the deployment config supports Secret Manager.

### Files to Modify
- **MODIFY** `agent/src/server.ts` — Pass `band` to `handleHistoryExplainerSession`
- **MODIFY** `deploy_agent.sh` — Add `--set-secrets` for `GEMINI_API_KEY`

### server.ts Fix

On line 175, `handleHistoryExplainerSession` is called with 4 arguments, but the function signature in `historyExplainerSession.ts` requires 5 (including `band`):

```typescript
// BEFORE (line 155-175):
historyExplainerWss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    const lessonId = searchParams.get('lessonId');
    const familyId = searchParams.get('familyId');
    const learnerId = searchParams.get('learnerId');
    // ...
    handleHistoryExplainerSession(ws, lessonId, familyId, learnerId || 'unknown');
});

// AFTER:
historyExplainerWss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    const lessonId = searchParams.get('lessonId');
    const familyId = searchParams.get('familyId');
    const learnerId = searchParams.get('learnerId');
    const band = parseInt(searchParams.get('band') || '3', 10);
    // ...
    handleHistoryExplainerSession(ws, lessonId, familyId, learnerId || 'unknown', band);
});
```

### deploy_agent.sh Update

Ensure the deploy script (or `cloudbuild.yaml` if present) includes Secret Manager injection:
```bash
# Add to gcloud run deploy command:
--set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest
```

### Documentation
- Log the exact lines changed in `server.ts` and `deploy_agent.sh` to `.antigravity/logs/phase15_progress.md`.
- Document the full WebSocket URL format with all query params.

### Testing
- Verify: `agent/src/server.ts` compiles without TypeScript errors (`cd agent && npx tsc --noEmit`).
- Verify: WebSocket connection to `/v1/agent/history-explainer?lessonId=X&familyId=Y&learnerId=Z&band=3` correctly passes band to the session handler.

---

## Instance E — Lesson Script Generator CLI (Phase 3.5)

### Goal
Build a Node/Bun CLI script that reads chapter markdown and outputs a `LessonScript` JSON file.

### Files to Create
- **CREATE** `scripts/generate_lesson_script.ts`
- **CREATE** `docs/curriculum/history/generated_scripts/` (directory)
- **CREATE** `docs/curriculum/history/generated_scripts/lesson_ch01_band3.json` (first test output)

### Specifications

```
Usage: npx tsx scripts/generate_lesson_script.ts --chapter 1 --band 3

1. Read chapter content from docs/curriculum/history/my-first-textbook/chapter_01/
2. Read component data from docs/curriculum/history/component-data/chapter_01/
   - genealogy.json, timeline.json, scripture_refs.json, figures.json, definitions.json, comparisons.json
3. Read pronunciation dictionary from src/data/pronunciation.json
4. Assemble a LessonScript JSON:
   a. For each section of the chapter, create 'speak' cues with the narration text
   b. For each scripture reference, insert a 'show_component' cue (type: scripture_card)
   c. For each figure mentioned, insert a 'show_component' cue (type: portrait_card)
   d. For each key term, insert a 'show_component' cue (type: definition_card)
   e. Insert genealogy_tree and dual_timeline cues at natural break points
   f. Insert comparisons (band 4-5 only)
   g. Apply band-specific rules:
      - Band 0: Only speak + show_scene_image cues
      - Band 1: speak + show_scene_image + simplified genealogy + scripture_card
      - Band 2: All components except comparison_view, single-row timeline
      - Band 3: All components, dual timeline
      - Band 4-5: All components including comparison_view
5. Output to docs/curriculum/history/generated_scripts/lesson_ch{XX}_band{Y}.json
6. Log: chapter name, band, number of cues generated, estimated duration
```

### Important Notes
- This script uses heuristic splitting (headings, paragraphs) to create cues — it does NOT call an AI API. It produces a reasonable draft that an owner can review and refine.
- The `audioFileId` fields are set to placeholder values like `ch01_b3_cue_001` — actual TTS generation happens later.
- Cue timestamps are auto-calculated as sequential: each speak cue gets `estimatedDurationMs = wordCount * 80` (80ms per word ≈ 150 WPM).

### Documentation
- Log the CLI usage, output path, and any heuristic decisions (word-count-to-duration formula, section splitting strategy) to `.antigravity/logs/phase15_progress.md`.
- Include sample output stats: number of cues per type, total estimated duration.

### Testing
- Run: `npx tsx scripts/generate_lesson_script.ts --chapter 1 --band 3`
- Verify: Output file `lesson_ch01_band3.json` is valid JSON matching the `LessonScript` interface.
- Verify: Cue count > 10.

---

## Execution Order

These instances work on completely separate files and can run in parallel with zero risk of merge conflicts:

1. **Instance A (Types + Hook)** — No dependencies. Creates `src/lib/player/`.
2. **Instance B (Player Components)** — Depends on Instance A types at `src/lib/player/types.ts`. Run after A.
3. **Instance C (Visual Components)** — No dependencies. Creates `src/components/visuals/`. Fully independent.
4. **Instance D (Cloud Run Fix)** — No dependencies. Modifies `agent/` only. Fully independent.
5. **Instance E (Script Generator)** — No dependencies. Creates `scripts/` file + `docs/` output. Fully independent.

**Recommended parallel groups:**
- **Group 1:** Instance A + Instance C + Instance D + Instance E (all fully independent, zero shared files)
- **Group 2:** Instance B (after Instance A completes, so it can import the types)
