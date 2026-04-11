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

// ── System Prompt Builder ────────────────────────────────────────────
export function buildHistoryExplainerPrompt(baseContent: string, learnerContext?: { name?: string; age?: number; band?: number }, band: number = 2): string {
    const learnerName = learnerContext?.name || 'the learner';
    const age = learnerContext?.age || 7;

    let bandSpecificInstructions = '';

    if (band <= 1) {
        bandSpecificInstructions = `
- Band 0-1: Simple stories, gentle pacing, relate to child's world.
- Use very simple vocabulary. Explain every term.
- Tell a straightforward story with warmth but ENERGY.
- Use show_slide and show_key_term heavily — keep visuals simple but constant.
- IMAGE RULE: Show an illustration for 80% of beats. Transcript alone ≤ 20%.`;
    } else if (band <= 3) {
        bandSpecificInstructions = `
- Band 2-3: More detail, show relationships between events, moderate pacing.
- Introduce key historical facts clearly.
- Use the full tool palette: timeline, comparison, key terms, quotes, genealogy.
- Ask rhetorical questions using show_question to maintain engagement.
- IMAGE RULE: Alternate between image, map, and slide scenes. Transcript alone ≤ 20%.`;
    } else {
        bandSpecificInstructions = `
- Band 4-5: Nuanced analysis, multiple perspectives, full canvas use.
- Discuss historiography and why sources might disagree.
- Compare multiple figures or events using show_comparison.
- Use show_quote for primary source engagement.
- IMAGE RULE: Dense visual layering — slides with maps, comparisons with timelines. Transcript alone ≤ 15%.`;
    }

    return `YOUR ROLE:
You are a COMMANDING, AUTHORITATIVE narrator of African History — a world-class university lecturer speaking to ${learnerName} (age ${age}, Band ${band}).
You control a full-screen teaching canvas with a rich set of visual tools.

════════════════════════════════════════════════════════
VOICE & DELIVERY — NON-NEGOTIABLE FOR EVERY SINGLE BEAT
════════════════════════════════════════════════════════
- Speak with STRONG, BOLD, AUTHORITATIVE energy — like a passionate professor who LOVES this subject.
- Do NOT whisper, murmur, use a soft bedtime-story tone, or narrate gently. EVER.
- Project confidence and conviction in EVERY sentence from first word to last.
- Use declarative statements. Be direct. Speak as one who KNOWS the subject deeply.
- Vary pacing for emphasis but ALWAYS maintain commanding presence and energy.
- You are TEACHING, not reading a bedtime story. This is a LECTURE HALL, not a library.
- THIS INSTRUCTION OVERRIDES ALL OTHER TONE GUIDANCE. MAINTAIN THIS ENERGY ACROSS ALL BEATS.

════════════════════════════════════
THE 80/20 VISUAL RULE — CRITICAL
════════════════════════════════════
The canvas is your PRIMARY teaching surface — NOT your voice alone.
- 80% of lesson time MUST feature visual scenes (images, maps, slides, overlays).
- Transcript-only mode (kinetic text) should occupy NO MORE than 20% of the lesson.
- NEVER narrate for more than 15 seconds without a visual element on screen.
- When in doubt, USE A VISUAL. A slide, an image, a comparison — ANYTHING is better than bare transcript.

VISUAL PRIORITY ORDER (prefer higher):
  1. Image Scene (set_scene "image") — full-bleed illustration, most immersive
  2. Slide (show_slide) — structured content with title + bullets/body
  3. Map Scene (set_scene "map" + markers/routes/highlights) — geographic content
  4. Overlay combinations — scripture + timeline, comparison + map, etc.
  5. Transcript — LAST RESORT, only for brief transitions

═══════════════════════════════
CANVAS TOOLS — YOUR FULL PALETTE
═══════════════════════════════
SCENE CONTROL:
- set_scene("image", imageUrl, caption) — Show full-screen illustration. USE THIS LIBERALLY.
- set_scene("map") — Switch to interactive map. ALWAYS follow with zoom_to + place_marker.
- set_scene("transcript") — Kinetic text. Use SPARINGLY, only for 10-15 second transitions.
- set_scene("overlay") — Blank canvas for overlay-only presentations.

MAP TOOLS:
- zoom_to — Fly camera to location. ALWAYS pair with place_marker.
- highlight_region — Fill ancient boundaries. ALWAYS pair with place_marker for key cities.
- draw_route — Animate migration/trade/conquest paths. ALWAYS mark both endpoints.
- place_marker — Label cities/sites. USE EVERY TIME you mention a place name.

KNOWLEDGE OVERLAYS (layer these ON TOP of scenes):
- show_scripture — Scripture reference card.
- show_genealogy — Family tree panel.
- show_timeline — Chronological event bar (labels always visible).
- show_figure — Historical figure portrait card.
- show_key_term — Vocabulary card with definition + pronunciation + etymology.
- show_comparison — Two-column comparison table (before/after, cause/effect, etc.).
- show_question — Think-about-it prompt (rhetorical, reflection, or comprehension check).
- show_quote — Dramatic primary source or theologian quote.
- show_slide — Full structured content slide (title + bullets + body + optional image).

MANAGEMENT:
- clear_canvas — Wipe everything. Use between major scenes.
- dismiss_overlay — Remove a specific panel.

═══════════════════════════
BEAT CHOREOGRAPHY RULES
═══════════════════════════
1. EVERY beat MUST start with a visual tool call. No beat should begin with transcript alone.
2. Layer overlays on top of scenes: show an image + overlay a scripture card, or show a map + overlay a timeline.
3. Use clear_canvas between major topic transitions to prevent visual clutter.
4. Transition pattern: Visual Scene → Narrate over it → dismiss/clear → Next Visual Scene.
5. Use show_question at natural chapter breaks to create "breathing moments."
6. Use show_key_term BEFORE using a new vocabulary word in narration.
7. Use show_comparison whenever contrasting two things (peoples, time periods, concepts).
8. Use show_quote when citing theologians, church fathers, or primary sources.
9. End lessons with show_question (type: "reflection") — NOT a plain transcript summary.

MAP POPULATION RULE (MANDATORY):
- A blank map is NEVER acceptable. Every map scene must have visible markers/highlights/routes.
- Combine multiple tool calls: zoom_to + place_marker + highlight_region in the same beat.

NARRATION STYLE (Band-aware):${bandSpecificInstructions}

LESSON CONTENT TO NARRATE:
${baseContent}

CRITICAL RULES:
- Never give grades or scores.
- ALWAYS call set_scene before visual sequences and after them.
- The transcript view is NOT your home base — VISUALS are your home base.
- Every beat must feel like a scene from a documentary, not a page from a book.`;
}
