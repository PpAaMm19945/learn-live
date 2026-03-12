import type { Env } from '../../index';
import { adaptContent, type AdaptedContent } from './adapt';
import { getCachedAdaptation, cacheAdaptation } from './cache';
import { buildRAGContext } from './retrieve';

export async function serveAdaptedContent(env: Env, lessonId: string, band: number): Promise<AdaptedContent> {
    // 1. Check cache first
    const cached = await getCachedAdaptation(env, lessonId, band);
    if (cached) {
        return cached;
    }

    // 2. Fetch lesson details
    const lesson = await env.DB.prepare(
        'SELECT title, narrative_text FROM Lessons WHERE id = ?'
    ).bind(lessonId).first<{ title: string; narrative_text: string }>();

    if (!lesson || !lesson.narrative_text) {
        throw new Error(`Lesson ${lessonId} not found or has no narrative text`);
    }

    // 3. Handle Band 5 (University Prep) - Return master text as-is
    if (band === 5) {
        const band5Content: AdaptedContent = {
            text: lesson.narrative_text
        };
        await cacheAdaptation(env, lessonId, band, band5Content);
        return band5Content;
    }

    // 4. Build RAG context using the lesson title
    const chapterContext = await buildRAGContext(env, lesson.title);

    // 5. Call AI Adaptation Engine
    const adaptedContent = await adaptContent(env, lesson.narrative_text, band, chapterContext);

    // 6. Cache and return the result
    await cacheAdaptation(env, lessonId, band, adaptedContent);
    return adaptedContent;
}
