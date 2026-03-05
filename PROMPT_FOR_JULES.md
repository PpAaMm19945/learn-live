# Jules Prompt: Constraint Template Mass Generation
## Context
You are Jules, acting as a curriculum content engineer for the "Learn Live" platform. Learn Live is a parent-led, structured-friction educational application designed to form faithful, responsible adults. 

Your task is the largest content creation job for this project: generating the raw data (the constraint templates) that will feed into the application's database.

## The Goal
The curriculum is organized by a Directed Acyclic Graph (DAG) of *Capacities*. Each capacity has 4 *Cognitive Levels* (Encounter, Execute, Discern, Own). 

For the app to be highly reusable, a child cannot see the exact same prompt every time they practice a capacity. **Each (Capacity × Cognitive Level) needs 3 to 5 distinct variations (templates).**

There are roughly 150 capacities across 6 developmental bands (Bands 0 through 5).
150 capacities × 4 levels × 3-5 variations = ~2,000 - 3,000 templates.

## Source Material
You must absolutely master the architecture before generating anything. Read the following files located in `C:\Users\Anthony Mwesigwa\.gemini\antigravity\brain\7c6b0dcc-5022-41ce-a9a9-339da854d9dd\`:
1. `math_curriculum_spine.md` — This is the absolute law. Pay special attention to:
    - Part VIe: Constraint Template Standard (defines the exact fields required).
    - Part VIb: The Worksheet Layer.
    - The Cognitive Levels definitions (Encounter = physical, Own = production).
2. `band_2_templates_strand_1.md` (and Strands 2, 3, 4, 5) — These are the "Gold Standard" single-instance templates we have already manually built. They demonstrate the tone, the Ugandan localization, the milestone situations, and the reasoning checks.

## Your Task Instructions
1. **Work Iteratively:** Do not try to generate 2,000 templates in one go. Work Band by Band, Strand by Strand.
2. **Take the Gold Standard and Multiply:** Look at the single templates in the `band_2_templates_...` markdown files. For each one, generate 3-4 *more* variations that test the exact same cognitive boundary but use different scenarios, numbers, or physical materials.
3. **Generate for Missing Bands:** We only drafted Band 2. You must draft the baseline *and* the variations for Bands 0, 1, 3, 4, and 5 based on the Concept DAGs in the spine.
4. **Required Fields per Variation:** Each variation MUST include:
    - `capacity_id` (e.g., D1)
    - `cognitive_level` (1, 2, 3, or 4)
    - `variation_id` (A, B, C, D)
    - `task_type`
    - `materials` (if applicable)
    - `parent_prompt` (What the parent says/does)
    - `success_condition`
    - `failure_condition` (for Encounter/Discern)
    - `reasoning_check` (A specific question to test understanding)
    - `context_variants` (A Ugandan localized twist)
5. **Output Format:** Save your outputs as structured JSON files (e.g., `band_2_strand_1_templates.json`) in a `curriculum_data/` folder in the project root. This allows the D1 database seed scripts to ingest them easily later.
6. **Documentation:** Keep a `jules_progress_log.md` in `C:\Users\Anthony Mwesigwa\.gemini\antigravity\brain\7c6b0dcc-5022-41ce-a9a9-339da854d9dd\` to track exactly which capacities you have generated variations for. Check them off as you go.

## Critical Rules
- Keep the tone "Spartan." Parents are not entertainers; they are stewards of structure.
- Adhere strictly to the "Encounter = Physical" and "Own = Production" rules from the Spine.
- Do not use abstract math vocabulary in Milestone tasks.
- You can schedule tasks and run sequentially to complete this massive job. Document everything clearly so the human user can easily review your JSON files.
