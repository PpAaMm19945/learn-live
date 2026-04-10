import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { NAMED_LOCATIONS } from '@/data/geojson/locations';
import type { SceneMode } from '@/lib/session/types';

/** Approximate center coordinates for ancient regions (fallback when no GeoJSON polygons) */
const REGION_CENTERS: Record<string, [number, number]> = {
  mizraim: [31.0, 27.0],    // Egypt
  cush: [31.0, 18.0],       // Ethiopia/Nubia  
  phut: [20.0, 32.0],       // Libya/North Africa
  canaan: [35.0, 32.0],     // Canaan
  babel: [44.4, 32.5],      // Mesopotamia
  egypt: [31.0, 27.0],
  nubia: [31.0, 18.0],
  ethiopia: [38.7, 9.0],
  carthage: [10.18, 36.85],
  aksum: [38.72, 14.13],
};

export interface ToolCallMessage {
  type: 'tool_call';
  tool: string;
  args: Record<string, any>;
}

/**
 * Handle a tool call from the agent.
 */
export function handleToolCall(
  canvas: TeachingCanvasRef | null,
  message: ToolCallMessage,
  onSceneChange?: (mode: SceneMode, args?: Record<string, any>) => void
): void {
  // Scene control — handled by SessionCanvas, not the map
  if (message.tool === 'set_scene') {
    onSceneChange?.(message.args.mode as SceneMode, message.args);
    return;
  }

  // All other tools require a canvas ref
  if (!canvas) return;

  switch (message.tool) {
    case 'zoom_to': {
      // Auto-switch to map scene
      onSceneChange?.('map');
      
      let lng = message.args.lng;
      let lat = message.args.lat;
      if (message.args.location && NAMED_LOCATIONS[message.args.location]) {
        [lng, lat] = NAMED_LOCATIONS[message.args.location];
      }
      if (lng !== undefined && lat !== undefined) {
        canvas.zoomTo(lng, lat, message.args.zoom, message.args.duration);
      }
      break;
    }
    case 'highlight_region': {
      // Try GeoJSON polygon highlight first
      canvas.highlightRegion(message.args.regionId, message.args.color, message.args.opacity);
      
      // Fallback: place a labeled marker at the region center if no GeoJSON polygon exists
      const regionId = message.args.regionId?.toLowerCase();
      const center = REGION_CENTERS[regionId];
      if (center) {
        const label = message.args.regionId.charAt(0).toUpperCase() + message.args.regionId.slice(1);
        canvas.placeMarker(center[0], center[1], label, message.args.color || '#fac775');
      }
      break;
    }
    case 'draw_route': {
      const fromCoords = NAMED_LOCATIONS[message.args.from];
      const toCoords = NAMED_LOCATIONS[message.args.to];
      if (fromCoords && toCoords) {
        canvas.drawRoute([fromCoords, toCoords], message.args.color, message.args.style, true);
      }
      break;
    }
    case 'place_marker': {
      let lng = message.args.lng;
      let lat = message.args.lat;
      if (message.args.location && NAMED_LOCATIONS[message.args.location]) {
        [lng, lat] = NAMED_LOCATIONS[message.args.location];
      }
      if (lng !== undefined && lat !== undefined) {
        canvas.placeMarker(lng, lat, message.args.label, message.args.color);
      }
      break;
    }
    case 'clear_canvas':
      canvas.clearOverlays();
      break;
    case 'show_scripture':
      canvas.showScripture(message.args.reference, message.args.text, message.args.connection);
      break;
    case 'show_figure':
      canvas.showFigure(message.args.name, message.args.title, message.args.imageUrl);
      break;
    case 'show_genealogy':
      canvas.showGenealogy(message.args.rootName, message.args.nodes);
      break;
    case 'show_timeline':
      canvas.showTimeline(message.args.events);
      break;
    case 'dismiss_overlay':
      canvas.dismissOverlay(message.args.type || 'all');
      break;
  }
}
