import { getBandProfile } from './bandConfig';

// ── Tool Definitions ──────────────────────────────────────────────────
// Describes every tool the AI narrator can invoke on the teaching canvas.

export const MAPLIBRE_TEACHING_TOOLS = [
  // ── Scene Control ──
  {
    name: 'set_scene',
    description: 'Switch the canvas between visual modes. "transcript" = kinetic text, "map" = interactive map, "image" = full-screen illustration, "overlay" = blank canvas for overlays.',
    parameters: {
      type: 'OBJECT',
      properties: {
        mode: { type: 'STRING', enum: ['transcript', 'map', 'image', 'overlay'], description: 'Target scene mode' },
        imageUrl: { type: 'STRING', description: 'Image URL (required when mode is "image")' },
        caption: { type: 'STRING', description: 'Optional caption for image scenes' },
      },
      required: ['mode'],
    },
  },

  // ── Map Tools ──
  {
    name: 'zoom_to',
    description: 'Fly the map camera to a named location. Auto-switches to map scene.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: { type: 'STRING', description: 'Named location (e.g., "babel", "egypt", "nile_delta")' },
        lng: { type: 'NUMBER', description: 'Longitude (if location is "coords")' },
        lat: { type: 'NUMBER', description: 'Latitude (if location is "coords")' },
        zoom: { type: 'NUMBER', description: 'Target zoom level (default: 5)' },
        duration: { type: 'NUMBER', description: 'Animation duration in ms (default: 800)' },
      },
      required: ['location'],
    },
  },
  {
    name: 'highlight_region',
    description: 'Fill an ancient kingdom boundary with a translucent color on the map.',
    parameters: {
      type: 'OBJECT',
      properties: {
        regionId: { type: 'STRING', description: 'Region ID (e.g., "mizraim", "cush", "phut", "canaan")' },
        color: { type: 'STRING', description: 'Fill color (e.g., "#fac775")' },
        opacity: { type: 'NUMBER', description: 'Fill opacity 0-1 (default: 0.25)' },
      },
      required: ['regionId', 'color'],
    },
  },
  {
    name: 'draw_route',
    description: 'Animate a migration, trade, or conquest route between two named locations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        from: { type: 'STRING', description: 'Starting location ID' },
        to: { type: 'STRING', description: 'Ending location ID' },
        style: { type: 'STRING', enum: ['migration', 'trade', 'conquest'] },
        color: { type: 'STRING', description: 'Route color' },
      },
      required: ['from', 'to', 'style'],
    },
  },
  {
    name: 'place_marker',
    description: 'Drop a labeled marker at a named city or site.',
    parameters: {
      type: 'OBJECT',
      properties: {
        location: { type: 'STRING', description: 'Named location ID' },
        label: { type: 'STRING', description: 'Display label' },
        color: { type: 'STRING', description: 'Marker color' },
      },
      required: ['location', 'label'],
    },
  },

  // ── Knowledge Overlays ──
  {
    name: 'show_scripture',
    description: 'Display a scripture reference card overlaid on the canvas.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reference: { type: 'STRING', description: 'e.g., "Genesis 10:6"' },
        text: { type: 'STRING', description: 'The scripture text' },
        connection: { type: 'STRING', description: 'How this connects to the lesson' },
      },
      required: ['reference', 'text'],
    },
  },
  {
    name: 'show_genealogy',
    description: 'Display an animated genealogy tree panel.',
    parameters: {
      type: 'OBJECT',
      properties: {
        rootName: { type: 'STRING' },
        nodes: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { name: { type: 'STRING' }, parent: { type: 'STRING' }, descriptor: { type: 'STRING' }, color: { type: 'STRING' } },
            required: ['name'],
          },
        },
      },
      required: ['rootName', 'nodes'],
    },
  },
  {
    name: 'show_timeline',
    description: 'Display a timeline bar with historical events.',
    parameters: {
      type: 'OBJECT',
      properties: {
        events: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: { year: { type: 'NUMBER' }, label: { type: 'STRING' }, color: { type: 'STRING' } },
            required: ['year', 'label'],
          },
        },
      },
      required: ['events'],
    },
  },
  {
    name: 'show_figure',
    description: 'Display a historical figure portrait card.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING' },
        title: { type: 'STRING' },
        imageUrl: { type: 'STRING' },
      },
      required: ['name', 'title'],
    },
  },

  // ── NEW: Richer Teaching Tools ──
  {
    name: 'show_key_term',
    description: 'Display a vocabulary card with definition, pronunciation, and optional etymology. Use when introducing important historical, theological, or geographic terms.',
    parameters: {
      type: 'OBJECT',
      properties: {
        term: { type: 'STRING', description: 'The vocabulary word or phrase' },
        definition: { type: 'STRING', description: 'Clear, age-appropriate definition' },
        pronunciation: { type: 'STRING', description: 'Phonetic pronunciation guide (e.g., "pro-toh-eh-VAN-gel-ee-um")' },
        etymology: { type: 'STRING', description: 'Word origin (e.g., "Greek: protos (first) + evangelion (good news)")' },
      },
      required: ['term', 'definition'],
    },
  },
  {
    name: 'show_comparison',
    description: 'Display a two-column comparison table. Use for contrasting concepts, before/after, cause/effect, or two civilizations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Comparison title (e.g., "Before vs After the Fall")' },
        columnA: {
          type: 'OBJECT',
          properties: {
            heading: { type: 'STRING' },
            points: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['heading', 'points'],
        },
        columnB: {
          type: 'OBJECT',
          properties: {
            heading: { type: 'STRING' },
            points: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['heading', 'points'],
        },
      },
      required: ['title', 'columnA', 'columnB'],
    },
  },
  {
    name: 'show_question',
    description: 'Display a thinking question card. Use at key transition points to provoke reflection, check understanding, or pose rhetorical questions.',
    parameters: {
      type: 'OBJECT',
      properties: {
        question: { type: 'STRING', description: 'The question to display' },
        context: { type: 'STRING', description: 'Optional hint or framing context' },
        type: { type: 'STRING', enum: ['rhetorical', 'reflection', 'check'], description: 'Question type (default: rhetorical)' },
      },
      required: ['question'],
    },
  },
  {
    name: 'show_quote',
    description: 'Display a dramatic quote from a historical figure, theologian, or primary source.',
    parameters: {
      type: 'OBJECT',
      properties: {
        text: { type: 'STRING', description: 'The quote text' },
        attribution: { type: 'STRING', description: 'Who said/wrote it' },
        date: { type: 'STRING', description: 'When (e.g., "354-430 AD")' },
      },
      required: ['text', 'attribution'],
    },
  },
  {
    name: 'show_slide',
    description: 'Display a structured content slide with title, body text, bullet points, and/or image. Use for presenting organized information, summaries, or visual-text combinations.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING', description: 'Slide title' },
        body: { type: 'STRING', description: 'Main body text (1-3 sentences)' },
        bullets: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Bullet points (3-5 items)' },
        imageUrl: { type: 'STRING', description: 'Optional illustration URL' },
        layout: { type: 'STRING', enum: ['center', 'left', 'split'], description: 'Layout style (default: center)' },
      },
      required: ['title'],
    },
  },

  // ── Canvas Management ──
  {
    name: 'clear_canvas',
    description: 'Remove all overlays, routes, markers, and panels. Return to clean state.',
    parameters: { type: 'OBJECT', properties: {}, required: [] },
  },
  {
    name: 'dismiss_overlay',
    description: 'Dismiss a specific overlay panel without clearing the entire canvas.',
    parameters: {
      type: 'OBJECT',
      properties: {
        type: { type: 'STRING', description: 'Type of overlay to dismiss (scripture, figure, genealogy, timeline, keyTerm, comparison, question, quote, slide, or "all")' },
      },
      required: [],
    },
  },
];

// ── System Prompt Builder (full tool-aware — used for LessonPreparer / future tool planner) ──
export function buildHistoryExplainerPrompt(baseContent: string, learnerContext?: { name?: string; age?: number; band?: number }, band: number = 2): string {
    const learnerName = learnerContext?.name || 'the learner';
    const age = learnerContext?.age || 7;
    const profile = getBandProfile(band);

    // Band-specific tool guidance
    const blockedToolsList = profile.tools.blocked.length > 0
        ? `\nBLOCKED TOOLS (do NOT use): ${profile.tools.blocked.join(', ')}.`
        : '';

    const toolCaps = `
TOOL LIMITS:
- show_timeline: max ${profile.tools.maxTimelineEvents} events.
- show_comparison: max ${profile.tools.maxComparisonPoints} points per column.
- show_genealogy: max ${profile.tools.maxGenealogyNodes} nodes.
- show_slide: max ${profile.tools.maxSlideBullets} bullets.
- Maps: ${profile.tools.mapToolsEnabled ? 'enabled' : 'DISABLED — do not use map tools.'}.
- Quotes: ${profile.tools.quoteAllowed ? 'allowed' : 'NOT allowed.'}.
- Scripture: ${profile.tools.scriptureAllowed ? 'allowed' : 'NOT allowed.'}.${blockedToolsList}`;

    // Voice directive — adapts per band instead of one-size-fits-all
    const voiceBlock = band <= 1
        ? `\nVOICE & DELIVERY:\n${profile.narration.toneDirective}\n- This is a STORYBOOK experience. Warmth and wonder are paramount.\n`
        : band <= 3
        ? `\nVOICE & DELIVERY:\n${profile.narration.toneDirective}\n- Project confidence and energy — you are TEACHING, not reading.\n`
        : `\nVOICE & DELIVERY:\n- Speak with STRONG, BOLD, AUTHORITATIVE energy — like a passionate university professor.\n- ${profile.narration.toneDirective}\n- Project confidence and conviction in EVERY sentence.\n`;

    // Visual mix targets
    const visualRule = `
THE VISUAL RULE — CRITICAL:
Target mix: Image ${profile.visuals.imagePct}%, Map ${profile.visuals.mapPct}%, Overlay ${profile.visuals.overlayPct}%, Transcript ≤${profile.visuals.transcriptPctMax}%.
- NEVER narrate for more than 15 seconds without a visual element on screen.
- When in doubt, USE A VISUAL.`;

    // Theology gate
    const theologyBlock = profile.theologyGate.blockedConcepts.length > 0
        ? `\nTHEOLOGY SCOPE:\n- You may use: ${profile.theologyGate.allowedConcepts.join(', ')}.\n- ABOVE this student's level (paraphrase around them): ${profile.theologyGate.blockedConcepts.join(', ')}.\n`
        : `\nTHEOLOGY SCOPE: Full academic register — all theological concepts available.\n`;

    return `YOUR ROLE:
You are a narrator of African History speaking to ${learnerName} (age ${age}, Band ${band} — "${profile.label}").
You control a full-screen teaching canvas with visual tools.
${voiceBlock}
════════════════════════════════════
NARRATION CONSTRAINTS (STRICT)
════════════════════════════════════
- Target ${profile.narration.targetWordsPerBeat[0]}–${profile.narration.targetWordsPerBeat[1]} words per beat.
- Maximum ${profile.narration.maxSentences} sentences.
- Maximum ${profile.narration.maxSentenceWords} words per sentence.
- Vocabulary: ${profile.narration.vocabularyLevel} — ${profile.narration.vocabularyDescription}
${profile.narration.requireConcreteExamples ? '- EVERY abstract idea must have a concrete example or analogy.' : ''}
${!profile.narration.allowAbstractTerms ? '- Do NOT use abstract theological or philosophical terms.' : ''}
- If output exceeds max words, rewrite shorter before responding.
${visualRule}

VISUAL PRIORITY ORDER (prefer higher):
  1. Image Scene (set_scene "image") — full-bleed illustration
  2. Slide (show_slide) — structured content
  3. Map Scene (set_scene "map" + markers/routes) — geographic content
  4. Overlay combinations — scripture + timeline, comparison + map
  5. Transcript — LAST RESORT

═══════════════════════════════
CANVAS TOOLS
═══════════════════════════════
SCENE CONTROL:
- set_scene("image", imageUrl, caption) — Show full-screen illustration.
- set_scene("map") — Switch to interactive map.
- set_scene("transcript") — Kinetic text. Use SPARINGLY.
- set_scene("overlay") — Blank canvas for overlay-only.

MAP TOOLS:
- zoom_to — Fly camera to location.
- highlight_region — Fill ancient boundaries.
- draw_route — Animate migration/trade/conquest paths.
- place_marker — Label cities/sites.

KNOWLEDGE OVERLAYS:
- show_scripture, show_genealogy, show_timeline, show_figure
- show_key_term, show_comparison, show_question, show_quote, show_slide

MANAGEMENT:
- clear_canvas, dismiss_overlay
${toolCaps}
${theologyBlock}
═══════════════════════════
BEAT CHOREOGRAPHY RULES
═══════════════════════════
1. EVERY beat MUST start with a visual tool call.
2. Layer overlays on top of scenes.
3. Use clear_canvas between major topic transitions.
4. Use show_question at natural chapter breaks.
5. Use show_key_term BEFORE using a new vocabulary word.
6. End lessons with show_question (type: "reflection").

MAP POPULATION RULE: A blank map is NEVER acceptable.

LESSON CONTENT TO NARRATE:
${baseContent}

CRITICAL RULES:
- Never give grades or scores.
- The transcript view is NOT your home base — VISUALS are.
- Every beat must feel like a scene from a documentary, not a page from a book.`;
}

// ── Narration-Only Prompt Builder (used by BeatSequencer — no tool references) ──
export interface NarrationPromptParams {
    baseText: string;
    band: number;
    beatIndex: number;
    totalBeats: number;
    isFirst: boolean;
    isLast: boolean;
    previousNarratedText: string;
    pipelineContext?: {
        lessonArchitecture?: { hook?: string; theologicalTurn?: string; livingQuestion?: string };
        theologicalFrame?: { whatGodIsDoing?: string; covenantPrinciple?: string; africaConnection?: string };
        studentProfile?: { emotionalRegister?: string; vocabularyCeiling?: string };
        beatRole?: string;
    };
}

export function buildNarrationPrompt(params: NarrationPromptParams): string {
    const { baseText, band, beatIndex, totalBeats, isFirst, isLast, previousNarratedText, pipelineContext } = params;
    const profile = getBandProfile(band);

    const jsonGuard = `\n\nCRITICAL OUTPUT RULES:\n- Your response must be ONLY plain narration text — spoken words for the student.\n- NEVER include JSON, code blocks, markdown fences, tool commands, function calls, or any structured data.\n- Do NOT output anything like \`\`\`json, set_scene(), show_scripture(), or [{"command":...}].\n- If you feel the urge to include stage directions or visual cues, suppress it — those are handled separately.\n`;

    // Band-adaptive voice guard — replaces the one-size-fits-all "AUTHORITATIVE" directive
    const voiceGuard = band <= 1
        ? `\n\nVOICE (NON-NEGOTIABLE):\n${profile.narration.toneDirective}\n- Keep it warm, vivid, and full of wonder. Short sentences.\n`
        : band <= 3
        ? `\n\nVOICE (NON-NEGOTIABLE):\n${profile.narration.toneDirective}\n- Be clear, confident, and engaging. Not a bedtime story — a real lesson.\n`
        : `\n\nVOICE CONSISTENCY (NON-NEGOTIABLE):\n- Speak with STRONG, BOLD, AUTHORITATIVE energy — like a passionate university professor.\n- ${profile.narration.toneDirective}\n- Project confidence and conviction in EVERY sentence.\n- This instruction OVERRIDES all other tone guidance.\n`;

    // Strict narration constraints from band profile
    const constraints = `\n\nNARRATION CONSTRAINTS (STRICT):\n- Maximum ${profile.narration.targetWordsPerBeat[1]} words total. Target: ${profile.narration.targetWordsPerBeat[0]}–${profile.narration.targetWordsPerBeat[1]}.\n- Maximum ${profile.narration.maxSentences} sentences.\n- Maximum ${profile.narration.maxSentenceWords} words per sentence.\n- Vocabulary: ${profile.narration.vocabularyLevel} — ${profile.narration.vocabularyDescription}\n${!profile.narration.allowAbstractTerms ? '- Do NOT use abstract theological or philosophical terms.\n' : ''}${profile.narration.requireConcreteExamples ? '- EVERY abstract idea must include a concrete example.\n' : ''}- If output exceeds max words, rewrite shorter before responding.\n`;

    // Theology gate
    const theologyGate = profile.theologyGate.blockedConcepts.length > 0
        ? `\n\nTHEOLOGY SCOPE:\n- You may use these concepts: ${profile.theologyGate.allowedConcepts.join(', ')}.\n- These concepts are above this student's level — paraphrase around them: ${profile.theologyGate.blockedConcepts.join(', ')}.\n`
        : '';

    // Pipeline-aware context injection
    let pipeCtx = '';
    if (pipelineContext) {
        const { theologicalFrame: theFrame, lessonArchitecture: lessonArch, studentProfile: studentProf, beatRole } = pipelineContext;
        if (theFrame) {
            pipeCtx += `\nTHEOLOGICAL FRAME: God is ${theFrame.whatGodIsDoing}. Covenant principle: ${theFrame.covenantPrinciple}.`;
            if (theFrame.africaConnection) pipeCtx += ` Africa connection: ${theFrame.africaConnection}.`;
        }
        if (lessonArch && beatRole === 'hook') {
            pipeCtx += `\nLESSON HOOK APPROACH: ${lessonArch.hook}`;
        }
        if (lessonArch && beatRole === 'theological_turn') {
            pipeCtx += `\nTHEOLOGICAL TURN: ${lessonArch.theologicalTurn}. This must emerge naturally from the story — never announced.`;
        }
        if (lessonArch && beatRole === 'living_question') {
            pipeCtx += `\nLIVING QUESTION: End with this question posed to the student: "${lessonArch.livingQuestion}". Pose it and stop. Do NOT answer it.`;
        }
        if (studentProf) {
            pipeCtx += `\nSTUDENT: Emotional register: ${studentProf.emotionalRegister}. Vocabulary ceiling: ${studentProf.vocabularyCeiling}.`;
        }
    }

    let prompt: string;

    if (isFirst) {
        prompt = `You are beginning a lesson for age-band ${band} ("${profile.label}", ages ${profile.ages}). Narrate the following content. Do not introduce yourself or say "welcome" — start directly with the content.${jsonGuard}${voiceGuard}${constraints}${theologyGate}${pipeCtx}\nContent: "${baseText}"`;
    } else {
        prompt = `CRITICAL: This is segment ${beatIndex} of ${totalBeats} in a CONTINUOUS lesson that is already in progress. The student has been listening without interruption.\n\nRULES:\n- Do NOT greet, welcome, or introduce yourself.\n- Do NOT say "Let's continue" or "Now let's look at" or recap what was just said.\n- Do NOT summarize previous segments.\n- Continue narrating as if you are mid-lecture, seamlessly flowing from the previous passage.${jsonGuard}${voiceGuard}${constraints}${theologyGate}${pipeCtx}\nPrevious segment ended with: "${previousNarratedText.slice(-200)}"\n\nNarrate this next passage for age-band ${band} ("${profile.label}"). Maintain all historical facts and theological depth appropriate for this level.\n\nContent: "${baseText}"`;
    }

    if (isLast) {
        prompt += '\n\nThis is the final segment. End with a thoughtful closing reflection — not a summary, but a question or observation the student can carry with them. Do NOT say "goodbye" or "see you next time."';
    }

    return prompt;
}
