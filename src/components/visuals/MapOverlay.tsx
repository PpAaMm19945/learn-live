import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface TransformValues {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
}

export interface MapOverlayProps {
  pngUrl: string;
  svgUrl?: string;
  transform?: TransformValues;
  highlights?: string[];
  activeRegion?: string;
  band: number;
}

export const MapOverlay: React.FC<MapOverlayProps> = ({
  pngUrl,
  svgUrl,
  transform,
  highlights = [],
  activeRegion,
  band,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (band > 0 && svgUrl) {
      fetch(svgUrl)
        .then((res) => res.text())
        .then((text) => setSvgContent(text))
        .catch((err) => console.error('Failed to load SVG:', err));
    }
  }, [svgUrl, band]);

  const showSvg = band > 0 && svgContent && transform;

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <img
        src={pngUrl}
        alt="Map Base"
        className="absolute w-full h-full object-contain"
      />

      {showSvg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scaleX}, ${transform.scaleY}) rotate(${transform.rotate}deg)`,
            transformOrigin: 'center center',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </motion.div>
  );
};
