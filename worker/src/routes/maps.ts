import { Env } from '../index';
import { RAGChunk, Source } from '../lib/content/retrieve';

// Dummy mapping from region/topic to map IDs to serve placeholder maps based on lesson topic
const TOPIC_TO_MAP: Record<string, string> = {
    // Topic IDs to map filenames
    'topic_ancient_egypt': 'map_002_ancient_egypt_overview',
    'topic_bantu_migration': 'map_003_bantu_migration_biblical_model',
    'topic_kush': 'map_015_meroe_red_sea_trade',
    'topic_aksum': 'map_008_aksum_red_sea_trade',
    'topic_medieval_kingdoms': 'map_027_zimbabwean_plateau',
};

export async function handleGetMapAssets(request: Request, env: Env, userId: string, lessonId: string): Promise<Response> {
    try {
        // Query the lesson to get the associated topic ID and region
        const lesson = await env.DB.prepare(`
            SELECT l.id, l.topic_id, t.title as topic_title
            FROM Lessons l
            JOIN Topics t ON l.topic_id = t.id
            WHERE l.id = ?
        `).bind(lessonId).first<{ id: string; topic_id: string; topic_title: string }>();

        if (!lesson) {
            return new Response(JSON.stringify({ error: 'Lesson not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Logic to determine map URL from R2 based on topic or lesson metadata
        // For now, we return a mock/placeholder map response aligned with the structure

        const mapId = TOPIC_TO_MAP[lesson.topic_id] || 'map_001_post_babel_dispersion';

        // This would actually be fetched from R2 (e.g., env.MAPS_BUCKET.get(...))
        // And metadata might come from a metadata.json file in R2 or D1
        const mapAssetsResponse = {
            baseMapUrl: `https://learnlive-maps-placeholder.example.com/${mapId}.png`,
            markers: [
                {
                    id: "marker_1",
                    coordinates: [30.0, 31.0],
                    label: "Key Settlement",
                    type: "settlement"
                }
            ],
            metadata: {
                era: "Various Eras",
                region: lesson.topic_title || "African Continent",
                bounds: [-20, -35, 60, 40],
                defaultCenter: [20, 0],
                defaultZoom: 4
            }
        };

        return new Response(JSON.stringify(mapAssetsResponse), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                // Add proper CORS headers if not handled globally
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('[MAP_ASSETS] Error fetching map assets:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch map assets' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
