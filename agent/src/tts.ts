export interface TTSOptions {
  voiceName?: string;
  speakingRate?: number;
}

/**
 * Gemini-powered TTS using gemini-2.5-flash-preview-tts.
 * Uses the same GEMINI_API_KEY as the narrator — no extra secrets needed.
 */
export class TTSService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[TTS] GEMINI_API_KEY is missing. Audio synthesis will fail.');
    }
    this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${this.apiKey}`;
  }

  async synthesize(text: string, options: TTSOptions = {}): Promise<string | null> {
    if (!this.apiKey) return null;

    // Clean text: strip markdown
    const cleanText = text.replace(/\*\*/g, '').replace(/[#_`>]/g, '');
    if (!cleanText.trim()) return null;

    const payload = {
      contents: [{ parts: [{ text: cleanText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: options.voiceName || 'Charon'
            }
          }
        }
      }
    };

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[TTS] Gemini TTS API error:', response.status, error);
        return null;
      }

      const data = await response.json() as any;
      const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioData) {
        console.error('[TTS] No audio data in Gemini TTS response');
        return null;
      }

      console.log(`[TTS] Synthesized ${cleanText.length} chars → ${audioData.length} base64 chars`);
      return audioData; // Base64 PCM string
    } catch (e) {
      console.error('[TTS] Fetch failed:', e);
      return null;
    }
  }
}
