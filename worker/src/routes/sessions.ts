import { Env } from '../index';

export async function handleCreateSession(request: Request, env: Env): Promise<Response> {
    try {
        const body = await request.json() as {
            learnerId?: string;
            lessonId?: string;
            type?: string;
            durationMs?: number;
        };

        if (!body.learnerId || !body.lessonId || !body.durationMs) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const id = `sess_${crypto.randomUUID()}`;
        await env.DB.prepare(
            `INSERT INTO Dialogue_Sessions (id, learner_id, lesson_id, type, duration_ms) VALUES (?, ?, ?, ?, ?)`
        ).bind(id, body.learnerId, body.lessonId, body.type || 'dialogue', body.durationMs).run();

        return new Response(JSON.stringify({ id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[API CreateSession Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to create session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
