import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileCheck2, BookOpen, LayoutDashboard, Users, LogOut, Settings, PlaySquare, ShieldAlert, LightbulbIcon, Mic, Camera, ChevronLeft, ShoppingBasket, BarChart3, FileText, Crown, Shield } from 'lucide-react';
import { JudgmentModal, JudgmentItem } from '@/components/parent/JudgmentModal';
import { ParentTaskCard, LearnerRepetitionState } from '@/components/parent/ParentTaskCard';
import { WeeklyPantryList } from '@/components/parent/WeeklyPantryList';
import { AsyncEvidenceModal } from '@/components/parent/AsyncEvidenceModal';
import { PatternDashboard } from '@/components/parent/PatternDashboard';
import { ParentReportModal } from '@/components/parent/ParentReportModal';
import { AccessControlModal } from '@/components/parent/AccessControlModal';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
    const { familyId, logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedJudgment, setSelectedJudgment] = useState<JudgmentItem | null>(null);
    const [selectedTask, setSelectedTask] = useState<LearnerRepetitionState | null>(null);
    const [asyncModalState, setAsyncModalState] = useState({
        isOpen: false,
        templateId: '',
        learnerName: '',
        capacityName: ''
    });
    const [reportModalState, setReportModalState] = useState({
        isOpen: false,
        templateId: '',
        learnerId: '',
        learnerName: '',
        capacityName: '',
        successCondition: '',
        failureCondition: '',
    });

    const { data: judgmentsData, isLoading: isJudgmentsLoading } = useQuery({
        queryKey: ['pending-judgments', familyId],
        queryFn: async () => {
            if (!familyId) return { judgments: [] };
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/parent/${familyId}/judgments`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        enabled: !!familyId,
    });

    const { data: curriculumData, isLoading: isCurriculumLoading } = useQuery({
        queryKey: ['active-curriculum', familyId],
        queryFn: async () => {
            if (!familyId) return { tasks: [] };
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/family/${familyId}/curriculum-tasks`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        enabled: !!familyId,
    });

    const judgments = judgmentsData?.judgments || [];
    const activeTasks: LearnerRepetitionState[] = curriculumData?.tasks || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleJudgmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['pending-judgments', familyId] });
    };

    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isPatternOpen, setIsPatternOpen] = useState(false);

    return (
        <div className="flex flex-col sm:flex-row h-screen bg-background text-foreground overflow-hidden">
            {/* Left Nav Rail */}
            <nav className="w-16 md:w-20 border-r border-border bg-sidebar hidden sm:flex flex-col items-center py-6 gap-6 z-10 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)]">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col gap-4 flex-1 w-full items-center">
                    <button className="p-3 rounded-xl bg-primary/10 text-primary transition-colors">
                        <LayoutDashboard className="w-5 h-5 fill-primary/20" />
                    </button>
                    <button className="p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors" onClick={() => navigate('/profiles')}>
                        <Users className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors" onClick={() => setIsPantryOpen(true)} title="Weekly Pantry List">
                        <ShoppingBasket className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors" onClick={() => setIsPatternOpen(true)} title="Learner Patterns">
                        <BarChart3 className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
                <button className="p-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors" onClick={handleLogout}>
                    <LogOut className="w-5 h-5" />
                </button>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-row overflow-hidden relative">

                {/* Center Column: Active Tasks Feed (Master) */}
                <div className={`w-full md:w-1/2 lg:w-[40%] flex-col border-r border-border bg-background z-0 ${selectedTask ? 'hidden md:flex' : 'flex'}`}>
                    <header className="px-6 py-5 border-b border-border bg-background/95 backdrop-blur z-10 sticky top-0 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">Family Dashboard</h1>
                            <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">{familyId?.replace('fam_', '').replace(/^\w/, c => c.toUpperCase())}</p>
                        </div>
                        <Badge variant="secondary" className="font-medium text-[10px] px-2 py-0.5 uppercase tracking-wider">Pilot Program</Badge>
                    </header>

                    <div className="flex-1 overflow-y-auto w-full">
                        {judgments.length > 0 && (
                            <div className="p-4 border-b border-border bg-orange-50">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
                                    <FileCheck2 className="w-3.5 h-3.5" /> Action Required ({judgments.length})
                                </h3>
                                <div className="space-y-2">
                                    {judgments.map((item: JudgmentItem) => (
                                        <div
                                            key={item.id}
                                            className="p-3 border border-orange-500/20 rounded-[8px] flex justify-between items-center bg-white shadow-sm hover:border-orange-500/40 transition-colors cursor-pointer"
                                            onClick={() => setSelectedJudgment(item)}
                                        >
                                            <div>
                                                <h4 className="font-semibold text-[14px] text-foreground">{item.learner_name}</h4>
                                                <p className="text-[12px] text-muted-foreground">{item.capacity}</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-7 text-xs border-orange-500/30 text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={(e) => { e.stopPropagation(); setSelectedJudgment(item); }}>
                                                Review
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">Curriculum Assignments</h3>
                            <div className="space-y-2.5">
                                {isCurriculumLoading ? (
                                    <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                                ) : activeTasks.length > 0 ? (
                                    activeTasks.map((state) => (
                                        <ParentTaskCard
                                            key={state.template.id}
                                            state={state}
                                            isSelected={selectedTask?.template.id === state.template.id}
                                            onClick={() => setSelectedTask(state)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-[8px] mt-2">
                                        No active curriculum tasks available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Context/Detail Panel */}
                <div className={`w-full md:w-1/2 lg:w-[60%] flex-col bg-card overflow-y-auto ${!selectedTask ? 'hidden md:flex' : 'flex'}`}>
                    {selectedTask ? (
                        <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-200">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Button variant="ghost" size="sm" className="md:hidden -ml-3 px-2 h-8 text-muted-foreground hover:text-foreground" onClick={() => setSelectedTask(null)}>
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Back
                                    </Button>
                                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{selectedTask.template.capacity_id}</Badge>
                                    <span className="text-sm text-muted-foreground font-medium">{selectedTask.learner_name}</span>
                                </div>
                                <h2 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">{selectedTask.template.capacity_name}</h2>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">{selectedTask.template.task_type}</p>
                            </div>

                            <Separator className="bg-border/60" />

                            <div className="space-y-6">
                                <div className="bg-background border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/60"></div>
                                    <h4 className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 mb-3 text-primary">
                                        <PlaySquare className="w-4 h-4" /> Parent Action
                                    </h4>
                                    <p className="text-[16px] leading-relaxed text-foreground">{selectedTask.template.parent_prompt}</p>
                                    {selectedTask.template.materials && (
                                        <div className="mt-5 pt-4 border-t border-border border-dashed">
                                            <p className="text-[13px] text-muted-foreground">
                                                <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] mr-2">Materials:</span> {selectedTask.template.materials}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl p-5 shadow-sm">
                                        <h4 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-green-700 dark:text-green-500 mb-3">
                                            <FileCheck2 className="w-4 h-4" /> Success Condition
                                        </h4>
                                        <p className="text-[14px] text-green-900 dark:text-green-100 leading-relaxed">{selectedTask.template.success_condition}</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-5 shadow-sm">
                                        <h4 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-orange-700 dark:text-orange-500 mb-3">
                                            <ShieldAlert className="w-4 h-4" /> Watch For
                                        </h4>
                                        <p className="text-[14px] text-orange-900 dark:text-orange-100 leading-relaxed">{selectedTask.template.failure_condition || "Observe for logic breaks."}</p>
                                    </div>
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                                    <h4 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary mb-3">
                                        <LightbulbIcon className="w-4 h-4" /> Reasoning Check
                                    </h4>
                                    <p className="text-[14px] text-foreground font-medium italic">"{selectedTask.template.reasoning_check}"</p>
                                </div>
                            </div>

                            <div className="pt-6 space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Record Evidence</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Default: Parent Report */}
                                    <Button
                                        className="gap-2 shadow-sm font-medium h-12"
                                        onClick={() => setReportModalState({
                                            isOpen: true,
                                            templateId: selectedTask.template.id,
                                            learnerId: selectedTask.learner_id,
                                            learnerName: selectedTask.learner_name,
                                            capacityName: selectedTask.template.capacity_name,
                                            successCondition: selectedTask.template.success_condition,
                                            failureCondition: selectedTask.template.failure_condition || '',
                                        })}
                                    >
                                        <FileText className="w-4 h-4" /> Parent Report
                                    </Button>

                                    {/* Async AI */}
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-border bg-background hover:bg-secondary/50 font-medium h-12"
                                        onClick={() => setAsyncModalState({
                                            isOpen: true,
                                            templateId: selectedTask.template.id,
                                            learnerName: selectedTask.learner_name,
                                            capacityName: selectedTask.template.capacity_name
                                        })}
                                    >
                                        <Camera className="w-4 h-4" /> Photo + Audio
                                    </Button>

                                    {/* Live AI — Premium */}
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-border bg-background hover:bg-secondary/50 font-medium h-12 relative"
                                    >
                                        <Mic className="w-4 h-4 text-primary" /> Live AI
                                        <Badge variant="secondary" className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 border-amber-200">
                                            <Crown className="w-2.5 h-2.5 mr-0.5" />Premium
                                        </Badge>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                            <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <LayoutDashboard className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-medium text-foreground mb-2">Select a task</h3>
                            <p className="text-[14px] max-w-sm">
                                Choose an assignment from the feed to view its full structural blueprint or to upload and finalize evidence.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="sm:hidden flex h-16 border-t border-border bg-sidebar items-center justify-around px-2 shrink-0 z-20 pb-safe">
                <button className="flex flex-col items-center justify-center p-2 text-primary focus:outline-none" onClick={() => setSelectedTask(null)}>
                    <LayoutDashboard className="w-5 h-5 mb-0.5 fill-primary/20" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none" onClick={() => navigate('/profiles')}>
                    <Users className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Profiles</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                    <Settings className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-red-500 transition-colors focus:outline-none" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Sign Out</span>
                </button>
            </nav>

            <JudgmentModal
                isOpen={!!selectedJudgment}
                onClose={() => setSelectedJudgment(null)}
                item={selectedJudgment}
                onSuccess={handleJudgmentSuccess}
            />

            <AsyncEvidenceModal
                {...asyncModalState}
                onClose={() => setAsyncModalState(prev => ({ ...prev, isOpen: false }))}
            />

            <WeeklyPantryList
                isOpen={isPantryOpen}
                onClose={() => setIsPantryOpen(false)}
                tasks={activeTasks}
            />

            <PatternDashboard
                isOpen={isPatternOpen}
                onClose={() => setIsPatternOpen(false)}
            />

            <ParentReportModal
                {...reportModalState}
                onClose={() => setReportModalState(prev => ({ ...prev, isOpen: false }))}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['active-curriculum', familyId] })}
            />
        </div>
    );
}
