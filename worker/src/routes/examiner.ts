import { Env } from '../index';

export async function handleStartExam(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const body = await request.json() as { lesson_id: string; band: number };
        const { lesson_id, band } = body;

        if (!lesson_id || typeof band !== 'number') {
            return new Response(JSON.stringify({ error: 'lesson_id and band are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sessionId = `exam_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();

        await env.DB.prepare(`
            INSERT INTO Exam_Sessions (id, user_id, lesson_id, band, status, started_at)
            VALUES (?, ?, ?, ?, 'active', ?)
        `).bind(sessionId, userId, lesson_id, band, now).run();

        // Initial agent configuration (placeholder for now)
        const agentConfig = {
            systemPrompt: `You are an Oral Examiner for a history lesson. Ask age-appropriate questions based on the master text for band ${band}.`,
            greeting: `Hello! I'm ready to talk about what you learned. Let's get started.`,
        };

        return new Response(JSON.stringify({ sessionId, agentConfig }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[API StartExam Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to start exam session', details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function handleListExams(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const url = new URL(request.url);
        const lesson_id = url.searchParams.get('lesson_id');

        if (!lesson_id) {
            return new Response(JSON.stringify({ error: 'lesson_id query parameter is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { results } = await env.DB.prepare(`
            SELECT id, lesson_id, band, status, started_at, completed_at, parent_approved
            FROM Exam_Sessions
            WHERE user_id = ? AND lesson_id = ?
            ORDER BY started_at DESC
        `).bind(userId, lesson_id).all();

        return new Response(JSON.stringify({ sessions: results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[API ListExams Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to list exam sessions', details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function handleGetExamSession(request: Request, env: Env, userId: string, sessionId: string): Promise<Response> {
    try {
        const session = await env.DB.prepare(`
            SELECT id, lesson_id, band, status, started_at, completed_at, ai_assessment_draft, parent_review, parent_approved
            FROM Exam_Sessions
            WHERE id = ? AND user_id = ?
        `).bind(sessionId, userId).first();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Exam session not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Try to parse JSON fields if they exist
        const parsedSession = {
            ...session,
            ai_assessment_draft: session.ai_assessment_draft ? JSON.parse(session.ai_assessment_draft as string) : null,
            parent_review: session.parent_review ? JSON.parse(session.parent_review as string) : null,
        };

        return new Response(JSON.stringify({ session: parsedSession }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[API GetExamSession Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve exam session', details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function handleCompleteExam(request: Request, env: Env, userId: string, sessionId: string): Promise<Response> {
    try {
        const body = await request.json() as { ai_assessment_draft: unknown };
        const { ai_assessment_draft } = body;

        // Verify session belongs to user and is active
        const session = await env.DB.prepare(`
            SELECT status FROM Exam_Sessions WHERE id = ? AND user_id = ?
        `).bind(sessionId, userId).first();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Exam session not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (session.status !== 'active') {
            return new Response(JSON.stringify({ error: 'Exam session is not active' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const now = new Date().toISOString();
        const assessmentStr = ai_assessment_draft ? JSON.stringify(ai_assessment_draft) : null;

        await env.DB.prepare(`
            UPDATE Exam_Sessions
            SET status = 'completed', completed_at = ?, ai_assessment_draft = ?
            WHERE id = ? AND user_id = ?
        `).bind(now, assessmentStr, sessionId, userId).run();

        return new Response(JSON.stringify({ success: true, message: 'Exam session completed successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[API CompleteExam Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to complete exam session', details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function handleReviewExam(request: Request, env: Env, userId: string, sessionId: string): Promise<Response> {
    try {
        const body = await request.json() as { parent_approved: boolean; parent_review: unknown };
        const { parent_approved, parent_review } = body;

        if (typeof parent_approved !== 'boolean') {
            return new Response(JSON.stringify({ error: 'parent_approved boolean is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verify session belongs to user and is completed
        const session = await env.DB.prepare(`
            SELECT status FROM Exam_Sessions WHERE id = ? AND user_id = ?
        `).bind(sessionId, userId).first();

        if (!session) {
            return new Response(JSON.stringify({ error: 'Exam session not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (session.status !== 'completed' && session.status !== 'reviewed') {
            return new Response(JSON.stringify({ error: 'Exam session must be completed before reviewing' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const reviewStr = parent_review ? JSON.stringify(parent_review) : null;

        await env.DB.prepare(`
            UPDATE Exam_Sessions
            SET status = 'reviewed', parent_approved = ?, parent_review = ?
            WHERE id = ? AND user_id = ?
        `).bind(parent_approved ? 1 : 0, reviewStr, sessionId, userId).run();

        return new Response(JSON.stringify({ success: true, message: 'Exam session reviewed successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: unknown) {
        console.error('[API ReviewExam Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to review exam session', details: error instanceof Error ? error.message : String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
