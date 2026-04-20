import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { AgentToolCall } from '@/lib/session/types';
import { BeatActivityDropdown } from './BeatActivityDropdown';
import { ArtifactInspector, type InspectorArtifact } from './ArtifactInspector';
import { Save } from 'lucide-react';

export interface BeatDisplay {
  id: string | number;
  kind?: 'beat' | 'completion' | 'live';
  slice?: 'gatekeeper' | 'negotiator';
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
  isEnded?: boolean;
  onExit?: () => void;
  onSaveGoldenScript?: () => void;
}

/**
 * TranscriptView — Read-only scrollable activity log.
 * Each beat = one card: text + status pill + collapsible Activity dropdown.
 * No replay, no pause/play. Pure visibility.
 */
export function TranscriptView({ beats, chapterId, isEnded, onExit, onSaveGoldenScript }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<InspectorArtifact | null>(null);

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
        {beats.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center px-6">
            <p className="text-sm text-muted-foreground">Your teacher is preparing the lesson…</p>
          </div>
        ) : (
          <div className="max-w-[680px] mx-auto space-y-4">
            <AnimatePresence mode="popLayout">
              {beats.map((beat, i) => {
                const isLatest = i === beats.length - 1;
                if (beat.kind === 'completion') {
                  return (
                    <CompletionCard
                      key={beat.id}
                      onExit={onExit}
                      onSaveGoldenScript={onSaveGoldenScript}
                    />
                  );
                }
                if (beat.kind === 'live') {
                  return (
                    <TranscriptCard
                      key={beat.id}
                      beat={beat}
                      index={i}
                      isLatest={isLatest && !isEnded}
                      chapterId={chapterId}
                      onArtifactClick={setSelectedArtifact}
                      header={beat.slice === 'gatekeeper' ? 'Getting Ready' : 'Reflecting Together'}
                    />
                  );
                }

                return (
                  <TranscriptCard
                    key={beat.id}
                    beat={beat}
                    index={i}
                    isLatest={isLatest && !isEnded}
                    chapterId={chapterId}
                    onArtifactClick={setSelectedArtifact}
                    header={undefined}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ArtifactInspector
        open={!!selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
        artifact={selectedArtifact}
      />
    </div>
  );
}

function TranscriptCard({
  beat,
  index,
  isLatest,
  chapterId,
  onArtifactClick,
  header,
}: {
  beat: BeatDisplay;
  index: number;
  isLatest: boolean;
  chapterId: string;
  onArtifactClick: (artifact: InspectorArtifact) => void;
  header?: string;
}) {
  const isPlaying = beat.status === 'playing';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl px-6 py-5 transition-colors ${
        isLatest
          ? 'bg-card border border-border border-l-2 border-l-primary shadow-lg'
          : 'bg-card/70 border border-border/50'
      }`}
    >
      <div className="text-lg md:text-xl leading-relaxed font-display font-medium text-foreground prose prose-invert prose-sm max-w-none [&_strong]:text-primary [&_em]:text-foreground/80">
        {header && <div className="mb-3 text-xs uppercase tracking-wider text-primary/80">{header}</div>}
        <ReactMarkdown>{beat.text}</ReactMarkdown>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
          #{index + 1}
        </span>

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
        chapterId={chapterId}
        toolCalls={beat.toolCalls || []}
        thinking={beat.thinking}
        blockedTools={beat.blockedTools}
        onArtifactClick={onArtifactClick}
      />
    </motion.div>
  );
}

function CompletionCard({ onExit, onSaveGoldenScript }: { onExit?: () => void; onSaveGoldenScript?: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl px-6 py-5 bg-primary/5 border border-primary/30"
    >
      <h3 className="text-lg font-semibold">Lesson Complete</h3>
      <p className="text-sm text-muted-foreground mt-1">You can inspect any beat artifact above, then exit when you’re ready.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onExit}
          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </button>
        {onSaveGoldenScript && (
          <button
            type="button"
            onClick={onSaveGoldenScript}
            className="px-3 py-1.5 rounded-md bg-muted text-foreground text-sm hover:bg-muted/80 transition-colors inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save as Golden Script
          </button>
        )}
      </div>
    </motion.div>
  );
}
