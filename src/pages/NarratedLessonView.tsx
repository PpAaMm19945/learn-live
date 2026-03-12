import { useState, useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, AlertCircle, Settings, User } from 'lucide-react';
import { BandSelector } from '@/components/content/BandSelector';
import { useAuthStore } from '@/lib/auth';
import { HistoryCanvas, CanvasElement } from '@/components/canvas/HistoryCanvas';
import { PlaybackControls } from '@/components/canvas/PlaybackControls';
import { TranscriptBar } from '@/components/canvas/TranscriptBar';
import { Logger } from '@/lib/Logger';

interface LessonBasicInfo {
    id: string;
    topic_id: string;
    title: string;
}

interface CanvasState {
    elements: Map<string, CanvasElement>;
    baseMap: string | null;
    isPlaying: boolean;
    currentSpeed: number;
    transcript: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sceneContext?: any;
}

type CanvasAction =
    | { type: 'SET_BASE_MAP'; payload: string }
    | { type: 'SHOW_ELEMENT'; payload: CanvasElement }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'ANIMATE_ELEMENT'; payload: { elementId: string; animation: any } }
    | { type: 'REMOVE_ELEMENT'; payload: string }
    | { type: 'CLEAR_CANVAS' }
    | { type: 'TOGGLE_PLAY' }
    | { type: 'SET_SPEED'; payload: number }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: 'UPDATE_TRANSCRIPT'; payload: { text: string; context?: any } }
    | { type: 'HIGHLIGHT_ROUTE'; payload: any }
    | { type: 'ZOOM_MAP'; payload: any };

const initialCanvasState: CanvasState = {
    elements: new Map(),
    baseMap: null,
    isPlaying: false,
    currentSpeed: 1,
    transcript: '',
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
    switch (action.type) {
        case 'SET_BASE_MAP':
            return { ...state, baseMap: action.payload };
        case 'SHOW_ELEMENT': {
            const showElements = new Map(state.elements);
            showElements.set(action.payload.id, action.payload);
            return { ...state, elements: showElements };
        }
        case 'ANIMATE_ELEMENT': {
            const animateElements = new Map(state.elements);
            const elToAnimate = animateElements.get(action.payload.elementId);
            if (elToAnimate) {
                // Update element properties based on animation
                const updatedEl = { ...elToAnimate, ...action.payload.animation };
                animateElements.set(action.payload.elementId, updatedEl);
            }
            return { ...state, elements: animateElements };
        }
        case 'REMOVE_ELEMENT': {
            const removeElements = new Map(state.elements);
            removeElements.delete(action.payload);
            return { ...state, elements: removeElements };
        }
        case 'CLEAR_CANVAS':
            return { ...state, elements: new Map() };
        case 'TOGGLE_PLAY':
            return { ...state, isPlaying: !state.isPlaying };
        case 'SET_SPEED':
            return { ...state, currentSpeed: action.payload };
        case 'UPDATE_TRANSCRIPT':
            return { ...state, transcript: action.payload.text, sceneContext: action.payload.context };
        case 'HIGHLIGHT_ROUTE': {
            const elements = new Map(state.elements);
            const routeId = `route_${Date.now()}`;
            elements.set(routeId, {
                id: routeId,
                type: 'highlight_route',
                from: action.payload.route.from,
                to: action.payload.route.to,
                style: action.payload.route.style,
                color: action.payload.route.color,
            });
            return { ...state, elements };
        }
        case 'ZOOM_MAP': {
            const elements = new Map(state.elements);
            // Replace any existing zoom ops
            for (const [key, val] of elements.entries()) {
                if (val.type === 'zoom_map') elements.delete(key);
            }
            elements.set('active_zoom', {
                id: 'active_zoom',
                type: 'zoom_map',
                x: action.payload.zoom.center[0],
                y: action.payload.zoom.center[1],
                scale: action.payload.zoom.level,
                opacity: action.payload.zoom.duration, // Reusing opacity prop for duration
            });
            return { ...state, elements };
        }
        default:
            return state;
    }
}

export default function NarratedLessonView() {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const { userId } = useAuthStore();
    const [currentBand, setCurrentBand] = useState<number>(0);
    const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

    // Fetch basic lesson info (title, topic_id for navigation)
    const { data: lesson, isLoading: isLessonLoading, isError } = useQuery<LessonBasicInfo>({
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

    // Fetch map assets
    useEffect(() => {
        if (!lessonId) return;

        const fetchMapAssets = async () => {
            try {
                const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
                const res = await fetch(`${apiUrl}/api/lessons/${lessonId}/map-assets`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.baseMapUrl) {
                        dispatch({ type: 'SET_BASE_MAP', payload: data.baseMapUrl });
                    }
                }
            } catch (error) {
                Logger.error('[NARRATED_VIEW]', 'Failed to fetch map assets', error);
            }
        };

        fetchMapAssets();
    }, [lessonId]);

    // Mock WebSocket connection
    useEffect(() => {
        if (!lessonId) return;

        // In a real scenario, we would establish the WS connection here using ExplainerClient
        Logger.info('[NARRATED_VIEW]', `Simulating WS connection for lesson ${lessonId}, band ${currentBand}`);

        // Mock a few operations to demonstrate UI integration
        const timeout1 = setTimeout(() => {
            dispatch({ type: 'UPDATE_TRANSCRIPT', payload: { text: "Long ago, people began moving across the continent...", context: { era: 'Ancient Times', location: 'Nile Valley' } } });
        }, 2000);

        const timeout2 = setTimeout(() => {
            dispatch({
                type: 'SHOW_ELEMENT', payload: {
                    id: "route_1",
                    type: "map_overlay",
                    regionId: "nile_valley",
                    fillColor: "rgba(59, 130, 246, 0.4)",
                    label: "Nile Valley",
                    opacity: 0.6,
                }
            });
        }, 3000);

        const timeout3 = setTimeout(() => {
            dispatch({ type: 'UPDATE_TRANSCRIPT', payload: { text: "As they settled, great civilizations emerged." } });
        }, 6000);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [lessonId, currentBand]);

    const handlePlayToggle = () => dispatch({ type: 'TOGGLE_PLAY' });
    const handleSpeedChange = (speed: number) => dispatch({ type: 'SET_SPEED', payload: speed });

    if (isLessonLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !lesson) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Failed to load lesson for narration</h2>
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center px-4 py-3 justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/lessons/${lessonId}`)}
                            className="mr-2 hover:bg-muted"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Lesson
                        </Button>
                        <h1 className="text-sm font-semibold truncate hidden sm:block max-w-[200px] lg:max-w-md">{lesson.title}</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="w-48 sm:w-auto">
                            <BandSelector onBandChange={setCurrentBand} className="pb-0" />
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                            <Button variant="ghost" size="icon" className="hover:text-foreground">
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:text-foreground">
                                <User className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-6 space-y-6">

                {/* Canvas Area */}
                <div className="w-full flex-1 min-h-[50vh] flex items-center justify-center bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                    <HistoryCanvas
                        elements={Array.from(state.elements.values())}
                        baseMapUrl={state.baseMap}
                        width={1200}
                        height={675}
                    />
                </div>

                {/* Bottom Controls */}
                <div className="w-full max-w-4xl mx-auto space-y-4">
                    <PlaybackControls
                        isPlaying={state.isPlaying}
                        onToggle={handlePlayToggle}
                        speed={state.currentSpeed}
                        onSpeedChange={handleSpeedChange}
                        band={currentBand}
                    />

                    <TranscriptBar
                        text={state.transcript}
                        sceneContext={state.sceneContext}
                    />
                </div>
            </main>
        </div>
    );
}
