import { r2Helper } from './lib/r2';

// Cache for parsed JSON fields to avoid redundant parsing overhead
const jsonCache = new Map<string, any>();

/**
 * Parses a JSON string and caches the result.
 * If the string has been parsed before, returns the cached object.
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
    API_AUTH_TOKEN?: string;
    GEMINI_API_KEY?: string;
}

function isAuthorized(request: Request, env: Env): boolean {
    const authHeader = request.headers.get('Authorization');
    const expectedToken = env.API_AUTH_TOKEN || 'development_secret_token';
    return authHeader === `Bearer ${expectedToken}`;
}

async function advanceLearner(db: D1Database, learnerId: string) {
    try {
        // Hackathon Simplification: Determine responsibility level
        const responsibilityLevel = learnerId === 'learner_azie' ? 'L2' : 'L1';

        // Find the next stalled task for this learner
        const stalledTask: any = await db.prepare(`
            SELECT id FROM Matrix_Tasks 
            WHERE responsibility_level = ? AND status = 'stalled' 
            LIMIT 1
        `).bind(responsibilityLevel).first();

        if (stalledTask && stalledTask.id) {
            // For Matrix_Tasks, we don't have risk_level directly. If we were using Learner_Repetition_State, we would filter it.
            // But since MVP uses Matrix_Tasks for the progression demo, we'll just activate it.
            // In a full implementation, the logic above checks Learner_Repetition_State.
            // We apply it here conceptually.
            await db.prepare(`
                UPDATE Matrix_Tasks SET status = 'active' WHERE id = ?
            `).bind(stalledTask.id).run();
            console.log(`[MATRIX] Learner ${learnerId} advanced to Task ${stalledTask.id}`);
        } else {
            console.log(`[MATRIX] Learner ${learnerId} has no further stalled tasks to advance to.`);
        }
    } catch (error) {
        console.error(`[MATRIX] Error advancing learner ${learnerId}:`, error);
    }
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
                const { learnerId, taskId, summary, status, evidenceUrl, aiConfidenceScore } = body;

                if (!learnerId || !taskId || !status || !evidenceUrl) {
                    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Execute sequentially as transactions aren't fully robust across all D1 versions yet
                const portfolioId = `port_${Date.now()}`;

                // 1. Insert Portfolio record
                await env.DB.prepare(`
                    INSERT INTO Portfolios (id, learner_id, task_id, evidence_url, ai_confidence_score, transcript_summary, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    portfolioId,
                    learnerId,
                    taskId,
                    evidenceUrl,
                    aiConfidenceScore || 0,
                    summary || '',
                    'pending'
                ).run();

                // 2. Update Task Status
                const newTaskStatus = status === 'success' ? 'awaiting_judgment' : 'stalled';
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
                const { status, learnerId } = body;

                if (!['approved', 'rejected'].includes(status) || !learnerId) {
                    return new Response(JSON.stringify({ error: 'Invalid status or missing learnerId' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                console.log(`[CORE] Judging portfolio: ${portfolioId} as ${status} for learner: ${learnerId}`);

                // 1. Update Portfolio status
                await env.DB.prepare(`
                    UPDATE Portfolios SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
                `).bind(status, portfolioId).run();

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
                    // 3. Trigger progression logic for MVP
                    await advanceLearner(env.DB, learnerId);
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

        // Default 404
        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};
