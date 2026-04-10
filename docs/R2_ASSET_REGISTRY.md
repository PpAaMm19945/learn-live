# R2 Asset Registry

> **Bucket:** `learnlive-assets-prod`  
> **Worker route:** `GET /api/assets/{key}` (24h cache)  
> **Resolver:** `src/lib/r2Assets.ts` — `resolveImageUrl(path)`

## Key Structure

| Prefix | Description | Example Key |
|--------|-------------|-------------|
| `assets/storybook/{ch}/` | Storybook illustrations (Bands 0-1) | `assets/storybook/ch01/band0_page01.jpg` |
| `assets/maps/` | Map PNG images | `assets/maps/map_001_post_babel_dispersion.png` |
| `assets/maps/` | Map metadata JSON | `assets/maps/map_001_post_babel_dispersion.json` |
| `assets/maps/transforms/` | Map transform configs | `assets/maps/transforms/map_001.json` |
| `assets/maps/overlays/` | Map SVG overlays | `assets/maps/overlays/map_001.svg` |
| `assets/images/` | Textbook illustrations | `assets/images/chapter_01_babel.jpg` |
| `content/chapters/` | Master curriculum markdown | `content/chapters/chapter_01.md` |

## Storybook Assets (Chapter 01)

### Band 0 (Ages 4-5)
| Key | Description |
|-----|-------------|
| `assets/storybook/ch01/band0_page01.jpg` | God creating the world |
| `assets/storybook/ch01/band0_page02.jpg` | Adam and Eve in the garden |
| `assets/storybook/ch01/band0_page03.jpg` | People building the Tower of Babel |
| `assets/storybook/ch01/band0_page04.jpg` | People confused at Babel |
| `assets/storybook/ch01/band0_page05.jpg` | Families traveling away from Babel |
| `assets/storybook/ch01/band0_page06.jpg` | Mizraim traveling to Egypt |
| `assets/storybook/ch01/band0_page07.jpg` | Cush traveling to Nubia |
| `assets/storybook/ch01/band0_page08.jpg` | Phut traveling to Libya |

### Band 1 (Ages 6-8)
| Key | Description |
|-----|-------------|
| `assets/storybook/ch01/band1_page01.jpg` – `band1_page15.jpg` | 15 scenes covering Creation through Table of Nations review |

## Maps (30 maps)

| Key | Title |
|-----|-------|
| `assets/maps/map_001_post_babel_dispersion.png` | Post-Babel Dispersion |
| `assets/maps/map_002_ancient_egypt_overview.png` | Ancient Egypt Overview |
| `assets/maps/map_003_bantu_migration_biblical_model.png` | Bantu Migration (Biblical Model) |
| ... | (see `worker/scripts/output/r2-upload-manifest.json` for full list) |

## Frontend Usage

```tsx
import { R2Image } from '@/components/ui/R2Image';

// Accepts legacy paths, R2 keys, or full URLs
<R2Image src="/images/storybook/ch01/band0_page01.jpg" alt="Creation" />
<R2Image src="assets/storybook/ch01/band0_page01.jpg" alt="Creation" />
```

## Adding New Assets

1. Upload to R2 via `worker/scripts/upload-to-r2.ts` or `wrangler r2 object put`
2. Add the key to this registry
3. Reference using `resolveImageUrl()` or `<R2Image />`
