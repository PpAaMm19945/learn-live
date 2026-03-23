import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { NAMED_LOCATIONS } from '@/data/geojson/locations';

export interface ToolCallMessage {
  type: 'tool_call';
  tool: string;
  args: Record<string, any>;
}

export function handleToolCall(canvas: TeachingCanvasRef, message: ToolCallMessage): void {
  switch (message.tool) {
    case 'zoom_to': {
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
      let fromCoords = NAMED_LOCATIONS[message.args.from];
      let toCoords = NAMED_LOCATIONS[message.args.to];

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
  }
}
