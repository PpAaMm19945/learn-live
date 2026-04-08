import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';

export interface QAContext {
    currentBeatTitle: string;
    currentBeatContent: string;
    recentTranscript: string;
}

export class LiveQAHandler {
    private session: GeminiSession | null = null;
    private silenceTimer: ReturnType<typeof setTimeout> | null = null;
    private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
    private resolvePromise: (() => void) | null = null;
    private isActive = false;

    constructor(
        private ws: WebSocket,
        private band: number,
        private baseSystemInstruction: string
    ) {}

    async startQA(context: QAContext): Promise<void> {
        if (this.band < 3) {
            console.warn(`[QA_HANDLER] Q&A requested for Band ${this.band}, but it is restricted to Band 3+`);
            return Promise.resolve();
        }

        console.log(`[QA_HANDLER] Starting Q&A for: ${context.currentBeatTitle}`);
        this.isActive = true;

        const qaInstruction = `
${this.baseSystemInstruction}

CURRENT CONTEXT:
The student has a question about: "${context.currentBeatTitle}".
Recent lesson content: "${context.recentTranscript}"
The specific content being discussed right now is: "${context.currentBeatContent}"

INSTRUCTIONS:
- Answer the student's question briefly and clearly at a Band ${this.band} level.
- Be encouraging and knowledgeable.
- When the question is answered or the conversation reaches a natural pause, you MUST say exactly: "Let's continue with the lesson."
- Keep your responses under 30 seconds each.
`;

        // Reuse GeminiSession for Live Audio
        this.session = new GeminiSession(qaInstruction);

        return new Promise(async (resolve) => {
            this.resolvePromise = resolve;

            try {
                await this.session?.connect();
                await this.session?.waitForReady();

                this.session?.onResponse((data) => {
                    this.handleGeminiResponse(data);
                });

                // Kickoff the session
                this.session?.sendClientContent(`The student has raised their hand. Greet them and ask how you can help with "${context.currentBeatTitle}".`);

                // Hard limit: 2 minutes
                this.maxDurationTimer = setTimeout(() => {
                    console.log('[QA_HANDLER] Max duration (2m) reached. Ending Q&A.');
                    this.stopQA();
                }, 120000);

                this.resetSilenceTimer();

            } catch (err) {
                console.error('[QA_HANDLER] Failed to start Live session:', err);
                this.stopQA();
            }
        });
    }

    sendAudio(data: string) {
        if (this.isActive && this.session) {
            this.session.sendAudio(Buffer.from(data, 'base64'));
            this.resetSilenceTimer();
        }
    }

    stopQA() {
        if (!this.isActive) return;
        
        console.log('[QA_HANDLER] Stopping Q&A session.');
        this.isActive = false;

        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        if (this.maxDurationTimer) clearTimeout(this.maxDurationTimer);

        if (this.session) {
            this.session.close();
            this.session = null;
        }

        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'qa_complete' }));
        }

        if (this.resolvePromise) {
            this.resolvePromise();
            this.resolvePromise = null;
        }
    }

    private handleGeminiResponse(data: any) {
        if (!this.isActive || this.ws.readyState !== WebSocket.OPEN) return;

        if (data.type === 'audio') {
            this.ws.send(JSON.stringify({
                type: 'audio',
                data: data.data
            }));
            this.resetSilenceTimer();
        } else if (data.type === 'text') {
            this.ws.send(JSON.stringify({
                type: 'transcript',
                text: data.text,
                isFinal: data.isFinal
            }));

            // Detect end cue
            if (data.text.toLowerCase().includes("let's continue with the lesson")) {
                console.log('[QA_HANDLER] End cue detected in transcript.');
                setTimeout(() => this.stopQA(), 1500); // Small delay to let audio finish
            }
        } else if (data.type === 'error') {
            console.error('[QA_HANDLER] Gemini Session Error:', data.message);
            this.stopQA();
        }
    }

    private resetSilenceTimer() {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        
        this.silenceTimer = setTimeout(() => {
            console.log('[QA_HANDLER] Silence timeout (10s) reached. Ending Q&A.');
            this.stopQA();
        }, 10000);
    }
}
