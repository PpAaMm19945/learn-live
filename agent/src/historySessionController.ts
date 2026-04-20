import { getBandProfile } from './bandConfig';

export type SessionPhase = 'IDLE' | 'AWAITING_GATEKEEPER_GREENLIGHT' | 'PERFORMER' | 'NEGOTIATOR' | 'COMPLETE';

export interface HistorySessionControlState {
  isQAActive: boolean;
  isClosed: boolean;
  lessonPausedByQA: boolean;
  phase: SessionPhase;
  needsScaffolding: boolean;
}

export class HistorySessionController {
  private state: HistorySessionControlState = {
    isQAActive: false,
    isClosed: false,
    lessonPausedByQA: false,
    phase: 'IDLE',
    needsScaffolding: false,
  };

  constructor(private readonly band: number) {}

  snapshot(): HistorySessionControlState {
    return { ...this.state };
  }

  setPhase(phase: SessionPhase): void {
    this.state.phase = phase;
  }

  canStartPerformer(): boolean {
    if (this.state.isClosed) return false;
    if (this.band <= 1) return true;
    return this.state.phase === 'AWAITING_GATEKEEPER_GREENLIGHT';
  }

  canAcceptRaiseHand(): { accepted: boolean; reason?: string } {
    if (this.state.isClosed) {
      return { accepted: false, reason: 'session_closed' };
    }

    if (this.state.phase !== 'PERFORMER') {
      return { accepted: false, reason: 'not_in_performer_slice' };
    }

    const profile = getBandProfile(this.band);
    if (profile.interactivity.raiseHand === 'disabled') {
      return { accepted: false, reason: 'band_restricted' };
    }

    if (this.state.isQAActive) {
      return { accepted: false, reason: 'qa_already_active' };
    }

    this.state.isQAActive = true;
    this.state.lessonPausedByQA = true;
    return { accepted: true };
  }

  completeQA(): { shouldResumeLesson: boolean } {
    const shouldResumeLesson = this.state.lessonPausedByQA;
    this.state.isQAActive = false;
    this.state.lessonPausedByQA = false;
    return { shouldResumeLesson };
  }

  forcePause(): void {
    if (!this.state.isClosed) {
      this.state.lessonPausedByQA = false;
    }
  }

  close(): void {
    this.state.isClosed = true;
    this.state.isQAActive = false;
    this.state.lessonPausedByQA = false;
    this.state.phase = 'COMPLETE';
  }

  setNeedsScaffolding(active: boolean): void {
    this.state.needsScaffolding = active;
  }
}
