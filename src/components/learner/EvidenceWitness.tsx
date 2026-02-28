import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Loader2, CheckCircle } from 'lucide-react';
import { MatrixTask } from './TaskCard';
import { Logger } from '@/lib/Logger';
import { useAuthStore } from '@/lib/auth';
import { GeminiLiveClient } from '@/lib/gemini';

interface EvidenceWitnessProps {
    task: MatrixTask;
    onComplete: () => void;
}

export function EvidenceWitness({ task, onComplete }: EvidenceWitnessProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [status, setStatus] = useState<'connecting' | 'active' | 'evaluating' | 'complete' | 'error'>('connecting');
    const [errorMessage, setErrorMessage] = useState('');
    const clientRef = useRef<GeminiLiveClient | null>(null);
    const { familyId: userFamilyId, userId: userLearnerId } = useAuthStore();
    const [successReason, setSuccessReason] = useState<string | null>(null);

    // Parse required evidence from the JSON constraint
    const evidence = task.constraint_to_enforce.required_evidence || [];
    const needsCamera = evidence.includes('snapshot') || evidence.includes('video');
    const needsMic = evidence.includes('audio_transcript');

    useEffect(() => {
        let activeStream: MediaStream | null = null;
        let client: GeminiLiveClient | null = null;

        const startSession = async () => {
            try {
                // 1. Acquire Media
                Logger.info('[UI]', 'Acquiring media for session');
                activeStream = await navigator.mediaDevices.getUserMedia({
                    video: needsCamera,
                    audio: needsMic,
                });

                setStream(activeStream);
                if (videoRef.current && needsCamera) {
                    videoRef.current.srcObject = activeStream;
                }

                // 2. Connect to Agent via GeminiLiveClient
                const familyId = userFamilyId || 'fam_default';
                const learnerId = userLearnerId || 'learner_unknown';

                client = new GeminiLiveClient(
                    task.id,
                    familyId,
                    learnerId,
                    async (data) => {
                        if (data.type === 'session_end') {
                            Logger.info('[UI]', `Session ended: ${data.reason}`, data);
                            setStatus('complete');
                            setSuccessReason(data.summary);

                            // 3. Evidence Pipeline
                            try {
                                setStatus('evaluating');
                                let evidenceUrl = null;

                                // Capture Snapshot
                                if (needsCamera && videoRef.current) {
                                    Logger.info('[EVIDENCE]', 'Capturing visual evidence snapshsot');
                                    const canvas = document.createElement('canvas');
                                    canvas.width = videoRef.current.videoWidth || 640;
                                    canvas.height = videoRef.current.videoHeight || 480;
                                    const ctx = canvas.getContext('2d');
                                    if (ctx) {
                                        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                                        const blob = await new Promise<Blob>((resolve, reject) => {
                                            canvas.toBlob((b) => {
                                                if (b) resolve(b);
                                                else reject(new Error('Canvas toBlob failed'));
                                            }, 'image/jpeg', 0.85);
                                        });

                                        Logger.info('[EVIDENCE]', 'Uploading snapshot to Vault');
                                        const formData = new FormData();
                                        formData.append('file', blob, `snapshot_${task.id}.jpg`);
                                        formData.append('pathPrefix', `portfolios/${learnerId}`);

                                        const uploadRes = await fetch(`${import.meta.env.VITE_WORKER_URL}/api/upload`, {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN}`
                                            },
                                            body: formData
                                        });

                                        if (!uploadRes.ok) throw new Error('Failed to upload evidence');
                                        const uploadData = await uploadRes.json();
                                        evidenceUrl = uploadData.url;
                                        Logger.info('[EVIDENCE]', 'Upload successful', { url: evidenceUrl });
                                    }
                                }

                                // Submit Portfolio
                                Logger.info('[EVIDENCE]', 'Submitting portfolio record');
                                const statusValue = data.reason === 'success' ? 'success' : 'failure';
                                const portfolioRes = await fetch(`${import.meta.env.VITE_WORKER_URL}/api/portfolio`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        // Need to skip auth or use a token here based on API. 
                                        // Assuming CORS/Public for now or use VITE_API_AUTH_TOKEN if needed
                                    },
                                    body: JSON.stringify({
                                        learnerId,
                                        taskId: task.id,
                                        summary: data.summary,
                                        status: statusValue,
                                        evidenceUrl: evidenceUrl || 'no-visual-evidence',
                                        aiConfidenceScore: 0.95 // Mocked or passed from agent
                                    })
                                });

                                if (!portfolioRes.ok) throw new Error('Failed to save portfolio record');
                                Logger.info('[EVIDENCE]', 'Portfolio saved successfully');


                            } catch (error) {
                                Logger.error('[EVIDENCE]', 'Pipeline error:', error);
                                // We still want to let the user finish even if logging fails, but maybe show a toast
                            } finally {
                                setStatus('complete');
                                cleanupMedia(activeStream);

                                // Return to dashboard after brief delay
                                setTimeout(() => {
                                    onComplete();
                                }, 5000);
                            }

                        } else if (data.error) {
                            setStatus('error');
                            setErrorMessage(data.error);
                            cleanupMedia(activeStream);
                        } else {
                            // other live event
                        }
                    }
                );

                clientRef.current = client;

                await client.connect();
                setStatus('active');

                if (needsMic) {
                    await client.startAudio(activeStream);
                }

                // wait for video event to be ready to avoid drawImage error
                if (needsCamera && videoRef.current) {
                    videoRef.current.oncanplay = () => {
                        if (clientRef.current && videoRef.current) {
                            clientRef.current.startVideo(videoRef.current);
                        }
                    };
                }

            } catch (err: any) {
                Logger.error('[UI]', 'Session initialization failed:', err);
                setStatus('error');
                setErrorMessage(err.message || 'Failed to start the Witness.');
                cleanupMedia(activeStream);
            }
        };

        startSession();

        return () => {
            cleanupMedia(activeStream);
            if (clientRef.current) {
                clientRef.current.disconnect();
            }
        };
    }, [task, needsCamera, needsMic, onComplete, userFamilyId, userLearnerId]);

    const cleanupMedia = (mediaStream: MediaStream | null) => {
        if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
            Logger.info('[UI]', 'Media tracks fully stopped');
        }
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const handleManualEnd = () => {
        if (clientRef.current) {
            clientRef.current.disconnect();
        }
        cleanupMedia(stream);
        onComplete();
    };

    if (status === 'evaluating') {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 text-white">
                <Loader2 className="w-24 h-24 animate-spin text-blue-500 mb-8" />
                <h2 className="text-3xl font-bold mb-4">Securing Evidence...</h2>
                <p className="text-xl text-zinc-400">The Witness is finalising its report.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="space-y-6 max-w-lg">
                    <h2 className="text-3xl font-bold text-destructive">Witness Disconnected</h2>
                    <p className="text-xl text-muted-foreground">{errorMessage}</p>
                    <button
                        onClick={onComplete}
                        className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-lg"
                    >
                        Return to Tasks
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'complete') {
        return (
            <div className="fixed inset-0 z-50 bg-primary flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500 text-primary-foreground">
                <CheckCircle className="w-32 h-32 mb-8" />
                <h1 className="text-5xl font-black mb-4">Task Complete!</h1>
                <p className="text-2xl font-medium max-w-2xl">
                    {successReason || "The Witness has confirmed your amazing work."}
                </p>
                <p className="text-lg mt-12 opacity-80 animate-pulse">Returning to Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col text-white animate-in slide-in-from-bottom-full duration-500">
            {/* Header / HUD */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                        {status === 'connecting' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                Connecting to Witness...
                            </>
                        ) : (
                            <>
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Witness is Watching
                            </>
                        )}
                    </div>
                    <h2 className="text-2xl font-black mt-4 drop-shadow-md">{task.capacity}</h2>
                </div>

                <button
                    onClick={handleManualEnd}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full font-bold text-sm shadow-lg transition-colors"
                >
                    End Session
                </button>
            </div>

            {/* Main Video View */}
            <div className="flex-1 relative bg-zinc-900 border-4 border-black box-border flex items-center justify-center overflow-hidden">
                {needsCamera ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-40 blur-sm"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 absolute inset-0">
                        <Mic className="w-24 h-24 mb-4" />
                        <p className="text-xl">Voice Only Mode</p>
                    </div>
                )}

                {/* Central AI Voice Visualizer */}
                {status !== 'connecting' && (
                    <div className="relative z-20 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                        <div className="absolute w-24 h-24 bg-blue-400 rounded-full opacity-40 animate-pulse"></div>
                        <div className="relative w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_50px_rgba(59,130,246,0.8)] border-4 border-white/20"></div>
                    </div>
                )}

                {status === 'connecting' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-3xl z-30">
                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {/* Task Prompt Area */}
            <div className="absolute bottom-10 left-10 right-10 bg-black/70 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl z-20">
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    {task.constraint_to_enforce.description}
                </p>
                <div className="mt-4 flex gap-2">
                    {needsCamera && <Camera className="w-5 h-5 text-zinc-400" />}
                    {needsMic && <Mic className="w-5 h-5 text-zinc-400" />}
                </div>
            </div>
        </div>
    );
}
