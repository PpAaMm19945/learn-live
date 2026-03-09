import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, X, Lightbulb, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatrixTask } from './TaskCard';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import {
    ExplainerClient,
    ExplainerStatus,
    CanvasOperation,
    CanvasElement,
} from '@/lib/explainerClient';
import { DemoPlayer } from '@/lib/demoPlayer';

interface ExplainerCanvasProps {
    task: MatrixTask;
    onClose: () => void;
}

/**
 * CountingBlock — a visual primitive for math explanations.
 * Renders as a colored rounded square with optional label.
 */
function CountingBlock({ element }: { element: CanvasElement }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: element.scale ?? 1,
                opacity: element.opacity ?? 1,
                x: element.x,
                y: element.y,
                rotate: element.rotation ?? 0,
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute flex items-center justify-center rounded-xl border-2 border-primary/30 shadow-lg font-black text-2xl select-none"
            style={{
                width: element.width ?? 64,
                height: element.height ?? 64,
                backgroundColor: element.color ?? 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                left: 0,
                top: 0,
            }}
        >
            {element.content}
        </motion.div>
    );
}

function TextElement({ element }: { element: CanvasElement }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: element.opacity ?? 1,
                x: element.x,
                y: element.y,
                scale: element.scale ?? 1,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute text-foreground font-bold select-none"
            style={{
                left: 0,
                top: 0,
                fontSize: element.height ?? 24,
                maxWidth: element.width ?? 400,
            }}
        >
            {element.content}
        </motion.div>
    );
}

function ShapeElement({ element }: { element: CanvasElement }) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{
                scale: element.scale ?? 1,
                opacity: element.opacity ?? 1,
                x: element.x,
                y: element.y,
            }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="absolute rounded-full border-4 border-accent"
            style={{
                left: 0,
                top: 0,
                width: element.width ?? 48,
                height: element.height ?? 48,
                backgroundColor: element.color ?? 'hsl(var(--accent))',
            }}
        />
    );
}

function ImageElement({ element }: { element: CanvasElement }) {
    return (
        <motion.img
            src={element.content}
            alt="diagram"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: element.opacity ?? 1,
                x: element.x,
                y: element.y,
                scale: element.scale ?? 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="absolute rounded-lg shadow-md"
            style={{
                left: 0,
                top: 0,
                width: element.width ?? 200,
                height: element.height ?? 200,
                objectFit: 'contain',
            }}
        />
    );
}

/**
 * Element renderer — dispatches to the correct visual primitive.
 */
function CanvasElementRenderer({ element }: { element: CanvasElement }) {
    switch (element.type) {
        case 'block': return <CountingBlock element={element} />;
        case 'text': return <TextElement element={element} />;
        case 'shape': return <ShapeElement element={element} />;
        case 'image':
        case 'diagram': return <ImageElement element={element} />;
        default: return null;
    }
}

export function ExplainerCanvas({ task, onClose }: ExplainerCanvasProps) {
    const [elements, setElements] = useState<Map<string, CanvasElement>>(new Map());
    const [status, setStatus] = useState<ExplainerStatus>('idle');
    const [transcript, setTranscript] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);
    const clientRef = useRef<ExplainerClient | null>(null);
    const demoRef = useRef<DemoPlayer | null>(null);
    const { familyId, userId } = useAuthStore();

    const applyOps = useCallback((ops: CanvasOperation[]) => {
        setElements(prev => {
            const next = new Map(prev);
            for (const op of ops) {
                switch (op.action) {
                    case 'show':
                        if (op.element && op.element.id) {
                            // Enforce max 7 elements
                            if (next.size >= 7 && !next.has(op.element.id)) {
                                const firstKey = next.keys().next().value;
                                if (firstKey) next.delete(firstKey);
                            }
                            next.set(op.element.id, op.element as CanvasElement);
                        }
                        break;
                    case 'animate':
                        if (op.elementId && next.has(op.elementId) && op.animation) {
                            const el = { ...next.get(op.elementId)! };
                            const prop = op.animation.property as keyof CanvasElement;
                            (el as any)[prop] = op.animation.to;
                            next.set(op.elementId, el);
                        }
                        break;
                    case 'remove':
                        if (op.elementId) next.delete(op.elementId);
                        break;
                    case 'clear':
                        next.clear();
                        break;
                    case 'highlight':
                        if (op.elementId && next.has(op.elementId)) {
                            const el = { ...next.get(op.elementId)! };
                            el.scale = 1.2;
                            next.set(op.elementId, el);
                            // Reset after 1s
                            setTimeout(() => {
                                setElements(prev2 => {
                                    const n = new Map(prev2);
                                    if (n.has(op.elementId!)) {
                                        const e2 = { ...n.get(op.elementId!)! };
                                        e2.scale = 1;
                                        n.set(op.elementId!, e2);
                                    }
                                    return n;
                                });
                            }, 1000);
                        }
                        break;
                    case 'generate_diagram':
                        // Task 13.9 — call Nano Banana via worker endpoint
                        Logger.info('[EXPLAINER]', 'Diagram generation requested', { prompt: op.diagramPrompt });
                        if (op.diagramPrompt) {
                            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
                            fetch(`${apiUrl}/api/generate-diagram`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer development_secret_token' },
                                body: JSON.stringify({ prompt: op.diagramPrompt }),
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.imageUrl) {
                                        setElements(prev2 => {
                                            const n = new Map(prev2);
                                            n.set(`diagram_${Date.now()}`, {
                                                id: `diagram_${Date.now()}`,
                                                type: 'image',
                                                x: op.element?.x ?? 200,
                                                y: op.element?.y ?? 200,
                                                width: 250,
                                                height: 250,
                                                content: data.imageUrl,
                                                opacity: 1,
                                                scale: 1,
                                            } as CanvasElement);
                                            return n;
                                        });
                                    }
                                })
                                .catch(err => Logger.error('[EXPLAINER]', 'Diagram gen failed', { err }));
                        }
                        break;
                }
            }
            return next;
        });
    }, []);

    useEffect(() => {
        const startSession = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const client = new ExplainerClient(
                    task.id,
                    familyId || 'fam_default',
                    userId || 'learner_unknown',
                    {
                        onStatusChange: setStatus,
                        onCanvasOps: applyOps,
                        onTranscript: (text) => setTranscript(prev => prev + ' ' + text),
                        onError: setErrorMessage,
                    }
                );

                clientRef.current = client;
                await client.connect();
                await client.startAudio(stream);

            } catch (err: any) {
                Logger.error('[EXPLAINER]', 'Session start failed', { err });
                setStatus('error');
                setErrorMessage(err.message || 'Failed to start explainer');
            }
        };

        startSession();

        return () => {
            clientRef.current?.disconnect();
        };
    }, [task.id, familyId, userId, applyOps]);

    const handleClose = () => {
        clientRef.current?.disconnect();
        onClose();
    };

    if (status === 'error') {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold text-destructive mb-4">Explainer Disconnected</h2>
                <p className="text-xl text-muted-foreground mb-8">{errorMessage}</p>
                <Button onClick={onClose} size="lg">Return to Tasks</Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <div>
                        <h2 className="text-lg font-bold text-foreground">
                            {task.capacity}
                        </h2>
                        <p className="text-sm text-muted-foreground">Explainer Canvas</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                        {status === 'connecting' && (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Connecting...
                            </>
                        )}
                        {status === 'active' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <Mic className="w-4 h-4" />
                                Listening
                            </>
                        )}
                        {status === 'ended' && 'Session Ended'}
                    </div>

                    <Button variant="ghost" size="icon" onClick={handleClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Canvas area — the digital whiteboard */}
            <div className="flex-1 relative overflow-hidden bg-muted">
                {/* Grid background for whiteboard feel */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Canvas elements */}
                <AnimatePresence>
                    {Array.from(elements.values()).map(el => (
                        <CanvasElementRenderer key={el.id} element={el} />
                    ))}
                </AnimatePresence>

                {/* Connecting overlay */}
                {status === 'connecting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="text-center space-y-4">
                            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                            <p className="text-xl font-bold text-foreground">Preparing your lesson...</p>
                        </div>
                    </div>
                )}

                {/* Voice visualizer — bottom center */}
                {status === 'active' && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-primary rounded-full shadow-[0_0_40px_hsl(var(--primary)/0.4)] flex items-center justify-center">
                            <div className="w-12 h-12 bg-primary rounded-full animate-pulse opacity-60" />
                            <Mic className="w-6 h-6 text-primary-foreground absolute" />
                        </div>
                    </div>
                )}
            </div>

            {/* Transcript bar */}
            {transcript && (
                <div className="px-6 py-3 border-t border-border bg-card max-h-24 overflow-y-auto">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {transcript.trim()}
                    </p>
                </div>
            )}
        </div>
    );
}
