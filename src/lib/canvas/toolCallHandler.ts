import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { NAMED_LOCATIONS } from '@/data/geojson/locations';
import type { SceneMode } from '@/lib/session/types';

export interface ToolCallMessage {
  type: 'tool_call';
  tool: string;
  args: Record<string, any>;
}

/**
 * Handle a tool call from the agent.
 * Returns a SceneMode if set_scene was called, otherwise null.
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
    case 'highlight_region':
      canvas.highlightRegion(message.args.regionId, message.args.color, message.args.opacity);
      break;
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
