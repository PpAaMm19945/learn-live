import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, BookOpen, Camera, Mic, Lock, Eye, CheckCircle2, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { LearnerPortfolio } from '@/components/learner/LearnerPortfolio';
import { AsyncEvidenceModal } from '@/components/parent/AsyncEvidenceModal';

/**
 * Child Portal — Phase 11
 * A simplified, child-friendly interface with parent-controlled access levels:
 *   - read_only: Can see tasks but not interact
 *   - task_execution: Can view tasks and submit evidence (routed to parent review)
 *   - child_led: Can invoke AI tools independently (Band 4+), parent still judges formation
 */

export type PortalAccessLevel = 'none' | 'read_only' | 'task_execution' | 'child_led';

interface ChildTask {
  id: string;
  capacity_id: string;
  capacity_name: string;
  strand_name: string;
  task_type: string;
  parent_prompt: string;
  success_condition: string;
  failure_condition?: string;
  reasoning_check: string;
  materials?: string;
  arc_stage: string;
  cognitive_level: number;
}

export default function ChildPortal() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<ChildTask | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [asyncModal, setAsyncModal] = useState({ isOpen: false, templateId: '', learnerName: '', capacityName: '' });

  // Fetch access level from parent settings
  const { data: accessData } = useQuery({
    queryKey: ['child-access', learnerId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/learner/${learnerId}/access-level`);
      if (!res.ok) return { accessLevel: 'read_only' as PortalAccessLevel };
      return res.json();
    },
    enabled: !!learnerId,
  });

  const accessLevel: PortalAccessLevel = accessData?.accessLevel || 'read_only';

  // Fetch tasks
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['child-tasks', learnerId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/learner/${learnerId}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
    enabled: !!learnerId,
  });

  // Fetch AI permissions for child-led mode
  const { data: aiPermData } = useQuery({
    queryKey: ['ai-perm', learnerId, selectedTask?.capacity_id],
    queryFn: async () => {
      if (!selectedTask?.capacity_id) return null;
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/learner/${learnerId}/ai-permission/${selectedTask.capacity_id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!learnerId && !!selectedTask?.capacity_id && accessLevel === 'child_led',
  });

  const tasks: ChildTask[] = tasksData?.tasks || [];
  const displayName = learnerId?.replace('learner_', '') || 'Learner';

  const accessBadge = {
    read_only: { label: 'View Only', icon: Eye, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    task_execution: { label: 'Active', icon: CheckCircle2, color: 'bg-green-100 text-green-700 border-green-200' },
    child_led: { label: 'Independent', icon: Sparkles, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    none: { label: 'Locked', icon: Lock, color: 'bg-muted text-muted-foreground border-border' },
  }[accessLevel];

  if (showPortfolio && learnerId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button variant="ghost" onClick={() => setShowPortfolio(false)} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </Button>
        <LearnerPortfolio learnerId={learnerId} />
      </div>
    );
  }

  if (selectedTask && accessLevel !== 'none') {
    const canSubmitEvidence = accessLevel === 'task_execution' || accessLevel === 'child_led';
    const canUseAI = accessLevel === 'child_led' && aiPermData?.permission?.canUseAI;

    return (
      <div className="min-h-screen bg-background p-6 md:p-10 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedTask(null)} className="mb-6 gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/30 text-primary">{selectedTask.strand_name}</Badge>
            <h2 className="text-2xl font-bold tracking-tight">{selectedTask.capacity_name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{selectedTask.task_type}</p>
          </div>

          <Separator />

          {/* Child-friendly task description */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> Your Task
              </h4>
              <p className="text-base leading-relaxed">{selectedTask.parent_prompt}</p>
              {selectedTask.materials && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold">You'll need:</span> {selectedTask.materials}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-400 mb-2">What success looks like</h4>
              <p className="text-sm text-green-900 dark:text-green-100">{selectedTask.success_condition}</p>
            </CardContent>
          </Card>

          {/* Evidence submission — only in task_execution or child_led */}
          {canSubmitEvidence && (
            <div className="space-y-3 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Show your work</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  className="gap-2 h-12 font-medium"
                  onClick={() => setAsyncModal({
                    isOpen: true,
                    templateId: selectedTask.id,
                    learnerName: displayName,
                    capacityName: selectedTask.capacity_name,
                  })}
                >
                  <Camera className="w-4 h-4" /> Photo + Audio
                </Button>

                {canUseAI && (
                  <Button variant="outline" className="gap-2 h-12 font-medium border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Mic className="w-4 h-4" /> Talk to AI Witness
                  </Button>
                )}

                {!canUseAI && accessLevel === 'child_led' && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted text-muted-foreground text-sm">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>AI tools unlock after more practice</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {accessLevel === 'read_only' && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-sm border border-blue-200 dark:border-blue-800">
              <Eye className="w-5 h-5 shrink-0" />
              <span>You can view your tasks here. Ask your parent when you're ready to start!</span>
            </div>
          )}
        </div>

        <AsyncEvidenceModal
          isOpen={asyncModal.isOpen}
          onClose={() => setAsyncModal({ ...asyncModal, isOpen: false })}
          templateId={asyncModal.templateId}
          learnerName={asyncModal.learnerName}
          capacityName={asyncModal.capacityName}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="px-6 py-5 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold capitalize">{displayName}'s Portal</h1>
            <Badge variant="outline" className={`text-[10px] px-2 py-0 ${accessBadge.color}`}>
              <accessBadge.icon className="w-3 h-3 mr-1" />
              {accessBadge.label}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPortfolio(true)}>
            My Work
          </Button>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
            Switch
          </Button>
        </div>
      </header>

      {/* Task List */}
      <div className="p-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No tasks right now</p>
            <p className="text-sm mt-1">Check back later or ask your parent!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Your Tasks ({tasks.length})
            </p>
            {tasks.map((task: ChildTask) => (
              <button
                key={task.id}
                onClick={() => accessLevel !== 'none' && setSelectedTask(task)}
                disabled={accessLevel === 'none'}
                className="w-full text-left group"
              >
                <Card className={`border transition-all duration-200 ${
                  accessLevel === 'none' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:border-primary/30 hover:shadow-md active:scale-[0.99] cursor-pointer'
                }`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary">
                        {task.cognitive_level}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{task.capacity_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{task.strand_name} • {task.task_type}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{task.arc_stage}</Badge>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
