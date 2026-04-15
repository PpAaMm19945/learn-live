// ── Comprehension Tracker ───────────────────────────────────────────
// Tracks student responses to comprehension checks within a session.
// Exposes a scaffolding flag when performance drops, allowing the
// BeatSequencer to adapt delivery in real-time.

export interface ComprehensionScore {
  correct: number;
  total: number;
  pct: number;
}

interface AnswerRecord {
  questionId: string;
  correct: boolean;
  timestamp: number;
}

export class ComprehensionTracker {
  private answers: AnswerRecord[] = [];
  private scaffoldingThreshold = 0.5;
  private minQuestionsForScaffolding = 3;

  /**
   * Record a student's answer to a comprehension question.
   */
  recordAnswer(questionId: string, correct: boolean): void {
    this.answers.push({
      questionId,
      correct,
      timestamp: Date.now(),
    });

    const score = this.getScore();
    console.log(
      `[COMPREHENSION] Q: ${questionId} → ${correct ? '✓' : '✗'} | Running: ${score.correct}/${score.total} (${score.pct}%)`
    );

    if (this.needsScaffolding) {
      console.log(`[COMPREHENSION] ⚠ Scaffolding triggered — score ${score.pct}% < ${this.scaffoldingThreshold * 100}% threshold`);
    }
  }

  /**
   * Get current score summary.
   */
  getScore(): ComprehensionScore {
    const total = this.answers.length;
    const correct = this.answers.filter(a => a.correct).length;
    const pct = total === 0 ? 100 : Math.round((correct / total) * 100);
    return { correct, total, pct };
  }

  /**
   * Whether the student needs scaffolding (simpler narration, slower pacing).
   * Only activates after minimum number of questions answered.
   */
  get needsScaffolding(): boolean {
    if (this.answers.length < this.minQuestionsForScaffolding) return false;
    const score = this.getScore();
    return score.pct / 100 < this.scaffoldingThreshold;
  }

  /**
   * Additional inter-beat delay (ms) when scaffolding is active.
   */
  get scaffoldingDelay(): number {
    return this.needsScaffolding ? 200 : 0;
  }

  /**
   * Prompt suffix to append when scaffolding is active.
   */
  get scaffoldingPromptSuffix(): string {
    if (!this.needsScaffolding) return '';
    return '\n\nIMPORTANT: The student is struggling. Explain this more simply. Use shorter sentences, more concrete examples, and slower pacing. Repeat key ideas.';
  }

  /**
   * Build the session_score payload for WebSocket emission at session end.
   */
  buildSessionScoreMessage(): { type: 'session_score'; correct: number; total: number; pct: number } {
    const score = this.getScore();
    return {
      type: 'session_score',
      ...score,
    };
  }

  /**
   * Reset tracker for a new session.
   */
  reset(): void {
    this.answers = [];
  }
}
