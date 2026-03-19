# Phase 14: SVG Alignment Tool — Single Jules Instance

> **Type:** Tooling task. Build a standalone browser-based tool for manual SVG-to-PNG alignment.
> **Strategy:** Single instance, single commit. Not chunked — this is a focused build.
> **Effort:** ~4 hours

---

## Goal
Build a standalone HTML page (NOT part of the main React app) that allows manual visual alignment of SVG overlays onto PNG base maps. This tool is used by the owner to fine-tune the `transform` values in `alignment-manifest.json` after Jules generates the initial SVG overlays in Phase 13.

## Output Files
- `tools/svg-aligner/index.html` — Self-contained alignment tool (single HTML file with inline CSS/JS)
- `tools/svg-aligner/README.md` — Usage instructions

## Specification

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  SVG Map Alignment Tool                                  │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ Map Selector      │  │                              │ │
│  │ [Dropdown: map_001│  │                              │ │
│  │  ...map_034]      │  │    PNG + SVG Overlay         │ │
│  │                   │  │    (interactive canvas)       │ │
│  │ Transform Controls│  │                              │ │
│  │ X: [___] Y: [___] │  │                              │ │
│  │ ScaleX: [___]     │  │                              │ │
│  │ ScaleY: [___]     │  │                              │ │
│  │ Rotate: [___]°    │  │                              │ │
│  │                   │  │                              │ │
│  │ [Reset]           │  │                              │ │
│  │ [Save to JSON]    │  │                              │ │
│  │ [Export All]       │  │                              │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│  Status: "Map 001 — transform saved ✓"                  │
└─────────────────────────────────────────────────────────┘
```

### Functionality
1. **Map selector dropdown** — Lists all maps from `alignment-manifest.json`
2. **Canvas area** — Shows PNG as background layer, SVG as overlay layer
3. **Transform controls** — Sliders + number inputs for translateX, translateY, scaleX, scaleY, rotate
4. **Drag-to-move** — Click and drag on the SVG overlay to adjust position
5. **Scroll-to-zoom** — Mouse wheel adjusts scale
6. **Opacity slider** — Adjust SVG overlay opacity (0–100%) for better alignment visibility
7. **Toggle layers** — Show/hide PNG or SVG independently
8. **Save** — Updates the transform values in `alignment-manifest.json` (uses `localStorage` for now since this is a local tool — owner manually copies values back)
9. **Export** — Downloads the full `alignment-manifest.json` with all current transforms

### File Loading
The tool reads files from local filesystem. Since this runs as a local HTML file:
- PNG and SVG paths are relative to the project root
- Use `<input type="file">` for initial file loading, OR
- If served via `npx serve .` from project root, use relative fetch paths

### Technical Notes
- Pure vanilla HTML/CSS/JS — no React, no build step, no dependencies
- Must work by opening `index.html` directly in a browser OR via a local file server
- Canvas rendering via standard DOM (SVG element overlaid on `<img>`)
- All transform math uses CSS `transform: translate() scale() rotate()`

### Documentation
- Update `.antigravity/logs/phase14_alignment_tool.md`
- Update `.antigravity/progress.md`

---

## No Handoff Required
This is a single-instance task. No chunking needed.
