import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { TranscriptChunk } from '@/lib/session/types';

interface TranscriptViewProps {
  chunks: TranscriptChunk[];
  band: number;
  isActive: boolean;
  chapterId: string;
  pipelineStatus?: { step: string; detail?: string } | null;
}

/**
 * TranscriptView — Card-based transcript display.
 * Each beat/chunk renders as a discrete card. The latest card is prominent,
 * older cards fade and stack above. Auto-scrolls to the newest card.
 */
export function TranscriptView({ chunks, band, isActive, chapterId, pipelineStatus }: TranscriptViewProps) {
  const isResting = chunks.length === 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group chunks into cards — each chunk becomes a card
  const cards = useMemo(() => {
    return chunks
      .map((c, i) => ({ id: i, text: c.text.trim() }))
      .filter(c => c.text.length > 0);
  }, [chunks]);

  // Auto-scroll to newest card
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [cards.length]);

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-16 relative z-0">
        <div className="max-w-[680px] mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {isResting ? (
              <RestingState chapterId={chapterId} isActive={isActive} pipelineStatus={pipelineStatus} />
            ) : (
              cards.map((card, i) => {
                const isLatest = i === cards.length - 1;
                return (
                  <TranscriptCard
                    key={card.id}
                    text={card.text}
                    index={i}
                    isLatest={isLatest}
                    band={band}
                  />
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** A single transcript card */
function TranscriptCard({
  text,
  index,
  isLatest,
  band,
}: {
  text: string;
  index: number;
  isLatest: boolean;
  band: number;
}) {
  const fontSize = band <= 2
    ? 'text-xl md:text-2xl'
    : band === 3
    ? 'text-lg md:text-xl'
    : 'text-lg md:text-xl';
  const lineHeightClass = band <= 3 ? 'leading-relaxed' : 'leading-normal';
  const fontWeightClass = band <= 2 ? 'font-semibold' : 'font-medium';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{
        opacity: isLatest ? 1 : 0.4,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl px-6 py-5 transition-colors ${
        isLatest
          ? 'bg-card border border-border shadow-lg'
          : 'bg-transparent border border-transparent'
      }`}
    >
      <div className={`${fontSize} ${lineHeightClass} font-display ${fontWeightClass} text-foreground prose prose-invert prose-sm max-w-none [&_strong]:text-primary [&_em]:text-foreground/80`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          #{index + 1}
        </span>
        {isLatest && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        )}
      </div>
    </motion.div>
  );
}

/** Educational facts shown while the pipeline warms up */
const WARMUP_FACTS = [
  { emoji: '🏛️', text: 'The Kingdom of Kush ruled for over 1,000 years along the Upper Nile.' },
  { emoji: '📜', text: 'Ethiopia has one of the oldest alphabets in the world — Ge\'ez.' },
  { emoji: '⛪', text: 'The Ethiopian Orthodox Church dates back to the 4th century AD.' },
  { emoji: '🗺️', text: 'Ancient Carthage was one of the wealthiest cities in the Mediterranean.' },
  { emoji: '⚒️', text: 'The Haya people of Tanzania were smelting steel 2,000 years ago.' },
  { emoji: '📚', text: 'Timbuktu once housed over 700,000 manuscripts.' },
  { emoji: '🌍', text: 'The Table of Nations in Genesis 10 names Africa\'s earliest peoples.' },
  { emoji: '🏰', text: 'Great Zimbabwe\'s stone walls were built without mortar.' },
  { emoji: '⚓', text: 'Swahili merchants traded with China, India, and Persia.' },
  { emoji: '👑', text: 'Mansa Musa of Mali was the wealthiest person in recorded history.' },
  { emoji: '🔬', text: 'Alexandria\'s ancient library was the largest in the world.' },
  { emoji: '✝️', text: 'Augustine of Hippo — one of Christianity\'s greatest theologians — was African.' },
];

/** Pipeline step labels for user-friendly display */
const PIPELINE_LABELS: Record<string, { label: string; progress: number }> = {
  loading: { label: 'Loading content', progress: 10 },
  preparing: { label: 'Analyzing context', progress: 20 },
  phase_0: { label: 'Assessing your level', progress: 30 },
  phase_1: { label: 'Building framework', progress: 45 },
  phase_2: { label: 'Designing lesson', progress: 60 },
  phase_3: { label: 'Writing narration', progress: 75 },
  phase_4: { label: 'Final review', progress: 90 },
  ready: { label: 'Starting lesson', progress: 100 },
  fallback: { label: 'Adjusting plan', progress: 85 },
};

/** Resting state — chapter title + pipeline progress or rotating facts */
function RestingState({ chapterId, isActive, pipelineStatus }: { 
  chapterId: string; 
  isActive: boolean; 
  pipelineStatus?: { step: string; detail?: string } | null;
}) {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * WARMUP_FACTS.length));
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Track completed pipeline steps
  useEffect(() => {
    if (pipelineStatus?.step) {
      setCompletedSteps(prev => {
        if (prev.includes(pipelineStatus.step)) return prev;
        return [...prev, pipelineStatus.step];
      });
    }
  }, [pipelineStatus?.step]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % WARMUP_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  const fact = WARMUP_FACTS[factIndex];
  const currentPipeline = pipelineStatus?.step ? PIPELINE_LABELS[pipelineStatus.step] : null;
  const hasPipeline = !!currentPipeline;

  return (
    <motion.div
      key="resting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 pt-16"
    >
      <motion.h1
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl md:text-5xl font-display font-bold text-foreground/40 tracking-tight"
      >
        {chapterId.replace(/^ch/, 'Chapter ')}
      </motion.h1>

      {isActive ? (
        <div className="space-y-5">
          {/* Pipeline progress indicator */}
          {hasPipeline ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: '5%' }}
                    animate={{ width: `${currentPipeline.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Current step */}
              <p className="text-sm text-foreground/60 font-medium">
                {pipelineStatus?.detail || currentPipeline.label}
              </p>

              {/* Completed steps trail */}
              <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                {completedSteps.map(step => {
                  const info = PIPELINE_LABELS[step];
                  if (!info || step === pipelineStatus?.step) return null;
                  return (
                    <span key={step} className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
                      <span className="text-primary/60">✓</span> {info.label}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Pulsing dots (no pipeline info yet) */}
              <div className="flex space-x-1 justify-center mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary/60 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground/70 tracking-wide uppercase">
                Connecting to your teacher…
              </p>
            </>
          )}

          {/* Rotating educational fact */}
          <AnimatePresence mode="wait">
            <motion.div
              key={factIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="mt-6 px-6 py-4 rounded-xl bg-primary/5 border border-primary/10 max-w-md mx-auto"
            >
              <p className="text-2xl mb-2">{fact.emoji}</p>
              <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                {fact.text}
              </p>
              <p className="text-[10px] text-muted-foreground/40 mt-2 uppercase tracking-widest">
                Did you know?
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-lg text-muted-foreground">
          Waiting for your teacher…
        </p>
      )}
    </motion.div>
  );
}