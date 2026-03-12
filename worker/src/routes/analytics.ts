import type { Env } from '../index';
import { requireAdmin } from '../lib/auth/roles';
import { AuthUser } from '../lib/auth/middleware';

function addCors(response: Response, corsHeaders: Record<string, string>): Response {
    const newResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(corsHeaders)) {
        newResponse.headers.set(key, value);
    }
    return newResponse;
}

export async function handleAnalyticsRoutes(
    request: Request,
    env: Env,
    corsHeaders: Record<string, string>
): Promise<Response | null> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Must be an admin route
    if (!path.startsWith('/api/admin')) {
        return null;
    }

    // Require admin access for all routes handled here
    const authResult = await requireAdmin(request, env);
    if (authResult instanceof Response) {
        return addCors(authResult, corsHeaders);
    }
    const user = authResult as AuthUser;

    // GET /api/admin/check
    if (path === '/api/admin/check' && method === 'GET') {
        return addCors(new Response(JSON.stringify({ isAdmin: true }), {
            status: 200, headers: { 'Content-Type': 'application/json' },
        }), corsHeaders);
    }

    // GET /api/admin/analytics/overview
    if (path === '/api/admin/analytics/overview' && method === 'GET') {
        try {
            // Totals
            const totalFamilies = await env.DB.prepare('SELECT COUNT(*) as count FROM Families').first<{count: number}>() || {count: 0};
            const totalLearners = await env.DB.prepare('SELECT COUNT(*) as count FROM Learners').first<{count: number}>() || {count: 0};

            // Active users (last 7 days) via Activity_Log
            const activeUsers7d = await env.DB.prepare(`
                SELECT COUNT(DISTINCT user_id) as count
                FROM Activity_Log
                WHERE created_at >= datetime('now', '-7 days')
            `).first<{count: number}>() || {count: 0};

            // Lessons
            const totalLessons = await env.DB.prepare("SELECT COUNT(*) as count FROM Activity_Log WHERE action = 'lesson_completed'").first<{count: number}>() || {count: 0};
            const lessons7d = await env.DB.prepare("SELECT COUNT(*) as count FROM Activity_Log WHERE action = 'lesson_completed' AND created_at >= datetime('now', '-7 days')").first<{count: number}>() || {count: 0};

            // Exams
            const totalExams = await env.DB.prepare("SELECT COUNT(*) as count FROM Activity_Log WHERE action = 'exam_completed'").first<{count: number}>() || {count: 0};
            const exams7d = await env.DB.prepare("SELECT COUNT(*) as count FROM Activity_Log WHERE action = 'exam_completed' AND created_at >= datetime('now', '-7 days')").first<{count: number}>() || {count: 0};

            // Band distribution
            const { results: bandDistribution } = await env.DB.prepare(`
                SELECT band, COUNT(*) as count
                FROM Learners
                GROUP BY band
                ORDER BY band ASC
            `).all();

            const overviewData = {
                totalFamilies: totalFamilies.count,
                totalLearners: totalLearners.count,
                activeUsers7d: activeUsers7d.count,
                lessons: {
                    total: totalLessons.count,
                    last7Days: lessons7d.count
                },
                exams: {
                    total: totalExams.count,
                    last7Days: exams7d.count
                },
                bandDistribution
            };

            return addCors(new Response(JSON.stringify(overviewData), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        } catch (e: any) {
            console.error('[API Admin Overview Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // GET /api/admin/analytics/engagement
    if (path === '/api/admin/analytics/engagement' && method === 'GET') {
        try {
            // Daily Active Users (last 30 days)
            const { results: dailyActiveUsers } = await env.DB.prepare(`
                SELECT date(created_at) as date, COUNT(DISTINCT user_id) as count
                FROM Activity_Log
                WHERE created_at >= datetime('now', '-30 days')
                GROUP BY date(created_at)
                ORDER BY date(created_at) ASC
            `).all();

            // Lessons Completed Per Day (last 30 days)
            const { results: dailyLessons } = await env.DB.prepare(`
                SELECT date(created_at) as date, COUNT(*) as count
                FROM Activity_Log
                WHERE action = 'lesson_completed' AND created_at >= datetime('now', '-30 days')
                GROUP BY date(created_at)
                ORDER BY date(created_at) ASC
            `).all();

            // Average Lessons Per Learner (total)
            // Note: Since we only track user_id in activity, average relies on Learners count
            const totalLearners = await env.DB.prepare('SELECT COUNT(*) as count FROM Learners').first<{count: number}>() || {count: 0};
            const totalLessons = await env.DB.prepare("SELECT COUNT(*) as count FROM Activity_Log WHERE action = 'lesson_completed'").first<{count: number}>() || {count: 0};
            const avgLessonsPerLearner = totalLearners.count > 0 ? (totalLessons.count / totalLearners.count) : 0;

            // Popular Topics
            // Note: 'lesson_completed' log might just have resource_id=lesson_id.
            // If we join Lessons, we can find topic.
            const { results: popularTopics } = await env.DB.prepare(`
                SELECT t.id, t.title, COUNT(al.id) as completions
                FROM Activity_Log al
                JOIN Lessons l ON al.resource_id = l.id
                JOIN Topics t ON l.topic_id = t.id
                WHERE al.action = 'lesson_completed' AND al.resource_type = 'lesson'
                GROUP BY t.id
                ORDER BY completions DESC
                LIMIT 5
            `).all();

            const { results: leastPopularTopics } = await env.DB.prepare(`
                SELECT t.id, t.title, COUNT(al.id) as completions
                FROM Topics t
                LEFT JOIN Lessons l ON l.topic_id = t.id
                LEFT JOIN Activity_Log al ON al.resource_id = l.id AND al.action = 'lesson_completed' AND al.resource_type = 'lesson'
                GROUP BY t.id
                ORDER BY completions ASC
                LIMIT 5
            `).all();


            const engagementData = {
                dailyActiveUsers,
                dailyLessons,
                avgLessonsPerLearner,
                popularTopics,
                leastPopularTopics
            };

            return addCors(new Response(JSON.stringify(engagementData), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        } catch (e: any) {
            console.error('[API Admin Engagement Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // GET /api/admin/analytics/families
    if (path === '/api/admin/analytics/families' && method === 'GET') {
        try {
            // Join Families, Learners, and Activity_Log to get family stats.
            // Since Activity_Log uses user_id, and Families has a user_id (parent),
            // we can link the completions if the parent or learner completed it.
            // But since progress is scoped to user_id, and family parent is the user_id.
            const { results: familiesData } = await env.DB.prepare(`
                SELECT
                    f.id,
                    f.name as family_name,
                    COUNT(DISTINCT l.id) as learner_count,
                    COUNT(DISTINCT CASE WHEN al.action = 'lesson_completed' THEN al.id END) as total_lessons_completed,
                    MAX(al.created_at) as last_active_date
                FROM Families f
                LEFT JOIN Learners l ON l.family_id = f.id
                LEFT JOIN Activity_Log al ON al.user_id = f.user_id
                GROUP BY f.id
                ORDER BY last_active_date DESC NULLS LAST
            `).all();

            return addCors(new Response(JSON.stringify({ families: familiesData }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        } catch (e: any) {
            console.error('[API Admin Families Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
        }
    }

    // Other routes will go here

    return null;
}
