/**
 * Split Judgment Engine — Task 10.8
 * For Band 4–5 learners, judgment is split:
 *   - AI evaluates mathematical/academic competence (did they get it right?)
 *   - Parent evaluates formation (effort, character, willingness to revise)
 *
 * Band 0–3: Parent holds full judgment authority (no split).
 * Band 4–5: AI competence check runs first, then parent confirms formation.
 */

export interface SplitJudgmentResult {
  mode: 'full_parent' | 'split';
  aiCompetenceVerdict?: 'pass' | 'fail' | null;
  aiConfidence?: number;
  aiSummary?: string;
  requiresParentFormation: boolean;
}

/** Determine if this learner's band requires split judgment */
export function getSplitJudgmentMode(bandId: string): 'full_parent' | 'split' {
  const bandNum = parseInt(bandId.replace('Band_', ''), 10);
  return bandNum >= 4 ? 'split' : 'full_parent';
}

/**
 * Run AI competence evaluation for split judgment.
 * Uses Gemini to assess whether the learner's work meets the success condition.
 */
export async function evaluateCompetence(
  geminiApiKey: string,
  successCondition: string,
  failureCondition: string,
  reasoningCheck: string,
  evidenceDescription: string,
  imageBase64?: string | null,
): Promise<{ verdict: 'pass' | 'fail'; confidence: number; summary: string }> {
  const prompt = `You are an objective academic assessor. Evaluate ONLY the academic competence demonstrated.
Do NOT evaluate character, effort, or attitude — only whether the work meets the success condition.

Success Condition: ${successCondition}
Failure Condition: ${failureCondition}
Reasoning Check: ${reasoningCheck}

Evidence/observation: ${evidenceDescription}

Return JSON with:
- "verdict": "pass" or "fail" (strictly academic — did they demonstrate the skill?)
- "confidence": a number 0.0-1.0
- "summary": one sentence explaining your academic assessment`;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    const match = imageBase64.match(/^data:(.*?);base64,(.*)$/);
    if (match) {
      parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    console.error('[SplitJudgment] Gemini API error:', await res.text());
    return { verdict: 'fail', confidence: 0, summary: 'AI evaluation unavailable — defaulting to parent judgment.' };
  }

  const data: any = await res.json();
  try {
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return {
      verdict: result.verdict === 'pass' ? 'pass' : 'fail',
      confidence: Math.min(1, Math.max(0, result.confidence || 0)),
      summary: result.summary || '',
    };
  } catch {
    return { verdict: 'fail', confidence: 0, summary: 'Failed to parse AI response.' };
  }
}
