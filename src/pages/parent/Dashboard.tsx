import React from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { familyId, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Parent Command Center</h1>
                        <p className="text-muted-foreground mt-2">Welcome, Smith Family ({familyId})</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate('/profiles')}>
                            Switch Profile
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Active Tasks</CardTitle>
                            <CardDescription>Tasks currently assigned to your learners.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
                                <p className="text-muted-foreground">No active tasks tracked yet.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Awaiting Judgment</CardTitle>
                            <CardDescription>Review and authorize learner evidence.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
                                <p className="text-muted-foreground">No items awaiting judgment.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
