# Jules Mega-Plan: Content Pipeline & E2E Wiring

> **Created:** 2026-03-24
> **Scope:** GeoJSON for Chapters 2–9, Lesson Scripts for all chapters, Chapter 1 E2E integration
> **Estimated Jules instances:** 5 (can run in parallel where noted)

---

## Overview

Three workstreams, executed in dependency order:

```
Stream A: GeoJSON Data (Ch 2–9)           ← No dependencies, start immediately
Stream B: Lesson Script Generation (Ch 1–9) ← Needs component-data (already exists)
Stream C: E2E Wiring (Ch 1 first)          ← Needs A + B complete for Ch 1 (Ch 1 GeoJSON already exists)
```

---

## Stream A: GeoJSON Data for Chapters 2–9

### Context

Chapter 1 GeoJSON is complete and serves as the template:
- `src/data/geojson/ch01_regions.json` — Kingdom polygons (Mizraim, Cush, Phut, Canaan)
- `src/data/geojson/ch01_routes.json` — Migration LineStrings (Babel→Egypt, etc.)
- `src/data/geojson/ch01_markers.json` — City/site markers (Babel, Memphis, Kerma, etc.)

Named locations live in `src/data/geojson/locations.ts` — a flat `Record<string, [lng, lat]>` used by `toolCallHandler.ts` to resolve location names to coordinates.

### Geographic Scope Per Chapter

| Ch | Title | Key Regions (Polygons) | Key Routes (LineStrings) | Key Markers (Points) |
|----|-------|----------------------|------------------------|---------------------|
| 2 | Ancient Egypt | Upper Egypt, Lower Egypt, Nile Delta, Fayum, Sinai | Nile trade route, Hyksos invasion path, Exodus route | Memphis, Thebes, Amarna, Alexandria, Pi-Ramesses, Avaris |
| 3 | Kingdom of Kush & Nubia | Kerma kingdom, Napata kingdom, Meroë kingdom, Egypt (25th Dynasty extent) | Kerma→Napata expansion, Piye's conquest route (Napata→Memphis), Meroë trade routes | Kerma, Napata, Jebel Barkal, Meroë, Musawwarat |
| 4 | Phoenicians & Carthage | Phoenicia, Carthaginian territory (N. Africa), Carthaginian Iberia | Tyre→Carthage founding route, Hannibal's Alpine route, Punic trade network (W. Mediterranean) | Tyre, Sidon, Carthage, Zama, Saguntum, Leptis Magna |
| 5 | Church in Roman Africa | Roman Africa Proconsularis, Numidia, Cyrenaica, Egypt (Roman) | Paul's journey connections, Perpetua's Carthage, Augustine's journey (Thagaste→Carthage→Milan→Hippo) | Carthage, Hippo Regius, Thagaste, Alexandria, Cyrene |
| 6 | Aksum & Ethiopian Christianity | Aksumite Empire, Himyarite Yemen, Adulis trade zone | Red Sea trade route (Adulis→India), Frumentius journey (Tyre→Aksum), Aksumite→Yemen campaign | Aksum, Adulis, Lalibela, Gondar, Yeha |
| 7 | Rise of Islam in Africa | Rashidun/Umayyad conquest zones (Egypt, Maghreb), Fatimid Caliphate, Almoravid Empire | Arab conquest route (Arabia→Egypt→Maghreb→Iberia), Trans-Saharan trade routes | Fustat/Cairo, Kairouan, Fez, Marrakesh, Timbuktu, Córdoba |
| 8 | Bantu Migrations | Bantu homeland (Nigeria-Cameroon border), Urewe culture zone, Southern expansion zone | Eastern stream (Great Lakes), Western stream (Congo basin), Southern stream (to Limpopo) | Nok region, Great Zimbabwe (precursor sites), Lake Victoria |
| 9 | Medieval African Kingdoms | Ghana Empire, Mali Empire, Songhai Empire, Great Zimbabwe, Swahili Coast, Kanem-Bornu | Trans-Saharan gold-salt trade routes, Indian Ocean trade routes, Mansa Musa's Hajj route | Koumbi Saleh, Niani, Gao, Timbuktu, Djenné, Great Zimbabwe, Kilwa, Sofala, Mogadishu |

### Prompt for Jules Instance A1 (Chapters 2–5)

```
You are generating historical GeoJSON data files for an African History curriculum app.

## What exists (use as template)
Read these files first:
- src/data/geojson/ch01_regions.json (polygon template)
- src/data/geojson/ch01_routes.json (route template)  
- src/data/geojson/ch01_markers.json (marker template)
- src/data/geojson/locations.ts (named locations registry)

## Your task
Create GeoJSON files for Chapters 2, 3, 4, and 5. For each chapter create:
1. `src/data/geojson/ch{NN}_regions.json` — FeatureCollection of Polygons
2. `src/data/geojson/ch{NN}_routes.json` — FeatureCollection of LineStrings
3. `src/data/geojson/ch{NN}_markers.json` — FeatureCollection of Points

## Feature property format (MUST match exactly)
Regions: { "id": "snake_case_id", "name": "Display Name", "color": "#hex", "chapter": N, "type": "kingdom" | "empire" | "territory" | "region" }
Routes: { "id": "snake_case_id", "name": "Display Name", "color": "#hex", "chapter": N, "type": "migration" | "trade" | "conquest" | "journey" }
Markers: { "id": "snake_case_id", "name": "City Name", "chapter": N, "type": "city" | "site" | "battle" }

## Geographic data for each chapter

### Chapter 2: Ancient Egypt
Read: docs/curriculum/history/my-first-textbook/chapter_02/summaries/chapter_summary.md
Read: docs/curriculum/history/component-data/chapter_02/timeline.json

Regions to create:
- upper_egypt: Nile Valley from ~Aswan (24°N) to ~Memphis (29.8°N). Polygon follows Nile corridor, ~50km wide. Color: #e8a87c
- lower_egypt: Nile Delta region, Memphis north to Mediterranean coast. Color: #7cb8e8
- sinai: Sinai Peninsula. Color: #d4a574
- fayum: Fayum Oasis depression west of Nile. Small polygon. Color: #8bc48a

Routes:
- hyksos_invasion: From Sinai/Canaan (~34°N, 34°E) southwest into Delta (~31°E, 30.5°N). Color: #e85454, type: conquest
- exodus_route: Pi-Ramesses (~31.8°E, 30.8°N) → Sinai crossing → Sinai Peninsula. Color: #f0c75e, type: journey
- nile_trade: Memphis → Thebes → Aswan along Nile. Color: #5eaef0, type: trade

Markers: Memphis (31.25, 29.85), Thebes/Luxor (32.65, 25.7), Amarna (30.9, 27.65), Alexandria (29.9, 31.2), Pi-Ramesses (31.8, 30.8), Avaris (31.82, 30.79), Giza (31.13, 29.98), Karnak (32.66, 25.72)

### Chapter 3: Kingdom of Kush & Nubia  
Read: docs/curriculum/history/my-first-textbook/chapter_03/summaries/chapter_summary.md
Read: docs/curriculum/history/component-data/chapter_03/timeline.json

Regions:
- kerma_kingdom: Upper Nubia along Nile from 3rd Cataract (~19.5°N) to ~4th Cataract (~18°N), ~100km wide. Color: #c47cb8
- napata_kingdom: Centered on Jebel Barkal (18.5°N), extends from 4th Cataract to ~16°N. Color: #7c8ec4
- meroe_kingdom: South of 5th Cataract (~17°N) down to ~14°N along Nile, wider to east. Color: #c4b87c
- egypt_25th_dynasty: Copy of Ch2 Egypt extent to show Kushite control. Color: #b87cc4

Routes:
- kerma_napata_expansion: Kerma → Napata southward. Color: #c47cb8, type: migration
- piye_conquest: Napata (31.6, 18.5) → north along Nile → Memphis (31.25, 29.85). Color: #e85454, type: conquest
- meroe_trade: Meroë → Red Sea coast + Meroë → Aksum. Color: #5eaef0, type: trade

Markers: Kerma (30.4, 19.6), Napata (31.6, 18.5), Jebel_Barkal (31.6, 18.53), Meroe (33.7, 16.9), Musawwarat (33.3, 16.4), Naga (33.3, 16.3)

### Chapter 4: Phoenicians & Carthage
Read: docs/curriculum/history/my-first-textbook/chapter_04/summaries/chapter_summary.md

Regions:
- phoenicia: Narrow coastal strip, roughly Tyre to Byblos (~33-35°N, 35.2-35.8°E). Color: #7cc4a8
- carthaginian_territory: Coastal N. Africa from roughly eastern Algeria to western Libya (~10-20°E, 33-37°N). Color: #c47c7c  
- carthaginian_iberia: SE Spain coast (~-2 to 3°E, 37-40°N). Color: #c49a7c

Routes:
- tyre_carthage: Tyre (35.2, 33.27) → along N. Africa coast → Carthage (10.18, 36.85). Color: #7cc4a8, type: journey
- hannibal_route: Carthaginian Iberia → across Pyrenees → Alps → Italy. Color: #e85454, type: conquest
- punic_trade: Carthage → Sicily → Sardinia → Iberia coastal circuit. Color: #5eaef0, type: trade

Markers: Tyre (35.2, 33.27), Sidon (35.37, 33.56), Carthage (10.18, 36.85), Zama (36.3, 8.3 — note: swap to 8.3, 36.3 as [lng, lat]), Leptis_Magna (14.28, 32.64), Byblos (35.65, 34.12), Utica (10.06, 37.06)

### Chapter 5: Church in Roman Africa
Read: docs/curriculum/history/my-first-textbook/chapter_05/summaries/chapter_summary.md

Regions:
- africa_proconsularis: Roughly modern Tunisia + NW Libya. Color: #c4a87c
- numidia: Roughly modern eastern Algeria. Color: #a8c47c
- cyrenaica: NE Libya coast. Color: #7cc4c4
- roman_egypt: Same as Ch2 Egypt extent. Color: #c48a7c

Routes:
- augustine_journey: Thagaste (7.95, 36.28) → Carthage (10.18, 36.85) → across Mediterranean to Milan (9.19, 45.46) → back to Hippo (7.77, 36.90). Color: #c47cb8, type: journey
- gospel_spread: Alexandria (29.9, 31.2) → west along coast → Cyrene → Carthage. Color: #f0c75e, type: journey

Markers: Carthage (10.18, 36.85), Hippo_Regius (7.77, 36.90), Thagaste (7.95, 36.28), Alexandria (29.9, 31.2), Cyrene (21.85, 32.82), Madauros (8.23, 36.38)

## After creating all GeoJSON files

1. Update `src/data/geojson/locations.ts` — add ALL new marker locations as named entries
2. Update `src/data/geojson/index.ts` — add cases 2-5 to the switch statement, importing the new JSON files

## Color palette guidelines
- Warm earth tones for kingdoms/empires
- Blues for trade routes  
- Reds for conquest/military routes
- Purples for cultural/religious journeys
- Greens for territories
- Use distinguishable colors within each chapter

## Coordinate format
All coordinates are [longitude, latitude] (GeoJSON standard). Africa spans roughly:
- Longitude: -20°W to 55°E
- Latitude: -35°S to 37°N
```

### Prompt for Jules Instance A2 (Chapters 6–9)

```
You are generating historical GeoJSON data files for an African History curriculum app.

## What exists (use as template)
Read these files first:
- src/data/geojson/ch01_regions.json (polygon template)
- src/data/geojson/ch01_routes.json (route template)
- src/data/geojson/ch01_markers.json (marker template)
- src/data/geojson/locations.ts (named locations registry)

## Your task
Create GeoJSON files for Chapters 6, 7, 8, and 9. For each chapter create:
1. `src/data/geojson/ch{NN}_regions.json` — FeatureCollection of Polygons
2. `src/data/geojson/ch{NN}_routes.json` — FeatureCollection of LineStrings
3. `src/data/geojson/ch{NN}_markers.json` — FeatureCollection of Points

## Feature property format (MUST match exactly)
Regions: { "id": "snake_case_id", "name": "Display Name", "color": "#hex", "chapter": N, "type": "kingdom" | "empire" | "territory" | "region" }
Routes: { "id": "snake_case_id", "name": "Display Name", "color": "#hex", "chapter": N, "type": "migration" | "trade" | "conquest" | "journey" }
Markers: { "id": "snake_case_id", "name": "City Name", "chapter": N, "type": "city" | "site" | "battle" }

## Geographic data for each chapter

### Chapter 6: Aksum & Ethiopian Christianity
Read: docs/curriculum/history/my-first-textbook/chapter_06/summaries/chapter_summary.md

Regions:
- aksumite_empire: Ethiopian highlands, centered on Aksum (38.7°E, 14.1°N). Extends roughly 36-42°E, 12-16°N. Color: #c4a87c
- himyarite_yemen: SW Arabian Peninsula, roughly 43-46°E, 13-16°N. Color: #a87cc4
- adulis_trade_zone: Red Sea coastal strip from Adulis down to Djibouti area. Color: #7cc4c4

Routes:
- red_sea_trade: Adulis (39.66, 15.37) → across Red Sea → Aden → India direction (heading east). Color: #5eaef0, type: trade
- frumentius_journey: Tyre (35.2, 33.27) → Red Sea → Adulis (39.66, 15.37) → Aksum (38.72, 14.13). Color: #f0c75e, type: journey
- aksum_yemen_campaign: Aksum (38.72, 14.13) → across Red Sea → Yemen coast. Color: #e85454, type: conquest

Markers: Aksum (38.72, 14.13), Adulis (39.66, 15.37), Lalibela (39.04, 12.03), Gondar (37.47, 12.6), Yeha (39.02, 14.28), Matara (39.5, 14.7)

### Chapter 7: Rise of Islam in Africa
Read: docs/curriculum/history/my-first-textbook/chapter_07/summaries/chapter_summary.md

Regions:
- rashidun_umayyad_egypt: Egypt under Arab control, same boundaries as Ch2 Egypt. Color: #7cc48a
- maghreb_conquest: N. Africa from Egypt border west to Morocco (~-8 to 25°E, 30-37°N). Color: #8ac47c
- fatimid_caliphate: Egypt + Tunisia + parts of Libya. Color: #c4c47c
- almoravid_empire: Morocco + Western Sahara + Mauritania + southern Iberia. Color: #c4a87c

Routes:
- arab_conquest: Arabia (~40°E, 25°N) → Egypt → along N. Africa coast → Morocco → into Iberia. Color: #e85454, type: conquest
- trans_saharan_trade: Morocco/Sijilmasa (~-4°E, 31.5°N) → south across Sahara → Timbuktu/Ghana. Color: #f0c75e, type: trade

Markers: Fustat_Cairo (31.23, 30.05), Kairouan (10.1, 35.67), Fez (5.0, 34.03), Marrakesh (-8.0, 31.63), Timbuktu (-3.0, 16.77), Cordoba (-4.78, 37.88), Sijilmasa (-4.28, 31.28)

### Chapter 8: Bantu Migrations
Read: docs/curriculum/history/my-first-textbook/chapter_08/summaries/chapter_summary.md

Regions:
- bantu_homeland: Nigeria-Cameroon border region, roughly 7-12°E, 4-8°N. Color: #c47c7c
- urewe_culture: Great Lakes region, roughly 28-35°E, -4 to 2°N. Color: #7c8ec4
- southern_expansion: Zone from Limpopo to Zambezi, 25-35°E, -25 to -15°S. Color: #7cc4a8
- khoisan_territory: Southern Africa, Cape region up to ~-20°S. Color: #e8c87c (pre-existing peoples)
- congo_basin: Central Africa rainforest, 15-30°E, -5 to 5°N. Color: #4a8c5e

Routes:
- eastern_stream: Bantu homeland → east through Great Lakes region → south. Waypoints: (10, 6) → (25, 2) → (30, 0) → (33, -2) → (35, -6) → (35, -10). Color: #7c8ec4, type: migration
- western_stream: Bantu homeland → south through Congo basin. Waypoints: (10, 6) → (15, 2) → (18, -2) → (20, -5) → (22, -8). Color: #c47c7c, type: migration
- southern_stream: From Great Lakes / E. Africa → south to Limpopo. Waypoints: (33, -6) → (33, -10) → (32, -15) → (30, -20) → (28, -24). Color: #7cc4a8, type: migration

Markers: Nok_Region (7.5, 9.5), Great_Zimbabwe_precursor (30.9, -20.3), Lake_Victoria (33.0, -1.0), Limpopo_River (30.0, -23.5)

### Chapter 9: Medieval African Kingdoms
Read: docs/curriculum/history/my-first-textbook/chapter_09/summaries/chapter_summary.md

Regions:
- ghana_empire: Western Sahel, roughly -15 to -5°E, 12-18°N. Color: #c4a87c
- mali_empire: Larger, encompasses Ghana area + east to Niger bend, roughly -15 to 5°E, 10-20°N. Color: #e8c87c
- songhai_empire: Niger River bend area, roughly -5 to 10°E, 12-20°N. Color: #c48a7c
- great_zimbabwe: SE Africa plateau, roughly 28-33°E, -22 to -18°S. Color: #7c8ec4
- swahili_coast: E. African coast from Mogadishu to Sofala, narrow coastal strip. Color: #7cc4c4
- kanem_bornu: Lake Chad region, roughly 10-18°E, 10-15°N. Color: #a8c47c

Routes:
- gold_salt_trade: Sijilmasa (-4.28, 31.28) → south across Sahara → Timbuktu (-3.0, 16.77) → Djenné (-4.55, 13.91). Color: #f0c75e, type: trade
- indian_ocean_trade: Kilwa (39.52, -8.96) → across Indian Ocean east + north to Mogadishu (45.34, 2.05) → Arabia. Color: #5eaef0, type: trade
- mansa_musa_hajj: Niani (-11.42, 11.42) → Timbuktu (-3.0, 16.77) → across Sahara → Cairo (31.23, 30.05) → Mecca (39.83, 21.42). Color: #c47cb8, type: journey

Markers: Koumbi_Saleh (-7.97, 15.77), Niani (-11.42, 11.42), Gao (0.08, 16.27), Timbuktu (-3.0, 16.77), Djenne (-4.55, 13.91), Great_Zimbabwe (30.93, -20.27), Kilwa (39.52, -8.96), Sofala (34.74, -20.15), Mogadishu (45.34, 2.05), Mombasa (39.66, -4.05), Njimi (17.0, 13.0)

## After creating all GeoJSON files

1. Update `src/data/geojson/locations.ts` — add ALL new marker locations as named entries (merge with existing, don't overwrite Ch1-5 entries that may already be there)
2. Update `src/data/geojson/index.ts` — add cases 6-9 to the switch statement, importing the new JSON files

## Color palette guidelines
- Warm earth tones for kingdoms/empires  
- Blues for trade routes
- Reds for conquest/military routes
- Purples for cultural/religious journeys
- Greens for territories
- Use distinguishable colors within each chapter

## Coordinate format
All coordinates are [longitude, latitude] (GeoJSON standard).
```

---

## Stream B: Lesson Script Generation (All Chapters)

### Context

A CLI generator exists at `scripts/generate_lesson_script.ts`. It reads:
- Chapter markdown from `docs/curriculum/history/my-first-textbook/chapter_{NN}/`
- Component data from `docs/curriculum/history/component-data/chapter_{NN}/` (genealogy, timeline, scripture_refs, figures, definitions, comparisons)
- Pronunciation data from `src/data/pronunciation.json`

Output goes to `docs/curriculum/history/generated_scripts/`.

The generator creates a structured JSON lesson script with timestamped cues for:
- `speak` — narration text
- `show_component` — visual component display (now maps to MapLibre tool calls)
- `pan_map` — camera movement (now maps to `zoom_to`)

### Important: Tool Call Name Update

The generator currently uses legacy tool names. The generated scripts need to use the **new MapLibre tool names**:

| Old Name | New Name |
|----------|----------|
| `show_map_overlay` | `highlight_region` |
| `highlight_route` | `draw_route` |
| `zoom_map` | `zoom_to` |
| `show_element` | `place_marker` or `show_figure` |
| `animate_element` | `draw_route` (animated) |
| `remove_element` | `clear_canvas` |

### Prompt for Jules Instance B1 (Generator Update + Ch 1–5 Scripts)

```
You are updating the lesson script generator and generating lesson scripts for Chapters 1-5.

## Step 1: Update the generator

Read: scripts/generate_lesson_script.ts (full file, 267 lines)
Read: src/lib/canvas/toolCallHandler.ts (to see the exact tool names the frontend expects)
Read: src/data/geojson/locations.ts (to see named location keys)

Update the generator so that generated scripts use the new MapLibre tool call names:
- Instead of `show_map_overlay` → emit `highlight_region` with args { regionId, color, opacity }
- Instead of `highlight_route` → emit `draw_route` with args { from, to, color, style }
- Instead of `zoom_map` → emit `zoom_to` with args { location } (using named location keys from locations.ts)
- Instead of `show_element` for figures → emit `show_figure` with args { name, title, imageUrl }
- Add `show_scripture` cues when scripture_refs are referenced in narrative
- Add `show_genealogy` cues when genealogy data is referenced
- Add `show_timeline` cues when timeline events are referenced
- Add `clear_canvas` at the start of each new major section

The cue format should be:
{
  "type": "tool_call",
  "tool": "zoom_to",
  "args": { "location": "memphis" },
  "timestamp": 0
}

## Step 2: Generate Band 3 scripts for Chapters 1-5

Run the updated generator for each:
npx tsx scripts/generate_lesson_script.ts --chapter 1 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 2 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 3 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 4 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 5 --band 3

Output should appear in docs/curriculum/history/generated_scripts/

## Step 3: Copy generated scripts to src/data/lessons/

Copy each generated script to src/data/lessons/lesson_ch{NN}_band3.json
These are the files the frontend LessonPlayerPage will load.

## Step 4: Verify structure

Each generated script should have this top-level structure:
{
  "id": "lesson_ch{NN}_band3",
  "chapterId": "ch{NN}",
  "band": 3,
  "title": "...",
  "estimatedMinutes": ...,
  "pronunciation": { ... },
  "cues": [
    { "type": "speak", "text": "...", "timestamp": 0 },
    { "type": "tool_call", "tool": "zoom_to", "args": { "location": "babel" }, "timestamp": 0 },
    ...
  ]
}
```

### Prompt for Jules Instance B2 (Ch 6–9 Scripts)

```
You are generating lesson scripts for Chapters 6-9.

## Prerequisites
The lesson script generator at scripts/generate_lesson_script.ts has already been updated 
with MapLibre tool call names by a previous instance.

## Your task
Run the generator for each chapter:
npx tsx scripts/generate_lesson_script.ts --chapter 6 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 7 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 8 --band 3
npx tsx scripts/generate_lesson_script.ts --chapter 9 --band 3

Copy outputs to src/data/lessons/:
- src/data/lessons/lesson_ch06_band3.json
- src/data/lessons/lesson_ch07_band3.json
- src/data/lessons/lesson_ch08_band3.json
- src/data/lessons/lesson_ch09_band3.json

## Verification
Each script should:
1. Use only the new tool names: zoom_to, highlight_region, draw_route, place_marker, show_scripture, show_figure, show_genealogy, show_timeline, clear_canvas, dismiss_overlay
2. Reference named locations that exist in src/data/geojson/locations.ts
3. Have pronunciation entries for African/biblical proper nouns
4. Follow the exact JSON structure from the B1 prompt
```

---

## Stream C: Chapter 1 E2E Wiring

### Prerequisites
- Stream A: Ch1 GeoJSON already exists ✅
- Stream B: Ch1 lesson script generated

### Prompt for Jules Instance C1

```
You are wiring Chapter 1 for end-to-end playback: lesson loads → map renders → tool calls fire → overlays display.

## Read these files first
- src/pages/LessonPlayerPage.tsx
- src/components/player/ScriptPlayer.tsx
- src/components/canvas/TeachingCanvas.tsx
- src/lib/canvas/toolCallHandler.ts
- src/data/geojson/index.ts
- src/data/lessons/lesson_ch01_band3.json (generated by Stream B)

## Task 1: LessonPlayerPage Integration

The LessonPlayerPage should:
1. Parse the chapter number from the route params
2. Load the lesson script from src/data/lessons/ (static import or dynamic import)
3. Load chapter GeoJSON via getChapterGeoJSON(chapterNum)
4. Pass GeoJSON to TeachingCanvas
5. Pass lesson script to ScriptPlayer
6. Connect ScriptPlayer's tool call output to toolCallHandler → TeachingCanvas ref

## Task 2: ScriptPlayer Tool Call Dispatch

The ScriptPlayer currently has a WebSocket connection for live AI dialogue. For the scripted teaching phase:
1. When a cue of type "tool_call" is reached in the script timeline, dispatch it through handleToolCall()
2. The ScriptPlayer should accept a ref to TeachingCanvas and call handleToolCall(canvasRef, cue) directly
3. For the dialogue phase (after script completes), the WebSocket connection handles live tool calls

Wire it so:
- Script phase: cue.type === 'tool_call' → handleToolCall(canvas, { type: 'tool_call', tool: cue.tool, args: cue.args })
- Live phase: WebSocket message → handleToolCall(canvas, parsedMessage)

## Task 3: Lesson Loading

Create a simple lesson loader:
src/data/lessons/index.ts

export async function loadLessonScript(chapterId: string, band: number) {
  try {
    const module = await import(`./${chapterId}_band${band}.json`);
    return module.default;
  } catch {
    return null;
  }
}

## Task 4: Verify Build

Run `npm run build` and ensure no TypeScript errors.

## Task 5: Route Verification

Ensure App.tsx has a route like:
<Route path="/lesson/:chapterId" element={<LessonPlayerPage />} />
or similar that loads LessonPlayerPage with the chapter parameter.
```

---

## Execution Order

```
Phase 1 (parallel):
  └── Jules A1: GeoJSON Ch 2-5
  └── Jules A2: GeoJSON Ch 6-9
  └── Jules B1: Generator update + lesson scripts Ch 1-5

Phase 2 (after B1):
  └── Jules B2: Lesson scripts Ch 6-9

Phase 3 (after A1 + B1):
  └── Jules C1: Chapter 1 E2E wiring + verification
```

---

## Verification Checklist

After all instances complete:

- [ ] `src/data/geojson/` has 27 JSON files (3 per chapter × 9 chapters)
- [ ] `src/data/geojson/locations.ts` has ~80+ named locations
- [ ] `src/data/geojson/index.ts` handles chapters 1-9
- [ ] `src/data/lessons/` has 9 lesson scripts (band 3 for each chapter)
- [ ] All lesson scripts use new MapLibre tool names only
- [ ] `npm run build` passes with zero errors
- [ ] LessonPlayerPage loads Ch1 → GeoJSON renders on MapLibre → script plays → tool calls fire
