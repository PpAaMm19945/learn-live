import type { Env } from '../../index';
import type { AdaptedContent } from './adapt';

export async function getCachedAdaptation(env: Env, lessonId: string, band: number): Promise<AdaptedContent | null> {
    try {
        const result = await env.DB.prepare(
            `SELECT adapted_text, vocabulary, discussion_questions, essay_prompt, thinking_prompts FROM Adapted_Content WHERE lesson_id = ? AND band = ?`
        ).bind(lessonId, band).first<any>();

        if (result) {
            return {
                text: result.adapted_text,
                vocabulary: result.vocabulary ? JSON.parse(result.vocabulary) : undefined,
                discussionQuestions: result.discussion_questions ? JSON.parse(result.discussion_questions) : undefined,
                essayPrompt: result.essay_prompt || undefined,
                thinkingPrompts: result.thinking_prompts ? JSON.parse(result.thinking_prompts) : undefined
            } as AdaptedContent;
        }
        return null;
    } catch (error) {
        console.error('[CACHE] Failed to get cached adaptation:', error);
        return null;
    }
}
