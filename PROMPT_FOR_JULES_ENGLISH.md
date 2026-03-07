# Jules Prompt: English Constraint Template Mass Generation

## Context
You are Jules, acting as a curriculum content engineer for the "Learn Live" platform. Learn Live is a parent-led, structured-friction educational application designed to form faithful, responsible adults. 

You have successfully generated the math constraint templates. Your new task is to generate the constraint templates for **Language & Literacy (English) Band 2 (ages 6-9)**.

## The Goal
The English curriculum is organized by a Directed Acyclic Graph (DAG) across 5 Strands. Each capacity has 4 Cognitive Levels (Encounter, Execute, Discern, Own).

**Your goal is to generate 3 to 5 distinct constraint templates for every Cognitive Level of every Capacity in Band 2.**

For Band 2 English, there are 54 capacities:
- Strand 1: Phonics & Word Study (10 nodes)
- Strand 2: Reading Comprehension & Fluency (13 nodes)
- Strand 3: Grammar & Mechanics (11 nodes)
- Strand 4: Composition & Writing (12 nodes)
- Strand 5: Oral Language & Listening (8 nodes)

54 capacities × 4 levels × 3-5 variations = roughly 650–1,080 templates.

## Source Material
You must absolutely master the English architecture before generating anything. Read the following file located in `C:\Users\Anthony Mwesigwa\Documents\Home Line Shop\learn-live\docs\curriculum\english\`:
1. `english_curriculum_spine.md` — This is the absolute law. Pay special attention to:
    - Part VIe: Constraint Template Standard (defines the new English-specific fields).
    - Part VIf: Cross-Strand Routing Rule (the Tiered Gate System).
    - The Multi-Sensory Encounter Rule (Encounter = auditory/physical/verbal, NOT just text on a screen).
    - The "Say It, Then Write It" Rule (for Execute-level writing tasks).

Unlike Math, we DO NOT have a complete set of "Gold Standard" single-instance templates for English yet. You will be generating them from scratch based on the fully-worked examples inside `english_curriculum_spine.md` (Part V).

## Your Task Instructions
1. **Work Iteratively:** Do not try to generate 1,000 templates in one go. Work Strand by Strand, starting with Strand 1 (Phonics & Word Study) for Band 2. Always output your work into `docs/curriculum/english/band_2_templates_strand_[1-5].md` so the user can review them before you generate JSON data.
2. **Read the DAGs:** Look at the Concept DAGs for the Strand you are working on. Generate templates for every node listed under "Band 2 — Ages 6-9".
3. **Required Fields per Variation:** Each variation MUST include:
    - `capacity_id` (e.g., PS2a)
    - `cognitive_level` (1=Encounter, 2=Execute, 3=Discern, 4=Own)
    - `variation_id` (A, B, C, D)
    - `task_type` (e.g., Auditory+Visual, Oral->Written, Error Detection)
    - `materials` (if applicable, focus on locally available items)
    - `parent_prompt` (What the parent says/does)
    - `success_condition`
    - `failure_condition` (for Encounter/Discern)
    - `reasoning_check` (A specific question to test understanding)
    - `context_variants` (Ugandan localized twist: names like Amara, Tendo, foods like matooke, mangoes, settings like Kampala market)
    - `repetition_arc` (Exposure, Execution x[count], Endurance, Milestone)
4. **English-Specific Fields:** You MUST include these fields where applicable according to the Spine:
    - `oral_component` (boolean, true for writing Execute tasks)
    - `parent_rubric` (array of yes/no objects, REQUIRED for writing Execute+ tasks)
    - `grammar_integration` (object, REQUIRED for writing Execute+ tasks, references a Strand 3 grammar capacity to use)
    - `L1_interference` (object, Strand 1 ONLY, for tricky sounds like /th/ or /æ/)
    - `text_passage` (string, REQUIRED for Reading tasks, leave as "PLACEHOLDER: [Description of passage needed]" for the user's content generator to fill later)
5. **Documentation:** Keep a `jules_progress_log_english.md` in `docs/curriculum/english/` to track exactly which capacities you have generated variations for. Check them off as you go.

## Critical Rules
- Keep the tone "Spartan." Parents are not entertainers; they are stewards of structure.
- Adhere strictly to the English rules: Encounter MUST be multi-sensory (auditory/verbal/physical). Writing at Execute MUST begin with oral narration.
- Do not use abstract grammatical vocabulary in Milestone tasks. The child must recognize the situation, not follow an explicit instruction to "write a topic sentence."
- You can schedule tasks and run sequentially to complete this massive job. Work Strand by Strand and ask the user to review the markdown files before converting to JSON.
