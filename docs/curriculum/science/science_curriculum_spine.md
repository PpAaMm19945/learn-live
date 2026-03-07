# Learn Live: Science Curriculum Spine (v1.0)
*Status: Band 2 Draft*

This document defines the architectural data model and pedagogical sequencing for the Science curriculum within the Learn Live platform. 

## Part I: The Architectural Goals

Science in the Learn Live system is not merely the memorization of facts about the natural world. It is the structured, empirical observation of the **created order** combined with the intellectual work of building models to explain it.

Because Science is fundamentally grounded in physical reality, this spine diverges from Math (purely abstract) and English (linguistic/expressive) in four specific ways:
1. **Encounter = Direct Observation:** Introductions to concepts must happen in the physical world, not on a screen or a page.
2. **Own = Model Building:** The highest level of mastery is building a physical or explanatory model to predict an outcome.
3. **The "Stewardship & Complexity" Constraint:** Scientific mechanisms are always contextualized within a framework of design, stewardship, and humility before complexity (Mechanism before Meaning).
4. **Domain-Isolated DAGs:** Biology does not strictly gate Earth Science. The Strands run largely parallel, with dependencies existing primarily *within* each strand.

### Continuity (The "Not a Floating Island" Rule)
While this document specifies the **Band 2 (Ages 6-9)** architecture, Science does not start here.
- **Band 0 & 1 Precursors:** Children arrive at Band 2 having already practiced proto-science: unstructured sensory sorting, noticing seasonal changes, and guided outdoor curiosity.
- **Band 3 & 4 Targets:** Band 2 prepares children for formal causal modeling, multi-variable isolation, and quantitative experimental design. Band 2 is strictly the "Observation & Foundational Mechanics" phase.

---

## Part II: The 4 Cognitive Levels (Science Edition)

Every Capacity in the Science spine moves through four phases. 

### 1. Encounter (Level 1)
**Rule: The child must see, touch, hear, or experience the phenomenon in reality first.**
- No text-based introductions. No abstract diagrams.
- The parent guides the child to observe a real event or physical object.
- *Example:* To learn about states of matter, the child watches the parent boil water and observe the steam, then melt an ice cube.

### 2. Execute (Level 2)
**Rule: Directed manipulation and data collection.**
- The child performs a constrained experiment or sorting task.
- They begin to record what they see using simple tools (drawings, tally marks, basic measurements).
- *Example:* The child is given a magnet and must test 10 household items, sorting them into "attracts" and "does not attract" piles, then draw the results.

### 3. Discern (Level 3)
**Rule: Spotting anomalies, errors, or breaking points in a system.**
- The child is presented with a flawed experiment, an incorrect conclusion, or a counter-intuitive observation, and must explain *why* it is wrong based on their Level 2 experience.
- *Example:* "Tendo planted a seed in a dark closet and watered it every day. It sprouted but then died. Amara says it died because it had too much water. Is she right? What really happened?"

### 4. Own (Level 4)
**Rule: Hypothesis, Model Building, and Stewardship.**
- The child applies the concept to a novel, unconstrained problem. They must predict an outcome, build a physical model, or make a stewardship decision.
- *Example (Stewardship):* "We are building a new chicken coop. Using what we learned about light, heat, and materials (opaque vs. transparent), design a roof that keeps the chickens dry but doesn't make them too hot. Draw your design and explain your material choices to your father."

---

## Part III: The "Stewardship & Complexity" Worldview Rule

Per the system philosophy, all knowledge exists within a created order. Modern science curricula often artificially severe the "how" (mechanism) from the "why/who" (purpose/origin). 

In the Learn Live spine, **every Capacity at Level 3 (Discern) or Level 4 (Own) must include a constraint connecting the mechanism to stewardship, design, or human responsibility.**

However, we must avoid generating "Sunday School filler" (e.g., "God made plants so be happy"). We enforce the **Mechanism Before Meaning** rule:
1. The child must first accurately explain the physical, empirical mechanism in detail.
2. Only then do they apply that mechanism to a decision about stewardship, or articulate humility before the complexity of the design.

*Implementation:* The AI is explicitly forbidden from generating "neutral" science templates for Level 4 that treat the natural world merely as raw, exploitable material. It is equally forbidden from accepting theological platitudes *in place of* scientific mechanistic reasoning.

---

## Part IV: The Concept DAGs (Band 2: Ages 6-9)

*Note: Science uses Domain-Isolated DAGs. Strands 1, 2, and 3 run independently of each other. Prerequisites apply WITHIN a specific strand. Soft gates apply to Math.*

### Cross-Cutting Progression: Scientific Inquiry (SE)
*Inquiry is NOT a separate strand. These capacities are hard prerequisites for Execute (Level 2) and Own (Level 4) tasks across all Domains.*

| Node | Capacity | Applies To | Math Dependency |
|---|---|---|---|
| `SE2a` | **Sensory Observation:** Gathering data using sight, sound, touch, smell. | All Level 1s | None |
| `SE2b` | **Asking Testable Questions:** Identifying what can be tested vs. just guessed. | All Level 2s | None |
| `SE2c` | **Making Predictions (Hypothesis):** "I think [X] will happen because [Y]." | All Level 2s | None |
| `SE2d` | **Recording Data:** Drawing accurate diagrams, basic charting. | All Level 2s | Math `P2a` (Data) |
| `SE2e` | **Measurement & Quantification:** Using non-standard and standard units safely. | Many Level 2s | Math `G2c` (Length) |
| `SE2f` | **Control Variables (Fair Test):** Changing only one thing at a time. | All Level 4s | None |
| `SE2g` | **Building Simple Models:** Representing an unseen or large system physically. | All Level 4s | Math `G2a` (Shape) |

### Strand 1: Life Sciences (LS) — Biology & Ecology
Focuses on the characteristics of living things, local habitats, adaptations, and the human body.

| Node | Capacity | Prerequisite | Math Dependency |
|---|---|---|---|
| `LS2a` | **Living vs. Non-Living:** Identifies the 4 traits of living things (breathes, needs food/water, grows, reproduces). | None |
| `LS2b` | **Plant Parts & Functions:** Roots, stem, leaves, flower, seed. | LS2a |
| `LS2c` | **Plant Life Cycles:** Germination, growth, flowering, seed dispersal. | LS2b |
| `LS2d` | **Basic Animal Classification:** Vertebrate (has backbone) vs. Invertebrate. | LS2a |
| `LS2e` | **Animal Needs:** Water, food, shelter, air. | LS2a |
| `LS2f` | **Animal Adaptations (Physical/Behavioral):** Beaks, claws, camouflage, migration. | LS2e |
| `LS2g` | **Local Habitats:** Savanna, wetlands/swamp, garden/farm (Local Ugandan context). | LS2c, LS2f |
| `LS2h` | **Simple Food Chains & Webs:** Producer → Primary → Secondary Consumer. | LS2g |
| `LS2i` | **Human Senses:** How the 5 senses gather information. | None |
| `LS2j` | **Human Body — Movement:** Bones (structure) and Muscles (pull/contract). | LS2i |
| `LS2k` | **Human Body — Internal:** Heart (pumps), Lungs (breathe), Stomach (digest). | LS2j |
| `LS2l` | **Basic Nutrition & Hygiene:** Fueling the body, washing hands (Germ theory basics). | LS2k |

### Strand 2: Physical Sciences (PS) — Physics, Chemistry, Energy
Focuses on observable forces, matter, and introductory energy concepts.

| Node | Capacity | Prerequisite | Math Dependency |
|---|---|---|---|
| `PS2a` | **States of Matter:** Distinguishes Solid, Liquid, Gas by shape/volume holding. | None |
| `PS2b` | **Phase Changes:** Melting, freezing, boiling, condensing. | PS2a |
| `PS2c` | **Mixtures & Solutions:** Mixing solids into liquids (dissolving vs. settling). | PS2a |
| `PS2d` | **Push, Pull & Force:** How applied forces change movement/direction. | None | Math `G2c` (Distance) |
| `PS2e` | **Friction:** How different surface textures affect sliding forces. | PS2d |
| `PS2f` | **Gravity Basics:** Earth pulls objects downwards (falling rates). | PS2d |
| `PS2g` | **Magnetism:** Magnetic vs non-magnetic materials, poles (attraction/repulsion). | PS2d |
| `PS2h` | **Energy Basics — Heat:** Sources of heat (sun, friction, fire); warming/cooling. | None |
| `PS2i` | **Energy Basics — Light:** Light sources; opaque, transparent, translucent. | None |
| `PS2j` | **Shadows:** How shadows change size/shape based on light distance/angle. | PS2i |
| `PS2k` | **Energy Basics — Sound:** Sound is created by vibration and travels through matter. | None |
| `PS2l` | **Introductory Systems (Causality):** Identifying simple Input-Process-Output loops. | All PS2 |

### Strand 3: Earth & Space Sciences (ES)
Focuses on the local environment, ground, agriculture, and sky.

| Node | Capacity | Prerequisite | Math Dependency |
|---|---|---|---|
| `ES2a` | **Soil Composition:** Observes properties of sand, clay, and loam. | None |
| `ES2b` | **Soil & Water (Agriculture):** Water retention and plant growth by soil type. | ES2a, LS2b | Math `G2d` (Capacity) |
| `ES2c` | **Rocks & Minerals:** Sorting by properties (hardness, color, texture). | None |
| `ES2d` | **Water Cycle & Local Context:** Evaporation, condensation, precipitation. | PS2b |
| `ES2e` | **Weather Tracking:** Recording cloud cover, wind, and rainfall over time. | None | Math `P2a`, `P2b` (Tally/Bar Chart) |
| `ES2f` | **Seasons:** Wet vs. Dry seasons in East Africa; agricultural impacts. | ES2e |
| `ES2g` | **Sun, Earth, Moon:** Day/night cycle due to rotation. | None |
| `ES2h` | **Solar Energy:** Sun as primary source of heat and light for earth systems. | ES2g, PS2h |
| `ES2i` | **Lunar Phases:** Observing and predicting basic moon appearance changes. | ES2g |
| `ES2j` | **Natural Resources & Stewardship:** Water conservation, soil protection (erosion). | ES2b |
| `ES2k` | **Ecosystem Disruption:** What happens when a habitat loses a resource (water/trees). | ES2j, LS2h |

---

## Part V: Cross-Strand Gates & Marking Model

### The Tiered Gate System
Science uses a distinct gate system to prevent blocking while ensuring rigor:
1. **Domain-Isolated DAGs (No Gate between strands):** You can reach Level 4 in Life Sciences without having started Physical Sciences.
2. **Intra-Strand Hard Gates:** Inside a strand, the prerequisites listed in Part IV are absolute.
3. **Inquiry Hard Gates:** Capacities from the **Scientific Inquiry (SE)** progression are hard prerequisites for Execute (Level 2) and Own (Level 4) tasks across all domains. (e.g., You must have cleared SE2c "Making Predictions" to start any Level 2 experiment).
4. **Math Dependency Soft Gates:** Handle dynamically via prompt. If the child is below the required Math Band, the parent is instructed to bypass the math cognitive load (e.g., the parent draws the chart).

### The Science Marking Model (Witnessing Physical Reality)
The system prioritizes **Async Audio + Photo** over video to manage bandwidth and storage.

| Task Level | Who Witnesses | How it is Marked |
|---|---|---|
| **Level 1 (Encounter)** | **Parent** | Parent observes the child's reaction to the physical phenomenon. Marks "Complete" via UI. |
| **Level 2 (Execute)** | **AI + Parent** | **AI:** Evaluates photo of drawn diagrams/tables. <br> **Parent:** Uses `parent_rubric` checklist to verify the physical process/safety. |
| **Level 3 (Discern)** | **AI (Audio/Text)** | Child analyzes a flawed scenario or competing hypotheses. AI evaluates the logical reasoning and identification of the mechanical error via audio transcript. |
| **Level 4 (Own)** | **AI (Multimodal)** | **Photo:** Of the final model/experiment. <br> **Audio:** 30s clip of the child explaining the mechanism and stewardship connection. AI evaluates reasoning. |

---

## Part VI: Constraint Template Standard (Science Additions)

Science templates use the same base structure as Math and English, with these additions:

| Field | Type | Description |
|---|---|---|
| `scientific_materials` | array | Lists highly accessible, local materials required. |
| `acceptable_alternatives` | array | **Required.** Lists fallback materials (e.g., "Plastic bottle OR hollow gourd"). |
| `observable_phenomenon` | string | **Required for Level 1.** The specific physical event the child is witnessing. |
| `safety_warning` | string | **REQUIRED.** Explicit safety boundaries for the parent. |
| `risk_level` | string | **REQUIRED.** One of: `Risk_Level_A` (Child-Safe), `Risk_Level_B` (Parent Supervision Required), `Risk_Level_C` (Parent-Controlled Only). |
| `parent_rubric` | object[] | **Required for physical execution tasks.** Binary yes/no checklist. |
| `model_type` | enum | **Required for Level 4.** `Physical`, `Diagrammatic`, `Predictive`, or `System`. |
| `worldview_connection` | string | **Required for Levels 3 & 4.** Must follow the "Mechanism Before Meaning" rule. |

### Example Level 4 (Own) Template Structure
```json
{
  "capacity_id": "LS2b",
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Model Building & Stewardship",
  "risk_level": "Risk_Level_B",
  "safety_warning": "Child will be handling soil and pulling plants. Ensure hands are washed afterward. Watch for small insects in the soil.",
  "scientific_materials": ["three small pots", "soil", "bean seeds", "water"],
  "acceptable_alternatives": ["recycled plastic containers", "local garden soil", "maize seeds"],
  "model_type": "Predictive",
  "parent_prompt": "Tell your child: 'We are in charge of growing the beans for the family. We need to know what happens if we pull a plant up by its roots versus just cutting the stem. Design an experiment with these three pots to find out. Explain your plan to me before you plant anything.'",
  "success_condition": "Child proposes planting all three, letting them sprout, then pulling one up by the roots, cutting one at the stem, and leaving one alone to compare outcomes.",
  "reasoning_check": "Why do we leave one alone? (Controls)",
  "worldview_connection": "Mechanism: Roots are the transport system for water. Stewardship: Knowing this helps us pull weeds from the root to stop them from competing with the beans.",
  "parent_rubric": [
    { "criterion": "Did the child identify the need for a 'control' plant?", "type": "yes_no" },
    { "criterion": "Did they explain that the root is required for the plant to drink water?", "type": "yes_no" }
  ]
}
```

---

## Part VII: What the Full Spine Requires (Next Steps)

1. **Mass Template Generation:** Create 3-5 templates for all **43 capacities** across all 4 levels (approx. 516–860 templates).
2. **Weekly Pantry List:** Implement UX to compile material requirements from scheduled tasks into a single list for parents.
3. **Worldview Audit:** Ensure all Level 3/4 tasks prioritize the physical mechanism over theological platitudes.
4. **Safety Level Sorting:** Ensure the daily schedule does not overload a single day with multiple `Risk_Level_C` tasks.
