import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { useUIStore } from '@/lib/uiStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Logger } from '@/lib/Logger';

// ── Mock profile data (mirrors db/seed.sql) ─────────────────────────────────

interface Profile {
    id: string;
    name: string;
    role: 'parent' | 'learner';
    pin: string;
    emoji: string;
    gradient: string;
}

const MOCK_PROFILES: Profile[] = [
    {
        id: 'parent_mwesigwa',
        name: 'Parent',
        role: 'parent',
        pin: '1234',
        emoji: '👨‍👩‍👧‍👦',
        gradient: 'from-violet-600/20 to-indigo-600/20',
    },
    {
        id: 'learner_azie',
        name: 'Azie',
        role: 'learner',
        pin: '1234',
        emoji: '🦁',
        gradient: 'from-amber-500/20 to-orange-500/20',
    },
    {
        id: 'learner_arie',
        name: 'Arie',
        role: 'learner',
        pin: '5678',
        emoji: '🐘',
        gradient: 'from-sky-500/20 to-cyan-500/20',
    },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ProfileSelect() {
    const [selected, setSelected] = useState<Profile | null>(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const login = useAuthStore((s) => s.login);
    const setActiveProfile = useUIStore((s) => s.setActiveProfile);
    const navigate = useNavigate();

    const handleSelect = (profile: Profile) => {
        setSelected(profile);
        setPin('');
        setError('');
    };

    const handleCancel = () => {
        setSelected(null);
        setPin('');
        setError('');
    };

    const handlePinComplete = (value: string) => {
        if (!selected) return;
        setIsVerifying(true);

        // Simulate async check
        setTimeout(() => {
            if (value === selected.pin) {
                Logger.info('[PROFILE]', `Profile unlocked: ${selected.name}`);
                login(selected.role, 'fam_mwesigwa', selected.id);
                setActiveProfile(selected.id, selected.name);

                if (selected.role === 'parent') {
                    navigate('/dashboard');
                } else {
                    navigate(`/learner/${selected.id}`);
                }
            } else {
                Logger.warn('[PROFILE]', `Bad PIN attempt for ${selected.name}`);
                setError('Incorrect PIN — try again');
                setPin('');
                setIsVerifying(false);
            }
        }, 400);
    };

    // ── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Who's learning today?
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Select your profile to continue
                    </p>
                </div>

                {/* ── PIN Entry Modal ─────────────────────────────────────── */}
                {selected ? (
                    <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center space-y-6">
                            <div
                                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selected.gradient} flex items-center justify-center text-4xl shadow-lg`}
                            >
                                {selected.emoji}
                            </div>

                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-semibold">{selected.name}</h2>
                                <p className="text-muted-foreground text-sm">
                                    Enter your 4-digit PIN
                                </p>
                            </div>

                            <InputOTP
                                maxLength={4}
                                value={pin}
                                onChange={(v) => {
                                    setPin(v);
                                    setError('');
                                }}
                                onComplete={handlePinComplete}
                                disabled={isVerifying}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                            </InputOTP>

                            {error && (
                                <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-bottom-1 duration-150">
                                    {error}
                                </p>
                            )}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isVerifying}
                            >
                                ← Back to profiles
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    /* ── Profile Cards Grid ──────────────────────────────── */
                    <div className="grid gap-4">
                        {MOCK_PROFILES.map((profile) => (
                            <button
                                key={profile.id}
                                onClick={() => handleSelect(profile)}
                                className="group w-full text-left"
                            >
                                <Card className="border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:border-primary/30 group-active:scale-[0.98]">
                                    <CardContent className="py-5 px-6 flex items-center gap-5">
                                        <div
                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${profile.gradient} flex items-center justify-center text-2xl shadow-md transition-transform duration-200 group-hover:scale-110`}
                                        >
                                            {profile.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-lg text-foreground truncate">
                                                {profile.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {profile.role === 'parent'
                                                    ? 'Command Center'
                                                    : 'Learner Environment'}
                                            </p>
                                        </div>
                                        <svg
                                            className="h-5 w-5 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                            />
                                        </svg>
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
