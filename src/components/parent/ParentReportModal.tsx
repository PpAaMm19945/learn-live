import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Loader2, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface ParentReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateId: string;
    learnerId: string;
    learnerName: string;
    capacityName: string;
    successCondition: string;
    failureCondition?: string;
    onSuccess?: () => void;
}

export function ParentReportModal({
    isOpen,
    onClose,
    templateId,
    learnerId,
    learnerName,
    capacityName,
    successCondition,
    failureCondition,
    onSuccess,
}: ParentReportModalProps) {
    const { familyId } = useAuthStore();
    const [step, setStep] = useState<'observe' | 'assess' | 'submitting' | 'done'>('observe');
    const [observation, setObservation] = useState('');
    const [outcome, setOutcome] = useState<'success' | 'failure' | ''>('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!outcome) {
            toast.error('Please select an outcome');
            return;
        }

        setStep('submitting');
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || ''}`,
                },
                body: JSON.stringify({
                    learnerId,
                    taskId: templateId,
                    status: outcome,
                    evidenceUrl: '', // Parent report — no media
                    summary: `[PARENT REPORT] Observation: ${observation}\nOutcome: ${outcome}\nNotes: ${notes}`,
                    aiConfidenceScore: outcome === 'success' ? 1.0 : 0.0,
                    evidenceType: 'parent_report',
                }),
            });

            if (res.ok) {
                setStep('done');
                toast.success('Report submitted!');
                onSuccess?.();
            } else {
                throw new Error('Submit failed');
            }
        } catch (error) {
            console.error('Report submission error:', error);
            toast.error('Failed to submit report');
            setStep('assess');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep('observe');
        setObservation('');
        setOutcome('');
        setNotes('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px] bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Parent Report
                    </DialogTitle>
                    <DialogDescription>
                        Record your observation of <strong>{learnerName}</strong> practicing <strong>{capacityName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 'observe' && (
                        <div className="space-y-5">
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">What to look for</p>
                                <p className="text-sm text-foreground leading-relaxed">{successCondition}</p>
                                {failureCondition && (
                                    <p className="text-sm text-muted-foreground mt-2 italic">Watch for: {failureCondition}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observation" className="text-sm font-medium">
                                    What did you observe?
                                </Label>
                                <Textarea
                                    id="observation"
                                    placeholder="e.g., She counted the mangoes one by one, touching each one. She got confused at 7 and restarted."
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    rows={4}
                                    className="resize-none bg-background"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Describe what the child did — actions, words, gestures. No judgment needed yet.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 'assess' && (
                        <div className="space-y-5">
                            {observation && (
                                <div className="bg-secondary/50 border border-border rounded-lg p-3">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Your observation</p>
                                    <p className="text-sm text-foreground">{observation}</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Did the child meet the success condition?</Label>
                                <RadioGroup value={outcome} onValueChange={(v) => setOutcome(v as 'success' | 'failure')}>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors">
                                        <RadioGroupItem value="success" id="success" className="mt-0.5" />
                                        <label htmlFor="success" className="cursor-pointer flex-1">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                <span className="font-medium text-sm">Yes — Ready to advance</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{successCondition}</p>
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 cursor-pointer transition-colors">
                                        <RadioGroupItem value="failure" id="failure" className="mt-0.5" />
                                        <label htmlFor="failure" className="cursor-pointer flex-1">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-amber-600" />
                                                <span className="font-medium text-sm">Not yet — Needs more practice</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">The child will repeat this task with your guidance.</p>
                                        </label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">
                                    Additional notes <span className="text-muted-foreground font-normal">(optional)</span>
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any specific areas to focus on next time, or encouragement for the child."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="resize-none bg-background"
                                />
                            </div>
                        </div>
                    )}

                    {step === 'submitting' && (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground">Submitting report...</p>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Report Submitted</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                {outcome === 'success'
                                    ? `${learnerName}'s progress has been recorded. The next task will unlock.`
                                    : `${learnerName} will see this task again with your guidance notes attached.`}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    {step === 'observe' && (
                        <>
                            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => setStep('assess')} disabled={!observation.trim()} className="gap-2">
                                Next <ArrowRight className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {step === 'assess' && (
                        <>
                            <Button variant="ghost" onClick={() => setStep('observe')} className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </Button>
                            <Button onClick={handleSubmit} disabled={!outcome || isSubmitting} className="gap-2">
                                Submit Report <FileText className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {step === 'done' && (
                        <Button className="w-full" onClick={handleClose}>Close</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
