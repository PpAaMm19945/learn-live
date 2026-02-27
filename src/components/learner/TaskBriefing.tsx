import React, { useState } from 'react';
import { Camera, Mic } from 'lucide-react';
import { WitnessButton } from './WitnessButton';
import { MatrixTask } from './TaskCard';
import { PermissionsFlow } from './PermissionsFlow';
import { Button } from '@/components/ui/button';

interface TaskBriefingProps {
    task: MatrixTask;
    onClose: () => void;
}

export function TaskBriefing({ task, onClose }: TaskBriefingProps) {
    const [requestingPermissions, setRequestingPermissions] = useState(false);

    // Parse required evidence from the JSON constraint
    const evidence = task.constraint_to_enforce.required_evidence || [];
    const needsCamera = evidence.includes('snapshot') || evidence.includes('video');
    const needsMic = evidence.includes('audio_transcript');

    if (requestingPermissions) {
        return (
            <PermissionsFlow
                needsCamera={needsCamera}
                needsMic={needsMic}
                onSuccess={() => {
                    // Phase 5 will handle Gemini connection here.
                    // For now, we just close the flow or show a success state.
                    setRequestingPermissions(false);
                    onClose();
                }}
                onCancel={() => setRequestingPermissions(false)}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <Button
                variant="ghost"
                size="lg"
                className="absolute top-6 left-6 text-xl p-6 rounded-full"
                onClick={onClose}
            >
                ✕ Back
            </Button>

            <div className="max-w-2xl w-full text-center space-y-8 mt-12">
                <div className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-lg font-bold">
                    {task.arc_stage}
                </div>

                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    {task.capacity}
                </h1>

                <p className="text-2xl md:text-3xl font-medium text-muted-foreground leading-relaxed">
                    {task.constraint_to_enforce.description}
                </p>

                <div className="flex items-center justify-center gap-6 py-6 border-y border-border">
                    <span className="text-xl font-semibold text-muted-foreground mr-4">You will need:</span>
                    {needsCamera && (
                        <div className="flex flex-col items-center text-primary animate-bounce">
                            <Camera className="w-12 h-12 mb-2" />
                            <span className="text-sm font-bold">Camera</span>
                        </div>
                    )}
                    {needsMic && (
                        <div className="flex flex-col items-center text-primary animate-bounce delay-100">
                            <Mic className="w-12 h-12 mb-2" />
                            <span className="text-sm font-bold">Microphone</span>
                        </div>
                    )}
                </div>

                <div className="pt-8">
                    <WitnessButton onClick={() => setRequestingPermissions(true)} />
                </div>
            </div>
        </div>
    );
}
