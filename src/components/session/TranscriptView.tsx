import React, { useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { AgentToolCall } from '@/lib/session/types';
import { Pause, Play, Search } from 'lucide-react';

export interface BeatDisplay {
  id: string | number;
  text: string;
  status?: 'queued' | 'playing' | 'done';
  toolCalls?: AgentToolCall[];
}

interface TranscriptViewProps {
  beats: BeatDisplay[];
  band: number;
  isActive: boolean;
  chapterId: string;
  pipelineStatus?: { step: string; detail?: string } | null;
  isReviewMode?: boolean;
  onReplayVisuals?: (toolCalls: AgentToolCall[]) => void;
}

/**
 * TranscriptView — Card-based transcript display.
 * Each beat/chunk renders as a discrete card. The latest card is prominent,
 * older cards fade and stack above. Auto-scrolls to the newest card.
 */
export function TranscriptView({ beats, band, isActive, chapterId, pipelineStatus, isReviewMode, onReplayVisuals }: TranscriptViewProps) {
  const isResting = beats.length === 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest card
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [beats.length]);

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      {/* Bottom vignette */}
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
                  band={band}
                  isReviewMode={isReviewMode}
                  onReplayVisuals={onReplayVisuals}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** A single transcript card */
function TranscriptCard({
  beat,
  index,
  isLatest,
  band,
  isReviewMode,
  onReplayVisuals
}: {
  beat: BeatDisplay;
  index: number;
  isLatest: boolean;
  band: number;
  isReviewMode?: boolean;
  onReplayVisuals?: (tools: AgentToolCall[]) => void;
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
        <ReactMarkdown>{beat.text}</ReactMarkdown>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          #{index + 1}
        </span>
        
        {/* Replay Visuals Button for completed beats in review mode */}
        {isReviewMode && beat.status === 'done' && beat.toolCalls && beat.toolCalls.filter(t => ['set_scene', 'show_scripture', 'show_key_term', 'show_timeline', 'show_question', 'show_quote', 'show_figure', 'show_genealogy', 'show_comparison', 'show_slide'].includes(t.tool)).length > 0 && (
          <button 
            onClick={() => onReplayVisuals && onReplayVisuals(beat.toolCalls!)}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/60 hover:bg-muted text-[10px] font-medium text-foreground/70 transition-colors"
          >
            <Search className="w-2.5 h-2.5" />
            Replay visuals
          </button>
        )}

        {isLatest && beat.status !== 'done' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
          />
        )}
      </div>
    </motion.div>
  );
}