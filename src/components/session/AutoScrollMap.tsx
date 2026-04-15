import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { resolveImageCandidates } from '@/lib/r2Assets';

interface AutoScrollMapProps {
  src: string;
  alt: string;
  /** Scroll speed in px per second */
  speed?: number;
  /** Maximum zoom level (1-4) */
  maxZoom?: number;
}

/**
 * AutoScrollMap — Fits a landscape map by height to the container,
 * then slowly auto-scrolls left to right to reveal the full width.
 * Students can interact (drag/touch) to pan manually; after release,
 * auto-scroll resumes. Supports scroll-wheel and pinch-to-zoom (1x-4x).
 */
export function AutoScrollMap({ src, alt, speed = 15, maxZoom = 4 }: AutoScrollMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const [isUserDragging, setIsUserDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);
  const dragStartRef = useRef({ x: 0, y: 0, scrollX: 0, scrollY: 0 });
  const scrollYRef = useRef(0);
  const [maxScrollY, setMaxScrollY] = useState(0);
  const srcCandidates = resolveImageCandidates(src);
  const activeSrc = srcCandidates[candidateIndex] || src;

  // Pinch tracking
  const pinchStartDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);

  useEffect(() => {
    setCandidateIndex(0);
    setImgLoaded(false);
    setImgFailed(false);
    setScale(1);
    scaleRef.current = 1;
    scrollRef.current = 0;
    scrollYRef.current = 0;
  }, [src]);

  const computeMaxScroll = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const naturalWidth = imgRef.current.naturalWidth;
    const naturalHeight = imgRef.current.naturalHeight;
    
    const baseScale = containerHeight / naturalHeight;
    const scaledWidth = naturalWidth * baseScale * scaleRef.current;
    const scaledHeight = containerHeight * scaleRef.current;
    const overflowX = Math.max(0, scaledWidth - containerWidth);
    const overflowY = Math.max(0, scaledHeight - containerHeight);
    setMaxScroll(overflowX);
    setMaxScrollY(overflowY);
  }, []);

  useEffect(() => {
    if (imgLoaded) computeMaxScroll();
    window.addEventListener('resize', computeMaxScroll);
    return () => window.removeEventListener('resize', computeMaxScroll);
  }, [imgLoaded, computeMaxScroll, scale]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!imgLoaded || isUserDragging || maxScroll <= 0) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      scrollRef.current += speed * directionRef.current * dt;

      if (scrollRef.current >= maxScroll) {
        scrollRef.current = maxScroll;
        directionRef.current = -1;
      } else if (scrollRef.current <= 0) {
        scrollRef.current = 0;
        directionRef.current = 1;
      }

      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${scaleRef.current}) translateX(-${scrollRef.current / scaleRef.current}px) translateY(-${scrollYRef.current / scaleRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [imgLoaded, isUserDragging, maxScroll, speed]);

  const applyTransform = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.style.transform = `scale(${scaleRef.current}) translateX(-${scrollRef.current / scaleRef.current}px) translateY(-${scrollYRef.current / scaleRef.current}px)`;
    }
  }, []);

  // Mouse/touch handlers for manual panning
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsUserDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, scrollX: scrollRef.current, scrollY: scrollYRef.current };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isUserDragging) return;
    const dx = dragStartRef.current.x - e.clientX;
    const dy = dragStartRef.current.y - e.clientY;
    scrollRef.current = Math.max(0, Math.min(maxScroll, dragStartRef.current.scrollX + dx));
    scrollYRef.current = Math.max(0, Math.min(maxScrollY, dragStartRef.current.scrollY + dy));
    applyTransform();
  }, [isUserDragging, maxScroll, maxScrollY, applyTransform]);

  const handlePointerUp = useCallback(() => {
    setIsUserDragging(false);
  }, []);

  // Scroll-wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    const newScale = Math.max(1, Math.min(maxZoom, scaleRef.current + delta));
    scaleRef.current = newScale;
    setScale(newScale);
    computeMaxScroll();
    // Clamp scroll positions after zoom change
    scrollRef.current = Math.max(0, Math.min(maxScroll, scrollRef.current));
    scrollYRef.current = Math.max(0, Math.min(maxScrollY, scrollYRef.current));
    applyTransform();
  }, [computeMaxScroll, maxScroll, maxScrollY, applyTransform]);

  // Pinch-to-zoom via touch events
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistRef.current = Math.hypot(dx, dy);
        pinchStartScaleRef.current = scaleRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ratio = dist / pinchStartDistRef.current;
        const newScale = Math.max(1, Math.min(maxZoom, pinchStartScaleRef.current * ratio));
        scaleRef.current = newScale;
        setScale(newScale);
        computeMaxScroll();
        applyTransform();
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [computeMaxScroll, applyTransform]);

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
      onWheel={handleWheel}
    >
      {imgFailed ? (
        <div className="w-full h-full flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground text-sm italic">Map loading…</p>
        </div>
      ) : (
        <>
          <img
            ref={imgRef}
            src={activeSrc}
            alt={alt}
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              if (candidateIndex < srcCandidates.length - 1) {
                setCandidateIndex((prev) => prev + 1);
              } else {
                setImgFailed(true);
              }
            }}
            className="h-full w-auto max-w-none select-none"
            style={{ willChange: 'transform', imageRendering: 'auto', transformOrigin: 'top left' }}
            draggable={false}
          />
          {maxScroll > 0 && (
            <>
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background/40 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/40 to-transparent pointer-events-none" />
            </>
          )}
          {/* Zoom indicator */}
          {scale > 1.05 && (
            <div className="absolute bottom-2 right-2 bg-card/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-md pointer-events-none">
              {Math.round(scale * 100)}%
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
