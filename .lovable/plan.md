

# Sprint 2 — Frontend Delivery Modes and Canvas Band Adaptation

## Summary

Sprint 2 makes the frontend respond to band selection. Sprint 1 made the agent deliver different content per band. Sprint 2 makes the UI render it differently. Six tasks.

---

## Task 1: Upgrade StorybookPlayer for live WebSocket delivery (Bands 0-1)

**Problem:** The current `StorybookPlayer` only works with pre-rendered static JSON scripts (`StorybookScript`). Bands 0-1 should use the live Beat Sequencer like everyone else — but rendered in the storybook layout, not the canvas layout.

**Change:** Create `src/components/player/LiveStorybookPlayer.tsx` — a new component that:
- Connects via `useSession` (same WebSocket hook as `SessionCanvas`)
- Receives beats with `set_scene(image)` + audio + transcript
- Renders in the existing storybook split layout (60/40, full-bleed image left, large caption text right)
- Images are **full-bleed** (not thumbnails) — the primary visual for every beat
- No MapLibre canvas, no overlay queue, no map tools
- Audio auto-plays per beat; tap-to-advance is optional (auto-advances when audio ends)
- Progress dots at the bottom show beat progression
- Simple comprehension check cards (yes/no, tap-to-answer) render inline in the text panel when `show_question` arrives

**Route change in `LessonPlayerPage.tsx`:**
- `band <= 1` renders `LiveStorybookPlayer` (not the static `StorybookPlayer`)
- Keep `StorybookPlayer` as fallback for pre-rendered scripts (offline/cached mode)

---

## Task 2: Band-aware image rendering in SessionCanvas (Bands 2-3 vs 4-5)

**Problem:** Currently `set_scene(image)` always renders as a small thumbnail (w-44/w-52) in the top-right corner. This was designed for bands 4-5 where the map dominates. For bands 2-3, images should be more prominent.

**Changes in `SessionCanvas.tsx`:**
- **Bands 2-3:** Image renders as a **medium card** (w-64 md:w-80) centered in the top portion of the visual panel, with a subtle shadow. Still overlays the map but is much more visible.
- **Bands 4-5:** Keep current small thumbnail behavior (top-right corner, w-44/w-52).
- The `band` prop is already available — add a conditional class based on it.

---

## Task 3: Band-aware visual panel default for Bands 2-3

**Problem:** For bands 2-3, the PNG auto-scrolling chapter map is the correct default visual, but when no map tools fire, the map just scrolls endlessly which may be disorienting for 7-8 year olds.

**Changes in `SessionCanvas.tsx` and `AutoScrollMap.tsx`:**
- **Bands 2-3:** Slow down auto-scroll speed (e.g., `speed={8}` vs default `15`). Disable zoom-to-pan (keep scroll-wheel zoom but simpler).
- **Bands 4-5:** Keep current speed and full interactivity.
- Pass `band` to `AutoScrollMap` and conditionally set speed and zoom limits.

---

## Task 4: Band-aware overlay rendering

**Problem:** The overlay queue (scripture, timeline, key terms, questions, quotes) renders identically for all bands. Band 2-3 students need larger text and simpler cards. Band 4-5 gets the current compact academic styling.

**Changes in `CanvasOverlays.tsx`:**
- Accept a `band` prop
- **Bands 2-3:** Increase font sizes (text-base instead of text-sm), reduce max information density (hide etymology on key terms, shorter quote attributions), use warmer card colors
- **Bands 4-5:** Keep current styling (compact, academic)
- The overlay queue timing should also differ: 20s per card for bands 2-3 (more reading time), 15s for bands 4-5

---

## Task 5: Band-aware transcript typography

**Problem:** `TranscriptView` already receives `band` but the typography doesn't meaningfully change. Band 2-3 should have noticeably larger, warmer text.

**Changes in `TranscriptView.tsx`:**
- **Bands 2-3:** Larger card text (text-lg or text-xl), more line-height (leading-relaxed), fewer cards visible at once (larger cards = natural limit), warmer font weight
- **Bands 4-5:** Keep current sizing (text-base, leading-normal, compact cards)

---

## Task 6: Band-aware controls and interaction UI

**Problem:** The bottom control bar already hides mic/raise-hand for `band < 3`, which is correct. But the Q&A interaction for bands 3-5 should differ based on the `bandProfile.interactivity` policy from Sprint 1.

**Changes in `SessionCanvas.tsx`:**
- **Band 3 (guided):** Show raise-hand button but with a visual "cooldown" indicator (e.g., after one question, button greys out for 90s)
- **Band 4-5 (full):** Keep current behavior — raise hand anytime
- Import `BAND_PROFILES` from a shared config (or duplicate the interactivity subset client-side) to drive this

---

## Files Changed

| File | Action |
|---|---|
| `src/components/player/LiveStorybookPlayer.tsx` | **CREATE** — WebSocket-connected storybook for bands 0-1 |
| `src/pages/LessonPlayerPage.tsx` | **MODIFY** — Route bands 0-1 to LiveStorybookPlayer |
| `src/components/session/SessionCanvas.tsx` | **MODIFY** — Band-aware image size, scroll speed, control cooldowns |
| `src/components/session/AutoScrollMap.tsx` | **MODIFY** — Accept band prop, adjust speed/zoom |
| `src/components/canvas/CanvasOverlays.tsx` | **MODIFY** — Accept band prop, adjust card sizing/timing |
| `src/components/session/TranscriptView.tsx` | **MODIFY** — Band-aware typography scaling |
| `src/lib/bandConfig.client.ts` | **CREATE** — Client-side subset of band interactivity/visual config (no server imports) |

## Order of Implementation

1. `bandConfig.client.ts` (lightweight client config — no agent dependency)
2. `LiveStorybookPlayer.tsx` + `LessonPlayerPage.tsx` routing (bands 0-1 get their own world)
3. `SessionCanvas.tsx` image sizing + control bar changes (bands 2-5 diverge)
4. `AutoScrollMap.tsx` speed/zoom band adaptation
5. `CanvasOverlays.tsx` card sizing and timing
6. `TranscriptView.tsx` typography scaling

## Verification

- Band 0 lesson: Full-bleed images, large caption text, no map, no overlays, auto-advance with audio
- Band 2 lesson: Larger image card, slower map scroll, bigger overlay text, larger transcript cards
- Band 5 lesson: Small thumbnail, fast map, compact overlays, dense transcript — unchanged from current

