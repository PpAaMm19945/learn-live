import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { BookA } from 'lucide-react';

interface VocabularyCardProps {
  term: string;
  definition: string;
  inline?: boolean;
  className?: string;
}

export function VocabularyCard({ term, definition, inline = false, className }: VocabularyCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (inline) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent text-accent-foreground font-medium cursor-help hover:bg-accent/80 transition-colors border-b border-dashed border-accent-foreground/50",
              className
            )}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {term}
          </span>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-4 z-50 shadow-lg border-accent/20"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          sideOffset={5}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-accent-foreground">
              <BookA className="w-4 h-4" />
              <h4 className="font-semibold leading-none">{term}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {definition}
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card className={cn("overflow-hidden border-l-4 border-l-accent", className)}>
      <CardContent className="p-4 space-y-1.5 bg-card">
        <div className="flex items-center gap-2 text-accent-foreground">
           <BookA className="w-4 h-4" />
           <h4 className="font-semibold text-base">{term}</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {definition}
        </p>
      </CardContent>
    </Card>
  );
}
