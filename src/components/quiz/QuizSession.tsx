import React, { useState } from 'react';
import { QuizCard, QuizQuestion } from './QuizCard';
import { useAuthStore } from '@/lib/auth';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logger } from '@/lib/Logger';

interface QuizSessionProps {
    topicId: string;
    questions: QuizQuestion[];
    onComplete?: (score: number, total: number) => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ topicId, questions, onComplete }) => {
    const { userId } = useAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async (isCorrect: boolean) => {
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
            await submitScore(newScore);
        }
    };

    const submitScore = async (finalScore: number) => {
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
            const res = await fetch(`${apiUrl}/api/quiz/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    topicId,
                    score: finalScore,
                    total: questions.length,
                    userId,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to submit quiz score');
            }

            Logger.info('[UI]', 'Quiz score submitted successfully', { topicId, finalScore });
        } catch (err) {
            Logger.error('[UI]', 'Error submitting quiz score', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTryAgain = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
    };

    if (!questions || questions.length === 0) {
        return <div>No questions available for this quiz.</div>;
    }

    if (isFinished) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center py-8">
                <CardHeader>
                    <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xl">
                        You scored <span className="font-bold text-primary">{score}</span> out of <span className="font-bold">{questions.length}</span>
                    </p>
                    <Progress value={(score / questions.length) * 100} className="h-4 w-3/4 mx-auto" />
                    <p className="text-muted-foreground mt-4">
                        {score === questions.length ? 'Perfect score! Great job!' : 'Good effort! Keep practicing.'}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4 mt-6">
                    <Button variant="outline" onClick={handleTryAgain} disabled={isSubmitting}>
                        Try Again
                    </Button>
                    <Button disabled={isSubmitting} onClick={() => onComplete && onComplete(score, questions.length)}>
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    const progressPercentage = ((currentIndex) / questions.length) * 100;

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </div>

            <QuizCard
                key={questions[currentIndex].id}
                question={questions[currentIndex]}
                onNext={handleNext}
            />
        </div>
    );
};
