import { Env } from '../../index';
import { signToken } from './jwt';
import { setSessionCookie } from './cookies';
import { findOrCreateUser } from './accountLink';

export function generateMagicLinkToken(): string {
    return crypto.randomUUID();
}

export async function sendMagicLinkEmail(email: string, token: string, env: Env): Promise<boolean> {
    try {
        const magicLinkUrl = `https://learn-live.antmwes104-1.workers.dev/api/auth/magic-link/verify?token=${token}`;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.Resend_API_Key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'noreply@learnlive.app',
                to: email,
                subject: 'Sign in to Learn Live',
                html: `<p>Click the link below to sign in to Learn Live:</p><p><a href="${magicLinkUrl}">${magicLinkUrl}</a></p>`
            })
        });

        return response.ok;
    } catch (error) {
        console.error('[MagicLink] Error sending email:', error);
        return false;
    }
}

export async function storeMagicLinkToken(db: D1Database, userId: string | null, email: string, token: string): Promise<void> {
    // We encode the email into the ID so that verifyMagicLinkToken can retrieve it even if userId is null
    const id = `${email}|${crypto.randomUUID()}`;
    await db.prepare(`
        INSERT INTO Auth_Tokens (id, user_id, token, type, expires_at)
        VALUES (?, ?, ?, 'magic_link', datetime('now', '+15 minutes'))
    `).bind(id, userId, token).run();
}

export async function verifyMagicLinkToken(db: D1Database, token: string): Promise<{ userId: string; email: string } | null> {
    const tokenRecord = await db.prepare(`
        SELECT id, user_id, expires_at, used_at
        FROM Auth_Tokens
        WHERE token = ? AND type = 'magic_link'
    `).bind(token).first<{ id: string; user_id: string | null; expires_at: string; used_at: string | null }>();

    if (!tokenRecord) {
        return null;
    }

    if (tokenRecord.used_at) {
        return null; // Token already used
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
        return null; // Token expired
    }

    // Mark as used
    await db.prepare(`
        UPDATE Auth_Tokens SET used_at = datetime('now') WHERE token = ?
    `).bind(token).run();

    let email = tokenRecord.id.split('|')[0]; // Extract email from our custom ID format

    // Use findOrCreateUser for account linking
    const { id: resolvedUserId } = await findOrCreateUser(db, email, { emailVerified: true });

    // Link the token to the user if it wasn't linked before
    if (!tokenRecord.user_id) {
        await db.prepare(`UPDATE Auth_Tokens SET user_id = ? WHERE token = ?`)
            .bind(resolvedUserId, token).run();
    }

    return { userId: resolvedUserId, email };

    return { userId, email };
}

export async function handleMagicLinkRequest(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as { email: string };
        const email = body.email;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        let userId = null;
        const user = await env.DB.prepare('SELECT id FROM Users WHERE email = ?').bind(email).first<{ id: string }>();
        if (user) {
            userId = user.id;
        }

        const token = generateMagicLinkToken();
        await storeMagicLinkToken(env.DB, userId, email, token);
        await sendMagicLinkEmail(email, token, env);

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('[MagicLink] Error handling request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function handleMagicLinkVerify(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
        }

        const verificationResult = await verifyMagicLinkToken(env.DB, token);

        if (!verificationResult) {
            return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 });
        }

        const { userId, email } = verificationResult;

        const sessionToken = await signToken({ sub: userId, email }, env.JWT_SECRET);

        const response = new Response(null, {
            status: 302,
            headers: {
                Location: '/'
            }
        });

        return setSessionCookie(response, sessionToken);
    } catch (error) {
        console.error('[MagicLink] Error verifying token:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
