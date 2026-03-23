import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { motion, AnimatePresence } from 'framer-motion';
import './TeachingCanvas.css';

export interface TeachingCanvasRef {
  zoomTo(lng: number, lat: number, zoom?: number, duration?: number): void;
  highlightRegion(featureId: string, color: string, opacity?: number): void;
  clearHighlight(featureId: string): void;
  drawRoute(coordinates: [number, number][], color: string, style: 'migration' | 'trade' | 'conquest', animate?: boolean): string;
  removeRoute(routeId: string): void;
  placeMarker(lng: number, lat: number, label: string, color?: string): string;
  removeMarker(markerId: string): void;
  clearOverlays(): void;
  flyTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number }): void;
  showScripture(reference: string, text: string, connection?: string): void;
  showFigure(name: string, title: string, imageUrl?: string): void;
  showGenealogy(rootName: string, nodes: { name: string; parent?: string; descriptor?: string; color?: string }[]): void;
  showTimeline(events: { year: number; label: string; color?: string }[]): void;
  dismissOverlay(type: 'scripture' | 'figure' | 'genealogy' | 'timeline' | 'all'): void;
}

export interface TeachingCanvasProps {
  chapterGeoJSON?: GeoJSON.FeatureCollection;
  className?: string;
}

export const TeachingCanvas = forwardRef<TeachingCanvasRef, TeachingCanvasProps>(
  ({ chapterGeoJSON, className = '' }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
    const animationRefs = useRef<Map<string, number>>(new Map());
    const [mapLoaded, setMapLoaded] = useState(false);

    const MAP_STYLE = `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${import.meta.env.VITE_MAPTILER_KEY || 'PLACEHOLDER'}`;

    useEffect(() => {
      if (!mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: MAP_STYLE,
        center: [32, 15],
        zoom: 3.5,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false, showZoom: true }), 'bottom-right');
      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);
        if (chapterGeoJSON) {
          map.addSource('chapter-regions', {
            type: 'geojson',
            data: chapterGeoJSON,
          });

          map.addLayer({
            id: 'chapter-regions-fill',
            type: 'fill',
            source: 'chapter-regions',
            layout: {},
            paint: {
              'fill-color': ['get', 'color'],
              'fill-opacity': 0, // Hidden by default, updated via highlightRegion
            },
            filter: ['==', ['geometry-type'], 'Polygon'],
          });

          map.addLayer({
             id: 'chapter-regions-line',
             type: 'line',
             source: 'chapter-regions',
             layout: {},
             paint: {
                 'line-color': ['get', 'color'],
                 'line-width': 1,
                 'line-opacity': 0,
             },
             filter: ['==', ['geometry-type'], 'Polygon'],
          });
        }
      });

      return () => {
        animationRefs.current.forEach(id => cancelAnimationFrame(id));
        map.remove();
        mapRef.current = null;
      };
    }, [chapterGeoJSON]);




    // State for Overlays
    // In a full implementation, these would be driven by external state or imperative API calls.
    // For this shell, we define the structure and state to hold them.
    const [activeScripture, setActiveScripture] = useState<{ text: string, reference: string, connection?: string } | null>(null);
    const [activeFigure, setActiveFigure] = useState<{ name: string, title: string, imageUrl?: string } | null>(null);
    const [activeGenealogy, setActiveGenealogy] = useState<{ rootName: string, nodes: { name: string, parent?: string, descriptor?: string, color?: string }[] } | null>(null);
    const [activeTimeline, setActiveTimeline] = useState<{ events: { year: number, label: string, color?: string }[] } | null>(null);

    // Expose overlay methods via the imperative handle (appended to existing ref)
    useImperativeHandle(ref, () => ({
      ...ref && typeof ref === 'object' && 'current' in ref && ref.current ? ref.current : {},
      // Re-declare all existing methods from the first useImperativeHandle above
      zoomTo(lng: number, lat: number, zoom: number = 5, duration: number = 1000) {
        mapRef.current?.flyTo({ center: [lng, lat], zoom, duration });
      },
      highlightRegion(featureId: string, color: string, opacity: number = 0.25) {
        if (!mapRef.current || !mapLoaded) return;
        const map = mapRef.current;
        const currentOpacity = map.getPaintProperty('chapter-regions-fill', 'fill-opacity') || 0;
        let newOpacityExpr;
        if (Array.isArray(currentOpacity) && currentOpacity[0] === 'match') {
          newOpacityExpr = [...currentOpacity];
          newOpacityExpr.splice(newOpacityExpr.length - 1, 0, featureId, opacity);
        } else {
          newOpacityExpr = ['match', ['get', 'id'], featureId, opacity, 0];
        }
        map.setPaintProperty('chapter-regions-fill', 'fill-opacity', newOpacityExpr);
        let newLineExpr;
        const currentLineOpacity = map.getPaintProperty('chapter-regions-line', 'line-opacity') || 0;
        if (Array.isArray(currentLineOpacity) && currentLineOpacity[0] === 'match') {
          newLineExpr = [...currentLineOpacity];
          newLineExpr.splice(newLineExpr.length - 1, 0, featureId, 0.5);
        } else {
          newLineExpr = ['match', ['get', 'id'], featureId, 0.5, 0];
        }
        map.setPaintProperty('chapter-regions-line', 'line-opacity', newLineExpr);
      },
      clearHighlight(featureId: string) {
        if (!mapRef.current || !mapLoaded) return;
        mapRef.current.setPaintProperty('chapter-regions-fill', 'fill-opacity', 0);
        mapRef.current.setPaintProperty('chapter-regions-line', 'line-opacity', 0);
      },
      drawRoute(coordinates: [number, number][], color: string, style: 'migration' | 'trade' | 'conquest', animate: boolean = true) {
        if (!mapRef.current || !mapLoaded) return "";
        const map = mapRef.current;
        const routeId = `route-${Date.now()}`;
        let dashArray = [1, 0];
        let lineWidth = 2;
        if (style === 'migration') { dashArray = [8, 4]; lineWidth = 2; }
        else if (style === 'trade') { dashArray = [2, 2]; lineWidth = 1.5; }
        else if (style === 'conquest') { dashArray = [1, 0]; lineWidth = 3; }
        map.addSource(routeId, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } } });
        map.addLayer({ id: routeId, type: 'line', source: routeId, layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': color, 'line-width': lineWidth, 'line-dasharray': dashArray as [number, number] } });
        return routeId;
      },
      removeRoute(routeId: string) {
        if (!mapRef.current) return;
        const map = mapRef.current;
        if (map.getLayer(routeId)) map.removeLayer(routeId);
        if (map.getSource(routeId)) map.removeSource(routeId);
        if (animationRefs.current.has(routeId)) {
          cancelAnimationFrame(animationRefs.current.get(routeId)!);
          animationRefs.current.delete(routeId);
        }
      },
      placeMarker(lng: number, lat: number, label: string, color: string = '#fac775') {
        if (!mapRef.current) return "";
        const markerId = `marker-${Date.now()}`;
        const el = document.createElement('div');
        el.className = 'teaching-canvas-marker';
        const dot = document.createElement('div');
        dot.className = 'teaching-canvas-marker-dot';
        dot.style.backgroundColor = color;
        const labelEl = document.createElement('div');
        labelEl.className = 'teaching-canvas-marker-label';
        labelEl.textContent = label;
        el.appendChild(dot);
        el.appendChild(labelEl);
        const marker = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(mapRef.current);
        markersRef.current.set(markerId, marker);
        return markerId;
      },
      removeMarker(markerId: string) {
        if (markersRef.current.has(markerId)) {
          markersRef.current.get(markerId)?.remove();
          markersRef.current.delete(markerId);
        }
      },
      clearOverlays() {
        if (!mapRef.current || !mapLoaded) return;
        const map = mapRef.current;
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current.clear();
        if (map.getLayer('chapter-regions-fill')) {
          map.setPaintProperty('chapter-regions-fill', 'fill-opacity', 0);
          map.setPaintProperty('chapter-regions-line', 'line-opacity', 0);
        }
        const style = map.getStyle();
        if (style?.layers) {
          style.layers.forEach(layer => {
            if (layer.id.startsWith('route-')) {
              map.removeLayer(layer.id);
              map.removeSource(layer.id);
            }
          });
        }
        setActiveScripture(null);
        setActiveFigure(null);
        setActiveGenealogy(null);
        setActiveTimeline(null);
      },
      flyTo(options: { center?: [number, number]; zoom?: number; bearing?: number; pitch?: number; duration?: number }) {
        mapRef.current?.flyTo(options);
      },
      // --- Overlay imperative methods ---
      showScripture(reference: string, text: string, connection?: string) {
        setActiveScripture({ text, reference, connection });
      },
      showFigure(name: string, title: string, imageUrl?: string) {
        setActiveFigure({ name, title, imageUrl });
      },
      showGenealogy(rootName: string, nodes: { name: string; parent?: string; descriptor?: string; color?: string }[]) {
        setActiveGenealogy({ rootName, nodes });
      },
      showTimeline(events: { year: number; label: string; color?: string }[]) {
        setActiveTimeline({ events });
      },
      dismissOverlay(type: 'scripture' | 'figure' | 'genealogy' | 'timeline' | 'all') {
        if (type === 'all' || type === 'scripture') setActiveScripture(null);
        if (type === 'all' || type === 'figure') setActiveFigure(null);
        if (type === 'all' || type === 'genealogy') setActiveGenealogy(null);
        if (type === 'all' || type === 'timeline') setActiveTimeline(null);
      },
    }));

    return (
      <div className={`teaching-canvas-container ${className}`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Overlay Panel System */}
        <AnimatePresence>
          {/* ScriptureCard overlay: positioned bottom-left, border-left accent */}
          {activeScripture && (
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: 20 }}
              className="absolute bottom-8 left-8 bg-card border border-border border-l-4 border-l-primary rounded-lg shadow-xl p-5 max-w-sm pointer-events-auto z-20"
            >
              <h4 className="text-primary font-bold text-sm mb-1">{activeScripture.reference}</h4>
              <p className="text-foreground text-base italic leading-relaxed mb-3">"{activeScripture.text}"</p>
              {activeScripture.connection && (
                <p className="text-muted-foreground text-sm border-t border-border pt-2">
                  {activeScripture.connection}
                </p>
              )}
            </motion.div>
          )}

          {/* FigureCard overlay: positioned top-left, portrait image + name + title */}
          {activeFigure && (
            <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20, y: -20 }}
              className="absolute top-8 left-8 bg-card border border-border rounded-xl shadow-xl p-4 flex items-center space-x-4 max-w-sm pointer-events-auto z-20"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex-shrink-0 border-2 border-primary overflow-hidden">
                 {activeFigure.imageUrl ? (
                     <img src={activeFigure.imageUrl} alt={activeFigure.name} className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                 )}
              </div>
              <div>
                <h3 className="text-foreground font-bold text-lg leading-tight">{activeFigure.name}</h3>
                <p className="text-primary/80 text-sm font-medium">{activeFigure.title}</p>
              </div>
            </motion.div>
          )}

          {/* GenealogyPanel overlay: positioned top-right, tree layout */}
          {activeGenealogy && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: -20 }}
              className="absolute top-8 right-8 bg-card border border-border rounded-xl shadow-xl p-6 min-w-[250px] pointer-events-auto z-20"
            >
              <h3 className="text-foreground font-bold text-lg border-b border-border pb-2 mb-4 text-center">
                Family of {activeGenealogy.rootName}
              </h3>
              <div className="flex flex-col items-center space-y-4">
                {activeGenealogy.nodes.map((node, i) => (
                  <div key={i} className="flex flex-col items-center relative">
                    {i > 0 && <div className="w-[2px] h-4 bg-border -mt-4 mb-1"></div>}
                    <div className="flex items-center space-x-3 bg-zinc-900 px-4 py-2 rounded-lg border border-border/50 shadow-inner">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color || '#fac775' }}></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">{node.name}</span>
                        {node.descriptor && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{node.descriptor}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TimelineBar overlay: positioned bottom, horizontal track */}
          {activeTimeline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full shadow-xl px-8 py-3 flex items-center max-w-3xl w-[80%] pointer-events-auto z-20"
            >
              <div className="relative w-full flex items-center justify-between">
                {/* Track */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 rounded-full z-0"></div>
                {/* Events */}
                {activeTimeline.events.map((event, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center group cursor-default">
                    <div className="w-4 h-4 rounded-full border-2 border-card shadow-sm transition-transform group-hover:scale-125" style={{ backgroundColor: event.color || '#5dcaa5' }}></div>
                    <div className="absolute top-full mt-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-border px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
                       <span className="text-xs font-bold text-primary">{Math.abs(event.year)} {event.year < 0 ? 'BC' : 'AD'}</span>
                       <span className="text-sm text-foreground">{event.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

TeachingCanvas.displayName = 'TeachingCanvas';
