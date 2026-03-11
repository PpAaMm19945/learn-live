import type { Env } from '../../index.js'; // Note: adjust import if needed
import { getSessionToken } from './cookies.js';
import { verifyToken } from './jwt.js';

export async function authenticateRequest(
    request: Request,
    env: Env
): Promise<{ userId: string; email: string } | null> {
    const token = getSessionToken(request);
    if (!token) {
        return null;
    }

    const payload = await verifyToken(token, env.JWT_SECRET);
    if (!payload) {
        return null;
    }

    return {
        userId: payload.sub,
        email: payload.email
    };
}
