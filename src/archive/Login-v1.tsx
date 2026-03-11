// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Logger } from '@/lib/Logger';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${apiUrl}/api/family/code/${encodeURIComponent(trimmed)}/profiles`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Family not found');

      Logger.info('[LOGIN]', `Family found: ${data.familyName}`);
      // Login as parent, then go to profile select
      login('parent', data.familyId, `parent_${data.familyId}`);
      navigate('/profiles');
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
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Enter your family code to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Family Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="e.g. LL-AB3F"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  className="text-center text-lg font-mono tracking-widest"
                  autoFocus
                  maxLength={10}
                />
              </div>
              {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading || code.trim().length < 4}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Sign In <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          New family?{' '}
          <button onClick={() => navigate('/join')} className="underline text-primary hover:text-primary/80">
            Set up your account
          </button>
        </p>
      </div>
    </div>
  );
}
