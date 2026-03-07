import React, { useMemo } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LearnerRepetitionState } from './ParentTaskCard';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WeeklyPantryListProps {
    isOpen: boolean;
    onClose: () => void;
    tasks: LearnerRepetitionState[];
}

export function WeeklyPantryList({ isOpen, onClose, tasks }: WeeklyPantryListProps) {
    const materialsList = useMemo(() => {
        const list: { material: string, alternatives: string[], riskLevel: string, safetyWarning: string, taskName: string, learnerName: string }[] = [];

        tasks.forEach(task => {
            const template = task.template;
            // Only aggregate if there are scientific_materials
            if (template.scientific_materials && template.scientific_materials.length > 0) {
                template.scientific_materials.forEach(material => {
                    list.push({
                        material,
                        alternatives: template.acceptable_alternatives || [],
                        riskLevel: template.risk_level || 'Risk_Level_A',
                        safetyWarning: template.safety_warning || '',
                        taskName: template.capacity_name,
                        learnerName: task.learner_name
                    });
                });
            } else if (template.materials) {
                // Fallback for general materials
                template.materials.split(',').map(m => m.trim()).forEach(material => {
                     list.push({
                        material,
                        alternatives: [],
                        riskLevel: 'Risk_Level_A',
                        safetyWarning: '',
                        taskName: template.capacity_name,
                        learnerName: task.learner_name
                    });
                });
            }
        });

        // Sort: C -> B -> A, ensure fallback riskLevel doesn't cause undefined errors
        list.sort((a, b) => (b.riskLevel || 'Risk_Level_A').localeCompare(a.riskLevel || 'Risk_Level_A'));

        return list;
    }, [tasks]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-card text-card-foreground flex flex-col p-0">
                <SheetHeader className="p-6 border-b border-border text-left">
                    <SheetTitle className="text-2xl font-bold tracking-tight">Weekly Pantry List</SheetTitle>
                    <SheetDescription>
                        Consolidated materials required for the upcoming scheduled tasks across all learners.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 p-6">
                    {materialsList.length === 0 ? (
                        <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
                            <p>No materials needed for current active tasks.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {materialsList.map((item, index) => (
                                <div key={index} className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-background shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-base capitalize">{item.material}</h4>
                                        {item.riskLevel === 'Risk_Level_C' && (
                                            <Badge variant="destructive" className="uppercase text-[10px]">High Risk</Badge>
                                        )}
                                        {item.riskLevel === 'Risk_Level_B' && (
                                            <Badge variant="secondary" className="uppercase text-[10px] bg-orange-100 text-orange-800 hover:bg-orange-100/80">Moderate Risk</Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground flex gap-1 items-center">
                                        For <strong>{item.learnerName}</strong>'s task: {item.taskName}
                                    </p>

                                    {item.alternatives.length > 0 && (
                                        <div className="mt-1 text-xs">
                                            <span className="font-medium text-foreground">Alternatives:</span>{' '}
                                            <span className="text-muted-foreground">{item.alternatives.join(', ')}</span>
                                        </div>
                                    )}

                                    {item.safetyWarning && (
                                        <div className="mt-2 bg-orange-50 dark:bg-orange-950/20 p-2.5 rounded-md border border-orange-200 dark:border-orange-900/50 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed">{item.safetyWarning}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
