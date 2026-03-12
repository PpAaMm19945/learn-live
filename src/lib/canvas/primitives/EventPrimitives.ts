import { HistoryCanvasElement } from './index';

/**
 * Creates an event marker for a battle.
 * @param id Unique identifier for the element.
 * @param location Geographic coordinates or a designated point [x, y].
 * @param factions An array of faction names involved in the battle.
 * @param outcome A brief description of the battle's outcome.
 * @returns A HistoryCanvasElement representing a crossed-swords battle marker.
 */
export function createBattleMarker(
  id: string,
  location: [number, number],
  factions: string[],
  outcome: string
): HistoryCanvasElement {
  return {
    id,
    type: 'event_marker',
    x: location[0],
    y: location[1],
    meta: {
      isBattleMarker: true,
      factions,
      outcome
    }
  };
}

/**
 * Creates an architectural symbol for historical buildings.
 * @param id Unique identifier for the element.
 * @param type The building type ('church', 'palace', 'mosque', or 'fort').
 * @param location Geographic coordinates or a designated point [x, y].
 * @returns A HistoryCanvasElement representing an architectural symbol.
 */
export function createBuildingIcon(
  id: string,
  type: 'church' | 'palace' | 'mosque' | 'fort',
  location: [number, number]
): HistoryCanvasElement {
  return {
    id,
    type: 'event_marker',
    x: location[0],
    y: location[1],
    meta: {
      isBuildingIcon: true,
      buildingType: type
    }
  };
}

/**
 * Creates an icon representing cultural symbols.
 * @param id Unique identifier for the element.
 * @param type The type of symbol ('artifact', 'textile', or 'mask').
 * @param region A string describing the region where the symbol originated or belongs.
 * @returns A HistoryCanvasElement representing a cultural symbol.
 */
export function createCulturalSymbol(
  id: string,
  type: 'artifact' | 'textile' | 'mask',
  region: string
): HistoryCanvasElement {
  // Assume generic placement x: 0, y: 0 unless specified, or map system overrides it
  return {
    id,
    type: 'event_marker',
    x: 0,
    y: 0,
    meta: {
      isCulturalSymbol: true,
      symbolType: type,
      region
    }
  };
}
