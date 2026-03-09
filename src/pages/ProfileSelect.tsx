import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { useUIStore } from '@/lib/uiStore';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Logger } from '@/lib/Logger';
import { Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  role: 'parent' | 'learner';
  pin: string | null;
}

const LEARNER_EMOJIS = ['🦁', '🐘', '🦒', '🦜', '🐢', '🦋'];
const LEARNER_GRADIENTS = [
  'from-amber-500/20 to-orange-500/20',
  'from-sky-500/20 to-cyan-500/20',
  'from-emerald-500/20 to-teal-500/20',
  'from-pink-500/20 to-rose-500/20',
  'from-violet-500/20 to-purple-500/20',
  'from-lime-500/20 to-green-500/20',
];

export default function ProfileSelect() {
  const [selected, setSelected] = useState<Profile | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { login, isAuthenticated, role, userId, familyId, logout } = useAuthStore();
  const setActiveProfile = useUIStore((s) => s.setActiveProfile);
  const navigate = useNavigate();

  // Fetch profiles from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['familyProfiles', familyId],
    queryFn: async () => {
      if (!familyId) throw new Error('No family ID');
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/family/${familyId}/profiles`);
      if (!res.ok) throw new Error('Failed to load profiles');
      return res.json();
    },
    enabled: !!familyId,
  });

  const profiles: Profile[] = data?.profiles || [];

  const handleSelect = (profile: Profile) => {
    if (profile.role === 'parent') {
      // Parent doesn't need PIN in pilot — go straight to dashboard
      Logger.info('[PROFILE]', `Parent profile selected`);
      login('parent', familyId!, profile.id);
      setActiveProfile(profile.id, profile.name);
      navigate('/dashboard');
      return;
    }
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

    setTimeout(() => {
      if (value === selected.pin) {
        Logger.info('[PROFILE]', `Profile unlocked: ${selected.name}`);
        login(selected.role, familyId!, selected.id);
        setActiveProfile(selected.id, selected.name);
        navigate(`/learner/${selected.id}`);
      } else {
        Logger.warn('[PROFILE]', `Bad PIN attempt for ${selected.name}`);
        setError('Incorrect PIN — try again');
        setPin('');
        setIsVerifying(false);
      }
    }, 400);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!familyId) {
    navigate('/login', { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6 text-center space-y-4">
          <p className="text-muted-foreground">Could not load family profiles.</p>
          <Button onClick={handleLogout}>Try a different code</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Who's learning today?
          </h1>
          <p className="text-muted-foreground text-sm">
            {data?.familyName || 'Your Family'} — Select a profile
          </p>
        </div>

        {selected ? (
          <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardContent className="pt-8 pb-8 flex flex-col items-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-4xl shadow-lg">
                {LEARNER_EMOJIS[profiles.filter(p => p.role === 'learner').indexOf(selected)] || '🧒'}
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold">{selected.name}</h2>
                <p className="text-muted-foreground text-sm">Enter your 4-digit PIN</p>
              </div>
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(v) => { setPin(v); setError(''); }}
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
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isVerifying}>
                ← Back to profiles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {profiles.map((profile, idx) => {
              const learnerIdx = profiles.filter(p => p.role === 'learner').indexOf(profile);
              const emoji = profile.role === 'parent' ? '👨‍👩‍👧‍👦' : (LEARNER_EMOJIS[learnerIdx] || '🧒');
              const gradient = profile.role === 'parent'
                ? 'from-violet-600/20 to-indigo-600/20'
                : (LEARNER_GRADIENTS[learnerIdx] || LEARNER_GRADIENTS[0]);

              return (
                <button key={profile.id} onClick={() => handleSelect(profile)} className="group w-full text-left">
                  <Card className="border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:border-primary/30 group-active:scale-[0.98]">
                    <CardContent className="py-5 px-6 flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-md transition-transform duration-200 group-hover:scale-110`}>
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg text-foreground truncate">{profile.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {profile.role === 'parent' ? 'Command Center' : 'Learner Environment'}
                        </p>
                      </div>
                      <svg className="h-5 w-5 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <button onClick={handleLogout} className="text-xs text-muted-foreground underline hover:text-foreground">
            Switch family
          </button>
        </div>
      </div>
    </div>
  );
}
