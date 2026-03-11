import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, TrendingUp, RotateCcw, CheckCircle2, Clock, BarChart3 } from 'lucide-react';

interface LearnerPattern {
    learner_id: string;
    learner_name: string;
    total_sessions: number;
    approved_count: number;
    rejected_count: number;
    pending_count: number;
    avg_confidence: number;
    active_capacities: number;
    completed_capacities: number;
    revision_rate: number; // rejected / total
    recent_history: Array<{
        capacity_name: string;
        status: string;
        created_at: string;
    }>;
}

interface PatternDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    learnerId?: string;
    learnerName?: string;
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: string }) {
    return (
        <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent || 'bg-primary/10'}`}>
                <Icon className={`w-5 h-5 ${accent ? 'text-white' : 'text-primary'}`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
            </div>
        </div>
    );
}

function ConsistencyBar({ rate, label }: { rate: number; label: string }) {
    const percentage = Math.round(rate * 100);
    const color = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-medium">{label}</span>
                <span className="font-bold text-foreground">{percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

export function PatternDashboard({ isOpen, onClose, learnerId, learnerName }: PatternDashboardProps) {
    const { userId } = useAuthStore();
    const familyId = userId?.includes('family_') ? 'family_' + userId.split('family_')[1].split('_child')[0] : null;

    const { data, isLoading } = useQuery({
        queryKey: ['learner-patterns', familyId, learnerId],
        queryFn: async () => {
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const url = learnerId
                ? `${apiUrl}/api/parent/${familyId}/patterns?learnerId=${learnerId}`
                : `${apiUrl}/api/parent/${familyId}/patterns`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch patterns');
            return res.json();
        },
        enabled: isOpen && !!familyId,
    });

    const patterns: LearnerPattern[] = data?.patterns || [];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-lg bg-card overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        {learnerName ? `${learnerName}'s Patterns` : 'Learner Patterns'}
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-8">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : patterns.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-12">No session data yet. Patterns will appear after evidence submissions.</p>
                    ) : (
                        patterns.map((p) => (
                            <div key={p.learner_id} className="space-y-5">
                                {!learnerId && (
                                    <h3 className="text-lg font-semibold text-foreground">{p.learner_name}</h3>
                                )}

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard icon={CheckCircle2} label="Approved" value={p.approved_count} accent="bg-green-600" />
                                    <StatCard icon={RotateCcw} label="Revisions" value={p.rejected_count} accent="bg-amber-600" />
                                    <StatCard icon={Clock} label="Pending" value={p.pending_count} />
                                    <StatCard icon={TrendingUp} label="Capacities Done" value={p.completed_capacities} />
                                </div>

                                {/* Progress bars */}
                                <div className="bg-background border border-border rounded-xl p-5 space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Formation Indicators</h4>
                                    <ConsistencyBar
                                        rate={p.total_sessions > 0 ? p.approved_count / p.total_sessions : 0}
                                        label="Approval Rate"
                                    />
                                    <ConsistencyBar
                                        rate={1 - p.revision_rate}
                                        label="First-Attempt Success"
                                    />
                                    <ConsistencyBar
                                        rate={p.avg_confidence}
                                        label="AI Confidence (avg)"
                                    />
                                </div>

                                {/* Recent history */}
                                {p.recent_history.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h4>
                                        <div className="space-y-2">
                                            {p.recent_history.map((h, i) => (
                                                <div key={i} className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-2.5">
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{h.capacity_name}</p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {new Date(h.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={h.status === 'approved' ? 'default' : h.status === 'rejected' ? 'destructive' : 'secondary'}
                                                        className="text-[10px]"
                                                    >
                                                        {h.status === 'approved' ? 'Approved' : h.status === 'rejected' ? 'Revised' : 'Pending'}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <Separator />
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
