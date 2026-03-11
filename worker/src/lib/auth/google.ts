import { setSessionCookie } from './cookies';
import { signToken, verifyToken } from './jwt';

// Define the environment interface locally to avoid circular dependencies
// or importing from index.ts if not exported (it is exported, but this is safer)
export interface Env {
    DB: D1Database;
    EVIDENCE_VAULT: R2Bucket;
    JWT_SECRET: string;
    Google_Client_ID: string;
    Google_Client_Secret: string;
    Resend_API_Key: string;
    API_AUTH_TOKEN?: string;
    GEMINI_API_KEY?: string;
}

export interface GoogleTokens {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    id_token: string;
    refresh_token?: string;
}

export interface GoogleUserInfo {
    email: string;
    name: string;
    picture: string;
}

// Redirect URI
const REDIRECT_URI = 'https://learn-live.antmwes104-1.workers.dev/api/auth/google/callback';

export function getGoogleAuthURL(env: Env, state: string): string {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', env.Google_Client_ID);
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid email profile');
    url.searchParams.append('state', state);
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('prompt', 'consent');

    return url.toString();
}

export async function exchangeCodeForTokens(code: string, env: Env): Promise<GoogleTokens> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: env.Google_Client_ID,
            client_secret: env.Google_Client_Secret,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to exchange code for tokens: ${errorText}`);
    }

    return response.json();
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get user info: ${errorText}`);
    }

    const data = await response.json();
    return {
        email: data.email,
        name: data.name,
        picture: data.picture,
    };
}

export async function upsertGoogleUser(db: D1Database, userInfo: { email: string; name: string }): Promise<string> {
    // Check if user exists
    const existingUser = await db.prepare('SELECT id FROM Users WHERE email = ?').bind(userInfo.email).first();

    if (existingUser) {
        // User exists - update name if missing or needed? For now just return ID
        return existingUser.id as string;
    }

    // Create new user
    const userId = `user_${crypto.randomUUID().replace(/-/g, '')}`;

    await db.prepare(
        'INSERT INTO Users (id, email, name, email_verified) VALUES (?, ?, ?, 1)'
    ).bind(userId, userInfo.email, userInfo.name).run();

    // Assign parent role by default for new Google signups
    const roleId = `role_${crypto.randomUUID().replace(/-/g, '')}`;
    await db.prepare(
        'INSERT INTO User_Roles (id, user_id, role) VALUES (?, ?, ?)'
    ).bind(roleId, userId, 'parent').run();

    return userId;
}

export async function handleGoogleAuth(request: Request, env: Env): Promise<Response> {
    try {
        // Generate state token and sign it
        const statePayload = {
            sub: 'oauth_state',
            email: 'none@example.com', // Required by signToken but unused here
            type: 'google_oauth_state'
        };

        // Short expiration for state token (10 minutes)
        const stateToken = await signToken(statePayload, env.JWT_SECRET, 600);

        const authURL = getGoogleAuthURL(env, stateToken);

        return Response.redirect(authURL, 302);
    } catch (error: any) {
        console.error('[Google Auth Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to initiate Google Auth' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function handleGoogleCallback(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        // Allow CORS for the redirect? Actually redirect will just go to frontend
        const frontendURL = 'https://learn-live-4az.pages.dev/login';

        if (error) {
            return Response.redirect(`${frontendURL}?error=${encodeURIComponent(error)}`, 302);
        }

        if (!code || !state) {
            return Response.redirect(`${frontendURL}?error=missing_params`, 302);
        }

        // Validate state token
        const verifiedState = await verifyToken(state, env.JWT_SECRET);
        if (!verifiedState || verifiedState.type !== 'google_oauth_state') {
            return Response.redirect(`${frontendURL}?error=invalid_state`, 302);
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code, env);

        // Get user info
        const userInfo = await getGoogleUserInfo(tokens.access_token);

        if (!userInfo.email) {
            return Response.redirect(`${frontendURL}?error=missing_email`, 302);
        }

        // Upsert user (account linking happens here)
        const userId = await upsertGoogleUser(env.DB, userInfo);

        // Create session token
        // Use standard 7-day expiration
        const sessionToken = await signToken({
            sub: userId,
            email: userInfo.email,
            role: 'parent' // Default role
        }, env.JWT_SECRET);

        // Record session in DB (optional but good practice to allow revocation)
        const sessionId = `session_${crypto.randomUUID().replace(/-/g, '')}`;

        // Hash the token for storage
        const tokenHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sessionToken));
        const tokenHash = Array.from(new Uint8Array(tokenHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await env.DB.prepare(
            'INSERT INTO Sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
        ).bind(sessionId, userId, tokenHash, expiresAt).run();

        // Redirect to frontend (home page on success)
        const successURL = 'https://learn-live-4az.pages.dev';
        const redirectResponse = Response.redirect(successURL, 302);

        // Set the session cookie
        return setSessionCookie(redirectResponse, sessionToken);

    } catch (error: any) {
        console.error('[Google Callback Error]', error);
        return Response.redirect(`https://learn-live-4az.pages.dev/login?error=callback_failed`, 302);
    }
}