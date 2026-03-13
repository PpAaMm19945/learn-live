import { Env } from '../index';
import { isAdmin } from '../lib/auth/roles';

export async function handleGetGlossary(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const category = url.searchParams.get('category');

    try {
        let query = 'SELECT * FROM Glossary_Terms WHERE 1=1';
        const params: (string | number | boolean)[] = [];

        if (search) {
            query += ' AND (term LIKE ? OR definition LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY term ASC';

        const { results } = await env.DB.prepare(query).bind(...params).all();

        return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e: unknown) {
        console.error('[API] Glossary fetch error:', e);
        return new Response(JSON.stringify({ error: 'Failed to fetch glossary' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handleGetGlossaryTerm(request: Request, env: Env, termId: string): Promise<Response> {
    try {
        const term = await env.DB.prepare('SELECT * FROM Glossary_Terms WHERE id = ?').bind(termId).first();
        if (!term) {
            return new Response(JSON.stringify({ error: 'Term not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify(term), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (e: unknown) {
        console.error('[API] Glossary term fetch error:', e);
        return new Response(JSON.stringify({ error: 'Failed to fetch glossary term' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function handlePostGlossaryTerm(request: Request, env: Env, userId: string): Promise<Response> {
    // Check admin role
    const adminCheck = await isAdmin(env, userId);
    if (!adminCheck) {
        return new Response(JSON.stringify({ error: 'Unauthorized. Admin access required.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const body = (await request.json()) as { id: string, term: string, definition: string, category?: string, related_chapter_ids?: string[] };
        const { id, term, definition, category, related_chapter_ids } = body;

        if (!id || !term || !definition) {
             return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const chaptersStr = related_chapter_ids ? JSON.stringify(related_chapter_ids) : '[]';

        await env.DB.prepare(`
            INSERT INTO Glossary_Terms (id, term, definition, category, related_chapter_ids)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                term = excluded.term,
                definition = excluded.definition,
                category = excluded.category,
                related_chapter_ids = excluded.related_chapter_ids
        `).bind(id, term, definition, category || null, chaptersStr).run();

        return new Response(JSON.stringify({ success: true, termId: id }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (e: unknown) {
        console.error('[API] Glossary update error:', e);
        return new Response(JSON.stringify({ error: 'Failed to update glossary term' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
