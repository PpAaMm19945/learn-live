import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { fetchAndAssembleInstruction } from './constraints';
import { HISTORY_EXPLAINER_TOOLS, buildHistoryExplainerPrompt } from './historyExplainerTools';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — lesson: ${lessonId}, learner: ${learnerId}, band: ${band}`);

    const workerUrl = process.env.WORKER_API_URL || 'http://127.0.0.1:8787';
    let baseContent = '';

    // Fetch adapted content via GET /api/lessons/:id/content?band=N
    try {
        // Need to pass familyId / auth header in a real scenario, but assuming basic auth or handled by worker setup for now
        // For local development / testing, worker might allow it or we pass a dummy token.
        // The issue specifies "Fetch adapted content via GET /api/lessons/:id/content?band=N"
        const contentRes = await fetch(`${workerUrl}/api/lessons/${lessonId}/content?band=${band}`);
        if (contentRes.ok) {
            const contentData = await contentRes.json();
            baseContent = contentData.content || contentData.narrative || JSON.stringify(contentData);
        } else {
            console.warn(`[HISTORY_EXPLAINER] Failed to fetch lesson content: ${contentRes.statusText}`);
            baseContent = "Failed to load specific lesson content. Please discuss African History generally.";
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(`[HISTORY_EXPLAINER] Fetch content error: ${e.message}`);
        ws.send(JSON.stringify({ error: 'Failed to load lesson content' }));
        ws.close();
        return;
    }

    // Fetch task constraint (reuse existing function per instructions)
    let constraintInstruction = '';
    try {
        // We reuse the function, assuming lessonId maps to a taskId or we can fetch a generic history task constraint
        constraintInstruction = await fetchAndAssembleInstruction(lessonId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.warn(`[HISTORY_EXPLAINER] Failed to fetch constraint, using default: ${e.message}`);
    }

    // Fetch learner context
    let learnerContext = { name: 'Learner', age: 7, band: band };
    try {
        const profileRes = await fetch(`${workerUrl}/api/family/${familyId}/profiles`);
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const learner = profileData.profiles?.find((p: any) => p.id === learnerId);
            if (learner) {
                learnerContext = {
                    name: learner.name || 'Learner',
                    age: learner.age || 7,
                    band: band, // Use the requested band
                };
            }
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.warn(`[HISTORY_EXPLAINER] Failed to fetch learner profile, using defaults: ${e.message}`);
    }

    const baseSystemPrompt = buildHistoryExplainerPrompt(baseContent, learnerContext, band);
    const systemPrompt = constraintInstruction ? `${constraintInstruction}\n\n${baseSystemPrompt}` : baseSystemPrompt;

    console.log(`[HISTORY_EXPLAINER] System prompt assembled (${systemPrompt.length} chars)`);

    const gemini = new GeminiSession(systemPrompt, HISTORY_EXPLAINER_TOOLS);
    await gemini.connect();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gemini.onResponse((data: any) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        if (data.type === 'functionCall') {
            const op = mapToolCallToCanvasOp(data.name, data.args);
            if (op) {
                ws.send(JSON.stringify({ type: 'canvas_ops', ops: [op] }));
            }
            gemini.sendToolResponse([{
                id: data.id,
                name: data.name,
                response: { success: true }
            }]);
        } else if (data.type === 'modelTurn') {
            ws.send(JSON.stringify(data));
        }
    });

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    id: `overlay_${args.regionId}`,
                    type: 'map_overlay',
                    regionId: args.regionId,
                    fillColor: args.fillColor,
                    label: args.label,
                    opacity: args.opacity ?? 0.5,
                }
            };
        case 'show_timeline':
            return {
                action: 'show',
                element: {
                    id: 'timeline_bar',
                    type: 'timeline',
                    events: args.events,
                    startYear: args.startYear,
                    endYear: args.endYear,
                }
            };
        case 'show_figure':
            return {
                action: 'show',
                element: {
                    id: `figure_${args.name.replace(/\s+/g, '_')}`,
                    type: 'figure',
                    name: args.name,
                    title: args.title,
                    portraitUrl: args.portraitUrl,
                    quote: args.quote,
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
