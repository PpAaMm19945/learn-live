# Learn Live — Prompt Execution Log

> **Last updated:** 2026-03-24
> Consolidated record of all Jules/agent prompts executed across all phases.

---

## Legacy Phases 1–7 (Math Curriculum — ARCHIVED)

All legacy phases executed 2026-02-27. Math curriculum engine, DAG system, constraint templates, Gemini agent, Evidence Witness, Parent Judgment — all built and archived to `src/archive/` and `worker/src/archive/`.

---

## Phase 2: Authentication & Account System ✅

| Prompt | Task | Key Files |
|--------|------|-----------|
| P16 | D1 Auth Schema | `worker/db/migrations/002_auth_tables.sql` |
| P17 | JWT & Cookie Utilities | `worker/src/lib/auth/jwt.ts`, `cookies.ts`, `middleware.ts` |
| P18 | Magic Link Flow | `worker/src/lib/auth/magicLink.ts` |
| P19 | Google OAuth Flow | `worker/src/lib/auth/google.ts` |
| P20 | Password + Email Verification | `worker/src/lib/auth/password.ts`, `emailVerification.ts` |
| P21 | Account Linking | `worker/src/lib/auth/accountLink.ts` |
| P22 | Auth Middleware & `/api/auth/me` | Wired in `worker/src/index.ts` |
| P23 | Frontend Auth Store | `src/lib/auth.ts`, Login/Register pages |
| P24 | UI Polish & Route Guards | Auth pages polished, `ProtectedRoute` |
| P25 | Smoke Test & Cleanup | Legacy archived, build verified |

---

## Phase 3: African History Curriculum ✅

4 parallel Jules instances + integration step (2026-03-11).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | D1 Schema (Topics, Lessons, Sources, RAG_Chunks, Progress, Quiz) | `003_history_curriculum.sql` |
| B | R2 Content Pipeline (ingest, chunk, retrieve) | `worker/src/lib/content/` |
| C | Frontend UI (Dashboard, TopicDetail, LessonView) | `src/pages/parent/` |
| D | Quiz & Progress Components | `src/components/quiz/`, `progress/` |

---

## Phase 4: Content Ingestion & AI Adaptation ✅

4 parallel instances (2026-03-12).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | Band Adaptation Prompt Pipeline | `worker/src/lib/content/adapt.ts` |
| B | BandSelector + AdaptedContentReader UI | `src/components/content/` |
| C | Content Serving API + D1 Cache | `worker/src/routes/content.ts`, `004_adaptation_cache.sql` |
| D | ReadingView Page | `src/pages/ReadingView.tsx` |

---

## Phase 5: Assessment & Oral Examiner ✅

4 parallel instances (2026-03-12).

| Instance | Task | Key Files |
|----------|------|-----------|
| A | Oral Examiner Agent | `worker/src/lib/examiner/agent.ts` |
| B | Exam Session API Routes | `worker/src/routes/examiner.ts`, `005_exam_sessions.sql` |
| C | Frontend Exam UI | `src/pages/ExamView.tsx`, `src/components/exam/` |
| D | Artifact Verification | `worker/src/routes/artifacts.ts`, `006_artifacts.sql` |

---

## Phases 6–15: Summary ✅

| Phase | Task | When |
|-------|------|------|
| 6 | Explainer Canvas (primitives, agent integration) | Mar 12 |
| 7 | Worker Cleanup (monolith → modular router, families) | Mar 13 |
| 8 | Content Pipeline, Admin Analytics, Onboarding | Mar 14 |
| 9 | Glossary, World History Context Sidebars | Mar 15 |
| 10 | Zustand Learner Store, AppShell, Dashboard Redesign | Mar 16 |
| 11 | Post-Merge Cleanup, Progress Page | Mar 17 |
| 12 | Data Quality, Reading Polish, Error Handling | Mar 18 |
| 13 | 30 SVG Maps, Pronunciation Dictionary, Component Data | Mar 18 |
| 14 | SVG Alignment Tool | Mar 19 |
| 15 | Session Engine (LessonScript, ScriptPlayer, StorybookPlayer, 9 components, generator CLI) | Mar 20 |

---

## Phase 16: MapLibre Teaching Canvas ✅

### 16A: MapLibre Integration + TeachingCanvas Shell ✅
- Installed `maplibre-gl`, created `TeachingCanvas.tsx` with imperative API
- Overlay panels: ScriptureCard, GenealogyPanel, TimelineBar, FigureCard
- Wired into ScriptPlayer

### 16B: Historical GeoJSON Data (All 9 Chapters) ✅
- Created 27 GeoJSON files (3 per chapter: regions, routes, markers)
- Named locations registry (`locations.ts`) with all cities/sites
- Chapter loader (`index.ts`)

### 16C: Agent Tool-Call Rewrite ✅
- `historyExplainerTools.ts` — 9 MapLibre-native tool definitions
- `historyExplainerSession.ts` — forwards tool calls as JSON to frontend
- `buildHistoryExplainerPrompt()` — MapLibre canvas usage instructions

### Stream B: Lesson Script Generation ✅
- Updated `scripts/generate_lesson_script.ts` for MapLibre tool names
- Generated band 3 scripts for all 9 chapters → `src/data/lessons/`

### Stream C: E2E Wiring ✅
- `adaptRawScript.ts` — transforms raw JSON → LessonScript format
- `src/data/lessons/index.ts` — dynamic loader with adapter
- ScriptPlayer tool-call bridge (`__tool_call__` → TeachingCanvas)
- ComponentRenderer filters internal cues

---

## Phase 16D: Live WebSocket + Audio Integration ← NEXT

See `JULES_PLAN_PHASE17.md` for full prompt.

**Key deliverables:**
- Complete `useWebSocketCanvas.ts` with Web Audio API streaming
- Add "Dialogue" phase to ScriptPlayer with live AI narration
- Wire microphone input for learner speech
- Integrate VoiceIndicator, TranscriptPanel, CanvasActionLog

---

## Phase 17: Chapter 1 E2E Deployment ← NEXT

See `JULES_PLAN_PHASE17.md` for full prompt.

**Key deliverables:**
- Agent deployment preparation (Dockerfile, cloudbuild.yaml)
- Progress saving on lesson completion
- Error handling and fallback modes

---

## Phase 18: Multi-Band Support ← PLANNED

See `JULES_PLAN_PHASE17.md` for full prompts.

**Key deliverables:**
- 18A: Band 0-1 storybook scripts + illustrations for Chapter 1
- 18B: Band 2, 4, 5 lesson scripts for Chapter 1

---

## Phase 19: UI Redesign ← PLANNED

See `JULES_PLAN_PHASE17.md` for full prompts.

**Key deliverables:**
- 19A: Library shelf dashboard replacing accordion layout
- 19B: Remove deprecated pages, simplify onboarding, PostLessonSummary
