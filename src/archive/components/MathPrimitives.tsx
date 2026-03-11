import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pre-built SVG visual primitives for math explanations — Task 13.5
 * These render as animated SVG elements the Explainer Agent can place on the canvas.
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

/** A single colored counting cube with optional number label */
export function CountingCube({ x, y, width = 56, height = 56, color = 'hsl(var(--primary))', label }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      width={width} height={height}
      viewBox="0 0 56 56"
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* 3D cube face */}
      <rect x="4" y="8" width="40" height="40" rx="6" fill={color} opacity="0.9" />
      <rect x="12" y="2" width="40" height="40" rx="6" fill={color} />
      <polygon points="4,8 12,2 12,42 4,48" fill={color} opacity="0.7" />
      {label && (
        <text x="32" y="28" textAnchor="middle" dominantBaseline="central"
          fill="white" fontSize="20" fontWeight="800" fontFamily="system-ui">
          {label}
        </text>
      )}
    </motion.svg>
  );
}

/** A row of counting cubes — for showing groups */
export function CountingRow({ x, y, count = 5, width = 48, color = 'hsl(217, 89%, 61%)' }: SVGPrimitiveProps) {
  const gap = 8;
  const cubeSize = width;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', delay: i * 0.1, stiffness: 400, damping: 20 }}
          width={cubeSize} height={cubeSize}
          viewBox="0 0 48 48"
          style={{ position: 'absolute', left: x + i * (cubeSize + gap), top: y }}
        >
          <rect x="2" y="2" width="44" height="44" rx="8" fill={color} />
          <text x="24" y="26" textAnchor="middle" dominantBaseline="central"
            fill="white" fontSize="18" fontWeight="700" fontFamily="system-ui">
            {i + 1}
          </text>
        </motion.svg>
      ))}
    </>
  );
}

/** Number line segment */
export function NumberLine({ x, y, width = 500, count = 10, color = 'hsl(var(--foreground))' }: SVGPrimitiveProps) {
  const tickSpacing = width / count;
  return (
    <motion.svg
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      width={width + 40} height={60}
      style={{ position: 'absolute', left: x, top: y, transformOrigin: 'left center' }}
    >
      {/* Main line */}
      <line x1="20" y1="30" x2={width + 20} y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Arrow */}
      <polygon points={`${width + 20},30 ${width + 10},24 ${width + 10},36`} fill={color} />
      {/* Ticks and labels */}
      {Array.from({ length: count + 1 }).map((_, i) => (
        <g key={i}>
          <line
            x1={20 + i * tickSpacing} y1="22"
            x2={20 + i * tickSpacing} y2="38"
            stroke={color} strokeWidth="2"
          />
          <text
            x={20 + i * tickSpacing} y="52"
            textAnchor="middle" fontSize="12" fontWeight="600"
            fill={color} fontFamily="system-ui"
          >
            {i}
          </text>
        </g>
      ))}
    </motion.svg>
  );
}

/** Grouping circle — wraps around blocks to show equal groups */
export function GroupCircle({ x, y, width = 120, height = 80, color = 'hsl(var(--primary))', label }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.8 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      width={width + 20} height={height + 30}
      style={{ position: 'absolute', left: x - 10, top: y - 10 }}
    >
      <ellipse
        cx={(width + 20) / 2} cy={(height + 10) / 2}
        rx={width / 2 + 5} ry={height / 2 + 5}
        fill="none" stroke={color} strokeWidth="3" strokeDasharray="8 4"
      />
      {label && (
        <text
          x={(width + 20) / 2} y={height + 22}
          textAnchor="middle" fontSize="14" fontWeight="700"
          fill={color} fontFamily="system-ui"
        >
          {label}
        </text>
      )}
    </motion.svg>
  );
}

/** Plus/Minus/Equals operator sign */
export function OperatorSign({ x, y, label = '+', color = 'hsl(var(--foreground))' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      width={40} height={40}
      style={{ position: 'absolute', left: x, top: y }}
    >
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="2" />
      <text x="20" y="22" textAnchor="middle" dominantBaseline="central"
        fontSize="22" fontWeight="800" fill={color} fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/** Fraction bar — visual representation of a fraction */
export function FractionBar({ x, y, width = 200, count = 4, filled = 1, color = 'hsl(217, 89%, 61%)' }: SVGPrimitiveProps & { filled?: number }) {
  const segWidth = width / (count || 4);
  return (
    <motion.svg
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      width={width + 4} height={44}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {Array.from({ length: count || 4 }).map((_, i) => (
        <rect
          key={i}
          x={2 + i * segWidth} y="2"
          width={segWidth - 2} height="40" rx="4"
          fill={i < (filled || 0) ? color : 'hsl(var(--muted))'}
          stroke="hsl(var(--border))" strokeWidth="1"
        />
      ))}
    </motion.svg>
  );
}
