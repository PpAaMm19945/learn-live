import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logger } from '@/lib/Logger';

interface PermissionsFlowProps {
    needsCamera: boolean;
    needsMic: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

type PermissionState = 'idle' | 'requesting' | 'granted' | 'denied';

export function PermissionsFlow({ needsCamera, needsMic, onSuccess, onCancel }: PermissionsFlowProps) {
    const [state, setState] = useState<PermissionState>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const requestPermissions = async () => {
        setState('requesting');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: needsCamera,
                audio: needsMic,
            });

            // Turn off tracks immediately, we just needed to verify permission
            stream.getTracks().forEach(track => track.stop());

            Logger.info('[UI]', 'Permissions granted for Witness');
            setState('granted');

            // Show success for a brief moment before triggering next phase
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (error: any) {
            Logger.warn('[UI]', `Permissions denied: ${error.message}`);
            setState('denied');
            if (error.name === 'NotAllowedError') {
                setErrorMsg('Your browser blocked the Witness. Please allow camera and microphone access to play.');
            } else if (error.name === 'NotFoundError') {
                setErrorMsg('We could not find a camera or microphone. Please check your device.');
            } else {
                setErrorMsg(`Oops, something went wrong: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        if (state === 'idle') {
            requestPermissions();
        }
    }, [state]);

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            {state === 'requesting' && (
                <div className="space-y-8 max-w-lg">
                    <div className="flex justify-center gap-8 text-primary animate-pulse">
                        {needsCamera && <Camera className="w-20 h-20" />}
                        {needsMic && <Mic className="w-20 h-20" />}
                    </div>
                    <h2 className="text-3xl font-bold">Waking up the Witness...</h2>
                    <p className="text-xl text-muted-foreground">Please tap "Allow" when your browser asks!</p>
                </div>
            )}

            {state === 'granted' && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-32 h-32 text-green-500 mx-auto" />
                    <h2 className="text-4xl font-black text-green-500">Witness is Ready!</h2>
                </div>
            )}

            {state === 'denied' && (
                <div className="space-y-8 max-w-lg animate-in slide-in-from-bottom-4">
                    <ShieldAlert className="w-24 h-24 text-destructive mx-auto" />
                    <h2 className="text-3xl font-bold text-destructive">Oh no!</h2>
                    <p className="text-xl text-muted-foreground">{errorMsg}</p>
                    <div className="flex gap-4 justify-center pt-8">
                        <Button variant="outline" size="lg" onClick={onCancel}>
                            Go Back
                        </Button>
                        <Button size="lg" onClick={() => setState('idle')}>
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
