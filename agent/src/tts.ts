export interface TTSOptions {
  voiceName?: string;
  /**
   * Natural-language pace/style directive prepended to the text.
   * Gemini TTS does NOT support a numeric speakingRate parameter;
   * pace is controlled through prompting (e.g. "Speak slowly and gently:").
   */
  pacePrompt?: string;
}

/**
 * Gemini-powered TTS using gemini-2.5-flash-preview-tts.
 * Uses the same GEMINI_API_KEY as the narrator — no extra secrets needed.
 * Includes exponential-backoff retries for transient 500/503 errors.
 * Supports sentence-boundary splitting for texts up to ~4000 chars.
 */
export class TTSService {
  private apiKey: string;
  private endpoint: string;
  private static MAX_RETRIES = 3;
  private static MIN_REQUEST_INTERVAL_MS = 6500;
  private static lastRequestAt = 0;
  private static queue: Promise<void> = Promise.resolve();

  /** Max chars per TTS chunk — Gemini TTS handles up to ~5000 but we stay safe */
  private static MAX_CHUNK_CHARS = 3800;

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
    const cleanText = text
      .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '')
      .replace(/\*\*/g, '')
      .replace(/[#_`>]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (!cleanText.trim()) return null;

    // Split into sentence-boundary chunks if text exceeds limit
    const chunks = this.splitIntoChunks(cleanText, TTSService.MAX_CHUNK_CHARS);
    console.log(`[TTS] Text ${cleanText.length} chars → ${chunks.length} chunk(s)`);

    const audioParts: string[] = [];
    for (const chunk of chunks) {
      const audio = await this.synthesizeChunk(chunk, options);
      if (!audio) {
        console.warn(`[TTS] Chunk synthesis failed (${chunk.length} chars), stopping`);
        break;
      }
      audioParts.push(audio);
    }

    if (audioParts.length === 0) return null;

    // For single chunk, return directly. For multiple, concatenate base64 PCM.
    if (audioParts.length === 1) return audioParts[0];

    return this.concatenateBase64PCM(audioParts);
  }

  /**
   * Split text at sentence boundaries, keeping each chunk under maxChars.
   */
  private splitIntoChunks(text: string, maxChars: number): string[] {
    if (text.length <= maxChars) return [text];

    const chunks: string[] = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= maxChars) {
        chunks.push(remaining);
        break;
      }

      const candidate = remaining.substring(0, maxChars);
      // Find last sentence boundary (. ! ? followed by space or end)
      let splitAt = -1;
      for (const delim of ['. ', '! ', '? ', '.\n', '!\n', '?\n']) {
        const idx = candidate.lastIndexOf(delim);
        if (idx > splitAt) splitAt = idx + 1; // include the punctuation
      }

      if (splitAt <= 0) {
        // No sentence boundary found — split at last space
        splitAt = candidate.lastIndexOf(' ');
        if (splitAt <= 0) splitAt = maxChars; // hard split as last resort
      }

      chunks.push(remaining.substring(0, splitAt).trim());
      remaining = remaining.substring(splitAt).trim();
    }

    return chunks.filter(c => c.length > 0);
  }

  /**
   * Concatenate multiple base64-encoded PCM audio strings.
   * Decodes each to a buffer, concatenates, and re-encodes.
   */
  private concatenateBase64PCM(parts: string[]): string {
    const buffers = parts.map(p => Buffer.from(p, 'base64'));
    const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
    const combined = Buffer.alloc(totalLength);
    let offset = 0;
    for (const buf of buffers) {
      buf.copy(combined, offset);
      offset += buf.length;
    }
    return combined.toString('base64');
  }

  private async synthesizeChunk(text: string, options: TTSOptions = {}): Promise<string | null> {
    await this.waitForTurn();

    // Prepend pace/style prompt if provided (Gemini TTS uses natural-language control)
    const spokenText = options.pacePrompt ? `${options.pacePrompt}\n\n${text}` : text;

    const payload = {
      contents: [{ parts: [{ text: spokenText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: options.voiceName || 'Charon'
            }
          },
        }
      },
    };

    console.log(`[TTS] Request: voice=${options.voiceName || 'Charon'}, pace="${(options.pacePrompt || 'default').slice(0, 60)}", text=${text.length} chars`);

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
            const delayMs = Math.max(TTSService.MIN_REQUEST_INTERVAL_MS, Math.pow(2, attempt + 1) * 1000);
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

        console.log(`[TTS] Chunk synthesized: ${text.length} chars → ${audioData.length} base64 chars`);
        return audioData;
      } catch (e) {
        if (attempt < TTSService.MAX_RETRIES - 1) {
          const delayMs = Math.max(TTSService.MIN_REQUEST_INTERVAL_MS, Math.pow(2, attempt + 1) * 1000);
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

  private async waitForTurn(): Promise<void> {
    const prior = TTSService.queue;
    let release!: () => void;
    TTSService.queue = new Promise<void>((resolve) => {
      release = resolve;
    });

    await prior;

    const elapsed = Date.now() - TTSService.lastRequestAt;
    const waitMs = Math.max(0, TTSService.MIN_REQUEST_INTERVAL_MS - elapsed);
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    TTSService.lastRequestAt = Date.now();
    release();
  }
}
