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
                    systemInstruction: {
                        parts: [{ text: this.systemInstruction }]
                    },
                    tools: [{
                        functionDeclarations: [{
                            name: 'evaluate_constraint',
                            description: 'Evaluate if the physical work meets the required constraint.',
                            parameters: {
                                type: Type.OBJECT,
                                properties: {
                                    status: { type: Type.STRING, enum: ['success', 'failure'] },
                                    summary: { type: Type.STRING }
                                },
                                required: ['status', 'summary']
                            }
                        }]
                    }]
                },
                callbacks: {
                    onopen: () => {
                        console.log('[AGENT] Gemini Live WebSocket opened.');
                    },
                    onmessage: (e) => {
                        if (e.toolCall && e.toolCall.functionCalls) {
                            for (const call of e.toolCall.functionCalls) {
                                if (call.name === 'evaluate_constraint' && this.onResCallback) {
                                    console.log('[AGENT] Received evaluate_constraint from model');
                                    this.onResCallback({
                                        type: 'functionCall',
                                        name: call.name,
                                        args: call.args
                                    });
                                }
                            }
                        }

                        if (e.serverContent?.modelTurn && this.onResCallback) {
                            this.onResCallback({
                                type: 'modelTurn',
                                parts: e.serverContent.modelTurn.parts
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

    close() {
        console.log('[AGENT] Closing Gemini session');
        if (this.session) {
            this.session.close();
            this.session = null;
        }
    }
}
