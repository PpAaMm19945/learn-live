import { WebSocket } from 'ws';
import { BeatSequencer } from './beatSequencer';
import { buildHistoryExplainerPrompt } from './historyExplainerTools';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    lessonId: string,
    familyId: string,
    learnerId: string,
    band: number
) {
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${lessonId}, band: ${band}`);

    // Build the specialized system instruction based on the learner's band
    // The "baseContent" for the system instruction will be the core curriculum guidelines
    const curriculumGuidelines = `
THEOLOGICAL GUARDRAILS:
1. Never remove or downplay scripture references.
2. Never present the Curse of Ham as legitimate theology.
3. The Biblical chronology is the authoritative framework. Teach it as true.
4. Dates from evolutionary models must be tagged as "(conventional estimate)".
5. Dates from biblical models must be tagged as "(biblical chronology)".
`;
    const systemInstruction = buildHistoryExplainerPrompt(curriculumGuidelines, { band }, band);
    console.log(`[HISTORY_EXPLAINER] BeatSequencer system instruction prepared.`);

    // Create and start the BeatSequencer
    const sequencer = new BeatSequencer(ws, band, systemInstruction);

    // Extract chapter and section from lessonId (format: ch01_s01)
    const [chapterId, sectionId] = lessonId.split('_');

    try {
        // Start the automated lesson sequence
        // This will orchestrate Gemini narration -> TTS synthesis -> client playback
        await sequencer.start(chapterId, sectionId);
    } catch (err: any) {
        console.error(`[HISTORY_EXPLAINER] Sequencer failed: ${err.message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'error', message: 'Lesson failed to load.' }));
        }
    }

    ws.on('message', (raw: string) => {
        try {
            const msg = JSON.parse(raw.toString());
            if (msg.type === 'pause') {
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
        sequencer.pause(); // Stop sequencer on disconnect
    });

    ws.on('error', (err: Error) => {
        console.error(`[HISTORY_EXPLAINER] WebSocket error — learner: ${learnerId}`, err.message);
        sequencer.pause();
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
