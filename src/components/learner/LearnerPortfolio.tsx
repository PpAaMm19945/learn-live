import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Logger } from '@/lib/Logger';
import { Loader2, Lock } from 'lucide-react';

interface PortfolioItem {
    id: string;
    learner_id: string;
    task_id: string;
    status: string;
    transcript_url: string | null;
    snapshot_url: string | null;
    evidence_url: string | null;
    parent_notes: string | null;
    created_at: string;
    domain: string;
    capacity: string;
}

const fetchPortfolio = async (learnerId: string): Promise<PortfolioItem[]> => {
    Logger.info('[UI]', `Fetching portfolio for learner: ${learnerId}`);
    const apiUrl = import.meta.env.VITE_WORKER_URL || '';
    const res = await fetch(`${apiUrl}/api/learner/${learnerId}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    const data = await res.json();
    return data.portfolios || [];
};

export const LearnerPortfolio: React.FC<{ learnerId: string }> = ({ learnerId }) => {
    const { data: portfolios, isLoading, error } = useQuery({
        queryKey: ['learner-portfolio', learnerId],
        queryFn: () => fetchPortfolio(learnerId),
        enabled: Boolean(learnerId),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your submitted work...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-destructive text-center py-4">
                <p>Failed to load portfolio.</p>
            </div>
        );
    }

    if (!portfolios || portfolios.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 w-full max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-foreground">Waiting for Approval</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center md:place-items-start">
                {portfolios.map((item) => (
                    <div key={item.id} className="bg-card border-4 border-border/50 rounded-3xl overflow-hidden shadow-sm flex flex-col opacity-80 transition-opacity hover:opacity-100 max-w-sm w-full">
                        {item.evidence_url ? (
                            <div className="aspect-video w-full bg-muted/30 overflow-hidden relative">
                                <img
                                    src={item.evidence_url}
                                    alt="Task snapshot"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
                                    <Lock className="w-12 h-12 text-white drop-shadow-lg" />
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-muted/30 flex items-center justify-center">
                                <Lock className="w-12 h-12 text-muted-foreground" />
                            </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col items-center text-center">
                            <h3 className="font-bold text-xl leading-tight mb-2 text-card-foreground">
                                {item.capacity}
                            </h3>
                            <p className="font-medium text-muted-foreground mb-6">
                                {item.domain}
                            </p>

                            <div className="mt-auto flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl justify-center w-full">
                                <Lock className="w-5 h-5" />
                                <span className="font-bold">Waiting for Parent</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
