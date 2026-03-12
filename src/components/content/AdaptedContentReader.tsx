import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCcw, PenTool } from 'lucide-react';
import { VocabularyCard } from './VocabularyCard';
import { DiscussionQuestions } from './DiscussionQuestions';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VocabularyTerm {
  term: string;
  definition: string;
}

interface AdaptedContentData {
  id: string;
  lesson_id: string;
  band: number;
  content: string;
  vocabulary: VocabularyTerm[];
  discussion_questions: string[];
  essay_prompt?: string;
}

interface AdaptedContentReaderProps {
  lessonId: string;
  band: number;
}

export function AdaptedContentReader({ lessonId, band }: AdaptedContentReaderProps) {
  const {
    data: contentData,
    isLoading,
    isError,
    refetch,
  } = useQuery<AdaptedContentData>({
    queryKey: ['lesson-content', lessonId, band],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/lessons/${lessonId}/content?band=${band}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch adapted content');
      const data = await res.json();
      // API returns { lesson, content: { adapted_text, vocabulary, ... }, band }
      // Unwrap to flat shape expected by this component
      const c = data.content;
      if (!c) throw new Error('No adapted content available for this band');
      return {
        id: c.id || '',
        lesson_id: c.lesson_id || lessonId,
        band: data.band ?? band,
        content: c.adapted_text || '',
        vocabulary: c.vocabulary || [],
        discussion_questions: c.discussion_questions || [],
        essay_prompt: c.essay_prompt || undefined,
      } as AdaptedContentData;
    },
    enabled: !!lessonId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse mt-8">
        <Skeleton className="h-10 w-3/4 bg-muted" />
        <Skeleton className="h-6 w-full bg-muted" />
        <Skeleton className="h-6 w-full bg-muted" />
        <Skeleton className="h-6 w-5/6 bg-muted" />
        <div className="pt-8 space-y-4">
          <Skeleton className="h-6 w-full bg-muted" />
          <Skeleton className="h-6 w-4/5 bg-muted" />
        </div>
      </div>
    );
  }

  if (isError || !contentData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-card mt-8">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to load content</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          There was an error retrieving the reading material for this band level. Please try again.
        </p>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  // --- Content Parsing with Inline Vocabulary ---
  const renderContentWithVocab = (text: string, vocabulary: VocabularyTerm[]): ReactNode[] => {
    if (!vocabulary || vocabulary.length === 0) return [text];

    let segments: ReactNode[] = [text];
    let keyCounter = 0;

    vocabulary.forEach((vocab) => {
      const regex = new RegExp(`\\b(${vocab.term})\\b`, 'gi');
      const newSegments: ReactNode[] = [];

      segments.forEach((segment) => {
        if (typeof segment === 'string') {
          const parts = segment.split(regex);
          parts.forEach((part) => {
            if (part.toLowerCase() === vocab.term.toLowerCase()) {
              newSegments.push(
                <VocabularyCard
                  key={`vocab-${vocab.term}-${keyCounter++}`}
                  term={part}
                  definition={vocab.definition}
                  inline
                />
              );
            } else if (part) {
              newSegments.push(part);
            }
          });
        } else {
          newSegments.push(segment);
        }
      });
      segments = newSegments;
    });

    return segments;
  };

  const formattedContent = renderContentWithVocab(contentData.content, contentData.vocabulary);

  // --- Render based on Band ---
  return (
    <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {/* Band 0-1: Large text, generous spacing, illustration placeholder */}
      {band <= 1 && (
        <div className="space-y-10">
          <div className="w-full h-64 md:h-80 bg-muted/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-border text-muted-foreground/50">
             [Illustration Placeholder]
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none text-2xl md:text-3xl leading-relaxed md:leading-loose text-foreground whitespace-pre-wrap font-medium">
            {formattedContent}
          </div>
        </div>
      )}

      {/* Band 2-3: Standard prose, vocabulary sidebar, discussion questions */}
      {(band === 2 || band === 3) && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
             <div className="prose prose-slate dark:prose-invert max-w-none text-lg md:text-xl leading-relaxed text-foreground whitespace-pre-wrap">
              {formattedContent}
            </div>
            <DiscussionQuestions questions={contentData.discussion_questions} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">Vocabulary</h3>
             {contentData.vocabulary?.length > 0 ? (
                <div className="space-y-4">
                  {contentData.vocabulary.map((v, i) => (
                    <VocabularyCard key={i} term={v.term} definition={v.definition} />
                  ))}
                </div>
             ) : (
                <p className="text-sm text-muted-foreground">No new terms for this lesson.</p>
             )}
          </div>
        </div>
      )}

      {/* Band 4-5: Dense academic text, essay prompt */}
      {band >= 4 && (
        <div className="space-y-10">
          <div className="prose prose-slate dark:prose-invert max-w-none text-base md:text-lg leading-relaxed text-foreground whitespace-pre-wrap columns-1 md:columns-2 gap-8">
            {formattedContent}
          </div>

          {contentData.essay_prompt && (
             <div className="mt-12 p-8 rounded-2xl bg-secondary border border-border/50 shadow-inner">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <PenTool className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Essay Prompt</h3>
                </div>
                <p className="text-lg text-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-2">
                  {contentData.essay_prompt}
                </p>
             </div>
          )}

          <DiscussionQuestions questions={contentData.discussion_questions} />
        </div>
      )}
    </div>
  );
}
