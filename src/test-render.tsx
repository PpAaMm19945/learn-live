import React from 'react';
import { createRoot } from 'react-dom/client';
import { QuizSession } from '@/components/quiz/QuizSession';
import { ProgressOverview } from '@/components/progress/ProgressOverview';
import { LessonProgress } from '@/components/progress/LessonProgress';

import '@/index.css';

const sampleQuestions = [
    {
        id: 'q1',
        question: 'What is the capital of France?',
        options: [
            { id: 'o1', text: 'London' },
            { id: 'o2', text: 'Berlin' },
            { id: 'o3', text: 'Paris' },
            { id: 'o4', text: 'Madrid' },
        ],
        correctOptionId: 'o3',
        explanation: 'Paris is the capital and most populous city of France.',
    },
    {
        id: 'q2',
        question: 'Which planet is known as the Red Planet?',
        options: [
            { id: 'o1', text: 'Venus' },
            { id: 'o2', text: 'Mars' },
            { id: 'o3', text: 'Jupiter' },
            { id: 'o4', text: 'Saturn' },
        ],
        correctOptionId: 'o2',
        explanation: 'Mars is known as the Red Planet due to its reddish appearance.',
    }
];

const App = () => {
    return (
        <div className="p-8 space-y-12 bg-background min-h-screen">
            <section>
                <h2 className="text-2xl font-bold mb-4">Lesson Progress Badges</h2>
                <div className="flex space-x-4">
                    <LessonProgress status="not_started" />
                    <LessonProgress status="in_progress" />
                    <LessonProgress status="completed" />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Quiz Session</h2>
                <QuizSession topicId="t1" questions={sampleQuestions} onComplete={(score, total) => console.log('Quiz complete', score, total)} />
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-4">Progress Overview (Skeleton initially, mocked fetch)</h2>
                {/* Normally we mock the fetch, but for quick visual test, just rendering it will show skeleton or error */}
                <ProgressOverview />
            </section>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}
