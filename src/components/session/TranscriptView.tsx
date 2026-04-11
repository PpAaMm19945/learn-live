import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranscriptChunk } from '@/lib/session/types';

interface TranscriptViewProps {
  chunks: TranscriptChunk[];
  band: number;
  isActive: boolean;
  chapterId: string;
}

/**
 * TranscriptView — Card-based transcript display.
 * Each beat/chunk renders as a discrete card. The latest card is prominent,
 * older cards fade and stack above. Auto-scrolls to the newest card.
 */
export function TranscriptView({ chunks, band, isActive, chapterId }: TranscriptViewProps) {
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
              <RestingState chapterId={chapterId} isActive={isActive} />
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
  const fontSize = band <= 3 ? 'text-xl md:text-2xl' : 'text-lg md:text-xl';

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
      <p className={`${fontSize} leading-relaxed font-display font-medium text-foreground`}>
        {text}
      </p>
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

/** Resting state — chapter title + waiting indicator */
function RestingState({ chapterId, isActive }: { chapterId: string; isActive: boolean }) {
  return (
    <motion.div
      key="resting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-4 pt-32"
    >
      <motion.h1
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl md:text-5xl font-display font-bold text-foreground/40 tracking-tight"
      >
        {chapterId.replace(/^ch/, 'Chapter ')}
      </motion.h1>
      <div className="flex flex-col items-center gap-2">
        {isActive ? (
          <>
            <div className="flex space-x-1 mb-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-muted-foreground rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
            <p className="text-lg text-muted-foreground">
              Your teacher is preparing...
            </p>
          </>
        ) : (
          <p className="text-lg text-muted-foreground">
            Waiting for your teacher...
          </p>
        )}
      </div>
    </motion.div>
  );
}
