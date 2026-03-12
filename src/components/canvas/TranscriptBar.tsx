import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TranscriptBarProps {
    text: string;
    sceneContext?: {
        era?: string;
        location?: string;
        figures?: string[];
    };
}

export function TranscriptBar({ text, sceneContext }: TranscriptBarProps) {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.scrollTop = textRef.current.scrollHeight;
        }
    }, [text]);

    return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div
                ref={textRef}
                className="flex-1 overflow-y-auto max-h-32 pr-4 scrollbar-thin scrollbar-thumb-muted"
            >
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg leading-relaxed text-foreground"
                >
                    {text || "Waiting for narration..."}
                </motion.p>
            </div>

            {sceneContext && (
                <div className="hidden md:flex flex-col space-y-2 border-l border-border pl-6 w-48 shrink-0 text-sm">
                    {sceneContext.era && (
                        <div>
                            <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Era</span>
                            <span>{sceneContext.era}</span>
                        </div>
                    )}
                    {sceneContext.location && (
                        <div>
                            <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Location</span>
                            <span>{sceneContext.location}</span>
                        </div>
                    )}
                    {sceneContext.figures && sceneContext.figures.length > 0 && (
                        <div>
                            <span className="font-semibold text-muted-foreground block text-xs uppercase tracking-wider">Key Figures</span>
                            <span className="line-clamp-2">{sceneContext.figures.join(', ')}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
