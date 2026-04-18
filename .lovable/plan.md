

# The Sandwich Model — Architectural Response & Plan

You've identified something important. Before I propose anything technical, let me reflect what I'm hearing and then talk through the real shape of the work, the costs, and the open questions. **No code yet — this is a strategy conversation.**

---

## What you're actually proposing

You want to wrap the existing `BeatSequencer` (which is great at delivering content, but is essentially a documentary playing on rails) with two short, conversational, *driving* AI presences:

- **Gatekeeper** (before the lesson) — readiness check, prior-assignment review, prime the pump
- **Performer** (the lesson itself) — your existing pipeline, untouched
- **Negotiator** (after the lesson) — synthesis check, dynamic homework negotiation, warm closure

This is a sound pivot. It separates **"performance"** (which benefits from rigid choreography) from **"relationship"** (which benefits from real-time conversation). Trying to make one agent do both has been the underlying friction in everything we've debugged the last week.

---

## The good news: you're closer than you think

You already have **`agent/src/liveHandler.ts`** — a working `LiveQAHandler` that bridges Gemini Live audio over your existing WebSocket. It currently powers the Band 3+ "raise hand" feature. The Sandwich Model is essentially:

> Take that pattern, write two new system prompts, and trigger it at lesson **start** and **end** instead of mid-lesson.

So we're not building a new agent stack. We're **re-purposing an existing one with two new scoped personas and two new lifecycle triggers.**

---

## What this changes in the system

```text
┌─ Today ─────────────────────────────────────────────┐
│  connect → preparer → BeatSequencer → lesson_complete │
└─────────────────────────────────────────────────────┘

┌─ Sandwich Model ────────────────────────────────────────────────────────┐
│  connect → Gatekeeper (Live)                                            │
│            │  readiness + assignment review                             │
│            ↓ "begin_lesson" signal                                      │
│          preparer → BeatSequencer → lesson_complete                     │
│            ↓                                                            │
│          Negotiator (Live)                                              │
│            │ synthesis + assignment negotiation                         │
│            ↓ "session_complete" + assignment payload                    │
└─────────────────────────────────────────────────────────────────────────┘
```

Bands 0–1 skip both slices entirely (correct call — abstract conversation isn't developmentally appropriate there).

---

## Where the real complexity lives

This is the part you should hear before we decide to start.

### 1. Assignment persistence — the new backbone
Today, **there is no concept of an assignment in the system**. The Gatekeeper can't review "last time's homework" if we never stored it. So the Sandwich Model implies:
- A new D1 table (e.g. `learner_assignments`) — at minimum: `learner_id`, `chapter_id`, `section_id`, `prompt`, `student_response` (nullable), `evaluated_at`, `evaluation_notes`.
- Negotiator writes a row at end of lesson.
- Gatekeeper reads the most recent unreviewed row at start of next lesson.
- A way for the student to enter the response (typed? spoken to the Gatekeeper itself? both?).

**This is the single biggest piece of work.** The two agent prompts are easy. Wiring assignments end-to-end is the real lift.

### 2. Lesson-start gating — UX consequences
"Access blocked until previous assignment is reviewed" is a strong policy. Practical questions:
- What if the student never did the assignment? Does the Gatekeeper let them slide once? Negotiate a quick on-the-spot answer? Refuse?
- What about the **first lesson ever** (no prior assignment)? Gatekeeper goes straight to readiness check.
- Parent override? (Per `mem://principles/ai-governance` — "No AI Authority", parents have final say. So yes — there must be a parent bypass.)

### 3. Two new audio/UI states the frontend doesn't have
The current `SessionCanvas` has one mode: **listen to the Performer, optionally raise hand**. The Sandwich Model needs:
- **Gatekeeper mode** — full-duplex live conversation, no canvas visuals (or a minimal "your teacher is talking to you" cover), mic always hot, no beat queue.
- **Negotiator mode** — same interaction model, but with a visible "proposed assignment" card the student can accept / push back on, and a final "Assignment Saved" confirmation.

These are essentially **two new screens** that share the existing `liveHandler` plumbing but otherwise look nothing like the lesson canvas.

### 4. Gemini Live cost and latency
Live audio is **roughly 5–10× more expensive per minute** than the TTS-narrated beat pipeline. Two slices of ~2–4 minutes each adds ~$0.10–0.20 per session at current Gemini Live pricing (vs. effectively pennies for the TTS-only middle). Worth it pedagogically, but you should know the line item.

Also: Live audio adds **first-token latency** (1–3s for the agent to start speaking). The Gatekeeper must be designed to *speak first, immediately, with initiative* — not wait for the student. Your existing `liveHandler` kicks off with a `sendClientContent` call that nudges Gemini to greet first; we'd lean on the same pattern but make the system prompt much more directive.

### 5. The "rigid Performer" assumption needs one tweak
You said the Performer stays untouched in Phase 1. Agreed for content — but it needs to **emit a clean handoff signal at the end** (it already does: `lesson_complete`) and the Gatekeeper needs to **defer the BeatSequencer kickoff** until it says so. That requires a small state-machine change in `historySessionController.ts` (one new state: `AWAITING_GATEKEEPER_GREENLIGHT`).

---

## Phasing I'd recommend (so we don't bite off everything at once)

| Phase | Scope | Why this order |
|---|---|---|
| **0 — Now: stop the bleeding** | Finish the transcript/pause-play stabilization we're mid-flight on. Don't pivot into the Sandwich Model with broken playback controls. | Otherwise Sandwich UX inherits bugs. |
| **1A — Gatekeeper, no assignments** | Just the readiness check + "let's begin" handoff. No assignment review yet. New live persona, new state in controller, new welcome flow on frontend. | Proves the architecture end-to-end with low risk. ~1.5 days. |
| **1B — Negotiator, no persistence** | Adds the post-lesson synthesis + verbal homework proposal. Assignment is *spoken* but not saved anywhere yet. | Validates the pedagogical loop in isolation. ~1 day. |
| **1C — Assignment persistence** | D1 table, write from Negotiator, read from Gatekeeper, parent dashboard surfacing, lesson-start gating with parent override. | The serious infra. ~2–3 days plus parent UI. |
| **1D — Polish** | Adaptive scaffolding hooks (per `mem://features/adaptive-scaffolding` — already wired for sub-50% scores), debug tooling, telemetry. | Once it's all working. |

We can stop after any phase and have a usable system.

---

## Critical questions I need you to answer before we begin

1. **Assignment input modality.** When the Gatekeeper asks "read me your assignment from last time," how does the student deliver it?
   - (a) **Spoken to the Gatekeeper** — pure voice, Gemini Live transcribes & evaluates on the fly. Most natural, highest cost.
   - (b) **Typed beforehand** in the parent dashboard, Gatekeeper reads it back & discusses.
   - (c) **Photo of handwritten work** — leverages the existing async evidence verification (`mem://features/async-evidence-verification`) before the lesson even starts.
   - (d) **Some hybrid** depending on band.

2. **Gating strictness.** What happens when prior assignment isn't done? Three options: (a) Gatekeeper allows lesson to proceed but logs it for the parent, (b) Gatekeeper refuses and ends the session, (c) Gatekeeper conducts a 2-minute "let's at least talk through it now" mini-recovery, then proceeds.

3. **Voice and persona continuity.** Should Gatekeeper, Performer, and Negotiator all sound like **the same teacher** (same TTS voice for the Performer, matching Live voice for the slices)? Or are they intentionally distinct personas? My instinct: same voice, same name — it's "Mr./Ms. [X], your African History teacher" throughout. Feels coherent, not schizophrenic.

4. **Phase 0 — yes or skip?** Do we finish the in-flight pause/play/transcript stabilization first, or do you want to park that work and pivot straight to Sandwich Model 1A? I strongly recommend Phase 0 first, but it's your call.

---

## My honest recommendation

This is the right pivot. The Sandwich Model resolves the deepest tension in the current product — you've been trying to make one AI both *perform* and *relate*, and those need different engines. Splitting them is correct.

But: **don't start writing the Gatekeeper prompt today**. Start by answering the four questions above, then we'll tackle Phase 0 cleanup (a few hours) and move into Phase 1A (the Gatekeeper without assignments) as the first real Sandwich-Model deliverable. From there, every phase compounds without rework.

When you're ready, tell me your answers to the four questions and I'll come back with a concrete Phase 1A plan — file-by-file, with the assignment-persistence design teed up for 1C.

