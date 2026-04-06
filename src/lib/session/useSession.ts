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

export interface ToolActivity {
  id: string;
  tool: string;
  args: Record<string, any>;
  timestamp: number;
}

export interface SessionState {
  status: 'idle' | 'connecting' | 'reconnecting' | 'connected' | 'error' | 'ended';
  transcriptChunks: TranscriptChunk[];
  sceneMode: SceneMode;
  error?: string;
  isMuted: boolean;
}

const AUDIO_BACKLOG_RESET_SECONDS = 4;
const TOOL_ACTIVITY_LIMIT = 8;

function isFillerTranscript(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  // Ignore non-lexical placeholder/noise chunks.
  if (/^[.\-_,!?\s]+$/.test(trimmed)) return true;
  if (/^(uh+|um+|hmm+|mm+|erm+)$/i.test(trimmed)) return true;

  return false;
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
  const [thinkingText, setThinkingText] = useState<string>('');
  const [error, setError] = useState<string>();
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasReceivedMessage, setHasReceivedMessage] = useState<boolean>(false);
  const [lastToolCall, setLastToolCall] = useState<ToolActivity | null>(null);
  const [recentToolCalls, setRecentToolCalls] = useState<ToolActivity[]>([]);
  const [sceneModeBadge, setSceneModeBadge] = useState<SceneMode | null>(null);
  const [isAudioCatchingUp, setIsAudioCatchingUp] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<SessionState['status']>(status);
  const realResponseStartedRef = useRef<boolean>(false);
  const sceneBadgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCatchupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MAX_RECONNECT_RETRIES = 3;

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Audio Playback State
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Microphone Capture State
  const audioInputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
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

      const currentTime = ctx.currentTime;
      const backlogSeconds = Math.max(0, nextPlayTimeRef.current - currentTime);

      if (backlogSeconds > AUDIO_BACKLOG_RESET_SECONDS) {
        Logger.warn('[AUDIO]', `Playback backlog too high (${backlogSeconds.toFixed(2)}s). Resetting queue timing.`);
        nextPlayTimeRef.current = currentTime;
        setIsAudioCatchingUp(true);
        if (audioCatchupTimerRef.current) clearTimeout(audioCatchupTimerRef.current);
        audioCatchupTimerRef.current = setTimeout(() => {
          setIsAudioCatchingUp(false);
          audioCatchupTimerRef.current = null;
        }, 2500);
      }

      // Schedule playback seamlessly
      const startTime = Math.max(currentTime, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      if (!realResponseStartedRef.current) {
        realResponseStartedRef.current = true;
        setThinkingText('');
      }
    } catch (err) {
      Logger.error('[AUDIO]', 'Failed to decode/play PCM audio chunk', err);
    }
  }, []);

  const setupMicrophone = useCallback(async () => {
    if (band < 3) return; // Only bands 3+ get microphone capability

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      // Setup AudioContext for 16kHz
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioInputContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // ScriptProcessorNode is deprecated but highly compatible for basic raw PCM extraction
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }

          // Convert Int16Array to Base64
          const buffer = new Uint8Array(pcmData.buffer);
          let binary = '';
          for (let i = 0; i < buffer.byteLength; i++) {
            binary += String.fromCharCode(buffer[i]);
          }
          const base64data = btoa(binary);

          wsRef.current?.send(JSON.stringify({ type: 'audio', data: base64data }));
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      Logger.info('[AUDIO]', 'Microphone connected and 16kHz PCM recording started.');
    } catch (err) {
      Logger.error('[AUDIO]', 'Failed to setup microphone', err);
    }
  }, [band, isMuted]);

  const connect = useCallback((onToolCall?: (msg: AgentToolCall) => void, onMessage?: (msg: AgentMessage) => void, isReconnect = false) => {
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      Logger.info('[WS]', 'Connect skipped: socket already open or connecting');
      return;
    }

    // Reset reconnect count only on user-initiated connects, not auto-reconnects
    if (!isReconnect) {
      reconnectCountRef.current = 0;
    }

    setStatus(isReconnect ? 'reconnecting' : 'connecting');
    setError(undefined);
    realResponseStartedRef.current = false;
    nextPlayTimeRef.current = 0;
    setThinkingText('');
    setIsAudioCatchingUp(false);

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
        if (wsRef.current !== ws) {
          Logger.warn('[WS]', 'Ignoring stale socket onopen event');
          ws.close();
          return;
        }
        Logger.info('[WS]', 'Connected to agent');
        setStatus('connected');
        setHasReceivedMessage(false);

        setupMicrophone();
      };

      ws.onmessage = async (event) => {
        if (wsRef.current !== ws) {
          Logger.warn('[WS]', 'Ignoring message from stale socket');
          return;
        }
        try {
          const msg = JSON.parse(event.data);
          setHasReceivedMessage(true);

          if (onMessage) {
            onMessage(msg as AgentMessage);
          }

          // Handle fatal server errors (e.g. rate limit: { error: 'Daily session limit reached' })
          // These have no `type` field — just a bare `error` property.
          if (msg.error && !msg.type) {
            Logger.error('[WS]', `Server error: ${msg.error}`);
            setStatus('error');
            statusRef.current = 'error'; // Prevent reconnect in onclose
            setError(msg.error);
            return;
          }

          if (msg.type === 'tool_call') {
            const toolMsg = msg as AgentToolCall;
            const toolActivity: ToolActivity = {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              tool: toolMsg.tool,
              args: toolMsg.args || {},
              timestamp: Date.now()
            };

            setLastToolCall(toolActivity);
            setRecentToolCalls((prev) => [toolActivity, ...prev].slice(0, TOOL_ACTIVITY_LIMIT));

            if (toolMsg.tool === 'set_scene') {
              const nextMode = toolMsg.args.mode as SceneMode;
              setSceneMode(nextMode);
              setSceneModeBadge(nextMode);
              if (sceneBadgeTimerRef.current) clearTimeout(sceneBadgeTimerRef.current);
              sceneBadgeTimerRef.current = setTimeout(() => {
                setSceneModeBadge(null);
                sceneBadgeTimerRef.current = null;
              }, 3500);
            }
            if (onToolCall) {
              onToolCall(toolMsg);
            }
          } else if (msg.type === 'thinking') {
            setThinkingText((prev) => `${prev}${prev ? '\n' : ''}${msg.text}`);
          } else if (msg.type === 'transcript') {
            const chunk = msg as TranscriptChunk;
            if (!isFillerTranscript(chunk.text) || chunk.isFinal) {
              setTranscriptChunks((prev) => [...prev, chunk]);
            }
            if (!realResponseStartedRef.current && chunk.text.trim()) {
              realResponseStartedRef.current = true;
              setThinkingText('');
            }
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
        if (wsRef.current !== ws) {
          Logger.info('[WS]', 'Ignoring close event from stale socket');
          return;
        }
        wsRef.current = null;
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
        if (wsRef.current !== ws) return;
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
    realResponseStartedRef.current = false;
    nextPlayTimeRef.current = 0;
    setThinkingText('');
    setIsAudioCatchingUp(false);

    // Clear any pending reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (sceneBadgeTimerRef.current) {
      clearTimeout(sceneBadgeTimerRef.current);
      sceneBadgeTimerRef.current = null;
    }
    if (audioCatchupTimerRef.current) {
      clearTimeout(audioCatchupTimerRef.current);
      audioCatchupTimerRef.current = null;
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
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioInputContextRef.current) {
      audioInputContextRef.current.close();
      audioInputContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    transcriptChunks,
    thinkingText,
    sceneMode,
    sceneModeBadge,
    lastToolCall,
    recentToolCalls,
    error,
    isMuted,
    hasReceivedMessage,
    isAudioCatchingUp,
    connect,
    disconnect,
    toggleMute,
    setSceneMode
  };
}
