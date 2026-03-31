

# Plan: Overhaul `.antigravity/` Documentation for Live-First Pivot

## What happened

The codebase has undergone a major architectural pivot (static scripts → live AI teaching), but the `.antigravity/` documentation still describes the old pipeline. References to deleted files (`ScriptPlayer.tsx`, `src/data/lessons/`, `generate_lesson_script.ts`, etc.) are everywhere. The `JULES_PLAN_PHASE17.md` contains 6 prompts that are now entirely obsolete — they reference scripted cues, "Go Live" buttons, and pre-generated lesson JSONs that no longer exist.

## What needs to happen

### 1. Delete obsolete files

| File | Why |
|------|-----|
| `.antigravity/JULES_PLAN_PHASE17.md` | All 6 prompts reference the deleted ScriptPlayer pipeline. Completely replaced by new phases below. |

### 2. Rewrite `ROADMAP.md` (both root and `.antigravity/`)

Key changes to both copies:
- **Band Model table**: Replace "LessonPlayer" with "SessionCanvas (live AI)" for Bands 2-5
- **Chapter Content Status**: Remove "Lesson Scripts" column (deleted), add "Live Agent" column (all chapters ready via content API)
- **Design Principles**: Update #1 from "The canvas is the product" to "The transcript is the home base" with scene-balance philosophy
- **Architecture Decisions**: Replace items about ScriptPlayer, 3-phase lessons, and script structure. Add decisions about transcript-first kinetic typography, `set_scene` tool, and golden script workflow
- **Current Phase section**: Replace phases 16C/D, 17, 18, 19 with new phases 20-24 (below)
- **Key References**: Remove all deleted file paths (`ScriptPlayer`, `adaptRawScript`, `src/data/lessons/`, etc.), add new ones (`SessionCanvas`, `useWebSocketCanvas`, `session/types.ts`)
- **MapLibre Tool-Call API table**: Add `set_scene` tool

### 3. Update `CHANGELOG.md`

Add entries for:
- **2026-03-31 — Live-First Pivot**: Deleted ScriptPlayer pipeline, created SessionCanvas, created `set_scene` tool, updated agent prompt with scene-balance instructions
- Note which files were deleted and created

### 4. Update `ISSUES.md`

- Close issue 44 (already resolved)
- Close issue 45 (useWebSocketCanvas is now implemented, not a skeleton)
- Add new issues:
  - **47**: Agent WebSocket connection broken (blocks live teaching)
  - **48**: SessionCanvas not yet wired to useSession hook
  - **49**: TranscriptView kinetic typography component not built
  - **50**: TeachingCanvas not integrated into SessionCanvas map scene
  - **51**: StorybookPlayer images are square but canvas expects landscape — needs split-screen layout

### 5. Update `PROMPTS.md`

- Add Phase 20 (Live-First Pivot) entry documenting all deletions and creations from today
- Add new phase prompts 21-25 (below)

### 6. Write new Jules prompts → `.antigravity/JULES_PLAN_PHASE21.md`

Six new prompts replacing the obsolete ones, organized for the live-first architecture:

---

**Phase 21: Wire SessionCanvas to Live Agent (1 instance)**

Scope: Connect `SessionCanvas.tsx` to `useWebSocketCanvas.ts`. Wire `handleToolCall` with `onSceneChange` callback to drive `sceneMode` state. Integrate `TeachingCanvas.tsx` into the map scene slot. Handle connection lifecycle (connecting → connected → error → reconnecting). Pass `familyId`, `learnerId`, `band` from learner store.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

**Phase 22: TranscriptView Kinetic Typography (1 instance)**

Scope: Build `src/components/session/TranscriptView.tsx` — the kinetic typography component that renders the AI's narration as bold, animated text. Words appear synchronized with speech (driven by transcript chunks from WebSocket). Age-adaptive: Band 2-3 gets larger text and slower pacing; Band 4-5 gets denser, more academic typography. Framer-motion word-by-word entrance. Previous lines fade to 40% opacity. Replace the inline transcript rendering currently in `SessionCanvas.tsx`.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

**Phase 23: Fix Agent WebSocket Connection (1 instance, agent/ directory)**

Scope: Debug and fix the Gemini Live API connection in `agent/src/gemini.ts`. The `evaluate_constraint` tool declaration is hardcoded alongside history tools — remove it from history sessions. Verify the full loop: client WebSocket → Express upgrade → `handleHistoryExplainerSession` → `GeminiSession.connect()` → Gemini Live API → tool calls + audio back to client. Add structured logging for every stage. Test locally with a real `GEMINI_API_KEY`.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

**Phase 24A: StorybookPlayer Split-Screen Layout (1 instance)**

Scope: Redesign `StorybookPlayer.tsx` for square images. Layout becomes a split-screen: image takes 60% of viewport width (or top 60% on mobile), text/caption occupies the remaining 40% on a solid background with large, readable type. Remove the gradient overlay on images. Keep tap-to-advance, progress dots, and exit button.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

**Phase 24B: Dashboard & Page Cleanup (1 instance)**

Scope: Remove deprecated pages (`LessonView.tsx`, `ReadingView.tsx`, standalone `ExamView.tsx`, admin `ContentTools.tsx`). Add redirect routes with toast messages. Simplify onboarding to 3 steps. Clean up `App.tsx` routes. Remove any remaining imports of deleted player components.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

**Phase 25: Golden Script Recording (1 instance, after 21-23)**

Scope: Add recording infrastructure. When a live session runs successfully, capture the full sequence of `AgentMessage` objects (tool calls + transcript chunks + timing) as a "golden script" JSON. Save via worker API to R2. Add a `useGoldenScript` hook that replays a recorded session with the same timing — no WebSocket needed. This becomes the zero-latency fallback and the path to static content.

Key instruction to Jules: Read `CHANGELOG.md` after completing work and append a dated entry.

---

### Execution order for Jules

```text
Phase 23 (fix agent WS)  ─┐
Phase 22 (TranscriptView) ─┤── all start immediately (parallel)
Phase 24A (Storybook)     ─┤
Phase 24B (Page cleanup)  ─┘
         ↓
Phase 21 (wire SessionCanvas) ← after 22 + 23 merge
         ↓
Phase 25 (golden script)      ← after 21 merges
```

Total: 6 instances, 2 sequential gates.

### 7. Keep `antigravity_illustration_brief.md` as-is

Still valid for future chapter illustration work.

---

## Summary of file changes

| File | Action |
|------|--------|
| `.antigravity/JULES_PLAN_PHASE17.md` | Delete |
| `.antigravity/ROADMAP.md` | Rewrite with live-first architecture |
| `ROADMAP.md` (root) | Rewrite to match |
| `.antigravity/CHANGELOG.md` | Add pivot entry |
| `.antigravity/ISSUES.md` | Close 44/45, add 47-51 |
| `.antigravity/PROMPTS.md` | Add Phase 20 entry, reference new plan file |
| `.antigravity/JULES_PLAN_PHASE21.md` | Create with 6 new prompts |
| `.antigravity/ARCHITECTURE_LIVE.md` | Keep as-is (already current) |

