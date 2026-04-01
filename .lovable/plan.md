
Audit summary:
- I inspected the new live session stack: `SessionCanvas`, `useSession`, golden-script routes, agent websocket server, and the older `useWebSocketCanvas` implementation.
- Your logs point to two separate failures happening together:
  1. the live agent WebSocket is failing before the session ever starts
  2. the fallback golden-script fetch is hitting the wrong URL and trying to parse an HTML app page as JSON

What is most likely broken right now:
1. Fallback URL bug on the frontend
- In `src/components/session/SessionCanvas.tsx`, fallback uses:
  - `fetch('/api/golden-scripts/${chapterId}/${band}')`
- But this app usually talks to the worker via `import.meta.env.VITE_WORKER_URL` and many other files already do that.
- In preview/production, `/api/...` on the frontend host can return the SPA HTML shell, which exactly matches your error:
  - `Unexpected token '<', "<!doctype "... is not valid JSON`
- So this is a confirmed bug, independent of GCP.

2. Agent WebSocket still failing at connection/upgrade/service level
- Frontend connects to:
  - `wss://learnlive-agent-.../ws/history-explainer?...`
- Agent server does accept `/ws/history-explainer` in `agent/src/server.ts`.
- Since the browser reports WebSocket failure before any JSON traffic, the likely causes are:
  - Cloud Run/service not healthy
  - upgrade request rejected before websocket session starts
  - agent crashes early during/after upgrade
  - environment/config issue in the agent deployment

3. There is also a likely next bug in audio format handling
- `useSession.ts` sends microphone chunks as base64 `audio/webm;codecs=opus` blobs.
- `agent/src/historyExplainerSession.ts` forwards that payload into `gemini.sendAudio(Buffer.from(msg.data, 'base64'))`
- `agent/src/gemini.ts` then labels it as:
  - `mimeType: "audio/pcm;rate=16000"`
- That is a format mismatch: webm/opus bytes are being declared as PCM.
- This may not be the first failure you are seeing, but it is very likely the next one once WS opens.

4. Audio playback path may also be wrong
- `useSession.ts` receives `audio` messages and uses `decodeAudioData(...)`
- But the agent appears to forward Gemini inline audio chunks directly, which may not be browser-decodable container audio depending on format.
- The older `useWebSocketCanvas.ts` had explicit PCM handling logic for `audio/pcm`.
- So after WS is fixed, playback may still fail unless formats are standardized.

Manual checks you should run now:
1. Check the fallback endpoint directly in browser
- Open:
  - `{WORKER_URL}/api/golden-scripts/ch01/2`
- Expected:
  - JSON response, or a clean JSON 404 like `{ "error": "Golden script not found" }`
- Bad sign:
  - HTML page / app shell / Cloudflare error page
- This confirms whether worker routing is correct.

2. Check the exact same path from the frontend host
- Open:
  - `https://<preview-host>/api/golden-scripts/ch01/2`
- Expected right now:
  - likely HTML, which confirms the relative URL bug in `SessionCanvas.tsx`

3. Check agent health endpoint
- Open:
  - `https://learnlive-agent-3wsr2gnwba-uc.a.run.app/health`
- Expected:
  - JSON like `{ status: "ok", service: "learnlive-agent" }`
- If this fails, the issue is deployment/service-level, not frontend.

4. Check websocket handshake at service edge
- In DevTools Network, filter for `history-explainer`
- Retry a session
- Inspect the failed request details:
  - status code if present
  - response headers
  - response preview/body if any
- What to record:
  - 101 = upgraded correctly
  - 400 = missing params / request malformed
  - 404 = route not served by Cloud Run
  - 500/502/503 = backend crash/startup/service issue
  - HTML error body = proxy/platform error page

5. Collect GCP logs around one exact attempt
- Use the timestamp from one failed attempt, e.g. around `2026-04-01T10:26:15Z` to `10:26:33Z`
- Search for:
  - `/ws/history-explainer`
  - `HISTORY_EXPLAINER`
  - `GEMINI`
  - `upgrade`
  - uncaught exceptions
- What you want to know:
  - did the request reach `historyExplainerWss.on('connection')`?
  - did `handleHistoryExplainerSession(...)` start?
  - did it fail on worker fetches (`/api/chapters/...` or `/api/family/...`)?
  - did `GeminiSession.connect()` throw?

How to interpret GCP logs quickly:
- If you see no `History Explainer session initiated` log:
  - request likely never upgraded correctly or never reached the route
- If you see session initiated, but no `System prompt assembled`:
  - failure is in content/profile fetch stage
- If you see `System prompt assembled` and `Connecting to Live API...` but no successful Gemini open:
  - failure is Gemini API credentials/model/live session setup
- If you see Gemini connect but frontend still disconnects:
  - payload/message handling issue after connection

High-confidence fixes I would implement next:
1. Fix frontend fallback URL usage
- Change `SessionCanvas.tsx` to use worker base URL:
  - `const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev'`
  - fetch `${apiUrl}/api/golden-scripts/${chapterId}/${band}`
- Also guard JSON parsing:
  - read `res.headers.get('content-type')`
  - if not JSON, log response text and fail gracefully

2. Improve fallback diagnostics
- In fallback fetch, log:
  - URL used
  - status code
  - content-type
  - first ~200 chars of response text when non-JSON
- This will stop the unhelpful generic `Unexpected token '<'` loop.

3. Audit Cloud Run websocket ingress config
- Confirm Cloud Run allows websocket upgrades for this service and that no CDN/proxy layer rewrites the path.
- Since the route exists in code, infra/path handling is now the top suspect.

4. Normalize audio transport end-to-end
- Pick one format and keep it consistent:
  - browser mic capture format
  - websocket payload
  - agent `sendAudio`
  - Gemini declared `mimeType`
  - frontend playback decoding
- Right now the system mixes webm/opus, PCM labels, and generic browser decode.

5. Reuse the older proven websocket audio logic where possible
- `src/lib/canvas/useWebSocketCanvas.ts` contains more explicit PCM playback handling than the new `useSession.ts`.
- I would use it as the reference implementation for the repaired live stack.

Recommended manual verification sequence after fixes:
1. Load `/play/ch01` for a Band 2 learner
2. Confirm no fallback JSON parse error appears
3. Confirm websocket request shows either:
   - successful 101 upgrade, or
   - a clear non-101 status we can trace
4. Confirm agent logs show:
   - session initiated
   - content fetched
   - prompt assembled
   - Gemini connect attempt
5. If live connection still fails, confirm fallback now:
   - fetches worker JSON correctly
   - either replays a golden script or shows clean “not found” behavior
6. After WS starts working:
   - verify transcript chunks render
   - verify `set_scene` changes scene
   - verify map tools reach `TeachingCanvas`
   - then test mic/audio separately, because that path is likely still unstable

What I would prioritize in the next implementation pass:
1. Fix `SessionCanvas` fallback URL and response parsing first
2. Add stronger WS/fallback logging on the client
3. Use your GCP logs to isolate whether the WS failure is:
   - before upgrade
   - during session bootstrap
   - during Gemini connect
4. Then repair the audio format contract across frontend ↔ agent ↔ Gemini

If you want the next plan revision after you pull GCP logs, I’d structure it around:
- frontend fallback hardening
- websocket handshake diagnostics
- agent bootstrap observability
- audio transport normalization
