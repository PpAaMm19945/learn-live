import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { Logger } from '@/lib/Logger';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { MatrixTask, TaskCard } from '@/components/learner/TaskCard';
import { TaskBriefing } from '@/components/learner/TaskBriefing';
import { LearnerPortfolio } from '@/components/learner/LearnerPortfolio';
import { Loader2 } from 'lucide-react';

const fetchTasks = async (learnerId: string): Promise<MatrixTask[]> => {
    Logger.info('[UI]', `Fetching tasks for learner: ${learnerId}`);
    const res = await fetch(`/api/learner/${learnerId}/tasks`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    const data = await res.json();
    Logger.info('[UI]', `Loaded ${(data.tasks || []).length} tasks for ${learnerId}`);
    return data.tasks || [];
};

export default function LearnerDashboard() {
    const { learnerId } = useParams<{ learnerId: string }>();
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [selectedTask, setSelectedTask] = useState<MatrixTask | null>(null);

    const handleTaskSelect = (task: MatrixTask) => {
        Logger.info('[UI]', `Task selected: ${task.id} — ${task.capacity} (${task.arc_stage})`);
        setSelectedTask(task);
    };

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['learner-tasks', learnerId],
        queryFn: () => fetchTasks(learnerId!),
        enabled: Boolean(learnerId),
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (selectedTask) {
        return <TaskBriefing task={selectedTask} onClose={() => setSelectedTask(null)} />;
    }

    const displayName = learnerId ? learnerId.replace('learner_', '') : 'Learner';

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 text-foreground">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black capitalize">Welcome back, {displayName}!</h1>
                <Button variant="outline" size="lg" onClick={() => navigate('/profiles')}>
                    Switch Profile
                </Button>
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 mt-10">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-xl font-medium text-muted-foreground">Loading your tasks...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center py-20 text-destructive text-center mt-10">
                    <p className="text-xl font-bold mb-2">Oops!</p>
                    <p>We couldn't load your tasks right now. Please try again later.</p>
                </div>
            )}

            {!isLoading && tasks && tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center mt-10">
                    <p className="text-xl font-medium text-muted-foreground mb-4">No tasks found for your level.</p>
                </div>
            )}

            {!isLoading && tasks && tasks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center md:place-items-start mb-12">
                    {tasks.map((task: MatrixTask) => (
                        <TaskCard key={task.id} task={task} onClick={handleTaskSelect} />
                    ))}
                </div>
            )}

            {learnerId && <LearnerPortfolio learnerId={learnerId} />}
        </div>
    );
}
