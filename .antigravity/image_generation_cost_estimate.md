# Image Generation Cost Estimate — Chapters 1-9, All Bands

Generated: 2026-04-15

---

## Chapter & Section Inventory

| Chapter | Title | Sections | Est. Beats |
|---------|-------|----------|------------|
| 1 | The Charter of Nations | 5 | 35 (actual) |
| 2 | Egypt: Gift of the Nile | 9 | ~56 |
| 3 | Lands of Phut — Carthage, Numidia, Desert Kingdoms | 4 (incl. intro + summary) | ~28 |
| 4 | Lands of Cush — Babel to Eve of Roman Africa | ~6 (estimated) | ~38 |
| 5 | The Church in Roman Africa | 8 | ~50 |
| 6 | Egypt under Rome & the Alexandrian Church | ~7 (estimated) | ~44 |
| 7 | Churches of the Highlands: Aksum | 9 (core sections) | ~56 |
| 8 | Peopling of Africa: Bantu Migrations | 8 (core sections) | ~50 |
| 9 | Ethiopia Alone: The Hidden Kingdom | ~7 (estimated) | ~44 |
| **TOTAL** | | **~63 sections** | **~401 beats** |

---

## Image Budget Per Chapter

### Methodology (based on Chapter 1 actuals)

Chapter 1 has **5 sections, 35 beats** and generated:
- **23 images** for Bands 0-1 (Warm Codex storybook) — ~4.6 per section
- **14 images** for Bands 2-3 (DK Encyclopedia) — ~2.8 per section  
- **8 images** for Bands 4-5 (Documentary/Scholarly) — ~1.6 per section
- **Total: 45 images** across all bands = **~9 images per section**

### Projected Image Counts

| Chapter | Sections | Band 0-1 | Band 2-3 (DK) | Band 4-5 (Doc) | Total |
|---------|----------|----------|----------------|-----------------|-------|
| 1 | 5 | 23 ✅ | 14 | 8 | 45 |
| 2 | 9 | 42 | 25 | 14 | 81 |
| 3 | 4 | 18 | 11 | 7 | 36 |
| 4 | 6 | 28 | 17 | 10 | 55 |
| 5 | 8 | 37 | 22 | 13 | 72 |
| 6 | 7 | 32 | 20 | 11 | 63 |
| 7 | 9 | 42 | 25 | 14 | 81 |
| 8 | 8 | 37 | 22 | 13 | 72 |
| 9 | 7 | 32 | 20 | 11 | 63 |
| **TOTAL** | **63** | **~291** | **~176** | **~101** | **~568** |

**Already generated:** 23 (Band 0-1 Ch1)  
**Remaining to generate:** ~545 images

---

## Cost Calculation

### GCP Vertex AI — Imagen 3

| Metric | Value |
|--------|-------|
| Price per image (Imagen 3, 1024×1024) | **$0.04** |
| Price per image (Imagen 3, 512×512 / 640×640) | **$0.02** |
| Our target size | 640×640 (maps to $0.02-$0.04 tier) |

> **Note:** Google's Imagen 3 pricing is currently $0.04/image for standard resolution and $0.08/image for high resolution. Pricing may have changed — verify at [cloud.google.com/vertex-ai/pricing](https://cloud.google.com/vertex-ai/pricing).

### Cost Scenarios

| Scenario | Price/Image | Images | Cost | Notes |
|----------|-------------|--------|------|-------|
| **Optimistic** | $0.02 | 545 | **$10.90** | Low-res tier applies to 640×640 |
| **Standard** | $0.04 | 545 | **$21.80** | Standard 1024×1024 pricing |
| **With 30% regen** | $0.04 | 709 | **$28.36** | Assume ~30% need regeneration |
| **Worst case (50% regen)** | $0.04 | 818 | **$32.72** | Half of all images need a redo |

### Per-Chapter Cost Breakdown (Standard @ $0.04)

| Chapter | New Images | Cost |
|---------|-----------|------|
| 1 (remaining Bands 2-5) | 22 | $0.88 |
| 2 | 81 | $3.24 |
| 3 | 36 | $1.44 |
| 4 | 55 | $2.20 |
| 5 | 72 | $2.88 |
| 6 | 63 | $2.52 |
| 7 | 81 | $3.24 |
| 8 | 72 | $2.88 |
| 9 | 63 | $2.52 |
| **TOTAL** | **545** | **$21.80** |

---

## Summary

| Item | Value |
|------|-------|
| Total images across all bands, all 9 chapters | **~568** |
| Already generated | 23 |
| Remaining | ~545 |
| **Estimated cost (standard, no regen)** | **~$22** |
| **Estimated cost (with 30% regen)** | **~$28** |
| **Estimated cost (worst case, 50% regen)** | **~$33** |

**Bottom line: The entire image pipeline for 9 chapters across all bands will cost approximately $22-$33.**

This is remarkably affordable. Even at worst case with heavy regeneration, total spend is under $35.

---

## Additional Costs to Consider

| Item | Estimated Cost |
|------|---------------|
| R2 Storage (568 images × ~200KB avg) | ~$0.02/month (free tier covers this) |
| R2 Egress (Class B reads) | Free (Cloudflare R2 has zero egress fees) |
| Vertex AI API calls for prompt engineering/testing | ~$2-5 during development |
| **Total infrastructure overhead** | **Effectively $0** |
