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

## Phase 2 — Beat Data Schema ✅ COMPLETE

**Completed:** April 2026

**Deliverables produced:**
- `docs/curriculum/history/beat-schema.md` — Full schema definition with field documentation and enforcement rules
- `docs/curriculum/history/ch01_s01.json` — Worked example: 4 beats covering Section 1.1

**Key decisions made:**
- `syncTrigger: "start_of_beat"` (all tools fire at beat boundary, not mid-narration)
- Beat-Boundary sync model for V1 (no SSML word-level timestamps needed)
- Young Earth Timeline Anchoring enforced (Ussher/AiG dates only)
- `reformedReflection` is human-authored, never AI-generated

---

## Phase 3 — Beat Sequencer (Agent Side) ✅ COMPLETE

**Completed:** April 2026

**Deliverables produced:**
- `agent/src/beatSequencer.ts` — Core sequencer: iterates beats, orchestrates narration → TTS → delivery
- `agent/src/content.ts` — `ContentLoader` + `Beat`/`SectionManifest` interfaces
- `agent/src/tts.ts` — Google Cloud TTS wrapper (24kHz LINEAR16, `en-US-Studio-O`)
- `agent/src/gemini.ts` — Added `GenAINarrator` class using Gemini REST API (`generateContent`)
- `agent/src/historyExplainerSession.ts` — Wired to instantiate `BeatSequencer` with system prompt

**Key decisions made:**
- Model: `gemini-2.0-flash-exp` for narration (may upgrade to `gemini-2.5-flash` per Test A results)
- TTS uses `GOOGLE_TTS_KEY` env var, `en-US-Studio-O` voice at 0.95x speed
- Audio delivered as complete base64 blob per beat (not chunked streaming)
- `beat_payload` message bundles text + audio + toolCalls in a single atomic message
- Frontend `useSession.ts` already has beat queue state machine to process `beat_payload` messages

---

## Phase 4 — Live Handler for Student Q&A

> **Goal:** Build a thin wrapper that activates Gemini Live only when a student raises their hand (Band 3+), handles a short conversational exchange, then returns control to the Beat Sequencer.
> **Owner:** Agent developer
> **Prerequisite:** Phase 3 complete (Beat Sequencer delivers lessons end-to-end)

---

### Prompt 4A — Create `liveHandler.ts`

**Create file:** `agent/src/liveHandler.ts`

```
You are building the Live Q&A handler for the Learn Live teaching agent.

## What this module does

When a student "raises their hand" during a lesson, the Beat Sequencer pauses and
this handler opens a SHORT Gemini Live session for conversational Q&A. When the
conversation ends, it signals the sequencer to resume.

## Context — Read these files first:
- agent/src/gemini.ts (existing GeminiSession class — USE THIS for the Live connection)
- agent/src/beatSequencer.ts (the sequencer that will pause/resume around Q&A)
- agent/src/historyExplainerSession.ts (where this handler gets wired in)
- agent/src/historyExplainerTools.ts (system prompt builder)

## Architecture

1. Export a class `LiveQAHandler` with:
   - constructor(ws: WebSocket, band: number, systemInstruction: string)
   - async startQA(context: QAContext): Promise<void>
     - context includes: currentBeatTitle, currentBeatContent, recentTranscript (last 3 beats)
   - stopQA(): void

2. LiveQAHandler behavior:
   a. Opens a Gemini Live session using the existing GeminiSession class
   b. System prompt includes lesson context + instruction:
      "The student has a question about: [currentBeatTitle]. 
       Recent lesson content: [recentTranscript].
       Answer briefly and clearly at Band [N] level.
       When the question is answered, say 'Let's continue with the lesson.'"
   c. Forwards student mic audio (received as { type: 'audio', data } from client WS)
      to the Live session
   d. Forwards Live session audio responses back to client as { type: 'audio', data }
   e. Forwards Live session transcript as { type: 'transcript', text, isFinal }
   f. Detects conversation end via:
      - Model says "let's continue" (regex match on transcript)
      - Student stops speaking for 10 seconds (silence timeout)
      - Hard timeout of 2 minutes
   g. On end: closes Live session, sends { type: 'qa_complete' } to client, resolves promise

3. Error handling:
   - If Live session fails to open, send { type: 'qa_complete' } immediately (fail-safe resume)
   - Log all errors but never leave the sequencer stuck in paused state

## Gemini Live Config (CRITICAL — use the "Golden Config"):
- Model: 'gemini-2.5-flash-native-audio-latest' on v1alpha
- responseModalities: ['AUDIO'] (strictly — no text modality)
- systemInstruction: { parts: [{ text }] } wrapper format
- Kickoff: sendClientContent with turns array
- Every functionCall must get a toolResponse (functionResponses with scheduling: SILENT)

## Do NOT:
- Create a new Gemini client — reuse the existing patterns in gemini.ts
- Make the Q&A session long — 2 minute hard cap
- Allow Q&A for Band 0, 1, or 2 (listen-only bands)
```

---

### Prompt 4B — Wire Q&A into BeatSequencer and Session

**Modify files:** `agent/src/beatSequencer.ts`, `agent/src/historyExplainerSession.ts`

```
You are wiring the Live Q&A handler into the existing Beat Sequencer.

## Context — Read these files first:
- agent/src/liveHandler.ts (the handler you just created)
- agent/src/beatSequencer.ts (current sequencer — needs pause/resume hooks)
- agent/src/historyExplainerSession.ts (session entry point — needs raise_hand handling)

## Changes to beatSequencer.ts:

1. Add a method: `getContext(): QAContext`
   - Returns { currentBeatTitle, currentBeatContent, recentTranscript }
   - recentTranscript = concatenated contentText from the last 3 completed beats

2. The sequencer already has pause() and resume() — no changes needed there.

## Changes to historyExplainerSession.ts:

1. Create a `LiveQAHandler` instance alongside the `BeatSequencer`
2. In the ws.on('message') handler, add a case for { type: 'raise_hand' }:
   a. If band < 3, ignore (log and skip)
   b. Call sequencer.pause()
   c. Call liveHandler.startQA(sequencer.getContext())
   d. When startQA resolves, call sequencer.resume()
3. Forward incoming { type: 'audio', data } messages to the liveHandler
   when a Q&A session is active (need a boolean flag: isQAActive)

## Do NOT:
- Change the WebSocket protocol — all existing message types stay the same
- Allow Q&A to interrupt mid-beat — pause only happens at beat boundaries
- Remove any existing functionality
```

---

### Prompt 4C — Frontend "Raise Hand" Button

**Modify files:** `src/components/session/SessionCanvas.tsx`, `src/lib/session/useSession.ts`

```
You are adding the "Raise Hand" button to the session UI.

## Context — Read these files first:
- src/components/session/SessionCanvas.tsx (the main session view)
- src/lib/session/useSession.ts (WebSocket hook — handles message types)
- src/lib/session/types.ts (message type definitions)

## Changes to useSession.ts:

1. Add a new state: isQAActive (boolean, default false)
2. Handle new message type 'qa_complete':
   - Set isQAActive = false
3. Add a sendRaiseHand() function:
   - Sends { type: 'raise_hand' } over WebSocket
   - Sets isQAActive = true
4. Expose isQAActive and sendRaiseHand in the return object

## Changes to SessionCanvas.tsx:

1. Add a "Raise Hand" button (only visible when band >= 3)
2. Use an appropriate icon (Hand or similar from lucide-react)
3. Position: bottom-right area, floating over the canvas
4. Styling: subtle when idle, highlighted when Q&A is active
5. Disabled during connecting/reconnecting states
6. When Q&A is active, show a visual indicator (pulsing ring, label change to "Listening...")
7. On qa_complete, return to normal state

## Changes to types.ts:

1. Add 'qa_complete' to the AgentMessage type union if not already present

## Design:
- Use semantic tokens from the design system (--primary, --accent, etc.)
- The button should feel natural in the immersive session layout
- It should NOT obstruct the transcript or map view
```

---

### Prompt 4D — Verification

```
## Phase 4 Verification Checklist

Run these tests to confirm Phase 4 is complete:

1. Build check:
   cd agent && npm run build  (zero errors)
   npm run build              (zero errors, root)

2. Manual test — Band 3 session:
   - Start agent: cd agent && npm start
   - Open browser to lesson player, connect as Band 3
   - Let 1-2 beats play
   - Click "Raise Hand"
   - Verify: sequencer pauses, Q&A mode activates
   - Speak a question
   - Verify: Gemini responds via audio
   - Verify: Q&A ends (model says "let's continue" or timeout)
   - Verify: { type: 'qa_complete' } received
   - Verify: sequencer resumes from next beat

3. Manual test — Band 2 session:
   - Connect as Band 2
   - Verify: "Raise Hand" button is NOT visible
   - Verify: sending { type: 'raise_hand' } via console is ignored by agent

4. Edge case — Q&A failure:
   - Kill the Gemini connection mid-Q&A
   - Verify: handler sends qa_complete (fail-safe)
   - Verify: sequencer resumes (never gets stuck)

Record results in agent/tests/RESULTS.md under a Phase 4 section.
```

---

## Phase 5 — Content Pipeline

> **Goal:** Wire the agent to fetch beat JSON from the Worker API (or local filesystem for dev). Remove all hardcoded content paths.
> **Owner:** Agent developer + Worker developer
> **Prerequisite:** Phase 4 complete

---

### Prompt 5A — Content Fetcher Module

**Create file:** `agent/src/contentFetcher.ts`

```
You are building the content fetcher for the Learn Live agent.

## What this module does

Fetches beat JSON for a given chapter/section from one of two sources:
1. LOCAL: reads from docs/curriculum/history/ filesystem (dev mode)
2. REMOTE: fetches from Worker API endpoint (production)

## Context — Read these files first:
- agent/src/content.ts (existing ContentLoader — will be REPLACED by this module)
- agent/src/beatSequencer.ts (consumes SectionManifest)
- agent/.env (WORKER_API_URL, AGENT_SERVICE_KEY)

## Architecture

1. Export a class `ContentFetcher` with:
   - constructor(workerUrl: string, serviceKey: string)
   - async fetchSection(chapterId: string, sectionId: string): Promise<SectionManifest | null>

2. Fetch logic:
   a. If WORKER_API_URL is set and not 'local':
      - GET {WORKER_API_URL}/api/chapters/{chapterId}/sections/{sectionId}/beats
      - Headers: { 'X-Service-Key': AGENT_SERVICE_KEY }
      - Parse response as SectionManifest
   b. Else (local dev mode):
      - Read from docs/curriculum/history/{chapterId}_{sectionId}.json
      - Same logic as current ContentLoader

3. Caching: cache the fetched manifest in memory for the session duration
   (a Map<string, SectionManifest>)

4. Error handling:
   - Network failures: return null, log error
   - 404: return null, log "section not found"
   - Parse failures: return null, log error

## Do NOT:
- Delete content.ts yet — keep the interfaces (Beat, SectionManifest) there
- Add any new dependencies
- Change the SectionManifest interface
```

---

### Prompt 5B — Worker Endpoint for Beat Data

**Create or modify:** `worker/src/routes/content.ts`

```
You are adding a beat data endpoint to the Cloudflare Worker.

## What this endpoint does

Serves beat JSON files stored in R2 at the path:
  beats/{chapterId}/{sectionId}.json

## Context — Read these files first:
- worker/src/index.ts (main router)
- worker/src/routes/ (existing route patterns)
- worker/wrangler.toml (bindings — R2 bucket name)

## Endpoint

GET /api/chapters/:chapterId/sections/:sectionId/beats

1. Auth: Require X-Service-Key header matching AGENT_SERVICE_KEY env var
2. Fetch from R2: `beats/{chapterId}/{sectionId}.json`
3. If not found: return 404 { error: "Section not found" }
4. If found: return the JSON with Content-Type: application/json
5. Add Cache-Control: max-age=3600 (beat content changes infrequently)

## R2 Upload Process (manual, documented):

To upload a beat file:
  npx wrangler r2 object put learnlive-content/beats/ch01/s01.json --file=docs/curriculum/history/ch01_s01.json

Document this command in the endpoint file as a comment.

## Do NOT:
- Store beats in D1 (they are authored JSON, not user data)
- Change any existing endpoints
- Add authentication beyond the service key check
```

---

### Prompt 5C — Wire ContentFetcher into Session

**Modify:** `agent/src/historyExplainerSession.ts`

```
You are replacing the local ContentLoader with the new ContentFetcher.

## Context — Read these files first:
- agent/src/contentFetcher.ts (the new fetcher)
- agent/src/historyExplainerSession.ts (current session handler)
- agent/src/beatSequencer.ts (consumes the manifest)

## Changes:

1. Import ContentFetcher instead of ContentLoader
2. At session start, create a ContentFetcher instance:
   const fetcher = new ContentFetcher(
     process.env.WORKER_API_URL || 'local',
     process.env.AGENT_SERVICE_KEY || ''
   );
3. Fetch the section: const manifest = await fetcher.fetchSection(chapterId, sectionId)
4. If null: send error to client and close
5. Pass manifest.beats to BeatSequencer (modify sequencer to accept beats directly
   instead of calling loadSection internally)

## Changes to beatSequencer.ts:

1. Change start() signature: start(beats: Beat[], sectionId: string) instead of
   start(chapterId, sectionId)
2. Remove internal ContentLoader usage — beats are provided externally
3. Keep all other behavior identical

## Do NOT:
- Remove content.ts (keep the interfaces)
- Change the WebSocket protocol
- Change any frontend code
```

---

### Prompt 5D — Verification

```
## Phase 5 Verification Checklist

1. Build check:
   cd agent && npm run build  (zero errors)
   npm run build              (zero errors, root)

2. Local dev test:
   - Ensure WORKER_API_URL is NOT set (or set to 'local')
   - Start agent, connect via browser
   - Verify: ch01_s01.json loads from local filesystem
   - Verify: beats narrate correctly

3. Remote test (after Worker deploy):
   - Upload ch01_s01.json to R2: 
     npx wrangler r2 object put learnlive-content/beats/ch01/s01.json --file=docs/curriculum/history/ch01_s01.json
   - Deploy Worker: cd worker && npx wrangler deploy
   - Set WORKER_API_URL in agent env
   - Connect via browser
   - Verify: beats fetched from Worker API
   - Verify: lesson plays correctly

4. Error test:
   - Request a non-existent section (e.g., ch99_s99)
   - Verify: graceful error message sent to client
   - Verify: no crash

Record results in agent/tests/RESULTS.md under a Phase 5 section.
```

---

## Phase 6 — Frontend Integration & Polish

> **Goal:** Full end-to-end lesson flow verified. Dashboard shows sections, lessons play, Q&A works, completion is recorded.
> **Owner:** Full stack
> **Prerequisite:** Phase 5 complete

---

### Prompt 6A — Section-Level Lesson Picker

**Modify:** `src/pages/Dashboard.tsx`, `src/pages/LessonPlayerPage.tsx`

```
You are adding section-level navigation to the dashboard.

## Context — Read these files first:
- src/pages/Dashboard.tsx (current chapter-level dashboard)
- src/pages/LessonPlayerPage.tsx (current lesson player entry)
- worker/scripts/output/content-manifest.json (sections per chapter)

## Changes to Dashboard:

1. When a student taps a chapter, expand to show sections:
   - "1.1 In the Beginning: God, Man, and the Meaning of History"
   - "1.2 The Gift of the Nile"
   - etc.
2. Each section shows: title, estimated duration, completion status
3. Tapping a section navigates to LessonPlayerPage with both chapterId and sectionId

## Changes to LessonPlayerPage:

1. Accept sectionId from route params (currently only has chapterId)
2. Pass sectionId to SessionCanvas / useSession
3. Update the WebSocket URL to include section: ?chapter=ch01&section=s01&band=3

## Design:
- Sections expand/collapse within chapters (accordion pattern)
- Completed sections show a checkmark
- Use existing shadcn Accordion component
- Maintain the "home library" aesthetic
```

---

### Prompt 6B — Lesson Complete Screen

**Modify:** `src/components/session/SessionCanvas.tsx`, `src/lib/session/useSession.ts`

```
You are adding the lesson complete experience.

## Context — Read these files first:
- src/components/session/SessionCanvas.tsx
- src/lib/session/useSession.ts
- docs/curriculum/history/ch01_s01.json (beat data with homework/reflection fields)

## Changes to useSession.ts:

1. Handle { type: 'lesson_complete' } message:
   - Set status to 'ended'
   - Store the lesson metadata (homework, research prompts) if included in the message

## Changes to SessionCanvas.tsx:

1. When status === 'ended', show a wrap-up screen instead of the session view:
   - "Lesson Complete" heading
   - Think It Through questions (from the section manifest)
   - Homework assignments (reading, writing, discussion)
   - Research prompt
   - "Return to Dashboard" button
2. Animate the transition (fade from session to wrap-up)

## Design:
- Warm, celebratory but not flashy — this is a serious educational product
- Use the existing typography system
- Semantic tokens only (--background, --foreground, --primary, etc.)
```

---

### Prompt 6C — Progress Recording

**Modify:** Worker routes, frontend

```
You are recording section completion in the database.

## Context — Read these files first:
- worker/src/routes/ (existing API patterns)
- worker/db/ (existing D1 schema)

## Changes:

1. Worker endpoint: POST /api/progress/complete
   Body: { learnerId, chapterId, sectionId, band, durationSec }
   - Upserts into a progress table: learner_id, chapter_id, section_id, completed_at, duration_sec
   - Returns 200 OK

2. Frontend: After lesson_complete, call the endpoint via fetch
   - Fire-and-forget (don't block the wrap-up screen)
   - Log errors but don't show to user

3. Dashboard: Query progress to show completion checkmarks on sections

## D1 Migration (if table doesn't exist):

CREATE TABLE IF NOT EXISTS section_progress (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  learner_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  band INTEGER NOT NULL,
  duration_sec INTEGER,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(learner_id, chapter_id, section_id)
);
```

---

### Prompt 6D — End-to-End Verification

```
## Phase 6 — Final Verification Checklist

This is the complete end-to-end flow that must work before the project ships:

1. Build check:
   npm run build              (zero errors)
   cd agent && npm run build  (zero errors)

2. Full flow — Band 3:
   □ Dashboard loads, Chapter 1 visible
   □ Tap Chapter 1 → sections expand (1.1, 1.2, etc.)
   □ Tap Section 1.1 → SessionCanvas opens
   □ WebSocket connects to agent
   □ Agent fetches ch01_s01.json beats
   □ Beat 1: transcript text streams, show_scripture fires, show_timeline fires
   □ Beat 2: transcript continues, show_scripture fires
   □ Beat 3: transcript continues
   □ Beat 4: set_scene("map") fires, map appears, zoom_to("babel"), regions highlight
   □ Audio plays for each beat (TTS)
   □ Student raises hand → Q&A exchange → resume
   □ All beats complete → lesson_complete message
   □ Wrap-up screen: Think It Through questions, homework
   □ Progress recorded in D1
   □ Return to dashboard → Section 1.1 shows checkmark

3. Full flow — Band 2:
   □ Same as above BUT:
   □ No "Raise Hand" button visible
   □ Narration uses band-adapted text (if bandOverrides present)

4. Error cases:
   □ Non-existent section → graceful error
   □ Agent crash mid-lesson → reconnection attempt
   □ Q&A failure → sequencer resumes (fail-safe)

Record final results in agent/tests/RESULTS.md under Phase 6.
```

---

## Post-Phase 6 — Remaining Content Work

After Phase 6 is verified with Chapter 1 Section 1.1, the following content authoring
work proceeds incrementally (no code changes needed):

1. Author beat JSON files for remaining Ch1 sections (1.2–1.5)
2. Upload each to R2: `npx wrangler r2 object put learnlive-content/beats/ch01/s02.json --file=...`
3. Add bandOverrides for Bands 2 and 5 (younger and adult learners)
4. Add reformedReflection fields (human-curated from askpuritans.com)
5. Author beat JSON for Chapters 2–9 (same process)
6. Commission illustrations for Chapters 2–9
