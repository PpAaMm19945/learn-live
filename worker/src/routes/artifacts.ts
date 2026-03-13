import { Env } from '../index';
import { r2Helper } from '../lib/r2';
import { evaluateArtifact } from '../lib/examiner/artifact';
import { logActivity } from '../lib/analytics/logger';

// POST /api/artifacts/upload
export async function handleUploadArtifact(request: Request, env: Env, userId?: string): Promise<Response> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const timestamp = Date.now();
        const filename = file.name || `artifact_${timestamp}`;
        const key = `artifacts/${timestamp}_${filename}`;

        const arrayBuffer = await file.arrayBuffer();
        const contentType = file.type || 'application/octet-stream';

        // Check if file is HEIC, PNG, JPEG, etc.
        const validFormats = ['image/jpeg', 'image/png', 'image/heic'];
        if (!validFormats.includes(contentType)) {
            console.log(`[Artifact Upload] Warning: Unsupported image format ${contentType}`);
        }

        const uploadResult = await r2Helper.uploadFile(env.EVIDENCE_VAULT, key, arrayBuffer, contentType);

        if (uploadResult.success) {
            if (userId) {
                logActivity(env, userId, 'artifact_uploaded', 'artifact', uploadResult.key);
            }
            return new Response(JSON.stringify({ r2_key: uploadResult.key }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ error: uploadResult.error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error: any) {
        console.error('[API Artifact Upload Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to process artifact upload', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// POST /api/artifacts/verify
export async function handleVerifyArtifact(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const body: any = await request.json();
        const { r2_key, lesson_id, band } = body;

        if (!r2_key || !lesson_id || band === undefined) {
            return new Response(JSON.stringify({ error: 'Missing r2_key, lesson_id, or band' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call the AI evaluator
        const assessment = await evaluateArtifact(env, lesson_id, band, r2_key);

        // Save draft to DB
        const id = `art_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        await env.DB.prepare(`
            INSERT INTO Artifacts (id, user_id, lesson_id, r2_key, status, score, feedback, areas_to_improve)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            userId,
            lesson_id,
            r2_key,
            assessment.status, // Always 'draft' from AI
            assessment.score,
            assessment.feedback,
            assessment.areas_to_improve
        ).run();

        return new Response(JSON.stringify({ success: true, artifactId: id, assessment }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('[API Artifact Verify Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to verify artifact', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// GET /api/artifacts?lesson_id=X
export async function handleListArtifacts(request: Request, env: Env, userId: string): Promise<Response> {
    try {
        const url = new URL(request.url);
        const lesson_id = url.searchParams.get('lesson_id');

        if (!lesson_id) {
            return new Response(JSON.stringify({ error: 'Missing lesson_id parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { results: artifacts } = await env.DB.prepare(`
            SELECT id, user_id, lesson_id, r2_key, status, score, feedback, areas_to_improve, created_at
            FROM Artifacts
            WHERE user_id = ? AND lesson_id = ?
            ORDER BY created_at DESC
        `).bind(userId, lesson_id).all<any>();

        return new Response(JSON.stringify({ artifacts }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('[API Artifact List Error]', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch artifacts', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
