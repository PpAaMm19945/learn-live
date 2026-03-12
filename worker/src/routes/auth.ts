import { Env } from '../index';
import { authenticateRequest, requireAuth } from '../lib/auth/middleware';
import { handleMagicLinkRequest, handleMagicLinkVerify } from '../lib/auth/magicLink';
import { handleGoogleAuth, handleGoogleCallback } from '../lib/auth/google';
import { handleRegister, handleLogin, handleForgotPassword, handleResetPassword, handleVerifyEmail, hashPassword } from '../lib/auth/password';
import { clearSessionCookie } from '../lib/auth/cookies';

function addCors(response: Response, corsHeaders: Record<string, string>): Response {
    const newResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(corsHeaders)) {
        newResponse.headers.set(key, value);
    }
    return newResponse;
}

export async function handleAuthRoutes(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response | null> {
    const url = new URL(request.url);

    if (url.pathname === '/api/auth/me' && request.method === 'GET') {
        const user = await authenticateRequest(request, env);
        if (!user) {
            return addCors(new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        }
        // Fetch roles and user info
        const dbUser = await env.DB.prepare('SELECT id, email, name, email_verified FROM Users WHERE id = ?')
            .bind(user.userId).first<{ id: string; email: string; name: string | null; email_verified: number }>();
        const { results: roleRows } = await env.DB.prepare('SELECT role FROM User_Roles WHERE user_id = ?')
            .bind(user.userId).all<{ role: string }>();
        const roles = roleRows.map((r: any) => r.role);

        return addCors(new Response(JSON.stringify({
            userId: dbUser?.id || user.userId,
            email: dbUser?.email || user.email,
            name: dbUser?.name || null,
            roles,
            emailVerified: dbUser?.email_verified === 1,
        }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        }), corsHeaders);
    }

    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
        const response = clearSessionCookie(
            new Response(JSON.stringify({ success: true }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            })
        );
        return addCors(response, corsHeaders);
    }

    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        return addCors(await handleLogin(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        return addCors(await handleRegister(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/forgot-password' && request.method === 'POST') {
        return addCors(await handleForgotPassword(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/reset-password' && request.method === 'POST') {
        return addCors(await handleResetPassword(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/verify-email' && request.method === 'GET') {
        return addCors(await handleVerifyEmail(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/magic-link' && request.method === 'POST') {
        return addCors(await handleMagicLinkRequest(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/magic-link/verify' && request.method === 'GET') {
        return addCors(await handleMagicLinkVerify(request, env), corsHeaders);
    }
    if (url.pathname === '/api/auth/google' && request.method === 'GET') {
        return await handleGoogleAuth(request, env);
    }
    if (url.pathname === '/api/auth/google/callback' && request.method === 'GET') {
        return await handleGoogleCallback(request, env);
    }

    // POST /api/auth/set-password — add password to OAuth/magic-link account
    if (url.pathname === '/api/auth/set-password' && request.method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        try {
            const body: any = await request.json();
            if (!body.password || body.password.length < 8) {
                return addCors(new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400 }), corsHeaders);
            }
            const hash = await hashPassword(body.password);
            await env.DB.prepare('UPDATE Users SET password_hash = ? WHERE id = ?')
                .bind(hash, authResult.userId).run();
            return addCors(new Response(JSON.stringify({ success: true }), { status: 200 }), corsHeaders);
        } catch (e: any) {
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    return null;
}
