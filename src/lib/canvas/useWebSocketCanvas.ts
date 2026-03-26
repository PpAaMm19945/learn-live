import { useState, useEffect, useRef, useCallback } from 'react';
import { handleToolCall, ToolCallMessage } from './toolCallHandler';
import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';

export interface SessionConfig {
  lessonId: string;
  familyId: string;
  learnerId: string;
  band: number;
}

interface WebSocketCanvasReturn {
  isConnected: boolean;
  isPlaying: boolean;
  transcript: string;
  toolCallLog: { id: string; time: Date; tool: string; target: string }[];
  startSession: (canvasRef: React.RefObject<TeachingCanvasRef | null>, config: SessionConfig) => void;
  endSession: () => void;
  isMicActive: boolean;
  toggleMic: () => void;
  error: string | null;
}

export function useWebSocketCanvas(): WebSocketCanvasReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [toolCallLog, setToolCallLog] = useState<{ id: string; time: Date; tool: string; target: string }[]>([]);
  const [isMicActive, setIsMicActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<React.RefObject<TeachingCanvasRef | null> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const configRef = useRef<SessionConfig | null>(null);

  // Audio playback state
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Audio recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsMicActive(false);
    setIsPlaying(false);
  }, []);

  const startSession = useCallback(async (ref: React.RefObject<TeachingCanvasRef | null>, config: SessionConfig) => {
    canvasRef.current = ref;
    configRef.current = config;
    setError(null);
    setTranscript('');
    setToolCallLog([]);

    const agentUrl = import.meta.env.VITE_AGENT_URL || 'ws://localhost:8080';
    const wsBaseUrl = agentUrl.replace(/^http/, 'ws');
    const wsUrl = new URL('/v1/agent/history-explainer', wsBaseUrl);
    wsUrl.searchParams.set('lessonId', config.lessonId);
    wsUrl.searchParams.set('familyId', config.familyId);
    wsUrl.searchParams.set('learnerId', config.learnerId);
    wsUrl.searchParams.set('band', String(config.band));

    const ws = new WebSocket(wsUrl.toString());

    // Initialize Web Audio API context for playback
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      nextPlayTimeRef.current = 0;
    } else {
      console.warn('Web Audio API not supported in this browser');
    }

    ws.onopen = async () => {
      console.log('[WS] ✅ WebSocket connected to agent');
      reconnectAttemptsRef.current = 0;
      setIsConnected(true);

      // Request microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true
          }
        });

        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = async (e) => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            // Convert Blob to Base64
            const buffer = await e.data.arrayBuffer();
            const base64 = btoa(
              new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            ws.send(JSON.stringify({
              type: 'audio',
              data: base64
            }));
          }
        };

        // Record in 100ms chunks
        mediaRecorder.start(100);
        setIsMicActive(true);
        console.log('[WS] 🎤 Microphone started');

      } catch (err) {
        console.error('[WS] ❌ Error accessing microphone:', err);
      }
    };

    ws.onmessage = async (event) => {
      console.log('[WS] 📨 Message received:', typeof event.data === 'string' ? event.data.substring(0, 200) : `Blob(${(event.data as Blob).size} bytes)`);
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);

          if (message.error) {
            console.error('[WS] ❌ Agent error:', message.error);
            setError(message.error);
            setIsConnected(false);
            ws.close(1008, 'Agent rejected session');
            return;
          }

          if (message.type === 'tool_call') {
            if (canvasRef.current?.current) {
              handleToolCall(canvasRef.current.current, message as ToolCallMessage);
            }

            setToolCallLog(prev => [...prev, {
              id: Date.now().toString() + Math.random(),
              time: new Date(),
              tool: message.tool,
              target: message.args?.location || message.args?.regionId || message.args?.label || ''
            }]);
          } else if (message.type === 'modelTurn') {
            if (message.parts && message.parts.length > 0) {
              for (const part of message.parts) {
                // Extract text
                if (part.text) {
                  setTranscript(prev => prev + ' ' + part.text);
                }
                // Extract inline PCM audio from Gemini Live API
                if (part.inlineData?.mimeType?.startsWith('audio/pcm') && part.inlineData?.data) {
                  const audioCtx = audioContextRef.current;
                  if (audioCtx) {
                    try {
                      // Decode base64 PCM to raw bytes
                      const binaryStr = atob(part.inlineData.data);
                      const len = binaryStr.length;
                      const bytes = new Uint8Array(len);
                      for (let i = 0; i < len; i++) {
                        bytes[i] = binaryStr.charCodeAt(i);
                      }

                      // Convert 16-bit PCM to Float32 AudioBuffer (24kHz mono)
                      const sampleCount = bytes.length / 2;
                      const audioBuffer = audioCtx.createBuffer(1, sampleCount, 24000);
                      const channelData = audioBuffer.getChannelData(0);
                      const dataView = new DataView(bytes.buffer);
                      for (let i = 0; i < sampleCount; i++) {
                        const int16 = dataView.getInt16(i * 2, true); // little-endian
                        channelData[i] = int16 / 32768;
                      }

                      const source = audioCtx.createBufferSource();
                      source.buffer = audioBuffer;
                      source.connect(audioCtx.destination);

                      const currentTime = audioCtx.currentTime;
                      const startTime = Math.max(currentTime, nextPlayTimeRef.current);
                      source.start(startTime);
                      nextPlayTimeRef.current = startTime + audioBuffer.duration;

                      setIsPlaying(true);
                      source.onended = () => {
                        if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.1) {
                          setIsPlaying(false);
                        }
                      };
                      console.log(`[WS] 🔊 Playing PCM audio chunk: ${sampleCount} samples, duration: ${audioBuffer.duration.toFixed(2)}s`);
                    } catch (e) {
                      console.error('[WS] ❌ Error decoding PCM audio from modelTurn:', e);
                    }
                  }
                }
              }
            }
          } else if (message.type === 'transcript') {
            setTranscript(message.text);
          } else if (message.type === 'audio' && message.data) {
             // If we receive audio as base64 string
             const audioCtx = audioContextRef.current;
             if (audioCtx) {
                const binaryStr = atob(message.data);
                const len = binaryStr.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryStr.charCodeAt(i);
                }

                try {
                    const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);

                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioCtx.destination);

                    const currentTime = audioCtx.currentTime;
                    const startTime = Math.max(currentTime, nextPlayTimeRef.current);

                    source.start(startTime);

                    nextPlayTimeRef.current = startTime + audioBuffer.duration;

                    setIsPlaying(true);

                    source.onended = () => {
                        // Rough check if we are done playing all queued audio
                        if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.1) {
                            setIsPlaying(false);
                        }
                    };
                } catch (e) {
                    console.error('Error decoding audio base64:', e);
                }
             }
          }
        } catch (e) {
          console.error('Failed to parse websocket message', e);
        }
      } else if (event.data instanceof Blob) {
         // Handle raw binary audio chunks
         const audioCtx = audioContextRef.current;
         if (audioCtx) {
             const arrayBuffer = await event.data.arrayBuffer();
             try {
                // Decode audio data. Note: simple PCM data might need manual decoding if not in a standard container like WAV.
                // Assuming it comes in a format decodeAudioData supports
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);

                const currentTime = audioCtx.currentTime;
                const startTime = Math.max(currentTime, nextPlayTimeRef.current);

                source.start(startTime);

                nextPlayTimeRef.current = startTime + audioBuffer.duration;

                setIsPlaying(true);

                source.onended = () => {
                    if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.1) {
                        setIsPlaying(false);
                    }
                };
             } catch (e) {
                 console.error('Error decoding binary audio data:', e);
             }
         }
      }
    };

    ws.onclose = (event) => {
      console.log(`[WS] 🔌 WebSocket closed: code=${event.code}, reason=${event.reason}, wasClean=${event.wasClean}`);
      setIsConnected(false);
      cleanupAudio();

      // If disconnected unexpectedly, attempt to reconnect once
      if (!event.wasClean && reconnectAttemptsRef.current < 1) {
          reconnectAttemptsRef.current++;
          setTimeout(() => {
             if (configRef.current) {
                startSession(ref, configRef.current);
             }
          }, 1000);
      } else if (!event.wasClean) {
          setError('Lost connection to the AI narrator. Returning to scripted mode.');
      }
    };

    ws.onerror = (err) => {
       console.error('[WS] ❌ WebSocket error:', err);
       setIsConnected(false);
       cleanupAudio();
       setError('Failed to connect to the AI narrator.');
    };

    wsRef.current = ws;
  }, [cleanupAudio]);

  const endSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "User ended session");
      wsRef.current = null;
    }
    reconnectAttemptsRef.current = 0;
    cleanupAudio();
  }, [cleanupAudio]);

  const toggleMic = useCallback(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      const isActive = !isMicActive;
      audioTracks.forEach(track => {
        track.enabled = isActive;
      });
      setIsMicActive(isActive);
    }
  }, [isMicActive]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    isConnected,
    isPlaying,
    transcript,
    toolCallLog,
    startSession,
    endSession,
    isMicActive,
    toggleMic,
    error
  };
}
