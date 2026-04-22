/**
 * Lesson progress write helpers.
 *
 * Posts to the worker's POST /api/progress endpoint to update
 * Learner_Progress so the Dashboard "Continue Lesson" picker
 * walks forward section-by-section as lessons are completed.
 *
 * Errors are swallowed quietly — a transient worker hiccup must
 * never block lesson navigation.
 */
import { Logger } from './Logger';

const WORKER_URL =
  import.meta.env.VITE_WORKER_URL ||
  'https://learn-live.antmwes104-1.workers.dev';

type ProgressStatus = 'in_progress' | 'completed';

async function postProgress(lessonId: string, status: ProgressStatus): Promise<void> {
  if (!lessonId) return;
  try {
    const res = await fetch(`${WORKER_URL}/api/progress`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, status }),
    });
    if (!res.ok) {
      Logger.warn(`[lessonProgress] ${status} write failed: ${res.status}`);
    }
  } catch (err) {
    Logger.warn(`[lessonProgress] ${status} write error`, err as any);
  }
}

/** Convert a /play/:chapterId param into the canonical lesson id. */
export function lessonIdFromChapterParam(chapterId: string | undefined | null): string {
  if (!chapterId) return '';
  return chapterId.startsWith('lesson_') ? chapterId : `lesson_${chapterId}`;
}

export function markLessonStarted(lessonId: string): Promise<void> {
  return postProgress(lessonId, 'in_progress');
}

export function markLessonCompleted(lessonId: string): Promise<void> {
  return postProgress(lessonId, 'completed');
}
