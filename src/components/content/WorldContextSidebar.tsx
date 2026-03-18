import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { IconGlobe, IconClock } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WorldContextEntry {
  id: string;
  chapter_id: string;
  region: string;
  title: string;
  description: string;
  start_year: number;
  end_year: number;
  display_order: number;
}

interface WorldContextSidebarProps {
  chapterId: string;
  band: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatYear(year: number) {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

export function WorldContextSidebar({ chapterId, band, isOpen, onOpenChange }: WorldContextSidebarProps) {
  const { data: contextEntries, isLoading } = useQuery<WorldContextEntry[]>({
    queryKey: ['world-context', chapterId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/chapters/${chapterId}/world-context`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch world context');
      return res.json();
    },
    enabled: isOpen && !!chapterId,
  });

  const isSimplified = band < 3;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full bg-card/95 backdrop-blur-md border-l border-border/50">
        <SheetHeader className="pb-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <IconGlobe className="h-6 w-6 text-primary" />
            <SheetTitle className="text-2xl font-bold tracking-tight">Meanwhile, in the World...</SheetTitle>
          </div>
          <SheetDescription className="text-base">
            Discover what was happening globally during this period in history.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-full bg-border" />
                    <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="flex-1 space-y-3 pb-8">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    {!isSimplified && (
                      <div className="space-y-2 mt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !contextEntries || contextEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center">
              <Globe className="h-12 w-12 mb-4 opacity-20" />
              <p>No world context available for this chapter.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-2 top-2 bottom-2 w-px bg-primary/20" />

              <div className="space-y-8">
                {contextEntries.map((entry, index) => (
                  <div key={entry.id} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className="absolute left-[3px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />

                    <div className="bg-muted/30 rounded-lg p-5 border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <h4 className="font-semibold text-lg text-foreground leading-tight">
                          {entry.title}
                        </h4>
                        <Badge variant="secondary" className="whitespace-nowrap font-medium text-xs">
                          {entry.region}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-4 bg-background/50 inline-flex px-2 py-1 rounded-md">
                        <Clock className="h-3.5 w-3.5" />
                        {formatYear(entry.start_year)} — {formatYear(entry.end_year)}
                      </div>

                      {!isSimplified && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
