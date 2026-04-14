/**
 * Frontend Map Registry — mirrors agent/src/mapRegistry.ts
 * Used to resolve the correct default map for each chapter on session start.
 * 
 * IMPORTANT: R2 keys use 'assets/maps/' prefix.
 * The resolveImageCandidates helper will try variants automatically.
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
  { r2Key: 'assets/maps/map_006_roman_north_africa.png', primaryChapters: ['ch05'] },
  { r2Key: 'assets/maps/map_007_roman_egypt.png', primaryChapters: ['ch06'] },
  { r2Key: 'assets/maps/map_008_aksum_red_sea_trade.png', primaryChapters: ['ch07'] },
  { r2Key: 'assets/maps/map_003_bantu_migration_biblical_model.png', primaryChapters: ['ch08'] },
  { r2Key: 'assets/maps/map_017_highland_monastic_centers_ethiopia.png', primaryChapters: ['ch09'] },
  { r2Key: 'assets/maps/map_022_trans_saharan_trade_routes.png', primaryChapters: ['ch10'] },
];

/**
 * Get the R2 URL for the primary map of a given chapter.
 * Falls back to map_001 if no match.
 */
export function getChapterMapUrl(chapterId: string): string {
  const entry = MAP_ENTRIES.find(m => m.primaryChapters.includes(chapterId));
  const r2Key = entry ? entry.r2Key : MAP_ENTRIES[0].r2Key;
  return r2Url(r2Key);
}
