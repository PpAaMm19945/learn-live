import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useScriptPlayer } from '@/lib/player/useScriptPlayer';
import { LessonScript } from '@/lib/player/types';
import { OverlayControls } from './OverlayControls';
// import { OverlayCaption } from './OverlayCaption';
import { LessonDrawer, LessonDrawerItem } from './LessonDrawer';
import { ComponentRenderer } from './ComponentRenderer';
import { useAutoHide } from './useAutoHide';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Mic, MicOff, PlayCircle } from 'lucide-react';
import { useLearnerStore } from '@/lib/learnerStore';
import { TeachingCanvas, TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { useWebSocketCanvas } from '@/lib/canvas/useWebSocketCanvas';
import { handleToolCall } from '@/lib/canvas/toolCallHandler';
import { VoiceIndicator } from './VoiceIndicator';
import { TranscriptPanel } from './TranscriptPanel';
import { CanvasActionLog } from './CanvasActionLog';
import { useToast } from '@/hooks/use-toast';
import { PostLessonSummary } from './PostLessonSummary';

interface ScriptPlayerProps {
  script: LessonScript;
  lessonTitle: string;
  chapterTitle: string;
  band: number;
  learnerName: string;
  lessons: LessonDrawerItem[];
  chapterGeoJSON?: GeoJSON.FeatureCollection;
  onExit: () => void;
}

export function ScriptPlayer({
  script,
  lessonTitle,
  chapterTitle,
  band,
  learnerName,
  lessons,
  chapterGeoJSON,
  onExit,
}: ScriptPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<TeachingCanvasRef>(null);

  const {
    isConnected,
    isPlaying: wsIsPlaying,
    transcript,
    toolCallLog,
    startSession,
    endSession,
    isMicActive,
    toggleMic,
    error: wsError
  } = useWebSocketCanvas();

  const learnerId = useLearnerStore(s => s.activeLearnerId);
  const familyId = useLearnerStore(s => s.familyId);
  const { toast } = useToast();

  const sessionStartTimeRef = useRef<number>(0);

  const {
    phase,
    setPhase,
    currentTimeMs,
    activeCues,
    visibleComponents,
    transcriptText,
    play,
    pause,
    seek,
    reset,
  } = useScriptPlayer(script, {
    onAudioCue: (id) => console.log('Simulating Audio Play:', id),
    onComplete: () => {
      console.log('Script Complete');
      const workerUrl = import.meta.env.VITE_WORKER_URL || '';
      fetch(`${workerUrl}/api/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learnerId, lessonId: script.chapterId, status: 'completed', band }),
        credentials: 'include'
      }).catch(console.error);

      // Auto-transition to review phase when scripted phase completes
      if (setPhase) setPhase('review');
    },
  });

  // Bridge: intercept __tool_call__ cues and dispatch to TeachingCanvas
  const dispatchedToolsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!canvasRef.current) return;
    for (const [id, params] of visibleComponents.entries()) {
      if ((params.componentType as string) === '__tool_call__' && !dispatchedToolsRef.current.has(id)) {
        dispatchedToolsRef.current.add(id);
        const { tool, args } = params.data as { tool: string; args: Record<string, any> };
        handleToolCall(canvasRef.current, { type: 'tool_call', tool, args });
        setLocalToolLog(prev => [...prev, {
          id: id + '-' + Date.now(),
          time: new Date(),
          tool,
          target: args?.location || args?.regionId || args?.reference || args?.name || '',
        }]);
      }
    }
  }, [visibleComponents]);

  // Local tool call log for offline/script playback
  const [localToolLog, setLocalToolLog] = useState<{ id: string; time: Date; tool: string; target: string }[]>([]);
  const mergedToolLog = [...toolCallLog, ...localToolLog];

  const handleGoLive = useCallback(() => {
    const activeFamilyId = familyId || 'unknown-family';
    const activeLearnerId = learnerId || 'unknown-learner';

    pause();

    startSession(canvasRef, {
      lessonId: script.chapterId || 'unknown',
      familyId: activeFamilyId,
      learnerId: activeLearnerId,
      band
    });

    sessionStartTimeRef.current = Date.now();
    if (setPhase) setPhase('dialogue');
  }, [learnerId, familyId, pause, startSession, script.chapterId, band, setPhase]);

  const handleEndLive = useCallback(() => {
    endSession();
    if (setPhase) setPhase('paused');

    if (sessionStartTimeRef.current > 0) {
      const durationMs = Date.now() - sessionStartTimeRef.current;
      const workerUrl = import.meta.env.VITE_WORKER_URL || '';
      fetch(`${workerUrl}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learnerId, lessonId: script.chapterId, type: 'dialogue', durationMs }),
        credentials: 'include'
      }).catch(console.error);
      sessionStartTimeRef.current = 0;
    }
  }, [endSession, setPhase, learnerId, script.id]);

  useEffect(() => {
    if (wsError) {
       toast({
         title: 'Connection Error',
         description: wsError,
         variant: 'destructive',
       });
       pause();
    }
  }, [wsError, pause, toast]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  const { isVisible: controlsVisible, show: showControls, toggle: toggleControls } = useAutoHide(3000);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-hide overrides based on phase
  const shouldShowControls = controlsVisible || phase === 'dialogue' || phase === 'review' || phase === 'paused';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        phase === 'playing' ? pause() : play();
      } else if (e.code === 'ArrowRight') {
        seek(currentTimeMs + 10000);
        showControls();
      } else if (e.code === 'ArrowLeft') {
        seek(currentTimeMs - 10000);
        showControls();
      } else if (e.code === 'Escape') {
        if (isFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            onExit();
        }
      } else if (e.code === 'KeyF') {
        if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, play, pause, seek, currentTimeMs, showControls, onExit, isFullscreen]);

  useEffect(() => {
      const handleFullscreenChange = () => {
          setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleInteraction = useCallback(() => {
    showControls();
  }, [showControls]);

  // Touch handling for mobile gestures
  const lastTapRef = useRef<{ time: number, x: number } | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    handleInteraction();
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      if (deltaY < -50) {
        setIsDrawerOpen(true);
      }
      touchStartYRef.current = null;
    }

    const now = Date.now();
    const touchX = e.changedTouches[0].clientX;
    const isDoubleTap = lastTapRef.current && (now - lastTapRef.current.time) < 300;

    if (isDoubleTap) {
      const screenWidth = window.innerWidth;
      if (touchX < screenWidth / 2) {
        seek(currentTimeMs - 10000);
      } else {
        seek(currentTimeMs + 10000);
      }
      lastTapRef.current = null;
    } else {
      lastTapRef.current = { time: now, x: touchX };
      toggleControls();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 bg-black text-foreground w-full h-full overflow-hidden select-none ${
        shouldShowControls ? 'cursor-default' : 'cursor-none'
      }`}
      style={{
        display: 'grid',
        gridTemplateColumns: phase === 'dialogue' ? '1fr 320px' : '1fr 0px',
        gridTemplateRows: '64px 1fr 80px', // slightly taller top bar to fit content well
      }}
      onMouseMove={handleInteraction}
      onMouseDown={handleInteraction}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (window.innerWidth >= 768) {
             // toggleControls();
        }
      }}
    >
      {/* Top Metadata Overlay / Bar */}
      <div className="col-span-2 row-start-1 bg-black z-50 px-4 sm:px-6 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => { e.stopPropagation(); onExit(); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-300" />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-medium tracking-wide">
              {chapterTitle}
            </span>
            <h1 className="text-sm font-semibold">{lessonTitle}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           {/* Phase Pill */}
           <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              phase === 'dialogue' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
              phase === 'review' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-green-500/20 text-green-400 border border-green-500/30'
           }`}>
              {phase === 'dialogue' ? 'Dialogue' : phase === 'review' ? 'Review' : 'Teaching'}
           </div>

           <div className="hidden sm:flex items-center bg-zinc-900 border border-border rounded-full px-3 py-1">
               <span className="text-xs font-medium text-zinc-300">{learnerName}</span>
               <span className="mx-2 text-zinc-600">•</span>
               <span className="text-xs text-primary font-bold">Band {band}</span>
           </div>

           <button
            onClick={(e) => { e.stopPropagation(); onExit(); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block"
          >
            <X className="w-5 h-5 text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area (Left) */}
      <div className="col-start-1 row-start-2 relative overflow-hidden bg-zinc-950">
        <TeachingCanvas ref={canvasRef} chapterGeoJSON={chapterGeoJSON} className={`w-full h-full transition-opacity duration-500 ${phase === 'dialogue' ? 'opacity-30' : 'opacity-100'}`} />
        <div className="absolute inset-0 pointer-events-none">
          <ComponentRenderer visibleComponents={visibleComponents} band={band} />
        </div>
      </div>

      {/* Sidebar Area (Right) */}
      <div className="col-start-2 row-start-2 bg-black border-l border-border/50 flex flex-col overflow-hidden">
         {/* Voice Indicator Area */}
         <div className="p-4 border-b border-border/50 shrink-0 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agent Status</span>
            <div className="flex items-center space-x-2">
               {isConnected ? (
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
               ) : (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
               )}
               <VoiceIndicator isSpeaking={wsIsPlaying} />
            </div>
         </div>

         {/* Transcript Area */}
         <div className="flex-1 p-4 overflow-hidden border-b border-border/50">
            <TranscriptPanel transcriptText={transcript || transcriptText} isActive={wsIsPlaying || phase === 'playing'} />
         </div>

         {/* Action Log Area */}
         <div className="h-1/3 p-4 bg-zinc-950">
            <CanvasActionLog logs={mergedToolLog} />
         </div>
      </div>



      {/* Bottom Controls Area */}
      <div className="col-span-2 row-start-3 bg-black z-40 border-t border-border/50">
        <OverlayControls
          isVisible={true}
          isPlaying={phase === 'playing'}
          onPlayPause={phase === 'playing' ? pause : play}
          currentTimeMs={currentTimeMs}
          totalTimeMs={script.estimatedDurationMs}
          onSeek={seek}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onAskQuestion={() => console.log('Ask question clicked')}
          onSettings={() => console.log('Settings clicked')}
          onGoLive={(phase === 'complete' || phase === 'paused' || phase === 'playing') ? handleGoLive : undefined}
          isLive={phase === 'dialogue'}
          onEndLive={handleEndLive}
        />
      </div>

      <AnimatePresence>
         {phase === 'review' && (
           <PostLessonSummary
              isVisible={phase === 'review'}
              totalTimeMs={script.estimatedDurationMs || currentTimeMs}
              topicsCovered={[]}
              onDismiss={() => {
                if (setPhase) setPhase('paused');
                onExit();
              }}
           />
         )}
      </AnimatePresence>

      <AnimatePresence>
         {isDrawerOpen && (
             <LessonDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                chapterTitle={chapterTitle}
                lessons={lessons}
                onSelectLesson={(id) => {
                    console.log('Navigate to lesson:', id);
                    setIsDrawerOpen(false);
                }}
             />
         )}
      </AnimatePresence>
    </div>
  );
}
