import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { AgentToolCall } from '@/lib/session/types';
import { BeatActivityDropdown } from './BeatActivityDropdown';

export interface BeatDisplay {
  id: string | number;
  text: string;
  status?: 'queued' | 'playing' | 'done';
  toolCalls?: AgentToolCall[];
  thinking?: string;
  blockedTools?: { tool: string; reason: string }[];
}

interface TranscriptViewProps {
  beats: BeatDisplay[];
  band: number;
  isActive: boolean;
  chapterId: string;
  pipelineStatus?: { step: string; detail?: string } | null;
}

/**
 * TranscriptView — Read-only scrollable activity log.
 * Each beat = one card: text + status pill + collapsible Activity dropdown.
 * No replay, no pause/play. Pure visibility.
 */
export function TranscriptView({ beats }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [beats.length]);

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-16 relative z-0">
        <div className="max-w-[680px] mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {beats.map((beat, i) => {
              const isLatest = i === beats.length - 1;
              return (
                <TranscriptCard
                  key={beat.id}
                  beat={beat}
                  index={i}
                  isLatest={isLatest}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TranscriptCard({
  beat,
  index,
  isLatest,
}: {
  beat: BeatDisplay;
  index: number;
  isLatest: boolean;
}) {
  const isPlaying = beat.status === 'playing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: isLatest ? 1 : 0.55, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl px-6 py-5 transition-colors ${
        isLatest
          ? 'bg-card border border-border shadow-lg'
          : 'bg-card/40 border border-border/40'
      }`}
    >
      <div className="text-lg md:text-xl leading-relaxed font-display font-medium text-foreground prose prose-invert prose-sm max-w-none [&_strong]:text-primary [&_em]:text-foreground/80">
        <ReactMarkdown>{beat.text}</ReactMarkdown>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          #{index + 1}
        </span>

        {/* Status pill */}
        {isPlaying ? (
          <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary font-semibold">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
            Playing
          </span>
        ) : beat.status === 'done' ? (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Done</span>
        ) : null}
      </div>

      <BeatActivityDropdown
        toolCalls={beat.toolCalls || []}
        thinking={beat.thinking}
        blockedTools={beat.blockedTools}
      />
    </motion.div>
  );
}
