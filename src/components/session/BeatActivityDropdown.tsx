import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AgentToolCall } from '@/lib/session/types';
import type { InspectorArtifact } from './ArtifactInspector';
import { mergeTimeline } from '@/data/chapterTimelines';

interface BeatActivityDropdownProps {
  toolCalls: AgentToolCall[];
  thinking?: string;
  blockedTools?: { tool: string; reason: string }[];
  chapterId: string;
  onArtifactClick?: (artifact: InspectorArtifact) => void;
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
    case 'record_assignment':
      return `Assignment recorded: ${(a.prompt || '').slice(0, 60)}`;
    default:
      return t.tool;
  }
}

export function buildArtifact(toolCall: AgentToolCall, chapterId: string): InspectorArtifact | null {
  const args = toolCall.args || {};
  switch (toolCall.tool) {
    case 'set_scene':
      if (args.mode === 'image' && args.imageUrl) {
        return { kind: 'image', url: args.imageUrl, caption: args.caption };
      }
      if (args.mode === 'map' || args.mode === 'transcript') {
        return { kind: 'mapAction', tool: toolCall.tool, args };
      }
      return null;
    case 'show_scripture':
      return { kind: 'scripture', reference: args.reference || '', text: args.text || '', connection: args.connection };
    case 'show_key_term':
      return {
        kind: 'keyTerm',
        term: args.term || '',
        definition: args.definition || '',
        pronunciation: args.pronunciation,
        etymology: args.etymology,
      };
    case 'show_timeline':
      return { kind: 'timeline', events: mergeTimeline(chapterId, args.events || []) };
    case 'show_question':
      return { kind: 'question', question: args.question || '', context: args.context, type: args.type };
    case 'show_quote':
      return { kind: 'quote', text: args.text || '', attribution: args.attribution, date: args.date };
    case 'show_figure':
      return { kind: 'figure', name: args.name || '', title: args.title, imageUrl: args.imageUrl };
    case 'show_genealogy':
      return { kind: 'genealogy', rootName: args.rootName || '', nodes: args.nodes || [] };
    case 'show_comparison':
      return { kind: 'comparison', title: args.title || '', columnA: args.columnA, columnB: args.columnB };
    case 'show_slide':
      return { kind: 'slide', title: args.title || '', body: args.body, bullets: args.bullets, imageUrl: args.imageUrl };
    case 'place_marker':
    case 'zoom_to':
    case 'draw_route':
    case 'highlight_region':
      return { kind: 'mapAction', tool: toolCall.tool, args };
    case 'record_assignment':
      return { kind: 'assignment', prompt: args.prompt || 'Assignment recorded.' };
    default:
      return null;
  }
}

export function BeatActivityDropdown({ toolCalls, thinking, blockedTools, chapterId, onArtifactClick }: BeatActivityDropdownProps) {
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
          {toolCalls?.map((t, i) => {
            const artifact = buildArtifact(t, chapterId);
            const clickable = !!artifact && !!onArtifactClick;
            return (
              <button
                key={`t-${i}`}
                type="button"
                onClick={() => artifact && onArtifactClick?.(artifact)}
                disabled={!clickable}
                className={`w-full text-left text-[11px] px-2 py-1 rounded font-mono leading-snug transition-colors ${
                  clickable
                    ? 'bg-muted/40 hover:bg-muted/70 text-foreground/90 cursor-pointer'
                    : 'bg-muted/25 text-foreground/70 cursor-default'
                }`}
              >
                <span className="text-primary/80 font-semibold">{t.tool}</span>
                <span className="text-muted-foreground"> · </span>
                <span>{summarizeTool(t)}</span>
              </button>
            );
          })}

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
