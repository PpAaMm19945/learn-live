import { renderHook, act } from '@testing-library/react';
import { useScriptPlayer } from './useScriptPlayer';
import { LessonScript } from './types';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const dummyScript: LessonScript = {
  version: '1.0',
  chapterId: 'ch1',
  band: 3,
  title: 'Test Lesson',
  estimatedDurationMs: 10000,
  pronunciationOverrides: {},
  cues: [
    {
      id: 'cue1',
      timestampMs: 0,
      durationMs: 3000,
      action: 'speak',
      params: { text: 'Hello world', audioFileId: 'audio1' },
    },
    {
      id: 'cue2',
      timestampMs: 3000,
      durationMs: 4000,
      action: 'speak',
      params: { text: 'This is a test', audioFileId: 'audio2' },
    },
    {
      id: 'cue3',
      timestampMs: 7000,
      durationMs: 3000,
      action: 'speak',
      params: { text: 'Goodbye', audioFileId: 'audio3' },
    },
    {
      id: 'cue4',
      timestampMs: 1000,
      durationMs: 8000,
      action: 'show_component',
      params: {
        componentType: 'scene_image',
        componentId: 'img1',
        data: { url: 'test.jpg' },
        transition: 'fade',
      },
    },
    {
      id: 'cue5',
      timestampMs: 9000,
      durationMs: 0,
      action: 'hide_component',
      params: {
        componentId: 'img1',
        transition: 'fade',
      },
    },
  ],
};

describe('useScriptPlayer', () => {
  let requestAnimationFrameSpy: any;
  let cancelAnimationFrameSpy: any;

  beforeEach(() => {
    vi.useFakeTimers();
    let time = 0;

    // Simple mock using setTimeout/clearTimeout
    const timeouts = new Map<number, NodeJS.Timeout>();
    let idCounter = 1;

    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        const id = idCounter++;
        const timeoutId = setTimeout(() => {
           time += 16;
           cb(time);
           timeouts.delete(id);
        }, 16);
        timeouts.set(id, timeoutId);
        return id as any;
    });

    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
        const timeoutId = timeouts.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeouts.delete(id);
        }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes in idle state', () => {
    const { result } = renderHook(() => useScriptPlayer(dummyScript));
    expect(result.current.phase).toBe('idle');
    expect(result.current.currentTimeMs).toBe(0);
    expect(result.current.activeCues).toEqual([]);
    expect(result.current.visibleComponents.size).toBe(0);
  });

  it('updates state when seeking', () => {
    const { result } = renderHook(() => useScriptPlayer(dummyScript));

    act(() => {
      result.current.seek(1500);
    });

    expect(result.current.currentTimeMs).toBe(1500);
    expect(result.current.activeCues.map((c) => c.id)).toEqual(['cue1', 'cue4']);
    expect(result.current.transcriptText).toBe('Hello world');
    expect(result.current.visibleComponents.has('img1')).toBe(true);

    act(() => {
      result.current.seek(4000);
    });

    expect(result.current.currentTimeMs).toBe(4000);
    expect(result.current.activeCues.map((c) => c.id)).toEqual(['cue2', 'cue4']);
    expect(result.current.transcriptText).toBe('This is a test');
  });

  it('plays and pauses correctly', async () => {
    const { result } = renderHook(() => useScriptPlayer(dummyScript));

    act(() => {
      result.current.play();
    });

    expect(result.current.phase).toBe('playing');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // allow some drift because of 16ms increments
    expect(result.current.currentTimeMs).toBeGreaterThanOrEqual(1980);
    expect(result.current.currentTimeMs).toBeLessThanOrEqual(2020);
    expect(result.current.activeCues.map(c => c.id)).toEqual(['cue1', 'cue4']);

    act(() => {
      result.current.pause();
    });

    expect(result.current.phase).toBe('paused');

    const timeWhenPaused = result.current.currentTimeMs;

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.currentTimeMs).toBe(timeWhenPaused); // Time should not advance while paused
  });

  it('triggers onAudioCue', () => {
    const onAudioCue = vi.fn();
    const { result } = renderHook(() => useScriptPlayer(dummyScript, { onAudioCue }));

    act(() => {
      result.current.play();
    });

    act(() => {
       vi.advanceTimersByTime(16);
    });

    // Initial audio trigger
    expect(onAudioCue).toHaveBeenCalledWith('audio1');

    act(() => {
      vi.advanceTimersByTime(3500); // At ~3.5s
    });

    expect(result.current.currentTimeMs).toBeGreaterThan(3000);
    expect(onAudioCue).toHaveBeenCalledWith('audio2');
  });

  it('completes playback', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useScriptPlayer(dummyScript, { onComplete }));

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(result.current.phase).toBe('complete');
    expect(result.current.currentTimeMs).toBe(10000);
    expect(onComplete).toHaveBeenCalled();
  });
});
