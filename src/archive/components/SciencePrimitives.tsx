import React from 'react';
import { motion } from 'framer-motion';

/**
 * SVG visual primitives for Science explanations.
 * Used by the Explainer Canvas for observation, classification,
 * life cycles, experiments, and comparison tasks.
 */

interface SVGPrimitiveProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
  count?: number;
}

/**
 * Observation Card — a "magnifying glass" themed card for sensory observation tasks.
 * Prompts children to look, touch, smell, listen.
 */
export function ObservationCard({ x, y, width = 180, height = 100, color = 'hsl(142, 71%, 45%)', label = 'What do you see?' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Card */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="14"
        fill="white" stroke={color} strokeWidth="2.5" />
      {/* Magnifying glass icon */}
      <circle cx="28" cy="30" r="12" fill="none" stroke={color} strokeWidth="2.5" />
      <line x1="36" y1="38" x2="44" y2="46" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Label */}
      <text x={width / 2 + 16} y={height / 2} textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="700" fill={color} fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Classification Bin — a container for sorting/grouping tasks.
 * Used for "living vs non-living", "solid vs liquid" type exercises.
 */
export function ClassificationBin({ x, y, width = 160, height = 180, color = 'hsl(200, 90%, 48%)', label = 'Living' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Bin body — trapezoidal bucket shape */}
      <path
        d={`M 12,40 L 4,${height - 8} Q 4,${height - 2} 10,${height - 2} 
            L ${width - 10},${height - 2} Q ${width - 4},${height - 2} ${width - 4},${height - 8} 
            L ${width - 12},40 Z`}
        fill="white" stroke={color} strokeWidth="2.5"
      />
      {/* Bin rim */}
      <rect x="6" y="32" width={width - 12} height="12" rx="6"
        fill={color} />
      {/* Label badge */}
      <rect x={width / 2 - 40} y="4" width="80" height="24" rx="12"
        fill={color} />
      <text x={width / 2} y="18" textAnchor="middle" dominantBaseline="central"
        fontSize="12" fontWeight="800" fill="white" fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Life Cycle Node — a single stage in a life cycle diagram.
 * Connected by arrows to form circular sequences.
 */
export function LifeCycleNode({ x, y, width = 90, height = 90, color = 'hsl(142, 71%, 45%)', label = 'Egg', count }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, delay: (count || 0) * 0.15 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Circular node */}
      <circle cx={width / 2} cy={width / 2 - 6} r={width / 2 - 6}
        fill="white" stroke={color} strokeWidth="3" />
      {/* Stage number */}
      {count !== undefined && (
        <>
          <circle cx={width - 12} cy="12" r="10" fill={color} />
          <text x={width - 12} y="13" textAnchor="middle" dominantBaseline="central"
            fontSize="11" fontWeight="800" fill="white" fontFamily="system-ui">
            {count}
          </text>
        </>
      )}
      {/* Stage label */}
      <text x={width / 2} y={height - 6} textAnchor="middle" dominantBaseline="central"
        fontSize="12" fontWeight="700" fill={color} fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Curved Arrow — connects life cycle nodes or shows transformation.
 */
export function CurvedArrow({ x, y, width = 60, height = 40, color = 'hsl(0, 0%, 50%)' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      <path d={`M 4,${height / 2} Q ${width / 2},2 ${width - 12},${height / 2}`}
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={`${width - 4},${height / 2} ${width - 14},${height / 2 - 5} ${width - 14},${height / 2 + 5}`}
        fill={color} />
    </motion.svg>
  );
}

/**
 * Experiment Step — a numbered procedure card for science experiments.
 * Shows step number, instruction text, and optional safety icon.
 */
export function ExperimentStep({ x, y, width = 280, height = 64, color = 'hsl(217, 89%, 61%)', label = 'Mix the two liquids together.', count = 1 }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, delay: ((count || 1) - 1) * 0.2 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Step card */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="10"
        fill="white" stroke={color} strokeWidth="2" />
      {/* Step number circle */}
      <circle cx="28" cy={height / 2} r="16" fill={color} />
      <text x="28" y={height / 2 + 1} textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="900" fill="white" fontFamily="system-ui">
        {count}
      </text>
      {/* Instruction */}
      <text x="54" y={height / 2 + 1} dominantBaseline="central"
        fontSize="13" fontWeight="600" fill="hsl(0, 0%, 25%)" fontFamily="system-ui">
        {(label || '').length > 35 ? (label || '').slice(0, 35) + '...' : label}
      </text>
    </motion.svg>
  );
}

/**
 * Comparison Table — side-by-side attribute comparison.
 * Used for comparing properties of materials, organisms, etc.
 */
export function ComparisonTable({ x, y, width = 320, height = 160, color = 'hsl(25, 95%, 53%)', label = 'Rock vs Sponge' }: SVGPrimitiveProps) {
  const items = (label || '').split(' vs ');
  const left = items[0] || 'Item A';
  const right = items[1] || 'Item B';
  const midX = width / 2;

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Table outline */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="12"
        fill="white" stroke={color} strokeWidth="2" />
      {/* Header row */}
      <rect x="2" y="2" width={width - 4} height="36" rx="12"
        fill={color} />
      {/* Fix bottom corners of header */}
      <rect x="2" y="26" width={width - 4} height="14" fill={color} />
      {/* Divider line */}
      <line x1={midX} y1="2" x2={midX} y2={height - 2} stroke={color} strokeWidth="1.5" opacity="0.4" />
      {/* Column headers */}
      <text x={midX / 2} y="22" textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="800" fill="white" fontFamily="system-ui">
        {left}
      </text>
      <text x={midX + midX / 2} y="22" textAnchor="middle" dominantBaseline="central"
        fontSize="14" fontWeight="800" fill="white" fontFamily="system-ui">
        {right}
      </text>
      {/* Attribute rows (placeholder) */}
      {['Look', 'Feel', 'Sound'].map((attr, i) => (
        <g key={attr}>
          <text x="14" y={58 + i * 30} fontSize="11" fontWeight="600" fill="hsl(0,0%,50%)" fontFamily="system-ui">
            {attr}:
          </text>
          <line x1="4" y1={70 + i * 30} x2={width - 4} y2={70 + i * 30}
            stroke="hsl(0,0%,90%)" strokeWidth="1" />
        </g>
      ))}
    </motion.svg>
  );
}

/**
 * Safety Badge — warning indicator for science activities with risk.
 */
export function SafetyBadge({ x, y, width = 44, height = 44, color = 'hsl(0, 84%, 60%)', label = '!' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      width={width} height={height}
      viewBox="0 0 44 44"
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Triangle */}
      <polygon points="22,4 40,38 4,38" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <text x="22" y="28" textAnchor="middle" dominantBaseline="central"
        fontSize="20" fontWeight="900" fill={color} fontFamily="system-ui">
        {label || '!'}
      </text>
    </motion.svg>
  );
}
