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
    private completedBeats: Beat[] = [];

    constructor(
        private ws: WebSocket,
        private band: number,
        private systemInstruction: string
    ) {
        this.narrator = new GenAINarrator(systemInstruction);
        this.tts = new TTSService();
    }

    async start(manifest: SectionManifest) {
        console.log(`[SEQUENCER] Starting lesson: ${manifest.chapterId} / ${manifest.sectionId} (Band ${this.band})`);
        this.manifest = manifest;

        await this.runLoop();
    }

    private async runLoop() {
        if (!this.manifest) return;

        while (this.currentBeatIndex < this.manifest.beats.length) {
            if (this.isPaused) {
                await new Promise(resolve => setTimeout(resolve, 500));
                continue;
            }

            const beat = this.manifest.beats[this.currentBeatIndex];
            console.log(`[SEQUENCER] Processing Beat ${this.currentBeatIndex + 1}/${this.manifest.beats.length}: ${beat.title}`);

            await this.processBeat(beat);
            
            this.currentBeatIndex++;
            
            // Short gap between beats
            if (this.currentBeatIndex < this.manifest.beats.length) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        console.log('[SEQUENCER] Lesson complete.');
        this.sendMessage({ type: 'lesson_complete' });
    }

    private async processBeat(beat: Beat) {
        // 1. Get adapted text
        let baseText = beat.contentText;
        if (beat.bandOverrides && beat.bandOverrides[this.band.toString()]) {
            baseText = beat.bandOverrides[this.band.toString()].contentText;
        }
        
        // Use Gemini to "narrate" the text in a teaching voice for the specific band
        const prompt = `Narrate the following history content for age-band ${this.band}. Be warm and authoritative. Maintain all historical facts and theological depth. Content: "${baseText}"`;
        const narratedText = await this.narrator.narrate(prompt) || baseText;

        // 2. Synthesize audio
        console.log(`[SEQUENCER] Synthesizing audio for beat: ${beat.beatId}`);
        const audioBase64 = await this.tts.synthesize(narratedText) || "";

        // 3. Construct Beat Payload
        // Note: toolSequence is already pre-planned in the JSON
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

        // 4. Send to client
        this.sendMessage(payload);

        // Record for context
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
        this.isPaused = false;
        console.log('[SEQUENCER] Resumed');
    }

    private sendMessage(msg: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(msg));
        }
    }

    private sendError(message: string) {
        this.sendMessage({ type: 'error', message });
    }
}
