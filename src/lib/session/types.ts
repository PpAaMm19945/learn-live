/**
 * Types for the live-first teaching session architecture.
 * Replaces the legacy LessonScript/Cue-based pipeline.
 */

/** The active visual mode the AI has selected */
export type SceneMode = 'transcript' | 'map' | 'image' | 'overlay';
export type SessionSlice = 'welcome' | 'gatekeeper' | 'performer' | 'negotiator' | 'complete';

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

/** Model internal reasoning text streamed separately from spoken transcript */
export interface AgentThinking {
  type: 'thinking';
  text: string;
}

/** Scene mode change from set_scene tool */
export interface SceneChange {
  mode: SceneMode;
  args?: Record<string, any>;
}

/** A complete grouped beat payload from the Sequencer */
export interface BeatPayload {
  type: 'beat_payload';
  beatId: string;
  text: string;
  audioData: string; // base64
  toolCalls: AgentToolCall[];
  cooldownMs?: number;
}

/** Combined message from the agent WebSocket */
export type AgentMessage = 
  | AgentToolCall 
  | TranscriptChunk 
  | AgentAudio 
  | AgentThinking 
  | BeatPayload 
  | { type: 'modelTurn'; data?: any }
  | { type: 'qa_complete' }
  | { type: 'qa_started' }
  | { type: 'slice_change'; slice: SessionSlice }
  | { type: 'gatekeeper_complete' }
  | { type: 'negotiator_complete' }
  | { type: 'performer_complete' }
  | { type: 'live_slice_fallback'; slice: 'gatekeeper' | 'negotiator'; reason: string }
  | { type: 'live_slice_error'; slice: 'gatekeeper' | 'negotiator'; reason: string; message?: string }
  | { type: 'scaffolding_change'; active: boolean; reason?: string }
  | { type: 'session_complete' }
  | { type: 'lesson_complete' }
  | { type: 'error'; message: string; code?: string };

/** Messages sent from client to agent */
export type ClientMessage =
  | { type: 'audio'; data: string } // base64 PCM
  | { type: 'raise_hand' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'performer_drain_complete' }
  | { type: 'image'; data: string }; // base64 jpeg

export interface RecordedEvent {
  timestamp: number;
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
