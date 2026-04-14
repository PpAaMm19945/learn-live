

# Sequential Overlay Queue and Image Thumbnail System

## What's working now
The map tools, images, slides, comparisons, and genealogy overlays are all functioning correctly. Beat pacing is much improved. The core lesson flow is solid.

## Problems to fix

### 1. Small overlays all fire simultaneously
When a beat contains multiple tool calls (e.g., `show_scripture` + `show_timeline` + `show_key_term`), they all execute in the same millisecond. Only the last one is visible because they overlap in the same position. The user wants them displayed **sequentially with ~15-second intervals**, one at a time, in the same bottom-left card slot.

### 2. Images take over the entire visual panel
Currently `set_scene("image")` replaces the map with a full-bleed illustration. The user wants images shown as a **thumbnail in a corner** so the chapter map (the PNG auto-scroll) stays as the primary visual.

## Plan

### A. Overlay queue system in SessionCanvas

Instead of setting each overlay immediately, introduce a **queue** that spaces them out:

**New state:**
```
overlayQueue: Array<{ type: keyof OverlayState, data: any }>
activeOverlayIndex: number
```

**"Small" overlay types** that share the bottom-left slot and get queued:
- `scripture`, `timeline`, `keyTerm`, `question`, `quote`

**"Large" overlay types** that render independently (unchanged):
- `slide`, `comparison`, `genealogy`, `figure`

**Logic in `handleAgentToolCall`:**
- When a small overlay tool fires, push it onto the queue instead of setting it directly
- A `useEffect` watches the queue and displays the first item immediately
- After 15 seconds, auto-advance to the next item (clear current, show next)
- When `dismiss_overlay("all")` fires (start of next beat), flush the queue

This means if a beat sends `show_scripture` + `show_key_term` + `show_timeline`, the user sees:
1. Scripture card appears immediately (0s)
2. Scripture fades out, key term fades in (15s)
3. Key term fades out, timeline fades in (30s)

### B. Image as corner thumbnail

Change `set_scene("image")` handling:
- Instead of switching `activeVisual` to `'image'` (full-bleed), keep `activeVisual` as `'map'`
- Store the image URL and caption in a new state: `thumbnailImage`
- Render a **thumbnail card** (roughly 200x150px) in the top-right corner of the visual panel, with rounded corners, a subtle border, and the caption below
- The thumbnail auto-dismisses after 20 seconds or when the next beat's `dismiss_overlay` fires
- Clicking the thumbnail could expand it briefly (optional, stretch goal)

This keeps the auto-scrolling chapter map as the primary visual while still showing the illustration.

### C. Files to change

| File | Change |
|---|---|
| `src/components/session/SessionCanvas.tsx` | Add overlay queue state, queue-based scheduling for small overlays, image thumbnail state instead of full-bleed |
| `src/components/canvas/CanvasOverlays.tsx` | No structural changes needed — it already renders based on overlay state; the queue controls what's in the state at any given time |

### D. Implementation detail

The queue processor in SessionCanvas:

```text
// Pseudocode
const [overlayQueue, setOverlayQueue] = useState([]);
const queueTimerRef = useRef(null);

// When a "small" tool call arrives:
// → push { type, data } onto overlayQueue

// useEffect on overlayQueue:
// → if queue has items and no timer running:
//   → show first item (setOverlays with just that one)
//   → start 15s timer
//   → on timer: clear current, advance index, show next
//   → repeat until queue exhausted

// On dismiss_overlay("all"):
// → clear queue, clear timer, reset overlays
```

For the image thumbnail, add a new element in the visual panel JSX:
```text
{thumbnailImage && (
  <motion.div className="absolute top-4 right-4 z-30 w-48 ...">
    <img src={thumbnailImage.url} ... />
    <p>{thumbnailImage.caption}</p>
  </motion.div>
)}
```

