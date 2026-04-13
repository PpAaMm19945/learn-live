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
  { r2Key: 'assets/maps/Map 001.png', primaryChapters: ['ch01'] },
  { r2Key: 'assets/maps/Map 002.png', primaryChapters: ['ch02'] },
  { r2Key: 'assets/maps/Map 003.png', primaryChapters: ['ch03'] },
  { r2Key: 'assets/maps/Map 004.png', primaryChapters: ['ch04'] },
  { r2Key: 'assets/maps/Map 005.png', primaryChapters: ['ch05'] },
  { r2Key: 'assets/maps/Map 006.png', primaryChapters: ['ch06'] },
  { r2Key: 'assets/maps/Map 007.png', primaryChapters: ['ch07'] },
  { r2Key: 'assets/maps/Map 008.png', primaryChapters: ['ch08'] },
  { r2Key: 'assets/maps/Map 009.png', primaryChapters: ['ch09'] },
  { r2Key: 'assets/maps/Map 010.png', primaryChapters: ['ch10'] },
  { r2Key: 'assets/maps/Map 011.png', primaryChapters: [] }, // overview fallback
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
