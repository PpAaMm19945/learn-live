import type { Env } from '../../index';
import { type AdaptedContent } from './adapt';
import { getCachedAdaptation } from './cache';

export async function serveAdaptedContent(env: Env, lessonId: string, band: number): Promise<AdaptedContent> {
    // 1. Check cache first (which includes D1 Adapted_Content pre-generated items)
    const cached = await getCachedAdaptation(env, lessonId, band);
    if (cached) {
        return {
            ...cached,
            pre_generated: true,
            fallback: false
        };
    }

    // 2. If miss, we do not call AI to ensure zero latency.
    // We return the master text (band 5) as a fallback.
    const lesson = await env.DB.prepare(
        'SELECT title, narrative_text FROM Lessons WHERE id = ?'
    ).bind(lessonId).first<{ title: string; narrative_text: string }>();

    if (!lesson || !lesson.narrative_text) {
        throw new Error(`Lesson ${lessonId} not found or has no narrative text`);
    }

    // Return master text with a fallback flag
    return {
        text: lesson.narrative_text,
        pre_generated: false,
        fallback: true
    };
}
