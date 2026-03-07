import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Mic, PlaySquare, FileCheck2, LightbulbIcon, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface ConstraintTemplate {
    id: string;
    capacity_id: string;
    capacity_name: string;
    strand_name: string;
    cognitive_level: number;
    variation_id: string;
    task_type: string;
    materials?: string;
    parent_prompt: string;
    success_condition: string;
    failure_condition?: string;
    reasoning_check: string;
    context_variants: string;
}

export interface LearnerRepetitionState {
    learner_id: string;
    learner_name: string;
    current_arc_stage: 'Exposure' | 'Execution' | 'Endurance' | 'Milestone';
    execution_count: number;
    template: ConstraintTemplate;
}

export function ParentTaskCard({ state, isSelected, onClick }: { state: LearnerRepetitionState, isSelected?: boolean, onClick?: () => void }) {
    const { template, learner_name, current_arc_stage } = state;

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-[8px] cursor-pointer transition-colors border ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-secondary/30'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{learner_name}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{template.strand_name.split(' ')[0]}</span>
                </div>
                <Badge variant={current_arc_stage === 'Exposure' ? 'secondary' : 'default'} className={`text-[10px] px-1.5 py-0 h-5 ${isSelected && current_arc_stage !== 'Exposure' ? 'bg-primary' : ''}`}>
                    {current_arc_stage}
                </Badge>
            </div>
            <h3 className="text-[15px] font-medium leading-snug text-foreground mb-1.5">{template.capacity_name}</h3>
            <p className="text-[13px] text-muted-foreground line-clamp-2">{template.parent_prompt}</p>
        </div>
    );
}
