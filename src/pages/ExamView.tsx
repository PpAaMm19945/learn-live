import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Mic, Loader2, Square, CheckCircle, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ParentReviewModal } from '@/components/exam/ParentReviewModal';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';

interface LessonData {
  id: string;
  topic_id: string;
  title: string;
}

export default function ExamView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [band, setBand] = useState<number>(0);
  const { roles } = useAuthStore();
  const isParent = roles.includes('parent');

  const [status, setStatus] = useState<'setup' | 'active' | 'evaluating' | 'complete' | 'error'>('setup');
  const [sessionTime, setSessionTime] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [assessmentDraft, setAssessmentDraft] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedBand = localStorage.getItem('learn-live-band');
    if (savedBand) {
      setBand(parseInt(savedBand, 10));
    }
  }, []);

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
    Logger.info('[EVIDENCE]', 'Oral exam started');
    setSessionTime(0);
    timerRef.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    // Real implementation would connect to Gemini Live here
  };

  const endExam = () => {
    setStatus('evaluating');
    if (timerRef.current) clearInterval(timerRef.current);
    Logger.info('[EVIDENCE]', 'Oral exam ended manually');

    // Mocking evaluation delay and response
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
      return "Let's talk about what we just learned! I'm going to ask you a few simple questions. Don't worry, just tell me what you remember.";
    } else if (band <= 3) {
      return "Welcome to the oral exam. I'll be asking you to describe key events and figures from this lesson. Please speak clearly.";
    }
    return "This is a comprehensive oral examination. Be prepared to analyze the material, compare historical events, and provide detailed explanations.";
  };

  if (isLessonLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lessons/${lessonId}`)}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Lesson
          </Button>
          <div className="flex flex-col flex-grow">
            <h1 className="text-sm font-medium truncate">{lesson?.title || 'Oral Exam'}</h1>
          </div>
          <div className="flex items-center gap-4">
             {status === 'active' && (
                 <Badge variant="outline" className="font-mono bg-background">
                     <Clock className="w-3 h-3 mr-2 text-primary animate-pulse" />
                     {formatTime(sessionTime)}
                 </Badge>
             )}
             <Badge variant="secondary">Band {band}</Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">

        {status === 'setup' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Mic className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Ready for your oral exam?</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {getInstructions()}
            </p>
            <Button size="lg" onClick={startExam} className="px-8 py-6 text-lg rounded-full">
              <Mic className="w-5 h-5 mr-2" /> Start Recording
            </Button>
          </div>
        )}

        {status === 'active' && (
           <div className="text-center space-y-12 animate-in fade-in duration-300 w-full">
               <div className="relative flex items-center justify-center h-64">
                    {/* Visualizer Adapted from EvidenceWitness */}
                    <div className="absolute w-48 h-48 bg-primary/20 rounded-full animate-ping pointer-events-none"></div>
                    <div className="absolute w-36 h-36 bg-primary/40 rounded-full animate-pulse pointer-events-none"></div>
                    <div className="relative w-24 h-24 bg-primary rounded-full shadow-[0_0_50px_rgba(var(--primary),0.8)] border-4 border-background/20 flex items-center justify-center">
                        <Mic className="w-10 h-10 text-primary-foreground animate-pulse" />
                    </div>
               </div>

               <div className="space-y-4">
                   <h3 className="text-2xl font-semibold">Listening...</h3>
                   <p className="text-muted-foreground">Speak clearly into your microphone.</p>
               </div>

               <Button size="lg" variant="destructive" onClick={endExam} className="px-8 py-6 text-lg rounded-full">
                  <Square className="w-5 h-5 mr-2 fill-current" /> Stop Exam
               </Button>
           </div>
        )}

        {status === 'evaluating' && (
           <div className="text-center space-y-8 animate-in fade-in duration-300">
               <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
               <h2 className="text-2xl font-bold">Evaluating Responses...</h2>
               <p className="text-muted-foreground max-w-md mx-auto">
                   The AI is analyzing your answers and drafting an assessment.
               </p>
           </div>
        )}

        {status === 'complete' && (
           <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 w-full max-w-2xl">
               <CheckCircle className="w-24 h-24 text-primary mx-auto" />
               <h2 className="text-3xl font-bold">Exam Complete!</h2>
               <p className="text-lg text-muted-foreground">
                   Great job! The AI has drafted an assessment for your parent to review.
               </p>

               <div className="bg-muted/30 p-6 rounded-xl border border-border/50 text-left space-y-4">
                   <h4 className="font-semibold flex items-center gap-2">
                       <Clock className="w-4 h-4 text-muted-foreground" />
                       Session Details
                   </h4>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                       <div><span className="text-muted-foreground">Duration:</span> {formatTime(sessionTime)}</div>
                       <div><span className="text-muted-foreground">Band Level:</span> {band}</div>
                   </div>
               </div>

               <div className="flex gap-4 justify-center mt-8">
                   <Button variant="outline" onClick={() => navigate(`/lessons/${lessonId}`)}>
                       Return to Lesson
                   </Button>
                   {isParent && (
                       <Button onClick={() => setIsReviewModalOpen(true)}>
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
