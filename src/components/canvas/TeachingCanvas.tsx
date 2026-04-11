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
    const [mapError, setMapError] = useState(false);

    const maptilerKey = import.meta.env.VITE_MAPTILER_KEY || 'PLACEHOLDER';
    // Toner provides a clean, minimal base ideal for historical overlays
    const MAP_STYLE = `https://api.maptiler.com/maps/toner-v2/style.json?key=${maptilerKey}`;

    // Diagnostic: log key fingerprint so misconfigurations are immediately visible
    useEffect(() => {
      const k = maptilerKey;
      const fingerprint = k.length > 6 ? `${k.slice(0, 3)}...${k.slice(-3)}` : k;
      console.log(`[MAP] MapTiler key fingerprint: "${fingerprint}" (length=${k.length}), origin=${window.location.origin}`);
      if (k === 'PLACEHOLDER' || k.includes('.') || k.includes('/')) {
        console.error('[MAP] VITE_MAPTILER_KEY looks invalid — should be an alphanumeric API key, not a URL.');
      }
    }, []);

    /**
     * Apply an ancient-manuscript color scheme after the map style loads.
     * Recolors the toner base to warm parchment/ink tones matching the app's
     * Laterite (#C4622D) / Amber (#E8A838) / Dark Earth (#5C3D2E) palette.
     * Hides modern features (highways, railroads, POIs) for a timeless feel.
     */
    const applyAncientTheme = (map: maplibregl.Map) => {
      const style = map.getStyle();
      if (!style?.layers) return;

      // Modern feature layers to hide completely
      const hidePatterns = [
        'road_', 'highway', 'motorway', 'trunk', 'railway', 'rail',
        'transit', 'poi', 'building', 'aeroway', 'ferry', 'bridge',
        'tunnel', 'path', 'track',
      ];

      for (const layer of style.layers) {
        const id = layer.id.toLowerCase();

        // Hide modern infrastructure
        const shouldHide = hidePatterns.some(p => id.includes(p));
        if (shouldHide && !id.includes('label')) {
          try { map.setLayoutProperty(layer.id, 'visibility', 'none'); } catch {}
          continue;
        }

        // Recolor based on layer type
        try {
          if (layer.type === 'background') {
            map.setPaintProperty(layer.id, 'background-color', '#2e2820'); // Warm parchment base
          } else if (layer.type === 'fill') {
            if (id.includes('water') || id.includes('ocean') || id.includes('sea')) {
              map.setPaintProperty(layer.id, 'fill-color', '#1a2e40'); // Deep but visible water
              map.setPaintProperty(layer.id, 'fill-opacity', 0.85);
            } else if (id.includes('land') || id.includes('earth') || id.includes('park') || id.includes('green')) {
              map.setPaintProperty(layer.id, 'fill-color', '#352e24'); // Warm earth
              map.setPaintProperty(layer.id, 'fill-opacity', 0.9);
            } else if (id.includes('sand') || id.includes('desert') || id.includes('beach')) {
              map.setPaintProperty(layer.id, 'fill-color', '#3d3228'); // Sandy warm
            } else if (id.includes('glacier') || id.includes('ice') || id.includes('snow')) {
              map.setPaintProperty(layer.id, 'fill-color', '#3a3a42'); // Muted ice
            }
          } else if (layer.type === 'line') {
            if (id.includes('water') || id.includes('river') || id.includes('stream')) {
              map.setPaintProperty(layer.id, 'line-color', '#2a4a60'); // Visible water lines
              map.setPaintProperty(layer.id, 'line-opacity', 0.7);
            } else if (id.includes('border') || id.includes('boundary') || id.includes('admin')) {
              map.setPaintProperty(layer.id, 'line-color', '#8a6a4a'); // Warm borders
              map.setPaintProperty(layer.id, 'line-opacity', 0.35);
              map.setPaintProperty(layer.id, 'line-dasharray', [4, 4]);
            } else if (id.includes('contour')) {
              map.setPaintProperty(layer.id, 'line-color', '#3a3228');
              map.setPaintProperty(layer.id, 'line-opacity', 0.2);
            }
          } else if (layer.type === 'symbol') {
            // Strictly hide all modern political, administrative, and populated place labels to enforce historical accuracy.
            // Only allow natural, topological features to be labeled by the base map.
            const isModernLabel = id.includes('country') || id.includes('capital') || 
                                  id.includes('city') || id.includes('town') || 
                                  id.includes('place') || id.includes('poi') || 
                                  id.includes('address') || id.includes('suburb') ||
                                  id.includes('state') || id.includes('admin') ||
                                  id.includes('village');

            if (isModernLabel) {
              try { map.setLayoutProperty(layer.id, 'visibility', 'none'); } catch {}
              continue;
            }

            // Restyle natural/ancient layers to warm parchment tones
            if (id.includes('continent')) {
              map.setPaintProperty(layer.id, 'text-color', '#C4622D'); // Laterite for major labels
              map.setPaintProperty(layer.id, 'text-halo-color', '#1a1610');
              map.setPaintProperty(layer.id, 'text-halo-width', 1.5);
            } else if (id.includes('water') || id.includes('ocean') || id.includes('sea') || id.includes('lake') || id.includes('river')) {
              map.setPaintProperty(layer.id, 'text-color', '#4a6a7a'); // Muted blue for water names
              map.setPaintProperty(layer.id, 'text-halo-color', '#0d1520');
              map.setPaintProperty(layer.id, 'text-halo-width', 1);
            } else if (id.includes('mountain') || id.includes('peak') || id.includes('hill')) {
              map.setPaintProperty(layer.id, 'text-color', '#8a7a6a'); // Muted earth for terrain 
              map.setPaintProperty(layer.id, 'text-opacity', 0.6);
            } else {
              // Default styling for anything we didn't catch (but keep faded)
              map.setPaintProperty(layer.id, 'text-color', '#8a7a6a');
              map.setPaintProperty(layer.id, 'text-halo-color', '#1a1610');
              map.setPaintProperty(layer.id, 'text-halo-width', 0.8);
              map.setPaintProperty(layer.id, 'text-opacity', 0.3);
            }
          }
        } catch {
          // Some paint properties may not apply to all layers — safe to ignore
        }
      }
    };

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

      // Only treat style-load/auth failures as fatal; ignore transient tile/sprite 404s
      map.on('error', (e: any) => {
        const err = e?.error;
        const status = err?.status;
        const message = err?.message || '';
        console.warn('[MAP] Map error event:', { status, message: message.substring(0, 200) });

        // Fatal: style failed to load or auth rejected (bad key)
        const isFatal = status === 401 || status === 403 ||
          message.includes('Failed to fetch style') ||
          message.includes('Error parsing style');
        if (isFatal) {
          console.error('[MAP] Fatal map error — showing "Map Unavailable"');
          setMapError(true);
        }
      });

      map.on('load', () => {
        // Apply ancient color theme before revealing
        applyAncientTheme(map);
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
      <div className={`teaching-canvas-container ${className} relative`}>
        {mapError && (
          <div className="absolute inset-0 bg-zinc-900 z-50 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🗺️</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Map Unavailable</h3>
            <p className="text-muted-foreground">Please check your connection or try again later. The script will continue playing.</p>
          </div>
        )}

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
