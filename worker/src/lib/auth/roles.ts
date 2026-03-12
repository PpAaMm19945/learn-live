import type { Env } from '../../index';
import { requireAuth, AuthUser } from './middleware';

/**
 * Checks if a given user has the 'admin' role.
 * Uses security definer pattern to safely query User_Roles without RLS issues.
 */
export async function isAdmin(env: Env, userId: string): Promise<boolean> {
    const { results } = await env.DB.prepare(
        'SELECT role FROM User_Roles WHERE user_id = ? AND role = ?'
    )
        .bind(userId, 'admin')
        .all<{ role: string }>();

    return results.length > 0;
}

/**
 * Middleware wrapper that enforces both authentication and the admin role.
 * Returns either an AuthUser object or a 401/403 Response.
 */
export async function requireAdmin(
    request: Request,
    env: Env
): Promise<Response | AuthUser> {
    const authResult = await requireAuth(request, env);
    if (authResult instanceof Response) return authResult; // 401 Unauthorized

    const userIsAdmin = await isAdmin(env, authResult.userId);
    if (!userIsAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return authResult;
}
