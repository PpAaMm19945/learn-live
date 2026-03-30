import { useState, useRef, useCallback } from 'react';

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedRef = useRef<(() => void) | null>(null);
  const onErrorRef = useRef<((error: Error) => void) | null>(null);
  const onStartedRef = useRef<(() => void) | null>(null);

  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        onEndedRef.current?.();
      };
      audioRef.current.onerror = (e) => {
        setIsPlaying(false);
        setIsLoading(false);
        const err = new Error('Audio playback failed: ' + (typeof e === 'string' ? e : 'Unknown error'));
        console.error('[AUDIO]', err.message);
        onErrorRef.current?.(err);
      };
    }
    return audioRef.current;
  };

  const playAudio = useCallback(async (audioFileId: string, text: string, callbacks?: { onStarted?: () => void; onEnded?: () => void; onError?: (e: Error) => void }) => {
    const audio = initAudio();
    setIsLoading(true);
    
    // Store callbacks for this specific playback
    onEndedRef.current = callbacks?.onEnded || null;
    onErrorRef.current = callbacks?.onError || null;
    onStartedRef.current = callbacks?.onStarted || null;
    
    const workerUrl = import.meta.env.VITE_WORKER_URL || '';
    const audioUrl = `${workerUrl}/api/assets/audio/${audioFileId}.mp3`;
    
    try {
      console.log(`[AUDIO] Checking R2 for ${audioFileId}...`);
      // Use GET instead of HEAD (CF Workers may reject HEAD)
      const r2Res = await fetch(audioUrl, { method: 'GET' });
      
      if (r2Res.ok) {
        console.log(`[AUDIO] Found in R2, playing...`);
        const blob = await r2Res.blob();
        audio.src = URL.createObjectURL(blob);
        await audio.play();
        setIsLoading(false);
        setIsPlaying(true);
        onStartedRef.current?.();
        return;
      }

      console.log(`[AUDIO] Not in R2 (${r2Res.status}), requesting on-demand TTS...`);
      const genRes = await fetch(`${workerUrl}/api/tts/on-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioFileId, text }),
        credentials: 'include',
      });

      if (!genRes.ok) {
        const errBody = await genRes.text();
        throw new Error(`TTS on-demand failed (${genRes.status}): ${errBody}`);
      }

      const { r2Key } = await genRes.json();
      console.log(`[AUDIO] Generated, fetching from ${r2Key}...`);
      
      audio.src = `${workerUrl}/api/assets/${r2Key}`;
      audio.load();
      await audio.play();
      
      setIsLoading(false);
      setIsPlaying(true);
      onStartedRef.current?.();
    } catch (e: any) {
      console.error('Audio playback error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      onErrorRef.current?.(e);
    }
  }, []);

  const pausePlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resumePlayback = useCallback(() => {
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  return {
    playAudio,
    pausePlayback,
    resumePlayback,
    isPlaying,
    isLoading,
  };
}
