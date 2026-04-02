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
            'SELECT l.title, l.narrative_text, t.title as topic FROM Lessons l LEFT JOIN Topics t ON l.topic_id = t.id WHERE l.id = ?'
        ).bind(lessonId).first<any>();

        if (!lesson) {
            return new Response(JSON.stringify({ error: 'Lesson not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const adaptedContent = await env.DB.prepare(
            'SELECT * FROM Adapted_Content WHERE lesson_id = ? AND band = ?'
        ).bind(lessonId, band).first<any>();

        // We return null for content if not found, allowing client to gracefully handle missing adaptation
        let parsedContent = adaptedContent ? {
            ...adaptedContent,
            vocabulary: adaptedContent.vocabulary ? JSON.parse(adaptedContent.vocabulary) : [],
            discussion_questions: adaptedContent.discussion_questions ? JSON.parse(adaptedContent.discussion_questions) : [],
            thinking_prompts: adaptedContent.thinking_prompts ? JSON.parse(adaptedContent.thinking_prompts) : [],
            fallback: false
        } : null;

        // Fallback to master text if no adapted content is found
        if (!parsedContent) {
            parsedContent = {
                id: null,
                lesson_id: lessonId,
                band: band,
                adapted_text: lesson.narrative_text || '',
                vocabulary: [],
                discussion_questions: [],
                thinking_prompts: [],
                essay_prompt: null,
                fallback: true
            };
        }

        logActivity(env, userId, 'content_viewed', 'lesson', lessonId);

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
    // Normalize: frontend sends "ch01", DB stores "topic_ch01"
    const topicId = chapterId.startsWith('topic_') ? chapterId : `topic_${chapterId}`;

    let band = 5;
    const bandParam = url.searchParams.get('band');
    if (bandParam) {
        const parsedBand = parseInt(bandParam, 10);
        if (!isNaN(parsedBand)) {
            band = Math.max(0, Math.min(5, parsedBand));
        }
    }

    try {
        const topic = await env.DB.prepare('SELECT id, title FROM Topics WHERE id = ?').bind(topicId).first<any>();
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

            // If cache miss, fallback to master text
            if (!adaptedContent) {
                console.log(`[API] Cache miss for lesson ${lesson.id} band ${band}. Falling back to master text.`);

                adaptedContent = {
                    adapted_text: lesson.narrative_text || '',
                    vocabulary: JSON.stringify([]),
                    discussion_questions: JSON.stringify([]),
                    thinking_prompts: JSON.stringify([]),
                    fallback: true
                };
            }

            return {
                lessonId: lesson.id,
                title: lesson.title,
                adaptedContent: adaptedContent ? adaptedContent.adapted_text : null,
                vocabularyWords: adaptedContent && adaptedContent.vocabulary ? JSON.parse(adaptedContent.vocabulary) : [],
                discussionQuestions: adaptedContent && adaptedContent.discussion_questions ? JSON.parse(adaptedContent.discussion_questions) : [],
                fallback: adaptedContent.fallback || false
            };
        }));

        logActivity(env, userId, 'content_viewed', 'chapter', chapterId);

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