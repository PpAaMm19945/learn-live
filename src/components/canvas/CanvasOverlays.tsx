import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface OverlayState {
  scripture: { reference: string; text: string; connection?: string } | null;
  figure: { name: string; title: string; imageUrl?: string } | null;
  genealogy: { rootName: string; nodes: { name: string; parent?: string; descriptor?: string; color?: string }[] } | null;
  timeline: { events: { year: number; label: string; color?: string }[] } | null;
}

export const EMPTY_OVERLAYS: OverlayState = {
  scripture: null,
  figure: null,
  genealogy: null,
  timeline: null,
};

interface CanvasOverlaysProps {
  overlays: OverlayState;
  onDismiss?: (type: keyof OverlayState | 'all') => void;
}

/**
 * CanvasOverlays — renders scripture, figure, genealogy, and timeline
 * cards as floating overlays. Designed to be mounted at the SessionCanvas
 * or Workbench level so overlays appear regardless of the active scene mode.
 */
export function CanvasOverlays({ overlays, onDismiss }: CanvasOverlaysProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {/* Scripture — bottom-left */}
        {overlays.scripture && (
          <motion.div
            key="scripture"
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="absolute bottom-24 left-6 right-6 md:right-auto md:max-w-md bg-card/95 backdrop-blur-md border border-border border-l-4 border-l-primary rounded-xl shadow-2xl p-5 pointer-events-auto"
            onClick={() => onDismiss?.('scripture')}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5 opacity-60">📖</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-primary font-bold text-sm tracking-wide mb-1.5">
                  {overlays.scripture.reference}
                </h4>
                <p className="text-foreground text-base italic leading-relaxed">
                  "{overlays.scripture.text}"
                </p>
                {overlays.scripture.connection && (
                  <p className="text-muted-foreground text-sm border-t border-border pt-2 mt-3">
                    {overlays.scripture.connection}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Figure — top-left */}
        {overlays.figure && (
          <motion.div
            key="figure"
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="absolute top-20 left-6 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 flex items-center space-x-4 max-w-sm pointer-events-auto"
            onClick={() => onDismiss?.('figure')}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0 border-2 border-primary overflow-hidden">
              {overlays.figure.imageUrl ? (
                <img src={overlays.figure.imageUrl} alt={overlays.figure.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
              )}
            </div>
            <div>
              <h3 className="text-foreground font-bold text-lg leading-tight">{overlays.figure.name}</h3>
              <p className="text-primary/80 text-sm font-medium">{overlays.figure.title}</p>
            </div>
          </motion.div>
        )}

        {/* Genealogy — top-right */}
        {overlays.genealogy && (
          <motion.div
            key="genealogy"
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="absolute top-20 right-6 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl p-6 min-w-[250px] max-w-xs pointer-events-auto"
            onClick={() => onDismiss?.('genealogy')}
          >
            <h3 className="text-foreground font-bold text-lg border-b border-border pb-2 mb-4 text-center">
              Family of {overlays.genealogy.rootName}
            </h3>
            <div className="flex flex-col items-center space-y-3">
              {overlays.genealogy.nodes.map((node, i) => (
                <div key={i} className="flex flex-col items-center relative">
                  {i > 0 && <div className="w-[2px] h-3 bg-border -mt-3 mb-1" />}
                  <div className="flex items-center space-x-3 bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color || '#fac775' }} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{node.name}</span>
                      {node.descriptor && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{node.descriptor}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Timeline — bottom center */}
        {overlays.timeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="absolute bottom-36 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl px-6 py-5 md:max-w-2xl md:w-[70%] pointer-events-auto"
            onClick={() => onDismiss?.('timeline')}
          >
            <div className="relative w-full flex items-center justify-between min-h-[80px] pt-2 pb-6">
              <div className="absolute top-[18px] left-0 right-0 h-1 bg-border rounded-full z-0" />
              {overlays.timeline.events.map((event, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center cursor-default">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-card shadow-md"
                    style={{ backgroundColor: event.color || '#5dcaa5' }}
                  />
                  <div className="mt-2 flex flex-col items-center whitespace-nowrap">
                    <span className="text-xs font-bold text-primary">{Math.abs(event.year)} {event.year < 0 ? 'BC' : 'AD'}</span>
                    <span className="text-[11px] text-foreground/80 max-w-[100px] text-center truncate">{event.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
