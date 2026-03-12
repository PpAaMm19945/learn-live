import type { Env } from '../../index';

export type ActivityAction =
    | 'lesson_completed'
    | 'exam_started'
    | 'exam_completed'
    | 'artifact_uploaded'
    | 'login'
    | 'content_viewed';

export function logActivity(
    env: Env,
    userId: string,
    action: ActivityAction,
    resourceType?: string,
    resourceId?: string,
    metadata?: Record<string, any>
): void {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const metadataStr = metadata ? JSON.stringify(metadata) : null;

    const promise = env.DB.prepare(`
        INSERT INTO Activity_Log (id, user_id, action, resource_type, resource_id, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(id, userId, action, resourceType || null, resourceId || null, metadataStr)
    .run()
    .catch(err => {
        // Silently log error, do not fail main request
        console.error('[Analytics] Failed to log activity:', err);
    });

    // In a Cloudflare Worker `fetch` handler context, `env` sometimes includes ctx
    // We try to use waitUntil if it's available, otherwise we just let the Promise run (fire-and-forget).
    const ctx = (env as any).ctx;
    if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(promise);
    }
}
