# Phase 6: Explainer Canvas for History — Detailed Plan

**Created:** March 2026  
**Depends on:** Phase 3 (Curriculum Schema), Phase 4 (Adaptation Engine)  
**Files Created:** 6 new library modules, 1 new component, 1 updated agent file

---

## Goal
Repurpose the existing Explainer Canvas (whiteboard system for math) as an **Interactive Narrator** for African History. The AI narrates chapter segments while animating maps, trade routes, timelines, and key events on a digital canvas.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Interactive Narrator                         │
│                        (History Explainer Canvas)                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐                                                │
│  │  NarratorView.tsx│  ← Main component: lesson selector + canvas  │
│  └────────┬─────────┘                                                │
│           │                                                          │
│  ┌────────▼─────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │  Canvas.tsx      │  │  Timeline.tsx    │  │  MapOverlay.tsx     │  │
│  │  (whiteboard)    │  │  (chronology)    │  │  (geographic base)  │  │
│  └────────┬─────────┘  └──────────────────┘  └─────────────────────┘  │
│           │                                                          │
│  ┌────────▼─────────┐                                                │
│  │  Canvas Primitives Library                                        │
│  │  ├─ MapPrimitives.ts      → Trade routes, migration arrows        │
│  │  ├─ TimelinePrimitives.ts  → Era bands, date markers              │
│  │  ├─ FigurePrimitives.ts    → Character cards, speech bubbles      │
│  │  └─ EventPrimitives.ts     → Battle markers, building icons       │
│  └──────────────────┘                                                │
│           │                                                          │
│  ┌────────▼─────────┐                                                │
│  │  Explainer Agent   │  ← agent/src/historyExplainerSession.ts      │
│  │  (adapted prompt)  │     Band-aware historical narration          │
│  └────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Task Breakdown

### Task 6.1: History Canvas Elements Library

Create the primitives library for visualizing historical concepts.

**New Files:**
```
src/lib/canvas/primitives/
├── MapPrimitives.ts       # Trade routes, migration paths, territory fills
├── TimelinePrimitives.ts   # Era markers, date labels, duration bars
├── FigurePrimitives.ts     # Character cards, speech bubbles, portraits
└── EventPrimitives.ts      # Battle icons, building markers, cultural symbols
```

**MapPrimitives.ts:**
- `createTradeRoute(from, to, color, style)` — animated dashed lines
- `createMigrationArrow(origin, destinations, waveCount)` — curved arrows with ripple
- `createTerritoryOverlay(regionId, fillColor, label)` — SVG path overlays
- `createClimateZone(type, bounds)` — desert/rainforest/savannah patterns

**TimelinePrimitives.ts:**
- `createEraBand(startYear, endYear, label, color)` — horizontal era bars
- `createDateMarker(year, label, importance)` — vertical tick with label
- `createDurationConnector(from, to, label)` — connecting lines between events

**FigurePrimitives.ts:**
- `createFigureCard(id, name, title, portraitUrl)` — character introduction card
- `createSpeechBubble(figureId, quote, context)` — contextual quote display
- `createComparisonPanel(figures[])` — side-by-side figure comparison

**EventPrimitives.ts:**
- `createBattleMarker(location, factions, outcome)` — crossed swords icon
- `createBuildingIcon(type, location, era)` — architecture symbols
- `createCulturalSymbol(type, region)` — artifact/mask/textile icons

---

### Task 6.2: Adapt Explainer Agent for History

Adapt the existing `explainerSession.ts` agent for historical narration.

**Modified File:** `agent/src/historyExplainerSession.ts` (new file, based on `explainerSession.ts`)

**Key Adaptations:**

1. **Tool Schema Updates:**
   - Add `show_map_overlay` tool — display geographic regions
   - Add `show_timeline` tool — display chronological markers
   - Add `show_figure` tool — display key historical figures
   - Add `highlight_route` tool — animate trade/migration routes
   - Keep `show_element`, `animate_element`, `remove_element`, `clear_canvas`

2. **System Prompt Changes:**
   ```
   YOUR ROLE:
   - You are a knowledgeable, warm narrator of African History
   - You tell stories that connect events, people, and places
   - You use the canvas to make history visible — maps show where,
     timelines show when, figures show who
   
   NARRATION STYLE (Band-aware):
   - Band 0-1: Simple stories, few elements on canvas at once, slow pacing
   - Band 2-3: More detail, show relationships between events
   - Band 4-5: Nuanced analysis, compare multiple perspectives
   
   CANVAS USAGE:
   - ALWAYS start with the map base layer from R2
   - Use map overlays to show territories, trade routes, migration paths
   - Use timeline to anchor events in time
   - Use figure cards when introducing key people
   - Clear and transition smoothly between scenes
   ```

3. **Content Integration:**
   - Query `GET /api/lessons/:id/content?band=N` for adapted text
   - Fetch `Sources` and `RAG_Chunks` for narrative context
   - Use chapter metadata to guide scene transitions

---

### Task 6.3: Narrated Lesson Flow

Create the user experience for AI-narrated history lessons.

**New Files:**
```
src/pages/
└── NarratedLessonView.tsx    # Main lesson view with canvas + narration

src/components/canvas/
├── Canvas.tsx                # Interactive SVG canvas component
├── MapOverlay.tsx            # Base map + overlay management
├── Timeline.tsx              # Chronological timeline component
└── PlaybackControls.tsx      # Play/pause, speed, band selector
```

**NarratedLessonView.tsx Flow:**

1. **Initialization:**
   - Load lesson metadata from D1
   - Fetch adapted content for selected band
   - Load base map from R2 (based on lesson.geographic_focus)
   - Initialize ExplainerClient WebSocket

2. **Canvas State Management:**
   ```typescript
   interface CanvasState {
     baseMap: string;              // R2 URL for map image
     overlays: MapOverlay[];       // Territory, route overlays
     timeline: TimelineMarker[];   // Chronological markers
     figures: FigureCard[];        // Active character cards
     activeAnimations: string[];   // Currently running animations
   }
   ```

3. **Narration Pipeline:**
   - AI receives lesson chunk + canvas state
   - AI generates narration + canvas operations
   - Operations sent via WebSocket as atomic payloads
   - Client renders operations synced with audio

4. **Band-Aware Pacing:**
   | Band | Chunk Size | Elements/Scene | Animation Speed |
   |------|-----------|----------------|-----------------|
   | 0-1  | 2-3 sentences | 2-3 | Slow (1.5x duration) |
   | 2-3  | Paragraph | 4-5 | Normal |
   | 4-5  | Full section | 6-7 | Normal |

---

### Task 6.4: Wire Map Assets from R2

Connect the geographic content in R2 to the canvas system.

**Map Asset Structure (already in R2):**
```
maps/
├── chapter_01/
│   ├── table_of_nations_base.png    # Base map image
│   ├── table_of_nations_overlay.svg  # Interactive territory boundaries
│   └── metadata.json                # Map bounds, markers, labels
├── chapter_02/
│   ├── ancient_egypt_base.png
│   ├── ancient_egypt_overlay.svg
│   └── metadata.json
└── ... (34 total maps)
```

**API Endpoint for Maps:**
```typescript
// GET /api/lessons/:id/map-assets
{
  baseMapUrl: string;           // R2 public URL
  overlaySvg: string;           // SVG content or URL
  markers: MapMarker[];         // Predefined points of interest
  metadata: {
    bounds: [number, number, number, number];  // [west, south, east, north]
    era: string;
    defaultCenter: [number, number];
    defaultZoom: number;
  }
}
```

**Canvas Integration:**
- Base map renders as `<image>` element in SVG canvas
- Overlays render as SVG `<path>` elements on top
- Zoom/pan controls allow exploration (Band 2+ gets interactive mode)

---

## WebSocket Protocol Updates

**New Message Types for History Narration:**

```typescript
// Server → Client
interface NarrationMessage {
  type: 'atomic';
  seqId: number;
  audio: string | null;         // Base64 PCM audio
  ops: CanvasOperation[];         // Visual operations
  narrationText: string;          // For subtitles/transcript
  sceneContext?: {
    era?: string;
    location?: string;
    figures?: string[];
  };
}

// Canvas Operations for History
interface CanvasOperation {
  action: 'show' | 'animate' | 'remove' | 'clear' | 'highlight_route' | 'zoom_map';
  elementId?: string;
  element?: Partial<CanvasElement>;
  route?: {
    from: [number, number];
    to: [number, number];
    style: 'trade' | 'migration' | 'conquest';
  };
  zoom?: {
    center: [number, number];
    level: number;
    duration: number;
  };
}
```

---

## UI/UX Design

**NarratedLessonView Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Lesson    |    Band: [0 ▼]    |    ⚙️     👤    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                      CANVAS                           │  │
│  │     ┌───────────────────────────────────────────┐     │  │
│  │     │              Base Map (R2)                 │     │  │
│  │     │                                           │     │  │
│  │     │    ┌─────┐         ╭────────────────╮    │     │  │
│  │     │    │Figure│  ←──   │  Trade Route   │    │     │  │
│  │     │    │Card │         ╰────────────────╯    │     │  │
│  │     │         ↘                               │     │  │
│  │     │           ╭──Timeline Bar──╮            │     │  │
│  │     └───────────────────────────────────────────┘     │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────┐  ┌─────────────────────────────────────┐    │
│  │  ⏸️  ⏭️   │  │  [Transcript: "In 300 BC, the..."] │    │
│  │  1x  1.5x  │  └─────────────────────────────────────┘    │
│  └────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

**Key Interactions:**
- **Play/Pause:** Pause narration, canvas freezes
- **Speed:** 1x, 1.25x, 1.5x (band 3+ only)
- **Seek:** Click timeline to jump to era
- **Explore Mode (Band 2+):** Pause narration, zoom/pan map freely
- **Figure Details:** Click figure card for extended bio

---

## Testing Checklist

- [ ] Band 0 narration uses simple vocabulary, 2-3 canvas elements max
- [ ] Band 5 narration includes historiographical nuance
- [ ] Maps load correctly from R2 for each chapter
- [ ] Trade route animations are smooth and clear
- [ ] Timeline updates correctly as narration progresses
- [ ] Figure cards appear/disappear at appropriate moments
- [ ] Audio-visual sync is maintained across bandwidth conditions
- [ ] Parent can pause, resume, or skip narration segments

---

## Blockers & Dependencies

| Dependency | Status | Unblock Path |
|------------|--------|--------------|
| D1 migrations (003-006) | PENDING | Run wrangler execute |
| R2 map uploads | PENDING | Upload chapter maps to R2 |
| Flux pipeline (Band 0-1 images) | DONE | Reuse existing pipeline |

---

## Success Criteria

1. **Functionality:** AI can narrate any chapter while animating maps, routes, and figures
2. **Band Adaptation:** Narration pacing and vocabulary adjust to selected band
3. **Performance:** Canvas animations run at 60fps, audio sync within 100ms
4. **Content Coverage:** At least Chapters 1-5 have full narrated versions
