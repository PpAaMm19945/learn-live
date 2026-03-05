# Integrating Claude's 11-Point Feedback

## Spine Architecture Updates (Confirmed Changes)
- [x] 1. Worksheet structure — add Part to spine defining: worked example, execution, endurance, milestone per worksheet
- [x] 2. Answer key architecture — add marking model (Option D: AI marks execution, parent reviews endurance/milestone)
- [x] 3. Progress system — add capacity-based progress map (not grades) to spine
- [x] 4. Activity minimum rule — Encounter = physical activity always, Own = active production always
- [x] 5. Cross-strand routing rule — hard gate: prerequisite must be at Execute+
- [x] 7. Milestone task structure — formalize the milestone task spec in the spine
- [x] 8. Localisation parameter — add `context_variants` spec to constraint template format
- [x] 9. Reasoning check standardization — define the required reasoning check per cognitive level

## Template Retrofits
- [x] 9b. Retrofit Band 2 Strand 1 templates with standardized reasoning checks
- [x] 9c. Retrofit Band 2 Strands 2-4 with standardized reasoning checks
- [x] 7b. Add formal milestone tasks to all Band 2 capacities

## Open Questions (Confirmed)
- [x] 10. Option D: Split marking confirmed.
- [x] 11. Formative mapping only (no summative reports needed).
- [x] 6. Parent primers confirmed for Band 3+.

## Path 2: Data Model & App Wiring
- [x] Implement D1 schema updates for Strands, Capacities, DAG Dependencies, and Constraint Templates.
- [x] Implement Repetition Arc state per learner in D1 schema.
- [x] Create basic seeding script/pipeline for ingesting structured JSON templates.
- [x] Update Parent Task View UI to support the new constraint prompt structure.
- [x] Build Async AI Evidence Capture flow (Task 9.4).

## Path 3: Field Testing Documentation (Pilot)
- [x] Draft the Pilot Onboarding Guide for the 5-10 families.
- [x] Define the Repetition Arc calibration metrics & feedback form.
- [x] Define the Async AI Reliability check criteria.
- [x] Design the Parent Competence evaluation questions.
