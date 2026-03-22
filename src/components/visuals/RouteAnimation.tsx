import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface RouteAnimationProps {
  svgPathId: string;
  style: 'dotted' | 'solid' | 'arrow';
  durationMs: number;
  isPlaying: boolean;
  band?: number;
}

export const RouteAnimation: React.FC<RouteAnimationProps> = ({
  svgPathId,
  style,
  durationMs,
  isPlaying,
}) => {
  const controls = useAnimation();

  useEffect(() => {
    // This effect expects the SVG path with id `svgPathId` to be present in the DOM,
    // which should be loaded by the MapOverlay component.
    const pathElement = document.getElementById(svgPathId) as unknown as SVGPathElement | null;
    if (pathElement) {
      const length = pathElement.getTotalLength();

      // Set initial state
      pathElement.style.strokeDasharray = `${length} ${length}`;
      pathElement.style.strokeDashoffset = isPlaying ? '0' : `${length}`;

      // We apply standard styles via CSS classes, but here we can force some styles if needed
      if (style === 'dotted') {
        pathElement.style.strokeDasharray = `10 10`;
      }

      if (isPlaying) {
         // Animate using Web Animations API for direct DOM manipulation
        pathElement.animate(
          [
            { strokeDashoffset: length },
            { strokeDashoffset: 0 }
          ],
          {
            duration: durationMs,
            easing: 'ease-in-out',
            fill: 'forwards'
          }
        );
      }
    }
  }, [svgPathId, durationMs, isPlaying, style]);

  // This component doesn't render any DOM elements itself; it orchestrates
  // the animation of an existing SVG path rendered by MapOverlay.
  return null;
};
