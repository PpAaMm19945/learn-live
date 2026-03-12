/**
 * Audio-Canvas Sync Engine — Task 13.7
 *
 * Ensures canvas operations and audio narration are synchronized.
 * The agent emits atomic payloads: { narration (audio), canvas_ops }
 * The frontend holds canvas ops until the corresponding audio chunk starts playing.
 *
 * Flow:
 * 1. Agent sends { type: 'atomic', audio: base64, ops: CanvasOperation[], seqId: number }
 * 2. This engine queues the payload
 * 3. When audio starts playing, the canvas ops fire
 * 4. If audio is unavailable, ops fire immediately with a small delay
 */

import { CanvasOperation } from './explainerClient';
import { Logger } from '../lib/Logger';

interface SyncPayload {
  seqId: number;
  audio: string | null;   // base64 PCM audio, or null for silent ops
  ops: CanvasOperation[];
  timestamp: number;
}

type OpsCallback = (ops: CanvasOperation[]) => void;
type AudioPlayCallback = (base64: string) => Promise<void>;

export class AudioCanvasSync {
  private queue: SyncPayload[] = [];
  private isProcessing = false;
  private lastSeqId = -1;

  constructor(
    private onOps: OpsCallback,
    private onPlayAudio: AudioPlayCallback,
  ) {}

  /**
   * Enqueue an atomic payload from the agent.
   * Payloads are processed in seqId order.
   */
  enqueue(payload: SyncPayload) {
    // Insert in order
    const idx = this.queue.findIndex(p => p.seqId > payload.seqId);
    if (idx === -1) {
      this.queue.push(payload);
    } else {
      this.queue.splice(idx, 0, payload);
    }

    Logger.info('[SYNC]', `Enqueued payload seq=${payload.seqId}, ops=${payload.ops.length}, hasAudio=${!!payload.audio}`);
    this.processNext();
  }

  /**
   * Process the next payload in sequence.
   */
  private async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    const next = this.queue[0];
    // Only process if it's the next expected sequence
    if (next.seqId !== this.lastSeqId + 1 && this.lastSeqId >= 0) {
      // Out of order — wait for missing payload (with timeout)
      setTimeout(() => this.processNext(), 200);
      return;
    }

    this.isProcessing = true;
    this.queue.shift();
    this.lastSeqId = next.seqId;

    try {
      if (next.audio) {
        // Fire ops right when audio starts (sync point)
        const audioPromise = this.onPlayAudio(next.audio);
        // Small delay to let audio begin before visual changes
        await new Promise(resolve => setTimeout(resolve, 50));
        this.onOps(next.ops);
        await audioPromise;
      } else {
        // No audio — fire ops with a small stagger
        await new Promise(resolve => setTimeout(resolve, 100));
        this.onOps(next.ops);
      }
    } catch (err) {
      Logger.error('[SYNC]', 'Error processing payload', { err, seqId: next.seqId });
      // Still fire ops even if audio fails
      this.onOps(next.ops);
    }

    this.isProcessing = false;
    this.processNext();
  }

  /** Reset the sync engine */
  reset() {
    this.queue = [];
    this.isProcessing = false;
    this.lastSeqId = -1;
  }

  /** Get queue depth for debugging */
  get depth(): number {
    return this.queue.length;
  }
}
