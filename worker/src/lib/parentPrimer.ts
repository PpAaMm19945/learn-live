/**
 * Parent Primers — Task 10.9
 * For Band 3+ tasks, parents may need a brief concept orientation
 * explaining the math/science before they can effectively guide and judge.
 *
 * Primers are short, jargon-free, and focus on:
 *   1. What the concept IS (in everyday language)
 *   2. What success LOOKS like (observable behavior)
 *   3. Common mistakes to watch for
 *   4. A quick example the parent can try themselves
 */

export interface ParentPrimer {
  conceptName: string;
  whatItIs: string;
  whatSuccessLooksLike: string;
  commonMistakes: string;
  tryItYourself: string;
}

/**
 * Generate a parent primer using Gemini for a given capacity and cognitive level.
 * Falls back to a static template if AI is unavailable.
 */
export async function generateParentPrimer(
  geminiApiKey: string | undefined,
  capacityName: string,
  taskType: string,
  successCondition: string,
  cognitiveLevel: number,
  bandId: string,
): Promise<ParentPrimer> {
  // Only generate primers for Band 3+
  const bandNum = parseInt(bandId.replace('Band_', ''), 10);
  if (bandNum < 3) {
    return getStaticPrimer(capacityName, taskType, successCondition);
  }

  if (!geminiApiKey) {
    return getStaticPrimer(capacityName, taskType, successCondition);
  }

  const levelName = ['Encounter', 'Execute', 'Discern', 'Own'][cognitiveLevel - 1] || 'Execute';

  const prompt = `You are helping a Ugandan parent understand a math/science concept so they can guide their child.
Write a brief parent primer for: "${capacityName}" at the "${levelName}" level.
The task type is: "${taskType}"
Success looks like: "${successCondition}"

Return JSON with exactly these fields:
- "conceptName": the concept in simple words (max 5 words)
- "whatItIs": 2 sentences max, plain language, no jargon
- "whatSuccessLooksLike": what the parent should observe (1-2 sentences)  
- "commonMistakes": what to watch for (1-2 sentences)
- "tryItYourself": a 1-sentence quick exercise the parent can do to understand the concept

Keep it warm, encouraging, and accessible. Assume the parent has basic literacy but may not have studied this topic formally.`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiApiKey}`;
    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!res.ok) {
      console.warn('[ParentPrimer] Gemini unavailable, using static fallback');
      return getStaticPrimer(capacityName, taskType, successCondition);
    }

    const data: any = await res.json();
    const result = JSON.parse(data.candidates[0].content.parts[0].text);
    return {
      conceptName: result.conceptName || capacityName,
      whatItIs: result.whatItIs || '',
      whatSuccessLooksLike: result.whatSuccessLooksLike || successCondition,
      commonMistakes: result.commonMistakes || '',
      tryItYourself: result.tryItYourself || '',
    };
  } catch (error) {
    console.error('[ParentPrimer] Error generating primer:', error);
    return getStaticPrimer(capacityName, taskType, successCondition);
  }
}

/** Static fallback primer when AI is unavailable */
function getStaticPrimer(capacityName: string, taskType: string, successCondition: string): ParentPrimer {
  return {
    conceptName: capacityName,
    whatItIs: `This task helps your child practice "${capacityName}" through a ${taskType.toLowerCase()} activity.`,
    whatSuccessLooksLike: successCondition,
    commonMistakes: 'Watch for guessing without thinking. Encourage your child to explain their reasoning out loud.',
    tryItYourself: `Try the task yourself first so you know what to look for when your child attempts it.`,
  };
}
