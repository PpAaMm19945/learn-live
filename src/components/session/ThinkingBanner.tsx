import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ThinkingBannerProps {
  thinkingText: string;
}

export function ThinkingBanner({ thinkingText }: ThinkingBannerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const hasThinking = thinkingText.trim().length > 0;

  useEffect(() => {
    if (!hasThinking) {
      const timeout = window.setTimeout(() => {
        setIsVisible(false);
      }, 1200);
      return () => window.clearTimeout(timeout);
    }

    setIsVisible(true);
    setIsOpen(true);
  }, [hasThinking]);

  const displayText = useMemo(() => {
    const trimmed = thinkingText.trim();
    if (!trimmed) return '';
    return trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
  }, [thinkingText]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto max-w-xl w-full bg-black/45 border border-white/15 backdrop-blur-md rounded-xl px-3 py-2 text-xs text-white/90 shadow-lg">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3"
            >
              <span className="font-semibold tracking-wide text-[11px] text-white/90">Teacher is thinking</span>
              <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isOpen && displayText && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2 overflow-hidden leading-5 text-[12px] text-white/80"
                >
                  {displayText}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
