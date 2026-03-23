# Learn Live — Issue Tracker

> **Last updated:** 2026-03-22

---

## Resolved Issues (Summary)

| # | Issue | Resolution | Phase |
|---|-------|-----------|-------|
| 1–33 | Phase 10 merge conflict debris (triple definitions, duplicate imports, orphaned JSX, missing markdown rendering) | All fixed | 10–11 |
| 34 | D1 Migration 014 not run on production | Migration run manually | 12 |
| 35 | Build frozen lockfile mismatch (`react-markdown` added) | `bun install` + commit lockfile | 12 |
| 36 | Lesson titles stored with markdown in D1 | `stripMarkdown()` utility applied at render time | 11 |
| 37 | R2 bucket binding mismatch (`ASSETS_BUCKET` → `learnlive-assets-prod`) | Fixed `wrangler.toml` binding name | 15 |
| 38 | SVG overlays not loading (path mismatch `maps/overlays/` vs `assets/maps/overlays/`) | Fixed worker route to use correct R2 prefix | 15 |
| 39 | Map admin page showing PNG and SVG cards disconnected | Unified into single card per map with embedded SVG status | 15 |
| 40 | SVG overlays invisible over PNG maps (placeholder rectangles, no real boundaries) | Decision: pivot to MapLibre GL JS | 15 |

---

## Open Issues

### 41. MapLibre GL JS Migration
- **Status:** OPEN — PLANNED (Phase 16)
- **Description:** The PNG+SVG overlay approach for the teaching canvas is being replaced with MapLibre GL JS. Current SVG overlays are placeholder rectangles that don't trace real geographic boundaries. MapLibre renders vector maps with mathematical polygons — highlight Egypt by calling one function, not by tracing SVGs.
- **Impact:** Blocks Chapter 1 E2E milestone. All map-related visual components need to target MapLibre instead of SVG overlays.
- **Plan:** See ROADMAP.md Phase 16.

### 42. Admin Role Check Uses Client-Side Storage
- **Status:** OPEN — LOW
- **Description:** Admin button visibility should be server-validated. Currently uses `/api/admin/check` endpoint which is correct, but the admin tools page itself needs RLS-protected data access.
- **Fix:** Ensure all admin API routes validate role server-side via `has_role()` function.

### 43. Cloud Run Agent Not Deployed with API Key
- **Status:** OPEN — MEDIUM
- **Description:** The Cloud Run agent needs `GEMINI_API_KEY` injected via GCP Secret Manager. Without it, live dialogue and oral examination features are non-functional.
- **Fix:** Create secret in GCP Secret Manager, update `cloudbuild.yaml`, redeploy.

---

## Notes
- Issue 40 (SVG visibility) led directly to the MapLibre pivot decision.
- Issues 34–36 were data quality issues from rapid phase execution.
- All Phase 10 merge conflicts (issues 1–33) were systematic — caused by parallel Jules instances editing the same files.
