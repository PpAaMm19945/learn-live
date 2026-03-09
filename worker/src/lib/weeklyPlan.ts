/**
 * Weekly Plan Engine
 * Generates and manages weekly task plans per learner.
 * Handles carryover of incomplete tasks and subject balancing.
 */

// Target tasks per subject per week
const WEEKLY_ALLOCATION: Record<string, number> = {
    'Number & Quantity': 3,
    'Geometry & Measurement': 2,
    'Data & Probability': 1,
    'Algebraic Thinking': 1,
    'Computation & Fluency': 2,
    // English strands
    'Composition': 2,
    'Grammar': 1,
    'Vocabulary': 1,
    'Reading Comprehension': 1,
    'Oral Expression': 1,
    // Science strands
    'Living Things': 1,
    'Matter & Energy': 1,
    'Earth & Environment': 1,
};

const DEFAULT_PER_STRAND = 1;

/** Get Monday of the current week */
export function getCurrentWeekStart(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
}

/** Get Monday of previous week */
function getPreviousWeekStart(weekStart: string): string {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
}

export interface WeeklyPlanTask {
    id: string;
    template_id: string;
    capacity_id: string;
    strand_name: string;
    day_of_week: number | null;
    status: string;
    carryover_count: number;
}

export interface WeeklyPlanResult {
    plan_id: string;
    week_start: string;
    learner_id: string;
    learner_name: string;
    tasks: WeeklyPlanTask[];
    is_new: boolean;
}

/**
 * Get or generate the weekly plan for a learner.
 */
export async function getOrCreateWeeklyPlan(
    db: D1Database,
    learnerId: string,
    familyId: string,
    weekStart?: string,
): Promise<WeeklyPlanResult> {
    const targetWeek = weekStart || getCurrentWeekStart();

    // Check if plan already exists
    const existing: any = await db.prepare(
        'SELECT id FROM Weekly_Plans WHERE learner_id = ? AND week_start = ?'
    ).bind(learnerId, targetWeek).first();

    const learner: any = await db.prepare('SELECT name FROM Learners WHERE id = ?').bind(learnerId).first();

    if (existing) {
        // Fetch existing plan tasks
        const { results: tasks } = await db.prepare(
            'SELECT * FROM Weekly_Plan_Tasks WHERE plan_id = ? ORDER BY day_of_week, strand_name'
        ).bind(existing.id).all();

        return {
            plan_id: existing.id,
            week_start: targetWeek,
            learner_id: learnerId,
            learner_name: learner?.name || learnerId,
            tasks: tasks as any[],
            is_new: false,
        };
    }

    // Generate new plan
    const planId = `plan_${learnerId.replace('learner_', '')}_${targetWeek.replace(/-/g, '')}`;

    // 1. Get carryover tasks from previous week
    const prevWeek = getPreviousWeekStart(targetWeek);
    const prevPlan: any = await db.prepare(
        'SELECT id FROM Weekly_Plans WHERE learner_id = ? AND week_start = ?'
    ).bind(learnerId, prevWeek).first();

    const carryoverTasks: any[] = [];
    if (prevPlan) {
        const { results: incomplete } = await db.prepare(
            `SELECT template_id, capacity_id, strand_name, carryover_count 
             FROM Weekly_Plan_Tasks WHERE plan_id = ? AND status = 'pending'`
        ).bind(prevPlan.id).all();
        carryoverTasks.push(...incomplete);
    }

    // 2. Get all active capacities for this learner
    const { results: activeStates } = await db.prepare(`
        SELECT 
            lrs.capacity_id,
            lrs.current_cognitive_level,
            lrs.current_arc_stage,
            s.name as strand_name,
            c.name as capacity_name
        FROM Learner_Repetition_State lrs
        JOIN Capacities c ON lrs.capacity_id = c.id
        JOIN Strands s ON c.strand_id = s.id
        WHERE lrs.learner_id = ? AND lrs.status = 'active'
    `).bind(learnerId).all();

    // 3. For each active capacity, get a random template
    const candidateTasks: { template_id: string; capacity_id: string; strand_name: string; carryover_count: number }[] = [];

    // Add carryover first (they get priority)
    for (const co of carryoverTasks) {
        candidateTasks.push({
            template_id: co.template_id as string,
            capacity_id: co.capacity_id as string,
            strand_name: co.strand_name as string,
            carryover_count: ((co.carryover_count as number) || 0) + 1,
        });
    }

    // Already selected template IDs (to avoid duplicates)
    const selectedTemplates = new Set(candidateTasks.map(t => t.template_id));

    // Add fresh tasks per strand up to allocation
    const strandCounts: Record<string, number> = {};
    for (const t of candidateTasks) {
        strandCounts[t.strand_name] = (strandCounts[t.strand_name] || 0) + 1;
    }

    for (const state of activeStates as any[]) {
        const strand = state.strand_name;
        const allocation = WEEKLY_ALLOCATION[strand] || DEFAULT_PER_STRAND;
        const current = strandCounts[strand] || 0;

        if (current >= allocation) continue;

        // Get a random template for this capacity at current level
        const template: any = await db.prepare(`
            SELECT id FROM Constraint_Templates
            WHERE capacity_id = ? AND cognitive_level = (
                SELECT current_cognitive_level FROM Learner_Repetition_State 
                WHERE learner_id = ? AND capacity_id = ?
            )
            ORDER BY RANDOM() LIMIT 1
        `).bind(state.capacity_id, learnerId, state.capacity_id).first();

        if (template && !selectedTemplates.has(template.id)) {
            candidateTasks.push({
                template_id: template.id,
                capacity_id: state.capacity_id,
                strand_name: strand,
                carryover_count: 0,
            });
            selectedTemplates.add(template.id);
            strandCounts[strand] = (strandCounts[strand] || 0) + 1;
        }
    }

    // 4. Assign days (spread across Mon-Fri)
    const totalTasks = candidateTasks.length;
    const tasksPerDay = Math.max(1, Math.ceil(totalTasks / 5));

    // Create the plan
    await db.prepare(
        'INSERT INTO Weekly_Plans (id, learner_id, family_id, week_start) VALUES (?, ?, ?, ?)'
    ).bind(planId, learnerId, familyId, targetWeek).run();

    const planTasks: WeeklyPlanTask[] = [];
    for (let i = 0; i < candidateTasks.length; i++) {
        const task = candidateTasks[i];
        const dayOfWeek = Math.min(4, Math.floor(i / tasksPerDay)); // 0-4 (Mon-Fri)
        const taskId = `wpt_${planId}_${i}`;

        await db.prepare(
            `INSERT INTO Weekly_Plan_Tasks (id, plan_id, template_id, capacity_id, strand_name, day_of_week, status, carryover_count)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
        ).bind(taskId, planId, task.template_id, task.capacity_id, task.strand_name, dayOfWeek, task.carryover_count).run();

        planTasks.push({
            id: taskId,
            template_id: task.template_id,
            capacity_id: task.capacity_id,
            strand_name: task.strand_name,
            day_of_week: dayOfWeek,
            status: 'pending',
            carryover_count: task.carryover_count,
        });
    }

    return {
        plan_id: planId,
        week_start: targetWeek,
        learner_id: learnerId,
        learner_name: learner?.name || learnerId,
        tasks: planTasks,
        is_new: true,
    };
}

/**
 * Mark a weekly plan task as completed.
 */
export async function completeWeeklyTask(
    db: D1Database,
    weeklyTaskId: string,
): Promise<void> {
    await db.prepare(
        `UPDATE Weekly_Plan_Tasks SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(weeklyTaskId).run();
}
