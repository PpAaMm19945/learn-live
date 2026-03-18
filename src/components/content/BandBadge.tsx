import { Badge } from '@/components/ui/badge';
import { useActiveBand } from '@/lib/learnerStore';

const BAND_LABELS = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice', 'University'];

const BAND_STYLES: Record<number, string> = {
  0: 'bg-accent text-foreground border-accent',
  1: 'bg-primary text-primary-foreground border-primary',
  2: 'bg-secondary text-secondary-foreground border-secondary',
  3: 'bg-muted-foreground text-primary-foreground border-muted-foreground',
  4: 'bg-foreground/80 text-accent border-foreground/80',
  5: 'bg-foreground text-accent border-foreground',
};

export function BandBadge() {
  const band = useActiveBand();
  const style = BAND_STYLES[band] || BAND_STYLES[0];
  return (
    <Badge className={`font-sans text-xs font-medium tracking-wider uppercase border ${style}`}>
      {BAND_LABELS[band]} · Band {band}
    </Badge>
  );
}
