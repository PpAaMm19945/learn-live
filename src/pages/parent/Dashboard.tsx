import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { email, name, roles, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-semibold">Learn Live</h1>
            <p className="text-xs text-muted-foreground">{name || email}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 text-center space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Welcome, {name || 'Parent'}!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The new African History curriculum is being built. Your dashboard will appear here soon.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          Roles: {roles.join(', ') || 'none assigned'}
        </div>
      </main>
    </div>
  );
}
