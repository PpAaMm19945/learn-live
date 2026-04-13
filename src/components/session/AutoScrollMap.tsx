import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { R2Image } from '@/components/ui/R2Image';

interface AutoScrollMapProps {
  src: string;
  alt: string;
  /** Scroll speed in px per second */
  speed?: number;
}

/**
 * AutoScrollMap — Fits a landscape map by height to the container,
 * then slowly auto-scrolls left to right to reveal the full width.
 * Students can interact (drag/touch) to pan manually; after release,
 * auto-scroll resumes.
 */
export function AutoScrollMap({ src, alt, speed = 15 }: AutoScrollMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const dragStartRef = useRef({ x: 0, scrollX: 0 });

  const computeMaxScroll = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const naturalWidth = imgRef.current.naturalWidth;
    const naturalHeight = imgRef.current.naturalHeight;
    
    // Scale by height to fill vertically
    const scale = containerHeight / naturalHeight;
    const scaledWidth = naturalWidth * scale;
    const overflow = Math.max(0, scaledWidth - containerWidth);
    setMaxScroll(overflow);
  }, []);

  useEffect(() => {
    if (imgLoaded) computeMaxScroll();
    window.addEventListener('resize', computeMaxScroll);
    return () => window.removeEventListener('resize', computeMaxScroll);
  }, [imgLoaded, computeMaxScroll]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!imgLoaded || isUserDragging || maxScroll <= 0) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      scrollRef.current += speed * directionRef.current * dt;

      // Bounce at edges
      if (scrollRef.current >= maxScroll) {
        scrollRef.current = maxScroll;
        directionRef.current = -1;
      } else if (scrollRef.current <= 0) {
        scrollRef.current = 0;
        directionRef.current = 1;
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `translateX(-${scrollRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [imgLoaded, isUserDragging, maxScroll, speed]);

  // Mouse/touch handlers for manual panning
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsUserDragging(true);
    dragStartRef.current = { x: e.clientX, scrollX: scrollRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isUserDragging) return;
    const dx = dragStartRef.current.x - e.clientX;
    const newScroll = Math.max(0, Math.min(maxScroll, dragStartRef.current.scrollX + dx));
    scrollRef.current = newScroll;
    if (imgRef.current) {
      imgRef.current.style.transform = `translateX(-${newScroll}px)`;
    }
  }, [isUserDragging, maxScroll]);

  const handlePointerUp = useCallback(() => {
    setIsUserDragging(false);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing bg-muted/10"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setImgLoaded(true)}
        className="h-full w-auto max-w-none select-none"
        style={{ 
          willChange: 'transform',
          imageRendering: 'auto',
        }}
        draggable={false}
      />
      {/* Subtle edge fade to indicate scrollable content */}
      {maxScroll > 0 && (
        <>
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/40 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/40 to-transparent pointer-events-none" />
        </>
      )}
    </motion.div>
  );
}
