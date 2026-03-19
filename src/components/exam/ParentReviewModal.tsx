import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IconLoader2, IconCircleCheck, IconRotateClockwise, IconGavel } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ParentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentDraft: string;
  lessonId: string;
}

export function ParentReviewModal({ isOpen, onClose, assessmentDraft, lessonId }: ParentReviewModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async (action: 'approve' | 'redo') => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (action === 'approve') {
        setShowStamp(true);
        await new Promise(resolve => setTimeout(resolve, 1800));
      }

      toast({
        title: action === 'approve' ? 'Witness Approved' : 'Sent Back',
        description: action === 'approve' ? 'The assessment has been finalised.' : 'The learner will need to redo this exam.',
      });
      setShowStamp(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { setShowStamp(false); onClose(); } }}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-border/30 bg-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[420px]">
          {/* Left panel — AI Draft */}
          <div className="bg-muted/30 p-6 sm:border-r border-border/30 flex flex-col relative">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-display text-xl">AI Assessment Draft</DialogTitle>
              <DialogDescription className="text-sm">
                Review the AI-generated assessment for this oral exam.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {assessmentDraft}
            </div>

            {/* APPROVED stamp overlay */}
            <AnimatePresence>
              {showStamp && (
                <motion.div
                  initial={{ scale: 3, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="border-4 border-success text-success font-display text-4xl sm:text-5xl font-bold px-8 py-4 rounded-lg bg-background/80 backdrop-blur-sm tracking-widest uppercase"
                    style={{ transform: 'rotate(-12deg)' }}
                  >
                    Approved
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel — Parent actions */}
          <div className="p-6 flex flex-col">
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <IconGavel className="w-5 h-5 text-accent" />
              Your Judgment
            </h3>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium text-foreground">
                  Add Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add your own comments or observations…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[140px] bg-background border-border/50 resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-border/30">
              <Button
                onClick={() => handleSubmitReview('approve')}
                disabled={isSubmitting}
                className="w-full bg-success text-success-foreground hover:bg-success/90 gap-2"
              >
                {isSubmitting ? (
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <IconCircleCheck className="w-4 h-4" />
                )}
                Approve Assessment
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmitReview('redo')}
                disabled={isSubmitting}
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 gap-2"
              >
                <IconRotateClockwise className="w-4 h-4" />
                Send Back
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
