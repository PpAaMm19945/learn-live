import { motion, AnimatePresence } from 'framer-motion';

export interface CanvasElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'image' | 'path';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  r?: number;
  cx?: number;
  cy?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  href?: string;
  d?: string;
  strokeDasharray?: string;
  strokeDashoffset?: number;
}

interface HistoryCanvasProps {
  elements: CanvasElement[];
  baseMapUrl?: string | null;
  width: number;
  height: number;
}

export function HistoryCanvas({ elements, baseMapUrl, width, height }: HistoryCanvasProps) {
  return (
    <div className="w-full h-full bg-card rounded-lg overflow-hidden border border-border shadow-sm flex items-center justify-center relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <AnimatePresence>
          {baseMapUrl && (
            <motion.image
              key="baseMap"
              href={baseMapUrl}
              x={0}
              y={0}
              width={width}
              height={height}
              preserveAspectRatio="xMidYMid slice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}

          {elements.map((el) => {
            const commonProps = {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: el.opacity ?? 1, scale: 1 },
              exit: { opacity: 0, scale: 0.9 },
              transition: { duration: 0.5, ease: 'easeOut' as const },
            };

            switch (el.type) {
              case 'rect':
                return (
                  <motion.rect
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    rx={el.rx}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    {...commonProps}
                  />
                );
              case 'circle':
                return (
                  <motion.circle
                    key={el.id}
                    cx={el.cx}
                    cy={el.cy}
                    r={el.r}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    {...commonProps}
                  />
                );
              case 'text':
                return (
                  <motion.text
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    fill={el.fill || 'currentColor'}
                    fontSize={el.fontSize}
                    fontFamily={el.fontFamily || 'Inter, sans-serif'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    {...commonProps}
                  >
                    {el.text}
                  </motion.text>
                );
              case 'image':
                return (
                  <motion.image
                    key={el.id}
                    href={el.href}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    preserveAspectRatio="xMidYMid slice"
                    {...commonProps}
                  />
                );
              case 'path':
                return (
                  <motion.path
                    key={el.id}
                    d={el.d}
                    fill={el.fill || 'none'}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    strokeDasharray={el.strokeDasharray}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: el.opacity ?? 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' as const }}
                  />
                );
              default:
                return null;
            }
          })}
        </AnimatePresence>
      </svg>
    </div>
  );
}
