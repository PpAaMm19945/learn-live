import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { checkRateLimit } from './rateLimit';
import { fetchAndAssembleInstruction } from './constraints';
import { GeminiSession } from './gemini';
import { handleExplainerSession } from './explainerSession';

dotenv.config();

const app = express();
const server = createServer(app);
const witnessWss = new WebSocketServer({ noServer: true });
const explainerWss = new WebSocketServer({ noServer: true });

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

    const geminiSession = new GeminiSession(systemInstruction);
    await geminiSession.connect();

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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`[AGENT] Server running on port ${PORT}`);
});
