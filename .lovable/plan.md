

# Sprint 3 — Quality, Authoring Infrastructure, and Testing

## Summary

Sprint 3 hardens the band differentiation system built in Sprints 1-2. No new features — this sprint adds validation, automated tests, comprehension tracking, and documentation updates. Five tasks.

---

## Task 1: Manifest Lint Script

**New file: `agent/scripts/lint-manifest.ts`**

A CLI script that validates beat JSON files against band policy before deploy.

What it checks:
- Every tool in every beat's `toolSequence` is flagged if it would be blocked for any band (so authors know which beats need `bandOverrides`)
- Warns if a beat has complex tool sequences (3+ tools) but no `bandOverrides` for bands 0-2
- Verifies timeline event counts, genealogy node counts, comparison points, and slide bullets don't exceed any band's configured max (from `bandConfig.ts`)
- Validates `sceneMode` values are valid
- Checks `contentText` word count against band narration limits — warns if base text exceeds Band 0's max (40 words) without a band override

Run: `cd agent && npx tsx scripts/lint-manifest.ts ../docs/curriculum/history/ch01_s01.json`

Also update `agent/package.json` to add vitest as a dev dependency (needed for Tasks 2-3).

---

## Task 2: Band Tool Filtering Snapshot Tests

**New file: `agent/tests/bandConfig.test.ts`**

Unit tests using vitest that snapshot the output of `applyBandToolPolicy()` for all 6 bands given a rich input set of tool calls.

Test cases:
- Input: a beat with `show_timeline(8 events)`, `show_comparison(6 points)`, `show_genealogy(12 nodes)`, `show_quote`, `show_scripture`, `zoom_to`, `draw_route`, `set_scene(map)`, `show_key_term(with etymology)`
- Assert Band 0 output: zero map tools, zero quotes, zero comparisons, zero genealogy, `set_scene(map)` converted to `set_scene(image)`, key terms stripped of etymology/pronunciation
- Assert Band 2 output: no quotes, timeline truncated to 3 events, comparison truncated to 2 points
- Assert Band 5 output: all tools pass through, full timeline/comparison/genealogy counts preserved
- Snapshot the filtered tool arrays so regressions are caught automatically

Also test `getBandProfile()` returns correct defaults for out-of-range band numbers.

---

## Task 3: Narration Constraint Prompt Tests

**New file: `agent/tests/narrationPrompt.test.ts`**

Unit tests that verify the prompt builder injects correct constraints per band.

Test cases:
- Call `buildNarrationPrompt()` with band 0 — assert output contains "Maximum 40 words", "warm storyteller", and the theology gate blocked concepts
- Call with band 5 — assert output contains "Maximum 250 words", "distinguished professor", and no blocked concepts
- Assert the `voiceGuard` line changes per band (not always "STRONG, BOLD, AUTHORITATIVE")
- Call `buildHistoryExplainerPrompt()` with each band — assert no hardcoded 3-tier if/else (verify all 6 bands produce distinct system instructions)

---

## Task 4: Comprehension Tracker

**New file: `agent/src/comprehensionTracker.ts`**

Tracks student responses to `show_question` / `show_comprehension_check` within a session.

Behavior:
- Stores correct/incorrect count per session
- Exposes `recordAnswer(questionId, correct: boolean)` and `getScore(): { correct, total, pct }`
- If score drops below 50% after 3+ questions, sets a `needsScaffolding` flag
- When `needsScaffolding` is true, the BeatSequencer adjusts: adds 200ms inter-beat delay, appends "Explain this more simply" to narration prompts
- At session end, emits a `{ type: 'session_score', correct, total, pct }` message over WebSocket for the parent dashboard
- Wire into `BeatSequencer` — instantiate tracker in constructor, check scaffolding flag before each beat

---

## Task 5: Documentation Updates

**Modify: `docs/TEACHING_PHILOSOPHY.md`**
- Add a new section: "Band Differentiation Framework" covering the 6-band model, tool policies, theology gate, and narration constraints
- Reference `agent/src/bandConfig.ts` as the canonical source

**Modify: `docs/curriculum/history/beat-schema.md`**
- Add per-band tool constraint documentation
- Document `theologyGate` — what it is, how it works, which concepts are gated at which bands
- Add a table showing which tools are available at each band

---

## Files Changed

| File | Action |
|---|---|
| `agent/scripts/lint-manifest.ts` | **CREATE** — beat manifest validator |
| `agent/tests/bandConfig.test.ts` | **CREATE** — tool filtering snapshot tests |
| `agent/tests/narrationPrompt.test.ts` | **CREATE** — prompt constraint tests |
| `agent/src/comprehensionTracker.ts` | **CREATE** — session scoring + scaffolding |
| `agent/src/beatSequencer.ts` | **MODIFY** — wire comprehensionTracker |
| `agent/package.json` | **MODIFY** — add vitest dev dependency |
| `docs/TEACHING_PHILOSOPHY.md` | **MODIFY** — add band differentiation section |
| `docs/curriculum/history/beat-schema.md` | **MODIFY** — add tool constraint + theology gate docs |

## Order of Implementation

1. `agent/package.json` — add vitest
2. `agent/scripts/lint-manifest.ts` — lint script (no dependencies)
3. `agent/tests/bandConfig.test.ts` — tool filtering tests
4. `agent/tests/narrationPrompt.test.ts` — prompt tests
5. `agent/src/comprehensionTracker.ts` + `beatSequencer.ts` wiring
6. Documentation updates

## Verification

- `cd agent && npx vitest run` — all tests pass
- `cd agent && npx tsx scripts/lint-manifest.ts` on ch01_s01.json — produces warnings for Band 0 tool gaps
- Comprehension tracker logs scores at session end
- Documentation reflects the full band differentiation system

