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
            // List all map assets in R2, then keep only base map PNGs
            const assetList = await env.ASSETS_BUCKET.list({ prefix: 'assets/maps/' });
            const maps: Array<{
                mapId: string;
                pngKey: string;
                hasTransform: boolean;
                hasSvg: boolean;
                overlayKey: string | null;
            }> = [];

            for (const obj of assetList.objects) {
                // Keep only base PNG map files (exclude overlays + transforms folders)
                if (!obj.key.startsWith('assets/maps/')) continue;
                if (obj.key.startsWith('assets/maps/overlays/')) continue;
                if (obj.key.startsWith('assets/maps/transforms/')) continue;
                if (!obj.key.toLowerCase().endsWith('.png')) continue;

                const filename = obj.key.split('/').pop() || '';
                const mapId = filename.replace(/\.[^.]+$/, '');
                const mapPrefix = mapId.match(/^map_\d{3}/)?.[0] || mapId;

                // Check if transform exists
                const transformHead = await env.ASSETS_BUCKET.head(`assets/maps/transforms/${mapId}.json`);

                // Resolve SVG overlay key by trying common naming variants
                const overlayCandidates = [
                    `assets/maps/overlays/${mapId}_overlay.svg`,
                    `assets/maps/overlays/${mapPrefix}_overlay.svg`,
                    `assets/maps/overlays/${mapId}.svg`,
                ];

                let overlayKey: string | null = null;
                for (const candidate of overlayCandidates) {
                    // eslint-disable-next-line no-await-in-loop
                    const svgHead = await env.ASSETS_BUCKET.head(candidate);
                    if (svgHead) {
                        overlayKey = candidate;
                        break;
                    }
                }

                maps.push({
                    mapId,
                    pngKey: obj.key,
                    hasTransform: !!transformHead,
                    hasSvg: !!overlayKey,
                    overlayKey,
                });
            }

            maps.sort((a, b) => a.mapId.localeCompare(b.mapId));

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
        const r2Key = `assets/maps/transforms/${mapId}.json`;
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

            const r2Key = `assets/maps/transforms/${mapId}.json`;
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
