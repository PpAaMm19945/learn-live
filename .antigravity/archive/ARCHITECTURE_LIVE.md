# Live-First Teaching Architecture

> Updated: 2026-03-31

## Overview

Learn Live has pivoted from a **static pre-generated script pipeline** to a **live-first architecture** powered by the Gemini Live API. The AI agent is the teacher — it narrates, questions, and controls the visual canvas in real time.

---

## The Transcript Canvas

The primary visual surface is **kinetic typography** — the AI's narration appears as bold, engaging text synchronized with speech. This is the "home base" that students see ~60-80% of the time.

Visual elements (maps, images, overlays) are **temporary scenes** that slide over the transcript via `set_scene` tool calls and recede when the AI returns to narration.

### Scene Modes

| Mode | What renders | When to use |
|------|-------------|-------------|
| `transcript` | Kinetic typography of narration | Default. Narrative passages, theology, introductions, conclusions |
| `map` | MapLibre GL JS canvas | Geographic content: migrations, trade routes, kingdom boundaries |
| `image` | Full-screen illustration | Key moments, portraits, architectural depictions |
| `overlay` | Structured panels (genealogy, timeline, scripture) | Data-heavy comparisons, chronology, family trees |

### Scene Balance (AI-Controlled)

The AI **actively decides** the transcript-vs-visual ratio based on lesson content:

- **Introductory/theological chapters** → 70-80% transcript, 20-30% visual
- **Geographic/migration chapters** → 40-50% transcript, 50-60% visual  
- **Comparative/analytical chapters** → 60% transcript, 40% overlay/visual

This is enforced via the system prompt's `SCENE CONTROL` section. The AI must call `set_scene("transcript")` to return home after every visual sequence.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│  SessionCanvas (full-bleed viewport)         │
│  ┌─────────────────────────────────────────┐ │
│  │  TranscriptView (kinetic typography)    │ │
│  │  ← always mounted, slides behind       │ │
│  └─────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────┐ │
│  │  SceneOverlay (map/image/overlay)       │ │
│  │  ← slides in/out via set_scene          │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  useSession (WebSocket → agent)              │
│  ├── Audio stream (Web Audio API)            │
│  ├── Tool calls → handleToolCall()           │
│  └── Transcript chunks → TranscriptView      │
└──────────────────────────────────────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `src/components/session/SessionCanvas.tsx` | Full-bleed teaching viewport |
| `src/lib/session/types.ts` | Session types (SceneMode, AgentMessage, etc.) |
| `src/lib/canvas/toolCallHandler.ts` | Routes agent tool calls to canvas + scene changes |
| `src/components/canvas/TeachingCanvas.tsx` | MapLibre GL JS map (rendered inside map scene) |
| `src/components/player/StorybookPlayer.tsx` | Band 0-1 storybook (separate component) |
| `agent/src/historyExplainerTools.ts` | Agent tool definitions + system prompt |
| `agent/src/historyExplainerSession.ts` | WebSocket session handler |

### Deleted (Legacy Pipeline)

| File | Was |
|------|-----|
| `src/components/player/ScriptPlayer.tsx` | Static cue-based lesson player |
| `src/lib/player/useScriptPlayer.ts` | Timeline-driven cue executor |
| `src/lib/player/adaptRawScript.ts` | Raw JSON → LessonScript adapter |
| `src/lib/player/types.ts` | LessonScript, Cue types |
| `src/data/lessons/` | Pre-generated lesson JSON files |
| `scripts/generate_lesson_script.ts` | Script generation CLI |
| `scripts/generate_b2_*.py` | Band 2 script generators |
| `src/components/player/ComponentRenderer.tsx` | Legacy component renderer |
| `src/components/player/LessonDrawer.tsx` | Lesson picker drawer |
| Various player UI files | OverlayControls, OverlayCaption, TranscriptPanel, etc. |

---

## Agent Tool: set_scene

The most important new tool. Gives the AI explicit control over what the student sees:

```json
{
  "name": "set_scene",
  "args": {
    "mode": "map" | "transcript" | "image" | "overlay",
    "imageUrl": "...",  // for image mode
    "caption": "..."    // optional
  }
}
```

The prompt instructs the AI to:
1. **Assess** each passage's content type (geographic vs narrative vs analytical)
2. **Choose** the appropriate scene mode before speaking
3. **Return** to transcript after every visual sequence
4. **Never** leave map idle >15 seconds without interaction

---

## Next Steps

1. **Wire useSession hook** — WebSocket connection to agent, audio playback, transcript streaming
2. **Build TranscriptView** — Kinetic typography component with age-adaptive styling
3. **Integrate TeachingCanvas** into SessionCanvas's map scene
4. **Fix Live API WebSocket** — Debug the broken connection in agent/
5. **Golden Script recording** — Record successful sessions for cached playback
