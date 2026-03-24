# Learn Live — Master Roadmap

> **Last updated:** 2026-03-24
> **Single source of truth** for engineering direction, architecture decisions, and phase tracking.

---

## Origin Story

Learn Live began as a general-purpose math curriculum platform (DAG-based skill progression, constraint templates, repetition arcs). In March 2026 it pivoted to a **focused African History curriculum** — one 9-chapter university-level textbook, AI-adapted for ages 3–18+ across 6 bands.

The math engine, DAG system, and 2,000+ constraint templates are archived in `src/archive/`, `worker/src/archive/`, and `archive/` (root) — not deleted, available for future reactivation.

The teaching canvas uses **MapLibre GL JS** — a programmable vector map engine with live AI-driven map interactions, replacing the earlier PNG+SVG overlay approach.

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
| Content Storage | Cloudflare R2 | Master text, maps, audio, generated assets |
| AI Bridge | Google Cloud Run (Express) | Gemini Live for narration & oral examination |
| Content Adaptation | Gemini 2.5 Flash | RAG-based band adaptation, quiz generation |
| Teaching Canvas | **MapLibre GL JS** | Programmable vector maps with live AI tool calls |
| Auth | Custom on Workers | Magic link, Google OAuth, email/password, JWT sessions |

---

## Band Model

| Band | Ages | Label | Delivery |
|------|------|-------|----------|
| 0 | 3–5 | Picture Book | StorybookPlayer. Full-screen illustrations, read-aloud, tap to advance. |
| 1 | 6–7 | Storybook+ | StorybookPlayer with more detail, simple review questions. |
| 2 | 8–9 | Adapted Textbook | LessonPlayer. Simplified text, all components. |
| 3 | 10–12 | Full Textbook | LessonPlayer. Unabridged text, dual timeline, full components. |
| 4 | 13–17 | Academic | LessonPlayer + ComparisonView. Socratic dialogue, debate mode. |
| 5 | 18+ | Seminar | LessonPlayer. Verbatim text, student-led seminar, essay prompts. |

---

## Chapter Content Status

| Ch | Title | Text | GeoJSON | Component Data | Lesson Scripts | Audio |
|----|-------|------|---------|---------------|----------------|-------|
| 1 | Creation, Babel, & Table of Nations | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 2 | Ancient Egypt | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 3 | Kingdom of Kush & Nubia | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 4 | Phoenicians & Carthage | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 5 | Church in Roman Africa | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 6 | Aksum & Ethiopian Christianity | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 7 | Rise of Islam in Africa | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 8 | Bantu Migrations | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |
| 9 | Medieval African Kingdoms | ✅ | ✅ | ✅ | ✅ (band 3) | ❌ |

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
| 15 | Session engine: LessonScript types, useScriptPlayer, ScriptPlayer, StorybookPlayer, 9 visual components, lesson script generator CLI | Mar 20 |
| 16A | MapLibre TeachingCanvas shell + imperative API + overlay panels | Mar 22 |
| 16B | Historical GeoJSON data for all 9 chapters (regions, routes, markers) + locations registry | Mar 22–24 |
| 16-StreamB | Lesson script generator updated for MapLibre tool names; band 3 scripts generated for all 9 chapters | Mar 24 |
| 16-StreamC | E2E wiring: adaptRawScript adapter, dynamic lesson loader, ScriptPlayer tool-call bridge, ComponentRenderer filtering | Mar 24 |

---

## Design Principles (Locked)

1. **The canvas is the product.** 70–75% of viewport during lessons.
2. **One tap to learning.** Dashboard → tap chapter → lesson plays.
3. **Band 0 is a different app.** StorybookPlayer is completely separate from LessonPlayer.
4. **Parents observe, not gatekeep.** No blocking approval gates. Passive summaries.
5. **The curriculum is a library.** Dashboard feels like a home library shelf.
6. **Age-appropriate by default.** Band set once per child, everything adapts automatically.

---

## Architecture Decisions (Locked)

1. **MapLibre GL JS replaces PNG+SVG maps** for the teaching canvas. PNG maps kept as reference images in R2.
2. **Live AI narration replaces pre-recorded audio.** Gemini streams voice + tool calls simultaneously via WebSocket. No pre-synchronization needed.
3. **9 reusable visual components, built once.** Every chapter uses same components with different data. These now render as MapLibre overlays + HTML panels, not SVG primitives.
4. **StorybookPlayer is a separate component.** Not a mode switch on LessonPlayer.
5. **Chapter 1 launches before Chapter 2 is touched.**
6. **Lesson player is ONE screen with 3 phases:** Teaching → Dialogue → Review.
7. **The AI is the teacher.** It decides what to show as it speaks — zoom, highlight, draw routes — via tool calls. The lesson script provides structure, but the map interactions are live.

---

## MapLibre Tool-Call API

The AI controls the canvas via these tool calls, fired through the WebSocket alongside audio:

| Tool | What it does |
|------|-------------|
| `zoom_to(region)` | Fly camera to a named location (800ms smooth animation) |
| `highlight_region(id, color)` | Fill a GeoJSON polygon with translucent color |
| `draw_route(from, to, style)` | Animate dashed line between named locations (migration/trade/conquest) |
| `place_marker(location, label)` | Drop a labeled pin at a named city |
| `show_scripture(ref, text)` | Overlay scripture card on canvas |
| `show_genealogy(data)` | Render animated family tree panel |
| `show_timeline(events)` | Pop timeline bar across bottom of map |
| `show_figure(name, image_url)` | Bring up historical figure portrait card |
| `clear_canvas()` | Remove all overlays, return to clean map |

---

## Current Phase: Live AI Integration + Chapter 1 E2E

### Phase 16C: Agent Tool-Call Rewrite ← NEXT
- [ ] Rewrite `agent/src/historyExplainerTools.ts` with MapLibre-native tool definitions
- [ ] Update `agent/src/historyExplainerSession.ts` — tool call handler maps new tool names to WebSocket messages
- [ ] Update `buildHistoryExplainerPrompt()` — new instructions reference MapLibre capabilities
- [ ] Keep band-aware prompt sections (band 0-1, 2-3, 4-5)

### Phase 16D: Live WebSocket Integration ← NEXT
- [ ] Wire WebSocket from Cloud Run agent → `toolCallHandler` → `TeachingCanvas`
- [ ] Implement audio streaming via Web Audio API
- [ ] Build live transcript panel (sidebar showing narration text as it streams)
- [ ] Build canvas action log (tool calls dispatched to map)
- [ ] Waveform/speaking indicator

### Phase 17: Chapter 1 Band 3 End-to-End
- [ ] Wire ScriptPlayer → TeachingCanvas → live Gemini dialogue (Teaching phase uses script, Dialogue phase is live)
- [ ] Test full flow: lesson plays → map responds → dialogue works → progress saves
- [ ] Verify all 9 tool calls work end-to-end with Chapter 1 data
- [ ] Deploy agent to Cloud Run with GEMINI_API_KEY

### Phase 18: Multi-Band Support (Chapter 1)
- [ ] Band 0–1: StorybookPlayer with generated illustrations (no map, simple story)
- [ ] Band 2: Simplified map interactions (fewer regions, slower zoom, bigger labels)
- [ ] Band 4–5: Full map complexity + ComparisonView + Socratic dialogue mode

### Phase 19: UI Redesign
- [ ] Rebuild Dashboard as library shelf
- [ ] Remove deprecated pages (old ReadingView, LessonView wrapper, standalone ExamView, admin SVG alignment tools)
- [ ] Build PostLessonSummary (passive, non-blocking)
- [ ] Simplify onboarding to 3 steps

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

---

## Key References

- Master textbook: `docs/curriculum/history/my-first-textbook/`
- Component data: `docs/curriculum/history/component-data/`
- Pronunciation dictionary: `src/data/pronunciation.json`
- Philosophy docs: `docs/core-docs/`
- Agent code: `agent/`
- Worker routes: `worker/src/routes/`
- GeoJSON data: `src/data/geojson/`
- Lesson scripts: `src/data/lessons/`
- Teaching canvas: `src/components/canvas/TeachingCanvas.tsx`
- Script player: `src/components/player/ScriptPlayer.tsx`
- Tool call handler: `src/lib/canvas/toolCallHandler.ts`
- Script adapter: `src/lib/player/adaptRawScript.ts`

---

*This document is the single source of truth. Update it as decisions change.*
