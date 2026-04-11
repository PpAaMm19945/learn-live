import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface OverlayState {
  scripture: { reference: string; text: string; connection?: string } | null;
  figure: { name: string; title: string; imageUrl?: string } | null;
  genealogy: { rootName: string; nodes: { name: string; parent?: string; descriptor?: string; color?: string }[] } | null;
  timeline: { events: { year: number; label: string; color?: string }[] } | null;
  keyTerm: { term: string; definition: string; pronunciation?: string; etymology?: string } | null;
  comparison: { title: string; columnA: { heading: string; points: string[] }; columnB: { heading: string; points: string[] } } | null;
  question: { question: string; context?: string; type?: 'rhetorical' | 'reflection' | 'check' } | null;
  quote: { text: string; attribution: string; date?: string } | null;
  slide: { title: string; bullets?: string[]; body?: string; imageUrl?: string; layout?: 'center' | 'left' | 'split' } | null;
}

export const EMPTY_OVERLAYS: OverlayState = {
  scripture: null,
  figure: null,
  genealogy: null,
  timeline: null,
  keyTerm: null,
  comparison: null,
  question: null,
  quote: null,
  slide: null,
};

interface CanvasOverlaysProps {
  overlays: OverlayState;
  onDismiss?: (type: keyof OverlayState | 'all') => void;
}

const spring = { type: 'spring' as const, damping: 22, stiffness: 140 };

export function CanvasOverlays({ overlays, onDismiss }: CanvasOverlaysProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {/* ── Scripture — bottom-left ── */}
        {overlays.scripture && (
          <motion.div
            key="scripture"
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            transition={spring}
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

        {/* ── Figure — top-left ── */}
        {overlays.figure && (
          <motion.div
            key="figure"
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -20 }}
            transition={spring}
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

        {/* ── Genealogy — top-right ── */}
        {overlays.genealogy && (
          <motion.div
            key="genealogy"
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: -20 }}
            transition={spring}
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

        {/* ── Timeline — bottom center, always-visible labels ── */}
        {overlays.timeline && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={spring}
            className="absolute bottom-28 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:right-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl px-6 py-5 md:max-w-2xl md:w-[70%] pointer-events-auto"
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

        {/* ── Key Term — top center ── */}
        {overlays.keyTerm && (
          <motion.div
            key="keyTerm"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={spring}
            className="absolute top-20 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border border-t-4 border-t-accent rounded-xl shadow-2xl p-5 max-w-sm w-[90%] md:w-auto pointer-events-auto"
            onClick={() => onDismiss?.('keyTerm')}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📚</span>
              <div className="flex-1">
                <h4 className="text-accent font-bold text-lg tracking-tight">
                  {overlays.keyTerm.term}
                </h4>
                {overlays.keyTerm.pronunciation && (
                  <p className="text-muted-foreground text-xs italic mb-1">/{overlays.keyTerm.pronunciation}/</p>
                )}
                <p className="text-foreground text-sm leading-relaxed mt-1">
                  {overlays.keyTerm.definition}
                </p>
                {overlays.keyTerm.etymology && (
                  <p className="text-muted-foreground text-xs border-t border-border pt-2 mt-2">
                    Origin: {overlays.keyTerm.etymology}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Comparison — center ── */}
        {overlays.comparison && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 max-w-lg w-[92%] pointer-events-auto"
            onClick={() => onDismiss?.('comparison')}
          >
            <h3 className="text-foreground font-bold text-lg text-center mb-4 border-b border-border pb-3">
              {overlays.comparison.title}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-primary font-bold text-sm mb-2 text-center">
                  {overlays.comparison.columnA.heading}
                </h4>
                <ul className="space-y-1.5">
                  {overlays.comparison.columnA.points.map((p, i) => (
                    <li key={i} className="text-foreground/90 text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-l border-border pl-4">
                <h4 className="text-destructive font-bold text-sm mb-2 text-center">
                  {overlays.comparison.columnB.heading}
                </h4>
                <ul className="space-y-1.5">
                  {overlays.comparison.columnB.points.map((p, i) => (
                    <li key={i} className="text-foreground/90 text-sm flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Question — center bottom ── */}
        {overlays.question && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={spring}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-2xl shadow-2xl p-6 max-w-md w-[90%] pointer-events-auto"
            onClick={() => onDismiss?.('question')}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">🤔</span>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                  {overlays.question.type === 'check' ? 'Check Your Understanding' : overlays.question.type === 'reflection' ? 'Reflect' : 'Think About This'}
                </p>
                <p className="text-foreground text-base font-medium leading-relaxed">
                  {overlays.question.question}
                </p>
                {overlays.question.context && (
                  <p className="text-muted-foreground text-sm mt-2 italic">{overlays.question.context}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Quote — center ── */}
        {overlays.quote && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-8 max-w-lg w-[90%] pointer-events-auto text-center"
            onClick={() => onDismiss?.('quote')}
          >
            <span className="text-5xl text-primary/30 font-serif leading-none block mb-2">"</span>
            <p className="text-foreground text-lg md:text-xl italic leading-relaxed font-display">
              {overlays.quote.text}
            </p>
            <div className="mt-4 pt-3 border-t border-border/50">
              <p className="text-primary font-bold text-sm">{overlays.quote.attribution}</p>
              {overlays.quote.date && (
                <p className="text-muted-foreground text-xs mt-0.5">{overlays.quote.date}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Slide — full center, structured content ── */}
        {overlays.slide && (
          <motion.div
            key="slide"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={spring}
            className="absolute inset-4 md:inset-12 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl pointer-events-auto flex overflow-hidden"
            onClick={() => onDismiss?.('slide')}
          >
            {overlays.slide.layout === 'split' && overlays.slide.imageUrl ? (
              <>
                <div className="w-1/2 bg-muted flex items-center justify-center">
                  <img src={overlays.slide.imageUrl} alt={overlays.slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-1/2 p-8 flex flex-col justify-center">
                  <h2 className="text-foreground text-2xl md:text-3xl font-display font-bold mb-6">
                    {overlays.slide.title}
                  </h2>
                  {overlays.slide.body && (
                    <p className="text-foreground/80 text-base leading-relaxed mb-4">{overlays.slide.body}</p>
                  )}
                  {overlays.slide.bullets && (
                    <ul className="space-y-3">
                      {overlays.slide.bullets.map((b, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="text-foreground/90 text-sm flex items-start gap-3"
                        >
                          <span className="text-primary font-bold mt-0.5">{i + 1}.</span>{b}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className={`w-full p-8 md:p-12 flex flex-col ${overlays.slide.layout === 'center' ? 'items-center justify-center text-center' : 'justify-center'}`}>
                <h2 className="text-foreground text-2xl md:text-4xl font-display font-bold mb-6">
                  {overlays.slide.title}
                </h2>
                {overlays.slide.body && (
                  <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-6 max-w-xl">{overlays.slide.body}</p>
                )}
                {overlays.slide.bullets && (
                  <ul className="space-y-3 max-w-xl">
                    {overlays.slide.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="text-foreground/90 text-base flex items-start gap-3"
                      >
                        <span className="text-primary font-bold mt-0.5">→</span>{b}
                      </motion.li>
                    ))}
                  </ul>
                )}
                {overlays.slide.imageUrl && (
                  <img src={overlays.slide.imageUrl} alt={overlays.slide.title} className="mt-6 max-w-sm rounded-lg shadow-lg" loading="lazy" />
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
