import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { R2Image } from '@/components/ui/R2Image';
import { resolveImageUrl } from '@/lib/r2Assets';
import { Link } from 'react-router-dom';

// Read-only inspector. Never dispatches tool calls, mutates overlays, or touches live canvas/audio state.
export type TimelineEvent = { year: number; label: string; color?: string };

export type InspectorArtifact =
  | { kind: 'image'; url: string; caption?: string }
  | { kind: 'scripture'; reference: string; text: string; connection?: string }
  | { kind: 'keyTerm'; term: string; definition: string; pronunciation?: string; etymology?: string }
  | { kind: 'timeline'; events: TimelineEvent[] }
  | { kind: 'question'; question: string; context?: string; type?: string }
  | { kind: 'quote'; text: string; attribution?: string; date?: string }
  | { kind: 'figure'; name: string; title?: string; imageUrl?: string }
  | { kind: 'genealogy'; rootName: string; nodes: any[] }
  | { kind: 'comparison'; title: string; columnA: any; columnB: any }
  | { kind: 'slide'; title: string; body?: string; bullets?: string[]; imageUrl?: string }
  | { kind: 'mapAction'; tool: string; args: any }
  | { kind: 'assignment'; prompt: string };

interface ArtifactInspectorProps {
  open: boolean;
  onClose: () => void;
  artifact: InspectorArtifact | null;
}

const mapActionSummary = (tool: string, args: any): string => {
  switch (tool) {
    case 'place_marker':
      return `Marker placed at ${args?.label || args?.location || 'selected location'}.`;
    case 'zoom_to':
      return `Map zoom changed to ${args?.location || args?.regionId || 'target area'}.`;
    case 'draw_route':
      return `Route drawn${args?.from || args?.to ? ` from ${args?.from || 'origin'} to ${args?.to || 'destination'}` : ''}.`;
    case 'highlight_region':
      return `Region highlighted: ${args?.regionId || 'selected region'}.`;
    case 'set_scene':
      return `Scene switched to ${args?.mode || 'unknown'} mode.`;
    default:
      return 'Map action applied during this beat.';
  }
};

export function ArtifactInspector({ open, onClose, artifact }: ArtifactInspectorProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {!artifact ? null : (
          <>
            <DialogHeader>
              <DialogTitle className="capitalize">{artifact.kind}</DialogTitle>
              <DialogDescription>Read-only artifact viewer for transcript activity.</DialogDescription>
            </DialogHeader>

            {artifact.kind === 'image' && (
              <div className="space-y-3">
                <R2Image
                  src={resolveImageUrl(artifact.url)}
                  alt={artifact.caption || 'Lesson illustration'}
                  className="w-full max-h-[60vh] object-contain rounded-md bg-muted/20"
                />
                {artifact.caption && <p className="text-sm text-muted-foreground">{artifact.caption}</p>}
              </div>
            )}

            {artifact.kind === 'scripture' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                <p className="text-primary font-semibold">{artifact.reference}</p>
                <p className="italic">“{artifact.text}”</p>
                {artifact.connection && <p className="text-sm text-muted-foreground">{artifact.connection}</p>}
              </div>
            )}

            {artifact.kind === 'keyTerm' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                <p className="text-lg font-semibold">{artifact.term}</p>
                {artifact.pronunciation && <p className="text-sm text-muted-foreground">/{artifact.pronunciation}/</p>}
                <p>{artifact.definition}</p>
                {artifact.etymology && <p className="text-sm text-muted-foreground">Origin: {artifact.etymology}</p>}
              </div>
            )}

            {artifact.kind === 'timeline' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                {artifact.events.map((event, idx) => (
                  <div key={`${event.label}-${idx}`} className="text-sm flex items-center gap-2">
                    <span className="font-semibold">{event.year}</span>
                    <span>—</span>
                    <span>{event.label}</span>
                  </div>
                ))}
              </div>
            )}

            {artifact.kind === 'question' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                <p className="font-semibold">{artifact.question}</p>
                {artifact.context && <p className="text-sm text-muted-foreground">{artifact.context}</p>}
                {artifact.type && <p className="text-xs uppercase tracking-wider text-primary">{artifact.type}</p>}
              </div>
            )}

            {artifact.kind === 'quote' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                <p className="italic">“{artifact.text}”</p>
                {artifact.attribution && <p className="text-sm">— {artifact.attribution}</p>}
                {artifact.date && <p className="text-xs text-muted-foreground">{artifact.date}</p>}
              </div>
            )}

            {artifact.kind === 'figure' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-3">
                <p className="font-semibold">{artifact.name}</p>
                {artifact.title && <p className="text-sm text-muted-foreground">{artifact.title}</p>}
                {artifact.imageUrl && (
                  <R2Image
                    src={resolveImageUrl(artifact.imageUrl)}
                    alt={artifact.name}
                    className="w-full max-h-[45vh] object-contain rounded-md bg-muted/20"
                  />
                )}
              </div>
            )}

            {artifact.kind === 'genealogy' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-2">
                <p className="font-semibold">Family of {artifact.rootName}</p>
                {artifact.nodes.map((node, idx) => (
                  <p key={`${node?.name || 'node'}-${idx}`} className="text-sm">
                    {node?.name}
                    {node?.descriptor ? ` — ${node.descriptor}` : ''}
                  </p>
                ))}
              </div>
            )}

            {artifact.kind === 'comparison' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-4">
                <p className="font-semibold">{artifact.title}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">{artifact.columnA?.heading || 'Column A'}</p>
                    {(artifact.columnA?.points || []).map((point: string, idx: number) => <p key={idx}>• {point}</p>)}
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{artifact.columnB?.heading || 'Column B'}</p>
                    {(artifact.columnB?.points || []).map((point: string, idx: number) => <p key={idx}>• {point}</p>)}
                  </div>
                </div>
              </div>
            )}

            {artifact.kind === 'slide' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-3">
                <p className="font-semibold">{artifact.title}</p>
                {artifact.body && <p>{artifact.body}</p>}
                {artifact.bullets?.length ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {artifact.bullets.map((bullet, idx) => <li key={idx}>{bullet}</li>)}
                  </ul>
                ) : null}
                {artifact.imageUrl && (
                  <R2Image
                    src={resolveImageUrl(artifact.imageUrl)}
                    alt={artifact.title}
                    className="w-full max-h-[45vh] object-contain rounded-md bg-muted/20"
                  />
                )}
              </div>
            )}

            {artifact.kind === 'mapAction' && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <p className="font-semibold">Map Action</p>
                <p className="text-sm text-muted-foreground">{mapActionSummary(artifact.tool, artifact.args)}</p>
                <pre className="text-xs bg-background/70 rounded p-2 overflow-auto">{JSON.stringify(artifact.args, null, 2)}</pre>
              </div>
            )}

            {artifact.kind === 'assignment' && (
              <div className="rounded-lg border border-border p-4 bg-card/80 space-y-3">
                <p className="font-semibold">Assignment Prompt</p>
                <p className="text-sm leading-relaxed">{artifact.prompt}</p>
                <Link
                  to="/parent/assignments"
                  className="inline-flex text-sm text-primary underline underline-offset-2 hover:opacity-80"
                  onClick={onClose}
                >
                  View in dashboard
                </Link>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
