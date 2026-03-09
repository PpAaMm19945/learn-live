/**
 * DAG Dependency Resolver — Task 10.4
 * Checks if a learner can access a capacity by verifying all prerequisite capacities are completed.
 * Supports cross-strand dependencies and suggests lateral movement when blocked.
 */

export interface DependencyResult {
    canAccess: boolean;
    blockedBy: string[];        // capacity IDs that are not yet completed
    suggestedAlternatives: string[]; // other strand capacities the learner CAN do
}

/**
 * Check if a learner can access a target capacity based on DAG prerequisites.
 */
export async function resolveDependencies(
    db: D1Database,
    learnerId: string,
    targetCapacityId: string
): Promise<DependencyResult> {
    // 1. Get all hard-gate prerequisites for the target capacity
    const { results: deps } = await db.prepare(`
        SELECT source_capacity_id FROM Capacity_Dependencies
        WHERE target_capacity_id = ? AND is_hard_gate = 1
    `).bind(targetCapacityId).all();

    if (deps.length === 0) {
        return { canAccess: true, blockedBy: [], suggestedAlternatives: [] };
    }

    // 2. Check which prerequisites the learner has completed
    const prereqIds = deps.map((d: any) => d.source_capacity_id);
    const placeholders = prereqIds.map(() => '?').join(',');

    const { results: completedStates } = await db.prepare(`
        SELECT capacity_id FROM Learner_Repetition_State
        WHERE learner_id = ? AND capacity_id IN (${placeholders}) AND status = 'completed'
    `).bind(learnerId, ...prereqIds).all();

    const completedSet = new Set(completedStates.map((r: any) => r.capacity_id));
    const blockedBy = prereqIds.filter(id => !completedSet.has(id));

    if (blockedBy.length === 0) {
        return { canAccess: true, blockedBy: [], suggestedAlternatives: [] };
    }

    // 3. Suggest lateral movement — find active capacities in other strands
    const { results: alternatives } = await db.prepare(`
        SELECT c.id, c.name, s.name as strand_name
        FROM Learner_Repetition_State lrs
        JOIN Capacities c ON lrs.capacity_id = c.id
        JOIN Strands s ON c.strand_id = s.id
        WHERE lrs.learner_id = ? AND lrs.status = 'active'
        AND c.strand_id != (SELECT strand_id FROM Capacities WHERE id = ?)
        LIMIT 5
    `).bind(learnerId, targetCapacityId).all();

    return {
        canAccess: false,
        blockedBy,
        suggestedAlternatives: alternatives.map((a: any) => a.id),
    };
}

/**
 * Unlock eligible capacities after a learner completes one.
 * Checks all capacities that depend on the completed one.
 */
export async function unlockDependents(
    db: D1Database,
    learnerId: string,
    completedCapacityId: string
): Promise<string[]> {
    // Find all capacities that have the completed one as a prerequisite
    const { results: dependents } = await db.prepare(`
        SELECT target_capacity_id FROM Capacity_Dependencies
        WHERE source_capacity_id = ?
    `).bind(completedCapacityId).all();

    const unlocked: string[] = [];

    for (const dep of dependents) {
        const targetId = (dep as any).target_capacity_id;

        // Check if ALL prerequisites for this target are now completed
        const result = await resolveDependencies(db, learnerId, targetId);
        if (!result.canAccess) continue;

        // Check if learner doesn't already have a state for this capacity
        const existing = await db.prepare(`
            SELECT id, status FROM Learner_Repetition_State
            WHERE learner_id = ? AND capacity_id = ?
        `).bind(learnerId, targetId).first();

        if (existing) {
            if ((existing as any).status === 'locked') {
                await db.prepare(`
                    UPDATE Learner_Repetition_State SET status = 'active', last_updated = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind((existing as any).id).run();
                unlocked.push(targetId);
                console.log(`[DAG] Unlocked ${targetId} for learner ${learnerId}`);
            }
        } else {
            // Create a new state entry
            const stateId = `state_${learnerId.replace('learner_', '')}_${targetId.toLowerCase()}`;
            await db.prepare(`
                INSERT INTO Learner_Repetition_State (id, learner_id, capacity_id, current_cognitive_level, current_arc_stage, execution_count, status)
                VALUES (?, ?, ?, 1, 'Exposure', 0, 'active')
            `).bind(stateId, learnerId, targetId).run();
            unlocked.push(targetId);
            console.log(`[DAG] Created & unlocked ${targetId} for learner ${learnerId}`);
        }
    }

    return unlocked;
}
