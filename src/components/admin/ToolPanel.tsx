import { useMemo, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NAMED_LOCATIONS } from '@/data/geojson/locations';
import { REGION_CENTERS } from '@/lib/canvas/toolCallHandler';
import type { ToolCallMessage } from '@/lib/canvas/toolCallHandler';

interface ToolPanelProps {
  onDispatch: (message: ToolCallMessage) => void;
}

const locationKeys = Object.keys(NAMED_LOCATIONS).sort();
const regionKeys = Object.keys(REGION_CENTERS).sort();

const sampleGenealogy = JSON.stringify([
  { name: 'Noah', descriptor: 'Patriarch' },
  { name: 'Ham', parent: 'Noah' },
  { name: 'Cush', parent: 'Ham' },
  { name: 'Mizraim', parent: 'Ham' },
], null, 2);

const sampleTimeline = JSON.stringify([
  { year: -2500, label: 'Early Nile kingdoms', color: '#60a5fa' },
  { year: -1800, label: 'Middle Bronze migrations', color: '#f59e0b' },
  { year: -1200, label: 'Levant shifts', color: '#f43f5e' },
], null, 2);

export function ToolPanel({ onDispatch }: ToolPanelProps) {
  const [zoomForm, setZoomForm] = useState({ location: 'jerusalem', lng: '', lat: '', zoom: 6, duration: 1500, mode: 'named' as 'named' | 'raw' });
  const [highlightForm, setHighlightForm] = useState({ regionId: 'canaan', color: '#fac775', opacity: 0.4 });
  const [routeForm, setRouteForm] = useState({ from: 'babel', to: 'canaan', color: '#ffff00', style: 'migration' as 'migration' | 'trade' | 'conquest' });
  const [markerForm, setMarkerForm] = useState({ location: 'babel', lng: '', lat: '', label: 'Test marker', color: '#ff4444', mode: 'named' as 'named' | 'raw' });
  const [scriptureForm, setScriptureForm] = useState({ reference: 'Genesis 10:6', text: 'The sons of Ham: Cush, Egypt, Put, and Canaan.', connection: '' });
  const [figureForm, setFigureForm] = useState({ name: 'Moses', title: 'Leader and Lawgiver', imageUrl: '' });
  const [genealogyNodes, setGenealogyNodes] = useState(sampleGenealogy);
  const [timelineEvents, setTimelineEvents] = useState(sampleTimeline);
  const [overlayType, setOverlayType] = useState<'all' | 'scripture' | 'figure' | 'genealogy' | 'timeline'>('all');

  const regionSuggestions = useMemo(() => regionKeys.join(', '), []);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Manual Tool Calls</h3>
      <Accordion type="multiple" className="w-full border rounded-md px-3">
        <AccordionItem value="zoom_to">
          <AccordionTrigger>zoom_to</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex gap-2">
              <Button variant={zoomForm.mode === 'named' ? 'default' : 'outline'} size="sm" onClick={() => setZoomForm((prev) => ({ ...prev, mode: 'named' }))}>Named</Button>
              <Button variant={zoomForm.mode === 'raw' ? 'default' : 'outline'} size="sm" onClick={() => setZoomForm((prev) => ({ ...prev, mode: 'raw' }))}>Coordinates</Button>
            </div>
            {zoomForm.mode === 'named' ? (
              <Select value={zoomForm.location} onValueChange={(value) => setZoomForm((prev) => ({ ...prev, location: value }))}>
                <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
                <SelectContent>{locationKeys.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="lng" value={zoomForm.lng} onChange={(e) => setZoomForm((prev) => ({ ...prev, lng: e.target.value }))} />
                <Input placeholder="lat" value={zoomForm.lat} onChange={(e) => setZoomForm((prev) => ({ ...prev, lat: e.target.value }))} />
              </div>
            )}
            <Label>Zoom: {zoomForm.zoom}</Label>
            <Slider min={1} max={18} step={1} value={[zoomForm.zoom]} onValueChange={([value]) => setZoomForm((prev) => ({ ...prev, zoom: value }))} />
            <Label>Duration: {zoomForm.duration}ms</Label>
            <Slider min={0} max={5000} step={100} value={[zoomForm.duration]} onValueChange={([value]) => setZoomForm((prev) => ({ ...prev, duration: value }))} />
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'zoom_to', args: zoomForm.mode === 'named' ? { location: zoomForm.location, zoom: zoomForm.zoom, duration: zoomForm.duration } : { lng: Number(zoomForm.lng), lat: Number(zoomForm.lat), zoom: zoomForm.zoom, duration: zoomForm.duration } })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="highlight_region">
          <AccordionTrigger>highlight_region</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Input value={highlightForm.regionId} onChange={(e) => setHighlightForm((prev) => ({ ...prev, regionId: e.target.value }))} placeholder={`regionId (${regionSuggestions})`} />
            <div className="flex items-center gap-2"><Label>Color</Label><Input type="color" value={highlightForm.color} onChange={(e) => setHighlightForm((prev) => ({ ...prev, color: e.target.value }))} className="h-9 w-20" /></div>
            <Label>Opacity: {highlightForm.opacity.toFixed(2)}</Label>
            <Slider min={0} max={1} step={0.05} value={[highlightForm.opacity]} onValueChange={([value]) => setHighlightForm((prev) => ({ ...prev, opacity: value }))} />
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'highlight_region', args: highlightForm })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="draw_route">
          <AccordionTrigger>draw_route</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Select value={routeForm.from} onValueChange={(value) => setRouteForm((prev) => ({ ...prev, from: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{locationKeys.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent></Select>
            <Select value={routeForm.to} onValueChange={(value) => setRouteForm((prev) => ({ ...prev, to: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{locationKeys.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent></Select>
            <div className="flex items-center gap-2"><Label>Color</Label><Input type="color" value={routeForm.color} onChange={(e) => setRouteForm((prev) => ({ ...prev, color: e.target.value }))} className="h-9 w-20" /></div>
            <Select value={routeForm.style} onValueChange={(value: 'migration' | 'trade' | 'conquest') => setRouteForm((prev) => ({ ...prev, style: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="migration">migration</SelectItem>
                <SelectItem value="trade">trade</SelectItem>
                <SelectItem value="conquest">conquest</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'draw_route', args: routeForm })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="place_marker">
          <AccordionTrigger>place_marker</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex gap-2">
              <Button variant={markerForm.mode === 'named' ? 'default' : 'outline'} size="sm" onClick={() => setMarkerForm((prev) => ({ ...prev, mode: 'named' }))}>Named</Button>
              <Button variant={markerForm.mode === 'raw' ? 'default' : 'outline'} size="sm" onClick={() => setMarkerForm((prev) => ({ ...prev, mode: 'raw' }))}>Coordinates</Button>
            </div>
            {markerForm.mode === 'named' ? (
              <Select value={markerForm.location} onValueChange={(value) => setMarkerForm((prev) => ({ ...prev, location: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{locationKeys.map((location) => <SelectItem key={location} value={location}>{location}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="lng" value={markerForm.lng} onChange={(e) => setMarkerForm((prev) => ({ ...prev, lng: e.target.value }))} />
                <Input placeholder="lat" value={markerForm.lat} onChange={(e) => setMarkerForm((prev) => ({ ...prev, lat: e.target.value }))} />
              </div>
            )}
            <Input placeholder="Label" value={markerForm.label} onChange={(e) => setMarkerForm((prev) => ({ ...prev, label: e.target.value }))} />
            <div className="flex items-center gap-2"><Label>Color</Label><Input type="color" value={markerForm.color} onChange={(e) => setMarkerForm((prev) => ({ ...prev, color: e.target.value }))} className="h-9 w-20" /></div>
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'place_marker', args: markerForm.mode === 'named' ? { location: markerForm.location, label: markerForm.label, color: markerForm.color } : { lng: Number(markerForm.lng), lat: Number(markerForm.lat), label: markerForm.label, color: markerForm.color } })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="show_scripture">
          <AccordionTrigger>show_scripture</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Input placeholder="Reference" value={scriptureForm.reference} onChange={(e) => setScriptureForm((prev) => ({ ...prev, reference: e.target.value }))} />
            <Textarea placeholder="Scripture text" value={scriptureForm.text} onChange={(e) => setScriptureForm((prev) => ({ ...prev, text: e.target.value }))} />
            <Input placeholder="Connection (optional)" value={scriptureForm.connection} onChange={(e) => setScriptureForm((prev) => ({ ...prev, connection: e.target.value }))} />
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'show_scripture', args: scriptureForm })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="show_figure">
          <AccordionTrigger>show_figure</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Input placeholder="Name" value={figureForm.name} onChange={(e) => setFigureForm((prev) => ({ ...prev, name: e.target.value }))} />
            <Input placeholder="Title" value={figureForm.title} onChange={(e) => setFigureForm((prev) => ({ ...prev, title: e.target.value }))} />
            <Input placeholder="Image URL" value={figureForm.imageUrl} onChange={(e) => setFigureForm((prev) => ({ ...prev, imageUrl: e.target.value }))} />
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'show_figure', args: figureForm })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="show_genealogy">
          <AccordionTrigger>show_genealogy</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Input placeholder="Root name" defaultValue="Noah" id="genealogy-root" />
            <Textarea className="min-h-28 font-mono text-xs" value={genealogyNodes} onChange={(e) => setGenealogyNodes(e.target.value)} />
            <Button size="sm" variant="outline" onClick={() => setGenealogyNodes(sampleGenealogy)}>Load Template</Button>
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'show_genealogy', args: { rootName: 'Noah', nodes: JSON.parse(genealogyNodes) } })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="show_timeline">
          <AccordionTrigger>show_timeline</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Textarea className="min-h-28 font-mono text-xs" value={timelineEvents} onChange={(e) => setTimelineEvents(e.target.value)} />
            <Button size="sm" variant="outline" onClick={() => setTimelineEvents(sampleTimeline)}>Load Template</Button>
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'show_timeline', args: { events: JSON.parse(timelineEvents) } })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dismiss_overlay">
          <AccordionTrigger>dismiss_overlay</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Select value={overlayType} onValueChange={(value: 'all' | 'scripture' | 'figure' | 'genealogy' | 'timeline') => setOverlayType(value)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all</SelectItem>
                <SelectItem value="scripture">scripture</SelectItem>
                <SelectItem value="figure">figure</SelectItem>
                <SelectItem value="genealogy">genealogy</SelectItem>
                <SelectItem value="timeline">timeline</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => onDispatch({ type: 'tool_call', tool: 'dismiss_overlay', args: { type: overlayType } })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="clear_canvas">
          <AccordionTrigger>clear_canvas</AccordionTrigger>
          <AccordionContent>
            <Button size="sm" variant="destructive" onClick={() => onDispatch({ type: 'tool_call', tool: 'clear_canvas', args: {} })}>Fire</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
