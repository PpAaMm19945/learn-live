# Chapter 1 — "Teachable End-to-End" Readiness Plan

## TL;DR
Chapter 1 has all 5 beat manifests written and all 22 new images uploaded to R2.
But the agent **cannot fully teach Ch01 today** because of three concrete gaps:

1. **`syncTrigger` is `null` on every beat** (must be `"start_of_beat"`) → Beat Sequencer cannot align audio↔visuals.
2. **`bandOverrides` is missing from all 5 manifests** → the new `band2_page*` / `band4_page*` images are never selected by band.
3. **`imageRegistry.ts` has no entries for the 22 new Ch01 images** → the agent's system prompt doesn't even know they exist.

A 4th item — uploading manifests to R2 — is **NOT required**. The agent's `ContentFetcher` reads from `docs/curriculum/history/*.json` locally first (Local-First Resolution Strategy). R2 is only used for images and maps.

---

## Gap-by-gap fix plan

### ❌ Gap 1 — Fix `syncTrigger` on all 35 beats across Ch01
**File pattern:** `docs/curriculum/history/ch01_s0{1..5}.json`
**Action:** Set `"syncTrigger": "start_of_beat"` on every beat object.
**Why:** The Beat-Boundary sync rule (mem://ui/session/sync-rule) requires this exact value. `null` will silently break narration↔visual cadence.
**Effort:** 1 jq/sed script across 5 files. ~2 min.

### ❌ Gap 2 — Add `bandOverrides` to every beat that has band-specific images
**Files:** Same 5 manifests.
**Action:** For each beat, add:
```json
"bandOverrides": {
  "2": { "contentImage": "assets/storybook/ch01/band2_pageNN.jpg" },
  "3": { "contentImage": "assets/storybook/ch01/band2_pageNN.jpg" },
  "4": { "contentImage": "assets/storybook/ch01/band4_pageNN.jpg" },
  "5": { "contentImage": "assets/storybook/ch01/band4_pageNN.jpg" }
}
```
Mapping comes from `chapterSection` in `.antigravity/ch01_image_prompts.json` (e.g. `band4_page01.jpg` → section 1.1, `band4_page03.jpg` → section 1.2, etc.).
**Effort:** 22 mappings. Manual but fast — I can generate from the prompts JSON. ~10 min.

### ❌ Gap 3 — Register all 22 new images in `agent/src/imageRegistry.ts`
**File:** `agent/src/imageRegistry.ts`
**Action:** Append 22 entries with `chapters: ['ch01']`, correct `minBand`/`maxBand` (2–3 for `band2_*`, 4–5 for `band4_*`), and short descriptions pulled from `pedagogicalPurpose`.
**Why:** Without this, the agent's prompt context never lists the assets and the Director may pick wrong art or fall back to overlays.
**Effort:** ~5 min generation from prompts JSON.

### ✅ Gap 4 — Lint
**Command:** `npx ts-node agent/scripts/lint-manifest.ts`
**Action:** Run after Gaps 1–3 are closed. Must reach zero warnings before declaring Ch01 ready.

### ✅ Gap 5 — Deploy agent
**Action:** `cd agent && npm run build` then redeploy Cloud Run revision so the new `imageRegistry.ts` ships.

---

## What you do NOT need to upload to R2
- ❌ Beat manifests — they live in repo (`docs/curriculum/history/`) and are read locally first by `ContentFetcher`. R2 fallback exists but is not the primary path.
- ❌ Pronunciation dictionary — bundled in `src/data/pronunciation.json`.
- ❌ The textbook markdown — bundled.

## What IS already in R2 (verified by Jules' log)
- ✅ All 22 new Ch01 images at `assets/storybook/ch01/band[24]_pageNN.jpg`
- ✅ All Ch01 maps (per `mapRegistry.ts`)

---

## Execution order (when you give the go-ahead)
1. Patch all 5 manifests: `syncTrigger` + `bandOverrides` (Gaps 1 & 2 in one pass per file).
2. Append 22 entries to `imageRegistry.ts` (Gap 3).
3. Run lint (Gap 4). Fix any warnings.
4. Build agent. Hand off Cloud Run deploy command (Gap 5).

Total work: ~25 min of edits + 1 deploy. Then **Ch01 is fully teachable across all 6 bands.**

---

## After Ch01 is green — Ch02
9 manifests are staged in `.antigravity/manifests/` awaiting your section-by-section audit per Antigravity's stop-protocol. Do **not** promote them to `docs/curriculum/history/` until Ch01 ships clean — that proves the pipeline end-to-end and the same patches (syncTrigger, bandOverrides, registry) can then be templated for Ch02.
