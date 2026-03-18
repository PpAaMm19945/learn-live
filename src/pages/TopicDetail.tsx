import { useLearnerStore } from '@/lib/learnerStore';
import { stripMarkdown } from '@/lib/textUtils';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { IconChevronLeft, IconClock, IconMapPin, IconAlertCircle, IconBook, IconRefresh } from '@tabler/icons-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LessonProgress } from '@/components/progress/LessonProgress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Lesson {
  id: string;
  title: string;
  difficulty_band: string;
  estimated_time: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface TopicDetailData {
  id: string;
  title: string;
  description: string;
  era: string;
  region: string;
  lessons: Lesson[];
}

export default function TopicDetail() {
  const selectedLearnerId = useLearnerStore(state => state.activeLearnerId);
  const [searchParams] = useSearchParams();
  const queryLearnerId = searchParams.get('learner');
  const learnerId = queryLearnerId || selectedLearnerId;
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const { data: topic, isLoading, isError, refetch } = useQuery<TopicDetailData>({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics/${topicId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch topic details');
      return res.json();
    },
    enabled: !!topicId,
  });

  const getStatusBadge = (status: Lesson['status']) => {
    return <LessonProgress status={status} />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-3/4 max-w-lg" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4 pt-6 border-t border-border/50">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !topic) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="font-display text-2xl mb-2">Failed to load topic details</h2>
        <p className="text-muted-foreground mb-8 max-w-md">There was a problem loading the curriculum content. Please try again.</p>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back to Course
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
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Course</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{topic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 text-sm py-1">
              <Clock className="w-4 h-4" /> {topic.era}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-sm py-1">
              <MapPin className="w-4 h-4" /> {topic.region}
            </Badge>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight tracking-tight">{topic.title}</h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {topic.description}
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-border/50">
          <h3 className="font-display text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Lessons
          </h3>

          {topic.lessons.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-xl border-dashed bg-card">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl mb-2">No lessons yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">Content for this topic is currently being developed.</p>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Explore Other Topics
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {topic.lessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="w-full hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/lessons/${lesson.id}${learnerId ? `?learner=${learnerId}` : ''}`)}
                  aria-label={`Go to lesson: ${stripMarkdown(lesson.title)}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/lessons/${lesson.id}${learnerId ? `?learner=${learnerId}` : ''}`);
                    }
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="font-display text-lg leading-tight">{stripMarkdown(lesson.title)}</CardTitle>
                      {getStatusBadge(lesson.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-sans">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">Band:</span> {lesson.difficulty_band}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {lesson.estimated_time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
