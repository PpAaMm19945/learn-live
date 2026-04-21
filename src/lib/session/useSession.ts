import { useCallback, useEffect, useRef, useState } from 'react';

import { Logger } from '@/lib/Logger';
import type { DebugEvent } from '@/components/session/DebugDrawer';
import { createDebugEvent } from '@/components/session/DebugDrawer';

import { resolveLessonIdentifier } from './sessionParams';
import { stripToolCallText } from './textFilter';
import type {
  AgentMessage,
  AgentToolCall,
  BeatPayload,
  LiveSliceNotice,
  SceneMode,
  SessionSlice,
  TranscriptChunk
} from './types';

export interface BeatRecord {
  beatId: string;
  index: number;
  text: string;
  toolCalls: AgentToolCall[];
  timestamp: number;
  status: 'queued' | 'playing' | 'done';
  thinking?: string;
  blockedTools?: { tool: string; reason: string }[];
}

export interface SessionConfig {
  chapterId: string;
  familyId: string;
  learnerId: string;
  band: number;
  agentUrl: string;
  onDebug?: (evt: DebugEvent) => void;
}

export interface SessionState {
  status: 'idle' | 'connecting' | 'reconnecting' | 'connected' | 'error' | 'ended';
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
  agentUrl,
  onDebug
}: SessionConfig) {
  const [status, setStatus] = useState<SessionState['status']>('idle');
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [sceneMode, setSceneMode] = useState<SceneMode>('transcript');
  const [thinkingText, setThinkingText] = useState<string>('');
  const [error, setError] = useState<string>();
  const [isMuted, setIsMuted] = useState<boolean>(band >= 3);
  const [hasReceivedMessage, setHasReceivedMessage] = useState<boolean>(false);
  const [isQAActive, setIsQAActive] = useState<boolean>(false);
  const [activeSlice, setActiveSlice] = useState<SessionSlice>('welcome');

  // Refs to avoid stale closures in onaudioprocess
  const isMutedRef = useRef(isMuted);
  const isQAActiveRef = useRef(isQAActive);
  const activeSliceRef = useRef(activeSlice);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isQAActiveRef.current = isQAActive; }, [isQAActive]);
  useEffect(() => { activeSliceRef.current = activeSlice; }, [activeSlice]);

  const [liveTranscripts, setLiveTranscripts] = useState<{ gatekeeper: string; negotiator: string }>({ gatekeeper: '', negotiator: '' });
  const [liveSliceStatus, setLiveSliceStatus] = useState<{ gatekeeper: 'playing' | 'done'; negotiator: 'playing' | 'done' }>({ gatekeeper: 'playing', negotiator: 'playing' });
  const [scaffoldingActive, setScaffoldingActive] = useState<boolean>(false);
  const [pipelineStatus, setPipelineStatus] = useState<{ step: string; detail?: string } | null>(null);
  const [liveSliceNotice, setLiveSliceNotice] = useState<LiveSliceNotice | null>(null);
  
  const [beats, setBeats] = useState<BeatRecord[]>([]);
  // Buffer thinking text streamed between beats; flushed onto the next beat.
  const pendingThinkingRef = useRef<string>('');

  // Beat Sequencer State Machine
  type BeatState = 'IDLE' | 'LOADING_BEAT' | 'EXECUTING_TOOLS' | 'PLAYING_AUDIO' | 'COOLDOWN';
  const [beatState, setBeatState] = useState<BeatState>('IDLE');
  const [beatQueue, setBeatQueue] = useState<BeatPayload[]>([]);
  const [currentBeatText, setCurrentBeatText] = useState<string | null>(null);
  const onToolCallRef = useRef<((msg: AgentToolCall) => void) | undefined>(undefined);
  const onDebugRef = useRef(onDebug);
  useEffect(() => { onDebugRef.current = onDebug; }, [onDebug]);

  const debug = useCallback((category: DebugEvent['category'], label: string, detail?: string) => {
    onDebugRef.current?.(createDebugEvent(category, label, detail));
  }, []);

  const wsRef = useRef<WebSocket | null>(null);
  const resumeTokenRef = useRef<string | null>(null);
  const reconnectCountRef = useRef<number>(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<SessionState['status']>(status);
  const pendingLessonCompleteRef = useRef<boolean>(false);
  const performerCompleteReceivedRef = useRef<boolean>(false);

  const MAX_RECONNECT_RETRIES = 3;

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Audio Playback State
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<string[]>([]);
  const audioDrainingRef = useRef<boolean>(false);

  // Microphone Capture State
  const audioInputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Pre-warm AudioContext on first user gesture (called from connect)
  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      Logger.info('[AUDIO]', `AudioContext created: state=${audioContextRef.current.state}`);
    }
    // Resume immediately — this is called from a user click handler so it should succeed
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().then(() => {
        Logger.info('[AUDIO]', 'AudioContext pre-warmed to running');
      }).catch(err => {
        Logger.warn('[AUDIO]', 'AudioContext pre-warm failed', err);
      });
    }
  }, []);

  const playAudioChunk = useCallback(async (base64Audio: string) => {
    if (!base64Audio || base64Audio.trim().length === 0) {
      return Promise.resolve();
    }

    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const ctx = audioContextRef.current;
    Logger.info('[AUDIO]', `AudioContext state: ${ctx.state}, currentTime: ${ctx.currentTime.toFixed(2)}`);
    
    if (ctx.state === 'suspended') {
        Logger.info('[AUDIO]', 'Resuming suspended AudioContext...');
        // Guard resume() with a timeout so we don't hang forever
        try {
          await Promise.race([
            ctx.resume(),
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error('AudioContext.resume() timed out')), 3000))
          ]);
          Logger.info('[AUDIO]', `AudioContext after resume: ${ctx.state}`);
        } catch (err) {
          Logger.warn('[AUDIO]', 'AudioContext resume failed/timed out — attempting fresh context', err);
          // Create a brand new AudioContext
          try { ctx.close(); } catch (_) {}
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          await audioContextRef.current.resume();
          Logger.info('[AUDIO]', `Fresh AudioContext state: ${audioContextRef.current.state}`);
        }
    }

    const activeCtx = audioContextRef.current;

    try {
        const binaryStr = atob(base64Audio);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        if (bytes.length < 2) {
            Logger.warn('[AUDIO]', 'Skipping empty PCM audio chunk');
            return Promise.resolve();
        }

        const sampleCount = Math.floor(bytes.length / 2);
        if (sampleCount <= 0) {
            Logger.warn('[AUDIO]', 'Skipping PCM audio chunk with no decodable samples');
            return Promise.resolve();
        }
        const audioBuffer = activeCtx.createBuffer(1, sampleCount, 24000);
        const channelData = audioBuffer.getChannelData(0);
        const dataView = new DataView(bytes.buffer);
        for (let i = 0; i < sampleCount; i++) {
            const int16 = dataView.getInt16(i * 2, true);
            channelData[i] = int16 / 32768;
        }

        const durationSec = audioBuffer.duration;
        Logger.info('[AUDIO]', `PCM decoded: ${sampleCount} samples, ${durationSec.toFixed(1)}s duration`);

        const source = activeCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(activeCtx.destination);

        return new Promise<void>((resolve) => {
            const currentTime = activeCtx.currentTime;
            const startTime = Math.max(currentTime, nextPlayTimeRef.current);
            const delay = startTime - currentTime;
            
            if (delay > 1) {
              Logger.warn('[AUDIO]', `Audio scheduled ${delay.toFixed(1)}s in the future — resetting to now`);
              nextPlayTimeRef.current = currentTime;
            }
            const actualStart = delay > 1 ? currentTime : startTime;

            let resolved = false;
            source.onended = () => {
              if (!resolved) {
                resolved = true;
                resolve();
              }
            };
            
            // Safety timeout: if onended never fires, force-resolve after expected duration + 5s buffer
            const safetyMs = (durationSec + 5) * 1000;
            setTimeout(() => {
              if (!resolved) {
                Logger.warn('[AUDIO]', `Safety timeout after ${(safetyMs / 1000).toFixed(0)}s — forcing beat advance`);
                resolved = true;
                resolve();
              }
            }, safetyMs);
            
            source.start(actualStart);
            nextPlayTimeRef.current = actualStart + durationSec;
        });

    } catch (err) {
        Logger.error('[AUDIO]', 'Failed to decode/play PCM audio chunk', err);
        return Promise.resolve();
    }
  }, []);

  const drainAudioQueue = useCallback(async () => {
    if (audioDrainingRef.current) return;
    audioDrainingRef.current = true;
    try {
      while (audioQueueRef.current.length > 0) {
        const next = audioQueueRef.current.shift()!;
        try {
          await playAudioChunk(next);
        } catch (err) {
          Logger.warn('[AUDIO]', 'chunk drain error', err);
        }
      }
    } finally {
      audioDrainingRef.current = false;
    }
  }, [playAudioChunk]);

  const flushAudioQueue = useCallback(() => {
    audioQueueRef.current = [];
  }, []);

  const setupMicrophone = useCallback(async () => {
     const canUseMic = band >= 3 || (band === 2 && (activeSlice === 'gatekeeper' || activeSlice === 'negotiator'));
     if (!canUseMic) return;

     try {
         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
         streamRef.current = stream;

         const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
         const audioContext = new AudioContextClass({ sampleRate: 16000 });
         audioInputContextRef.current = audioContext;

         const source = audioContext.createMediaStreamSource(stream);
         sourceRef.current = source;

         const processor = audioContext.createScriptProcessor(4096, 1, 1);
         processorRef.current = processor;

         processor.onaudioprocess = (e) => {
             const shouldStreamLiveAudio = activeSliceRef.current === 'gatekeeper' || activeSliceRef.current === 'negotiator' || isQAActiveRef.current;
             if (wsRef.current?.readyState === WebSocket.OPEN && !isMutedRef.current && shouldStreamLiveAudio) {
                 const inputData = e.inputBuffer.getChannelData(0);
                 const pcmData = new Int16Array(inputData.length);
                 for (let i = 0; i < inputData.length; i++) {
                     let s = Math.max(-1, Math.min(1, inputData[i]));
                     pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                 }

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
         debug('audio', 'Microphone connected (16kHz PCM)');

     } catch (err) {
         Logger.error('[AUDIO]', 'Failed to setup microphone', err);
         debug('error', 'Microphone setup failed', String(err));
     }
  }, [band, isMuted, isQAActive, debug, activeSlice]);

  const connect = useCallback((onToolCall?: (msg: AgentToolCall) => void, onMessage?: (msg: AgentMessage) => void, isReconnect = false) => {
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    ) {
      Logger.info('[WS]', 'Connect skipped: socket already open or connecting');
      return;
    }

    if (!isReconnect) {
      reconnectCountRef.current = 0;
    }
    
    onToolCallRef.current = onToolCall;

    setStatus(isReconnect ? 'reconnecting' : 'connecting');
    pendingLessonCompleteRef.current = false;
    setError(undefined);

    // Pre-warm AudioContext on user gesture to avoid autoplay policy hang
    ensureAudioContext();

    debug('connection', isReconnect ? 'Reconnecting to agent...' : 'Connecting to agent...');

    try {
      const wsUrl = new URL(agentUrl);
      wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl.pathname = '/ws/history-explainer';
      const resolvedLesson = resolveLessonIdentifier(chapterId);
      wsUrl.searchParams.set('chapterId', resolvedLesson.chapterId);
      wsUrl.searchParams.set('sectionId', resolvedLesson.sectionId);
      wsUrl.searchParams.set('lessonId', resolvedLesson.lessonId);
      wsUrl.searchParams.set('family', familyId);
      wsUrl.searchParams.set('learner', learnerId);
      wsUrl.searchParams.set('band', band.toString());
      if (isReconnect && resumeTokenRef.current) {
        wsUrl.searchParams.set('resumeToken', resumeTokenRef.current);
        debug('connection', 'Sending resumeToken', resumeTokenRef.current);
      }
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
        debug('connection', 'Connected to agent');
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

          if (msg.error && !msg.type) {
             Logger.error('[WS]', `Server error: ${msg.error}`);
             debug('error', `Server error: ${msg.error}`);
             setStatus('error');
             statusRef.current = 'error';
             setError(msg.error);
             return;
          }

          if (msg.type === 'beat_payload') {
             const beat = msg as BeatPayload;
             const toolNames = beat.toolCalls?.map((t: any) => t.tool).join(', ') || 'none';
             const hasAudio = beat.audioData && beat.audioData.trim().length > 10;
             debug('beat', `Beat queued (${beat.toolCalls?.length || 0} tools)`, `tools: [${toolNames}] | audio: ${hasAudio ? 'yes' : 'no'} | text: "${(beat.text || '').slice(0, 60)}..."`);
             setBeatQueue(prev => [...prev, beat]);
          } else if (msg.type === 'resume_token') {
             resumeTokenRef.current = msg.token;
             debug('connection', `Resume token received`, msg.token);
          } else if (msg.type === 'tool_call') {
            const toolMsg = msg as AgentToolCall;
            debug('tool_call', `${toolMsg.tool}(${JSON.stringify(toolMsg.args)})`, `Direct tool call (outside beat)`);
            if (toolMsg.tool === 'set_scene') {
               setSceneMode(toolMsg.args.mode as SceneMode);
               debug('scene', `Scene → ${toolMsg.args.mode}`, `via direct tool_call`);
            }
            if (onToolCall) {
                onToolCall(toolMsg);
            }
          } else if (msg.type === 'pipeline_status') {
            Logger.info('[WS]', `Pipeline: ${msg.step} — ${msg.detail || ''}`);
            debug('connection', `Pipeline: ${msg.step}`, msg.detail);
            
            // Loop brake: if we are already past performer and we see 'loading' again for same session, log it.
            if (msg.step === 'loading' && performerCompleteReceivedRef.current) {
               debug('error', 'Suspicious restart: lesson already completed performer phase');
            }
            
            setPipelineStatus({ step: msg.step, detail: msg.detail });
          } else if (msg.type === 'thinking') {
            setThinkingText((prev) => `${prev}${msg.text}`);
            pendingThinkingRef.current = `${pendingThinkingRef.current}${msg.text}`;
          } else if (msg.type === 'transcript') {
            setThinkingText('');
            setPipelineStatus(null); // Clear pipeline status once lesson starts
            setTranscriptChunks((prev) => [...prev, msg as TranscriptChunk]);
            if (activeSlice === 'gatekeeper' || activeSlice === 'negotiator') {
              setLiveTranscripts(prev => ({
                ...prev,
                [activeSlice]: `${prev[activeSlice]}${msg.text}`
              }));
            }
            debug('beat', `Transcript chunk`, `"${(msg.text || '').slice(0, 80)}..."`);
          } else if (msg.type === 'audio') {
            if (activeSlice !== 'performer' && beatState === 'PLAYING_AUDIO') {
              return;
            }
            // Don't log every 2.5KB chunk — too noisy. Log only first chunk of a burst.
            if (audioQueueRef.current.length === 0 && !audioDrainingRef.current) {
              debug('audio', `Live audio stream started (${activeSlice})`);
            }
            audioQueueRef.current.push(msg.data);
            void drainAudioQueue();
          } else if (msg.type === 'slice_change') {
            const nextSlice = msg.slice as SessionSlice;
            flushAudioQueue();
            setActiveSlice(nextSlice);
            pendingThinkingRef.current = '';
            if (nextSlice === 'gatekeeper' || nextSlice === 'negotiator') {
              setLiveSliceStatus(prev => ({ ...prev, [nextSlice]: 'playing' }));
            }
            if (nextSlice === 'gatekeeper' || nextSlice === 'negotiator') {
              setIsMuted(false);
            } else if (band === 2) {
              setIsMuted(true);
            }
            setThinkingText('');
          } else if (msg.type === 'gatekeeper_complete' || msg.type === 'negotiator_complete') {
            debug('connection', `${msg.type} received`);
            flushAudioQueue();
            if (msg.type === 'gatekeeper_complete') {
              setLiveSliceStatus(prev => ({ ...prev, gatekeeper: 'done' }));
            } else {
              setLiveSliceStatus(prev => ({ ...prev, negotiator: 'done' }));
            }
          } else if (msg.type === 'performer_complete') {
            Logger.info('[WS]', 'Performer complete signal received.');
            debug('beat', 'performer_complete received', `Queue: ${beatQueue.length} beats remaining`);
            performerCompleteReceivedRef.current = true;
          } else if (msg.type === 'live_slice_fallback' || msg.type === 'live_slice_error') {
            const isError = msg.type === 'live_slice_error';
            debug(isError ? 'error' : 'connection', `Live slice ${msg.type.split('_').pop()}: ${msg.slice}`, msg.reason);
            flushAudioQueue();
            
            setLiveSliceNotice({
              slice: msg.slice,
              kind: isError ? 'error' : 'fallback',
              reason: msg.reason,
              message: msg.message
            });

            // Inject system card into transcript
            const label = msg.slice === 'gatekeeper' ? 'Warm-up' : 'Reflection';
            const action = isError ? "couldn't start" : "timed out";
            const result = msg.slice === 'gatekeeper' ? 'starting your lesson now' : 'wrapping up';
            
            setBeats(prev => [...prev, {
              beatId: `sys-${Date.now()}`,
              index: prev.length,
              kind: 'system',
              text: `${label} ${action} — ${result}.`,
              timestamp: Date.now(),
              status: 'done',
              toolCalls: []
            } as any]);

          } else if (msg.type === 'scaffolding_change') {
            setScaffoldingActive(!!msg.active);
            debug('qa', `Scaffolding ${msg.active ? 'enabled' : 'disabled'}`, msg.reason || '');
          } else if (msg.type === 'qa_complete') {
            Logger.info('[WS]', 'Q&A session complete. Resuming lesson.');
            debug('qa', 'Q&A session complete — resuming lesson');
            setIsQAActive(false);
            setIsMuted(true);
          } else if (msg.type === 'qa_started') {
            Logger.info('[WS]', 'Q&A session started.');
            debug('qa', 'Q&A session started');
            setIsQAActive(true);
            setIsMuted(false);
          } else if (msg.type === 'lesson_complete') {
            Logger.info('[WS]', 'Lesson finished signal received.');
            debug('beat', 'lesson_complete received', `Queue: ${beatQueue.length} beats remaining`);
            pendingThinkingRef.current = '';
            if (band <= 1) {
              pendingLessonCompleteRef.current = true;
              statusRef.current = 'ended';
            }
          } else if (msg.type === 'session_complete') {
            Logger.info('[WS]', 'Session complete signal received.');
            debug('beat', 'session_complete received', `Queue: ${beatQueue.length} beats remaining`);
            pendingThinkingRef.current = '';
            if (band > 1) {
              pendingLessonCompleteRef.current = true;
              statusRef.current = 'ended';
            }
          } else if (msg.type === 'session_score') {
            debug('connection', 'Session score received', JSON.stringify(msg.score));
          } else if (msg.type === 'error') {
             Logger.error('[WS]', `Agent error: ${msg.message}`);
             debug('error', `Agent error: ${msg.message}`, msg.code ? `code: ${msg.code}` : undefined);
             setError(msg.message);

             if (msg.code === 'QA_NOT_ALLOWED') {
               setIsQAActive(false);
               setIsMuted(true);
               return;
             }

             setStatus('error');
             statusRef.current = 'error';
          } else if (msg.type === 'debug') {
            // Server-side debug messages (future)
            debug('connection', `[server] ${msg.message}`);
          } else {
            debug('connection', `Unknown msg type: ${msg.type}`, JSON.stringify(msg).slice(0, 200));
          }
        } catch (err) {
          Logger.error('[WS]', 'Failed to parse message', err);
          debug('error', 'Failed to parse WS message', String(err));
        }
      };

      ws.onclose = (e) => {
        if (wsRef.current !== ws) {
          Logger.info('[WS]', 'Ignoring close event from stale socket');
          return;
        }
        wsRef.current = null;
        Logger.info('[WS]', `Disconnected from agent (code=${e.code}, reason=${e.reason})`);
        debug('connection', `Disconnected (code=${e.code})`, e.reason || undefined);

        if (statusRef.current === 'ended') {
           return;
        }

        if (reconnectCountRef.current < MAX_RECONNECT_RETRIES && statusRef.current !== 'error') {
          const attempt = reconnectCountRef.current + 1;
          const delayMs = Math.pow(2, attempt) * 1000;
          Logger.info('[WS]', `Reconnect attempt ${attempt}/${MAX_RECONNECT_RETRIES} in ${delayMs / 1000}s...`);
          debug('connection', `Reconnect ${attempt}/${MAX_RECONNECT_RETRIES} in ${delayMs / 1000}s`);
          reconnectCountRef.current = attempt;
          reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              connect(onToolCall, onMessage, true);
          }, delayMs);
        } else {
          Logger.error('[WS]', `Max reconnect retries (${MAX_RECONNECT_RETRIES}) exhausted.`);
          debug('error', `Reconnect retries exhausted (${MAX_RECONNECT_RETRIES})`);
          setStatus('error');
          setError('Lost connection to teacher.');
        }
      };

      ws.onerror = (e) => {
         if (wsRef.current !== ws) return;
         Logger.error('[WS]', 'WebSocket error', e);
         debug('error', 'WebSocket error');
      };

    } catch (err) {
      Logger.error('[WS]', 'Failed to setup WebSocket', err);
      debug('error', 'Failed to setup WebSocket', String(err));
      setStatus('error');
      setError('Failed to setup connection.');
    }
  }, [agentUrl, chapterId, familyId, learnerId, band, playAudioChunk, setupMicrophone, debug, beatQueue.length, ensureAudioContext, activeSlice, beatState]);

  const disconnect = useCallback(() => {
    Logger.info('[WS]', 'Disconnecting from agent');
    debug('connection', 'Disconnecting (user/system)');
    setStatus('ended');
    statusRef.current = 'ended';
    pendingLessonCompleteRef.current = false;
    flushAudioQueue();
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.onclose = null;
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
  }, [debug]);
  
  const sendRaiseHand = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && band >= 3) {
        Logger.info('[WS]', 'Sending raise_hand request');
        debug('qa', 'raise_hand sent');
        wsRef.current.send(JSON.stringify({ type: 'raise_hand' }));
    } else {
        debug('error', 'raise_hand failed — WS not open or band < 3');
    }
  }, [band, debug]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
        const newState = !prev;
        Logger.info('[AUDIO]', `Microphone ${newState ? 'muted' : 'unmuted'}`);
        debug('audio', `Microphone ${newState ? 'muted' : 'unmuted'}`);
        return newState;
    });
  }, [debug]);

  // pauseSession / resumeSession removed in Phase 0 (revised) — transcript is read-only.

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          pendingLessonCompleteRef.current = false;
          flushAudioQueue();
          if (reconnectTimerRef.current) {
              clearTimeout(reconnectTimerRef.current);
              reconnectTimerRef.current = null;
          }
          if (wsRef.current) {
              wsRef.current.onclose = null;
              wsRef.current.close();
              wsRef.current = null;
          }
          if (audioContextRef.current) {
              audioContextRef.current.close();
              audioContextRef.current = null;
          }
          if (processorRef.current) {
              processorRef.current.disconnect();
          }
          if (sourceRef.current) {
              sourceRef.current.disconnect();
          }
          if (audioInputContextRef.current) {
              audioInputContextRef.current.close();
          }
          if (streamRef.current) {
             streamRef.current.getTracks().forEach(track => track.stop());
          }
      }
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const needsMic = band >= 3 || (band === 2 && (activeSlice === 'gatekeeper' || activeSlice === 'negotiator'));
    if (needsMic && !streamRef.current) {
      setupMicrophone();
    }
  }, [status, band, activeSlice, setupMicrophone]);

  // The Beat Sequencer Processor Loop
  useEffect(() => {
    if (beatState === 'IDLE' && beatQueue.length > 0) {
      const currentBeat = beatQueue[0];
      setBeatQueue(prev => prev.slice(1));
      
      setBeatState('LOADING_BEAT');
      debug('beat', `Processing beat`, `tools: ${currentBeat.toolCalls?.length || 0} | text: "${(currentBeat.text || '').slice(0, 50)}..."`);
      
      // 1. Fire Tools
      setBeatState('EXECUTING_TOOLS');
      const beatId = Math.random().toString(36).slice(2);
      const flushedThinking = pendingThinkingRef.current;
      pendingThinkingRef.current = '';
      setBeats(prev => [...prev, {
        beatId,
        index: prev.length,
        text: currentBeat.text || '',
        toolCalls: currentBeat.toolCalls || [],
        timestamp: Date.now(),
        status: 'playing',
        thinking: flushedThinking || undefined,
      }]);

      const beatSceneMode = (currentBeat as any).sceneMode as SceneMode | undefined;
      
      for (const tool of currentBeat.toolCalls) {
        if (tool.tool === 'set_scene' && tool.args?.mode === 'image' && tool.args?.imageUrl) {
          // pre-extract — handled by handleAgentToolCall
        }
      }

      currentBeat.toolCalls.forEach(tool => {
        debug('tool_call', `${tool.tool}(${JSON.stringify(tool.args)})`, `via beat sequencer`);
        if (onToolCallRef.current) {
            onToolCallRef.current(tool);
        }
      });

      // Switch scene mode after tool calls
      if (beatSceneMode && beatSceneMode !== 'transcript') {
        debug('scene', `Scene → ${beatSceneMode}`, `via beat sceneMode field`);
        setSceneMode(beatSceneMode as SceneMode);
      }

      currentBeat.toolCalls.forEach(tool => {
        if (tool.tool === 'set_scene') {
          debug('scene', `Scene → ${tool.args.mode}`, `via set_scene tool call`);
          setSceneMode(tool.args.mode as SceneMode);
        }
      });
      
      // 2. Play Audio
      setBeatState('PLAYING_AUDIO');

      let cleanText = stripToolCallText(currentBeat.text || '');
      // If the narrator returned only JSON (stripped to empty), use a placeholder so the transcript still advances
      if (!cleanText && currentBeat.text && currentBeat.text.trim().length > 0) {
        debug('beat', 'Beat text was entirely JSON — using fallback marker');
        cleanText = '…';
      }
      const hasAudio = currentBeat.audioData && currentBeat.audioData.trim().length > 10;

      // Common beat cleanup with intentional cohesive pacing
      const finalizeBeat = (reason: string) => {
        debug('beat', `Beat complete (${reason}) — entering COOLDOWN`);
        setBeats(prev => prev.map(b => b.status === 'playing' ? { ...b, status: 'done' } : b));
        setBeatState('COOLDOWN');
        const cooldownMs = (currentBeat as any).cooldownMs || (band <= 1 ? 4500 : band <= 3 ? 3500 : 3000);
        setTimeout(() => {
          setBeatState('IDLE');
        }, cooldownMs);
      };

      if (hasAudio) {
        debug('audio', `Playing audio (${((currentBeat.audioData || '').length / 1024).toFixed(1)}KB)`);
        setCurrentBeatText(cleanText);
        setTranscriptChunks(prev => [
          ...prev, 
          { type: 'transcript', text: cleanText, isFinal: true }
        ]);
        setThinkingText('');

        playAudioChunk(currentBeat.audioData).then(() => {
          finalizeBeat('Audio playback complete');
        }).catch(err => {
          Logger.error('[WS]', 'Audio play failed in beat queue', err);
          debug('error', 'Audio playback failed', String(err));
          finalizeBeat('Audio format error');
        });
      } else if (window.speechSynthesis && cleanText) {
        debug('audio', `Browser TTS fallback (${cleanText.split(/\s+/).length} words)`);
        setCurrentBeatText(cleanText);
        setTranscriptChunks(prev => [
          ...prev, 
          { type: 'transcript', text: cleanText, isFinal: true }
        ]);
        setThinkingText('');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.onend = () => {
          finalizeBeat('Browser TTS complete');
        };
        utterance.onerror = () => {
          debug('error', 'Browser TTS error');
          finalizeBeat('Browser TTS error');
        };
        window.speechSynthesis.speak(utterance);
      } else {
        const words = (cleanText || '').split(/\s+/).length;
        const dwellMs = Math.max(3000, (words / 150) * 60 * 1000);
        debug('audio', `No audio — dwelling ${Math.round(dwellMs / 1000)}s (${words} words)`);
        setCurrentBeatText(cleanText);
        setTranscriptChunks(prev => [
          ...prev, 
          { type: 'transcript', text: cleanText, isFinal: true }
        ]);
        setThinkingText('');

        Logger.info('[WS]', `No audio. Dwelling ${Math.round(dwellMs / 1000)}s`);
        setTimeout(() => {
          finalizeBeat('Dwell complete');
        }, dwellMs);
      }
    }
  }, [beatState, beatQueue, playAudioChunk, debug, band]);
  
  // Finalize lesson only after queued beats/audio have finished playing.
  useEffect(() => {
    if (pendingLessonCompleteRef.current && beatQueue.length === 0 && beatState === 'IDLE') {
      Logger.info('[WS]', 'Applying delayed lesson completion after audio queue drained.');
      debug('beat', 'Lesson ended (queue drained)');
      setStatus('ended');
      statusRef.current = 'ended';
      pendingLessonCompleteRef.current = false;
    }
    
    // Performer drain handshake: if performer finished but we are waiting to start negotiator
    if (performerCompleteReceivedRef.current && beatQueue.length === 0 && beatState === 'IDLE' && status === 'connected') {
      Logger.info('[WS]', 'Sending performer_drain_complete handshake');
      wsRef.current?.send(JSON.stringify({ type: 'performer_drain_complete' }));
      performerCompleteReceivedRef.current = false; // Reset so we only send once
    }
  }, [beatQueue.length, beatState, debug, status]);
  
  // Auto-clear live slice notice after 8s
  useEffect(() => {
    if (!liveSliceNotice) return;
    const timer = setTimeout(() => setLiveSliceNotice(null), 8000);
    return () => clearTimeout(timer);
  }, [liveSliceNotice]);

  return {
    status,
    transcriptChunks,
    thinkingText,
    sceneMode,
    error,
    isMuted,
    isQAActive,
    activeSlice,
    liveTranscripts,
    liveSliceStatus,
    scaffoldingActive,
    hasReceivedMessage,
    pipelineStatus,
    connect,
    disconnect,
    sendRaiseHand,
    toggleMute,
    setSceneMode,
    beats,
    liveSliceNotice,
  };
}
