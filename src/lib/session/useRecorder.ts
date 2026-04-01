import { useRef, useCallback } from 'react';
import type { AgentMessage, GoldenScript, RecordedEvent } from './types';

export function useRecorder({ chapterId, band, recording }: { chapterId: string, band: number, recording: boolean }) {
  const eventsRef = useRef<RecordedEvent[]>([]);
  const startTimeRef = useRef<number | null>(null);

  const recordEvent = useCallback((message: AgentMessage) => {
    if (!recording) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const timestamp = Math.floor(performance.now() - startTimeRef.current);

    // Exclude raw audio data to save space. We can recreate the timing if needed, or simply let the transcript drive timing.
    const messageToRecord = { ...message };
    if (messageToRecord.type === 'audio') {
      messageToRecord.data = ''; // omit heavy base64 payload
    }

    eventsRef.current.push({
      timestamp,
      message: messageToRecord
    });
  }, [recording]);

  const stop = useCallback((): GoldenScript | null => {
    if (eventsRef.current.length === 0 || startTimeRef.current === null) {
      return null;
    }

    // Use the timestamp of the last event as the duration, rather than the time stop() is called,
    // to prevent trailing silence if the user waits before saving.
    const lastEventTimestamp = eventsRef.current[eventsRef.current.length - 1].timestamp;
    const durationMs = lastEventTimestamp + 1000; // Add 1s buffer at the end

    const script: GoldenScript = {
      version: '1.0',
      chapterId,
      band,
      recordedAt: new Date().toISOString(),
      durationMs,
      events: [...eventsRef.current]
    };

    // Reset for next recording if needed
    eventsRef.current = [];
    startTimeRef.current = null;

    return script;
  }, [chapterId, band]);

  return { recordEvent, stop };
}
