import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, PhoneOff, Play, Pause, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { SceneMode, TranscriptChunk, AgentToolCall, GoldenScript } from '@/lib/session/types';
import { TranscriptView } from './TranscriptView';
import { useSession } from '@/lib/session/useSession';
import { useRecorder } from '@/lib/session/useRecorder';
import { useGoldenScript } from '@/lib/session/useGoldenScript';
import { useLearnerStore } from '@/lib/learnerStore';
import { TeachingCanvas, type TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { handleToolCall } from '@/lib/canvas/toolCallHandler';

interface SessionCanvasProps {
  chapterId: string;
  band: number;
  learnerName: string;
  onExit: () => void;
}

/**
 * SessionCanvas — the full-bleed immersive teaching viewport.
 * 
 * Default state: Kinetic transcript view (typography-first).
 * The AI agent controls scene transitions via set_scene tool calls.
 * Visual scenes (map, image, overlay) slide over the transcript and recede when dismissed.
 */
export function SessionCanvas({ chapterId, band, learnerName, onExit }: SessionCanvasProps) {
  const { familyId, activeLearnerId } = useLearnerStore();
  const canvasRef = useRef<TeachingCanvasRef>(null);

  const [useFallback, setUseFallback] = useState(false);
  const [goldenScriptData, setGoldenScriptData] = useState<GoldenScript | null>(null);
  const fallbackCheckTimeoutRef = useRef<number | null>(null);

  // Recorder hook
  const { recordEvent, stop: stopRecording } = useRecorder({
    chapterId,
    band,
    recording: !useFallback,
  });

  // Playback hook (fallback)
  const goldenScript = useGoldenScript(goldenScriptData);

  const {
    status,
    transcriptChunks,
    sceneMode,
    error,
    isMuted,
    connect,
    disconnect,
    toggleMute,
    setSceneMode: setLiveSceneMode
  } = useSession({
    chapterId,
    familyId: familyId || 'anonymous',
    learnerId: activeLearnerId || 'anonymous',
    band,
    agentUrl: import.meta.env.VITE_AGENT_URL || 'http://localhost:8080'
  });

  const handleAgentToolCall = useCallback((msg: AgentToolCall) => {
    handleToolCall(canvasRef.current, msg, useFallback ? goldenScript.setSceneMode : setLiveSceneMode);
  }, [setLiveSceneMode, useFallback, goldenScript.setSceneMode]);

  useEffect(() => {
    if (status === 'idle' && !useFallback) {
      connect(handleAgentToolCall, recordEvent);
    }
  }, [status, connect, handleAgentToolCall, recordEvent, useFallback]);

  useEffect(() => {
    if (status === 'connecting' && !useFallback) {
      fallbackCheckTimeoutRef.current = window.setTimeout(async () => {
         const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
         const goldenScriptUrl = `${apiUrl}/api/golden-scripts/${chapterId}/${band}`;
         try {
           console.log(`[GOLDEN_SCRIPT] Fetching fallback from ${goldenScriptUrl}`);
           const res = await fetch(goldenScriptUrl);
           const contentType = res.headers.get('content-type') || '';
           if (!contentType.includes('application/json')) {
              const text = await res.text();
              console.error(`[GOLDEN_SCRIPT] Non-JSON response (${res.status}, ${contentType}): ${text.substring(0, 200)}`);
              return;
           }
           if (res.ok) {
              const data = await res.json();
              setGoldenScriptData(data);
              setUseFallback(true);
              disconnect(); // Stop trying live connection
           } else {
              const errData = await res.json();
              console.warn(`[GOLDEN_SCRIPT] Fallback not available: ${res.status}`, errData);
           }
         } catch (e) {
           console.error('[GOLDEN_SCRIPT] Fallback fetch failed', e);
         }
      }, 5000);
    }

    return () => {
       if (fallbackCheckTimeoutRef.current) {
         clearTimeout(fallbackCheckTimeoutRef.current);
       }
    };
  }, [status, useFallback, chapterId, band, disconnect]);

  useEffect(() => {
      if (useFallback && goldenScriptData && goldenScript.status === 'idle') {
          goldenScript.play(handleAgentToolCall);
      }
  }, [useFallback, goldenScriptData, goldenScript.status, goldenScript.play, handleAgentToolCall]);

  const handleEndSession = () => {
    if (useFallback) {
      goldenScript.pause();
    } else {
      disconnect();
    }
    onExit();
  };

  const handleSaveGoldenScript = async () => {
     const script = stopRecording();
     if (!script) {
        toast.error('No events recorded in this session.');
        return;
     }

      try {
          const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
          const res = await fetch(`${apiUrl}/api/golden-scripts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(script)
          });

          if (res.ok) {
             toast.success('Session saved as Golden Script');
          } else {
             const err = await res.json();
             toast.error(err.error || 'Failed to save Golden Script');
          }
      } catch (e) {
          toast.error('Failed to save Golden Script');
      }
  };

  const isConnected = useFallback ? goldenScript.status === 'playing' : status === 'connected';
  const displaySceneMode = useFallback ? goldenScript.sceneMode : sceneMode;
  const displayTranscriptChunks = useFallback ? goldenScript.transcriptChunks : transcriptChunks;

  if (status === 'connecting' && !useFallback) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Connecting to your teacher...</p>
      </div>
    );
  }

  if (status === 'error' && !useFallback) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <span className="text-4xl text-destructive">⚠️</span>
        <h2 className="text-2xl font-bold">Connection Failed</h2>
        <p className="text-muted-foreground">{error || 'Your teacher is unavailable.'}</p>
        <div className="flex gap-4">
          <button
            onClick={() => connect(handleAgentToolCall)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-muted text-foreground rounded-full hover:bg-muted/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if ((status === 'ended' && !useFallback) || (useFallback && goldenScript.status === 'ended')) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <h2 className="text-3xl font-display font-bold">Session Ended</h2>
        <p className="text-muted-foreground">Thank you for learning with us today.</p>
        <div className="flex gap-4">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
          {!useFallback && (
            <button
              onClick={handleSaveGoldenScript}
              className="px-6 py-3 bg-muted text-foreground flex items-center gap-2 rounded-full hover:bg-muted/80 transition-colors"
            >
              <Save className="w-4 h-4" /> Save as Golden Script
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-background overflow-hidden select-none flex flex-col"
    >
      {/* Minimal top bar — fades on inactivity */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
        <button
          onClick={onExit}
          className="p-3 bg-muted/40 hover:bg-muted/60 backdrop-blur-md rounded-full text-foreground transition-colors pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Connection indicator */}
        <div className="ml-auto pointer-events-auto flex items-center gap-2">
          {useFallback && (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary rounded-full mr-2">
              Recorded session
            </span>
          )}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
          <span className="text-xs text-muted-foreground">
            {useFallback ? (goldenScript.status === 'playing' ? 'Playing' : 'Paused') : (isConnected ? 'Live' : 'Connecting...')}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Transcript layer — always present, slides behind scenes */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            displaySceneMode === 'transcript' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <TranscriptView
            chunks={displayTranscriptChunks}
            band={band}
            isActive={isConnected}
            chapterId={chapterId}
          />
        </div>

        {/* Scene overlay — slides in from right when AI triggers a visual */}
        <AnimatePresence>
          {displaySceneMode !== 'transcript' && (
            <motion.div
              key="scene"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 bg-background"
            >
              <div className="w-full h-full bg-background relative z-10">
                 {/* Map Scene is always mounted so canvasRef works, but only visible when displaySceneMode === 'map' */}
                 <div className={`absolute inset-0 ${displaySceneMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                   <TeachingCanvas ref={canvasRef} />
                 </div>

                 {displaySceneMode === 'image' && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">
                       <p>Image scene</p>
                    </div>
                 )}
                 {displaySceneMode === 'overlay' && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">
                       <p>Overlay scene</p>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-muted/20 backdrop-blur-sm rounded-full px-6 py-3 pointer-events-auto">
          {useFallback ? (
            <button
              onClick={() => {
                if (goldenScript.status === 'playing') goldenScript.pause();
                else goldenScript.play(handleAgentToolCall);
              }}
              className="p-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors"
            >
              {goldenScript.status === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          ) : (
            band >= 3 && (
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )
          )}

          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              {displaySceneMode === 'transcript' ? (useFallback ? 'playing' : 'listening') : displaySceneMode}
            </p>
          </div>

          <button
            onClick={handleEndSession}
            className="p-3 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-full transition-colors"
            title="End Session"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
