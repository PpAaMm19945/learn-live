export interface HistorySessionControlState {
  isQAActive: boolean;
  isClosed: boolean;
  lessonPausedByQA: boolean;
}

export class HistorySessionController {
  private state: HistorySessionControlState = {
    isQAActive: false,
    isClosed: false,
    lessonPausedByQA: false
  };

  constructor(private readonly band: number) {}

  snapshot(): HistorySessionControlState {
    return { ...this.state };
  }

  canAcceptRaiseHand(): { accepted: boolean; reason?: string } {
    if (this.state.isClosed) {
      return { accepted: false, reason: 'session_closed' };
    }
    if (this.band < 3) {
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
  }
}
