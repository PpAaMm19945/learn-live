

# Overlay Positioning, Image Persistence, and Map Interactivity Fixes

## Issues from Screenshots

1. **Small overlays scattered across the canvas** — Key term appears at top-center, question at bottom-center, quote at dead-center. They should ALL render in the same bottom-left card slot (like scripture/timeline already do), since they're queued sequentially.

2. **Emojis on cards** — The 🤔 on "Reflect" and 📚 on key terms look casual. Replace with styled text labels or simple icons.

3. **Quote card** — Currently renders center-screen overlaying the map. Move to bottom-left slot.

4. **Image thumbnail crops the image** — `h-28 md:h-32 object-cover` cuts off the square illustration. Change to `aspect-square object-contain` so the full image shows, with caption below.

5. **Image disappears after 20s** — Should persist for the entire beat (until `dismiss_overlay("all")` fires at the start of the next beat). Remove the 20s auto-dismiss timer.

6. **PNG map needs zoom/pan** — Add scroll-wheel zoom and pinch-to-zoom to `AutoScrollMap` so users can explore the detailed map interactively.

## Changes

### A. `src/components/canvas/CanvasOverlays.tsx`
- **Key term** (line 176): Change from `absolute top-20 left-1/2 -translate-x-1/2` to `absolute bottom-24 left-6 right-6 md:right-auto md:max-w-md` (same as scripture). Remove 📚 emoji, use a styled "KEY TERM" label instead.
- **Question** (line 252): Change from `absolute bottom-28 left-1/2 -translate-x-1/2` to `absolute bottom-24 left-6 right-6 md:right-auto md:max-w-md`. Remove 🤔 emoji, keep "REFLECT" as a styled text label.
- **Quote** (line 280): Change from `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` to `absolute bottom-24 left-6 right-6 md:right-auto md:max-w-md`.

All small overlays now share the exact same position — the queue system ensures only one shows at a time.

### B. `src/components/session/SessionCanvas.tsx`
- **Image thumbnail** (lines 539-551): Change image from `h-28 md:h-32 object-cover` to `w-full aspect-square object-contain bg-black/5` so full square images display.
- **Remove 20s auto-dismiss** (lines 195-198): Delete the `setTimeout` that clears the thumbnail after 20s. Images will persist until `dismiss_overlay("all")` fires (which already clears `thumbnailImage` on line 178).

### C. `src/components/session/AutoScrollMap.tsx`
- Add `scale` state (1-4x range) controlled by scroll wheel and pinch gestures.
- Apply `scale(${scale})` alongside existing `translateX` transform.
- Add `transform-origin` tracking so zoom centers on the cursor/pinch point.
- Keep existing drag-to-pan behavior working alongside zoom.

## Files

| File | Change |
|---|---|
| `src/components/canvas/CanvasOverlays.tsx` | Move keyTerm, question, quote to bottom-left slot; remove emojis |
| `src/components/session/SessionCanvas.tsx` | Full square image in thumbnail; remove 20s auto-dismiss |
| `src/components/session/AutoScrollMap.tsx` | Add scroll-wheel and pinch-to-zoom |

