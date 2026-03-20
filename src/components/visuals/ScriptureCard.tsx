import React from 'react';
import { motion } from 'framer-motion';

export interface ScriptureCardProps {
  reference: string;
  text: string;
  connection?: string;
  band: number;
}

export const ScriptureCard: React.FC<ScriptureCardProps> = ({
  reference,
  text,
  connection,
  band,
}) => {
  const isBand0 = band === 0;
  const showConnection = band >= 3 && connection;

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-black/80 backdrop-blur-md rounded-2xl border-2 border-amber-600/50 p-8 shadow-[0_0_30px_rgba(217,119,6,0.2)]"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="text-amber-500/80 uppercase tracking-[0.2em] font-bold text-sm">
          Holy Scripture
        </div>

        <h2 className="text-2xl md:text-3xl font-serif text-amber-400 font-bold leading-tight">
          {reference}
        </h2>

        <div className="relative">
          <span className="absolute -left-6 -top-4 text-4xl text-amber-600/30 font-serif">"</span>
          <p
            className={`${
              isBand0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
            } font-serif text-gray-100 leading-relaxed italic`}
          >
            {text}
          </p>
          <span className="absolute -right-6 -bottom-8 text-4xl text-amber-600/30 font-serif">"</span>
        </div>

        {showConnection && (
          <div className="pt-6 mt-4 border-t border-amber-600/30 w-full">
            <h4 className="text-sm font-bold text-amber-500 mb-2 uppercase tracking-wider">
              Historical Connection
            </h4>
            <p className="text-gray-300 text-base leading-relaxed">
              {connection}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
