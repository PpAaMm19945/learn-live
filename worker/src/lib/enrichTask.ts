/**
 * AI Task Enrichment Engine
 * Calls Gemini to transform raw constraint templates into rich,
 * parent-friendly curriculum briefs with multiple approaches,
 * context, and practice questions.
 * Results are cached in D1 so each template is enriched only once.
 */

export interface EnrichedTask {
    template_id: string;
    concept_context: string;
    suggested_approaches: { title: string; description: string }[];
    what_to_look_for: string;
    fun_fact: string;
    quiz_questions: { question: string; answer: string; hint?: string }[];
    child_prompt: string;
}

/**
 * Get enrichment for a template — from cache or by calling Gemini.
 */
export async function getEnrichedTask(
    db: D1Database,
    geminiApiKey: string | undefined,
    templateId: string,
    capacityName: string,
    strandName: string,
    parentPrompt: string,
    successCondition: string,
    failureCondition: string,
    reasoningCheck: string,
    taskType: string,
    cognitiveLevel: number,
    arcStage: string,
): Promise<EnrichedTask> {
    // Check cache first
    const cached: any = await db.prepare(
        'SELECT * FROM Enriched_Task_Cache WHERE template_id = ?'
    ).bind(templateId).first();

    if (cached) {
        return {
            template_id: templateId,
            concept_context: cached.concept_context,
            suggested_approaches: safeJsonParse(cached.suggested_approaches, []),
            what_to_look_for: cached.what_to_look_for,
            fun_fact: cached.fun_fact || '',
            quiz_questions: safeJsonParse(cached.quiz_questions, []),
            child_prompt: cached.child_prompt || '',
        };
    }

    // Generate with AI
    if (!geminiApiKey) {
        return getStaticEnrichment(templateId, capacityName, strandName, parentPrompt, successCondition, taskType);
    }

    const levelName = ['Encounter', 'Execute', 'Discern', 'Own'][cognitiveLevel - 1] || 'Execute';

    const prompt = `You are an expert curriculum coach helping a Ugandan homeschooling parent teach their child.

TASK DETAILS:
- Subject area: ${strandName}
- Concept: ${capacityName}
- Cognitive level: ${levelName} (${cognitiveLevel}/4)
- Arc stage: ${arcStage}
- Task type: ${taskType}
- Original instruction: "${parentPrompt}"
- Success condition: "${successCondition}"
- Failure condition: "${failureCondition}"
- Reasoning check: "${reasoningCheck}"

Generate a rich parent brief. Return JSON with these exact fields:

1. "concept_context" (2-3 sentences): Explain WHY this concept matters in everyday life. Use warm, accessible language. No jargon. Help the parent understand the bigger picture.

2. "suggested_approaches" (array of 3 objects with "title" and "description"): Three DIFFERENT ways a parent could teach this concept. Use local Ugandan context (market, kitchen, garden). Each approach should be practical and use household items. The original instruction is just ONE approach — give two more creative alternatives.

3. "what_to_look_for" (1-2 sentences): What observable behavior shows the child truly understands (not just memorized). Written warmly.

4. "fun_fact" (1 sentence): An interesting, age-appropriate fact related to this concept that makes learning exciting.

5. "quiz_questions" (array of 3-5 objects with "question", "answer", and optional "hint"): Practice questions the child can try. Use Ugandan names (Azie, Arie, Nalongo, Wasswa, Kato) and local objects (mangoes, chapatis, beans). Mix difficulty levels.

6. "child_prompt" (1-2 sentences): A clear, fun, direct instruction for the CHILD. No pedagogy, just "Here's what to do!" Make it sound like an exciting challenge or game.

Keep everything warm, encouraging, culturally relevant, and accessible.`;

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
            console.warn('[EnrichTask] Gemini unavailable, using static fallback');
            return getStaticEnrichment(templateId, capacityName, strandName, parentPrompt, successCondition, taskType);
        }

        const data: any = await res.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);

        const enriched: EnrichedTask = {
            template_id: templateId,
            concept_context: result.concept_context || '',
            suggested_approaches: result.suggested_approaches || [],
            what_to_look_for: result.what_to_look_for || successCondition,
            fun_fact: result.fun_fact || '',
            quiz_questions: result.quiz_questions || [],
            child_prompt: result.child_prompt || parentPrompt,
        };

        // Cache in D1
        await db.prepare(`
            INSERT OR REPLACE INTO Enriched_Task_Cache 
            (template_id, concept_context, suggested_approaches, what_to_look_for, fun_fact, quiz_questions, child_prompt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            templateId,
            enriched.concept_context,
            JSON.stringify(enriched.suggested_approaches),
            enriched.what_to_look_for,
            enriched.fun_fact,
            JSON.stringify(enriched.quiz_questions),
            enriched.child_prompt,
        ).run();

        return enriched;
    } catch (error) {
        console.error('[EnrichTask] Error:', error);
        return getStaticEnrichment(templateId, capacityName, strandName, parentPrompt, successCondition, taskType);
    }
}

function getStaticEnrichment(
    templateId: string,
    capacityName: string,
    strandName: string,
    parentPrompt: string,
    successCondition: string,
    taskType: string,
): EnrichedTask {
    return {
        template_id: templateId,
        concept_context: `This ${strandName.toLowerCase()} activity helps your child build "${capacityName}" — a key skill for their development. Take your time and enjoy learning together!`,
        suggested_approaches: [
            { title: 'As Written', description: parentPrompt },
            { title: 'Kitchen Version', description: `Try this same concept using items from your kitchen — spoons, cups, or plates work well.` },
            { title: 'Outdoor Version', description: `Take this activity outside! Use stones, sticks, or leaves from the compound.` },
        ],
        what_to_look_for: successCondition,
        fun_fact: `Learning "${capacityName}" helps children think like scientists and problem-solvers!`,
        quiz_questions: [],
        child_prompt: parentPrompt,
    };
}

function safeJsonParse(str: string | null, fallback: any): any {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}
