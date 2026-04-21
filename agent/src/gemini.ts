import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { apiVersion: 'v1alpha' }
});

/**
 * Narrator using the Gemini REST API for stable, structured content generation.
 * Bypasses SDK versioning issues for simple generateContent calls.
 */
export class GenAINarrator {
    private apiKey: string;
    private model = "gemini-1.5-flash";
    private endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    constructor(private systemInstruction: string) {
        this.apiKey = process.env.GEMINI_API_KEY || '';
    }

    async narrate(prompt: string): Promise<string> {
        if (!this.apiKey) return "";

        const payload = {
            system_instruction: { parts: [{ text: this.systemInstruction }] },
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.4,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        const MAX_RETRIES = 3;
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 503 || response.status === 429) {
                    const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                    console.warn(`[NARRATOR] Gemini ${response.status} — retry ${attempt}/${MAX_RETRIES} in ${delayMs / 1000}s`);
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    continue;
                }

                if (!response.ok) {
                    const err = await response.text();
                    console.error('[NARRATOR] Gemini REST error:', err);
                    return "";
                }

                const data = await response.json() as any;
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                
                // Strip any tool call syntax that leaked into narrator output
                return text.replace(/\b(set_scene|dismiss_overlay|show_scripture|zoom_to|highlight_region|draw_route|place_marker|clear_canvas|show_figure|show_genealogy|show_timeline)\s*\([^)]*\)\s*/g, '').trim();
            } catch (error) {
                console.error(`[NARRATOR] Gemini Fetch failed (attempt ${attempt}):`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                    continue;
                }
                return "";
            }
        }
        console.error(`[NARRATOR] All ${MAX_RETRIES} retries exhausted.`);
        return "";
    }
}

export class GeminiSession {
    private session: any = null;
    private onResCallback: ((data: any) => void) | null = null;
    private messageQueue: any[] = [];
    private setupCompleteResolve: (() => void) | null = null;
    private setupPromise: Promise<void>;
    private setupTimeout: ReturnType<typeof setTimeout> | null = null;
    private isSetupComplete = false;

    constructor(private systemInstruction: string, private extraTools?: any[], private voiceName?: string) {
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
                responseModalities: ['AUDIO'] as any,
                outputAudioTranscription: {},
                systemInstruction: { parts: [{ text: this.systemInstruction }] },
                speechConfig: this.voiceName ? {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: this.voiceName
                        }
                    }
                } : undefined,
            };
            if (functionDeclarations.length > 0) {
                liveConfig.tools = [{ functionDeclarations }];
            }

            const connectParams: any = {
                model: "gemini-2.5-flash-native-audio-latest",
                config: liveConfig,
                callbacks: {
                    onopen: () => {
                        console.log('[AGENT] Gemini Live WebSocket opened.');
                    },
                    onmessage: (e: any) => {
                        console.log('[GEMINI] Message received:', JSON.stringify(e));

                        if (e.setupComplete) {
                            console.log('[GEMINI] Setup complete — session ready for input.');
                            this.markSetupComplete();
                        }
                        if (e.serverContent) {
                            if (e.serverContent.interrupted) {
                                console.log('[GEMINI] Model turn interrupted.');
                            }
                            if (e.serverContent.turnComplete) {
                                console.log('[GEMINI] Model turn complete.');
                            }
                        }

                        const deliver = (msg: any) => {
                            if (this.onResCallback) {
                                this.onResCallback(msg);
                            } else {
                                this.messageQueue.push(msg);
                            }
                        };

                        if (e.toolCall) {
                            deliver({
                                type: 'functionCall',
                                id: e.toolCall.id,
                                name: e.toolCall.name,
                                args: e.toolCall.args
                            });
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

                            // Robustly capture transcript for native-audio models
                            const outputTranscription = (e.serverContent as any).outputTranscription;
                            let transcriptionSource = '';

                            if (outputTranscription?.text) {
                                transcriptionSource = outputTranscription.text;
                            } else if (outputTranscription?.parts) {
                                transcriptionSource = outputTranscription.parts.map((p: any) => p.text).join(' ');
                            }

                            if (transcriptionSource) {
                                // Extract and deliver thinking/internal reasoning first
                                const thinkingRegex = /\*\*([^*]+)\*\*/g;
                                let cleanText = transcriptionSource;
                                let match;

                                while ((match = thinkingRegex.exec(transcriptionSource)) !== null) {
                                    deliver({
                                        type: 'thinking',
                                        text: match[1].trim(),
                                        isFinal: false
                                    });
                                }

                                // Robustly strip any text wrapped in double-asterisks (reasoning/thinking)
                                // and also strip any lingering tool-call syntax just in case.
                                cleanText = cleanText
                                    .replace(/\*\*([^*]+)\*\*/g, '')
                                    .replace(/\b(complete_gatekeeper|complete_negotiator)\s*\([^)]*\)\s*/g, '')
                                    .trim();

                                if (cleanText) {
                                    textContent += `${textContent ? ' ' : ''}${cleanText}`;
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
                audio: {
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
