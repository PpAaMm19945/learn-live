

# Comprehensive Fix Plan: Images, Audio, Map, Overlays, and Beat Timing

## Root Cause Analysis

### Why images never appear (critical)
The manifest file `docs/curriculum/history/ch01_s01.json` was updated with correct `set_scene("image")` tool calls, but the **deployed agent fetches content from the Worker API**, not from the local filesystem. The Worker serves its own copy of the manifest (from D1 or bundled files), which still has the OLD version without image tool calls. The local file changes never reached production.

Additionally, for Band 2+, the `imageRegistry.ts` filters out all storybook images (`maxBand: 1`), leaving only the Narmer Palette for ch01. Even if the agent sees the image list, it has almost nothing to work with for higher bands.

### Why audio gets cut off mid-sentence
The TTS service truncates text at 1100 characters (`tts.ts` line 37: `.slice(0, 1100)`). If a narrated beat exceeds this, the audio ends mid-sentence while the transcript shows the full text.

### Why beat gaps are 30-60 seconds
The sequencer waits for `waitMs` (audio duration estimate) on the server side, AND the frontend waits for audio playback completion. These are **double-waiting**: the server sleeps for the estimated duration, then the frontend plays the audio and waits for `onended`. The next beat can't arrive until the server's sleep finishes, even though the frontend is already done. Combined with TTS synthesis time for the next beat (6.5s throttle + API latency), gaps compound.

### Why map auto-scroll stopped
The `AutoScrollMap` component code is intact and should work. The likely issue is that the map image 404s (if the Worker isn't resolving the R2 path correctly), causing `imgFailed = true` and showing the "Map loading..." fallback. Or the opacity transition between `map` and `maplibre` layers means the auto-scroll map gets `pointer-events-none` when the maplibre layer is shown, and when it reverts, the image may need a re-render.

### Why markers are misaligned
The `TeachingCanvas` MapLibre map uses a default world view. When `highlight_region` places markers at region centers (e.g., Mizraim at [31, 27]), `fitToMarkers` calculates bounds but the map container may be partially obscured by overlays, or the padding is insufficient for the viewport size.

## Plan

### A. Fix manifest delivery to the deployed agent

**Problem**: Agent in production reads from Worker API, not local JSON files.

1. **Add a Worker endpoint** to serve beat manifests from the repo-bundled JSON, OR
2. **Simpler**: Make the ContentFetcher prefer local files when available (they're bundled in the Docker image at build time)

In `agent/src/contentFetcher.ts`, change the logic to **always try local first**, falling back to Worker. The Dockerfile already copies `docs/` into the container. This ensures manifest updates in the repo immediately take effect on deploy.

### B. Fix audio truncation

In `agent/src/tts.ts`, increase the character limit from 1100 to ~4000, and implement **sentence-boundary splitting**. If the text exceeds the limit, split at the last sentence boundary before the limit, synthesize each chunk, and concatenate the base64 audio. This prevents mid-sentence cutoffs.

### C. Eliminate double-wait beat timing

The server-side `waitMs` sleep in `beatSequencer.ts` (line 99-119) is redundant because the frontend already waits for audio playback completion before setting `beatState = 'IDLE'`. The server should send beats as fast as they're prepared and let the frontend pace itself.

**Change**: In `beatSequencer.ts`, replace the variable `waitMs` sleep with a fixed short delay (e.g., 800ms) — just enough to avoid flooding the WebSocket. The frontend's beat queue + audio playback already provides correct pacing.

### D. Fix storybook image band filtering

In `agent/src/imageRegistry.ts`, raise `maxBand` for storybook images from 1 to 5 (or at least 3). These illustrations are valid at all bands — the agent prompt already instructs band-appropriate usage. This gives the agent actual images to use for ch01 at bands 2-5.

### E. Show scripture and timeline sequentially (not mutually exclusive)

Currently, `show_timeline` clears `scripture` and vice versa. Instead:

1. When both arrive in the same beat (common), show scripture first for 5 seconds, then auto-transition to timeline
2. In `SessionCanvas.handleAgentToolCall`, when `show_timeline` is called and scripture is already showing, delay the timeline display by 5 seconds using `setTimeout`
3. This creates a natural "scripture → timeline" flow within the same beat

### F. Fix map marker centering

In `toolCallHandler.ts`, after all `highlight_region` calls in a beat complete, call `fitToMarkers()` with increased padding (80px instead of 60px) and a lower `maxZoom` (5 instead of 6) to ensure all regions are visible. Add a debounced `fitToMarkers` call at the end of the beat's tool execution sequence rather than per-region.

### G. Ensure AutoScrollMap stays active

The `activeVisual` state switches to `maplibre` for map tools and reverts after 15s. But the auto-scroll map layer uses `opacity-0 pointer-events-none` when not active, which is correct. Verify that the `chapterMapUrl` is being resolved correctly through the R2 worker. If the image loads successfully, the auto-scroll animation should work. Add a console log in `AutoScrollMap` on load/error for debugging.

## Files to change

| File | Change |
|---|---|
| `agent/src/contentFetcher.ts` | Always try local filesystem first, then Worker API fallback |
| `agent/src/tts.ts` | Sentence-boundary splitting for long texts (up to ~4000 chars) |
| `agent/src/beatSequencer.ts` | Replace variable `waitMs` with fixed 800ms inter-beat delay |
| `agent/src/imageRegistry.ts` | Raise storybook `maxBand` from 1 to 5 |
| `src/components/session/SessionCanvas.tsx` | Sequential scripture→timeline display with 5s delay |
| `src/lib/canvas/toolCallHandler.ts` | Debounced `fitToMarkers` with better padding/zoom |

## Priority

A (manifest delivery) and D (band filtering) are the most critical — they're why zero images appear. B and C fix audio quality and pacing. E and F are UX polish.

