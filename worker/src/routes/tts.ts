import type { Env } from '../index';
import { addCors } from '../index';
import { requireAdmin } from '../lib/auth/roles';

/**
 * Admin-only TTS routes.
 * Proxies Google Cloud Text-to-Speech API and uploads audio to R2.
 */
export async function handleTtsRoutes(
    request: Request,
    env: Env,
    corsHeaders: Record<string, string>
): Promise<Response | null> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (!path.startsWith('/api/admin/tts')) return null;

    // Require admin for all TTS routes
    const authResult = await requireAdmin(request, env);
    if (authResult instanceof Response) return addCors(authResult, corsHeaders);

    // -------------------------------------------------------
    // GET /api/admin/tts/voices — List available TTS voices
    // -------------------------------------------------------
    if (path === '/api/admin/tts/voices' && method === 'GET') {
        try {
            if (!env.GOOGLE_TTS_KEY) {
                return addCors(new Response(JSON.stringify({ error: 'GOOGLE_TTS_KEY not configured' }), {
                    status: 500, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const res = await fetch(
                `https://texttospeech.googleapis.com/v1/voices?key=${env.GOOGLE_TTS_KEY}&languageCode=en-US`
            );
            if (!res.ok) {
                const errText = await res.text();
                return addCors(new Response(JSON.stringify({ error: 'TTS API error', details: errText }), {
                    status: res.status, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const data = await res.json() as { voices: Array<{ name: string; ssmlGender: string; naturalSampleRateHertz: number }> };
            // Filter to only Studio and Neural voices for quality
            const filtered = (data.voices || [])
                .filter((v: any) => v.name.startsWith('en-US'))
                .map((v: any) => ({
                    name: v.name,
                    gender: v.ssmlGender,
                    sampleRate: v.naturalSampleRateHertz,
                }));

            return addCors(new Response(JSON.stringify({ voices: filtered }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        } catch (e: any) {
            console.error('[TTS Voices Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }
    }

    // -------------------------------------------------------
    // POST /api/admin/tts/generate — Generate audio for a single cue
    // Body: { text, audioFileId, voiceName?, speakingRate?, ssml? }
    // -------------------------------------------------------
    if (path === '/api/admin/tts/generate' && method === 'POST') {
        try {
            if (!env.GOOGLE_TTS_KEY) {
                return addCors(new Response(JSON.stringify({ error: 'GOOGLE_TTS_KEY not configured' }), {
                    status: 500, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const body = await request.json() as {
                text: string;
                audioFileId: string;
                voiceName?: string;
                speakingRate?: number;
                ssml?: string;
            };

            if (!body.text || !body.audioFileId) {
                return addCors(new Response(JSON.stringify({ error: 'Missing text or audioFileId' }), {
                    status: 400, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            // Build TTS request
            const input = body.ssml
                ? { ssml: body.ssml }
                : { text: body.text.replace(/\*\*/g, '').replace(/[#>_`]/g, '') }; // strip markdown

            const ttsPayload = {
                input,
                voice: {
                    languageCode: 'en-US',
                    name: body.voiceName || 'en-US-Studio-O', // warm male narrator default
                },
                audioConfig: {
                    audioEncoding: 'MP3' as const,
                    speakingRate: body.speakingRate || 0.95,
                    pitch: 0,
                },
            };

            const ttsRes = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ttsPayload),
                }
            );

            if (!ttsRes.ok) {
                const errText = await ttsRes.text();
                return addCors(new Response(JSON.stringify({ error: 'TTS generation failed', details: errText }), {
                    status: ttsRes.status, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const ttsData = await ttsRes.json() as { audioContent: string };
            const audioBase64 = ttsData.audioContent;

            // Decode base64 to binary and upload to R2
            const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
            const r2Key = `audio/${body.audioFileId}.mp3`;

            await env.ASSETS_BUCKET.put(r2Key, audioBytes, {
                httpMetadata: { contentType: 'audio/mpeg' },
            });

            return addCors(new Response(JSON.stringify({
                success: true,
                audioFileId: body.audioFileId,
                r2Key,
                sizeBytes: audioBytes.length,
                previewBase64: audioBase64.substring(0, 200) + '...', // preview snippet
            }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        } catch (e: any) {
            console.error('[TTS Generate Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }
    }

    // -------------------------------------------------------
    // POST /api/admin/tts/batch — Generate audio for multiple cues
    // Body: { cues: Array<{ text, audioFileId }>, voiceName?, speakingRate? }
    // -------------------------------------------------------
    if (path === '/api/admin/tts/batch' && method === 'POST') {
        try {
            if (!env.GOOGLE_TTS_KEY) {
                return addCors(new Response(JSON.stringify({ error: 'GOOGLE_TTS_KEY not configured' }), {
                    status: 500, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const body = await request.json() as {
                cues: Array<{ text: string; audioFileId: string }>;
                voiceName?: string;
                speakingRate?: number;
            };

            if (!body.cues || body.cues.length === 0) {
                return addCors(new Response(JSON.stringify({ error: 'No cues provided' }), {
                    status: 400, headers: { 'Content-Type': 'application/json' }
                }), corsHeaders);
            }

            const results: Array<{ audioFileId: string; success: boolean; sizeBytes?: number; error?: string }> = [];

            for (const cue of body.cues) {
                try {
                    const ttsPayload = {
                        input: { text: cue.text.replace(/\*\*/g, '').replace(/[#>_`]/g, '') },
                        voice: {
                            languageCode: 'en-US',
                            name: body.voiceName || 'en-US-Studio-O',
                        },
                        audioConfig: {
                            audioEncoding: 'MP3' as const,
                            speakingRate: body.speakingRate || 0.95,
                            pitch: 0,
                        },
                    };

                    const ttsRes = await fetch(
                        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_TTS_KEY}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(ttsPayload),
                        }
                    );

                    if (!ttsRes.ok) {
                        const errText = await ttsRes.text();
                        results.push({ audioFileId: cue.audioFileId, success: false, error: errText });
                        continue;
                    }

                    const ttsData = await ttsRes.json() as { audioContent: string };
                    const audioBytes = Uint8Array.from(atob(ttsData.audioContent), c => c.charCodeAt(0));
                    const r2Key = `audio/${cue.audioFileId}.mp3`;

                    await env.ASSETS_BUCKET.put(r2Key, audioBytes, {
                        httpMetadata: { contentType: 'audio/mpeg' },
                    });

                    results.push({ audioFileId: cue.audioFileId, success: true, sizeBytes: audioBytes.length });
                } catch (cueErr: any) {
                    results.push({ audioFileId: cue.audioFileId, success: false, error: cueErr.message });
                }
            }

            const successCount = results.filter(r => r.success).length;
            return addCors(new Response(JSON.stringify({
                total: body.cues.length,
                success: successCount,
                failed: body.cues.length - successCount,
                results,
            }), {
                headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        } catch (e: any) {
            console.error('[TTS Batch Error]', e);
            return addCors(new Response(JSON.stringify({ error: e.message }), {
                status: 500, headers: { 'Content-Type': 'application/json' }
            }), corsHeaders);
        }
    }

    // -------------------------------------------------------
    // GET /api/admin/tts/status/:audioFileId — Check if audio exists in R2
    // -------------------------------------------------------
    const statusMatch = path.match(/^\/api\/admin\/tts\/status\/(.+)$/);
    if (statusMatch && method === 'GET') {
        const audioFileId = statusMatch[1];
        const r2Key = `audio/${audioFileId}.mp3`;
        const head = await env.ASSETS_BUCKET.head(r2Key);

        return addCors(new Response(JSON.stringify({
            audioFileId,
            exists: !!head,
            sizeBytes: head?.size || null,
            uploaded: head?.uploaded?.toISOString() || null,
        }), {
            headers: { 'Content-Type': 'application/json' }
        }), corsHeaders);
    }

    return null;
}
