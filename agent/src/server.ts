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

wss.on('connection', async (ws: WebSocket, request) => {
    const { searchParams } = new URL(request.url || '', `http://${request.headers.host}`);
    const taskId = searchParams.get('taskId');
    const familyId = searchParams.get('familyId');
    const learnerId = searchParams.get('learnerId');

    console.log(`[AGENT] Session initiated for learner: ${learnerId}, task: ${taskId}`);

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
        systemInstruction = await fetchAndAssembleInstruction(taskId);
    } catch (e: any) {
        if (e.message === 'INVALID_CONSTRAINT') {
            console.error(`[AGENT] ⛔ INVALID CONSTRAINT — blocking session`);
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
            // Intercept special function calls for constraint evaluation
            if (data.type === 'functionCall' && data.name === 'evaluate_constraint') {
                console.log(`[AGENT] Intercepted evaluate_constraint for task: ${taskId}`);
                ws.send(JSON.stringify({
                    type: 'session_end',
                    reason: data.args.status === 'success' ? 'success' : 'failure',
                    summary: data.args.summary || 'Session completed.'
                }));

                // Safely close connection shortly after
                setTimeout(() => ws.close(), 1000);
            } else {
                ws.send(JSON.stringify(data));
            }
        }
    });

    ws.on('message', (message: string) => {
        // Handle incoming message from frontend
    });

    ws.on('close', () => {
        geminiSession.close();
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`[AGENT] Server is running on port ${PORT}`);
});
