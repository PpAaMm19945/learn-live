import { WebSocket } from 'ws';
import { BeatSequencer } from './beatSequencer';
import { LiveQAHandler } from './liveHandler';
import { ContentFetcher } from './contentFetcher';
import { buildHistoryExplainerPrompt } from './historyExplainerTools';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${lessonId}, band: ${band}`);

    const workerUrl = process.env.WORKER_API_URL || 'local';
    const serviceKey = process.env.AGENT_SERVICE_KEY || '';
    const fetcher = new ContentFetcher(workerUrl, serviceKey);

    // Build the specialized system instruction based on the learner's band
    const curriculumGuidelines = `
THEOLOGICAL GUARDRAILS:
1. Never remove or downplay scripture references.
2. Never present the Curse of Ham as legitimate theology.
3. The Biblical chronology is the authoritative framework. Teach it as true.
4. Dates from evolutionary models must be tagged as "(conventional estimate)".
5. Dates from biblical models must be tagged as "(biblical chronology)".
`;
    const systemInstruction = buildHistoryExplainerPrompt(curriculumGuidelines, { band }, band);

    // Create handlers
    const sequencer = new BeatSequencer(ws, band, systemInstruction);
    const liveHandler = new LiveQAHandler(ws, band, systemInstruction);
    let isQAActive = false;

    // Extract chapter and section from lessonId (format: ch01_s01)
    const [chapterId, sectionId] = lessonId.split('_');

    try {
        // Hydrate content from Worker (or local docs)
        const manifest = await fetcher.fetchSection(chapterId, sectionId);
        
        if (!manifest) {
            throw new Error(`Content not found for ${chapterId} / ${sectionId}`);
        }

        // Start the automated lesson sequence
        await sequencer.start(manifest);
    } catch (err: any) {
        console.error(`[HISTORY_EXPLAINER] Session setup failed: ${err.message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'error', message: err.message }));
        }
    }

    ws.on('message', async (raw: string) => {
        try {
            const msg = JSON.parse(raw.toString());
            
            if (msg.type === 'raise_hand') {
                if (band < 3) {
                    console.warn(`[HISTORY_EXPLAINER] raise_hand ignored for Band ${band}`);
                    return;
                }
                if (isQAActive) return;

                console.log(`[HISTORY_EXPLAINER] Student raised hand. Pausing lesson.`);
                isQAActive = true;
                sequencer.pause();
                
                // Start Q&A
                await liveHandler.startQA(sequencer.getContext());
                
                // Q&A ended
                console.log(`[HISTORY_EXPLAINER] Q&A complete. Resuming lesson.`);
                isQAActive = false;
                sequencer.resume();

            } else if (msg.type === 'audio' && isQAActive) {
                // Forward student microphone to Gemini Live
                liveHandler.sendAudio(msg.data);

            } else if (msg.type === 'pause') {
                sequencer.pause();
            } else if (msg.type === 'resume') {
                sequencer.resume();
            }
        } catch (e) {
            console.error('[HISTORY_EXPLAINER] Bad message from client:', e);
        }
    });

    ws.on('close', () => {
        console.log(`[HISTORY_EXPLAINER] Session closed — learner: ${learnerId}`);
        sequencer.pause();
        liveHandler.stopQA();
    });

    ws.on('error', (err: Error) => {
        console.error(`[HISTORY_EXPLAINER] WebSocket error — learner: ${learnerId}`, err.message);
        sequencer.pause();
        liveHandler.stopQA();
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
