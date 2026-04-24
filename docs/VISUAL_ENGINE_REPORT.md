# Learn Live: Visual Rendering Engine Analysis Report

This report provides a technical breakdown of the 'Teaching Canvas' architecture from the Learn Live platform to ensure continuity and improvement in future iterations.

## 1. The Rendering Engine (Frontend)

The frontend visual orchestration is managed by `src/components/session/SessionCanvas.tsx`, while the underlying communication and sequencing logic resides in the `useSession` hook (`src/lib/session/useSession.ts`).

### Tool Call Processing
The system employs a **Beat Sequencer** state machine. When the agent sends a `beat_payload` via WebSocket, the sequencer executes the following cycle:
1.  **IDLE**: Waiting for a payload.
2.  **LOADING_BEAT**: Preparing the beat data.
3.  **EXECUTING_TOOLS**: Iterating through the `toolSequence` (array of tool calls) and dispatching them to the UI/Map.
4.  **PLAYING_AUDIO**: Playing the associated audio chunk (or TTS fallback).
5.  **COOLDOWN**: A band-specific pause to let the learner process the information.

### UI Synchronization
`SessionCanvas` "listens" to tool calls via a callback that updates local state (overlays, thumbnails, and visual modes). It intercepts high-level layout commands like `set_scene` and routes geographic commands to the map engine.

## 2. Visual Tool Definitions

Tools are categorized by their UI impact and defined in `src/lib/canvas/toolCallHandler.ts`.

| Tool | Parameters | UI Effect |
| :--- | :--- | :--- |
| `set_scene` | `mode` (transcript/map/image/overlay), `imageUrl`, `caption` | Changes the primary visual layout. |
| `zoom_to` | `lng`, `lat`, `zoom`, `duration`, `location` | Moves the MapLibre camera. |
| `highlight_region` | `regionId`, `color`, `opacity` | Highlights GeoJSON polygons. |
| `draw_route` | `from`, `to`, `color`, `style` (migration/trade/conquest) | Animates a path between two coordinates. |
| `place_marker` | `lng`, `lat`, `label`, `color` | Drops a labeled pin on the map. |
| `show_scripture` | `reference`, `text`, `connection` | Renders a gold-accented scripture card (Bottom-Left). |
| `show_timeline` | `events` (Array: `{year, label, color}`) | Renders a horizontal historical timeline (Bottom). |
| `show_figure` | `name`, `title`, `imageUrl` | Portrait card for historical figures (Top-Left). |
| `show_key_term` | `term`, `definition`, `pronunciation`, `etymology` | Dictionary popup for vocabulary. |
| `show_genealogy` | `rootName`, `nodes` (Tree structure) | Renders a family tree (Top-Right). |
| `show_comparison` | `title`, `columnA`, `columnB` | Side-by-side comparison table. |
| `show_slide` | `title`, `body`, `bullets`, `imageUrl`, `layout` | Full-content slide overlay. |

## 3. Map Implementation

The platform uses two distinct methods for rendering maps:

### Static Background (`AutoScrollMap.tsx`)
A CSS-transformed `<img>` that fits to the container height and slowly auto-scrolls horizontally. This provides a cinematic, non-interactive "world view" during narration.

### Interactive Map (`TeachingCanvas.tsx`)
A **MapLibre GL** engine using standard `EPSG:4326` (Lng/Lat) coordinates.
- **Ancient Theme**: A custom styling layer applied to a MapTiler toner-v2 base. It programmatically hides modern roads, railroads, POIs, and modern political boundaries.
- **Dynamic Overlays**: Supports GeoJSON sources for highlighting ancient regions and animating migration routes.

## 4. Asset Resolution

Asset resolution is handled by `src/lib/r2Assets.ts` using a "resilient candidate" strategy.

- **Storage**: Cloudflare R2 bucket (`learnlive-assets-prod`).
- **Endpoint**: Assets are proxied through a Worker at `/api/assets/{r2Key}`.
- **Resolution Strategy**: The `resolveImageCandidates` function generates multiple possible R2 keys for a single path (e.g., adding/removing `assets/` or `images/` prefixes) to ensure the frontend can find moved or renamed assets without code changes.

## 5. Age Band Adaptations

Visual layouts are adapted based on the Learner's Age Band (0-5) via `src/lib/bandConfig.client.ts`.

### Bands 0-1 (Ages 4-6)
- **Centered Visuals**: Images are full-screen and centered (`imageCentered: true`) instead of small corner thumbnails.
- **Reduced Clutter**: The background auto-scrolling map is hidden (`hideBackgroundMap: true`) to maintain focus on the central subject.
- **Large Type**: Font sizes for transcripts and overlays are significantly enlarged (`text-3xl`).
- **Limited Interaction**: Microphone and "Raise Hand" controls are disabled to simplify the experience.

### Bands 4-5 (Ages 12+)
- **Information Density**: Uses smaller, corner-anchored thumbnails (`imageSizeClass: 'w-44'`) to allow the transcript and map to remain visible.
- **Full Control**: All interactive tools and microphone/QA features are enabled.
- **Higher Pace**: Faster map scroll speeds and shorter overlay display durations.
