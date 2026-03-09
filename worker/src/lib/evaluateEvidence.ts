/**
 * Async Evidence Evaluation Engine
 * Receives a photo (base64) + audio transcript (base64) from the parent,
 * calls Gemini Vision to analyze against the task's success/failure conditions,
 * and returns a structured evidence report.
 *
 * This is the PRIMARY AI witness mode — lower bandwidth, lower cost,
 * and more reliable than live streaming.
 */

export interface EvidenceEvaluation {
    status: 'success' | 'needs_revision' | 'inconclusive';
    confidence: number; // 0-1
    observations: string;
    reasoning_quality: string;
    suggested_revision?: string;
    evidence_summary: string;
}

export async function evaluateEvidence(
    geminiApiKey: string,
    templateId: string,
    parentPrompt: string,
    successCondition: string,
    failureCondition: string,
    reasoningCheck: string,
    capacityName: string,
    imageBase64: string | null,
    audioTranscriptHint: string | null,
): Promise<EvidenceEvaluation> {
    const hasImage = !!imageBase64 && imageBase64.length > 100;
    const hasAudio = !!audioTranscriptHint;

    if (!hasImage && !hasAudio) {
        return {
            status: 'inconclusive',
            confidence: 0,
            observations: 'No evidence was provided for evaluation.',
            reasoning_quality: 'Unable to assess — no evidence submitted.',
            evidence_summary: 'No photo or audio was captured.',
        };
    }

    // Build multimodal prompt
    const systemPrompt = `You are an expert educational evaluator reviewing evidence of a child completing a learning task.

TASK: ${capacityName}
INSTRUCTION GIVEN: ${parentPrompt}
SUCCESS CONDITION: ${successCondition}
FAILURE CONDITION: ${failureCondition}
REASONING CHECK: ${reasoningCheck}

Your job is to analyze the submitted evidence (photo of the child's work and/or the child's spoken explanation) and determine whether the success condition was met.

Be generous but honest. A 6-9 year old child doesn't need perfect execution — look for genuine understanding.

Return a JSON object with:
- "status": "success" | "needs_revision" | "inconclusive"
- "confidence": number between 0 and 1
- "observations": what you can see in the evidence (2-3 sentences)
- "reasoning_quality": assessment of the child's explanation if audio provided (1-2 sentences)
- "suggested_revision": if needs_revision, what specific thing should be retried
- "evidence_summary": a 2-sentence summary the parent can read to understand what happened`;

    const parts: any[] = [{ text: systemPrompt }];

    // Add image if provided (strip data URL prefix)
    if (hasImage) {
        const base64Data = imageBase64!.replace(/^data:image\/[a-z]+;base64,/, '');
        const mimeType = imageBase64!.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        parts.push({
            inline_data: {
                mime_type: mimeType,
                data: base64Data,
            }
        });
    }

    // Add audio context hint if available
    if (hasAudio) {
        parts.push({
            text: `\n\nCHILD'S SPOKEN EXPLANATION (transcribed): "${audioTranscriptHint}"`
        });
    }

    try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.3,
                },
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('[EvaluateEvidence] Gemini error:', res.status, errorText);
            return getInconclusiveResult('Gemini API unavailable. Parent review required.');
        }

        const data: any = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) return getInconclusiveResult('No response from AI. Parent review required.');

        const result = JSON.parse(raw);

        return {
            status: ['success', 'needs_revision', 'inconclusive'].includes(result.status) ? result.status : 'inconclusive',
            confidence: typeof result.confidence === 'number' ? Math.min(1, Math.max(0, result.confidence)) : 0.5,
            observations: result.observations || 'Evidence analyzed.',
            reasoning_quality: result.reasoning_quality || 'Unable to assess reasoning.',
            suggested_revision: result.suggested_revision,
            evidence_summary: result.evidence_summary || 'Evidence reviewed by AI.',
        };
    } catch (error) {
        console.error('[EvaluateEvidence] Error:', error);
        return getInconclusiveResult('Evaluation failed. Please review evidence manually.');
    }
}

function getInconclusiveResult(reason: string): EvidenceEvaluation {
    return {
        status: 'inconclusive',
        confidence: 0,
        observations: reason,
        reasoning_quality: 'Unable to assess.',
        evidence_summary: reason,
    };
}
