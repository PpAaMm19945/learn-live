/**
 * Types for the live-first teaching session architecture.
 * Replaces the legacy LessonScript/Cue-based pipeline.
 */

/** The active visual mode the AI has selected */
export type SceneMode = 'transcript' | 'map' | 'image' | 'overlay';

/** A tool call received from the agent via WebSocket */
export interface AgentToolCall {
  type: 'tool_call';
  tool: string;
  args: Record<string, any>;
}

/** Transcript chunk streamed from the agent */
export interface TranscriptChunk {
  type: 'transcript';
  text: string;
  isFinal: boolean;
}

/** Audio data from the agent */
export interface AgentAudio {
  type: 'audio';
  data: string; // base64
}

/** Scene mode change from set_scene tool */
export interface SceneChange {
  mode: SceneMode;
  args?: Record<string, any>;
}

/** Combined message from the agent WebSocket */
export type AgentMessage = AgentToolCall | TranscriptChunk | AgentAudio | { type: 'modelTurn'; data?: any };

export interface RecordedEvent {
  timestamp: number;  // ms since session start
  message: AgentMessage;
}

export interface GoldenScript {
  version: '1.0';
  chapterId: string;
  band: number;
  recordedAt: string;  // ISO date
  durationMs: number;
  events: RecordedEvent[];
}

/** StorybookScript — kept for Band 0-1 */
export interface StorybookScript {
  version: '1.0';
  chapterId: string;
  band: 0 | 1;
  title: string;
  scenes: StorybookScene[];
}

export interface StorybookScene {
  id: string;
  imageUrl: string;
  altText: string;
  captionText: string;
  highlightedWords: string[];
  audioFileId: string;
}
