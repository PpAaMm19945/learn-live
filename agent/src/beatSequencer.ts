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
    private previousNarratedText = '';
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

        const totalBeats = this.manifest?.beats.length || 1;
        const beatIndex = this.currentBeatIndex + 1;
        const isFirst = beatIndex === 1;
        const isLast = beatIndex === totalBeats;

        // Extract pipeline context if available (from LessonPreparer)
        const pipelineCtx = (beat as any)._pipelineContext;
        const beatRole = pipelineCtx?.beatRole || 'human_story';
        const theFrame = pipelineCtx?.theologicalFrame;
        const lessonArch = pipelineCtx?.lessonArchitecture;
        const studentProf = pipelineCtx?.studentProfile;

        // Build a continuity-aware prompt with pipeline enrichment
        let prompt = '';
        
        const jsonGuard = `\n\nCRITICAL OUTPUT RULES:\n- Your response must be ONLY plain narration text — spoken words for the student.\n- NEVER include JSON, code blocks, markdown fences, tool commands, function calls, or any structured data.\n- Do NOT output anything like \`\`\`json, set_scene(), show_scripture(), or [{"command":...}].\n- If you feel the urge to include stage directions or visual cues, suppress it — those are handled separately.\n`;

        const voiceGuard = `\n\nVOICE CONSISTENCY (NON-NEGOTIABLE):\n- Speak with STRONG, BOLD, AUTHORITATIVE energy — like a passionate university professor.\n- Do NOT whisper, murmur, or use a quiet storytelling voice. EVER.\n- Project confidence and conviction in EVERY sentence.\n- This instruction OVERRIDES all other tone guidance.\n`;

        // Pipeline-aware context injection
        let pipelineContext = '';
        if (theFrame) {
            pipelineContext += `\nTHEOLOGICAL FRAME: God is ${theFrame.whatGodIsDoing}. Covenant principle: ${theFrame.covenantPrinciple}.`;
            if (theFrame.africaConnection) pipelineContext += ` Africa connection: ${theFrame.africaConnection}.`;
        }
        if (lessonArch && beatRole === 'hook') {
            pipelineContext += `\nLESSON HOOK APPROACH: ${lessonArch.hook}`;
        }
        if (lessonArch && beatRole === 'theological_turn') {
            pipelineContext += `\nTHEOLOGICAL TURN: ${lessonArch.theologicalTurn}. This must emerge naturally from the story — never announced.`;
        }
        if (lessonArch && beatRole === 'living_question') {
            pipelineContext += `\nLIVING QUESTION: End with this question posed to the student: "${lessonArch.livingQuestion}". Pose it and stop. Do NOT answer it.`;
        }
        if (studentProf) {
            pipelineContext += `\nSTUDENT: Emotional register: ${studentProf.emotionalRegister}. Vocabulary ceiling: ${studentProf.vocabularyCeiling}.`;
        }

        if (isFirst) {
            prompt = `You are beginning a lesson. Narrate the following content for age-band ${this.band}. Do not introduce yourself or say "welcome" — start directly with the content.${jsonGuard}${voiceGuard}${pipelineContext}\nContent: "${baseText}"`;
        } else {
            prompt = `CRITICAL: This is segment ${beatIndex} of ${totalBeats} in a CONTINUOUS lesson that is already in progress. The student has been listening without interruption.\n\nRULES:\n- Do NOT greet, welcome, or introduce yourself.\n- Do NOT say "Let's continue" or "Now let's look at" or recap what was just said.\n- Do NOT summarize previous segments.\n- Continue narrating as if you are mid-lecture, seamlessly flowing from the previous passage.\n- Maintain the SAME strong, authoritative tone and energy as the previous segment.${jsonGuard}${voiceGuard}${pipelineContext}\nPrevious segment ended with: "${this.previousNarratedText.slice(-200)}"\n\nNarrate this next passage for age-band ${this.band}. Maintain all historical facts and theological depth.\n\nContent: "${baseText}"`;
        }

        if (isLast) {
            prompt += '\n\nThis is the final segment. End with a thoughtful closing reflection — not a summary, but a question or observation the student can carry with them. Do NOT say "goodbye" or "see you next time."';
        }

        let narratedText = await this.narrator.narrate(prompt) || baseText;
        
        // Strip any JSON/code blocks that leaked into the narration
        narratedText = narratedText
            .replace(/```(?:json)?\s*[\s\S]*?```/gi, '')
            .replace(/\[\s*\{\s*"(?:command|action|actions)"\s*:[\s\S]*?\}\s*\]/g, '')
            .replace(/\{\s*"(?:command|action)"\s*:[\s\S]*?\}/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim() || baseText;
        
        this.previousNarratedText = narratedText;

        console.log(`[SEQUENCER] Synthesizing audio for beat: ${beat.beatId}`);
        const audioBase64 = await this.tts.synthesize(narratedText) || '';

        // If TTS failed, log it but send the beat immediately — the frontend
        // will use browser speechSynthesis or a dwell-time fallback.
        if (!audioBase64) {
            console.warn(`[SEQUENCER] No audio for beat ${beat.beatId} — frontend will use browser TTS fallback`);
        }

        const payload = {
            type: 'beat_payload',
            beatId: beat.beatId,
            text: narratedText,
            audioData: audioBase64,
            sceneMode: beat.sceneMode || 'transcript',
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
