import React, { useEffect, useRef } from 'react';

interface TranscriptPanelProps {
  transcriptText: string;
  isActive: boolean;
}

export function TranscriptPanel({ transcriptText, isActive }: TranscriptPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && transcriptText) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcriptText]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Transcript</h3>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {transcriptText ? (
          <div className={`text-lg leading-relaxed transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
            {transcriptText}
          </div>
        ) : (
          <div className="text-zinc-600 italic text-sm text-center mt-8">
            Waiting for speech...
          </div>
        )}
      </div>
    </div>
  );
}
