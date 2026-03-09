import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileCheck2, BookOpen, LayoutDashboard, Users, LogOut, Settings, PlaySquare, ShieldAlert, LightbulbIcon, Mic, Camera, ChevronLeft, ShoppingBasket, BarChart3, FileText, Crown, Shield, Calendar, HelpCircle, Lightbulb, GraduationCap } from 'lucide-react';
import { JudgmentModal, JudgmentItem } from '@/components/parent/JudgmentModal';
import { WeeklyPantryList } from '@/components/parent/WeeklyPantryList';
import { AsyncEvidenceModal } from '@/components/parent/AsyncEvidenceModal';
import { PatternDashboard } from '@/components/parent/PatternDashboard';
import { ParentReportModal } from '@/components/parent/ParentReportModal';
import { AccessControlModal } from '@/components/parent/AccessControlModal';
import { QuizWidget } from '@/components/parent/QuizWidget';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LearnerRepetitionState } from '@/components/parent/ParentTaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for the weekly plan API response
interface EnrichedTaskData {
    template_id: string;
    concept_context: string;
    suggested_approaches: { title: string; description: string }[];
    what_to_look_for: string;
    fun_fact: string;
    quiz_questions: { question: string; answer: string; hint?: string }[];
    child_prompt: string;
}

interface WeeklyTaskTemplate {
    id: string;
    capacity_id: string;
    capacity_name: string;
    strand_name: string;
    cognitive_level: number;
    task_type: string;
    materials?: string;
    parent_prompt: string;
    success_condition: string;
    failure_condition?: string;
    reasoning_check: string;
    arc_stage: string;
}

interface WeeklyTask {
    id: string;
    template_id: string;
    capacity_id: string;
    strand_name: string;
    day_of_week: number | null;
    status: string;
    carryover_count: number;
    template: WeeklyTaskTemplate | null;
    enrichment: EnrichedTaskData | null;
}

interface WeeklyPlan {
    plan_id: string;
    week_start: string;
    learner_id: string;
    learner_name: string;
    tasks: WeeklyTask[];
    is_new: boolean;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const SUBJECT_ICONS: Record<string, string> = {
    'Number & Quantity': '📐',
    'Geometry & Measurement': '📏',
    'Data & Probability': '📊',
    'Algebraic Thinking': '🧮',
    'Computation & Fluency': '➕',
    'Composition': '✍️',
    'Grammar': '📝',
    'Vocabulary': '📖',
    'Reading Comprehension': '📚',
    'Oral Expression': '🗣️',
    'Living Things': '🌱',
    'Matter & Energy': '⚡',
    'Earth & Environment': '🌍',
};

function getSubjectGroup(strandName: string): string {
    const mathStrands = ['Number & Quantity', 'Geometry & Measurement', 'Data & Probability', 'Algebraic Thinking', 'Computation & Fluency'];
    const englishStrands = ['Composition', 'Grammar', 'Vocabulary', 'Reading Comprehension', 'Oral Expression'];
    const scienceStrands = ['Living Things', 'Matter & Energy', 'Earth & Environment'];
    if (mathStrands.includes(strandName)) return 'Mathematics';
    if (englishStrands.includes(strandName)) return 'English';
    if (scienceStrands.includes(strandName)) return 'Science';
    return 'Other';
}

function getSubjectColor(subject: string): string {
    switch (subject) {
        case 'Mathematics': return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'English': return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'Science': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        default: return 'text-muted-foreground bg-secondary border-border';
    }
}

export default function Dashboard() {
    const { familyId, logout } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedJudgment, setSelectedJudgment] = useState<JudgmentItem | null>(null);
    const [selectedTask, setSelectedTask] = useState<WeeklyTask | null>(null);
    const [selectedLearner, setSelectedLearner] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState(false);
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

    // Fetch weekly plan (replaces flat curriculum-tasks)
    const { data: weeklyData, isLoading: isWeeklyLoading } = useQuery({
        queryKey: ['weekly-plan', familyId],
        queryFn: async () => {
            if (!familyId) return { plans: [] };
            const apiUrl = import.meta.env.VITE_WORKER_URL || '';
            const res = await fetch(`${apiUrl}/api/family/${familyId}/weekly-plan`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        enabled: !!familyId,
    });

    // Also keep legacy fetch for pantry list compatibility
    const { data: curriculumData } = useQuery({
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
    const plans: WeeklyPlan[] = weeklyData?.plans || [];
    const activeTasks: LearnerRepetitionState[] = curriculumData?.tasks || [];

    // Determine selected learner
    const learnerNames = [...new Set(plans.map(p => p.learner_name))];
    const activeLearner = selectedLearner || (plans.length > 0 ? plans[0].learner_id : null);
    const activePlan = plans.find(p => p.learner_id === activeLearner) || plans[0];

    // Group tasks by subject
    const tasksBySubject = useMemo(() => {
        if (!activePlan) return {};
        const grouped: Record<string, WeeklyTask[]> = {};
        for (const task of activePlan.tasks) {
            if (!task.template) continue;
            const subject = getSubjectGroup(task.strand_name);
            if (!grouped[subject]) grouped[subject] = [];
            grouped[subject].push(task);
        }
        return grouped;
    }, [activePlan]);

    // Group tasks by day
    const tasksByDay = useMemo(() => {
        if (!activePlan) return {};
        const grouped: Record<number, WeeklyTask[]> = {};
        for (const task of activePlan.tasks) {
            if (!task.template) continue;
            const day = task.day_of_week ?? 0;
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(task);
        }
        return grouped;
    }, [activePlan]);

    const weekLabel = activePlan?.week_start
        ? `Week of ${new Date(activePlan.week_start + 'T00:00:00').toLocaleDateString('en-UG', { month: 'long', day: 'numeric' })}`
        : 'This Week';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleJudgmentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['pending-judgments', familyId] });
    };

    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isPatternOpen, setIsPatternOpen] = useState(false);
    const [accessControlState, setAccessControlState] = useState({ isOpen: false, learnerId: '', learnerName: '' });

    const selectedPlanForLearner = plans.find(p => p.learner_id === activeLearner);

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
                    <button className="p-3 rounded-xl text-muted-foreground hover:bg-secondary transition-colors" title="Portal Access Control"
                        onClick={() => {
                            if (activePlan) {
                                setAccessControlState({ isOpen: true, learnerId: activePlan.learner_id, learnerName: activePlan.learner_name });
                            }
                        }}>
                        <Shield className="w-5 h-5" />
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

                {/* Left Column: Weekly Overview */}
                <div className={`w-full md:w-1/2 lg:w-[42%] flex-col border-r border-border bg-background z-0 ${selectedTask ? 'hidden md:flex' : 'flex'}`}>
                    <header className="px-6 py-5 border-b border-border bg-background/95 backdrop-blur z-10 sticky top-0">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">Family Dashboard</h1>
                                <p className="text-[13px] text-muted-foreground mt-0.5 font-medium">{familyId?.replace('fam_', '').replace(/^\w/, c => c.toUpperCase())}</p>
                            </div>
                            <Badge variant="secondary" className="font-medium text-[10px] px-2 py-0.5 uppercase tracking-wider">Pilot Program</Badge>
                        </div>

                        {/* Learner Tabs */}
                        {plans.length > 1 && (
                            <div className="flex gap-2">
                                {plans.map(plan => (
                                    <button
                                        key={plan.learner_id}
                                        onClick={() => { setSelectedLearner(plan.learner_id); setSelectedTask(null); }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            plan.learner_id === activeLearner
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        {plan.learner_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </header>

                    <div className="flex-1 overflow-y-auto w-full">
                        {/* Action Required */}
                        {judgments.length > 0 && (
                            <div className="p-4 border-b border-border bg-orange-50 dark:bg-orange-950/20">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
                                    <FileCheck2 className="w-3.5 h-3.5" /> Action Required ({judgments.length})
                                </h3>
                                <div className="space-y-2">
                                    {judgments.map((item: JudgmentItem) => (
                                        <div
                                            key={item.id}
                                            className="p-3 border border-orange-500/20 rounded-lg flex justify-between items-center bg-white dark:bg-card shadow-sm hover:border-orange-500/40 transition-colors cursor-pointer"
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

                        {/* Weekly Plan Header */}
                        <div className="p-4 pb-2">
                            <div className="flex items-center justify-between mb-1">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {weekLabel}
                                </h2>
                            </div>
                            {activePlan && (
                                <p className="text-xs text-muted-foreground">
                                    {activePlan.learner_name} · {activePlan.tasks.filter(t => t.template).length} tasks planned
                                    {activePlan.tasks.some(t => t.carryover_count > 0) && (
                                        <span className="text-orange-600 ml-1">
                                            · {activePlan.tasks.filter(t => t.carryover_count > 0).length} carried over
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>

                        {isWeeklyLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                        ) : (
                            <Tabs defaultValue="subjects" className="px-4">
                                <TabsList className="w-full mb-3">
                                    <TabsTrigger value="subjects" className="flex-1 text-xs">By Subject</TabsTrigger>
                                    <TabsTrigger value="days" className="flex-1 text-xs">By Day</TabsTrigger>
                                </TabsList>

                                <TabsContent value="subjects" className="space-y-4 mt-0">
                                    {Object.entries(tasksBySubject).map(([subject, tasks]) => (
                                        <div key={subject} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-2 py-1 rounded-md border ${getSubjectColor(subject)}`}>
                                                    {subject === 'Mathematics' ? '📐' : subject === 'English' ? '📖' : '🔬'} {subject}
                                                    <span className="opacity-60">({tasks.length})</span>
                                                </h3>
                                            </div>
                                            <div className="space-y-1.5">
                                                {tasks.map(task => (
                                                    <WeeklyTaskRow
                                                        key={task.id}
                                                        task={task}
                                                        isSelected={selectedTask?.id === task.id}
                                                        onClick={() => { setSelectedTask(task); setShowQuiz(false); }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.keys(tasksBySubject).length === 0 && (
                                        <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
                                            No tasks planned for this week yet.
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="days" className="space-y-4 mt-0">
                                    {[0, 1, 2, 3, 4].map(day => {
                                        const dayTasks = tasksByDay[day] || [];
                                        if (dayTasks.length === 0) return null;
                                        return (
                                            <div key={day} className="space-y-1.5">
                                                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                                                    {DAY_NAMES[day]}
                                                </h3>
                                                {dayTasks.map(task => (
                                                    <WeeklyTaskRow
                                                        key={task.id}
                                                        task={task}
                                                        isSelected={selectedTask?.id === task.id}
                                                        onClick={() => { setSelectedTask(task); setShowQuiz(false); }}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    })}
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>

                {/* Right Column: Enriched Task Detail */}
                <div className={`w-full md:w-1/2 lg:w-[58%] flex-col bg-card overflow-y-auto ${!selectedTask ? 'hidden md:flex' : 'flex'}`}>
                    {selectedTask && selectedTask.template ? (
                        <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Button variant="ghost" size="sm" className="md:hidden -ml-3 px-2 h-8 text-muted-foreground hover:text-foreground" onClick={() => setSelectedTask(null)}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                    </Button>
                                    <Badge variant="outline" className={`text-[10px] border ${getSubjectColor(getSubjectGroup(selectedTask.strand_name))}`}>
                                        {selectedTask.strand_name}
                                    </Badge>
                                    <Badge variant={selectedTask.template.arc_stage === 'Exposure' ? 'secondary' : 'default'} className="text-[10px]">
                                        {selectedTask.template.arc_stage}
                                    </Badge>
                                    {selectedTask.carryover_count > 0 && (
                                        <Badge variant="destructive" className="text-[10px]">
                                            Carried over {selectedTask.carryover_count}x
                                        </Badge>
                                    )}
                                    {selectedTask.day_of_week !== null && (
                                        <span className="text-xs text-muted-foreground">{DAY_NAMES[selectedTask.day_of_week]}</span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight">{selectedTask.template.capacity_name}</h2>
                                <p className="text-sm text-muted-foreground mt-1 font-medium">{selectedTask.template.task_type}</p>
                            </div>

                            {/* AI Concept Context */}
                            {selectedTask.enrichment?.concept_context && (
                                <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
                                    <h4 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary mb-2">
                                        <Lightbulb className="w-4 h-4" /> Why This Matters
                                    </h4>
                                    <p className="text-[14px] text-foreground leading-relaxed">{selectedTask.enrichment.concept_context}</p>
                                    {selectedTask.enrichment.fun_fact && (
                                        <p className="mt-3 text-[13px] text-primary/80 italic border-t border-primary/10 pt-3">
                                            💡 {selectedTask.enrichment.fun_fact}
                                        </p>
                                    )}
                                </div>
                            )}

                            <Separator className="bg-border/60" />

                            {/* Suggested Approaches */}
                            {selectedTask.enrichment?.suggested_approaches && selectedTask.enrichment.suggested_approaches.length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                                        <GraduationCap className="w-4 h-4 text-primary" /> Ways to Teach This
                                    </h4>
                                    <div className="grid gap-3">
                                        {selectedTask.enrichment.suggested_approaches.map((approach, i) => (
                                            <div key={i} className="bg-background border border-border rounded-xl p-4 shadow-sm relative overflow-hidden hover:border-primary/30 transition-colors">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-primary/60' : i === 1 ? 'bg-emerald-500/60' : 'bg-amber-500/60'}`}></div>
                                                <h5 className="font-semibold text-sm text-foreground mb-1 pl-3">{approach.title}</h5>
                                                <p className="text-[13px] text-muted-foreground leading-relaxed pl-3">{approach.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
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
                            )}

                            {/* What to Look For + Watch For */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-green-700 dark:text-green-500 mb-2">
                                        <FileCheck2 className="w-3.5 h-3.5" /> What to Look For
                                    </h4>
                                    <p className="text-[13px] text-green-900 dark:text-green-100 leading-relaxed">
                                        {selectedTask.enrichment?.what_to_look_for || selectedTask.template.success_condition}
                                    </p>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-4 shadow-sm">
                                    <h4 className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-orange-700 dark:text-orange-500 mb-2">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Watch For
                                    </h4>
                                    <p className="text-[13px] text-orange-900 dark:text-orange-100 leading-relaxed">{selectedTask.template.failure_condition || "Observe for guessing without reasoning."}</p>
                                </div>
                            </div>

                            {/* Reasoning Check */}
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-primary mb-2">
                                    <LightbulbIcon className="w-3.5 h-3.5" /> Reasoning Check
                                </h4>
                                <p className="text-[14px] text-foreground font-medium italic">"{selectedTask.template.reasoning_check}"</p>
                            </div>

                            {/* Practice Quiz Button */}
                            {selectedTask.enrichment?.quiz_questions && selectedTask.enrichment.quiz_questions.length > 0 && (
                                <div>
                                    {!showQuiz ? (
                                        <Button
                                            variant="outline"
                                            className="w-full gap-2 h-12 text-primary border-primary/30 hover:bg-primary/5"
                                            onClick={() => setShowQuiz(true)}
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                            Practice Questions ({selectedTask.enrichment.quiz_questions.length})
                                        </Button>
                                    ) : (
                                        <QuizWidget
                                            questions={selectedTask.enrichment.quiz_questions}
                                            capacityName={selectedTask.template.capacity_name}
                                            onClose={() => setShowQuiz(false)}
                                        />
                                    )}
                                </div>
                            )}

                            <Separator />

                            {/* Evidence Actions */}
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Record Evidence</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <Button
                                        className="gap-2 shadow-sm font-medium h-12"
                                        onClick={() => {
                                            const plan = plans.find(p => p.learner_id === activeLearner);
                                            setReportModalState({
                                                isOpen: true,
                                                templateId: selectedTask.template_id,
                                                learnerId: plan?.learner_id || '',
                                                learnerName: plan?.learner_name || '',
                                                capacityName: selectedTask.template!.capacity_name,
                                                successCondition: selectedTask.template!.success_condition,
                                                failureCondition: selectedTask.template!.failure_condition || '',
                                            });
                                        }}
                                    >
                                        <FileText className="w-4 h-4" /> Parent Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2 border-border bg-background hover:bg-secondary/50 font-medium h-12"
                                        onClick={() => {
                                            const plan = plans.find(p => p.learner_id === activeLearner);
                                            setAsyncModalState({
                                                isOpen: true,
                                                templateId: selectedTask.template_id,
                                                learnerName: plan?.learner_name || '',
                                                capacityName: selectedTask.template!.capacity_name,
                                            });
                                        }}
                                    >
                                        <Camera className="w-4 h-4" /> Photo + Audio
                                    </Button>
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
                                <Calendar className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-medium text-foreground mb-2">Select a task</h3>
                            <p className="text-[14px] max-w-sm">
                                Choose a task from this week's plan to see the full teaching brief, suggested approaches, and practice questions.
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
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['weekly-plan', familyId] })}
            />

            <AccessControlModal
                isOpen={accessControlState.isOpen}
                onClose={() => setAccessControlState(prev => ({ ...prev, isOpen: false }))}
                learnerId={accessControlState.learnerId}
                learnerName={accessControlState.learnerName}
            />
        </div>
    );
}

/** Compact task row for the weekly list */
function WeeklyTaskRow({ task, isSelected, onClick }: { task: WeeklyTask; isSelected?: boolean; onClick?: () => void }) {
    if (!task.template) return null;
    const subject = getSubjectGroup(task.strand_name);

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${
                isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:bg-secondary/30 hover:border-border'
            } ${task.status === 'completed' ? 'opacity-60' : ''}`}
        >
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm">{SUBJECT_ICONS[task.strand_name] || '📋'}</span>
                    <span className="font-medium text-[13px] text-foreground">{task.template.capacity_name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {task.carryover_count > 0 && (
                        <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">
                            {task.carryover_count > 1 ? `${task.carryover_count}x carried` : 'carried'}
                        </Badge>
                    )}
                    {task.status === 'completed' && (
                        <Badge variant="default" className="text-[9px] px-1 py-0 h-4 bg-green-600">Done</Badge>
                    )}
                </div>
            </div>
            <p className="text-[12px] text-muted-foreground line-clamp-1 ml-6">
                {task.enrichment?.concept_context?.slice(0, 80) || task.template.task_type}
                {(task.enrichment?.concept_context?.length || 0) > 80 ? '...' : ''}
            </p>
        </div>
    );
}
