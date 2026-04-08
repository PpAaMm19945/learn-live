# Handover Document: Learn Live Platform

This document provides a comprehensive guide for deploying and maintaining the Learn Live platform, following the completion of the Phase 1-5 architectural enhancements.

## 🏗️ System Architecture
- **Frontend**: React + Vite + MapLibre. (Root)
- **Agent**: Node.js WebSocket service (Cloud Run). (`agent/`)
- **Worker**: Cloudflare Worker + D1 + R2. (`worker/`)

## 🔑 Required Secrets & Environment Variables

### Agent (Cloud Run)
| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Google AI Studio key for Gemini 2.5 Flash. |
| `GOOGLE_TTS_KEY` | Google Cloud API key for Text-to-Speech. |
| `AGENT_SERVICE_KEY` | Shared key for authenticating with the Worker. |
| `WORKER_API_URL` | The public URL of your Cloudflare Worker. |

### Worker (Cloudflare)
Use `npx wrangler secret put <NAME>`:
- `JWT_SECRET`: For student/parent authentication.
- `AGENT_SERVICE_KEY`: Shared key for authenticating the Agent.
- `GEMINI_API_KEY`: (Optional) for dynamic content adaptation.

## 📦 Content Pipeline (R2)
All lesson "beats" must be uploaded to the `ASSETS_BUCKET` in R2.

**Path Format**: `beats/{chapterId}/{sectionId}.json`

**Command**:
```bash
npx wrangler r2 object put learnlive-assets/beats/ch01/s01.json --file=docs/curriculum/history/ch01_s01.json
```

## 🚀 Deployment Checklist

### 1. Worker
```bash
cd worker
npm install
npx wrangler deploy
```

### 2. Agent
The agent is containerized.
```bash
cd agent
# Using Google Cloud Build as an example
gcloud builds submit --config cloudbuild.yaml .
```

### 3. Frontend
```bash
npm install
npm run build
# Deploy 'dist/' to Cloudflare Pages or Vercel
```

## 🧪 Verification
Run the smoke test to verify all agent services are active:
```bash
cd agent
npx ts-node tests/smoke-test.ts
```

## 🛠️ Troubleshooting
- **Silence in Lesson**: Check the `GOOGLE_TTS_KEY` and ensure the `agent` has 24000Hz PCM support.
- **Q&A Not Responding**: Verify `GEMINI_API_KEY` has access to the `gemini-2.5-flash-native-audio-latest` model.
- **Content Load Failure**: Ensure `X-Service-Key` matches between Agent and Worker.
