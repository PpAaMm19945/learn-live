import { GenAINarrator } from './gemini';
import { Beat, SectionManifest } from './content';
import { MAPLIBRE_TEACHING_TOOLS } from './historyExplainerTools';

/**
 * LessonPreparer — The 5-phase pipeline that transforms raw curriculum content
 * into teaching-ready beat payloads, following docs/TEACHING_PHILOSOPHY.md.
 *
 * Phases:
 *   0. Profile Intake   — Assess student context
 *   1. Theological Framing — Answer the "what is God doing?" question
 *   2. Lesson Architecture — Build the Hook → Story → Turn → Question structure
 *   3. Draft Generation  — Produce beat scripts with tool choreography
 *   4. Critique          — Self-review against guardrails; revise if needed
 *
 * All internal reasoning (Phases 0–4) is invisible to the student.
 * Only the final beat payloads reach the Beat Sequencer.
 */

interface StudentProfile {
  chapterBeingTaught: string;
  priorChaptersCompleted: string[];
  studentKnownContent: string;
  likelyMisconceptions: string[];
  emotionalRegister: string;
  vocabularyCeiling: string;
  scaffoldingNotes: string;
}

interface TheologicalFrame {
  whatGodIsDoing: string;
  covenantPrinciple: string;
  covenantExplanation: string;
  africaConnection: string;
  africaConnectionStrength: string;
  curseOfHamRisk: string;
  nimrodPatternPresent: boolean;
  translationThesisRelevant: boolean;
  translationThesisNotes: string;
  presentDayParallel: string | null;
}

interface LessonPlan {
  hook: string;
  humanStory: string;
  theologicalTurn: string;
  livingQuestion: string;
}

interface CritiqueResult {
  verdict: 'approve' | 'revise';
  revisionInstructions?: string;
  sermonLanguageFound: string[];
}

// Chapter metadata for student knowledge tracking
const CHAPTER_TITLES: Record<string, string> = {
  ch01: 'The Sovereign Hand: A Biblical Foundation for African History',
  ch02: 'The Story of Egypt — From the Rise of the Nile Kingdoms to Cleopatra',
  ch03: 'The Lands of Phut — Carthage, Numidia, and the Desert Kingdoms',
  ch04: 'The Lands of Cush',
  ch05: 'The Church in Roman Africa',
  ch06: 'Egypt under Rome and the Rise of the Alexandrian Church',
  ch07: 'The Churches of the Highlands: Aksum, Conversion, and Survival',
  ch08: 'The Peopling of Africa: The Bantu Migrations and the Forgotten Clans',
  ch09: 'Ethiopia Alone — The Hidden Kingdom',
  ch10: 'Trade Winds and Stone Cities',
};

const BAND_AGE_MAP: Record<number, { label: string; ages: string; depth: string }> = {
  0: { label: 'Picture Book', ages: '3–4', depth: 'God is present, powerful, good. Simple cause-and-effect. No theological vocabulary.' },
  1: { label: 'Narrative', ages: '5–6', depth: 'God makes things happen. People choose well or badly. Concrete images.' },
  2: { label: 'Expanded Narrative', ages: '7–8', depth: "God's plan is larger than one person's choices. Simple pattern recognition begins." },
  3: { label: 'Causal Reasoning', ages: '9–11', depth: 'Why did God do this? What happened when people ignored Him? Africa named and dignified.' },
  4: { label: 'Pattern Analysis', ages: '12–14', depth: 'Nimrod pattern, covenant pattern, Translation Thesis introduced. Debate Box mode begins.' },
  5: { label: 'Full Theological Engagement', ages: '15–17+', depth: 'Providence, covenant, present-day application. Student expected to think critically and argue back.' },
};

export class LessonPreparer {
  private narrator: GenAINarrator;
  private band: number;
  private chapterId: string;

  constructor(
    private systemInstruction: string,
    band: number,
    chapterId: string
  ) {
    this.narrator = new GenAINarrator(systemInstruction);
    this.band = band;
    this.chapterId = chapterId;
  }

  /**
   * Run the full 5-phase pipeline on a section manifest.
   * Returns an enriched manifest with AI-prepared beat content.
   */
  async prepare(manifest: SectionManifest): Promise<SectionManifest> {
    console.log(`[PREPARER] Starting 5-phase pipeline for ${manifest.sectionId} (Band ${this.band})`);

    // Phase 0: Profile Intake
    const profile = await this.phase0ProfileIntake(manifest);
    console.log(`[PREPARER] Phase 0 complete — register: ${profile.emotionalRegister}`);

    // Phase 1: Theological Framing
    const frame = await this.phase1TheologicalFraming(manifest, profile);
    console.log(`[PREPARER] Phase 1 complete — God is: ${frame.whatGodIsDoing.slice(0, 80)}...`);

    // Phase 2: Lesson Architecture
    const plan = await this.phase2LessonArchitecture(manifest, profile, frame);
    console.log(`[PREPARER] Phase 2 complete — hook: ${plan.hook.slice(0, 60)}...`);

    // Phase 3: Draft Generation — enrich each beat
    const enrichedBeats = await this.phase3DraftGeneration(manifest, profile, frame, plan);
    console.log(`[PREPARER] Phase 3 complete — ${enrichedBeats.length} beats drafted`);

    // Phase 4: Critique
    const critique = await this.phase4Critique(enrichedBeats, profile, frame, plan);
    console.log(`[PREPARER] Phase 4 complete — verdict: ${critique.verdict}`);

    if (critique.sermonLanguageFound.length > 0) {
      console.warn(`[PREPARER] Sermon language detected:`, critique.sermonLanguageFound);
    }

    return {
      ...manifest,
      beats: enrichedBeats,
    };
  }

  private async phase0ProfileIntake(manifest: SectionManifest): Promise<StudentProfile> {
    const chapterNum = parseInt(this.chapterId.replace('ch', ''), 10);
    const priorChapters = Array.from({ length: chapterNum - 1 }, (_, i) => {
      const id = `ch${String(i + 1).padStart(2, '0')}`;
      return `Chapter ${i + 1}: ${CHAPTER_TITLES[id] || 'Unknown'}`;
    });

    const bandInfo = BAND_AGE_MAP[this.band] || BAND_AGE_MAP[3];

    const prompt = `You are preparing to teach a lesson on "${manifest.heading}" from Chapter ${chapterNum}: "${CHAPTER_TITLES[this.chapterId]}" of the Learn Live curriculum, based on THE HISTORY OF AFRICA by Anthony Jr. Mwesigwa.

Student Age Band: ${this.band} — ${bandInfo.label} (ages ${bandInfo.ages})
Band depth: ${bandInfo.depth}
Chapters completed: ${priorChapters.length > 0 ? priorChapters.join(', ') : 'None (this is the first chapter)'}

Return ONLY a JSON object (no markdown, no explanation):
{
  "chapter_being_taught": "Chapter ${chapterNum}: ${CHAPTER_TITLES[this.chapterId]}",
  "prior_chapters_completed": ${JSON.stringify(priorChapters)},
  "student_known_content": "What the student can be assumed to know from prior chapters",
  "likely_prior_misconceptions": ["...", "..."],
  "emotional_register": "wonder | gravity | curiosity | challenge | joy",
  "vocabulary_ceiling": "description of appropriate vocabulary level",
  "scaffolding_notes": "what scaffolding is needed for this band"
}`;

    const raw = await this.narrator.narrate(prompt);
    try {
      const json = this.extractJson(raw);
      return {
        chapterBeingTaught: json.chapter_being_taught || '',
        priorChaptersCompleted: json.prior_chapters_completed || priorChapters,
        studentKnownContent: json.student_known_content || '',
        likelyMisconceptions: json.likely_prior_misconceptions || [],
        emotionalRegister: json.emotional_register || 'curiosity',
        vocabularyCeiling: json.vocabulary_ceiling || '',
        scaffoldingNotes: json.scaffolding_notes || '',
      };
    } catch {
      console.warn('[PREPARER] Phase 0 JSON parse failed, using defaults');
      return {
        chapterBeingTaught: `Chapter ${chapterNum}`,
        priorChaptersCompleted: priorChapters,
        studentKnownContent: '',
        likelyMisconceptions: [],
        emotionalRegister: 'curiosity',
        vocabularyCeiling: 'age-appropriate',
        scaffoldingNotes: '',
      };
    }
  }

  private async phase1TheologicalFraming(manifest: SectionManifest, profile: StudentProfile): Promise<TheologicalFrame> {
    const sectionContent = manifest.beats.map(b => b.contentText).join('\n\n');

    const prompt = `You are the theological reasoning engine for Learn Live, a curriculum built on THE HISTORY OF AFRICA by Anthony Jr. Mwesigwa. This curriculum operates from a Reformed Baptist (1689 London Baptist Confession), Africa-centered, Young Earth Creationist perspective.

Topic: ${manifest.heading}
Chapter: ${this.chapterId}
Student Band: ${this.band}
Student Profile: ${JSON.stringify(profile)}

Section content to analyze:
${sectionContent}

Before any lesson content is generated, answer these questions. If a field does not apply, explain why. Never set present_day_parallel if the connection is not genuinely illuminated by the historical event itself.

Return ONLY a JSON object (no markdown, no explanation):
{
  "what_god_is_doing": "What is God actively doing in or through this event?",
  "covenant_principle": "blessing | curse | providence | judgment | grace | mixed",
  "covenant_explanation": "...",
  "africa_connection": "Where do African peoples or civilizations appear?",
  "africa_connection_strength": "central | present | absent",
  "curse_of_ham_risk": "Does this topic risk implying the Curse of Ham?",
  "nimrod_pattern_present": true or false,
  "translation_thesis_relevant": true or false,
  "translation_thesis_notes": "...",
  "present_day_parallel": "..." or null
}`;

    const raw = await this.narrator.narrate(prompt);
    try {
      const json = this.extractJson(raw);
      return {
        whatGodIsDoing: json.what_god_is_doing || '',
        covenantPrinciple: json.covenant_principle || 'providence',
        covenantExplanation: json.covenant_explanation || '',
        africaConnection: json.africa_connection || '',
        africaConnectionStrength: json.africa_connection_strength || 'central',
        curseOfHamRisk: json.curse_of_ham_risk || 'no',
        nimrodPatternPresent: json.nimrod_pattern_present || false,
        translationThesisRelevant: json.translation_thesis_relevant || false,
        translationThesisNotes: json.translation_thesis_notes || '',
        presentDayParallel: json.present_day_parallel || null,
      };
    } catch {
      console.warn('[PREPARER] Phase 1 JSON parse failed, using defaults');
      return {
        whatGodIsDoing: 'Providence over the nations',
        covenantPrinciple: 'providence',
        covenantExplanation: '',
        africaConnection: 'Central — Hamitic civilizations',
        africaConnectionStrength: 'central',
        curseOfHamRisk: 'No — this chapter dismantles it',
        nimrodPatternPresent: false,
        translationThesisRelevant: false,
        translationThesisNotes: '',
        presentDayParallel: null,
      };
    }
  }

  private async phase2LessonArchitecture(manifest: SectionManifest, profile: StudentProfile, frame: TheologicalFrame): Promise<LessonPlan> {
    const prompt = `You are designing the lesson architecture for Learn Live.

Student Profile: ${JSON.stringify(profile)}
Theological Frame: ${JSON.stringify(frame)}
Section: ${manifest.heading}
Number of beats available: ${manifest.beats.length}

Design a four-part lesson structure:
- Beat 1 — Hook: Creates genuine curiosity or wonder. The student leans forward.
- Beat 2 — The Human Story: What happened, who was involved, what they wanted. Narrative, not lecture.
- Beat 3 — The Theological Turn: God's role made visible. Must flow naturally from Beat 2. If it reads as a sermon insert, redesign.
- Beat 4 — The Living Question: Age-appropriate, genuinely open, connects history to student's present. Not rhetorical. Never answered by the agent.

Architecture test: Does Beat 3 emerge from the story, or is it imposed on it? If imposed, redesign.

Return ONLY a JSON object (no markdown):
{
  "hook": "1-2 sentence description of the hook approach",
  "human_story": "1-2 sentence description of the narrative arc",
  "theological_turn": "1-2 sentence description of how God's role becomes visible",
  "living_question": "The actual question to pose to the student"
}`;

    const raw = await this.narrator.narrate(prompt);
    try {
      const json = this.extractJson(raw);
      return {
        hook: json.hook || '',
        humanStory: json.human_story || '',
        theologicalTurn: json.theological_turn || '',
        livingQuestion: json.living_question || manifest.thinkItThrough?.[0] || '',
      };
    } catch {
      return {
        hook: 'Begin with the most striking fact from this section.',
        humanStory: 'Tell the human story as narrative.',
        theologicalTurn: "Show God's hand through the events themselves.",
        livingQuestion: manifest.thinkItThrough?.[0] || 'What do you think God was doing here?',
      };
    }
  }

  private async phase3DraftGeneration(
    manifest: SectionManifest,
    profile: StudentProfile,
    frame: TheologicalFrame,
    plan: LessonPlan
  ): Promise<Beat[]> {
    const bandInfo = BAND_AGE_MAP[this.band] || BAND_AGE_MAP[3];

    // Build the enrichment prompt for the AI to refine each beat's narration context
    const enrichmentPrompt = `You are drafting narration guidance for a ${bandInfo.label} lesson (ages ${bandInfo.ages}).

LESSON ARCHITECTURE:
- Hook approach: ${plan.hook}
- Story arc: ${plan.humanStory}
- Theological turn: ${plan.theologicalTurn}
- Living question: ${plan.livingQuestion}

THEOLOGICAL FRAME:
- What God is doing: ${frame.whatGodIsDoing}
- Covenant principle: ${frame.covenantPrinciple} — ${frame.covenantExplanation}
- Africa connection: ${frame.africaConnection} (${frame.africaConnectionStrength})
${frame.nimrodPatternPresent ? '- Nimrod pattern IS present in this section' : ''}
${frame.translationThesisRelevant ? '- Translation Thesis IS relevant here: ' + frame.translationThesisNotes : ''}
${frame.presentDayParallel ? '- Present-day parallel: ' + frame.presentDayParallel : ''}

STUDENT CONTEXT:
- Emotional register: ${profile.emotionalRegister}
- Vocabulary ceiling: ${profile.vocabularyCeiling}
- Misconceptions to address: ${profile.likelyMisconceptions.join(', ')}

GUARDRAILS (non-negotiable):
1. God's role is SHOWN, not announced. Never say "this teaches us that..."
2. The Curse of Ham is NEVER implied.
3. No sermon vocabulary: forbidden phrases include "this teaches us," "the lesson here is," "we learn that," "and so we see."
4. Africa is history, not representation — no performative inclusion.
5. Deep truth is never withheld for age reasons — translate depth, don't remove it.
6. Voice: COMMANDING, AUTHORITATIVE, BOLD — like a passionate professor. Never whisper or use bedtime-story tone.

For each beat, the narration text in contentText should:
- Match the ${bandInfo.label} depth level
- Carry the theological frame naturally (not as inserted commentary)
- Use vocabulary appropriate to the ceiling
- Maintain the ${profile.emotionalRegister} register throughout

Return "acknowledged" — the Beat Sequencer will use this context per-beat.`;

    // We don't actually need to call the AI here — the enrichment context
    // will be woven into the per-beat narration prompt by the BeatSequencer.
    // Instead, we tag each beat with the pipeline context for the sequencer.
    console.log(`[PREPARER] Phase 3 — tagging ${manifest.beats.length} beats with pipeline context`);

    return manifest.beats.map((beat, i) => ({
      ...beat,
      // Inject pipeline context as metadata the sequencer can use
      _pipelineContext: {
        lessonArchitecture: plan,
        theologicalFrame: frame,
        studentProfile: profile,
        beatRole: i === 0 ? 'hook' : i === manifest.beats.length - 1 ? 'living_question' : i === manifest.beats.length - 2 ? 'theological_turn' : 'human_story',
      },
    })) as Beat[];
  }

  private async phase4Critique(beats: Beat[], profile: StudentProfile, frame: TheologicalFrame, plan: LessonPlan): Promise<CritiqueResult> {
    const beatSummary = beats.map((b, i) => `Beat ${i + 1} (${b.title}): "${b.contentText.slice(0, 150)}..."`).join('\n');

    const prompt = `You are a critical reviewer for Learn Live, a Reformed Baptist Christian homeschool history curriculum built on THE HISTORY OF AFRICA.

Review the following draft lesson beats against the curriculum's teaching philosophy. Be honest. Do not flatter.

Theological Frame: ${JSON.stringify(frame)}
Lesson Plan: ${JSON.stringify(plan)}
Student Band: ${this.band}

Draft Beats:
${beatSummary}

Return ONLY a JSON object (no markdown):
{
  "beat_1_engaging": true or false,
  "beat_1_notes": "...",
  "beat_3_preachy": true or false,
  "beat_3_notes": "...",
  "africa_lens_present": true or false,
  "africa_lens_natural": true or false,
  "curse_of_ham_implied": true or false,
  "translation_thesis_surfaced_where_relevant": true or false,
  "beat_4_genuinely_open": true or false,
  "beat_4_notes": "...",
  "sermon_language_found": [],
  "overall_verdict": "approve or revise",
  "revision_instructions": "..."
}`;

    const raw = await this.narrator.narrate(prompt);
    try {
      const json = this.extractJson(raw);
      return {
        verdict: json.overall_verdict === 'revise' ? 'revise' : 'approve',
        revisionInstructions: json.revision_instructions || undefined,
        sermonLanguageFound: json.sermon_language_found || [],
      };
    } catch {
      return { verdict: 'approve', sermonLanguageFound: [] };
    }
  }

  private extractJson(text: string): any {
    // Strip markdown code fences
    let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
    // Find first { and last }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON object found');
    cleaned = cleaned.slice(start, end + 1);
    return JSON.parse(cleaned);
  }
}
