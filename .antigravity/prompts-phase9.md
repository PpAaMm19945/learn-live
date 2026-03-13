# Phase 9: Content Expansion & Polish — Parallel Prompts

> **Goal:** Complete the curriculum content, add world-history context sidebars, build a glossary/index system, and polish the reading experience for pilot families.

> **Instance Strategy:** 2 parallel instances + integration step. Phase 9 is content-heavy with targeted engineering.

---

## Instance A — Glossary, Index & Content Infrastructure

**Scope:** Build a glossary/index system that extracts key terms from the master text, provides definitions, and enables cross-chapter navigation.

**Context:**
- Master text: `docs/curriculum/history/my-first-textbook/` — 10 chapters
- Existing lesson view: `src/pages/LessonView.tsx`, `src/pages/ReadingView.tsx`
- Existing content API: `worker/src/routes/content.ts`
- D1 database: `worker/wrangler.toml` → `learnlive-db-prod`

**Tasks:**

1. **D1 migration `012_glossary.sql`:**
   - Create `Glossary_Terms` table:
     ```sql
     CREATE TABLE IF NOT EXISTS Glossary_Terms (
       id TEXT PRIMARY KEY,
       term TEXT NOT NULL UNIQUE,
       definition TEXT NOT NULL,
       category TEXT, -- 'person', 'place', 'event', 'concept', 'date'
       related_chapter_ids TEXT, -- JSON array of chapter IDs
       created_at TEXT DEFAULT (datetime('now'))
     );
     CREATE INDEX IF NOT EXISTS idx_glossary_term ON Glossary_Terms(term);
     CREATE INDEX IF NOT EXISTS idx_glossary_category ON Glossary_Terms(category);
     ```

2. **Glossary seed script** (`worker/scripts/seed-glossary.ts`):
   - Parse all 10 chapters to extract key terms (proper nouns, dates, places, events)
   - Generate definitions from context (or use structured metadata)
   - Output: `worker/db/seeds/seed_glossary.sql`

3. **Glossary API routes** (`worker/src/routes/glossary.ts`):
   - `GET /api/glossary` — list all terms with optional `?category=person&search=aksum`
   - `GET /api/glossary/:id` — single term with related chapters
   - `POST /api/glossary` — admin-only: add/update terms

4. **Glossary UI components:**
   - `src/pages/Glossary.tsx` — searchable, filterable glossary page
   - `src/components/glossary/GlossaryTerm.tsx` — inline term tooltip (hover/tap shows definition)
   - `src/components/glossary/GlossaryIndex.tsx` — alphabetical index with category filters
   - Wire glossary terms into `ReadingView.tsx` — auto-link recognized terms to tooltips

5. **Update `run-migrations.sh`** to include `012_glossary.sql`

6. **Add `/glossary` route** to `src/App.tsx` (protected)

**Verification:**
- `npm run build` — 0 errors
- Glossary page renders with search/filter
- Terms in reading view show tooltip definitions

---

## Instance B — World History Context Sidebars

**Scope:** Add contextual sidebars to the reading experience that show what was happening elsewhere in the world during each chapter's time period.

**Context:**
- Existing reading view: `src/pages/ReadingView.tsx`
- Existing content adaptation: `worker/src/lib/content/adapt.ts`
- Band model: 0–5 (age-appropriate delivery)

**Tasks:**

1. **D1 migration `013_world_context.sql`:**
   - Create `World_Context` table:
     ```sql
     CREATE TABLE IF NOT EXISTS World_Context (
       id TEXT PRIMARY KEY,
       chapter_id TEXT NOT NULL,
       region TEXT NOT NULL, -- 'Europe', 'Asia', 'Americas', 'Middle East'
       title TEXT NOT NULL,
       description TEXT NOT NULL,
       start_year INTEGER,
       end_year INTEGER,
       display_order INTEGER DEFAULT 1
     );
     CREATE INDEX IF NOT EXISTS idx_world_context_chapter ON World_Context(chapter_id);
     ```

2. **World context seed** (`worker/scripts/seed-world-context.ts`):
   - For each of the 10 chapters, create 3-4 world context entries showing parallel events
   - Example for Chapter 2 (Ancient Egypt, c. 2100–1000 BC):
     - "Indus Valley Civilization flourishes (2600–1900 BC)"
     - "Minoan civilization on Crete (2700–1450 BC)"
     - "Shang Dynasty in China (1600–1046 BC)"
   - Output: `worker/db/seeds/seed_world_context.sql`

3. **World context API** (`worker/src/routes/worldContext.ts`):
   - `GET /api/chapters/:id/world-context` — returns context entries for a chapter

4. **Sidebar UI component:**
   - `src/components/content/WorldContextSidebar.tsx` — collapsible sidebar showing parallel world events
   - Timeline visualization showing African chapter events alongside world events
   - Band-aware: Band 0–1 shows simplified "Meanwhile..." cards; Band 3+ shows detailed entries
   - Integrate into `ReadingView.tsx` as a toggleable panel

5. **Update `run-migrations.sh`** to include `013_world_context.sql`

**Verification:**
- `npm run build` — 0 errors
- ReadingView shows world context toggle
- Sidebar renders with timeline visualization

---

## After Both Instances Complete — Integration Step

One final prompt will:

1. **Wire new routes into `worker/src/routes/index.ts`:**
   - Import and wire glossary routes
   - Import and wire world context routes

2. **Frontend route registration:**
   - Verify `/glossary` route is in `src/App.tsx` (protected)
   - Add glossary link to navigation/sidebar

3. **Cross-feature integration:**
   - Glossary terms auto-linked in world context descriptions
   - ReadingView has both glossary tooltips and world context sidebar

4. **Migration sequencing:**
   - Update `worker/scripts/run-migrations.sh` to include `012_glossary.sql` and `013_world_context.sql`
   - Add new seeds to seed execution list

5. **Build verification:**
   - `npm run build` from root — 0 errors
   - `cd worker && npx wrangler deploy --dry-run` — clean output

6. **Documentation updates:**
   - Update `ROADMAP.md`: Phase 9 → ✅ COMPLETE
   - Update `.antigravity/prompts.md` with Phase 9 completion log
   - Create `.antigravity/notes/P9_integration.md`
   - Update `docs/deployment-checklist.md` with new migrations (012, 013)

**Verification checklist:**
- `GET /api/glossary` — returns terms list
- `GET /api/glossary/:id` — returns single term
- `GET /api/chapters/:id/world-context` — returns context entries
- Glossary page accessible at `/glossary`
- ReadingView shows glossary tooltips + world context sidebar
