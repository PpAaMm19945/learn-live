import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { HISTORY_EXPLAINER_TOOLS, buildHistoryExplainerPrompt } from './historyExplainerTools';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${lessonId}, band: ${band}`);

    const workerUrl = process.env.WORKER_API_URL || 'http://127.0.0.1:8787';

    // 1. Fetch adapted content as base instruction
    let baseContent = '';
    try {
        const contentRes = await fetch(`${workerUrl}/api/lessons/${lessonId}/content?band=${band}`);
        if (contentRes.ok) {
            const contentData = await contentRes.json();
            baseContent = contentData.content || '';
        } else {
             console.warn(`[HISTORY_EXPLAINER] Failed to fetch adapted content, status: ${contentRes.status}`);
             ws.send(JSON.stringify({ error: 'Failed to load lesson content' }));
             ws.close();
             return;
        }
    } catch (e: any) {
        console.error(`[HISTORY_EXPLAINER] Error fetching adapted content: ${e.message}`);
        ws.send(JSON.stringify({ error: 'Failed to load lesson content' }));
        ws.close();
        return;
    }

    // 2. Fetch learner context dynamically from D1
    let learnerContext = { name: 'Learner', age: 7, band: band };
    try {
        const profileRes = await fetch(`${workerUrl}/api/family/${familyId}/profiles`);
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            const learner = profileData.profiles?.find((p: any) => p.id === learnerId);
            if (learner) {
                learnerContext = {
                    name: learner.name || 'Learner',
                    age: learner.age || 7,
                    band: band, // Use the requested band
                };
            }
        }
    } catch (e: any) {
        console.warn(`[HISTORY_EXPLAINER] Failed to fetch learner profile, using defaults: ${e.message}`);
    }

    // 3. Build rich system prompt
    const systemPrompt = buildHistoryExplainerPrompt(baseContent, learnerContext, band);
    console.log(`[HISTORY_EXPLAINER] System prompt assembled (${systemPrompt.length} chars)`);

    // 4. Create Gemini session with canvas tools
    const gemini = new GeminiSession(systemPrompt, HISTORY_EXPLAINER_TOOLS);
    await gemini.connect();

    // 5. Handle Gemini responses — intercept tool calls → canvas ops
    gemini.onResponse((data: any) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        if (data.type === 'functionCall') {
            const op = mapToolCallToCanvasOp(data.name, data.args);
            if (op) {
                ws.send(JSON.stringify({ type: 'canvas_ops', ops: [op] }));
            }
            // Complete the tool call loop
            gemini.sendToolResponse([{
                id: data.id,
                name: data.name,
                response: { success: true }
            }]);
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
            } else if (msg.type === 'image' && msg.data) {
                gemini.sendImage(msg.data);
            }
        } catch (e) {
            console.error('[HISTORY_EXPLAINER] Bad message from client:', e);
        }
    });

    ws.on('close', () => {
        console.log(`[HISTORY_EXPLAINER] Session closed — learner: ${learnerId}`);
        gemini.close();
    });

    ws.on('error', (err: Error) => {
        console.error(`[HISTORY_EXPLAINER] WebSocket error — learner: ${learnerId}`, err.message);
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

        case 'show_map_overlay':
            return {
                action: 'show',
                element: {
                   id: args.regionId,
                   type: 'path',
                   // In a real implementation, 'd' would be looked up or passed,
                   // mock path here to map to canvas.
                   d: 'M 10 10 L 20 20 Z',
                   fill: args.fillColor,
                   opacity: args.opacity ?? 0.5,
                   text: args.label,
                }
            };
        case 'show_timeline':
            // Emit a mock custom op for timeline or map to an element type.
            // Depending on frontend architecture this might be atomic or complex.
            // Using a specific canvasOp format based on instructions:
            return {
                action: 'show',
                element: {
                   id: 'timeline-bar',
                   type: 'rect',
                   // Timeline properties
                   x: 50, y: 700, width: 700, height: 20,
                   fill: '#cbd5e1',
                   // Pass the custom data along for frontend specific handlers if needed
                   // We embed it in the element payload
                   metadata: {
                       events: args.events,
                       startYear: args.startYear,
                       endYear: args.endYear,
                   }
                }
            };
        case 'show_figure':
            return {
                action: 'show',
                element: {
                   id: `figure-${args.name}`,
                   type: 'image', // Assuming figure card renders as image or a rich group
                   href: args.portraitUrl || 'https://placehold.co/100x150/e2e8f0/475569?text=Figure',
                   x: 50,
                   y: 50,
                   width: 150,
                   height: 200,
                   text: `${args.name} - ${args.title}`,
                   metadata: {
                       quote: args.quote
                   }
                }
            };
        case 'highlight_route':
            return {
                action: 'highlight_route',
                route: {
                    from: args.from,
                    to: args.to,
                    style: args.style,
                    color: args.color,
                }
            };
        case 'zoom_map':
             return {
                 action: 'zoom_map',
                 zoom: {
                     center: args.center,
                     level: args.level,
                     duration: args.duration ?? 1.0,
                 }
             };

        default:
            console.warn(`[HISTORY_EXPLAINER] Unknown tool call: ${name}`);
            return null;
    }
}
