# Learn Live — Issue Tracker

> **Last updated:** 2026-03-31

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
| 42 | Admin Role Check Uses Client-Side Storage | LOW — deferred. Admin routes validate server-side via `has_role()` | — |
| 43 | Cloud Run Agent Not Deployed with API Key | Tracked as Phase 23 work | — |
| 44 | Agent Tool Definitions Still Use Legacy Names | Resolved in Phase 16C. `MAPLIBRE_TEACHING_TOOLS` exported. | 16C |
| 45 | WebSocket Not Yet Wired to TeachingCanvas | Resolved in Phase 20 pivot. `SessionCanvas` replaces old wiring pattern. | 20 |
| 46 | forwardRef Warnings on Routes/Login | LOW — cosmetic. React Router v6 refs. | — |

---

## Open Issues

### 47. Agent WebSocket Connection Broken
- **Status:** OPEN — HIGH (blocks Phase 21)
- **Description:** The Gemini Live API connection in `agent/src/gemini.ts` does not complete the handshake. The `evaluate_constraint` tool is hardcoded alongside history tools, causing declaration conflicts. Full loop (client WS → Express → Gemini Live API → tool calls + audio → client) has never completed successfully.
- **Fix:** Phase 23 — debug `gemini.ts`, remove legacy tool declarations, add structured logging, test with real `GEMINI_API_KEY`.

### 48. SessionCanvas Not Wired to useSession Hook
- **Status:** OPEN — HIGH (Phase 21)
- **Description:** `SessionCanvas.tsx` exists as a shell with placeholder scene transitions but has no connection to the WebSocket agent. The `useSession` hook does not exist yet. `handleToolCall` in `toolCallHandler.ts` is ready but not invoked from the session.
- **Fix:** Phase 21 — create `useSession` hook, wire WebSocket messages to scene state and TranscriptView.

### 49. TranscriptView Kinetic Typography Not Built
- **Status:** OPEN — MEDIUM (Phase 22)
- **Description:** `SessionCanvas.tsx` has inline placeholder text for transcript mode. The kinetic typography component (word-by-word entrance, age-adaptive styling, fade on previous lines) does not exist.
- **Fix:** Phase 22 — build `src/components/session/TranscriptView.tsx` with framer-motion animations.

### 50. TeachingCanvas Not Integrated into SessionCanvas Map Scene
- **Status:** OPEN — MEDIUM (Phase 21)
- **Description:** `TeachingCanvas.tsx` (MapLibre) exists as a standalone component but is not rendered inside `SessionCanvas`'s map scene slot. When the AI calls `set_scene("map")`, nothing renders.
- **Fix:** Phase 21 — mount TeachingCanvas inside SessionCanvas, pass ref for tool-call dispatch.

### 51. StorybookPlayer Images Assume Landscape Layout
- **Status:** OPEN — LOW (Phase 24A)
- **Description:** Chapter 1 illustrations are square (Warm Codex style) but StorybookPlayer uses a full-bleed layout that expects landscape images. Images appear cropped or have empty space.
- **Fix:** Phase 24A — redesign as split-screen: image 60% / text 40%.

---

## Notes
- Issue 40 (SVG visibility) led directly to the MapLibre pivot decision.
- Issues 34–36 were data quality issues from rapid phase execution.
- All Phase 10 merge conflicts (issues 1–33) were systematic — caused by parallel Jules instances editing the same files.
- Issues 47 and 48 are the primary blockers for the next milestone (Chapter 1 live E2E).
- The Live-First Pivot (Phase 20) resolved issues 44 and 45 by replacing the entire wiring pattern.
