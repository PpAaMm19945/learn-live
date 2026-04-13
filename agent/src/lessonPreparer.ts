import { GenAINarrator } from './gemini';
import { Beat, SectionManifest } from './content';
import { MAPLIBRE_TEACHING_TOOLS } from './historyExplainerTools';

/**
 * LessonPreparer — Collapsed pipeline that transforms raw curriculum content
 * into teaching-ready beat payloads, following docs/TEACHING_PHILOSOPHY.md.
 *
 * Phases (collapsed for latency):
 *   0-2. Combined: Profile + Theological Framing + Lesson Architecture (single AI call)
 *   3.   Context Infusion — tag each beat with pipeline metadata (no AI call)
 *   4.   Critique (optional — skipped for bands 0-2)
 *
 * All internal reasoning is invisible to the student.
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
  private sendStatus: (step: string, detail?: string) => void;

  constructor(
    private systemInstruction: string,
    band: number,
    chapterId: string,
    sendStatus?: (step: string, detail?: string) => void
  ) {
    this.narrator = new GenAINarrator(systemInstruction);
    this.band = band;
    this.chapterId = chapterId;
    this.sendStatus = sendStatus || (() => {});
  }

  /**
   * Run the collapsed pipeline on a section manifest.
   * Returns an enriched manifest with AI-prepared beat content.
   */
  async prepare(manifest: SectionManifest): Promise<SectionManifest> {
    console.log(`[PREPARER] Starting pipeline for ${manifest.sectionId} (Band ${this.band})`);

    // Phase 0-2 Combined: Profile + Theological Framing + Lesson Architecture
    this.sendStatus('preparing', 'Analyzing lesson context…');
    const { profile, frame, plan } = await this.phaseCombined(manifest);
    console.log(`[PREPARER] Combined phase complete — register: ${profile.emotionalRegister}, God is: ${frame.whatGodIsDoing.slice(0, 60)}...`);

    // Phase 3: Context Infusion — tag each beat (no AI call)
    this.sendStatus('writing', 'Preparing lesson…');
    const enrichedBeats = this.phase3ContextInfusion(manifest, profile, frame, plan);
    console.log(`[PREPARER] Phase 3 complete — ${enrichedBeats.length} beats tagged`);

    // Phase 4: Critique — optional, only for bands 3+
    if (this.band >= 3) {
      this.sendStatus('reviewing', 'Final review…');
      const critique = await this.phase4Critique(enrichedBeats, profile, frame, plan);
      console.log(`[PREPARER] Phase 4 complete — verdict: ${critique.verdict}`);
      if (critique.sermonLanguageFound.length > 0) {
        console.warn(`[PREPARER] Sermon language detected:`, critique.sermonLanguageFound);
      }
    } else {
      console.log(`[PREPARER] Phase 4 skipped (band ${this.band} < 3)`);
    }

    return {
      ...manifest,
      beats: enrichedBeats,
    };
  }

  /**
   * Combined Phase 0+1+2: Single AI call that returns profile, theological frame, and lesson plan.
   */
  private async phaseCombined(manifest: SectionManifest): Promise<{ profile: StudentProfile; frame: TheologicalFrame; plan: LessonPlan }> {
    const chapterNum = parseInt(this.chapterId.replace('ch', ''), 10);
    const priorChapters = Array.from({ length: chapterNum - 1 }, (_, i) => {
      const id = `ch${String(i + 1).padStart(2, '0')}`;
      return `Chapter ${i + 1}: ${CHAPTER_TITLES[id] || 'Unknown'}`;
    });

    const bandInfo = BAND_AGE_MAP[this.band] || BAND_AGE_MAP[3];
    const sectionContent = manifest.beats.map(b => b.contentText).join('\n\n');

    const prompt = `You are the lesson planning engine for Learn Live, a Reformed Baptist (1689 LBC), Africa-centered, Young Earth Creationist curriculum based on THE HISTORY OF AFRICA by Anthony Jr. Mwesigwa.

TASK: In ONE response, produce three analyses for this lesson section.

SECTION: "${manifest.heading}" from Chapter ${chapterNum}: "${CHAPTER_TITLES[this.chapterId]}"
Student Age Band: ${this.band} — ${bandInfo.label} (ages ${bandInfo.ages})
Band depth: ${bandInfo.depth}
Chapters completed: ${priorChapters.length > 0 ? priorChapters.join(', ') : 'None (first chapter)'}
Number of beats: ${manifest.beats.length}

SECTION CONTENT:
${sectionContent.slice(0, 3000)}

Return ONLY a JSON object (no markdown, no explanation):
{
  "profile": {
    "chapter_being_taught": "...",
    "student_known_content": "What the student can be assumed to know",
    "likely_prior_misconceptions": ["..."],
    "emotional_register": "wonder | gravity | curiosity | challenge | joy",
    "vocabulary_ceiling": "...",
    "scaffolding_notes": "..."
  },
  "theological_frame": {
    "what_god_is_doing": "...",
    "covenant_principle": "blessing | curse | providence | judgment | grace | mixed",
    "covenant_explanation": "...",
    "africa_connection": "...",
    "africa_connection_strength": "central | present | absent",
    "curse_of_ham_risk": "...",
    "nimrod_pattern_present": true or false,
    "translation_thesis_relevant": true or false,
    "translation_thesis_notes": "...",
    "present_day_parallel": "..." or null
  },
  "lesson_plan": {
    "hook": "1-2 sentence hook approach",
    "human_story": "1-2 sentence narrative arc",
    "theological_turn": "How God's role becomes visible",
    "living_question": "The actual question to pose"
  }
}`;

    const raw = await this.narrator.narrate(prompt);
    try {
      const json = this.extractJson(raw);
      const p = json.profile || {};
      const t = json.theological_frame || {};
      const l = json.lesson_plan || {};

      return {
        profile: {
          chapterBeingTaught: p.chapter_being_taught || `Chapter ${chapterNum}`,
          priorChaptersCompleted: priorChapters,
          studentKnownContent: p.student_known_content || '',
          likelyMisconceptions: p.likely_prior_misconceptions || [],
          emotionalRegister: p.emotional_register || 'curiosity',
          vocabularyCeiling: p.vocabulary_ceiling || 'age-appropriate',
          scaffoldingNotes: p.scaffolding_notes || '',
        },
        frame: {
          whatGodIsDoing: t.what_god_is_doing || 'Providence over the nations',
          covenantPrinciple: t.covenant_principle || 'providence',
          covenantExplanation: t.covenant_explanation || '',
          africaConnection: t.africa_connection || 'Central — Hamitic civilizations',
          africaConnectionStrength: t.africa_connection_strength || 'central',
          curseOfHamRisk: t.curse_of_ham_risk || 'No',
          nimrodPatternPresent: t.nimrod_pattern_present || false,
          translationThesisRelevant: t.translation_thesis_relevant || false,
          translationThesisNotes: t.translation_thesis_notes || '',
          presentDayParallel: t.present_day_parallel || null,
        },
        plan: {
          hook: l.hook || 'Begin with the most striking fact from this section.',
          humanStory: l.human_story || 'Tell the human story as narrative.',
          theologicalTurn: l.theological_turn || "Show God's hand through the events themselves.",
          livingQuestion: l.living_question || manifest.thinkItThrough?.[0] || 'What do you think God was doing here?',
        },
      };
    } catch {
      console.warn('[PREPARER] Combined phase JSON parse failed, using defaults');
      return {
        profile: {
          chapterBeingTaught: `Chapter ${chapterNum}`,
          priorChaptersCompleted: priorChapters,
          studentKnownContent: '',
          likelyMisconceptions: [],
          emotionalRegister: 'curiosity',
          vocabularyCeiling: 'age-appropriate',
          scaffoldingNotes: '',
        },
        frame: {
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
        },
        plan: {
          hook: 'Begin with the most striking fact from this section.',
          humanStory: 'Tell the human story as narrative.',
          theologicalTurn: "Show God's hand through the events themselves.",
          livingQuestion: manifest.thinkItThrough?.[0] || 'What do you think God was doing here?',
        },
      };
    }
  }

  private phase3ContextInfusion(
    manifest: SectionManifest,
    profile: StudentProfile,
    frame: TheologicalFrame,
    plan: LessonPlan
  ): Beat[] {
    console.log(`[PREPARER] Phase 3 — tagging ${manifest.beats.length} beats with pipeline context`);

    return manifest.beats.map((beat, i) => ({
      ...beat,
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
