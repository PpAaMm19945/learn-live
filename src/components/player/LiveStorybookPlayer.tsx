import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSession } from '@/lib/session/useSession';
import { useRecorder } from '@/lib/session/useRecorder';
import { useLearnerStore } from '@/lib/learnerStore';
import { resolveImageUrl } from '@/lib/r2Assets';
import { R2Image } from '@/components/ui/R2Image';
import type { AgentToolCall, TranscriptChunk } from '@/lib/session/types';
import type { DebugEvent } from '@/components/session/DebugDrawer';
import { createDebugEvent } from '@/components/session/DebugDrawer';

interface LiveStorybookPlayerProps {
  chapterId: string;
  band: number;
  onExit: () => void;
  onComplete: () => void;
}

interface BeatSlide {
  id: number;
  imageUrl: string;
  caption: string;
  question?: { question: string; type?: string };
}

/**
 * LiveStorybookPlayer — WebSocket-connected storybook for Bands 0-1.
 * Uses the same useSession hook as SessionCanvas but renders in a
 * full-bleed storybook layout (60/40 split, large images, large captions).
 * No map, no MapLibre, no overlay queue — just images + narration + audio.
 */
export function LiveStorybookPlayer({ chapterId, band, onExit, onComplete }: LiveStorybookPlayerProps) {
  const { familyId, activeLearnerId } = useLearnerStore();
  const [slides, setSlides] = useState<BeatSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const slideCounterRef = useRef(0);
  const lastAutoConnectKeyRef = useRef<string | null>(null);

  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);
  const handleDebugEvent = useCallback((evt: DebugEvent) => {
    setDebugEvents(prev => [...prev.slice(-100), evt]);
  }, []);

  const { recordEvent, stop: stopRecording } = useRecorder({ chapterId, band, recording: true });

  const {
    status, transcriptChunks, error,
    hasReceivedMessage, pipelineStatus,
    connect, disconnect,
  } = useSession({
    chapterId,
    familyId: familyId || '',
    learnerId: activeLearnerId || '',
    band,
    agentUrl: import.meta.env.VITE_AGENT_URL || 'http://localhost:8080',
    onDebug: handleDebugEvent,
  });

  // Build slides from tool calls + transcript
  const handleAgentToolCall = useCallback((msg: AgentToolCall) => {
    // Intercept set_scene(image) → create new slide
    if (msg.tool === 'set_scene' && msg.args?.mode === 'image') {
      const rawUrl = msg.args.imageUrl || '';
      const resolvedUrl = rawUrl ? resolveImageUrl(rawUrl) : '';
      const newSlide: BeatSlide = {
        id: slideCounterRef.current++,
        imageUrl: resolvedUrl,
        caption: msg.args.caption || '',
      };
      setSlides(prev => {
        const updated = [...prev, newSlide];
        // Auto-advance to newest slide
        setDirection(1);
        setCurrentSlideIndex(updated.length - 1);
        return updated;
      });
      return;
    }

    // Intercept show_question → attach to current slide
    if (msg.tool === 'show_question') {
      setSlides(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          question: { question: msg.args.question, type: msg.args.type },
        };
        return updated;
      });
      return;
    }

    // Ignore map tools, overlays, etc. — not used in storybook mode
  }, []);

  const handleAgentToolCallRef = useRef(handleAgentToolCall);
  const connectRef = useRef(connect);
  const recordEventRef = useRef(recordEvent);
  useEffect(() => { handleAgentToolCallRef.current = handleAgentToolCall; }, [handleAgentToolCall]);
  useEffect(() => { connectRef.current = connect; }, [connect]);
  useEffect(() => { recordEventRef.current = recordEvent; }, [recordEvent]);

  // Auto-connect
  useEffect(() => {
    if (familyId && activeLearnerId) {
      const connectKey = `${familyId}:${activeLearnerId}:${chapterId}:${band}`;
      if (lastAutoConnectKeyRef.current !== connectKey) {
        lastAutoConnectKeyRef.current = connectKey;
        connectRef.current(handleAgentToolCallRef.current, recordEventRef.current);
      }
    }
  }, [familyId, activeLearnerId, chapterId, band]);

  // Update caption from transcript chunks
  useEffect(() => {
    if (transcriptChunks.length === 0) return;
    const latestText = transcriptChunks[transcriptChunks.length - 1]?.text?.trim();
    if (!latestText) return;

    setSlides(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      // Append or replace caption with latest transcript
      updated[updated.length - 1] = { ...last, caption: latestText };
      return updated;
    });
  }, [transcriptChunks]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 3) {
      // Left third → go back
      if (currentSlideIndex > 0) {
        setDirection(-1);
        setCurrentSlideIndex(prev => prev - 1);
      }
    } else {
      // Right two-thirds → go forward
      if (currentSlideIndex < slides.length - 1) {
        setDirection(1);
        setCurrentSlideIndex(prev => prev + 1);
      }
    }
  };

  const handleEndSession = () => {
    disconnect();
    onExit();
  };

  const currentSlide = slides[currentSlideIndex];
  const isConnected = status === 'connected' || status === 'reconnecting';
  const isEnded = status === 'ended';

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  // Loading / connecting states
  if (!familyId || !activeLearnerId) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Preparing your story...</p>
      </div>
    );
  }

  if (status === 'connecting' && slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">
          {pipelineStatus?.detail || 'Getting your story ready...'}
        </p>
      </div>
    );
  }

  if (status === 'error' && slides.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-2xl font-bold text-foreground">Story Not Available</h2>
        <p className="text-muted-foreground">{error || 'Something went wrong.'}</p>
        <button onClick={onExit} className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden select-none cursor-pointer bg-background"
      onClick={handleTap}
    >
      {/* Exit Button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <button
          onClick={(e) => { e.stopPropagation(); handleEndSession(); }}
          className="p-3 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md rounded-full text-foreground transition-colors pointer-events-auto"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Status indicator */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {isConnected ? 'Live' : 'Connecting'}
        </span>
      </div>

      {/* Main content */}
      <AnimatePresence initial={false} custom={direction}>
        {currentSlide ? (
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
          >
            {/* Image Area — full bleed */}
            <div className="h-[55%] md:h-full md:w-[60%] bg-background flex items-center justify-center p-4 md:p-8">
              <div className="relative aspect-square max-w-full max-h-full flex items-center justify-center shadow-lg border border-border rounded-xl overflow-hidden bg-void/5">
                <R2Image
                  src={currentSlide.imageUrl}
                  alt={currentSlide.caption}
                  className="relative z-10 w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                />
              </div>
            </div>

            {/* Text Area */}
            <div className="h-[45%] md:h-full md:w-[40%] bg-card p-6 md:p-12 flex flex-col justify-center relative">
              <div className="pointer-events-auto w-full">
                <p className="font-display text-[1.75rem] leading-[2.0] text-card-foreground font-medium text-center md:text-left mx-auto max-w-2xl">
                  {currentSlide.caption}
                </p>

                {/* Inline question card */}
                {currentSlide.question && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl"
                  >
                    <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2 block">
                      {currentSlide.question.type === 'check' ? 'CHECK' : 'THINK'}
                    </span>
                    <p className="text-foreground text-lg font-medium leading-relaxed">
                      {currentSlide.question.question}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="flex space-x-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-primary/60 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <p className="text-lg text-muted-foreground">Your story is loading...</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Progress Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3 z-50 pointer-events-none">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(index > currentSlideIndex ? 1 : -1);
                setCurrentSlideIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 pointer-events-auto ${
                index === currentSlideIndex
                  ? 'bg-primary scale-125'
                  : index < currentSlideIndex
                  ? 'bg-primary/50'
                  : 'bg-border'
              }`}
              aria-label={`Go to scene ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lesson Ended Overlay */}
      <AnimatePresence>
        {isEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[90] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 px-6 text-center"
          >
            <span className="text-5xl">🎉</span>
            <h2 className="text-3xl font-display font-bold text-foreground">Great Job!</h2>
            <p className="text-muted-foreground text-lg">You finished today's story!</p>
            <button
              onClick={() => { disconnect(); onComplete(); }}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
