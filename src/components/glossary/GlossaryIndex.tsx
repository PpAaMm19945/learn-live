import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GlossaryTermData {
  id: string;
  term: string;
  definition: string;
  category?: string;
}

interface GlossaryIndexProps {
  terms: GlossaryTermData[];
}

export function GlossaryIndex({ terms }: GlossaryIndexProps) {
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTermData[]> = {};
    terms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      const groupKey = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(term);
    });

    // Sort groups alphabetically
    const sortedKeys = Object.keys(groups).sort();

    // Sort terms within each group alphabetically
    sortedKeys.forEach(key => {
        groups[key].sort((a, b) => a.term.localeCompare(b.term));
    });

    return { groups, sortedKeys };
  }, [terms]);

  if (terms.length === 0) {
      return (
          <div className="text-center py-12 text-muted-foreground">
              No terms found.
          </div>
      );
  }

  return (
    <div className="space-y-12">
      {/* Alphabet Navigation */}
      <div className="flex flex-wrap gap-2 justify-center sticky top-20 z-10 bg-background/95 backdrop-blur py-4 border-b border-border/50">
        {groupedTerms.sortedKeys.map(letter => (
          <a
            key={`nav-${letter}`}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary hover:text-primary-foreground transition-colors font-semibold text-sm bg-secondary"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Dictionary Entries */}
      <div className="space-y-12">
        {groupedTerms.sortedKeys.map(letter => (
          <div key={`group-${letter}`} id={`letter-${letter}`} className="scroll-mt-32">
            <h2 className="text-4xl font-extrabold text-primary border-b-2 border-primary/20 pb-2 mb-6 inline-block">
                {letter}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groupedTerms.groups[letter].map(term => (
                <Card key={term.id} id={`term-${term.id}`} className="scroll-mt-32 hover:border-primary/50 transition-colors shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-start justify-between gap-2">
                        <span className="text-xl">{term.term}</span>
                        {term.category && (
                             <Badge variant="secondary" className="capitalize text-xs whitespace-nowrap">
                                 {term.category}
                             </Badge>
                        )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {term.definition}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
