import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { apiVersion: 'v1alpha' }
});

export class GeminiSession {
    private session: any = null;
    private onResCallback: ((data: any) => void) | null = null;
    private messageQueue: any[] = [];
    private setupCompleteResolve: (() => void) | null = null;
    private setupPromise: Promise<void>;
    private setupTimeout: ReturnType<typeof setTimeout> | null = null;
    private isSetupComplete = false;

    constructor(private systemInstruction: string, private extraTools?: any[]) {
        this.setupPromise = new Promise((resolve) => {
            this.setupCompleteResolve = resolve;
        });
    }

    async connect() {
        console.log('[AGENT] Connecting to Gemini Live API');
        try {
            console.log('[AGENT] Started session with instruction: ', this.systemInstruction.substring(0, 50));
            const functionDeclarations = (this.extraTools || []).map(t => ({
                name: t.name,
                description: t.description,
                parameters: t.parameters,
            }));

            const liveConfig: any = {
                responseModalities: ['AUDIO'],
                outputAudioTranscription: {},
                systemInstruction: { parts: [{ text: this.systemInstruction }] },
            };
            if (functionDeclarations.length > 0) {
                liveConfig.tools = [{ functionDeclarations }];
            }

            const connectParams: any = {
                model: "gemini-2.0-flash-exp",
                config: liveConfig,
                callbacks: {
                    onopen: () => {
                        console.log('[AGENT] Gemini Live WebSocket opened.');
                    },
                    onmessage: (e: any) => {
                        console.log('[GEMINI] Message received:', Object.keys(e || {}).join(', '));

                        const payload = e;
                        if (payload?.setupComplete) {
                            console.log('[GEMINI] Setup complete — session ready for input.');
                            this.markSetupComplete();
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

                        if (payload?.toolCall) {
                            deliver({
                                type: 'functionCall',
                                id: payload.toolCall.id,
                                name: payload.toolCall.name,
                                args: payload.toolCall.args
                            });
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
                                    if (part.functionCall) {
                                        deliver({
                                            type: 'functionCall',
                                            id: part.functionCall.id,
                                            name: part.functionCall.name,
                                            args: part.functionCall.args
                                        });
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
                    },
                    onerror: (err: any) => {
                        console.error('[AGENT] Gemini Live WebSocket error:', err);
                    }
                }
            };

            this.session = await ai.live.connect(connectParams);
            this.setupTimeout = setTimeout(() => {
                if (!this.isSetupComplete) {
                    console.warn('[GEMINI] setupComplete not received within 15s');
                    this.markSetupComplete();
                }
            }, 15000);

        } catch (error) {
            console.error('[AGENT] Error connecting to Gemini', error);
        }
    }

    async waitForReady(): Promise<void> {
        await this.setupPromise;
    }

    onResponse(callback: (data: any) => void) {
        this.onResCallback = callback;
        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            callback(msg);
        }
    }

    sendText(text: string) {
        if (!this.session) return;

        try {
            this.session.sendRealtimeInput({ text });
        } catch (e) {
            console.error('[AGENT] Error sending text:', e);
        }
    }

    sendClientContent(text: string) {
        if (!this.session) return;

        try {
            this.session.sendClientContent({
                turns: [{ role: 'user', parts: [{ text }] }]
            });
        } catch (e) {
            console.error('[AGENT] Error sending client content:', e);
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
        this.onResCallback = null;
        this.messageQueue = [];
        if (this.setupTimeout) {
            clearTimeout(this.setupTimeout);
            this.setupTimeout = null;
        }
        if (this.session) {
            try {
                this.session.close();
            } catch (e) {
                console.error('[AGENT] Error closing Gemini session:', e);
            }
            this.session = null;
        }
    }

    private markSetupComplete() {
        if (this.isSetupComplete) return;
        this.isSetupComplete = true;
        if (this.setupTimeout) {
            clearTimeout(this.setupTimeout);
            this.setupTimeout = null;
        }
        this.setupCompleteResolve?.();
        this.setupCompleteResolve = null;
    }

}
