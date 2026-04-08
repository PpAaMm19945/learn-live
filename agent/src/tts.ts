export interface TTSOptions {
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
  sampleRateHertz?: number;
}

export class TTSService {
  private apiKey: string;
  private endpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize';

  constructor() {
    this.apiKey = process.env.GOOGLE_TTS_KEY || '';
    if (!this.apiKey) {
      console.warn('[TTS] GOOGLE_TTS_KEY is missing. Audio synthesis will fail.');
    }
  }

  async synthesize(text: string, options: TTSOptions = {}): Promise<string | null> {
    if (!this.apiKey) return null;

    // Clean text: strip markdown
    const cleanText = text.replace(/\*\*/g, '').replace(/[#_`>]/g, '');

    const payload = {
      input: { text: cleanText },
      voice: {
        languageCode: 'en-US',
        name: options.voiceName || 'en-US-Studio-O' // Warm male narrator
      },
      audioConfig: {
        audioEncoding: 'LINEAR16',
        speakingRate: options.speakingRate || 0.95,
        pitch: options.pitch || 0,
        sampleRateHertz: options.sampleRateHertz || 24000
      }
    };

    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[TTS] API error:', error);
        return null;
      }

      const data = await response.json() as { audioContent: string };
      return data.audioContent; // Base64 string
    } catch (e) {
      console.error('[TTS] Fetch failed:', e);
      return null;
    }
  }
}
