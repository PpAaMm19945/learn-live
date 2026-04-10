

# Fix Plan: No Audio + Instant Lesson End

## Root Cause (Confirmed)

There are **two compounding failures** causing the 2-second lesson:

1. **Missing `GOOGLE_TTS_KEY` secret in Cloud Run deployment.** The `cloudbuild.yaml` only injects `GEMINI_API_KEY` and `AGENT_SERVICE_KEY`. The TTS service logs `GOOGLE_TTS_KEY is missing` on startup and returns `null` for every call. The sequencer converts this to `''` (empty string).

2. **No dwell time for beats without audio.** When `audioData` is empty, the frontend's `playAudioChunk` returns instantly (thanks to the guard we added). All 4 beats fire in rapid succession (~200ms total), then `lesson_complete` arrives, the queue drains, and the session ends.

The narrator model (`gemini-3-flash-preview`) is confirmed valid and working -- the text IS being generated and sent. You just never see it because the beats fly by with no audio pacing.

## Solution: Replace Google Cloud TTS with Gemini TTS

Instead of fixing the `GOOGLE_TTS_KEY` issue (which requires a separate Google Cloud API, a separate billing account, and a separate secret), we will **replace `tts.ts` entirely** with Gemini's own TTS model (`gemini-2.5-flash-preview-tts`). This uses the **same `GEMINI_API_KEY`** you already have deployed -- no new secrets needed.

Benefits:
- Eliminates the `GOOGLE_TTS_KEY` dependency entirely
- Higher quality voices (30 options including warm narrator voices like `Sulafat`, `Charon`, `Orus`)
- Uses the same API key already deployed to Cloud Run
- Returns base64 PCM audio at 24kHz -- exactly what the frontend already expects

## Changes

### 1. Rewrite `agent/src/tts.ts` -- Use Gemini TTS
Replace the Google Cloud TTS service with `gemini-2.5-flash-preview-tts`:

```text
- Model: gemini-2.5-flash-preview-tts
- Endpoint: v1beta REST generateContent
- Voice: Sulafat (warm) or Charon (informative)
- Output: base64 PCM 24kHz mono (same as current frontend expects)
- Auth: GEMINI_API_KEY (already deployed)
```

The REST call shape (from official docs):
```
POST /v1beta/models/gemini-2.5-flash-preview-tts:generateContent
{
  contents: [{ parts: [{ text: "Narrate: ..." }] }],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } }
  }
}
```

Response: `candidates[0].content.parts[0].inlineData.data` = base64 PCM.

### 2. Add beat dwell time in `agent/src/beatSequencer.ts`
Even with TTS working, add a safety net: if `audioBase64` is empty after synthesis, compute a minimum dwell time from text length (~150 WPM reading pace) and `await sleep(dwellMs)` before sending the beat payload. This prevents the instant-drain scenario if TTS ever fails again.

### 3. Add browser `speechSynthesis` fallback in `src/lib/session/useSession.ts`
If `audioData` is empty in a `beat_payload`, use the browser's built-in `speechSynthesis.speak()` as a last-resort fallback. The `playAudioChunk` promise resolves when the utterance ends, keeping beat pacing intact.

### 4. Remove `GOOGLE_TTS_KEY` references
- Remove the warning in the old `tts.ts` constructor
- Remove from `cloudbuild.yaml` (it was never there, but clean up any docs referencing it)

### 5. Update `.antigravity/` documentation
- `ISSUES.md`: Add Issue 61 (Gemini TTS migration), resolve Issue 58
- `CHANGELOG.md`: Log the TTS provider switch
- `ROADMAP.md`: Update Phase 6 status

## After Implementation

You will need to **redeploy the agent** to Cloud Run:
```bash
cd agent
gcloud builds submit --config=cloudbuild.yaml --project=learn-live-488609
```

No new secrets are required -- the existing `GEMINI_API_KEY` powers both narration and TTS.

