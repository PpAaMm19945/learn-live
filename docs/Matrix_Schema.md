# 3D Responsibility Matrix Schema

This document details how the conceptual 3D Responsibility Matrix maps to concrete relational database structures in our Cloudflare D1 environment.

## The Axes
The Learn Live philosophy maps development across three dimensions:

1.  **X-Axis (Arena):** The domain of life (e.g., *Language & Literacy*, *Physical Stewardship*, *Emotional Regulation*).
2.  **Y-Axis (Capacity/Level):** The progression of difficulty within an arena (e.g., Level 1: Recognition, Level 2: Sequencing, Level 3: Creation).
3.  **Z-Axis (Repetition Arc):** The depth of habitualization. How independently and consistently the learner can perform the capacity. Stages include: "Introduction" -> "Supported Practice" -> "Mastery".

## Database Mapping

These axes converge to form a specific **Task** or **Constraint Cell**.
In the `Matrix_Tasks` table, this relationship is structured as follows:

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT (UUID) | Primary Key |
| `domain_id` | TEXT | Foreign Key -> `Domains.id` (X-Axis) |
| `capacity_id` | TEXT | Foreign Key -> `Capacities.id` (Y-Axis) |
| `repetition_stage`| INTEGER | The Z-Axis current stage (1, 2, 3...) |
| `title` | TEXT | "Narrative Sequencing Level 2" |
| `constraint_json` | TEXT (JSON) | **Critical:** The structured instructions passed to Gemini. |

## Constraint JSON Structure (The Blueprint)
The `constraint_json` column holds the specific operational parameters for the Evidence Witness holding the learner accountable.

### Example MVP Constraint (Story Sequencing)
```json
{
  "role": "You are a gentle, firm evaluator guiding a young learner.",
  "constraint_to_enforce": "The learner must arrange three picture cards in the correct chronological order and explain their choice.",
  "success_condition": "The learner verbalizes the correct sequence (Beginning, Middle, End) and provides a logical reason.",
  "failure_condition": "The learner places the cards out of order or cannot explain the logic after 2 prompts.",
  "timeout_seconds": 300,
  "required_evidence": ["audio_transcript", "snapshot"]
}
```

## Lifecycle Flow
1. Learner selects an active task.
2. The UI fetches the `constraint_json`.
3. Over WebSocket, the constraint is fed as a `systemInstruction` to the Gemini Live agent.
4. If successful, the Parent reviews.
5. If the Parent Authorizes Advancement, the Z-Axis (`repetition_stage`) increments. If the stage resolves, the Learner unblocks the next Y-Axis node.
