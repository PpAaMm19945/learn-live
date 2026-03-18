import React, { useState, useRef, ChangeEvent } from 'react';
import { IconUpload, IconCamera, IconCircleCheck, IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logger } from '@/lib/Logger';

interface ArtifactAssessment {
    status: 'draft' | 'approved' | 'rejected';
    score: number;
    feedback: string;
    areas_to_improve: string;
}

interface ArtifactUploadProps {
    lessonId: string;
    band: number;
    onAssessmentDraft?: (assessment: ArtifactAssessment) => void;
}

export function ArtifactUpload({ lessonId, band, onAssessmentDraft }: ArtifactUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [assessment, setAssessment] = useState<ArtifactAssessment | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check if it's an image
            const isImage = selectedFile.type.startsWith('image/');
            const isHeic = selectedFile.name.toLowerCase().endsWith('.heic') || selectedFile.name.toLowerCase().endsWith('.hevc');

            if (!isImage && !isHeic) {
                setError('Please select a valid image file (JPEG, PNG, HEIC).');
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
            setAssessment(null);
        }
    };

    const handleCheckMyWork = async () => {
        if (!file) {
            setError('Please upload a photo first.');
            return;
        }

        try {
            setError(null);
            setIsUploading(true);

            // 1. Upload to R2
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pathPrefix', 'artifacts');

            Logger.info('[UI]', 'Uploading artifact to R2...', { lessonId });

            const uploadRes = await fetch('/api/artifacts/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || 'development_secret_token'}`
                },
                body: formData,
            });

            if (!uploadRes.ok) {
                const data = await uploadRes.json();
                throw new Error(data.error || 'Failed to upload image.');
            }

            const uploadData = await uploadRes.json();
            const r2Key = uploadData.r2_key;

            setIsUploading(false);
            setIsVerifying(true);

            // 2. Trigger AI verification
            Logger.info('[AGENT]', 'Verifying artifact with AI...', { r2Key, lessonId, band });

            const verifyRes = await fetch('/api/artifacts/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || 'development_secret_token'}`
                },
                body: JSON.stringify({ r2_key: r2Key, lesson_id: lessonId, band }),
            });

            if (!verifyRes.ok) {
                const data = await verifyRes.json();
                throw new Error(data.error || 'Failed to verify artifact.');
            }

            const verifyData = await verifyRes.json();
            const newAssessment = verifyData.assessment as ArtifactAssessment;

            setAssessment(newAssessment);
            if (onAssessmentDraft) {
                onAssessmentDraft(newAssessment);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsUploading(false);
            setIsVerifying(false);
        }
    };

    return (
        <Card className="w-full max-w-lg mx-auto border-secondary/50 shadow-sm bg-card/50">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <IconCamera className="w-5 h-5 text-primary" />
                    Artifact Check
                </CardTitle>
                <CardDescription>
                    Upload a photo of your drawn map, timeline, or diagram.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!previewUrl ? (
                    <div
                        className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <IconUpload className="w-10 h-10 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium">Click to upload or take a photo</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports JPEG, PNG, HEIC</p>
                    </div>
                ) : (
                    <div className="relative rounded-lg overflow-hidden border border-border">
                        <img
                            src={previewUrl}
                            alt="Artifact Preview"
                            className="w-full h-auto max-h-[300px] object-contain bg-black/5"
                        />
                        {!isVerifying && !isUploading && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 text-xs"
                                onClick={() => {
                                    setFile(null);
                                    setPreviewUrl(null);
                                    setAssessment(null);
                                }}
                            >
                                Retake
                            </Button>
                        )}
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {error && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-start gap-2">
                        <IconAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {assessment && (
                    <div className="p-4 bg-primary/5 rounded-md border border-primary/20 space-y-3">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                            <h4 className="font-semibold text-primary flex items-center gap-2">
                                <IconCircleCheck className="w-4 h-4" />
                                AI Assessment Draft
                            </h4>
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Score: {assessment.score}/100
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Feedback</p>
                            <p className="text-sm text-muted-foreground mt-1">{assessment.feedback}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Areas to Improve</p>
                            <p className="text-sm text-muted-foreground mt-1">{assessment.areas_to_improve}</p>
                        </div>
                        <p className="text-xs text-muted-foreground italic pt-2 border-t border-primary/10">
                            This is a draft. A parent must review it before it counts.
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {!assessment && (
                    <Button
                        onClick={handleCheckMyWork}
                        disabled={!file || isUploading || isVerifying}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : isVerifying ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                AI is Checking...
                            </>
                        ) : (
                            'Check My Work'
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
