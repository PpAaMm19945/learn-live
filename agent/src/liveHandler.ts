import { WebSocket } from 'ws';
import { GeminiSession } from './gemini';

export interface QAContext {
    currentBeatTitle: string;
    currentBeatContent: string;
    recentTranscript: string;
}

export type LiveSliceType = 'gatekeeper' | 'negotiator';

const SLICE_TOOL_CONFIG: Record<LiveSliceType, { toolName: string; wsEvent: string }> = {
    gatekeeper: { toolName: 'complete_gatekeeper', wsEvent: 'gatekeeper_complete' },
    negotiator: { toolName: 'complete_negotiator', wsEvent: 'negotiator_complete' }
};

export class LiveConversationHandler {
    private session: GeminiSession | null = null;
    private resolvePromise: (() => void) | null = null;
    private timeoutRef: ReturnType<typeof setTimeout> | null = null;
    private isActive = false;
    private transcriptBuffer = '';
    private completionReason: 'success' | 'timeout' | 'connect_failed' | 'model_error' = 'success';

    constructor(
        private ws: WebSocket,
        private slice: LiveSliceType,
        private systemInstruction: string,
        private timeoutMs: number,
        private kickoffLine: string
    ) {}

    async start(): Promise<void> {
        if (this.isActive) {
            return Promise.resolve();
        }

        this.isActive = true;
        const tool = SLICE_TOOL_CONFIG[this.slice];

        this.session = new GeminiSession(this.systemInstruction, [{
            name: tool.toolName,
            description: `Completes the ${this.slice} slice and hands off control.`,
            parameters: {
                type: 'OBJECT',
                properties: {},
                required: []
            }
        }]);

        return new Promise(async (resolve) => {
            this.resolvePromise = resolve;
            try {
                await this.session?.connect();
                await this.session?.waitForReady();

                this.session?.onResponse((data) => {
                    this.handleGeminiResponse(data);
                });

                this.session?.sendClientContent(this.kickoffLine);

                this.timeoutRef = setTimeout(() => {
                    console.log(`[LIVE_${this.slice.toUpperCase()}] Timeout reached (${this.timeoutMs}ms). Completing slice.`);
                    this.completionReason = 'timeout';
                    this.complete();
                }, this.timeoutMs);
            } catch (err) {
                console.error(`[LIVE_${this.slice.toUpperCase()}] Failed to start:`, err);
                this.completionReason = 'connect_failed';
                this.complete();
            }
        });
    }

    sendAudio(data: string) {
        if (this.isActive && this.session) {
            this.session.sendAudio(Buffer.from(data, 'base64'));
        }
    }

    complete() {
        if (!this.isActive) return;

        this.isActive = false;
        if (this.timeoutRef) {
            clearTimeout(this.timeoutRef);
            this.timeoutRef = null;
        }

        if (this.session) {
            this.session.close();
            this.session = null;
        }

        const tool = SLICE_TOOL_CONFIG[this.slice];
        if (this.ws.readyState === WebSocket.OPEN) {
            // If it's not a normal success, send a warning/error message first
            if (this.completionReason === 'timeout') {
                this.ws.send(JSON.stringify({
                    type: 'live_slice_fallback',
                    slice: this.slice,
                    reason: 'timeout'
                }));
            } else if (this.completionReason === 'connect_failed' || this.completionReason === 'model_error') {
                this.ws.send(JSON.stringify({
                    type: 'live_slice_error',
                    slice: this.slice,
                    reason: this.completionReason
                }));
            }

            this.ws.send(JSON.stringify({ type: tool.wsEvent }));
        }

        if (this.resolvePromise) {
            this.resolvePromise();
            this.resolvePromise = null;
        }
    }

    isRunning(): boolean {
        return this.isActive;
    }

    private handleGeminiResponse(data: any) {
        if (!this.isActive || this.ws.readyState !== WebSocket.OPEN) return;

        const tool = SLICE_TOOL_CONFIG[this.slice];

        if (data.type === 'audio') {
            this.ws.send(JSON.stringify({ type: 'audio', data: data.data }));
            return;
        }

        if (data.type === 'text') {
            if (data.text) {
                this.transcriptBuffer = `${this.transcriptBuffer}${data.text}`;
            }
            this.ws.send(JSON.stringify({ type: 'transcript', text: data.text, isFinal: data.isFinal }));
            return;
        }

        if (data.type === 'thinking') {
            this.ws.send(JSON.stringify({ type: 'thinking', text: data.text }));
            return;
        }

        if (data.type === 'functionCall' && data.name === tool.toolName) {
            this.completionReason = 'success';
            this.session?.sendToolResponse([{
                id: data.id,
                name: data.name,
                response: { acknowledged: true }
            }]);
            setTimeout(() => this.complete(), 500);
            return;
        }

        if (data.type === 'error') {
            console.error(`[LIVE_${this.slice.toUpperCase()}] Gemini error:`, data.message);
            this.completionReason = 'model_error';
            this.complete();
        }
    }

    getTranscript(): string {
        return this.transcriptBuffer;
    }
}

export class LiveQAHandler {
    private session: GeminiSession | null = null;
    private silenceTimer: ReturnType<typeof setTimeout> | null = null;
    private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
    private resolvePromise: (() => void) | null = null;
    private isActive = false;
    private raiseHandCount = 0;
    private transcriptBuffer = '';

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

        this.isActive = true;
        this.raiseHandCount += 1;

        const qaInstruction = `${this.baseSystemInstruction}\n\nCURRENT CONTEXT:\nThe student has a question about: "${context.currentBeatTitle}".\nRecent lesson content: "${context.recentTranscript}"\nThe specific content being discussed right now is: "${context.currentBeatContent}"\n\nINSTRUCTIONS:\n- Answer briefly and clearly at a Band ${this.band} level.\n- Keep your responses under 30 seconds each.\n- When complete, say exactly: "Let's continue with the lesson."`;

        this.session = new GeminiSession(qaInstruction);

        return new Promise(async (resolve) => {
            this.resolvePromise = resolve;
            try {
                await this.session?.connect();
                await this.session?.waitForReady();
                this.session?.onResponse((data) => this.handleQAResponse(data));
                this.session?.sendClientContent(`The student has raised their hand. Ask how you can help with "${context.currentBeatTitle}".`);
                this.maxDurationTimer = setTimeout(() => this.stopQA(), 120000);
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

    private handleQAResponse(data: any) {
        if (!this.isActive || this.ws.readyState !== WebSocket.OPEN) return;
        if (data.type === 'audio') {
            this.ws.send(JSON.stringify({ type: 'audio', data: data.data }));
            this.resetSilenceTimer();
        } else if (data.type === 'text') {
            if (data.text) {
                this.transcriptBuffer = `${this.transcriptBuffer}${data.text}`;
            }
            this.ws.send(JSON.stringify({ type: 'transcript', text: data.text, isFinal: data.isFinal }));
            if ((data.text || '').toLowerCase().includes("let's continue with the lesson")) {
                setTimeout(() => this.stopQA(), 1200);
            }
        } else if (data.type === 'error') {
            this.stopQA();
        }
    }

    private resetSilenceTimer() {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => this.stopQA(), 10000);
    }

    getRaiseHandCount(): number {
        return this.raiseHandCount;
    }

    getLastQATranscript(): string {
        return this.transcriptBuffer;
    }

    getLastTranscript(_slice: LiveSliceType): string {
        // Slice transcripts are emitted from LiveConversationHandler in SessionLifecycle.
        // We keep this compatibility shim for session-level scoring calls.
        return this.transcriptBuffer;
    }
}
