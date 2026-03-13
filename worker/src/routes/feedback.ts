import { Env } from '../index';

export async function handleCreateFeedback(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const body: any = await request.json();
        const { type, description, page_url } = body;

        if (!type || !description) {
            return new Response(JSON.stringify({ error: 'Type and description are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const feedbackId = `fb_${crypto.randomUUID()}`;

        await env.DB.prepare(
            'INSERT INTO Feedback (id, user_id, type, description, page_url) VALUES (?, ?, ?, ?, ?)'
        ).bind(feedbackId, userId, type, description, page_url || null).run();

        return new Response(JSON.stringify({ success: true, feedbackId }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] Create feedback error:', e);
        return new Response(JSON.stringify({ error: 'Failed to create feedback', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleListFeedback(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        // Must check if user is admin
        const { results: roles } = await env.DB.prepare('SELECT role FROM User_Roles WHERE user_id = ?').bind(userId).all<{ role: string }>();
        const isAdmin = roles.some(r => r.role === 'admin' || r.role === 'superadmin');

        if (!isAdmin) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        const { results } = await env.DB.prepare(
            'SELECT f.id, f.type, f.description, f.page_url, f.status, f.created_at, u.email as user_email FROM Feedback f JOIN Users u ON u.id = f.user_id ORDER BY f.created_at DESC'
        ).all();

        return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] List feedback error:', e);
        return new Response(JSON.stringify({ error: 'Failed to list feedback', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleUpdateFeedback(request: Request, env: Env, userId: string, feedbackId: string): Promise<Response> {
    try {
        // Must check if user is admin
        const { results: roles } = await env.DB.prepare('SELECT role FROM User_Roles WHERE user_id = ?').bind(userId).all<{ role: string }>();
        const isAdmin = roles.some(r => r.role === 'admin' || r.role === 'superadmin');

        if (!isAdmin) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        const body: any = await request.json();
        const { status } = body;

        if (!status) {
            return new Response(JSON.stringify({ error: 'Status is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        await env.DB.prepare(
            'UPDATE Feedback SET status = ? WHERE id = ?'
        ).bind(status, feedbackId).run();

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] Update feedback error:', e);
        return new Response(JSON.stringify({ error: 'Failed to update feedback', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
