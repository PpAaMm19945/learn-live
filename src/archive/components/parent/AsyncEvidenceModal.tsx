import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Mic, Square, UploadCloud, RefreshCw, Activity, Image as ImageIcon, FileCheck2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'sonner';
import { Logger } from '@/lib/Logger';

interface AsyncEvidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateId: string;
    learnerName: string;
    capacityName: string;
}

export function AsyncEvidenceModal({ isOpen, onClose, templateId, learnerName, capacityName }: AsyncEvidenceModalProps) {
    const { userId } = useAuthStore();
    const familyId = userId?.includes('family_') ? 'family_' + userId.split('family_')[1].split('_child')[0] : null;
    const [step, setStep] = useState<'capture' | 'review' | 'uploading' | 'done'>('capture');

    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Image State (Mocked File Input for now)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(audioBlob);
                setAudioUrl(URL.createObjectURL(audioBlob));
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            Logger.error('[EVIDENCE]', 'Microphone error', error);
            toast.error('Could not access microphone');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const resetCapture = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setImageFile(null);
        setImageUrl(null);
        setStep('capture');
    };

    const handleNextToReview = () => {
        if (!imageFile && !audioBlob) {
            toast.error('Please capture at least a photo or audio clip');
            return;
        }
        setStep('review');
    };

    const fileToBase64 = (file: File | Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmitToAI = async () => {
        setStep('uploading');

        try {
            let imageBase64 = '';
            let audioBase64 = '';

            if (imageFile) {
                imageBase64 = await fileToBase64(imageFile);
            }
            if (audioBlob) {
                audioBase64 = await fileToBase64(audioBlob);
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/evaluate-evidence`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || ''}`
                },
                body: JSON.stringify({
                    imageBase64,
                    audioBase64,
                    templateId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to evaluate evidence');
            }

            const data = await response.json();

            setStep('done');
            if (data.evaluation?.status === 'success') {
                toast.success('Evidence approved by AI!');
            } else {
                toast.info('Evidence needs revision, parent attention required.');
            }
        } catch (error) {
            Logger.error('[EVIDENCE]', 'Submission error', error);
            toast.error('Failed to analyze evidence. Please try again.');
            setStep('review');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Async AI Evidence</DialogTitle>
                    <DialogDescription>
                        Capture {learnerName}'s work for {capacityName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 'capture' && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">1. Capture Visual Work (Optional)</h4>
                                <div
                                    className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={triggerFileInput}
                                >
                                    {imageUrl ? (
                                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                            <img src={imageUrl} alt="Captured work" className="object-cover w-full h-full" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <p className="text-white font-medium">Tap to replace</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-4 bg-secondary rounded-full mb-3">
                                                <Camera className="w-6 h-6 text-primary" />
                                            </div>
                                            <p className="text-sm font-medium">Tap to take photo</p>
                                            <p className="text-xs text-muted-foreground mt-1">or select from device</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">2. Explain the Work (10s Audio)</h4>
                                <div className="border bg-secondary/30 rounded-lg p-6 flex flex-col items-center justify-center">
                                    {audioUrl ? (
                                        <div className="w-full flex flex-col items-center gap-4">
                                            <audio src={audioUrl} controls className="w-full max-w-[300px]" />
                                            <Button variant="outline" size="sm" onClick={() => setAudioUrl(null)} className="text-destructive">
                                                Delete and Re-record
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <Button
                                                size="lg"
                                                variant={isRecording ? "destructive" : "secondary"}
                                                className={`rounded-full w-16 h-16 p-0 ${isRecording ? 'animate-pulse' : ''}`}
                                                onClick={isRecording ? handleStopRecording : handleStartRecording}
                                            >
                                                {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                                            </Button>
                                            <p className="text-sm text-center text-muted-foreground">
                                                {isRecording ? "Recording... tap to stop" : "Ask 'How did you figure this out?' and tap to record"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="bg-muted p-4 rounded-lg">
                                <h3 className="font-semibold mb-3">Ready for AI Review?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    The AI will analyze the photo and audio against the constraints for <strong>{capacityName}</strong> and draft a report for you.
                                </p>
                                <div className="flex gap-4">
                                    {imageUrl && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <ImageIcon className="w-4 h-4" /> Photo Attached
                                        </div>
                                    )}
                                    {audioUrl && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                            <Mic className="w-4 h-4" /> Audio Attached
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'uploading' && (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
                            <h3 className="text-lg font-semibold">AI is analyzing evidence...</h3>
                            <p className="text-muted-foreground text-sm text-center">
                                Checking if structural rules were met and extracting reasoning patterns from audio.
                            </p>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                                <FileCheck2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">Analysis Complete!</h3>
                            <p className="text-muted-foreground">
                                The AI has drafted an evidence report. It will appear in your "Action Required" queue for final approval.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-between">
                    {step === 'capture' && (
                        <>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleNextToReview} disabled={!imageFile && !audioUrl}>
                                Review Evidence
                            </Button>
                        </>
                    )}
                    {step === 'review' && (
                        <>
                            <Button variant="ghost" onClick={() => setStep('capture')}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Back to Capture
                            </Button>
                            <Button onClick={handleSubmitToAI} className="bg-blue-600 hover:bg-blue-700">
                                <UploadCloud className="w-4 h-4 mr-2" /> Submit to AI
                            </Button>
                        </>
                    )}
                    {step === 'done' && (
                        <Button className="w-full" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
