import { useState, useEffect, useRef, useCallback } from 'react';
import { handleToolCall, ToolCallMessage } from './toolCallHandler';
import type { TeachingCanvasRef } from '@/components/canvas/TeachingCanvas';

interface WebSocketCanvasReturn {
  isConnected: boolean;
  isPlaying: boolean;
  transcript: string;
  toolCallLog: { id: string; time: Date; tool: string; target: string }[];
  startSession: (canvasRef: React.RefObject<TeachingCanvasRef | null>) => void;
  endSession: () => void;
}

export function useWebSocketCanvas(wsUrl: string): WebSocketCanvasReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [toolCallLog, setToolCallLog] = useState<{ id: string; time: Date; tool: string; target: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<React.RefObject<TeachingCanvasRef | null> | null>(null);

  const startSession = useCallback((ref: React.RefObject<TeachingCanvasRef | null>) => {
    canvasRef.current = ref;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setIsPlaying(true);
    };

    ws.onmessage = (event) => {
      // In a real implementation this would distinguish between binary audio chunks and JSON tool calls
      if (typeof event.data === 'string') {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'tool_call') {
            if (canvasRef.current?.current) {
              handleToolCall(canvasRef.current.current, message as ToolCallMessage);
            }

            setToolCallLog(prev => [...prev, {
              id: Date.now().toString() + Math.random(),
              time: new Date(),
              tool: message.tool,
              target: message.args?.location || message.args?.regionId || message.args?.label || ''
            }]);
          } else if (message.type === 'transcript') {
            setTranscript(message.text);
          }
        } catch (e) {
          console.error('Failed to parse websocket message', e);
        }
      } else {
         // handle audio data if needed
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsPlaying(false);
    };

    wsRef.current = ws;
  }, [wsUrl]);

  const endSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    isConnected,
    isPlaying,
    transcript,
    toolCallLog,
    startSession,
    endSession,
  };
}
