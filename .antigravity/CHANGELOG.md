# Learn Live — Changelog

> **Last updated:** 2026-03-22
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
- **Fix:** Framer Motion easing typing required `as const`
- **Fix:** Archived explainerClient.ts import path corrected

## 2026-03-13 — Phase 7: Worker Cleanup
- Monolithic worker/src/index.ts (~1300 lines) split into modular routes
- Families table (008_families.sql) with Learners child table
- **Decision during merge:** Accepted Instance B's family schema over Instance A's

## 2026-03-14 — Phase 8: Pilot Readiness
- Content pipeline scripts: prepare-content, upload-to-r2, seed-curriculum
- Admin analytics with usage metrics, engagement charts
- Open registration (no invite codes), multi-step onboarding wizard with band calculator
- Activity logging wired into all handlers (login, content view, lesson complete, exam)
- Feedback widget + admin feedback management

## 2026-03-15 — Phase 9: Content Expansion
- Glossary system (012_glossary.sql) with full API
- World history context sidebars (013_world_context.sql)
- DashboardLayout component created for consistent layout

## 2026-03-16 — Phase 10: UI/UX Overhaul
- Global learner store (Zustand) replacing scattered localStorage reads
- Unified AppShell with sidebar (desktop) + bottom nav (mobile)
- BandSelector replaced with read-only BandBadge
- react-markdown added for content rendering

## 2026-03-17 — Phase 11: Post-Merge Cleanup
- Removed redundant headers from pages inside AppShell
- Progress page placeholder at /progress
- currentTopicId added to learnerStore for continue-learning
- **Fix:** loadFamily() crash resilience — no longer throws on API failure
- **Fix:** stripMarkdown() utility for raw markdown in titles

## 2026-03-18 — Phase 12: Data Quality
- Pending D1 migration 014 resolved
- Reading experience polish
- Dashboard continue-learning enhancement
- Error handling for edge cases

## 2026-03-18 — Phase 13: Content Production
- 30 SVG map overlays generated across 6 batches
- Pronunciation dictionary for all 9 chapters
- Component data extracted: genealogy, timeline, definitions, figures, scripture, comparisons

## 2026-03-19 — Phase 14: SVG Alignment Tool
- Standalone browser tool for manual SVG-to-PNG alignment
- Drag/scale/rotate controls with JSON export

## 2026-03-20 — Phase 15: Session Engine
- LessonScript TypeScript types and useScriptPlayer hook
- ScriptPlayer (YouTube-style controls) + StorybookPlayer (tap-to-advance)
- 9 visual components: MapOverlay, SceneImage, GenealogyTree, DualTimeline, ScriptureCard, PortraitCard, DefinitionCard, RouteAnimation, ComparisonView
- Cloud Run band param fix
- Lesson Script Generator CLI (Node script: chapter markdown + band → LessonScript JSON)

## 2026-03-22 — Repository Cleanup
- **Decision:** Pivot teaching canvas from PNG+SVG overlays to MapLibre GL JS
- Reason: SVG overlays are placeholder rectangles, impossible to see, don't trace real boundaries
- MapLibre renders vector polygons — highlight Egypt by calling one function
- Deleted ~30 orphaned root scripts/screenshots/legacy prompts
- Moved math/english/science curriculum data to archive/
- Consolidated 7+ documentation files into 4 unified docs
