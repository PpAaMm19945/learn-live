import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BandSelector } from '@/components/content/BandSelector';
import { WorldContextSidebar } from '@/components/content/WorldContextSidebar';
import { AdaptedContentReader } from '@/components/content/AdaptedContentReader';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface LessonBasicInfo {
  id: string;
  topic_id: string;
  title: string;
}

export default function ReadingView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentBand, setCurrentBand] = useState<number>(0);
  const [isWorldContextOpen, setIsWorldContextOpen] = useState(false);

  // Fetch basic lesson info (title, topic_id for navigation)
  const { data: lesson, isLoading: isLessonLoading } = useQuery<LessonBasicInfo>({
    queryKey: ['lesson-basic', lessonId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/lessons/${lessonId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch lesson info');
      return res.json();
    },
    enabled: !!lessonId,
  });

  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/progress`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, status: 'completed' }),
      });
      if (!res.ok) throw new Error('Failed to mark lesson as complete');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Reading complete!' });
      if (lesson?.topic_id) {
         navigate(`/topics/${lesson.topic_id}`);
      }
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update progress.', variant: 'destructive' });
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header with Band Selector */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => lesson?.topic_id ? navigate(`/topics/${lesson.topic_id}`) : navigate(-1)}
              className="mr-2"
              aria-label="Back to Course"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {isLessonLoading ? (
               <Skeleton className="h-6 w-32 bg-muted hidden sm:block ml-2" />
            ) : (
               <h1 className="text-sm font-medium text-muted-foreground truncate max-w-[200px] md:max-w-md hidden sm:block ml-2">
                 {lesson?.title}
               </h1>
            )}
          </div>

          <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 flex items-center gap-4">
             <BandSelector onBandChange={setCurrentBand} />

             {lesson?.topic_id && (
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setIsWorldContextOpen(true)}
                 className="hidden md:flex items-center gap-2 border-primary/20 hover:bg-primary/10 text-primary"
               >
                 <Globe className="h-4 w-4" />
                 World Context
               </Button>
             )}
          </div>
        </div>
      </header>

      {/* Mobile World Context Button - floating or integrated */}
      {lesson?.topic_id && (
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl"
            onClick={() => setIsWorldContextOpen(true)}
          >
            <Globe className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* World Context Sidebar */}
      {lesson?.topic_id && (
        <WorldContextSidebar
          chapterId={lesson.topic_id}
          band={currentBand}
          isOpen={isWorldContextOpen}
          onOpenChange={setIsWorldContextOpen}
        />
      )}

      {/* Main Reading Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        {lessonId && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              {!isLessonLoading && lesson ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/dashboard">Course</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={`/topics/${lesson.topic_id}`}>Topic</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={`/lessons/${lessonId}`}>Lesson</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Read</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              ) : (
                <Skeleton className="h-5 w-64" />
              )}
            </div>

            {isLessonLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4 mb-8" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-px flex-grow" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <br />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 text-foreground">{lesson?.title}</h2>
                <AdaptedContentReader lessonId={lessonId} band={currentBand} />
              </>
            )}

            {!isLessonLoading && (
              <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  Finished reading? Mark this lesson as complete to track your progress.
                </p>
                <Button
                  onClick={() => markCompleteMutation.mutate()}
                  disabled={markCompleteMutation.isPending}
                  size="lg"
                  className="w-full sm:w-auto"
                  aria-label="Mark lesson complete"
                >
                  {markCompleteMutation.isPending ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  Mark Complete
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
