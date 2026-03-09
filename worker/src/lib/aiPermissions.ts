/**
 * AI Permission Rules — Task 10.10
 * 
 * Gates AI tool access based on demonstrated competence.
 * A learner must demonstrate three capabilities before gaining AI tool access for a capacity:
 *   1. PREDICT — Can anticipate outcomes (demonstrated at Discern level)
 *   2. DIAGNOSE — Can identify errors (demonstrated at Discern level)
 *   3. SPECIFY — Can articulate constraints (demonstrated at Own level)
 *
 * Until all three are demonstrated, AI tools (calculator, explainer, etc.) are locked
 * for that capacity. This prevents "toying with AI" and ensures tools augment
 * rather than replace understanding.
 */

export interface AIPermissionState {
  canUseAI: boolean;
  predict: boolean;
  diagnose: boolean;
  specify: boolean;
  reason: string;
}

/**
 * Check if a learner has earned AI tool access for a specific capacity.
 * Looks at their cognitive level progression and arc completion history.
 */
export async function checkAIPermission(
  db: D1Database,
  learnerId: string,
  capacityId: string,
): Promise<AIPermissionState> {
  const state: any = await db.prepare(`
    SELECT current_cognitive_level, current_arc_stage, status, execution_count
    FROM Learner_Repetition_State
    WHERE learner_id = ? AND capacity_id = ?
  `).bind(learnerId, capacityId).first();

  if (!state) {
    return {
      canUseAI: false,
      predict: false,
      diagnose: false,
      specify: false,
      reason: 'No learning state found for this capacity.',
    };
  }

  const cogLevel = state.current_cognitive_level;
  const stage = state.current_arc_stage;

  // PREDICT: Demonstrated when learner has completed at least Execution at cognitive level 3 (Discern)
  const predict = cogLevel > 3 || (cogLevel === 3 && ['Endurance', 'Milestone'].includes(stage));

  // DIAGNOSE: Demonstrated when learner has reached Endurance at cognitive level 3
  const diagnose = cogLevel > 3 || (cogLevel === 3 && ['Endurance', 'Milestone'].includes(stage));

  // SPECIFY: Demonstrated when learner has started cognitive level 4 (Own)
  const specify = cogLevel >= 4;

  const canUseAI = predict && diagnose && specify;

  let reason = '';
  if (canUseAI) {
    reason = 'All three demonstrations met. AI tools available.';
  } else {
    const missing: string[] = [];
    if (!predict) missing.push('Predict (reach Discern/Endurance)');
    if (!diagnose) missing.push('Diagnose (complete Discern/Endurance)');
    if (!specify) missing.push('Specify (reach Own level)');
    reason = `Missing: ${missing.join(', ')}. Keep practicing without AI assistance.`;
  }

  return { canUseAI, predict, diagnose, specify, reason };
}

/**
 * Middleware-style check for API endpoints that involve AI tools.
 * Returns null if permitted, or an error response if blocked.
 */
export async function enforceAIPermission(
  db: D1Database,
  learnerId: string,
  capacityId: string,
): Promise<{ blocked: true; state: AIPermissionState } | { blocked: false }> {
  const permission = await checkAIPermission(db, learnerId, capacityId);
  if (!permission.canUseAI) {
    return { blocked: true, state: permission };
  }
  return { blocked: false };
}
