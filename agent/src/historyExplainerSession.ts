import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { MAPLIBRE_TEACHING_TOOLS, buildHistoryExplainerPrompt } from './historyExplainerTools';
import { recordSession } from './rateLimit';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${lessonId}, band: ${band}`);
    const helloWorldMode = process.env.GEMINI_LIVE_HELLO_WORLD !== '0';
    if (helloWorldMode) {
        console.warn('[HISTORY_EXPLAINER] Hello-world mode is ACTIVE (set GEMINI_LIVE_HELLO_WORLD=0 to disable).');
    }

    const workerUrl = process.env.WORKER_API_URL || 'http://127.0.0.1:8787';

    // 1. Fetch adapted content as base instruction
    let baseContent = '';
    const MAX_BASE_CONTENT_CHARS = Number(process.env.MAX_BASE_CONTENT_CHARS || 14000);
    if (!helloWorldMode) {
        try {
            // lessonId here is actually a chapterId (e.g. "ch01"), so use the chapter content endpoint
            const serviceKey = process.env.AGENT_SERVICE_KEY || '';
            console.log(`[HISTORY_EXPLAINER] Fetching chapter content. Service key length: ${serviceKey.length}, exists: ${!!serviceKey}`);

            const contentRes = await fetch(`${workerUrl}/api/chapters/${lessonId}/content?band=${band}`, {
                headers: {
                    'X-Service-Key': serviceKey
                }
            });
            if (contentRes.ok) {
                const contentData = await contentRes.json();
                if (contentData.sections && Array.isArray(contentData.sections)) {
                    baseContent = contentData.sections.map((section: any) => {
                        return `Chapter: ${contentData.title || ''}\nSection Title: ${section.title || ''}\nContent: ${section.adaptedContent || ''}`;
                    }).join('\n\n');
                } else {
                    baseContent = contentData.content || ''; // Fallback just in case
                }

                if (baseContent.length > MAX_BASE_CONTENT_CHARS) {
                    console.warn(`[HISTORY_EXPLAINER] Base content too large (${baseContent.length} chars). Truncating to ${MAX_BASE_CONTENT_CHARS}.`);
                    baseContent = `${baseContent.substring(0, MAX_BASE_CONTENT_CHARS)}\n\n[Content truncated for faster live session startup.]`;
                }
            } else {
                const errorBody = await contentRes.text();
                console.warn(`[HISTORY_EXPLAINER] Failed to fetch adapted content, status: ${contentRes.status}, response: ${errorBody.substring(0, 200)}`);
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
    }

    // 2. Fetch learner context dynamically from D1
    let learnerContext = { name: 'Learner', age: 7, band: band };
    if (!helloWorldMode) {
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
    }

    // 3. Build rich system prompt (or minimal hello-world prompt for debugging)
    const systemPrompt = helloWorldMode
        ? 'You are a friendly teacher. Say hello, ask if the learner is ready, and wait for their reply.'
        : buildHistoryExplainerPrompt(baseContent, learnerContext, band);
    console.log(`[HISTORY_EXPLAINER] System prompt assembled (${systemPrompt.length} chars)`);
    if (helloWorldMode) {
        console.warn('[HISTORY_EXPLAINER] GEMINI_LIVE_HELLO_WORLD=1 enabled: tools disabled and prompt minimized for live API diagnostics.');
    }

    // 4. Create Gemini session with MapLibre tools
    console.log(`[GEMINI] Connecting to Live API...`);
    const gemini = new GeminiSession(systemPrompt, helloWorldMode ? [] : MAPLIBRE_TEACHING_TOOLS);
    let hasGeminiResponse = false;
    const geminiSilenceTimeoutMs = Number(process.env.GEMINI_FIRST_RESPONSE_TIMEOUT_MS || 60000);
    const geminiKickoffNudgeMs = Number(process.env.GEMINI_KICKOFF_NUDGE_MS || 12000);
    let geminiSilenceTimer: ReturnType<typeof setTimeout> | null = null;
    let geminiKickoffNudgeTimer: ReturnType<typeof setTimeout> | null = null;
    try {
        await gemini.connect();
    } catch (e: any) {
        console.error(`[HISTORY_EXPLAINER] Gemini connect failed: ${e.message}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Teacher is temporarily unavailable. Please try again later.' }));
        ws.close();
        return;
    }
    recordSession(familyId);
    console.log(`[GEMINI] Session established, model=gemini-2.0-flash-exp`);

    // 5. Handle Gemini responses — intercept tool calls
    gemini.onResponse((data: any) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        hasGeminiResponse = true;

        if (geminiSilenceTimer) {
            clearTimeout(geminiSilenceTimer);
            geminiSilenceTimer = null;
        }
        if (geminiKickoffNudgeTimer) {
            clearTimeout(geminiKickoffNudgeTimer);
            geminiKickoffNudgeTimer = null;
        }

        if (data.type === 'functionCall') {
            console.log(`[GEMINI] Tool call received: ${data.name}(${JSON.stringify(data.args)})`);
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
        } else if (data.type === 'text') {
            if (data.text) {
                console.log(`[GEMINI] Transcript: "${data.text.substring(0, 30)}${data.text.length > 30 ? '...' : ''}" (partial)`);
            }
            ws.send(JSON.stringify({
                type: "transcript",
                text: data.text,
                isFinal: data.isFinal
            }));
        } else if (data.type === 'audio') {
            console.log(`[GEMINI] Audio chunk: ${data.data.length} bytes`);
            ws.send(JSON.stringify({
                type: "audio",
                data: data.data
            }));
        } else if (data.type === 'error') {
            console.error(`[GEMINI] Error: ${data.message}`);
            ws.send(JSON.stringify({ type: "error", message: data.message }));
        }
    });

    // 4.5. Send initial kickoff text so Gemini actually starts speaking for Band 2
    console.log(`[GEMINI] Sending initial kickoff prompt...`);
    gemini.sendText(
        helloWorldMode
            ? "Say: Hello! I'm your teacher for today. Are you ready to learn?"
            : "Start now. Greet the learner by name and give one short introduction sentence before using any tool."
    );
    geminiKickoffNudgeTimer = setTimeout(() => {
        if (!hasGeminiResponse && ws.readyState === WebSocket.OPEN) {
            console.warn(`[GEMINI] No early response after ${geminiKickoffNudgeMs}ms. Sending kickoff nudge.`);
            gemini.sendText(
                helloWorldMode
                    ? 'Reply immediately with exactly: "Hello! I can hear you."'
                    : "Reply immediately with one short plain sentence to confirm you are live. Do not call tools yet."
            );
        }
    }, geminiKickoffNudgeMs);
    geminiSilenceTimer = setTimeout(() => {
        if (!hasGeminiResponse && ws.readyState === WebSocket.OPEN) {
            console.warn(`[GEMINI] No response within ${geminiSilenceTimeoutMs}ms after kickoff.`);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Teacher is taking longer than expected. Please try again.'
            }));
        }
    }, geminiSilenceTimeoutMs);

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
        if (geminiKickoffNudgeTimer) clearTimeout(geminiKickoffNudgeTimer);
        if (geminiSilenceTimer) clearTimeout(geminiSilenceTimer);
        console.log(`[GEMINI] Session ended: reason=client_disconnect`);
        console.log(`[WS] Client disconnected`);
        console.log(`[HISTORY_EXPLAINER] Session closed — learner: ${learnerId}`);
        gemini.close();
    });

    ws.on('error', (err: Error) => {
        if (geminiKickoffNudgeTimer) clearTimeout(geminiKickoffNudgeTimer);
        if (geminiSilenceTimer) clearTimeout(geminiSilenceTimer);
        console.log(`[GEMINI] Session ended: reason=error`);
        console.log(`[WS] Client disconnected with error`);
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
