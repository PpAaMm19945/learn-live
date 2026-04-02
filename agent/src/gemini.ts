import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class GeminiSession {
    private session: any = null;
    private onResCallback: ((data: any) => void) | null = null;
    private messageQueue: any[] = [];

    constructor(private systemInstruction: string, private extraTools?: any[]) { }

    async connect() {
        console.log('[AGENT] Connecting to Gemini Live API');
        try {
            console.log('[AGENT] Started session with instruction: ', this.systemInstruction.substring(0, 50));

            this.session = await ai.live.connect({
                model: "gemini-2.0-flash-exp",
                config: {
                    responseModalities: ["AUDIO"] as any,
                    outputAudioTranscription: {},
                    systemInstruction: {
                        parts: [{ text: this.systemInstruction }]
                    },
                    tools: [{
                        functionDeclarations: [
                            ...(this.extraTools || []).map(t => ({
                                name: t.name,
                                description: t.description,
                                parameters: t.parameters,
                            })),
                        ]
                    }]
                },
                callbacks: {
                    onopen: () => {
                        console.log('[AGENT] Gemini Live WebSocket opened.');
                    },
                    onmessage: (e) => {
                        console.log('[GEMINI] Message received:', Object.keys(e).join(', '));

                        const deliver = (msg: any) => {
                            if (this.onResCallback) {
                                this.onResCallback(msg);
                            } else {
                                this.messageQueue.push(msg);
                            }
                        };

                        if (e.toolCall && e.toolCall.functionCalls) {
                            for (const call of e.toolCall.functionCalls) {
                                deliver({
                                    type: 'functionCall',
                                    id: call.id,
                                    name: call.name,
                                    args: call.args
                                });
                            }
                        }

                        if (e.serverContent) {
                            let textContent = '';
                            let audioData = null;
                            let hasModelTurn = false;
                            let parts: any[] = [];

                            if (e.serverContent.modelTurn) {
                                hasModelTurn = true;
                                parts = e.serverContent.modelTurn.parts || [];
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
                            const outputTranscription = (e.serverContent as any).outputTranscription;
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

                        if (e.serverContent?.turnComplete) {
                            deliver({
                                type: 'text',
                                text: '',
                                isFinal: true
                            });
                        }
                    },
                    onclose: () => {
                        console.log('[AGENT] Gemini Live WebSocket closed.');
                    },
                    onerror: (err) => {
                        console.error('[AGENT] Gemini Live WebSocket error:', err);
                    }
                }
            });

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
}
