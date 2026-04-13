/**
 * Frontend Map Registry — mirrors agent/src/mapRegistry.ts
 * Used to resolve the correct default map for each chapter on session start.
 */

import { r2Url } from './r2Assets';

interface MapEntry {
  r2Key: string;
  primaryChapters: string[];
}

const MAP_ENTRIES: MapEntry[] = [
  { r2Key: 'assets/maps/map_001_post_babel_dispersion.png', primaryChapters: ['ch01'] },
  { r2Key: 'assets/maps/map_002_ancient_egypt_overview.png', primaryChapters: ['ch02'] },
  { r2Key: 'assets/maps/map_004_north_africa_regional_overview.png', primaryChapters: ['ch03'] },
  { r2Key: 'assets/maps/map_015_meroe_red_sea_trade.png', primaryChapters: ['ch04'] },
  { r2Key: 'assets/maps/map_016_kaleb_expedition.png', primaryChapters: ['ch05'] },
  { r2Key: 'assets/maps/map_024_early_iron_age.png', primaryChapters: ['ch06'] },
  { r2Key: 'assets/maps/map_028_red_sea_world.png', primaryChapters: ['ch07'] },
  { r2Key: 'assets/maps/map_031_nilotic_migrations.png', primaryChapters: ['ch08'] },
  { r2Key: 'assets/maps/map_033_zagwe_dynasty.png', primaryChapters: ['ch09'] },
  { r2Key: 'assets/maps/map_027_zimbabwean_plateau.png', primaryChapters: ['ch10'] },
  { r2Key: 'assets/maps/map_001_post_babel_dispersion.png', primaryChapters: [] }, // overview fallback
];

/**
 * Get the R2 URL for the primary map of a given chapter.
 * Falls back to the overview map (Map 011) if no match.
 */
export function getChapterMapUrl(chapterId: string): string {
  const entry = MAP_ENTRIES.find(m => m.primaryChapters.includes(chapterId));
  const r2Key = entry ? entry.r2Key : MAP_ENTRIES[MAP_ENTRIES.length - 1].r2Key;
  return r2Url(r2Key);
}
