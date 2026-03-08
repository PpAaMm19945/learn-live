import { Logger } from '@/lib/Logger';

/**
 * Canvas element types the Explainer Agent can create/manipulate.
 */
export interface CanvasElement {
    id: string;
    type: 'block' | 'text' | 'image' | 'shape' | 'group' | 'diagram';
    x: number;
    y: number;
    width?: number;
    height?: number;
    content?: string;       // text content or image URL
    color?: string;         // HSL string
    opacity?: number;
    scale?: number;
    rotation?: number;
    children?: string[];    // IDs for group type
    meta?: Record<string, any>;
}

export interface CanvasOperation {
    action: 'show' | 'animate' | 'remove' | 'clear' | 'highlight' | 'generate_diagram';
    elementId?: string;
    element?: Partial<CanvasElement>;
    animation?: {
        property: string;
        to: number | string;
        duration?: number;
        ease?: string;
    };
    diagramPrompt?: string; // For generate_diagram
}

export type ExplainerStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface ExplainerCallbacks {
    onStatusChange: (status: ExplainerStatus) => void;
    onCanvasOps: (ops: CanvasOperation[]) => void;
    onTranscript: (text: string) => void;
    onError: (message: string) => void;
}

/**
 * ExplainerClient — WebSocket bridge to the Explainer Agent on Cloud Run.
 * Handles bidi voice streaming + canvas tool call parsing.
 */
export class ExplainerClient {
    private ws: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private scriptNode: ScriptProcessorNode | null = null;
    private audioQueue: AudioBuffer[] = [];
    private isProcessingAudio = false;

    constructor(
        private taskId: string,
        private familyId: string,
        private learnerId: string,
        private callbacks: ExplainerCallbacks
    ) { }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/v1/agent/explainer?taskId=${this.taskId}&familyId=${this.familyId}&learnerId=${this.learnerId}`;

            Logger.info('[EXPLAINER]', 'Connecting to Explainer Agent', { wsUrl });
            this.callbacks.onStatusChange('connecting');

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                Logger.info('[EXPLAINER]', 'WebSocket connected');
                this.callbacks.onStatusChange('active');
                resolve();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (err) {
                    Logger.error('[EXPLAINER]', 'Failed to parse message', { err });
                }
            };

            this.ws.onerror = (err) => {
                Logger.error('[EXPLAINER]', 'WebSocket error', { err });
                this.callbacks.onError('Connection failed');
                reject(err);
            };

            this.ws.onclose = () => {
                Logger.info('[EXPLAINER]', 'WebSocket closed');
                this.callbacks.onStatusChange('ended');
            };
        });
    }

    private handleMessage(data: any) {
        // Canvas tool calls from agent
        if (data.type === 'canvas_ops') {
            this.callbacks.onCanvasOps(data.ops as CanvasOperation[]);
            return;
        }

        // Transcript/text from agent
        if (data.type === 'transcript') {
            this.callbacks.onTranscript(data.text);
            return;
        }

        // Session ended
        if (data.type === 'session_end') {
            Logger.info('[EXPLAINER]', 'Session ended', data);
            this.callbacks.onStatusChange('ended');
            return;
        }

        // Error from server
        if (data.error) {
            this.callbacks.onError(data.error);
            this.callbacks.onStatusChange('error');
            return;
        }

        // Audio from agent voice (modelTurn with inline audio)
        if (data.type === 'modelTurn' && data.parts) {
            for (const part of data.parts) {
                if (part.inlineData?.mimeType?.startsWith('audio/pcm')) {
                    this.playAudio(part.inlineData.data);
                }
                if (part.text) {
                    this.callbacks.onTranscript(part.text);
                }
            }
            return;
        }

        // Direct audio payload
        if (data.type === 'audio' && data.data) {
            this.playAudio(data.data);
        }
    }

    async startAudio(stream: MediaStream) {
        this.mediaStream = stream;
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = this.audioContext.createMediaStreamSource(stream);

        this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);
        this.scriptNode.onaudioprocess = (e) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            const buffer = new Uint8Array(pcm16.buffer);
            let binary = '';
            for (let i = 0; i < buffer.byteLength; i++) {
                binary += String.fromCharCode(buffer[i]);
            }

            this.ws.send(JSON.stringify({ type: 'audio', data: btoa(binary) }));
        };

        source.connect(this.scriptNode);
        this.scriptNode.connect(this.audioContext.destination);
        Logger.info('[EXPLAINER]', 'Audio capture started');
    }

    private async playAudio(base64: string) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        }

        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const int16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768.0;
        }

        const audioBuffer = this.audioContext.createBuffer(1, float32.length, 16000);
        audioBuffer.copyToChannel(float32, 0);
        this.audioQueue.push(audioBuffer);
        this.processQueue();
    }

    private processQueue() {
        if (this.isProcessingAudio || this.audioQueue.length === 0 || !this.audioContext) return;
        this.isProcessingAudio = true;

        const buffer = this.audioQueue.shift()!;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.onended = () => {
            this.isProcessingAudio = false;
            this.processQueue();
        };
        source.start();
    }

    disconnect() {
        Logger.info('[EXPLAINER]', 'Disconnecting');

        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            try { this.audioContext.close(); } catch (_) { /* noop */ }
            this.audioContext = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
            this.mediaStream = null;
        }
    }
}
