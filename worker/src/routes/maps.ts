import { Env } from '../index';
import { getMapAssetsForLesson } from '../lib/maps/loader';

export async function handleGetLessonMapAssets(request: Request, env: Env, lessonId: string): Promise<Response> {
    try {
        // Find geographical context from Lessons/Topics tables if possible
        const { results: metaResults } = await env.DB.prepare(
            `SELECT l.id, t.era, t.region FROM Lessons l JOIN Topics t ON l.topic_id = t.id WHERE l.id = ? LIMIT 1`
        ).bind(lessonId).all();

        const metadata = { era: 'Unknown', region: 'Unknown' };
        if (metaResults && metaResults.length > 0) {
            metadata.era = metaResults[0].era as string || 'Unknown';
            metadata.region = metaResults[0].region as string || 'Unknown';
        }

        // Use loader to get the assets. The loader checks R2 logic and db for Map_Assets.
        const assets = await getMapAssetsForLesson(env.DB, env.EVIDENCE_VAULT, lessonId);

        let baseMapUrl = '/api/evidence/placeholder.png';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let markers: any[] = [];

        // Grab the first map for the overall base, if multiple exist, frontend may use the array,
        // but instructions specify returning { baseMapUrl, markers, metadata }
        if (assets && assets.length > 0) {
            baseMapUrl = assets[0].baseMapUrl || baseMapUrl;
            markers = assets[0].markers || [];
        }

        return new Response(JSON.stringify({
            baseMapUrl,
            markers,
            metadata
        }), {
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
