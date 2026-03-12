import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Logger } from '@/lib/Logger';

interface BandOption {
  value: string;
  number: number;
  label: string;
  ageRange: string;
}

const BAND_OPTIONS: BandOption[] = [
  { value: '0', number: 0, label: 'Picture Book', ageRange: '0-3' },
  { value: '1', number: 1, label: 'Story Mode', ageRange: '4-6' },
  { value: '2', number: 2, label: 'Explorer', ageRange: '7-9' },
  { value: '3', number: 3, label: 'Scholar', ageRange: '10-12' },
  { value: '4', number: 4, label: 'Apprentice', ageRange: '13-15' },
  { value: '5', number: 5, label: 'University', ageRange: '16+' },
];

interface BandSelectorProps {
  onBandChange: (band: number) => void;
  className?: string;
}

export function BandSelector({ onBandChange, className }: BandSelectorProps) {
  const [selectedBand, setSelectedBand] = useState<string>('0');

  useEffect(() => {
    const savedBand = localStorage.getItem('learn-live-band');
    if (savedBand && BAND_OPTIONS.some((o) => o.value === savedBand)) {
      setSelectedBand(savedBand);
      onBandChange(parseInt(savedBand, 10));
    } else {
      setSelectedBand('0');
      onBandChange(0);
      localStorage.setItem('learn-live-band', '0');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBandChange = (value: string) => {
    if (!value) return; // Prevent deselecting
    setSelectedBand(value);
    localStorage.setItem('learn-live-band', value);
    onBandChange(parseInt(value, 10));
    Logger.info('[UI]', `Band changed to ${value}`);
  };

  return (
    <div className={cn("w-full overflow-x-auto pb-2 scrollbar-hide", className)}>
      <ToggleGroup
        type="single"
        value={selectedBand}
        onValueChange={handleBandChange}
        className="flex flex-nowrap md:grid md:grid-cols-6 gap-2 min-w-max md:min-w-0"
      >
        {BAND_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className={cn(
              "flex flex-col items-center justify-center p-3 h-auto min-w-[120px] rounded-xl border border-border/50 bg-card hover:bg-accent hover:text-accent-foreground transition-colors",
              selectedBand === option.value && "border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
            )}
            aria-label={`Select Band ${option.number}: ${option.label}`}
          >
            <span className="text-lg font-bold">Band {option.number}</span>
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground mt-1">Age {option.ageRange}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
