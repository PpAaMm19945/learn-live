import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stripMarkdown } from '@/lib/textUtils';
import { useAuthStore } from '@/lib/auth';
import { IconBook, IconPlayerPlay, IconUsers, IconArrowRight } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearnerStore } from '@/lib/learnerStore';
import { Button } from '@/components/ui/button';
import { LessonProgress } from '@/components/progress/LessonProgress';
import { useIsAdmin } from '@/lib/auth';

interface Lesson {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface Topic {
  id: string;
  title: string;
  lessons?: Lesson[];
}

const CHAPTERS = [
  { id: 'ch01', num: 1, title: 'Creation, Babel & Table of Nations' },
  { id: 'ch02', num: 2, title: 'Ancient Egypt' },
  { id: 'ch03', num: 3, title: 'Kingdom of Kush & Nubia' },
  { id: 'ch04', num: 4, title: 'Phoenicians & Carthage' },
  { id: 'ch05', num: 5, title: 'Church in Roman Africa' },
  { id: 'ch06', num: 6, title: 'Aksum & Ethiopian Christianity' },
  { id: 'ch07', num: 7, title: 'Rise of Islam in Africa' },
  { id: 'ch08', num: 8, title: 'Bantu Migrations' },
  { id: 'ch09', num: 9, title: 'Medieval African Kingdoms' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { name } = useAuthStore();
  const { isAdmin } = useIsAdmin();
  const {
    learners,
    activeLearnerId,
    activeLearnerName,
    activeLearnerBand,
    setActiveLearner,
    loadFamily,
    isLoaded,
    hasFamily,
    currentTopicId,
  } = useLearnerStore();

  useEffect(() => {
    if (!isLoaded) {
      loadFamily().catch(() => {
        navigate('/onboarding');
      });
    }
  }, [isLoaded, loadFamily, navigate]);

  const { data: topics } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch topics');
      const topicsData = await res.json();

      const topicsWithLessons = await Promise.all(
        topicsData.map(async (topic: Topic) => {
          try {
            const topicRes = await fetch(`${apiUrl}/api/topics/${topic.id}`, { credentials: 'include' });
            if (topicRes.ok) {
              const topicDetails = await topicRes.json();
              return { ...topic, lessons: topicDetails.lessons };
            }
            return { ...topic, lessons: [] };
          } catch {
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

  let continueTopicTitle = 'Ready to begin';
  let continueLessonTitle: string | null = null;
  let continueStatus: Lesson['status'] = 'not_started';

  if (topics && topics.length > 0) {
    const orderedTopics = currentTopicId
      ? [...topics].sort((a, b) => (a.id === currentTopicId ? -1 : b.id === currentTopicId ? 1 : 0))
      : topics;

    for (const topic of orderedTopics) {
      const nextLesson = topic.lessons?.find((lesson) => lesson.status === 'in_progress' || lesson.status === 'not_started');
      if (nextLesson) {
        continueTopicTitle = topic.title;
        continueLessonTitle = stripMarkdown(nextLesson.title);
        continueStatus = nextLesson.status;
        break;
      }
    }
  }

  return (
    <div className="h-[calc(100vh-57px)] md:h-[calc(100vh-57px)] overflow-hidden bg-background">
      <main className="h-full max-w-6xl mx-auto px-4 py-5 grid gap-4 grid-rows-[auto_auto_1fr]">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl leading-tight">Learning Home</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {name || 'Parent'}</p>
          </div>

          {learners && learners.length > 0 && (
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4 text-muted-foreground" />
              <Select value={activeLearnerId || ''} onValueChange={setActiveLearner}>
                <SelectTrigger className="w-[200px] h-9">
                  <SelectValue placeholder="Select learner" />
                </SelectTrigger>
                <SelectContent>
                  {learners.map((learner) => (
                    <SelectItem key={learner.id} value={learner.id}>
                      {learner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </header>

        {!hasFamily && isLoaded ? (
          <Card>
            <CardContent className="py-8 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Complete onboarding to unlock lessons.</p>
                <p className="text-sm text-muted-foreground">Set up your family profile first.</p>
              </div>
              <Button onClick={() => navigate('/onboarding')}>Complete Onboarding</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/20">
            <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="space-y-1 min-w-[240px]">
                <p className="text-sm text-muted-foreground">Continue learning</p>
                <p className="font-medium">{continueTopicTitle}{continueLessonTitle ? ` — ${continueLessonTitle}` : ''}</p>
                {activeLearnerId ? (
                  <Badge variant="outline">{activeLearnerName} · Band {activeLearnerBand} · {getBandLabel(activeLearnerBand)}</Badge>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <LessonProgress status={continueStatus} />
                <Button onClick={() => navigate('/play/ch01')}>
                  <IconPlayerPlay className="w-4 h-4 mr-2" />
                  Continue Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 grid-cols-1 lg:grid-cols-[1fr_220px] min-h-0">
          <Card className="min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Choose a chapter</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 overflow-hidden">
              {CHAPTERS.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant="outline"
                  className="h-auto py-3 justify-between whitespace-normal text-left"
                  onClick={() => navigate(`/play/${chapter.id}`)}
                >
                  <span className="text-sm">{chapter.num}. {chapter.title}</span>
                  <IconArrowRight className="w-4 h-4 shrink-0" />
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">More</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/progress')}>Progress</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/glossary')}>Glossary</Button>
              {isAdmin ? (
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/admin')}>
                  <IconBook className="w-4 h-4 mr-2" />
                  Admin Tools
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
