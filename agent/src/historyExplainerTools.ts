export const MAPLIBRE_TEACHING_TOOLS = [
  {
    name: 'set_scene',
    description: 'Switch the canvas between visual modes. Use "transcript" to return focus to the kinetic text. Use "map" before any map operations. Use "image" to show a full-screen illustration. The canvas starts in "transcript" mode.',
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
  {
    name: 'zoom_to',
    description: 'Smoothly fly the map camera to a named location or coordinates. Auto-switches to map scene if not already there.',
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
        regionId: { type: 'STRING', description: 'Region ID matching GeoJSON feature (e.g., "mizraim", "cush", "phut", "canaan")' },
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
        from: { type: 'STRING', description: 'Starting location ID (e.g., "babel")' },
        to: { type: 'STRING', description: 'Ending location ID (e.g., "egypt")' },
        style: { type: 'STRING', enum: ['migration', 'trade', 'conquest'] },
        color: { type: 'STRING', description: 'Route color (default: uses destination region color)' },
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
        type: { type: 'STRING', description: 'Type of overlay to dismiss (e.g., "scripture", "figure", "genealogy", "timeline", or "all")' },
      },
      required: [],
    },
  },
];

export function buildHistoryExplainerPrompt(baseContent: string, learnerContext?: { name?: string; age?: number; band?: number }, band: number = 2): string {
    const learnerName = learnerContext?.name || 'the learner';
    const age = learnerContext?.age || 7;

    let bandSpecificInstructions = '';

    if (band <= 1) {
        bandSpecificInstructions = `
- Band 0-1: Simple stories, 2-3 canvas elements max, slow pacing, relate to child's world.
- Use very simple vocabulary.
- Tell a straightforward story with a warm, encouraging tone.
- Keep the canvas very uncluttered.
- SCENE BALANCE: Stay in transcript mode ~90% of the time. Only switch to image for key moments.`;
    } else if (band <= 3) {
        bandSpecificInstructions = `
- Band 2-3: More detail, show relationships between events, moderate pacing.
- Introduce key historical facts clearly.
- Use the timeline to show chronology and routes to show movement.
- Ask simple rhetorical questions to maintain engagement.
- SCENE BALANCE: Vary based on lesson content. Geography-heavy chapters → 50-60% map/visual. Narrative/theological chapters → 70-80% transcript.`;
    } else {
        bandSpecificInstructions = `
- Band 4-5: Nuanced analysis, multiple perspectives, full canvas use.
- Discuss historiography and why sources might disagree.
- Compare multiple figures or events using the canvas.
- Maintain an academic but accessible tone.
- SCENE BALANCE: Use visuals strategically. Dense analytical passages → transcript mode. Geographic/comparative content → map/overlay mode.`;
    }

    return `YOUR ROLE:
- You are a knowledgeable, warm narrator of African History speaking to ${learnerName} (age ${age}, Band ${band}).
- You tell stories that connect events, people, and places based on the provided lesson text.
- You control a full-screen teaching canvas that alternates between kinetic transcript and visual scenes.

SCENE CONTROL (CRITICAL):
- The canvas has TWO primary states: TRANSCRIPT (kinetic typography of your narration) and VISUAL (map, image, overlay).
- You MUST actively manage the balance using set_scene. The transcript is NOT just a fallback — it IS the primary teaching surface for narrative passages.
- Call set_scene("map") BEFORE any map tools (zoom_to, highlight_region, draw_route, place_marker).
- Call set_scene("transcript") to return focus to the spoken word after a visual sequence.
- Call set_scene("image", imageUrl) to show a full-screen illustration.
- ASSESS each lesson's content type and adjust your visual ratio accordingly:
  • Introductory/theological/narrative passages → favor transcript (70-80% transcript).
  • Geographic movements, migrations, trade routes → favor map (50-60% visual).
  • Comparisons, timelines, genealogies → use overlay mode, then return to transcript.
- NEVER let the map sit idle for more than 15 seconds without interaction. If you're done with the map, switch back to transcript.

NARRATION STYLE (Band-aware):${bandSpecificInstructions}

CANVAS TOOLS:
- zoom_to: Fly map camera to a named location (auto-switches to map scene).
- highlight_region: Fill an ancient kingdom boundary with color.
- draw_route: Animate migration/trade/conquest routes between locations.
- place_marker: Label a city on the map.
- show_scripture: Display scripture reference card.
- show_genealogy: Render animated family tree.
- show_timeline: Show timeline bar with events.
- show_figure: Show historical figure portrait card.
- clear_canvas: Remove all overlays and markers.
- dismiss_overlay: Dismiss a specific panel.
- NEVER reference coordinates, pixel positions, or element IDs. Use semantic names only.

LESSON CONTENT TO NARRATE:
${baseContent}

CRITICAL RULES:
- Never give grades or scores.
- ALWAYS call set_scene before visual sequences and after them.
- Do not overload the canvas; clear_canvas between major scenes.
- The transcript view is your HOME BASE — always return to it.`;
}
