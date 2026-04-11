import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, PhoneOff, Play, Pause, Save, Hand, Bug } from 'lucide-react';
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
import { ImageScene } from './ImageScene';
import { CanvasOverlays, type OverlayState, EMPTY_OVERLAYS } from '@/components/canvas/CanvasOverlays';

interface SessionCanvasProps {
  chapterId: string;
  band: number;
  learnerName: string;
  onExit: () => void;
}

/**
 * SessionCanvas — the full-bleed immersive teaching viewport.
 * 
 * Default state: Kinetic transcript view (typography-first).
 * The AI agent controls scene transitions via set_scene tool calls.
 * Visual scenes (map, image, overlay) slide over the transcript and recede when dismissed.
 */
export function SessionCanvas({ chapterId, band, learnerName: _learnerName, onExit }: SessionCanvasProps) {
  const { familyId, activeLearnerId } = useLearnerStore();
  const canvasRef = useRef<TeachingCanvasRef>(null);
  const [imageSceneUrl, setImageSceneUrl] = useState<string>('');
  const [imageSceneCaption, setImageSceneCaption] = useState<string>('');
  const [debugEvents, setDebugEvents] = useState<DebugEvent[]>([]);
  const [debugOpen, setDebugOpen] = useState(false);
  const [overlays, setOverlays] = useState<OverlayState>(EMPTY_OVERLAYS);
  const [useFallback, setUseFallback] = useState(false);
  const [goldenScriptData, setGoldenScriptData] = useState<GoldenScript | null>(null);
  const fallbackCheckTimeoutRef = useRef<number | null>(null);

  const [noResponseWarning, setNoResponseWarning] = useState(false);
  const [noResponseError, setNoResponseError] = useState(false);
  const noResponseWarningTimeoutRef = useRef<number | null>(null);
  const noResponseErrorTimeoutRef = useRef<number | null>(null);

  // Recorder hook
  const { recordEvent, stop: stopRecording } = useRecorder({
    chapterId,
    band,
    recording: !useFallback,
  });

  // Playback hook (fallback)
  const goldenScript = useGoldenScript(goldenScriptData);

  const handleDebugEvent = useCallback((evt: DebugEvent) => {
    setDebugEvents(prev => [...prev.slice(-200), evt]);
  }, []);

  const addDebug = useCallback((category: DebugEvent['category'], label: string, detail?: string) => {
    handleDebugEvent(createDebugEvent(category, label, detail));
  }, [handleDebugEvent]);

  const {
    status,
    transcriptChunks,
    thinkingText,
    sceneMode,
    error,
    isMuted,
    isQAActive,
    hasReceivedMessage,
    connect,
    disconnect,
    toggleMute,
    sendRaiseHand,
    setSceneMode: setLiveSceneMode
  } = useSession({
    chapterId,
    familyId: familyId || '',
    learnerId: activeLearnerId || '',
    band,
    agentUrl: import.meta.env.VITE_AGENT_URL || 'http://localhost:8080',
    onDebug: handleDebugEvent
  });

  const dismissOverlay = useCallback((type: keyof OverlayState | 'all') => {
    setOverlays(prev => {
      if (type === 'all') return EMPTY_OVERLAYS;
      return { ...prev, [type]: null };
    });
  }, []);

  const handleAgentToolCall = useCallback((msg: AgentToolCall) => {
    addDebug('tool_call', `${msg.tool}(${msg.args?.mode || msg.args?.location || msg.args?.regionId || ''})`, JSON.stringify(msg.args));
    
    // Intercept set_scene("image") to capture imageUrl BEFORE scene mode switches
    if (msg.tool === 'set_scene' && msg.args?.mode === 'image') {
      setImageSceneUrl(msg.args.imageUrl || '');
      setImageSceneCaption(msg.args.caption || '');
      addDebug('scene', `Image: ${msg.args.imageUrl}`, msg.args.caption);
    }

    // Intercept overlay tools — render at SessionCanvas level so they're visible in ALL scene modes
    if (msg.tool === 'show_scripture') {
      setOverlays(prev => ({ ...prev, scripture: { reference: msg.args.reference, text: msg.args.text, connection: msg.args.connection } }));
      addDebug('scene', `Scripture: ${msg.args.reference}`);
      return;
    }
    if (msg.tool === 'show_figure') {
      setOverlays(prev => ({ ...prev, figure: { name: msg.args.name, title: msg.args.title, imageUrl: msg.args.imageUrl } }));
      addDebug('scene', `Figure: ${msg.args.name}`);
      return;
    }
    if (msg.tool === 'show_genealogy') {
      setOverlays(prev => ({ ...prev, genealogy: { rootName: msg.args.rootName, nodes: msg.args.nodes } }));
      addDebug('scene', `Genealogy: ${msg.args.rootName}`);
      return;
    }
    if (msg.tool === 'show_timeline') {
      setOverlays(prev => ({ ...prev, timeline: { events: msg.args.events } }));
      addDebug('scene', `Timeline: ${msg.args.events?.length} events`);
      return;
    }
    if (msg.tool === 'dismiss_overlay') {
      dismissOverlay(msg.args?.type || 'all');
      return;
    }

    handleToolCall(canvasRef.current, msg, useFallback ? goldenScript.setSceneMode : setLiveSceneMode);
  }, [setLiveSceneMode, useFallback, goldenScript.setSceneMode, addDebug, dismissOverlay]);

  // Refs to hold latest callback versions without destabilizing the effect
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

    // Allow the disconnect state transition to settle before reconnecting.
    window.setTimeout(() => {
      connectRef.current(handleAgentToolCallRef.current, recordEventRef.current);
    }, 100);
  }, [disconnect]);

  // Monitor for silent connect with no chunks
  useEffect(() => {
    if (useFallback) return;

    if (status === 'connected' && !hasReceivedMessage) {
      noResponseWarningTimeoutRef.current = window.setTimeout(() => {
        setNoResponseWarning(true);
      }, 25000);

      noResponseErrorTimeoutRef.current = window.setTimeout(() => {
        setNoResponseError(true);
      }, 45000);
    } else if (hasReceivedMessage) {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
      setNoResponseWarning(false);
      setNoResponseError(false);
    } else {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
      setNoResponseWarning(false);
      // DO NOT clear noResponseError so it persists when disconnect() is called
    }

    return () => {
      if (noResponseWarningTimeoutRef.current) clearTimeout(noResponseWarningTimeoutRef.current);
      if (noResponseErrorTimeoutRef.current) clearTimeout(noResponseErrorTimeoutRef.current);
    };
  }, [status, hasReceivedMessage, useFallback]);

  // Auto-connect on mount (or when useFallback toggles off), gated by context readiness
  useEffect(() => {
    if (!useFallback && familyId && activeLearnerId) {
      const connectKey = `${familyId}:${activeLearnerId}:${chapterId}:${band}`;
      if (lastAutoConnectKeyRef.current !== connectKey) {
        lastAutoConnectKeyRef.current = connectKey;
        connectRef.current(handleAgentToolCallRef.current, recordEventRef.current);
      }
    }
  }, [useFallback, familyId, activeLearnerId, chapterId, band]);

  useEffect(() => {
    if (status === 'connecting' && !useFallback) {
      fallbackCheckTimeoutRef.current = window.setTimeout(async () => {
         const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
         const goldenScriptUrl = `${apiUrl}/api/golden-scripts/${chapterId}/${band}`;
         try {
           console.log(`[GOLDEN_SCRIPT] Fetching fallback from ${goldenScriptUrl}`);
           const res = await fetch(goldenScriptUrl);
           const contentType = res.headers.get('content-type') || '';
           if (!contentType.includes('application/json')) {
              const text = await res.text();
              console.error(`[GOLDEN_SCRIPT] Non-JSON response (${res.status}, ${contentType}): ${text.substring(0, 200)}`);
              return;
           }
           if (res.ok) {
              const data = await res.json();
              setGoldenScriptData(data);
              setUseFallback(true);
              disconnect(); // Stop trying live connection
           } else {
              const errData = await res.json();
              console.warn(`[GOLDEN_SCRIPT] Fallback not available: ${res.status}`, errData);
           }
         } catch (e) {
           console.error('[GOLDEN_SCRIPT] Fallback fetch failed', e);
         }
      }, 5000);
    }

    return () => {
       if (fallbackCheckTimeoutRef.current) {
         clearTimeout(fallbackCheckTimeoutRef.current);
       }
    };
  }, [status, useFallback, chapterId, band, disconnect]);

  // Fallback: when agent retries exhaust and status becomes 'error', immediately try golden script
  useEffect(() => {
    if (status === 'error' && !useFallback) {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const goldenScriptUrl = `${apiUrl}/api/golden-scripts/${chapterId}/${band}`;
      (async () => {
        try {
          console.log(`[GOLDEN_SCRIPT] Agent failed, fetching fallback from ${goldenScriptUrl}`);
          const res = await fetch(goldenScriptUrl);
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            const text = await res.text();
            console.error(`[GOLDEN_SCRIPT] Non-JSON response (${res.status}, ${contentType}): ${text.substring(0, 200)}`);
            return;
          }
          if (res.ok) {
            const data = await res.json();
            setGoldenScriptData(data);
            setUseFallback(true);
            disconnect();
          } else {
            const errData = await res.json();
            console.warn(`[GOLDEN_SCRIPT] Fallback not available: ${res.status}`, errData);
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
    if (useFallback) {
      goldenScript.pause();
    } else {
      disconnect();
    }
    onExit();
  };

  const handleSaveGoldenScript = async () => {
     const script = stopRecording();
     if (!script) {
        toast.error('No events recorded in this session.');
        return;
     }

      try {
          const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
          const res = await fetch(`${apiUrl}/api/golden-scripts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(script)
          });

          if (res.ok) {
             toast.success('Session saved as Golden Script');
          } else {
             const err = await res.json();
             toast.error(err.error || 'Failed to save Golden Script');
          }
      } catch (e) {
          toast.error('Failed to save Golden Script');
      }
  };

  const isConnected = useFallback ? goldenScript.status === 'playing' : (status === 'connected' || status === 'reconnecting');
  const displaySceneMode = useFallback ? goldenScript.sceneMode : sceneMode;
  const displayTranscriptChunks = useFallback ? goldenScript.transcriptChunks : transcriptChunks;

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
          <button
            onClick={restartLiveSession}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-muted text-foreground rounded-full hover:bg-muted/80 transition-colors"
          >
            Go Back
          </button>
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
          <button
            onClick={restartLiveSession}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onExit}
            className="px-6 py-3 bg-muted text-foreground rounded-full hover:bg-muted/80 transition-colors"
          >
            Go Back
          </button>
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
      {/* Minimal top bar — fades on inactivity */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
        <button
          onClick={onExit}
          className="p-3 bg-muted/40 hover:bg-muted/60 backdrop-blur-md rounded-full text-foreground transition-colors pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Connection indicator */}
        <div className="ml-auto pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setDebugOpen(prev => !prev)}
            className="p-2 bg-muted/40 hover:bg-muted/60 backdrop-blur-md rounded-full text-foreground/50 hover:text-foreground transition-colors"
            title="Toggle Debug Panel"
          >
            <Bug className="w-4 h-4" />
          </button>
          {useFallback && (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary rounded-full mr-2">
              Recorded session
            </span>
          )}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : status === 'reconnecting' ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
          <span className="text-xs text-muted-foreground">
            {useFallback ? (goldenScript.status === 'playing' ? 'Playing' : 'Paused') : (status === 'reconnecting' ? 'Reconnecting...' : isConnected ? 'Live' : 'Connecting...')}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Transcript layer — always present, slides behind scenes */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 flex flex-col ${
            displaySceneMode === 'transcript' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {noResponseWarning && (
            <div className="absolute top-16 left-0 right-0 flex justify-center z-20 pointer-events-none">
              <div className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium animate-pulse border border-amber-500/30">
                Your teacher is taking longer than expected...
              </div>
            </div>
          )}
          <ThinkingBanner thinkingText={thinkingText} />
          <TranscriptView
            chunks={displayTranscriptChunks}
            band={band}
            isActive={isConnected}
            chapterId={chapterId}
          />
        </div>

        {/* Scene overlay — slides in from right when AI triggers a visual */}
        <AnimatePresence>
          {displaySceneMode !== 'transcript' && (
            <motion.div
              key="scene"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 bg-background"
            >
              <div className="w-full h-full bg-background relative z-10">
                 {/* Map Scene is always mounted so canvasRef works, but only visible when displaySceneMode === 'map' */}
                 <div className={`absolute inset-0 ${displaySceneMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                   <TeachingCanvas ref={canvasRef} />
                 </div>

                 {displaySceneMode === 'image' && (
                    <ImageScene imageUrl={imageSceneUrl} caption={imageSceneCaption} />
                 )}
                 {displaySceneMode === 'overlay' && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">
                       <p>Overlay scene</p>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas Overlays — always visible regardless of scene mode */}
      <CanvasOverlays overlays={overlays} onDismiss={dismissOverlay} />

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-muted/20 backdrop-blur-sm rounded-full px-6 py-3 pointer-events-auto">
          {useFallback ? (
            <button
              onClick={() => {
                if (goldenScript.status === 'playing') goldenScript.pause();
                else goldenScript.play(handleAgentToolCall);
              }}
              className="p-3 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors"
            >
              {goldenScript.status === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          ) : (
            band >= 3 && (
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )
          )}

          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              {useFallback
                ? (goldenScript.status === 'playing' ? 'playing' : 'paused')
                : status === 'connecting'
                  ? 'CONNECTING...'
                  : status === 'reconnecting'
                    ? 'RECONNECTING...'
                    : status === 'connected' && displayTranscriptChunks.length === 0
                      ? 'WAITING FOR TEACHER'
                      : 'LISTENING'}
            </p>
          </div>

          <button
            onClick={handleEndSession}
            className="p-3 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-full transition-colors"
            title="End Session"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Raise Hand Button — Band 3+ only */}
      {!useFallback && band >= 3 && status === 'connected' && (
        <div className="absolute bottom-24 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={sendRaiseHand}
            className={`p-5 rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 ${
              isQAActive 
                ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' 
                : 'bg-white/90 hover:bg-white text-primary backdrop-blur-md border border-primary/10'
            }`}
          >
            {isQAActive ? (
              <>
                <div className="relative">
                  <Hand className="w-6 h-6 animate-bounce" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </div>
                <span className="font-bold text-sm">Listening...</span>
              </>
            ) : (
              <>
                <Hand className="w-6 h-6" />
                <span className="font-semibold text-sm">Raise Hand</span>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Lesson Ended Overlay — renders INSIDE the layout so debug drawer stays accessible */}
      <AnimatePresence>
        {isEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-[90] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-6 px-6 text-center"
          >
            <h2 className="text-3xl font-display font-bold">Session Ended</h2>
            <p className="text-muted-foreground">Thank you for learning with us today.</p>
            <div className="flex gap-4">
              <button
                onClick={onExit}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                Back to Dashboard
              </button>
              {!useFallback && (
                <button
                  onClick={handleSaveGoldenScript}
                  className="px-6 py-3 bg-muted text-foreground flex items-center gap-2 rounded-full hover:bg-muted/80 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save as Golden Script
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Drawer */}
      <DebugDrawer events={debugEvents} isOpen={debugOpen} onToggle={() => setDebugOpen(false)} />
    </motion.div>
  );
}
