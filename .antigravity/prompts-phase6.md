# Phase 6: Explainer Canvas for History — Parallel Prompts

> **Goal:** Repurpose the Explainer Canvas (interactive whiteboard) as an **Interactive Narrator** for African History. AI narrates chapter segments while animating maps, trade routes, timelines, and key figures on a digital canvas. 4 parallel Jules instances.

---

## Instance A — Canvas Element Primitives Library

**Task:** Create a typed SVG primitives library for visualizing historical concepts on the canvas.

**Context files to read first:**
- `ROADMAP.md` (Phase 6 tasks, Band Model)
- `.antigravity/notes/P6_history_explainer.md` (full architecture + API specs)
- `src/archive/explainerClient.ts` (archived canvas client — reference for CanvasOperation types)
- `src/archive/audioCanvasSync.ts` (archived sync engine — reference for payload shape)

**Deliverables:**
1. `src/lib/canvas/primitives/MapPrimitives.ts` — Geographic visualization functions:
   - `createTradeRoute(id, from, to, color, style: 'trade'|'migration'|'conquest')` → returns CanvasElement with animated dashed SVG path
   - `createMigrationArrow(id, origin, destinations[], waveCount)` → curved arrow paths with ripple animation data
   - `createTerritoryOverlay(id, regionId, fillColor, label)` → SVG region fill element
   - `createClimateZone(id, type: 'desert'|'rainforest'|'savannah', bounds)` → patterned fill overlay
   - All functions return a typed `CanvasElement` object compatible with the existing show_element action shape

2. `src/lib/canvas/primitives/TimelinePrimitives.ts` — Chronological visualization:
   - `createEraBand(id, startYear, endYear, label, color)` → horizontal era bar element
   - `createDateMarker(id, year, label, importance: 1-3)` → vertical tick with scaled label
   - `createDurationConnector(id, fromYear, toYear, label)` → connecting line between era bands

3. `src/lib/canvas/primitives/FigurePrimitives.ts` — Character card elements:
   - `createFigureCard(id, name, title, portraitUrl?, x, y)` → rounded card element with name/title
   - `createSpeechBubble(id, figureId, quote, x, y)` → speech bubble element anchored to figure
   - `createComparisonPanel(id, figures[])` → side-by-side layout element

4. `src/lib/canvas/primitives/EventPrimitives.ts` — Event marker elements:
   - `createBattleMarker(id, location, factions[], outcome)` → crossed-swords icon element
   - `createBuildingIcon(id, type: 'church'|'palace'|'mosque'|'fort', location)` → architecture symbol
   - `createCulturalSymbol(id, type: 'artifact'|'textile'|'mask', region)` → cultural icon

5. `src/lib/canvas/primitives/index.ts` — Barrel export + shared types:
   - Export `HistoryCanvasElement` interface extending the base `CanvasElement`
   - Export `HistoryCanvasOperation` type adding `'highlight_route'|'zoom_map'|'show_timeline'` actions
   - Export `RouteData`, `ZoomData`, `TimelineData` supporting types

**Constraints:**
- All elements must conform to the existing `CanvasElement` shape: `{ id, type, x, y, width?, height?, content?, color?, opacity?, scale?, rotation? }`
- Use semantic design tokens for colors (reference `src/index.css` for token names)
- Functions are pure — they return data objects, no DOM manipulation
- Include JSDoc on all exported functions

---

## Instance B — History Explainer Agent Session + API Route

**Task:** Create the adapted Gemini Live agent for historical narration with band-aware pacing, plus the API route to serve map assets.

**Context files to read first:**
- `ROADMAP.md` (Phase 6 tasks, Band Model section)
- `.antigravity/notes/P6_history_explainer.md` (full architecture, tool schemas, prompt template)
- `agent/src/explainerSession.ts` (existing explainer agent — base to adapt from)
- `agent/src/gemini.ts` (GeminiSession class)
- `agent/src/constraints.ts` (constraint fetching)
- `worker/src/lib/content/retrieve.ts` (RAG retrieval)
- `scripts/output/map-manifest.json` (map metadata — if exists, otherwise reference `scripts/upload-maps.ts`)

**Deliverables:**
1. `agent/src/historyExplainerSession.ts` — New agent session (do NOT modify original `explainerSession.ts`):
   - **Tools:** Keep `show_element`, `animate_element`, `remove_element`, `clear_canvas` from original. Add:
     - `show_map_overlay` — `{ regionId, fillColor, label, opacity? }` — display geographic territory
     - `show_timeline` — `{ events: [{ year, label, importance }], startYear, endYear }` — render timeline bar
     - `show_figure` — `{ name, title, portraitUrl?, quote? }` — display figure card
     - `highlight_route` — `{ from: [x,y], to: [x,y], style: 'trade'|'migration'|'conquest', color? }` — animate route
     - `zoom_map` — `{ center: [x,y], level, duration? }` — zoom/pan the base map
   - **System Prompt:** Band-aware historical narrator (see P6 notes for full template). Key points:
     - Band 0–1: Simple stories, 2-3 canvas elements max, slow pacing, relate to child's world
     - Band 2–3: More detail, show relationships, moderate pacing
     - Band 4–5: Nuanced analysis, multiple perspectives, full canvas use
   - **Lesson Context:** Fetch adapted content via `GET /api/lessons/:id/content?band=N` and inject as narration source
   - **mapToolCallToCanvasOp:** Extend the mapping function to handle all new tool types, translating to `HistoryCanvasOperation` format
   - Export `handleHistoryExplainerSession(ws, lessonId, familyId, learnerId, band)` function

2. `agent/src/historyExplainerTools.ts` — Tool definitions extracted to separate file:
   - Export `HISTORY_EXPLAINER_TOOLS` array (Gemini function declarations)
   - Export `buildHistoryExplainerPrompt(baseContent, learnerContext, band)` function

3. `worker/src/routes/maps.ts` — Map asset serving route:
   - `GET /api/lessons/:id/map-assets` — returns:
     ```json
     {
       "baseMapUrl": "string (R2 URL or placeholder)",
       "markers": [],
       "metadata": { "era": "string", "region": "string" }
     }
     ```
   - Look up lesson's geographic context from D1 (Lessons table has `region` via Topics)
   - If R2 map exists, return R2 URL; otherwise return a placeholder response
   - Wire into `worker/src/routes/index.ts`

**Constraints:**
- Do NOT modify `agent/src/explainerSession.ts` — create the new file alongside it
- Reuse `GeminiSession` class and `fetchAndAssembleInstruction` from existing code
- All new tool calls must map cleanly to canvas operations the frontend can render
- Band parameter must flow through the entire chain: session start → prompt building → content fetching

---

## Instance C — Frontend NarratedLessonView + Canvas Components

**Task:** Build the React page and canvas rendering components for the narrated lesson experience.

**Context files to read first:**
- `ROADMAP.md` (Phase 6 tasks)
- `.antigravity/notes/P6_history_explainer.md` (full UI layout, canvas state, WebSocket protocol)
- `src/pages/LessonView.tsx` (existing lesson page — add navigation to narrated view)
- `src/pages/ReadingView.tsx` (reading page pattern reference)
- `src/components/content/BandSelector.tsx` (band selection UI pattern)
- `src/archive/audioCanvasSync.ts` (sync engine reference — adapt for history ops)
- `src/lib/auth.ts` (auth store)
- `src/index.css` + `tailwind.config.lov.json` (design tokens)

**Deliverables:**
1. `src/pages/NarratedLessonView.tsx` — Main narrated lesson page:
   - **Header:** Back button, lesson title, band selector, settings
   - **Canvas Area:** Full-width SVG canvas rendering `CanvasElement` objects
   - **Playback Controls:** Play/Pause, speed (1x/1.25x/1.5x for Band 3+), progress indicator
   - **Transcript Bar:** Scrolling subtitle text from narration
   - **State Management:** Use `useState`/`useReducer` for canvas state:
     ```typescript
     interface CanvasState {
       elements: Map<string, CanvasElement>;
       baseMap: string | null;
       isPlaying: boolean;
       currentSpeed: number;
     }
     ```
   - **WebSocket Integration:** Connect to agent, receive `canvas_ops` messages, apply to canvas state
   - **Band-aware UI:** Simpler controls for Band 0-1 (just play/pause, no speed control)

2. `src/components/canvas/HistoryCanvas.tsx` — SVG canvas renderer:
   - Renders `CanvasElement[]` as SVG elements (rect, text, image, path)
   - Handles element enter/exit animations via framer-motion
   - Supports base map as background `<image>` element
   - Renders overlays, routes, timeline as layered SVG groups
   - Props: `elements: CanvasElement[]`, `baseMapUrl?: string`, `width: number`, `height: number`

3. `src/components/canvas/PlaybackControls.tsx` — Narration control bar:
   - Play/Pause toggle button
   - Speed selector (Band 3+ only)
   - Progress bar showing narration position
   - Props: `isPlaying`, `onToggle`, `speed`, `onSpeedChange`, `band`

4. `src/components/canvas/TranscriptBar.tsx` — Live subtitle/transcript display:
   - Shows current narration text
   - Auto-scrolls as new text arrives
   - Props: `text: string`, `sceneContext?: { era?, location?, figures? }`

5. Add route `/narrate/:lessonId` to routing docs (or add to `src/App.tsx` if confident in pattern)

**Constraints:**
- Use semantic design tokens from `index.css`, no hardcoded colors
- Use shadcn/ui components (Button, Card, Badge, Slider) where appropriate
- Use framer-motion for canvas element animations (enter, exit, property changes)
- Mobile-first responsive: canvas should scale to viewport width
- Do NOT implement actual WebSocket connection logic — use a mock/placeholder that accepts ops. Integration will be done in the final step.

---

## Instance D — R2 Map Asset Pipeline + Geographic Metadata

**Task:** Build the pipeline to serve map assets from R2 and integrate geographic metadata from the curriculum.

**Context files to read first:**
- `ROADMAP.md` (Phase 6 Task 6.4)
- `.antigravity/notes/P6_history_explainer.md` (map asset structure, API spec)
- `worker/src/lib/r2.ts` (R2 helper utilities)
- `scripts/upload-maps.ts` (map manifest generator — reference for metadata shape)
- `scripts/output/map-manifest.json` (generated manifest — if exists)
- `docs/curriculum/history/my-first-textbook/metadata.json` (chapter listing)
- `worker/db/migrations/003_history_curriculum.sql` (Topics/Lessons schema)

**Deliverables:**
1. `worker/db/migrations/007_map_assets.sql` — D1 schema for map asset metadata:
   ```sql
   CREATE TABLE IF NOT EXISTS Map_Assets (
       id TEXT PRIMARY KEY,
       lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
       chapter_number INTEGER,
       title TEXT NOT NULL,
       era TEXT,
       r2_base_map_key TEXT,      -- R2 key for base map image
       r2_overlay_key TEXT,       -- R2 key for SVG overlay (optional)
       markers TEXT,              -- JSON array of { x, y, label, type }
       metadata TEXT,             -- JSON: { bounds, defaultCenter, defaultZoom, region }
       display_order INTEGER
   );
   ```

2. `worker/src/lib/maps/loader.ts` — Map asset loading utilities:
   - `getMapAssetsForLesson(db, lessonId)` → query Map_Assets table, return structured response
   - `getMapAssetUrl(bucket, r2Key)` → generate R2 URL for map image
   - `parseMapMetadata(raw)` → parse JSON metadata field into typed object

3. `worker/src/lib/maps/types.ts` — TypeScript interfaces:
   - `MapAsset`, `MapMarker`, `MapMetadata` types
   - `MapAssetResponse` (API response shape matching P6 spec)

4. `scripts/seed-map-assets.ts` — Seed script to generate `seed_map_assets.sql`:
   - Read from `scripts/output/map-manifest.json` (or `docs/curriculum/history/Maps/` directory)
   - Generate INSERT statements for Map_Assets table
   - Map each manifest entry to a lesson_id based on chapter number
   - Output to `scripts/output/seed_map_assets.sql`

5. Wire map loader into the `GET /api/lessons/:id/map-assets` route (coordinate with Instance B's `worker/src/routes/maps.ts`)

**Constraints:**
- Map images are NOT yet uploaded to R2 — the pipeline should handle graceful fallbacks (placeholder URLs)
- Use existing `r2Helper` from `worker/src/lib/r2.ts` for R2 operations
- Keep migration numbering sequential: `007_map_assets.sql` (after existing 006)
- Seed script should be idempotent (use INSERT OR REPLACE)

---

## After All 4 Instances Complete — Integration Step

One final prompt will:
1. Wire map routes into `worker/src/routes/index.ts` (if not already done)
2. Add `/narrate/:lessonId` route to `src/App.tsx` (protected)
3. Add "Start Narrated Lesson" button to `src/pages/LessonView.tsx`
4. Connect `NarratedLessonView.tsx` WebSocket to `handleHistoryExplainerSession`
5. Import canvas primitives into `HistoryCanvas.tsx` for proper element rendering
6. Ensure `historyExplainerSession.ts` is registered in `agent/src/server.ts`
7. Build verification: `npm run build` from root + `cd worker && npx wrangler deploy --dry-run`
8. Update `ROADMAP.md` Phase 6 status → ✅ COMPLETE
9. Update `.antigravity/prompts.md` with Phase 6 completion log
10. Write `.antigravity/notes/P6_integration.md` documenting any fixes
