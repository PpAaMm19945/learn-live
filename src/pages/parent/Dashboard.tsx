import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { BookOpen, Clock, Globe, AlertCircle, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

import { useIsAdmin } from '@/lib/auth';
import { useLearnerStore } from '@/lib/learnerStore';

interface Topic {
  id: string;
  title: string;
  description: string;
  era: string;
  region: string;
  lesson_count: number;
}

interface Learner {
  id: string;
  name: string;
  band: number;
}

interface FamilyResponse {
  family: { id: string; name: string };
  learners: Learner[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { name } = useAuthStore();
        const selectedLearnerId = useLearnerStore(state => state.selectedLearner?.id);

  const { data: familyData, isError: isFamilyError } = useQuery<FamilyResponse>({
    queryKey: ['family'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/family`, {
        credentials: 'include',
      });
      if (res.status === 404) {
        throw new Error('Family not found');
      }
      if (!res.ok) throw new Error('Failed to fetch family');
      return res.json();
    },
    retry: false
  });

  useEffect(() => {
    if (isFamilyError) {
      navigate('/onboarding');
    }
  }, [isFamilyError, navigate]);


  const { data: topics, isLoading, isError, refetch } = useQuery<Topic[]>({
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


      <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome, {name || 'Parent'}!</h2>
            <p className="text-muted-foreground">
              Explore the African History curriculum. Select a topic to view its lessons.
            </p>
          </div>


        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col h-[200px]">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter className="pt-3 border-t">
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl bg-card">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Failed to load topics</h3>
            <p className="text-muted-foreground mb-6">We encountered an error while fetching the curriculum data.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : !topics || topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-xl border-dashed bg-card">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No topics available yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">We're still preparing the curriculum content. Check back later to start learning!</p>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
                onClick={() => navigate(`/topics/${topic.id}${selectedLearnerId ? `?learner=${selectedLearnerId}` : ''}`)}
                aria-label={`View topic: ${topic.title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/topics/${topic.id}${selectedLearnerId ? `?learner=${selectedLearnerId}` : ''}`);
                  }
                }}
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
