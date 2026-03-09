import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Logger } from '@/lib/Logger';
import { Plus, X, ArrowRight, ArrowLeft, CheckCircle2, Users, KeyRound, Baby } from 'lucide-react';

interface ChildEntry {
  name: string;
  age: number | '';
}

type Step = 'family' | 'children' | 'pin' | 'success';

export default function Onboarding() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState<Step>('family');
  const [familyName, setFamilyName] = useState('');
  const [children, setChildren] = useState<ChildEntry[]>([{ name: '', age: '' }]);
  const [pin, setPin] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addChild = () => {
    if (children.length >= 6) return;
    setChildren([...children, { name: '', age: '' }]);
  };

  const removeChild = (idx: number) => {
    if (children.length <= 1) return;
    setChildren(children.filter((_, i) => i !== idx));
  };

  const updateChild = (idx: number, field: keyof ChildEntry, value: string) => {
    const updated = [...children];
    if (field === 'age') {
      const num = parseInt(value);
      updated[idx] = { ...updated[idx], age: isNaN(num) ? '' : num };
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }
    setChildren(updated);
  };

  const canProceedToChildren = familyName.trim().length >= 2;
  const canProceedToPin = children.every(c => c.name.trim().length >= 1 && typeof c.age === 'number' && c.age >= 6 && c.age <= 9);

  const handleRegister = async (pinValue: string) => {
    setPin(pinValue);
    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/family/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: familyName.trim(),
          children: children.map(c => ({ name: c.name.trim(), age: c.age })),
          familyPin: pinValue,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      Logger.info('[ONBOARD]', `Family registered: ${data.familyCode}`);
      setFamilyCode(data.familyCode);
      setStep('success');

      // Auto-login as parent
      login('parent', data.familyId, `parent_${data.familyId}`);
    } catch (err: any) {
      setError(err.message);
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const stepIcons: Record<Step, React.ReactNode> = {
    family: <Users className="h-6 w-6" />,
    children: <Baby className="h-6 w-6" />,
    pin: <KeyRound className="h-6 w-6" />,
    success: <CheckCircle2 className="h-6 w-6" />,
  };

  const stepNumber = { family: 1, children: 2, pin: 3, success: 4 };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          {(['family', 'children', 'pin'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                stepNumber[step] > stepNumber[s]
                  ? 'bg-primary text-primary-foreground'
                  : step === s
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {stepNumber[step] > stepNumber[s] ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`h-0.5 w-8 ${stepNumber[step] > stepNumber[s] ? 'bg-primary' : 'bg-muted'}`} />}
            </React.Fragment>
          ))}
        </div>

        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          {/* ── Step 1: Family Name ── */}
          {step === 'family' && (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {stepIcons.family}
                </div>
                <CardTitle className="text-2xl font-bold">Welcome to Learn Live</CardTitle>
                <CardDescription>Let's set up your family. What should we call you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="familyName">Family Name</Label>
                  <Input
                    id="familyName"
                    placeholder="e.g. The Mwesigwa Family"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    autoFocus
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> I have a code
                </Button>
                <Button onClick={() => setStep('children')} disabled={!canProceedToChildren}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* ── Step 2: Children ── */}
          {step === 'children' && (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {stepIcons.children}
                </div>
                <CardTitle className="text-xl font-bold">Who are the learners?</CardTitle>
                <CardDescription>Add your children (ages 6–9 only for this pilot)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {children.map((child, idx) => (
                  <div key={idx} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Name</Label>
                      <Input
                        placeholder="Child's name"
                        value={child.name}
                        onChange={(e) => updateChild(idx, 'name', e.target.value)}
                      />
                    </div>
                    <div className="w-20 space-y-1">
                      <Label className="text-xs">Age</Label>
                      <Input
                        type="number"
                        min={6}
                        max={9}
                        placeholder="6-9"
                        value={child.age}
                        onChange={(e) => updateChild(idx, 'age', e.target.value)}
                      />
                    </div>
                    {children.length > 1 && (
                      <Button variant="ghost" size="icon" className="shrink-0" onClick={() => removeChild(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {children.length < 6 && (
                  <Button variant="outline" size="sm" className="w-full" onClick={addChild}>
                    <Plus className="h-4 w-4 mr-1" /> Add another child
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('family')}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button onClick={() => setStep('pin')} disabled={!canProceedToPin}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* ── Step 3: Family PIN ── */}
          {step === 'pin' && (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {stepIcons.pin}
                </div>
                <CardTitle className="text-xl font-bold">Set a family PIN</CardTitle>
                <CardDescription>This 4-digit PIN protects your parent dashboard</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <InputOTP
                  maxLength={4}
                  value={pin}
                  onChange={(v) => { setPin(v); setError(''); }}
                  onComplete={handleRegister}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                {loading && <p className="text-sm text-muted-foreground">Setting up your family…</p>}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="ghost" onClick={() => setStep('children')} disabled={loading}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              </CardFooter>
            </>
          )}

          {/* ── Step 4: Success ── */}
          {step === 'success' && (
            <>
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-bold">You're all set!</CardTitle>
                <CardDescription>Save your family code — you'll need it to sign in</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-muted rounded-xl px-8 py-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Family Code</p>
                  <p className="text-3xl font-mono font-bold tracking-widest text-foreground">{familyCode}</p>
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Write this down or take a screenshot. Share it with anyone who needs to access your family's learning dashboard.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        {step === 'family' && (
          <p className="text-center text-xs text-muted-foreground">
            Already have a code?{' '}
            <button onClick={() => navigate('/login')} className="underline text-primary hover:text-primary/80">
              Sign in here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
