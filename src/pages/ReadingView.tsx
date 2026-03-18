import { useState, useEffect } from 'react';
import { stripMarkdown } from '@/lib/textUtils';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconCircleCheck, IconLoader2, IconGlobe } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';
import { BandBadge } from '@/components/content/BandBadge';
import { useActiveBand } from '@/lib/learnerStore';
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
  const currentBand = useActiveBand();
  const [isWorldContextOpen, setIsWorldContextOpen] = useState(false);
  const [showBackToLesson, setShowBackToLesson] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToLesson(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      toast({ title: 'Reading complete' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update progress.', variant: 'destructive' });
    }
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {lesson?.topic_id && (
        <WorldContextSidebar
          chapterId={lesson.topic_id}
          band={currentBand}
          isOpen={isWorldContextOpen}
          onOpenChange={setIsWorldContextOpen}
        />
      )}

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 md:py-12">
        {lessonId && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                 <BandBadge />

                 {lesson?.topic_id && (
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setIsWorldContextOpen(true)}
                     className="flex items-center gap-2 border-primary/20 hover:bg-primary/10 text-primary"
                   >
                     <IconGlobe className="h-4 w-4" />
                     <span className="hidden sm:inline">World Context</span>
                   </Button>
                 )}
              </div>
            </div>

            {isLessonLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-12 w-3/4 mb-8" />
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-5/6" />
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight mb-8 text-foreground">{stripMarkdown(lesson?.title || '')}</h2>
                <AdaptedContentReader lessonId={lessonId} band={currentBand} />
              </>
            )}

            {!isLessonLoading && (
              <div className="mt-16 pt-8 border-t border-border/50">
                {markCompleteMutation.isSuccess ? (
                  <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-300 py-8">
                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="font-display text-2xl">Lesson Completed</h3>
                      <p className="text-muted-foreground">Well done on finishing this reading.</p>
                    </div>
                    <Button size="lg" onClick={() => navigate(`/topics/${lesson?.topic_id}`)} className="mt-4">
                      Return to Topic
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
          </div>
        )}
      </main>

      {showBackToLesson && lesson?.topic_id && (
        <Button
          className="fixed bottom-6 right-6 rounded-full z-50 animate-in fade-in slide-in-from-bottom-4 px-4 py-6"
          onClick={() => navigate(`/topics/${lesson.topic_id}`)}
        >
          <ChevronLeft className="h-5 w-5 mr-2" /> Back to Lesson
        </Button>
      )}
    </div>
  );
}
