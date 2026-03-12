import { r2Helper } from './lib/r2';
// LEGACY: Remove when math curriculum is fully replaced
import { advanceArc } from './lib/arc';
import { resolveDependencies } from './lib/dag';
import { generateTask, generateSystemInstruction } from './lib/taskGen';
import { generateDiagram } from './lib/nanoBanana';
import { getSplitJudgmentMode, evaluateCompetence } from './lib/splitJudgment';
import { generateParentPrimer } from './lib/parentPrimer';
import { checkAIPermission } from './lib/aiPermissions';
import { getOrCreateWeeklyPlan, completeWeeklyTask } from './lib/weeklyPlan';
import { getEnrichedTask } from './lib/enrichTask';
import { evaluateEvidence } from './lib/evaluateEvidence';

// Content routes (Phase 4)
import { routeRequest } from './routes/index';

// Auth imports
import { authenticateRequest, requireAuth } from './lib/auth/middleware';
import { handleMagicLinkRequest, handleMagicLinkVerify } from './lib/auth/magicLink';
import { handleGoogleAuth, handleGoogleCallback } from './lib/auth/google';
import { handleRegister, handleLogin, handleForgotPassword, handleResetPassword, handleVerifyEmail, hashPassword } from './lib/auth/password';
import { clearSessionCookie } from './lib/auth/cookies';

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

export interface Env {
    DB: D1Database;
    EVIDENCE_VAULT: R2Bucket;
    JWT_SECRET: string;
    Google_Client_ID: string;
    Google_Client_Secret: string;
    Resend_API_Key: string;
    // LEGACY: Remove when all clients migrate to cookie auth
    API_AUTH_TOKEN?: string;
    GEMINI_API_KEY?: string;
}

// LEGACY: Remove when all clients migrate to cookie auth
function isAuthorized(request: Request, env: Env): boolean {
    const authHeader = request.headers.get('Authorization');
    const expectedToken = env.API_AUTH_TOKEN;
    if (!expectedToken) return false;
    return authHeader === `Bearer ${expectedToken}`;
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

function addCors(response: Response, corsHeaders: Record<string, string>): Response {
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

        // ==================== AUTH ROUTES ====================

        if (url.pathname === '/api/auth/me' && request.method === 'GET') {
            const user = await authenticateRequest(request, env);
            if (!user) {
                return addCors(new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401, headers: { 'Content-Type': 'application/json' },
                }), corsHeaders);
            }
            // Fetch roles and user info
            const dbUser = await env.DB.prepare('SELECT id, email, name, email_verified FROM Users WHERE id = ?')
                .bind(user.userId).first<{ id: string; email: string; name: string | null; email_verified: number }>();
            const { results: roleRows } = await env.DB.prepare('SELECT role FROM User_Roles WHERE user_id = ?')
                .bind(user.userId).all<{ role: string }>();
            const roles = roleRows.map((r: any) => r.role);

            return addCors(new Response(JSON.stringify({
                userId: dbUser?.id || user.userId,
                email: dbUser?.email || user.email,
                name: dbUser?.name || null,
                roles,
                emailVerified: dbUser?.email_verified === 1,
            }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
            }), corsHeaders);
        }

        if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
            const response = clearSessionCookie(
                new Response(JSON.stringify({ success: true }), {
                    status: 200, headers: { 'Content-Type': 'application/json' },
                })
            );
            return addCors(response, corsHeaders);
        }

        if (url.pathname === '/api/auth/login' && request.method === 'POST') {
            return addCors(await handleLogin(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/register' && request.method === 'POST') {
            return addCors(await handleRegister(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/forgot-password' && request.method === 'POST') {
            return addCors(await handleForgotPassword(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/reset-password' && request.method === 'POST') {
            return addCors(await handleResetPassword(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/verify-email' && request.method === 'GET') {
            return addCors(await handleVerifyEmail(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/magic-link' && request.method === 'POST') {
            return addCors(await handleMagicLinkRequest(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/magic-link/verify' && request.method === 'GET') {
            return addCors(await handleMagicLinkVerify(request, env), corsHeaders);
        }
        if (url.pathname === '/api/auth/google' && request.method === 'GET') {
            return await handleGoogleAuth(request, env);
        }
        if (url.pathname === '/api/auth/google/callback' && request.method === 'GET') {
            return await handleGoogleCallback(request, env);
        }

        // POST /api/auth/set-password — add password to OAuth/magic-link account
        if (url.pathname === '/api/auth/set-password' && request.method === 'POST') {
            const authResult = await requireAuth(request, env);
            if (authResult instanceof Response) return addCors(authResult, corsHeaders);
            try {
                const body: any = await request.json();
                if (!body.password || body.password.length < 8) {
                    return addCors(new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), { status: 400 }), corsHeaders);
                }
                const hash = await hashPassword(body.password);
                await env.DB.prepare('UPDATE Users SET password_hash = ? WHERE id = ?')
                    .bind(hash, authResult.userId).run();
                return addCors(new Response(JSON.stringify({ success: true }), { status: 200 }), corsHeaders);
            } catch (e: any) {
                return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
            }
        }

        // ==================== CURRICULUM ROUTES ====================

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
                    ORDER BY t.display_order ASC, t.title ASC
                `).all();

                const topics = results.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    description: r.summary || '',
                    era: r.era || '',
                    region: r.region || '',
                    lesson_count: r.lesson_count || 0,
                }));

                return addCors(new Response(JSON.stringify(topics), {
                    status: 200, headers: { 'Content-Type': 'application/json' },
                }), corsHeaders);
            } catch (e: any) {
                console.error('[API] Topics fetch error:', e);
                return addCors(new Response(JSON.stringify({ error: e.message }), { status: 500 }), corsHeaders);
            }
        }

        // GET /api/topics/:id — topic detail with lessons + progress
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

        // ==================== EXISTING ROUTES ====================

        if (url.pathname === '/api/health') {
            return new Response(JSON.stringify({ status: 'ok', service: 'learnlive-api' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        if (url.pathname === '/api/upload' && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            try {
                const formData = await request.formData();
                const file = formData.get('file') as File | null;
                const pathPrefix = formData.get('pathPrefix') as string || 'uploads';

                if (!file) {
                    return new Response(JSON.stringify({ error: 'No file provided' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                const timestamp = Date.now();
                const filename = file.name || `file_${timestamp}`;
                const key = `${pathPrefix}/${timestamp}_${filename}`;

                const arrayBuffer = await file.arrayBuffer();
                const contentType = file.type || 'application/octet-stream';

                const uploadResult = await r2Helper.uploadFile(env.EVIDENCE_VAULT, key, arrayBuffer, contentType);

                if (uploadResult.success) {
                    return new Response(JSON.stringify(uploadResult), {
                        status: 200,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                } else {
                    return new Response(JSON.stringify(uploadResult), {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
            } catch (error: any) {
                console.error('[API Upload Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to process upload', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const learnerTasksMatch = url.pathname.match(/^\/api\/learner\/([^/]+)\/tasks$/);
        if (learnerTasksMatch && request.method === 'GET') {
            const learnerId = learnerTasksMatch[1];
            try {
                console.log(`[DB] Fetching curriculum tasks for learner: ${learnerId}`);
                const learner = await env.DB.prepare('SELECT id, name FROM Learners WHERE id = ?').bind(learnerId).first();

                if (!learner) {
                    return new Response(JSON.stringify({ error: 'Learner not found' }), {
                        status: 404,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                const query = `
                    SELECT 
                        lrs.learner_id,
                        lrs.current_arc_stage,
                        lrs.execution_count,
                        ct.id as template_id,
                        ct.capacity_id,
                        c.name as capacity_name,
                        s.name as strand_name,
                        ct.cognitive_level,
                        ct.variation_id,
                        ct.task_type,
                        ct.materials,
                        ct.scientific_materials,
                        ct.acceptable_alternatives,
                        ct.risk_level,
                        ct.safety_warning,
                        ct.parent_prompt,
                        ct.success_condition,
                        ct.failure_condition,
                        ct.reasoning_check,
                        ct.context_variants,
                        ct.requires_parent_primer
                    FROM Learner_Repetition_State lrs
                    JOIN Capacities c ON lrs.capacity_id = c.id
                    JOIN Strands s ON c.strand_id = s.id
                    JOIN Constraint_Templates ct ON ct.capacity_id = lrs.capacity_id AND ct.cognitive_level = lrs.current_cognitive_level
                    WHERE lrs.learner_id = ? AND lrs.status = 'active'
                    GROUP BY lrs.id
                `;

                const { results } = await env.DB.prepare(query).bind(learnerId).all();

                const tasks = results.map((row: any) => ({
                    id: row.template_id,
                    capacity: row.capacity_name,
                    capacity_id: row.capacity_id,
                    strand_name: row.strand_name,
                    arc_stage: row.current_arc_stage,
                    cognitive_level: row.cognitive_level,
                    task_type: row.task_type,
                    materials: row.materials,
                    scientific_materials: cachedJSONParse(row.scientific_materials),
                    acceptable_alternatives: cachedJSONParse(row.acceptable_alternatives),
                    risk_level: row.risk_level,
                    safety_warning: row.safety_warning,
                    parent_prompt: row.parent_prompt,
                    success_condition: row.success_condition,
                    failure_condition: row.failure_condition,
                    reasoning_check: row.reasoning_check,
                    context_variants: row.context_variants,
                    execution_count: row.execution_count,
                }));

                return new Response(JSON.stringify({ tasks }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [LearnerTasks Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch tasks', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const taskMatch = url.pathname.match(/^\/api\/task\/([^/]+)$/);
        if (taskMatch && request.method === 'GET') {
            const taskId = taskMatch[1];
            try {
                console.log(`[DB] Fetching task: ${taskId}`);
                const task = await env.DB.prepare('SELECT * FROM Matrix_Tasks WHERE id = ?').bind(taskId).first();

                if (!task) {
                    return new Response(JSON.stringify({ error: 'Task not found' }), {
                        status: 404,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Parse JSON fields to make them easy to use in frontend/agent
                const parsedTask = {
                    ...task,
                    constraint_to_enforce: cachedJSONParse(task.constraint_to_enforce),
                    failure_condition: cachedJSONParse(task.failure_condition),
                    success_condition: cachedJSONParse(task.success_condition),
                    role_instruction: cachedJSONParse(task.role_instruction),
                };

                return new Response(JSON.stringify(parsedTask), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [Task Fetch Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch task', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const learnerPortfolioMatch = url.pathname.match(/^\/api\/learner\/([^/]+)\/portfolio$/);
        if (learnerPortfolioMatch && request.method === 'GET') {
            const learnerId = learnerPortfolioMatch[1];
            try {
                console.log(`[DB] Fetching portfolio for learner: ${learnerId}`);

                const { results } = await env.DB.prepare(
                    `SELECT p.*, t.domain, t.capacity 
                     FROM Portfolios p 
                     JOIN Matrix_Tasks t ON p.task_id = t.id 
                     WHERE p.learner_id = ? AND p.status = 'pending' 
                     ORDER BY p.created_at DESC`
                ).bind(learnerId).all();

                return new Response(JSON.stringify({ portfolios: results }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [LearnerPortfolio Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch portfolio', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        if (url.pathname === '/api/portfolio' && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            try {
                const body: any = await request.json();
                const {
                    learnerId, taskId, summary: clientSummary, status: clientStatus,
                    evidenceUrl, aiConfidenceScore: clientConfidence,
                    imageBase64, audioTranscriptHint, sessionType = 'witness'
                } = body;

                if (!learnerId || !taskId || (!clientStatus && !imageBase64 && !audioTranscriptHint) || !evidenceUrl) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                let finalStatus = clientStatus;
                let finalSummary = clientSummary || '';
                let finalConfidence = clientConfidence || 0;

                // 0. If this is an async submission with evidence to evaluate, call the evaluation engine
                if (imageBase64 || audioTranscriptHint) {
                    // We need template/capacity details for the AI evaluator
                    // In a perfect system, Matrix_Tasks would have a template_id link. 
                    // For now, we'll try to find the template by capacity and responsibility_level if taskId isn't enough
                    const task: any = await env.DB.prepare('SELECT domain, capacity, responsibility_level FROM Matrix_Tasks WHERE id = ?').bind(taskId).first();

                    if (task && env.GEMINI_API_KEY) {
                        const template: any = await env.DB.prepare(`
                            SELECT id, parent_prompt, success_condition, failure_condition, reasoning_check 
                            FROM Constraint_Templates 
                            WHERE capacity_id = (SELECT id FROM Capacities WHERE name = ? LIMIT 1)
                            AND cognitive_level = ?
                            LIMIT 1
                        `).bind(task.capacity, task.responsibility_level.replace('L', '')).first();

                        if (template) {
                            const evalResult = await evaluateEvidence(
                                env.GEMINI_API_KEY,
                                template.id,
                                template.parent_prompt,
                                template.success_condition,
                                template.failure_condition || '',
                                template.reasoning_check,
                                task.capacity,
                                imageBase64 || null,
                                audioTranscriptHint || null
                            );

                            finalStatus = evalResult.status === 'success' ? 'success' : 'failure';
                            finalSummary = evalResult.evidence_summary;
                            finalConfidence = evalResult.confidence;
                        }
                    }
                }

                // 1. Insert Portfolio record
                await env.DB.prepare(`
                    INSERT INTO Portfolios (id, learner_id, task_id, evidence_url, ai_confidence_score, transcript_summary, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    portfolioId,
                    learnerId,
                    taskId,
                    evidenceUrl,
                    finalConfidence,
                    finalSummary,
                    'pending'
                ).run();

                // 2. Insert Session Summary for AI history
                // Find capacity_id for the learner's active capacity
                const activeCapacity: any = await env.DB.prepare(`
                    SELECT capacity_id FROM Learner_Repetition_State 
                    WHERE learner_id = ? AND status IN ('active', 'awaiting_judgment')
                    LIMIT 1
                `).bind(learnerId).first();

                if (activeCapacity) {
                    const summaryId = `sum_${Date.now()}`;
                    await env.DB.prepare(`
                        INSERT INTO Session_Summaries (id, learner_id, capacity_id, session_type, summary, ai_status)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).bind(
                        summaryId,
                        learnerId,
                        activeCapacity.capacity_id,
                        sessionType,
                        finalSummary,
                        finalStatus === 'success' ? 'success' : 'needs_revision'
                    ).run();
                }

                // 3. Update Task Status
                const newTaskStatus = finalStatus === 'success' ? 'awaiting_judgment' : 'stalled';
                await env.DB.prepare(`
                    UPDATE Matrix_Tasks SET status = ? WHERE id = ?
                `).bind(newTaskStatus, taskId).run();

                console.log(`[CORE] Portfolio created: ${portfolioId} for Task: ${taskId}, Task Status -> ${newTaskStatus}`);

                return new Response(JSON.stringify({ success: true, portfolioId }), {
                    status: 201,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });

            } catch (error: any) {
                console.error('[DB] [Portfolio Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to process portfolio entry', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const judgeMatch = url.pathname.match(/^\/api\/portfolio\/([^/]+)\/judge$/);
        if (judgeMatch && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            const portfolioId = judgeMatch[1];
            try {
                const body: any = await request.json();
                const { status, learnerId, revisionNotes } = body;

                if (!['approved', 'rejected'].includes(status) || !learnerId) {
                    return new Response(JSON.stringify({ error: 'Invalid status or missing learnerId' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                console.log(`[CORE] Judging portfolio: ${portfolioId} as ${status} for learner: ${learnerId}${revisionNotes ? ' (with notes)' : ''}`);

                // 1. Update Portfolio status + revision notes
                await env.DB.prepare(`
                    UPDATE Portfolios SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
                `).bind(status, portfolioId).run();

                // 2. If rejected with notes, store revision notes on the learner's repetition state
                if (status === 'rejected' && revisionNotes) {
                    const portfolio: any = await env.DB.prepare('SELECT task_id FROM Portfolios WHERE id = ?').bind(portfolioId).first();
                    if (portfolio?.task_id) {
                        // Re-queue the task by setting status back to active on the relevant Learner_Repetition_State
                        await env.DB.prepare(`
                            UPDATE Learner_Repetition_State 
                            SET status = 'active', last_updated = CURRENT_TIMESTAMP 
                            WHERE learner_id = ? AND status IN ('awaiting_judgment', 'active')
                        `).bind(learnerId).run();
                        console.log(`[CORE] Re-queued tasks for learner ${learnerId} with revision notes`);
                    }
                }

                // 2. Get the task_id from portfolio to update Matrix_Tasks
                const portfolio = await env.DB.prepare('SELECT task_id FROM Portfolios WHERE id = ?').bind(portfolioId).first();
                if (portfolio && portfolio.task_id) {
                    const newTaskStatus = status === 'approved' ? 'Completed' : 'Requires Revision';
                    await env.DB.prepare(`
                        UPDATE Matrix_Tasks SET status = ? WHERE id = ?
                    `).bind(newTaskStatus, portfolio.task_id).run();
                    console.log(`[CORE] Task ${portfolio.task_id} status updated to ${newTaskStatus}`);
                }

                if (status === 'approved') {
                    // 3. Determine the capacity from the portfolio's task context
                    // Try to find the capacity from Learner_Repetition_State
                    const activeState: any = await env.DB.prepare(`
                        SELECT capacity_id FROM Learner_Repetition_State
                        WHERE learner_id = ? AND status IN ('active', 'awaiting_judgment')
                        LIMIT 1
                    `).bind(learnerId).first();

                    if (activeState?.capacity_id) {
                        const arcResult = await advanceArc(env.DB, learnerId, activeState.capacity_id);
                        console.log(`[ARC] ${arcResult.message}`);
                    }
                }

                return new Response(JSON.stringify({ success: true, status }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [Portfolio Judge Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to process judgment', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const parentJudgmentsMatch = url.pathname.match(/^\/api\/parent\/([^/]+)\/judgments$/);
        if (parentJudgmentsMatch && request.method === 'GET') {
            const familyId = parentJudgmentsMatch[1];
            try {
                console.log(`[DB] Fetching pending judgments for family: ${familyId}`);
                const { results } = await env.DB.prepare(
                    `SELECT p.*, l.name as learner_name, t.domain, t.capacity 
                     FROM Portfolios p 
                     JOIN Learners l ON p.learner_id = l.id 
                     JOIN Matrix_Tasks t ON p.task_id = t.id 
                     WHERE l.family_id = ? AND p.status = 'pending' 
                     ORDER BY p.created_at DESC`
                ).bind(familyId).all();

                return new Response(JSON.stringify({ judgments: results }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [ParentJudgments Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch judgments', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const curriculumTasksMatch = url.pathname.match(/^\/api\/family\/([^/]+)\/curriculum-tasks$/);
        if (curriculumTasksMatch && request.method === 'GET') {
            const familyId = curriculumTasksMatch[1];
            try {
                console.log(`[DB] Fetching active curriculum tasks for family: ${familyId}`);
                const query = `
                    SELECT 
                        lrs.learner_id,
                        l.name as learner_name,
                        lrs.current_arc_stage,
                        lrs.execution_count,
                        ct.id as template_id,
                        ct.capacity_id,
                        c.name as capacity_name,
                        s.name as strand_name,
                        ct.cognitive_level,
                        ct.variation_id,
                        ct.task_type,
                        ct.materials,
                        ct.scientific_materials,
                        ct.acceptable_alternatives,
                        ct.risk_level,
                        ct.safety_warning,
                        ct.parent_prompt,
                        ct.success_condition,
                        ct.failure_condition,
                        ct.reasoning_check,
                        ct.context_variants,
                        ct.requires_parent_primer
                    FROM Learner_Repetition_State lrs
                    JOIN Learners l ON lrs.learner_id = l.id
                    JOIN Capacities c ON lrs.capacity_id = c.id
                    JOIN Strands s ON c.strand_id = s.id
                    JOIN Constraint_Templates ct ON ct.capacity_id = lrs.capacity_id AND ct.cognitive_level = lrs.current_cognitive_level
                    WHERE l.family_id = ? AND lrs.status = 'active'
                    GROUP BY lrs.id
                `;

                const { results } = await env.DB.prepare(query).bind(familyId).all();

                // Format the output to match LearnerRepetitionState React type
                let formattedTasks = results.map((row: any) => ({
                    learner_id: row.learner_id,
                    learner_name: row.learner_name,
                    current_arc_stage: row.current_arc_stage,
                    execution_count: row.execution_count,
                    template: {
                        id: row.template_id,
                        capacity_id: row.capacity_id,
                        capacity_name: row.capacity_name,
                        strand_name: row.strand_name,
                        cognitive_level: row.cognitive_level,
                        variation_id: row.variation_id,
                        task_type: row.task_type,
                        materials: row.materials,
                        scientific_materials: cachedJSONParse(row.scientific_materials),
                        acceptable_alternatives: cachedJSONParse(row.acceptable_alternatives),
                        risk_level: row.risk_level,
                        safety_warning: row.safety_warning,
                        parent_prompt: row.parent_prompt,
                        success_condition: row.success_condition,
                        failure_condition: row.failure_condition,
                        reasoning_check: row.reasoning_check,
                        context_variants: row.context_variants,
                        requires_parent_primer: !!row.requires_parent_primer,
                    }
                }));

                // Apply Safety Level Sorting:
                // Ensure daily schedule does not overload a single day with multiple Risk_Level_C tasks
                let hasRiskC = false;
                formattedTasks = formattedTasks.filter((task: any) => {
                    if (task.template.risk_level === 'Risk_Level_C') {
                        if (hasRiskC) return false; // Filter out subsequent Risk_Level_C tasks
                        hasRiskC = true;
                    }
                    return true;
                });

                return new Response(JSON.stringify({ tasks: formattedTasks }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [CurriculumTasks Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch curriculum tasks', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // ========== PATTERN TRACKING (Task 7.5) ==========
        const patternMatch = url.pathname.match(/^\/api\/parent\/([^/]+)\/patterns$/);
        if (patternMatch && request.method === 'GET') {
            const familyId = patternMatch[1];
            const learnerId = url.searchParams.get('learnerId');
            try {
                console.log(`[DB] Fetching patterns for family: ${familyId}`);

                // Get learners for this family
                let learnerQuery = 'SELECT id, name FROM Learners WHERE family_id = ?';
                const params: any[] = [familyId];
                if (learnerId) {
                    learnerQuery += ' AND id = ?';
                    params.push(learnerId);
                }
                const { results: learners } = await env.DB.prepare(learnerQuery).bind(...params).all();

                const patterns = [];
                for (const learner of learners) {
                    // Portfolio stats
                    const stats: any = await env.DB.prepare(`
                        SELECT 
                            COUNT(*) as total,
                            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                            AVG(ai_confidence_score) as avg_confidence
                        FROM Portfolios WHERE learner_id = ?
                    `).bind(learner.id).first();

                    // Capacity stats from Learner_Repetition_State
                    const capStats: any = await env.DB.prepare(`
                        SELECT 
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                        FROM Learner_Repetition_State WHERE learner_id = ?
                    `).bind(learner.id).first();

                    // Recent history (last 10)
                    const { results: history } = await env.DB.prepare(`
                        SELECT p.status, p.created_at, 
                            COALESCE(t.capacity, c.name, 'Unknown') as capacity_name
                        FROM Portfolios p
                        LEFT JOIN Matrix_Tasks t ON p.task_id = t.id
                        LEFT JOIN Learner_Repetition_State lrs ON p.learner_id = lrs.learner_id
                        LEFT JOIN Capacities c ON lrs.capacity_id = c.id
                        WHERE p.learner_id = ?
                        ORDER BY p.created_at DESC
                        LIMIT 10
                    `).bind(learner.id).all();

                    const total = stats?.total || 0;
                    const rejected = stats?.rejected || 0;

                    patterns.push({
                        learner_id: learner.id,
                        learner_name: learner.name,
                        total_sessions: total,
                        approved_count: stats?.approved || 0,
                        rejected_count: rejected,
                        pending_count: stats?.pending || 0,
                        avg_confidence: stats?.avg_confidence || 0,
                        active_capacities: capStats?.active || 0,
                        completed_capacities: capStats?.completed || 0,
                        revision_rate: total > 0 ? rejected / total : 0,
                        recent_history: history.map((h: any) => ({
                            capacity_name: h.capacity_name,
                            status: h.status,
                            created_at: h.created_at,
                        })),
                    });
                }

                return new Response(JSON.stringify({ patterns }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [Patterns Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch patterns', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        const generateTaskMatch = url.pathname === '/api/generate-task-variation';
        if (generateTaskMatch && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            try {
                const body: any = await request.json();
                const { seedTemplate, capacityName, cognitiveLevel } = body;

                if (!env.GEMINI_API_KEY) {
                    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                // Call Gemini using simple fetch to avoid SDK bundle issues in worker
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

                const prompt = `You are an expert curriculum designer. 
Generate a new task variation for the capacity: ${capacityName}
Cognitive Level: ${cognitiveLevel}
Here is the seed template to base it on:
${JSON.stringify(seedTemplate, null, 2)}

Create a completely new, unique variation using different materials and a slightly different scenario, but keep the core pedagogical constraint and target the same skill.
Return the result strictly as a JSON object matching the seed template's structure (include task_type, materials, parent_prompt, success_condition, failure_condition, reasoning_check). 
Do NOT include markdown formatting or backticks around the JSON.`;

                const aiResponse = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });

                if (!aiResponse.ok) {
                    throw new Error(`Gemini API Error: ${await aiResponse.text()}`);
                }

                const aiData: any = await aiResponse.json();
                const generatedVariation = JSON.parse(aiData.candidates[0].content.parts[0].text);

                return new Response(JSON.stringify({ variation: generatedVariation }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('[API Generate Task Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to generate task variation', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        const evaluateEvidenceMatch = url.pathname === '/api/evaluate-evidence';
        if (evaluateEvidenceMatch && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
            try {
                const body: any = await request.json();
                const { imageBase64, audioBase64, templateId } = body;

                if (!env.GEMINI_API_KEY) {
                    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY missing' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                // Fetch template from D1
                const template = await env.DB.prepare('SELECT success_condition, failure_condition, reasoning_check FROM Constraint_Templates WHERE id = ?').bind(templateId).first();
                if (!template) {
                    return new Response(JSON.stringify({ error: 'Template not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                const prompt = `You are a strict, objective teacher's assistant evaluating a child's submitted work.
Evaluate the following evidence against these constraints:
Success Condition: ${template.success_condition}
Failure Condition: ${template.failure_condition}
Reasoning Check: ${template.reasoning_check}

Based on the provided image of their physical work and the audio transcription of their reasoning, determine if they met the success condition.
Return a structured JSON with two fields:
- "status": exactly either "success" or "failure"
- "summary": a short encouraging 1-sentence explanation of what you saw/heard and why it was successful or needs revision.
Do not use markdown blocks.`;

                const parts: any[] = [{ text: prompt }];
                if (imageBase64) {
                    const match = imageBase64.match(/^data:(.*?);base64,(.*)$/);
                    if (match) {
                        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
                    } else {
                        parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64 } });
                    }
                }
                if (audioBase64) {
                    const match = audioBase64.match(/^data:(.*?);base64,(.*)$/);
                    if (match) {
                        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
                    } else {
                        parts.push({ inlineData: { mimeType: "audio/webm", data: audioBase64 } });
                    }
                }

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
                const aiResponse = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });

                if (!aiResponse.ok) {
                    throw new Error(`Gemini API Error: ${await aiResponse.text()}`);
                }

                const aiData: any = await aiResponse.json();
                const evalResult = JSON.parse(aiData.candidates[0].content.parts[0].text);

                return new Response(JSON.stringify({ evaluation: evalResult }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('[API Evaluate Evidence Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to evaluate evidence', details: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
        }

        // ========== TASK GENERATION ENGINE (10.3) ==========
        const genTaskMatch = url.pathname.match(/^\/api\/learner\/([^/]+)\/generate-task$/);
        if (genTaskMatch && request.method === 'POST') {
            const learnerId = genTaskMatch[1];
            try {
                const body: any = await request.json();
                const { capacityId } = body;

                if (!capacityId) {
                    return new Response(JSON.stringify({ error: 'capacityId required' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Check DAG access
                const dagResult = await resolveDependencies(env.DB, learnerId, capacityId);
                if (!dagResult.canAccess) {
                    return new Response(JSON.stringify({
                        error: 'Prerequisites not met',
                        blockedBy: dagResult.blockedBy,
                        suggestedAlternatives: dagResult.suggestedAlternatives,
                    }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }

                // Get learner's arc state
                const state: any = await env.DB.prepare(`
                    SELECT * FROM Learner_Repetition_State
                    WHERE learner_id = ? AND capacity_id = ?
                `).bind(learnerId, capacityId).first();

                if (!state) {
                    return new Response(JSON.stringify({ error: 'No state for this capacity' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Get capacity name
                const capacity: any = await env.DB.prepare('SELECT name FROM Capacities WHERE id = ?').bind(capacityId).first();

                // Get a template at the right cognitive level
                const template: any = await env.DB.prepare(`
                    SELECT * FROM Constraint_Templates
                    WHERE capacity_id = ? AND cognitive_level = ?
                    ORDER BY RANDOM() LIMIT 1
                `).bind(capacityId, state.current_cognitive_level).first();

                if (!template) {
                    return new Response(JSON.stringify({ error: 'No template found for this level' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                const task = generateTask(
                    template,
                    capacity?.name || capacityId,
                    state.current_arc_stage,
                    state.current_cognitive_level
                );

                // Get learner info for AI system instruction
                const learner: any = await env.DB.prepare('SELECT name, birth_date FROM Learners WHERE id = ?').bind(learnerId).first();
                const age = learner?.birth_date
                    ? Math.floor((Date.now() - new Date(learner.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : 7;

                const systemInstruction = generateSystemInstruction(task, learner?.name || 'Learner', age);

                return new Response(JSON.stringify({ task, systemInstruction }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } catch (error: any) {
                console.error('[API GenTask Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to generate task', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== WEEKLY PLAN ENGINE ==========
        const weeklyPlanMatch = url.pathname.match(/^\/api\/family\/([^/]+)\/weekly-plan$/);
        if (weeklyPlanMatch && request.method === 'GET') {
            const familyId = weeklyPlanMatch[1];
            const weekStart = url.searchParams.get('week') || undefined;
            try {
                console.log(`[DB] Fetching weekly plan for family: ${familyId}`);

                // Get all learners in this family
                const { results: learners } = await env.DB.prepare(
                    'SELECT id, name FROM Learners WHERE family_id = ?'
                ).bind(familyId).all();

                const plans = await Promise.all(learners.map(async (learner: any) => {
                    const plan = await getOrCreateWeeklyPlan(env.DB, learner.id, familyId, weekStart);

                    // Enrich each task with template details + AI enrichment
                    const enrichedTasks = await Promise.all(plan.tasks.map(async (task: any) => {
                        // Get template details
                        const template: any = await env.DB.prepare(`
                            SELECT ct.*, c.name as capacity_name, s.name as strand_name,
                                   lrs.current_arc_stage, lrs.current_cognitive_level
                            FROM Constraint_Templates ct
                            JOIN Capacities c ON ct.capacity_id = c.id
                            JOIN Strands s ON c.strand_id = s.id
                            LEFT JOIN Learner_Repetition_State lrs ON lrs.capacity_id = c.id AND lrs.learner_id = ?
                            WHERE ct.id = ?
                        `).bind(learner.id, task.template_id).first();

                        if (!template) return { ...task, template: null, enrichment: null };

                        // Get AI enrichment (cached)
                        const enrichment = await getEnrichedTask(
                            env.DB,
                            env.GEMINI_API_KEY,
                            task.template_id,
                            template.capacity_name,
                            template.strand_name || task.strand_name,
                            template.parent_prompt,
                            template.success_condition,
                            template.failure_condition || '',
                            template.reasoning_check,
                            template.task_type,
                            template.current_cognitive_level || template.cognitive_level,
                            template.current_arc_stage || 'Exposure',
                        );

                        return {
                            ...task,
                            template: {
                                id: template.id,
                                capacity_id: template.capacity_id,
                                capacity_name: template.capacity_name,
                                strand_name: template.strand_name || task.strand_name,
                                cognitive_level: template.cognitive_level,
                                task_type: template.task_type,
                                materials: template.materials,
                                parent_prompt: template.parent_prompt,
                                success_condition: template.success_condition,
                                failure_condition: template.failure_condition,
                                reasoning_check: template.reasoning_check,
                                arc_stage: template.current_arc_stage || 'Exposure',
                            },
                            enrichment,
                        };
                    }));

                    return {
                        ...plan,
                        tasks: enrichedTasks,
                    };
                }));

                return new Response(JSON.stringify({ plans }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error: any) {
                console.error('[DB] [WeeklyPlan Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch weekly plan', details: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // Mark weekly task complete
        const completeTaskMatch = url.pathname.match(/^\/api\/weekly-task\/([^/]+)\/complete$/);
        if (completeTaskMatch && request.method === 'POST') {
            const taskId = completeTaskMatch[1];
            try {
                await completeWeeklyTask(env.DB, taskId);
                return new Response(JSON.stringify({ success: true }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ error: 'Failed to complete task', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== FAMILY PROFILES (Task 2.2a) ==========
        const familyProfilesMatch = url.pathname.match(/^\/api\/family\/([^/]+)\/profiles$/);
        if (familyProfilesMatch && request.method === 'GET') {
            const familyId = familyProfilesMatch[1];
            try {
                console.log(`[DB] Fetching profiles for family: ${familyId}`);

                const family: any = await env.DB.prepare('SELECT id, name, parent_email FROM Families WHERE id = ?').bind(familyId).first();
                if (!family) {
                    return new Response(JSON.stringify({ error: 'Family not found' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                const { results: learners } = await env.DB.prepare(
                    'SELECT id, name, birth_date, created_at FROM Learners WHERE family_id = ? ORDER BY created_at ASC'
                ).bind(familyId).all();

                // Get active capacity counts per learner
                const profiles = await Promise.all(learners.map(async (learner: any) => {
                    const capStats: any = await env.DB.prepare(`
                        SELECT 
                            COUNT(*) as total_capacities,
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
                        FROM Learner_Repetition_State WHERE learner_id = ?
                    `).bind(learner.id).first();

                    return {
                        ...learner,
                        active_capacities: capStats?.active || 0,
                        completed_capacities: capStats?.completed || 0,
                        total_capacities: capStats?.total_capacities || 0,
                    };
                }));

                return new Response(JSON.stringify({ family, profiles }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                console.error('[DB] [FamilyProfiles Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to fetch profiles', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== PARENT PRIMER (Task 10.9) ==========
        const primerMatch = url.pathname.match(/^\/api\/primer\/([^/]+)$/);
        if (primerMatch && request.method === 'GET') {
            const templateId = primerMatch[1];
            try {
                const template: any = await env.DB.prepare(`
                    SELECT ct.*, c.name as capacity_name, c.band_id
                    FROM Constraint_Templates ct
                    JOIN Capacities c ON ct.capacity_id = c.id
                    WHERE ct.id = ?
                `).bind(templateId).first();

                if (!template) {
                    return new Response(JSON.stringify({ error: 'Template not found' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                const primer = await generateParentPrimer(
                    env.GEMINI_API_KEY,
                    template.capacity_name,
                    template.task_type,
                    template.success_condition,
                    template.cognitive_level,
                    template.band_id,
                );

                return new Response(JSON.stringify({ primer, bandId: template.band_id }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                console.error('[API Primer Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to generate primer', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== AI PERMISSION CHECK (Task 10.10) ==========
        const aiPermMatch = url.pathname.match(/^\/api\/learner\/([^/]+)\/ai-permission\/([^/]+)$/);
        if (aiPermMatch && request.method === 'GET') {
            const learnerId = aiPermMatch[1];
            const capacityId = aiPermMatch[2];
            try {
                const permission = await checkAIPermission(env.DB, learnerId, capacityId);
                return new Response(JSON.stringify({ permission }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                console.error('[API AIPermission Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to check AI permission', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== SPLIT JUDGMENT (Task 10.8) ==========
        const splitJudgeMatch = url.pathname.match(/^\/api\/portfolio\/([^/]+)\/split-judge$/);
        if (splitJudgeMatch && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const portfolioId = splitJudgeMatch[1];
            try {
                const body: any = await request.json();
                const { learnerId, formationVerdict, formationNotes, evidenceDescription, imageBase64 } = body;

                if (!learnerId || !formationVerdict) {
                    return new Response(JSON.stringify({ error: 'Missing learnerId or formationVerdict' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Get learner's band to determine judgment mode
                const learner: any = await env.DB.prepare(`
                    SELECT l.id, l.birth_date FROM Learners l WHERE l.id = ?
                `).bind(learnerId).first();

                // Determine band from active capacity
                const activeState: any = await env.DB.prepare(`
                    SELECT lrs.capacity_id, c.band_id FROM Learner_Repetition_State lrs
                    JOIN Capacities c ON lrs.capacity_id = c.id
                    WHERE lrs.learner_id = ? AND lrs.status IN ('active', 'awaiting_judgment')
                    LIMIT 1
                `).bind(learnerId).first();

                const bandId = activeState?.band_id || 'Band_2';
                const mode = getSplitJudgmentMode(bandId);

                let aiVerdict: any = null;
                if (mode === 'split' && env.GEMINI_API_KEY) {
                    // Get template for competence evaluation
                    const portfolio: any = await env.DB.prepare('SELECT task_id FROM Portfolios WHERE id = ?').bind(portfolioId).first();
                    const template: any = portfolio?.task_id
                        ? await env.DB.prepare(`
                            SELECT ct.success_condition, ct.failure_condition, ct.reasoning_check
                            FROM Constraint_Templates ct
                            JOIN Learner_Repetition_State lrs ON ct.capacity_id = lrs.capacity_id AND ct.cognitive_level = lrs.current_cognitive_level
                            WHERE lrs.learner_id = ? AND lrs.status IN ('active', 'awaiting_judgment')
                            LIMIT 1
                          `).bind(learnerId).first()
                        : null;

                    if (template) {
                        aiVerdict = await evaluateCompetence(
                            env.GEMINI_API_KEY,
                            template.success_condition,
                            template.failure_condition || '',
                            template.reasoning_check,
                            evidenceDescription || '',
                            imageBase64,
                        );
                    }
                }

                // Final verdict: in split mode, both must pass
                const competencePassed = mode === 'full_parent' || (aiVerdict?.verdict === 'pass');
                const formationPassed = formationVerdict === 'approved';
                const finalStatus = competencePassed && formationPassed ? 'approved' : 'rejected';

                // Update portfolio
                await env.DB.prepare(`
                    UPDATE Portfolios SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
                `).bind(finalStatus, portfolioId).run();

                // Progress arc if approved
                if (finalStatus === 'approved' && activeState?.capacity_id) {
                    const arcResult = await advanceArc(env.DB, learnerId, activeState.capacity_id);
                    console.log(`[SplitJudge] ${arcResult.message}`);
                }

                return new Response(JSON.stringify({
                    success: true,
                    mode,
                    finalStatus,
                    aiCompetence: aiVerdict,
                    formationVerdict,
                    formationNotes,
                }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

            } catch (error: any) {
                console.error('[API SplitJudge Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to process split judgment', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== CHILD PORTAL ACCESS LEVEL (Task 11.2) ==========
        const accessLevelGetMatch = url.pathname.match(/^\/api\/learner\/([^/]+)\/access-level$/);
        if (accessLevelGetMatch && request.method === 'GET') {
            const learnerId = accessLevelGetMatch[1];
            try {
                const learner: any = await env.DB.prepare(
                    'SELECT portal_access_level FROM Learners WHERE id = ?'
                ).bind(learnerId).first();

                return new Response(JSON.stringify({
                    accessLevel: learner?.portal_access_level || 'read_only'
                }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (error: any) {
                return new Response(JSON.stringify({ accessLevel: 'read_only' }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        if (accessLevelGetMatch && request.method === 'PUT') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            const learnerId = accessLevelGetMatch[1];
            try {
                const body: any = await request.json();
                const { accessLevel } = body;
                const valid = ['none', 'read_only', 'task_execution', 'child_led'];
                if (!valid.includes(accessLevel)) {
                    return new Response(JSON.stringify({ error: 'Invalid access level' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                await env.DB.prepare(
                    'UPDATE Learners SET portal_access_level = ? WHERE id = ?'
                ).bind(accessLevel, learnerId).run();

                console.log(`[PORTAL] Access level for ${learnerId} set to ${accessLevel}`);
                return new Response(JSON.stringify({ success: true, accessLevel }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                console.error('[API AccessLevel Error]', error);
                return new Response(JSON.stringify({ error: 'Failed to update access level', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== DIAGRAM GENERATION (Task 13.9) ==========
        if (url.pathname === '/api/generate-diagram' && request.method === 'POST') {
            if (!isAuthorized(request, env)) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            try {
                const body: any = await request.json();
                if (!env.GEMINI_API_KEY) {
                    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
                        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
                const result = await generateDiagram(env.GEMINI_API_KEY, body.prompt || '');
                return new Response(JSON.stringify(result), {
                    status: result.imageUrl ? 200 : 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ error: 'Diagram generation failed', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== FAMILY REGISTRATION (Pilot) ==========
        if (url.pathname === '/api/family/register' && request.method === 'POST') {
            try {
                const body: any = await request.json();
                const { familyName, children, familyPin, inviteCode } = body;

                // P1: Require invite code for pilot registration
                const PILOT_INVITE_CODE = env.PILOT_INVITE_CODE || 'LEARNLIVE2026';
                if (!inviteCode || inviteCode !== PILOT_INVITE_CODE) {
                    return new Response(JSON.stringify({ error: 'Valid invite code required for pilot access' }), {
                        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                if (!familyName || !Array.isArray(children) || children.length === 0 || !familyPin) {
                    return new Response(JSON.stringify({ error: 'familyName, children[], familyPin, and inviteCode are required' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Validate family name length
                if (familyName.trim().length < 2 || familyName.trim().length > 100) {
                    return new Response(JSON.stringify({ error: 'Family name must be 2-100 characters' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                if (familyPin.length !== 4 || !/^\d{4}$/.test(familyPin)) {
                    return new Response(JSON.stringify({ error: 'PIN must be exactly 4 digits' }), {
                        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                for (const child of children) {
                    if (!child.name || typeof child.name !== 'string' || child.name.trim().length < 1 || child.name.trim().length > 50) {
                        return new Response(JSON.stringify({ error: 'Each child needs a name (1-50 chars)' }), {
                            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        });
                    }
                    if (typeof child.age !== 'number' || child.age < 6 || child.age > 9) {
                        return new Response(JSON.stringify({ error: 'Each child must be 6-9 years old for Band 2 pilot' }), {
                            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                        });
                    }
                }

                // P1: Generate 8-character family code (increased from 4 for security)
                const familyCode = 'LL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                const familyId = `family_${familyCode.toLowerCase().replace(/-/g, '_')}`;
                const placeholderEmail = `${familyId}@pilot.learnlive.app`;

                await env.DB.prepare(
                    'INSERT INTO Families (id, name, parent_email) VALUES (?, ?, ?)'
                ).bind(familyId, familyName, placeholderEmail).run();

                const learnerIds: string[] = [];
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    const learnerId = `${familyId}_child_${i + 1}`;
                    const childPin = child.pin || familyPin;
                    learnerIds.push(learnerId);

                    await env.DB.prepare(
                        'INSERT INTO Learners (id, family_id, name, pin_code) VALUES (?, ?, ?, ?)'
                    ).bind(learnerId, familyId, child.name, childPin).run();

                    const initialCapacities = ['D1', 'B2', 'G2a'];
                    for (const capId of initialCapacities) {
                        const stateId = `state_${learnerId}_${capId}`;
                        await env.DB.prepare(
                            `INSERT INTO Learner_Repetition_State (id, learner_id, capacity_id, current_cognitive_level, current_arc_stage, execution_count, status)
                             VALUES (?, ?, ?, 1, 'Exposure', 0, 'active')`
                        ).bind(stateId, learnerId, capId).run();
                    }
                }

                console.log(`[PILOT] Registered family ${familyName} with code ${familyCode}`);

                return new Response(JSON.stringify({
                    success: true, familyCode, familyId, familyName, learnerIds,
                    message: `Your family code is ${familyCode}. Use it to sign in!`
                }), {
                    status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                console.error('[API Register Error]', error);
                return new Response(JSON.stringify({ error: 'Registration failed', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== FAMILY LOOKUP BY CODE ==========
        const familyCodeMatch = url.pathname.match(/^\/api\/family\/code\/([^/]+)\/profiles$/);
        if (familyCodeMatch && request.method === 'GET') {
            const code = familyCodeMatch[1].toUpperCase();
            const familyId = `family_${code.toLowerCase().replace(/-/g, '_')}`;
            try {
                const family = await env.DB.prepare('SELECT id, name FROM Families WHERE id = ?').bind(familyId).first();
                if (!family) {
                    return new Response(JSON.stringify({ error: 'Family not found. Check your code.' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
                const { results: learners } = await env.DB.prepare(
                    'SELECT id, name FROM Learners WHERE family_id = ?'
                ).bind(familyId).all();

                return new Response(JSON.stringify({
                    familyId: family.id, familyName: family.name,
                    profiles: [
                        { id: `parent_${familyId}`, name: 'Parent', role: 'parent', pin: null },
                        ...learners.map((l: any) => ({ id: l.id, name: l.name, role: 'learner', pin: null }))
                    ]
                }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ error: 'Lookup failed', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== FAMILY LOOKUP BY ID ==========
        const familyIdMatch = url.pathname.match(/^\/api\/family\/([^/]+)\/profiles$/);
        if (familyIdMatch && request.method === 'GET') {
            const fId = familyIdMatch[1];
            try {
                const family = await env.DB.prepare('SELECT id, name FROM Families WHERE id = ?').bind(fId).first();
                if (!family) {
                    return new Response(JSON.stringify({ error: 'Family not found' }), {
                        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }
                const { results: learners } = await env.DB.prepare(
                    'SELECT id, name FROM Learners WHERE family_id = ?'
                ).bind(fId).all();

                return new Response(JSON.stringify({
                    familyId: family.id, familyName: family.name,
                    profiles: [
                        { id: `parent_${fId}`, name: 'Parent', role: 'parent', pin: null },
                        ...learners.map((l: any) => ({ id: l.id, name: l.name, role: 'learner', pin: null }))
                    ]
                }), {
                    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            } catch (error: any) {
                return new Response(JSON.stringify({ error: 'Lookup failed', details: error.message }), {
                    status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ========== VERIFY PIN ==========
        if (url.pathname === '/api/family/verify-pin' && request.method === 'POST') {
            try {
                const body: any = await request.json();
                const { learnerId, pin } = body;
                if (!learnerId || !pin) {
                    return new Response(JSON.stringify({ error: 'Missing learnerId or pin' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                const learner: any = await env.DB.prepare('SELECT pin_code FROM Learners WHERE id = ?').bind(learnerId).first();
                if (!learner) {
                    return new Response(JSON.stringify({ error: 'Learner not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
                if (learner.pin_code === pin) {
                    return new Response(JSON.stringify({ valid: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                } else {
                    return new Response(JSON.stringify({ valid: false }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
                }
            } catch (err: any) {
                return new Response(JSON.stringify({ error: 'Verification failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            }
        }

        // Default 404
        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};
