import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentDraft: string;
  lessonId: string;
}

export function ParentReviewModal({ isOpen, onClose, assessmentDraft, lessonId }: ParentReviewModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async (action: 'approve' | 'redo') => {
    setIsSubmitting(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: action === 'approve' ? 'Witness Approved' : 'Sent Back',
        description: action === 'approve' ? 'The assessment has been finalized.' : 'The learner will need to redo this exam.',
      });
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Review Assessment</DialogTitle>
          <DialogDescription>
            Review the AI-generated assessment draft for this oral exam.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 bg-card border rounded-md max-h-48 overflow-y-auto text-sm">
          <p className="whitespace-pre-wrap">{assessmentDraft}</p>
        </div>

        <div className="space-y-2">
           <label htmlFor="notes" className="text-sm font-medium">Add Notes (Optional)</label>
           <Textarea
             id="notes"
             placeholder="Add your own comments or observations..."
             value={notes}
             onChange={(e) => setNotes(e.target.value)}
             className="min-h-[100px]"
           />
        </div>

        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => handleSubmitReview('redo')}
            disabled={isSubmitting}
            className="w-full sm:w-auto text-destructive border-destructive/50 hover:bg-destructive/10"
          >
            Send Back
          </Button>
          <Button
            variant="default"
            onClick={() => handleSubmitReview('approve')}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Witness Approved
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
