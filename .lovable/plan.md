# Chapter 1 Content Pipeline — Status

## ✅ Phase 1: Complete

| Deliverable | File | Status |
|-------------|------|--------|
| Beat manifest — Section 1.1 | `docs/curriculum/history/ch01_s01.json` | ✅ 7 beats |
| Beat manifest — Section 1.2 | `docs/curriculum/history/ch01_s02.json` | ✅ 7 beats |
| Beat manifest — Section 1.3 | `docs/curriculum/history/ch01_s03.json` | ✅ 6 beats |
| Beat manifest — Section 1.4 | `docs/curriculum/history/ch01_s04.json` | ✅ 7 beats |
| Beat manifest — Section 1.5 | `docs/curriculum/history/ch01_s05.json` | ✅ 8 beats |

## ✅ Phase 2: Complete

| Deliverable | File | Status |
|-------------|------|--------|
| Image prompts (22 images) | `.antigravity/ch01_band2-5_image_prompts.md` | ✅ 14 DK + 8 Documentary |
| Prompt JSON for Jules | `.antigravity/ch01_image_prompts.json` | ✅ 22 entries |
| Jules generation instructions | `.antigravity/jules_ch01_image_generation.md` | ✅ Full script + checklist |

## ⏳ Phase 3: Awaiting Jules

Jules generates 22 images via GCP Imagen 3 and uploads to R2 (`learnlive-assets-prod`).
Jules logs results in `.antigravity/jules_generation_log.md`.

## ❌ Phase 4: After Jules completes

1. Update `agent/src/imageRegistry.ts` — add 22 new Band 2-5 entries
2. Add `bandOverrides` to all 5 section manifests
3. Lint: `npx ts-node agent/scripts/lint-manifest.ts`
4. Upload manifests to R2

## ❌ Phase 5: Scale to Chapters 2-9

Repeat pipeline per chapter (~75 min each).
