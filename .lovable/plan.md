

## Chapter 1 Audit — Results

**Manifest lint: ✅ ALL PASS, 0 warnings, 0 errors**
- `ch01_s01.json` ✅
- `ch01_s02.json` ✅
- `ch01_s03.json` ✅
- `ch01_s04.json` ✅
- `ch01_s05.json` ✅

The 343 pre-existing warnings (Issue #91 — band 0–3 narration/tool tailoring) are gone. Image registry, `bandOverrides`, `syncTrigger`, and content resolution are all in order. Chapter 1 is **ready to teach across all 6 bands**, end-to-end, once the agent's current Cloud Run revision is live.

**Remaining caveats (not blockers):**
- Chapter 1 manifests live locally in `docs/curriculum/history/` — `ContentFetcher` reads them locally first, so no R2 upload needed for beats. (`tools/upload_beats.sh` exists if/when we promote to R2 as a backup.)
- Cloud Run agent should be redeployed if the latest `imageRegistry.ts` and manifest patches haven't shipped yet.

---

## Frontend Plan — Gray out unfinished chapters

**File:** `src/pages/parent/Dashboard.tsx`

The chapter grid is a single hardcoded `CHAPTERS` array (lines 27–37) rendered as `Button`s (lines 181–191). Only **Chapter 1** is production-ready. Chapter 2 manifests (`s01–s09`) are staged in `.antigravity/manifests/` but not yet promoted to `docs/curriculum/history/` and not lint-verified end-to-end. Chapters 3–9 have no content at all.

### Changes

1. Add a `ready: boolean` flag to each entry in `CHAPTERS`:
   - `ch01` → `ready: true`
   - `ch02`–`ch09` → `ready: false`

2. Update the render block:
   - When `!chapter.ready`: render the button as `disabled`, with muted styling (`opacity-50`, `cursor-not-allowed`, no hover lift), replace the `IconArrowRight` with a small "Coming soon" pill (using existing `Badge` component or a styled `<span>` matching brand tokens), and skip the `onClick` navigation.
   - When `chapter.ready`: keep current behavior unchanged.

3. Keep accessibility: add `aria-disabled="true"` and `title="Coming soon"` on locked chapters.

No new dependencies. Pure presentational change inside the existing card.

### After the edit

I'll re-run the lint as a final sanity check and confirm the Dashboard still renders correctly at the current 944px viewport (the grid already has `sm:grid-cols-2 xl:grid-cols-3` — locked chapters will sit alongside Chapter 1 in the same grid, just visually muted).

### Documentation

- Update `.antigravity/CHANGELOG.md` with "Chapter 1 audit complete; chapters 2–9 visually locked in Dashboard."
- Close Issue #91 in `.antigravity/ISSUES.md`.
- No memory file changes required (this is an interim UX state, not a permanent architectural decision).

