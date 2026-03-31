# Learn Live — Prompt Execution Log

> **Last updated:** 2026-03-31
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
- `historyExplainerTools.ts` — 9 MapLibre-native tool definitions + `set_scene`
- `historyExplainerSession.ts` — forwards tool calls as JSON to frontend
- `buildHistoryExplainerPrompt()` — MapLibre canvas usage instructions + scene balance

---

## Phase 20: Live-First Pivot ✅ (2026-03-31)

**Architectural pivot from static pre-generated scripts to live AI teaching.**

### Deleted (legacy ScriptPlayer pipeline)
| File | Was |
|------|-----|
| `src/components/player/ScriptPlayer.tsx` | Static cue-based lesson player |
| `src/lib/player/useScriptPlayer.ts` | Timeline-driven cue executor |
| `src/lib/player/adaptRawScript.ts` | Raw JSON → LessonScript adapter |
| `src/lib/player/types.ts` | LessonScript, Cue types |
| `src/data/lessons/*.json` (all 14 files) | Pre-generated lesson scripts |
| `src/data/lessons/index.ts` | Dynamic lesson loader |
| `scripts/generate_lesson_script.ts` | Script generation CLI |
| `scripts/generate_b2_*.py` (5 files) | Band 2 script generators |
| `src/components/player/ComponentRenderer.tsx` | Legacy component renderer |
| `src/components/player/LessonDrawer.tsx` | Lesson picker drawer |
| `src/components/player/OverlayControls.tsx` | Overlay UI controls |
| `src/components/player/OverlayCaption.tsx` | Overlay caption |
| `src/components/player/TranscriptPanel.tsx` | Legacy transcript sidebar |
| `src/components/player/VoiceIndicator.tsx` | Legacy voice indicator |
| `src/components/player/CanvasActionLog.tsx` | Legacy action log |
| `src/components/player/useAutoHide.ts` | Auto-hide utility |
| `src/components/player/PostLessonSummary.tsx` | Post-lesson summary |
| `src/lib/player/useAudioPlayback.ts` | Audio playback hook |

### Created
| File | Purpose |
|------|---------|
| `src/components/session/SessionCanvas.tsx` | Full-bleed teaching viewport with scene transitions |
| `src/lib/session/types.ts` | SceneMode, AgentMessage, TranscriptChunk types |
| `.antigravity/ARCHITECTURE_LIVE.md` | Live-first architecture documentation |

### Modified
| File | Change |
|------|--------|
| `agent/src/historyExplainerTools.ts` | Added `set_scene` tool, scene balance prompt |
| `agent/src/historyExplainerSession.ts` | Updated for `set_scene` dispatch |
| `src/lib/canvas/toolCallHandler.ts` | Added `set_scene` handling, auto-scene for map tools |
| `src/pages/LessonPlayerPage.tsx` | Routes Band 2+ to SessionCanvas |
| `src/components/player/StorybookPlayer.tsx` | Import path fixes |

---

## Phase 21–25: Live-First Implementation ← NEXT

See `.antigravity/JULES_PLAN_PHASE21.md` for full Jules prompts.

| Phase | Task | Instances | Dependencies |
|-------|------|-----------|-------------|
| 22 | TranscriptView kinetic typography | 1 | None (parallel) |
| 23 | Fix agent WebSocket connection | 1 | None (parallel) |
| 24A | StorybookPlayer split-screen layout | 1 | None (parallel) |
| 24B | Dashboard & page cleanup | 1 | None (parallel) |
| 21 | Wire SessionCanvas to live agent | 1 | After 22 + 23 |
| 25 | Golden Script recording | 1 | After 21 |
