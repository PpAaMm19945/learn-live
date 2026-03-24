import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useScriptPlayer } from '@/lib/player/useScriptPlayer';
import { LessonScript } from '@/lib/player/types';
import { OverlayControls } from './OverlayControls';
import { OverlayCaption } from './OverlayCaption';
import { LessonDrawer, LessonDrawerItem } from './LessonDrawer';
import { ComponentRenderer } from './ComponentRenderer';
import { useAutoHide } from './useAutoHide';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { TeachingCanvas, TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { useWebSocketCanvas } from '@/lib/canvas/useWebSocketCanvas';
import { handleToolCall, ToolCallMessage } from '@/lib/canvas/toolCallHandler';
import { VoiceIndicator } from './VoiceIndicator';
import { TranscriptPanel } from './TranscriptPanel';
import { CanvasActionLog } from './CanvasActionLog';

interface ScriptPlayerProps {
  script: LessonScript;
  lessonTitle: string;
  chapterTitle: string;
  band: number;
  learnerName: string;
  lessons: LessonDrawerItem[];
  onExit: () => void;
}

export function ScriptPlayer({
  script,
  lessonTitle,
  chapterTitle,
  band,
  learnerName,
  lessons,
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
  } = useWebSocketCanvas(import.meta.env.VITE_WS_URL || 'ws://localhost:3000');

  const {
    phase,
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
    onComplete: () => console.log('Script Complete'),
  });

  useEffect(() => {
    startSession(canvasRef);
    return () => {
      endSession();
    };
  }, [startSession, endSession]);

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
        gridTemplateColumns: '1fr 320px',
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
        <TeachingCanvas ref={canvasRef} className={`w-full h-full transition-opacity duration-500 ${phase === 'dialogue' ? 'opacity-30' : 'opacity-100'}`} />
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
            <CanvasActionLog logs={toolCallLog} />
         </div>
      </div>

      {/* Dialogue UI Overlay (Centered over everything) */}
      <AnimatePresence>
        {phase === 'dialogue' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-2 row-span-3 absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          >
             <div className="bg-purple-900/40 border border-purple-500/50 backdrop-blur-lg rounded-3xl p-8 max-w-lg text-center shadow-2xl shadow-purple-900/50 pointer-events-auto">
                 <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                     <span className="text-3xl">🎤</span>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Listening...</h2>
                 <p className="text-purple-200">What would you like to know?</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        />
      </div>

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
