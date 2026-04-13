import { WebSocket } from 'ws';
import { BeatSequencer } from './beatSequencer';
import { LiveQAHandler } from './liveHandler';
import { ContentFetcher } from './contentFetcher';
import { LessonPreparer } from './lessonPreparer';
import { buildHistoryExplainerPrompt } from './historyExplainerTools';
import type { HistorySessionParams } from './historySessionContract';
import { HistorySessionController } from './historySessionController';

export async function handleHistoryExplainerSession(
    ws: WebSocket,
    params: HistorySessionParams
) {
    const { chapterId, sectionId, learnerId, band, canonicalLessonId } = params;
    console.log(`[HISTORY_EXPLAINER] Session initiated — learner: ${learnerId}, lesson: ${canonicalLessonId}, band: ${band}`);

    const workerUrl = process.env.WORKER_API_URL || 'local';
    const serviceKey = process.env.AGENT_SERVICE_KEY || '';
    const fetcher = new ContentFetcher(workerUrl, serviceKey);

    const curriculumGuidelines = `
THEOLOGICAL GUARDRAILS:
1. Never remove or downplay scripture references.
2. Never present the Curse of Ham as legitimate theology.
3. The Biblical chronology is the authoritative framework. Teach it as true.
4. Dates from evolutionary models must be tagged as "(conventional estimate)".
5. Dates from biblical models must be tagged as "(biblical chronology)".
`;
    const systemInstruction = buildHistoryExplainerPrompt(curriculumGuidelines, { band }, band);

    const sequencer = new BeatSequencer(ws, band, systemInstruction);
    const liveHandler = new LiveQAHandler(ws, band, systemInstruction);
    const controller = new HistorySessionController(band);

    let sessionClosing = false;

    const cleanupSession = async () => {
        if (sessionClosing) {
            return;
        }

        sessionClosing = true;
        controller.close();
        liveHandler.stopQA();
        sequencer.stop();
        await sequencer.waitUntilStopped();
    };

    ws.on('message', async (raw: string) => {
        try {
            const msg = JSON.parse(raw.toString());

            if (msg.type === 'raise_hand') {
                const decision = controller.canAcceptRaiseHand();
                if (!decision.accepted) {
                    if (decision.reason === 'band_restricted') {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({
                                type: 'error',
                                code: 'QA_NOT_ALLOWED',
                                message: 'Live Q&A is only available for Band 3 and above.'
                            }));
                        }
                    }
                    return;
                }

                console.log(`[HISTORY_EXPLAINER] Student raised hand. Pausing lesson.`);
                sequencer.pause();
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'qa_started' }));
                }

                liveHandler.startQA(sequencer.getContext())
                    .then(() => {
                        const { shouldResumeLesson } = controller.completeQA();
                        if (shouldResumeLesson) {
                            console.log('[HISTORY_EXPLAINER] Q&A complete. Resuming lesson.');
                            sequencer.resume();
                        }
                    })
                    .catch((err) => {
                        console.error('[HISTORY_EXPLAINER] Q&A session failed:', err);
                        const { shouldResumeLesson } = controller.completeQA();
                        if (shouldResumeLesson) {
                            sequencer.resume();
                        }
                    });
            } else if (msg.type === 'audio') {
                if (controller.snapshot().isQAActive) {
                    liveHandler.sendAudio(msg.data);
                }
            } else if (msg.type === 'pause') {
                controller.forcePause();
                sequencer.pause();
            } else if (msg.type === 'resume') {
                if (!controller.snapshot().isQAActive) {
                    sequencer.resume();
                }
            }
        } catch (e) {
            console.error('[HISTORY_EXPLAINER] Bad message from client:', e);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'error',
                    code: 'BAD_CLIENT_MESSAGE',
                    message: 'Malformed message payload.'
                }));
            }
        }
    });

    ws.on('close', () => {
        console.log(`[HISTORY_EXPLAINER] Session closed — learner: ${learnerId}`);
        void cleanupSession();
    });

    ws.on('error', (err: Error) => {
        console.error(`[HISTORY_EXPLAINER] WebSocket error — learner: ${learnerId}`, err.message);
        void cleanupSession();
    });

    try {
        const manifest = await fetcher.fetchSection(chapterId, sectionId);

        if (!manifest) {
            throw new Error(`Content not found for chapter=${chapterId} section=${sectionId}`);
        }

        // Run the 5-phase Lesson Preparer pipeline to enrich beats
        const preparer = new LessonPreparer(systemInstruction, band, chapterId);
        let preparedManifest = manifest;
        try {
            preparedManifest = await preparer.prepare(manifest);
            console.log(`[HISTORY_EXPLAINER] Lesson Preparer pipeline complete for ${sectionId}`);
        } catch (prepErr) {
            console.warn(`[HISTORY_EXPLAINER] Lesson Preparer failed, using raw manifest:`, prepErr);
            // Fall back to raw manifest — the lesson still runs
        }

        sequencer.start(preparedManifest).catch((err) => {
            console.error('[HISTORY_EXPLAINER] Sequencer run failed:', err);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'error',
                    code: 'SEQUENCER_FAILURE',
                    message: 'Lesson playback failed unexpectedly.'
                }));
            }
            void cleanupSession();
        });
    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Failed to load lesson content';
        console.error(`[HISTORY_EXPLAINER] Session setup failed: ${message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'error',
                code: 'CONTENT_FETCH_FAILED',
                message
            }));
        }
        await cleanupSession();
    }
}
