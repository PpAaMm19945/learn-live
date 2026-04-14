# Learn Live — Band Differentiation Framework
### Independent Curriculum & Architecture Recommendation
*Prepared as a primary reference document for implementation*

---

## Preface

This document is a complete, independent recommendation for how the Learn Live platform should differentiate instruction across its six age bands. It does not synthesize or adjudicate between prior analyses — it starts from first principles: developmental psychology, Reformed pedagogy, EdTech architecture, and the specific theological mission of this curriculum.

The core conviction running through every recommendation here is this: **band differentiation is not about simplifying the same content for younger children. It is about choosing the right cognitive instrument for each stage of development.** A 4-year-old and a 16-year-old are not on the same spectrum of understanding. They are operating with fundamentally different cognitive architectures. The delivery system must reflect that.

---

## Section 1 — Tool Palette Per Band

The canvas tools available to the agent are not equally appropriate at every band. The decision of what to allow, what to situationally permit, and what to block entirely should be driven by a single question: **does this tool demand a cognitive operation the learner can perform?**

A `show_comparison` table requires: (1) reading two columns simultaneously, (2) holding both in working memory, (3) inferring contrast. That operation is not available before roughly age 9. A `draw_route` animation requires the learner to interpret a line on a map as movement through space and time — an abstraction that emerges around age 7-8 with scaffolding.

### Band 0 (Ages 3–4) — Picture Book
| Tool | Status | Reason |
|---|---|---|
| `set_scene("image")` | **Always** | The entire experience is image-driven |
| `set_scene("transcript")` | Never | Cannot read |
| `set_scene("map")` | Never | Cannot interpret geographic abstraction |
| `zoom_to` | Never | Map disabled |
| `place_marker` | Never | Map disabled |
| `highlight_region` | Never | Map disabled |
| `draw_route` | Never | Map disabled |
| `show_scripture` | Never | Cannot read; verse format meaningless |
| `show_timeline` | Never | Linear time abstraction not yet formed |
| `show_key_term` | Never | Vocabulary cards require reading and metacognition |
| `show_comparison` | Never | Dual-column abstraction unavailable |
| `show_genealogy` | Never | Relational graphs require abstract reasoning |
| `show_question` | Never | Assessment of any kind breaks storybook immersion; inappropriate for age |
| `show_quote` | Never | Attribution and primary source concept meaningless |
| `show_slide` | Situational | Only if it is a single image with no more than 3 words of caption |
| `show_figure` | Situational | Portrait card acceptable if image-dominant and label is a single name |

**Note on Band 0:** This band should not use the SessionCanvas at all. See Section 7.

---

### Band 1 (Ages 5–6) — Narrative
| Tool | Status | Reason |
|---|---|---|
| `set_scene("image")` | **Always** | Still image-dominant |
| `set_scene("transcript")` | Never | Emerging literacy — do not require reading for comprehension |
| `set_scene("map")` | Never | Geographic abstraction not yet reliable |
| `zoom_to` | Never | Map disabled |
| `place_marker` | Never | Map disabled |
| `highlight_region` | Never | Map disabled |
| `draw_route` | Never | Map disabled |
| `show_scripture` | Never | Card format requires reading; reference meaningless. Scripture may appear in narration text only, paraphrased, never cited. |
| `show_timeline` | Never | Linear time with multiple events is a Band 2 unlock |
| `show_key_term` | Situational | Word + plain definition only. No pronunciation IPA. No etymology. Max 1 per lesson (not per beat). |
| `show_comparison` | Never | Not developmentally available |
| `show_genealogy` | Never | Not developmentally available |
| `show_question` | Situational | Tap-to-advance comprehension only: "Who did we meet?" with two image choices. No text-based questions. |
| `show_quote` | Never | Primary source attribution meaningless |
| `show_slide` | Situational | Max 1 bullet, max 4 words per bullet, image must accompany |
| `show_figure` | Situational | Portrait + first name only |

---

### Band 2 (Ages 7–8) — Expanded Narrative
| Tool | Status | Reason |
|---|---|---|
| `set_scene("image")` | **Always** (first beat of section) | Still the visual anchor; maps supplement rather than replace |
| `set_scene("map")` | Situational | Pre-zoomed, single country/region focus only |
| `set_scene("transcript")` | Situational | Short phrase only; 5 words max; used for key statements |
| `zoom_to` | Situational | One fly-to per beat maximum |
| `place_marker` | Situational | Single labeled pin; simple label only |
| `highlight_region` | Never | Territorial boundary interpretation is a Band 3 unlock |
| `draw_route` | Never | Migration/trade route logic is a Band 3 unlock |
| `show_scripture` | **Always** (when beat references scripture) | Card now appropriate; text must be NIV/ESV short passage, max 1 verse |
| `show_timeline` | Situational | Max 3 events; labels must be single phrases |
| `show_key_term` | Situational | Word + definition + pronunciation. No etymology yet. Max 2 per lesson. |
| `show_comparison` | Never | Two-column abstraction is a Band 3 unlock |
| `show_genealogy` | Never | Band 3 unlock |
| `show_question` | **Always** (end of section) | Comprehension type only: factual recall, 2-3 options |
| `show_quote` | Never | Band 4 unlock |
| `show_slide` | **Always** (as needed) | Max 3 bullets, max 7 words per bullet |
| `show_figure` | Situational | Portrait + name + one-line description |

---

### Band 3 (Ages 9–11) — Causal Reasoning
| Tool | Status | Reason |
|---|---|---|
| `set_scene("image")` | Situational | Shares equal weight with map now |
| `set_scene("map")` | **Always** (geography beats) | Interactive map now primary geography tool |
| `set_scene("transcript")` | Situational | Key theological statements; short quotable phrases |
| `zoom_to` | **Always** (map beats) | Standard map interaction |
| `place_marker` | **Always** (map beats) | Multi-pin acceptable (max 3 per beat) |
| `highlight_region` | Situational | Ancient territories; must have narration explanation |
| `draw_route` | Situational | Migration routes; one per beat |
| `show_scripture` | **Always** (when beat references scripture) | Full verse with reference; theological connection in narration |
| `show_timeline` | Situational | Max 5 events |
| `show_key_term` | Situational | Full card: word + definition + pronunciation + etymology |
| `show_comparison` | Situational | Max 2 points per column; must be labelled clearly |
| `show_genealogy` | Situational | Simplified: max 6 nodes; 2 generations max |
| `show_question` | **Always** (per section) | Cause-effect type: "Why did X happen?" open framing |
| `show_quote` | Never | Band 4 unlock |
| `show_slide` | **Always** (as needed) | Full bullets; can include sub-points |
| `show_figure` | **Always** (when introducing key figure) | Full card: portrait + name + dates + role |

---

### Band 4 (Ages 12–14) — Pattern Analysis
| Tool | Status | Reason |
|---|---|---|
| `set_scene("image")` | Situational | Used for thematic anchoring, not as default visual |
| `set_scene("map")` | **Always** (geography/movement beats) | Strategic map analysis begins |
| `set_scene("transcript")` | Situational | Key claims worth displaying for analysis |
| `zoom_to` | **Always** (map beats) | |
| `place_marker` | **Always** (map beats) | Multi-pin, labelled with dates |
| `highlight_region` | **Always** (territory beats) | Multiple regions, overlapping periods |
| `draw_route` | **Always** (movement beats) | Trade, migration, and conquest routes |
| `show_scripture` | **Always** (when beat references scripture) | With theological application note |
| `show_timeline` | **Always** (chronology beats) | Max 7 events; can include parallel timelines |
| `show_key_term` | Situational | Full card including etymology and root language |
| `show_comparison` | **Always** (contrast beats) | Max 4 points per column |
| `show_genealogy` | Situational | Full tree; max 10 nodes |
| `show_question` | **Always** | Analysis and debate types: "Argue both sides of…" |
| `show_quote` | Situational | Brief secondary source; must have attribution |
| `show_slide` | **Always** (as needed) | Dense slides acceptable; pattern language introduced |
| `show_figure` | **Always** (when introducing key figure) | Full card |

---

### Band 5 (Ages 15–17+) — Full Theological Engagement
All tools available with no caps except safety maximums (timeline ≤ 9 events, comparison ≤ 6 points per column, genealogy ≤ 12 nodes).

`show_quote` is now **Always** for beats containing primary source material. Quotes should be drawn from primary sources — Islamic chronicles, colonial records, patristic sources — with full attribution and historiographical framing in narration.

`show_question` is **Always**, defaulting to `debate` and `application` types. The question should not be answerable from the beat alone — it should require synthesis across the lesson or prior lessons.

---

## Section 2 — Narration Constraints

The narration prompt must carry measurable, hard constraints — not vague instructions like "simplify for the age." Here are the exact constraints to inject per band.

### Band 0 (3–4)
- Words per beat: 18–32
- Max sentences: 3
- Max words per sentence: 8
- Vocabulary: Concrete nouns and action verbs only. No abstract nouns. No theological vocabulary whatsoever.
- Tone: Warm wonder. Every sentence should feel like a parent reading aloud at bedtime.
- Theological ceiling: God is present. God is good. God made this. Nothing beyond.
- Prohibited: Rhetorical questions, subordinate clauses, passive voice, any sentence with more than one theological idea.

### Band 1 (5–6)
- Words per beat: 30–55
- Max sentences: 5
- Max words per sentence: 11
- Vocabulary: Introduce max 1 new word per lesson (not per beat). Define it immediately in the next sentence using simpler language.
- Tone: Animated storyteller. Characters should feel vivid and real. Actions should be concrete.
- Theological ceiling: God makes things happen on purpose. People choose well or badly. God is always present.
- Prohibited: Theological abstractions, cause-effect chains longer than two links, any vocabulary requiring prior theological knowledge.

### Band 2 (7–8)
- Words per beat: 55–85
- Max sentences: 6
- Max words per sentence: 14
- Vocabulary: Up to 2 new terms per lesson. Each term gets a definition sentence immediately following first use.
- Tone: Clear, warm teacher. Enthusiastic but not breathless.
- Theological ceiling: God's plan is larger than one person. Patterns are beginning to emerge. Simple providence language is acceptable ("God was working through this even when people didn't know it").
- Required: At least one explicit cause-effect connector per beat ("because," "which meant that," "as a result").
- Prohibited: Covenant language, historiographical terms, multi-step theological arguments.

### Band 3 (9–11)
- Words per beat: 80–125
- Max sentences: 8
- Max words per sentence: 18
- Vocabulary: Introduce and define theological terms with brief explanation of why they matter.
- Tone: Engaging lecturer. Confident. Can ask rhetorical questions and leave them momentarily open.
- Theological ceiling: Covenant patterns, divine judgment as historical force, Africa's dignity in the biblical narrative, the Table of Nations as real ethnographic record.
- Required: At least one causal link and one implication sentence per beat ("If this is true, it means…").
- Prohibited: Translation Thesis by name, detailed historiographical debate, multi-position theological arguments.

### Band 4 (12–14)
- Words per beat: 110–175
- Max sentences: 9
- Max words per sentence: 22
- Vocabulary: No ceiling. Introduce and define as needed. Etymology connections welcome.
- Tone: Authoritative, engaging professor. Treats the student as a serious learner who can handle complexity.
- Theological ceiling: Translation Thesis introduced and explained. Nimrod pattern explicitly named. Covenant structure as interpretive framework. Colonial historiography named and critiqued.
- Required: At least one pattern reference per beat ("This is the same pattern we saw at…"). At least one contrast per lesson section.
- Permitted: Primary source references, historiographical terminology, theological debate framing (without requiring student to resolve it).

### Band 5 (15–17+)
- Words per beat: 150–250
- Max sentences: 11
- Max words per sentence: 30
- Vocabulary: No ceiling. Technical theological and historiographical terms expected.
- Tone: Scholarly discussion. Treats the student as a junior peer, not a recipient.
- Theological ceiling: None. Full engagement with providence, covenant, Translation Thesis, eschatological implications, present-day African ecclesiology.
- Required: At least one thesis-level theological claim per beat, supported by at least one historical evidence point. The narration should model the kind of argument the student will be asked to make.
- Permitted: Acknowledged scholarly disagreement. "Some historians argue… but the biblical record suggests…" is appropriate at this band.

---

## Section 3 — Visual Strategy

These are target distributions for section-level visual time (not per beat). The BeatSequencer should track these and log warnings when a section drifts more than 15 percentage points from target.

| Band | Full-Bleed Image | Interactive Map | Overlay Cards | Kinetic Transcript |
|---|---|---|---|---|
| 0 | 90% | 0% | 10% | 0% |
| 1 | 70% | 0% | 25% | 5% |
| 2 | 50% | 20% | 25% | 5% |
| 3 | 30% | 35% | 30% | 5% |
| 4 | 20% | 35% | 40% | 5% |
| 5 | 10% | 30% | 55% | 5% |

**Transcript cap:** Kinetic text should never exceed 5% at any band for a full section. It is a punctuation tool, not a teaching mode. When it appears it should be brief (one phrase), bold, and paired with audio narration.

**Map floor for Bands 0–1:** Zero. The map is not a simplified tool for young children — it is a categorically different cognitive instrument. Introducing geography at Band 0–1 through illustration (a painted depiction of the Nile, for example) is appropriate. An interactive map tile is not.

**Image floor for Bands 4–5:** These bands should still open each new section or lesson with at least one full-bleed illustration. The image is no longer the primary teaching instrument, but it remains the emotional and aesthetic anchor of the experience. Do not let Band 4–5 become wall-to-wall text overlays.

---

## Section 4 — Interaction Design

| Band | Primary Mode | Permitted Interactions | Max Interaction Events Per Section |
|---|---|---|---|
| 0 | Tap-to-advance, auto-play | Tap only | 0 comprehension checks |
| 1 | Tap-to-advance, auto-play | Image-choice comprehension (2 options, pictorial) | 1 per lesson |
| 2 | Auto-play with pause | 2-option text comprehension, oral prompt | 1 per section |
| 3 | Auto-play with guided pause | Cause-effect questions, short live Q&A (gated, guided) | 2 per section |
| 4 | Interactive with student control | Analysis, comparison prompts, Debate Box, live Q&A | 3 per section |
| 5 | Student-paced, fully interactive | Thesis defense, evidence ranking, essay mode, full Socratic Q&A | Unlimited |

**On Band 3 live Q&A:** When enabled, it should be gated behind a "raise hand" gesture and limited to 90 seconds. The agent should be prompted to close the exchange and return to the beat sequence with a summary of what was discussed.

**On Band 5 Socratic mode:** This is not open-ended chat. The agent should operate from a set of prepared Socratic questions authored per chapter and use the live exchange to probe the student's engagement with those questions. It should not field arbitrary historical queries.

---

## Section 5 — Question Types Per Band

The `show_question` tool supports several types. Here is the complete mapping:

| Band | Permitted Question Types | Prohibited Types | Notes |
|---|---|---|---|
| 0 | None | All | Remove tool from band entirely |
| 1 | `check` (image-choice only) | All others | "Which one is Noah?" with two illustration options |
| 2 | `comprehension` | All others | Factual recall only; 2-3 text options |
| 3 | `comprehension`, `reflection`, `cause_effect` | `debate`, `essay` | "Why did God scatter the nations?" is appropriate |
| 4 | `cause_effect`, `analysis`, `debate` | `essay` (defer to Band 5) | Debate Box mode begins here |
| 5 | All types | None | Essay prompt is the pinnacle; Socratic questions standard |

**On reflection questions:** These are appropriate from Band 3 onward, but they must be carefully authored. "How do you feel about this?" is not a reflection question — it is an invitation to sentimentality. A proper reflection question for Band 3 is: "Have you ever seen someone do what Nimrod did — try to be in charge instead of following God? What happened?" Personal connection anchored to observable experience.

**On debate questions:** For Band 4, the Debate Box should present two positions and ask the student to argue one. For Band 5, the student should be asked to argue a position *and* anticipate the strongest counter-argument. This models the actual intellectual work of Christian scholarship.

---

## Section 6 — TTS Voice Character

| Band | Voice ID | Speaking Rate | Warmth | Energy | Formality | Style Label |
|---|---|---|---|---|---|---|
| 0 | Kore | 0.85 | High | Gentle | Very low | `storybook` |
| 1 | Kore | 0.90 | High | Animated | Low | `warm-story` |
| 2 | Leda | 0.97 | Medium-high | Engaged | Medium-low | `clear-teacher` |
| 3 | Orus | 1.02 | Medium | Confident | Medium | `coach` |
| 4 | Charon | 1.05 | Low-medium | Authoritative | Medium-high | `seminar` |
| 5 | Charon | 1.08 | Low | Measured | High | `scholarly` |

**On style labels:** If the Gemini TTS API does not support style parameters, retain these labels as semantic metadata on the `BandProfile.tts` object. They serve two purposes: (1) a prompt-level instruction to Gemini when generating narration text ("write this to be read aloud in a warm, storytelling voice"), and (2) a migration hook for when a provider supports affective TTS parameters.

**On voice selection:** The Kore-to-Charon transition should feel like the learner is aging through a relationship with a teacher who grows alongside them — warmer and more playful early, more challenging and collegial later. Avoid switching voices mid-curriculum except at the Band 1→2 and Band 3→4 transitions where the pedagogical register genuinely shifts.

---

## Section 7 — Bands 0–1: Separate Experience?

**Recommendation: Yes. Dedicated StorybookPlayer for Bands 0 and 1.**

The pedagogical argument is categorical, not incremental. The SessionCanvas is built around a mental model of "lesson with visual aids." A picture book operates on a different mental model entirely: "world unfolding through image and voice." These are not the same delivery mode at different complexity levels. They are fundamentally different relationships between the child and the content.

Specific reasons the SessionCanvas fails for Bands 0–1 even when stripped down:

1. **Overlay architecture.** The canvas renders images as elements within a layout that has chrome, controls, and spatial structure. A picture book is the whole world. There is no chrome. The image fills existence. This is not a CSS problem — it is a design philosophy problem.

2. **Interaction model.** The canvas assumes an active learner managing a session. A 4-year-old is a passive receiver of story. The interaction model should be: audio plays, image is present, tap moves to the next image when the child is ready. That is not a simplified SessionCanvas — it is a different component.

3. **Recovery from confusion.** If a 4-year-old sees a timeline card appear in the middle of their story, there is no graceful recovery. The whole experience is broken. The StorybookPlayer must have no mechanism by which a non-storybook tool can appear.

**Implementation decision:**

- `StorybookPlayer.tsx` for Bands 0 and 1
- Route branch at session container: `band <= 1 ? <StorybookPlayer /> : <SessionCanvas />`
- The StorybookPlayer translates a limited tool subset (`set_scene(image)`, `show_slide`, `show_key_term` for Band 1 only, `show_question` for Band 1 only) into storybook UI primitives
- The Beat Sequencer still runs the same beat manifest — the component layer renders it differently
- This preserves the Beat Sequencer contract and avoids maintaining two content formats

**If timeline is tight:** The fallback is to keep SessionCanvas but switch image rendering from thumbnail to full-bleed for Bands 0–1 and block all non-image tools. This is inferior but shippable. Mark it as technical debt and schedule StorybookPlayer for Phase 2.

---

## Section 8 — The Image-to-Interaction Gradient

**The gradient is correct. The research basis is strong.**

The developmental sequence from concrete to abstract is one of the most robustly replicated findings in educational psychology (Piaget's concrete-operational to formal-operational stages, Bruner's enactive-iconic-symbolic modes of representation). Younger learners anchor understanding in perceptual experience — images, sounds, stories about people. Abstract tools like maps, timelines, and comparison tables require the learner to operate on representations of representations, which is a formal-operational skill.

Specific evidence for this curriculum's gradient:

- **Full-bleed illustrations (Bands 0–2):** Dual coding theory (Paivio) demonstrates that pairing verbal narration with concrete images improves retention for younger learners more than for older ones, because older learners can self-generate mental images from text. For pre-readers, the image *is* the content.

- **Interactive maps (Bands 2–5):** Spatial cognition research shows that children begin to understand maps as bird's-eye representations of real space around age 7–8 (Liben & Downs). Before that, a map is a picture of colored shapes, not a representation of place. The Band 2 unlock is correctly timed.

- **Comparison tables and timelines (Bands 3–5):** These require working memory capacity sufficient to hold multiple items in relationship simultaneously. This capacity increases substantially between ages 9–11 (Band 3), which is why Band 3 is the correct unlock point for these tools.

- **Primary source analysis (Bands 4–5):** Reading historical documents with source criticism requires metacognitive awareness — knowing that the author had a perspective, that documents can be incomplete, that evidence can be weighted. This is a late-formal-operational skill, appropriately placed at the top of the band stack.

**One caveat worth noting:** The gradient from images to interaction should not result in Band 5 having almost no illustrations. Theological and historical content benefits from visual grounding at every age. The target of 10% image time for Band 5 is a floor, not a ceiling. High-quality illustrations at Band 5 should shift in character — from narrative illustration (what happened) to interpretive illustration (the weight and meaning of what happened). This is a content authoring instruction, not a technical one.

---

## Section 9 — The Theological Concept Gate (Additional Recommendation)

This section does not appear in the original brief but is essential for a theologically intentional curriculum.

The band profiles govern vocabulary complexity and cognitive load. They do not govern *which theological concepts may be introduced at which band*. These are not the same thing. A sentence can be grammatically simple and theologically premature. "God scattered the nations because He wanted them to fill the earth and not build empires against Him" is simple English. It is also a Band 3 concept. Narrating it to a 5-year-old is not harmful, but it is pedagogically wasteful — the child cannot integrate it, and it may attach to the wrong mental model.

### Recommended Theological Concept Unlock Table

| Concept | First Unlock Band | Notes |
|---|---|---|
| God made everything | 0 | Foundation; always present |
| God is good | 0 | Foundation; always present |
| People disobeyed God | 1 | Narrated in concrete story terms only ("Adam and Eve made a bad choice") |
| God judges sin | 2 | Concrete (the Flood); not as abstract principle |
| God keeps His promises | 2 | Narrative level ("God promised Noah, and He kept that promise") |
| Africa in God's plan | 3 | Explicit dignity framing begins here |
| Nations as God's design | 3 | Table of Nations as real history |
| Divine judgment as historical force | 3 | "When nations rejected God, things fell apart" — causal, not abstract |
| Covenant pattern | 4 | Named and explained |
| Nimrod pattern | 4 | Named and explained |
| Translation Thesis | 4 | Introduced with full explanation |
| Providence as interpretive framework | 4 | Systematic framing begins |
| Eschatological implications | 5 | Telos of African history in God's plan |
| Colonial historiography critique | 5 | Full critical engagement |
| Present-day African ecclesiology | 5 | Application layer |

**Implementation:** Add a `theologyGate` field to `BandProfile` with `allowedConcepts` and `blockedConcepts` arrays. Inject these into the narration prompt: *"You may draw on the following concepts: [list]. If the source text contains the following concepts, paraphrase around them at this band level: [list]."*

---

## Section 10 — Implementation Sequence

This is the sequence in which these recommendations should be built, ordered by impact-to-risk ratio.

### Sprint 1 — Foundation (Core differentiation, low risk)
1. Create `agent/src/bandProfile.ts` with `BAND_PROFILES[0..5]`, including `theologyGate` field
2. Wire `BAND_PROFILES` into `beatSequencer.ts`, `historyExplainerTools.ts`, `tts.ts`, `historySessionController.ts`, `lessonPreparer.ts`
3. Implement `applyBandToolPolicy(toolCalls, band, beatContext)` in `beatSequencer.ts`
4. Update `buildNarrationPrompt()` to inject narration constraints and `theologyGate.allowedConcepts`
5. Implement `getTTSOptionsForBand(band)` in `tts.ts`
6. Add sequencer telemetry for narration word count compliance and visual mix tracking

### Sprint 2 — UX and Interaction
1. Build `StorybookPlayer.tsx` for Bands 0–1
2. Add session route branch: `band <= 1 ? StorybookPlayer : SessionCanvas`
3. Add structured `show_question` card variants in `SessionCanvas.tsx` (image-choice, cause-effect, debate)
4. Implement per-band interaction policy in `HistorySessionController` replacing the current binary gate

### Sprint 3 — Authoring Infrastructure and Quality
1. Update `beat-schema.md` with per-band tool constraints and `theologyGate` documentation
2. Add manifest lint script: validates tool calls against band policy before deploy
3. Add snapshot tests for `applyBandToolPolicy()` across all six bands
4. Add narration constraint tests (mock Gemini output → word count / sentence count / vocabulary level validation)

---

## Acceptance Criteria

The implementation is complete when:

- The same manifest beat produces measurably different narration length, complexity, and vocabulary across all six bands
- `applyBandToolPolicy()` correctly filters or transforms every tool call in the blocked/clamped list, verified by sequencer logs
- Bands 0 and 1 never receive `show_comparison`, `show_quote`, `show_genealogy`, `show_timeline`, or any map tool
- Bands 0 and 1 render in `StorybookPlayer`, not `SessionCanvas`
- The TTS voice, rate, and style parameter differ by band on every synthesis call
- Visual mix telemetry logs a warning when any section drifts more than 15 percentage points from band target
- Theological concepts blocked by `theologyGate` do not appear in narration output for any band below their unlock band (verified by sampling)
- Per-band interaction policy governs Q&A gating, question type, and interaction event limits
- A 4-year-old session and a 16-year-old session on the same lesson chapter are experientially unrecognisable as the same content delivery system

---

*End of Document*
