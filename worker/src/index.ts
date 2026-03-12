import { routeRequest } from './routes/index';

export interface Env {
    DB: D1Database;
    EVIDENCE_VAULT: R2Bucket;
    JWT_SECRET: string;
    Google_Client_ID: string;
    Google_Client_Secret: string;
    Resend_API_Key: string;
    GEMINI_API_KEY?: string;
    PILOT_INVITE_CODE?: string;
}

const ALLOWED_ORIGINS = [
    'https://learn-live-4az.pages.dev',
    'http://localhost:5173',
    'http://localhost:3000',
];

function getCorsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('Origin') || '';
    // Allow any *.lovable.app or *.lovableproject.com preview origin
    const isAllowed = ALLOWED_ORIGINS.includes(origin)
        || origin.endsWith('.lovable.app')
        || origin.endsWith('.lovableproject.com');

    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export function addCors(response: Response, corsHeaders: Record<string, string>): Response {
    const newResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(corsHeaders)) {
        newResponse.headers.set(key, value);
    }
    return newResponse;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        const corsHeaders = getCorsHeaders(request);

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // ==================== MODULAR ROUTES (Phase 4+) ====================
        const modularResponse = await routeRequest(request, env, corsHeaders);
        if (modularResponse) {
            return addCors(modularResponse, corsHeaders);
        }

        // ==================== EXISTING ROUTES ====================

        if (url.pathname === '/api/health') {
            return new Response(JSON.stringify({ status: 'ok', service: 'learnlive-api' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Default 404
        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};
