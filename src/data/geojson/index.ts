import ch01Regions from './ch01_regions.json';
import ch01Routes from './ch01_routes.json';
import ch01Markers from './ch01_markers.json';
import ch06Regions from './ch06_regions.json';
import ch06Routes from './ch06_routes.json';
import ch06Markers from './ch06_markers.json';
import ch07Regions from './ch07_regions.json';
import ch07Routes from './ch07_routes.json';
import ch07Markers from './ch07_markers.json';
import ch08Regions from './ch08_regions.json';
import ch08Routes from './ch08_routes.json';
import ch08Markers from './ch08_markers.json';
import ch09Regions from './ch09_regions.json';
import ch09Routes from './ch09_routes.json';
import ch09Markers from './ch09_markers.json';

import ch02Regions from './ch02_regions.json';
import ch02Routes from './ch02_routes.json';
import ch02Markers from './ch02_markers.json';

import ch03Regions from './ch03_regions.json';
import ch03Routes from './ch03_routes.json';
import ch03Markers from './ch03_markers.json';

import ch04Regions from './ch04_regions.json';
import ch04Routes from './ch04_routes.json';
import ch04Markers from './ch04_markers.json';

import ch05Regions from './ch05_regions.json';
import ch05Routes from './ch05_routes.json';
import ch05Markers from './ch05_markers.json';

export function getChapterGeoJSON(chapter: number) {
  switch (chapter) {
    case 1: return { regions: ch01Regions, routes: ch01Routes, markers: ch01Markers };
    case 2: return { regions: ch02Regions, routes: ch02Routes, markers: ch02Markers };
    case 3: return { regions: ch03Regions, routes: ch03Routes, markers: ch03Markers };
    case 4: return { regions: ch04Regions, routes: ch04Routes, markers: ch04Markers };
    case 5: return { regions: ch05Regions, routes: ch05Routes, markers: ch05Markers };
    case 6: return { regions: ch06Regions, routes: ch06Routes, markers: ch06Markers };
    case 7: return { regions: ch07Regions, routes: ch07Routes, markers: ch07Markers };
    case 8: return { regions: ch08Regions, routes: ch08Routes, markers: ch08Markers };
    case 9: return { regions: ch09Regions, routes: ch09Routes, markers: ch09Markers };
    default: return null;
  }
}
