import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TranscriptChunk } from '@/lib/session/types';

interface TranscriptViewProps {
  chunks: TranscriptChunk[];
  band: number;
  isActive: boolean;
  chapterId: string;
}

/**
 * TranscriptView — SRT-style subtitle display for the AI's narration.
 * Shows only the last 2-3 sentences at a time. Older sentences fade out.
 */
export function TranscriptView({ chunks, band, isActive, chapterId }: TranscriptViewProps) {
  const isResting = chunks.length === 0;

  // Split all chunk text into real sentences using punctuation
  const sentences = useMemo(() => {
    const fullText = chunks.map(c => c.text.trim()).filter(Boolean).join(' ');
    if (!fullText) return [];

    // Split on sentence-ending punctuation, keeping the punctuation attached
    const raw = fullText.match(/[^.!?]+[.!?]+[\s]*/g);
    if (!raw) return [fullText.trim()];

    return raw.map(s => s.trim()).filter(Boolean);
  }, [chunks]);

  const maxVisible = band <= 3 ? 2 : 3;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background overflow-hidden px-4 md:px-8">
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="w-full max-w-[720px] relative z-0">
        <AnimatePresence mode="wait">
          {isResting ? (
            <RestingState chapterId={chapterId} isActive={isActive} />
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <SubtitleDisplay sentences={sentences} maxVisible={maxVisible} band={band} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** SRT-style subtitle display — shows last N sentences, older ones fade */
function SubtitleDisplay({ sentences, maxVisible, band }: { sentences: string[]; maxVisible: number; band: number }) {
  if (sentences.length === 0) return null;

  const visible = sentences.slice(-maxVisible);
  const startIndex = Math.max(0, sentences.length - maxVisible);

  const fontSize = band <= 3 ? 'text-[1.75rem] md:text-[2rem]' : 'text-[1.25rem] md:text-[1.5rem]';
  const leading = band <= 3 ? 'leading-[1.7]' : 'leading-[1.6]';

  return (
    <div className="flex flex-col space-y-3">
      <AnimatePresence mode="popLayout">
        {visible.map((sentence, i) => {
          const absoluteIndex = startIndex + i;
          const isNewest = i === visible.length - 1;

          return (
            <motion.p
              key={absoluteIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: isNewest ? 1 : 0.35,
                y: 0,
              }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`${fontSize} ${leading} font-display font-medium text-center text-foreground`}
            >
              {sentence}
            </motion.p>
          );
        })}
      </AnimatePresence>
    </div>
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
      className="text-center space-y-4"
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
