import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconCheck, IconClock, IconList, IconArrowRight, IconHome } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface PostLessonSummaryProps {
  isVisible: boolean;
  totalTimeMs: number;
  topicsCovered?: string[];
  onDismiss: () => void;
}

export function PostLessonSummary({ isVisible, totalTimeMs, topicsCovered = [], onDismiss }: PostLessonSummaryProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-zinc-950 border border-border/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        {/* Confetti or Celebration effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-success" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/30">
             <IconCheck className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Lesson Complete!</h2>
          <p className="text-zinc-400">Great job. You have successfully finished this lesson.</p>
        </div>

        <div className="space-y-4 mb-8 bg-zinc-900/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-3 text-zinc-300">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <IconClock className="w-4 h-4 text-primary" />
             </div>
             <div>
               <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Time Spent</p>
               <p className="font-semibold text-white">{formatTime(totalTimeMs)}</p>
             </div>
          </div>

          {topicsCovered.length > 0 && (
            <div className="flex items-start gap-3 text-zinc-300 pt-3 border-t border-border/30">
               <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <IconList className="w-4 h-4 text-accent" />
               </div>
               <div>
                 <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Topics Covered</p>
                 <ul className="text-sm space-y-1">
                   {topicsCovered.map((topic, i) => (
                     <li key={i} className="flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-zinc-600" />
                       {topic}
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
             className="w-full bg-primary hover:bg-primary/90 text-white"
             size="lg"
             onClick={() => navigate('/dashboard')}
          >
             Continue to Next Lesson <IconArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
             variant="outline"
             className="w-full border-zinc-800 hover:bg-zinc-800 text-zinc-300"
             size="lg"
             onClick={() => {
                 onDismiss();
                 navigate('/dashboard');
             }}
          >
             <IconHome className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
