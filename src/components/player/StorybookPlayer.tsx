import React, { useState } from 'react';
import type { StorybookScript } from '@/lib/session/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface StorybookPlayerProps {
  script: StorybookScript;
  onExit: () => void;
  onComplete: () => void;
}

export function StorybookPlayer({ script, onExit, onComplete }: StorybookPlayerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const scene = script.scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === script.scenes.length - 1;

  const handleAdvance = () => {
    if (isLastScene) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentSceneIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSceneIndex > 0) {
      setDirection(-1);
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    const { innerWidth } = window;
    if (clientX < innerWidth / 2) {
      handlePrevious();
    } else {
      handleAdvance();
    }
  };

  const renderCaption = () => {
    if (!scene || !scene.captionText) return null;

    let parts = [scene.captionText];

    if (scene.highlightedWords && scene.highlightedWords.length > 0) {
      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const words = scene.highlightedWords.map(escapeRegExp).join('|');
      const regex = new RegExp(`(${words})`, 'gi');
      parts = scene.captionText.split(regex);
    }

    return (
      <p className="font-display text-[1.75rem] leading-[2.0] text-card-foreground font-medium text-center md:text-left mx-auto max-w-2xl">
        {parts.map((part, i) => {
          const isHighlighted = scene.highlightedWords?.some(
            w => w.toLowerCase() === part.toLowerCase()
          );
          if (isHighlighted) {
            return (
              <span key={i} className="font-bold text-primary transition-colors duration-500">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  };

  if (!scene) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden select-none cursor-pointer bg-background"
      onClick={handleTap}
    >
      {/* Exit Button */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="p-3 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-md rounded-full text-foreground transition-colors pointer-events-auto"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSceneIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row"
        >
          {/* Image Area */}
          <div className="h-[55%] md:h-full md:w-[60%] bg-background flex items-center justify-center p-4 md:p-8">
            <div className="relative aspect-square max-w-full max-h-full flex items-center justify-center shadow-lg border border-border rounded-xl overflow-hidden bg-void/5">
              {/* Fallback text */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <span className="text-foreground font-mono text-sm px-4 text-center">
                  [Image: {scene.imageUrl}]
                </span>
              </div>

              <img
                src={scene.imageUrl}
                alt={scene.altText}
                className="relative z-10 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Text Area */}
          <div className="h-[45%] md:h-full md:w-[40%] bg-card p-6 md:p-12 flex flex-col justify-center relative">
            <div className="pointer-events-auto w-full">
              {renderCaption()}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-3 z-50 pointer-events-none">
        {script.scenes.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(index > currentSceneIndex ? 1 : -1);
              setCurrentSceneIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto ${
              index === currentSceneIndex
                ? 'bg-primary scale-125'
                : index < currentSceneIndex
                ? 'bg-primary/50'
                : 'bg-border'
            }`}
            aria-label={`Go to scene ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
