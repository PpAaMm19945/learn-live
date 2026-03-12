import { Env } from '../index';
import { getMapAssetsForLesson } from '../lib/maps/loader';

export async function handleGetLessonMapAssets(request: Request, env: Env, lessonId: string): Promise<Response> {
    try {
        const assets = await getMapAssetsForLesson(env.DB, env.EVIDENCE_VAULT, lessonId);

        return new Response(JSON.stringify(assets), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(`[Error fetching map assets for lesson ${lessonId}]:`, error);
        return new Response(JSON.stringify({ error: 'Failed to fetch map assets' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
