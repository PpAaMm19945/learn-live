import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class GeminiSession {
    private session: any = null;
    private onResCallback: ((data: any) => void) | null = null;

    constructor(private systemInstruction: string, private extraTools?: any[]) { }

    async connect() {
        console.log('[AGENT] Connecting to Gemini Live API');
        try {
            console.log('[AGENT] Started session with instruction: ', this.systemInstruction.substring(0, 50));

            this.session = await ai.live.connect({
                model: "gemini-2.0-flash-exp",
                config: {
                    responseModalities: ["AUDIO"],
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
                        if (e.toolCall && e.toolCall.functionCalls) {
                            for (const call of e.toolCall.functionCalls) {
                                if (this.onResCallback) {
                                    this.onResCallback({
                                        type: 'functionCall',
                                        id: call.id,
                                        name: call.name,
                                        args: call.args
                                    });
                                }
                            }
                        }

                        if (e.serverContent && this.onResCallback) {
                            let textContent = '';
                            let audioData = null;
                            let hasModelTurn = false;
                            let parts = [];

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
                            if (e.serverContent.outputTranscription?.parts) {
                                for (const part of e.serverContent.outputTranscription.parts) {
                                    if (part.text) {
                                        textContent += part.text;
                                    }
                                }
                            }

                            if (textContent) {
                                this.onResCallback({
                                    type: 'text',
                                    text: textContent,
                                    isFinal: false // The Live API streams text
                                });
                            }

                            if (audioData) {
                                this.onResCallback({
                                    type: 'audio',
                                    data: audioData
                                });
                            }

                            if (hasModelTurn) {
                                // Keep raw modelTurn for other potential uses
                                this.onResCallback({
                                    type: 'modelTurn',
                                    parts: parts
                                });
                            }
                        }

                        if (e.serverContent?.turnComplete && this.onResCallback) {
                            this.onResCallback({
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
    }

    sendText(text: string) {
        if (!this.session) return;

        try {
            this.session.send({
                clientContent: {
                    turns: [{
                        role: "user",
                        parts: [{ text }]
                    }],
                    turnComplete: true
                }
            });
        } catch (e) {
            console.error('[AGENT] Error sending text:', e);
        }
    }

    sendAudio(chunk: Buffer) {
        if (!this.session) return;

        try {
            // Send Base64 encoded audio chunk
            this.session.sendRealtimeInput([
                {
                    mimeType: "audio/pcm;rate=16000",
                    data: chunk.toString("base64")
                }
            ]);
        } catch (e) {
            console.error('[AGENT] Error sending audio chunk:', e);
        }
    }

    sendImage(base64Frame: string) {
        if (!this.session) return;

        try {
            this.session.sendRealtimeInput([{
                mimeType: "image/jpeg",
                data: base64Frame
            }]);
        } catch (e) {
            console.error('[AGENT] Error sending image frame:', e);
        }
    }

    sendToolResponse(functionResponses: Array<{ id: string; name: string; response: any }>) {
        if (!this.session) return;

        try {
            this.session.sendToolResponse({
                functionResponses: functionResponses.map(r => ({
                    ...r,
                    scheduling: "SILENT"
                }))
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
