
# Phase 0 (Revised) — Strip Replay/Pause, Make Transcript a Read-Only Activity Log

You're right. The pause/replay duality has been the source of every regression for two weeks. Killing it entirely is the cleanest path forward. The transcript becomes a passive, scrollable record of what the agent did and said — no controls, no replay, just visibility.

Then we move straight into the **Sandwich Model — Lite** (Gatekeeper + Negotiator, no homework persistence).

---

## Part A — Phase 0 (Revised): Transcript as Activity Log

### 1. Remove all pause/replay infrastructure
- Delete card-level Pause / Play / Replay visuals / Show popups buttons from `TranscriptView.tsx`.
- Delete bottom-bar Pause/Play toggle from `SessionCanvas.tsx`. Bottom bar = **Stop only** during live; mic for Band ≥3.
- Remove `pauseSession` / `resumeSession` / `paused` flag / `isReviewMode` / `handleReplayBeatVisuals` from `useSession.ts` and `SessionCanvas.tsx`.
- Remove the `onReplayVisuals` prop chain end-to-end.

### 2. New transcript card model
Each beat card shows:
- The beat text (markdown-rendered, as today)
- A subtle status pill: `playing` (pulsing dot) or `done`
- A **collapsible "Activity" dropdown** (closed by default) that lists, in order:
  - Each tool call the agent made for that beat — rendered as a small read-only chip with the tool name + a one-line human summary
    - `set_scene(image)` → "Showed illustration: <caption>"
    - `show_scripture` → "Scripture: Genesis 1:1"
    - `show_key_term` → "Key term: Protoevangelium"
    - `show_timeline` → "Timeline (3 events)"
    - `show_question` → "Reflection question"
    - `place_marker` / `zoom_to` / etc. → labeled accordingly
    - Blocked tools (per band gate) shown muted with a "blocked" badge
  - If thinking text is available for that beat, an **"Agent thinking"** sub-section inside the same dropdown (monospace, dimmed)
- Clicking a chip is a **no-op** (cosmetic only — no replay, no side-effect). Pure visibility.

### 3. Thinking pipeline → transcript
- Today `ThinkingBanner` shows live thinking transiently. Keep the banner during live playback (still useful).
- Additionally: capture each beat's thinking text (already streamed as `AgentThinking` messages) and attach it to the corresponding `BeatRecord` in `useSession.ts`. Surface inside the per-card dropdown as described above.

### 4. End-of-lesson screen
- Keep the lesson-complete state, but the transcript stays fully scrollable on the right (it already is — just no replay buttons appear).
- Left canvas: simple "Lesson complete" panel with **Back to Dashboard** + **Save as Golden Script**. No review controls.

### 5. Image dismissal rules (carry-over from prior plan)
- Bands 0/1: no `✕` on images (nothing underneath).
- Bands 2–5: keep `✕` (map underneath).
- Tag overlays remain dismissible everywhere.

### 6. Inter-beat pacing (carry-over from prior plan)
- Restore band-aware cooldown in `useSession.ts`: 4500ms (B0/1), 3500ms (B2/3), 3000ms (B4/5). Pure `setTimeout` between beats — no pause-aware logic needed since pause is gone.

### 7. Tool gate stays
- `toolGate.ts` continues to silently block disallowed tools per band. Blocked calls still appear in the transcript dropdown with a muted "blocked" chip so debugging stays easy.

### Files affected (Phase 0 revised)
| File | Change |
|---|---|
| `src/components/session/TranscriptView.tsx` | Strip pause/replay UI; add collapsible Activity dropdown per card |
| `src/components/session/SessionCanvas.tsx` | Bottom bar = Stop only; remove replay handler; band-aware image `✕`; new clean end panel |
| `src/lib/session/useSession.ts` | Remove pause/resume/review state; attach thinking text to `BeatRecord`; add inter-beat cooldown |
| `src/lib/session/toolGate.ts` | Verify silent-block + emit a "blocked" marker into the beat record |
| `src/components/canvas/CanvasOverlays.tsx` | Remove pause-aware logic from progress bars (run free) |
| `.antigravity/CHANGELOG.md` + `ISSUES.md` | Log Phase 0 revised; close pause/play issues |

**Effort:** ~2 hours. Pure deletion + one new dropdown component. Lower risk than any plan we've had.

---

## Part B — Path Into the Sandwich Model (No Homework)

Once Phase 0 lands, we go straight to **Phase 1A + 1B combined**, skipping homework persistence entirely (you'll add that later post-testing).

### What we build
- **Gatekeeper (Live)** before the lesson — readiness check + verbal "prime the pump" intro. **No assignment review.** First lesson ever or hundredth lesson — same flow: a 30–60s warm conversation, then "let's begin."
- **Performer** (existing BeatSequencer) — untouched.
- **Negotiator (Live)** after the lesson — synthesis questions + a verbal "for next time, think about X" closer. **No homework saved anywhere.** Just a warm conversational close with a forward-looking nudge.

### What we skip (deferred until you say so)
- D1 `learner_assignments` table
- Parent dashboard homework surfacing
- Lesson-start gating logic
- Assignment input modality (typed/spoken/photo)
- Parent override paths

### What this requires
1. **Agent (`agent/src/`):**
   - Two new system-prompt files: `prompts/gatekeeper.ts`, `prompts/negotiator.ts`.
   - Reuse `liveHandler.ts` — wrap it in a small lifecycle controller that runs Gatekeeper → signals "begin_lesson" → kicks off existing preparer/sequencer → on `lesson_complete` opens Negotiator → on Negotiator end emits `session_complete`.
   - One new state in `historySessionController.ts`: `AWAITING_GATEKEEPER_GREENLIGHT` (gates the BeatSequencer until Gatekeeper signals ready).
   - Bands 0/1 bypass both slices entirely (unchanged from today).

2. **Frontend (`src/`):**
   - New `LiveConversationView` component — full-bleed left panel, mic always hot, no canvas visuals, big "Your teacher is talking…" treatment with waveform/pulse. Right panel can show the live transcript stream from the Live agent (read-only, same dropdown pattern as Phase 0 cards).
   - `SessionCanvas` becomes a router between three modes: `gatekeeper` → `performer` → `negotiator` → `complete`. Mode is driven by WS messages from the agent.
   - Welcome cover transitions cleanly into the Gatekeeper view (same gradient, same vibe).

3. **Persona continuity:** Same teacher name + voice across all three slices (Gatekeeper Live voice ≈ Performer TTS voice). One coherent presence.

### Effort estimate
- Agent: ~4–6 hours (two prompts + lifecycle wiring + one controller state)
- Frontend: ~4–6 hours (one new view + mode router + WS message handling)
- **Total ~1.5 days for end-to-end Sandwich Lite**, vs. ~5+ days with homework persistence.

### Open question I need answered before we start Sandwich Lite
**What should the Gatekeeper actually talk about for ~30–60s if there's no prior assignment to review?** Three options:
- (a) Pure readiness check: "Are you in a quiet spot? Notebook ready? Great, today we're learning about X — let's begin."
- (b) Brief recap of the previous lesson's *theme* (no assignment, just "last time we talked about Creation — today we go further"): requires the agent to know the prior chapter.
- (c) Light Socratic warm-up: "Before we begin, what do you already know about [today's topic]?" — naturally checks prior knowledge without homework infrastructure.

My pick: **(c)** — it's the most pedagogically valuable and doesn't need any persistence layer. It also sets up the Negotiator nicely (the closer naturally mirrors the opener).

---

## Recommended order
1. **Today/next session:** Phase 0 revised (strip replay, ship the activity-log transcript). ~2 hours.
2. **Right after, same week:** Sandwich Lite (Gatekeeper + Negotiator, no homework). ~1.5 days.
3. **Later, after you've tested:** Layer in homework persistence (Phase 1C from the original plan).

Tell me to proceed with Phase 0 revised and answer the Gatekeeper warm-up question, and I'll switch to default mode and execute.
