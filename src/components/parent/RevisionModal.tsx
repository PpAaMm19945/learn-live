import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, RotateCcw } from 'lucide-react';

interface RevisionModalProps {
    isOpen: boolean;
    onClose: () => void;
    portfolioId: string;
    learnerId: string;
    learnerName: string;
    capacityName: string;
    onSuccess: () => void;
}

export function RevisionModal({
    isOpen,
    onClose,
    portfolioId,
    learnerId,
    learnerName,
    capacityName,
    onSuccess,
}: RevisionModalProps) {
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/portfolio/${portfolioId}/judge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`,
                },
                body: JSON.stringify({
                    status: 'rejected',
                    learnerId,
                    revisionNotes: notes.trim() || undefined,
                }),
            });

            if (res.ok) {
                setNotes('');
                onSuccess();
                onClose();
            } else {
                console.error('Failed to submit revision');
            }
        } catch (error) {
            console.error('Error submitting revision:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-amber-600" />
                        Require Revision
                    </DialogTitle>
                    <DialogDescription>
                        Send <strong>{learnerName}</strong> back to practice <strong>{capacityName}</strong> with your guidance notes attached.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="revision-notes" className="text-sm font-medium">
                            Parent Notes <span className="text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Textarea
                            id="revision-notes"
                            placeholder="What should they focus on? What did you observe? e.g., 'Try using real objects instead of fingers. Count slowly.'"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="resize-none bg-background"
                        />
                        <p className="text-[11px] text-muted-foreground">
                            These notes will appear on the learner's task and inform the AI witness in their next session.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                            Send for Revision
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
