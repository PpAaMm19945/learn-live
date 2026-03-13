import type { Env } from '../../index';
import { signToken } from './jwt';
import { setSessionCookie } from './cookies';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailVerification';
import { logActivity } from '../analytics/logger';
import { findOrCreateUser } from './accountLink';

const ITERATIONS = 100000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const enc = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    const saltBase64 = arrayBufferToBase64(salt);
    const hashBase64 = arrayBufferToBase64(hashBuffer);

    return `${saltBase64}:${hashBase64}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;

    const [saltBase64, hashBase64] = parts;
    const salt = base64ToArrayBuffer(saltBase64);
    const enc = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        KEY_LENGTH * 8
    );

    const derivedHashBase64 = arrayBufferToBase64(hashBuffer);
    return derivedHashBase64 === hashBase64;
}

export async function handleRegister(request: Request, env: Env): Promise<Response> {
    try {
        const body: any = await request.json();
        const { email, password, name } = body;

        if (!email || !password || password.length < 8) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        const { id: userId, isNew } = await findOrCreateUser(env.DB, email, {
            name,
            passwordHash,
            emailVerified: false,
        });

        if (!isNew) {
            // Account already exists — password was linked if missing
            return new Response(JSON.stringify({ success: true, message: 'Account already exists. Password linked if applicable.' }), { status: 200 });
        }

        // Send verification email for new accounts
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await env.DB.prepare(
            `INSERT INTO Auth_Tokens (id, user_id, token, type, expires_at) VALUES (?, ?, ?, 'email_verify', ?)`
        ).bind(crypto.randomUUID(), userId, token, expiresAt).run();

        await sendVerificationEmail(email, token, env);

        return new Response(JSON.stringify({ success: true, message: 'Check your email' }), { status: 201 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function handleLogin(request: Request, env: Env): Promise<Response> {
    try {
        const body: any = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });
        }

        const user: any = await env.DB.prepare(`SELECT * FROM Users WHERE email = ?`).bind(email).first();
        if (!user || !user.password_hash) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }

        if (user.email_verified !== 1) {
            return new Response(JSON.stringify({ error: 'Email not verified' }), { status: 403 });
        }

        const sessionToken = await signToken({ sub: user.id, email: user.email }, env.JWT_SECRET);

        logActivity(env, user.id, 'login', 'auth', user.id);

        let response = new Response(JSON.stringify({ success: true, user: { id: user.id, email: user.email, name: user.name } }), { status: 200 });
        response = setSessionCookie(response, sessionToken);

        return response;
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function handleForgotPassword(request: Request, env: Env): Promise<Response> {
    try {
        const body: any = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 });
        }

        const user: any = await env.DB.prepare(`SELECT id FROM Users WHERE email = ?`).bind(email).first();
        if (user) {
            const token = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            await env.DB.prepare(
                `INSERT INTO Auth_Tokens (id, user_id, token, type, expires_at) VALUES (?, ?, ?, 'password_reset', ?)`
            ).bind(crypto.randomUUID(), user.id, token, expiresAt).run();

            await sendPasswordResetEmail(email, token, env);
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function handleResetPassword(request: Request, env: Env): Promise<Response> {
    try {
        const body: any = await request.json();
        const { token, newPassword } = body;

        if (!token || !newPassword || newPassword.length < 8) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
        }

        const authToken: any = await env.DB.prepare(
            `SELECT * FROM Auth_Tokens WHERE token = ? AND type = 'password_reset' AND used_at IS NULL AND expires_at > ?`
        ).bind(token, new Date().toISOString()).first();

        if (!authToken) {
            return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
        }

        const passwordHash = await hashPassword(newPassword);

        await env.DB.prepare(
            `UPDATE Users SET password_hash = ? WHERE id = ?`
        ).bind(passwordHash, authToken.user_id).run();

        await env.DB.prepare(
            `UPDATE Auth_Tokens SET used_at = ? WHERE id = ?`
        ).bind(new Date().toISOString(), authToken.id).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

export async function handleVerifyEmail(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
        }

        const authToken: any = await env.DB.prepare(
            `SELECT * FROM Auth_Tokens WHERE token = ? AND type = 'email_verify' AND used_at IS NULL AND expires_at > ?`
        ).bind(token, new Date().toISOString()).first();

        if (!authToken) {
            return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 400 });
        }

        await env.DB.prepare(
            `UPDATE Users SET email_verified = 1 WHERE id = ?`
        ).bind(authToken.user_id).run();

        await env.DB.prepare(
            `UPDATE Auth_Tokens SET used_at = ? WHERE id = ?`
        ).bind(new Date().toISOString(), authToken.id).run();

        return Response.redirect(new URL('/login', request.url).toString(), 302);
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
