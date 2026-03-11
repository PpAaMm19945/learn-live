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
// English primitives
import { WordCard, LetterTile, SentenceStrip, StoryPanel, SpeechBubble, PhonicsHighlight, ConnectorArrow } from './EnglishPrimitives';
// Science primitives
import { ObservationCard, ClassificationBin, LifeCycleNode, CurvedArrow, ExperimentStep, ComparisonTable, SafetyBadge } from './SciencePrimitives';

interface ExplainerCanvasProps {
    task: MatrixTask;
    onClose: () => void;
}

/**
 * CountingBlock — a visual primitive for math explanations.
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
 * SVG Primitive wrapper — wraps SVG primitives that use x/y props directly.
 */
function SVGPrimitiveWrapper({ element, children }: { element: CanvasElement; children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: element.opacity ?? 1, scale: element.scale ?? 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute"
            style={{ left: 0, top: 0, pointerEvents: 'none' }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Element renderer — dispatches to the correct visual primitive based on type.
 */
function CanvasElementRenderer({ element }: { element: CanvasElement }) {
    switch (element.type) {
        // Math
        case 'block': return <CountingBlock element={element} />;
        case 'text': return <TextElement element={element} />;
        case 'shape': return <ShapeElement element={element} />;
        case 'image':
        case 'diagram': return <ImageElement element={element} />;
        
        // English
        case 'word_card':
            return <SVGPrimitiveWrapper element={element}><WordCard x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'letter_tile':
            return <SVGPrimitiveWrapper element={element}><LetterTile x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'sentence_strip':
            return <SVGPrimitiveWrapper element={element}><SentenceStrip x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'story_panel':
            return <SVGPrimitiveWrapper element={element}><StoryPanel x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} count={element.count} /></SVGPrimitiveWrapper>;
        case 'speech_bubble':
            return <SVGPrimitiveWrapper element={element}><SpeechBubble x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'phonics_highlight':
            return <SVGPrimitiveWrapper element={element}><PhonicsHighlight x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'connector_arrow':
            return <SVGPrimitiveWrapper element={element}><ConnectorArrow x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} /></SVGPrimitiveWrapper>;
        
        // Science
        case 'observation_card':
            return <SVGPrimitiveWrapper element={element}><ObservationCard x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'classification_bin':
            return <SVGPrimitiveWrapper element={element}><ClassificationBin x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'life_cycle_node':
            return <SVGPrimitiveWrapper element={element}><LifeCycleNode x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} count={element.count} /></SVGPrimitiveWrapper>;
        case 'curved_arrow':
            return <SVGPrimitiveWrapper element={element}><CurvedArrow x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} /></SVGPrimitiveWrapper>;
        case 'experiment_step':
            return <SVGPrimitiveWrapper element={element}><ExperimentStep x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} count={element.count} /></SVGPrimitiveWrapper>;
        case 'comparison_table':
            return <SVGPrimitiveWrapper element={element}><ComparisonTable x={element.x} y={element.y} width={element.width} height={element.height} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        case 'safety_badge':
            return <SVGPrimitiveWrapper element={element}><SafetyBadge x={element.x} y={element.y} color={element.color} label={element.content} /></SVGPrimitiveWrapper>;
        
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
    const { userId } = useAuthStore();
    const familyId = userId?.includes('family_') ? 'family_' + userId.split('family_')[1].split('_child')[0] : null;

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
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || ''}` },
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

    /** Detect the best demo based on task type / domain */
    const detectDemoId = useCallback((): string => {
        const taskType = (task as any).task_type?.toLowerCase() || '';
        const domain = (task as any).domain?.toLowerCase() || '';
        const capacity = (task.capacity || '').toLowerCase();
        
        // English demos
        if (taskType.includes('phonics') || taskType.includes('auditory') || taskType.includes('discrimination')) return 'phonics';
        if (taskType.includes('composition') || taskType.includes('sentence') || taskType.includes('writing')) return 'sentence';
        if (domain.includes('english') || domain.includes('language') || domain.includes('literacy')) return 'phonics';
        
        // Science demos
        if (taskType.includes('observation') || taskType.includes('sensory')) return 'observation';
        if (taskType.includes('life cycle') || capacity.includes('life cycle')) return 'life_cycle';
        if (taskType.includes('classification') || taskType.includes('sorting')) return 'classification';
        if (domain.includes('science') || domain.includes('living') || domain.includes('matter')) return 'observation';
        
        // Math fallback
        return 'addition';
    }, [task]);

    const startDemoMode = useCallback(() => {
        setIsDemoMode(true);
        setElements(new Map());
        setTranscript('');
        const player = new DemoPlayer({
            onStatusChange: setStatus,
            onCanvasOps: applyOps,
            onTranscript: (text) => setTranscript(prev => prev + ' ' + text),
        });
        demoRef.current = player;
        player.play(detectDemoId());
    }, [applyOps, detectDemoId]);

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
                        onError: (msg) => {
                            setErrorMessage(msg);
                            // Auto-fallback to demo mode if live fails
                            Logger.warn('[EXPLAINER]', 'Live session failed, offering demo mode');
                        },
                    }
                );

                clientRef.current = client;
                await client.connect();
                await client.startAudio(stream);

            } catch (err: any) {
                Logger.error('[EXPLAINER]', 'Session start failed, falling back to demo mode', { err });
                setStatus('error');
                setErrorMessage(err.message || 'Failed to start explainer. Try demo mode!');
            }
        };

        startSession();

        return () => {
            clientRef.current?.disconnect();
            demoRef.current?.stop();
        };
    }, [task.id, familyId, userId, applyOps]);

    const handleClose = () => {
        clientRef.current?.disconnect();
        demoRef.current?.stop();
        onClose();
    };

    if (status === 'error' && !isDemoMode) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-3xl font-bold text-destructive mb-4">Explainer Disconnected</h2>
                <p className="text-xl text-muted-foreground mb-6">{errorMessage}</p>
                <div className="flex gap-3">
                    <Button onClick={startDemoMode} size="lg" className="gap-2">
                        <Play className="w-5 h-5" /> Try Demo Mode
                    </Button>
                    <Button onClick={onClose} size="lg" variant="outline">Return to Tasks</Button>
                </div>
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

                <div className="flex items-center gap-3">
                    {isDemoMode && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] uppercase tracking-wider">
                            <Play className="w-3 h-3 mr-1" /> Demo
                        </Badge>
                    )}
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
                                {isDemoMode ? 'Playing' : 'Listening'}
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
