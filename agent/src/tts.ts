export interface TTSOptions {
  voiceName?: string;
  speakingRate?: number;
}

/**
 * Gemini-powered TTS using gemini-2.5-flash-preview-tts.
 * Uses the same GEMINI_API_KEY as the narrator — no extra secrets needed.
 * Includes exponential-backoff retries for transient 500/503 errors.
 */
export class TTSService {
  private apiKey: string;
  private endpoint: string;
  private static MAX_RETRIES = 3;

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

    for (let attempt = 0; attempt < TTSService.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorBody = await response.text();
          const isRetryable = response.status >= 500 || response.status === 429;

          if (isRetryable && attempt < TTSService.MAX_RETRIES - 1) {
            const delayMs = Math.pow(2, attempt + 1) * 1000;
            console.warn(`[TTS] ${response.status} — retry ${attempt + 1}/${TTSService.MAX_RETRIES} in ${delayMs / 1000}s`);
            await new Promise(r => setTimeout(r, delayMs));
            continue;
          }

          console.error(`[TTS] Gemini TTS API error: ${response.status} (attempt ${attempt + 1}/${TTSService.MAX_RETRIES})`, errorBody);
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
        if (attempt < TTSService.MAX_RETRIES - 1) {
          const delayMs = Math.pow(2, attempt + 1) * 1000;
          console.warn(`[TTS] Fetch failed — retry ${attempt + 1}/${TTSService.MAX_RETRIES} in ${delayMs / 1000}s:`, e);
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }
        console.error(`[TTS] Fetch failed after ${TTSService.MAX_RETRIES} attempts:`, e);
        return null;
      }
    }

    return null;
  }
}
