import { Env } from '../index';

export async function handleCreateFamily(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const body: any = await request.json();
        const { name } = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Family name is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const familyId = `family_${crypto.randomUUID()}`;

        await env.DB.prepare(
            'INSERT INTO Families (id, owner_user_id, name) VALUES (?, ?, ?)'
        ).bind(familyId, userId, name.trim()).run();

        return new Response(JSON.stringify({ success: true, familyId, name: name.trim() }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] Create family error:', e);
        return new Response(JSON.stringify({ error: 'Failed to create family', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleGetFamily(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const family = await env.DB.prepare(
            'SELECT id, name, created_at FROM Families WHERE owner_user_id = ?'
        ).bind(userId).first<any>();

        if (!family) {
             return new Response(JSON.stringify({ error: 'Family not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const { results: learners } = await env.DB.prepare(
            'SELECT id, name, birth_date, band, created_at FROM Learners WHERE family_id = ?'
        ).bind(family.id).all();

        return new Response(JSON.stringify({
            family,
            learners
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        console.error('[API] Get family error:', e);
        return new Response(JSON.stringify({ error: 'Failed to get family', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleAddLearner(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const family = await env.DB.prepare(
            'SELECT id FROM Families WHERE owner_user_id = ?'
        ).bind(userId).first<any>();

        if (!family) {
             return new Response(JSON.stringify({ error: 'Family not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const body: any = await request.json();
        const { name, birthDate, band } = body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return new Response(JSON.stringify({ error: 'Learner name is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const parsedBand = typeof band === 'number' ? band : parseInt(band, 10);
        if (isNaN(parsedBand) || parsedBand < 0 || parsedBand > 5) {
             return new Response(JSON.stringify({ error: 'Band must be an integer between 0 and 5' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const learnerId = `learner_${crypto.randomUUID()}`;

        await env.DB.prepare(
            'INSERT INTO Learners (id, family_id, name, birth_date, band) VALUES (?, ?, ?, ?, ?)'
        ).bind(learnerId, family.id, name.trim(), birthDate || null, parsedBand).run();

        return new Response(JSON.stringify({ success: true, learnerId }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
         console.error('[API] Add learner error:', e);
         return new Response(JSON.stringify({ error: 'Failed to add learner', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleUpdateLearner(request: Request, env: Env, userId: string): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/family\/learners\/([^/]+)$/);
    if (!match) {
        return new Response(JSON.stringify({ error: 'Invalid route' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const learnerId = match[1];

    try {
        const family = await env.DB.prepare(
            'SELECT id FROM Families WHERE owner_user_id = ?'
        ).bind(userId).first<any>();

        if (!family) {
             return new Response(JSON.stringify({ error: 'Family not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // Verify learner belongs to this family
        const learner = await env.DB.prepare(
            'SELECT id FROM Learners WHERE id = ? AND family_id = ?'
        ).bind(learnerId, family.id).first<any>();

        if (!learner) {
             return new Response(JSON.stringify({ error: 'Learner not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const body: any = await request.json();
        const { name, band } = body;

        let queryParams: any[] = [];
        let setClauses: string[] = [];

        if (name && typeof name === 'string' && name.trim().length > 0) {
            setClauses.push('name = ?');
            queryParams.push(name.trim());
        }

        if (band !== undefined) {
             const parsedBand = typeof band === 'number' ? band : parseInt(band, 10);
             if (!isNaN(parsedBand) && parsedBand >= 0 && parsedBand <= 5) {
                 setClauses.push('band = ?');
                 queryParams.push(parsedBand);
             } else {
                 return new Response(JSON.stringify({ error: 'Band must be an integer between 0 and 5' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
             }
        }

        if (setClauses.length === 0) {
            return new Response(JSON.stringify({ error: 'No valid fields to update' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        queryParams.push(learnerId);

        await env.DB.prepare(
            `UPDATE Learners SET ${setClauses.join(', ')} WHERE id = ?`
        ).bind(...queryParams).run();

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
         console.error('[API] Update learner error:', e);
         return new Response(JSON.stringify({ error: 'Failed to update learner', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleRemoveLearner(request: Request, env: Env, userId: string): Promise<Response> {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/api\/family\/learners\/([^/]+)$/);
    if (!match) {
        return new Response(JSON.stringify({ error: 'Invalid route' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const learnerId = match[1];

    try {
        const family = await env.DB.prepare(
            'SELECT id FROM Families WHERE owner_user_id = ?'
        ).bind(userId).first<any>();

        if (!family) {
             return new Response(JSON.stringify({ error: 'Family not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const result = await env.DB.prepare(
            'DELETE FROM Learners WHERE id = ? AND family_id = ?'
        ).bind(learnerId, family.id).run();

        if (result.meta.changes === 0) {
             return new Response(JSON.stringify({ error: 'Learner not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
         console.error('[API] Remove learner error:', e);
         return new Response(JSON.stringify({ error: 'Failed to remove learner', details: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
