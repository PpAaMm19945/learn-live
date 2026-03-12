import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, FastForward } from 'lucide-react';

interface PlaybackControlsProps {
    isPlaying: boolean;
    onToggle: () => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
    band: number;
}

export function PlaybackControls({ isPlaying, onToggle, speed, onSpeedChange, band }: PlaybackControlsProps) {
    const showSpeedControls = band >= 3;

    return (
        <div className="flex items-center space-x-4 bg-card border border-border rounded-full px-6 py-2 shadow-sm">
            <Button variant="ghost" size="icon" onClick={onToggle} className="text-primary hover:text-primary hover:bg-primary/10 transition-colors">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            <div className="flex-1">
                {/* Progress bar placeholder */}
                <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '45%' }} />
                </div>
            </div>

            {showSpeedControls && (
                <div className="flex items-center space-x-2 border-l border-border pl-4">
                    <FastForward className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={speed}
                        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                        className="bg-transparent text-sm text-muted-foreground outline-none border-none hover:text-foreground cursor-pointer transition-colors"
                        aria-label="Playback speed"
                    >
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                    </select>
                </div>
            )}
        </div>
    );
}
