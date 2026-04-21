import { WebSocket } from 'ws';
import { BeatSequencer } from './beatSequencer';
import { LiveQAHandler } from './liveHandler';
import { ContentFetcher } from './contentFetcher';
import { LessonPreparer } from './lessonPreparer';
import { buildHistoryExplainerPrompt } from './historyExplainerTools';
import { buildMapContextForAgent } from './mapRegistry';
import { buildImageContextForAgent } from './imageRegistry';
import { getBandProfile } from './bandConfig';
import type { HistorySessionParams } from './historySessionContract';
import { HistorySessionController } from './historySessionController';
import { sessionKey, getSession, setSession, checkpoint as storeCheckpoint, expireSession } from './sessionStore';
import { SessionLifecycle } from './sessionLifecycle';
import { ComprehensionTracker, scoreAnswer } from './scaffolding/comprehensionTracker';

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
    const profile = getBandProfile(band);

    const sequencer = new BeatSequencer(ws, band, systemInstruction);
    const liveHandler = new LiveQAHandler(ws, band, systemInstruction, profile.tts.voiceName);
    const controller = new HistorySessionController(band);
    const comprehensionTracker = new ComprehensionTracker();
    const sessionStartedAt = Date.now();
    let scaffoldingTriggered = false;

    const applyScaffoldingSignal = async (source: 'raise_hand' | 'gatekeeper' | 'negotiator', text: string) => {
        const score = await scoreAnswer('How well did the learner demonstrate understanding?', text, []);
        const transition = comprehensionTracker.push({
            source,
            score,
            reason: `${source} response scored ${score.toFixed(2)}`,
        });
        if (!transition) return;
        controller.setNeedsScaffolding(transition.active);
        lifecycle?.setNeedsScaffolding(transition.active);
        if (transition.active) scaffoldingTriggered = true;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'scaffolding_change',
                active: transition.active,
                reason: transition.reason,
            }));
        }
    };
    sequencer.setScaffoldingReader(() => controller.snapshot().needsScaffolding);

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
                void applyScaffoldingSignal('gatekeeper', lifecycle?.getSliceTranscript('gatekeeper') || '');
                return;
            }

            if (msg.type === 'negotiator_complete') {
                // Client-initiated completion (defensive duplicate)
                lifecycle?.completeNegotiator();
                return;
            }

            if (msg.type === 'performer_drain_complete') {
                if (controller.snapshot().phase === 'AWAITING_NEGOTIATOR_START') {
                    console.log(`[HISTORY_EXPLAINER] Performer drain complete, starting negotiator`);
                    controller.setPhase('NEGOTIATOR');
                    void lifecycle?.startNegotiator(sequencer.getBeatSummaries());
                } else {
                    console.warn(`[HISTORY_EXPLAINER] Unexpected performer_drain_complete in phase: ${controller.snapshot().phase}`);
                }
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
                        void applyScaffoldingSignal('raise_hand', liveHandler.getLastQATranscript());
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
        const resumeToken = params.resumeToken;
        const cached = resumeToken ? getSession(resumeToken) : getSession(sKey);
        
        if (cached) {
            const usingToken = !!resumeToken;
            const sessionAgeMs = Date.now() - cached.createdAt;
            
            console.log(`[HISTORY_EXPLAINER] Session lookup match (via ${usingToken ? 'token' : 'key'}) — index: ${cached.nextBeatIndex}, age: ${Math.round(sessionAgeMs/1000)}s`);

            sendStatus('resuming', `Resuming from beat ${cached.nextBeatIndex + 1}…`);

            lifecycle = new SessionLifecycle({
                ws,
                chapterId,
                chapterTitle: cached.preparedManifest.heading || chapterId,
                learnerName: learnerId,
                band,
                needsScaffolding: controller.snapshot().needsScaffolding,
                onNegotiatorComplete: (transcript) => {
                    controller.setPhase('COMPLETE');
                    void applyScaffoldingSignal('negotiator', transcript);
                }
            });

            // On resume, we skip gatekeeper and go straight to performer
            lifecycle.beginPerformer();
            controller.setPhase('PERFORMER');
            startPerformer(cached.preparedManifest, cached.nextBeatIndex, cached.previousNarratedText);
            return;
        }

        if (resumeToken) {
            console.warn(`[HISTORY_EXPLAINER] Resume token provided but session not found/expired: ${resumeToken}`);
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
            needsScaffolding: controller.snapshot().needsScaffolding,
            onNegotiatorComplete: (transcript) => {
                controller.setPhase('COMPLETE');
                void applyScaffoldingSignal('negotiator', transcript);
            }
        });

        sendStatus('ready', 'Starting lesson…');

        sequencer.onLessonComplete = async () => {
            if (band <= 1) {
                ws.send(JSON.stringify({ type: 'lesson_complete' }));
                controller.setPhase('COMPLETE');
                ws.send(JSON.stringify({ type: 'slice_change', slice: 'complete' }));
                return;
            }

            console.log(`[HISTORY_EXPLAINER] Performer complete, awaiting client drain acknowledgment`);
            controller.setPhase('AWAITING_NEGOTIATOR_START');
            ws.send(JSON.stringify({ type: 'performer_complete' }));
            // We NO LONGER call startNegotiator here. We wait for 'performer_drain_complete' message.
        };

        if (band <= 1) {
            lifecycle.beginPerformer();
            controller.setPhase('PERFORMER');
            startPerformer(preparedManifest);
        } else {
            controller.setPhase('IDLE');

            // Pre-start the sequencer in paused mode so it can begin
            // producing narration and TTS in the background while the
            // student is in the gatekeeper (warm-up) phase.
            sequencer.pause();
            startPerformer(preparedManifest);

            await lifecycle.startGatekeeper();

            controller.setPhase('AWAITING_GATEKEEPER_GREENLIGHT');
            lifecycle.beginPerformer();
            controller.setPhase('PERFORMER');
            sequencer.resume();
        }

        ws.on('close', async () => {
            await postTelemetry({
                assignmentId: canonicalLessonId,
                comprehensionAvg: comprehensionTracker.average,
                scaffoldingTriggered,
                raiseHandCount: liveHandler.getRaiseHandCount(),
                sessionDurationSeconds: Math.round((Date.now() - sessionStartedAt) / 1000),
                beatsCompleted: sequencer.getBeatSummaries().length,
            });
        });

    } catch (err: any) {
        const message = err instanceof Error ? err.message : 'Failed to load lesson content';
        console.error(`[HISTORY_EXPLAINER] Session setup failed: ${message}`);
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'error', code: 'CONTENT_FETCH_FAILED', message }));
        }
        await cleanupSession();
    }

    async function postTelemetry(payload: {
        assignmentId: string;
        comprehensionAvg: number;
        scaffoldingTriggered: boolean;
        raiseHandCount: number;
        sessionDurationSeconds: number;
        beatsCompleted: number;
    }) {
        try {
            if (!workerUrl || workerUrl === 'local' || !serviceKey) return;
            await fetch(`${workerUrl}/api/assignments/${encodeURIComponent(payload.assignmentId)}/telemetry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Service-Key': serviceKey,
                },
                body: JSON.stringify({
                    comprehension_avg: payload.comprehensionAvg,
                    scaffolding_triggered: payload.scaffoldingTriggered ? 1 : 0,
                    raise_hand_count: payload.raiseHandCount,
                    session_duration_seconds: payload.sessionDurationSeconds,
                    beats_completed: payload.beatsCompleted,
                }),
            });
        } catch (err) {
            console.warn('[TELEMETRY] best-effort post failed:', err);
        }
    }
}
