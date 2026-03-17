import { Env } from '../index';
import { r2Helper } from '../lib/r2';

export async function handleGetAsset(request: Request, env: Env, key: string): Promise<Response> {
    const file = await r2Helper.getFile(env.ASSETS_BUCKET, key);
    if (!file) {
        return new Response('Asset not found', { status: 404 });
    }

    const headers = new Headers();
    if (file.httpMetadata?.contentType) {
        headers.set('Content-Type', file.httpMetadata.contentType);
    }

    // Default caching for assets
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(file.body, { headers });
}

export async function handleGetEvidence(request: Request, env: Env, key: string): Promise<Response> {
    const file = await r2Helper.getFile(env.EVIDENCE_VAULT, key);
    if (!file) {
        return new Response('Evidence not found', { status: 404 });
    }

    const headers = new Headers();
    if (file.httpMetadata?.contentType) {
        headers.set('Content-Type', file.httpMetadata.contentType);
    }

    return new Response(file.body, { headers });
}
