import { WebSocket } from 'ws';
import { LiveConversationHandler } from './liveHandler';
import { buildGatekeeperPrompt } from './prompts/gatekeeper';
import { buildNegotiatorPrompt } from './prompts/negotiator';

export type SessionSlice = 'welcome' | 'gatekeeper' | 'performer' | 'negotiator' | 'complete';

export type LifecycleState =
  | 'IDLE'
  | 'GATEKEEPER'
  | 'AWAITING_GATEKEEPER_GREENLIGHT'
  | 'PERFORMER'
  | 'AWAITING_NEGOTIATOR_START'
  | 'NEGOTIATOR'
  | 'COMPLETE';

interface LifecycleConfig {
  ws: WebSocket;
  chapterId: string;
  chapterTitle: string;
  learnerName: string;
  band: number;
  priorChapterTitle?: string;
  needsScaffolding?: boolean;
}

export class SessionLifecycle {
  private state: LifecycleState = 'IDLE';
  private gatekeeper: LiveConversationHandler | null = null;
  private negotiator: LiveConversationHandler | null = null;

  constructor(private config: LifecycleConfig) {}

  setNeedsScaffolding(active: boolean): void {
    this.config.needsScaffolding = active;
  }

  getState(): LifecycleState {
    return this.state;
  }

  isLiveSliceActive(): boolean {
    return this.state === 'GATEKEEPER' || this.state === 'NEGOTIATOR';
  }

  currentSlice(): SessionSlice {
    if (this.state === 'GATEKEEPER' || this.state === 'AWAITING_GATEKEEPER_GREENLIGHT') return 'gatekeeper';
    if (this.state === 'PERFORMER' || this.state === 'AWAITING_NEGOTIATOR_START') return 'performer';
    if (this.state === 'NEGOTIATOR') return 'negotiator';
    if (this.state === 'COMPLETE') return 'complete';
    return 'welcome';
  }

  async startGatekeeper(): Promise<void> {
    this.state = 'GATEKEEPER';
    this.emitSliceChange('gatekeeper');

    const needsScaffolding = this.config.needsScaffolding === true;
    this.gatekeeper = new LiveConversationHandler(
      this.config.ws,
      'gatekeeper',
      buildGatekeeperPrompt({
        chapterId: this.config.chapterId,
        chapterTitle: this.config.chapterTitle,
        learnerName: this.config.learnerName,
        band: this.config.band,
        priorChapterTitle: this.config.priorChapterTitle,
        needsScaffolding,
      }),
      needsScaffolding ? 150_000 : 75_000,
      `Begin the warm-up for ${this.config.chapterTitle}. Ask what ${this.config.learnerName} already knows before the lesson starts.`
    );

    await this.gatekeeper.start();
    this.state = 'AWAITING_GATEKEEPER_GREENLIGHT';
  }

  completeGatekeeper(): void {
    if (this.state !== 'GATEKEEPER') return;
    this.gatekeeper?.complete();
    this.gatekeeper = null;
    this.state = 'AWAITING_GATEKEEPER_GREENLIGHT';
  }

  setAwaitingNegotiator(): void {
    this.state = 'AWAITING_NEGOTIATOR_START';
  }

  beginPerformer(): void {
    this.state = 'PERFORMER';
    this.emitSliceChange('performer');
  }

  async startNegotiator(beatSummaries: string[]): Promise<void> {
    if (this.state === 'COMPLETE') return;
    this.state = 'NEGOTIATOR';
    this.emitSliceChange('negotiator');

    const needsScaffolding = this.config.needsScaffolding === true;
    this.negotiator = new LiveConversationHandler(
      this.config.ws,
      'negotiator',
      buildNegotiatorPrompt({
        chapterId: this.config.chapterId,
        chapterTitle: this.config.chapterTitle,
        learnerName: this.config.learnerName,
        band: this.config.band,
        beatSummaries: beatSummaries.slice(-6),
        needsScaffolding,
      }),
      needsScaffolding ? 240_000 : 120_000,
      `Start a short reflection for ${this.config.learnerName}. Ask 1 to 2 open-ended synthesis questions based on the recent lesson moments.`
    );

    await this.negotiator.start();
    // After natural completion of the slice (via Gemini tool etc)
    this.completeNegotiator();
  }

  completeNegotiator(): void {
    if (this.state === 'COMPLETE') return;
    this.negotiator?.complete();
    this.negotiator = null;
    this.state = 'COMPLETE';
    this.emitSliceChange('complete');
    this.emit({ type: 'session_complete' });
  }

  forwardAudio(data: string): void {
    if (this.state === 'GATEKEEPER') {
      this.gatekeeper?.sendAudio(data);
    } else if (this.state === 'NEGOTIATOR') {
      this.negotiator?.sendAudio(data);
    }
  }

  getSliceTranscript(slice: 'gatekeeper' | 'negotiator'): string {
    if (slice === 'gatekeeper') return this.gatekeeper?.getTranscript() || '';
    return this.negotiator?.getTranscript() || '';
  }

  close(): void {
    this.gatekeeper?.complete();
    this.negotiator?.complete();
    this.gatekeeper = null;
    this.negotiator = null;
    this.state = 'COMPLETE';
  }

  private emitSliceChange(slice: Exclude<SessionSlice, 'welcome'>): void {
    this.emit({ type: 'slice_change', slice });
  }

  private emit(message: any): void {
    if (this.config.ws.readyState === WebSocket.OPEN) {
      this.config.ws.send(JSON.stringify(message));
    }
  }
}
