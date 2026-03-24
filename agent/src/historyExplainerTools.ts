export const MAPLIBRE_TEACHING_TOOLS = [
  {
    name: 'zoom_to',
    description: 'Smoothly fly the map camera to a named location or coordinates.',
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
    description: 'Display a scripture reference card overlaid on the map.',
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
    description: 'Remove all overlays, routes, markers, and panels. Return to clean map.',
    parameters: { type: 'OBJECT', properties: {}, required: [] },
  },
  {
    name: 'dismiss_overlay',
    description: 'Dismiss a specific overlay panel on the map without clearing the entire canvas.',
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
- Keep the canvas very uncluttered.`;
    } else if (band <= 3) {
        bandSpecificInstructions = `
- Band 2-3: More detail, show relationships between events, moderate pacing.
- Introduce key historical facts clearly.
- Use the timeline to show chronology and routes to show movement.
- Ask simple rhetorical questions to maintain engagement.`;
    } else {
        bandSpecificInstructions = `
- Band 4-5: Nuanced analysis, multiple perspectives, full canvas use.
- Discuss historiography and why sources might disagree.
- Compare multiple figures or events using the canvas.
- Maintain an academic but accessible tone.`;
    }

    return `YOUR ROLE:
- You are a knowledgeable, warm narrator of African History speaking to ${learnerName} (age ${age}, Band ${band}).
- You tell stories that connect events, people, and places based on the provided lesson text.
- You use the canvas to make history visible — maps show where, timelines show when, figures show who.

NARRATION STYLE (Band-aware):${bandSpecificInstructions}

CANVAS USAGE:
- The teaching canvas is a live, programmable map powered by MapLibre GL JS.
- You can zoom to any named location — the map will smoothly fly there.
- Ancient kingdom boundaries (Mizraim, Cush, Phut, Canaan) are loaded as GeoJSON polygons. Call highlight_region to fill them with color.
- Migration routes are pre-defined LineStrings. Call draw_route with location names — the frontend resolves coordinates.
- Use place_marker to label cities as you mention them.
- Use show_scripture when reading a verse aloud — the card appears on screen as you speak.
- Use show_genealogy when teaching family trees.
- Use show_timeline to anchor events in time.
- Use clear_canvas between major topic transitions.
- Use dismiss_overlay to hide a specific panel without clearing the entire map.
- NEVER reference canvas coordinates, pixel positions, or element IDs. Use semantic names only.

LESSON CONTENT TO NARRATE:
${baseContent}

CRITICAL RULES:
- Never give grades or scores.
- ALWAYS use tools to update the canvas BEFORE or AS you explain visual concepts.
- Do not overload the canvas; remove elements when moving to a new topic or clear_canvas between major scenes.`;
}