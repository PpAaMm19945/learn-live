import React from 'react';
import { motion } from 'framer-motion';

export interface PortraitCardProps {
  name: string;
  title: string;
  dates?: string;
  imageUrl: string;
  quote?: string;
}

export const PortraitCard: React.FC<PortraitCardProps> = ({
  name,
  title,
  dates,
  imageUrl,
  quote,
}) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl bg-black/80 backdrop-blur-md border border-border shadow-2xl"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
    >
      {/* Image Section */}
      <div className="w-full md:w-2/5 relative min-h-[300px] md:min-h-full">
        <img
          src={imageUrl}
          alt={`Portrait of ${name}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for blending */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Text Section */}
      <div className="flex-1 p-8 flex flex-col justify-center space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground font-serif tracking-tight">
            {name}
          </h2>
          <h3 className="text-xl text-primary font-medium mt-1">
            {title}
          </h3>
          {dates && (
            <p className="text-muted-foreground text-sm uppercase tracking-wider mt-2">
              {dates}
            </p>
          )}
        </div>

        {quote && (
          <div className="mt-6 pl-4 border-l-4 border-primary/50 relative">
            <span className="absolute -left-2 -top-2 text-3xl text-primary/30 font-serif">"</span>
            <p className="text-lg italic text-foreground/90 font-serif leading-relaxed">
              {quote}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
