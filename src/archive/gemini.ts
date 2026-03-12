import { Logger } from '@/lib/Logger';

export class GeminiLiveClient {
    private ws: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private scriptNode: ScriptProcessorNode | null = null;
    private audioQueue: AudioBuffer[] = [];
    private isProcessingAudio = false;
    private videoInterval: number | null = null;

    constructor(
        private taskId: string,
        private familyId: string,
        private learnerId: string,
        private onMessage?: (data: any) => void
    ) { }

    connect() {
        return new Promise<void>((resolve, reject) => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/v1/agent/session?taskId=${this.taskId}&familyId=${this.familyId}&learnerId=${this.learnerId}`;

            Logger.info('[UI]', 'Connecting to Agent WebSocket', { taskId: this.taskId, wsUrl });

            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                Logger.info('[UI]', 'Agent WebSocket connected');
                resolve();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleIncomingMessage(data);
                    if (this.onMessage) this.onMessage(data);
                } catch (error) {
                    Logger.error('[UI]', 'Error parsing WS message', { error });
                }
            };

            this.ws.onerror = (error) => {
                Logger.error('[UI]', 'Agent WebSocket error', { error });
                reject(error);
            };

            this.ws.onclose = () => {
                Logger.info('[UI]', 'Agent WebSocket closed');
                this.disconnect();
            };
        });
    }

    private handleIncomingMessage(data: any) {
        // Assuming standard Gemini Live API format or simple { type: 'audio', data: 'base64' }
        let base64Audio = null;

        if (data.type === 'audio' && data.data) {
            base64Audio = data.data;
        } else if (data.serverContent?.modelTurn?.parts) {
            const parts = data.serverContent.modelTurn.parts;
            for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                    base64Audio = part.inlineData.data;
                }
            }
        }

        if (base64Audio) {
            this.playIncomingAudio(base64Audio);
        }
    }

    async startAudio(stream: MediaStream) {
        this.mediaStream = stream;
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = this.audioContext.createMediaStreamSource(stream);

        // Using ScriptProcessorNode for simplicity of extracting raw PCM bytes in the browser.
        this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);

        this.scriptNode.onaudioprocess = (audioProcessingEvent) => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

            const inputBuffer = audioProcessingEvent.inputBuffer;
            const inputData = inputBuffer.getChannelData(0); // Mono

            // Convert Float32 to Int16
            const pcm16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Base64 encode
            const buffer = new Uint8Array(pcm16.buffer);
            let binary = '';
            for (let i = 0; i < buffer.byteLength; i++) {
                binary += String.fromCharCode(buffer[i]);
            }
            const base64 = btoa(binary);

            this.ws.send(JSON.stringify({ type: 'audio', data: base64 }));
        };

        source.connect(this.scriptNode);
        this.scriptNode.connect(this.audioContext.destination);
        Logger.info('[UI]', 'Started recording audio');
    }

    startVideo(videoElement: HTMLVideoElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        this.videoInterval = window.setInterval(() => {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
            if (videoElement.readyState >= 2 && ctx) { // HAVE_CURRENT_DATA
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // Convert to base64 JPEG
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                const base64 = dataUrl.split(',')[1];

                this.ws.send(JSON.stringify({ type: 'image', data: base64 }));
            }
        }, 1000);
        Logger.info('[UI]', 'Started recording video');
    }

    private async playIncomingAudio(base64: string) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        }

        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // For 16-bit PCM to Float32
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0;
        }

        const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 16000);
        audioBuffer.copyToChannel(float32Array, 0);

        this.audioQueue.push(audioBuffer);
        this.processAudioQueue();
    }

    private processAudioQueue() {
        if (this.isProcessingAudio || this.audioQueue.length === 0 || !this.audioContext) return;

        this.isProcessingAudio = true;
        const buffer = this.audioQueue.shift()!;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);

        source.onended = () => {
            this.isProcessingAudio = false;
            this.processAudioQueue();
        };

        source.start();
    }

    disconnect() {
        Logger.info('[UI]', 'Disconnecting GeminiLiveClient');
        if (this.videoInterval) {
            clearInterval(this.videoInterval);
            this.videoInterval = null;
        }

        if (this.scriptNode) {
            this.scriptNode.disconnect();
            this.scriptNode = null;
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            try {
                this.audioContext.close();
            } catch (e) {
                console.error("Error closing audio context", e);
            }
            this.audioContext = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
