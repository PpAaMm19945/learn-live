# Audit: Vertex AI & Gemini 3.1 Migration

## 1. SDK and Initialization
The "old" repository transitioned between different access methods to balance stability with access to preview features.

- **SDK used:** `@google-cloud/vertexai` (Version `1.1.0`).
- **Initialization:**
  ```typescript
  import { VertexAI } from '@google-cloud/vertexai';

  const vertexAI = new VertexAI({
      project: process.env.GCP_PROJECT_ID,
      location: 'us-central1'
  });

  const model = vertexAI.getGenerativeModel({
      model: 'gemini-3.1-pro-preview',
      apiVersion: 'v1beta1' // Explicitly targeting v1beta1 for thinking/preview features
  });
  ```
- **REST Fallback:** To bypass SDK versioning lags, the backend often used raw `fetch` calls to the Vertex AI platform endpoints.

## 2. Authentication Method
The project relied on **Application Default Credentials (ADC)**.
- **Environment:** Cloud Run.
- **Mechanism:** The `@google-cloud/vertexai` SDK automatically retrieved OAuth2 access tokens from the metadata server.
- **Routing:** There were instances where routing used an **API Key** via the `generativelanguage` endpoint, which likely caused 404s when attempting to target "Vertex-only" models like `gemini-3.1-pro-preview`.

## 3. Exact Model & Endpoint Routing
- **Target Models:**
  - `gemini-3.1-pro-preview`
  - `gemini-3-flash-preview`
  - `gemini-3.1-flash-live-preview` (Live API)
- **Qualified Path:** `projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_NAME}`
- **API Versions:** `v1beta1` and `v1alpha`.
- **Region:** `us-central1` (Primary).

## 4. Generation Configuration
The configuration explicitly enabled **Chain of Thought** reasoning using the `thinking_config` block.

```json
{
  "contents": [...],
  "generationConfig": {
    "thinking_config": {
      "include_thoughts": true,
      "thinking_level": "advanced"
    },
    "temperature": 0.4,
    "top_p": 0.95,
    "max_output_tokens": 4096
  }
}
```

## 5. Thinking Extraction Logic
The system failed to surface thinking to the frontend because it was looking for a top-level field that did not exist in the standardized response schema.

- **The Failure:** `const thought = response.candidates[0].thought;` (Resulted in `undefined`).
- **The Correct Logic:** Vertex AI delivers thinking as a **Part** within the `content.parts` array.
- **Vertex AI Schema:**
  ```json
  "parts": [
    {
      "thought": true,
      "text": "Internal reasoning goes here..."
    },
    {
      "text": "Final visible output goes here."
    }
  ]
  ```
- **Current Live Architecture Workaround:** The current system (as of April 2026) uses a regex to strip reasoning wrapped in double-asterisks (`**Thinking...**`) from the transcript stream, as seen in `agent/src/gemini.ts`.

## 6. Root Cause of 404 Errors
The 404 Not Found errors on Vertex endpoints were likely caused by:
1. **Model ID Mismatch:** Attempting to use the "short" ID (`gemini-3.1-pro-preview`) on the Platform REST endpoint without the `publishers/google/models/` prefix.
2. **Region Restrictions:** Targeting a region (e.g., `europe-west1`) where the preview models were not yet whitelisted.
3. **API Version:** Using the `v1` endpoint for `preview` or `live` labeled models which require `v1beta` or `v1alpha`.
