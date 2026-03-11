import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface QuizOption {
    id: string;
    text: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: QuizOption[];
    correctOptionId: string;
    explanation?: string;
}

export interface QuizCardProps {
    question: QuizQuestion;
    onNext: (isCorrect: boolean) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, onNext }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isCorrect = selectedId === question.correctOptionId;

    const handleSubmit = () => {
        if (!selectedId) return;
        setIsSubmitted(true);
    };

    const handleNext = () => {
        setIsSubmitted(false);
        setSelectedId(null);
        onNext(isCorrect);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedId || undefined}
                    onValueChange={(val) => !isSubmitted && setSelectedId(val)}
                    className="space-y-3"
                >
                    {question.options.map((option) => {
                        let optionStyle = 'border-border';
                        if (isSubmitted) {
                            if (option.id === question.correctOptionId) {
                                optionStyle = 'border-primary bg-primary/10 text-primary';
                            } else if (option.id === selectedId) {
                                optionStyle = 'border-destructive bg-destructive/10 text-destructive';
                            }
                        } else if (selectedId === option.id) {
                            optionStyle = 'border-ring bg-accent';
                        }

                        return (
                            <div
                                key={option.id}
                                className={`flex items-center space-x-2 border rounded-md p-4 transition-colors ${
                                    !isSubmitted ? 'cursor-pointer hover:bg-accent hover:text-accent-foreground' : ''
                                } ${optionStyle}`}
                                onClick={() => !isSubmitted && setSelectedId(option.id)}
                            >
                                <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    disabled={isSubmitted}
                                />
                                <Label
                                    htmlFor={option.id}
                                    className={`flex-grow cursor-pointer ${
                                        isSubmitted ? 'cursor-default' : ''
                                    }`}
                                >
                                    {option.text}
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>

                {isSubmitted && (
                    <div className={`mt-6 p-4 rounded-md ${isCorrect ? 'bg-primary/20 text-foreground' : 'bg-destructive/20 text-foreground'}`}>
                        <h4 className="font-semibold mb-2">
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </h4>
                        {question.explanation && (
                            <p className="text-sm">{question.explanation}</p>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                {!isSubmitted ? (
                    <Button onClick={handleSubmit} disabled={!selectedId}>
                        Submit
                    </Button>
                ) : (
                    <Button onClick={handleNext}>
                        Next
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};
