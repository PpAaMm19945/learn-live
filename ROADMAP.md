# Learn Live — Master Roadmap

> **Last updated:** 2026-03-31
> **Single source of truth** for engineering direction, architecture decisions, and phase tracking.

---

## Origin Story

Learn Live began as a general-purpose math curriculum platform (DAG-based skill progression, constraint templates, repetition arcs). In March 2026 it pivoted to a **focused African History curriculum** — one 9-chapter university-level textbook, AI-adapted for ages 3–18+ across 6 bands.

The math engine, DAG system, and 2,000+ constraint templates are archived in `src/archive/`, `worker/src/archive/`, and `archive/` (root) — not deleted, available for future reactivation.

The teaching experience is **live-first**: the Gemini Live API streams audio, tool calls, and transcript simultaneously via WebSocket. The primary visual surface is **kinetic typography** — the AI's narration rendered as bold, animated text. Visual scenes (maps, images, overlays) slide in temporarily via `set_scene` tool calls.

---

## Product Vision

**One deeply researched African History source, AI-adapted for any age — from picture books to university prep.**

Parents using established curricula (Saxon, Classical Conversations, etc.) report one gap: African History. Learn Live fills that gap as a standalone, supplementary course.

**Core principle:** A child who learned the storybook version of Mizraim at age 5 should feel a thrill of recognition when they encounter the full academic treatment at age 14. Only vocabulary, length, and image style change. Never the theology. Never the facts.

---

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite + Tailwind + shadcn/ui | Deployed to Cloudflare Pages |
| Data | Cloudflare D1 (SQLite) | Families, learners, progress, sessions, curriculum |
| Content Storage | Cloudflare R2 | Master text, maps, audio, golden scripts, generated assets |
| AI Bridge | Google Cloud Run (Express) | Gemini Live API for narration & oral examination |
| Content Adaptation | Gemini 2.5 Flash | RAG-based band adaptation, quiz generation |
| Teaching Canvas | **MapLibre GL JS** | Programmable vector maps with live AI tool calls |
| Session UI | **SessionCanvas + TranscriptView** | Full-bleed kinetic typography + scene overlays |
| Auth | Custom on Workers | Magic link, Google OAuth, email/password, JWT sessions |

---

## Band Model

| Band | Ages | Label | Delivery |
|------|------|-------|----------|
| 0 | 3–5 | Picture Book | StorybookPlayer. Full-screen illustrations, read-aloud, tap to advance. Split-screen layout. |
| 1 | 6–7 | Storybook+ | StorybookPlayer with more detail, simple review questions. Split-screen layout. |
| 2 | 8–9 | Adapted Textbook | SessionCanvas (live AI). Larger text, slower pacing, fewer map interactions. |
| 3 | 10–12 | Full Textbook | SessionCanvas (live AI). Standard kinetic typography, full tool-call set. |
| 4 | 13–17 | Academic | SessionCanvas (live AI). Denser typography, Socratic dialogue, ComparisonView. |
| 5 | 18+ | Seminar | SessionCanvas (live AI). Verbatim text, seminar-style, essay prompts. |

---

## Chapter Content Status

| Ch | Title | Text | GeoJSON | Component Data | Live Agent | Illustrations |
|----|-------|------|---------|---------------|------------|---------------|
| 1 | Creation, Babel, & Table of Nations | ✅ | ✅ | ✅ | ✅ Ready | 23 (Warm Codex) |
| 2 | Ancient Egypt | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 3 | Kingdom of Kush & Nubia | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 4 | Phoenicians & Carthage | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 5 | Church in Roman Africa | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 6 | Aksum & Ethiopian Christianity | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 7 | Rise of Islam in Africa | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 8 | Bantu Migrations | ✅ | ✅ | ✅ | ✅ Ready | ❌ |
| 9 | Medieval African Kingdoms | ✅ | ✅ | ✅ | ✅ Ready | ❌ |

"Live Agent" = GeoJSON + component data + content API ready. The agent generates narration and tool calls in real time — no pre-generated lesson scripts needed.

---

## Completed Phases (Summary)

| Phase | What | When |
|-------|------|------|
| Legacy (1–13) | Math/English/Science curriculum engine, DAG system, constraint templates | Feb 2026 |
| 2 | Custom auth: magic links, Google OAuth, email/password, JWT sessions | Mar 11 |
| 3 | D1 schema, R2 content pipeline, Dashboard/Topic/Lesson UI, Quiz/Progress | Mar 11 |
| 4 | Band adaptation engine, content serving API, ReadingView | Mar 12 |
| 5 | Oral Examiner agent, exam sessions, frontend exam UI, artifact verification | Mar 12 |
| 6 | Explainer Canvas for history (map primitives, agent integration) | Mar 12 |
| 7 | Worker cleanup, chapter content API, family management | Mar 13 |
| 8 | Content pipeline scripts, admin analytics, onboarding, feedback | Mar 14 |
| 9 | Glossary, index, world history context sidebars | Mar 15 |
| 10 | Global learner store (Zustand), AppShell, dashboard redesign | Mar 16 |
| 11 | Post-merge cleanup, progress page, onboarding continuity | Mar 17 |
| 12 | Data quality fixes, reading polish, error handling | Mar 18 |
| 13 | SVG map overlays (30 maps), pronunciation dictionary, component data extraction | Mar 18 |
| 14 | SVG alignment tool (standalone browser tool) | Mar 19 |
| 15 | Session engine: LessonScript types, ScriptPlayer, StorybookPlayer, 9 visual components, lesson script generator CLI | Mar 20 |
| 16A | MapLibre TeachingCanvas shell + imperative API + overlay panels | Mar 22 |
| 16B | Historical GeoJSON data for all 9 chapters (regions, routes, markers) + locations registry | Mar 22–24 |
| 16C | Agent tool-call rewrite: MAPLIBRE_TEACHING_TOOLS, session handler, prompt builder | Mar 24 |
| 20 | **Live-First Pivot**: Deleted ScriptPlayer pipeline, created SessionCanvas, added `set_scene` tool, updated agent prompt with scene-balance instructions | Mar 31 |

---

## Design Principles (Locked)

1. **The transcript is the home base.** Kinetic typography occupies 60-80% of lesson time. Visual scenes slide in temporarily and recede. The AI actively controls the transcript-vs-visual ratio based on chapter content type.
2. **One tap to learning.** Dashboard → tap chapter → session begins.
3. **Band 0 is a different app.** StorybookPlayer is completely separate from SessionCanvas.
4. **Parents observe, not gatekeep.** No blocking approval gates. Passive summaries.
5. **The curriculum is a library.** Dashboard feels like a home library shelf.
6. **Age-appropriate by default.** Band set once per child, everything adapts automatically.
7. **The AI decides what you see.** Scene balance, pacing, and visual density are all AI-controlled in real time via tool calls.

---

## Architecture Decisions (Locked)

1. **MapLibre GL JS** for the teaching canvas. Vector polygons, smooth camera flights, animated routes — all driven by GeoJSON + tool calls.
2. **Live-first, not script-first.** The Gemini Live API streams audio + tool calls simultaneously. No pre-generated lesson scripts. No timestampMs synchronization.
3. **Transcript-first kinetic typography.** The default visual is animated text. Maps, images, and overlays are temporary scenes invoked via `set_scene`.
4. **`set_scene` is the key tool.** The AI explicitly controls what the student sees (transcript / map / image / overlay) and must return to transcript after every visual sequence.
5. **Golden Script workflow.** Successful live sessions are recorded as JSON for zero-latency cached playback. Static content is derived from live, not the other way around.
6. **StorybookPlayer is a separate component.** Bands 0-1 use split-screen layout with illustrations. Not a mode of SessionCanvas.
7. **Chapter 1 launches before Chapter 2 is touched.**

---

## MapLibre Tool-Call API

The AI controls the canvas via these tool calls, fired through the WebSocket alongside audio:

| Tool | What it does |
|------|-------------|
| `set_scene(mode)` | Switch visual mode: transcript / map / image / overlay |
| `zoom_to(region)` | Fly camera to a named location (800ms smooth animation) |
| `highlight_region(id, color)` | Fill a GeoJSON polygon with translucent color |
| `draw_route(from, to, style)` | Animate dashed line between named locations (migration/trade/conquest) |
| `place_marker(location, label)` | Drop a labeled pin at a named city |
| `show_scripture(ref, text)` | Overlay scripture card on canvas |
| `show_genealogy(data)` | Render animated family tree panel |
| `show_timeline(events)` | Pop timeline bar across bottom of map |
| `show_figure(name, image_url)` | Bring up historical figure portrait card |
| `clear_canvas()` | Remove all overlays, return to clean map |
| `dismiss_overlay()` | Remove current overlay panel, keep map state |

---

## Current Phase: Live-First Implementation

See `.antigravity/JULES_PLAN_PHASE21.md` for full Jules prompts.

### Phase 21: Wire SessionCanvas to Live Agent ← after 22 + 23
### Phase 22: TranscriptView Kinetic Typography ← PARALLEL
### Phase 23: Fix Agent WebSocket Connection ← PARALLEL
### Phase 24A: StorybookPlayer Split-Screen ← PARALLEL
### Phase 24B: Dashboard & Page Cleanup ← PARALLEL
### Phase 25: Golden Script Recording ← after 21

---

## Theological Guardrails (Non-Negotiable)

1. Never remove or downplay scripture references
2. Never present the Curse of Ham as legitimate theology
3. Band 0 storybook uses same names, sequence, and emotional beats as full text
4. Only vocabulary and length change between bands — never the theology, never the facts
5. Dates from evolutionary model always tagged `(conventional estimate)`
6. Dates from biblical model always tagged `(biblical chronology)`
7. Band 4–5 system prompt: "The Biblical chronology is the authoritative framework. Teach it as true."

---

## Archived Systems

| System | Location | Reactivation Path |
|--------|----------|-------------------|
| Math curriculum (377 templates, 5 strands) | `archive/curriculum_data/`, `src/archive/` | Load JSON seeds, re-enable math strand |
| English curriculum | `archive/english/` | Similar pattern |
| Science curriculum | `archive/science/` | Similar pattern |
| DAG dependency resolver | `worker/src/archive/` | If history adds prerequisites |
| SVG alignment tool | `tools/svg-aligner/` | Reference for manual alignment |
| PNG map overlays | R2 `assets/maps/` | Kept as reference images |
| Static lesson scripts | Deleted (were in `src/data/lessons/`) | Replaced by live AI + golden scripts |
| ScriptPlayer pipeline | Deleted (Phase 20) | Replaced by SessionCanvas |

---

## Key References

- Master textbook: `docs/curriculum/history/my-first-textbook/`
- Component data: `docs/curriculum/history/component-data/`
- Pronunciation dictionary: `src/data/pronunciation.json`
- Philosophy docs: `docs/core-docs/`
- Agent code: `agent/`
- Worker routes: `worker/src/routes/`
- GeoJSON data: `src/data/geojson/`
- Session canvas: `src/components/session/SessionCanvas.tsx`
- Session types: `src/lib/session/types.ts`
- Teaching canvas (MapLibre): `src/components/canvas/TeachingCanvas.tsx`
- Tool call handler: `src/lib/canvas/toolCallHandler.ts`
- Storybook player: `src/components/player/StorybookPlayer.tsx`
- Live architecture doc: `.antigravity/ARCHITECTURE_LIVE.md`
- Jules prompts: `.antigravity/JULES_PLAN_PHASE21.md`

---

*This document is the single source of truth. Update it as decisions change.*
