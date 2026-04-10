import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { AgentToolCall, AgentMessage, TranscriptChunk, SceneMode } from '@/lib/session/types';
import { Logger } from '@/lib/Logger';

export interface DebugEvent {
  id: number;
  timestamp: number;
  category: 'tool_call' | 'beat' | 'scene' | 'audio' | 'qa' | 'connection' | 'error';
  label: string;
  detail?: string;
}

interface DebugDrawerProps {
  events: DebugEvent[];
  isOpen: boolean;
  onToggle: () => void;
}

let eventCounter = 0;

export function createDebugEvent(
  category: DebugEvent['category'],
  label: string,
  detail?: string
): DebugEvent {
  return {
    id: ++eventCounter,
    timestamp: Date.now(),
    category,
    label,
    detail,
  };
}

const CATEGORY_COLORS: Record<DebugEvent['category'], string> = {
  tool_call: 'text-blue-400',
  beat: 'text-green-400',
  scene: 'text-purple-400',
  audio: 'text-yellow-400',
  qa: 'text-orange-400',
  connection: 'text-cyan-400',
  error: 'text-red-400',
};

const CATEGORY_BADGES: Record<DebugEvent['category'], string> = {
  tool_call: 'bg-blue-500/20 text-blue-300',
  beat: 'bg-green-500/20 text-green-300',
  scene: 'bg-purple-500/20 text-purple-300',
  audio: 'bg-yellow-500/20 text-yellow-300',
  qa: 'bg-orange-500/20 text-orange-300',
  connection: 'bg-cyan-500/20 text-cyan-300',
  error: 'bg-red-500/20 text-red-300',
};

export function DebugDrawer({ events, isOpen, onToggle }: DebugDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-lg border-l border-white/10 z-[100] flex flex-col text-xs font-mono">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <span className="text-white/80 font-bold tracking-wider uppercase text-[10px]">
          Agent Debug ({events.length})
        </span>
        <button
          onClick={onToggle}
          className="text-white/50 hover:text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1">
        {events.length === 0 && (
          <p className="text-white/30 text-center py-8">No events yet...</p>
        )}
        {events.map((evt) => {
          const time = new Date(evt.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return (
            <div key={evt.id} className="flex flex-col gap-0.5 py-1 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-white/30 flex-shrink-0">{time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${CATEGORY_BADGES[evt.category]}`}>
                  {evt.category.replace('_', ' ')}
                </span>
              </div>
              <span className={`${CATEGORY_COLORS[evt.category]}`}>{evt.label}</span>
              {evt.detail && (
                <span className="text-white/30 truncate" title={evt.detail}>
                  {evt.detail.length > 80 ? evt.detail.slice(0, 80) + '…' : evt.detail}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
