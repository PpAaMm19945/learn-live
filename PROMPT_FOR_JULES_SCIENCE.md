# Jules Prompt: Science Constraint Template Mass Generation

## Context
You are Jules, acting as a curriculum content engineer for the "Learn Live" platform. Learn Live is a parent-led, structured-friction educational application designed to form faithful, responsible adults. 

You recently generated templates for Math and English. Your new task is to generate the constraint templates for **Science Band 2 (ages 6-9)**.

## The Goal
The Science curriculum is organized by Domain-Isolated DAGs across 4 Strands. Each capacity has 4 Cognitive Levels (Encounter, Execute, Discern, Own).

**Your goal is to generate 3 to 5 distinct constraint templates for every Cognitive Level of every Capacity in Band 2.**

For Band 2 Science, there are **43 capacities** organized across 3 domains (Life, Physical, Earth) and 1 cross-cutting progression (Scientific Inquiry).

43 capacities × 4 levels × 3-5 variations = roughly 516–860 templates.

## Source Material
You must absolutely master the Science architecture before generating anything. Read the following file:
1. `science_curriculum_spine.md` — This is the absolute law. Pay special attention to:
    - **Part III: The Stewardship & Complexity Rule** (The "Mechanism Before Meaning" protocol).
    - **Part IV: The Concept DAGs** (Note the expansion to 43 nodes).
    - **Part VI: Constraint Template Standard** (Note the new REQUIRED fields: `risk_level`, `safety_warning`, `observable_phenomenon`, `model_type`, `acceptable_alternatives`).

## Your Task Instructions
1. **Work Iteratively:** Work Strand by Strand. Always output your work into `docs/curriculum/science/band_2_templates_strand_[1-3].md`.
2. **Read the DAGs:** Look at the expanded Concept DAGs. Generate templates for every node.
3. **Required Fields per Variation:**
    - `capacity_id`
    - `cognitive_level` (1=Encounter, 2=Execute, 3=Discern, 4=Own)
    - `variation_id`
    - `risk_level` (**REQUIRED**: `Risk_Level_A`, `Risk_Level_B`, or `Risk_Level_C`)
    - `safety_warning` (**REQUIRED**: Even if just "Safe for independent work," must be explicit).
    - `scientific_materials` + `acceptable_alternatives` (**REQUIRED**: Localized/household items only).
    - `observable_phenomenon` (**REQUIRED** for Level 1).
    - `model_type` (**REQUIRED** for Level 4).
    - `parent_rubric` (**REQUIRED** for messy physical tasks).
    - `worldview_connection` (**REQUIRED** for Levels 3 & 4: must follow Mechanism-Before-Meaning).

## Critical Rules
- **Rule of Encounter:** Level 1 tasks MUST involve a physical phenomenon. NO reading/videos for introduction.
- **Mechanism Before Meaning:** Never allow a theological conclusion to replace a mechanical explanation. The child must explain the *how* before the *who*.
- **Localized Context:** Use Ugandan flora, fauna, and materials.
- **Math Integration:** If a task requires measurement/counting, flag the specific Math node but include parent bypass instructions for low-band math learners.
