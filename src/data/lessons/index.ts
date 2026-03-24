/**
 * Dynamic lesson script loader.
 * Imports the raw generated JSON and adapts it to the LessonScript format.
 */
import { adaptRawScript } from '@/lib/player/adaptRawScript';
import type { LessonScript } from '@/lib/player/types';

const RAW_IMPORTS: Record<string, () => Promise<any>> = {
  'ch01_band3': () => import('./lesson_ch01_band3.json'),
  'ch02_band3': () => import('./lesson_ch02_band3.json'),
  'ch03_band3': () => import('./lesson_ch03_band3.json'),
  'ch04_band3': () => import('./lesson_ch04_band3.json'),
  'ch05_band3': () => import('./lesson_ch05_band3.json'),
  'ch06_band3': () => import('./lesson_ch06_band3.json'),
  'ch07_band3': () => import('./lesson_ch07_band3.json'),
  'ch08_band3': () => import('./lesson_ch08_band3.json'),
  'ch09_band3': () => import('./lesson_ch09_band3.json'),
};

export async function loadLessonScript(chapterId: string, band: number): Promise<LessonScript> {
  const key = `${chapterId}_band${band}`;
  const loader = RAW_IMPORTS[key];

  if (!loader) {
    throw new Error(`No lesson script found for ${key}`);
  }

  const raw = await loader();
  const data = raw.default || raw;
  return adaptRawScript(data, chapterId, band);
}
