import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Lock, Eye, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

/**
 * Parent-controlled access level settings for the Child Portal.
 * Parents can toggle each child between: None → Read-Only → Task Execution → Child-Led
 */

interface AccessControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerId: string;
  learnerName: string;
}

const ACCESS_LEVELS = [
  {
    value: 'none',
    label: 'Portal Locked',
    description: 'Child cannot access the portal at all.',
    icon: Lock,
    color: 'text-muted-foreground',
  },
  {
    value: 'read_only',
    label: 'View Only',
    description: 'Child can see their tasks but cannot submit evidence.',
    icon: Eye,
    color: 'text-blue-600',
  },
  {
    value: 'task_execution',
    label: 'Task Execution',
    description: 'Child can view tasks and submit evidence (photos + audio). All submissions go to your review.',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  {
    value: 'child_led',
    label: 'Independent Mode',
    description: 'Child can invoke AI tools independently (Band 4+). You still judge formation and character.',
    icon: Sparkles,
    color: 'text-purple-600',
  },
];

export function AccessControlModal({ isOpen, onClose, learnerId, learnerName }: AccessControlModalProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['child-access', learnerId],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/learner/${learnerId}/access-level`);
      if (!res.ok) return { accessLevel: 'read_only' };
      return res.json();
    },
    enabled: isOpen && !!learnerId,
  });

  const [selected, setSelected] = useState<string | null>(null);
  const currentLevel = selected || data?.accessLevel || 'read_only';

  const mutation = useMutation({
    mutationFn: async (level: string) => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const token = 'development_secret_token';
      const res = await fetch(`${apiUrl}/api/learner/${learnerId}/access-level`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accessLevel: level }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child-access', learnerId] });
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{learnerName}'s Portal Access</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={currentLevel} onValueChange={setSelected}>
              {ACCESS_LEVELS.map((level) => (
                <div key={level.value} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  currentLevel === level.value ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                  <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <level.icon className={`w-4 h-4 ${level.color}`} />
                      <span className="font-medium text-sm">{level.label}</span>
                      {data?.accessLevel === level.value && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 h-4">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                onClick={() => mutation.mutate(currentLevel)}
                disabled={mutation.isPending || currentLevel === data?.accessLevel}
                className="flex-1"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
