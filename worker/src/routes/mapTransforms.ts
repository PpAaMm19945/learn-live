import type { Env } from '../index';
import { addCors } from '../index';
import { requireAdmin } from '../lib/auth/roles';

/**
 * Admin-only map transform routes.
 * Saves and retrieves SVG alignment transforms from R2.
 */
export async function handleMapTransformRoutes(
    request: Request,
    env: Env,
    corsHeaders: Record<string, string>
): Promise<Response | null> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (!path.startsWith('/api/admin/maps')) return null;

    // Require admin for all map routes
    const authResult = await requireAdmin(request, env);
    if (authResult instanceof Response) return addCors(authResult, corsHeaders);

    // -------------------------------------------------------
    // GET /api/admin/maps — List all maps with alignment status
    // -------------------------------------------------------
    if (path === '/api/admin/maps' && method === 'GET') {
        try {
            // List all map PNGs in R2
            const pngList = await env.ASSETS_BUCKET.list({ prefix: 'maps/png/' });
            const maps: Array<{
                mapId: string;
                pngKey: string;
                hasTransform: boolean;
                hasSvg: boolean;
            }> = [];

            for (const obj of pngList.objects) {
                // Extract mapId from key: maps/png/map_001.png → map_001
                const filename = obj.key.split('/').pop() || '';
                const mapId = filename.replace(/\.[^.]+$/, '');

                // Check if transform and SVG exist
                const transformHead = await env.ASSETS_BUCKET.head(`maps/transforms/${mapId}.json`);
                const svgHead = await env.ASSETS_BUCKET.head(`maps/svg/${mapId}.svg`);

                maps.push({
                    mapId,
                    pngKey: obj.key,
                    hasTransform: !!transformHead,
                    hasSvg: !!svgHead,
                });
            }

            return addCors(new Response(JSON.stringify({ maps }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        } catch (e: any) {
            console.error('[Map List Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }
    }

    // -------------------------------------------------------
    // GET /api/admin/maps/:mapId/transform — Get transform for a map
    // -------------------------------------------------------
    const getTransformMatch = path.match(/^\/api\/admin\/maps\/([^/]+)\/transform$/);
    if (getTransformMatch && method === 'GET') {
        const mapId = getTransformMatch[1];
        const r2Key = `maps/transforms/${mapId}.json`;
        const obj = await env.ASSETS_BUCKET.get(r2Key);

        if (!obj) {
            return addCors(new Response(JSON.stringify({
                mapId,
                transform: {
                    translateX: 0,
                    translateY: 0,
                    scaleX: 1,
                    scaleY: 1,
                    rotate: 0,
                },
                saved: false,
            }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }

        const transform = await obj.json();
        return addCors(new Response(JSON.stringify({
            mapId,
            transform,
            saved: true,
        }), {
            headers: { 'Content-Type': 'application/json' }
        }), corsHeaders);
    }

    // -------------------------------------------------------
    // PUT /api/admin/maps/:mapId/transform — Save transform for a map
    // Body: { translateX, translateY, scaleX, scaleY, rotate }
    // -------------------------------------------------------
    const putTransformMatch = path.match(/^\/api\/admin\/maps\/([^/]+)\/transform$/);
    if (putTransformMatch && method === 'PUT') {
        const mapId = putTransformMatch[1];

        try {
            const body = await request.json() as {
                translateX: number;
                translateY: number;
                scaleX: number;
                scaleY: number;
                rotate: number;
            };

            const transform = {
                translateX: body.translateX || 0,
                translateY: body.translateY || 0,
                scaleX: body.scaleX || 1,
                scaleY: body.scaleY || 1,
                rotate: body.rotate || 0,
                alignedAt: new Date().toISOString(),
            };

            const r2Key = `maps/transforms/${mapId}.json`;
            await env.ASSETS_BUCKET.put(r2Key, JSON.stringify(transform, null, 2), {
                httpMetadata: { contentType: 'application/json' },
            });

            return addCors(new Response(JSON.stringify({
                success: true,
                mapId,
                transform,
            }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        } catch (e: any) {
            console.error('[Map Transform Save Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }
    }

    return null;
}
