import { HistoryCanvasElement } from './index';

/**
 * Creates an animated trade route element.
 * @param id Unique identifier for the element.
 * @param from Starting coordinates [x, y].
 * @param to Ending coordinates [x, y].
 * @param color CSS color string (preferably semantic token).
 * @param style Type of route ('trade', 'migration', or 'conquest').
 * @returns A HistoryCanvasElement representing a dashed SVG path.
 */
export function createTradeRoute(
  id: string,
  from: [number, number],
  to: [number, number],
  color: string,
  style: 'trade' | 'migration' | 'conquest'
): HistoryCanvasElement {
  return {
    id,
    type: 'map_overlay',
    x: from[0],
    y: from[1],
    color,
    route: { from, to, style },
    meta: {
      routeType: style,
      animated: true,
      dashed: true
    }
  };
}

/**
 * Creates a curved migration arrow with ripple animation data.
 * @param id Unique identifier for the element.
 * @param origin Starting coordinates [x, y].
 * @param destinations Array of destination coordinates [[x, y], ...].
 * @param waveCount Number of animation ripples/waves.
 * @returns A HistoryCanvasElement representing curved migration paths.
 */
export function createMigrationArrow(
  id: string,
  origin: [number, number],
  destinations: [number, number][],
  waveCount: number
): HistoryCanvasElement {
  return {
    id,
    type: 'map_overlay',
    x: origin[0],
    y: origin[1],
    meta: {
      isMigrationArrow: true,
      origin,
      destinations,
      waveCount,
      animated: true
    }
  };
}

/**
 * Creates an SVG territory fill overlay.
 * @param id Unique identifier for the element.
 * @param regionId Identifier mapping to the SVG region path in the map.
 * @param fillColor CSS color string (preferably semantic token).
 * @param label Text label for the territory.
 * @returns A HistoryCanvasElement representing a region fill.
 */
export function createTerritoryOverlay(
  id: string,
  regionId: string,
  fillColor: string,
  label: string
): HistoryCanvasElement {
  return {
    id,
    type: 'map_overlay',
    x: 0,
    y: 0,
    color: fillColor,
    content: label,
    meta: {
      isTerritory: true,
      regionId
    }
  };
}

/**
 * Creates a patterned climate zone fill overlay.
 * @param id Unique identifier for the element.
 * @param type The climate type ('desert', 'rainforest', or 'savannah').
 * @param bounds Boundary rectangle [x, y, width, height].
 * @returns A HistoryCanvasElement representing a patterned overlay.
 */
export function createClimateZone(
  id: string,
  type: 'desert' | 'rainforest' | 'savannah',
  bounds: [number, number, number, number]
): HistoryCanvasElement {
  return {
    id,
    type: 'map_overlay',
    x: bounds[0],
    y: bounds[1],
    width: bounds[2],
    height: bounds[3],
    meta: {
      isClimateZone: true,
      climateType: type,
      patterned: true
    }
  };
}
