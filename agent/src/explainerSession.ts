import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { fetchAndAssembleInstruction } from './constraints';

/**
 * Explainer Agent session — bridges Gemini Live API with canvas tool calls.
 * Separate from Evidence Witness: this agent explains, teaches, and draws.
 */

const EXPLAINER_TOOLS = [
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
        name: 'generate_diagram',
        description: 'Request an AI-generated diagram or illustration. Use sparingly — prefer showing blocks and text first.',
        parameters: {
            type: 'OBJECT',
            properties: {
                prompt: { type: 'STRING', description: 'Description of the diagram to generate' },
                x: { type: 'NUMBER', description: 'X position to place it' },
                y: { type: 'NUMBER', description: 'Y position to place it' },
            },
            required: ['prompt'],
        },
    },
];

function buildExplainerSystemPrompt(baseConstraint: string, learnerContext?: {
    name?: string;
    age?: number;
    band?: number;
    strand?: string;
}): string {
    const learnerName = learnerContext?.name || 'the learner';
    const age = learnerContext?.age || 7;
    const band = learnerContext?.band || 2;

    return `You are a patient, warm, and skilled teacher explaining a concept on a digital whiteboard to ${learnerName} (age ${age}, Band ${band}).

YOUR ROLE:
- You EXPLAIN concepts step by step, using the whiteboard to make ideas visible
- You speak in short, clear sentences appropriate for a ${age}-year-old
- You pause after each new idea to let it sink in
- You use the child's name naturally in conversation
- You relate concepts to real objects the child knows (mangoes, chapatis, fingers, stones)

YOUR WHITEBOARD:
- You have a digital canvas where you can place blocks, text, shapes, and images
- Show elements ONE AT A TIME as you explain each step
- Keep the canvas clean — never show more than 5-7 elements at once
- Use colors to group related concepts
- Remove elements you're done with before introducing new ones

TEACHING APPROACH:
1. Start with a warm greeting using the child's name
2. State what you'll learn today in one simple sentence
3. Show the first visual element while explaining
4. Build up the concept step by step, adding elements as you go
5. Check for understanding by asking simple questions
6. Summarize what was learned

CONSTRAINT / TOPIC:
${baseConstraint}

CRITICAL RULES:
- NEVER give grades or scores
- NEVER rush — quality over speed
- ALWAYS use show_element before referencing something visual
- If the child seems confused, simplify and try a different visual approach
- Use animate_element to draw attention to important elements
- Clear the canvas between major concept transitions`;
}

export async function handleExplainerSession(
    ws: WebSocket,
    taskId: string,
    familyId: string,
    learnerId: string
) {
    console.log(`[EXPLAINER] Session initiated — learner: ${learnerId}, task: ${taskId}`);

    // 1. Fetch task constraint
    let baseInstruction = '';
    try {
        baseInstruction = await fetchAndAssembleInstruction(taskId);
    } catch (e: any) {
        console.error(`[EXPLAINER] Failed to fetch constraints: ${e.message}`);
        ws.send(JSON.stringify({ error: 'Failed to load task' }));
        ws.close();
        return;
    }

    // 2. TODO: Fetch learner context from D1 (name, age, band)
    // For now, use defaults — Task 13.4 will wire this up
    const learnerContext = { name: 'Learner', age: 7, band: 2 };

    // 3. Build rich system prompt
    const systemPrompt = buildExplainerSystemPrompt(baseInstruction, learnerContext);
    console.log(`[EXPLAINER] System prompt assembled (${systemPrompt.length} chars)`);

    // 4. Create Gemini session with canvas tools
    const gemini = new GeminiSession(systemPrompt, EXPLAINER_TOOLS);
    await gemini.connect();

    // 5. Handle Gemini responses — intercept tool calls → canvas ops
    gemini.onResponse((data: any) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        if (data.type === 'functionCall') {
            const op = mapToolCallToCanvasOp(data.name, data.args);
            if (op) {
                ws.send(JSON.stringify({ type: 'canvas_ops', ops: [op] }));
            }
        } else if (data.type === 'modelTurn') {
            // Forward voice/text to client
            ws.send(JSON.stringify(data));
        }
    });

    // 6. Handle incoming audio from learner
    ws.on('message', (raw: string) => {
        try {
            const msg = JSON.parse(raw.toString());
            if (msg.type === 'audio' && msg.data) {
                gemini.sendAudio(Buffer.from(msg.data, 'base64'));
            }
        } catch (e) {
            console.error('[EXPLAINER] Bad message from client:', e);
        }
    });

    ws.on('close', () => {
        console.log(`[EXPLAINER] Session closed — learner: ${learnerId}`);
        gemini.close();
    });
}

function mapToolCallToCanvasOp(name: string, args: any): any | null {
    switch (name) {
        case 'show_element':
            return {
                action: 'show',
                element: {
                    id: args.id,
                    type: args.type,
                    x: args.x ?? 100,
                    y: args.y ?? 100,
                    width: args.width,
                    height: args.height,
                    content: args.content,
                    color: args.color,
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                },
            };
        case 'animate_element':
            return {
                action: 'animate',
                elementId: args.elementId,
                animation: {
                    property: args.property,
                    to: args.to,
                    duration: args.duration ?? 0.5,
                },
            };
        case 'remove_element':
            return { action: 'remove', elementId: args.elementId };
        case 'clear_canvas':
            return { action: 'clear' };
        case 'generate_diagram':
            return {
                action: 'generate_diagram',
                diagramPrompt: args.prompt,
                element: { x: args.x ?? 200, y: args.y ?? 200 },
            };
        default:
            console.warn(`[EXPLAINER] Unknown tool call: ${name}`);
            return null;
    }
}
