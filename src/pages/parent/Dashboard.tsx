import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader2, BookOpen, Clock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface Topic {
  id: string;
  title: string;
  description: string;
  era: string;
  region: string;
  lesson_count: number;
}

export default function Dashboard() {
  const { email, name, logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: topics, isLoading, isError } = useQuery<Topic[]>({
    queryKey: ['topics'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/topics`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch topics');
      return res.json();
    },
  });

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
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

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome, {name || 'Parent'}!</h2>
          <p className="text-muted-foreground">
            Explore the African History curriculum. Select a topic to view its lessons.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-destructive">
            <p>Failed to load topics. Please try again later.</p>
          </div>
        ) : !topics || topics.length === 0 ? (
          <div className="text-center py-12 border rounded-xl border-dashed bg-card">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No topics available yet</h3>
            <p className="text-muted-foreground">Content is being prepared.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/topics/${topic.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {topic.era}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {topic.region}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {topic.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-3 border-t text-sm text-muted-foreground">
                  {topic.lesson_count} lesson{topic.lesson_count !== 1 ? 's' : ''}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
