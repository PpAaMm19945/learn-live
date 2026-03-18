import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface MapAsset {
  id: string;
  lesson_id: string;
  map_title: string;
  era: string;
  description: string;
  asset_key: string;
}

interface LessonMapDisplayProps {
  lessonId: string;
}

export function LessonMapDisplay({ lessonId }: LessonMapDisplayProps) {
  const { data: maps, isLoading, isError } = useQuery<MapAsset[]>({
    queryKey: ['lesson-maps', lessonId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/lessons/${lessonId}/map-assets`, { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 404) return []; // No maps for this lesson
        throw new Error('Failed to fetch maps');
      }
      return res.json();
    },
    enabled: !!lessonId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 my-8">
        <Skeleton className="w-full h-64 md:h-96 rounded-2xl bg-muted" />
      </div>
    );
  }

  if (isError || !maps || maps.length === 0) {
    return null;
  }

  const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';

  return (
    <div className="space-y-8 my-8">
      {maps.map((map) => (
        <div key={map.id} className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-sm">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-semibold text-lg">{map.map_title}</h3>
            {map.era && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {map.era}
              </span>
            )}
          </div>
          <div className="relative aspect-video w-full bg-muted flex items-center justify-center overflow-hidden p-4">
            <img
              src={`${apiUrl}/api/assets/${map.asset_key}`}
              alt={map.map_title}
              className="max-h-[600px] w-auto h-auto object-contain rounded-xl shadow-sm border border-border/50"
            />
          </div>
          {map.description && (
            <div className="p-4 bg-muted/30 text-sm text-muted-foreground border-t border-border/50">
              {map.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
