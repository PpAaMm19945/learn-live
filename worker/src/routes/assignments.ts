import { Env } from '../index';

export async function handlePostAssignmentTelemetry(request: Request, env: Env, assignmentId: string): Promise<Response> {
    const serviceKey = request.headers.get('X-Service-Key');
    if (!env.AGENT_SERVICE_KEY || !serviceKey || serviceKey !== env.AGENT_SERVICE_KEY) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await request.json() as {
            comprehension_avg?: number;
            scaffolding_triggered?: number;
            raise_hand_count?: number;
            session_duration_seconds?: number;
            beats_completed?: number;
        };

        const id = `tele_${crypto.randomUUID()}`;
        const now = Date.now();

        await env.DB.prepare(`
            INSERT INTO assignment_telemetry (
                id,
                assignment_id,
                comprehension_avg,
                scaffolding_triggered,
                raise_hand_count,
                session_duration_seconds,
                beats_completed,
                recorded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            assignmentId,
            body.comprehension_avg ?? null,
            body.scaffolding_triggered ?? 0,
            body.raise_hand_count ?? 0,
            body.session_duration_seconds ?? null,
            body.beats_completed ?? null,
            now,
        ).run();

        return new Response(JSON.stringify({ ok: true, id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('[POST /api/assignments/:id/telemetry] failed', error);
        return new Response(JSON.stringify({ error: 'Failed to record telemetry' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

