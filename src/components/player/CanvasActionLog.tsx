import React, { useEffect, useRef } from 'react';
import { Map, MapPin, ZoomIn, Palette, Route, CircleDashed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToolCallLogItem {
  id: string;
  time: Date;
  tool: string;
  target: string;
}

interface CanvasActionLogProps {
  logs: ToolCallLogItem[];
}

export function CanvasActionLog({ logs }: CanvasActionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getIcon = (tool: string) => {
    switch (tool) {
      case 'zoom_to': return <ZoomIn className="w-4 h-4 text-blue-400" />;
      case 'highlight_region': return <Palette className="w-4 h-4 text-purple-400" />;
      case 'draw_route': return <Route className="w-4 h-4 text-green-400" />;
      case 'place_marker': return <MapPin className="w-4 h-4 text-red-400" />;
      case 'clear_canvas': return <CircleDashed className="w-4 h-4 text-zinc-400" />;
      default: return <Map className="w-4 h-4 text-primary" />;
    }
  };

  const formatToolName = (tool: string) => {
    return tool.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-lg border border-border p-3">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Agent Actions</span>
        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-[10px]">{logs.length}</span>
      </h3>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex items-start space-x-3 p-2 rounded-md bg-zinc-800/50 border border-zinc-700/50 text-sm"
            >
              <div className="mt-0.5 shrink-0 bg-zinc-900 p-1.5 rounded-md border border-zinc-700">
                {getIcon(log.tool)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-zinc-200 truncate">{formatToolName(log.tool)}</div>
                {log.target && (
                  <div className="text-xs text-zinc-500 truncate">{log.target}</div>
                )}
              </div>
              <div className="text-[10px] text-zinc-600 whitespace-nowrap pt-1">
                {log.time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </motion.div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-zinc-600 text-xs italic py-8">
              Waiting for agent map actions...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
