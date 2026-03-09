/**
 * Demo Mode — Task 13.8
 * Recorded WebSocket replay as fallback when live API is unavailable.
 *
 * Plays back a pre-recorded sequence of canvas ops and audio at realistic timing.
 * Used for:
 *   - Hackathon judging demos when live API might be down
 *   - Onboarding walkthroughs
 *   - Testing without API costs
 */

import { CanvasOperation, ExplainerStatus } from './explainerClient';
import { Logger } from './Logger';

interface DemoFrame {
  /** Milliseconds from session start */
  timestamp: number;
  /** Type of event */
  type: 'canvas_ops' | 'transcript' | 'status';
  /** Canvas operations for this frame */
  ops?: CanvasOperation[];
  /** Transcript text */
  text?: string;
  /** Status change */
  status?: ExplainerStatus;
}

/**
 * Pre-recorded demo: "Addition with Counting Blocks"
 * Shows 3 + 2 = 5 using blocks on the canvas.
 */
const ADDITION_DEMO: DemoFrame[] = [
  { timestamp: 0, type: 'status', status: 'connecting' },
  { timestamp: 800, type: 'status', status: 'active' },
  { timestamp: 1200, type: 'transcript', text: "Hello! Today we're going to learn about addition." },
  { timestamp: 2000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'title', type: 'text', x: 200, y: 30, content: 'Addition: Putting Groups Together', height: 28, width: 500 } },
  ]},
  { timestamp: 3500, type: 'transcript', text: "Let's start with 3 mangoes." },
  { timestamp: 4000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'b1', type: 'block', x: 100, y: 150, width: 64, height: 64, content: '🥭', color: 'hsl(35, 92%, 50%)' } },
    { action: 'show', element: { id: 'b2', type: 'block', x: 180, y: 150, width: 64, height: 64, content: '🥭', color: 'hsl(35, 92%, 50%)' } },
    { action: 'show', element: { id: 'b3', type: 'block', x: 260, y: 150, width: 64, height: 64, content: '🥭', color: 'hsl(35, 92%, 50%)' } },
  ]},
  { timestamp: 5000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'label1', type: 'text', x: 160, y: 230, content: '3', height: 36, width: 60 } },
  ]},
  { timestamp: 6000, type: 'transcript', text: "Now, let's add 2 more mangoes." },
  { timestamp: 6500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'plus', type: 'text', x: 340, y: 170, content: '+', height: 40, width: 40 } },
  ]},
  { timestamp: 7000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'b4', type: 'block', x: 400, y: 150, width: 64, height: 64, content: '🥭', color: 'hsl(142, 71%, 45%)' } },
    { action: 'show', element: { id: 'b5', type: 'block', x: 480, y: 150, width: 64, height: 64, content: '🥭', color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 7500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'label2', type: 'text', x: 430, y: 230, content: '2', height: 36, width: 60 } },
  ]},
  { timestamp: 8500, type: 'transcript', text: "How many mangoes do we have altogether? Let's count them!" },
  { timestamp: 9500, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b1', animation: { property: 'scale', to: 1.3, duration: 0.3 } },
  ]},
  { timestamp: 10000, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b1', animation: { property: 'scale', to: 1, duration: 0.3 } },
    { action: 'animate', elementId: 'b2', animation: { property: 'scale', to: 1.3, duration: 0.3 } },
  ]},
  { timestamp: 10500, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b2', animation: { property: 'scale', to: 1, duration: 0.3 } },
    { action: 'animate', elementId: 'b3', animation: { property: 'scale', to: 1.3, duration: 0.3 } },
  ]},
  { timestamp: 11000, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b3', animation: { property: 'scale', to: 1, duration: 0.3 } },
    { action: 'animate', elementId: 'b4', animation: { property: 'scale', to: 1.3, duration: 0.3 } },
  ]},
  { timestamp: 11500, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b4', animation: { property: 'scale', to: 1, duration: 0.3 } },
    { action: 'animate', elementId: 'b5', animation: { property: 'scale', to: 1.3, duration: 0.3 } },
  ]},
  { timestamp: 12000, type: 'canvas_ops', ops: [
    { action: 'animate', elementId: 'b5', animation: { property: 'scale', to: 1, duration: 0.3 } },
  ]},
  { timestamp: 12500, type: 'transcript', text: "That's right! 3 plus 2 equals 5!" },
  { timestamp: 13000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'equals', type: 'text', x: 560, y: 170, content: '=', height: 40, width: 40 } },
    { action: 'show', element: { id: 'result', type: 'text', x: 620, y: 155, content: '5', height: 56, width: 60 } },
  ]},
  { timestamp: 14500, type: 'transcript', text: "Well done! You can see that when we combine 3 and 2, we get 5." },
  { timestamp: 16000, type: 'canvas_ops', ops: [{ action: 'clear' }] },
  { timestamp: 16500, type: 'transcript', text: "Let's try another one! Can you show me 4 plus 1?" },
  { timestamp: 18000, type: 'status', status: 'ended' },
];

/** Available demo recordings */
const DEMO_LIBRARY: Record<string, DemoFrame[]> = {
  'addition': ADDITION_DEMO,
  'default': ADDITION_DEMO,
};

export class DemoPlayer {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private isPlaying = false;

  constructor(
    private callbacks: {
      onStatusChange: (status: ExplainerStatus) => void;
      onCanvasOps: (ops: CanvasOperation[]) => void;
      onTranscript: (text: string) => void;
    }
  ) {}

  /** Start playing a demo recording */
  play(demoId: string = 'default') {
    const frames = DEMO_LIBRARY[demoId] || DEMO_LIBRARY['default'];
    if (!frames) {
      Logger.error('[DEMO]', `Demo not found: ${demoId}`);
      return;
    }

    this.stop();
    this.isPlaying = true;
    Logger.info('[DEMO]', `Playing demo: ${demoId} (${frames.length} frames)`);

    for (const frame of frames) {
      const timer = setTimeout(() => {
        if (!this.isPlaying) return;

        switch (frame.type) {
          case 'canvas_ops':
            if (frame.ops) this.callbacks.onCanvasOps(frame.ops);
            break;
          case 'transcript':
            if (frame.text) this.callbacks.onTranscript(frame.text);
            break;
          case 'status':
            if (frame.status) this.callbacks.onStatusChange(frame.status);
            break;
        }
      }, frame.timestamp);
      this.timers.push(timer);
    }
  }

  /** Stop playback */
  stop() {
    this.isPlaying = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  /** Check if currently playing */
  get playing(): boolean {
    return this.isPlaying;
  }
}
