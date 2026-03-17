import { Badge } from '@/components/ui/badge';
import { useActiveBand } from '@/lib/learnerStore';

const BAND_LABELS = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice', 'University'];

export function BandBadge() {
  const band = useActiveBand();
  return (
    <Badge variant="secondary" className="text-xs">
      Reading as: {BAND_LABELS[band]} (Band {band})
    </Badge>
  );
}
