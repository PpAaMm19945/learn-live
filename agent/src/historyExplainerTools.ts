export const HISTORY_EXPLAINER_TOOLS = [
    {
        name: 'show_element',
        description: 'Show a new element on the digital whiteboard canvas. Use this to place blocks, text, shapes, or images.',
        parameters: {
            type: 'OBJECT',
            properties: {
                id: { type: 'STRING', description: 'Unique element ID (e.g. "block_1", "title")' },
                type: { type: 'STRING', enum: ['block', 'text', 'shape', 'image'], description: 'Visual type' },
                x: { type: 'NUMBER', description: 'X position (0-800)' },
                y: { type: 'NUMBER', description: 'Y position (0-500)' },
                width: { type: 'NUMBER', description: 'Width in pixels' },
                height: { type: 'NUMBER', description: 'Height in pixels' },
                content: { type: 'STRING', description: 'Text label or image URL' },
                color: { type: 'STRING', description: 'CSS color (e.g. "hsl(217, 89%, 61%)")' },
            },
            required: ['id', 'type', 'x', 'y'],
        },
    },
    {
        name: 'animate_element',
        description: 'Animate an existing element on the canvas — move it, scale it, rotate it, or fade it.',
        parameters: {
            type: 'OBJECT',
            properties: {
                elementId: { type: 'STRING', description: 'The element ID to animate' },
                property: { type: 'STRING', enum: ['x', 'y', 'scale', 'rotation', 'opacity'], description: 'Property to animate' },
                to: { type: 'NUMBER', description: 'Target value' },
                duration: { type: 'NUMBER', description: 'Duration in seconds (default 0.5)' },
            },
            required: ['elementId', 'property', 'to'],
        },
    },
    {
        name: 'remove_element',
        description: 'Remove an element from the canvas with an exit animation.',
        parameters: {
            type: 'OBJECT',
            properties: {
                elementId: { type: 'STRING', description: 'The element ID to remove' },
            },
            required: ['elementId'],
        },
    },
    {
        name: 'clear_canvas',
        description: 'Clear all elements from the canvas for a fresh start.',
        parameters: {
            type: 'OBJECT',
            properties: {},
            required: [],
        },
    },
    {
        name: 'show_map_overlay',
        description: 'Display a geographic territory overlay on the base map.',
        parameters: {
            type: 'OBJECT',
            properties: {
                regionId: { type: 'STRING', description: 'ID of the region to display' },
                fillColor: { type: 'STRING', description: 'CSS color to fill the region' },
                label: { type: 'STRING', description: 'Label to show over the region' },
                opacity: { type: 'NUMBER', description: 'Opacity of the overlay (0.0 to 1.0)' },
            },
            required: ['regionId', 'fillColor', 'label'],
        },
    },
    {
        name: 'show_timeline',
        description: 'Render a timeline bar with events.',
        parameters: {
            type: 'OBJECT',
            properties: {
                events: {
                    type: 'ARRAY',
                    items: {
                        type: 'OBJECT',
                        properties: {
                            year: { type: 'NUMBER', description: 'Year of the event (negative for BC)' },
                            label: { type: 'STRING', description: 'Label for the event' },
                            importance: { type: 'STRING', enum: ['high', 'medium', 'low'], description: 'Importance level' },
                        },
                        required: ['year', 'label'],
                    },
                    description: 'List of events to show on the timeline'
                },
                startYear: { type: 'NUMBER', description: 'Start year of the timeline' },
                endYear: { type: 'NUMBER', description: 'End year of the timeline' },
            },
            required: ['events', 'startYear', 'endYear'],
        },
    },
    {
        name: 'show_figure',
        description: 'Display a historical figure card.',
        parameters: {
            type: 'OBJECT',
            properties: {
                name: { type: 'STRING', description: 'Name of the historical figure' },
                title: { type: 'STRING', description: 'Title or role of the figure' },
                portraitUrl: { type: 'STRING', description: 'Optional URL to a portrait image' },
                quote: { type: 'STRING', description: 'Optional quote from or about the figure' },
            },
            required: ['name', 'title'],
        },
    },
    {
        name: 'highlight_route',
        description: 'Animate a trade, migration, or conquest route on the map.',
        parameters: {
            type: 'OBJECT',
            properties: {
                from: {
                    type: 'ARRAY',
                    items: { type: 'NUMBER' },
                    description: 'Starting coordinate [x, y]'
                },
                to: {
                    type: 'ARRAY',
                    items: { type: 'NUMBER' },
                    description: 'Ending coordinate [x, y]'
                },
                style: {
                    type: 'STRING',
                    enum: ['trade', 'migration', 'conquest'],
                    description: 'Style of the route line'
                },
                color: { type: 'STRING', description: 'Optional CSS color for the route' },
            },
            required: ['from', 'to', 'style'],
        },
    },
    {
        name: 'zoom_map',
        description: 'Zoom or pan the base map.',
        parameters: {
            type: 'OBJECT',
            properties: {
                center: {
                    type: 'ARRAY',
                    items: { type: 'NUMBER' },
                    description: 'Target center coordinate [x, y]'
                },
                level: { type: 'NUMBER', description: 'Zoom level multiplier (1.0 = normal)' },
                duration: { type: 'NUMBER', description: 'Animation duration in seconds' },
            },
            required: ['center', 'level'],
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
- ALWAYS start with the map base layer from R2 (already rendered by the client, use overlays on top of it).
- Use show_map_overlay to show territories, trade routes, migration paths.
- Use show_timeline to anchor events in time.
- Use show_figure when introducing key people.
- Clear and transition smoothly between scenes.
- Animate elements to draw attention (e.g., animate_element, highlight_route).

LESSON CONTENT TO NARRATE:
${baseContent}

CRITICAL RULES:
- Never give grades or scores.
- ALWAYS use tools to update the canvas BEFORE or AS you explain visual concepts.
- Do not overload the canvas; remove elements when moving to a new topic or clear_canvas between major scenes.`;
}