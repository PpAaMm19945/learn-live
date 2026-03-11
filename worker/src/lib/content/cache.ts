import type { Env } from '../../index';
import type { AdaptedContent } from './adapt';

export async function getCachedAdaptation(env: Env, lessonId: string, band: number): Promise<AdaptedContent | null> {
    try {
        const result = await env.DB.prepare(
            `SELECT content FROM Adapted_Content_Cache WHERE lesson_id = ? AND band = ?`
        ).bind(lessonId, band).first<{ content: string }>();

        if (result && result.content) {
            return JSON.parse(result.content) as AdaptedContent;
        }
        return null;
    } catch (error) {
        console.error('[CACHE] Failed to get cached adaptation:', error);
        return null;
    }
}

export async function cacheAdaptation(env: Env, lessonId: string, band: number, content: AdaptedContent): Promise<void> {
    try {
        const contentStr = JSON.stringify(content);

        await env.DB.prepare(`
            INSERT INTO Adapted_Content_Cache (lesson_id, band, content, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(lesson_id, band) DO UPDATE SET
                content = excluded.content,
                updated_at = excluded.updated_at
        `).bind(lessonId, band, contentStr).run();

    } catch (error) {
        console.error('[CACHE] Failed to cache adaptation:', error);
    }
}
