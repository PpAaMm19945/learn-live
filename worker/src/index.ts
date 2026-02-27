import { r2Helper } from './lib/r2';

export interface Env {
    DB: D1Database;
    EVIDENCE_VAULT: R2Bucket;
    API_AUTH_TOKEN?: string;
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
            const authHeader = request.headers.get('Authorization');
            const expectedToken = env.API_AUTH_TOKEN || 'development_secret_token';
            if (authHeader !== `Bearer ${expectedToken}`) {
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
                console.log(`[DB] Fetching learner record for: ${learnerId}`);
                const learner = await env.DB.prepare('SELECT id FROM Learners WHERE id = ?').bind(learnerId).first();

                if (!learner) {
                    return new Response(JSON.stringify({ error: 'Learner not found' }), {
                        status: 404,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }

                // Temporary mapping as per prompt instructions
                const responsibilityLevel = learnerId === 'learner_azie' ? 'L2' : 'L1';

                console.log(`[DB] Fetching Matrix_Tasks for responsibility_level: ${responsibilityLevel}`);
                const { results } = await env.DB.prepare(
                    'SELECT * FROM Matrix_Tasks WHERE responsibility_level = ?'
                )
                    .bind(responsibilityLevel)
                    .all();

                // Parse JSON fields to make them easy to use in frontend
                const tasks = results.map((task: any) => ({
                    ...task,
                    constraint_to_enforce: task.constraint_to_enforce ? JSON.parse(task.constraint_to_enforce) : null,
                    failure_condition: task.failure_condition ? JSON.parse(task.failure_condition) : null,
                    success_condition: task.success_condition ? JSON.parse(task.success_condition) : null,
                    role_instruction: task.role_instruction ? JSON.parse(task.role_instruction) : null,
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
                    constraint_to_enforce: task.constraint_to_enforce ? JSON.parse(task.constraint_to_enforce as string) : null,
                    failure_condition: task.failure_condition ? JSON.parse(task.failure_condition as string) : null,
                    success_condition: task.success_condition ? JSON.parse(task.success_condition as string) : null,
                    role_instruction: task.role_instruction ? JSON.parse(task.role_instruction as string) : null,
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

        // Default 404
        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};
