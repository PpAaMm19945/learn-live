import { describe, it, expect } from 'vitest';
import { resolveLessonIdentifier } from '@/lib/session/sessionParams';
import { resolveHistorySessionParams, HistorySessionParamError } from '../../agent/src/historySessionContract';
import { HistorySessionController } from '../../agent/src/historySessionController';

describe('lesson/session identifier parsing', () => {
  it('normalizes chapter-only identifiers to section s01', () => {
    expect(resolveLessonIdentifier('ch01')).toEqual({
      chapterId: 'ch01',
      sectionId: 's01',
      lessonId: 'ch01_s01'
    });
  });

  it('preserves explicit chapter+section identifiers', () => {
    expect(resolveLessonIdentifier('ch09_s03')).toEqual({
      chapterId: 'ch09',
      sectionId: 's03',
      lessonId: 'ch09_s03'
    });
  });

  it('rejects malformed identifiers', () => {
    expect(() => resolveLessonIdentifier('chapter-1')).toThrowError(/Invalid chapter\/lesson identifier/);
  });

  it('resolves canonical history session params with backward-compat chapter field', () => {
    const params = resolveHistorySessionParams(new URLSearchParams({
      chapter: 'ch02',
      family: 'fam_1',
      learner: 'learner_1',
      band: '4'
    }));

    expect(params).toMatchObject({
      chapterId: 'ch02',
      sectionId: 's01',
      canonicalLessonId: 'ch02_s01'
    });
  });

  it('throws explicit malformed parameter errors', () => {
    expect(() => resolveHistorySessionParams(new URLSearchParams({
      chapterId: 'bad',
      sectionId: 's01',
      familyId: 'fam_1',
      learnerId: 'learner_1',
      band: '3'
    }))).toThrowError(HistorySessionParamError);
  });
});

describe('history session control flow', () => {
  it('accepts raise_hand during playback and guards duplicates', () => {
    const controller = new HistorySessionController(4);

    expect(controller.canAcceptRaiseHand()).toEqual({ accepted: true });
    expect(controller.canAcceptRaiseHand()).toEqual({ accepted: false, reason: 'qa_already_active' });

    const completion = controller.completeQA();
    expect(completion.shouldResumeLesson).toBe(true);
    expect(controller.snapshot().isQAActive).toBe(false);
  });

  it('enforces band restriction and keeps deterministic QA state', () => {
    const controller = new HistorySessionController(1);  // Band 1 has raiseHand: 'disabled'

    expect(controller.canAcceptRaiseHand()).toEqual({ accepted: false, reason: 'band_restricted' });
    expect(controller.snapshot().isQAActive).toBe(false);

    const completion = controller.completeQA();
    expect(completion.shouldResumeLesson).toBe(false);
  });

  it('clears QA/pause state on close', () => {
    const controller = new HistorySessionController(5);
    controller.canAcceptRaiseHand();
    controller.close();

    expect(controller.snapshot()).toEqual({
      isQAActive: false,
      isClosed: true,
      lessonPausedByQA: false
    });
  });
});
