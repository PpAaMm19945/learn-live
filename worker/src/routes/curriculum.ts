import { Env } from '../index';
import { requireAuth } from '../lib/auth/middleware';

// Cache for parsed JSON fields to avoid redundant parsing overhead
const jsonCache = new Map<string, any>();

/**
 * Parses a JSON string and caches the result.
 */
function cachedJSONParse(jsonString: string | null): any {
    if (!jsonString) return null;
    const cached = jsonCache.get(jsonString);
    if (cached !== undefined) return cached;
    try {
        const parsed = JSON.parse(jsonString);
        jsonCache.set(jsonString, parsed);
        return parsed;
    } catch (error) {
        console.error('[JSON Cache] Failed to parse JSON:', error);
        return null;
    }
}

function addCors(response: Response, corsHeaders: Record<string, string>): Response {
    const newResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(corsHeaders)) {
        newResponse.headers.set(key, value);
    }
    return newResponse;
}

export async function handleCurriculumRoutes(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response | null> {
    const url = new URL(request.url);

    // GET /api/topics — list all topics with lesson counts
    if (url.pathname === '/api/topics' && request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        try {
            const { results } = await env.DB.prepare(`
                SELECT t.id, t.title, t.summary, t.era, t.region, t.display_order, t.parent_topic_id,
                       COUNT(l.id) as lesson_count
                FROM Topics t
                LEFT JOIN Lessons l ON l.topic_id = t.id
                GROUP BY t.id
                ORDER BY t.display_order ASC
            `).all();

            const topics = results.map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.summary || '',
                era: t.era || '',
                region: t.region || '',
                lesson_count: t.lesson_count,
            }));

            return addCors(new Response(JSON.stringify(topics), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Topics list error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // GET /api/topics/:id — list lessons for a specific topic with progress
    const topicDetailMatch = url.pathname.match(/^\/api\/topics\/([^/]+)$/);
    if (topicDetailMatch && request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        const topicId = topicDetailMatch[1];
        try {
            const topic = await env.DB.prepare(
                'SELECT id, title, summary, era, region FROM Topics WHERE id = ?'
            ).bind(topicId).first<any>();

            if (!topic) {
                return addCors(new Response(JSON.stringify({ error: 'Topic not found' }), { status: 404 }), corsHeaders);
            }

            const { results: lessons } = await env.DB.prepare(`
                SELECT l.id, l.title, l.difficulty_band, l.estimated_minutes,
                       COALESCE(lp.status, 'not_started') as status
                FROM Lessons l
                LEFT JOIN Learner_Progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
                WHERE l.topic_id = ?
                ORDER BY l.difficulty_band ASC, l.title ASC
            `).bind(authResult.userId, topicId).all();

            return addCors(new Response(JSON.stringify({
                id: topic.id,
                title: topic.title,
                description: topic.summary || '',
                era: topic.era || '',
                region: topic.region || '',
                lessons: lessons.map((l: any) => ({
                    id: l.id,
                    title: l.title,
                    difficulty_band: l.difficulty_band || 1,
                    estimated_time: l.estimated_minutes ? `${l.estimated_minutes} min` : 'N/A',
                    status: l.status,
                })),
            }), { status: 200, headers: { 'Content-Type': 'application/json' } }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Topic detail error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // GET /api/lessons/:id — lesson detail with sources
    const lessonDetailMatch = url.pathname.match(/^\/api\/lessons\/([^/]+)$/);
    if (lessonDetailMatch && request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        const lessonId = lessonDetailMatch[1];
        try {
            const lesson = await env.DB.prepare(
                'SELECT id, topic_id, title, narrative_text, key_dates, key_figures, difficulty_band, estimated_minutes FROM Lessons WHERE id = ?'
            ).bind(lessonId).first<any>();

            if (!lesson) {
                return addCors(new Response(JSON.stringify({ error: 'Lesson not found' }), { status: 404 }), corsHeaders);
            }

            const { results: sources } = await env.DB.prepare(
                'SELECT id, title, author, type, url, excerpt FROM Sources WHERE lesson_id = ?'
            ).bind(lessonId).all();

            const citations = sources.map((s: any) => {
                const parts = [s.title];
                if (s.author) parts.push(`by ${s.author}`);
                if (s.type) parts.push(`(${s.type})`);
                return parts.join(' ');
            });

            return addCors(new Response(JSON.stringify({
                id: lesson.id,
                topic_id: lesson.topic_id,
                title: lesson.title,
                narrative: lesson.narrative_text || '',
                key_dates: cachedJSONParse(lesson.key_dates) || [],
                key_figures: cachedJSONParse(lesson.key_figures) || [],
                citations,
            }), { status: 200, headers: { 'Content-Type': 'application/json' } }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Lesson detail error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // POST /api/progress — upsert learner progress
    if (url.pathname === '/api/progress' && request.method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        try {
            const body: any = await request.json();
            const { lesson_id, status } = body;
            if (!lesson_id || !status) {
                return addCors(new Response(JSON.stringify({ error: 'lesson_id and status required' }), { status: 400 }), corsHeaders);
            }

            const progressId = `prog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            const now = new Date().toISOString();

            await env.DB.prepare(`
                INSERT INTO Learner_Progress (id, user_id, lesson_id, status, started_at, completed_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                    status = excluded.status,
                    completed_at = CASE WHEN excluded.status = 'completed' THEN ? ELSE completed_at END
            `).bind(
                progressId, authResult.userId, lesson_id, status, now,
                status === 'completed' ? now : null,
                now
            ).run();

            return addCors(new Response(JSON.stringify({ success: true }), { status: 200 }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Progress upsert error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // GET /api/progress — learner progress overview
    if (url.pathname === '/api/progress' && request.method === 'GET') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        try {
            const { results: completed } = await env.DB.prepare(
                "SELECT COUNT(*) as cnt FROM Learner_Progress WHERE user_id = ? AND status = 'completed'"
            ).bind(authResult.userId).all();

            const { results: inProgress } = await env.DB.prepare(`
                SELECT COUNT(DISTINCT t.id) as cnt
                FROM Topics t
                JOIN Lessons l ON l.topic_id = t.id
                JOIN Learner_Progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
                WHERE lp.status IN ('in_progress', 'completed')
            `).bind(authResult.userId).all();

            const { results: scores } = await env.DB.prepare(`
                SELECT t.id as topicId, t.title as topicName,
                       AVG(lp.score) as score, COUNT(lp.id) as total
                FROM Learner_Progress lp
                JOIN Lessons l ON l.id = lp.lesson_id
                JOIN Topics t ON t.id = l.topic_id
                WHERE lp.user_id = ? AND lp.score IS NOT NULL
                GROUP BY t.id
            `).bind(authResult.userId).all();

            const topicScores = scores.map((s: any) => ({
                topicId: s.topicId,
                topicName: s.topicName,
                score: Math.round(s.score || 0),
                total: s.total,
                percentage: Math.round(s.score || 0),
            }));

            const avgScore = topicScores.length > 0
                ? Math.round(topicScores.reduce((sum: number, t: any) => sum + t.percentage, 0) / topicScores.length)
                : 0;

            return addCors(new Response(JSON.stringify({
                totalLessonsCompleted: (completed[0] as any)?.cnt || 0,
                topicsInProgress: (inProgress[0] as any)?.cnt || 0,
                averageScore: avgScore,
                topicScores,
            }), { status: 200, headers: { 'Content-Type': 'application/json' } }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Progress overview error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // POST /api/quiz/complete — submit quiz score
    if (url.pathname === '/api/quiz/complete' && request.method === 'POST') {
        const authResult = await requireAuth(request, env);
        if (authResult instanceof Response) return addCors(authResult, corsHeaders);
        try {
            const body: any = await request.json();
            const { topicId, score, total } = body;
            if (!topicId || score === undefined || !total) {
                return addCors(new Response(JSON.stringify({ error: 'topicId, score, and total required' }), { status: 400 }), corsHeaders);
            }

            // Store quiz score as percentage in the first lesson of the topic
            const lesson = await env.DB.prepare(
                'SELECT id FROM Lessons WHERE topic_id = ? ORDER BY difficulty_band ASC LIMIT 1'
            ).bind(topicId).first<any>();

            if (lesson) {
                const progressId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                const now = new Date().toISOString();
                const percentage = Math.round((score / total) * 100);

                await env.DB.prepare(`
                    INSERT INTO Learner_Progress (id, user_id, lesson_id, status, score, completed_at)
                    VALUES (?, ?, ?, 'completed', ?, ?)
                    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                        score = excluded.score,
                        completed_at = excluded.completed_at
                `).bind(progressId, authResult.userId, lesson.id, percentage, now).run();
            }

            return addCors(new Response(JSON.stringify({ success: true }), { status: 200 }), corsHeaders);
        } catch (e: any) {
            console.error('[API] Quiz complete error:', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    return null;
}
