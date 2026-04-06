import { AnimatePresence, motion } from 'framer-motion';
import type { SceneMode } from '@/lib/session/types';
import type { ToolActivity } from '@/lib/session/useSession';

interface ToolActivityBannerProps {
  sceneMode: SceneMode;
  sceneModeBadge: SceneMode | null;
  lastToolCall: ToolActivity | null;
  recentToolCalls: ToolActivity[];
}

export function ToolActivityBanner({ sceneMode, sceneModeBadge, lastToolCall, recentToolCalls }: ToolActivityBannerProps) {
  return (
    <>
      <div className="absolute top-16 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 text-cyan-100 text-[11px] font-semibold uppercase tracking-wider">
          Scene: {sceneMode}
        </div>

        <AnimatePresence>
          {sceneModeBadge && (
            <motion.div
              key={`${sceneModeBadge}-${lastToolCall?.id ?? 'scene-change'}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-2 rounded-lg border border-emerald-400/40 bg-emerald-500/15 text-emerald-100 text-xs font-medium"
            >
              Scene changed → {sceneModeBadge}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-28 left-4 z-40 max-w-sm w-[calc(100%-2rem)] pointer-events-none">
        <div className="rounded-xl border border-white/15 bg-black/40 backdrop-blur-md p-3 text-white/90 shadow-lg">
          <p className="text-[11px] uppercase tracking-wide text-white/70 font-semibold">Tool activity</p>
          {lastToolCall ? (
            <p className="text-sm mt-1 font-medium break-words">
              Tool: {lastToolCall.tool} → {String((lastToolCall.args as any)?.mode ?? JSON.stringify(lastToolCall.args))}
            </p>
          ) : (
            <p className="text-sm mt-1 text-white/70">No tool calls yet.</p>
          )}
          {recentToolCalls.length > 0 && (
            <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto pr-1 text-[12px] text-white/75">
              {recentToolCalls.slice(0, 4).map((toolCall) => (
                <li key={toolCall.id} className="font-mono">
                  {toolCall.tool} {toolCall.args?.mode ? `(${toolCall.args.mode})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
