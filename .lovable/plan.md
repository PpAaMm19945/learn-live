

# Sprint 1 — Agent-Side Core Differentiation

## Summary
Six tasks to make band selection actually change lesson delivery. All changes are in `agent/src/` — zero frontend work.

## Task 1: Create `agent/src/bandConfig.ts`

New file. Single source of truth for all 6 band profiles.

```text
Export: BAND_PROFILES: Record<number, BandProfile>
Export: getBandProfile(band: number): BandProfile
```

Contains the full `BandProfile` interface and all concrete values from the roadmap table (words per beat, max sentences, vocabulary level, tone directive, tool availability matrix, TTS voice/rate, theology gate concepts, visual mix targets, interactivity settings).

This is a pure data file — no logic, just configuration.

---

## Task 2: Wire `applyBandToolPolicy()` into `beatSequencer.ts`

Add a new function `applyBandToolPolicy(toolCalls, bandProfile)` that runs after `beat.toolSequence.map()` (currently line 191) and before `deliverBeat()`.

**What it does:**
- **Drop blocked tools** — e.g., remove all map tools for bands 0-1, remove `show_quote` for bands 0-3, remove `show_comparison` for bands 0-2
- **Truncate arrays** — slice `show_timeline.events` to `maxTimelineEvents`, slice `show_genealogy.nodes` to `maxGenealogyNodes`, slice comparison points to `maxComparisonPoints`
- **Simplify** — strip `etymology` and `pronunciation` from `show_key_term` for bands 0-2
- **Force image** — if band ≤ 1 and no `set_scene(image)` exists, inject one as the first tool call
- **Block map scenes** — if `mapToolsEnabled === false`, convert `set_scene(map)` to `set_scene(image)` with a fallback storybook image

Also: store `this.bandProfile = getBandProfile(band)` in the constructor so it's available throughout.

**Also:** update `bandOverrides` type in `content.ts` to optionally include `toolSequence`.

---

## Task 3: Inject narration constraints into `buildNarrationPrompt()`

Modify `agent/src/historyExplainerTools.ts`:

**In `buildNarrationPrompt()`** (line 382):
- Import `getBandProfile` and look up the profile for the current band
- Insert a constraint block into every prompt:
  ```
  NARRATION CONSTRAINTS (STRICT):
  - Maximum {max} words total.
  - Maximum {n} sentences.
  - Maximum {n} words per sentence.
  - Vocabulary: {level} — {explanation}.
  - {toneDirective from bandConfig}
  ```
- **Replace the hardcoded `voiceGuard`** (line 387) — currently says "STRONG, BOLD, AUTHORITATIVE" for all bands. For bands 0-2, replace with the band-specific tone directive (e.g., "warm uncle at bedtime" for band 0).

**In `buildHistoryExplainerPrompt()`** (line 246):
- Replace the crude 3-tier `if/else` (lines 252-273) with `getBandProfile(band)` to generate band-specific system instructions dynamically.

---

## Task 4: TTS voice differentiation in `tts.ts`

Modify `agent/src/tts.ts`:

The `TTSOptions` interface already supports `voiceName` and `speakingRate`. The `synthesizeChunk` method already uses `options.voiceName || 'Charon'` (line 127). **The plumbing exists — it's just never called with band-specific values.**

**In `beatSequencer.ts`** line 185, change:
```typescript
// FROM:
const audioBase64 = await this.tts.synthesize(narratedText) || '';
// TO:
const audioBase64 = await this.tts.synthesize(narratedText, {
  voiceName: this.bandProfile.tts.voiceName,
  speakingRate: this.bandProfile.tts.speakingRate,
}) || '';
```

Voice mapping: Kore (0-1), Leda (2), Orus (3), Charon (4-5). Speaking rates: 0.85 → 1.08.

**Note:** `speakingRate` is not currently passed to the Gemini TTS payload. Add it to the `speechConfig` in `synthesizeChunk`:
```typescript
speechConfig: {
  voiceConfig: { prebuiltVoiceConfig: { voiceName } },
  ...(speakingRate ? { speakingRate } : {}),
}
```

---

## Task 5: Theology gate in narration prompts

Add `theologyGate` data to each `BandProfile` in `bandConfig.ts` (allowed and blocked concept lists from the roadmap table).

In `buildNarrationPrompt()`, append:
```
THEOLOGY SCOPE:
- You may use these concepts: {allowedConcepts.join(', ')}.
- These concepts are above this student's level — paraphrase around them: {blockedConcepts.join(', ')}.
```

This is a prompt-level constraint only — no runtime filtering needed.

---

## Task 6: Visual mix telemetry logging

Add counters to `BeatSequencer` that track how many beats used each scene mode (image/map/overlay/transcript). After the final beat, log a summary comparing actual percentages to the band's target percentages from `bandProfile.visuals`. Log a warning if any category drifts more than 15 percentage points.

```text
[TELEMETRY] Band 2 visual mix: image=45% (target 50%), map=25% (target 20%), overlay=25% (target 25%), transcript=5% (target 5%) — OK
```

This is observability only — no enforcement.

---

## Files Changed

| File | Action |
|---|---|
| `agent/src/bandConfig.ts` | **CREATE** — BandProfile interface + BAND_PROFILES constant |
| `agent/src/beatSequencer.ts` | **MODIFY** — import bandConfig, add `applyBandToolPolicy()`, pass TTS options, add telemetry counters |
| `agent/src/historyExplainerTools.ts` | **MODIFY** — inject narration constraints + theology gate into both prompt builders |
| `agent/src/tts.ts` | **MODIFY** — pass `speakingRate` to Gemini API payload |
| `agent/src/content.ts` | **MODIFY** — extend `bandOverrides` type to include optional `toolSequence` |
| `agent/src/historySessionController.ts` | **MODIFY** — import `getBandProfile` for raise-hand policy (replace hardcoded `band < 3`) |

## Order of Implementation

1. `bandConfig.ts` (no dependencies)
2. `content.ts` type extension (trivial)
3. `tts.ts` speakingRate support (trivial)
4. `historyExplainerTools.ts` prompt constraints (depends on 1)
5. `beatSequencer.ts` tool filtering + TTS wiring + telemetry (depends on 1, 2, 3)
6. `historySessionController.ts` policy update (depends on 1)

## Verification

After implementation, run a lesson with band 0 and band 5 on the same manifest. The logs should show:
- Different word counts in narrated text
- Different tool calls delivered (band 0: no maps, no quotes; band 5: full set)
- Different TTS voices in the `[TTS]` log lines
- Visual mix telemetry summary at lesson end

