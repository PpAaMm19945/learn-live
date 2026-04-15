# Chapter 1 Content Completion & Scaling Pipeline

## Current State

### ✅ What Exists
| Asset | Status |
|-------|--------|
| Textbook source (5 sections: 1.1–1.5) | Complete in `docs/curriculum/history/my-first-textbook/chapter_01/` |
| Component data (timelines, genealogies, comparisons, definitions, scripture, figures) | Complete in `docs/curriculum/history/component-data/chapter_01/` |
| Beat manifest `ch01_s01.json` (Section 1.1) | Complete — 7 beats with full toolSequence |
| 23 storybook illustrations (Band 0: 8, Band 1: 15) | In R2 bucket `learnlive-assets-prod`, rendering correctly |
| Illustration brief | Complete at `.antigravity/antigravity_illustration_brief.md` |
| Image registry | Complete at `agent/src/imageRegistry.ts` |
| Beat schema + band tool constraints | Documented in `docs/curriculum/history/beat-schema.md` |

### ❌ What's Missing
| Asset | Gap |
|-------|-----|
| Beat manifests for Sections 1.2–1.5 | `ch01_s02.json` – `ch01_s05.json` — **0 of 4 exist** |
| `bandOverrides` in all manifests | ch01_s01.json has none; needed for all 6 bands |
| Band 2-3 illustrations ("DK Encyclopedia" style) | 0 images — need ~14 per chapter |
| Band 4-5 illustrations (Documentary/archival style) | 0 images — need ~8 per chapter |
| Image registry entries for new Band 2-5 images | Not yet in `imageRegistry.ts` |

---

## Phase 1: Beat Manifest Authoring (Lovable writes)

**Deliverables:** 4 new JSON files in `docs/curriculum/history/`

### ch01_s02.json — "The Charter of Nations: Africa's Biblical Roots"
- Source: `section_2.md` (53 lines) + `component-data/chapter_01/`
- Estimated beats: 6-8
- Key tools: `show_genealogy` (Ham → sons), `show_key_term` (sovereignty, covenant, mishpat, tzedakah), `show_scripture` (Gen 10:6, Dan 4:35, Gen 9:9-11), `show_comparison` (common grace vs saving grace), `show_slide`, `show_timeline`

### ch01_s03.json — "Deconstructing the Curse of Ham"
- Source: `section_3.md` (52 lines)
- Estimated beats: 5-6
- Key tools: `show_key_term` (curse), `show_scripture` (Gen 9:25, Gen 12:3), `show_comparison` (What text says vs What myth claims), `show_slide` (3 questions), `show_question` (knowledge check MCQs), `set_scene` (image)

### ch01_s04.json — "The Peopling of Africa: A Biblical Model"
- Source: `section_4.md` (46 lines) + map data
- Estimated beats: 6-7
- Key tools: `set_scene` (map), `zoom_to`, `highlight_region`, `draw_route`, `place_marker`, `show_comparison` (Biblical vs Secular epistemology), `show_slide`, `show_scripture` (1 Kings 18:21)

### ch01_s05.json — "Portraits of Power: Mizraim, Cush, and Phut"
- Source: `section_5.md` (38 lines)
- Estimated beats: 6-8
- Key tools: `show_scripture` (Rom 1:21, Gal 6:7-8, Amos 9:7), `show_key_term` (common grace), `set_scene` (image), `show_timeline`, `show_comparison` (3 civilizations), `show_question`

### Process
1. Lovable reads component-data JSONs for exact timeline/genealogy data
2. Writes each manifest following the schema in `beat-schema.md`
3. References existing R2 images from `imageRegistry.ts`
4. Adds `bandOverrides` for all 6 bands (word count scaling per differentiation logic)

---

## Phase 2: Band 2-5 Image Prompt Engineering (Lovable writes)

### Visual Style Tiers

| Bands | Style | Reference | Format |
|-------|-------|-----------|--------|
| 0-1 | Warm Codex Storybook | Jerry Pinkney / Ethiopian manuscript | 640×640 (existing) |
| 2-3 | **DK Encyclopedia** | Labeled diagrams, annotated cross-sections, educational callouts | 640×640 |
| 4-5 | **Documentary / Scholarly** | Museum-quality artifact illustrations, archival manuscript style | 640×640 |

### Ch1 DK-Style Images (Bands 2-3) — 14 images

| Filename | Subject | DK-Style Treatment |
|----------|---------|-------------------|
| `band2_page01.jpg` | Creation sequence | Labeled 6-panel creation diagram with numbered days |
| `band2_page02.jpg` | Garden of Eden ecosystem | Annotated botanical/zoological cross-section |
| `band2_page03.jpg` | The Fall — cause & effect | Before/after split diagram with labeled consequences |
| `band2_page04.jpg` | Protoevangelium | Annotated Genesis 3:15 visual with prophecy chain |
| `band2_page05.jpg` | Noah's Ark construction | Cutaway cross-section with labeled dimensions |
| `band2_page06.jpg` | Post-Flood world | Annotated geographic diagram |
| `band2_page07.jpg` | Tower of Babel architecture | Labeled ziggurat cross-section |
| `band2_page08.jpg` | Table of Nations diagram | Illustrated family tree with migration arrows |
| `band2_page09.jpg` | Mizraim/Egypt settlement | Annotated Nile Delta cross-section |
| `band2_page10.jpg` | Cush/Nubia settlement | Labeled Nubian landscape (gold, iron, cattle) |
| `band2_page11.jpg` | Phut/Libya settlement | Annotated Mediterranean coast diagram |
| `band2_page12.jpg` | Egyptian civilization overview | DK-style "inside ancient Egypt" labeled spread |
| `band2_page13.jpg` | Cushite kingdom overview | Labeled Meroë/Kerma illustration |
| `band2_page14.jpg` | Comparative civilizations | Three-panel side-by-side comparison diagram |

### Ch1 Documentary Images (Bands 4-5) — 8 images

| Filename | Subject | Treatment |
|----------|---------|-----------|
| `band4_page01.jpg` | Creation & cosmology | Scholarly manuscript-style cosmological diagram |
| `band4_page02.jpg` | Ancient Near East geography | Research-grade annotated map |
| `band4_page03.jpg` | Curse of Ham textual analysis | Manuscript page with marginal annotations |
| `band4_page04.jpg` | Post-Babel migration routes | Scholarly migration map with dated waypoints |
| `band4_page05.jpg` | Egyptian Old Kingdom artifacts | Museum-catalog artifact illustrations |
| `band4_page06.jpg` | Nubian archaeological sites | Labeled archaeological site diagram |
| `band4_page07.jpg` | Bantu expansion evidence | Comparative evidence diagram |
| `band4_page08.jpg` | Chapter synthesis | Scholarly timeline infographic |

**Deliverable:** `docs/curriculum/history/ch01_band2-5_image_prompts.md` with full prompt, negative prompt, style anchors, and R2 key for each image.

---

## Phase 3: Jules Image Generation Script

**Deliverables:**
- `scripts/generate-ch01-images.sh` — shell script Jules runs
- `scripts/ch01_image_prompts.json` — companion prompt data

### How It Works
1. Script reads prompts from `ch01_image_prompts.json`
2. For each prompt, calls **Google Imagen 3** via Vertex AI REST API (Jules has GCP billing)
3. Saves base64 response to `/tmp/`
4. Uploads to R2: `npx wrangler r2 object put learnlive-assets-prod/assets/storybook/ch01/{filename} --file=/tmp/{filename}`
5. Logs success/failure per image

### Prompt JSON Format
```json
[
  {
    "filename": "band2_page01.jpg",
    "r2Key": "assets/storybook/ch01/band2_page01.jpg",
    "prompt": "DK Encyclopedia-style educational illustration...",
    "negativePrompt": "cartoon, anime, 3D render...",
    "aspectRatio": "1:1",
    "size": 640
  }
]
```

### Jules Task Prompt (ready to paste into jules.google.com)
```
## Task: Generate Chapter 1 Band 2-5 Images and Upload to R2

### Prerequisites
- GCP project with Imagen 3 API enabled
- Cloudflare API token with R2 write access (already configured)
- wrangler installed

### Steps
1. Read `scripts/ch01_image_prompts.json` (22 image entries)
2. For each entry, call Vertex AI Imagen 3:
   curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict" \
     -H "Authorization: Bearer $(gcloud auth print-access-token)" \
     -H "Content-Type: application/json" \
     -d '{"instances":[{"prompt":"..."}],"parameters":{"sampleCount":1,"aspectRatio":"1:1","sampleImageSize":640}}'
3. Decode base64 response, save to /tmp/{filename}
4. Upload each to R2:
   npx wrangler r2 object put learnlive-assets-prod/{r2Key} --file=/tmp/{filename}
5. Do NOT modify any source code files
6. Report: table of each image with filename, pass/fail, file size, R2 key
```

---

## Phase 4: Registry & Manifest Updates (after Jules completes)

1. **Update `agent/src/imageRegistry.ts`** — Add 22 new entries with correct `minBand`/`maxBand`
2. **Update beat manifests** — Reference Band 2-5 images in `bandOverrides.toolSequence`
3. **Add `bandOverrides` to `ch01_s01.json`** — Word count + tool adjustments for all 6 bands
4. **Run lint:** `npx ts-node agent/scripts/lint-manifest.ts` — target 0 warnings for Ch1
5. **Upload manifests to R2:**
   ```
   npx wrangler r2 object put learnlive-assets-prod/beats/ch01/s01.json --file=docs/curriculum/history/ch01_s01.json
   npx wrangler r2 object put learnlive-assets-prod/beats/ch01/s02.json --file=docs/curriculum/history/ch01_s02.json
   ... (s03, s04, s05)
   ```

---

## Phase 5: Scaling to Chapters 2-9

The pipeline is now repeatable per chapter:

| Step | Owner | ~Time |
|------|-------|-------|
| Write beat manifests from textbook | Lovable | 30 min |
| Write image prompts (DK + Documentary) | Lovable | 20 min |
| Generate & upload images | Jules/GCP | 15 min |
| Update registry + lint | Lovable | 10 min |

### Per-Chapter Asset Budget
- ~23 storybook images (Bands 0-1) — to be generated per chapter
- ~14 DK images (Bands 2-3)
- ~8 documentary images (Bands 4-5)
- 4-5 beat manifest JSONs
- **Total: ~45 images + ~5 JSONs per chapter**

---

## Execution Order

| # | Task | Owner | Depends On |
|---|------|-------|------------|
| 1 | Read component-data JSONs for Ch1 | Lovable | — |
| 2 | Write ch01_s02–s05 beat manifests | Lovable | #1 |
| 3 | Add bandOverrides to all Ch1 manifests | Lovable | #2 |
| 4 | Write Ch1 Band 2-5 image prompts document | Lovable | — |
| 5 | Create generation script + prompt JSON | Lovable | #4 |
| 6 | Jules generates & uploads images | Jules/GCP | #5 |
| 7 | Update imageRegistry.ts with new entries | Lovable | #6 |
| 8 | Update manifests with Band 2-5 image refs | Lovable | #6, #7 |
| 9 | Lint all manifests + upload to R2 | Lovable/Jules | #8 |
| 10 | End-to-end session test (all sections, all bands) | Manual | #9 |
