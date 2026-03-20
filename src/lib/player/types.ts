export interface LessonScript {
  version: '1.0';
  chapterId: string;
  band: number;
  title: string;
  estimatedDurationMs: number;
  pronunciationOverrides: Record<string, string>;
  cues: Cue[];
}

export type Cue =
  | SpeakCue
  | ShowComponentCue
  | HideComponentCue
  | PanMapCue
  | AnimateRouteCue
  | PauseCue;

export interface SpeakCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'speak';
  params: SpeakParams;
}

export interface ShowComponentCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'show_component';
  params: ShowComponentParams;
}

export interface HideComponentCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'hide_component';
  params: HideComponentParams;
}

export interface PanMapCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'pan_map';
  params: PanMapParams;
}

export interface AnimateRouteCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'animate_route';
  params: AnimateRouteParams;
}

export interface PauseCue {
  id: string;
  timestampMs: number;
  durationMs: number;
  action: 'pause_for_response';
  params: PauseParams;
}

export interface SpeakParams {
  text: string;
  audioFileId: string;
  ssml?: string;
}

export interface ShowComponentParams {
  componentType: 'map' | 'scene_image' | 'genealogy_tree' | 'dual_timeline' | 'scripture_card' | 'portrait_card' | 'definition_card' | 'comparison_view';
  componentId: string;
  data: Record<string, any>;
  transition: 'fade' | 'slide_up' | 'none';
}

export interface HideComponentParams {
  componentId: string;
  transition: 'fade' | 'slide_down' | 'none';
}

export interface PanMapParams {
  targetRegion: string;
  zoomLevel: number;
  durationMs: number;
}

export interface AnimateRouteParams {
  routeId: string;
  durationMs: number;
  style: 'dotted' | 'solid' | 'arrow';
}

export interface PauseParams {
  promptText: string;
  maxWaitMs: number;
  expectedResponseType: 'voice' | 'tap' | 'any';
}

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
