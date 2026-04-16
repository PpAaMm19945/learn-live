# Chapter 1 — Teachable End-to-End ✅

**Status: COMPLETE** (executed 2026-04-16)

## What was done

| # | Step | Result |
|---|------|--------|
| 1 | Registered 22 new Ch01 images in `agent/src/imageRegistry.ts` | ✅ Added with proper minBand/maxBand (geo & art = 2-5, taharqa & doc = 4-5) |
| 2 | Added `bandOverrides` to 12 image-mode beats across 5 manifests | ✅ 48 band-specific overrides written (12 beats × bands 2-5) |
| 3 | Lint check | ✅ 0 errors across all 5 manifests; 343 pre-existing band-policy warnings flagged for future content authoring (word counts, bullet limits — orthogonal to image wiring) |
| 4 | Build verification | ✅ `imageRegistry.ts` compiles cleanly (only sandbox-only `@types/*` warnings remain) |

## What was NOT a real gap (corrected from initial plan)

- ❌ "syncTrigger: null" — **WAS A FALSE ALARM.** `syncTrigger` lives on individual tool calls inside `toolSequence`, not on the beat object. All tool-level syncTriggers are correctly set to `"start_of_beat"`.
- ❌ Manifest upload to R2 — **NOT NEEDED.** ContentFetcher reads locally first.
- ❌ `band2_pageNN.jpg` / `band4_pageNN.jpg` filenames — **MISLEADING JULES LOG.** Actual R2 keys are descriptive: `geo_*`, `art_*`, `doc_*`. Confirmed against `.antigravity/ch01_image_prompts.json`.

## Image → beat mapping (final)

| Section | Beat | Bands 2-3 | Bands 4-5 |
|---------|------|-----------|-----------|
| 1.1 | b01 History's True Beginning | art_creation_first_light | art_creation_first_light |
| 1.1 | b03 The Fracture of Creation | art_the_fall | art_the_fall |
| 1.1 | b04 The Protoevangelium | art_noah_rainbow | art_noah_rainbow |
| 1.1 | b06 Tower of Babel | art_babel_construction | art_babel_construction |
| 1.2 | b01 The Charter of Nations | art_babel_construction | art_babel_construction |
| 1.2 | b02 The African Founders | art_ham_four_sons | art_ham_four_sons |
| 1.3 | b01 A Painful Story of Sin | art_noahs_tent | art_noahs_tent |
| 1.5 | b01 The Great Rebellion | art_ham_four_sons | art_ham_four_sons |
| 1.5 | b03 Mizraim: Glory of Egypt | art_mizraim_settlers | art_mizraim_settlers |
| 1.5 | b04 Egypt's Idolatry | geo_nile_delta_mizraim | art_taharqa_pharaoh |
| 1.5 | b05 Cush: Southern Superpower | art_meroe_civilization | art_taharqa_pharaoh |
| 1.5 | b06 Phut: Sowing to the Sword | art_phut_warrior | art_phut_warrior |

Bands 0-1 keep the existing `band0_*` / `band1_*` storybook images (StorybookPlayer paradigm).
Map-mode beats (1.1-b07, 1.2-b03, 1.4-b01/b02) and overlay-mode beats are unchanged — they don't render `set_scene image`.

## Remaining work (for full Ch01 polish, not blocking)

The lint flagged 343 pre-existing band-policy warnings — **all about contentText word counts and overlay bullet limits**, NOT about today's image wiring. These require rewriting narration text per band (a much larger content authoring task per `mem://agent/differentiation-logic`). Recommend addressing as a separate Phase: "Ch01 Band 0/1 Storybook Rewrite" before Ch02 promotion.

## Deploy

```bash
cd agent && npm run build && gcloud run deploy ...
```

(No DB migration. No R2 upload. Just a fresh Cloud Run revision so the new `imageRegistry.ts` ships.)

## Next chapter

Ch02 manifests s01–s09 are staged in `.antigravity/manifests/` per Antigravity's stop-protocol. Audit them section-by-section against `chapter_02/sections/*.md` (which doesn't exist yet — will need to be authored alongside the manifests), then promote to `docs/curriculum/history/`.
