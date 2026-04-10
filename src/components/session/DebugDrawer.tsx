import React, { useState, useCallback, useRef, useEffect } from 'react';

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

const ALL_CATEGORIES: DebugEvent['category'][] = ['tool_call', 'beat', 'scene', 'audio', 'qa', 'connection', 'error'];

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
  tool_call: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  beat: 'bg-green-500/20 text-green-300 border-green-500/30',
  scene: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  audio: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  qa: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  connection: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function DebugDrawer({ events, isOpen, onToggle }: DebugDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<Set<DebugEvent['category']>>(new Set(ALL_CATEGORIES));
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length, isOpen]);

  const toggleFilter = useCallback((cat: DebugEvent['category']) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const copyAll = useCallback(() => {
    const json = JSON.stringify(events, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      // Brief visual feedback via title change would be nice but keep it simple
    });
  }, [events]);

  if (!isOpen) return null;

  // Count per category
  const counts: Record<string, number> = {};
  for (const evt of events) {
    counts[evt.category] = (counts[evt.category] || 0) + 1;
  }

  const filtered = events.filter(e => activeFilters.has(e.category));

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-black/95 backdrop-blur-lg border-l border-white/10 z-[100] flex flex-col text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <span className="text-white/80 font-bold tracking-wider uppercase text-[10px]">
          Agent Activity ({events.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyAll}
            className="text-white/40 hover:text-white/80 transition-colors text-[10px] uppercase tracking-wider px-2 py-1 border border-white/10 rounded hover:border-white/30"
          >
            Copy All
          </button>
          <button
            onClick={onToggle}
            className="text-white/50 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/10">
        {ALL_CATEGORIES.map(cat => {
          const active = activeFilters.has(cat);
          const count = counts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => toggleFilter(cat)}
              className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border transition-all ${
                active
                  ? CATEGORY_BADGES[cat]
                  : 'bg-white/5 text-white/20 border-white/5'
              }`}
            >
              {cat.replace('_', ' ')} {count > 0 && <span className="ml-0.5 opacity-70">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filtered.length === 0 && (
          <p className="text-white/30 text-center py-8">No events match filters...</p>
        )}
        {filtered.map((evt) => {
          const time = new Date(evt.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const ms = String(evt.timestamp % 1000).padStart(3, '0');
          const isExpanded = expandedIds.has(evt.id);
          return (
            <div
              key={evt.id}
              className={`flex flex-col gap-0.5 py-1.5 px-1.5 border-b border-white/5 rounded hover:bg-white/5 transition-colors ${evt.detail ? 'cursor-pointer' : ''}`}
              onClick={() => evt.detail && toggleExpand(evt.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-white/25 flex-shrink-0 tabular-nums">{time}.{ms}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${CATEGORY_BADGES[evt.category]}`}>
                  {evt.category.replace('_', ' ')}
                </span>
              </div>
              <span className={`${CATEGORY_COLORS[evt.category]} leading-snug`}>{evt.label}</span>
              {evt.detail && !isExpanded && (
                <span className="text-white/25 truncate text-[10px]" title="Click to expand">
                  {evt.detail.slice(0, 80)}{evt.detail.length > 80 ? '…' : ''}
                </span>
              )}
              {evt.detail && isExpanded && (
                <pre className="text-white/40 text-[10px] whitespace-pre-wrap break-all bg-white/5 rounded p-1.5 mt-0.5 max-h-40 overflow-y-auto">
                  {evt.detail}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
