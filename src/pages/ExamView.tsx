import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconMicrophone, IconLoader2, IconSquare, IconCircleCheck, IconClock, IconArrowLeft } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ParentReviewModal } from '@/components/exam/ParentReviewModal';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveBand } from '@/lib/learnerStore';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonData {
  id: string;
  topic_id: string;
  title: string;
}

/** Animated SVG blob that pulses with amber tones during active recording */
function AmberBlob({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative flex items-center justify-center h-56 sm:h-72">
      <svg viewBox="0 0 200 200" className="absolute w-48 h-48 sm:w-64 sm:h-64" aria-hidden>
        <defs>
          <radialGradient id="amber-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
            <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.path
          d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,41.2C63.4,53.4,51,63.3,37.2,70.8C23.4,78.3,8.2,83.4,-6.2,82.1C-20.6,80.8,-34.2,73.1,-46.2,63.4C-58.2,53.7,-68.6,42,-75.2,28.1C-81.8,14.2,-84.6,-1.9,-80.8,-16.3C-77,-30.7,-66.6,-43.4,-54,-53.1C-41.4,-62.8,-26.6,-69.5,-11,-68.2C4.6,-66.9,30.6,-83.6,44.7,-76.4Z"
          fill="url(#amber-glow)"
          transform="translate(100 100)"
          animate={isActive ? {
            d: [
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,41.2C63.4,53.4,51,63.3,37.2,70.8C23.4,78.3,8.2,83.4,-6.2,82.1C-20.6,80.8,-34.2,73.1,-46.2,63.4C-58.2,53.7,-68.6,42,-75.2,28.1C-81.8,14.2,-84.6,-1.9,-80.8,-16.3C-77,-30.7,-66.6,-43.4,-54,-53.1C-41.4,-62.8,-26.6,-69.5,-11,-68.2C4.6,-66.9,30.6,-83.6,44.7,-76.4Z",
              "M39.5,-67.8C52.9,-62.2,66.5,-54.3,74.9,-42.4C83.3,-30.5,86.5,-15.3,85.1,-0.8C83.7,13.7,77.7,27.4,69.1,39.1C60.5,50.8,49.3,60.5,36.4,67.2C23.5,73.9,8.9,77.6,-4.8,75.9C-18.5,74.2,-31.3,67.1,-43.6,58.4C-55.9,49.7,-67.7,39.4,-74.2,26.2C-80.7,13,-81.9,-3.1,-77.5,-17.3C-73.1,-31.5,-63.1,-43.8,-50.8,-50.1C-38.5,-56.4,-23.9,-56.7,-10.4,-57.3C3.1,-57.9,26.1,-73.4,39.5,-67.8Z",
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,41.2C63.4,53.4,51,63.3,37.2,70.8C23.4,78.3,8.2,83.4,-6.2,82.1C-20.6,80.8,-34.2,73.1,-46.2,63.4C-58.2,53.7,-68.6,42,-75.2,28.1C-81.8,14.2,-84.6,-1.9,-80.8,-16.3C-77,-30.7,-66.6,-43.4,-54,-53.1C-41.4,-62.8,-26.6,-69.5,-11,-68.2C4.6,-66.9,30.6,-83.6,44.7,-76.4Z",
            ],
            scale: [1, 1.08, 1],
          } : {}}
          transition={isActive ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
        />
      </svg>

      {/* Center mic icon */}
      <motion.div
        className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-full flex items-center justify-center shadow-lg"
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <IconMicrophone className="w-8 h-8 sm:w-10 sm:h-10 text-accent-foreground" />
      </motion.div>
    </div>
  );
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
      <div className="min-h-screen bg-void flex flex-col items-center justify-center">
        <Skeleton className="w-24 h-24 rounded-full mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-3/4 max-w-md mb-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex flex-col relative overflow-hidden">
      {/* Minimal HUD — top bar */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-1.5"
          onClick={() => navigate(`/lessons/${lessonId}`)}
        >
          <IconArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <span className="font-display text-sm text-muted-foreground tracking-wide uppercase">
          The Witness
        </span>

        {status === 'active' && (
          <span className="font-mono text-sm text-accent tabular-nums">
            {formatTime(sessionTime)}
          </span>
        )}
        {status !== 'active' && <div className="w-12" />}
      </header>

      {/* Main content area — vertically centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {status === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6 max-w-md w-full"
            >
              <AmberBlob isActive={false} />

              <h2 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
                Ready for The Witness?
              </h2>
              <p className="text-base text-muted-foreground">
                {getInstructions()}
              </p>

              <Button
                size="lg"
                onClick={startExam}
                className="px-8 py-6 text-lg rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                aria-label="Start Recording"
              >
                <IconMicrophone className="w-5 h-5 mr-2" />
                Begin
              </Button>
            </motion.div>
          )}

          {status === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-8 max-w-md w-full"
            >
              <AmberBlob isActive={true} />

              <div className="space-y-2">
                <h3 className="font-display text-2xl text-foreground">Listening…</h3>
                <p className="text-sm text-muted-foreground">Speak clearly into your microphone.</p>
              </div>

              <Button
                size="lg"
                variant="destructive"
                onClick={endExam}
                className="px-8 py-6 text-lg rounded-full"
                aria-label="Stop Exam"
              >
                <IconSquare className="w-5 h-5 mr-2 fill-current" />
                Stop
              </Button>
            </motion.div>
          )}

          {status === 'evaluating' && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <IconLoader2 className="w-16 h-16 text-accent mx-auto" />
              </motion.div>
              <h2 className="font-display text-2xl text-foreground">Evaluating responses…</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                The AI is analysing your answers and drafting an assessment.
              </p>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8 max-w-lg w-full px-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <IconCircleCheck className="w-20 h-20 sm:w-24 sm:h-24 text-success mx-auto" />
              </motion.div>

              <h2 className="font-display text-2xl sm:text-3xl text-foreground">Witness Complete</h2>
              <p className="text-base text-muted-foreground">
                The AI has drafted an assessment for your parent to review.
              </p>

              <div className="bg-card/60 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border/30 text-left space-y-4 w-full">
                <h4 className="font-medium flex items-center gap-2 text-foreground">
                  <IconClock className="w-4 h-4 text-muted-foreground" />
                  Session Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                  <div><span className="text-muted-foreground">Duration:</span> <span className="font-mono text-foreground">{formatTime(sessionTime)}</span></div>
                  <div><span className="text-muted-foreground">Band Level:</span> <span className="font-mono text-foreground">{band}</span></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 w-full">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate(`/lessons/${lessonId}`)}>
                  Return to Lesson
                </Button>
                {isParent && (
                  <Button className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIsReviewModalOpen(true)}>
                    Review Assessment Now
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
