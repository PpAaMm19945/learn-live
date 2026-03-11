import React from 'react';
import { motion } from 'framer-motion';

/**
 * SVG visual primitives for English / Language Arts explanations.
 * Used by the Explainer Canvas to render phonics, vocabulary,
 * grammar, composition, and oral expression visuals.
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
 * Word Card — displays a word prominently, optionally with phonics highlighting.
 * Used for vocabulary, spelling, and word recognition tasks.
 */
export function WordCard({ x, y, width = 160, height = 72, color = 'hsl(262, 83%, 58%)', label = 'word' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Card background */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="12" 
        fill="white" stroke={color} strokeWidth="3" />
      {/* Word text */}
      <text x={width / 2} y={height / 2 + 2} textAnchor="middle" dominantBaseline="central"
        fontSize={Math.min(28, width / label.length * 1.4)} fontWeight="800" fill={color} fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Letter Tile — individual letter blocks for building words.
 * Used for phonics and spelling tasks.
 */
export function LetterTile({ x, y, width = 52, height = 56, color = 'hsl(217, 89%, 61%)', label = 'A' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Tile with slight 3D effect */}
      <rect x="2" y="6" width={width - 4} height={height - 8} rx="8" 
        fill={color} opacity="0.3" />
      <rect x="2" y="2" width={width - 4} height={height - 8} rx="8" 
        fill={color} />
      <text x={width / 2} y={height / 2 - 1} textAnchor="middle" dominantBaseline="central"
        fontSize="26" fontWeight="900" fill="white" fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Sentence Strip — a horizontal bar showing a sentence with word-level highlighting.
 * Used for grammar and composition tasks.
 */
export function SentenceStrip({ x, y, width = 500, height = 56, color = 'hsl(142, 71%, 45%)', label = 'The cat sat on the mat.' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Strip background */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="10" 
        fill="white" stroke={color} strokeWidth="2.5" strokeDasharray="0" />
      {/* Lined paper effect */}
      <line x1="16" y1={height - 14} x2={width - 16} y2={height - 14} 
        stroke={color} strokeWidth="1.5" opacity="0.4" />
      {/* Sentence text */}
      <text x={width / 2} y={height / 2 - 2} textAnchor="middle" dominantBaseline="central"
        fontSize="16" fontWeight="600" fill="hsl(0, 0%, 20%)" fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Story Panel — a rectangular frame for sequential storytelling.
 * Shows a scene label and number for narrative ordering tasks.
 */
export function StoryPanel({ x, y, width = 180, height = 140, color = 'hsl(25, 95%, 53%)', label = 'Beginning', count }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Panel frame */}
      <rect x="3" y="3" width={width - 6} height={height - 6} rx="12" 
        fill="white" stroke={color} strokeWidth="3" />
      {/* Panel number badge */}
      {count !== undefined && (
        <>
          <circle cx="24" cy="24" r="14" fill={color} />
          <text x="24" y="25" textAnchor="middle" dominantBaseline="central"
            fontSize="14" fontWeight="800" fill="white" fontFamily="system-ui">
            {count}
          </text>
        </>
      )}
      {/* Scene illustration area (placeholder lines) */}
      <rect x="16" y="44" width={width - 32} height={height - 76} rx="6" 
        fill="hsl(0, 0%, 96%)" stroke="hsl(0, 0%, 85%)" strokeWidth="1" strokeDasharray="4 2" />
      {/* Label */}
      <text x={width / 2} y={height - 16} textAnchor="middle" dominantBaseline="central"
        fontSize="13" fontWeight="700" fill={color} fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Speech Bubble — for oral expression and dialogue tasks.
 * Shows text with a speech pointer.
 */
export function SpeechBubble({ x, y, width = 220, height = 80, color = 'hsl(200, 90%, 48%)', label = 'Hello!' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      width={width + 20} height={height + 24}
      viewBox={`0 0 ${width + 20} ${height + 24}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Bubble */}
      <rect x="10" y="2" width={width} height={height} rx="16" 
        fill="white" stroke={color} strokeWidth="2.5" />
      {/* Pointer tail */}
      <polygon 
        points={`30,${height + 2} 50,${height + 2} 20,${height + 22}`}
        fill="white" stroke={color} strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* Cover the overlap between bubble and tail */}
      <rect x="28" y={height - 1} width="24" height="5" fill="white" />
      {/* Text */}
      <text x={width / 2 + 10} y={height / 2 + 2} textAnchor="middle" dominantBaseline="central"
        fontSize="15" fontWeight="600" fill="hsl(0, 0%, 20%)" fontFamily="system-ui">
        {label}
      </text>
    </motion.svg>
  );
}

/**
 * Phonics Highlight — shows a word with a specific sound highlighted.
 * The highlighted portion is shown in a contrasting color.
 */
export function PhonicsHighlight({ x, y, width = 200, height = 70, color = 'hsl(340, 82%, 52%)', label = 'c|a|t' }: SVGPrimitiveProps) {
  // label format: "c|a|t" where | separates phonemes, * marks the highlighted one
  // e.g., "c|*a|t" highlights the 'a'
  const parts = label.split('|');
  const totalChars = parts.join('').replace(/\*/g, '').length;
  const charWidth = Math.min(36, (width - 40) / totalChars);
  
  let currentX = 20;
  
  return (
    <motion.svg
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', left: x, top: y }}
    >
      {/* Background */}
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="12" 
        fill="white" stroke="hsl(0, 0%, 85%)" strokeWidth="2" />
      {/* Phoneme segments */}
      {parts.map((part, i) => {
        const isHighlighted = part.startsWith('*');
        const text = part.replace('*', '');
        const segWidth = text.length * charWidth;
        const xPos = currentX;
        currentX += segWidth + 4;
        
        return (
          <g key={i}>
            {isHighlighted && (
              <rect x={xPos - 4} y="10" width={segWidth + 8} height={height - 20} rx="6"
                fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
            )}
            <text x={xPos + segWidth / 2} y={height / 2 + 1} textAnchor="middle" dominantBaseline="central"
              fontSize="28" fontWeight="800" 
              fill={isHighlighted ? color : 'hsl(0, 0%, 25%)'} fontFamily="system-ui">
              {text}
            </text>
          </g>
        );
      })}
    </motion.svg>
  );
}

/**
 * Connector Arrow — links elements (e.g., word to definition, sentence parts).
 */
export function ConnectorArrow({ x, y, width = 100, height = 4, color = 'hsl(0, 0%, 50%)' }: SVGPrimitiveProps) {
  return (
    <motion.svg
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      width={width} height={20}
      viewBox={`0 0 ${width} 20`}
      style={{ position: 'absolute', left: x, top: y, transformOrigin: 'left center' }}
    >
      <line x1="0" y1="10" x2={width - 10} y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points={`${width},10 ${width - 12},4 ${width - 12},16`} fill={color} />
    </motion.svg>
  );
}
