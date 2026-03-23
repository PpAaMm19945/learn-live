import ch01Regions from './ch01_regions.json';
import ch01Routes from './ch01_routes.json';
import ch01Markers from './ch01_markers.json';

export function getChapterGeoJSON(chapter: number) {
  switch (chapter) {
    case 1: return { regions: ch01Regions, routes: ch01Routes, markers: ch01Markers };
    default: return null;
  }
}
