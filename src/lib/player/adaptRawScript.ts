import { LessonScript, Cue, SpeakCue, ShowComponentCue } from './types';

/**
 * Raw cue format emitted by the lesson script generator.
 */
interface RawCue {
  type: 'speak' | 'tool_call';
  text?: string;
  tool?: string;
  args?: Record<string, any>;
  timestamp: number; // seconds (float)
}

interface RawScript {
  version?: string;
  chapterId?: string;
  band?: number;
  title?: string;
  estimatedDurationMs?: number;
  pronunciationOverrides?: Record<string, string>;
  cues: RawCue[];
}

/**
 * Adapts the flat raw script JSON produced by the generator into the
 * structured LessonScript format consumed by useScriptPlayer.
 *
 * - Speak cues get a default duration calculated from word count (~150 wpm).
 * - tool_call cues are converted to a synthetic action type that the player
 *   can dispatch to TeachingCanvas via toolCallHandler.
 * - Consecutive cues at the same timestamp share that timestamp; duration
 *   extends to the next distinct timestamp.
 */
export function adaptRawScript(raw: RawScript, chapterId: string, band: number): LessonScript {
  const rawCues = raw.cues || [];

  // Collect all unique timestamps to compute durations
  const timestamps = [...new Set(rawCues.map(c => c.timestamp))].sort((a, b) => a - b);

  function getDuration(ts: number): number {
    const idx = timestamps.indexOf(ts);
    if (idx < timestamps.length - 1) {
      return Math.round((timestamps[idx + 1] - ts) * 1000);
    }
    return 5000; // default last-cue duration
  }

  const cues: Cue[] = rawCues.map((raw, i) => {
    const tsMs = Math.round(raw.timestamp * 1000);
    const durMs = getDuration(raw.timestamp);

    if (raw.type === 'speak' && raw.text) {
      return {
        id: `cue-speak-${i}`,
        timestampMs: tsMs,
        durationMs: durMs,
        action: 'speak' as const,
        params: {
          text: raw.text,
          audioFileId: `audio_${chapterId}_${i}`,
        },
      } satisfies SpeakCue;
    }

    if (raw.type === 'tool_call' && raw.tool) {
      // Encode tool calls as show_component with a special componentType marker.
      // The ScriptPlayer bridge will intercept these and dispatch to TeachingCanvas.
      return {
        id: `cue-tool-${i}`,
        timestampMs: tsMs,
        durationMs: durMs,
        action: 'show_component' as const,
        params: {
          componentType: '__tool_call__' as any,
          componentId: `tool-${i}`,
          data: { tool: raw.tool, args: raw.args || {} },
          transition: 'none' as const,
        },
      } satisfies ShowComponentCue;
    }

    // Fallback — shouldn't happen
    return {
      id: `cue-noop-${i}`,
      timestampMs: tsMs,
      durationMs: durMs,
      action: 'speak' as const,
      params: { text: '', audioFileId: '' },
    } satisfies SpeakCue;
  });

  // Compute total duration
  const lastCue = cues[cues.length - 1];
  const estimatedDurationMs = raw.estimatedDurationMs ||
    (lastCue ? lastCue.timestampMs + lastCue.durationMs : 60000);

  return {
    version: '1.0',
    chapterId: raw.chapterId || chapterId,
    band: raw.band ?? band,
    title: raw.title || `Chapter ${chapterId}`,
    estimatedDurationMs,
    pronunciationOverrides: raw.pronunciationOverrides || {},
    cues,
  };
}
