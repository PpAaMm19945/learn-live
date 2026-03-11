import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Lightbulb } from 'lucide-react';

interface QuizQuestion {
    question: string;
    answer: string;
    hint?: string;
}

interface QuizWidgetProps {
    questions: QuizQuestion[];
    capacityName: string;
    onClose: () => void;
}

export function QuizWidget({ questions, capacityName, onClose }: QuizWidgetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [isFinished, setIsFinished] = useState(false);

    const current = questions[currentIndex];

    const handleReveal = () => {
        setShowAnswer(true);
    };

    const handleResult = (correct: boolean) => {
        const newScore = {
            correct: score.correct + (correct ? 1 : 0),
            total: score.total + 1,
        };
        setScore(newScore);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setShowHint(false);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        const pct = Math.round((score.correct / score.total) * 100);
        return (
            <div className="border border-primary/20 rounded-xl p-6 bg-primary/5 space-y-4">
                <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{pct}%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {score.correct} of {score.total} correct
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                        {pct >= 80 ? '🎉 Great work! Ready to move on.' : pct >= 50 ? '👍 Good try! A bit more practice might help.' : '💪 Keep going! Try these activities a few more times.'}
                    </p>
                </div>
                <Button variant="outline" className="w-full" onClick={onClose}>
                    Close Practice
                </Button>
            </div>
        );
    }

    return (
        <div className="border border-primary/20 rounded-xl p-5 bg-primary/5 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Practice Questions
                </h4>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{currentIndex + 1} / {questions.length}</Badge>
                    <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
                </div>
            </div>

            <div className="bg-background rounded-lg p-4 border border-border">
                <p className="text-[15px] font-medium text-foreground leading-relaxed">{current.question}</p>
            </div>

            {!showAnswer ? (
                <div className="flex gap-2">
                    {current.hint && !showHint && (
                        <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary" onClick={() => setShowHint(true)}>
                            <Lightbulb className="w-3 h-3" /> Hint
                        </Button>
                    )}
                    <Button className="flex-1 gap-1" onClick={handleReveal}>
                        Show Answer <ChevronRight className="w-3 h-3" />
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <p className="text-[14px] font-medium text-green-800 dark:text-green-200">{current.answer}</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">Did the child get it right?</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 gap-1 border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleResult(true)}>
                            <CheckCircle2 className="w-4 h-4" /> Yes
                        </Button>
                        <Button variant="outline" className="flex-1 gap-1 border-orange-300 text-orange-700 hover:bg-orange-50" onClick={() => handleResult(false)}>
                            <XCircle className="w-4 h-4" /> Not yet
                        </Button>
                    </div>
                </div>
            )}

            {showHint && !showAnswer && current.hint && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <p className="text-[13px] text-amber-800 dark:text-amber-200 italic">💡 {current.hint}</p>
                </div>
            )}
        </div>
    );
}
