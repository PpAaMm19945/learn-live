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

export function ParentTaskCard({ state, onCaptureAsync, onInvokeLive }: { state: LearnerRepetitionState, onCaptureAsync?: () => void, onInvokeLive?: () => void }) {
    const { template, learner_name, current_arc_stage } = state;
    const [isExpanded, setIsExpanded] = useState(false);

    const levelNames = ['Encounter', 'Execute', 'Discern', 'Own'];
    const levelName = levelNames[template.cognitive_level - 1] || `Level ${template.cognitive_level}`;

    return (
        <Card className="bg-card w-full mb-4 border-2 border-primary/20 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2 mr-2">
                            {template.capacity_id}: {template.strand_name}
                        </Badge>
                        <Badge className="mb-2 bg-blue-600 hover:bg-blue-700">
                            {current_arc_stage}
                        </Badge>
                        <CardTitle className="text-xl">{learner_name} • {template.capacity_name}</CardTitle>
                        <CardDescription className="mt-1">
                            {levelName} • {template.task_type}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2 text-primary">
                        <PlaySquare className="w-4 h-4" /> Parent Action
                    </h4>
                    <p className="text-sm">{template.parent_prompt}</p>

                    {template.materials && (
                        <p className="text-xs text-muted-foreground mt-3 italic">
                            <strong>Materials needed:</strong> {template.materials}
                        </p>
                    )}
                </div>

                {isExpanded && (
                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <Separator />

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md">
                                <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400 text-sm mb-1">
                                    <FileCheck2 className="w-4 h-4" /> Success Looks Like
                                </h4>
                                <p className="text-sm">{template.success_condition}</p>
                            </div>

                            {template.failure_condition && (
                                <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-md">
                                    <h4 className="font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400 text-sm mb-1">
                                        <ShieldAlert className="w-4 h-4" /> What to Watch For
                                    </h4>
                                    <p className="text-sm">{template.failure_condition}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md">
                            <h4 className="font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm mb-1">
                                <LightbulbIcon className="w-4 h-4" /> Reasoning Check
                            </h4>
                            <p className="text-sm italic">"{template.reasoning_check}"</p>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                <Button
                    variant="ghost"
                    className="w-full sm:w-auto text-muted-foreground"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Hide Details' : 'Show Full Blueprint'}
                </Button>

                <div className="flex w-full sm:w-auto gap-2">
                    <Button
                        variant="secondary"
                        className="w-full sm:w-auto gap-2"
                        onClick={onInvokeLive}
                    >
                        <Mic className="w-4 h-4 text-orange-500" /> Live AI Guide
                    </Button>
                    <Button
                        className="w-full sm:w-auto gap-2"
                        onClick={onCaptureAsync}
                    >
                        <Camera className="w-4 h-4" /> Capture Evidence
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
