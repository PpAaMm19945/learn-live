export interface Env {
    DB: D1Database;
    EVIDENCE_VAULT: R2Bucket;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // Basic CORS setup
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

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
