import { Env } from '../../index';
import { r2Helper } from '../r2';
import { buildRAGContext } from '../content/retrieve';

export interface ArtifactAssessment {
    status: 'draft' | 'approved' | 'rejected';
    score: number;
    feedback: string;
    areas_to_improve: string;
}

// Convert ArrayBuffer to base64 using btoa to avoid node:buffer dependency in CF worker
function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function evaluateArtifact(
    env: Env,
    lessonId: string,
    band: number,
    r2Key: string
): Promise<ArtifactAssessment> {
    // 1. Retrieve the image from R2
    const file = await r2Helper.getFile(env.EVIDENCE_VAULT, r2Key);
    if (!file) {
        throw new Error(`File not found in R2 for key: ${r2Key}`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = arrayBufferToBase64(arrayBuffer);

    // Determine mime type based on extension
    let mimeType = 'image/jpeg';
    const keyLower = r2Key.toLowerCase();
    if (keyLower.endsWith('.png')) {
        mimeType = 'image/png';
    } else if (keyLower.endsWith('.heic')) {
        mimeType = 'image/heic';
    }

    // 2. Retrieve reference content (maps, timelines) using RAG context
    // We fetch lesson details to construct a relevant query for RAG
    const lesson = await env.DB.prepare(`
        SELECT title, narrative_text FROM Lessons WHERE id = ?
    `).bind(lessonId).first<any>();

    let referenceContext = "";
    if (lesson) {
        // Query RAG for maps/timelines context specific to this lesson's topic
        const ragQuery = `map timeline geography ${lesson.title}`;
        const ragContext = await buildRAGContext(env, ragQuery);

        referenceContext += `\n### Reference Context (RAG) ###\n${ragContext}\n`;

        if (lesson.narrative_text) {
            referenceContext += `\n### Lesson Context ###\n`;
            referenceContext += lesson.narrative_text.substring(0, 1500) + '...\n';
        }
    } else {
        referenceContext += "No specific reference sources found. Base your evaluation on general historical knowledge for this topic.\n";
    }

    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    // 3. Build Gemini prompt
    const systemPrompt = `You are an expert history teacher examining a student's artifact (such as a drawn map, timeline, or diagram).
The student is in learning band ${band} (0=Age 3-5, 1=Age 6-8, 2=Age 9-11, 3=Age 12-14, 4=Age 15-17, 5=University Prep).
Adjust your expectations based on their age group. For lower bands, focus on effort and basic understanding. For higher bands, look for precision, historical accuracy, and detail.

Here is the reference material for the lesson:
${referenceContext}

Examine the provided image of the student's artifact. Compare it against the reference material and lesson context.
Provide a structured assessment as a JSON object with the following fields:
- "status": Always return "draft"
- "score": A number between 0 and 100 representing accuracy and effort
- "feedback": 2-3 sentences of encouraging feedback highlighting what they did well
- "areas_to_improve": 1-2 sentences suggesting specific historical or geographical details they could add or correct next time

Do NOT wrap the response in markdown code blocks. Return ONLY the raw JSON object.`;

    const parts: any[] = [
        { text: systemPrompt },
        {
            inline_data: {
                mime_type: mimeType,
                data: base64Data,
            }
        }
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`;

    const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.2,
            },
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('[EvaluateArtifact] Gemini error:', res.status, errorText);
        throw new Error(`Failed to evaluate artifact with AI: ${res.statusText}`);
    }

    const data: any = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) {
        throw new Error('No response from AI.');
    }

    try {
        const result = JSON.parse(raw);
        return {
            status: 'draft',
            score: typeof result.score === 'number' ? result.score : 0,
            feedback: result.feedback || 'Artifact reviewed.',
            areas_to_improve: result.areas_to_improve || 'Keep up the good work!',
        };
    } catch (e) {
        console.error('[EvaluateArtifact] Failed to parse JSON response:', raw);
        throw new Error('AI returned an invalid response format.');
    }
}
