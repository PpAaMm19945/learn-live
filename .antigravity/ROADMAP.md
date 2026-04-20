# Learn Live — Master Roadmap

> **Last updated:** 2026-04-20
> **Single source of truth** for engineering direction, architecture decisions, and phase tracking.
> **Previous roadmap archived:** `.antigravity/archive/roadmap-live-agent-approach.md`

---

## ⭐ Active Direction (2026-04-20): The Sandwich Model

The platform is pivoting from "advanced multimedia presenter" to "true pedagogical instrument" by wrapping the existing rigid `BeatSequencer` ("Performer") with two short, conversational Gemini Live agents:

- **Gatekeeper (pre-lesson)** — readiness check, prior-assignment review, primes the day's objectives. Speaks first with initiative. Hands off via `begin_lesson` signal.
- **Performer (lesson body)** — the existing `BeatSequencer` pipeline. Untouched in Phase 1.
- **Negotiator (post-lesson)** — synthesis check, dynamic homework negotiation, warm closure. Triggered automatically on `lesson_complete`.

**Scope:** Bands 2–5 only. Bands 0–1 remain on the pure narrative/Performer model (abstract conversational turns are not developmentally appropriate).

**Reuse:** Both new agents are scoped reuses of `agent/src/liveHandler.ts` (`LiveQAHandler`) — new system prompts and lifecycle triggers, not a new agent stack.

### Sandwich Model Phasing

| Phase | Scope | Status |
|---|---|---|
| **0** | Stabilize transcript / pause-play / Band 0–1 visuals | ✅ Complete (Issues #92, #93 resolved) |
| **1A** | Gatekeeper persona + `AWAITING_GATEKEEPER_GREENLIGHT` state in `historySessionController.ts` + new frontend Gatekeeper screen. **No assignments yet.** | ✅ Complete (shipped in Sandwich Lite) |
| **1B** | Negotiator persona + post-lesson synthesis + verbal homework. **No persistence yet.** | ✅ Complete (shipped in Sandwich Lite) |
| **1C** | `learner_assignments` D1 table; Negotiator writes, Gatekeeper reads; parent dashboard surfacing; lesson-start gating with parent override (per `mem://principles/ai-governance`). | ⏳ Queued |
| **1D** | Adaptive scaffolding hooks (`mem://features/adaptive-scaffolding`), debug tooling, telemetry. | ⏳ Queued |

Sandwich Lite (1A+1B) is complete; the immediate active workstream is **Phase 1C assignment persistence**. Audit-fix chronology is captured in the 2026-04-20 handoff prompt used for Phase 1.5 wiring corrections. Full plan of record: `.lovable/plan.md`. Tracking issues: #96 (assignments table), #102–#105 (audit fixes, resolved).

---


---

## Origin Story

Learn Live began as a general-purpose math curriculum platform (DAG-based skill progression, constraint templates, repetition arcs). In March 2026 it pivoted to a **focused African History curriculum** — one 9-chapter university-level textbook, AI-adapted for ages 3–18+ across 6 bands.

The math engine, DAG system, and 2,000+ constraint templates are archived in `src/archive/`, `worker/src/archive/`, and `archive/` (root) — not deleted, available for future reactivation.

---

## Product Vision

**One deeply researched African History source, AI-adapted for any age — from picture books to university prep.**

Parents using established curricula (Saxon, Classical Conversations, etc.) report one gap: African History. Learn Live fills that gap as a standalone, supplementary course.

**Core principle:** A child who learned the storybook version of Mizraim at age 5 should feel a thrill of recognition when they encounter the full academic treatment at age 14. Only vocabulary, length, and image style change. Never the theology. Never the facts.

---

## The Architectural Pivot (April 2026)

### What failed

The previous roadmap (Phases 20–25) assumed the Gemini Live API (`gemini-2.5-flash-native-audio-latest` with `responseModalities: ['AUDIO']`) would handle all lesson narration in a single autonomous session. After implementation and testing, we discovered:

1. **No structured text output.** The audio-native model does not produce text in `modelTurn.parts`. The only text is `outputAudioTranscription` — a speech-to-text transcription of what the model spoke, not structured output suitable for tool calls or clean transcripts.
2. **Unreliable tool calls.** The audio model is designed for conversational ping-pong, not 10–15 minute autonomous narration with interleaved tool calls.
3. **No transcript.** The `**bold**` regex in `gemini.ts` was catching the model's natural emphasis markers in the audio transcription, misclassifying them as "thinking" tokens and stripping spoken content.
4. **Fragile kickoff pattern.** Sending one kickoff message and hoping the model narrates for 15 minutes is fighting the Live API's conversational design.

### What works

The entire frontend is correct and complete:

- `SessionCanvas.tsx` — full-bleed immersive viewport with scene transitions
- `TranscriptView.tsx` — kinetic typography with band-adaptive styling
- `TeachingCanvas.tsx` — MapLibre GL JS map with imperative API
- `toolCallHandler.ts` — routes tool calls to TeachingCanvas + `set_scene`
- `useSession.ts` — WebSocket connection, audio playback (24kHz PCM), microphone capture, reconnection
- `useRecorder.ts` / `useGoldenScript.ts` — golden script recording and playback

All 11 MapLibre teaching tools work. The WebSocket message protocol (`tool_call`, `transcript`, `audio`) is stable. The content manifest has all 9 chapters with sections, key dates, key figures, and Think It Through questions. GeoJSON data (regions, routes, markers) exists for all 9 chapters.

### The new architecture

```
Frontend → WebSocket → Agent (Beat Sequencer)
                         │
                    For each beat:
                         │
                    Gemini Regular API (generateContent, streaming)
                         │ ─── one focused call per beat
                         │
                    Streamed text → transcript messages to client
                    Tool calls   → tool_call messages to client
                    TTS audio    → audio messages to client
                         │
                    Beat complete → next beat
                         
                    When student interrupts (Band 3+):
                         │
                    Gemini Live (short conversation)
                         │
                    Conversation ends → resume beat sequence
```

**Key differences from the old approach:**

| Concern | Old (Gemini Live) | New (Beat Sequencer) |
|---------|-------------------|---------------------|
| Narration | One autonomous Live session | One `generateContent` call per beat |
| Tool calls | Model decides autonomously | Pre-planned per beat + model can add |
| Transcript | Audio transcription (unreliable) | Direct text streaming (reliable) |
| Audio | Native audio model output | TTS from narration text |
| Student Q&A | Same Live session | Separate Live session, opened on demand |
| Pacing | Model controls everything | Sequencer controls pacing, model narrates |
| Failure mode | Entire lesson fails | One beat fails, retry or skip |

---

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite + Tailwind + shadcn/ui | Deployed to Cloudflare Pages |
| Data | Cloudflare D1 (SQLite) | Families, learners, progress, sessions, curriculum |
| Content Storage | Cloudflare R2 | Master text, maps, audio, golden scripts, generated assets |
| AI Narrator | Google Cloud Run (Express) | **Beat Sequencer** — iterates beats, narrates with Gemini 3 Flash, packages text + tool calls + audio per beat |
| AI Conversation | Gemini 3.1 Flash Live API | **On-demand only** — student Q&A when learner raises hand (Band 3+) |
| Speech Synthesis | Gemini TTS | `gemini-2.5-flash-preview-tts` for beat audio, with browser speech fallback if server audio is empty |
| Content Adaptation | Gemini Flash family | Band-specific narration, quiz generation |
| Teaching Canvas | **MapLibre GL JS** | Programmable vector maps with tool calls |
| Session UI | **SessionCanvas + TranscriptView** | Full-bleed kinetic typography + scene overlays |
| Auth | Custom on Workers | Magic link, Google OAuth, email/password, JWT sessions |

---

## Band Model

| Band | Ages | Label | Delivery |
|------|------|-------|----------|
| 0 | 3–5 | Picture Book | StorybookPlayer. Full-screen illustrations, read-aloud, tap to advance. Split-screen layout. |
| 1 | 6–7 | Storybook+ | StorybookPlayer with more detail, simple review questions. Split-screen layout. |
| 2 | 8–9 | Adapted Textbook | SessionCanvas (Beat Sequencer). Larger text, slower pacing, fewer tool calls. Listen-only. |
| 3 | 10–12 | Full Textbook | SessionCanvas (Beat Sequencer). Standard kinetic typography, full tool-call set. Can raise hand for Q&A. |
| 4 | 13–17 | Academic | SessionCanvas (Beat Sequencer). Denser typography, Socratic check-ins. Can raise hand. |
| 5 | 18+ | Seminar | SessionCanvas (Beat Sequencer). Verbatim text, seminar-style, essay prompts. Can raise hand. |

---

## Chapter Content Status

| Ch | Title | Text | GeoJSON | Sections | Beat Schema | Illustrations |
|----|-------|------|---------|----------|-------------|---------------|
| 1 | The Sovereign Hand: A Biblical Foundation | ✅ | ✅ | 5 (1.1–1.5) | ✅ Phase 2 | 23 (Warm Codex) |
| 2 | The Story of Egypt | ✅ | ✅ | 9 | ❌ | ❌ |
| 3 | The Lands of Phut — Carthage, Numidia, Desert Kingdoms | ✅ | ✅ | 5 | ❌ | ❌ |
| 4 | The Lands of Cush | ✅ | ✅ | TBD | ❌ | ❌ |
| 5 | Church in Roman Africa | ✅ | ✅ | TBD | ❌ | ❌ |
| 6 | Aksum & Ethiopian Christianity | ✅ | ✅ | TBD | ❌ | ❌ |
| 7 | Rise of Islam in Africa | ✅ | ✅ | TBD | ❌ | ❌ |
| 8 | Bantu Migrations | ✅ | ✅ | TBD | ❌ | ❌ |
| 9 | Medieval African Kingdoms | ✅ | ✅ | TBD | ❌ | ❌ |

**Section = Lesson.** Each numbered section (1.1, 1.2, etc.) is one lesson of 10–15 minutes. Each lesson has 4–8 teaching beats.

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
| 15 | Session engine: LessonScript types, ScriptPlayer, StorybookPlayer, 9 visual components | Mar 20 |
| 16A | MapLibre TeachingCanvas shell + imperative API + overlay panels | Mar 22 |
| 16B | Historical GeoJSON data for all 9 chapters (regions, routes, markers) + locations registry | Mar 22–24 |
| 16C | Agent tool-call rewrite: MAPLIBRE_TEACHING_TOOLS, session handler, prompt builder | Mar 24 |
| 20 | **Live-First Pivot**: Deleted ScriptPlayer pipeline, created SessionCanvas, added `set_scene` tool | Mar 31 |
| 21 | Wired SessionCanvas to useSession hook, integrated TeachingCanvas, golden script fallback | Apr 1–3 |
| 22 | TranscriptView kinetic typography component | Apr 1 |
| 23 | Agent WebSocket connection fix, structured logging, kickoff/nudge timers | Apr 1–3 |

---

## Current Phase Plan: Beat Sequencer Architecture

### Execution Order

```
Phase 1 (isolation tests)
    ↓
Phase 2 (beat schema) ← human + agent
    ↓
Phase 3 (beat sequencer) ← agent side
    ↓
Phase 4 (live Q&A handler) ← agent side
    ↓
Phase 5 (content pipeline) ← agent + worker
    ↓
Phase 6 (integration + polish) ← full stack
```

All phases are **strictly sequential**. Each phase must be verified working before the next begins. No parallel work.

---

### Phase 1 — Three Isolation Tests

**Goal:** Verify the three foundational capabilities independently, in isolation, before building anything on top of them.

**Owner:** Agent (developer)

**Files to create:**

| File | Purpose |
|------|---------|
| `agent/tests/test-narration.ts` | Throwaway script: sends Ch1 §1.1 text to regular Gemini `generateContent` streaming API with Band 3 system prompt. Prints streamed text + any tool call suggestions to console. |
| `agent/tests/test-fake-toolcall.ts` | Throwaway script: starts agent server, connects via wscat, sends a hardcoded `{ type: "tool_call", tool: "zoom_to", args: { location: "nile_delta" } }` message to the frontend WebSocket. Verifies map responds. |
| `agent/tests/test-audio-playback.ts` | Throwaway script: sends a minimal prompt to Gemini (any model), captures one audio chunk, base64-encodes it, and sends it over WebSocket as `{ type: "audio", data: "<base64>" }`. Verifies browser plays audio. |

**Definition of done:**

- [ ] **Test A (narration):** `npx tsx agent/tests/test-narration.ts` produces multi-paragraph narration of Section 1.1 content at Band 3 level. Output includes recognizable tool call suggestions (e.g., the model recommends showing a timeline or zooming to a location). **Pass/fail documented.**
- [ ] **Test B (tool calls):** A hardcoded `tool_call` message sent over WebSocket causes `TeachingCanvas` to execute the operation (map flies to location, or region highlights). Verified by eye in the browser. **Pass/fail documented.**
- [ ] **Test C (audio):** An audio chunk sent over WebSocket plays audibly in the browser through the existing `playAudioChunk` pipeline in `useSession.ts`. **Pass/fail documented.**
- [ ] Results recorded in `agent/tests/RESULTS.md` with date, pass/fail, and any notes.

---

### Phase 2 — Beat Data Schema

**Goal:** Design the data schema that defines how a section is broken into teaching beats. Produce one fully worked example for Chapter 1, Section 1.1.

**Owner:** Human (schema design, Reformed theology, askpuritans.com consultation) + Agent (documentation)

**Files to create:**

| File | Purpose |
|------|---------|
| `docs/curriculum/history/beat-schema.md` | Schema definition + one complete worked example |

**Beat schema (required fields):**

```json
{
  "beatId": "ch01_s01_b01",
  "sectionId": "ch01_s01",
  "sequence": 1,
  "title": "History's True Beginning",
  "contentText": "The paragraph(s) the AI should narrate for this beat",
  "sceneMode": "transcript",
  "toolSequence": [
    {
      "tool": "show_scripture",
      "args": { "reference": "Genesis 1:1", "text": "In the beginning..." },
      "timing": "after_first_paragraph"
    },
    {
      "tool": "show_timeline",
      "args": { "events": [{ "year": -4004, "label": "Creation" }] },
      "timing": "after_second_paragraph"
    }
  ],
  "estimatedDurationSec": 90,
  "bandOverrides": {
    "2": { "contentText": "Simplified version for younger learners..." },
    "5": { "contentText": "Full academic text with additional analysis..." }
  },
  "reformedReflection": {
    "source": "askpuritans.com",
    "theologian": "Jonathan Edwards",
    "insight": "Edwards on God's sovereignty in ordering history...",
    "applicationPrompt": "How does this view change how you see the Fall?"
  },
  "realLifeApplication": "Consider how the brokenness described in Genesis 3 manifests in your community...",
  "researchPrompt": "Research one example of the Creation-Fall-Redemption framework applied to a modern event",
  "homework": {
    "reading": "Westminster Shorter Catechism Q.17-19",
    "writing": "Write a 200-word reflection on how the Fall affects our approach to studying history",
    "discussion": "Discuss with your family: what's the difference between studying history to memorize facts and studying it to see God's hand?"
  }
}
```

**Section-level wrapper:**

```json
{
  "sectionId": "ch01_s01",
  "chapterId": "ch01",
  "heading": "1.1 In the Beginning: God, Man, and the Meaning of History",
  "totalBeats": 6,
  "estimatedTotalDurationSec": 720,
  "thinkItThrough": ["...existing questions from content manifest..."],
  "beats": [ /* ordered array of beat objects */ ]
}
```

**The worked example must include:**

- Section 1.1 ("In the Beginning: God, Man, and the Meaning of History") broken into its complete beat sequence (approximately 5–7 beats)
- Each beat with: the exact contentText extracted from the content manifest, the sceneMode, the pre-planned toolSequence with timing hints, estimated duration
- At least one beat with a `reformedReflection` field (manually sourced from askpuritans.com)
- At least one beat with `realLifeApplication`, `researchPrompt`, and `homework`
- A final beat for the "Think It Through" comprehension questions
- Notes on how the schema handles large sections that require splitting across two lessons

**Definition of done:**

- [ ] `docs/curriculum/history/beat-schema.md` exists with complete schema documentation
- [ ] One fully worked example: Chapter 1, Section 1.1 as a complete beat sequence
- [ ] Schema covers all 11 tool types in `historyExplainerTools.ts`
- [ ] Schema reviewed and approved by human author before Phase 3 begins

---

### Phase 3 — Beat Sequencer (Agent Side)

**Goal:** Replace the current "open Gemini Live and pray" pattern with a Beat Sequencer that iterates through beats and makes one focused `generateContent` streaming call per beat.

**Owner:** Agent (developer)

**Files to create or modify:**

| File | Action | Purpose |
|------|--------|---------|
| `agent/src/beatSequencer.ts` | **NEW** | Core sequencer class: loads beats, iterates, makes one API call per beat |
| `agent/src/textNarrator.ts` | **NEW** | Wrapper around `generateContent` streaming — sends beat content + band prompt, returns streamed text + tool calls |
| `agent/src/historyExplainerSession.ts` | **MODIFY** | Replace hello-world diagnostic with BeatSequencer instantiation |
| `agent/src/gemini.ts` | **MODIFY** | Add a `narrateBeat()` method using `generateContent` (streaming) alongside existing Live session support |
| `agent/src/historyExplainerTools.ts` | **KEEP** | Tool definitions and prompt builder — no changes needed |

**BeatSequencer behavior:**

1. Receives the section's beat array on session start
2. Iterates through beats in order
3. For each beat:
   - Sends `set_scene` tool call if the beat's `sceneMode` differs from the current mode
   - Calls `textNarrator.narrateBeat(beat, band, previousContext)` — a single `generateContent` streaming call
   - Forwards streamed text as `{ type: "transcript", text, isFinal }` messages to client WebSocket
   - Forwards any tool calls as `{ type: "tool_call", tool, args }` messages to client WebSocket
   - Fires pre-planned `toolSequence` entries at the specified timing points
   - Marks beat complete when the streaming call finishes
   - Pauses briefly (configurable inter-beat delay, default 500ms) before starting next beat
4. Exposes `pause()` — stops after current beat completes (does not interrupt mid-beat)
5. Exposes `resume()` — continues from next beat
6. Sends `{ type: "lesson_complete" }` when all beats are finished

**WebSocket protocol — no changes:**

The message types sent to the client remain identical: `tool_call`, `transcript`, `audio`, `thinking`, `error`. The frontend does not know or care whether messages come from a Beat Sequencer or a Live session.

**Audio strategy for Phase 3:**

- **Initial implementation:** Text-only narration (no audio). The transcript is the primary surface.
- **Follow-up (can be added incrementally):** Pipe narration text through Google Cloud TTS or Gemini audio generation, forward PCM chunks as `{ type: "audio", data }` messages. This is a separate concern and must not block Phase 3 completion.

**Definition of done:**

- [ ] `agent/src/beatSequencer.ts` and `agent/src/textNarrator.ts` exist and compile (`cd agent && npm run build`)
- [ ] `historyExplainerSession.ts` instantiates a BeatSequencer with hardcoded test beats (Section 1.1 from Phase 2 example)
- [ ] Connecting via wscat produces a stream of `transcript` messages with Section 1.1 narration, interspersed with `tool_call` messages
- [ ] `pause()` and `resume()` work (tested via a control message from the client)
- [ ] A `lesson_complete` message is sent when all beats are finished
- [ ] Structured logging at every stage: `[SEQUENCER] Beat 1/6: "History's True Beginning"`, `[NARRATOR] Streaming started`, `[TOOL] Pre-planned: show_scripture(...)`, etc.

---

### Phase 4 — Live Handler for Student Q&A

**Goal:** Build a thin wrapper that activates Gemini Live only when a student raises their hand (Band 3+), handles a short conversational exchange, then returns control to the Beat Sequencer.

**Owner:** Agent (developer)

**Files to create or modify:**

| File | Action | Purpose |
|------|--------|---------|
| `agent/src/liveHandler.ts` | **NEW** | Opens a short Gemini Live session with lesson context, forwards audio bidirectionally, closes on conversation end |
| `agent/src/beatSequencer.ts` | **MODIFY** | Add `onInterrupt(handler)` callback, pause sequencer when student interrupts |
| `agent/src/historyExplainerSession.ts` | **MODIFY** | Wire `raise_hand` client message to LiveHandler |
| `agent/src/gemini.ts` | **KEEP** | Existing `GeminiSession` class used by LiveHandler (no changes) |

**LiveHandler behavior:**

1. Activated when the client sends `{ type: "raise_hand" }` (or when the sequencer reaches a comprehension-check beat)
2. The Beat Sequencer calls `pause()` automatically
3. LiveHandler opens a Gemini Live session with context:
   - Current beat title and content
   - Recent transcript (last 3 beats)
   - Band-appropriate system prompt
   - "The student has a question about the lesson. Answer briefly, then say 'Let's continue with the lesson.'"
4. Audio from the student's microphone (already captured by `useSession.ts`) is forwarded to the Live session
5. Audio from the Live session is forwarded to the client as `{ type: "audio", data }` messages
6. Transcript from the Live session is forwarded as `{ type: "transcript", text, isFinal }` messages
7. When the Live session ends (student stops speaking, model says "let's continue," or timeout after 2 minutes), LiveHandler:
   - Closes the Live session
   - Sends `{ type: "qa_complete" }` to client
   - Signals the Beat Sequencer to `resume()`

**Frontend changes (minimal):**

- Add a "Raise Hand" button in SessionCanvas (only visible for Band 3+)
- On press, send `{ type: "raise_hand" }` over WebSocket
- On `qa_complete` message, visual indicator returns to normal

**Definition of done:**

- [ ] `agent/src/liveHandler.ts` exists and compiles
- [ ] Sending `{ type: "raise_hand" }` over wscat during a running session pauses the sequencer, opens a Live session, and audio flows bidirectionally
- [ ] The Live session closes after a natural conversation ending or 2-minute timeout
- [ ] The Beat Sequencer resumes from the next beat after Q&A completes
- [ ] Band 2 and below: `raise_hand` messages are ignored (listen-only mode)

---

### Phase 5 — Content Pipeline

**Goal:** Wire the agent to fetch real chapter/section content from the Worker API before starting a session. Remove all hardcoded test content.

**Owner:** Agent (developer) + Worker (developer)

**Files to create or modify:**

| File | Action | Purpose |
|------|--------|---------|
| `agent/src/contentFetcher.ts` | **NEW** | Fetches section content + beat schema from Worker API, caches for session duration |
| `agent/src/historyExplainerSession.ts` | **MODIFY** | Replace hardcoded beats with content from `contentFetcher` |
| `worker/src/routes/content.ts` | **MODIFY** | Add or verify endpoint: `GET /api/chapters/:chapterId/sections/:sectionId/beats` |
| `worker/db/migrations/xxx_beat_schema.sql` | **NEW** (if needed) | D1 table for beat data, or serve from R2 JSON |

**Content flow:**

```
Client connects with ?chapter=ch01&section=s01&band=3
    → Agent calls Worker: GET /api/chapters/ch01/sections/s01/beats?band=3
    → Worker returns beat array from D1/R2
    → Agent feeds beats to BeatSequencer
    → Lesson begins
```

**Content storage decision (to be made in this phase):**

- **Option A:** Beat JSON files stored in R2 at `beats/ch01/s01.json`, served by Worker
- **Option B:** Beat data stored in D1 tables, queried by Worker
- **Recommendation:** Option A (R2 JSON files) for simplicity — beat data is authored content, not user-generated data. It changes infrequently and benefits from the content manifest pattern already established.

**Definition of done:**

- [ ] `contentFetcher.ts` exists and compiles
- [ ] The hello-world system prompt in `historyExplainerSession.ts` is permanently removed
- [ ] Connecting with `?chapter=ch01&section=s01&band=3` fetches real Section 1.1 beats and narrates them
- [ ] Connecting with a non-existent section returns a graceful error message to the client
- [ ] The Worker endpoint is deployed and reachable from the Cloud Run agent
- [ ] Service-to-service auth (`AGENT_SERVICE_KEY`) is used for the Worker API call

---

### Phase 6 — Frontend Integration and Polish

**Goal:** Verify the full lesson flow end-to-end. Address any gaps identified during testing. This phase starts only after Phases 1–5 are confirmed working.

**Owner:** Full stack (developer)

**Files to modify:**

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/LessonPlayerPage.tsx` | **MODIFY** | Pass section ID (not just chapter ID) to SessionCanvas |
| `src/components/session/SessionCanvas.tsx` | **MODIFY** | Handle `lesson_complete` message, show wrap-up screen with homework/research prompts |
| `src/components/session/SessionCanvas.tsx` | **MODIFY** | Add "Raise Hand" button for Band 3+ |
| `src/lib/session/useSession.ts` | **MODIFY** | Handle `qa_complete` message type |
| `src/pages/Dashboard.tsx` | **MODIFY** | Show sections within chapters (lesson picker), not just chapter-level entry |

**End-to-end flow to verify:**

```
Dashboard → Student taps Chapter 1 → Section list appears
    → Student taps "1.1 In the Beginning"
    → SessionCanvas opens, connects to agent
    → Agent fetches Section 1.1 beats from Worker
    → Beat 1 narrates: transcript text streams in, kinetic typography animates
    → Beat 2: set_scene("map") fires, map appears, zoom_to("babel")
    → Beat 3: set_scene("transcript"), narration continues
    → Beat 4: show_scripture("Genesis 1:1") fires
    → Beat 5: Think It Through questions display
    → Student (Band 3+) raises hand → Q&A exchange → resume
    → All beats complete → lesson_complete screen with homework
    → Student returns to dashboard → section marked complete
```

**Definition of done:**

- [ ] Full flow above works without errors for Chapter 1, Section 1.1 at Band 3
- [ ] `lesson_complete` message triggers wrap-up screen with homework/research prompts
- [ ] "Raise Hand" button appears for Band 3+ and opens Q&A exchange
- [ ] Dashboard shows section-level lesson list for each chapter
- [ ] Section completion is recorded in D1 via Worker API
- [ ] `npm run build` passes with zero errors
- [ ] `cd agent && npm run build` passes with zero errors

### Phase 6 — Current Runtime Status (2026-04-10)

**What is now working:**

- ✅ Beat audio is now present in real lesson runs (Gemini TTS migration succeeded)
- ✅ WebSocket connects and stays up through the lesson
- ✅ The client receives the lesson-finished signal

**What user testing exposed next:**

1. **Transcript / audio are not telling the same truth.** The transcript needs to follow the actual audible pacing, not jump ahead of the spoken beat.
2. **Visual teaching layer is not appearing.** User screenshots show literal tool syntax such as `show_scripture(...)`, `show_timeline(...)`, and `set_scene("image", ...)` rendered inside the transcript instead of driving `TeachingCanvas` / overlays.
3. **Beat continuity is broken.** From the learner's perspective, the narrator pauses and then restarts with a greeting and recap as if each beat were a fresh lesson.
4. **Lesson termination is not trustworthy.** The ending feels broken, and at least one real run appeared to restart from the beginning after completion.

**Interpretation:**

The silent-audio blocker is resolved. The remaining failures are now **session orchestration failures** — synchronization, tool-channel separation, continuity prompting, and terminal-state handling.

### Immediate Stabilization Backlog (Locked Next Order)

1. **Restore tool-channel separation.** Spoken narration must never contain literal tool commands. `toolCalls` from `beat_payload` must be the only path that drives scenes, overlays, and map actions.
2. **Make audio the pacing authority.** Transcript progression, beat completion, and tool timing must key off actual audio start/end (or explicit dwell fallback), not immediate text receipt alone.
3. **Enforce same-lesson continuity across beats.** Every beat prompt must explicitly continue an in-progress lesson and forbid greetings, reintroductions, and recap openings unless the beat is intentionally a recap beat.
4. **Make completion terminal and idempotent.** Once `lesson_complete` is received, clear queues, cancel timers, stop replay loops, and prevent reconnect/restart logic from reopening the same lesson state.
5. **Only after runtime stabilization:** wire the full teaching philosophy pipeline (`docs/TEACHING_PHILOSOPHY.md`) into lesson preparation. The philosophy is now defined; the runtime must become trustworthy enough to carry it.

---

## Phase 7 — Band Differentiation

> **Status:** Next up (after Phase 6 stabilization)
> **Goal:** Make the same manifest beat produce six pedagogically distinct lesson experiences — from a 3-year-old's picture book to an 18-year-old's seminar.
> **Source documents:** `docs/architecture/band-differentiation-plan.md` (Codex), `implementation_plan.md` (Antigravity), `learn-live-band-differentiation-framework.md` (Claude)

### Why This Matters

The current system delivers the same tools, narration length, voice, and visual strategy to every band. A 4-year-old and a 17-year-old receive identical canvas experiences. The only band-aware feature is optional `bandOverrides.contentText` in manifests — which swaps prose but does not filter tools, constrain narration, adjust voice, or change the delivery model.

Band differentiation is not about simplifying the same content for younger children. It is about choosing the right cognitive instrument for each stage of development.

---

### Sprint 1 — Agent-Side Core Differentiation (1 sprint)

> Low risk, high impact. All changes are server-side — no frontend modifications.

#### 1.1 Band Profile Config

**[NEW] `agent/src/bandConfig.ts`**

Single source of truth for all band-specific parameters. Replaces scattered `if (band <= 1)` checks.

```typescript
export interface BandProfile {
  band: number;
  label: string;
  ages: string;

  narration: {
    wordsPerBeat: [number, number];    // [min, max]
    maxSentences: number;
    maxSentenceWords: number;
    vocabularyLevel: 'concrete-only' | 'simple' | 'moderate' | 'academic' | 'theological';
    toneDirective: string;
  };

  tools: {
    blocked: string[];
    maxTimelineEvents: number;
    maxComparisonPoints: number;
    maxGenealogyNodes: number;
    mapToolsEnabled: boolean;
    scriptureAllowed: boolean;
    quoteAllowed: boolean;
    keyTermSimplified: boolean;       // strip etymology, pronunciation
  };

  tts: {
    voiceName: string;
    speakingRate: number;
    style: 'storybook' | 'warm-story' | 'clear-teacher' | 'coach' | 'seminar' | 'scholarly';
  };

  visuals: {
    imagePct: number;
    mapPct: number;
    overlayPct: number;
    transcriptPctMax: number;
  };

  interactivity: {
    raiseHand: 'disabled' | 'guided' | 'full';
    questionTypes: string[];
    maxInteractionsPerSection: number;
  };

  delivery: {
    mode: 'storybook' | 'canvas';
    tapToAdvance: boolean;
  };

  theologyGate: {
    allowedConcepts: string[];
    blockedConcepts: string[];
  };
}
```

**Concrete values (consensus from all three analyses):**

| Parameter | Band 0 (3-4) | Band 1 (5-6) | Band 2 (7-8) | Band 3 (9-11) | Band 4 (12-14) | Band 5 (15-17+) |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **wordsPerBeat** | 18-35 | 30-55 | 55-85 | 80-125 | 110-175 | 150-250 |
| **maxSentences** | 3 | 5 | 6 | 8 | 9 | 11 |
| **maxSentenceWords** | 8 | 11 | 14 | 18 | 22 | 30 |
| **vocabularyLevel** | concrete-only | simple | moderate | academic | academic | theological |
| **voiceName** | Kore | Kore | Leda | Orus | Charon | Charon |
| **speakingRate** | 0.85 | 0.90 | 0.97 | 1.02 | 1.05 | 1.08 |
| **imagePct** | 90 | 70 | 50 | 30 | 20 | 10 |
| **mapPct** | 0 | 0 | 20 | 35 | 35 | 30 |
| **overlayPct** | 10 | 25 | 25 | 30 | 40 | 55 |
| **transcriptPctMax** | 0 | 5 | 5 | 5 | 5 | 5 |
| **delivery mode** | storybook | storybook | canvas | canvas | canvas | canvas |
| **raiseHand** | disabled | disabled | disabled | guided | full | full |

**Tone directives per band:**

| Band | Directive |
|------|-----------|
| 0 | "Speak warmly like a beloved uncle at bedtime. Use exclamations and repetition. Only concrete nouns and action verbs. No abstract concepts whatsoever." |
| 1 | "Tell a vivid story with characters and dialogue. Use sensory language — what people saw, heard, felt. Introduce max 1 new word per lesson, defined immediately." |
| 2 | "Clear, warm teacher. Narrate with structure: what happened, why it matters, what came next. Use 'because' and 'as a result' connectors." |
| 3 | "Teach with authority. Pose questions and answer them. Make causal chains explicit. Introduce theological terms with brief explanations." |
| 4 | "Analyze patterns across events. Compare and contrast. Challenge the student: 'Notice how this mirrors what we saw in...' Full theological vocabulary." |
| 5 | "Engage as a scholarly equal. Present evidence, weigh interpretations, invite critical thinking. Reference historiographic debates." |

**Files that import `bandConfig.ts`:** `beatSequencer.ts`, `historyExplainerTools.ts`, `tts.ts`, `historySessionController.ts`, `lessonPreparer.ts`

---

#### 1.2 Tool Filtering in BeatSequencer

**[MODIFY] `agent/src/beatSequencer.ts`** — add `applyBandToolPolicy()` after `toolSequence.map()` and before delivery.

**Tool availability matrix:**

| Tool | B0 | B1 | B2 | B3 | B4 | B5 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|
| `set_scene(image)` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `set_scene(map)` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `set_scene(transcript)` | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `show_scripture` | ✗ | ✗ | ✓ (1 verse) | ✓ | ✓ | ✓ |
| `show_timeline` | ✗ | ✗ | ✓ (≤3) | ✓ (≤5) | ✓ (≤7) | ✓ (≤9) |
| `show_key_term` | ✗ | ✓* | ✓* | ✓ | ✓ | ✓ |
| `show_comparison` | ✗ | ✗ | ✗ | ✓ (≤2pt) | ✓ (≤4pt) | ✓ (≤6pt) |
| `show_genealogy` | ✗ | ✗ | ✗ | ✓ (≤6) | ✓ (≤10) | ✓ (≤12) |
| `show_question` | ✗ | ✗ | ✓ (comprehension) | ✓ (reflection) | ✓ (debate) | ✓ (all) |
| `show_quote` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `show_slide` | ✓** | ✓** | ✓ | ✓ | ✓ | ✓ |
| All map tools | ✗ | ✗ | ✓ (limited) | ✓ | ✓ | ✓ |

\* = simplified (no etymology, no pronunciation)
\** = max 1 bullet, max 4 words per bullet, must accompany image

**Transform rules:**
- Truncate `show_timeline.events` to band max
- Truncate `show_genealogy.nodes` to band max
- Truncate `show_comparison` points per column to band max
- Strip `etymology` and `pronunciation` from `show_key_term` for simplified bands
- If map tools appear but `mapToolsEnabled === false`, drop them entirely
- If band ≤ 1 and no `set_scene(image)` exists, force-inject one as first tool
- Inject `dismiss_overlay("all")` at major topic transitions

**Also extend `Beat.bandOverrides`** in `agent/src/content.ts`:
```typescript
bandOverrides?: Record<string, {
  contentText: string;
  toolSequence?: Beat['toolSequence'];  // NEW: optional tool overrides per band
}>;
```

---

#### 1.3 Narration Prompt Constraints

**[MODIFY] `agent/src/historyExplainerTools.ts`** — update `buildNarrationPrompt()` to inject measurable constraints from `BandProfile.narration`.

Inject this block into every narration prompt:
```
NARRATION CONSTRAINTS (STRICT — DO NOT EXCEED):
- Maximum {maxWords} words for this beat.
- Maximum {maxSentenceWords} words per sentence.
- Maximum {maxSentences} sentences.
- Vocabulary level: {vocabularyLevel}.
- {toneDirective}
- If output exceeds max words, rewrite shorter before responding.
```

**Replace** the current global "authoritative university professor" guard with band-specific tone for Bands 0-2.

**Also update `buildHistoryExplainerPrompt()`:** Replace the crude 3-tier `if/else` with `getBandProfile()` to generate band-specific system instructions dynamically.

---

#### 1.4 TTS Voice Differentiation

**[MODIFY] `agent/src/tts.ts`** — add `getTTSOptionsForBand(band)`.

**[MODIFY] `agent/src/beatSequencer.ts`** line 185: pass band-specific options to every `synthesize()` call:
```typescript
const audioBase64 = await this.tts.synthesize(narratedText, {
  voiceName: this.bandProfile.tts.voiceName,
  speakingRate: this.bandProfile.tts.speakingRate,
}) || '';
```

**Voice rationale:**
- **Kore** (Bands 0-1): Warm, clear — ideal for storybook narration
- **Leda** (Band 2): Engaged teacher — transition voice
- **Orus** (Band 3): Confident coach — the first "serious" voice
- **Charon** (Bands 4-5): Authoritative, scholarly — matches the professor persona

> **NOTE:** Voice selection requires user testing. Generate 30-second samples in each voice before committing.

---

#### 1.5 Theology Gate

**Theological Concept Unlock Table (from Claude's framework):**

| Concept | First Unlock Band | Notes |
|---|---|---|
| God made everything | 0 | Foundation; always present |
| God is good | 0 | Foundation; always present |
| People disobeyed God | 1 | Concrete story terms only |
| God judges sin | 2 | Concrete (the Flood); not abstract |
| God keeps His promises | 2 | Narrative ("God promised Noah and kept it") |
| Africa in God's plan | 3 | Explicit dignity framing begins |
| Nations as God's design | 3 | Table of Nations as real history |
| Divine judgment as historical force | 3 | Causal, not abstract |
| Covenant pattern | 4 | Named and explained |
| Nimrod pattern | 4 | Named and explained |
| Translation Thesis | 4 | Introduced with full explanation |
| Providence as interpretive framework | 4 | Systematic framing begins |
| Eschatological implications | 5 | Telos of African history in God's plan |
| Colonial historiography critique | 5 | Full critical engagement |
| Present-day African ecclesiology | 5 | Application layer |

**Implementation:** Add `theologyGate.allowedConcepts` and `theologyGate.blockedConcepts` to `BandProfile`. Inject into narration prompt: *"You may draw on: [list]. If the source text contains these concepts, paraphrase around them at this band level: [blocked list]."*

---

#### 1.6 Visual Mix Telemetry

Add runtime counters in `beatSequencer.ts` to track per-section distribution of image/map/overlay/transcript scenes. Log warnings when any section drifts more than 15 percentage points from the band's target percentages.

---

#### Sprint 1 Definition of Done

- [ ] `bandConfig.ts` exists with all 6 profiles fully populated
- [ ] `applyBandToolPolicy()` filters and transforms tool calls correctly for all 6 bands
- [ ] Narration prompts carry concrete word/sentence/vocabulary constraints per band
- [ ] TTS calls use band-specific voice and speed
- [ ] `theologyGate` concepts injected into narration prompts
- [ ] Visual mix telemetry logs warnings for drift
- [ ] Same manifest beat produces measurably different output across all 6 bands (verified by logged word counts and tool sequences)

---

### Sprint 2 — Frontend Delivery Modes (1 sprint)

#### 2.1 StorybookPlayer for Bands 0-1

**[NEW] `src/components/session/StoryBookPlayer.tsx`**

A dedicated full-screen picture-book experience. The SessionCanvas is categorically wrong for 3-6 year olds — not because it's too complex, but because it's a fundamentally different relationship between child and content.

```
┌──────────────────────────────────────┐
│                                      │
│          [FULL-BLEED IMAGE]          │
│                                      │
│                                      │
│──────────────────────────────────────│
│  "God made the whole world, and      │
│   it was very, very good."           │
│                            ● ● ○ ○   │
└──────────────────────────────────────┘
```

Features:
- Full-bleed illustration fills the viewport
- Audio plays automatically (warm Kore voice)
- Large, simple text overlaid at the bottom
- Tap/click anywhere to advance (or auto-advance when audio ends)
- No overlays, no transcript panel, no map, no controls except back + pause
- Page turn animation (dissolve)
- Progress dots at bottom

**Route branching** in session container:
```tsx
if (band <= 1) return <StoryBookPlayer />;
return <SessionCanvas />;
```

The BeatSequencer still runs the same beat manifest — the StorybookPlayer renders the limited tool subset (`set_scene(image)`, `show_slide`, `show_key_term` for Band 1 only) as storybook UI primitives.

---

#### 2.2 Interaction Spectrum

**[MODIFY] `agent/src/historySessionController.ts`** — replace binary `canAcceptRaiseHand()` with per-band interaction policy.

| Band | Primary Mode | Interactions | Max Per Section |
|---|---|---|---|
| 0 | Tap-to-advance | None | 0 |
| 1 | Tap-to-advance | Image-choice comprehension (2 options, pictorial) | 1 per lesson |
| 2 | Auto-play + pause | 2-option text comprehension, oral prompt | 1 per section |
| 3 | Auto-play + guided pause | Cause-effect questions, short live Q&A (90s gated) | 2 per section |
| 4 | Interactive | Analysis, comparison, Debate Box, live Q&A | 3 per section |
| 5 | Student-paced | Thesis defense, evidence ranking, essay mode, Socratic Q&A | Unlimited |

**New interaction tools:**

| Tool | Unlock Band | Description |
|---|---|---|
| `show_comprehension_check` | 2 | MCQ with correctIndex + explanation |
| `show_debate_prompt` | 4 | Two positions + evidence array |
| `show_essay_prompt` | 5 | Writing prompt + word count + guidelines |

**[MODIFY] `src/components/canvas/CanvasOverlays.tsx`** — add renderers for the three new interaction tools.

---

#### 2.3 Question Type Enforcement

| Band | Permitted `show_question` Types | Prohibited |
|---|---|---|
| 0 | None (tool blocked) | All |
| 1 | `check` (image-choice only) | All others |
| 2 | `comprehension` (factual recall) | All others |
| 3 | `comprehension`, `reflection`, `cause_effect` | `debate`, `essay` |
| 4 | `cause_effect`, `analysis`, `debate` | `essay` |
| 5 | All types | None |

---

#### Sprint 2 Definition of Done

- [ ] `StoryBookPlayer.tsx` exists and renders for Bands 0-1
- [ ] Route branches correctly: Band ≤ 1 → StoryBookPlayer, Band ≥ 2 → SessionCanvas
- [ ] New interaction tools render correctly in CanvasOverlays
- [ ] HistorySessionController enforces per-band interaction policy
- [ ] A 4-year-old session and 16-year-old session are experientially unrecognizable as the same system

---

### Sprint 3 — Quality, Authoring Infrastructure, and Testing (1 sprint)

#### 3.1 Documentation

- Update `docs/curriculum/history/beat-schema.md` with per-band tool constraints and `theologyGate` documentation
- Add band differentiation section to `docs/TEACHING_PHILOSOPHY.md`

#### 3.2 Manifest Lint Script

**[NEW] `agent/scripts/lint-manifest.ts`**

Validates beat manifests against band policy before deploy:
- Flag tools that would be blocked at any band
- Warn if `bandOverrides` is missing for beats with complex tool sequences
- Verify timeline event counts don't exceed any band's max

#### 3.3 Tests

```bash
# Unit: tool filtering snapshot tests
cd agent && npx vitest run --testPathPattern=bandConfig.test.ts

# Unit: narration constraint injection
cd agent && npx vitest run --testPathPattern=narrationPrompt.test.ts

# Integration: run sequencer for ch01_s01 across all 6 bands
cd agent && npx vitest run --testPathPattern=bandDifferentiation.integration.test.ts
```

**Snapshot test assertions:**
- Band 0 emits zero timeline/comparison/quote/map tools
- Band 0 narration < 40 words per beat
- Band 5 narration uses theological vocabulary
- TTS options differ by band on every synthesis call

#### 3.4 Comprehension Scoring (Band 2+)

**[NEW] `agent/src/comprehensionTracker.ts`**

Track student responses within a session:
- Store correct/incorrect count
- If < 50% correct, dynamically slow narration and add scaffolding
- Report scores to Worker API for parent dashboard

---

#### Sprint 3 Definition of Done

- [ ] Manifest lint script passes for all existing beat JSONs
- [ ] Snapshot tests cover tool filtering for all 6 bands
- [ ] Narration constraint tests verify word count / sentence count compliance
- [ ] Comprehension tracker stores and reports scores
- [ ] Documentation updated

---

### Acceptance Criteria (Phase 7 Ship Checklist)

1. Same manifest beat produces different narration length/complexity across all 6 bands
2. Tool calls differ by band according to policy (verified by logged transformed sequence)
3. Bands 0-1 never receive `show_comparison`, `show_quote`, `show_genealogy`, map tools, or dense overlays
4. Bands 0-1 render in `StorybookPlayer`, not `SessionCanvas`
5. TTS voice, rate, and style differ by band on every synthesis call
6. Visual mix telemetry warns when section distribution drifts >15% from band target
7. Theological concepts blocked by `theologyGate` do not appear in narration for bands below unlock
8. Per-band interaction policy governs Q&A, question types, and interaction limits
9. A 4-year-old and a 16-year-old on the same lesson chapter are experientially unrecognizable as the same content delivery system

---

### Open Design Questions (Resolve Before Sprint 2)

> **Q1: Band 2 delivery mode.** Band 2 (ages 7-8) sits on the border. Should they get the full canvas, or a simplified canvas without the transcript panel? Current plan: full canvas. Consider whether 7-year-olds are overwhelmed by the split view.

> **Q2: Voice testing.** Generate 30-second samples in Kore, Leda, Orus, and Charon before committing. Consider adding voice selection to parent dashboard.

> **Q3: AI-generated images for Bands 0-1.** Should the StorybookPlayer support only pre-rendered storybook images from `imageRegistry.ts`, or also accept AI-generated images in real-time? Pre-rendered is simpler and faster. AI-generated adds flexibility for chapters without authored art.

> **Q4: Band 3 Q&A duration.** All sources agree on 90-second gated Q&A for Band 3. Verify this is sufficient for meaningful exchange without derailing the lesson.

---

## Deferred Work (Not in current plan)

These items are important but are not blockers for the first working lesson:

| Item | Notes |
|------|-------|
| **LessonPreparer philosophical pipeline** | The multi-phase theological framing / critique pipeline from `docs/TEACHING_PHILOSOPHY.md` should begin only after Phase 6 stabilization removes restart, sync, and scene-rendering bugs. |
| **Golden Script re-verification** | `useRecorder.ts` and `useGoldenScript.ts` exist but were never tested with real content. Re-verify after Phase 6. |
| **Dashboard & page cleanup (Phase 24B)** | Remove deprecated pages, simplify onboarding. Independent. Can proceed in parallel. |
| **Beat schemas for Chapters 2–9** | Phase 2 produces only Chapter 1, Section 1.1. Remaining sections are authored incrementally. |
| **Reformed theology enrichment** | `reformedReflection` fields populated via manual askpuritans.com consultation. Human-authored per section. |
| **Illustrations for Chapters 2–9** | Only Chapter 1 has illustrations (23 Warm Codex). Others are pending. |

---

## Design Principles (Locked)

1. **The transcript is the home base.** Kinetic typography occupies 60-80% of lesson time. Visual scenes slide in temporarily and recede. The sequencer controls the transcript-vs-visual ratio based on beat data.
2. **One tap to learning.** Dashboard → tap chapter → tap section → lesson begins.
3. **Band 0 is a different app.** StorybookPlayer is completely separate from SessionCanvas.
4. **Parents observe, not gatekeep.** No blocking approval gates. Passive summaries.
5. **The curriculum is a library.** Dashboard feels like a home library shelf.
6. **Age-appropriate by default.** Band set once per child, everything adapts automatically.
7. **The sequencer is the director.** Pacing, scene transitions, tool calls, and beat progression are controlled by the Beat Sequencer, not by the AI autonomously. The AI narrates one beat at a time within the structure the sequencer provides.

---

## Architecture Decisions (Locked — Updated April 2026)

1. **MapLibre GL JS** for the teaching canvas. Vector polygons, smooth camera flights, animated routes — all driven by GeoJSON + tool calls.
2. **Beat-first, not live-first.** The regular Gemini streaming API (`generateContent`) handles narration — one focused call per teaching beat. No autonomous 15-minute Live sessions for narration.
3. **Gemini Live is for conversation only.** It activates on student interrupt (Band 3+) for short Q&A exchanges, then closes. It is never the primary narration engine.
4. **Transcript-first kinetic typography.** The default visual is animated text. Maps, images, and overlays are temporary scenes invoked via `set_scene`.
5. **`set_scene` is the key tool.** Both pre-planned (in beat data) and AI-generated tool calls control what the student sees.
6. **Sections are lessons.** Each numbered section (1.1, 1.2, etc.) from the content manifest is one lesson. Large sections may be split. The section is the unit of scheduling, progress tracking, and content delivery.
7. **Golden Script workflow.** Successful Beat Sequencer sessions are recorded as JSON for zero-latency cached playback. Static content is derived from live, not the other way around.
8. **StorybookPlayer is a separate component.** Bands 0-1 use split-screen layout with illustrations. Not a mode of SessionCanvas.
9. **Chapter 1 launches before Chapter 2 is touched.**
10. **Reformed perspective is human-authored.** `reformedReflection` fields are manually curated using askpuritans.com — never AI-generated theology.

---

## Theological Guardrails (Non-Negotiable)

1. Never remove or downplay scripture references
2. Never present the Curse of Ham as legitimate theology
3. Band 0 storybook uses same names, sequence, and emotional beats as full text
4. Only vocabulary and length change between bands — never the theology, never the facts
5. Dates from evolutionary model always tagged `(conventional estimate)`
6. Dates from biblical model always tagged `(biblical chronology)`
7. Band 4–5 system prompt: "The Biblical chronology is the authoritative framework. Teach it as true."
8. Reformed theological reflections are manually sourced from askpuritans.com and vetted by the human author — never generated by the AI

---

## MapLibre Tool-Call API

The AI narrates and the sequencer fires these tool calls via WebSocket:

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

## Archived Systems

| System | Location | Reactivation Path |
|--------|----------|-------------------|
| Math curriculum (377 templates, 5 strands) | `archive/curriculum_data/`, `src/archive/` | Load JSON seeds, re-enable math strand |
| English curriculum | `archive/english/` | Similar pattern |
| Science curriculum | `archive/science/` | Similar pattern |
| DAG dependency resolver | `worker/src/archive/` | If history adds prerequisites |
| SVG alignment tool | `tools/svg-aligner/` | Reference for manual alignment |
| PNG map overlays | R2 `assets/maps/` | Kept as reference images |
| Static lesson scripts | Deleted (were in `src/data/lessons/`) | Replaced by Beat Sequencer |
| ScriptPlayer pipeline | Deleted (Phase 20) | Replaced by SessionCanvas |
| Live-agent-first roadmap | `.antigravity/archive/roadmap-live-agent-approach.md` | Reference for Phase 20–23 decisions |
| Jules phase prompts | `.antigravity/JULES_PLAN_PHASE21.md` | Reference for Phase 21–25 implementation |

---

## Key References

- Master textbook: `docs/curriculum/history/my-first-textbook/`
- Content manifest: `worker/scripts/output/content-manifest.json`
- Component data: `docs/curriculum/history/component-data/`
- Beat schema (Phase 2): `docs/curriculum/history/beat-schema.md` (to be created)
- Pronunciation dictionary: `src/data/pronunciation.json`
- Teaching philosophy: `docs/TEACHING_PHILOSOPHY.md`
- Philosophy docs: `docs/core-docs/`
- Agent code: `agent/`
- Worker routes: `worker/src/routes/`
- GeoJSON data: `src/data/geojson/`
- Session canvas: `src/components/session/SessionCanvas.tsx`
- Session types: `src/lib/session/types.ts`
- Teaching canvas (MapLibre): `src/components/canvas/TeachingCanvas.tsx`
- Tool call handler: `src/lib/canvas/toolCallHandler.ts`
- Storybook player: `src/components/player/StorybookPlayer.tsx`
- Architecture doc (archived): `.antigravity/archive/ARCHITECTURE_LIVE.md`
- Archived roadmap: `.antigravity/archive/roadmap-live-agent-approach.md`

---

*This document is the single source of truth. Update it as decisions change.*
