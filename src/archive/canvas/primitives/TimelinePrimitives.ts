import { HistoryCanvasElement } from './index';

/**
 * Creates a horizontal era band for chronological visualization.
 * @param id Unique identifier for the element.
 * @param startYear The starting year of the era (e.g., negative for BC).
 * @param endYear The ending year of the era.
 * @param label The display label for the era.
 * @param color The background color of the band.
 * @returns A HistoryCanvasElement representing an era band.
 */
export function createEraBand(
  id: string,
  startYear: number,
  endYear: number,
  label: string,
  color: string
): HistoryCanvasElement {
  return {
    id,
    type: 'timeline_marker',
    x: 0, // Positional x should be calculated by the parent component handling the timeline view
    y: 0,
    color,
    content: label,
    meta: {
      isEraBand: true,
      timelineData: {
        startYear,
        endYear
      }
    }
  };
}

/**
 * Creates a vertical date marker (tick) on the timeline.
 * @param id Unique identifier for the element.
 * @param year The specific year of the marker.
 * @param label A short label or title for the date.
 * @param importance Visual scaling parameter (1 = minor, 2 = standard, 3 = major).
 * @returns A HistoryCanvasElement representing a date marker.
 */
export function createDateMarker(
  id: string,
  year: number,
  label: string,
  importance: 1 | 2 | 3
): HistoryCanvasElement {
  return {
    id,
    type: 'timeline_marker',
    x: 0,
    y: 0,
    content: label,
    scale: importance,
    meta: {
      isDateMarker: true,
      year,
      importance
    }
  };
}

/**
 * Creates a connecting line between era bands or timeline points.
 * @param id Unique identifier for the element.
 * @param fromYear The starting year connection.
 * @param toYear The ending year connection.
 * @param label Text to appear near the connector.
 * @returns A HistoryCanvasElement representing a duration connector.
 */
export function createDurationConnector(
  id: string,
  fromYear: number,
  toYear: number,
  label: string
): HistoryCanvasElement {
  return {
    id,
    type: 'timeline_marker',
    x: 0,
    y: 0,
    content: label,
    meta: {
      isDurationConnector: true,
      fromYear,
      toYear
    }
  };
}
