

# Asset Registry and Image Delivery Plan

## What's broken and why

**Image 404s**: The manifest (`ch01_s01.json`) references fictional filenames like `/storybook/ch01/creation.jpg`. Your R2 bucket has `assets/storybook/ch01/band0_page01.jpg` through `band0_page08.jpg` and `band1_page01.jpg`+. The names don't match, so every `set_scene("image")` call results in a 404 and the error fallback text.

**No encyclopedia images**: The agent has no knowledge that `assets/images/Narmer_Palette.jpg` or any of the 26 images you listed exist. There's no registry, no prompt injection — nothing.

**Missing map locations**: The manifest calls `place_marker(location: "nubia")` but `NAMED_LOCATIONS` doesn't have `nubia`. It's in `REGION_CENTERS` (used by `highlight_region` fallback) but not in the location lookup used by `place_marker` and `zoom_to`. Same issue for `libya`.

## Plan

### 1. Create image registry (`agent/src/imageRegistry.ts` — new file)

A catalog of every confirmed image in R2, organized by chapter and category. Each entry has: R2 key, description, relevant chapters, category (storybook/illustration), and band suitability.

**Storybook ch01** (from your screenshot):
- `assets/storybook/ch01/band0_page01.jpg` through `band0_page08.jpg` (8 images, Band 0)
- `assets/storybook/ch01/band1_page01.jpg`+ (Band 1 — I'll include as many as exist)

**Encyclopedia images** (from your list — 26 images):
- `assets/images/Narmer_Palette.jpg` — ch01, ch02
- `assets/images/Rosetta_Stone.jpg` — ch02
- `assets/images/ch02_ipuwer_papyrus.jpg` — ch02
- ... (all 26 entries)

Plus a `buildImageContextForAgent(chapterId, band)` function that produces a prompt block listing available images, similar to `buildMapContextForAgent()`.

### 2. Fix manifest image paths (`docs/curriculum/history/ch01_s01.json`)

Replace every fictional `imageUrl` with a real R2 key:

| Beat | Current (broken) | Replacement |
|---|---|---|
| b01 | `/storybook/ch01/creation.jpg` | `assets/storybook/ch01/band0_page01.jpg` |
| b03 | `/storybook/ch01/fall_of_man.jpg` | `assets/storybook/ch01/band0_page02.jpg` |
| b04 | `/storybook/ch01/promise_of_redemption.jpg` | `assets/storybook/ch01/band0_page04.jpg` |
| b06 | `/storybook/ch01/tower_of_babel.jpg` | `assets/storybook/ch01/band0_page03.jpg` |

I'll map each beat's topic to the most appropriate storybook image based on the page numbering and the illustration brief descriptions (Creation = page01, Fall = page02, Babel = page03, etc.).

### 3. Inject image catalog into agent system prompt (`agent/src/historyExplainerSession.ts`)

Add `buildImageContextForAgent(chapterId, band)` output to the system instruction, right after `buildMapContextForAgent()`. The agent will see a block like:

```
ILLUSTRATION ASSETS AVAILABLE:
- assets/storybook/ch01/band0_page01.jpg — "God creating the world" (Band 0-1)
- assets/images/Narmer_Palette.jpg — "The Narmer Palette" (all bands)
Use: set_scene("image", imageUrl="assets/storybook/ch01/band0_page01.jpg")
```

### 4. Add missing aliases to `NAMED_LOCATIONS` (`src/data/geojson/locations.ts`)

Add entries that the manifest and agent use but currently silently fail:
- `nubia: [31.0, 18.0]` (same as `cush`)
- `libya: [20.0, 32.0]` (same as `phut`)
- `shinar: [44.4, 32.5]` (same as `babel`)
- `ararat: [44.3, 39.7]`
- `nile_valley: [31.5, 25.0]`

### 5. Verify R2 path resolution chain

The frontend calls `resolveImageUrl("assets/storybook/ch01/band0_page01.jpg")` which produces `{WORKER_URL}/api/assets/assets/storybook/ch01/band0_page01.jpg`. The Worker strips the prefix and looks up R2 key `assets/storybook/ch01/band0_page01.jpg`. This should work since that's the exact R2 key. I'll verify the `resolveImageCandidates` logic handles the `assets/` prefix correctly — if it double-prefixes, I'll fix the resolver.

## Files changed

| File | Change |
|---|---|
| `agent/src/imageRegistry.ts` | **New** — catalog of all 26 encyclopedia + 8+ storybook images |
| `agent/src/historyExplainerSession.ts` | Import + inject `buildImageContextForAgent()` into system prompt |
| `docs/curriculum/history/ch01_s01.json` | Fix all 4 broken `imageUrl` paths to real R2 keys |
| `src/data/geojson/locations.ts` | Add `nubia`, `libya`, `shinar`, `ararat`, `nile_valley` |

