export interface ResolvedLessonIdentifier {
  chapterId: string;
  sectionId: string;
  lessonId: string;
}

const CHAPTER_PATTERN = /^ch\d{2}$/;
const LESSON_PATTERN = /^(ch\d{2})_(s\d{2})$/;

export function resolveLessonIdentifier(raw: string): ResolvedLessonIdentifier {
  const value = raw.trim().toLowerCase();
  const lessonMatch = value.match(LESSON_PATTERN);

  if (lessonMatch) {
    const chapterId = lessonMatch[1];
    const sectionId = lessonMatch[2];
    return { chapterId, sectionId, lessonId: `${chapterId}_${sectionId}` };
  }

  if (CHAPTER_PATTERN.test(value)) {
    return { chapterId: value, sectionId: 's01', lessonId: `${value}_s01` };
  }

  throw new Error(`Invalid chapter/lesson identifier: "${raw}". Expected chNN or chNN_sNN.`);
}
