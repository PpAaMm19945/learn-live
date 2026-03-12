import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, AlertCircle, HelpCircle, CheckCircle, BookOpen, PlayCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamCard } from '@/components/exam/ExamCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface LessonData {
  id: string;
  topic_id: string;
  title: string;
  narrative: string;
  key_dates: { date: string; event: string }[];
  key_figures: { name: string; role: string }[];
  citations: string[];
}

export default function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: lesson, isLoading, isError, refetch } = useQuery<LessonData>({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/lessons/${lessonId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch lesson details');
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
      toast({ title: 'Lesson marked as complete!' });
      if (lesson?.topic_id) {
         navigate(`/topics/${lesson.topic_id}`);
      }
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update progress.', variant: 'destructive' });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
            <Button variant="ghost" size="sm" disabled className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Course
            </Button>
            <Skeleton className="h-5 w-48 flex-grow" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-10 w-3/4 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <br />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load lesson</h2>
        <p className="text-muted-foreground mb-8 max-w-md">There was a problem loading the lesson content. Please try again.</p>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
          <Button onClick={() => refetch()} variant="default" className="w-full sm:w-auto">
            <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/topics/${lesson.topic_id}`)}
            className="mr-4"
            aria-label="Back to Course"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Course
          </Button>
          <h1 className="text-sm font-medium truncate flex-grow">{lesson.title}</h1>
           <Button
             variant="default"
             size="sm"
             className="mr-2 hidden md:flex"
             onClick={() => navigate(`/read/${lessonId}`)}
             aria-label="Read lesson"
           >
             <BookOpen className="h-4 w-4 mr-1" /> Read
           </Button>
           <Button
             variant="secondary"
             size="sm"
             className="mr-2"
             onClick={() => navigate(`/narrate/${lessonId}`)}
             aria-label="Narrate lesson"
           >
             <PlayCircle className="h-4 w-4 mr-1" /> Narrate
           </Button>
           <Button variant="outline" size="sm" className="mr-2 hidden md:flex" aria-label="Ask a question">
            <HelpCircle className="h-4 w-4 mr-1" /> Ask
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
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
                <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Narrative Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">{lesson.title}</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                {lesson.narrative}
              </div>
            </div>

            {/* Complete Button */}
            <div className="pt-8 border-t border-border/50 flex justify-end">
               <Button
                onClick={() => markCompleteMutation.mutate()}
                disabled={markCompleteMutation.isPending}
                size="lg"
              >
                {markCompleteMutation.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Mark Complete
              </Button>
            </div>

            {/* Citations at bottom */}
            {lesson.citations && lesson.citations.length > 0 && (
              <div className="pt-8 text-sm text-muted-foreground">
                <h4 className="font-semibold mb-2">Sources</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {lesson.citations.map((citation, idx) => (
                    <li key={idx}>{citation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Mobile Collapsible Sidebar */}
            <div className="block lg:hidden">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {lesson.key_dates && lesson.key_dates.length > 0 && (
                  <AccordionItem value="key-dates" className="bg-card border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold py-4 hover:no-underline">Key Dates</AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                      {lesson.key_dates.map((item, idx) => (
                        <div key={idx} className="border-l-2 border-primary pl-4">
                          <div className="font-semibold">{item.date}</div>
                          <div className="text-sm text-muted-foreground">{item.event}</div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {lesson.key_figures && lesson.key_figures.length > 0 && (
                  <AccordionItem value="key-figures" className="bg-card border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold py-4 hover:no-underline">Key Figures</AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                      {lesson.key_figures.map((figure, idx) => (
                        <div key={idx}>
                          <div className="font-semibold">{figure.name}</div>
                          <div className="text-sm text-muted-foreground">{figure.role}</div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>

            {/* Desktop Static Sidebar */}
            <div className="hidden lg:block space-y-6">
              {lesson.key_dates && lesson.key_dates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lesson.key_dates.map((item, idx) => (
                      <div key={idx} className="border-l-2 border-primary pl-4">
                        <div className="font-semibold">{item.date}</div>
                        <div className="text-sm text-muted-foreground">{item.event}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {lesson.key_figures && lesson.key_figures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Figures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lesson.key_figures.map((figure, idx) => (
                      <div key={idx}>
                        <div className="font-semibold">{figure.name}</div>
                        <div className="text-sm text-muted-foreground">{figure.role}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <ExamCard lessonId={lessonId!} />
          </div>
        </div>
      </main>
    </div>
  );
}
