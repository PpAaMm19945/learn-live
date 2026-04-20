import { WebSocket } from 'ws';
import { BeatSequencer } from './beatSequencer';
import { LiveQAHandler } from './liveHandler';
import { ContentFetcher } from './contentFetcher';
import { LessonPreparer } from './lessonPreparer';
import { buildHistoryExplainerPrompt } from './historyExplainerTools';
import { buildMapContextForAgent } from './mapRegistry';
import { buildImageContextForAgent } from './imageRegistry';
import type { HistorySessionParams } from './historySessionContract';
import { HistorySessionController } from './historySessionController';
import { sessionKey, getSession, setSession, checkpoint as storeCheckpoint, expireSession } from './sessionStore';
import { SessionLifecycle } from './sessionLifecycle';

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
    const mapContext = buildMapContextForAgent(chapterId);
    const imageContext = buildImageContextForAgent(chapterId, band);
    const systemInstruction = buildHistoryExplainerPrompt(curriculumGuidelines + mapContext + imageContext, { band }, band);

    const sequencer = new BeatSequencer(ws, band, systemInstruction);
    const liveHandler = new LiveQAHandler(ws, band, systemInstruction);
    const controller = new HistorySessionController(band);

    const sKey = sessionKey(canonicalLessonId, learnerId, band);
    let sessionClosing = false;
    let lifecycle: SessionLifecycle | null = null;

    const cleanupSession = async () => {
        if (sessionClosing) return;
        sessionClosing = true;
        controller.close();
        lifecycle?.close();
        liveHandler.stopQA();
        sequencer.stop();
        await sequencer.waitUntilStopped();
    };

    sequencer.onCheckpoint = (beatIndex: number, narratedText: string, beatId: string) => {
        storeCheckpoint(sKey, beatIndex, narratedText, beatId);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'resume_token', token: sKey }));
        }
    };

    const startPerformer = (manifest: any, fromIndex = 0, previousText = '') => {
        if (band > 1 && !controller.canStartPerformer()) {
            console.warn('[HISTORY_EXPLAINER] Performer start blocked: awaiting gatekeeper greenlight.');
            return;
        }
        lifecycle?.beginPerformer();
        controller.setPhase('PERFORMER');

        const run = fromIndex > 0
            ? sequencer.startFromIndex(manifest, fromIndex, previousText)
            : sequencer.start(manifest);

        run.catch((err) => {
            console.error('[HISTORY_EXPLAINER] Sequencer run failed:', err);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'error', code: 'SEQUENCER_FAILURE', message: 'Lesson playback failed unexpectedly.' }));
            }
            void cleanupSession();
        });
    };

    ws.on('message', async (raw: string) => {
        try {
            const msg = JSON.parse(raw.toString());

            if (msg.type === 'gatekeeper_complete') {
                lifecycle?.completeGatekeeper();
                return;
            }

            if (msg.type === 'negotiator_complete') {
                lifecycle?.completeNegotiator();
                controller.setPhase('COMPLETE');
                return;
            }

            if (msg.type === 'raise_hand') {
                const decision = controller.canAcceptRaiseHand();
                if (!decision.accepted) {
                    if (decision.reason === 'band_restricted') {
                        ws.send(JSON.stringify({ type: 'error', code: 'QA_NOT_ALLOWED', message: 'Live Q&A is only available for Band 3 and above.' }));
                    }
                    return;
                }

                sequencer.pause();
                ws.send(JSON.stringify({ type: 'qa_started' }));
                liveHandler.startQA(sequencer.getContext())
                    .then(() => {
                        const { shouldResumeLesson } = controller.completeQA();
                        if (shouldResumeLesson) sequencer.resume();
                    })
                    .catch(() => {
                        const { shouldResumeLesson } = controller.completeQA();
                        if (shouldResumeLesson) sequencer.resume();
                    });
                return;
            }

            if (msg.type === 'audio') {
                if (lifecycle?.isLiveSliceActive()) {
                    lifecycle.forwardAudio(msg.data);
                } else if (controller.snapshot().isQAActive) {
                    liveHandler.sendAudio(msg.data);
                }
                return;
            }

            if (msg.type === 'pause') {
                controller.forcePause();
                sequencer.pause();
            } else if (msg.type === 'resume' && !controller.snapshot().isQAActive) {
                sequencer.resume();
            }
        } catch (e) {
            console.error('[HISTORY_EXPLAINER] Bad message from client:', e);
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'error', code: 'BAD_CLIENT_MESSAGE', message: 'Malformed message payload.' }));
            }
        }
    });

    ws.on('close', () => { void cleanupSession(); });
    ws.on('error', () => { void cleanupSession(); });

    const sendStatus = (step: string, detail?: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'pipeline_status', step, detail }));
        }
    };

    try {
        const cached = getSession(sKey);
        if (cached) {
            const sessionAgeMs = Date.now() - cached.createdAt;
            const isStale = cached.nextBeatIndex > 0 && sessionAgeMs > 60_000;
            if (isStale) {
                expireSession(sKey);
            } else {
                sendStatus('resuming', `Resuming from beat ${cached.nextBeatIndex + 1}…`);

                lifecycle = new SessionLifecycle({
                    ws,
                    chapterId,
                    chapterTitle: cached.preparedManifest.heading || chapterId,
                    learnerName: learnerId,
                    band,
                });

        startPerformer(cached.preparedManifest, cached.nextBeatIndex, cached.previousNarratedText);
        return;
            }
        }

        sendStatus('loading', 'Fetching lesson content…');
        const manifest = await fetcher.fetchSection(chapterId, sectionId);
        if (!manifest) throw new Error(`Content not found for chapter=${chapterId} section=${sectionId}`);

        sendStatus('preparing', 'Analyzing student context…');
        const preparer = new LessonPreparer(systemInstruction, band, chapterId, sendStatus);
        let preparedManifest = manifest;
        try {
            preparedManifest = await preparer.prepare(manifest);
        } catch (prepErr) {
            console.warn(`[HISTORY_EXPLAINER] Lesson Preparer failed, using raw manifest:`, prepErr);
            sendStatus('fallback', 'Using standard lesson plan…');
        }

        setSession(sKey, preparedManifest);

        lifecycle = new SessionLifecycle({
            ws,
            chapterId,
            chapterTitle: preparedManifest.heading || chapterId,
            learnerName: learnerId,
            band,
        });

        sendStatus('ready', 'Starting lesson…');

        sequencer.onLessonComplete = async () => {
            if (band <= 1) {
                ws.send(JSON.stringify({ type: 'lesson_complete' }));
                controller.setPhase('COMPLETE');
                ws.send(JSON.stringify({ type: 'slice_change', slice: 'complete' }));
                return;
            }

            controller.setPhase('NEGOTIATOR');
            await lifecycle?.startNegotiator(sequencer.getBeatSummaries());
            lifecycle?.completeNegotiator();
            ws.send(JSON.stringify({ type: 'lesson_complete' }));
        };

        if (band <= 1) {
            startPerformer(preparedManifest);
        } else {
            controller.setPhase('IDLE');
            await lifecycle.startGatekeeper();
            controller.setPhase('AWAITING_GATEKEEPER_GREENLIGHT');
            startPerformer(preparedManifest);
        }

    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Failed to load lesson content';
        console.error(`[HISTORY_EXPLAINER] Session setup failed: ${message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'error', code: 'CONTENT_FETCH_FAILED', message }));
        }
        await cleanupSession();
    }
}
