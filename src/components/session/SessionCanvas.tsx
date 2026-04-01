import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, PhoneOff } from 'lucide-react';
import type { SceneMode, TranscriptChunk, AgentToolCall } from '@/lib/session/types';
import { TranscriptView } from './TranscriptView';
import { useSession } from '@/lib/session/useSession';
import { useLearnerStore } from '@/lib/learnerStore';
import { TeachingCanvas, type TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';
import { handleToolCall } from '@/lib/canvas/toolCallHandler';

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
export function SessionCanvas({ chapterId, band, learnerName, onExit }: SessionCanvasProps) {
  const { familyId, activeLearnerId } = useLearnerStore();
  const canvasRef = useRef<TeachingCanvasRef>(null);

  const {
    status,
    transcriptChunks,
    sceneMode,
    error,
    isMuted,
    connect,
    disconnect,
    toggleMute,
    setSceneMode
  } = useSession({
    chapterId,
    familyId: familyId || 'anonymous',
    learnerId: activeLearnerId || 'anonymous',
    band,
    agentUrl: import.meta.env.VITE_AGENT_URL || 'http://localhost:8080'
  });

  const handleAgentToolCall = useCallback((msg: AgentToolCall) => {
    handleToolCall(canvasRef.current, msg, setSceneMode);
  }, [setSceneMode]);

  useEffect(() => {
    if (status === 'idle') {
      connect(handleAgentToolCall);
    }
  }, [status, connect, handleAgentToolCall]);

  const handleEndSession = () => {
    disconnect();
    onExit();
  };

  const isConnected = status === 'connected';

  if (status === 'connecting') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Connecting to your teacher...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <span className="text-4xl text-destructive">⚠️</span>
        <h2 className="text-2xl font-bold">Connection Failed</h2>
        <p className="text-muted-foreground">{error || 'Your teacher is unavailable.'}</p>
        <div className="flex gap-4">
          <button
            onClick={() => connect(handleAgentToolCall)}
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

  if (status === 'ended') {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <h2 className="text-3xl font-display font-bold">Session Ended</h2>
        <p className="text-muted-foreground">Thank you for learning with us today.</p>
        <button
          onClick={onExit}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

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
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-muted-foreground/30'}`} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative">
        {/* Transcript layer — always present, slides behind scenes */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            sceneMode === 'transcript' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <TranscriptView
            chunks={transcriptChunks}
            band={band}
            isActive={isConnected}
            chapterId={chapterId}
          />
        </div>

        {/* Scene overlay — slides in from right when AI triggers a visual */}
        <AnimatePresence>
          {sceneMode !== 'transcript' && (
            <motion.div
              key="scene"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 bg-background"
            >
              <div className="w-full h-full bg-background relative z-10">
                 {/* Map Scene is always mounted so canvasRef works, but only visible when sceneMode === 'map' */}
                 <div className={`absolute inset-0 ${sceneMode === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                   <TeachingCanvas ref={canvasRef} />
                 </div>

                 {sceneMode === 'image' && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">
                       <p>Image scene</p>
                    </div>
                 )}
                 {sceneMode === 'overlay' && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">
                       <p>Overlay scene</p>
                    </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
        <div className="flex items-center gap-4 bg-muted/20 backdrop-blur-sm rounded-full px-6 py-3 pointer-events-auto">
          {band >= 3 && (
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary hover:bg-primary/30'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <div className="px-4 py-2">
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              {sceneMode === 'transcript' ? 'listening' : sceneMode}
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
    </motion.div>
  );
}
