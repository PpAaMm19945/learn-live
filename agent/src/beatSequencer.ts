import { WebSocket } from 'ws';
import { Beat, SectionManifest } from './content';
import { GenAINarrator } from './gemini';
import { TTSService } from './tts';

export class BeatSequencer {
    private narrator: GenAINarrator;
    private tts: TTSService;
    private currentBeatIndex = 0;
    private manifest: SectionManifest | null = null;
    private isPaused = false;
    private isStopped = false;
    private completedBeats: Beat[] = [];
    private loopPromise: Promise<void> | null = null;

    constructor(
        private ws: WebSocket,
        private band: number,
        private systemInstruction: string
    ) {
        this.narrator = new GenAINarrator(systemInstruction);
        this.tts = new TTSService();
    }

    start(manifest: SectionManifest): Promise<void> {
        console.log(`[SEQUENCER] Starting lesson: ${manifest.chapterId} / ${manifest.sectionId} (Band ${this.band})`);
        this.manifest = manifest;
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

        while (!this.isStopped && this.currentBeatIndex < this.manifest.beats.length) {
            if (this.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 120));
                continue;
            }

            const beat = this.manifest.beats[this.currentBeatIndex];
            console.log(`[SEQUENCER] Processing Beat ${this.currentBeatIndex + 1}/${this.manifest.beats.length}: ${beat.title}`);

            await this.processBeat(beat);

            if (this.isStopped) {
                break;
            }

            this.currentBeatIndex++;

            if (this.currentBeatIndex < this.manifest.beats.length) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        if (!this.isStopped && this.currentBeatIndex >= this.manifest.beats.length) {
            console.log('[SEQUENCER] Lesson complete.');
            this.sendMessage({ type: 'lesson_complete' });
        }
    }

    private async processBeat(beat: Beat) {
        let baseText = beat.contentText;
        if (beat.bandOverrides && beat.bandOverrides[this.band.toString()]) {
            baseText = beat.bandOverrides[this.band.toString()].contentText;
        }

        const prompt = `Narrate the following history content for age-band ${this.band}. Be warm and authoritative. Maintain all historical facts and theological depth. Content: "${baseText}"`;
        const narratedText = await this.narrator.narrate(prompt) || baseText;

        console.log(`[SEQUENCER] Synthesizing audio for beat: ${beat.beatId}`);
        const audioBase64 = await this.tts.synthesize(narratedText) || '';

        // Dwell time safety net: if no audio, wait based on reading pace (~150 WPM)
        if (!audioBase64) {
            const wordCount = narratedText.split(/\s+/).length;
            const dwellMs = Math.max(3000, (wordCount / 150) * 60 * 1000);
            console.log(`[SEQUENCER] No audio for beat ${beat.beatId}. Dwelling ${Math.round(dwellMs / 1000)}s for ${wordCount} words.`);
            await new Promise(resolve => setTimeout(resolve, dwellMs));
        }

        const payload = {
            type: 'beat_payload',
            beatId: beat.beatId,
            text: narratedText,
            audioData: audioBase64,
            toolCalls: beat.toolSequence.map(t => ({
                type: 'tool_call',
                tool: t.tool,
                args: t.args
            }))
        };

        this.sendMessage(payload);
        this.completedBeats.push(beat);
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
