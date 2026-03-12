import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptBarProps {
  text: string;
  sceneContext?: {
    era?: string;
    location?: string;
    figures?: string[];
  };
  className?: string;
}

export function TranscriptBar({ text, sceneContext, className }: TranscriptBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text]);

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden',
        className
      )}
    >
      {/* Context Header (optional) */}
      <AnimatePresence>
        {sceneContext && (Object.keys(sceneContext).length > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-muted/50 px-4 py-2 border-b border-border flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium"
          >
            {sceneContext.era && (
              <span className="flex items-center gap-1">
                ⏱️ {sceneContext.era}
              </span>
            )}
            {sceneContext.location && (
              <span className="flex items-center gap-1">
                📍 {sceneContext.location}
              </span>
            )}
            {sceneContext.figures && sceneContext.figures.length > 0 && (
              <span className="flex items-center gap-1 truncate">
                👥 {sceneContext.figures.join(', ')}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Text */}
      <div
        ref={containerRef}
        className="px-4 py-3 flex-grow overflow-y-auto min-h-[60px] max-h-[120px] scroll-smooth"
      >
        <p className="text-sm md:text-base leading-relaxed text-foreground/90 font-medium">
          {text || (
            <span className="text-muted-foreground italic">Waiting for narration...</span>
          )}
        </p>
      </div>
    </div>
  );
}
