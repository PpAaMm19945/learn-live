import { Env } from '../index';
import { requireAuth } from '../lib/auth/middleware';
import { handleGetAdaptedContent, handleGetChapterContent } from './content';
import { handleUploadArtifact, handleVerifyArtifact, handleListArtifacts } from './artifacts';

/**
 * Central Route Registry
 * This pattern replaces the large switch statement in index.ts.
 * Future routes should be added here, mapped to handlers in separate files.
 * Note: Legacy routes in index.ts will be migrated here over time.
 */

export async function routeRequest(request: Request, env: Env): Promise<Response | null> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // --- Content Routes ---

    // GET /api/lessons/:lessonId/content
    if (path.match(/^\/api\/lessons\/[^/]+\/content$/) && method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return authResult; // Returns 401 response if unauthenticated
        return handleGetAdaptedContent(request, env, authResult.userId);
    }

    // GET /api/chapters/:chapterId/content
    if (path.match(/^\/api\/chapters\/[^/]+\/content$/) && method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return authResult;
        return handleGetChapterContent(request, env, authResult.userId);
    }

    // --- Artifact Routes ---

    // POST /api/artifacts/upload
    if (path === '/api/artifacts/upload' && method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return authResult;
        return handleUploadArtifact(request, env);
    }

    // POST /api/artifacts/verify
    if (path === '/api/artifacts/verify' && method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return authResult;
        return handleVerifyArtifact(request, env, authResult.userId);
    }

    // GET /api/artifacts
    if (path === '/api/artifacts' && method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return authResult;
        return handleListArtifacts(request, env, authResult.userId);
    }

    // Return null if no route matches, allowing legacy index.ts switch to handle it
    return null;
}