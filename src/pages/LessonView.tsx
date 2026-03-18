import { useParams, useNavigate, Link } from 'react-router-dom';
import { stripMarkdown } from '@/lib/textUtils';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLearnerStore } from '@/lib/learnerStore';
import { ChevronLeft, AlertCircle, BookOpen, PlayCircle, RefreshCcw, Mic, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  topic_title?: string;
}

export default function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const { activeLearnerName, activeLearnerBand } = useLearnerStore();
  const BAND_LABELS = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice', 'University'];
  const learnerName = activeLearnerName || 'Learner';
  const bandLabel = BAND_LABELS[activeLearnerBand] || `Band ${activeLearnerBand}`;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-10 w-3/4 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
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
        <h2 className="font-display text-2xl mb-2">Failed to load lesson</h2>
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
      <main className="max-w-4xl mx-auto px-4 py-8">
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
                <BreadcrumbPage>{stripMarkdown(lesson.title)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight mb-2 flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" /> {stripMarkdown(lesson.title)}
          </h1>
          <p className="text-muted-foreground">Follow this 3-step guide to complete the lesson.</p>
        </div>

        <div className="space-y-8 flex flex-col items-center">
          {/* Step 1: PREPARE */}
          <Card className="w-full max-w-2xl bg-card border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-muted"></div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display text-xl text-muted-foreground">1</div>
                <CardTitle className="font-display text-xl">Prepare</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Read the lesson text adapted for {learnerName}'s level ({bandLabel}).
              </p>
              <Button variant="outline" onClick={() => navigate(`/read/${lessonId}`)}>
                <BookOpen className="h-4 w-4 mr-2" /> Read Lesson
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: LEARN */}
          <Card className="w-full max-w-2xl bg-card border-l-4 border-primary relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-display text-xl text-primary-foreground">2</div>
                  <CardTitle className="font-display text-2xl text-primary">The Session</CardTitle>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4" /> RECOMMENDED
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg mb-8">
                Watch the interactive narrated lesson with maps and animations.
              </p>
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary text-primary-foreground" onClick={() => navigate(`/narrate/${lessonId}`)}>
                <PlayCircle className="h-6 w-6 mr-3" /> Start Live Lesson
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: PROVE */}
          <Card className="w-full max-w-2xl bg-card border-border/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-muted"></div>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display text-xl text-muted-foreground">3</div>
                <CardTitle className="font-display text-xl">The Witness</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Take an oral exam with AI. <span className="font-medium text-foreground">Sit with your child for this step.</span> Parent reviews the assessment.
              </p>
              <Button variant="outline" onClick={() => navigate(`/exam/${lessonId}`)}>
                <Mic className="h-4 w-4 mr-2" /> Start Oral Exam
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reference Sections */}
        <div className="mt-16 w-full max-w-2xl mx-auto space-y-6">
          <h3 className="font-display text-2xl border-b pb-2">Reference Materials</h3>

          <Accordion type="multiple" className="w-full space-y-4">
            {lesson.key_dates && lesson.key_dates.length > 0 && (
              <AccordionItem value="key-dates" className="bg-card border rounded-lg px-4">
                <AccordionTrigger className="font-display text-lg py-4 hover:no-underline">Key Dates</AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {lesson.key_dates.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-primary pl-4">
                      <div className="font-medium">{item.date}</div>
                      <div className="text-sm text-muted-foreground">{item.event}</div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {lesson.key_figures && lesson.key_figures.length > 0 && (
              <AccordionItem value="key-figures" className="bg-card border rounded-lg px-4">
                <AccordionTrigger className="font-display text-lg py-4 hover:no-underline">Key Figures</AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  {lesson.key_figures.map((figure, idx) => (
                    <div key={idx}>
                      <div className="font-medium">{figure.name}</div>
                      <div className="text-sm text-muted-foreground">{figure.role}</div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {lesson.citations && lesson.citations.length > 0 && (
              <AccordionItem value="citations" className="bg-card border rounded-lg px-4">
                <AccordionTrigger className="font-display text-lg py-4 hover:no-underline">Sources</AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {lesson.citations.map((citation, idx) => (
                      <li key={idx}>{citation}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
