import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileCheck2, BookOpen } from 'lucide-react';
import { JudgmentModal, JudgmentItem } from '@/components/parent/JudgmentModal';
import { ParentTaskCard, LearnerRepetitionState } from '@/components/parent/ParentTaskCard';
import { AsyncEvidenceModal } from '@/components/parent/AsyncEvidenceModal';

export default function Dashboard() {
    const { familyId, logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState<JudgmentItem | null>(null);
    const [asyncModalState, setAsyncModalState] = useState({
        isOpen: false,
        templateId: '',
        learnerName: '',
        capacityName: ''
    });

    const { data, isLoading } = useQuery({
        queryKey: ['pending-judgments', familyId],
        queryFn: async () => {
            if (!familyId) return { judgments: [] };
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/parent/${familyId}/judgments`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        enabled: !!familyId,
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleJudgmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['pending-judgments', familyId] });
    };

    const judgments = data?.judgments || [];

    // Mock data based on the new Curriculum Spine for Hackathon UI evaluation
    const mockState: LearnerRepetitionState[] = [
        {
            learner_id: 'learner_azie',
            learner_name: 'Azie',
            current_arc_stage: 'Exposure',
            execution_count: 0,
            template: {
                id: 'D1_L1_A',
                capacity_id: 'D1',
                capacity_name: 'Place Value as Grouping',
                strand_name: 'Number & Quantity',
                cognitive_level: 1,
                variation_id: 'A',
                task_type: 'Physical manipulation',
                materials: '30-50 small objects (beans, sticks), rubber bands or small cups',
                parent_prompt: "Give your child 45 beans. Ask them: 'How can we count these quickly without losing track?' Let them try. If they don't group by 10s, suggest: 'What if we put them in groups of 10?'",
                success_condition: "Child groups objects into 10s and counts the leftover ones.",
                failure_condition: "Child insists on counting by 1s and loses track, or cannot form a group of 10.",
                reasoning_check: "Why is grouping by 10 faster than counting by 1?",
                context_variants: ""
            }
        },
        {
            learner_id: 'learner_arie',
            learner_name: 'Arie',
            current_arc_stage: 'Execution',
            execution_count: 2,
            template: {
                id: 'G2a_L2_A',
                capacity_id: 'G2a',
                capacity_name: '2D Shape Classification',
                strand_name: 'Spatial Reasoning & Geometry',
                cognitive_level: 2,
                variation_id: 'A',
                task_type: 'Property identification',
                materials: 'Paper and pencil',
                parent_prompt: "Ask your child to draw a shape that has exactly 3 straight sides and 1 square corner. Ask: 'Does it have any curved lines?'",
                success_condition: "Identifies and draws a right-angled triangle based solely on the verbal attribute list.",
                reasoning_check: "How do you know the shape you drew follows the rule perfectly?",
                context_variants: ""
            }
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Parent Command Center</h1>
                        <p className="text-muted-foreground mt-2">Welcome, {familyId ? familyId.replace('fam_', '').replace(/^\w/, c => c.toUpperCase()) : 'Family'} Family</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate('/profiles')}>
                            Switch Profile
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-card shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Active Curriculum Tasks
                            </CardTitle>
                            <CardDescription>
                                Guide your children through today's physical and production tasks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {mockState.map((state) => (
                                <ParentTaskCard
                                    key={state.template.id}
                                    state={state}
                                    onCaptureAsync={() => setAsyncModalState({
                                        isOpen: true,
                                        templateId: state.template.id,
                                        learnerName: state.learner_name,
                                        capacityName: state.template.capacity_name
                                    })}
                                    onInvokeLive={() => console.log('Live AI Triggered', state.template.id)}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-orange-500 flex items-center gap-2">
                                <FileCheck2 className="w-5 h-5" />
                                Action Required: Evidence Review
                            </CardTitle>
                            <CardDescription>Review and authorize learner evidence.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : judgments.length > 0 ? (
                                <div className="space-y-4">
                                    {judgments.map((item: JudgmentItem) => (
                                        <div
                                            key={item.id}
                                            className="p-4 border border-border rounded-lg flex justify-between items-center bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <div>
                                                <h4 className="font-semibold text-foreground">{item.learner_name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.domain} • {item.capacity}</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                                                Review
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
                                    <p className="text-muted-foreground">No items awaiting judgment.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <JudgmentModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                item={selectedItem}
                onSuccess={handleJudgmentSuccess}
            />

            <AsyncEvidenceModal
                {...asyncModalState}
                onClose={() => setAsyncModalState(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
