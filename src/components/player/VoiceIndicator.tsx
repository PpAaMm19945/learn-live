import React from 'react';
import { motion } from 'framer-motion';

interface VoiceIndicatorProps {
  isSpeaking: boolean;
}

export function VoiceIndicator({ isSpeaking }: VoiceIndicatorProps) {
  const bars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1 h-6">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: isSpeaking ? [4, 16, 8, 20, 6][bar - 1] : 4,
          }}
          transition={{
            duration: 0.5,
            repeat: isSpeaking ? Infinity : 0,
            repeatType: 'mirror',
            delay: bar * 0.1,
          }}
          style={{ minHeight: '4px' }}
        />
      ))}
    </div>
  );
}
