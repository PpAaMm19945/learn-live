/**
 * Repetition Arc Engine — Task 10.5
 * Manages the progression through: Exposure → Execution → Endurance → Milestone
 * 
 * Arc Stages:
 *   Exposure (1x)     — First encounter with the concept
 *   Execution (Nx)    — Repeated practice (count depends on capacity)
 *   Endurance          — Noise-injected tasks testing resilience
 *   Milestone          — Cross-strand unlabeled assessment
 */

import { unlockDependents } from './dag';

// How many Execution repetitions are required before advancing to Endurance
// Can be per-capacity, but default is 3 for Band 2
const DEFAULT_EXECUTION_THRESHOLD = 3;

export interface ArcAdvanceResult {
    advanced: boolean;
    newStage: string;
    newCogLevel: number;
    capacityCompleted: boolean;
    unlockedCapacities: string[];
    message: string;
}

/**
 * Advance a learner through the repetition arc for a specific capacity.
 * Called after a parent approves evidence.
 */
export async function advanceArc(
    db: D1Database,
    learnerId: string,
    capacityId: string
): Promise<ArcAdvanceResult> {
    const state: any = await db.prepare(`
        SELECT * FROM Learner_Repetition_State
        WHERE learner_id = ? AND capacity_id = ?
    `).bind(learnerId, capacityId).first();

    if (!state) {
        return {
            advanced: false, newStage: 'unknown', newCogLevel: 0,
            capacityCompleted: false, unlockedCapacities: [], message: 'No state found'
        };
    }

    let { current_arc_stage, execution_count, current_cognitive_level } = state;
    let newStage = current_arc_stage;
    let newCogLevel = current_cognitive_level;
    let capacityCompleted = false;
    let unlockedCapacities: string[] = [];

    // Get execution threshold (could be capacity-specific in future)
    const threshold = DEFAULT_EXECUTION_THRESHOLD;

    switch (current_arc_stage) {
        case 'Exposure':
            // Exposure is always 1x → move to Execution
            newStage = 'Execution';
            break;

        case 'Execution':
            execution_count += 1;
            if (execution_count >= threshold) {
                newStage = 'Endurance';
                execution_count = 0; // Reset for Endurance phase
            }
            break;

        case 'Endurance':
            // Endurance passes → advance to Milestone
            newStage = 'Milestone';
            break;

        case 'Milestone':
            // Milestone passed → capacity is COMPLETE at this cognitive level
            if (current_cognitive_level < 4) {
                // Advance to next cognitive level, restart arc
                newCogLevel = current_cognitive_level + 1;
                newStage = 'Exposure';
                execution_count = 0;
            } else {
                // All 4 cognitive levels complete → capacity mastered
                capacityCompleted = true;
                newStage = 'Milestone'; // stays
            }
            break;
    }

    // Update the state
    if (capacityCompleted) {
        await db.prepare(`
            UPDATE Learner_Repetition_State 
            SET status = 'completed', current_arc_stage = ?, execution_count = ?,
                current_cognitive_level = ?, last_updated = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(newStage, execution_count, newCogLevel, state.id).run();

        // Unlock dependents via DAG
        unlockedCapacities = await unlockDependents(db, learnerId, capacityId);
        console.log(`[ARC] Capacity ${capacityId} COMPLETED for ${learnerId}. Unlocked: ${unlockedCapacities.join(', ') || 'none'}`);
    } else {
        await db.prepare(`
            UPDATE Learner_Repetition_State 
            SET current_arc_stage = ?, execution_count = ?, current_cognitive_level = ?,
                status = 'active', last_updated = CURRENT_TIMESTAMP
            WHERE id = ?
        `).bind(newStage, execution_count, newCogLevel, state.id).run();
        console.log(`[ARC] ${learnerId} → ${capacityId}: ${current_arc_stage} → ${newStage} (CL${newCogLevel}, exec=${execution_count})`);
    }

    return {
        advanced: true,
        newStage,
        newCogLevel,
        capacityCompleted,
        unlockedCapacities,
        message: capacityCompleted
            ? `${capacityId} mastered! ${unlockedCapacities.length} new capacities unlocked.`
            : `Advanced to ${newStage} (Cognitive Level ${newCogLevel})`,
    };
}
