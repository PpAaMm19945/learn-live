import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stripMarkdown } from '@/lib/textUtils';
import { useAuthStore } from '@/lib/auth';
import { IconBook, IconClock, IconAlertCircle, IconRefresh, IconUsers, IconChevronRight, IconArrowLeft, IconPlayerPlay } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLearnerStore } from '@/lib/learnerStore';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonProgress } from '@/components/progress/LessonProgress';

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

const CHAPTERS = [
  { id: 'ch01', num: 1, title: 'Creation, Babel & Table of Nations', era: 'Ancient', color: '#fac775' },
  { id: 'ch02', num: 2, title: 'Ancient Egypt', era: 'Ancient', color: '#e8a87c' },
  { id: 'ch03', num: 3, title: 'Kingdom of Kush & Nubia', era: 'Ancient', color: '#c47cb8' },
  { id: 'ch04', num: 4, title: 'Phoenicians & Carthage', era: 'Classical', color: '#7cc4a8' },
  { id: 'ch05', num: 5, title: 'Church in Roman Africa', era: 'Classical', color: '#c4a87c' },
  { id: 'ch06', num: 6, title: 'Aksum & Ethiopian Christianity', era: 'Classical', color: '#c4a87c' },
  { id: 'ch07', num: 7, title: 'Rise of Islam in Africa', era: 'Medieval', color: '#8ac47c' },
  { id: 'ch08', num: 8, title: 'Bantu Migrations', era: 'Medieval', color: '#c47c7c' },
  { id: 'ch09', num: 9, title: 'Medieval African Kingdoms', era: 'Medieval', color: '#e8c87c' },
];

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

  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

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

  const selectedChapter = CHAPTERS.find(c => c.id === selectedChapterId);
  const selectedTopicData = topics?.find(t => t.title.includes(selectedChapter?.num.toString() || ''));

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8 relative">
        {/* HERO SECTION */}
        <div className="space-y-6">
          <h2 className="font-display text-3xl leading-tight tracking-tight">Welcome back, {name || 'Parent'}</h2>

          {activeLearnerId && (
            <Card className="bg-card border-border/50 max-w-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <IconBook className="h-5 w-5 text-primary" />
                      <span className="font-display text-lg">
                        Learning as: {activeLearnerName}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-background">
                      Band {activeLearnerBand} · {getBandLabel(activeLearnerBand)}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    Currently on: <span className="font-medium text-foreground">
                      {continueTopicTitle}{continueLessonTitle ? ` — ${stripMarkdown(continueLessonTitle)}` : ''}
                    </span>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      className="bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => navigate('/play/ch01')}
                    >
                      <IconPlayerPlay className="w-4 h-4 mr-2" /> Start Live Lesson
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {learners && learners.length > 0 && (
            <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border/50 w-max shadow-sm">
              <IconUsers className="h-5 w-5 text-muted-foreground ml-2" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium mb-1">Switch Learner</span>
                <Select
                  value={activeLearnerId || ''}
                  onValueChange={setActiveLearner}
                >
                  <SelectTrigger className="w-[200px] h-8 bg-background border-border/50">
                    <SelectValue placeholder="Select a learner" />
                  </SelectTrigger>
                  <SelectContent>
                    {learners.map(learner => (
                      <SelectItem key={learner.id} value={learner.id}>
                        {learner.name} <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 bg-muted/50">Band {learner.band}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {!hasFamily && isLoaded ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl bg-card shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <IconUsers className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl mb-2">Complete your family profile</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">To start your curriculum journey, please complete the onboarding process and set up your family profile.</p>
            <Button onClick={() => navigate('/onboarding')}>
              Complete Onboarding
            </Button>
          </div>
        ) : (
          <div className="mt-12 relative min-h-[500px]">
             <h3 className="font-display text-2xl leading-tight mb-8">Curriculum Library</h3>

             <AnimatePresence mode="wait">
                {selectedChapterId ? (
                   <motion.div
                      key="detail"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="w-full max-w-3xl mx-auto"
                   >
                      <Button variant="ghost" className="mb-4" onClick={() => setSelectedChapterId(null)}>
                         <IconArrowLeft className="w-4 h-4 mr-2" /> Back to Shelf
                      </Button>
                      <Card className="border-border overflow-hidden shadow-lg">
                         <div className="h-2 w-full" style={{ backgroundColor: selectedChapter?.color }} />
                         <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                               <Badge style={{ backgroundColor: selectedChapter?.color, color: '#1a1a1a' }} className="font-semibold">
                                  {selectedChapter?.era}
                               </Badge>
                               <span className="text-sm text-muted-foreground font-medium">Chapter {selectedChapter?.num}</span>
                            </div>
                            <h3 className="text-2xl font-display">{selectedChapter?.title}</h3>
                            <p className="text-muted-foreground mt-2">
                               {selectedTopicData?.description || 'Explore the interactive lesson for this chapter.'}
                            </p>
                         </CardHeader>
                         <CardContent>
                             <div className="space-y-4">
                               <div className="p-4 border rounded-lg bg-card flex justify-between items-center hover:border-primary/50 transition-colors">
                                  <div>
                                     <h4 className="font-medium">Interactive Lesson</h4>
                                     <p className="text-sm text-muted-foreground">Complete AI-guided narrative with interactive maps.</p>
                                  </div>
                                  <Button onClick={() => navigate(`/play/${selectedChapterId}`)}>
                                     Start <IconChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                               </div>

                               {selectedTopicData?.lessons?.map((lesson, idx) => (
                                 <div key={lesson.id} className="p-4 border rounded-lg bg-card flex justify-between items-center hover:border-primary/50 transition-colors">
                                    <div>
                                       <h4 className="font-medium">{idx + 1}. {stripMarkdown(lesson.title)}</h4>
                                       <p className="text-sm text-muted-foreground flex items-center mt-1">
                                          <IconClock className="w-3 h-3 mr-1" /> {lesson.estimated_time || '15 min'}
                                       </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <LessonProgress status={lesson.status} className="hidden sm:flex" />
                                    </div>
                                 </div>
                               ))}
                             </div>
                         </CardContent>
                      </Card>
                   </motion.div>
                ) : (
                   <motion.div
                      key="shelf"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                   >
                      {/* Desktop Shelf View */}
                      <div className="hidden md:block space-y-16 py-8 px-4 relative">
                         {/* Top Shelf */}
                         <div className="relative">
                            <div className="flex justify-center items-end gap-6 z-10 relative px-8">
                               {CHAPTERS.slice(0, 5).map((chapter, i) => (
                                  <motion.div
                                     key={chapter.id}
                                     whileHover={{ y: -15, scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={() => setSelectedChapterId(chapter.id)}
                                     className="w-[80px] h-[220px] rounded-sm cursor-pointer relative shadow-lg group border-r-2 border-l-2 border-black/10 transition-shadow hover:shadow-xl hover:shadow-primary/20"
                                     style={{ backgroundColor: chapter.color }}
                                  >
                                     <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10" />
                                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay" />
                                     <div className="flex flex-col items-center justify-between h-full py-4 relative z-10 text-zinc-900">
                                        <div className="w-10 h-10 rounded-full border-2 border-zinc-900/40 flex items-center justify-center font-display text-xl font-bold bg-white/20">
                                           {chapter.num}
                                        </div>
                                        <div className="writing-vertical-lr rotate-180 font-bold tracking-wider uppercase text-sm whitespace-nowrap overflow-hidden text-ellipsis h-[120px] leading-tight px-1 text-center">
                                           {chapter.title}
                                        </div>
                                     </div>
                                  </motion.div>
                               ))}
                            </div>
                            {/* Shelf Board */}
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-[#8B5A2B] to-[#5C3A21] rounded-sm shadow-xl translate-y-full z-0 border-t-2 border-[#A06C3B]" />
                            <div className="absolute bottom-[-16px] left-2 right-2 h-4 bg-black/20 blur-md translate-y-full z-[-1]" />
                         </div>

                         {/* Bottom Shelf */}
                         <div className="relative mt-24">
                            <div className="flex justify-center items-end gap-6 z-10 relative px-8">
                               {CHAPTERS.slice(5, 9).map((chapter, i) => (
                                  <motion.div
                                     key={chapter.id}
                                     whileHover={{ y: -15, scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                     onClick={() => setSelectedChapterId(chapter.id)}
                                     className="w-[80px] h-[220px] rounded-sm cursor-pointer relative shadow-lg group border-r-2 border-l-2 border-black/10 transition-shadow hover:shadow-xl hover:shadow-primary/20"
                                     style={{ backgroundColor: chapter.color }}
                                  >
                                     <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-white/10" />
                                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay" />
                                     <div className="flex flex-col items-center justify-between h-full py-4 relative z-10 text-zinc-900">
                                        <div className="w-10 h-10 rounded-full border-2 border-zinc-900/40 flex items-center justify-center font-display text-xl font-bold bg-white/20">
                                           {chapter.num}
                                        </div>
                                        <div className="writing-vertical-lr rotate-180 font-bold tracking-wider uppercase text-sm whitespace-nowrap overflow-hidden text-ellipsis h-[120px] leading-tight px-1 text-center">
                                           {chapter.title}
                                        </div>
                                     </div>
                                  </motion.div>
                               ))}
                            </div>
                            {/* Shelf Board */}
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-[#8B5A2B] to-[#5C3A21] rounded-sm shadow-xl translate-y-full z-0 border-t-2 border-[#A06C3B]" />
                            <div className="absolute bottom-[-16px] left-2 right-2 h-4 bg-black/20 blur-md translate-y-full z-[-1]" />
                         </div>
                      </div>

                      {/* Mobile Horizontal Scroll View */}
                      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory pb-8 gap-4 px-2 no-scrollbar">
                         {CHAPTERS.map(chapter => (
                            <motion.div
                               key={chapter.id}
                               whileTap={{ scale: 0.95 }}
                               onClick={() => setSelectedChapterId(chapter.id)}
                               className="min-w-[240px] snap-center shrink-0 cursor-pointer"
                            >
                               <Card className="h-full border-border/50 overflow-hidden shadow-sm hover:border-primary/50 transition-colors">
                                  <div className="h-3 w-full" style={{ backgroundColor: chapter.color }} />
                                  <CardContent className="p-5 flex flex-col h-full justify-between">
                                     <div>
                                        <div className="flex justify-between items-center mb-3">
                                           <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{chapter.era}</span>
                                           <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display font-bold">
                                              {chapter.num}
                                           </div>
                                        </div>
                                        <h4 className="font-display text-lg leading-tight mb-2">{chapter.title}</h4>
                                     </div>
                                     <Button variant="secondary" className="w-full mt-4" size="sm">
                                        View Details
                                     </Button>
                                  </CardContent>
                               </Card>
                            </motion.div>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
