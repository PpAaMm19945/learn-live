import type { Env } from '../../index';
import { getSessionToken } from './cookies';
import { verifyToken } from './jwt';

export interface AuthUser {
    userId: string;
    email: string;
}

/**
 * Extracts and verifies session from request cookies.
 * Returns user info or null.
 */
export async function authenticateRequest(
    request: Request,
    env: Env
): Promise<AuthUser | null> {
    const token = getSessionToken(request);
    if (!token) return null;

    const payload = await verifyToken(token, env.JWT_SECRET);
    if (!payload) return null;

    return { userId: payload.sub, email: payload.email };
}

/**
 * Guard for protected routes. Returns a 401 Response if unauthenticated,
 * or the authenticated user info to proceed.
 */
export async function requireAuth(
    request: Request,
    env: Env
): Promise<Response | AuthUser> {
    const serviceKey = request.headers.get('X-Service-Key');

    // Auth Diagnostic
    const hasServiceKey = !!serviceKey;
    const hasEnvKey = !!env.AGENT_SERVICE_KEY;
    const matches = serviceKey === env.AGENT_SERVICE_KEY;
    if (hasServiceKey || hasEnvKey) {
        console.log(`[AUTH DIAGNOSTIC] X-Service-Key provided: ${hasServiceKey}, env.AGENT_SERVICE_KEY exists: ${hasEnvKey}, match: ${matches}`);
    }

    if (serviceKey && env.AGENT_SERVICE_KEY && serviceKey === env.AGENT_SERVICE_KEY) {
        return { userId: 'service-agent', email: 'agent@system' };
    }

    if (serviceKey && (!env.AGENT_SERVICE_KEY || serviceKey !== env.AGENT_SERVICE_KEY)) {
        return new Response(JSON.stringify({ error: 'Unauthorized', code: 'SERVICE_KEY_MISMATCH' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const user = await authenticateRequest(request, env);
    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized', code: 'MISSING_USER_SESSION' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    return user;
}
