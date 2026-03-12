import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CanvasElement {
    id: string;
    type: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    content?: string;
    color?: string;
    opacity?: number;
    scale?: number;
    rotation?: number;
    // Map overlay properties
    regionId?: string;
    fillColor?: string;
    label?: string;
    // Timeline properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events?: any[];
    startYear?: number;
    endYear?: number;
    // Figure properties
    name?: string;
    title?: string;
    portraitUrl?: string;
    quote?: string;
    // Route properties
    from?: number[];
    to?: number[];
    style?: string;
}

interface HistoryCanvasProps {
    elements: CanvasElement[];
    baseMapUrl?: string | null;
    width: number;
    height: number;
}

export function HistoryCanvas({ elements, baseMapUrl, width, height }: HistoryCanvasProps) {
    return (
        <div className="relative overflow-hidden bg-card border border-border rounded-xl" style={{ width: '100%', aspectRatio: `${width}/${height}` }}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full text-foreground"
                preserveAspectRatio="xMidYMid meet"
            >
                {baseMapUrl && (
                    <image
                        href={baseMapUrl}
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        preserveAspectRatio="xMidYMid slice"
                        opacity={0.8}
                    />
                )}

                <AnimatePresence>
                    {elements.map((el) => {
                        const { id, type, x = 0, y = 0, opacity = 1, scale = 1, rotation = 0 } = el;

                        const commonAnimProps = {
                            initial: { opacity: 0, scale: 0.8 },
                            animate: { opacity, scale, rotate: rotation, x, y },
                            exit: { opacity: 0, scale: 0.8 },
                            transition: { type: 'spring', stiffness: 100, damping: 20 },
                        };

                        // Default properties for simpler elements

                        if (type === 'block' || type === 'shape') {
                            return (
                                <motion.rect
                                    key={id}
                                    width={el.width || 100}
                                    height={el.height || 100}
                                    fill={el.color || 'var(--primary)'}
                                    rx="8"
                                    {...commonAnimProps}
                                />
                            );
                        }

                        if (type === 'text') {
                            return (
                                <motion.text
                                    key={id}
                                    fill={el.color || 'currentColor'}
                                    fontSize={el.width ? el.width / 5 : 24} // Rough approximation
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    {...commonAnimProps}
                                >
                                    {el.content}
                                </motion.text>
                            );
                        }

                        if (type === 'map_overlay') {
                            // Dummy path representation for a region
                            return (
                                <motion.g key={id} {...commonAnimProps}>
                                    <path
                                        d={`M0,0 Q${width / 4},${height / 4} ${width / 2},0 T${width},0 L${width},${height} L0,${height} Z`}
                                        fill={el.fillColor || 'var(--primary)'}
                                        opacity={el.opacity || 0.4}
                                    />
                                    {el.label && (
                                        <text
                                            x={width / 2}
                                            y={height / 2}
                                            fill="currentColor"
                                            fontSize="24"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            className="drop-shadow-md"
                                        >
                                            {el.label}
                                        </text>
                                    )}
                                </motion.g>
                            );
                        }

                        if (type === 'timeline') {
                            return (
                                <motion.g key={id} {...commonAnimProps} y={height - 50}>
                                    <rect width={width - 100} height="10" x="50" fill="var(--muted)" rx="5" />
                                    {el.events?.map((ev, idx) => (
                                        <g key={idx} transform={`translate(${50 + (idx * ((width - 100) / (el.events?.length || 1)))}, 0)`}>
                                            <circle r="8" fill="var(--primary)" />
                                            <text y="-15" fill="currentColor" fontSize="14" textAnchor="middle">{ev.year}</text>
                                            <text y="25" fill="currentColor" fontSize="12" textAnchor="middle">{ev.label}</text>
                                        </g>
                                    ))}
                                </motion.g>
                            );
                        }

                        if (type === 'figure') {
                            return (
                                <motion.g key={id} {...commonAnimProps} x={width - 250} y={50}>
                                    <rect width="200" height="300" fill="var(--card)" stroke="var(--border)" strokeWidth="2" rx="12" />
                                    {el.portraitUrl && (
                                        <image href={el.portraitUrl} width="180" height="180" x="10" y="10" preserveAspectRatio="xMidYMid slice" className="rounded-t-lg" />
                                    )}
                                    <text x="100" y="210" fill="currentColor" fontSize="20" fontWeight="bold" textAnchor="middle">{el.name}</text>
                                    <text x="100" y="230" fill="var(--muted-foreground)" fontSize="14" textAnchor="middle">{el.title}</text>
                                    {el.quote && (
                                        <foreignObject x="10" y="240" width="180" height="50">
                                            <div xmlns="http://www.w3.org/1999/xhtml" className="text-xs text-center italic text-muted-foreground line-clamp-2">
                                                "{el.quote}"
                                            </div>
                                        </foreignObject>
                                    )}
                                </motion.g>
                            );
                        }

                        if (type === 'highlight_route' && el.from && el.to) {
                            const [fx, fy] = el.from;
                            const [tx, ty] = el.to;
                            const strokeStyle = el.style === 'trade' ? '5,5' : el.style === 'migration' ? '10,5' : '0';
                            return (
                                <motion.g key={id} {...commonAnimProps}>
                                    <motion.line
                                        x1={fx} y1={fy} x2={tx} y2={ty}
                                        stroke={el.color || 'var(--primary)'}
                                        strokeWidth="4"
                                        strokeDasharray={strokeStyle}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                                    />
                                    {/* Arrowhead */}
                                    <polygon points={`${tx},${ty} ${tx-10},${ty-10} ${tx-10},${ty+10}`} fill={el.color || 'var(--primary)'} />
                                </motion.g>
                            );
                        }

                        return null;
                    })}
                </AnimatePresence>
            </motion.svg>
        </div>
    );
}
