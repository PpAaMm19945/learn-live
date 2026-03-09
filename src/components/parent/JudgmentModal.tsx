import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RotateCcw } from 'lucide-react';
import { RevisionModal } from '@/components/parent/RevisionModal';

export interface JudgmentItem {
    id: string;
    learner_id: string;
    learner_name: string;
    task_id: string;
    domain: string;
    capacity: string;
    evidence_url: string;
    ai_confidence_score: number;
    transcript_summary: string;
    created_at: string;
}

interface JudgmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: JudgmentItem | null;
    onSuccess: () => void;
}

export function JudgmentModal({ isOpen, onClose, item, onSuccess }: JudgmentModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRevision, setShowRevision] = useState(false);

    if (!item) return null;

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/portfolio/${item.id}/judge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`
                },
                body: JSON.stringify({ status: 'approved', learnerId: item.learner_id })
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                console.error('Failed to submit judgment');
            }
        } catch (error) {
            console.error('Error submitting judgment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen && !showRevision} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-2xl bg-card text-card-foreground">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Review Evidence</DialogTitle>
                        <DialogDescription>
                            {item.learner_name} completed a task in {item.domain}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Capacity</h3>
                                    <p className="text-lg font-semibold">{item.capacity}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">AI Assessment</h3>
                                    <div className="bg-secondary/50 p-4 rounded-lg space-y-3 border border-border">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Confidence Score</span>
                                            <Badge variant={item.ai_confidence_score >= 0.8 ? "default" : "destructive"}>
                                                {Math.round(item.ai_confidence_score * 100)}%
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium block mb-1">Transcript Summary</span>
                                            <p className="text-sm text-secondary-foreground leading-relaxed">
                                                {item.transcript_summary || "No summary provided."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                {item.evidence_url ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                                        <img
                                            src={item.evidence_url}
                                            alt="Evidence Snapshot"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center border border-dashed border-border">
                                        <span className="text-muted-foreground">No visual evidence</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-border">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-amber-500/30 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                                onClick={() => setShowRevision(true)}
                                disabled={isSubmitting}
                            >
                                <RotateCcw className="w-5 h-5" />
                                Requires Revision
                            </Button>
                            <Button
                                variant="default"
                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleApprove}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                Approve (Unlock Next)
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <RevisionModal
                isOpen={showRevision}
                onClose={() => setShowRevision(false)}
                portfolioId={item.id}
                learnerId={item.learner_id}
                learnerName={item.learner_name}
                capacityName={item.capacity}
                onSuccess={() => {
                    onSuccess();
                    onClose();
                    setShowRevision(false);
                }}
            />
        </>
    );
}
