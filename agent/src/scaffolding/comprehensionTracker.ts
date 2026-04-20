export interface ScoreSignal {
  source: 'raise_hand' | 'gatekeeper' | 'negotiator' | 'manual';
  score: number;
  reason?: string;
  at: number;
}

export interface ScaffoldingTransition {
  active: boolean;
  reason: string;
  average: number;
}

const MIN_SCORES = 3;
const WINDOW_SIZE = 5;
const ENABLE_THRESHOLD = 0.5;
const DISABLE_THRESHOLD = 0.7;
const HYSTERESIS_THRESHOLD = 0.65;

/**
 * Session-level rolling comprehension tracker.
 * Uses hysteresis to avoid fast scaffold flapping.
 */
export class ComprehensionTracker {
  private readonly scores: ScoreSignal[] = [];
  private scaffoldingActive = false;

  push(signal: Omit<ScoreSignal, 'at'>): ScaffoldingTransition | null {
    const normalized = Math.max(0, Math.min(1, signal.score));
    this.scores.push({ ...signal, score: normalized, at: Date.now() });
    if (this.scores.length > WINDOW_SIZE) {
      this.scores.shift();
    }

    if (this.scores.length < MIN_SCORES) {
      return null;
    }

    const average = this.average;
    if (!this.scaffoldingActive && average < ENABLE_THRESHOLD) {
      this.scaffoldingActive = true;
      return {
        active: true,
        reason: signal.reason || `rolling average ${average.toFixed(2)} fell below ${ENABLE_THRESHOLD}`,
        average,
      };
    }

    if (this.scaffoldingActive && average > DISABLE_THRESHOLD && average > HYSTERESIS_THRESHOLD) {
      this.scaffoldingActive = false;
      return {
        active: false,
        reason: signal.reason || `rolling average ${average.toFixed(2)} rose above ${DISABLE_THRESHOLD}`,
        average,
      };
    }

    return null;
  }

  get average(): number {
    if (this.scores.length === 0) return 1;
    return this.scores.reduce((sum, item) => sum + item.score, 0) / this.scores.length;
  }

  get active(): boolean {
    return this.scaffoldingActive;
  }

  get scoreCount(): number {
    return this.scores.length;
  }

  buildSessionScoreMessage(): { type: 'session_score'; correct: number; total: number; pct: number } {
    const total = this.scores.length;
    const correct = this.scores.filter((s) => s.score >= 0.5).length;
    const pct = Math.round(this.average * 100);
    return { type: 'session_score', correct, total, pct };
  }
}

export async function scoreAnswer(
  question: string,
  answer: string,
  expectedConcepts: string[] = []
): Promise<number> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return heuristicScore(answer, expectedConcepts);
  }

  try {
    const prompt = [
      'Score the learner answer from 0.0 to 1.0 for conceptual correctness.',
      `Question: ${question}`,
      `Learner answer: ${answer}`,
      `Expected concepts: ${expectedConcepts.join(', ') || '(none provided)'}`,
      'Return only a JSON object like {"score":0.42}.',
    ].join('\n');

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 64 },
      }),
    });
    if (!response.ok) return heuristicScore(answer, expectedConcepts);
    const data = await response.json() as any;
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    const score = Number(parsed?.score);
    return Number.isFinite(score) ? Math.max(0, Math.min(1, score)) : heuristicScore(answer, expectedConcepts);
  } catch {
    return heuristicScore(answer, expectedConcepts);
  }
}

function heuristicScore(answer: string, expectedConcepts: string[]): number {
  const text = (answer || '').toLowerCase();
  if (!text.trim()) return 0;
  if (expectedConcepts.length === 0) return text.length > 40 ? 0.65 : 0.45;
  let hits = 0;
  for (const c of expectedConcepts) {
    if (text.includes(c.toLowerCase())) hits += 1;
  }
  return Math.max(0, Math.min(1, hits / expectedConcepts.length));
}
