import { useState, useEffect, useRef, useCallback } from 'react';
import { LessonScript, Cue, ShowComponentParams } from './types';

export type PlayerPhase = 'idle' | 'playing' | 'paused' | 'dialogue' | 'review' | 'complete';

export interface UseScriptPlayerOptions {
  onAudioCue?: (audioFileId: string) => void;
  onComplete?: () => void;
}

export function useScriptPlayer(script: LessonScript | null, options?: UseScriptPlayerOptions) {
  const [phase, setPhase] = useState<PlayerPhase>('idle');
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [activeCues, setActiveCues] = useState<Cue[]>([]);
  const [visibleComponents, setVisibleComponents] = useState<Map<string, ShowComponentParams>>(new Map());
  const [transcriptText, setTranscriptText] = useState('');

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Need to track triggered audio cues across re-renders
  const triggeredAudioRef = useRef<Set<string>>(new Set());

  // Use refs for values needed inside RAF to avoid restarting it constantly
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const currentTimeMsRef = useRef(currentTimeMs);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const scriptRef = useRef(script);
  useEffect(() => {
    scriptRef.current = script;
  }, [script]);

  const updateStateFromTime = useCallback((timeMs: number, currentPhase: PlayerPhase) => {
    const currentScript = scriptRef.current;
    if (!currentScript) return;

    const newActiveCues = currentScript.cues.filter(
      (cue) => timeMs >= cue.timestampMs && timeMs < cue.timestampMs + cue.durationMs
    );

    setActiveCues((prev) => {
      if (prev.length === newActiveCues.length && prev.every((c, i) => c.id === newActiveCues[i].id)) {
        return prev;
      }
      return newActiveCues;
    });

    const speakCue = newActiveCues.find((c) => c.action === 'speak');
    if (speakCue && speakCue.action === 'speak') {
      setTranscriptText(speakCue.params.text);
    } else {
      setTranscriptText('');
    }

    if (currentPhase === 'playing') {
       newActiveCues.forEach(cue => {
         if (cue.action === 'speak') {
            const audioId = cue.params.audioFileId;
            if (!triggeredAudioRef.current.has(cue.id)) {
                triggeredAudioRef.current.add(cue.id);
                optionsRef.current?.onAudioCue?.(audioId);
            }
         }
       });
    }

    const newVisible = new Map<string, ShowComponentParams>();
    const pastCues = currentScript.cues.filter((cue) => cue.timestampMs <= timeMs);

    pastCues.sort((a, b) => a.timestampMs - b.timestampMs).forEach(cue => {
        if (cue.action === 'show_component') {
            newVisible.set(cue.params.componentId, cue.params);
        } else if (cue.action === 'hide_component') {
            newVisible.delete(cue.params.componentId);
        }
    });

    // Check if map structurally changed before updating state
    setVisibleComponents(prev => {
        if (prev.size !== newVisible.size) return newVisible;
        let diff = false;
        for (const [key, val] of newVisible) {
            if (prev.get(key) !== val) {
                diff = true;
                break;
            }
        }
        return diff ? newVisible : prev;
    });

  }, []);

  const tick = useCallback((time: number) => {
    if (phaseRef.current !== 'playing') {
      lastTimeRef.current = null;
      return;
    }

    const currentScript = scriptRef.current;

    if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        updateStateFromTime(currentTimeMsRef.current, phaseRef.current);
    } else {
      const delta = time - lastTimeRef.current;
      const newTime = currentTimeMsRef.current + delta;

      if (currentScript && newTime >= currentScript.estimatedDurationMs) {
         currentTimeMsRef.current = currentScript.estimatedDurationMs;
         setCurrentTimeMs(currentScript.estimatedDurationMs);
         setPhase('complete');
         optionsRef.current?.onComplete?.();
         updateStateFromTime(currentScript.estimatedDurationMs, 'complete');
         return; // Stop RAF loop naturally
      } else {
         currentTimeMsRef.current = newTime;
         setCurrentTimeMs(newTime);
         updateStateFromTime(newTime, phaseRef.current);
      }
      lastTimeRef.current = time;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [updateStateFromTime]);

  useEffect(() => {
    if (phase === 'playing') {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, tick]);

  const play = useCallback(() => {
    if (phase === 'complete') {
        setCurrentTimeMs(0);
        currentTimeMsRef.current = 0;
        updateStateFromTime(0, 'playing');
    }
    setPhase('playing');
  }, [phase, updateStateFromTime]);

  const pause = useCallback(() => {
    setPhase('paused');
  }, []);

  const seek = useCallback((ms: number) => {
    let target = Math.max(0, ms);
    if (scriptRef.current) target = Math.min(target, scriptRef.current.estimatedDurationMs);
    setCurrentTimeMs(target);
    currentTimeMsRef.current = target;
    updateStateFromTime(target, phaseRef.current);
  }, [updateStateFromTime]);

  const reset = useCallback(() => {
    setPhase('idle');
    setCurrentTimeMs(0);
    currentTimeMsRef.current = 0;
    setActiveCues([]);
    setVisibleComponents(new Map());
    setTranscriptText('');
    triggeredAudioRef.current.clear();
  }, []);

  useEffect(() => {
      if (currentTimeMs === 0) {
          triggeredAudioRef.current.clear();
      }
  }, [currentTimeMs]);

  return {
    phase,
    currentTimeMs,
    activeCues,
    visibleComponents,
    transcriptText,
    play,
    pause,
    seek,
    reset,
  };
}
