import { WebSocketServer } from 'ws';

function generateTone(freq: number, durationSec: number, amplitude = 0.3): Int16Array {
    const sampleRate = 24000;
    const totalSamples = sampleRate * durationSec;
    const pcmData = new Int16Array(totalSamples);
    
    for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        const val = Math.sin(2 * Math.PI * freq * t) * amplitude;
        // Convert to Int16
        pcmData[i] = val < 0 ? val * 32768 : val * 32767;
    }
    return pcmData;
}

const wss = new WebSocketServer({ port: 8088 });

wss.on('connection', (ws, request) => {
    console.log(`[WS] Client connected. URL: ${request.url}`);
    
    const send = (msg: any) => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(msg));
        }
    };

    // t=0s
    send({ type: "transcript", text: "Audio test: you should hear a tone.", isFinal: true });

    // t=1s: 440Hz for 2 seconds
    setTimeout(() => {
        const tone1 = generateTone(440, 2);
        const chunkSize = 4800; // 200ms
        const numChunks = tone1.length / chunkSize;
        
        for (let i = 0; i < numChunks; i++) {
            setTimeout(() => {
                const chunk = tone1.slice(i * chunkSize, (i + 1) * chunkSize);
                const buffer = Buffer.from(chunk.buffer);
                send({ type: "audio", data: buffer.toString('base64') });
                console.log(`[AUDIO] Sent chunk ${i + 1}/${numChunks} (${buffer.length} bytes, 200ms of audio, 440Hz)`);
            }, i * 200);
        }
    }, 1000);

    // t=4s
    setTimeout(() => {
        send({ type: "transcript", text: "You should have heard a 440Hz tone for 2 seconds.", isFinal: true });
    }, 4000);

    // t=5s: 880Hz for 1 second
    setTimeout(() => {
        const tone2 = generateTone(880, 1);
        const chunkSize = 4800; // 200ms
        const numChunks = tone2.length / chunkSize;
        
        for (let i = 0; i < numChunks; i++) {
            setTimeout(() => {
                const chunk = tone2.slice(i * chunkSize, (i + 1) * chunkSize);
                const buffer = Buffer.from(chunk.buffer);
                send({ type: "audio", data: buffer.toString('base64') });
                console.log(`[AUDIO] Sent chunk ${i + 1}/${numChunks} (${buffer.length} bytes, 200ms of audio, 880Hz)`);
            }, i * 200);
        }
    }, 5000);

    // t=7s
    setTimeout(() => {
        send({ type: "transcript", text: "Audio test complete. Two tones: 440Hz then 880Hz.", isFinal: true });
    }, 7000);

    ws.on('message', (data) => {
        try {
            const raw = JSON.parse(data.toString());
            if (raw.type === 'audio') {
                // Ignore microphone input from client
            }
        } catch(e) {}
    });

    ws.on('close', () => {
        console.log('[WS] Client disconnected.');
    });
});

console.log('Audio playback test server listening on ws://localhost:8088/ws/history-explainer');
