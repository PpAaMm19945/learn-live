import { useAuthStore, useIsAdmin } from '@/lib/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { IconLogout, IconArrowLeft, IconLoader2, IconUsers, IconBook, IconClock, IconActivity, IconChartBar } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard() {
  const { name, email, logout } = useAuthStore();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/admin/analytics/overview`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load overview data');
      return res.json();
    },
    enabled: isAdmin
  });

  const { data: engagement, isLoading: isEngagementLoading } = useQuery({
    queryKey: ['admin-engagement'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/admin/analytics/engagement`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load engagement data');
      return res.json();
    },
    enabled: isAdmin
  });

  // Combine daily data for the chart
  const chartData = engagement?.dailyActiveUsers?.map((dau: any) => {
    const lessonData = engagement.dailyLessons?.find((l: any) => l.date === dau.date);
    return {
      date: dau.date,
      activeUsers: dau.count,
      lessonsCompleted: lessonData ? lessonData.count : 0
    };
  }) || [];

  const { data: familiesData, isLoading: isFamiliesLoading } = useQuery({
    queryKey: ['admin-families'],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_WORKER_URL || 'https://learn-live.antmwes104-1.workers.dev';
      const res = await fetch(`${apiUrl}/api/admin/analytics/families`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load families data');
      return res.json();
    },
    enabled: isAdmin
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Signed out' });
    navigate('/login');
  };

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard">
              <IconArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                Learn Live <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold">Admin</span>
              </h1>
              <p className="text-xs text-muted-foreground">{name || email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sign out">
            <IconLogout className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Analytics Overview</h2>
          <p className="text-muted-foreground">
            Platform usage, learner engagement, and content performance metrics.
          </p>
        </div>

        {/* Overview Cards Area */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Families</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isOverviewLoading ? '-' : overview?.totalFamilies}</div>
              <p className="text-xs text-muted-foreground">Registered parent accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
              <IconBook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isOverviewLoading ? '-' : overview?.totalLearners}</div>
              <p className="text-xs text-muted-foreground">Across all bands</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users (7d)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isOverviewLoading ? '-' : overview?.activeUsers7d}</div>
              <p className="text-xs text-muted-foreground">Unique users with recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isOverviewLoading ? '-' : overview?.lessons?.total}</div>
              <p className="text-xs text-muted-foreground">+{isOverviewLoading ? '-' : overview?.lessons?.last7Days} in the last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Details Area */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Platform Engagement</CardTitle>
              <CardDescription>Daily active users and lessons completed over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isEngagementLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="activeUsers" name="Active Users" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="lessonsCompleted" name="Lessons Completed" stroke="hsl(var(--chart-2, 160 60% 45%))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Learner Distribution</CardTitle>
              <CardDescription>Breakdown by difficulty band</CardDescription>
            </CardHeader>
            <CardContent>
              {isOverviewLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview?.bandDistribution || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="band" tickLine={false} axisLine={false} tickFormatter={(val) => `Band ${val}`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" name="Learners" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Table Area */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Family Engagement</CardTitle>
              <CardDescription>Activity overview across registered families</CardDescription>
            </CardHeader>
            <CardContent>
              {isFamiliesLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead className="text-right">Learners</TableHead>
                        <TableHead className="text-right">Lessons Completed</TableHead>
                        <TableHead className="text-right">Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {familiesData?.families?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No families found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        familiesData?.families?.map((family: any) => (
                          <TableRow key={family.id}>
                            <TableCell className="font-medium">{family.family_name || 'Unnamed Family'}</TableCell>
                            <TableCell className="text-right">{family.learner_count}</TableCell>
                            <TableCell className="text-right">{family.total_lessons_completed}</TableCell>
                            <TableCell className="text-right">
                              {family.last_active_date
                                ? new Date(family.last_active_date).toLocaleDateString()
                                : <span className="text-muted-foreground">Never</span>}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
