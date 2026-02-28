import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileCheck2 } from 'lucide-react';
import { JudgmentModal, JudgmentItem } from '@/components/parent/JudgmentModal';

export default function Dashboard() {
    const { familyId, logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState<JudgmentItem | null>(null);

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
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Active Tasks</CardTitle>
                            <CardDescription>Tasks currently assigned to your learners.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
                                <p className="text-muted-foreground">No active tasks tracked yet.</p>
                            </div>
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
        </div>
    );
}
