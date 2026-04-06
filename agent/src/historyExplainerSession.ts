import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';
import { recordSession } from './rateLimit';
import { MAPLIBRE_TEACHING_TOOLS } from './historyExplainerTools';

const SET_SCENE_TOOL = MAPLIBRE_TEACHING_TOOLS.filter((tool) => tool.name === 'set_scene');

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${lessonId}, band: ${band}`);
    console.warn('[HISTORY_EXPLAINER] *** HELLO WORLD MODE (hard override) ***');

    // 1. Hard-override for diagnostics: skip content/profile fetching and use minimal prompt.
    const systemPrompt = `You are a friendly teacher. Greet the student briefly, then immediately demonstrate your visual canvas by calling set_scene("map"), pausing for a moment, then calling set_scene("transcript") to return. Do not ask questions or wait for a response.`;
    console.log(`[HISTORY_EXPLAINER] System prompt assembled (${systemPrompt.length} chars)`);

    // 4. Create Gemini session with MapLibre tools
    console.log(`[GEMINI] Connecting to Live API...`);
    const gemini = new GeminiSession(systemPrompt, SET_SCENE_TOOL);
    let hasGeminiResponse = false;
    const geminiSilenceTimeoutMs = Number(process.env.GEMINI_FIRST_RESPONSE_TIMEOUT_MS || 60000);
    const geminiKickoffNudgeMs = Number(process.env.GEMINI_KICKOFF_NUDGE_MS || 12000);
    let geminiSilenceTimer: ReturnType<typeof setTimeout> | null = null;
    let geminiKickoffNudgeTimer: ReturnType<typeof setTimeout> | null = null;
    try {
        await gemini.connect();
        await gemini.waitForReady();
    } catch (e: any) {
        console.error(`[HISTORY_EXPLAINER] Gemini connect failed: ${e.message}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Teacher is temporarily unavailable. Please try again later.' }));
        ws.close();
        return;
    }
    recordSession(familyId);
    console.log(`[GEMINI] Session established, model=gemini-2.5-flash-native-audio-latest`);

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
        } else if (data.type === 'thinking') {
            ws.send(JSON.stringify({
                type: 'thinking',
                text: data.text
            }));
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
    console.log('[GEMINI] Session ready, sending kickoff...');
    gemini.sendClientContent('Begin now: greet briefly, call set_scene("map"), then set_scene("transcript"), and continue speaking without asking the student a question.');
    geminiKickoffNudgeTimer = setTimeout(() => {
        if (!hasGeminiResponse && ws.readyState === WebSocket.OPEN) {
            console.warn(`[GEMINI] No early response after ${geminiKickoffNudgeMs}ms. Sending kickoff nudge.`);
            gemini.sendClientContent('Reply immediately with exactly: "Hello! I can hear you."');
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
