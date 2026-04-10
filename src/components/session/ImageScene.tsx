import React from 'react';
import { motion } from 'framer-motion';

interface ImageSceneProps {
  imageUrl: string;
  caption?: string;
}

/**
 * ImageScene — full-bleed image display for the teaching canvas.
 * Used when the AI calls set_scene("image", { imageUrl, caption }).
 */
export function ImageScene({ imageUrl, caption }: ImageSceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-background"
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={caption || 'Lesson illustration'}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onError={(e) => {
            // Hide broken images gracefully
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      {caption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="absolute bottom-8 left-0 right-0 text-center"
        >
          <p className="inline-block px-6 py-3 bg-background/80 backdrop-blur-md rounded-full text-sm font-medium text-foreground/80">
            {caption}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
