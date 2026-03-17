import type { Env } from '../../index';

export interface AdaptedContent {
    text: string;
    vocabulary?: string[];
    discussionQuestions?: string[];
    essayPrompt?: string;
    thinkingPrompts?: string[];
    pre_generated?: boolean;
    fallback?: boolean;
}

export function getBandPrompt(band: number): string {
    switch (band) {
        case 0:
            return "Rewrite for ages 3-5. Use 2-3 simple sentences. Short words. No complex concepts. Focus on one key fact.";
        case 1:
            return "Rewrite as a short story for ages 6-8. Simple vocabulary. Include one 'Did You Know?' fact. Max 150 words.";
        case 2:
            return "Condense for ages 9-11. Include key vocabulary with brief definitions. Add 2 discussion questions. Max 300 words.";
        case 3:
            return "Adapt for ages 12-14. Preserve most detail. Add critical thinking prompts. Include primary source excerpts where relevant. Max 500 words.";
        case 4:
            return "Present at high-school level. Full academic detail. Add historiographical context. Include essay prompt. Preserve all dates and figures.";
        case 5:
            return "Return the source text unchanged. Append supplementary reading suggestions if relevant.";
        default:
            return "Adapt for general audience.";
    }
}

export async function adaptContent(env: Env, chunkText: string, band: number, chapterContext: string): Promise<AdaptedContent> {
    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const bandPrompt = getBandPrompt(band);

    const prompt = `You are an expert history curriculum adapter.
Your task is to adapt the following text based on the target audience guidelines.
${bandPrompt}

### Source Text to Adapt ###
${chunkText}

### Chapter RAG Context (For supplementary detail if needed) ###
${chapterContext}

Return your response strictly as a JSON object matching this structure:
{
  "text": "The adapted narrative text goes here...",
  "vocabulary": ["word1", "word2"],
  "discussionQuestions": ["Question 1?", "Question 2?"],
  "essayPrompt": "An essay prompt if required by the band level.",
  "thinkingPrompts": ["Prompt 1", "Prompt 2"]
}
Only include the optional fields (vocabulary, discussionQuestions, essayPrompt, thinkingPrompts) if they are explicitly requested by the band guidelines. Do not include markdown formatting like \`\`\`json around the response.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
        attempt++;
        try {
            const response = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!response.ok) {
                if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
                    // Retry on rate limit or server error
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    continue;
                }
                const errText = await response.text();
                throw new Error(`Gemini API Error (${response.status}): ${errText}`);
            }

            const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textContent) {
                 throw new Error("No text returned from Gemini");
            }

            try {
               const parsedContent: AdaptedContent = JSON.parse(textContent);
               return parsedContent;
            } catch (e: unknown) {
               throw new Error(`Failed to parse JSON response from Gemini: ${e instanceof Error ? e.message : String(e)} - Content: ${textContent}`);
            }

        } catch (error: unknown) {
            if (attempt >= maxAttempts) {
                console.error('[ADAPT] Gemini adaptation failed after retries:', error);
                throw error;
            }
        }
    }

    throw new Error('Adaptation failed unexpectedly.');
}
