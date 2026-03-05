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

    const { data: judgmentsData, isLoading: isJudgmentsLoading } = useQuery({
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

    const { data: curriculumData, isLoading: isCurriculumLoading } = useQuery({
        queryKey: ['active-curriculum', familyId],
        queryFn: async () => {
            if (!familyId) return { tasks: [] };
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/family/${familyId}/curriculum-tasks`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        enabled: !!familyId,
    });

    const judgments = judgmentsData?.judgments || [];
    const activeTasks: LearnerRepetitionState[] = curriculumData?.tasks || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleJudgmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['pending-judgments', familyId] });
    };

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
                            {isCurriculumLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : activeTasks.length > 0 ? (
                                activeTasks.map((state) => (
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
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
                                    <p className="text-muted-foreground">No active curriculum tasks available.</p>
                                    <p className="text-xs text-muted-foreground mt-2">The AI content engineer may still be generating templates or the seed script has not been run.</p>
                                </div>
                            )}
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
                            {isJudgmentsLoading ? (
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
