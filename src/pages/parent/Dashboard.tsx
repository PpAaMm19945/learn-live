import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Clock, Globe, AlertCircle, RefreshCcw, Users, Book, ChevronDown, ChevronRight, PlayCircle, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useIsAdmin } from '@/lib/auth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonProgress } from '@/components/progress/LessonProgress';

interface Lesson {
  id: string;
  title: string;
  difficulty_band: string;
  estimated_time: string;
  status: 'not_started' | 'in_progress' | 'completed';
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

interface Learner {
  id: string;
  name: string;
  band: number;
}

interface FamilyResponse {
  family: { id: string; name: string };
  learners: Learner[];
}

export default function Dashboard() {
  const { email, name, logout } = useAuthStore();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Using a local state to just hold the first learner for the active learner card display
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);

  const { data: familyData, isError: isFamilyError } = useQuery<FamilyResponse>({
    queryKey: ['family'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/family`, {
        credentials: 'include',
      });
      if (res.status === 404) {
        throw new Error('Family not found');
      }
      if (!res.ok) throw new Error('Failed to fetch family');
      return res.json();
    },
    retry: false
  });

  useEffect(() => {
    if (isFamilyError) {
      navigate('/onboarding');
    }
  }, [isFamilyError, navigate]);

  useEffect(() => {
    if (familyData?.learners && familyData.learners.length > 0 && !selectedLearnerId) {
      setSelectedLearnerId(familyData.learners[0].id);
    }
  }, [familyData, selectedLearnerId]);

  const { data: topics, isLoading, isError, refetch } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch topics');
      const topicsData = await res.json();

      // Fetch lessons for each topic to populate the accordion
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

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  const selectedLearner = familyData?.learners.find(l => l.id === selectedLearnerId);

  // Determine band label based on band number (0-5)
  const getBandLabel = (band: number) => {
    const labels = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice Historian', 'University Prep'];
    return labels[band] || `Band ${band}`;
  };

  // Determine the next lesson ID and topic title to continue learning
  let continueLessonId: string | null = null;
  let continueTopicTitle: string = 'No topics available';

  if (topics && topics.length > 0) {
    let foundInProgress = false;
    for (const topic of topics) {
      if (topic.lessons) {
        for (const lesson of topic.lessons) {
          if (lesson.status === 'in_progress') {
            continueLessonId = lesson.id;
            continueTopicTitle = topic.title;
            foundInProgress = true;
            break;
          }
        }
        if (foundInProgress) break;

        // If no in_progress, check for the first not_started
        if (!foundInProgress) {
          for (const lesson of topic.lessons) {
            if (lesson.status === 'not_started') {
              continueLessonId = lesson.id;
              continueTopicTitle = topic.title;
              foundInProgress = true;
              break;
            }
          }
        }
        if (foundInProgress) break;
      }
    }

    // Fallback: If all are completed or no status matched, use the first lesson of the first topic
    if (!continueLessonId && topics[0].lessons && topics[0].lessons.length > 0) {
      continueLessonId = topics[0].lessons[0].id;
      continueTopicTitle = topics[0].title;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">Learn Live</h1>
            <p className="text-xs text-muted-foreground">{name || email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/glossary')}>
              <Book className="h-4 w-4 mr-2" /> Glossary
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                Admin Dashboard
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sign out">
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* HERO SECTION */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">👋 Welcome back, {name || 'Parent'}!</h2>

          {selectedLearner && (
            <Card className="bg-card border-border/50 shadow-sm max-w-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium text-lg">
                      Learning as: {selectedLearner.name} <span className="text-muted-foreground font-normal">(Band {selectedLearner.band} &middot; {getBandLabel(selectedLearner.band)})</span>
                    </span>
                  </div>

                  <div className="text-muted-foreground">
                    Currently on: <span className="font-medium text-foreground">{continueTopicTitle}</span>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => navigate(`/narrate/${continueLessonId}`)}
                      disabled={!continueLessonId}
                    >
                      ▶ Start Live Lesson
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/read/${continueLessonId}`)}
                      disabled={!continueLessonId}
                    >
                      📖 Read First
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isLoading ? (
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
            <h3 className="text-xl font-semibold mb-2">Failed to load topics</h3>
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
            <h3 className="text-xl font-semibold mb-2">No topics available yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">We're still preparing the curriculum content. Check back later to start learning!</p>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight border-b pb-2">Curriculum Journey</h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {topics.map((topic, index) => {
                const completedLessons = topic.lessons?.filter(l => l.status === 'completed').length || 0;
                const totalLessons = topic.lesson_count || 0;

                return (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="bg-card border rounded-xl px-2 shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                      <div className="flex items-center gap-4 text-left w-full pr-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-lg font-semibold line-clamp-1">{topic.title}</h4>
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
                              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50"
                            >
                              <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center">
                                {lesson.status === 'completed' && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-medium">{lIndex + 1}. {lesson.title}</h5>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
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
