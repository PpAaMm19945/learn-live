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
 * TranscriptView — kinetic typography component for the AI's narration.
 * The primary visual surface, replacing static subtitles.
 */
export function TranscriptView({ chunks, band, isActive, chapterId }: TranscriptViewProps) {
  // Determine if we are in a resting state (no chunks)
  const isResting = chunks.length === 0;

  // Process chunks into sentences.
  // We assume words are separated by spaces, and sentences end with a final chunk.
  // We'll group them into sentences based on the `isFinal` flag.
  const sentences = useMemo(() => {
    const result: string[][] = [];
    let currentSentence: string[] = [];

    for (const chunk of chunks) {
      // Split chunk text into words, filter out empty strings
      const words = chunk.text.trim().split(/\s+/).filter(Boolean);
      currentSentence.push(...words);

      if (chunk.isFinal) {
        result.push([...currentSentence]);
        currentSentence = [];
      }
    }

    // Add any remaining words that haven't been finalized yet
    if (currentSentence.length > 0) {
      result.push(currentSentence);
    }

    return result;
  }, [chunks]);

  const isBand23 = band >= 2 && band <= 3;
  const isBand45 = band >= 4 && band <= 5;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background overflow-hidden px-4 md:px-8">
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="w-full max-w-[720px] relative z-0">
        <AnimatePresence mode="wait">
          {isResting ? (
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
                {/* Fallback to display formatted chapterId if no explicit title is provided here, e.g. "ch01" -> "Chapter 01" */}
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
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col space-y-6"
            >
              {isBand23 && (
                <Band23Layout sentences={sentences} />
              )}
              {isBand45 && (
                <Band45Layout sentences={sentences} />
              )}
              {!isBand23 && !isBand45 && (
                <Band23Layout sentences={sentences} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Layout for Band 2-3 (Ages 8-12)
// - Font: system serif at 2rem (32px) / line-height: 1.8
// - Max 6-8 words visible at once (larger chunks, fewer on screen) -> we can just show current sentence but maybe truncate to last N words? Actually the prompt says "Each new sentence replaces the previous". So we just show the LAST sentence.
function Band23Layout({ sentences }: { sentences: string[][] }) {
  if (sentences.length === 0) return null;

  // Show only the very last sentence
  const currentSentence = sentences[sentences.length - 1];

  return (
    <div className="text-[2rem] leading-[1.8] font-display font-medium text-foreground text-center">
      <AnimatedSentence words={currentSentence} stagger={0.08} duration={0.15} />
    </div>
  );
}

// Layout for Band 4-5 (Ages 13+)
// - Font: system serif at 1.5rem (24px) / line-height: 1.6
// - Up to 3 sentences visible (most recent on top or bottom? Prompt says "Up to 3 sentences visible (most recent on top)"). Wait, standard reading is top-to-bottom. If most recent is on top, they read upwards? Let's just render them as blocks. The prompt specifically requested "Up to 3 sentences visible (most recent on top)" or maybe it meant recent at the bottom. Let's stack them.
// Wait, prompt: "Up to 3 sentences visible (most recent on top)". Let's follow that. Actually, standard chat usually puts recent on bottom. But if it says "most recent on top", we'll reverse the last 3.
function Band45Layout({ sentences }: { sentences: string[][] }) {
  if (sentences.length === 0) return null;

  // Get up to 3 most recent sentences
  const recentSentences = sentences.slice(-3).reverse(); // reversing to put most recent on top

  return (
    <div className="flex flex-col space-y-6">
      <AnimatePresence>
        {recentSentences.map((words, index) => {
          // index 0 is the most recent (since we reversed)
          const isMostRecent = index === 0;

          return (
            <motion.div
              key={sentences.length - 1 - index} // use absolute index as key
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isMostRecent ? 1 : 0.4, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[1.5rem] leading-[1.6] font-display font-medium text-center"
            >
              <AnimatedSentence
                words={words}
                stagger={isMostRecent ? 0.08 : 0} // Only stagger the most recent one
                duration={0.15}
                className={isMostRecent ? "text-foreground" : "text-foreground"}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function AnimatedSentence({ words, stagger, duration, className = "" }: { words: string[], stagger: number, duration: number, className?: string }) {
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${i}-${word}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration,
            delay: i * stagger,
            ease: "easeOut"
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
