import { Type } from '@google/genai';

export const HISTORY_EXPLAINER_TOOLS = [
    {
        name: 'show_element',
        description: 'Show a new element on the digital whiteboard canvas. Use this to place blocks, text, shapes, or images.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING, description: 'Unique element ID (e.g. "block_1", "title")' },
                type: { type: Type.STRING, enum: ['block', 'text', 'shape', 'image'], description: 'Visual type' },
                x: { type: Type.NUMBER, description: 'X position (0-800)' },
                y: { type: Type.NUMBER, description: 'Y position (0-500)' },
                width: { type: Type.NUMBER, description: 'Width in pixels' },
                height: { type: Type.NUMBER, description: 'Height in pixels' },
                content: { type: Type.STRING, description: 'Text label or image URL' },
                color: { type: Type.STRING, description: 'CSS color (e.g. "hsl(217, 89%, 61%)")' },
            },
            required: ['id', 'type', 'x', 'y'],
        },
    },
    {
        name: 'animate_element',
        description: 'Animate an existing element on the canvas — move it, scale it, rotate it, or fade it.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                elementId: { type: Type.STRING, description: 'The element ID to animate' },
                property: { type: Type.STRING, enum: ['x', 'y', 'scale', 'rotation', 'opacity'], description: 'Property to animate' },
                to: { type: Type.NUMBER, description: 'Target value' },
                duration: { type: Type.NUMBER, description: 'Duration in seconds (default 0.5)' },
            },
            required: ['elementId', 'property', 'to'],
        },
    },
    {
        name: 'remove_element',
        description: 'Remove an element from the canvas with an exit animation.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                elementId: { type: Type.STRING, description: 'The element ID to remove' },
            },
            required: ['elementId'],
        },
    },
    {
        name: 'clear_canvas',
        description: 'Clear all elements from the canvas for a fresh start.',
        parameters: {
            type: Type.OBJECT,
            properties: {},
        },
    },
    {
        name: 'show_map_overlay',
        description: 'Display a geographic territory overlay on the map.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                regionId: { type: Type.STRING, description: 'Identifier for the region to overlay' },
                fillColor: { type: Type.STRING, description: 'CSS color for the overlay fill' },
                label: { type: Type.STRING, description: 'Text label for the region' },
                opacity: { type: Type.NUMBER, description: 'Opacity of the overlay (0-1)' },
            },
            required: ['regionId', 'fillColor', 'label'],
        },
    },
    {
        name: 'show_timeline',
        description: 'Render a timeline bar with events.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                events: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            year: { type: Type.NUMBER, description: 'Year of the event' },
                            label: { type: Type.STRING, description: 'Description of the event' },
                            importance: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: 'Importance level' },
                        },
                        required: ['year', 'label'],
                    },
                    description: 'List of events to display',
                },
                startYear: { type: Type.NUMBER, description: 'Start year of the timeline' },
                endYear: { type: Type.NUMBER, description: 'End year of the timeline' },
            },
            required: ['events', 'startYear', 'endYear'],
        },
    },
    {
        name: 'show_figure',
        description: 'Display a figure card representing a key historical person.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'Name of the figure' },
                title: { type: Type.STRING, description: 'Title or role of the figure' },
                portraitUrl: { type: Type.STRING, description: 'URL to the portrait image' },
                quote: { type: Type.STRING, description: 'A relevant quote from or about the figure' },
            },
            required: ['name', 'title'],
        },
    },
    {
        name: 'highlight_route',
        description: 'Animate a route on the map.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                from: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: 'Starting coordinate [x, y]',
                },
                to: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: 'Ending coordinate [x, y]',
                },
                style: { type: Type.STRING, enum: ['trade', 'migration', 'conquest'], description: 'Visual style of the route' },
                color: { type: Type.STRING, description: 'Optional color for the route' },
            },
            required: ['from', 'to', 'style'],
        },
    },
    {
        name: 'zoom_map',
        description: 'Zoom and pan the base map.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                center: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: 'Target center coordinate [x, y]',
                },
                level: { type: Type.NUMBER, description: 'Zoom level' },
                duration: { type: Type.NUMBER, description: 'Duration of the zoom animation in seconds' },
            },
            required: ['center', 'level'],
        },
    },
];

export function buildHistoryExplainerPrompt(
    baseContent: string,
    learnerContext: { name?: string; age?: number; band?: number },
    band: number
): string {
    const learnerName = learnerContext?.name || 'the learner';
    const age = learnerContext?.age || 7;

    let styleGuidance = '';
    if (band <= 1) {
        styleGuidance = '- Simple stories, few elements on canvas at once, slow pacing\n- Relate to child\'s world';
    } else if (band <= 3) {
        styleGuidance = '- More detail, show relationships between events\n- Moderate pacing';
    } else {
        styleGuidance = '- Nuanced analysis, compare multiple perspectives\n- Full canvas use';
    }

    return `You are a knowledgeable, warm narrator of African History explaining concepts to ${learnerName} (age ${age}, Band ${band}).

YOUR ROLE:
- You tell stories that connect events, people, and places
- You use the canvas to make history visible — maps show where, timelines show when, figures show who
- You speak clearly and appropriately for a ${age}-year-old in Band ${band}

NARRATION STYLE (Band-aware):
${styleGuidance}

CANVAS USAGE:
- ALWAYS start with the map base layer from R2 (implicit)
- Use map overlays (show_map_overlay) to show territories
- Use highlight_route to show trade or migration paths
- Use timeline (show_timeline) to anchor events in time
- Use figure cards (show_figure) when introducing key people
- Clear and transition smoothly between scenes

LESSON CONTENT:
${baseContent}

CRITICAL RULES:
- ALWAYS use show_element, show_map_overlay, or show_figure before referencing something visual
- Use animate_element or highlight_route to draw attention to important movements
- Clear the canvas between major eras or scenes
- Do not overwhelm the canvas with too many elements at once`;
}
