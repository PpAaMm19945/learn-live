### **Handover Instruction: Independent Diagnostic & Alignment Task**

**Objective:** Diagnose and resolve the "Live Agent" audio and response failures.

**Phase 1: Independent Analysis**
Perform an independent investigation into why the Live Agent talks but does not listen or respond.
1.  **Frontend State Analysis:** Review `src/lib/session/useSession.ts`. Analyze the `onaudioprocess` handler inside `setupMicrophone`. Specifically, check if the variables `isMuted` and `isQAActive` are being accessed correctly or if they are trapped in a stale closure.
2.  **Backend SDK Integration:** Review `agent/src/gemini.ts`. Check the `sendAudio` and `sendRealtimeInput` methods. Compare the property names used in the JSON payload (e.g., `media` vs `audio`) with the requirements of the `@google/genai` SDK (v1.48.0+).
3.  **Transcription Logic:** Examine the response handling in `agent/src/gemini.ts`. Look at how `outputTranscription` is parsed from the WebSocket messages.
4.  **Log Triage:** Fetch the latest logs for the `learnlive-agent` service. Look for `usageMetadata` to see if `AUDIO` tokens are being registered as input.

**Phase 2: Alignment with Previous Findings**
Once you have completed your analysis, compare your results with the findings below.

**Finding 1: Frontend Stale Closure**
*   **Issue:** The `onaudioprocess` callback captures the initial `isMuted` state (which is `true` for Band 3+) and never sees the update when a user unmutes.
*   **Suggested Solution:** Use `useRef` to track `isMuted` and `isQAActive` so the latest values are accessible inside the processor loop without restarting the stream.

**Finding 2: Backend Key Mismatch**
*   **Issue:** `sendRealtimeInput` is using the key `media`. The Gemini Live API expects `audio` for raw PCM chunks.
*   **Suggested Solution:** Update `agent/src/gemini.ts` to use `audio: { data, mimeType }`.

**Finding 3: Transcription Parsing Mismatch**
*   **Issue:** The code expects `serverContent.outputTranscription.parts`, but the API is currently returning a flat `text` field: `serverContent.outputTranscription.text`.
*   **Suggested Solution:** Update the message handler to check for `text` first.

**Finding 4: Missing Text Modality**
*   **Issue:** `responseModalities` is set only to `['AUDIO']`.
*   **Suggested Solution:** Update to `['AUDIO', 'TEXT']` for better transcription reliability.

**Phase 3: Execution Condition**
*   **ACTION:** If your independent analysis **matches all findings (1-4) above**, proceed to implement the suggested solutions immediately.
*   **HALT:** If you disagree with any finding or find additional/different root causes, **do not modify the code.** Stop and report the discrepancies to the user.
