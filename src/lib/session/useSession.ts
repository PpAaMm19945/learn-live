import { useState, useCallback, useRef, useEffect } from 'react';
import type { SceneMode, TranscriptChunk, AgentToolCall, AgentMessage } from './types';
import { Logger } from '@/lib/Logger';

export interface SessionConfig {
  chapterId: string;
  familyId: string;
  learnerId: string;
  band: number;
  agentUrl: string; // from VITE_AGENT_URL
}

export interface SessionState {
  status: 'idle' | 'connecting' | 'connected' | 'error' | 'ended';
  transcriptChunks: TranscriptChunk[];
  sceneMode: SceneMode;
  error?: string;
  isMuted: boolean;
}

export function useSession({
  chapterId,
  familyId,
  learnerId,
  band,
  agentUrl
}: SessionConfig) {
  const [status, setStatus] = useState<SessionState['status']>('idle');
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [sceneMode, setSceneMode] = useState<SceneMode>('transcript');
  const [error, setError] = useState<string>();
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<SessionState['status']>(status);

  const MAX_RECONNECT_RETRIES = 3;

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Audio Playback State
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Microphone Capture State
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const playAudioChunk = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    try {
        // Decode base64 to raw bytes
        const binaryStr = atob(base64Audio);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        // Convert 16-bit PCM to Float32 AudioBuffer (24kHz mono)
        const sampleCount = bytes.length / 2;
        const audioBuffer = ctx.createBuffer(1, sampleCount, 24000);
        const channelData = audioBuffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        for (let i = 0; i < sampleCount; i++) {
            const int16 = dataView.getInt16(i * 2, true); // little-endian
            channelData[i] = int16 / 32768;
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        // Schedule playback seamlessly
        const currentTime = ctx.currentTime;
        const startTime = Math.max(currentTime, nextPlayTimeRef.current);
        source.start(startTime);
        nextPlayTimeRef.current = startTime + audioBuffer.duration;

    } catch (err) {
        Logger.error('[AUDIO]', 'Failed to decode/play PCM audio chunk', err);
    }
  }, []);

  const setupMicrophone = useCallback(async () => {
     if (band < 3) return; // Only bands 3+ get microphone capability

     try {
         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
         streamRef.current = stream;

         const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
         mediaRecorderRef.current = mediaRecorder;

         mediaRecorder.ondataavailable = async (e) => {
            if (e.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
                // Convert Blob to Base64
                const reader = new FileReader();
                reader.readAsDataURL(e.data);
                reader.onloadend = () => {
                    const base64data = reader.result?.toString().split(',')[1];
                    if (base64data) {
                        wsRef.current?.send(JSON.stringify({ type: 'audio', data: base64data }));
                    }
                };
            }
         };

         // Capture chunks every 250ms for low latency streaming
         mediaRecorder.start(250);
         Logger.info('[AUDIO]', 'Microphone connected and recording started.');

     } catch (err) {
         Logger.error('[AUDIO]', 'Failed to setup microphone', err);
     }
  }, [band, isMuted]);

  const connect = useCallback((onToolCall?: (msg: AgentToolCall) => void, onMessage?: (msg: AgentMessage) => void, isReconnect = false) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Reset reconnect count only on user-initiated connects, not auto-reconnects
    if (!isReconnect) {
      reconnectCountRef.current = 0;
    }

    setStatus('connecting');
    setError(undefined);

    try {
      // Replace http with ws
      const wsUrl = new URL(agentUrl);
      wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl.pathname = '/ws/history-explainer';
      wsUrl.searchParams.set('chapter', chapterId);
      wsUrl.searchParams.set('family', familyId);
      wsUrl.searchParams.set('learner', learnerId);
      wsUrl.searchParams.set('band', band.toString());

      Logger.info('[WS]', `Connecting to ${wsUrl.toString()}`);
      const ws = new WebSocket(wsUrl.toString());
      wsRef.current = ws;

      ws.onopen = () => {
        Logger.info('[WS]', 'Connected to agent');
        setStatus('connected');
        // NOTE: Do NOT reset reconnectCountRef here — that's what caused the infinite loop.
        // Count is only reset on explicit user-initiated connect() calls (isReconnect=false).

        // Initialize Audio Context on user interaction (connect)
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        setupMicrophone();
      };

      ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (onMessage) {
              onMessage(msg as AgentMessage);
          }

          if (msg.type === 'tool_call') {
            const toolMsg = msg as AgentToolCall;
            if (toolMsg.tool === 'set_scene') {
               setSceneMode(toolMsg.args.mode as SceneMode);
            }
            if (onToolCall) {
                onToolCall(toolMsg);
            }
          } else if (msg.type === 'transcript') {
            setTranscriptChunks((prev) => [...prev, msg as TranscriptChunk]);
          } else if (msg.type === 'audio') {
            await playAudioChunk(msg.data);
          } else if (msg.type === 'error') {
             Logger.error('[WS]', `Agent error: ${msg.message}`);
             setError(msg.message);
          }
        } catch (err) {
          Logger.error('[WS]', 'Failed to parse message', err);
        }
      };

      ws.onclose = (e) => {
        Logger.info('[WS]', `Disconnected from agent (code=${e.code}, reason=${e.reason})`);

        if (statusRef.current === 'ended') {
           return; // Normal disconnect
        }

        if (reconnectCountRef.current < MAX_RECONNECT_RETRIES && statusRef.current !== 'error') {
          const attempt = reconnectCountRef.current + 1;
          const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          Logger.info('[WS]', `Reconnect attempt ${attempt}/${MAX_RECONNECT_RETRIES} in ${delayMs / 1000}s...`);
          reconnectCountRef.current = attempt;
          reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              connect(onToolCall, onMessage, true);
          }, delayMs);
        } else {
          Logger.error('[WS]', `Max reconnect retries (${MAX_RECONNECT_RETRIES}) exhausted.`);
          setStatus('error');
          setError('Lost connection to teacher.');
        }
      };

      ws.onerror = (e) => {
         Logger.error('[WS]', 'WebSocket error', e);
         // onclose will handle setting error state
      };

    } catch (err) {
      Logger.error('[WS]', 'Failed to setup WebSocket', err);
      setStatus('error');
      setError('Failed to setup connection.');
    }
  }, [agentUrl, chapterId, familyId, learnerId, band, playAudioChunk, setupMicrophone]);

  const disconnect = useCallback(() => {
    Logger.info('[WS]', 'Disconnecting from agent');
    setStatus('ended');
    statusRef.current = 'ended'; // Immediately update ref for synchronous access
    // Clear any pending reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent stale handlers from firing
      wsRef.current.close();
      wsRef.current = null;
    }
    if (audioContextRef.current) {
       audioContextRef.current.close();
       audioContextRef.current = null;
    }
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
        const newState = !prev;
        Logger.info('[AUDIO]', `Microphone ${newState ? 'muted' : 'unmuted'}`);
        return newState;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          // Clear any pending reconnect timer on unmount
          if (reconnectTimerRef.current) {
              clearTimeout(reconnectTimerRef.current);
              reconnectTimerRef.current = null;
          }
          if (wsRef.current) {
              wsRef.current.onclose = null; // Prevent stale handlers from firing
              wsRef.current.close();
              wsRef.current = null;
          }
          if (audioContextRef.current) {
              audioContextRef.current.close();
              audioContextRef.current = null;
          }
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
             mediaRecorderRef.current.stop();
          }
          if (streamRef.current) {
             streamRef.current.getTracks().forEach(track => track.stop());
          }
      }
  }, []);

  return {
    status,
    transcriptChunks,
    sceneMode,
    error,
    isMuted,
    connect,
    disconnect,
    toggleMute,
    setSceneMode
  };
}
