import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { IconArrowLeft, IconLoader2, IconMail, IconCircleCheck } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email');

      setSent(true);
      toast({ title: 'Reset link sent', description: 'Check your email inbox.' });
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <IconCircleCheck className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              If an account exists for <strong className="text-foreground">{email}</strong>, a reset link has been sent.
            </p>
            <Link to="/login" className="inline-flex items-center text-sm text-primary hover:underline">
              <IconArrowLeft className="mr-1 h-4 w-4" /> Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
            <CardDescription>Enter your email and we'll send you a reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}

            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="name@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }} className="pl-9" autoFocus />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <IconLoader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/login" className="inline-flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
