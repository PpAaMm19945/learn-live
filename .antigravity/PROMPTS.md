# Learn Live — Prompt Execution Log

> **Last updated:** 2026-04-07
> Consolidated record of all prompts executed across all phases.

---

## Legacy Phases (Summary)

| Phase | What | When |
|-------|------|------|
| 1–7 | Math curriculum engine, DAG, constraints, auth, schema | Feb–Mar 2026 |
| 8–14 | Content pipeline, analytics, onboarding, SVGs, alignment tool | Mar 2026 |
| 15 | Session engine (ScriptPlayer, StorybookPlayer, 9 components) | Mar 20 |
| 16A/B/C | MapLibre TeachingCanvas, GeoJSON (all 9 chapters), agent tool rewrite | Mar 22–24 |
| 20 | Live-First Pivot (deleted ScriptPlayer pipeline, created SessionCanvas) | Mar 31 |
| 21–25 | SessionCanvas wiring, TranscriptView, agent WS fix, StorybookPlayer, Golden Script | Apr 1–3 |

Full prompt details for Phases 1–25 archived. See `.antigravity/archive/JULES_PLAN_PHASE21.md` for Phase 21–25 prompts.

---

## Beat Sequencer Architecture — Phase 1: Three Isolation Tests

> **Goal:** Verify the three foundational capabilities independently before building the Beat Sequencer.
> **Owner:** Developer (agent-side scripts + manual browser verification)
> **Execution:** Sequential — Test A first, then B, then C. Each must pass before proceeding to Phase 2.

---

### Test A — Narration via `generateContent` Streaming

**Purpose:** Prove that the regular Gemini `generateContent` streaming API produces clean, structured narration text with tool call suggestions — unlike the audio-native Live API which only produces `outputAudioTranscription`.

**Create file:** `agent/tests/test-narration.ts`

```
You are writing a standalone test script for the Learn Live agent.

## What this script does

Send a single section of textbook content (Chapter 1, Section 1.1) to the Gemini
generateContent streaming API and print the results. This is NOT a unit test — it is
a throwaway diagnostic script that proves the API produces usable output.

## Context — Read these files first:
- agent/src/historyExplainerTools.ts (tool definitions — MAPLIBRE_TEACHING_TOOLS)
- agent/src/gemini.ts (existing GeminiSession class — DO NOT USE IT for this test)
- agent/package.json (dependencies — @google/genai is already installed)

## Environment:
- GEMINI_API_KEY must be set (read from process.env or .env)
- Run with: cd agent && npx tsx tests/test-narration.ts

## The script must:

1. Import @google/genai and dotenv
2. Load GEMINI_API_KEY from environment
3. Construct a system prompt:
   ```
   You are a history teacher for ages 10-12 (Band 3). You are narrating a lesson
   about "In the Beginning: God, Man, and the Meaning of History" from an African
   History textbook written from a Reformed Christian perspective.

   Narrate the following content in an engaging, age-appropriate way. You may suggest
   tool calls using the available tools to enhance the visual experience.

   Available tools: set_scene, zoom_to, highlight_region, show_scripture, show_timeline.
   Use them naturally when the content calls for geographic or visual illustration.
   ```

4. Send the following content text (Section 1.1 excerpt) as the user message:
   ```
   Section 1.1: In the Beginning: God, Man, and the Meaning of History

   History's True Beginning — In the beginning, God created the heavens and the
   earth (Genesis 1:1). This is not merely a theological statement — it is the
   opening line of history itself. Before there were empires, before there were
   migrations, before the first city rose beside the first river, God spoke the
   universe into being. Every chapter of human history that follows is a chapter
   in His story.

   The Fracture of Creation — But the story of creation is also the story of
   fracture. In Genesis 3, humanity chose autonomy over obedience, and the
   consequences rippled through every dimension of existence. Death entered.
   Relationships fractured. The ground itself was cursed. This is not ancient
   mythology — it is the diagnosis that explains everything that follows in
   human history.

   God's Unfolding Plan — Yet even in judgment, God revealed mercy. The
   protoevangelium of Genesis 3:15 — "He shall bruise your head, and you shall
   bruise his heel" — is the first announcement of redemption. From this point
   forward, all of history moves toward the fulfillment of this promise.

   Judgment and Mercy at Babel — The account of Babel (Genesis 11) is the pivot
   point for African history. When God scattered the nations and confused their
   languages, He was not merely punishing pride. He was setting the stage for the
   peopling of the entire earth — including Africa. The sons of Ham — Mizraim,
   Cush, Phut, and Canaan — went forth to establish the civilizations we will
   study in this course.
   ```

5. Call ai.models.generateContentStream() with:
   - model: "gemini-2.5-flash-preview-05-20" (or latest stable flash model)
   - systemInstruction: the system prompt above
   - contents: [{ role: "user", parts: [{ text: contentText }] }]
   - tools: [{ functionDeclarations: MAPLIBRE_TEACHING_TOOLS }]
   - generationConfig: { temperature: 0.7 }

6. Stream the response and print each chunk:
   - For text chunks: print with prefix [TEXT]
   - For function call chunks: print with prefix [TOOL] and show the tool name + args
   - Print [DONE] when streaming completes

7. At the end, print a summary:
   - Total text length (characters)
   - Number of tool calls received
   - List of tool calls with names and args

## Success criteria (printed at the end):
- [ ] Text output is multi-paragraph, age-appropriate narration (not raw transcription)
- [ ] At least 1 tool call was suggested by the model
- [ ] No **bold** thinking markers in the output (that was the audio model problem)
- [ ] Output is clean, structured text suitable for kinetic typography display

## DO NOT:
- Use the GeminiSession class (that's the Live API wrapper)
- Use responseModalities: ['AUDIO'] (that's what broke everything)
- Import anything from gemini.ts
- Start a WebSocket or Express server
```

---

### Test B — Tool Call Execution via WebSocket

**Purpose:** Prove that the existing frontend (`TeachingCanvas`, `toolCallHandler`, `useSession`) correctly handles a `tool_call` message. This test bypasses Gemini entirely — it sends a hardcoded tool call over WebSocket.

**Create file:** `agent/tests/test-fake-toolcall.ts`

```
You are writing a standalone test script for the Learn Live agent.

## What this script does

Start a minimal WebSocket server that sends hardcoded tool_call messages to the
connected client. The developer will open the frontend in a browser pointing at
this test server and visually verify that tool calls execute on the TeachingCanvas.

## Context — Read these files first:
- agent/src/server.ts (WebSocket upgrade routing — for reference only)
- agent/src/historyExplainerTools.ts (tool definitions — shows correct message format)
- src/lib/canvas/toolCallHandler.ts (frontend handler — shows what it expects)
- src/lib/session/useSession.ts (frontend hook — shows WebSocket message parsing)

## Environment:
- Run with: cd agent && npx tsx tests/test-fake-toolcall.ts
- Frontend must be running (npm run dev) with VITE_AGENT_URL pointing to this test server
- Test server listens on port 8080

## The script must:

1. Import ws and create a WebSocketServer on port 8080
2. Handle the upgrade path for /ws/history-explainer (parse query params, log them)
3. On client connection, send a scripted sequence of messages with delays:

   t=0s:    { type: "transcript", text: "Welcome! Let me show you something amazing.", isFinal: true }
   t=2s:    { type: "tool_call", tool: "set_scene", args: { mode: "map" } }
   t=3s:    { type: "transcript", text: "This is the ancient Near East.", isFinal: true }
   t=4s:    { type: "tool_call", tool: "zoom_to", args: { location: "babel" } }
   t=6s:    { type: "tool_call", tool: "highlight_region", args: { regionId: "mizraim", color: "#fac775" } }
   t=8s:    { type: "tool_call", tool: "place_marker", args: { location: "memphis", label: "Memphis — Capital of Old Kingdom" } }
   t=10s:   { type: "tool_call", tool: "show_scripture", args: { reference: "Genesis 10:6", text: "The sons of Ham: Cush, Mizraim, Phut, and Canaan." } }
   t=13s:   { type: "tool_call", tool: "set_scene", args: { mode: "transcript" } }
   t=14s:   { type: "transcript", text: "Now you've seen how the visual canvas works!", isFinal: true }
   t=16s:   { type: "tool_call", tool: "set_scene", args: { mode: "map" } }
   t=17s:   { type: "tool_call", tool: "draw_route", args: { from: "babel", to: "egypt", style: "migration" } }
   t=19s:   { type: "tool_call", tool: "show_timeline", args: { events: [{ year: -2200, label: "Babel dispersion" }, { year: -2000, label: "Old Kingdom Egypt" }, { year: -1500, label: "New Kingdom" }] } }
   t=22s:   { type: "tool_call", tool: "set_scene", args: { mode: "transcript" } }
   t=23s:   { type: "transcript", text: "Test complete. All tools verified.", isFinal: true }

4. Log each message as it's sent: [SEND] tool_call: zoom_to(babel)
5. Handle client disconnect gracefully
6. Handle client audio messages (just log and ignore): [RECV] audio from client (ignored)

## Verification checklist (manual, in browser):
- [ ] Frontend connects successfully (no WebSocket errors in console)
- [ ] Transcript text appears in TranscriptView
- [ ] set_scene("map") switches to map view (TeachingCanvas visible)
- [ ] zoom_to("babel") causes map to fly to Babel region
- [ ] highlight_region("mizraim") fills Egypt boundary with gold
- [ ] place_marker("memphis") drops a labeled pin
- [ ] show_scripture shows scripture card overlay
- [ ] set_scene("transcript") returns to transcript view
- [ ] draw_route animates a route line
- [ ] show_timeline displays timeline bar
- [ ] No console errors during the sequence

## DO NOT:
- Import or use GeminiSession
- Connect to any AI API
- Send audio data
- Modify any frontend files
```

---

### Test C — Audio Playback via WebSocket

**Purpose:** Prove that the `playAudioChunk` pipeline in `useSession.ts` works — that base64 PCM audio sent over WebSocket plays audibly in the browser.

**Create file:** `agent/tests/test-audio-playback.ts`

```
You are writing a standalone test script for the Learn Live agent.

## What this script does

Start a minimal WebSocket server that generates a simple audio tone (sine wave),
encodes it as 16-bit PCM at 24kHz, base64-encodes it, and sends it to the connected
client as { type: "audio", data: "<base64>" } messages. The developer will listen
in the browser to verify audio plays.

## Context — Read these files first:
- src/lib/session/useSession.ts lines 57-99 (playAudioChunk — shows expected format)

## The expected audio format (from useSession.ts):
- 16-bit signed PCM (little-endian)
- 24000 Hz sample rate
- Mono (1 channel)
- Sent as base64-encoded string in { type: "audio", data: "..." }

## Environment:
- Run with: cd agent && npx tsx tests/test-audio-playback.ts
- Frontend must be running with VITE_AGENT_URL pointing to this test server
- Test server listens on port 8080

## The script must:

1. Import ws and create a WebSocketServer on port 8080
2. Handle the upgrade path for /ws/history-explainer

3. On client connection, send a sequence:

   t=0s:    { type: "transcript", text: "Audio test: you should hear a tone.", isFinal: true }
   t=1s:    Generate and send a 440Hz sine wave tone, 2 seconds long, as PCM audio chunks

   The audio generation:
   - Sample rate: 24000
   - Duration: 2 seconds
   - Frequency: 440 Hz (A4 note)
   - Amplitude: 0.3 (not too loud)
   - Generate as Int16Array (values in range -32768 to 32767)
   - Split into chunks of 4800 samples (200ms each) = 10 chunks
   - For each chunk:
     - Convert Int16Array to Buffer
     - Base64-encode the buffer
     - Send as { type: "audio", data: "<base64>" }
     - Wait 200ms between chunks (simulate real-time streaming)

   t=4s:    { type: "transcript", text: "You should have heard a 440Hz tone for 2 seconds.", isFinal: true }

   t=5s:    Generate and send a second tone: 880Hz (A5), 1 second, as verification
   
   t=7s:    { type: "transcript", text: "Audio test complete. Two tones: 440Hz then 880Hz.", isFinal: true }

4. Log each chunk sent: [AUDIO] Sent chunk 1/10 (9600 bytes, 200ms of audio)
5. Handle client disconnect gracefully

## Verification checklist (manual, in browser):
- [ ] Frontend connects without AudioContext errors
- [ ] A clear 440Hz tone plays for ~2 seconds
- [ ] A clear 880Hz tone plays for ~1 second
- [ ] No audio glitches, pops, or gaps between chunks
- [ ] Transcript messages appear alongside the audio
- [ ] Console shows no "AudioContext was not allowed to start" errors
  (If this error appears, it means the user needs to click before audio plays —
   note this as a finding, it's expected browser behavior)

## DO NOT:
- Import or use GeminiSession
- Connect to any AI API
- Use any audio files or external audio sources
- Modify any frontend files
```

---

### Results Documentation

**Create file:** `agent/tests/RESULTS.md`

```markdown
# Phase 1 — Isolation Test Results

> Run each test, record pass/fail, and note any findings.

## Test A: Narration via generateContent Streaming

- **Date:** 
- **Result:** PASS / FAIL
- **Text output length:** ___ characters
- **Tool calls received:** ___ 
- **Tool call list:** 
- **Clean text (no ** markers)?** YES / NO
- **Age-appropriate narration?** YES / NO
- **Notes:**

## Test B: Tool Call Execution via WebSocket

- **Date:**
- **Result:** PASS / FAIL
- **Tools verified:**
  - [ ] set_scene("map")
  - [ ] zoom_to("babel")
  - [ ] highlight_region("mizraim")
  - [ ] place_marker("memphis")
  - [ ] show_scripture
  - [ ] draw_route
  - [ ] show_timeline
  - [ ] set_scene("transcript")
- **Console errors:** 
- **Notes:**

## Test C: Audio Playback via WebSocket

- **Date:**
- **Result:** PASS / FAIL
- **440Hz tone played?** YES / NO
- **880Hz tone played?** YES / NO
- **Audio glitches?** YES / NO
- **AudioContext errors?** YES / NO
- **Notes:**

## Summary

All three tests must PASS before proceeding to Phase 2 (Beat Data Schema).
```

---

## Phase 2–6 Prompts

Prompts for Phases 2–6 will be written after Phase 1 results are documented and verified. Do not proceed to Phase 2 until all three isolation tests pass.
