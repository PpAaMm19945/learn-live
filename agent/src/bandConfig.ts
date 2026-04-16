// ── Band Configuration ─────────────────────────────────────────────────
// Single source of truth for all 6 age-band profiles.
// Pure data — no logic. Imported by sequencer, prompt builders, TTS, and session controller.

export interface BandProfile {
  label: string;
  ages: string;
  narration: {
    targetWordsPerBeat: [number, number]; // [min, max]
    maxSentences: number;
    maxSentenceWords: number;
    vocabularyLevel: 'pre-reader' | 'early-reader' | 'middle-grade' | 'upper-middle' | 'early-high' | 'late-high';
    vocabularyDescription: string;
    allowAbstractTerms: boolean;
    requireConcreteExamples: boolean;
    toneDirective: string;
  };
  tts: {
    voiceName: string;
    /** Natural-language pace/style directive prepended to text for Gemini TTS. */
    pacePrompt: string;
    style: 'gentle' | 'warm-story' | 'clear-teacher' | 'coach' | 'seminar' | 'debate';
    /** Extra dwell time (ms) after audio ends, before next beat. Lets young children absorb the illustration. */
    postAudioDwellMs: number;
  };
  tools: {
    blocked: string[];
    maxTimelineEvents: number;
    maxComparisonPoints: number;
    maxGenealogyNodes: number;
    maxSlideBullets: number;
    mapToolsEnabled: boolean;
    scriptureAllowed: boolean;
    quoteAllowed: boolean;
    keyTermAllowed: boolean;
    simplifyKeyTerms: boolean; // strip etymology/pronunciation for younger bands
  };
  visuals: {
    imagePct: number;
    mapPct: number;
    overlayPct: number;
    transcriptPctMax: number;
  };
  interactivity: {
    raiseHand: 'disabled' | 'guided' | 'full';
    questionTypes: string[];
  };
  theologyGate: {
    allowedConcepts: string[];
    blockedConcepts: string[];
  };
}

export const BAND_PROFILES: Record<number, BandProfile> = {
  0: {
    label: 'Storybook',
    ages: '3–4',
    narration: {
      targetWordsPerBeat: [18, 35],
      maxSentences: 3,
      maxSentenceWords: 8,
      vocabularyLevel: 'pre-reader',
      vocabularyDescription: 'Only concrete nouns and simple action verbs a 3-year-old knows. No abstract ideas.',
      allowAbstractTerms: false,
      requireConcreteExamples: true,
      toneDirective: 'Speak like a warm, gentle uncle telling a bedtime story. Short sentences, vivid pictures with words, full of wonder. Use "Wow!" and "Look!" naturally.',
    },
    tts: { voiceName: 'Kore', pacePrompt: 'Speak very slowly and gently, like reading a bedtime story to a small child. Use a warm, soft tone with long pauses between sentences:', style: 'gentle', postAudioDwellMs: 4000 },
    tools: {
      blocked: ['show_comparison', 'show_quote', 'show_genealogy', 'show_timeline', 'zoom_to', 'highlight_region', 'draw_route', 'place_marker'],
      maxTimelineEvents: 0,
      maxComparisonPoints: 0,
      maxGenealogyNodes: 0,
      maxSlideBullets: 1,
      mapToolsEnabled: false,
      scriptureAllowed: false,
      quoteAllowed: false,
      keyTermAllowed: false,
      simplifyKeyTerms: true,
    },
    visuals: { imagePct: 75, mapPct: 0, overlayPct: 20, transcriptPctMax: 5 },
    interactivity: { raiseHand: 'disabled', questionTypes: ['check'] },
    theologyGate: {
      allowedConcepts: ['God', 'good', 'bad', 'helper', 'family', 'promise', 'garden', 'animals'],
      blockedConcepts: ['Providence', 'covenant', 'sovereignty', 'protoevangelion', 'redemption', 'typology', 'eschatology', 'imputation', 'federal headship', 'theodicy', 'hermeneutics'],
    },
  },

  1: {
    label: 'Early Storybook',
    ages: '5–6',
    narration: {
      targetWordsPerBeat: [30, 55],
      maxSentences: 4,
      maxSentenceWords: 10,
      vocabularyLevel: 'early-reader',
      vocabularyDescription: 'Simple vocabulary with max 1 new word per beat, immediately defined in-line.',
      allowAbstractTerms: false,
      requireConcreteExamples: true,
      toneDirective: 'Speak like an enthusiastic storyteller reading aloud. Warm but energetic. Use questions like "Can you guess what happened next?" sparingly.',
    },
    tts: { voiceName: 'Kore', pacePrompt: 'Speak slowly and warmly, like an enthusiastic storyteller reading aloud to young children. Clear and gentle pace:', style: 'warm-story', postAudioDwellMs: 3000 },
    tools: {
      blocked: ['show_comparison', 'show_quote', 'show_genealogy', 'highlight_region', 'draw_route'],
      maxTimelineEvents: 2,
      maxComparisonPoints: 0,
      maxGenealogyNodes: 0,
      maxSlideBullets: 2,
      mapToolsEnabled: false,
      scriptureAllowed: true,
      quoteAllowed: false,
      keyTermAllowed: true,
      simplifyKeyTerms: true,
    },
    visuals: { imagePct: 65, mapPct: 5, overlayPct: 25, transcriptPctMax: 10 },
    interactivity: { raiseHand: 'disabled', questionTypes: ['check'] },
    theologyGate: {
      allowedConcepts: ['God', 'good', 'bad', 'sin', 'helper', 'family', 'promise', 'garden', 'animals', 'Noah', 'flood', 'rainbow', 'obey'],
      blockedConcepts: ['Providence', 'covenant', 'sovereignty', 'protoevangelion', 'typology', 'eschatology', 'imputation', 'federal headship', 'theodicy', 'hermeneutics'],
    },
  },

  2: {
    label: 'Explorer',
    ages: '7–8',
    narration: {
      targetWordsPerBeat: [55, 85],
      maxSentences: 5,
      maxSentenceWords: 14,
      vocabularyLevel: 'middle-grade',
      vocabularyDescription: 'Grade-school vocabulary. Introduce 1-2 terms per beat with clear definitions. Use one explicit cause/effect connector per beat.',
      allowAbstractTerms: false,
      requireConcreteExamples: true,
      toneDirective: 'Speak like a clear, friendly teacher explaining something exciting. Direct and confident but approachable. Use "Here is why this matters" framing.',
    },
    tts: { voiceName: 'Leda', pacePrompt: 'Speak clearly and at a normal pace, like a friendly teacher explaining something interesting:', style: 'clear-teacher', postAudioDwellMs: 1500 },
    tools: {
      blocked: ['show_quote'],
      maxTimelineEvents: 3,
      maxComparisonPoints: 2,
      maxGenealogyNodes: 4,
      maxSlideBullets: 3,
      mapToolsEnabled: true,
      scriptureAllowed: true,
      quoteAllowed: false,
      keyTermAllowed: true,
      simplifyKeyTerms: true,
    },
    visuals: { imagePct: 45, mapPct: 20, overlayPct: 25, transcriptPctMax: 10 },
    interactivity: { raiseHand: 'guided', questionTypes: ['check', 'reflection'] },
    theologyGate: {
      allowedConcepts: ['God', 'sin', 'promise', 'covenant', 'judgment', 'mercy', 'creation', 'flood', 'nations', 'obedience', 'disobedience', 'blessing', 'curse'],
      blockedConcepts: ['Providence', 'sovereignty', 'protoevangelion', 'typology', 'eschatology', 'imputation', 'federal headship', 'theodicy', 'hermeneutics', 'common grace'],
    },
  },

  3: {
    label: 'Investigator',
    ages: '9–11',
    narration: {
      targetWordsPerBeat: [80, 120],
      maxSentences: 6,
      maxSentenceWords: 18,
      vocabularyLevel: 'upper-middle',
      vocabularyDescription: 'Upper-elementary vocabulary. Include one causal link and one implication sentence per beat. Historical terms with brief in-context definitions.',
      allowAbstractTerms: true,
      requireConcreteExamples: true,
      toneDirective: 'Speak like an engaging coach breaking down a game plan. Confident, direct, and motivating. Use pattern language: "Notice how..." and "This is the same pattern we saw when..."',
    },
    tts: { voiceName: 'Orus', pacePrompt: 'Speak with a confident, engaging pace like an energetic coach explaining a game plan:', style: 'coach', postAudioDwellMs: 0 },
    tools: {
      blocked: [],
      maxTimelineEvents: 4,
      maxComparisonPoints: 3,
      maxGenealogyNodes: 6,
      maxSlideBullets: 4,
      mapToolsEnabled: true,
      scriptureAllowed: true,
      quoteAllowed: true,
      keyTermAllowed: true,
      simplifyKeyTerms: false,
    },
    visuals: { imagePct: 30, mapPct: 30, overlayPct: 30, transcriptPctMax: 10 },
    interactivity: { raiseHand: 'guided', questionTypes: ['check', 'reflection', 'rhetorical', 'cause_effect'] },
    theologyGate: {
      allowedConcepts: ['God', 'sin', 'covenant', 'judgment', 'mercy', 'creation', 'Providence', 'redemption', 'nations', 'blessing', 'curse', 'sovereignty', 'faith', 'grace', 'justice'],
      blockedConcepts: ['protoevangelion', 'typology', 'eschatology', 'imputation', 'federal headship', 'theodicy', 'hermeneutics', 'common grace', 'antithesis'],
    },
  },

  4: {
    label: 'Scholar',
    ages: '12–14',
    narration: {
      targetWordsPerBeat: [110, 170],
      maxSentences: 7,
      maxSentenceWords: 22,
      vocabularyLevel: 'early-high',
      vocabularyDescription: 'Academic vocabulary with pattern language and one contrast per beat. Students can handle multi-clause sentences and abstract reasoning.',
      allowAbstractTerms: true,
      requireConcreteExamples: false,
      toneDirective: 'Speak like a university seminar leader — authoritative, intellectually stimulating, occasionally wry. Challenge assumptions. Use "Consider this..." and "The evidence suggests..."',
    },
    tts: { voiceName: 'Charon', pacePrompt: 'Speak with an authoritative, intellectually stimulating pace like a university seminar leader:', style: 'seminar', postAudioDwellMs: 0 },
    tools: {
      blocked: [],
      maxTimelineEvents: 6,
      maxComparisonPoints: 4,
      maxGenealogyNodes: 8,
      maxSlideBullets: 5,
      mapToolsEnabled: true,
      scriptureAllowed: true,
      quoteAllowed: true,
      keyTermAllowed: true,
      simplifyKeyTerms: false,
    },
    visuals: { imagePct: 20, mapPct: 35, overlayPct: 35, transcriptPctMax: 10 },
    interactivity: { raiseHand: 'full', questionTypes: ['check', 'reflection', 'rhetorical', 'cause_effect', 'debate'] },
    theologyGate: {
      allowedConcepts: ['God', 'sin', 'covenant', 'judgment', 'mercy', 'Providence', 'redemption', 'sovereignty', 'grace', 'justice', 'protoevangelion', 'typology', 'common grace', 'antithesis', 'federal headship'],
      blockedConcepts: ['eschatology', 'imputation', 'theodicy', 'hermeneutics'],
    },
  },

  5: {
    label: 'Advanced Scholar',
    ages: '15–17+',
    narration: {
      targetWordsPerBeat: [150, 250],
      maxSentences: 9,
      maxSentenceWords: 28,
      vocabularyLevel: 'late-high',
      vocabularyDescription: 'Full academic register. Include thesis-level theological claims with supporting historical evidence. Multi-perspective analysis expected.',
      allowAbstractTerms: true,
      requireConcreteExamples: false,
      toneDirective: 'Speak like a distinguished professor in a graduate seminar — commanding, erudite, intellectually demanding. Use primary source references. Employ Socratic questioning. Frame claims as "The textual evidence compels us to conclude..."',
    },
    tts: { voiceName: 'Charon', pacePrompt: 'Speak with a commanding, erudite pace like a distinguished professor in a graduate seminar:', style: 'debate', postAudioDwellMs: 0 },
    tools: {
      blocked: [],
      maxTimelineEvents: 8,
      maxComparisonPoints: 5,
      maxGenealogyNodes: 12,
      maxSlideBullets: 6,
      mapToolsEnabled: true,
      scriptureAllowed: true,
      quoteAllowed: true,
      keyTermAllowed: true,
      simplifyKeyTerms: false,
    },
    visuals: { imagePct: 15, mapPct: 35, overlayPct: 40, transcriptPctMax: 10 },
    interactivity: { raiseHand: 'full', questionTypes: ['check', 'reflection', 'rhetorical', 'cause_effect', 'debate', 'essay'] },
    theologyGate: {
      allowedConcepts: ['God', 'sin', 'covenant', 'judgment', 'mercy', 'Providence', 'redemption', 'sovereignty', 'grace', 'justice', 'protoevangelion', 'typology', 'common grace', 'antithesis', 'federal headship', 'eschatology', 'imputation', 'theodicy', 'hermeneutics'],
      blockedConcepts: [],
    },
  },
};

export function getBandProfile(band: number): BandProfile {
  const clamped = Math.max(0, Math.min(5, Math.round(band)));
  return BAND_PROFILES[clamped];
}
