import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AgentToolCall } from '@/lib/session/types';

interface BeatActivityDropdownProps {
  toolCalls: AgentToolCall[];
  thinking?: string;
  blockedTools?: { tool: string; reason: string }[];
}

/** Human-readable summary of a tool call for the activity log. */
function summarizeTool(t: AgentToolCall): string {
  const a = t.args || {};
  switch (t.tool) {
    case 'set_scene':
      if (a.mode === 'image') return `Showed illustration${a.caption ? `: ${a.caption}` : ''}`;
      if (a.mode === 'map') return 'Switched to interactive map';
      if (a.mode === 'transcript') return 'Returned to chapter map';
      return `Scene: ${a.mode || 'unknown'}`;
    case 'show_scripture':
      return `Scripture: ${a.reference || ''}`;
    case 'show_key_term':
      return `Key term: ${a.term || ''}`;
    case 'show_timeline':
      return `Timeline (${a.events?.length || 0} events)`;
    case 'show_question':
      return `Question: ${(a.question || '').slice(0, 60)}`;
    case 'show_quote':
      return `Quote: ${a.attribution || ''}`;
    case 'show_figure':
      return `Figure: ${a.name || ''}`;
    case 'show_genealogy':
      return `Genealogy: ${a.rootName || ''}`;
    case 'show_comparison':
      return `Comparison: ${a.title || ''}`;
    case 'show_slide':
      return `Slide: ${a.title || ''}`;
    case 'place_marker':
      return `Marker: ${a.label || a.location || ''}`;
    case 'zoom_to':
      return `Zoom: ${a.location || a.regionId || ''}`;
    case 'draw_route':
      return 'Drew route on map';
    case 'highlight_region':
      return `Highlight: ${a.regionId || ''}`;
    case 'dismiss_overlay':
      return `Dismissed: ${a.type || 'all'}`;
    default:
      return t.tool;
  }
}

export function BeatActivityDropdown({ toolCalls, thinking, blockedTools }: BeatActivityDropdownProps) {
  const [open, setOpen] = useState(false);
  const totalItems = (toolCalls?.length || 0) + (blockedTools?.length || 0) + (thinking ? 1 : 0);
  if (totalItems === 0) return null;

  return (
    <div className="mt-3 border-t border-border/40 pt-2">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        Activity ({totalItems})
      </button>

      {open && (
        <div className="mt-2 space-y-1.5">
          {toolCalls?.map((t, i) => (
            <div
              key={`t-${i}`}
              className="text-[11px] px-2 py-1 rounded bg-muted/40 text-foreground/80 font-mono leading-snug"
            >
              <span className="text-primary/80 font-semibold">{t.tool}</span>
              <span className="text-muted-foreground"> · </span>
              <span>{summarizeTool(t)}</span>
            </div>
          ))}

          {blockedTools?.map((b, i) => (
            <div
              key={`b-${i}`}
              className="text-[11px] px-2 py-1 rounded bg-muted/20 text-muted-foreground/60 font-mono leading-snug flex items-center gap-2"
            >
              <span className="line-through">{b.tool}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-destructive/15 text-destructive uppercase tracking-wider">blocked</span>
              <span className="text-muted-foreground/50 text-[10px]">{b.reason}</span>
            </div>
          ))}

          {thinking && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 mb-1">Agent thinking</div>
              <div className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                {thinking}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
