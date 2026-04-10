import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { resolveImageUrl } from '@/lib/r2Assets';

interface R2ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Path — can be legacy local, R2 key, or full URL */
  src: string;
  alt: string;
  /** Show a skeleton shimmer while loading (default true) */
  showSkeleton?: boolean;
  /** Additional wrapper class */
  wrapperClassName?: string;
}

/**
 * Progressive-loading image component for R2-hosted assets.
 * Shows a skeleton shimmer while loading, fades in when ready,
 * and shows a fallback on error.
 */
export const R2Image: React.FC<R2ImageProps> = ({
  src,
  alt,
  showSkeleton = true,
  wrapperClassName,
  className,
  ...props
}) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const imgRef = useRef<HTMLImageElement>(null);
  const resolvedUrl = resolveImageUrl(src);

  // Reset status when src changes
  useEffect(() => {
    setStatus('loading');
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      {/* Skeleton shimmer */}
      {showSkeleton && status === 'loading' && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-inherit" />
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <span className="text-muted-foreground text-sm text-center px-4">
            {alt || 'Image unavailable'}
          </span>
        </div>
      )}

      <img
        ref={imgRef}
        src={resolvedUrl}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={cn(
          'transition-opacity duration-500',
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  );
};
