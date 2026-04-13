import { WebSocket } from 'ws';
import { Beat, SectionManifest } from './content';
import { GenAINarrator } from './gemini';
import { TTSService } from './tts';
import { buildNarrationPrompt } from './historyExplainerTools';

interface PreparedBeat {
    beat: Beat;
    narratedText: string;
    audioBase64: string;
    toolCalls: any[];
    sceneMode: string;
}

export class BeatSequencer {
    private narrator: GenAINarrator;
    private tts: TTSService;
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
                // Buffer miss — prepare inline (first beat, or buffer was stale)
                console.log(`[SEQUENCER] Buffer miss for beat ${beat.beatId} — preparing inline`);
                prepared = await this.prepareBeat(beat);
            }

            this.deliverBeat(prepared);

            // Checkpoint for resume
            this.onCheckpoint?.(this.currentBeatIndex, prepared.narratedText, beat.beatId);

            // Wait for audio playback duration before advancing
            // Approximate: audioBase64 length / 1.33 = bytes, / 2 = samples, / 24000 = seconds
            let waitMs = 400;
            if (prepared.audioBase64 && prepared.audioBase64.length > 10) {
                const approxBytes = prepared.audioBase64.length * 0.75;
                const approxSamples = approxBytes / 2;
                const approxSeconds = approxSamples / 24000;
                waitMs = Math.max(400, approxSeconds * 1000);
            } else {
                // Dwell based on word count
                const words = (prepared.narratedText || '').split(/\s+/).length;
                waitMs = Math.max(3000, (words / 150) * 60 * 1000);
            }

            // Start producing next beat while we wait
            this.currentBeatIndex++;
            this.produceAhead();

            if (!this.isStopped) {
                await new Promise(resolve => setTimeout(resolve, waitMs));
            }
        }

        if (!this.isStopped && this.currentBeatIndex >= this.manifest.beats.length) {
            console.log('[SEQUENCER] Lesson complete.');
            this.sendMessage({ type: 'lesson_complete' });
        }
    }

    private produceAhead() {
        if (this.isProducing || this.isStopped || !this.manifest) return;
        
        // Determine next beat to prepare
        const nextIndex = this.currentBeatIndex + this.preparedBuffer.length + (this.preparedBuffer.length === 0 ? 0 : 1);
        if (nextIndex >= this.manifest.beats.length) return;

        // Only buffer 1-2 ahead
        if (this.preparedBuffer.length >= 2) return;

        this.isProducing = true;
        const beat = this.manifest.beats[nextIndex];
        
        this.prepareBeat(beat).then(prepared => {
            if (!this.isStopped) {
                this.preparedBuffer.push(prepared);
            }
            this.isProducing = false;
            // Try to produce more
            this.produceAhead();
        }).catch(err => {
            console.error(`[SEQUENCER] Look-ahead preparation failed for beat ${beat.beatId}:`, err);
            this.isProducing = false;
        });
    }

    private async prepareBeat(beat: Beat): Promise<PreparedBeat> {
        let baseText = beat.contentText;
        if (beat.bandOverrides && beat.bandOverrides[this.band.toString()]) {
            baseText = beat.bandOverrides[this.band.toString()].contentText;
        }

        const totalBeats = this.manifest?.beats.length || 1;
        const beatIndex = this.completedBeats.length + 1;
        const isFirst = beatIndex === 1 && this.completedBeats.length === 0;
        const isLast = (this.currentBeatIndex + 1) >= totalBeats || beatIndex === totalBeats;

        // Extract pipeline context if available (from LessonPreparer)
        const pipelineCtx = (beat as any)._pipelineContext;

        // Build narration prompt using the clean narration-only builder
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

        const extractedImage = this.extractBeatImage(baseText);
        let narratedText = await this.narrator.narrate(prompt) || baseText;
        
        // Strip any JSON/code blocks that leaked into the narration
        narratedText = narratedText
            .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '')
            .replace(/```(?:json)?\s*[\s\S]*?```/gi, '')
            .replace(/\[\s*\{\s*"(?:command|action|actions)"\s*:[\s\S]*?\}\s*\]/g, '')
            .replace(/\{\s*"(?:command|action)"\s*:[\s\S]*?\}/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim() || baseText;
        
        this.previousNarratedText = narratedText;

        console.log(`[SEQUENCER] Synthesizing audio for beat: ${beat.beatId}`);
        const audioBase64 = await this.tts.synthesize(narratedText) || '';

        if (!audioBase64) {
            console.warn(`[SEQUENCER] No audio for beat ${beat.beatId} — frontend will use browser TTS fallback`);
        }

        const toolCalls = beat.toolSequence.map(t => ({
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

        const sceneMode = extractedImage && !hasVisualTool ? 'image' : (beat.sceneMode || 'transcript');

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
        console.log('[SEQUENCER] Stopped');
    }

    async waitUntilStopped() {
        if (this.loopPromise) {
            await this.loopPromise;
        }
    }

    private sendMessage(msg: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }
}
