# Learn Live — Phase 3 Roadmap: The Session Engine

> **Status:** PLANNING — No implementation until this document is reviewed and approved.
> **Date:** 2026-03-19
> **Source:** Full Build Verdict document + owner clarifications

---

## Table of Contents

1. [Product Vision Summary](#1-product-vision-summary)
2. [Design Principles](#2-design-principles)
3. [Content Scale Reality](#3-content-scale-reality)
4. [Band Definitions — The Content Contract](#4-band-definitions--the-content-contract)
5. [The 9 Visual Components](#5-the-9-visual-components)
6. [Architecture Decisions (Locked)](#6-architecture-decisions-locked)
7. [Owner Clarifications (Locked)](#7-owner-clarifications-locked)
8. [Page-by-Page Audit — What Stays, What Goes](#8-page-by-page-audit--what-stays-what-goes)
9. [Navigation Flow — Before & After](#9-navigation-flow--before--after)
10. [Screen Specifications](#10-screen-specifications)
11. [Band-Aware UI Adaptation](#11-band-aware-ui-adaptation)
12. [Phase 3.1 — Cloud Run Deployment](#12-phase-31--cloud-run-deployment)
13. [Phase 3.2 — Dual Player Architecture](#13-phase-32--dual-player-architecture)
14. [Phase 3.3 — SVG Alignment Tool](#14-phase-33--svg-alignment-tool)
15. [Phase 3.4 — 9 Visual Component Shells](#15-phase-34--9-visual-component-shells)
16. [Phase 3.5 — Lesson Script Generator](#16-phase-35--lesson-script-generator)
17. [Phase 3.6 — Chapter 1 Band 3 End-to-End](#17-phase-36--chapter-1-band-3-end-to-end)
18. [Phase 3.7 — Chapter 1 Bands 4–5 (Premium)](#18-phase-37--chapter-1-bands-45-premium)
19. [Phase 3.8 — Chapter 1 Bands 1–2 (Storybook Layer)](#19-phase-38--chapter-1-bands-12-storybook-layer)
20. [Phase 3.9 — Chapter 1 Band 0 (Picture Book)](#20-phase-39--chapter-1-band-0-picture-book)
21. [Phase 3.10 — UI Redesign](#21-phase-310--ui-redesign)
22. [Content Production Workflow](#22-content-production-workflow)
23. [Image Generation System](#23-image-generation-system)
24. [Pronunciation Dictionary](#24-pronunciation-dictionary)
25. [Theological Guardrails](#25-theological-guardrails)
26. [Chapter Production Checklist (Repeatable Template)](#26-chapter-production-checklist-repeatable-template)
27. [Launch Strategy](#27-launch-strategy)
28. [Known Risks & Mitigations](#28-known-risks--mitigations)

---

## 1. Product Vision Summary

Learn Live is a Biblical African History AI Tutor covering 9 chapters (Creation to ~1500 AD) across 6 age bands (ages 3–18+). A parent who starts a child at Band 0 (age 3) and continues through Band 5 (age 17) uses this product for 14 years on the same child. The bands are not separate products — they are the same story told at increasing depth.

**Core principle:** A child who learned the storybook version of Mizraim at age 5 should feel a thrill of recognition when they encounter the full academic treatment at age 14. Only vocabulary, length, and image style change. Never the theology. Never the facts.

---

## 2. Design Principles

These 6 principles drive every UI decision. Every screen, component, and interaction must be traceable back to one of these.

### Principle 01 — The canvas is the product
The AI teaching on screen — voice, map, visuals — is why this app exists. Every pixel that is not the canvas is peripheral. The canvas should dominate every lesson screen (70–75% of viewport).

### Principle 02 — One tap to learning
From the moment a parent opens the app, there should be at most one decision before the lesson begins. Pick a chapter. Tap play. Nothing else. Every additional step is a failure of design.

### Principle 03 — Band 0 is a different app
A 4-year-old and a 14-year-old are not using the same interface. The storybook player and the lesson player are two separate products sharing a codebase, not one product with a mode switch.

### Principle 04 — Parents observe, not gatekeep
The old architecture put parents in a judgment queue. The new model keeps parents informed but removes blocking gates. Learning flows continuously. The parent sees what happened, not a permission request.

### Principle 05 — The curriculum is a library
Chapters are books in a library, not levels in a game. The parent dashboard should feel like a home library shelf — calm, rich, purposeful — not a progress tracker or a management dashboard.

### Principle 06 — Age-appropriate by default
Band is set once per child, not chosen per session. The entire UI — language, visual density, interaction model — adjusts to the child's band automatically. The parent never has to think about it again after setup.

---

## 2. Content Scale Reality

| Asset Type | Total Count | Notes |
|---|---|---|
| Unique visual assets | 266 | Full versions, bands 3–5 |
| Lesson scripts | 54 | 9 chapters × 6 bands |
| Pre-rendered audio cues | ~2,700 | TTS across all lessons |
| Original illustrations | ~160 | Bands 0–2 storybook mode |
| Maps | 32 | Across all chapters |
| Genealogy trees | 9 | One per chapter |
| Timelines | 18 | Dual-row for bands 3–5 |
| Scripture cards | ~90 | All bands |
| Portrait/figure cards | ~36 | Historical figures |
| Definition cards | ~63 | Key terms |

**CRITICAL:** Do NOT treat these totals as pre-launch requirements. Launch needs only Chapter 1 across all 6 bands. Everything else is ongoing content production.

---

## 3. Band Definitions — The Content Contract

### Band 0 — Ages 3–5 (Picture Book)
- **Text:** Fully rewritten storybook. 8–12 scenes per chapter. Max 3 sentences per scene. Read-aloud rhythm.
- **Map:** Warm semi-realistic illustration. Hand-painted feel. 2–3 colored landmasses, no labels.
- **Visuals:** Full-page illustrations per scene. No genealogy trees, no timelines. Scripture card = one verse, large text.
- **AI Voice:** Slow, warm, musical. Repeats key words. "Mizraim. Can you say Mizraim?" Pauses for echo.
- **Interaction:** None — parent reads alongside. Tap to replay. No exam. AI asks "What is this?" with picture.
- **Player:** `StorybookPlayer` — a completely separate component from the lesson player. Full-screen image, read-aloud audio, tap to advance, tap to replay a word. No canvas, no dialogue, no exam. Closer to an audiobook app than a lesson player. **Do not attempt to unify with the lesson player.**

### Band 1 — Ages 6–7 (Storybook+)
- **Text:** Storybook with more detail. 10–15 scenes. Short paragraphs. Key terms bolded. Narrative-first.
- **Map:** Simplified geography. Same regions, bolder colors, minimal labels (region names only, large font).
- **Visuals:** Scene illustrations + simplified genealogy tree (names only, no dates). Scripture card with 1–2 sentences of context.
- **AI Voice:** Storytelling voice. Warm, paced. Asks "What do you think happens next?" before turning scene.
- **Interaction:** Child answers simple questions by voice or tap. 3-question review at end with picture prompts.

### Band 2 — Ages 8–9 (Adapted Textbook)
- **Text:** Adapted textbook. Vocabulary simplified. 60% of original length. All sections present. Same structure as Band 3.
- **Map:** Full map PNG with simplified SVG overlay (3–4 regions only, no small settlements, bolder colors, larger text).
- **Visuals:** Genealogy tree with dates. Simple timeline (one row, biblical dates only). All standard components.
- **AI Voice:** Clear narrator voice. Explains one idea at a time.
- **Interaction:** Open voice Q&A after lesson. "Why" questions in review. AI answers from chapter only.

### Band 3 — Ages 10–12 (Full Textbook)
- **Text:** Full textbook text. Unabridged. All sections including Think It Through questions.
- **Map:** Full map PNG + full SVG overlay. All regions, settlements, routes. Zoom and pan.
- **Visuals:** All visual components at full complexity. Dual timeline (biblical vs conventional). Full genealogy. All figures.
- **AI Voice:** Academic but warm. Introduces epistemology.
- **Interaction:** Full open dialogue. Child can interrupt. AI defends biblical framework. 3 analytical review questions.

### Band 4 — Ages 13–17 (Academic)
- **Text:** Full textbook + supplementary depth. AI can draw on cross-chapter connections not in chapter text.
- **Map:** Full maps + comparative overlays.
- **Visuals:** All components + comparison mode. Secular vs biblical chronology shown explicitly. Historiography notes.
- **AI Voice:** Socratic and academic. Introduces secular objections and refutes them from scripture and evidence.
- **Interaction:** Debate mode. Student challenges claims. AI holds the biblical position. Essay prompts for review.

### Band 5 — Ages 18+ (Seminar)
- **Text:** Full textbook as written. No adaptation. AI reads from your exact words where appropriate.
- **Map:** Full maps. All components in reference mode. Student can pull any visual on demand during dialogue.
- **Visuals:** All components in reference mode.
- **AI Voice:** Seminar peer tone. Treats student as intellectual equal. Pushes for original synthesis.
- **Interaction:** Full seminar. Student-led. AI challenges. Oral thesis review. Written essay prompts.

---

## 4. The 9 Visual Components

Build each component once, use it across all chapters. Every visual in every lesson is one of these components rendered with different data and band-appropriate styling.

| # | Component | Function Call | Band Behavior |
|---|---|---|---|
| 1 | **MapOverlay** | `show_map(region, highlights)` | Band 0: illustration only. Band 1–2: simplified SVG. Band 3–5: full SVG + zoom/pan. |
| 2 | **SceneImage** | `show_scene_image(url)` | Band 0–1 only. Full-page illustration per storybook scene. |
| 3 | **GenealogyTree** | `show_genealogy(tree_data)` | Band 0: none. Band 1: names only. Band 3+: names + dates + descriptors. Pure SVG, data-driven. Animated reveal. |
| 4 | **DualTimeline** | `show_timeline(events, mode)` | Band 2: single biblical row. Band 3–4: dual rows (YEC vs conventional). Band 5: full with historiography. Events animate in as AI mentions them. |
| 5 | **ScriptureCard** | `show_scripture(ref, text, connection)` | All bands. Band 0: one verse, very large text. Band 3+: verse + 2-sentence connection. AI reads aloud as card appears. |
| 6 | **PortraitCard** | `show_figure(name, image_url, quote)` | Historical figure card. Name, title, dates, image, quote or summary. AI introduces figure as card appears. |
| 7 | **DefinitionCard** | `show_definition(term, definition, scripture)` | Band 2: plain-language definition. Band 3+: full definition + scripture reference + Hebrew/Greek original where applicable. |
| 8 | **RouteAnimation** | `animate_route(path_id)` | SVG path animation showing migration/trade routes on the map. Triggered by cue timing. |
| 9 | **ComparisonView** | `show_comparison(biblical, conventional)` | Band 4–5 only. Side-by-side YEC vs conventional chronology. The theological differentiator for the academic market. |

---

## 6. Architecture Decisions (Locked)

These are final. Do not revisit.

1. **Map PNGs stay.** SVG overlay is added on top, not a replacement. The existing PNG maps are beautiful and took real work. Keep them as the base layer.
2. **Pre-generated lesson scripts are the architecture. Live AI is the dialogue layer only.** Phase 1 (teaching) is always a pre-generated JSON script playing pre-rendered audio and pre-built canvas components. Perfect sync, works offline, consistent every time. Live Gemini activates only when the child asks a question.
3. **9 reusable visual components, built once.** Every subsequent chapter uses the same components with different data. No new component work after Phase 1 unless a new visual type appears in a later chapter.
4. **StorybookPlayer is a separate component from day one.** Not a mode switch on the lesson player. Different interaction paradigm entirely.
5. **Chapter 1 launches before Chapter 2 is touched.** Chapter 1 across all 6 bands is a sellable product.
6. **Image generation uses existing Gemini/nanobanana workflow, systematized.** No new pipeline needed. Same workflow, consistent prompt format, naming convention, checklist.
7. **The lesson player is ONE screen with 3 phases — Teaching → Dialogue → Review.** ExamView is NOT a separate page. The canvas stays visible throughout. During review, the AI shows visuals for each question. The child never leaves the lesson to take a test.
8. **ParentReviewModal is removed as a blocking gate.** Replaced by a passive post-lesson summary. Next lesson auto-unlocks. Parent authority is expressed in curriculum choice and band setting, not in clicking approve after every lesson.
9. **ReadingView is removed entirely.** The AI reads and teaches. The lesson player IS the reading. A separate static text page is a symptom of an architecture where the AI was not actually teaching.
10. **LessonView 3-step wrapper is removed.** The Prepare → Session → Witness wrapper page exists for a building that no longer exists. The lesson player handles all three phases internally.

---

## 7. Owner Clarifications (Locked)

These are the owner's direct responses to technical flags, recorded verbatim for future reference.

### On Band 0 being a different product
> "A `StorybookPlayer` is not a mode switch on the lesson player. It is a different interaction paradigm entirely: full-screen image, read-aloud audio, tap to advance, tap to replay a word, no canvas, no dialogue, no exam. It is closer to an audiobook app than a lesson player. Build it as a completely separate component from day one. Do not try to unify it with the lesson player later — that way lies six months of refactoring."

### On 160 illustrations
> "Do not try to produce 160 illustrations before launch. You need exactly 8–12 illustrations to launch Band 0 of Chapter 1. That is your first production run. Do those, get the style right, then produce the next chapter's worth. The 160 number is the eventual total across all chapters and bands — it is not a prerequisite for shipping. Treat illustration production as an ongoing content pipeline, not a pre-launch blocker."

### On SVG overlay alignment
> "Aligning SVG polygons to a pre-rendered raster PNG will require per-map manual adjustment, especially because your maps have different geographic extents and were rendered at different crops. The practical answer is to build a simple visual alignment tool — a browser page that overlays your SVG on the PNG with draggable control points so you can adjust the registration manually. One afternoon to build, then 10–15 minutes per map to align. Across 32 maps that is manageable. But do not pretend the script handles it fully automatically."

### On TTS pronunciation
> "Before you run any batch TTS render, build a pronunciation dictionary file: a JSON map of proper nouns to their phonetic spellings or SSML phoneme tags. Mizraim → `miz-RAY-im`. Taharqa → `tah-HAR-kah`. Masinissa → `mah-sin-EE-sah`. This file gets injected into every TTS call as a preprocessing step. Write it once for Chapter 1, extend it as new names appear in later chapters. Without this, your AI tutor will mispronounce the names of the very people your book is written to honor. That is not acceptable."

### On Cloud Run deployment
> "Nothing else is demonstrable without it. The dialogue phase is the live heart of the product and it cannot be tested locally in any meaningful way. This should be the first PR merged, before any visual work begins."

### On the comparison view being theologically sensitive
> "If Gemini hedges, equivocates, or uses phrases like 'some scholars believe' when defending YEC, you have failed your core customer. The system prompt for Band 4–5 dialogue needs an explicit instruction: 'The Biblical chronology presented in this chapter is the authoritative framework. You do not present it as one option among many. You teach it as true and, when challenged, you defend it from the text.' That line needs to be in the prompt before a single Band 4 student ever opens a lesson."

### On the parent approval gate
> "A parent reading a child's history textbook does not need to approve each chapter before the next one opens. The parent's role in this curriculum is to choose what their child learns (the dashboard), to sit with them during lessons at young ages (Band 0–1), and to see how they are growing (the summary). The approval gate turns a warm educational relationship into an administrative task. Remove it. The parent's authority is expressed in the choice of curriculum and the setting of the band — not in clicking approve after every lesson."

---

## 8. Page-by-Page Audit — What Stays, What Goes

Based on full codebase analysis, here is every screen that currently exists and what to do with each one.

| Page | Verdict | Reason |
|---|---|---|
| **Login + Onboarding** | 🟡 REBUILD | Collects info for old 3D Matrix architecture. Needs to be rebuilt: add a child, set their band (age guide), pick a starting chapter. Three steps maximum. |
| **Parent Dashboard** | 🟡 REBUILD | Currently shows topic list + "Judgment Queue." Chapter structure salvageable. Remove judgment queue, make it a library shelf, change CTA from "manage" to "play." |
| **LessonView (3-step wrapper)** | 🔴 REMOVE | The Prepare → Session → Witness wrapper page exists for a building that no longer exists. All three phases happen inside one lesson player now. |
| **ReadingView (static text)** | 🔴 REMOVE | Existed because AI wasn't teaching. In new architecture, the AI reads and teaches. The lesson player IS the reading. |
| **NarratedLessonView** | 🟡 REBUILD FROM SCRATCH | Concept correct (canvas + AI voice), execution is a mock. setTimeout sequences → script player. Canvas must be full-screen dominant (70–75% viewport). Becomes the new Lesson Player. |
| **ExamView** | 🔴 INTEGRATE INTO PLAYER | Standalone page with pulsing microphone. Wrong: review phase happens inside the lesson player at the end. Canvas stays visible, shows visuals per question. Microphone activates in-place. |
| **ParentReviewModal** | 🔴 REMOVE AS GATE | Blocks next lesson until parent approves. Replace with passive summary notification. Next lesson auto-unlocks. |
| **LearnerDashboard** | 🔴 REMOVE (redirect) | Currently just redirects. For Bands 3–5 a child-facing dashboard makes sense eventually. Not a priority for launch. |
| **Storybook Player** | 🟢 NEW | Does not exist. Full-screen illustration, read-aloud audio, tap to advance. Completely different interaction model. Most important new screen for youngest children. |
| **Post-lesson Summary** | 🟢 NEW | Replaces blocking review modal. Shows: what was taught, 3 oral review responses, AI observations, "start next lesson" prompt. Informs rather than gates. |

---

## 9. Navigation Flow — Before & After

### Current Journey: 10 states, 2 blocking gates
```
Login → Dashboard → Select topic → LessonView wrapper → ReadingView → NarratedLesson (mocked) → ExamView → AI draft generated → Parent approval required → Lesson unlocks
```
**Problems:** ReadingView blocks before lesson. ParentReviewModal blocks after. Child cannot learn without parent present at both start AND end.

### New Journey for Bands 2–5: 4 states, 0 blocking gates
```
Login → Dashboard (tap chapter) → Lesson plays (Teaching → Dialogue → Review) → Parent notified (passive)
```
Parent starts the lesson, child learns, parent gets a summary. The entire lesson — teaching, dialogue, review — happens inside one screen.

### New Journey for Band 0: 2 states
```
Login → Dashboard → Storybook plays (parent reads alongside)
```
For a 4-year-old: parent opens the app, taps the chapter, the story plays. That is the entire experience.

---

## 10. Screen Specifications

### Screen 1 — Parent Dashboard (Library Shelf)

**Metaphor:** A home library shelf — calm, rich, purposeful. Not a progress tracker or management dashboard.

**Layout:**
- **Header:** Child's name + band badge (e.g. "Arie · Band 3 · age 10") + band change link
- **Summary line:** "9 chapters · 2 complete · last session 2 days ago"
- **Chapter list:** Vertical list of chapter cards, not a grid

**Per-chapter card:**
- Chapter number (active = green, completed = green, not started = muted)
- Chapter title
- Last session metadata: "Complete · last session Mar 14 · 'Strong recall of Ham's sons'"
- Progress bar (per chapter, not per session)
- CTA: "Continue →" (in progress), "Start →" (not started), "Review →" (complete)

**Key rules:**
- No judgment queue — replaced by inline last-session summaries
- One clear CTA per chapter
- The parent is a curator choosing what the child learns next, not a manager approving tasks

### Screen 2 — Lesson Player (Bands 2–5)

**The single most important screen in the product.** This is where learning happens.

**Layout (full-screen, immersive, excluded from AppShell):**
- **Top bar (minimal):** Chapter · Section indicator | Phase badge (Teaching / Dialogue / Review) | Child name · Band | Exit button
- **Canvas area (70–75% of viewport):** Map PNG + SVG overlay + visual components rendered by script cues. This is the dominant element.
- **Transcript bar (bottom):** Shows current narration text synced with audio. Stays visible in all phases.
- **Controls bar (bottom):** Play/pause | Progress bar with time | "Ask a question" button (Bands 2–3) | Speed controls (Bands 4–5)

**Three phases, one screen:**

**Phase 1 — Teaching:**
- Script player drives canvas + audio in perfect sync
- Map highlights regions as narration mentions them
- Visual components (genealogy, timeline, scripture cards, etc.) animate in/out per cue timing
- Phase badge shows "Teaching" in green
- Child can interrupt with "Ask a question" button → enters Dialogue phase, then returns

**Phase 2 — Dialogue:**
- Activates when child taps "Ask a question" OR when teaching script completes
- Canvas dims slightly but stays visible — map regions still highlighted for context
- Child's question appears in a speech bubble overlay on the canvas
- AI responds via live Gemini, transcript bar changes color (purple) to distinguish from scripted narration
- "Back to lesson" button returns to Teaching phase (if mid-lesson) or advances to Review (if post-lesson)
- Phase badge shows "Dialogue" in purple

**Phase 3 — Review (in-canvas, NOT a separate page):**
- AI asks 3 oral review questions (Band 3) or thesis-level prompts (Band 4–5)
- For EACH question, the canvas shows a relevant visual: portrait of Narmer while asking "Who united Upper and Lower Egypt?"
- Microphone activates in-place on the canvas
- Phase badge shows "Review" in amber
- After review, post-lesson summary auto-generates → parent notified passively → next lesson auto-unlocks

**Critical:** The canvas NEVER disappears. The child never goes from a rich visual lesson to a grey screen with a microphone dot. Visual + question are one thing.

### Screen 3 — Storybook Player (Band 0–1)

**A completely different product sharing a codebase.** Excluded from AppShell.

**Layout (full-screen, dark background):**
- **Illustration area (fills viewport):** Full-screen scene illustration. Semi-realistic, warm palette, African figures. The image IS the experience.
- **Highlighted word overlay:** Current key word appears large (28–32px) over the illustration with "tap to hear again" prompt. Gold/amber color.
- **Caption bar (bottom):** 1–2 sentences of narration text. Key words highlighted in gold. Large, readable font.
- **Navigation bar (bottom):** Back arrow | Progress dots (child can see "3 more pages") | "tap anywhere to continue →"

**Interaction model:**
- AI reads aloud slowly, warmly — child just listens
- Key words appear large on screen as they are spoken
- Tap anywhere to advance to next scene
- Tap a highlighted word to hear it again in isolation
- No exam, no oral review, no grade — just the story
- Parent mode: subtle "reading along" text visible for parent to follow

**Band 1 additions:** Slightly more detail, 10–15 scenes. "What do you think happens next?" prompts. 3 simple picture-based review questions at end (AI shows image, child says the name).

### Screen 4 — Post-Lesson Summary (replaces ParentReviewModal)

**Passive, not blocking. Informs, not gates.**

**Shows:**
- What was taught (chapter, section, key topics covered)
- 3 oral review responses (what the child said, what the AI observed)
- 2–3 specific things the AI noted about the child's understanding
- "Start next lesson" prompt

**Parent actions (optional, non-blocking):**
- Add a note: "We discussed this at dinner — she understood it well"
- Flag a section for review: "Revisit the Curse of Ham section"
- Neither action blocks the next lesson

**Feels like:** A teacher's note sent home with a child. Not a permission request.

---

## 11. Band-Aware UI Adaptation

The band is not just a content setting. It changes the entire visual language of the app. This table is the specification.

| UI Element | Band 0 | Band 1–2 | Band 3 | Band 4–5 |
|---|---|---|---|---|
| **Player type** | Storybook player | Storybook (Band 1) / Lesson player (Band 2) | Lesson player | Lesson player |
| **Typography** | Very large (28–32px), 1 sentence visible at a time | Large (18–22px), short paragraphs | Normal (14–16px), full transcript | Normal with dense annotation mode available |
| **Canvas complexity** | No canvas — full-screen illustration only | Simplified map + scene images only | Full map + all components | Full canvas + comparison mode + cross-chapter reference |
| **Dialogue trigger** | None — no dialogue | Large "Ask" button, visible always | "Ask a question" in controls bar | Interrupt freely — no button needed |
| **Review / exam** | None | Picture-based: AI shows image, child says the name | 3 oral questions with visual prompt | Thesis-level oral argument or essay prompt |
| **Controls** | Tap anywhere to advance. That is all. | Tap to advance, replay button, Ask button | Play/pause, progress bar, Ask button, exit | All controls + chapter reference panel |

---

## 12. Phase 3.1 — Cloud Run Deployment

**Priority:** FIRST — unblocks everything.
**Effort:** 1–2 days (configuration, not development)
**Status:** NOT STARTED

### Tasks
- [ ] Fix `server.ts` signature mismatch: `historyExplainerSession` called with 4 args, needs 5 (missing `band` param)
- [ ] Update `cloudbuild.yaml` to inject `GEMINI_API_KEY` via GCP Secret Manager (`--set-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest`)
- [ ] Create the `GEMINI_API_KEY` secret in GCP Secret Manager (manual, owner action)
- [ ] Deploy to Cloud Run and verify the agent starts and accepts WebSocket connections
- [ ] Test a basic Gemini Live dialogue session end-to-end from the deployed URL

### Prerequisite Owner Actions
- Create GCP Secret Manager secret: `GEMINI_API_KEY`
- Confirm Cloud Run service account has `secretmanager.secretAccessor` role

---

## 13. Phase 3.2 — Dual Player Architecture

**Priority:** SECOND — core engine for all content playback.
**Effort:** ~1 week
**Status:** NOT STARTED
**Dependency:** None (can be built with dummy data before Cloud Run is live)

### Lesson Script JSON Schema

The entire narration engine is driven by a structured JSON file per lesson. This is the data contract between the script generator and the player.

```
LessonScript {
  version: "1.0"
  chapterId: string          // e.g. "ch01"
  band: number               // 0–5
  title: string
  estimatedDurationMs: number
  pronunciationOverrides: Record<string, string>  // local overrides merged with global dict
  cues: Cue[]
}

Cue {
  id: string                 // e.g. "ch01_b3_cue_001"
  timestampMs: number        // when this cue fires
  durationMs: number         // how long this cue is active
  action: "speak" | "show_component" | "hide_component" | "pan_map" | "animate_route" | "pause_for_response"
  params: SpeakParams | ShowComponentParams | PanMapParams | AnimateRouteParams | PauseParams
}

SpeakParams {
  text: string               // narration text (also used for subtitle display)
  audioFileId: string        // maps to R2 path: assets/audio/{audioFileId}.mp3
  ssml?: string              // optional SSML override for TTS rendering
}

ShowComponentParams {
  componentType: "map" | "scene_image" | "genealogy_tree" | "dual_timeline" | "scripture_card" | "portrait_card" | "definition_card" | "comparison_view"
  componentId: string        // unique ID for this instance
  data: Record<string, any>  // component-specific props
  transition: "fade" | "slide_up" | "none"
}

PanMapParams {
  targetRegion: string       // region ID from map JSON
  zoomLevel: number
  durationMs: number
}

AnimateRouteParams {
  routeId: string            // path ID from SVG overlay
  durationMs: number
  style: "dotted" | "solid" | "arrow"
}

PauseParams {
  promptText: string         // what the AI says to prompt the child
  maxWaitMs: number          // how long to wait before auto-advancing
  expectedResponseType: "voice" | "tap" | "any"
}
```

### ScriptPlayer (Bands 1–5)
- [ ] `useScriptPlayer` hook: takes a `LessonScript`, runs a RAF loop, fires cues at `timestampMs`
- [ ] Controls: play, pause, seek, replay section
- [ ] Audio playback: loads pre-rendered MP3 by `audioFileId`, plays in sync with cue timing
- [ ] Component dispatch: when a `show_component` cue fires, renders the appropriate visual component with its data
- [ ] Subtitle display: shows `SpeakParams.text` synced with audio
- [ ] Dialogue handoff: when lesson script completes, transitions to live Gemini dialogue phase
- [ ] Write a dummy `lesson_ch01_band3.json` by hand to develop against (does not need real content)

### StorybookPlayer (Band 0)
- [ ] Completely separate component — not a mode of ScriptPlayer
- [ ] Full-screen scene image fills viewport
- [ ] Audio plays automatically (slow, warm TTS)
- [ ] Tap anywhere to advance to next scene
- [ ] Tap-and-hold on a word to replay that word's audio
- [ ] "Read Along" mode: highlights words as audio plays
- [ ] Parent overlay: shows the full text for parent to read aloud if preferred
- [ ] No canvas, no dialogue, no exam, no timeline, no genealogy
- [ ] Simple progress indicator (dots or page numbers)
- [ ] Takes a `StorybookScript` (simplified version of `LessonScript` with only `speak` + `show_scene_image` cues)

---

## 14. Phase 3.3 — SVG Alignment Tool

**Priority:** THIRD — required before any map works in the player.
**Effort:** 1 day to build, then 10–15 minutes per map to align.
**Status:** NOT STARTED

### Tasks
- [ ] Build a browser-based alignment tool (standalone page, not part of main app)
- [ ] Tool loads a map PNG as background
- [ ] Tool loads the corresponding SVG overlay on top
- [ ] Draggable control points to adjust SVG registration (translate, scale, rotate)
- [ ] "Export" button saves the transform matrix as JSON (stored alongside the SVG)
- [ ] Align `map_001` as the first test case
- [ ] Verify all 4 regions (Mizraim, Cush, Phut, Canaan) highlight correctly over the PNG
- [ ] Document the alignment workflow for future maps

### Output Format
```
MapAlignment {
  mapId: string           // e.g. "map_001"
  pngPath: string         // R2 path to base PNG
  svgPath: string         // R2 path to overlay SVG
  transform: {
    translateX: number
    translateY: number
    scaleX: number
    scaleY: number
    rotate: number        // degrees
  }
  alignedBy: string       // who aligned it
  alignedAt: string       // ISO date
}
```

---

## 15. Phase 3.4 — 9 Visual Component Shells

**Priority:** FOURTH — after players and alignment tool exist.
**Effort:** ~1 week
**Status:** NOT STARTED

### Components to Build

Each component accepts a data prop and renders. All must be band-aware (accept a `band` prop that controls rendering complexity).

| # | Component | File | Key Props |
|---|---|---|---|
| 1 | MapOverlay | `src/components/visuals/MapOverlay.tsx` | `pngUrl, svgUrl, transform, highlights[], activeRegion, band` |
| 2 | SceneImage | `src/components/visuals/SceneImage.tsx` | `imageUrl, altText, caption` |
| 3 | GenealogyTree | `src/components/visuals/GenealogyTree.tsx` | `treeData, revealUpTo, band` |
| 4 | DualTimeline | `src/components/visuals/DualTimeline.tsx` | `events[], mode: "biblical" | "dual" | "historiography", activeEventId, band` |
| 5 | ScriptureCard | `src/components/visuals/ScriptureCard.tsx` | `reference, text, connection?, band` |
| 6 | PortraitCard | `src/components/visuals/PortraitCard.tsx` | `name, title, dates, imageUrl, quote` |
| 7 | DefinitionCard | `src/components/visuals/DefinitionCard.tsx` | `term, definition, scripture?, originalLanguage?, band` |
| 8 | RouteAnimation | `src/components/visuals/RouteAnimation.tsx` | `svgPathId, style, durationMs, isPlaying` |
| 9 | ComparisonView | `src/components/visuals/ComparisonView.tsx` | `biblicalData, conventionalData, activeHighlight` |

### Rules
- All styling via Tailwind semantic tokens from the design system
- All components use `framer-motion` for enter/exit animations
- All components render gracefully with missing/partial data (progressive enhancement)
- No component fetches its own data — all data comes via props from the player
- Each component has a Storybook-style demo page for isolated testing (optional, nice-to-have)

---

## 16. Phase 3.5 — Lesson Script Generator

**Priority:** FIFTH — after player can consume scripts.
**Effort:** ~3 days
**Status:** NOT STARTED

### Tasks
- [ ] Build a Node script that takes chapter markdown + band number → outputs `LessonScript` JSON
- [ ] Script uses Claude API to extract cues, component data, and narration text from chapter content
- [ ] Script applies band-specific rules (vocabulary level, component inclusion/exclusion, voice style)
- [ ] Script injects pronunciation overrides from the global dictionary
- [ ] Generate `lesson_ch01_band3.json` as the first real script
- [ ] Review and approve the generated script for theological accuracy and cue timing

### Band-Specific Generation Rules
- **Band 0:** Only `speak` + `show_scene_image` cues. No components except ScriptureCard (one verse, large).
- **Band 1:** `speak` + `show_scene_image` + simplified GenealogyTree + ScriptureCard. 3 review questions at end.
- **Band 2:** Full chapter structure. All components except ComparisonView. Single-row timeline (biblical only).
- **Band 3:** Full components. Dual timeline. Full genealogy. All figures and definitions.
- **Band 4:** All Band 3 + ComparisonView. System prompt adds secular objection handling.
- **Band 5:** All Band 4 + historiography notes. AI reads verbatim from text where appropriate.

---

## 17. Phase 3.6 — Chapter 1 Band 3 End-to-End

**Priority:** THE MILESTONE — "the moment you have something real."
**Effort:** ~2 weeks total (including all prior phases)
**Status:** NOT STARTED

### Definition of Done
A parent logs in, selects Chapter 1 Band 3. The lesson plays:
- AI voice narrates from pre-rendered audio
- Map highlights regions as the narration mentions them
- Scripture cards appear at the right moments
- Genealogy tree reveals nodes as ancestors are named
- Dual timeline shows events as they're discussed
- Definition cards pop for key terms
- After the scripted lesson ends, live Gemini dialogue activates
- Student can ask questions and the AI responds from chapter content
- Parent sees progress recorded

### Tasks
- [ ] Generate `lesson_ch01_band3.json` with real Chapter 1 content
- [ ] Build SVG overlay for `map_001` (run conversion + align with tool)
- [ ] Choose Band 3 TTS voice (ElevenLabs recommended: academic but warm)
- [ ] Batch render TTS audio for all Band 3 cues → store in R2
- [ ] Extract component data from `chapter_01.md`: genealogy, timeline events, scripture refs, figures, key terms → structured JSON
- [ ] Seed component data to D1
- [ ] Wire ScriptPlayer to load `lesson_ch01_band3.json` and play through
- [ ] Wire dialogue handoff to Cloud Run Gemini session
- [ ] Test end-to-end: lesson plays → dialogue works → progress saves

---

## 18. Phase 3.7 — Chapter 1 Bands 4–5 (Premium)

**Effort:** ~1 week
**Status:** NOT STARTED
**Dependency:** Phase 3.6 complete

### Tasks
- [ ] Generate `lesson_ch01_band4.json` and `lesson_ch01_band5.json`
- [ ] Build ComparisonView component with real Chapter 1 chronology data
- [ ] Write the Band 4–5 Gemini system prompt with explicit theological guardrail (see Section 20)
- [ ] Build debate/dialogue mode: AI introduces secular objections and refutes from scripture and evidence
- [ ] Test: Band 4 student challenges YEC → AI holds the biblical position under pressure
- [ ] Band 5: AI reads verbatim passages, Socratic questioning, essay prompts

---

## 19. Phase 3.8 — Chapter 1 Bands 1–2 (Storybook Layer)

**Effort:** ~3 weeks (includes illustration production)
**Status:** NOT STARTED
**Dependency:** Phase 3.6 complete

### Tasks
- [ ] Generate Band 1 storybook rewrite of Chapter 1 (Claude API + Band 1 prompt from verdict doc)
- [ ] Generate Band 2 adapted text of Chapter 1 (Claude API + Band 2 prompt)
- [ ] Owner reviews both for theological accuracy and narrative continuity
- [ ] Write scene description prompts for ~10 Band 1 illustrations using master style brief
- [ ] Generate illustrations via Gemini/nanobanana → review → approve → store in R2
- [ ] Build simplified SVG overlay for Band 2 (same `map_001` PNG, only Mizraim/Cush/Phut regions)
- [ ] Generate `lesson_ch01_band1.json` and `lesson_ch01_band2.json`
- [ ] Choose Band 1 TTS voice (storytelling, warm, slower) and Band 2 voice (clear narrator)
- [ ] Batch render TTS audio for Band 1 and Band 2
- [ ] Test both bands end-to-end

---

## 20. Phase 3.9 — Chapter 1 Band 0 (Picture Book)

**Effort:** ~2 weeks
**Status:** NOT STARTED
**Dependency:** StorybookPlayer built in Phase 3.2

### Tasks
- [ ] Generate Band 0 storybook rewrite of Chapter 1 (8–12 scenes, max 3 sentences each, read-aloud rhythm)
- [ ] Owner reviews for theological accuracy — "this is the most important review, Band 0 shapes the first impression"
- [ ] Generate simplified map for Band 0 (Africa outline, 3 soft regions, no labels, warm painterly style)
- [ ] Write scene prompts for 8–12 illustrations using master style brief + Band 0 template
- [ ] Generate illustrations → review → approve → store in R2
- [ ] Generate `lesson_ch01_band0.json` (StorybookScript format)
- [ ] Choose Band 0 TTS voice (slow, warm, musical — "Mizraim. Can you say Mizraim?")
- [ ] Batch render TTS audio
- [ ] Wire StorybookPlayer to load Band 0 script and play through
- [ ] Test: parent taps through all scenes, audio plays, images display

---

## 21. Phase 3.10 — UI Redesign

**Effort:** ~1 week
**Status:** NOT STARTED
**Can be done in parallel with any phase after 3.2**
**Reference:** Sections 8–11 of this document (Page Audit, Nav Flow, Screen Specs, Band-Aware UI)

### Guiding Principles
- The canvas is the product (Principle 01)
- One tap to learning (Principle 02)
- Parents observe, not gatekeep (Principle 04)
- The curriculum is a library (Principle 05)

### Tasks

#### Demolition
- [ ] Remove `ReadingView` page and all routes pointing to it
- [ ] Remove `LessonView` 3-step wrapper (Prepare → Session → Witness)
- [ ] Remove `ExamView` as a standalone page — its functionality moves into the lesson player's Review phase
- [ ] Remove `ParentReviewModal` as a blocking gate — replace with passive `PostLessonSummary`
- [ ] Remove `LearnerDashboard` redirect page
- [ ] Remove Judgment Queue component from Parent Dashboard
- [ ] Remove all 3D Matrix references (Domain, Capacity, Repetition Arc) from UI

#### Build — Parent Dashboard (Library Shelf)
- [ ] Rebuild Parent Dashboard per Screen 1 spec (Section 10)
- [ ] Child name + band badge in header
- [ ] Chapter cards as vertical list with progress bars, last-session metadata, single CTA per chapter
- [ ] "Recent sessions" drawer replaces judgment queue
- [ ] Dashboard routes to correct player based on band: StorybookPlayer (Band 0–1) or LessonPlayer (Band 2–5)

#### Build — Lesson Player (Bands 2–5)
- [ ] Rebuild NarratedLessonView as unified Lesson Player per Screen 2 spec (Section 10)
- [ ] Canvas dominates at 70–75% viewport
- [ ] Phase indicator: Teaching (green) → Dialogue (purple) → Review (amber)
- [ ] Transcript bar stays visible in all 3 phases
- [ ] Dialogue activates in-place — canvas dims, stays visible, microphone appears on canvas
- [ ] Review questions shown with in-canvas visuals per question — canvas never disappears
- [ ] Excluded from AppShell (immersive full-screen)

#### Build — Storybook Player (Band 0–1)
- [ ] Already scoped in Phase 3.2 — ensure it matches Screen 3 spec (Section 10)
- [ ] Dark background, full-screen illustration, highlighted word overlay, caption bar, progress dots
- [ ] Excluded from AppShell (immersive full-screen)

#### Build — Post-Lesson Summary
- [ ] Build `PostLessonSummary` page per Screen 4 spec (Section 10)
- [ ] Shows: what was taught, oral review responses, AI observations
- [ ] Parent can add note or flag section — neither action blocks next lesson
- [ ] Next lesson auto-unlocks upon completion

#### Onboarding Rebuild
- [ ] Simplify onboarding to 3 steps: add child → set band (with age guide) → pick starting chapter
- [ ] Remove all 3D Matrix / old architecture fields

---

## 22. Content Production Workflow

Every piece of content follows one of three workflows:

### Workflow A — AI Drafts, Owner Reviews
| Asset | Tool | Output |
|---|---|---|
| Band 0 storybook rewrite | Claude API + chapter text + Band 0 prompt | 8–12 scene scripts as JSON |
| Band 1–2 storybook rewrites | Claude API + chapter text + Band 1/2 prompt | Adapted chapter markdown |
| Lesson scripts (all bands) | Claude API + chapter text + band prompt | `lesson_chXX_bandY.json` |
| Component data extraction | Claude API extraction prompt | Structured JSON per component type |

### Workflow B — Script Auto-Generates, Owner Spot-Checks
| Asset | Tool | Output |
|---|---|---|
| SVG map overlays | Node conversion script | `.svg` per map |
| TTS audio | Google TTS / ElevenLabs batch render | One `.mp3` per cue ID |

### Workflow C — Owner Produces
| Asset | Tool | Output |
|---|---|---|
| Scene illustrations | Gemini/nanobanana + master style brief | PNG per scene → R2 |
| Simplified Band 0 maps | Gemini/nanobanana + simplified spec | PNG per map → R2 |
| Image prompt writing | Manual | Text prompts per scene |

---

## 18. Image Generation System

### Master Style Brief (paste at start of every image prompt)
```
STYLE: Semi-realistic illustration. Warm, painterly quality. Not photographic, not cartoon.
PALETTE: Rich earth tones — ochres, warm browns, deep greens, terracotta. Mediterranean blues for water.
FIGURES: African people with dignity and strength. Clothing appropriate to ancient Near East / North Africa.
MOOD: Reverent, epic, grounded. This is sacred history, not fantasy.
AVOID: Cartoonish proportions, modern clothing, European features on African figures, anachronistic objects.
FORMAT: Landscape 16:9 for scene illustrations. Square 1:1 for portrait figures. No text overlaid on image.
```

### Scene Illustration Prompt Template
```
[MASTER STYLE BRIEF]
SCENE: Chapter X, Scene Y — [description]
DESCRIPTION: [2–3 sentences describing the visual]
BAND: [0–1 for storybook, 2+ for adapted]
THEOLOGY: [what theological truth this image should convey]
```

### Simplified Map Prompt Template (Band 0)
```
[MASTER STYLE BRIEF]
MAP TYPE: Children's illustrated geography. Semi-realistic, painterly.
REGION: [geographic scope]
SHOW ONLY: [2–3 landmasses, soft colors, minimal labels]
NO: Grid lines, scale bars, legend boxes, small city markers, political borders
FEEL: Warm, inviting, like a map in a children's storybook Bible.
```

### Naming Convention
- Scene illustrations: `assets/illustrations/ch{XX}/band{Y}/scene_{ZZ}.png`
- Maps (Band 0): `assets/maps/band0/map_{XXX}.png`
- Maps (Band 2–5 SVG): `assets/maps/overlays/map_{XXX}_overlay.svg`
- Portraits: `assets/figures/{name_slug}.png`
- Audio: `assets/audio/{cue_id}.mp3`

---

## 19. Pronunciation Dictionary

A JSON map of proper nouns → phonetic spellings / SSML phoneme tags. Injected into every TTS call as preprocessing.

### Chapter 1 Dictionary (extend per chapter)
```json
{
  "Mizraim": "miz-RAY-im",
  "Taharqa": "tah-HAR-kah",
  "Masinissa": "mah-sin-EE-sah",
  "Cush": "KOOSH",
  "Phut": "FOOT",
  "Canaan": "KAY-nun",
  "Nimrod": "NIM-rod",
  "Shinar": "SHY-nar",
  "Babel": "BAY-bul",
  "Narmer": "NAR-mer",
  "Kemet": "KEM-et"
}
```

### Rules
- Write once for Chapter 1, extend as new names appear in later chapters
- Global dictionary file: `src/data/pronunciation.json`
- Lesson scripts can include `pronunciationOverrides` for chapter-specific additions
- TTS rendering script merges global + local before generating audio

---

## 20. Theological Guardrails

### Band 3 System Prompt Addition
```
You are teaching from a Biblical African history textbook. The textbook uses the biblical 
chronology as its primary framework. Present this chronology as the framework of the lesson. 
When conventional dates are mentioned, they are labeled as "(conventional estimate)" and 
presented alongside the biblical framework for comparison, not as corrections.
```

### Band 4–5 System Prompt Addition (CRITICAL)
```
The Biblical chronology presented in this chapter is the authoritative framework. You do not 
present it as one option among many. You teach it as true and, when challenged, you defend it 
from the text. When secular objections arise, you acknowledge them respectfully, then explain 
why the biblical framework is maintained in this curriculum, using evidence from scripture and 
from the historical record as presented in the chapter. You never hedge with phrases like 
"some scholars believe" when presenting the biblical position — you present it with conviction 
while remaining academically rigorous.
```

### Non-Negotiable Rules for All Bands
1. Never remove or downplay scripture references
2. Never present the Curse of Ham as legitimate theology — always critique it
3. Band 0 storybook must use the same names, sequence, and emotional beats as the full text
4. Only vocabulary and length change between bands — never the theology, never the facts
5. Dates from evolutionary model always tagged `(conventional estimate)`
6. Dates from biblical model always tagged `(biblical chronology)`

---

## 21. Chapter Production Checklist (Repeatable Template)

After Chapter 1 is complete, every subsequent chapter follows this exact checklist:

### Content Authoring (Owner Work)
- [ ] Review AI-drafted Band 0 storybook rewrite (8–12 scenes)
- [ ] Review AI-drafted Band 1 storybook rewrite (10–15 scenes)
- [ ] Review AI-drafted Band 2 adapted text
- [ ] Write image generation prompts for Band 0 scenes (~8 prompts)
- [ ] Write image prompts for Band 1 scenes (~10 prompts)
- [ ] Write simplified map spec for Band 0 (stripped from JSON)
- [ ] Approve all generated illustrations and maps
- [ ] Review all 6 lesson scripts for theological accuracy
- [ ] Spot-check TTS audio for 2–3 cues per band

### Technical Production (Agents + Scripts)
- [ ] Run SVG overlay builder on all chapter maps (full version)
- [ ] Run SVG overlay builder on all chapter maps (Band 2 simplified)
- [ ] Generate `lesson_chXX_band0.json` through `band5.json` (6 scripts)
- [ ] Batch render TTS audio for all 6 lesson scripts
- [ ] Extract component data (genealogy, timeline, definitions, figures)
- [ ] Upload all assets to R2 (images, SVGs, audio, JSON scripts)
- [ ] Run D1 migration to seed lesson records and asset paths
- [ ] End-to-end test: all 6 bands, lesson plays, dialogue works

---

## 22. Launch Strategy

1. **Launch after Chapter 1 is fully complete across all 6 bands.** Do not wait for all 9 chapters.
2. A Christian homeschool family can start their 4-year-old on Band 0, their 10-year-old on Band 3, and their 16-year-old on Band 4, all from Chapter 1 alone.
3. Launch Chapter 1. Charge for it. Build Chapters 2–9 on revenue and feedback.
4. Chapters 2–9 are progressively cheaper to produce — infrastructure is built, components are built, prompts are proven. Each new chapter is a content production sprint, not a development sprint.

---

## 23. Known Risks & Mitigations

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | SVG-to-PNG alignment requires manual adjustment per map | MEDIUM | Build visual alignment tool (Phase 3.3). Budget 10–15 min per map. |
| 2 | TTS mispronounces African/biblical proper nouns | HIGH | Pronunciation dictionary with SSML phoneme tags (Section 19). Build before any batch render. |
| 3 | Gemini hedges on YEC in Band 4–5 dialogue | CRITICAL | Explicit theological guardrail in system prompt (Section 20). Test extensively before launch. |
| 4 | 160 illustrations seem like a pre-launch blocker | LOW | Only 8–12 needed for Chapter 1 Band 0 launch. Treat as ongoing pipeline. |
| 5 | Band 0 StorybookPlayer scope creep into lesson player | MEDIUM | Built as completely separate component from day one. No shared state or UI. |
| 6 | Cloud Run not deployed — blocks all dialogue testing | CRITICAL | Phase 3.1 is literally the first task. Config only, not development. |
| 7 | Illustration style inconsistency across 160+ images | MEDIUM | Master style brief locked before first production run. Refine on first 5 images, then freeze. |
| 8 | `server.ts` has a signature mismatch bug | HIGH | Fix in Phase 3.1 before deploy. `historyExplainerSession` needs `band` param. |

---

*This document is the single source of truth for Phase 3. No implementation begins without referencing this roadmap. Update this document as decisions change.*
