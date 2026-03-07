# AI Handoff Prompt: Curriculum Expansion — Language & Literacy (English)

## Context & Goal
You are an expert curriculum architect instance. We have successfully built the Mathematics Curriculum Spine and generated 377 highly structured "Constraint Templates" for Band 2 (ages 6-9). 

Your goal in this new iteration is to **expand the curriculum spine to cover Language & Literacy (English)** exclusively for Band 2. We are building out a fully finished Band 2 so we can see how all subjects operate before generating the other age bands.

## Core Directives

### 1. The Deliverable: The Master Spine Document (Iterative Approach)
Your immediate task is to create the architectural spine document for Language & Literacy. Do **not** generate any JSON constraint templates yet. 

You must take an iterative approach:
1.  **Analyze the Math Spine:** Start by reviewing our established `math_curriculum_spine.md`.
2.  **Compare & Contrast:** Explicitly state what structural elements from the Math spine we should **keep** for English, and what we need to **change, add, or do differently** because of the nature of language learning.
3.  **Propose Alternatives:** Where divergencies occur (e.g., how to handle "Encounter" when the subject is reading, or how to handle asynchronous AI grading of creative writing), lay down the alternatives clearly for the user.
4.  **Wait for Input:** Ask the user for their preference on these divergencies before finalizing the English spine document.

### 2. Subject-Specific Considerations to Analyze
As you prepare your comparison, consider these areas where English naturally differs from Math in a parent-led, AI-verified environment:

*   **Cognitive Levels:** In Math, "Encounter" is strictly physical manipulatives and "Own" is active production. For English, what does "Encounter" look like? (e.g., auditory exposure, read-alouds, phonics games). What does "Own" look like? (e.g., heavy creative writing production, essays, summaries).
*   **Verification (The AI's Role):** Math is often binary (right/wrong). English involves subjective evaluation (grammar, narrative flow, vocabulary use). How will the AI evaluate a photo of a child's handwritten paragraph or an audio recording of them reading aloud? 
*   **Activity Minimum Rules:** What is the equivalent of the Math "Encounter=Physical" rule for English?
*   **Strands:** What are the 3 to 5 high-level themes for Band 2 English? (e.g., Reading Comprehension, Phonics/Word Study, Grammar & Mechanics, Composition/Writing).

### 3. Maintain the Data Model Structure
Whatever changes you propose for the pedagogy, the underlying database schema must remain compatible:
- **Strands:** High-level themes.
- **Capacities:** The atomic skills within each strand (e.g., "Identify the main idea of a short narrative paragraph").
- **Cognitive Levels:** 1 (Encounter), 2 (Execute), 3 (Discern), 4 (Own).
- **Milestones:** Cross-strand syntheses.

## Your First Action Items
Before you write a single word of the new spine, you **MUST** read the following foundational documents to ensure you do not diverge from our core philosophies, pedagogy, and Ugandan context:
1. `docs/core-docs/Master_Blueprint_Hackathon_Strategy.md`
2. `docs/core-docs/Phylosophy_Pedagogy.md`
3. `docs/core-docs/The Ugandan Education System .md`
4. `docs/curriculum/math_curriculum_spine.md` (to understand the standard of rigor, formatting, and database compatibility required).

After reading, present your analysis: "What to Keep vs. What to Change for English."
Outline the structural divergencies and ask the user to choose between your proposed alternatives.
Wait for the user's approval before drafting the formal `english_curriculum_spine.md`.

**Tone:** Spartan, direct, and focused on clear structural decisions.
