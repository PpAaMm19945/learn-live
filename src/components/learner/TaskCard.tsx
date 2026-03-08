import React from 'react';
import { BookOpen, Palette, Brain, Activity, Beaker, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface MatrixTask {
    id: string;
    capacity: string;
    capacity_id: string;
    strand_name: string;
    arc_stage: string;
    cognitive_level: number;
    task_type: string;
    materials?: string;
    scientific_materials?: string[];
    acceptable_alternatives?: string[];
    risk_level?: string;
    safety_warning?: string;
    parent_prompt: string;
    success_condition: string;
    failure_condition?: string;
    reasoning_check: string;
    context_variants?: string;
    execution_count: number;
}

interface TaskCardProps {
    task: MatrixTask;
    onClick: (task: MatrixTask) => void;
}

const getStrandIcon = (strandName: string) => {
    if (strandName.includes('Number') || strandName.includes('Algebra') || strandName.includes('Data') || strandName.includes('Modeling') || strandName.includes('Spatial')) return <Brain className="w-10 h-10 text-blue-500" />;
    if (strandName.includes('Phonics') || strandName.includes('Reading') || strandName.includes('Grammar') || strandName.includes('Composition') || strandName.includes('Oral')) return <BookOpen className="w-10 h-10 text-primary" />;
    if (strandName.includes('Life') || strandName.includes('Physical') || strandName.includes('Earth')) return <Beaker className="w-10 h-10 text-green-500" />;
    return <HelpCircle className="w-10 h-10 text-muted-foreground" />;
};

const COGNITIVE_LABELS: Record<number, string> = { 1: 'Encounter', 2: 'Execute', 3: 'Discern', 4: 'Own' };

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card
            className="cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md border-2 border-transparent hover:border-primary w-full max-w-sm"
            onClick={() => onClick(task)}
        >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    {getStrandIcon(task.strand_name)}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1">{task.capacity}</h3>
                    <div className="flex items-center gap-2 justify-center flex-wrap">
                        <Badge variant="secondary" className="text-xs">{task.arc_stage}</Badge>
                        <Badge variant="outline" className="text-xs">{COGNITIVE_LABELS[task.cognitive_level] || `L${task.cognitive_level}`}</Badge>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{task.strand_name}</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {task.task_type}
                </p>
                <div className="w-full pt-4 mt-2 border-t border-border flex justify-center">
                    <span className="text-primary font-bold uppercase tracking-wider text-sm">Tap to Start</span>
                </div>
            </CardContent>
        </Card>
    );
}
