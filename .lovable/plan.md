# Plan — Align Agent + Worker on Gemini 3.x (No Paid Throughput Yet)

Two goals:
1. Stop the `404 NOT_FOUND` from the retired `gemini-1.5-flash`.
2. Unify the live tutor, narrator, evaluators, and image gen on the **Gemini 3.x family** so the voice and behavior match.

**Explicitly out of scope (per your instruction):** Vertex AI Provisioned Throughput / GSU orders / migration to the Gemini Enterprise Agent Platform. We stay on the **AI Studio API key path you already use** (`generativelanguage.googleapis.com` + `GEMINI_API_KEY`). No GCP IAM changes, no `global` endpoint config, no PT order. We can revisit PT *after* you've validated the agent end-to-end and traffic justifies the spend.

The leaked `GEMINI_API_KEY` rotation is also out of scope here — that's still on you/Jules in GCP Secret Manager.

---

## Model mapping (final, AI-Studio-compatible only)

| Role | Current (broken/legacy) | New |
|---|---|---|
| Live tutor (audio + tools) | `gemini-2.5-flash-native-audio-latest` | **`gemini-3.1-flash-live-preview`** |
| Narrator (REST text) | `gemini-1.5-flash` ← 404 | **`gemini-3-flash-preview`** |
| Comprehension tracker | `gemini-2.5-flash` | **`gemini-3-flash-preview`** |
| Adapt / evaluateEvidence / parentPrimer / splitJudgment / enrichTask / taskGen / weeklyPlan / examiner | `gemini-2.5-flash` | **`gemini-3-flash-preview`** |
| Image gen (Nano Banana) | `gemini-2.5-flash:generateContent` (broken — text endpoint) | **`gemini-3.1-flash-image-preview`** |
| TTS (beat narration) | `gemini-2.5-flash-preview-tts` | **keep as-is** (no 3.x TTS exists yet) |

Why flash everywhere instead of `gemini-3.1-pro-preview`:
- Pro is slower and more expensive — bad fit for the live audio loop.
- Pro is the model Google's docs push toward Provisioned Throughput. Staying on flash keeps you on the standard pay-as-you-go AI Studio key with no GSU commitment.
- You can selectively promote the 3 evaluator calls (split judgment, evidence eval, parent primer) to `gemini-3.1-pro-preview` later if quality demands it — that's a one-line change per file.

---

## Files to change

### Agent (`agent/`)
1. **`agent/src/gemini.ts`**
   - `GenAINarrator.model`: `gemini-1.5-flash` → `gemini-3-flash-preview`
   - `GeminiSession` connect model: `gemini-2.5-flash-native-audio-latest` → `gemini-3.1-flash-live-preview`
   - Keep `apiVersion: 'v1alpha'` (Live API) and the narrator's `v1beta` REST endpoint. If `v1beta` 404s on 3.x preview models, fall back to `v1` (verify with one curl post-deploy).
2. **`agent/src/comprehensionTracker.ts`** + **`agent/src/scaffolding/comprehensionTracker.ts`** — bump model.
3. **`agent/src/tts.ts`** — leave alone.
4. Sweep `rg "gemini-(1\.5|2\.5)" agent/src/` and bump any stragglers.

### Worker (`worker/src/`)
5. **`worker/src/lib/nanoBanana.ts`** — switch to `gemini-3.1-flash-image-preview:generateContent` and drop the `responseMimeType: 'image/png'` field (image-preview models return inline image parts directly; that field is the reason images come back null today).
6. **`worker/src/lib/parentPrimer.ts`** — model string.
7. **`worker/src/lib/splitJudgment.ts`** — model string.
8. **`worker/src/lib/evaluateEvidence.ts`** — model string.
9. Sweep `rg "gemini-2\.5-flash" worker/src/` for `enrichTask.ts`, `taskGen.ts`, `weeklyPlan.ts`, `examiner/agent.ts`, `content/adapt.ts` and bump.

### SDK
10. **`agent/package.json`** — bump `@google/genai` from `^1.0.0` to `^1.51.0` (Google's stated minimum for 3.1 features). Run `bun install` in `agent/` so the lockfile updates.

### Docs
11. **`.antigravity/CHANGELOG.md`** — add "Model alignment to Gemini 3.x family (AI Studio key path, no Vertex PT)" entry.
12. **`.antigravity/ISSUES.md`** — close the `404` and "voice mismatch / chorus of voices" entries.

---

## What this fixes

- **404 NOT_FOUND** in the narrator — gone.
- **Voice disconnect** between gatekeeper/negotiator (was 2.5 native-audio) and beat TTS (2.5-preview-tts) — both now in the same Gemini 3.x voice family.
- **Nano Banana silently returning null** — real image-preview endpoint with the right response shape.
- **Lesson progression** (already wired last turn) — once the narrator stops 404-ing mid-lesson, `lesson_complete` actually fires and the dashboard advances.

## What this does NOT fix / NOT do

- Does not rotate `GEMINI_API_KEY` (you/Jules in Secret Manager).
- Does not migrate to Vertex AI / Gemini Enterprise Agent Platform.
- Does not buy Provisioned Throughput / GSUs.
- Does not change the `global` vs regional endpoint — staying on `generativelanguage.googleapis.com` (AI Studio), which is region-agnostic and works with the preview models on the free/PAYG key.
- Does not touch the audio engine (the recovery pass you shipped is correct).

## Rate-limit reality check (so you're not surprised)

The AI Studio key has **lower per-minute quotas than Vertex PT**. For a single learner during evaluation testing this is fine. If you start running multiple concurrent sessions you may see `429` from Gemini — at that point we can either (a) add a small backoff to the narrator (already present), (b) tier evaluator calls down, or (c) revisit Vertex PT. We'll cross that bridge when you hit it, not now.

## Acceptance

After your key rotation + this deploy:
1. `[NARRATOR]` calls return 200 — no more 404.
2. `[GEMINI]` Live session opens against `gemini-3.1-flash-live-preview`.
3. Beat TTS and Live tutor sound like the same family.
4. `generate_diagram` returns a real image data URL.
5. Finishing a lesson advances "Continue Lesson" on the dashboard.

## Order of operations

1. You/Jules rotate `GEMINI_API_KEY` in GCP Secret Manager and bounce the Cloud Run revision.
2. You approve this plan → I push the model-string + SDK bump.
3. Deploy worker (`wrangler deploy`) and agent (`gcloud builds submit --config=cloudbuild.yaml`).
4. Run one full Chapter 1 → Section 1 lesson and verify the acceptance list.
