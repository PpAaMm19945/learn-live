# Learn Live: Known Issues & Blockers Tracker

## Resolved

### 1. ~~Missing Curriculum JSON Data~~ → RESOLVED (2026-03-07)
* Jules delivered 5 JSON files into `curriculum_data/` totaling ~650KB and 377 templates across 29 capacities.
* The seed script (`scripts/seed_curriculum.ts`) was updated to handle schema mismatches (string→integer cognitive levels, array→string materials, nested object→JSON context_variants).
* All 377 templates were successfully deployed to remote D1 production via `db/seed_curriculum.sql`.

### 2. ~~`FileCheck2` Import Error~~ → RESOLVED 
* Fixed missing import in `AsyncEvidenceModal.tsx`.

### 3. ~~Curriculum Docs Not In Repo~~ → RESOLVED
* Copied all spine and template documentation from `.gemini/antigravity/` into `docs/curriculum/`.

## Open Items

### 4. Capacity Names Need Manual Review
* **Status:** LOW PRIORITY
* **Description:** The seed script uses `task_type` from Jules' JSON as the capacity `name` in the `Capacities` table (e.g., "Physical manipulation" instead of "Place Value as Grouping"). A manual cleanup pass or a lookup table mapping capacity_id → proper name should be created.
* **Impact:** The `ParentTaskCard` UI will show the task type rather than the actual capacity name when fetching from D1.

### 5. No Learner_Repetition_State Rows Exist Yet
* **Status:** BLOCKER for live UI
* **Description:** The `GET /api/family/:id/curriculum-tasks` endpoint JOINs on `Learner_Repetition_State`, but no rows exist for any learner. Until initial state rows are seeded (one per learner per capacity, with status='active' for the first unlocked capacity), the Dashboard will show "No active curriculum tasks."
* **Impact:** The full curriculum loop won't render until the Repetition Arc engine (Task 10.5) is built, or until we manually seed starter rows.

### 6. Band 2 Only — Jules Has Not Generated Bands 0, 1, 3, 4, 5
* **Status:** EXPECTED (per pilot plan)
* **Description:** Jules was instructed to work Band by Band. Only Band 2 (ages 6-9) has been delivered. This is correct for the pilot scope.
