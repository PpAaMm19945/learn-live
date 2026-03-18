import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { IconBook, IconCircleCheck, IconTarget } from '@tabler/icons-react';

interface TopicScore {
    topicId: string;
    topicName: string;
    score: number;
    total: number;
    percentage: number;
}

interface ProgressData {
    totalLessonsCompleted: number;
    topicsInProgress: number;
    averageScore: number;
    topicScores: TopicScore[];
}

export const ProgressOverview: React.FC = () => {
    const { userId } = useAuthStore();
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
                const res = await fetch(`${apiUrl}/api/progress`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch progress data');
                }

                const data = await res.json();
                setProgressData(data);
                Logger.info('[UI]', 'Fetched progress overview successfully');
            } catch (err) {
                Logger.error('[UI]', 'Error fetching progress data', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgress();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!progressData) {
        return <div>Unable to load progress data.</div>;
    }

    return (
        <div className="space-y-8 w-full">
            <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Lessons Completed
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.totalLessonsCompleted}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Topics in Progress
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.topicsInProgress}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Average Quiz Score
                        </CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.averageScore}%</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Quiz Scores by Topic</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {progressData.topicScores && progressData.topicScores.length > 0 ? (
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={progressData.topicScores} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="topicName"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--muted))' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}
                                    />
                                    <Bar
                                        dataKey="percentage"
                                        fill="hsl(var(--primary))"
                                        radius={[4, 4, 0, 0]}
                                        name="Score (%)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                            No quiz scores available yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
