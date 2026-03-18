import { useNavigate } from 'react-router-dom';
import { stripMarkdown } from '@/lib/textUtils';
import { useAuthStore } from '@/lib/auth';
import { BookOpen, Clock, AlertCircle, RefreshCcw, Users, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonProgress } from '@/components/progress/LessonProgress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearnerStore } from '@/lib/learnerStore';
import { Button } from '@/components/ui/button';

interface Lesson {
  id: string;
  title: string;
  difficulty_band: string;
  estimated_time: string;
  status: 'not_started' | 'in_progress' | 'completed';
  last_studied?: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  era: string;
  region: string;
  lesson_count: number;
  lessons?: Lesson[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { name } = useAuthStore();

  const {
    learners,
    activeLearnerId,
    activeLearnerName,
    activeLearnerBand,
    setActiveLearner,
    loadFamily,
    isLoaded,
    hasFamily,
    currentTopicId
  } = useLearnerStore();

  useEffect(() => {
    if (!isLoaded) {
      loadFamily().catch(() => {
        navigate('/onboarding');
      });
    }
  }, [isLoaded, loadFamily, navigate]);

  const { data: topics, isLoading, isError, refetch } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch topics');
      const topicsData = await res.json();

      const topicsWithLessons = await Promise.all(
        topicsData.map(async (topic: Topic) => {
          try {
            const topicRes = await fetch(`${apiUrl}/api/topics/${topic.id}`, {
              credentials: 'include',
            });
            if (topicRes.ok) {
              const topicDetails = await topicRes.json();
              return { ...topic, lessons: topicDetails.lessons };
            }
            return { ...topic, lessons: [] };
          } catch (e) {
            return { ...topic, lessons: [] };
          }
        })
      );

      return topicsWithLessons;
    },
  });

  const getBandLabel = (band: number) => {
    const labels = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice Historian', 'University Prep'];
    return labels[band] || `Band ${band}`;
  };

  let continueLessonId: string | null = null;
  let continueTopicTitle: string = 'No topics available';
  let continueLessonTitle: string | null = null;

  if (topics && topics.length > 0) {
    let foundLesson = false;

    if (currentTopicId) {
      const currentTopic = topics.find(t => t.id === currentTopicId);
      if (currentTopic && currentTopic.lessons && currentTopic.lessons.length > 0) {
        const nextLesson = currentTopic.lessons.find(l => l.status === 'in_progress' || l.status === 'not_started');
        const lessonToUse = nextLesson || currentTopic.lessons[0];
        continueLessonId = lessonToUse.id;
        continueTopicTitle = currentTopic.title;
        continueLessonTitle = lessonToUse.title;
        foundLesson = true;
      }
    }

    if (!foundLesson) {
      for (const topic of topics) {
        if (topic.lessons) {
          for (const lesson of topic.lessons) {
            if (lesson.status === 'in_progress') {
              continueLessonId = lesson.id;
              continueTopicTitle = topic.title;
              continueLessonTitle = lesson.title;
              foundLesson = true;
              break;
            }
          }
        }
        if (foundLesson) break;
      }
    }

    if (!foundLesson) {
      for (const topic of topics) {
        if (topic.lessons) {
          for (const lesson of topic.lessons) {
            if (lesson.status === 'not_started') {
              continueLessonId = lesson.id;
              continueTopicTitle = topic.title;
              continueLessonTitle = lesson.title;
              foundLesson = true;
              break;
            }
          }
        }
        if (foundLesson) break;
      }
    }

    if (!foundLesson && topics[0].lessons && topics[0].lessons.length > 0) {
      const firstLesson = topics[0].lessons[0];
      continueLessonId = firstLesson.id;
      continueTopicTitle = topics[0].title;
      continueLessonTitle = firstLesson.title;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* HERO SECTION */}
        <div className="space-y-6">
          <h2 className="font-display text-3xl leading-tight tracking-tight">Welcome back, {name || 'Parent'}</h2>

          {activeLearnerId && (
            <Card className="bg-card border-border/50 max-w-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-display text-lg">
                      Learning as: {activeLearnerName} <span className="font-sans text-sm text-muted-foreground font-normal">(Band {activeLearnerBand} · {getBandLabel(activeLearnerBand)})</span>
                    </span>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    Currently on: <span className="font-medium text-foreground">
                      {continueTopicTitle}{continueLessonTitle ? ` — ${stripMarkdown(continueLessonTitle)}` : ''}
                    </span>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => navigate(`/narrate/${continueLessonId}`)}
                      disabled={!continueLessonId}
                    >
                      Start Live Lesson
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/read/${continueLessonId}`)}
                      disabled={!continueLessonId}
                    >
                      Read First
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {learners && learners.length > 0 && (
            <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border/50 w-max">
              <Users className="h-5 w-5 text-muted-foreground ml-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium mb-1">Select Learner</span>
                <Select
                  value={activeLearnerId || ''}
                  onValueChange={setActiveLearner}
                >
                  <SelectTrigger className="w-[200px] h-8 bg-background">
                    <SelectValue placeholder="Select a learner" />
                  </SelectTrigger>
                  <SelectContent>
                    {learners.map(learner => (
                      <SelectItem key={learner.id} value={learner.id}>
                        {learner.name} <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">Band {learner.band}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {!hasFamily && isLoaded ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl bg-card">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl mb-2">Complete your family profile</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">To start your curriculum journey, please complete the onboarding process and set up your family profile.</p>
            <Button onClick={() => navigate('/onboarding')}>
              Complete Onboarding
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl bg-card">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="font-display text-xl mb-2">Failed to load topics</h3>
            <p className="text-muted-foreground mb-6">We encountered an error while fetching the curriculum data.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : !topics || topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl border-dashed bg-card">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl mb-2">No topics available yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">The curriculum content is being prepared. Check back soon.</p>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="font-display text-2xl leading-tight border-b pb-2">Curriculum Journey</h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {topics.map((topic, index) => {
                const completedLessons = topic.lessons?.filter(l => l.status === 'completed').length || 0;
                const totalLessons = topic.lesson_count || 0;

                let lastStudiedDate: Date | null = null;
                if (topic.lessons) {
                  for (const lesson of topic.lessons) {
                    if (lesson.last_studied) {
                      const d = new Date(lesson.last_studied);
                      if (!lastStudiedDate || d > lastStudiedDate) {
                        lastStudiedDate = d;
                      }
                    }
                  }
                }

                return (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="bg-card border border-border/50 rounded-xl px-2 overflow-hidden animate-card-enter"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                      <div className="flex items-center gap-4 text-left w-full pr-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display text-xl">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-display text-lg leading-tight line-clamp-1">{topic.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs py-0 h-5">
                              <Clock className="w-3 h-3" /> {topic.era}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden inline-block mr-1">
                                <span className="h-full bg-primary block" style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }} />
                              </span>
                              {completedLessons} / {totalLessons} lessons complete
                            </span>
                            {lastStudiedDate && (
                              <span className="text-xs text-muted-foreground border-l pl-2 ml-1">
                                Last studied: {lastStudiedDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-4 border-t border-border/50">
                      <p className="text-muted-foreground mb-6 max-w-3xl">
                        {topic.description}
                      </p>

                      <div className="space-y-3 pl-4 border-l-2 border-primary/20 ml-2">
                        {topic.lessons && topic.lessons.length > 0 ? (
                          topic.lessons.map((lesson, lIndex) => (
                            <div
                              key={lesson.id}
                              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-background hover:bg-accent/10 transition-colors border border-border/50"
                            >
                              <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center">
                                {lesson.status === 'completed' && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-display text-base leading-tight">{lIndex + 1}. {stripMarkdown(lesson.title)}</h5>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-sans">
                                  <Clock className="w-3 h-3" /> {lesson.estimated_time || 'N/A'}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <LessonProgress status={lesson.status} className="hidden sm:flex" />
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                                >
                                  View <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground py-2">
                            No lessons available yet.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
}
