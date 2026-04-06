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
 * TranscriptView — scrollable transcript with kinetic emphasis on newest sentence.
 */
export function TranscriptView({ chunks, band, isActive, chapterId }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isResting = chunks.length === 0;

  const sentences = useMemo(() => {
    const result: string[] = [];
    let currentSentence = '';

    for (const chunk of chunks) {
      const text = chunk.text.trim();
      if (text) {
        currentSentence = currentSentence ? `${currentSentence} ${text}` : text;
      }

      if (chunk.isFinal) {
        if (currentSentence.trim()) {
          result.push(currentSentence.trim());
        }
        currentSentence = '';
      }
    }

    if (currentSentence.trim()) {
      result.push(currentSentence.trim());
    }

    return result;
  }, [chunks]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNearBottom = distanceFromBottom < 120;
    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [sentences]);

  const fontClass = band >= 4 ? 'text-[1.35rem] leading-[1.6]' : 'text-[1.75rem] leading-[1.7]';

  return (
    <div className="relative w-full h-full bg-background px-4 md:px-8 py-24">
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {isResting ? (
        <div className="w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
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
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
                    <p className="text-lg text-muted-foreground">Your teacher is preparing...</p>
                  </>
                ) : (
                  <p className="text-lg text-muted-foreground">Waiting for your teacher...</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="relative z-0 h-full overflow-y-auto pr-2"
        >
          <div className="mx-auto max-w-[760px] pb-24 pt-10 space-y-6">
            {sentences.map((sentence, index) => {
              const isNewest = index === sentences.length - 1;
              return (
                <motion.p
                  key={`${index}-${sentence.slice(0, 20)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isNewest ? 1 : 0.74, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${fontClass} font-display text-foreground text-left md:text-center`}
                >
                  {sentence}
                </motion.p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
