import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ToolCallMessage } from '@/lib/canvas/toolCallHandler';

interface MapPresetsProps {
  onDispatch: (message: ToolCallMessage) => void;
}

export function MapPresets({ onDispatch }: MapPresetsProps) {
  const [customLng, setCustomLng] = useState('35');
  const [customLat, setCustomLat] = useState('31');
  const [customZoom, setCustomZoom] = useState('7');

  const runSequence = (messages: ToolCallMessage[]) => {
    messages.forEach((message) => onDispatch(message));
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Map Presets</h3>
      <div className="grid gap-2">
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'zoom_to', args: { location: 'jerusalem', zoom: 10 } })}>Zoom to Jerusalem</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'zoom_to', args: { location: 'babel', zoom: 8 } })}>Zoom to Babylon</Button>
        <div className="grid grid-cols-3 gap-2">
          <Input value={customLng} onChange={(event) => setCustomLng(event.target.value)} placeholder="lng" />
          <Input value={customLat} onChange={(event) => setCustomLat(event.target.value)} placeholder="lat" />
          <Input value={customZoom} onChange={(event) => setCustomZoom(event.target.value)} placeholder="zoom" />
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDispatch({ type: 'tool_call', tool: 'zoom_to', args: { lng: Number(customLng), lat: Number(customLat), zoom: Number(customZoom) } })}
        >
          Zoom to Custom
        </Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'highlight_region', args: { regionId: 'canaan', color: '#fac775', opacity: 0.4 } })}>Highlight Canaan</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'highlight_region', args: { regionId: 'mizraim', color: '#ff6b6b', opacity: 0.4 } })}>Highlight Mizraim</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'highlight_region', args: { regionId: 'cush', color: '#4ecdc4' } })}>Highlight Cush</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'draw_route', args: { from: 'babel', to: 'canaan', color: '#ffff00', style: 'migration' } })}>Route: Ur → Canaan</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'draw_route', args: { from: 'egypt', to: 'jerusalem', style: 'conquest', color: '#ff944d' } })}>Route: Egypt → Canaan</Button>
        <Button size="sm" variant="outline" onClick={() => onDispatch({ type: 'tool_call', tool: 'place_marker', args: { location: 'babel', label: 'Tower of Babel', color: '#ff4444' } })}>Marker: Babel</Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runSequence([
              { type: 'tool_call', tool: 'clear_canvas', args: {} },
              { type: 'tool_call', tool: 'zoom_to', args: { location: 'egypt', zoom: 6 } },
              { type: 'tool_call', tool: 'highlight_region', args: { regionId: 'mizraim', color: '#ff6b6b', opacity: 0.4 } },
              { type: 'tool_call', tool: 'draw_route', args: { from: 'egypt', to: 'canaan', color: '#ffff66', style: 'migration' } },
              { type: 'tool_call', tool: 'place_marker', args: { location: 'canaan', label: 'Promised Land', color: '#fac775' } },
            ])
          }
        >
          Multi-step: Exodus
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDispatch({ type: 'tool_call', tool: 'clear_canvas', args: {} })}>Clear All</Button>
      </div>
    </section>
  );
}
