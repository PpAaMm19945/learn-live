import React, { useState, useEffect } from 'react';
import { StorybookScript } from '@/lib/player/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface StorybookPlayerProps {
  script: StorybookScript;
  onExit: () => void;
  onComplete: () => void;
}

export function StorybookPlayer({ script, onExit, onComplete }: StorybookPlayerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const scene = script.scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === script.scenes.length - 1;

  // Simulate highlighting timing based on audio playback (stubbed here)
  useEffect(() => {
    setIsHighlighting(false);
    let innerTimer: NodeJS.Timeout;
    const timer = setTimeout(() => {
      setIsHighlighting(true);
      // Remove highlight after a brief moment to simulate spoken word passing
      innerTimer = setTimeout(() => setIsHighlighting(false), 2000);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [currentSceneIndex]);

  const handleAdvance = () => {
    if (isLastScene) {
      onComplete();
    } else {
      setCurrentSceneIndex((prev) => prev + 1);
    }
  };

  const renderCaption = () => {
    if (!scene || !scene.captionText) return null;

    let parts = [scene.captionText];
    let highlightFound = false;
    let wordToHighlight = '';

    if (scene.highlightedWords && scene.highlightedWords.length > 0) {
        wordToHighlight = scene.highlightedWords[0];
        const regex = new RegExp(`(${wordToHighlight})`, 'gi');
        parts = scene.captionText.split(regex);
        highlightFound = true;
    }

    return (
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg text-center font-serif">
        {parts.map((part, i) => {
          if (highlightFound && part.toLowerCase() === wordToHighlight.toLowerCase()) {
            return (
              <span
                key={i}
                className={`transition-colors duration-500 cursor-pointer ${
                  isHighlighting ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'text-amber-200'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Replaying audio for: ${part}`);
                  setIsHighlighting(true);
                  setTimeout(() => setIsHighlighting(false), 1500);
                }}
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </h2>
    );
  };

  if (!scene) return null;

  return (
    <div
      className="fixed inset-0 bg-black w-full h-full overflow-hidden select-none cursor-pointer flex flex-col"
      onClick={handleAdvance}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-50 flex items-center space-x-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
          className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Fallback pattern if image is missing/broken */}
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center opacity-30">
              <span className="text-zinc-600 font-mono">[Image: {scene.imageUrl}]</span>
          </div>

          <img
            src={scene.imageUrl}
            alt={scene.altText}
            className="w-full h-full object-cover"
            onError={(e) => {
                // If actual image fails, hide the broken icon to show fallback text underneath
                (e.target as HTMLImageElement).style.display = 'none';
            }}
          />

          {/* Dark Gradient Overlay for Caption Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Caption Area */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-12 sm:pb-16 px-6 sm:px-12 z-40 pointer-events-none">
        <div className="pointer-events-auto w-full mb-8">
            {renderCaption()}
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {script.scenes.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSceneIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSceneIndex
                  ? 'bg-amber-400 scale-125'
                  : index < currentSceneIndex
                  ? 'bg-amber-400/50'
                  : 'bg-white/20'
              }`}
              aria-label={`Go to scene ${index + 1}`}
            />
          ))}
        </div>

        {/* Helper Hint */}
        <p className="mt-6 text-white/40 text-sm font-medium tracking-wide uppercase">
          Tap anywhere to continue →
        </p>
      </div>
    </div>
  );
}
