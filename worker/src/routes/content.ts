import { Env } from '../index';
import { logActivity } from '../lib/analytics/logger';

export async function handleGetAdaptedContent(request: Request, env: Env, userId: string): Promise<Response> {
    const url = new URL(request.url);
    const lessonIdMatch = url.pathname.match(/^\/api\/lessons\/([^/]+)\/content$/);

    if (!lessonIdMatch) {
         return new Response(JSON.stringify({ error: 'Invalid route' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const lessonId = lessonIdMatch[1];

    // Parse band parameter, default to 5, clamp 0-5
    let band = 5;
    const bandParam = url.searchParams.get('band');
    if (bandParam) {
        const parsedBand = parseInt(bandParam, 10);
        if (!isNaN(parsedBand)) {
            band = Math.max(0, Math.min(5, parsedBand));
        }
    }

    try {
        const lesson = await env.DB.prepare(
            'SELECT l.title, t.title as topic FROM Lessons l LEFT JOIN Topics t ON l.topic_id = t.id WHERE l.id = ?'
        ).bind(lessonId).first<any>();

        if (!lesson) {
            return new Response(JSON.stringify({ error: 'Lesson not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const adaptedContent = await env.DB.prepare(
            'SELECT * FROM Adapted_Content WHERE lesson_id = ? AND band = ?'
        ).bind(lessonId, band).first<any>();

        // We return null for content if not found, allowing client to gracefully handle missing adaptation
        const parsedContent = adaptedContent ? {
            ...adaptedContent,
            vocabulary: adaptedContent.vocabulary ? JSON.parse(adaptedContent.vocabulary) : [],
            discussion_questions: adaptedContent.discussion_questions ? JSON.parse(adaptedContent.discussion_questions) : [],
            thinking_prompts: adaptedContent.thinking_prompts ? JSON.parse(adaptedContent.thinking_prompts) : []
        } : null;

        return new Response(JSON.stringify({
            lesson: {
                title: lesson.title,
                topic: lesson.topic || ''
            },
            content: parsedContent,
            band
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] Adapted content fetch error:', e);
        return new Response(JSON.stringify({ error: 'Failed to fetch content', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

import { adaptContent } from '../lib/content/adapt';

export async function handleGetChapterContent(request: Request, env: Env, userId: string): Promise<Response> {
    const url = new URL(request.url);
    const chapterIdMatch = url.pathname.match(/^\/api\/chapters\/([^/]+)\/content$/);

    if (!chapterIdMatch) {
         return new Response(JSON.stringify({ error: 'Invalid route' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const chapterId = chapterIdMatch[1];

    let band = 5;
    const bandParam = url.searchParams.get('band');
    if (bandParam) {
        const parsedBand = parseInt(bandParam, 10);
        if (!isNaN(parsedBand)) {
            band = Math.max(0, Math.min(5, parsedBand));
        }
    }

    try {
        const topic = await env.DB.prepare('SELECT id, title FROM Topics WHERE id = ?').bind(chapterId).first<any>();
        if (!topic) {
             return new Response(JSON.stringify({ error: 'Chapter not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const { results: lessons } = await env.DB.prepare(
            'SELECT id, title, difficulty_band, narrative_text FROM Lessons WHERE topic_id = ? ORDER BY difficulty_band ASC'
        ).bind(chapterId).all();

        if (lessons.length === 0) {
            return new Response(JSON.stringify({
                chapterId,
                band,
                title: topic.title,
                sections: []
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const lessonIds = lessons.map(l => l.id as string);
        const placeholders = lessonIds.map(() => '?').join(',');

        // Query adapted content for all lessons in the chapter in one go
        const { results: adaptedContents } = await env.DB.prepare(
            `SELECT * FROM Adapted_Content WHERE lesson_id IN (${placeholders}) AND band = ?`
        ).bind(...lessonIds, band).all();

        // Create a map for quick lookup
        const adaptedMap = new Map();
        for (const content of adaptedContents) {
            adaptedMap.set((content as any).lesson_id, content);
        }

        const sections = await Promise.all(lessons.map(async (lesson: any) => {
            let adaptedContent: any = adaptedMap.get(lesson.id);

            // If cache miss, fetch RAG chunks and adapt
            if (!adaptedContent) {
                console.log(`[API] Cache miss for lesson ${lesson.id} band ${band}. Adapting...`);

                // Fetch RAG chunks for this lesson
                const { results: chunks } = await env.DB.prepare(`
                    SELECT rc.chunk_text
                    FROM RAG_Chunks rc
                    JOIN Sources s ON rc.source_id = s.id
                    WHERE s.lesson_id = ?
                    ORDER BY rc.chunk_index ASC
                `).bind(lesson.id).all<any>();

                const ragContext = chunks.map((c: any) => c.chunk_text).join('\n\n');

                // Construct the text to adapt based on narrative text and RAG chunks
                const chunkText = lesson.narrative_text ? `${lesson.narrative_text}\n\n${ragContext}` : ragContext || "No text provided.";

                try {
                    const newlyAdapted = await adaptContent(env, chunkText, band, "");

                    // Cache the result
                    const id = `adapt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                    await env.DB.prepare(`
                        INSERT INTO Adapted_Content (id, lesson_id, band, adapted_text, vocabulary, discussion_questions, essay_prompt, thinking_prompts)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(lesson_id, band) DO UPDATE SET
                            adapted_text = excluded.adapted_text,
                            vocabulary = excluded.vocabulary,
                            discussion_questions = excluded.discussion_questions,
                            essay_prompt = excluded.essay_prompt,
                            thinking_prompts = excluded.thinking_prompts
                    `).bind(
                        id,
                        lesson.id,
                        band,
                        newlyAdapted.text,
                        newlyAdapted.vocabulary ? JSON.stringify(newlyAdapted.vocabulary) : null,
                        newlyAdapted.discussionQuestions ? JSON.stringify(newlyAdapted.discussionQuestions) : null,
                        newlyAdapted.essayPrompt || null,
                        newlyAdapted.thinkingPrompts ? JSON.stringify(newlyAdapted.thinkingPrompts) : null
                    ).run();

                    // Format it to match the standard response structure
                    adaptedContent = {
                        adapted_text: newlyAdapted.text,
                        vocabulary: newlyAdapted.vocabulary ? JSON.stringify(newlyAdapted.vocabulary) : null,
                        discussion_questions: newlyAdapted.discussionQuestions ? JSON.stringify(newlyAdapted.discussionQuestions) : null,
                        thinking_prompts: newlyAdapted.thinkingPrompts ? JSON.stringify(newlyAdapted.thinkingPrompts) : null
                    };
                } catch (adaptError) {
                    console.error(`[API] Adaptation failed for lesson ${lesson.id}:`, adaptError);
                    // Fallback to unadapted or empty
                    adaptedContent = null;
                }
            }

            return {
                lessonId: lesson.id,
                title: lesson.title,
                adaptedContent: adaptedContent ? adaptedContent.adapted_text : null,
                vocabularyWords: adaptedContent && adaptedContent.vocabulary ? JSON.parse(adaptedContent.vocabulary) : [],
                discussionQuestions: adaptedContent && adaptedContent.discussion_questions ? JSON.parse(adaptedContent.discussion_questions) : [],
            };
        }));

        return new Response(JSON.stringify({
            chapterId,
            band,
            title: topic.title,
            sections
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
         console.error('[API] Chapter content fetch error:', e);
         return new Response(JSON.stringify({ error: 'Failed to fetch chapter content', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}