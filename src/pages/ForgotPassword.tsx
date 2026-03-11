import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Logger } from '@/lib/Logger';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
        setError('Please enter your email');
        return;
    }

    setLoading(true);
    setError('');
    setMsg('');

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

      setMsg('If an account exists, a reset link has been sent to your email.');
      Logger.info('[LOGIN]', `Forgot password requested for: ${email}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
            {msg && <p className="text-sm text-green-600 font-medium text-center">{msg}</p>}

            <form onSubmit={handleForgot} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="pl-9"
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
