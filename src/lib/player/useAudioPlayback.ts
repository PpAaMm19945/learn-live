import { useState, useRef, useCallback } from 'react';

interface UseAudioPlaybackProps {
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export function useAudioPlayback({ onEnded, onError }: UseAudioPlaybackProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        setIsPlaying(false);
        onEnded?.();
      };
      audioRef.current.onerror = (e) => {
        setIsPlaying(false);
        setIsLoading(false);
        onError?.(new Error('Audio playback failed: ' + (typeof e === 'string' ? e : 'Unknown error')));
      };
    }
    return audioRef.current;
  };

  const playAudio = useCallback(async (audioFileId: string, text: string) => {
    const audio = initAudio();
    setIsLoading(true);
    
    // 1. Try fetching from R2 directly via Cloudflare Assets
    const workerUrl = import.meta.env.VITE_WORKER_URL || '';
    const audioUrl = `${workerUrl}/api/assets/audio/${audioFileId}.mp3`;
    
    try {
      // Use head to check if exists, wait, just try fetch directly
      const r2Res = await fetch(audioUrl, { method: 'HEAD' });
      
      if (r2Res.ok) {
        audio.src = audioUrl;
        audio.load();
        await audio.play();
        setIsLoading(false);
        setIsPlaying(true);
        return;
      }

      // 2. If 404, call on-demand generator
      const genRes = await fetch(`${workerUrl}/api/tts/on-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioFileId, text }),
      });

      if (!genRes.ok) {
        throw new Error('Failed to generate audio on demand');
      }

      const { r2Key } = await genRes.json();
      
      audio.src = `${workerUrl}/api/assets/${r2Key}`;
      audio.load();
      await audio.play();
      
      setIsLoading(false);
      setIsPlaying(true);
    } catch (e: any) {
      console.error('Audio playback error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      onError?.(e);
      // Even on error, we might want to let the script proceed
      onEnded?.();
    }
  }, [onEnded, onError]);

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
    isLoading
  };
}
