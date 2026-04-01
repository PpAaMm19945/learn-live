import { Env } from '../index';

export async function handleSaveGoldenScript(request: Request, env: Env): Promise<Response> {
    try {
        const body: any = await request.json();

        if (!body || body.version !== '1.0' || !body.chapterId || body.band === undefined) {
            return new Response(JSON.stringify({ error: 'Invalid GoldenScript format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const chapterId = body.chapterId;
        const band = body.band;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const key = `golden-scripts/${chapterId}/band${band}/${timestamp}.json`;

        await env.ASSETS_BUCKET.put(key, JSON.stringify(body), {
            httpMetadata: { contentType: 'application/json' },
        });

        return new Response(JSON.stringify({ key }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to save golden script', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function handleGetGoldenScript(request: Request, env: Env, chapterId: string, band: string): Promise<Response> {
    try {
        const prefix = `golden-scripts/${chapterId}/band${band}/`;

        // List objects with the specific prefix
        const listed = await env.ASSETS_BUCKET.list({ prefix });

        if (listed.objects.length === 0) {
            return new Response(JSON.stringify({ error: 'Golden script not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Sort by key descending to get the most recent one (since timestamp is in the key)
        const latestKey = listed.objects.sort((a, b) => b.key.localeCompare(a.key))[0].key;

        const object = await env.ASSETS_BUCKET.get(latestKey);

        if (!object) {
            return new Response(JSON.stringify({ error: 'Golden script not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const bodyText = await object.text();
        return new Response(bodyText, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch golden script', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
