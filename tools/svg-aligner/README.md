# SVG Map Alignment Tool

A standalone, browser-based tool for manually aligning auto-generated SVG map overlays onto their corresponding PNG base maps.

This tool updates the transform values (`translateX`, `translateY`, `scaleX`, `scaleY`, `rotate`) in `alignment-manifest.json`.

## How to Run

Because the tool needs to load local JSON and image files, it is best run through a local web server to avoid CORS issues.

1. Open your terminal at the **root of the repository**.
2. Run a local static server. For example, using `npx`:
   ```bash
   npx serve .
   ```
3. Open the provided local URL in your browser and navigate to `/tools/svg-aligner/index.html` (e.g., `http://localhost:3000/tools/svg-aligner/index.html`).

*Alternative*: You can simply double-click `index.html` to open it via `file://`, but you will have to manually use the "Choose File" button to load `alignment-manifest.json` from `docs/curriculum/history/Maps/overlays/`.

## Workflow

1. **Load Manifest**: If served via HTTP, click "Auto-Load (Fetch)". If opening locally, use the file input to select the `alignment-manifest.json` file.
2. **Select a Map**: Choose a map from the dropdown list.
3. **Align**:
   - **Click and drag** the SVG to move it.
   - Use the sliders or input boxes in the sidebar to fine-tune X/Y coordinates, scale, and rotation.
   - Use **CTRL + Scroll Wheel** to zoom the workspace in and out.
   - Pan the workspace by clicking and dragging on the dark background.
4. **Save**: Click "Save to LocalStorage" when you are happy with a map's alignment. This prevents you from losing work if you refresh the page.
5. **Export**: Once you have aligned the maps, click "Export All (JSON)". This will download a new `alignment-manifest.json` file to your computer.
6. **Apply**: Move the downloaded file to `docs/curriculum/history/Maps/overlays/alignment-manifest.json`, replacing the old file. Commit your changes to git.
