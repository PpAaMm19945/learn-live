# Learn Live: Known Issues & Blockers Tracker

## High Priority Pipeline Blockers

### 1. Missing Curriculum JSON Data (Blocks Phase 10 Migration)
* **Status:** BLOCKED
* **Description:** The `scripts/seed_curriculum.ts` is fully implemented and relies on structured JSON constraint templates generated from the core `math_curriculum_spine.md`. However, the AI instance (Jules) responsible for generating the 2000+ variations has not yet output the required arrays into the `curriculum_data/` directory.
* **Impact:** 
  * The D1 `Constraint_Templates` and `Capacities` tables are currently empty.
  * The Parent Task View (`Dashboard.tsx`) is temporarily wired to `mockState` or yields an empty state from the `GET /api/family/:id/curriculum-tasks` worker endpoint instead of live dynamically generated templates.
  * Task Generation (Task 10.3), DAG Resolution (Task 10.4), and the true Repetition Arc logic (Task 10.5) cannot commence until data exists.
* **Next Steps:**
  1. Await completion of the Jules prompt (`PROMPT_FOR_JULES.md`).
  2. Verify JSON structures within `curriculum_data/*.json`.
  3. Execute `npx ts-node scripts/seed_curriculum.ts` to convert to `db/seed_curriculum.sql`.
  4. Run `npx wrangler d1 execute learnlive-db-prod --remote --file=./db/seed_curriculum.sql` to populate production.

## Known Bugs (Resolved in Current Sprint)
- **Resolved:** `FileCheck2` missing import build error in `AsyncEvidenceModal.tsx` breaking the React build process. Fixed by importing directly from `lucide-react`.
- **Resolved:** Missing curriculum documentation. Copied all `.md` files detailing the curriculum spine, templates, and pilot tests from `.gemini/antigravity/` into the source tree at `docs/curriculum/` for Hackathon judges visibility.
