import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, PhoneOff, Play, Pause, Save, Hand, Bug, X } from 'lucide-react';
import { toast } from 'sonner';
import type { AgentToolCall, GoldenScript } from '@/lib/session/types';
import { TranscriptView } from './TranscriptView';
import { ThinkingBanner } from './ThinkingBanner';
import { DebugDrawer, createDebugEvent, type DebugEvent } from './DebugDrawer';
import { useSession } from '@/lib/session/useSession';
import { useRecorder } from '@/lib/session/useRecorder';
import { useGoldenScript } from '@/lib/session/useGoldenScript';
import { useLearnerStore } from '@/lib/learnerStore';
import { TeachingCanvas, type TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { handleToolCall } from '@/lib/canvas/toolCallHandler';
import { resolveImageUrl } from '@/lib/r2Assets';
import { getChapterMapUrl } from '@/lib/mapRegistry';
import { isToolAllowedForBand } from '@/lib/session/toolGate';
// ImageScene no longer used — images render as thumbnails
import { CanvasOverlays, type OverlayState, EMPTY_OVERLAYS } from '@/components/canvas/CanvasOverlays';
import { AutoScrollMap } from './AutoScrollMap';
import { mergeTimeline } from '@/data/chapterTimelines';
import { getClientBandProfile } from '@/lib/bandConfig.client';
import { WelcomeCover } from './WelcomeCover';

interface SessionCanvasProps {
  chapterId: string;
  band: number;
  learnerName: string;
  onExit: () => void;
}

/** "Small" overlay types that share the bottom-left card slot and get queued */
const SMALL_OVERLAY_TYPES = new Set(['scripture', 'timeline', 'keyTerm', 'question', 'quote']);

interface QueuedOverlay {
  type: keyof OverlayState;
  data: any;
  debugLabel: string;
}

export function SessionCanvas({ chapterId, band, learnerName: _learnerName, onExit }: SessionCanvasProps) {
  const { familyId, activeLearnerId } = useLearnerStore();
  const bandProfile = getClientBandProfile(band);
  const [raiseHandCooldown, setRaiseHandCooldown] = useState(false);
  const canvasRef = useRef<TeachingCanvasRef>(null);
  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const [overlays, setOverlays] = useState<OverlayState>(EMPTY_OVERLAYS);
  const [useFallback, setUseFallback] = useState(false);
  const [goldenScriptData, setGoldenScriptData] = useState<GoldenScript | null>(null);
  const fallbackCheckTimeoutRef = useRef<number | null>(null);
  const mapRevertTimerRef = useRef<number | null>(null);

  // Default visual is always the chapter map
  const [activeVisual, setActiveVisual] = useState<'map' | 'image' | 'maplibre'>('map');
  const [chapterMapUrl, setChapterMapUrl] = useState<string>('');

  // Welcome cover state
  const [showWelcomeCover, setShowWelcomeCover] = useState(true);

  // Image thumbnail state (corner display instead of full-bleed)
  const [thumbnailImage, setThumbnailImage] = useState<{ url: string; caption: string; timestamp?: number } | null>(null);
  const [thumbnailIsStale, setThumbnailIsStale] = useState(false);
  const thumbnailTimerRef = useRef<number | null>(null);

  // Overlay queue for small overlays
  const [overlayQueue, setOverlayQueue] = useState<QueuedOverlay[]>([]);
  const overlayQueueIndexRef = useRef(0);
  const overlayQueueTimerRef = useRef<number | null>(null);

  const [noResponseWarning, setNoResponseWarning] = useState(false);
  const [noResponseError, setNoResponseError] = useState(false);
  const noResponseWarningTimeoutRef = useRef<number | null>(null);
  const noResponseErrorTimeoutRef = useRef<number | null>(null);

  const { recordEvent, stop: stopRecording } = useRecorder({ chapterId, band, recording: !useFallback });
  const goldenScript = useGoldenScript(goldenScriptData);

  // Load chapter map on mount using the registry
  useEffect(() => {
    const url = getChapterMapUrl(chapterId);
    setChapterMapUrl(url);
  }, [chapterId]);

  // Auto-dismiss overlays after a duration (for large overlays only now)
  const overlayTimerRef = useRef<Record<string, number>>({});
  const scheduleAutoDismiss = useCallback((type: keyof OverlayState, durationMs: number = 8000) => {
    if (overlayTimerRef.current[type]) clearTimeout(overlayTimerRef.current[type]);
    overlayTimerRef.current[type] = window.setTimeout(() => {
      setOverlays(prev => ({ ...prev, [type]: null }));
    }, durationMs);
  }, []);

  // ── Overlay queue processor ──
  // When the queue changes, display items one at a time with 15s intervals
  useEffect(() => {
    if (overlayQueue.length === 0) return;

    const idx = overlayQueueIndexRef.current;
    if (idx >= overlayQueue.length) return; // queue exhausted

    // Show current item
    const item = overlayQueue[idx];
    setOverlays(prev => {
      // Clear all small overlay slots, then set the current one
      const cleared = { ...prev };
      SMALL_OVERLAY_TYPES.forEach(t => { (cleared as any)[t] = null; });
      return { ...cleared, [item.type]: item.data };
    });

    // Schedule next item after band-specific delay
    if (idx < overlayQueue.length - 1) {
      overlayQueueTimerRef.current = window.setTimeout(() => {
        overlayQueueIndexRef.current = idx + 1;
        // Trigger re-render by updating queue reference
        setOverlayQueue(q => [...q]);
      }, bandProfile.overlays.queueDelayMs);
    } else {
      // Last item — auto-dismiss
      overlayQueueTimerRef.current = window.setTimeout(() => {
        setOverlays(prev => {
          const cleared = { ...prev };
          SMALL_OVERLAY_TYPES.forEach(t => { (cleared as any)[t] = null; });
          return cleared;
        });
        setOverlayQueue([]);
        overlayQueueIndexRef.current = 0;
      }, bandProfile.overlays.lastItemDismissMs);
    }

    return () => {
      if (overlayQueueTimerRef.current) clearTimeout(overlayQueueTimerRef.current);
    };
  }, [overlayQueue]);

  const enqueueSmallOverlay = useCallback((item: QueuedOverlay) => {
    setOverlayQueue(prev => {
      if (prev.length === 0) {
        // First item — reset index and start fresh
        overlayQueueIndexRef.current = 0;
        return [item];
      }
      // Append to existing queue
      return [...prev, item];
    });
  }, []);

  const flushOverlayQueue = useCallback(() => {
    if (overlayQueueTimerRef.current) clearTimeout(overlayQueueTimerRef.current);
    overlayQueueIndexRef.current = 0;
    setOverlayQueue([]);
    setOverlays(prev => {
      const cleared = { ...prev };
      SMALL_OVERLAY_TYPES.forEach(t => { (cleared as any)[t] = null; });
      return cleared;
    });
  }, []);

  const handleDebugEvent = useCallback((evt: DebugEvent) => {
    setDebugEvents(prev => [...prev.slice(-200), evt]);
  }, []);

  const addDebug = useCallback((category: DebugEvent['category'], label: string, detail?: string) => {
    handleDebugEvent(createDebugEvent(category, label, detail));
  }, [handleDebugEvent]);

  const {
    status, transcriptChunks, thinkingText, sceneMode: _sceneMode, error,
    isMuted, isQAActive, hasReceivedMessage, pipelineStatus,
    connect, disconnect, toggleMute, sendRaiseHand,
    setSceneMode: setLiveSceneMode,
    beats, paused, pauseSession, resumeSession
  } = useSession({
    chapterId,
    familyId: familyId || '',
    learnerId: activeLearnerId || '',
    band,
    agentUrl: import.meta.env.VITE_AGENT_URL || 'http://localhost:8080',
    onDebug: handleDebugEvent
  });

  const dismissOverlay = useCallback((type: keyof OverlayState | 'all') => {
    if (type === 'all') {
      flushOverlayQueue();
      // Also clear large overlays
      setOverlays(EMPTY_OVERLAYS);
      return;
    }
    setOverlays(prev => ({ ...prev, [type]: null }));
  }, [flushOverlayQueue]);

  const handleAgentToolCall = useCallback((msg: AgentToolCall) => {
    addDebug('tool_call', `${msg.tool}(${msg.args?.mode || msg.args?.location || msg.args?.regionId || msg.args?.term || ''})`, JSON.stringify(msg.args));
    
    if (!isToolAllowedForBand(msg, bandProfile)) {
      addDebug('tool_call', `BLOCKED ${msg.tool}`, `Not allowed for band ${band}`);
      return;
    }

    // Intercept set_scene("image") — show as thumbnail in top-right corner
    if (msg.tool === 'set_scene' && msg.args?.mode === 'image') {
      setShowWelcomeCover(false);
      const rawUrl = msg.args.imageUrl || '';
      const resolvedUrl = rawUrl ? resolveImageUrl(rawUrl) : '';
      setThumbnailImage({ url: resolvedUrl, caption: msg.args.caption || '', timestamp: Date.now() });
      setThumbnailIsStale(false);
      addDebug('scene', `Image thumbnail: ${rawUrl} → ${resolvedUrl}`, msg.args.caption);
      // Image persists until explicit clear
      if (thumbnailTimerRef.current) clearTimeout(thumbnailTimerRef.current);
      thumbnailTimerRef.current = window.setTimeout(() => {
        setThumbnailIsStale(true);
      }, 30000);
      return;
    }

    // Intercept set_scene("map") — switch to maplibre interactive
    if (msg.tool === 'set_scene' && msg.args?.mode === 'map') {
      setActiveVisual('maplibre');
      addDebug('scene', 'MapLibre active');
      return;
    }

    // Intercept set_scene("transcript") — return to chapter map
    if (msg.tool === 'set_scene' && msg.args?.mode === 'transcript') {
      setActiveVisual('map');
      addDebug('scene', 'Back to chapter map');
      return;
    }

    // ── Small overlay tools → enqueue ──
    if (msg.tool === 'show_scripture') {
      enqueueSmallOverlay({
        type: 'scripture',
        data: { reference: msg.args.reference, text: msg.args.text, connection: msg.args.connection },
        debugLabel: `Scripture: ${msg.args.reference}`,
      });
      addDebug('scene', `Scripture: ${msg.args.reference}`);
      return;
    }
    if (msg.tool === 'show_timeline') {
      const mergedEvents = mergeTimeline(chapterId, msg.args.events || []);
      enqueueSmallOverlay({
        type: 'timeline',
        data: { events: mergedEvents },
        debugLabel: `Timeline: ${mergedEvents.length} events`,
      });
      addDebug('scene', `Timeline: ${mergedEvents.length} events (${msg.args.events?.length} highlighted)`);
      return;
    }
    if (msg.tool === 'show_key_term') {
      enqueueSmallOverlay({
        type: 'keyTerm',
        data: { term: msg.args.term, definition: msg.args.definition, pronunciation: msg.args.pronunciation, etymology: msg.args.etymology },
        debugLabel: `Key Term: ${msg.args.term}`,
      });
      addDebug('scene', `Key Term: ${msg.args.term}`);
      return;
    }
    if (msg.tool === 'show_question') {
      enqueueSmallOverlay({
        type: 'question',
        data: { question: msg.args.question, context: msg.args.context, type: msg.args.type },
        debugLabel: `Question: ${msg.args.question?.slice(0, 50)}`,
      });
      addDebug('scene', `Question: ${msg.args.question?.slice(0, 50)}`);
      return;
    }
    if (msg.tool === 'show_quote') {
      enqueueSmallOverlay({
        type: 'quote',
        data: { text: msg.args.text, attribution: msg.args.attribution, date: msg.args.date },
        debugLabel: `Quote: ${msg.args.attribution}`,
      });
      addDebug('scene', `Quote: ${msg.args.attribution}`);
      return;
    }

    // ── Large overlay tools → set immediately ──
    if (msg.tool === 'show_figure') {
      setOverlays(prev => ({ ...prev, figure: { name: msg.args.name, title: msg.args.title, imageUrl: msg.args.imageUrl } }));
      scheduleAutoDismiss('figure', 8000);
      addDebug('scene', `Figure: ${msg.args.name}`);
      return;
    }
    if (msg.tool === 'show_genealogy') {
      setOverlays(prev => ({ ...prev, genealogy: { rootName: msg.args.rootName, nodes: msg.args.nodes } }));
      scheduleAutoDismiss('genealogy', 12000);
      addDebug('scene', `Genealogy: ${msg.args.rootName}`);
      return;
    }
    if (msg.tool === 'show_comparison') {
      setOverlays(prev => ({ ...prev, comparison: { title: msg.args.title, columnA: msg.args.columnA, columnB: msg.args.columnB } }));
      scheduleAutoDismiss('comparison', 12000);
      addDebug('scene', `Comparison: ${msg.args.title}`);
      return;
    }
    if (msg.tool === 'show_slide') {
      setOverlays(prev => ({ ...prev, slide: { title: msg.args.title, body: msg.args.body, bullets: msg.args.bullets, imageUrl: msg.args.imageUrl, layout: msg.args.layout } }));
      scheduleAutoDismiss('slide', 15000);
      addDebug('scene', `Slide: ${msg.args.title}`);
      return;
    }
    if (msg.tool === 'dismiss_overlay') {
      dismissOverlay(msg.args?.type || 'all');
      return;
    }

    // Map tools (zoom_to, place_marker, draw_route) — auto-switch to maplibre, then revert
    if (['zoom_to', 'place_marker', 'draw_route', 'highlight_region'].includes(msg.tool)) {
      setActiveVisual('maplibre');
      // Auto-revert to chapter map after map interaction completes
      if (mapRevertTimerRef.current) clearTimeout(mapRevertTimerRef.current);
      mapRevertTimerRef.current = window.setTimeout(() => {
        setActiveVisual('map');
        addDebug('scene', 'Auto-revert to chapter map');
      }, 15000);
    }

    handleToolCall(canvasRef.current, msg, useFallback ? goldenScript.setSceneMode : setLiveSceneMode);
  }, [setLiveSceneMode, useFallback, goldenScript.setSceneMode, addDebug, dismissOverlay, scheduleAutoDismiss, enqueueSmallOverlay, chapterId, bandProfile, band]);

  const handleReplayPopups = useCallback((tools: AgentToolCall[]) => {
    tools.forEach(tool => {
      if (['show_scripture', 'show_key_term', 'show_timeline', 'show_question', 'show_quote'].includes(tool.tool)) {
        handleAgentToolCall(tool); // This will pass through the toolGate automatically
      }
    });
  }, [handleAgentToolCall]);

  // Refs to hold latest callback versions
  const connectRef = useRef(connect);
  const handleAgentToolCallRef = useRef(handleAgentToolCall);
  const recordEventRef = useRef(recordEvent);
  const lastAutoConnectKeyRef = useRef<string | null>(null);
  useEffect(() => { connectRef.current = connect; }, [connect]);
  useEffect(() => { handleAgentToolCallRef.current = handleAgentToolCall; }, [handleAgentToolCall]);
  useEffect(() => { recordEventRef.current = recordEvent; }, [recordEvent]);

  const restartLiveSession = useCallback(() => {
    setNoResponseError(false);
    setNoResponseWarning(false);
    disconnect();
    window.setTimeout(() => {
      connectRef.current(handleAgentToolCallRef.current, recordEventRef.current);
    }, 100);
  }, [disconnect]);

  // Monitor for silent connect
  useEffect(() => {
    if (useFallback) return;
    const isPipelineActive = !!pipelineStatus;
    if (status === 'connected' && !hasReceivedMessage && !isPipelineActive) {
      noResponseWarningTimeoutRef.current = window.setTimeout(() => setNoResponseWarning(true), 60000);
      noResponseErrorTimeoutRef.current = window.setTimeout(() => setNoResponseError(true), 120000);
    } else if (hasReceivedMessage || isPipelineActive) {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
      setNoResponseWarning(false);
      setNoResponseError(false);
    } else {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
      setNoResponseWarning(false);
    }
    return () => {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
    };
  }, [status, hasReceivedMessage, useFallback, pipelineStatus]);

  // Auto-connect
  useEffect(() => {
    if (!useFallback && familyId && activeLearnerId) {
      const connectKey = `${familyId}:${activeLearnerId}:${chapterId}:${band}`;
      if (lastAutoConnectKeyRef.current !== connectKey) {
        lastAutoConnectKeyRef.current = connectKey;
        connectRef.current(handleAgentToolCallRef.current, recordEventRef.current);
      }
    }
  }, [useFallback, familyId, activeLearnerId, chapterId, band]);

  // Golden script fallback on connecting timeout
  useEffect(() => {
    if (status === 'connecting' && !useFallback) {
      fallbackCheckTimeoutRef.current = window.setTimeout(async () => {
        const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
        const goldenScriptUrl = `${apiUrl}/api/golden-scripts/${chapterId}/${band}`;
        try {
          const res = await fetch(goldenScriptUrl);
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) return;
          if (res.ok) {
            const data = await res.json();
            setGoldenScriptData(data);
            setUseFallback(true);
            disconnect();
          }
        } catch (e) {
          console.error('[GOLDEN_SCRIPT] Fallback fetch failed', e);
        }
      }, 5000);
    }
    return () => { if (fallbackCheckTimeoutRef.current) clearTimeout(fallbackCheckTimeoutRef.current); };
  }, [status, useFallback, chapterId, band, disconnect]);

  // Fallback on error
  useEffect(() => {
    if (status === 'error' && !useFallback) {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const goldenScriptUrl = `${apiUrl}/api/golden-scripts/${chapterId}/${band}`;
      (async () => {
        try {
          const res = await fetch(goldenScriptUrl);
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) return;
          if (res.ok) {
            const data = await res.json();
            setGoldenScriptData(data);
            setUseFallback(true);
            disconnect();
          }
        } catch (e) {
          console.error('[GOLDEN_SCRIPT] Fallback fetch failed', e);
        }
      })();
    }
  }, [status, useFallback, chapterId, band, disconnect]);

  useEffect(() => {
    if (useFallback && goldenScriptData && goldenScript.status === 'idle') {
      goldenScript.play(handleAgentToolCall);
    }
  }, [useFallback, goldenScriptData, goldenScript.status, goldenScript.play, handleAgentToolCall]);

  const handleEndSession = () => {
    if (useFallback) goldenScript.pause();
    else disconnect();
    onExit();
  };

  const handleSaveGoldenScript = async () => {
    const script = stopRecording();
    if (!script) { toast.error('No events recorded in this session.'); return; }
    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/golden-scripts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(script) });
      if (res.ok) toast.success('Session saved as Golden Script');
      else { const err = await res.json(); toast.error(err.error || 'Failed to save Golden Script'); }
    } catch (e) { toast.error('Failed to save Golden Script'); }
  };

  const isConnected = useFallback ? goldenScript.status === 'playing' : (status === 'connected' || status === 'reconnecting');
  const displayBeats = useFallback 
    ? goldenScript.transcriptChunks.map((c, i) => ({ id: `gs-${i}`, text: c.text, status: 'done' as const, toolCalls: [] })) 
    : beats;

  // Loading states
  if (!familyId || !activeLearnerId) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Preparing your session...</p>
      </div>
    );
  }

  if (status === 'connecting' && !useFallback) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Starting your lesson...</p>
      </div>
    );
  }

  if (status === 'error' && !useFallback) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <span className="text-4xl text-destructive">⚠️</span>
        <h2 className="text-2xl font-bold">Connection Failed</h2>
        <p className="text-muted-foreground">{error || 'Your teacher is unavailable.'}</p>
        <div className="flex gap-4">
          <button onClick={restartLiveSession} className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Try Again</button>
          <button onClick={onExit} className="px-6 py-3 bg-muted text-foreground rounded-full hover:bg-muted/80 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  if (noResponseError && !useFallback) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <span className="text-4xl text-amber-500">⏳</span>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">Your teacher is taking too long to respond.</p>
        <div className="flex gap-4">
          <button onClick={restartLiveSession} className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Try Again</button>
          <button onClick={onExit} className="px-6 py-3 bg-muted text-foreground rounded-full hover:bg-muted/80 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  const isEnded = (status === 'ended' && !useFallback) || (useFallback && goldenScript.status === 'ended');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-background overflow-hidden select-none flex flex-col"
    >
      {/* ── Top bar ── */}
      <div className="h-12 flex items-center px-4 bg-card/80 backdrop-blur-sm border-b border-border/50 z-50 flex-shrink-0">
        <button onClick={onExit} className="p-2 hover:bg-muted/60 rounded-full text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setDebugOpen(prev => !prev)} className="p-1.5 hover:bg-muted/60 rounded-full text-foreground/40 hover:text-foreground transition-colors" title="Debug">
            <Bug className="w-3.5 h-3.5" />
          </button>
          {useFallback && (
            <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-primary/20 text-primary rounded-full">Recorded</span>
          )}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : status === 'reconnecting' ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {useFallback ? (goldenScript.status === 'playing' ? 'Playing' : 'Paused') : (status === 'reconnecting' ? 'Reconnecting' : isConnected ? 'Live' : 'Connecting')}
          </span>
        </div>
      </div>

      {/* ── Split layout: Visual (left) | Transcript (right) ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* LEFT PANEL — Visual area (60% on desktop, 55% on mobile) */}
        <div className="h-[55%] md:h-full md:w-[60%] relative bg-void/5 flex-shrink-0 overflow-hidden">
          
          {/* Layer 1: Auto-scrolling chapter map (default — always present, except for young bands) */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${activeVisual === 'map' ? 'opacity-100' : activeVisual === 'maplibre' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {bandProfile.visuals.hideBackgroundMap ? (
              <div className="w-full h-full bg-[#fdfbf7] flex items-center justify-center" />
            ) : chapterMapUrl ? (
              <AutoScrollMap src={chapterMapUrl} alt={`Chapter ${chapterId} map`} speed={bandProfile.visuals.mapScrollSpeed} maxZoom={bandProfile.visuals.maxZoom} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground text-sm">Loading map...</p>
              </div>
            )}
          </div>

          {/* Layer 2: MapLibre interactive (when AI triggers map tools) */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${activeVisual === 'maplibre' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <TeachingCanvas ref={canvasRef} />
          </div>

          {/* Layer 3: Image — centered in left panel for young bands, corner thumbnail for older */}
          <AnimatePresence>
            {thumbnailImage && (
              bandProfile.visuals.imageCentered ? (
                /* Bands 0-1: Image fills the left panel, centered with flex */
                <motion.div
                  key="image-centered"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-4"
                >
                  <div className="w-full max-w-md md:max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-border/30 bg-card/95 backdrop-blur-sm relative">
                    <button onClick={() => setThumbnailImage(null)} className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition-colors z-40">
                      <X className="w-4 h-4" />
                    </button>
                    {thumbnailIsStale && (
                      <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full z-40 backdrop-blur-sm font-medium">
                        Last shown
                      </div>
                    )}
                    <img
                      src={thumbnailImage.url}
                      alt={thumbnailImage.caption}
                      className="w-full aspect-square object-contain bg-[#fdfbf7]"
                    />
                    {thumbnailImage.caption && (
                      <p className="px-3 py-2 text-sm md:text-base text-foreground/80 leading-snug text-center font-medium">
                        {thumbnailImage.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Bands 2+: Small thumbnail in top-right corner */
                <motion.div
                  key="image-thumbnail"
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute z-30 rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-card/90 backdrop-blur-sm top-3 right-3 ${bandProfile.visuals.imageSizeClass} group`}
                >
                  <button onClick={() => setThumbnailImage(null)} className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition-colors z-40 opacity-0 group-hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                  {thumbnailIsStale && (
                    <div className="absolute top-2 left-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full z-40 backdrop-blur-sm">
                      Last shown
                    </div>
                  )}
                  <img
                    src={thumbnailImage.url}
                    alt={thumbnailImage.caption}
                    className="w-full aspect-square object-contain bg-black/5"
                  />
                  {thumbnailImage.caption && (
                    <p className="px-2.5 py-1.5 text-[10px] md:text-xs text-foreground/80 leading-tight line-clamp-2">
                      {thumbnailImage.caption}
                    </p>
                  )}
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Overlays — positioned within the visual panel, no X buttons */}
          <CanvasOverlays overlays={overlays} onDismiss={dismissOverlay} compact band={band} />
        </div>

        {/* RIGHT PANEL — Transcript (40% on desktop, 45% on mobile) */}
        <div className="h-[45%] md:h-full md:w-[40%] bg-card flex flex-col min-h-0 border-l border-border/30">
          {noResponseWarning && (
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
              <p className="text-amber-600 dark:text-amber-400 text-xs font-medium animate-pulse">
                Your teacher is taking longer than expected...
              </p>
            </div>
          )}
          <ThinkingBanner thinkingText={thinkingText} />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <TranscriptView 
              beats={displayBeats} 
              band={band} 
              isActive={isConnected} 
              chapterId={chapterId} 
              pipelineStatus={pipelineStatus}
              paused={paused}
              onTogglePause={() => paused ? resumeSession() : pauseSession()}
              onReplayPopups={handleReplayPopups}
            />
          </div>

          {/* Bottom controls — inside the right panel */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-border/30 flex items-center justify-center gap-3 bg-card">
            {!useFallback && bandProfile.interactivity.showMic && (
              <button onClick={toggleMute} className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${isMuted ? 'bg-red-500/15 text-red-500' : 'bg-primary/15 text-primary hover:bg-primary/25'}`}>
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            
            <button 
              onClick={() => {
                if (useFallback) {
                  goldenScript.status === 'playing' ? goldenScript.pause() : goldenScript.play(handleAgentToolCall);
                } else {
                  paused ? resumeSession() : pauseSession();
                }
              }} 
              className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${paused || (useFallback && goldenScript.status !== 'playing') ? 'bg-primary/15 text-primary hover:bg-primary/25' : 'bg-muted/60 text-foreground hover:bg-muted'}`}
            >
              {paused || (useFallback && goldenScript.status !== 'playing') ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <span className="text-[10px] text-muted-foreground tracking-widest uppercase truncate w-24 text-center">
              {useFallback ? (goldenScript.status === 'playing' ? 'playing' : 'paused') : status === 'connecting' ? 'CONNECTING' : status === 'reconnecting' ? 'RECONNECTING' : status === 'connected' && displayBeats.length === 0 ? 'WAITING' : 'LISTENING'}
            </span>
            {!useFallback && bandProfile.interactivity.showRaiseHand && status === 'connected' && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (raiseHandCooldown) return;
                  sendRaiseHand();
                  if (bandProfile.interactivity.raiseHandCooldownMs > 0) {
                    setRaiseHandCooldown(true);
                    setTimeout(() => setRaiseHandCooldown(false), bandProfile.interactivity.raiseHandCooldownMs);
                  }
                }}
                className={`p-2.5 rounded-full transition-all ${
                  raiseHandCooldown
                    ? 'bg-muted/30 text-foreground/30 cursor-not-allowed'
                    : isQAActive
                    ? 'bg-amber-500 text-white ring-2 ring-amber-500/30'
                    : 'bg-muted/60 text-foreground/60 hover:bg-muted'
                }`}
                disabled={raiseHandCooldown}
              >
                <Hand className="w-4 h-4" />
              </motion.button>
            )}
            <button onClick={handleEndSession} className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-full transition-colors" title="End Session">
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Ended Overlay */}
      <AnimatePresence>
        {isEnded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[90] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 px-6 text-center">
            <h2 className="text-3xl font-display font-bold">Session Ended</h2>
            <p className="text-muted-foreground">Thank you for learning with us today.</p>
            <div className="flex gap-4">
              <button onClick={onExit} className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Back to Dashboard</button>
              {!useFallback && (
                <button onClick={handleSaveGoldenScript} className="px-6 py-3 bg-muted text-foreground flex items-center gap-2 rounded-full hover:bg-muted/80 transition-colors">
                  <Save className="w-4 h-4" /> Save as Golden Script
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DebugDrawer events={debugEvents} isOpen={debugOpen} onToggle={() => setDebugOpen(false)} />
    </motion.div>
  );
}
