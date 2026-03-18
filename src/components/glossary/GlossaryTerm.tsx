import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { IconBook } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface GlossaryTermProps {
  term: string;
  definition: string;
  className?: string;
  id?: string;
}

export function GlossaryTerm({ term, definition, className, id }: GlossaryTermProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-1 py-0.5 rounded-sm bg-primary/10 text-primary font-medium cursor-help hover:bg-primary/20 transition-colors border-b border-dashed border-primary/50",
            className
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {term}
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4 z-50 shadow-lg border-primary/20"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        sideOffset={5}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between text-primary">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <h4 className="font-semibold leading-none">{term}</h4>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {definition}
          </p>
          {id && (
             <div className="pt-2 mt-2 border-t border-border">
                <Link to={`/glossary?term=${id}`} className="text-xs text-primary hover:underline">
                  View in Glossary &rarr;
                </Link>
             </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
