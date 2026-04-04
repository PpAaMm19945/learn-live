import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class GeminiSession {
    private session: any = null;
    private onResCallback: ((data: any) => void) | null = null;
    private messageQueue: any[] = [];
    private setupCompleteResolve: (() => void) | null = null;
    private setupPromise: Promise<void>;
    private isSetupComplete = false;

    constructor(private systemInstruction: string, private extraTools?: any[]) {
        this.setupPromise = new Promise((resolve) => {
            this.setupCompleteResolve = resolve;
        });
    }

    private resetSetupPromise() {
        this.isSetupComplete = false;
        this.setupPromise = new Promise((resolve) => {
            this.setupCompleteResolve = resolve;
        });
    }

    async connect() {
        console.log('[AGENT] Connecting to Gemini Live API');
        try {
            this.resetSetupPromise();
            console.log('[AGENT] Started session with instruction: ', this.systemInstruction.substring(0, 50));
            const functionDeclarations = (this.extraTools || []).map(t => ({
                name: t.name,
                description: t.description,
                parameters: t.parameters,
            }));
            const setupTimeoutMs = Number(process.env.GEMINI_SETUP_TIMEOUT_MS || 15000);
            let setupTimeout: ReturnType<typeof setTimeout> | null = setTimeout(() => {
                if (!this.isSetupComplete) {
                    console.warn(`[GEMINI] setupComplete not received within ${setupTimeoutMs}ms`);
                    this.setupCompleteResolve?.();
                    this.setupCompleteResolve = null;
                }
            }, setupTimeoutMs);

            const liveConfig: any = {
                responseModalities: ['AUDIO'],
                outputAudioTranscription: {},
            };
            if (functionDeclarations.length > 0) {
                liveConfig.tools = [{ functionDeclarations }];
            }

            const connectParams: any = {
                model: "gemini-2.0-flash-live-001",
                config: liveConfig,
                systemInstruction: this.systemInstruction,
                callbacks: {
                    onopen: () => {
                        console.log('[AGENT] Gemini Live WebSocket opened.');
                    },
                    onmessage: (e: any) => {
                        console.log('[GEMINI] Message received:', Object.keys(e || {}).join(', '));

                        const payload = this.unwrapPayload(e);
                        if (payload?.setupComplete) {
                            if (!this.isSetupComplete) {
                                this.isSetupComplete = true;
                                if (setupTimeout) {
                                    clearTimeout(setupTimeout);
                                    setupTimeout = null;
                                }
                                console.log('[GEMINI] Setup complete — session ready for input.');
                                this.setupCompleteResolve?.();
                                this.setupCompleteResolve = null;
                            }
                        }
                        if (payload?.serverContent?.interrupted) {
                            console.log('[GEMINI] Model turn interrupted.');
                        }
                        if (payload?.serverContent?.turnComplete) {
                            console.log('[GEMINI] Model turn complete.');
                        }

                        const deliver = (msg: any) => {
                            if (this.onResCallback) {
                                this.onResCallback(msg);
                            } else {
                                this.messageQueue.push(msg);
                            }
                        };

                        const toolCall = payload?.toolCall;
                        if (toolCall && toolCall.functionCalls) {
                            for (const call of toolCall.functionCalls) {
                                deliver({
                                    type: 'functionCall',
                                    id: call.id,
                                    name: call.name,
                                    args: call.args
                                });
                            }
                        }

                        const serverContent = payload?.serverContent;
                        if (serverContent) {
                            let textContent = '';
                            let audioData = null;
                            let hasModelTurn = false;
                            let parts: any[] = [];

                            if (serverContent.modelTurn) {
                                hasModelTurn = true;
                                parts = serverContent.modelTurn.parts || [];
                                for (const part of parts) {
                                    if (part.text) {
                                        textContent += part.text;
                                    }
                                    if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('audio/')) {
                                        audioData = part.inlineData.data;
                                    }
                                }
                            }

                            // Capture transcript from audio output modalities if present
                            const outputTranscription = (serverContent as any).outputTranscription;
                            if (outputTranscription?.parts) {
                                for (const part of outputTranscription.parts) {
                                    if (part.text) {
                                        textContent += part.text;
                                    }
                                }
                            }

                            if (textContent) {
                                deliver({
                                    type: 'text',
                                    text: textContent,
                                    isFinal: false // The Live API streams text
                                });
                            }

                            if (audioData) {
                                deliver({
                                    type: 'audio',
                                    data: audioData
                                });
                            }

                            if (hasModelTurn) {
                                // Keep raw modelTurn for other potential uses
                                deliver({
                                    type: 'modelTurn',
                                    parts: parts
                                });
                            }
                        }

                        if (serverContent?.turnComplete) {
                            deliver({
                                type: 'text',
                                text: '',
                                isFinal: true
                            });
                        }
                    },
                    onclose: (event: any) => {
                        console.log('[AGENT] Gemini Live WebSocket closed.', 'code:', event?.code, 'reason:', event?.reason);
                        if (setupTimeout) {
                            clearTimeout(setupTimeout);
                            setupTimeout = null;
                        }
                        if (!this.isSetupComplete) {
                            this.setupCompleteResolve?.();
                            this.setupCompleteResolve = null;
                        }
                    },
                    onerror: (err: any) => {
                        console.error('[AGENT] Gemini Live WebSocket error:', err);
                    }
                }
            };

            this.session = await ai.live.connect(connectParams);

        } catch (error) {
            console.error('[AGENT] Error connecting to Gemini', error);
        }
    }

    onResponse(callback: (data: any) => void) {
        this.onResCallback = callback;
        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            callback(msg);
        }
    }

    async waitForReady(): Promise<void> {
        await this.setupPromise;
    }

    sendText(text: string) {
        if (!this.session) return;

        try {
            this.session.sendClientContent({
                turns: [{
                    role: "user",
                    parts: [{ text }]
                }],
                turnComplete: true
            });
        } catch (e) {
            console.error('[AGENT] Error sending text:', e);
        }
    }

    sendAudio(chunk: Buffer) {
        if (!this.session) return;

        try {
            // Send Base64 encoded audio chunk
            this.session.sendRealtimeInput({
                media: {
                    mimeType: "audio/pcm;rate=16000",
                    data: chunk.toString("base64")
                }
            });
        } catch (e) {
            console.error('[AGENT] Error sending audio chunk:', e);
        }
    }

    sendImage(base64Frame: string) {
        if (!this.session) return;

        try {
            this.session.sendRealtimeInput({
                media: {
                    mimeType: "image/jpeg",
                    data: base64Frame
                }
            });
        } catch (e) {
            console.error('[AGENT] Error sending image frame:', e);
        }
    }

    sendToolResponse(functionResponses: Array<{ id: string; name: string; response: any }>) {
        if (!this.session) return;

        try {
            this.session.sendToolResponse({
                functionResponses: functionResponses
            });
        } catch (e) {
            console.error('[AGENT] Error sending tool response:', e);
        }
    }

    close() {
        console.log('[AGENT] Closing Gemini session');
        if (this.session) {
            this.session.close();
            this.session = null;
        }
    }

    private unwrapPayload(event: any): any {
        if (!event) return {};
        if (event.serverContent || event.toolCall) return event;

        const candidates = [event.data, event.message, event.payload];
        for (const candidate of candidates) {
            if (!candidate) continue;

            if (typeof candidate === 'string') {
                try {
                    const parsed = JSON.parse(candidate);
                    if (parsed?.serverContent || parsed?.toolCall) return parsed;
                } catch {
                    // Ignore non-JSON payloads
                }
            } else if (candidate.serverContent || candidate.toolCall) {
                return candidate;
            }
        }

        return event;
    }
}
