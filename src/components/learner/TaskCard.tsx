import React from 'react';
import { BookOpen, Palette, Brain, Activity, Code, Heart, DefaultIcon as HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface MatrixTask {
    id: string;
    domain: string;
    capacity: string;
    responsibility_level: string;
    arena: string;
    arc_stage: string;
    constraint_to_enforce: {
        type: string;
        description: string;
        required_evidence: string[];
        timeout_seconds: number;
    };
    failure_condition: any;
    success_condition: any;
    role_instruction: any;
}

interface TaskCardProps {
    task: MatrixTask;
    onClick: (task: MatrixTask) => void;
}

// Map domain or capacity to an icon
const getDomainIcon = (domain: string, capacity: string) => {
    if (domain.includes('Language') || capacity.includes('Narrative')) return <BookOpen className="w-10 h-10 text-primary" />;
    if (capacity.includes('Artistic') || domain.includes('Art')) return <Palette className="w-10 h-10 text-pink-500" />;
    if (domain.includes('Math') || capacity.includes('Analytical')) return <Brain className="w-10 h-10 text-blue-500" />;
    if (domain.includes('Science')) return <Activity className="w-10 h-10 text-green-500" />;
    return <HelpCircle className="w-10 h-10 text-muted-foreground" />;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card
            className="cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md border-2 border-transparent hover:border-primary w-full max-w-sm"
            onClick={() => onClick(task)}
        >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    {getDomainIcon(task.domain, task.capacity)}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1">{task.capacity}</h3>
                    <div className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold mb-2">
                        {task.arc_stage}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {task.constraint_to_enforce.description}
                </p>
                <div className="w-full pt-4 mt-2 border-t border-border flex justify-center">
                    <span className="text-primary font-bold uppercase tracking-wider text-sm">Tap to Start</span>
                </div>
            </CardContent>
        </Card>
    );
}
