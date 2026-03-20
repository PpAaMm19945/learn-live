import React from 'react';
import { motion } from 'framer-motion';

export interface ComparisonData {
  date: string;
  framework: string;
  evidence: string;
}

export interface ComparisonViewProps {
  biblicalData: ComparisonData;
  conventionalData: ComparisonData;
  resolution?: string;
  activeHighlight?: 'biblical' | 'conventional' | 'resolution';
  band: number;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  biblicalData,
  conventionalData,
  resolution,
  activeHighlight,
  band,
}) => {
  if (band < 4) return null;

  const isBiblicalActive = activeHighlight === 'biblical';
  const isConventionalActive = activeHighlight === 'conventional';
  const isResolutionActive = activeHighlight === 'resolution';

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 bg-black/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl flex flex-col space-y-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Divider */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-border/50 -translate-x-1/2" />
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-border/50 w-12 h-12 rounded-full items-center justify-center text-muted-foreground font-serif italic shadow-md">
          vs
        </div>

        {/* Biblical Side */}
        <div
          className={`flex flex-col space-y-4 p-6 rounded-xl transition-colors duration-300 ${
            isBiblicalActive
              ? 'bg-amber-500/10 border border-amber-500/30'
              : 'opacity-70 grayscale'
          }`}
        >
          <div className="text-amber-500/80 uppercase tracking-[0.2em] font-bold text-sm">
            Biblical Framework
          </div>
          <h3 className="text-3xl font-bold text-amber-400 font-serif">
            {biblicalData.date}
          </h3>
          <p className="text-xl text-gray-100 font-serif leading-relaxed">
            {biblicalData.framework}
          </p>
          <div className="mt-auto pt-6 border-t border-amber-500/20">
            <span className="text-sm uppercase tracking-wider text-amber-500/70 font-bold block mb-2">
              Evidence
            </span>
            <p className="text-gray-300 text-sm leading-relaxed">
              {biblicalData.evidence}
            </p>
          </div>
        </div>

        {/* Conventional Side */}
        <div
          className={`flex flex-col space-y-4 p-6 rounded-xl transition-colors duration-300 ${
            isConventionalActive
              ? 'bg-blue-500/10 border border-blue-500/30'
              : 'opacity-60 grayscale'
          }`}
        >
          <div className="text-blue-500/80 uppercase tracking-[0.2em] font-bold text-sm">
            Conventional History
          </div>
          <h3 className="text-3xl font-bold text-blue-400 font-serif">
            {conventionalData.date}
          </h3>
          <p className="text-xl text-gray-200 font-serif leading-relaxed">
            {conventionalData.framework}
          </p>
          <div className="mt-auto pt-6 border-t border-blue-500/20">
            <span className="text-sm uppercase tracking-wider text-blue-500/70 font-bold block mb-2">
              Evidence
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              {conventionalData.evidence}
            </p>
          </div>
        </div>
      </div>

      {/* Resolution */}
      {resolution && (
        <div
          className={`mt-4 pt-6 px-6 pb-6 rounded-xl transition-colors duration-300 border border-t-0 ${
            isResolutionActive
              ? 'bg-primary/5 border border-primary/20'
              : 'opacity-80'
          }`}
        >
           <span className="text-sm uppercase tracking-widest text-primary/80 font-bold block mb-3 text-center">
              Resolution
            </span>
            <p className="text-lg text-foreground/90 font-serif leading-relaxed text-center">
              {resolution}
            </p>
        </div>
      )}
    </motion.div>
  );
};
