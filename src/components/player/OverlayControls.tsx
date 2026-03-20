import React, { useRef, MouseEvent, TouchEvent } from 'react';
import { Play, Pause, Settings, HelpCircle, List } from 'lucide-react';

interface OverlayControlsProps {
  isVisible: boolean;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTimeMs: number;
  totalTimeMs: number;
  onSeek: (ms: number) => void;
  onOpenDrawer: () => void;
  onAskQuestion: () => void;
  onSettings: () => void;
}

export function OverlayControls({
  isVisible,
  isPlaying,
  onPlayPause,
  currentTimeMs,
  totalTimeMs,
  onSeek,
  onOpenDrawer,
  onAskQuestion,
  onSettings,
}: OverlayControlsProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalTimeMs > 0 ? (currentTimeMs / totalTimeMs) * 100 : 0;

  const handleSeek = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || totalTimeMs === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * totalTimeMs);
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-50 transition-opacity duration-300 pointer-events-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7) 80%)',
      }}
    >
      <div className="w-full flex flex-col pt-12 pb-4 px-4 sm:px-6 pointer-events-auto">
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative w-full h-1 bg-white/30 cursor-pointer group mb-4"
          onMouseDown={handleSeek}
          onTouchStart={handleSeek}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all group-hover:h-1.5 group-hover:-mt-0.5"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayPause();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current" />
              )}
            </button>
            <span className="text-sm font-medium tabular-nums drop-shadow-md">
              {formatTime(currentTimeMs)} / {formatTime(totalTimeMs)}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAskQuestion();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Ask a Question"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettings();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDrawer();
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Up Next"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
