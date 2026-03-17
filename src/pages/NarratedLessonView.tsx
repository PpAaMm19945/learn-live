import { useState, useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Settings, User } from 'lucide-react';
import { BandSelector } from '@/components/content/BandSelector';
import { HistoryCanvas, CanvasElement } from '@/components/canvas/HistoryCanvas';
import { PlaybackControls } from '@/components/canvas/PlaybackControls';
import { TranscriptBar } from '@/components/canvas/TranscriptBar';
import { Logger } from '@/lib/Logger';

// ------------------------------------------------------------------
// Canvas State & Reducer
// ------------------------------------------------------------------

export interface CanvasState {
  elements: Map<string, CanvasElement>;
  baseMap: string | null;
}

type CanvasAction =
  | { type: 'SHOW_ELEMENT'; payload: CanvasElement }
  | { type: 'ANIMATE_ELEMENT'; payload: { id: string; updates: Partial<CanvasElement> } }
  | { type: 'REMOVE_ELEMENT'; payload: { id: string } }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'SET_BASE_MAP'; payload: { url: string | null } };

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'SHOW_ELEMENT': {
      const newElements = new Map(state.elements);
      newElements.set(action.payload.id, action.payload);
      return { ...state, elements: newElements };
    }
    case 'ANIMATE_ELEMENT': {
      const newElements = new Map(state.elements);
      const existing = newElements.get(action.payload.id);
      if (existing) {
        newElements.set(action.payload.id, { ...existing, ...action.payload.updates });
      }
      return { ...state, elements: newElements };
    }
    case 'REMOVE_ELEMENT': {
      const newElements = new Map(state.elements);
      newElements.delete(action.payload.id);
      return { ...state, elements: newElements };
    }
    case 'CLEAR_CANVAS': {
      return { ...state, elements: new Map() };
    }
    case 'SET_BASE_MAP': {
      return { ...state, baseMap: action.payload.url };
    }
    default:
      return state;
  }
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function NarratedLessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  // Basic View State
  const [currentBand, setCurrentBand] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(1);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [sceneContext, setSceneContext] = useState<{ era?: string; location?: string; figures?: string[] }>({});

  // Canvas State Management
  const [canvasState, dispatchCanvas] = useReducer(canvasReducer, {
    elements: new Map(),
    baseMap: null,
  });

  // Fetch basic lesson info (title, topic_id)
  const { data: lesson, isLoading: isLessonLoading } = useQuery({
    queryKey: ['lesson-basic', lessonId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/lessons/${lessonId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch lesson info');
      return res.json();
    },
    enabled: !!lessonId,
  });

  // ------------------------------------------------------------------
  // Mock WebSocket Connection / Agent Operations
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isPlaying) return;

    Logger.info('[NARRATOR]', 'Starting mock narration sequence');

    // Simulate arriving ops
    let timeoutId: NodeJS.Timeout;

    const sequence = async () => {
      // Seq 1: Load Map
      dispatchCanvas({ type: 'SET_BASE_MAP', payload: { url: 'https://placehold.co/1200x800/e2e8f0/475569?text=Base+Map' } });
      setTranscriptText("Welcome to our journey through history.");
      setSceneContext({ era: '3000 BC', location: 'Ancient Egypt' });

      // Seq 2: Show region
      timeoutId = setTimeout(() => {
        if (!isPlaying) return;
        setTranscriptText("Notice the fertile lands along the Nile River.");
        dispatchCanvas({
          type: 'SHOW_ELEMENT',
          payload: {
            id: 'nile-region',
            type: 'path',
            d: 'M 300 100 Q 350 300 400 600',
            stroke: '#3b82f6',
            strokeWidth: 8,
            fill: 'none',
          }
        });
      }, 3000 / currentSpeed);

      // Seq 3: Show figure
      timeoutId = setTimeout(() => {
        if (!isPlaying) return;
        setTranscriptText("Pharaoh Narmer unified Upper and Lower Egypt.");
        setSceneContext(prev => ({ ...prev, figures: ['Pharaoh Narmer'] }));
        dispatchCanvas({
          type: 'SHOW_ELEMENT',
          payload: {
            id: 'figure-narmer',
            type: 'circle',
            cx: 500,
            cy: 300,
            r: 40,
            fill: '#eab308',
            stroke: '#ca8a04',
            strokeWidth: 4,
          }
        });
        dispatchCanvas({
          type: 'SHOW_ELEMENT',
          payload: {
            id: 'figure-narmer-text',
            type: 'text',
            x: 500,
            y: 360,
            text: 'Narmer',
            fontSize: 16,
            fill: '#1e293b',
          }
        });
      }, 7000 / currentSpeed);
    };

    sequence();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPlaying, currentSpeed]);

  // Pause if band changes (simplifies sync logic for now)
  useEffect(() => {
    setIsPlaying(false);
    dispatchCanvas({ type: 'CLEAR_CANVAS' });
    setTranscriptText('');
  }, [currentBand]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background flex flex-col h-[100dvh] overflow-hidden">
      {/* Header */}


      {/* Main Content Area */}
      <main className="flex-grow flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 max-w-[1600px] mx-auto w-full min-h-0">

        {/* Canvas Area (Takes up most space, stacks above transcript on mobile) */}
        <div className="flex-grow min-h-0 relative rounded-lg border border-border shadow-sm bg-muted/20 overflow-hidden">
           <HistoryCanvas
             elements={Array.from(canvasState.elements.values())}
             baseMapUrl={canvasState.baseMap}
             width={1200}
             height={800}
           />
        </div>

        {/* Controls Area (Bottom) */}
        <div className="shrink-0 flex flex-col gap-2 sm:gap-3">
          <TranscriptBar
            text={transcriptText}
            sceneContext={sceneContext}
            className="h-[80px] sm:h-[100px] md:h-[120px]"
          />

          <PlaybackControls
            isPlaying={isPlaying}
            onToggle={() => setIsPlaying(!isPlaying)}
            speed={currentSpeed}
            onSpeedChange={setCurrentSpeed}
            band={currentBand}
          />
        </div>

      </main>
    </div>
  );
}
