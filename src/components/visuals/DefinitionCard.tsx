import React from 'react';
import { motion } from 'framer-motion';

export interface OriginalLanguage {
  script: string;
  transliteration: string;
  language: string;
}

export interface DefinitionCardProps {
  term: string;
  definition: string;
  scriptureRef?: string;
  originalLanguage?: OriginalLanguage;
  band: number;
}

export const DefinitionCard: React.FC<DefinitionCardProps> = ({
  term,
  definition,
  scriptureRef,
  originalLanguage,
  band,
}) => {
  if (band < 2) return null;

  const showAdvanced = band >= 3;

  return (
    <motion.div
      className="max-w-xl mx-auto bg-black/80 backdrop-blur-md rounded-2xl border border-border p-8 shadow-2xl relative"
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -30 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <h2 className="text-3xl font-bold text-primary font-serif">
            {term}
          </h2>
          {showAdvanced && originalLanguage && (
            <div className="text-right">
              <span className="text-2xl font-serif text-muted-foreground block" dir={originalLanguage.language === 'Hebrew' ? 'rtl' : 'ltr'}>
                {originalLanguage.script}
              </span>
              <span className="text-sm italic text-muted-foreground/80 block mt-1">
                {originalLanguage.transliteration} ({originalLanguage.language})
              </span>
            </div>
          )}
        </div>

        <p className="text-xl text-foreground/90 leading-relaxed font-serif">
          {definition}
        </p>

        {showAdvanced && scriptureRef && (
          <div className="pt-4 mt-2 bg-primary/10 -mx-8 -mb-8 p-6 rounded-b-2xl border-t border-primary/20">
            <span className="text-sm uppercase tracking-widest text-primary/80 font-bold block mb-1">
              Scripture Connection
            </span>
            <span className="text-lg text-primary font-serif">
              {scriptureRef}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
