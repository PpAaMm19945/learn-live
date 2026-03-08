# Learn Live Project Audit Summary

## Status: Hackathon Ready
The core application loop is fully implemented and verified.

### Fixed/Solved Issues
- [x] **Auth State Structure:** Fixed `EvidenceWitness.tsx` to correctly destructure `familyId` and `userId`.
- [x] **Logger Signatures:** Corrected `src/lib/gemini.ts` to use `(context, message, data)` signature.
- [x] **D1 Schema Alignment:** Ensured `Portfolios` status uses `'pending'` while `Matrix_Tasks` uses `'Awaiting Judgment'`.
- [x] **Quickstart Scripts:** Added `concurrently` and `dev:all` for one-command startup.
- [x] **Documentation:** Comprehensive `README.md` and `Architecture.md` (with Mermaid) completed.

### Notes
- Task 8.3 (Demo Video) requires user recording.
- Task 8.7 (Final E2E) is awaiting live environment testing with real Gemini API keys.

## Phase 13: Explainer Canvas — Known Issues & Risks

### Active Risks
- **Gemini Live tool call reliability** — The Live API's function calling in bidi-streaming mode is experimental. Tool calls may arrive split across chunks. Mitigation: buffer and reassemble in `explainerSession.ts`.
- **Audio-canvas sync drift** — Voice says "look at these blocks" but blocks appear late. Task 13.7 will implement atomic payloads with timestamp-driven queuing. Currently NOT implemented.
- **GeminiSession constructor change** — Added optional `extraTools` parameter. Backward compatible (Evidence Witness sessions pass no extra tools). Tested: existing `evaluate_constraint` tool still declared.
- **Max 7 elements enforced client-side only** — System prompt also instructs the agent, but there's no server-side enforcement. If Gemini ignores the instruction, the client will evict the oldest element.

### Decisions Made
- **Separate WebSocket endpoints**: `/v1/agent/session` (Evidence Witness) vs `/v1/agent/explainer` (Explainer Canvas). Clean separation, independent scaling.
- **Separate WebSocketServer instances** in `server.ts` (`witnessWss` and `explainerWss`).
- **Learner context injection**: Currently uses defaults (name: "Learner", age: 7, band: 2). Task 13.4 marked done for prompt structure; actual D1 fetch is a TODO.
- **Image generation (Nano Banana)**: Deferred to Task 13.9. Canvas ops include `generate_diagram` action but it's a no-op on the client currently.
