import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { r2Url } from '@/lib/r2Assets';

const PIPELINE_LABELS: Record<string, { label: string; progress: number }> = {
  loading: { label: 'Loading content', progress: 10 },
  preparing: { label: 'Analyzing context', progress: 20 },
  phase_0: { label: 'Assessing your level', progress: 30 },
  phase_1: { label: 'Building framework', progress: 45 },
  phase_2: { label: 'Designing lesson', progress: 60 },
  phase_3: { label: 'Writing narration', progress: 75 },
  phase_4: { label: 'Final review', progress: 90 },
  ready: { label: 'Starting lesson', progress: 100 },
  fallback: { label: 'Adjusting plan', progress: 85 },
};

const WARMUP_FACTS = [
  { emoji: '🏛️', text: 'The Kingdom of Kush ruled for over 1,000 years along the Upper Nile.' },
  { emoji: '📜', text: 'Ethiopia has one of the oldest alphabets in the world — Ge\'ez.' },
  { emoji: '⛪', text: 'The Ethiopian Orthodox Church dates back to the 4th century AD.' },
  { emoji: '🗺️', text: 'Ancient Carthage was one of the wealthiest cities in the Mediterranean.' },
  { emoji: '⚒️', text: 'The Haya people of Tanzania were smelting steel 2,000 years ago.' },
  { emoji: '📚', text: 'Timbuktu once housed over 700,000 manuscripts.' },
  { emoji: '🌍', text: 'The Table of Nations in Genesis 10 names Africa\'s earliest peoples.' },
  { emoji: '🏰', text: 'Great Zimbabwe\'s stone walls were built without mortar.' },
  { emoji: '⚓', text: 'Swahili merchants traded with China, India, and Persia.' },
  { emoji: '👑', text: 'Mansa Musa of Mali was the wealthiest person in recorded history.' },
  { emoji: '🔬', text: 'Alexandria\'s ancient library was the largest in the world.' },
  { emoji: '✝️', text: 'Augustine of Hippo — one of Christianity\'s greatest theologians — was African.' },
];

const ILLUSTRATIONS = [
  'assets/storybook/ch01/band0_page01.jpg',
  'assets/storybook/ch02/band0_page01.jpg',
  'assets/storybook/ch03/band0_page01.jpg',
  'assets/storybook/ch04/band0_page01.jpg',
].map(r2Url);

interface WelcomeCoverProps {
  band: number;
  chapterId: string;
  pipelineStatus?: { step: string; detail?: string } | null;
  dismissible: boolean;
  onDismiss: () => void;
  isConnecting: boolean;
}

export function WelcomeCover({ band, chapterId, pipelineStatus, dismissible, onDismiss, isConnecting }: WelcomeCoverProps) {
  const isYounger = band <= 1;
  const gradientClass = band >= 4 ? 'bg-african-dusk' : 'bg-african-warm';
  
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * WARMUP_FACTS.length));
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % WARMUP_FACTS.length);
    }, 5000);
    const imgInterval = setInterval(() => {
      setImgIndex(prev => (prev + 1) % ILLUSTRATIONS.length);
    }, 8000);
    return () => {
      clearInterval(factInterval);
      clearInterval(imgInterval);
    };
  }, []);

  const fact = WARMUP_FACTS[factIndex];
  const currentPipeline = pipelineStatus?.step ? PIPELINE_LABELS[pipelineStatus.step] : null;
  const hasPipeline = !!currentPipeline;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden ${gradientClass} text-foreground`}
    >
      {dismissible && (
        <button 
          onClick={onDismiss} 
          className="absolute top-6 right-6 bg-black/20 text-foreground/80 hover:bg-black/40 hover:text-white rounded-full p-2 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Narrative Images Rotation */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl border border-border/20 backdrop-blur-sm bg-card/10">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={ILLUSTRATIONS[imgIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if not exists yet
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmYWZhZmEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmYWZhZmEiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTlweCIgZmlsbD0iI2FhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN0b3J5Ym9vazwvdGV4dD48L3N2Zz4=';
            }}
          />
        </AnimatePresence>
      </div>

      <div className="text-center px-6 max-w-xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 drop-shadow-sm text-foreground/90">
          {isYounger ? 'Welcome to African History Story Time' : 'Welcome to African History Class'}
        </h1>
        <h3 className="text-lg md:text-xl text-foreground/70 mb-10 font-medium">
          {chapterId.replace(/^ch/, 'Chapter ')} • Get ready, your teacher is preparing your lesson…
        </h3>

        {/* Pipeline & Facts Area */}
        <div className="min-h-[120px] flex flex-col justify-end">
          {hasPipeline ? (
            <div className="space-y-4 w-full">
              <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden w-64 mx-auto">
                <motion.div
                  className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(196,98,45,0.5)]"
                  initial={{ width: '5%' }}
                  animate={{ width: `${currentPipeline.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-sm font-medium text-foreground/80 tracking-wide uppercase">
                {pipelineStatus?.detail || currentPipeline.label}
              </p>
            </div>
          ) : isConnecting ? (
            <div className="space-y-4">
              <div className="flex space-x-1 justify-center mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 bg-primary/80 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <p className="text-sm text-foreground/70 tracking-widest uppercase font-medium">Connecting to your teacher…</p>
            </div>
          ) : (
            <p className="text-sm text-foreground/70 tracking-widest uppercase font-medium">Waiting to start…</p>
          )}

          {/* Rotating Fact */}
          <div className="mt-8 h-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={factIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="px-6 py-3 rounded-xl bg-card/20 backdrop-blur-sm border border-foreground/10 flex items-center justify-center gap-4 text-left"
              >
                <p className="text-3xl">{fact.emoji}</p>
                <p className="text-[13px] md:text-sm text-foreground/80 font-medium leading-tight max-w-[250px]">
                  {fact.text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
