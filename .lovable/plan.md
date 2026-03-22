

# Repository Cleanup Plan

## The Problem

The repo has accumulated debris from 15+ phases of development, two major pivots (math → history, raster maps → MapLibre), and parallel agent (Jules) execution. Documentation is scattered across 7+ files with overlapping content, root directory has ~20 orphaned scripts and screenshots, and legacy code sits in multiple locations.

## What Gets Cleaned Up

### 1. Root Directory — Remove Orphaned Files

**Delete these** (one-off scripts, screenshots, and legacy helpers that served their purpose):

```text
ROOT FILES TO DELETE:
├── append_manifest.js
├── append_manifest_c.cjs
├── audit_worldview.cjs
├── extract_legacy.cjs
├── fix_legacy.cjs
├── frontend-verify.py
├── generate_batch_b.cjs
├── generate_batch_c.cjs
├── generate_batch_d.cjs
├── generate_science_strand_1.cjs
├── generate_science_strand_2.cjs
├── generate_science_strand_3.cjs
├── generate_strand_5.cjs
├── deploy_agent.sh
├── dashboard-mobile.png
├── dashboard_cta.png
├── dashboard_redirect.png
├── exam-view-mobile.png
├── glossary_verification.png
├── lesson-view-mobile.png
├── narrated-lesson-mobile.png
├── reading-view-mobile.png
├── topic-detail-mobile.png
├── SYNC_TEST.md
├── PROMPT_FOR_JULES.md
├── PROMPT_FOR_JULES_ENGLISH.md
├── PROMPT_FOR_JULES_SCIENCE.md
├── PROMPT_FOR_JULES_SUBJECTS.md
├── issues.md  (duplicate — consolidating into .antigravity/)
```

**Keep**: `ROADMAP.md` (will be rewritten), `AGENTS.md`, `README.md`, all config files.

### 2. Legacy Curriculum Data — Archive

Move to `archive/` (these are from the math/english/science pivot and no longer active):

```text
MOVE TO archive/:
├── curriculum_data/          (all math/english/science JSON templates)
├── docs/curriculum/math/     (math spine, templates, task.md)
├── docs/curriculum/english/  (english spine, templates)
├── docs/curriculum/science/  (science spine, templates)
├── scripts/english/          (english extraction scripts)
├── scripts/generate_b2_*.py  (math generation scripts)
├── scripts/batch_sql.cjs
├── scripts/run_batches.cjs
├── scripts/extract_english_templates.cjs
├── verification/             (old screenshots)
├── videos/                   (old verification videos)
```

**Keep in place**: `docs/curriculum/history/`, `docs/core-docs/`, `scripts/generate_lesson_script.ts`, `scripts/seed_curriculum.ts`.

### 3. Documentation Consolidation

Replace the current 7-file scattered documentation with 4 clean files:

#### `.antigravity/ROADMAP.md` — Single Source of Truth
- Merge `ROADMAP.md` (root) + `.antigravity/roadmap.md` + `.antigravity/progress.md`
- Structure: Origin story (math pivot → history pivot → MapLibre pivot), completed phases as a compact summary table, current architecture, and upcoming phases clearly laid out
- The 873-line session engine roadmap gets trimmed to its still-relevant sections (vision, band definitions, design principles, architecture decisions). Phases 3.1-3.5 marked complete. Phases 3.6-3.10 rewritten to reflect the MapLibre pivot.

#### `.antigravity/ISSUES.md` — Single Issues Tracker
- Merge `issues.md` (root) + `.antigravity/issues.md`
- Resolved issues compressed to a one-line-per-issue summary table
- Only open/active issues get full descriptions
- Add the new open issues (MapLibre migration, admin tools refinement)

#### `.antigravity/PROMPTS.md` — Consolidated Prompt Log
- Merge `.antigravity/prompts.md` + all `prompts-phase*.md` files
- Each phase becomes a compact table (already the format in prompts.md)
- Delete the 6 individual `prompts-phase*.md` files after merging

#### `.antigravity/CHANGELOG.md` — One-Line-Per-Decision Log
- Absorb `.antigravity/notes/` (18 files) and `.antigravity/walkthroughs/` (3 files) and `.antigravity/logs/` (2 files)
- Each note becomes 1-3 lines: date, decision, outcome
- Delete the `notes/`, `walkthroughs/`, `logs/` directories after

### 4. Root ROADMAP.md — Rewrite

The root `ROADMAP.md` becomes a short, public-facing document:
- Product vision (3 paragraphs)
- Architecture overview (Cloudflare Workers + D1 + R2, Cloud Run agent, React frontend)
- Chapter content status table
- Link to `.antigravity/ROADMAP.md` for detailed engineering roadmap

### 5. What Does NOT Get Touched

- `src/archive/` and `worker/src/archive/` — already properly archived and excluded from compilation
- `docs/curriculum/history/` — active content, stays
- `docs/core-docs/` — philosophy and pedagogy docs, stays
- `agent/` — Cloud Run agent, stays
- `tools/svg-aligner/` — still useful reference, stays
- All active `src/components/`, `src/pages/`, `worker/src/routes/` — no changes

## Execution Order

1. Delete root orphaned files (scripts, screenshots, legacy prompts)
2. Move legacy curriculum data to `archive/`
3. Write consolidated `.antigravity/ROADMAP.md`
4. Write consolidated `.antigravity/ISSUES.md`
5. Write consolidated `.antigravity/PROMPTS.md`
6. Write consolidated `.antigravity/CHANGELOG.md`
7. Rewrite root `ROADMAP.md` as short overview
8. Delete absorbed files (`notes/`, `walkthroughs/`, `logs/`, individual prompt files)
9. Update `.gitignore` if needed

## Technical Notes

- No code changes. No component edits. No route changes. Documentation and file organization only.
- The `tsconfig.app.json` already excludes `src/archive/` — the new `archive/` at root for curriculum data doesn't need exclusion since it's not TypeScript source.
- Build will not be affected by any of these changes.

