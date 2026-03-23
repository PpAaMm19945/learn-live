# Learn Live — Prompt Execution Log

> **Last updated:** 2026-03-22
> Consolidated record of all Jules/agent prompts executed across all phases.

---

## Legacy Phases 1–7 (Math Curriculum — ARCHIVED)

All legacy phases executed 2026-02-27. Math curriculum engine, DAG system, constraint templates, Gemini agent, Evidence Witness, Parent Judgment — all built and archived to `src/archive/` and `worker/src/archive/`.

---

## Phase 2: Authentication & Account System ✅

| Prompt | Task | Key Files |
|--------|------|-----------|
| P16 | D1 Auth Schema | `worker/db/migrations/002_auth_tables.sql` |
| P17 | JWT & Cookie Utilities | `worker/src/lib/auth/jwt.ts`, `cookies.ts`, `middleware.ts` |
| P18 | Magic Link Flow | `worker/src/lib/auth/magicLink.ts` |
| P19 | Google OAuth Flow | `worker/src/lib/auth/google.ts` |
| P20 | Password + Email Verification | `worker/src/lib/auth/password.ts`, `emailVerification.ts` |
| P21 | Account Linking | `worker/src/lib/auth/accountLink.ts` |
| P22 | Auth Middleware & `/api/auth/me` | Wired in `worker/src/index.ts` |
| P23 | Frontend Auth Store | `src/lib/auth.ts`, Login/Register pages |
| P24 | UI Polish & Route Guards | Auth pages polished, `ProtectedRoute` |
| P25 | Smoke Test & Cleanup | Legacy archived, build verified |

**Endpoints:** `/api/auth/me`, `/logout`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/magic-link`, `/magic-link/verify`, `/google`, `/google/callback`, `/set-password`

---

## Phase 3: African History Curriculum ✅

4 parallel Jules instances + integration step (2026-03-11).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | D1 Schema (Topics, Lessons, Sources, RAG_Chunks, Progress, Quiz) | `003_history_curriculum.sql` |
| B | R2 Content Pipeline (ingest, chunk, retrieve) | `worker/src/lib/content/` |
| C | Frontend UI (Dashboard, TopicDetail, LessonView) | `src/pages/parent/` |
| D | Quiz & Progress Components | `src/components/quiz/`, `progress/` |

---

## Phase 4: Content Ingestion & AI Adaptation ✅

4 parallel instances (2026-03-12).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | Band Adaptation Prompt Pipeline | `worker/src/lib/content/adapt.ts` |
| B | BandSelector + AdaptedContentReader UI | `src/components/content/` |
| C | Content Serving API + D1 Cache | `worker/src/routes/content.ts`, `004_adaptation_cache.sql` |
| D | ReadingView Page | `src/pages/ReadingView.tsx` |

---

## Phase 5: Assessment & Oral Examiner ✅

4 parallel instances (2026-03-12).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | Oral Examiner Agent | `worker/src/lib/examiner/agent.ts` |
| B | Exam Session API Routes | `worker/src/routes/examiner.ts`, `005_exam_sessions.sql` |
| C | Frontend Exam UI | `src/pages/ExamView.tsx`, `src/components/exam/` |
| D | Artifact Verification | `worker/src/routes/artifacts.ts`, `006_artifacts.sql` |

---

## Phase 6: Explainer Canvas ✅

| Task | Key Files |
|------|-----------|
| History Canvas Elements | `src/lib/canvas/primitives/` |
| Agent Integration | `agent/src/historyExplainerSession.ts` |
| UI/UX | `src/components/canvas/HistoryCanvas.tsx` |

---

## Phase 7: Production Readiness ✅

4 parallel instances. Prompts were in `prompts-phase7.md`.

| Instance | Task |
|----------|------|
| A | Legacy Worker Cleanup (~1300 lines → modular router) |
| B | Chapter Content API & Family Management |
| C | Frontend Polish & Mobile Readiness |
| D | Deployment Pipeline & Data Seeding |

---

## Phase 8: Content Pipeline & Pilot Readiness ✅

3 parallel instances. Prompts were in `prompts-phase8.md`.

| Instance | Task |
|----------|------|
| A | Content Pipeline & R2 Upload |
| B | Admin Analytics Dashboard |
| C | Onboarding Flow & Feedback |

---

## Phase 9: Content Expansion ✅

2 parallel instances. Prompts were in `prompts-phase9.md`.

| Instance | Task |
|----------|------|
| A | Glossary, Index & Content Infrastructure |
| B | World History Context Sidebars |

---

## Phase 10: UI/UX Overhaul ✅

Prompts in `prompts-phase10.md` (now archived). 4 instances:
- A: Global Learner Context Store (Zustand)
- B: Unified AppShell with Persistent Navigation
- C: Dashboard & Lesson Flow Redesign
- D: Pre-Generate Content Script

---

## Phase 11: Post-Merge Cleanup ✅

Prompts in `prompts-phase11.md` (now archived). 4 instances:
- A: Remove redundant headers from AppShell pages
- B: Progress page placeholder
- C: Onboarding → Dashboard continuity
- D: Pre-generate content script

---

## Phase 12: Data Quality & Deployment ✅

Prompts in `prompts-phase12.md` (now archived). Focused on pending migrations, reading polish, error handling.

---

## Phase 13: Content Production ✅

### 13A: SVG Map Overlays
30 maps, 6 batches of 5. Prompts were in `prompts-phase13-svg-maps.md`.

### 13B: Pronunciation Dictionary
9 chapters, 3 batches. Prompts were in `prompts-phase13-pronunciation.md`.

### 13C: Component Data Extraction
9 chapters × 6 data types, 3 batches. Prompts were in `prompts-phase13-component-data.md`.

---

## Phase 14: SVG Alignment Tool ✅

Single Jules instance. Standalone browser tool. Prompts were in `prompts-phase14-alignment-tool.md`.

---

## Phase 15: Session Engine ✅

5 parallel instances. Prompts were in `prompts-phase15-session-engine.md`.

| Instance | Task |
|----------|------|
| A | LessonScript Types + useScriptPlayer Hook |
| B | ScriptPlayer + StorybookPlayer (YouTube-style) |
| C | 9 Visual Components |
| D | Cloud Run band param fix + deploy script |
| E | Lesson Script Generator CLI |

---

## Phase 16: MapLibre Teaching Canvas

4 parallel Jules instances. Prompts below are the full execution instructions.

| Instance | Task | Dependencies |
|----------|------|-------------|
| 16A | MapLibre Integration + TeachingCanvas Shell | None |
| 16B | Historical GeoJSON Data (Chapter 1) | None |
| 16C | Agent Tool-Call Rewrite | None |
| 16D | Frontend Tool-Call Handler + Integration | Depends on 16A |

**Run 16A, 16B, 16C simultaneously. Run 16D after 16A merges (or simultaneously with merge-time fix for TeachingCanvas import).**

---

### Prompt 16A: MapLibre Integration + TeachingCanvas Shell

**Context files to read first:**
- `src/components/canvas/HistoryCanvas.tsx` (the component you're replacing)
- `src/components/player/ScriptPlayer.tsx` (consumes the canvas)
- `src/lib/player/types.ts` (LessonScript types)
- `src/lib/canvas/primitives/index.ts` (existing canvas primitive types)
- `package.json` (to add maplibre-gl)

**Task:**

Install `maplibre-gl` as a project dependency.

Create `src/components/canvas/TeachingCanvas.tsx`:
- Wraps a MapLibre GL JS `Map` instance in a React component
- Uses `useRef` + `useEffect` for map initialization (MapLibre is imperative, not declarative)
- Base tile style: Use a free terrain/natural style (e.g., MapTiler's "topo" or "outdoor" style, or a self-hosted Protomaps PMTiles file). The map should look earthy and muted — not Mapbox's bright blue default. Match the app's dark theme (`#0f0e0b` background, `#e8e4d8` text).
- Default view: center on `[32, 15]` (Northeast Africa), zoom `3.5`, showing from Babel (Mesopotamia) to Libya
- `preserveAspectRatio` behavior: fill container, no letterboxing

Expose an imperative API via `useImperativeHandle` + `React.forwardRef`:

```typescript
interface TeachingCanvasRef {
  zoomTo(lng: number, lat: number, zoom?: number, duration?: number): void;
  highlightRegion(featureId: string, color: string, opacity?: number): void;
  clearHighlight(featureId: string): void;
  drawRoute(coordinates: [number, number][], color: string, style: 'migration' | 'trade' | 'conquest', animate?: boolean): string;
  removeRoute(routeId: string): void;
  placeMarker(lng: number, lat: number, label: string, color?: string): string;
  removeMarker(markerId: string): void;
  clearOverlays(): void;
  flyTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number }): void;
}
```

Implementation notes:
- `highlightRegion` uses MapLibre's `setPaintProperty` on a GeoJSON fill layer to change color/opacity
- `drawRoute` adds a GeoJSON LineString source + layer with appropriate dash pattern:
  - `migration`: `[8, 4]` dash, 2px width
  - `trade`: `[2, 2]` dash, 1.5px width
  - `conquest`: solid, 3px width
- Route animation: use `strokeDashoffset` animation via `requestAnimationFrame`
- `placeMarker` uses MapLibre `Marker` class with custom HTML element (colored dot + label)
- Map controls: minimal — zoom buttons only, no rotation, no compass

Build overlay panel system as HTML positioned over the MapLibre canvas (not inside the map):
- `ScriptureCard` overlay: positioned bottom-left, border-left accent, ref + text + connection
- `GenealogyPanel` overlay: positioned top-right, tree layout with colored dots and connecting lines
- `TimelineBar` overlay: positioned bottom, horizontal track with event dots
- `FigureCard` overlay: positioned top-left, portrait image + name + title
- All overlays use `framer-motion` for enter/exit animations
- All overlays use the app's design tokens (bg-card, border-border, text-foreground, etc.)

Create `src/components/canvas/TeachingCanvas.css` for MapLibre-specific styles.

The component should accept these props:
```typescript
interface TeachingCanvasProps {
  chapterGeoJSON?: GeoJSON.FeatureCollection;
  className?: string;
}
```

Update `src/components/player/ScriptPlayer.tsx`:
- Replace `<HistoryCanvas>` with `<TeachingCanvas ref={canvasRef}>`
- Pass chapter GeoJSON data
- When `visibleComponents` includes map-related cues, call the imperative API

Do NOT delete `HistoryCanvas.tsx` yet — just stop importing it in ScriptPlayer.

**Build verification:** `npm run build` must pass. The map should render in the player page even without GeoJSON data (shows base map only).

---

### Prompt 16B: Historical GeoJSON Data (Chapter 1)

**Context files to read first:**
- `docs/curriculum/history/component-data/chapter_01/` (all 6 JSON files)
- `docs/curriculum/history/my-first-textbook/` (Chapter 1 text for geographic descriptions)

**Task:**

Create historical GeoJSON files for Chapter 1.

Create `src/data/geojson/ch01_regions.geojson`:

Regions to create (approximate boundaries based on ancient geography):
1. **Mizraim (Egypt)**: Nile Delta south to First Cataract (~24°N). Eastern border at Sinai, western border at Libyan Desert. Color: `#fac775`
2. **Cush (Nubia)**: First Cataract (~24°N) south to Khartoum confluence (~15.5°N). East to Red Sea hills, west to desert. Color: `#afa9ec`
3. **Phut (Libya)**: West of Egypt, Mediterranean coast from Cyrenaica to Tunisia. Color: `#f0997b`
4. **Canaan**: Eastern Mediterranean coast from Gaza to Sidon, inland to Jordan River. Color: `#5dcaa5`

Each feature properties: `{ "id": "mizraim", "name": "Mizraim (Egypt)", "color": "#fac775", "chapter": 1, "type": "kingdom" }`

Create `src/data/geojson/ch01_routes.geojson`:
Migration routes as LineStrings with waypoints:
1. **Babel → Egypt**: From Babylon (~44.4°E, 32.5°N) through Levant corridor, down coast to Nile Delta. Color: `#fac775`, style: migration
2. **Babel → Nubia**: From Babylon through Levant, up Nile south past First Cataract. Color: `#afa9ec`, style: migration
3. **Babel → Libya**: From Babylon through Levant, along North African coast westward. Color: `#f0997b`, style: migration

Create `src/data/geojson/ch01_markers.geojson`:
Named locations as Points:
- Babel (Babylon): `[44.4, 32.5]`
- Memphis: `[31.25, 29.85]`
- Thebes (Luxor): `[32.65, 25.7]`
- Kerma: `[30.4, 19.6]`
- Cyrene: `[21.85, 32.82]`
- Sidon: `[35.37, 33.56]`

Create `src/data/geojson/index.ts`:
```typescript
import ch01Regions from './ch01_regions.geojson';
import ch01Routes from './ch01_routes.geojson';
import ch01Markers from './ch01_markers.geojson';

export function getChapterGeoJSON(chapter: number) {
  switch (chapter) {
    case 1: return { regions: ch01Regions, routes: ch01Routes, markers: ch01Markers };
    default: return null;
  }
}
```

Add GeoJSON import support to `vite.config.ts` if needed (`.geojson` → JSON import, or rename files to `.json`).

**Coordinate accuracy:** Use approximate but visually correct boundaries. Reference the Ancient World Mapping Center (awmc.unc.edu). These need to look right at zoom level 3–6, not be archaeologically precise.

**Build verification:** All files must be valid GeoJSON. `npm run build` must pass.

---

### Prompt 16C: Agent Tool-Call Rewrite

**Context files to read first:**
- `agent/src/historyExplainerTools.ts` (current tool definitions — REPLACING)
- `agent/src/historyExplainerSession.ts` (session handler — UPDATING)
- `agent/src/server.ts` (Express routes)
- `agent/src/gemini.ts` (Gemini session wrapper)

**Task:**

Rewrite `agent/src/historyExplainerTools.ts` with MapLibre-native tools. The old tools (`show_element`, `animate_element`, `remove_element`, `show_map_overlay`, `highlight_route`, `zoom_map`) are replaced entirely.

New tool definitions (Gemini function calling format):

```typescript
export const MAPLIBRE_TEACHING_TOOLS = [
  {
    name: 'zoom_to',
    description: 'Smoothly fly the map camera to a named location or coordinates.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: { type: 'STRING', description: 'Named location (e.g., "babel", "egypt", "nile_delta")' },
        lng: { type: 'NUMBER', description: 'Longitude (if location is "coords")' },
        lat: { type: 'NUMBER', description: 'Latitude (if location is "coords")' },
        zoom: { type: 'NUMBER', description: 'Target zoom level (default: 5)' },
        duration: { type: 'NUMBER', description: 'Animation duration in ms (default: 800)' },
      },
      required: ['location'],
    },
  },
  {
    name: 'highlight_region',
    description: 'Fill an ancient kingdom boundary with a translucent color on the map.',
    parameters: {
      type: 'OBJECT',
      properties: {
        regionId: { type: 'STRING', description: 'Region ID matching GeoJSON feature (e.g., "mizraim", "cush", "phut", "canaan")' },
        color: { type: 'STRING', description: 'Fill color (e.g., "#fac775")' },
        opacity: { type: 'NUMBER', description: 'Fill opacity 0-1 (default: 0.25)' },
      },
      required: ['regionId', 'color'],
    },
  },
  {
    name: 'draw_route',
    description: 'Animate a migration, trade, or conquest route between two named locations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        from: { type: 'STRING', description: 'Starting location ID (e.g., "babel")' },
        to: { type: 'STRING', description: 'Ending location ID (e.g., "egypt")' },
        style: { type: 'STRING', enum: ['migration', 'trade', 'conquest'] },
        color: { type: 'STRING', description: 'Route color (default: uses destination region color)' },
      },
      required: ['from', 'to', 'style'],
    },
  },
  {
    name: 'place_marker',
    description: 'Drop a labeled marker at a named city or site.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: { type: 'STRING', description: 'Named location ID' },
        label: { type: 'STRING', description: 'Display label' },
        color: { type: 'STRING', description: 'Marker color' },
      },
      required: ['location', 'label'],
    },
  },
  {
    name: 'show_scripture',
    description: 'Display a scripture reference card overlaid on the map.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reference: { type: 'STRING', description: 'e.g., "Genesis 10:6"' },
        text: { type: 'STRING', description: 'The scripture text' },
        connection: { type: 'STRING', description: 'How this connects to the lesson' },
      },
      required: ['reference', 'text'],
    },
  },
  {
    name: 'show_genealogy',
    description: 'Display an animated genealogy tree panel.',
    parameters: {
      type: 'OBJECT',
      properties: {
        rootName: { type: 'STRING' },
        nodes: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { name: { type: 'STRING' }, parent: { type: 'STRING' }, descriptor: { type: 'STRING' }, color: { type: 'STRING' } },
            required: ['name'],
          },
        },
      },
      required: ['rootName', 'nodes'],
    },
  },
  {
    name: 'show_timeline',
    description: 'Display a timeline bar with historical events.',
    parameters: {
      type: 'OBJECT',
      properties: {
        events: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { year: { type: 'NUMBER' }, label: { type: 'STRING' }, color: { type: 'STRING' } },
            required: ['year', 'label'],
          },
        },
      },
      required: ['events'],
    },
  },
  {
    name: 'show_figure',
    description: 'Display a historical figure portrait card.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING' },
        title: { type: 'STRING' },
        imageUrl: { type: 'STRING' },
      },
      required: ['name', 'title'],
    },
  },
  {
    name: 'clear_canvas',
    description: 'Remove all overlays, routes, markers, and panels. Return to clean map.',
    parameters: { type: 'OBJECT', properties: {}, required: [] },
  },
];
```

Update `buildHistoryExplainerPrompt()` — replace CANVAS USAGE section with:

```
CANVAS USAGE:
- The teaching canvas is a live, programmable map powered by MapLibre GL JS.
- You can zoom to any named location — the map will smoothly fly there.
- Ancient kingdom boundaries (Mizraim, Cush, Phut, Canaan) are loaded as GeoJSON polygons. Call highlight_region to fill them with color.
- Migration routes are pre-defined LineStrings. Call draw_route with location names — the frontend resolves coordinates.
- Use place_marker to label cities as you mention them.
- Use show_scripture when reading a verse aloud — the card appears on screen as you speak.
- Use show_genealogy when teaching family trees.
- Use show_timeline to anchor events in time.
- Use clear_canvas between major topic transitions.
- NEVER reference canvas coordinates, pixel positions, or element IDs. Use semantic names only.
```

Keep band-aware sections and theological guardrails unchanged.

Update `agent/src/historyExplainerSession.ts` to import `MAPLIBRE_TEACHING_TOOLS` and forward tool calls as:
```json
{ "type": "tool_call", "tool": "highlight_region", "args": { "regionId": "mizraim", "color": "#fac775" } }
```

**Build verification:** `cd agent && npx tsc --noEmit` must pass.

---

### Prompt 16D: Frontend Tool-Call Handler + Integration

**Context files to read first:**
- `src/components/player/ScriptPlayer.tsx`
- `src/lib/player/useScriptPlayer.ts`
- `src/lib/player/types.ts`
- `src/pages/LessonPlayerPage.tsx`
- `src/components/canvas/TeachingCanvas.tsx` (created by 16A)

**Task:**

Create `src/lib/canvas/toolCallHandler.ts`:

```typescript
import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';

export interface ToolCallMessage {
  type: 'tool_call';
  tool: string;
  args: Record<string, any>;
}

export function handleToolCall(canvas: TeachingCanvasRef, message: ToolCallMessage): void {
  switch (message.tool) {
    case 'zoom_to':
      canvas.zoomTo(message.args.lng, message.args.lat, message.args.zoom, message.args.duration);
      break;
    case 'highlight_region':
      canvas.highlightRegion(message.args.regionId, message.args.color, message.args.opacity);
      break;
    case 'draw_route':
      canvas.drawRoute(/* resolve from/to */, message.args.color, message.args.style, true);
      break;
    case 'place_marker':
      canvas.placeMarker(/* resolve location */, message.args.label, message.args.color);
      break;
    case 'clear_canvas':
      canvas.clearOverlays();
      break;
  }
}
```

Create `src/data/geojson/locations.ts` — named location resolver:
```typescript
export const NAMED_LOCATIONS: Record<string, [number, number]> = {
  babel: [44.4, 32.5], egypt: [31.0, 27.0], nile_delta: [31.0, 30.5],
  memphis: [31.25, 29.85], thebes: [32.65, 25.7], cush: [31.0, 18.0],
  kerma: [30.4, 19.6], phut: [20.0, 32.0], cyrene: [21.85, 32.82],
  canaan: [35.0, 32.0], sidon: [35.37, 33.56],
};
```

Build sidebar UI components:
- `src/components/player/VoiceIndicator.tsx` — waveform bars animated when audio streams
- `src/components/player/TranscriptPanel.tsx` — scrolling transcript with active line highlighted
- `src/components/player/CanvasActionLog.tsx` — tool call log with icons + tool name + target

Update `ScriptPlayer.tsx` layout to match the mockup:
- Grid: `grid-template-columns: 1fr 320px; grid-template-rows: 48px 1fr 80px;`
- Top bar: chapter title + phase pill (Teaching=green, Dialogue=purple, Review=gold) + learner chip + exit
- Main: TeachingCanvas (left) + sidebar (right)
- Bottom: play/pause, seek back, progress bar, time, phase button
- Use app design tokens, not hardcoded colors

Create `src/lib/canvas/useWebSocketCanvas.ts`:
- Hook connecting to Cloud Run agent WebSocket
- Receives interleaved audio chunks + tool call messages
- Audio → Web Audio API playback
- Tool calls → `handleToolCall()` → TeachingCanvas ref
- Exposes: `{ isConnected, isPlaying, transcript, toolCallLog, startSession, endSession }`

**Build verification:** `npm run build` must pass. Player page renders new layout without live WebSocket.
