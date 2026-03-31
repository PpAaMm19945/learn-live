import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { SceneMode } from '@/lib/session/types';

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
  const [sceneMode, setSceneMode] = useState<SceneMode>('transcript');
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // TODO: Wire useSession hook for WebSocket connection
  // The hook will call setSceneMode, setTranscriptLines, and forward tool calls

  return (
    <div className="fixed inset-0 bg-background overflow-hidden select-none flex flex-col">
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
        <AnimatePresence>
          {sceneMode === 'transcript' && (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
            >
              <div className="max-w-3xl w-full">
                {transcriptLines.length === 0 ? (
                  <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
                      Ready to learn
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Session will begin shortly, {learnerName}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {transcriptLines.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: i === transcriptLines.length - 1 ? 1 : 0.4, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`text-2xl md:text-4xl font-semibold leading-relaxed tracking-tight ${
                          i === transcriptLines.length - 1
                            ? 'text-foreground'
                            : 'text-muted-foreground/40'
                        }`}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              {/* Scene content will be rendered here based on sceneMode */}
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {sceneMode === 'map' && <p>Map scene — TeachingCanvas renders here</p>}
                {sceneMode === 'image' && <p>Image scene</p>}
                {sceneMode === 'overlay' && <p>Overlay scene</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-muted/20 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            {sceneMode === 'transcript' ? 'listening' : sceneMode}
          </p>
        </div>
      </div>
    </div>
  );
}
