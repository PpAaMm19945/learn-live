import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8088 });

wss.on('connection', (ws, request) => {
    console.log(`[WS] Client connected. URL: ${request.url}`);
    
    const send = (msg: any) => {
        const str = JSON.stringify(msg);
        console.log(`[SEND] ${msg.type === 'tool_call' ? `tool_call: ${msg.tool}(${JSON.stringify(msg.args)})` : `${msg.type}: ${msg.text || ''}`}`);
        ws.send(str);
    };

    const sequence = [
        { t: 0, msg: { type: "transcript", text: "Welcome! Let me show you something amazing.", isFinal: true } },
        { t: 2000, msg: { type: "tool_call", tool: "set_scene", args: { mode: "map" } } },
        { t: 3000, msg: { type: "transcript", text: "This is the ancient Near East.", isFinal: true } },
        { t: 4000, msg: { type: "tool_call", tool: "zoom_to", args: { location: "babel" } } },
        { t: 6000, msg: { type: "tool_call", tool: "highlight_region", args: { regionId: "mizraim", color: "#fac775" } } },
        { t: 8000, msg: { type: "tool_call", tool: "place_marker", args: { location: "memphis", label: "Memphis — Capital of Old Kingdom" } } },
        { t: 10000, msg: { type: "tool_call", tool: "show_scripture", args: { reference: "Genesis 10:6", text: "The sons of Ham: Cush, Mizraim, Phut, and Canaan." } } },
        { t: 13000, msg: { type: "tool_call", tool: "set_scene", args: { mode: "transcript" } } },
        { t: 14000, msg: { type: "transcript", text: "Now you've seen how the visual canvas works!", isFinal: true } },
        { t: 16000, msg: { type: "tool_call", tool: "set_scene", args: { mode: "map" } } },
        { t: 17000, msg: { type: "tool_call", tool: "draw_route", args: { from: "babel", to: "egypt", style: "migration" } } },
        { t: 19000, msg: { type: "tool_call", tool: "show_timeline", args: { events: [{ year: -2200, label: "Babel dispersion" }, { year: -2000, label: "Old Kingdom Egypt" }, { year: -1500, label: "New Kingdom" }] } } },
        { t: 22000, msg: { type: "tool_call", tool: "set_scene", args: { mode: "transcript" } } },
        { t: 23000, msg: { type: "transcript", text: "Test complete. All tools verified.", isFinal: true } }
    ];

    sequence.forEach(({ t, msg }) => {
        setTimeout(() => {
            if (ws.readyState === ws.OPEN) {
                send(msg);
            }
        }, t);
    });

    ws.on('message', (data) => {
        try {
            const raw = JSON.parse(data.toString());
            if (raw.type === 'audio') {
                console.log('[RECV] audio from client (ignored)');
            } else {
                console.log(`[RECV] ${data.toString()}`);
            }
        } catch(e) {
            console.log(`[RECV] ${data.toString()}`);
        }
    });

    ws.on('close', () => {
        console.log('[WS] Client disconnected.');
    });
});

console.log('Fake toolcall test server listening on ws://localhost:8088/ws/history-explainer');
