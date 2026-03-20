import React, { useEffect, useState } from 'react';

interface OverlayCaptionProps {
  text: string;
  isVisible: boolean;
  isDialoguePhase?: boolean;
}

export function OverlayCaption({
  text,
  isVisible,
  isDialoguePhase = false,
}: OverlayCaptionProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (text !== displayedText) {
      // Small debounce to prevent rapid updates from permanently hiding text
      const debounceTimer = setTimeout(() => {
        setFade(true);
        const fadeTimer = setTimeout(() => {
          setDisplayedText(text);
          setFade(false);
        }, 150);
        return () => clearTimeout(fadeTimer);
      }, 50);
      return () => clearTimeout(debounceTimer);
    }
  }, [text, displayedText]);

  if (!displayedText || (!isVisible && !isDialoguePhase)) return null;

  return (
    <div className="absolute bottom-24 left-0 right-0 flex justify-center z-40 px-4 pointer-events-none transition-opacity duration-300">
      <div
        className={`bg-black/60 backdrop-blur-md rounded-lg px-6 py-3 max-w-prose text-center
        transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'} ${
          isDialoguePhase ? 'border border-purple-500/50 shadow-lg shadow-purple-500/20' : ''
        }`}
      >
        <p
          className={`text-lg md:text-xl font-medium ${
            isDialoguePhase ? 'text-purple-100' : 'text-white'
          }`}
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
        >
          {displayedText}
        </p>
      </div>
    </div>
  );
}
