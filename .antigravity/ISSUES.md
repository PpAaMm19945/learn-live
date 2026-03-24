# Learn Live — Issue Tracker

> **Last updated:** 2026-03-24

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
| 41 | MapLibre GL JS Migration | TeachingCanvas built, GeoJSON for all 9 chapters, tool-call handler wired | 16A/B |

---

## Open Issues

### 42. Admin Role Check Uses Client-Side Storage
- **Status:** OPEN — LOW
- **Description:** Admin button visibility should be server-validated. Currently uses `/api/admin/check` endpoint which is correct, but the admin tools page itself needs RLS-protected data access.
- **Fix:** Ensure all admin API routes validate role server-side via `has_role()` function.

### 43. Cloud Run Agent Not Deployed with API Key
- **Status:** OPEN — HIGH (blocks Phase 17)
- **Description:** The Cloud Run agent needs `GEMINI_API_KEY` injected via GCP Secret Manager. Without it, live dialogue and oral examination features are non-functional.
- **Fix:** Create secret in GCP Secret Manager, update `cloudbuild.yaml`, redeploy.

### 44. Agent Tool Definitions Still Use Legacy Names
- **Status:** OPEN — HIGH (Phase 16C)
- **Description:** `agent/src/historyExplainerTools.ts` still uses old tool names (`show_element`, `animate_element`, `remove_element`, `show_map_overlay`, `highlight_route`, `zoom_map`). These need to be replaced with MapLibre-native tools (`zoom_to`, `highlight_region`, `draw_route`, `place_marker`, `show_scripture`, `show_genealogy`, `show_timeline`, `show_figure`, `clear_canvas`).
- **Blocks:** Phase 17 (live E2E).

### 45. WebSocket Not Yet Wired to TeachingCanvas
- **Status:** OPEN — HIGH (Phase 16D)
- **Description:** `useWebSocketCanvas.ts` exists as a skeleton but doesn't connect to Cloud Run agent. Audio streaming and live tool call dispatch are not functional.
- **Blocks:** Phase 17 (live E2E).

### 46. forwardRef Warnings on Routes/Login
- **Status:** OPEN — LOW
- **Description:** Console warnings about Function components not accepting refs. Cosmetic only, non-breaking. Likely caused by React Router v6 passing refs to page components.
- **Fix:** Wrap affected page components with `React.forwardRef` or suppress.

---

## Notes
- Issue 40 (SVG visibility) led directly to the MapLibre pivot decision.
- Issues 34–36 were data quality issues from rapid phase execution.
- All Phase 10 merge conflicts (issues 1–33) were systematic — caused by parallel Jules instances editing the same files.
- Issues 44 and 45 are the primary blockers for the next milestone (Chapter 1 live E2E).
