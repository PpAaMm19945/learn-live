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

/**
 * Pre-recorded demo: "Phonics — Middle Sounds" (English)
 * Teaches auditory discrimination with word cards and phonics highlights.
 */
const PHONICS_DEMO: DemoFrame[] = [
  { timestamp: 0, type: 'status', status: 'connecting' },
  { timestamp: 800, type: 'status', status: 'active' },
  { timestamp: 1200, type: 'transcript', text: "Hello! Today we're going to listen for sounds in the middle of words." },
  { timestamp: 2500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'title', type: 'text', x: 150, y: 20, content: 'Listening for Middle Sounds', height: 26, width: 500 } },
  ]},
  { timestamp: 3500, type: 'transcript', text: "Let's look at these three words." },
  { timestamp: 4000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'w1', type: 'word_card', x: 80, y: 100, width: 140, height: 72, content: 'bat', color: 'hsl(217, 89%, 61%)' } },
    { action: 'show', element: { id: 'w2', type: 'word_card', x: 260, y: 100, width: 140, height: 72, content: 'cat', color: 'hsl(217, 89%, 61%)' } },
    { action: 'show', element: { id: 'w3', type: 'word_card', x: 440, y: 100, width: 140, height: 72, content: 'bit', color: 'hsl(217, 89%, 61%)' } },
  ]},
  { timestamp: 5500, type: 'transcript', text: "Listen carefully: bat... cat... bit. Two have the same middle sound!" },
  { timestamp: 7000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'ph1', type: 'phonics_highlight', x: 80, y: 200, width: 160, content: 'b|*a|t', color: 'hsl(142, 71%, 45%)' } },
    { action: 'show', element: { id: 'ph2', type: 'phonics_highlight', x: 260, y: 200, width: 160, content: 'c|*a|t', color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 8000, type: 'transcript', text: "See? 'bat' and 'cat' both have the 'aaa' sound in the middle!" },
  { timestamp: 9500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'ph3', type: 'phonics_highlight', x: 440, y: 200, width: 160, content: 'b|*i|t', color: 'hsl(340, 82%, 52%)' } },
  ]},
  { timestamp: 10000, type: 'transcript', text: "But 'bit' has a different middle sound — 'iii'. That's the odd one out!" },
  { timestamp: 11500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'bubble', type: 'speech_bubble', x: 200, y: 310, width: 280, content: "🎉 'bit' sounds different!", color: 'hsl(25, 95%, 53%)' } },
  ]},
  { timestamp: 13000, type: 'transcript', text: "Great job! Can you try the next set of words?" },
  { timestamp: 14500, type: 'canvas_ops', ops: [{ action: 'clear' }] },
  { timestamp: 15000, type: 'status', status: 'ended' },
];

/**
 * Pre-recorded demo: "Sentence Building" (English — Composition)
 */
const SENTENCE_DEMO: DemoFrame[] = [
  { timestamp: 0, type: 'status', status: 'connecting' },
  { timestamp: 800, type: 'status', status: 'active' },
  { timestamp: 1200, type: 'transcript', text: "Let's build a sentence together!" },
  { timestamp: 2500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'title', type: 'text', x: 180, y: 20, content: 'Building a Sentence', height: 26, width: 400 } },
  ]},
  { timestamp: 3500, type: 'transcript', text: "Here are some words. Can you put them in order?" },
  { timestamp: 4000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'lt1', type: 'letter_tile', x: 300, y: 100, width: 80, height: 56, content: 'ran', color: 'hsl(25, 95%, 53%)' } },
    { action: 'show', element: { id: 'lt2', type: 'letter_tile', x: 100, y: 100, width: 80, height: 56, content: 'The', color: 'hsl(217, 89%, 61%)' } },
    { action: 'show', element: { id: 'lt3', type: 'letter_tile', x: 500, y: 100, width: 80, height: 56, content: 'fast', color: 'hsl(142, 71%, 45%)' } },
    { action: 'show', element: { id: 'lt4', type: 'letter_tile', x: 200, y: 100, width: 80, height: 56, content: 'dog', color: 'hsl(340, 82%, 52%)' } },
  ]},
  { timestamp: 6000, type: 'transcript', text: "The... dog... ran... fast! Let's see the full sentence." },
  { timestamp: 7000, type: 'canvas_ops', ops: [
    { action: 'clear' },
    { action: 'show', element: { id: 'sentence', type: 'sentence_strip', x: 80, y: 160, width: 480, height: 56, content: 'The dog ran fast.', color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 8500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'panel1', type: 'story_panel', x: 80, y: 250, width: 160, height: 130, content: 'Beginning', count: 1, color: 'hsl(217, 89%, 61%)' } },
    { action: 'show', element: { id: 'panel2', type: 'story_panel', x: 270, y: 250, width: 160, height: 130, content: 'Middle', count: 2, color: 'hsl(25, 95%, 53%)' } },
    { action: 'show', element: { id: 'panel3', type: 'story_panel', x: 460, y: 250, width: 160, height: 130, content: 'End', count: 3, color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 9500, type: 'transcript', text: "Every story has a beginning, middle, and end. Can you tell a story about the dog?" },
  { timestamp: 11500, type: 'status', status: 'ended' },
];

/**
 * Pre-recorded demo: "Sensory Observation" (Science)
 * Guides observation of natural objects.
 */
const OBSERVATION_DEMO: DemoFrame[] = [
  { timestamp: 0, type: 'status', status: 'connecting' },
  { timestamp: 800, type: 'status', status: 'active' },
  { timestamp: 1200, type: 'transcript', text: "Today we're going to be scientists! Let's observe some objects closely." },
  { timestamp: 2500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'title', type: 'text', x: 160, y: 15, content: 'Science: Sensory Observation', height: 24, width: 500 } },
  ]},
  { timestamp: 3500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'obs1', type: 'observation_card', x: 60, y: 80, width: 200, content: '👀 What do you SEE?', color: 'hsl(217, 89%, 61%)' } },
    { action: 'show', element: { id: 'obs2', type: 'observation_card', x: 300, y: 80, width: 200, content: '🤚 What do you FEEL?', color: 'hsl(25, 95%, 53%)' } },
    { action: 'show', element: { id: 'obs3', type: 'observation_card', x: 540, y: 80, width: 200, content: '👃 What do you SMELL?', color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 4500, type: 'transcript', text: "Pick up the jackfruit. Use your senses — look, touch, and smell!" },
  { timestamp: 6000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'table', type: 'comparison_table', x: 140, y: 210, width: 400, height: 160, content: 'Jackfruit vs Stone', color: 'hsl(25, 95%, 53%)' } },
  ]},
  { timestamp: 7000, type: 'transcript', text: "Now let's compare! How is the jackfruit different from a stone?" },
  { timestamp: 9000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'bin1', type: 'classification_bin', x: 100, y: 400, width: 150, height: 160, content: 'Living', color: 'hsl(142, 71%, 45%)' } },
    { action: 'show', element: { id: 'bin2', type: 'classification_bin', x: 340, y: 400, width: 150, height: 160, content: 'Non-Living', color: 'hsl(0, 0%, 55%)' } },
  ]},
  { timestamp: 10000, type: 'transcript', text: "Where does the jackfruit go? Is it living or non-living? What about the stone?" },
  { timestamp: 12000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'bubble', type: 'speech_bubble', x: 200, y: 590, width: 300, content: 'Jackfruit comes from a living tree! 🌳', color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 13500, type: 'transcript', text: "That's right! Jackfruit grows on trees, so it comes from something living." },
  { timestamp: 15000, type: 'status', status: 'ended' },
];

/**
 * Pre-recorded demo: "Life Cycle" (Science)
 */
const LIFECYCLE_DEMO: DemoFrame[] = [
  { timestamp: 0, type: 'status', status: 'connecting' },
  { timestamp: 800, type: 'status', status: 'active' },
  { timestamp: 1200, type: 'transcript', text: "Let's learn about the life cycle of a butterfly!" },
  { timestamp: 2500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'title', type: 'text', x: 200, y: 15, content: 'Life Cycle of a Butterfly 🦋', height: 24, width: 400 } },
  ]},
  { timestamp: 3500, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'n1', type: 'life_cycle_node', x: 300, y: 60, width: 90, height: 90, content: 'Egg', count: 1, color: 'hsl(142, 71%, 45%)' } },
  ]},
  { timestamp: 4000, type: 'transcript', text: "First, the mother butterfly lays tiny eggs on a leaf." },
  { timestamp: 5000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'a1', type: 'curved_arrow', x: 400, y: 100, width: 60, height: 40, color: 'hsl(0, 0%, 60%)' } },
    { action: 'show', element: { id: 'n2', type: 'life_cycle_node', x: 470, y: 180, width: 90, height: 90, content: 'Caterpillar', count: 2, color: 'hsl(25, 95%, 53%)' } },
  ]},
  { timestamp: 5500, type: 'transcript', text: "The egg hatches into a caterpillar! It eats and eats and grows bigger." },
  { timestamp: 7000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'a2', type: 'curved_arrow', x: 440, y: 280, width: 60, height: 40, color: 'hsl(0, 0%, 60%)' } },
    { action: 'show', element: { id: 'n3', type: 'life_cycle_node', x: 300, y: 340, width: 90, height: 90, content: 'Chrysalis', count: 3, color: 'hsl(262, 83%, 58%)' } },
  ]},
  { timestamp: 7500, type: 'transcript', text: "Then it wraps itself in a chrysalis. Inside, something amazing happens!" },
  { timestamp: 9000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'a3', type: 'curved_arrow', x: 220, y: 360, width: 60, height: 40, color: 'hsl(0, 0%, 60%)' } },
    { action: 'show', element: { id: 'n4', type: 'life_cycle_node', x: 130, y: 180, width: 90, height: 90, content: 'Butterfly', count: 4, color: 'hsl(340, 82%, 52%)' } },
  ]},
  { timestamp: 9500, type: 'transcript', text: "A beautiful butterfly comes out! And then it starts the cycle all over again." },
  { timestamp: 11000, type: 'canvas_ops', ops: [
    { action: 'show', element: { id: 'a4', type: 'curved_arrow', x: 210, y: 120, width: 60, height: 40, color: 'hsl(0, 0%, 60%)' } },
  ]},
  { timestamp: 12000, type: 'transcript', text: "Egg, caterpillar, chrysalis, butterfly — and then eggs again! That's a life cycle." },
  { timestamp: 14000, type: 'status', status: 'ended' },
];

/** Available demo recordings */
const DEMO_LIBRARY: Record<string, DemoFrame[]> = {
  'addition': ADDITION_DEMO,
  // English demos
  'phonics': PHONICS_DEMO,
  'sentence': SENTENCE_DEMO,
  'auditory_discrimination': PHONICS_DEMO,
  'composition': SENTENCE_DEMO,
  // Science demos
  'observation': OBSERVATION_DEMO,
  'sensory_observation': OBSERVATION_DEMO,
  'life_cycle': LIFECYCLE_DEMO,
  'classification': OBSERVATION_DEMO,
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
