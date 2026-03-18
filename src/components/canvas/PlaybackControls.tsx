import { Button } from '@/components/ui/button';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  band: number;
  className?: string;
}

export function PlaybackControls({
  isPlaying,
  onToggle,
  speed,
  onSpeedChange,
  band,
  className,
}: PlaybackControlsProps) {
  const showSpeedControls = band >= 3;

  return (
    <div className={cn('flex items-center gap-4 bg-card px-4 py-2 rounded-lg border border-border shadow-sm', className)}>
      <Button
        variant="default"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-full"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
      </Button>

      {/* Progress placeholder - would normally be a slider, keeping it simple visual for now */}
      <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full bg-primary w-1/3 transition-all duration-300" />
      </div>

      {showSpeedControls && (
        <div className="flex items-center gap-1 shrink-0 bg-muted/50 p-1 rounded-md">
          {[1, 1.25, 1.5].map((s) => (
            <Button
              key={s}
              variant={speed === s ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'h-7 px-2 text-xs font-medium',
                speed === s ? 'bg-background shadow-sm' : 'text-muted-foreground'
              )}
              onClick={() => onSpeedChange(s)}
            >
              {s}x
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
