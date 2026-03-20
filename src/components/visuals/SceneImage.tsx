import React from 'react';
import { motion } from 'framer-motion';

export interface SceneImageProps {
  imageUrl: string;
  altText: string;
  caption?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({
  imageUrl,
  altText,
  caption,
}) => {
  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={imageUrl}
        alt={altText}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {caption && (
        <div className="absolute bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-center z-10">
          <p className="text-white text-xl max-w-2xl mx-auto px-4 py-2 bg-black/50 rounded-lg drop-shadow-md backdrop-blur-sm">
            {caption}
          </p>
        </div>
      )}
    </motion.div>
  );
};
