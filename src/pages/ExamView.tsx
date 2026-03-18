import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconMicrophone, IconLoader2, IconSquare, IconCircleCheck, IconClock } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ParentReviewModal } from '@/components/exam/ParentReviewModal';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveBand } from '@/lib/learnerStore';
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
}

export default function ExamView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const band = useActiveBand();
  const { roles } = useAuthStore();
  const isParent = roles.includes('parent');

  const [status, setStatus] = useState<'setup' | 'active' | 'evaluating' | 'complete' | 'error'>('setup');
  const [sessionTime, setSessionTime] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [assessmentDraft, setAssessmentDraft] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: lesson, isLoading: isLessonLoading } = useQuery<LessonData>({
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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startExam = () => {
    setStatus('active');
    Logger.info('[WITNESS]', 'Oral exam started');
    setSessionTime(0);
    timerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  };

  const endExam = () => {
    setStatus('evaluating');
    if (timerRef.current) clearInterval(timerRef.current);
    Logger.info('[WITNESS]', 'Oral exam ended');

    setTimeout(() => {
      setAssessmentDraft(
        `AI Assessment Draft (Band ${band}):\n\nThe learner demonstrated a clear understanding of the core concepts in "${lesson?.title}". They successfully identified key figures and explained the chronological events with reasonable accuracy.`
      );
      setStatus('complete');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getInstructions = () => {
    if (band <= 1) {
      return "Let's talk about what we just learned. I'm going to ask you a few simple questions. Just tell me what you remember.";
    } else if (band <= 3) {
      return "Welcome to The Witness. You will be asked to describe key events and figures from this lesson. Please speak clearly.";
    }
    return "This is a comprehensive oral examination. Be prepared to analyze the material, compare historical events, and provide detailed explanations.";
  };

  if (isLessonLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">
          <Skeleton className="w-24 h-24 rounded-full mb-6" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-3/4 max-w-md mb-8" />
          <Skeleton className="h-14 w-48 rounded-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-4xl w-full mx-auto px-4 pt-6">
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
                <Link to={`/topics/${lesson?.topic_id || ''}`}>Topic</Link>
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
              <BreadcrumbPage>The Witness</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">

        {status === 'setup' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300 w-full px-4">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <IconMicrophone className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight">Ready for The Witness?</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
              {getInstructions()}
            </p>
            <Button size="lg" onClick={startExam} className="w-full sm:w-auto px-8 py-6 text-lg rounded-full" aria-label="Start Recording">
              <IconMicrophone className="w-5 h-5 mr-2" /> Start Recording
            </Button>
          </div>
        )}

        {status === 'active' && (
           <div className="text-center space-y-12 animate-in fade-in duration-300 w-full px-4">
               <div className="relative flex items-center justify-center h-48 sm:h-64">
                    <div className="absolute w-32 h-32 sm:w-48 sm:h-48 bg-primary/20 rounded-full animate-ping pointer-events-none"></div>
                    <div className="absolute w-24 h-24 sm:w-36 sm:h-36 bg-primary/40 rounded-full animate-pulse pointer-events-none"></div>
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-primary rounded-full border-4 border-background/20 flex items-center justify-center">
                        <IconMicrophone className="w-6 h-6 sm:w-10 sm:h-10 text-primary-foreground animate-pulse" />
                    </div>
               </div>

               <div className="space-y-4">
                   <h3 className="font-display text-2xl">Listening...</h3>
                   <p className="text-muted-foreground">Speak clearly into your microphone.</p>
                   <p className="font-mono text-xs text-muted-foreground">{formatTime(sessionTime)}</p>
               </div>

               <Button size="lg" variant="destructive" onClick={endExam} className="w-full sm:w-auto px-8 py-6 text-lg rounded-full" aria-label="Stop Exam">
                  <IconSquare className="w-5 h-5 mr-2 fill-current" /> Stop
               </Button>
           </div>
        )}

        {status === 'evaluating' && (
           <div className="text-center space-y-8 animate-in fade-in duration-300">
               <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
               <h2 className="font-display text-2xl">Evaluating responses…</h2>
               <p className="text-muted-foreground max-w-md mx-auto">
                   The AI is analyzing your answers and drafting an assessment.
               </p>
           </div>
        )}

        {status === 'complete' && (
           <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 w-full max-w-2xl px-4">
               <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-primary mx-auto" />
               <h2 className="font-display text-2xl sm:text-3xl">Witness Complete</h2>
               <p className="text-base sm:text-lg text-muted-foreground">
                   The AI has drafted an assessment for your parent to review.
               </p>

               <div className="bg-card p-4 sm:p-6 rounded-xl border border-border/50 text-left space-y-4 w-full">
                   <h4 className="font-medium flex items-center gap-2">
                       <Clock className="w-4 h-4 text-muted-foreground" />
                       Session Details
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                       <div><span className="text-muted-foreground">Duration:</span> <span className="font-mono">{formatTime(sessionTime)}</span></div>
                       <div><span className="text-muted-foreground">Band Level:</span> <span className="font-mono">{band}</span></div>
                   </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full">
                   <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(`/lessons/${lessonId}`)} aria-label="Return to Lesson">
                       Return to Lesson
                   </Button>
                   {isParent && (
                       <Button className="w-full sm:w-auto" onClick={() => setIsReviewModalOpen(true)} aria-label="Review Assessment Now">
                           Review Assessment Now
                       </Button>
                   )}
               </div>
           </div>
        )}
      </main>

      <ParentReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        assessmentDraft={assessmentDraft}
        lessonId={lessonId!}
      />
    </div>
  );
}
