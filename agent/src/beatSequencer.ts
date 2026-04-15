import { WebSocket } from 'ws';
import { Beat, SectionManifest } from './content';
import { GenAINarrator } from './gemini';
import { TTSService } from './tts';
import { buildNarrationPrompt } from './historyExplainerTools';
import { getBandProfile, BandProfile } from './bandConfig';
import { ComprehensionTracker } from './comprehensionTracker';

interface PreparedBeat {
    beat: Beat;
    narratedText: string;
    audioBase64: string;
    toolCalls: any[];
    sceneMode: string;
}

// ── Tool Policy Filter ──────────────────────────────────────────────
function applyBandToolPolicy(
    toolCalls: any[],
    profile: BandProfile
): any[] {
    const blocked = new Set(profile.tools.blocked);
    let filtered = toolCalls.filter(t => !blocked.has(t.tool));

    // Block map scenes if maps disabled
    if (!profile.tools.mapToolsEnabled) {
        filtered = filtered.map(t => {
            if (t.tool === 'set_scene' && t.args?.mode === 'map') {
                return { ...t, args: { ...t.args, mode: 'image' } };
            }
            return t;
        });
    }

    // Truncate arrays in data-heavy tools
    filtered = filtered.map(t => {
        if (t.tool === 'show_timeline' && t.args?.events) {
            return { ...t, args: { ...t.args, events: t.args.events.slice(0, profile.tools.maxTimelineEvents) } };
        }
        if (t.tool === 'show_genealogy' && t.args?.nodes) {
            return { ...t, args: { ...t.args, nodes: t.args.nodes.slice(0, profile.tools.maxGenealogyNodes) } };
        }
        if (t.tool === 'show_comparison') {
            const args = { ...t.args };
            if (args.columnA?.points) args.columnA = { ...args.columnA, points: args.columnA.points.slice(0, profile.tools.maxComparisonPoints) };
            if (args.columnB?.points) args.columnB = { ...args.columnB, points: args.columnB.points.slice(0, profile.tools.maxComparisonPoints) };
            return { ...t, args };
        }
        if (t.tool === 'show_slide' && t.args?.bullets) {
            return { ...t, args: { ...t.args, bullets: t.args.bullets.slice(0, profile.tools.maxSlideBullets) } };
        }
        // Simplify key terms for younger bands
        if (t.tool === 'show_key_term' && profile.tools.simplifyKeyTerms) {
            const { etymology, pronunciation, ...rest } = t.args || {};
            return { ...t, args: rest };
        }
        return t;
    });

    return filtered;
}

// ── Visual Mix Telemetry ────────────────────────────────────────────
interface VisualMixCounters {
    image: number;
    map: number;
    overlay: number;
    transcript: number;
    total: number;
}

function logVisualMixTelemetry(counters: VisualMixCounters, profile: BandProfile, band: number) {
    if (counters.total === 0) return;
    const pct = (n: number) => Math.round((n / counters.total) * 100);
    const actual = { image: pct(counters.image), map: pct(counters.map), overlay: pct(counters.overlay), transcript: pct(counters.transcript) };
    const target = profile.visuals;

    const drifts: string[] = [];
    if (Math.abs(actual.image - target.imagePct) > 15) drifts.push(`image ${actual.image}% vs ${target.imagePct}%`);
    if (Math.abs(actual.map - target.mapPct) > 15) drifts.push(`map ${actual.map}% vs ${target.mapPct}%`);
    if (Math.abs(actual.overlay - target.overlayPct) > 15) drifts.push(`overlay ${actual.overlay}% vs ${target.overlayPct}%`);
    if (actual.transcript > target.transcriptPctMax + 15) drifts.push(`transcript ${actual.transcript}% vs ≤${target.transcriptPctMax}%`);

    const status = drifts.length === 0 ? 'OK' : `DRIFT: ${drifts.join(', ')}`;
    console.log(`[TELEMETRY] Band ${band} visual mix: image=${actual.image}% (target ${target.imagePct}%), map=${actual.map}% (target ${target.mapPct}%), overlay=${actual.overlay}% (target ${target.overlayPct}%), transcript=${actual.transcript}% (target ≤${target.transcriptPctMax}%) — ${status}`);
}

// ── Beat Sequencer ──────────────────────────────────────────────────
export class BeatSequencer {
    private narrator: GenAINarrator;
    private tts: TTSService;
    private bandProfile: BandProfile;
    private currentBeatIndex = 0;
    private manifest: SectionManifest | null = null;
    private isPaused = false;
    private isStopped = false;
    private completedBeats: Beat[] = [];
    private previousNarratedText = '';
    private loopPromise: Promise<void> | null = null;

    // Look-ahead buffer
    private preparedBuffer: PreparedBeat[] = [];
    private isProducing = false;

    // Visual mix telemetry
    private visualCounters: VisualMixCounters = { image: 0, map: 0, overlay: 0, transcript: 0, total: 0 };

    // Comprehension tracking
    private comprehensionTracker = new ComprehensionTracker();

    // Checkpoint callback for session store
    public onCheckpoint?: (beatIndex: number, narratedText: string, beatId: string) => void;

    private extractBeatImage(content: string): { imagePath: string; alt: string } | null {
        const match = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (!match) return null;
        return {
            alt: (match[1] || 'Lesson illustration').trim(),
            imagePath: match[2].trim()
        };
    }

    constructor(
        private ws: WebSocket,
        private band: number,
        private systemInstruction: string
    ) {
        this.narrator = new GenAINarrator(systemInstruction);
        this.tts = new TTSService();
        this.bandProfile = getBandProfile(band);
        console.log(`[SEQUENCER] Band ${band} profile: "${this.bandProfile.label}" (ages ${this.bandProfile.ages}), voice: ${this.bandProfile.tts.voiceName}, rate: ${this.bandProfile.tts.speakingRate}`);
    }

    start(manifest: SectionManifest): Promise<void> {
        return this.startFromIndex(manifest, 0, '');
    }

    startFromIndex(manifest: SectionManifest, fromIndex: number, previousText: string): Promise<void> {
        console.log(`[SEQUENCER] Starting lesson: ${manifest.chapterId} / ${manifest.sectionId} (Band ${this.band}) from beat ${fromIndex}`);
        this.manifest = manifest;
        this.currentBeatIndex = fromIndex;
        this.previousNarratedText = previousText;
        this.isStopped = false;
        this.visualCounters = { image: 0, map: 0, overlay: 0, transcript: 0, total: 0 };

        if (!this.loopPromise) {
            this.loopPromise = this.runLoop().finally(() => {
                this.loopPromise = null;
            });
        }

        return this.loopPromise;
    }

    private async runLoop() {
        if (!this.manifest) return;

        // Start producing the first beat ahead
        this.produceAhead();

        while (!this.isStopped && this.currentBeatIndex < this.manifest.beats.length) {
            if (this.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 120));
                continue;
            }

            const beat = this.manifest.beats[this.currentBeatIndex];
            console.log(`[SEQUENCER] Delivering Beat ${this.currentBeatIndex + 1}/${this.manifest.beats.length}: ${beat.title}`);

            // Wait for prepared beat from buffer, or prepare inline
            let prepared = this.preparedBuffer.shift();
            if (!prepared || prepared.beat.beatId !== beat.beatId) {
                console.log(`[SEQUENCER] Buffer miss for beat ${beat.beatId} — preparing inline`);
                prepared = await this.prepareBeat(beat);
            }

            this.deliverBeat(prepared);

            // Checkpoint for resume
            this.onCheckpoint?.(this.currentBeatIndex, prepared.narratedText, beat.beatId);

            const postDwell = this.bandProfile.tts.postAudioDwellMs || 0;
            const waitMs = 800 + this.comprehensionTracker.scaffoldingDelay + postDwell;

            this.currentBeatIndex++;
            this.produceAhead();

            if (!this.isStopped) {
                await new Promise(resolve => setTimeout(resolve, waitMs));
            }
        }

        if (!this.isStopped && this.currentBeatIndex >= this.manifest.beats.length) {
            console.log('[SEQUENCER] Lesson complete.');
            logVisualMixTelemetry(this.visualCounters, this.bandProfile, this.band);
            this.sendMessage(this.comprehensionTracker.buildSessionScoreMessage());
            this.sendMessage({ type: 'lesson_complete' });
        }
    }

    private produceAhead() {
        if (this.isProducing || this.isStopped || !this.manifest) return;
        
        const nextIndex = this.currentBeatIndex + this.preparedBuffer.length + (this.preparedBuffer.length === 0 ? 0 : 1);
        if (nextIndex >= this.manifest.beats.length) return;
        if (this.preparedBuffer.length >= 2) return;

        this.isProducing = true;
        const beat = this.manifest.beats[nextIndex];
        
        this.prepareBeat(beat).then(prepared => {
            if (!this.isStopped) {
                this.preparedBuffer.push(prepared);
            }
            this.isProducing = false;
            this.produceAhead();
        }).catch(err => {
            console.error(`[SEQUENCER] Look-ahead preparation failed for beat ${beat.beatId}:`, err);
            this.isProducing = false;
        });
    }

    private async prepareBeat(beat: Beat): Promise<PreparedBeat> {
        let baseText = beat.contentText;
        let toolSource = beat.toolSequence;

        // Check for band overrides (content text and/or tool sequence)
        if (beat.bandOverrides && beat.bandOverrides[this.band.toString()]) {
            const override = beat.bandOverrides[this.band.toString()];
            baseText = override.contentText;
            if (override.toolSequence) {
                toolSource = override.toolSequence;
            }
        }

        const totalBeats = this.manifest?.beats.length || 1;
        const beatIndex = this.completedBeats.length + 1;
        const isFirst = beatIndex === 1 && this.completedBeats.length === 0;
        const isLast = (this.currentBeatIndex + 1) >= totalBeats || beatIndex === totalBeats;

        const pipelineCtx = (beat as any)._pipelineContext;

        const prompt = buildNarrationPrompt({
            baseText,
            band: this.band,
            beatIndex,
            totalBeats,
            isFirst,
            isLast,
            previousNarratedText: this.previousNarratedText,
            pipelineContext: pipelineCtx,
        });

        // Append scaffolding suffix if student is struggling
        const finalPrompt = prompt + this.comprehensionTracker.scaffoldingPromptSuffix;

        const extractedImage = this.extractBeatImage(baseText);
        let narratedText = await this.narrator.narrate(finalPrompt) || baseText;
        
        narratedText = narratedText
            .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '')
            .replace(/```(?:json)?\s*[\s\S]*?```/gi, '')
            .replace(/\[\s*\{\s*"(?:command|action|actions)"\s*:[\s\S]*?\}\s*\]/g, '')
            .replace(/\{\s*"(?:command|action)"\s*:[\s\S]*?\}/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim() || baseText;
        
        this.previousNarratedText = narratedText;

        // TTS with band-specific voice and rate
        console.log(`[SEQUENCER] Synthesizing audio for beat: ${beat.beatId} (voice: ${this.bandProfile.tts.voiceName}, rate: ${this.bandProfile.tts.speakingRate})`);
        const audioBase64 = await this.tts.synthesize(narratedText, {
            voiceName: this.bandProfile.tts.voiceName,
            speakingRate: this.bandProfile.tts.speakingRate,
        }) || '';

        if (!audioBase64) {
            console.warn(`[SEQUENCER] No audio for beat ${beat.beatId} — frontend will use browser TTS fallback`);
        }

        // Build and filter tool calls through band policy
        let toolCalls = toolSource.map(t => ({
            type: 'tool_call',
            tool: t.tool,
            args: t.args
        }));

        const hasVisualTool = toolCalls.some(t =>
            t.tool === 'set_scene' ||
            t.tool === 'show_figure' ||
            t.tool === 'show_slide'
        );

        if (extractedImage && !hasVisualTool) {
            toolCalls.unshift({
                type: 'tool_call',
                tool: 'set_scene',
                args: {
                    mode: 'image',
                    imageUrl: extractedImage.imagePath,
                    caption: extractedImage.alt,
                }
            });
        }

        // Force image scene for bands 0-1 if no visual tool present
        if (this.band <= 1 && !toolCalls.some(t => t.tool === 'set_scene')) {
            toolCalls.unshift({
                type: 'tool_call',
                tool: 'set_scene',
                args: { mode: 'image' }
            });
        }

        // Apply band tool policy — drop blocked, truncate arrays, simplify
        toolCalls = applyBandToolPolicy(toolCalls, this.bandProfile);

        const sceneMode = extractedImage && !hasVisualTool ? 'image' : (beat.sceneMode || 'transcript');

        // Track visual mix telemetry
        this.visualCounters.total++;
        if (sceneMode === 'image') this.visualCounters.image++;
        else if (sceneMode === 'map') this.visualCounters.map++;
        else if (sceneMode === 'overlay') this.visualCounters.overlay++;
        else this.visualCounters.transcript++;

        this.completedBeats.push(beat);

        return { beat, narratedText, audioBase64, toolCalls, sceneMode };
    }

    private deliverBeat(prepared: PreparedBeat) {
        const payload = {
            type: 'beat_payload',
            beatId: prepared.beat.beatId,
            text: prepared.narratedText,
            audioData: prepared.audioBase64,
            sceneMode: prepared.sceneMode,
            toolCalls: prepared.toolCalls,
        };

        this.sendMessage(payload);
    }

    getContext() {
        const currentBeat = this.manifest?.beats[this.currentBeatIndex] || null;
        const recentTranscript = this.completedBeats
            .slice(-3)
            .map(b => b.contentText)
            .join(' ');

        return {
            currentBeatTitle: currentBeat?.title || 'Unknown',
            currentBeatContent: currentBeat?.contentText || '',
            recentTranscript
        };
    }

    pause() {
        this.isPaused = true;
        console.log('[SEQUENCER] Paused');
    }

    resume() {
        if (this.isStopped) {
            return;
        }
        this.isPaused = false;
        console.log('[SEQUENCER] Resumed');
    }

    stop() {
        this.isStopped = true;
        this.isPaused = false;
        this.preparedBuffer = [];
        logVisualMixTelemetry(this.visualCounters, this.bandProfile, this.band);
        console.log('[SEQUENCER] Stopped');
    }

    async waitUntilStopped() {
        if (this.loopPromise) {
            await this.loopPromise;
        }
    }

    /**
     * Record a student's comprehension answer. Called by the session controller
     * when a `comprehension_answer` message arrives over WebSocket.
     */
    recordComprehensionAnswer(questionId: string, correct: boolean): void {
        this.comprehensionTracker.recordAnswer(questionId, correct);
    }

    private sendMessage(msg: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }
}
