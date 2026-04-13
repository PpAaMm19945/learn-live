import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { checkRateLimit, recordSession } from './rateLimit';
import { fetchAndAssembleInstruction } from './constraints';
import { GeminiSession } from './gemini';
import { handleExplainerSession } from './explainerSession';
import { handleHistoryExplainerSession } from './historyExplainerSession';
import { resolveHistorySessionParams, HistorySessionParamError } from './historySessionContract';

dotenv.config();

if (!process.env.AGENT_SERVICE_KEY) {
    console.error('[FATAL] AGENT_SERVICE_KEY is not set. Refusing to start.');
    process.exit(1);
}

const app = express();
const server = createServer(app);
const witnessWss = new WebSocketServer({ noServer: true });
const explainerWss = new WebSocketServer({ noServer: true });
const historyExplainerWss = new WebSocketServer({ noServer: true });

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'learnlive-agent' });
});

server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

    if (pathname === '/v1/agent/session') {
        witnessWss.handleUpgrade(request, socket, head, (ws) => {
            witnessWss.emit('connection', ws, request);
        });
    } else if (pathname === '/v1/agent/explainer') {
        explainerWss.handleUpgrade(request, socket, head, (ws) => {
            explainerWss.emit('connection', ws, request);
        });
    } else if (pathname === '/v1/agent/history-explainer' || pathname === '/ws/history-explainer') {
        const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
        try {
            resolveHistorySessionParams(searchParams);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid history session query parameters';
            socket.write(`HTTP/1.1 400 Bad Request\r\n\r\n${message}`);
            socket.destroy();
            return;
        }

        historyExplainerWss.handleUpgrade(request, socket, head, (ws) => {
            historyExplainerWss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// ─── Evidence Witness WebSocket ───
witnessWss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    const taskId = searchParams.get('taskId');
    const familyId = searchParams.get('familyId');
    const learnerId = searchParams.get('learnerId');

    console.log(`[AGENT] Witness session initiated — learner: ${learnerId}, task: ${taskId}`);

    if (!taskId || !familyId) {
        ws.send(JSON.stringify({ error: 'Missing taskId or familyId' }));
        ws.close();
        return;
    }

    if (!checkRateLimit(familyId)) {
        ws.send(JSON.stringify({ error: 'Daily session limit reached' }));
        ws.close();
        return;
    }

    let systemInstruction = '';
    try {
        // Fetch task constraint + inject learner context if available
        const baseInstruction = await fetchAndAssembleInstruction(taskId);
        systemInstruction = buildWitnessInstruction(baseInstruction, learnerId);
    } catch (e: any) {
        if (e.message === 'INVALID_CONSTRAINT') {
            console.error(`[AGENT] ⛔ INVALID CONSTRAINT — blocking session for task: ${taskId}`);
            ws.send(JSON.stringify({ error: 'Invalid constraint' }));
        } else {
            console.error(`[AGENT] Error fetching constraints: ${e.message}`);
            ws.send(JSON.stringify({ error: 'Failed to fetch constraints' }));
        }
        ws.close();
        return;
    }

    const geminiSession = new GeminiSession(systemInstruction, [{
        name: 'evaluate_constraint',
        description: 'Evaluate if the physical work meets the required constraint.',
        parameters: {
            type: 'OBJECT',
            properties: {
                status: { type: 'STRING', enum: ['success', 'failure'] },
                summary: { type: 'STRING' }
            },
            required: ['status', 'summary']
        }
    }]);
    try {
        await geminiSession.connect();
    } catch (e: any) {
        console.error(`[AGENT] Gemini connect failed for witness session: ${e.message}`);
        ws.send(JSON.stringify({ error: 'Teacher is temporarily unavailable' }));
        ws.close();
        return;
    }
    recordSession(familyId);

    geminiSession.onResponse((data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
            if (data.type === 'functionCall' && data.name === 'evaluate_constraint') {
                console.log(`[AGENT] evaluate_constraint received for task: ${taskId} — status: ${data.args.status}`);
                ws.send(JSON.stringify({
                    type: 'session_end',
                    reason: data.args.status === 'success' ? 'success' : 'failure',
                    summary: data.args.summary || 'Session completed.',
                }));
                // Complete tool call loop and give AI time to say goodbye
                geminiSession.sendToolResponse([{
                    id: data.id,
                    name: 'evaluate_constraint',
                    response: { acknowledged: true }
                }]);
                setTimeout(() => ws.close(), 5000);
            } else {
                ws.send(JSON.stringify(data));
            }
        }
    });

    ws.on('message', (message: Buffer) => {
        try {
            const msg = JSON.parse(message.toString());
            if (msg.type === 'audio' && msg.data) {
                geminiSession.sendAudio(Buffer.from(msg.data, 'base64'));
            } else if (msg.type === 'image' && msg.data) {
                geminiSession.sendImage(msg.data);
            }
        } catch (e) {
            console.error('[AGENT] Bad message from client:', e);
        }
    });

    ws.on('close', () => {
        console.log(`[AGENT] Witness session closed — learner: ${learnerId}, task: ${taskId}`);
        geminiSession.close();
    });

    ws.on('error', (err) => {
        console.error(`[AGENT] Witness WebSocket error:`, err);
        geminiSession.close();
    });
});

// ─── Explainer Agent WebSocket ───
explainerWss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    const taskId = searchParams.get('taskId');
    const familyId = searchParams.get('familyId');
    const learnerId = searchParams.get('learnerId');

    console.log(`[AGENT] Explainer session initiated — learner: ${learnerId}, task: ${taskId}`);

    if (!taskId || !familyId) {
        ws.send(JSON.stringify({ error: 'Missing taskId or familyId' }));
        ws.close();
        return;
    }

    if (!checkRateLimit(familyId)) {
        ws.send(JSON.stringify({ error: 'Daily session limit reached' }));
        ws.close();
        return;
    }

    handleExplainerSession(ws, taskId, familyId, learnerId || 'unknown');
});

// ─── History Explainer WebSocket ───
historyExplainerWss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    try {
        const params = resolveHistorySessionParams(searchParams);
        console.log(`[WS] Client connected: lesson=${params.canonicalLessonId} band=${params.band}`);
        console.log(`[AGENT] History Explainer session initiated — learner: ${params.learnerId}, lesson: ${params.canonicalLessonId}, band: ${params.band}`);

        if (!checkRateLimit(params.familyId)) {
            ws.send(JSON.stringify({ error: 'Daily session limit reached' }));
            ws.close();
            return;
        }

        handleHistoryExplainerSession(ws, params);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid history session query parameters';
        const code = err instanceof HistorySessionParamError ? err.code : 'INVALID_HISTORY_PARAMS';
        ws.send(JSON.stringify({ type: 'error', code, message }));
        ws.close();
    }
});

/**
 * Wraps the raw task constraint in a full Evidence Witness system instruction.
 * Injects learner ID for traceability. Expand this to include
 * learner history once D1 is queryable from the agent (via Worker API).
 */
function buildWitnessInstruction(baseConstraint: string, learnerId: string | null): string {
    return `You are a calm, patient Evidence Witness observing a child complete a physical task.

YOUR ROLE:
- You OBSERVE and DOCUMENT — you do NOT teach, correct, or grade
- You speak minimally and encouragingly
- You prompt the child ONCE to explain their reasoning after they finish
- You call evaluate_constraint when you have sufficient evidence

LEARNER: ${learnerId || 'unknown'}

TASK CONSTRAINT:
${baseConstraint}

RULES:
- NEVER reveal the success/failure criteria to the child
- NEVER teach the concept during observation
- Wait for the child to complete the physical task BEFORE asking for explanation
- Ask only: "Can you tell me how you figured that out?"
- Call evaluate_constraint exactly ONCE with status ('success' or 'failure') and a brief summary
- If the child struggles for more than 2 minutes, gently end the session with failure status`;
}

// ─── Ping/Pong Heartbeat ───
const HEARTBEAT_INTERVAL_MS = 25_000;
const PONG_TIMEOUT_MS = 10_000;

function setupHeartbeat(ws: WebSocket) {
    let pongReceived = true;
    const interval = setInterval(() => {
        if (!pongReceived) {
            console.warn('[WS] Pong not received within timeout — connection may be stale');
        }
        if (ws.readyState === WebSocket.OPEN) {
            pongReceived = false;
            ws.ping();
        }
    }, HEARTBEAT_INTERVAL_MS);

    ws.on('pong', () => {
        pongReceived = true;
    });

    ws.on('close', () => clearInterval(interval));
    ws.on('error', () => clearInterval(interval));
}

// Apply heartbeat to all WebSocket servers
for (const wss of [witnessWss, explainerWss, historyExplainerWss]) {
    wss.on('connection', (ws: WebSocket) => {
        setupHeartbeat(ws);
    });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`[AGENT] Server running on port ${PORT}`);
});
