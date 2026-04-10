# Learn Live — Changelog

> **Last updated:** 2026-04-10
> One-line-per-decision log, consolidated from phase notes, walkthroughs, and logs.

---

## 2026-02-27 — Legacy Math Platform
- Built math curriculum engine with DAG system, 377 constraint templates across 5 strands
- Evidence Witness (Gemini Live bidi-streaming agent) for watching children do math
- Split Judgment Model, AI Permission Rules, Noise Injection system
- **Decision:** Pivot to African History. All math code archived, not deleted.

## 2026-03-11 — Phase 2: Authentication
- P16: D1 auth schema — Users, Auth_Tokens, Sessions, User_Roles tables
- P17: JWT sessions with HttpOnly cookies (SameSite=None, 7-day expiry)
- P18: Magic link flow — stored email in token ID field to handle null userId constraint
- P19: Google OAuth — CSRF via state token signed as JWT
- P20: Password auth — PBKDF2 (100k iterations, SHA-256) because Workers lack bcrypt
- P21: Account linking — merge by email across all 3 auth methods
- P22-25: Frontend auth store (Zustand), route guards, UI polish

## 2026-03-11 — Phase 3: History Curriculum Schema
- 6 new D1 tables: Topics, Lessons, Sources, RAG_Chunks, Learner_Progress, Quiz_Questions
- R2 content pipeline: upload, chunk, index, keyword-based retrieval
- Frontend: Dashboard topic grid, TopicDetail, LessonView with narrative/sidebar/completion
- API transforms DB columns to match frontend expectations (summary→description, etc.)

## 2026-03-12 — Phase 4: AI Adaptation Engine
- Band adaptation via Gemini 2.5 Flash: master text + band → age-appropriate content
- Adapted_Content D1 cache table to avoid repeated AI calls
- Band 5 skips AI entirely — serves master text directly
- BandSelector, AdaptedContentReader, VocabularyCard, DiscussionQuestions components

## 2026-03-12 — Phase 5: Assessment & Oral Examiner
- Repurposed Evidence Witness as Oral Examiner (Socratic questioning from RAG context)
- Exam sessions with 3 tone tiers (0–1 conversational, 2–3 guided, 4–5 Socratic)
- Artifact verification: child photographs work → AI compares against R2 references

## 2026-03-12 — Phase 6: Explainer Canvas
- History canvas primitives: MapOverlay, Timeline, FigurePrimitives, EventPrimitives
- Agent integration via historyExplainerSession.ts

## 2026-03-13 — Phase 7: Worker Cleanup
- Monolithic worker/src/index.ts (~1300 lines) split into modular routes
- Families table (008_families.sql) with Learners child table

## 2026-03-14 — Phase 8: Pilot Readiness
- Content pipeline scripts, admin analytics, onboarding wizard with band calculator
- Activity logging, feedback widget

## 2026-03-15 — Phase 9: Content Expansion
- Glossary system, world history context sidebars

## 2026-03-16 — Phase 10: UI/UX Overhaul
- Global learner store (Zustand), unified AppShell

## 2026-03-17 — Phase 11: Post-Merge Cleanup
- Progress page, loadFamily() crash resilience, stripMarkdown() utility

## 2026-03-18 — Phase 12: Data Quality
- D1 migration 014, reading polish, error handling

## 2026-03-18 — Phase 13: Content Production
- 30 SVG map overlays, pronunciation dictionary, component data extraction

## 2026-03-19 — Phase 14: SVG Alignment Tool

## 2026-03-20 — Phase 15: Session Engine
- LessonScript types, ScriptPlayer, StorybookPlayer, 9 visual components, generator CLI

## 2026-03-22 — Phase 16: MapLibre Teaching Canvas
- 16A: MapLibre GL JS wrapper, overlay panels, imperative API
- 16B: GeoJSON data for all 9 chapters (27 files)
- 16C: Agent tool-call rewrite with MAPLIBRE_TEACHING_TOOLS

## 2026-03-31 — Phase 20: Live-First Pivot
- **Decision:** Pivot from static scripts to live AI teaching via Gemini Live API
- Deleted 23 legacy files (ScriptPlayer pipeline)
- Created SessionCanvas, session types, ARCHITECTURE_LIVE.md
- Added set_scene tool to agent

## 2026-04-01 — Phases 21–25: Live-First Implementation
- Phase 21: useSession hook, WebSocket connection, audio playback, microphone capture
- Phase 22: TranscriptView kinetic typography
- Phase 23: Agent WebSocket fixes, structured logging
- Phase 24A: StorybookPlayer split-screen redesign
- Phase 24B: Dashboard & page cleanup
- Phase 25: Golden Script recording infrastructure

## 2026-04-07 — Beat Sequencer Pivot
- **Decision:** Pivot from Gemini Live narration to Beat Sequencer architecture
- **Reason:** Gemini Live audio-native model cannot produce structured text, reliable tool calls, or clean transcripts. It is designed for conversational ping-pong, not 10–15 minute autonomous narration.
- **What stays:** Entire frontend (SessionCanvas, TranscriptView, TeachingCanvas, useSession, toolCallHandler), WebSocket protocol, GeoJSON data, content manifest
- **What changes:** Agent side — replace GeminiSession Live with BeatSequencer using regular generateContent streaming API. Gemini Live reserved for student Q&A only (Band 3+).
- Archived: `ARCHITECTURE_LIVE.md` → `.antigravity/archive/`, `JULES_PLAN_PHASE21.md` → `.antigravity/archive/`
- Updated: ROADMAP.md with 6-phase Beat Sequencer plan, ISSUES.md with architectural diagnosis (issues 52–56)

## 2026-04-08 — Phases 3–4: Beat Sequencer & Live Q&A Complete
- Beat Sequencer (`beatSequencer.ts`) iterates beats, calls Gemini `generateContent` per beat, streams transcript + tool calls
- ContentLoader, TTSService, ContentFetcher implemented
- HistorySessionController state machine manages sequencer ↔ live Q&A transitions
- LiveHandler (`liveHandler.ts`) opens short Gemini Live sessions for Band 3+ Q&A on `raise_hand`
- Agent deployed to Cloud Run

## 2026-04-09 — Phase 6: Frontend Bug Fixes, Audit & Model Upgrade
- Fixed missing `RecordedEvent` type in `types.ts` (Issue 57 — build blocker)
- Fixed empty PCM audio chunks causing `createBuffer(0)` errors in `playAudioChunk` (Issue 58)
- Resolved Issues 52, 53 (architectural — superseded by Beat Sequencer)
- **Root cause of Issue 59 found**: `gemini-2.0-flash-exp` model returns 404, causing empty narration → premature `lesson_complete`
- **Model upgrade (Issue 60)**: `GenAINarrator` → `gemini-3-flash-preview`, `GeminiSession` Live → `gemini-3.1-flash-live-preview`
- Full phase audit: Phases 1–4 verified complete, Phase 5 partial, Phase 6 in progress
- **Action required:** Redeploy agent to Cloud Run

## 2026-04-10 — Phase 6B: TTS Provider Migration & Pacing Hardening
- **TTS pivot (Issue 61)**: Replaced Google Cloud TTS (`GOOGLE_TTS_KEY`) with Gemini TTS (`gemini-2.5-flash-preview-tts`) — uses existing `GEMINI_API_KEY`, no new secrets
- Voice: `Charon` (warm informative narrator)
- Beat Sequencer dwell time: if TTS fails, agent waits ~150 WPM reading pace before advancing
- Frontend fallback: browser `speechSynthesis` speaks beat text if server audio is empty
- Frontend dwell time: if no speech synthesis available, text dwells on screen proportional to word count
- **Action required:** Redeploy agent to Cloud Run

## 2026-04-10 — Phase 6C: Full Lesson Runtime Audit
- Audio confirmed working in real user lesson runs end-to-end
- User captured a full beat-by-beat session showing four remaining blockers: transcript/audio desync, no visual scene rendering, beat-to-beat greeting/recap resets, and broken lesson ending / apparent restart
- **Decision:** Prioritize runtime stabilization before implementing the full teaching-philosophy-driven LessonPreparer pipeline
- Updated `.antigravity/ROADMAP.md` and `.antigravity/ISSUES.md` to make the current blockers and next engineering order explicit
