export interface HistorySessionParams {
  chapterId: string;
  sectionId: string;
  familyId: string;
  learnerId: string;
  band: number;
  canonicalLessonId: string;
  /** Opaque token sent by the client on reconnect for deterministic session resume. */
  resumeToken?: string;
}

export class HistorySessionParamError extends Error {
  constructor(public readonly code: 'MISSING_PARAM' | 'INVALID_FORMAT' | 'INVALID_BAND', message: string) {
    super(message);
  }
}

const CHAPTER_PATTERN = /^ch\d{2}$/;
const SECTION_PATTERN = /^s\d{2}$/;

function normalizeBand(rawBand: string | null): number {
  if (!rawBand) {
    throw new HistorySessionParamError('MISSING_PARAM', 'Missing required query parameter: band');
  }

  const parsed = Number.parseInt(rawBand, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 6) {
    throw new HistorySessionParamError('INVALID_BAND', `Invalid band value: "${rawBand}". Expected integer 0-6.`);
  }
  return parsed;
}

function parseLessonId(rawLessonId: string): { chapterId: string; sectionId: string } {
  const normalized = rawLessonId.trim().toLowerCase();
  const withSection = normalized.match(/^(ch\d{2})_(s\d{2})$/);
  if (withSection) {
    return { chapterId: withSection[1], sectionId: withSection[2] };
  }

  if (CHAPTER_PATTERN.test(normalized)) {
    return { chapterId: normalized, sectionId: 's01' };
  }

  throw new HistorySessionParamError(
    'INVALID_FORMAT',
    `Invalid lesson identifier: "${rawLessonId}". Expected chapterId=chNN and optional sectionId=sNN, or lessonId=chNN_sNN.`
  );
}

export function resolveHistorySessionParams(searchParams: URLSearchParams): HistorySessionParams {
  const familyId = searchParams.get('familyId') || searchParams.get('family');
  const learnerId = searchParams.get('learnerId') || searchParams.get('learner');
  const band = normalizeBand(searchParams.get('band'));
  const resumeToken = searchParams.get('resumeToken') || undefined;

  if (!familyId) {
    throw new HistorySessionParamError('MISSING_PARAM', 'Missing required query parameter: familyId (or family).');
  }

  if (!learnerId) {
    throw new HistorySessionParamError('MISSING_PARAM', 'Missing required query parameter: learnerId (or learner).');
  }

  const explicitChapterId = searchParams.get('chapterId') || searchParams.get('chapter');
  const explicitSectionId = searchParams.get('sectionId') || searchParams.get('section');

  if (explicitChapterId && explicitSectionId) {
    const chapterId = explicitChapterId.trim().toLowerCase();
    const sectionId = explicitSectionId.trim().toLowerCase();
    if (!CHAPTER_PATTERN.test(chapterId) || !SECTION_PATTERN.test(sectionId)) {
      throw new HistorySessionParamError(
        'INVALID_FORMAT',
        `Invalid chapterId/sectionId pair: chapterId="${explicitChapterId}", sectionId="${explicitSectionId}". Expected chapterId=chNN and sectionId=sNN.`
      );
    }

    return {
      chapterId,
      sectionId,
      familyId,
      learnerId,
      band,
      canonicalLessonId: `${chapterId}_${sectionId}`,
      resumeToken
    };
  }

  const lessonId =
    searchParams.get('lessonId') ||
    searchParams.get('lesson') ||
    searchParams.get('chapter') ||
    searchParams.get('chapterId');

  if (!lessonId) {
    throw new HistorySessionParamError(
      'MISSING_PARAM',
      'Missing lesson identifier. Provide chapterId+sectionId or lessonId=chNN_sNN (chapter-only chNN is accepted as s01).'
    );
  }

  const { chapterId, sectionId } = parseLessonId(lessonId);
  return {
    chapterId,
    sectionId,
    familyId,
    learnerId,
    band,
    canonicalLessonId: `${chapterId}_${sectionId}`,
    resumeToken
  };
}
