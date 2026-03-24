import { CanvasElement, CanvasOperation } from '@/archive/explainerClient';

export interface RouteData {
  from: [number, number];
  to: [number, number];
  style: 'trade' | 'migration' | 'conquest';
}

export interface ZoomData {
  center: [number, number];
  level: number;
  duration: number;
}

export interface TimelineData {
  startYear: number;
  endYear: number;
}

export interface HistoryCanvasElement extends Omit<CanvasElement, 'type'> {
  type: CanvasElement['type'] | 'map_overlay' | 'timeline_marker' | 'figure_card' | 'event_marker';
  route?: RouteData;
  children?: string[];
  meta?: Record<string, any>;
}

export interface HistoryCanvasOperation extends Omit<CanvasOperation, 'action' | 'element'> {
  action: CanvasOperation['action'] | 'highlight_route' | 'zoom_map' | 'show_timeline';
  element?: Partial<HistoryCanvasElement>;
  route?: RouteData;
  zoom?: ZoomData;
}

export * from './MapPrimitives';
export * from './TimelinePrimitives';
export * from './FigurePrimitives';
export * from './EventPrimitives';
