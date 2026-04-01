import { useState, useCallback, useRef, useEffect } from 'react';
import type { GoldenScript, SceneMode, TranscriptChunk, AgentToolCall } from './types';
import { Logger } from '@/lib/Logger';

export function useGoldenScript(script: GoldenScript | null) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle');
  const [transcriptChunks, setTranscriptChunks] = useState<TranscriptChunk[]>([]);
  const [sceneMode, setSceneMode] = useState<SceneMode>('transcript');
  const [currentTime, setCurrentTime] = useState(0);

  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const eventIndexRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const onToolCallRef = useRef<((msg: AgentToolCall) => void) | null>(null);

  const totalTime = script?.durationMs || 0;

  const resetState = useCallback(() => {
    setTranscriptChunks([]);
    setSceneMode('transcript');
    eventIndexRef.current = 0;
    setCurrentTime(0);
    pausedTimeRef.current = 0;
  }, []);

  const processEvent = useCallback((event: any) => {
    const { message } = event;
    if (message.type === 'tool_call') {
      const toolMsg = message as AgentToolCall;
      if (toolMsg.tool === 'set_scene') {
        setSceneMode(toolMsg.args.mode as SceneMode);
      }
      if (onToolCallRef.current) {
        onToolCallRef.current(toolMsg);
      }
    } else if (message.type === 'transcript') {
      setTranscriptChunks((prev) => [...prev, message as TranscriptChunk]);
    }
    // We ignore audio events since raw base64 data was excluded during recording
  }, []);

  const update = useCallback((time: number) => {
    if (!script) return;

    if (!startTimeRef.current) {
      startTimeRef.current = time - pausedTimeRef.current;
    }

    const elapsed = time - startTimeRef.current;
    setCurrentTime(elapsed);

    // Process all events up to the current time
    while (eventIndexRef.current < script.events.length && script.events[eventIndexRef.current].timestamp <= elapsed) {
      processEvent(script.events[eventIndexRef.current]);
      eventIndexRef.current++;
    }

    if (elapsed >= totalTime) {
      setStatus('ended');
      return;
    }

    requestRef.current = requestAnimationFrame(update);
  }, [script, totalTime, processEvent]);

  const play = useCallback((onToolCall?: (msg: AgentToolCall) => void) => {
    if (!script) return;
    if (onToolCall) {
      onToolCallRef.current = onToolCall;
    }

    if (status === 'idle' || status === 'ended') {
      resetState();
      startTimeRef.current = 0;
    } else if (status === 'paused') {
      startTimeRef.current = 0; // Will be recalculated in update
    }

    setStatus('playing');
    requestRef.current = requestAnimationFrame(update);
    Logger.info('[GOLDEN_SCRIPT]', 'Playback started');
  }, [script, status, resetState, update]);

  const pause = useCallback(() => {
    if (status !== 'playing') return;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    pausedTimeRef.current = currentTime;
    setStatus('paused');
    Logger.info('[GOLDEN_SCRIPT]', 'Playback paused');
  }, [status, currentTime]);

  const seek = useCallback((timeMs: number) => {
    if (!script) return;

    // Snap to nearest time between 0 and totalTime
    const targetTime = Math.max(0, Math.min(timeMs, totalTime));

    // Reset state and fast-forward to the target time
    setTranscriptChunks([]);
    setSceneMode('transcript');

    let newIndex = 0;
    while (newIndex < script.events.length && script.events[newIndex].timestamp <= targetTime) {
      processEvent(script.events[newIndex]);
      newIndex++;
    }

    eventIndexRef.current = newIndex;
    setCurrentTime(targetTime);
    pausedTimeRef.current = targetTime;

    if (status === 'playing') {
      startTimeRef.current = performance.now() - targetTime;
    }
  }, [script, totalTime, processEvent, status]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {
    status,
    currentTime,
    totalTime,
    transcriptChunks,
    sceneMode,
    play,
    pause,
    seek,
    setSceneMode
  };
}
