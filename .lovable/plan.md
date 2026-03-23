

# Audit Report and Loose Ends Fix Plan

## Issues Found

### 1. MapTiler API Key is "PLACEHOLDER"
**File**: `src/components/canvas/TeachingCanvas.tsx`, line 31
**Problem**: `MAP_STYLE` URL uses `key=PLACEHOLDER`. The MapLibre map will fail to load tiles in production. This needs a real MapTiler key injected via environment variable (`VITE_MAPTILER_KEY`).
**Fix**: Change to `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY || 'PLACEHOLDER'}` and document the required env var.

### 2. Legacy `primitives/index.ts` imports from `@/archive`
**File**: `src/lib/canvas/primitives/index.ts`, line 1
**Problem**: `import { CanvasElement, CanvasOperation } from '@/archive/explainerClient'` — this pulls types from archived code. The entire `primitives/` directory (`MapPrimitives.ts`, `TimelinePrimitives.ts`, `FigurePrimitives.ts`, `EventPrimitives.ts`) is the old SVG-based system that has been replaced by MapLibre's `TeachingCanvas`.
**Fix**: Move the entire `src/lib/canvas/primitives/` directory to `src/archive/canvas/primitives/`. Nothing in active code imports from it except `HistoryCanvas.tsx` (also legacy).

### 3. Legacy `HistoryCanvas.tsx` still in active components
**File**: `src/components/canvas/HistoryCanvas.tsx`
**Problem**: This is the old SVG-based canvas that renders PNG base maps with SVG elements. It is imported by `NarratedLessonView.tsx`. Both are superseded by `TeachingCanvas.tsx` + `ScriptPlayer.tsx` via `LessonPlayerPage.tsx`.
**Fix**: Move `HistoryCanvas.tsx` to `src/archive/canvas/`. Move `PlaybackControls.tsx` and `TranscriptBar.tsx` to archive too (replaced by `OverlayControls`, `TranscriptPanel`). Update or archive `NarratedLessonView.tsx` since it uses the old system.

### 4. `NarratedLessonView.tsx` uses legacy canvas system
**File**: `src/pages/NarratedLessonView.tsx`
**Problem**: Imports `HistoryCanvas`, `PlaybackControls`, `TranscriptBar` — all legacy components. This page duplicates the functionality now in `LessonPlayerPage.tsx`.
**Fix**: Archive `NarratedLessonView.tsx` to `src/archive/pages/`. Verify no active route points to it.

### 5. WebSocket URL hardcoded to `localhost:3000`
**File**: `src/components/player/ScriptPlayer.tsx`, line 46
**Problem**: `useWebSocketCanvas('ws://localhost:3000')` — hardcoded dev URL. Will fail in production.
**Fix**: Use an environment variable: `import.meta.env.VITE_WS_URL || 'ws://localhost:3000'`.

### 6. Console warning: Badge component ref issue
**Problem**: `Function components cannot be given refs` warning from `Badge` in `Dashboard`. Minor but noisy.
**Fix**: Wrap `Badge` component with `React.forwardRef` in `src/components/ui/badge.tsx`.

### 7. Admin ContentTools still manages PNG/SVG alignment
**File**: `src/pages/admin/ContentTools.tsx` (625 lines)
**Problem**: The `MapAlignmentTab` manages PNG/SVG overlay alignment — the exact system being replaced by MapLibre. This is now dead functionality.
**Fix**: Keep for now but add a deprecation banner at the top of the tab: "This tool manages legacy PNG/SVG maps. The teaching canvas now uses MapLibre GL JS." No code removal needed yet — it still works for reference.

### 8. `TeachingCanvas` overlay state is internal-only
**Problem**: The `activeScripture`, `activeFigure`, `activeGenealogy`, `activeTimeline` states in `TeachingCanvas.tsx` are declared but have no imperative API to set them. The `TeachingCanvasRef` interface doesn't expose `showScripture()`, `showFigure()`, etc.
**Fix**: Add these methods to the `useImperativeHandle` block: `showScripture(ref, text, connection?)`, `showFigure(name, title, imageUrl?)`, `showGenealogy(rootName, nodes)`, `showTimeline(events)`, `dismissOverlay(type)`. Wire them to the existing state setters.

## Execution Plan

| Step | Action | Files |
|------|--------|-------|
| 1 | Add MapTiler env var support to TeachingCanvas | `TeachingCanvas.tsx` |
| 2 | Add overlay imperative methods to TeachingCanvasRef | `TeachingCanvas.tsx` |
| 3 | Add overlay tool calls to toolCallHandler | `toolCallHandler.ts` |
| 4 | Fix WebSocket URL to use env var | `ScriptPlayer.tsx` |
| 5 | Archive legacy canvas files | Move `HistoryCanvas.tsx`, `PlaybackControls.tsx`, `TranscriptBar.tsx`, primitives dir, `NarratedLessonView.tsx` to `src/archive/` |
| 6 | Fix Badge forwardRef warning | `badge.tsx` |
| 7 | Add deprecation banner to MapAlignmentTab | `ContentTools.tsx` |

## What This Does NOT Touch
- Worker/backend code (no changes needed)
- GeoJSON data files (correct and complete for Chapter 1)
- Player components (`ScriptPlayer`, `StorybookPlayer`, `OverlayControls`, etc.)
- Documentation (already consolidated)

