# API Contract
This document outlines the communication protocols between the React Frontend, the Cloudflare Workers Backend, and the eventual Google Cloud Run Agent.

## 1. REST Endpoints (Cloudflare Worker)
These endpoints are served securely on our edge worker to perform standard CRUD operations and evidence handling.

### `POST /api/upload`
Uploads a file (evidence snapshot or transcript) to the R2 `EVIDENCE_VAULT`.

*   **Headers:**
    *   `Authorization: Bearer <API_AUTH_TOKEN>`
*   **Request Body (multipart/form-data):**
    *   `file`: The `File` or `Blob` object.
    *   `pathPrefix`: (Optional) String denoting the folder (e.g., `snapshots`, `transcripts`). Defaults to `uploads`.
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "key": "snapshots/168..._image.jpg",
      "url": "/api/evidence/snapshots/168..._image.jpg"
    }
    ```
*   **Response (Error - 400/401/500):**
    ```json
    {
      "error": "Message describing error",
      "details": "Extended details if applicable"
    }
    ```

## 2. WebSocket Protocol (Google Cloud Run -> Gemini Live)
*(Draft specification for Phase 4)*

The frontend will establish a bidirectional WebSocket connection to the Cloud Run backend, which bridges to the Gemini Live streaming API.

*   **Endpoint:** `wss://<cloud-run-domain>/v1/agent/session`

### Message Shapes

#### C -> S: Initiate Session
```json
{
  "type": "init",
  "payload": {
    "learnerId": "uuid-123",
    "taskId": "task-456",
    // Injected system constraints fetched from D1:
    "constraints": {
       "constraint_to_enforce": "Ensure the learner spells C-A-T.",
       "failure_condition": "Spells it incorrectly 3 times.",
       "success_condition": "Spells it right."
    }
  }
}
```

#### S -> C: Session Ready
```json
{
  "type": "ready",
  "payload": {
    "sessionId": "ses-789",
    "status": "connected"
  }
}
```

#### C -> S: Audio Stream Chunk
Binary audio chunks sent continually while the microphone is active (e.g., 16kHz PCM).

#### S -> C: Agent Response Chunk
Binary audio chunks (or base64 encoded strings) playing the LLM's voice response.

#### S -> C: Verification Event
Triggered when Gemini concludes the constraint was met or failed.
```json
{
  "type": "verification_result",
  "payload": {
    "status": "SUCCESS" | "FAILURE",
    "reason": "The learner correctly identified the sequence of events.",
    "transcript": "Hello Gemini... (full conversation)"
  }
}
```
