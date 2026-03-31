import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { MAPLIBRE_TEACHING_TOOLS, buildHistoryExplainerPrompt } from './historyExplainerTools';

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
        // lessonId here is actually a chapterId (e.g. "ch01"), so use the chapter content endpoint
        const contentRes = await fetch(`${workerUrl}/api/chapters/${lessonId}/content?band=${band}`, {
            headers: {
                'X-Service-Key': process.env.AGENT_SERVICE_KEY || ''
            }
        });
        if (contentRes.ok) {
            const contentData = await contentRes.json();
            baseContent = contentData.content || '';
        } else {
             console.warn(`[HISTORY_EXPLAINER] Failed to fetch adapted content, status: ${contentRes.status}`);
             ws.send(JSON.stringify({ error: `Failed to load lesson content: ${contentRes.statusText}` }));
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
        const profileRes = await fetch(`${workerUrl}/api/family/${familyId}/profiles`, {
            headers: {
                'X-Service-Key': process.env.AGENT_SERVICE_KEY || ''
            }
        });
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

    // 4. Create Gemini session with MapLibre tools
    const gemini = new GeminiSession(systemPrompt, MAPLIBRE_TEACHING_TOOLS);
    await gemini.connect();

    // 5. Handle Gemini responses — intercept tool calls
    gemini.onResponse((data: any) => {
        if (ws.readyState !== WebSocket.OPEN) return;

        if (data.type === 'functionCall') {
            const mappedOp = mapToolCallToMapLibreOp(data.name, data.args);
            if (mappedOp) {
                // Forward mapped tool call to frontend
                ws.send(JSON.stringify(mappedOp));
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

function mapToolCallToMapLibreOp(name: string, args: any): any | null {
    switch (name) {
        case 'set_scene':
        case 'zoom_to':
        case 'highlight_region':
        case 'draw_route':
        case 'place_marker':
        case 'clear_canvas':
        case 'show_scripture':
        case 'show_figure':
        case 'show_genealogy':
        case 'show_timeline':
        case 'dismiss_overlay':
            return {
                type: 'tool_call',
                tool: name,
                args: args
            };
        default:
            console.warn(`[HISTORY_EXPLAINER] Unknown tool call: ${name}`);
            return null;
    }
}
