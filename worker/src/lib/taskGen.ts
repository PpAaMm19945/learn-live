/**
 * Task Generation Engine — Task 10.3, 10.6, 10.7
 * Reads a constraint template, randomizes parameters, and produces
 * a task instance. Handles noise injection (Endurance) and
 * cross-strand milestone tasks.
 */

// Ugandan context items for parameter randomization
const CONTEXT_OBJECTS = [
    'mangoes', 'bananas', 'avocados', 'chapatis', 'beans', 'groundnuts',
    'stones', 'sticks', 'leaves', 'bottle caps', 'coins', 'pencils',
    'cups', 'plates', 'eggs', 'tomatoes', 'onions', 'fish',
    'goats', 'chickens', 'cows', 'pigs',
];

const CONTEXT_NAMES = [
    'Azie', 'Arie', 'Nalongo', 'Wasswa', 'Kato', 'Babirye',
    'Nakato', 'Ssali', 'Nambi', 'Mukasa', 'Kiiza', 'Amara',
];

const CONTEXT_PLACES = [
    'the market', 'the garden', 'the kitchen', 'school', 'the river',
    'the compound', 'grandmother\'s house', 'the church', 'the field',
];

// Noise elements for Endurance tasks (Task 10.6)
const NOISE_DISTRACTORS = [
    'Some of them are rotten and should not be counted.',
    'A neighbor brings 2 extra items, but they are the wrong type.',
    'The child\'s younger sibling keeps grabbing items from the pile.',
    'It starts raining and some items get wet. Does that change the count?',
    'There are also 5 completely different items nearby — ignore them.',
    'The parent asks: "What if we had twice as many?"',
    'One group has an extra item that doesn\'t belong.',
    'Count again — but this time some items are hidden under a cloth.',
];

export interface GeneratedTask {
    templateId: string;
    capacityId: string;
    capacityName: string;
    taskType: string;
    parentPrompt: string;
    successCondition: string;
    failureCondition: string;
    reasoningCheck: string;
    materials: string;
    arcStage: string;
    cognitiveLevel: number;
    isNoiseInjected: boolean;
    isMilestone: boolean;
    noiseElement?: string;
}

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a contextualized task from a constraint template.
 */
export function generateTask(
    template: any,
    capacityName: string,
    arcStage: string,
    cognitiveLevel: number
): GeneratedTask {
    // Parse context variants if available
    let variants: string[] = [];
    try {
        variants = template.context_variants ? JSON.parse(template.context_variants) : [];
    } catch { variants = []; }

    // Randomize parameters in the prompt
    const object = randomFrom(CONTEXT_OBJECTS);
    const name = randomFrom(CONTEXT_NAMES);
    const place = randomFrom(CONTEXT_PLACES);
    const count = randomInt(3, 15);
    const count2 = randomInt(2, count);

    let parentPrompt = template.parent_prompt || '';
    let successCondition = template.success_condition || '';
    let failureCondition = template.failure_condition || '';
    let reasoningCheck = template.reasoning_check || '';
    let materials = template.materials || '';

    // Simple token replacement for contextual variation
    const replace = (text: string) => text
        .replace(/\{object\}/gi, object)
        .replace(/\{name\}/gi, name)
        .replace(/\{place\}/gi, place)
        .replace(/\{count\}/gi, String(count))
        .replace(/\{count2\}/gi, String(count2));

    parentPrompt = replace(parentPrompt);
    successCondition = replace(successCondition);
    failureCondition = replace(failureCondition);
    reasoningCheck = replace(reasoningCheck);
    materials = replace(materials);

    // Apply context variant if available
    if (variants.length > 0) {
        const variant = randomFrom(variants);
        parentPrompt = parentPrompt + ` (Context: ${variant})`;
    }

    const isEndurance = arcStage === 'Endurance';
    const isMilestone = arcStage === 'Milestone';
    let noiseElement: string | undefined;

    // Task 10.6: Noise injection for Endurance
    if (isEndurance) {
        noiseElement = randomFrom(NOISE_DISTRACTORS);
        parentPrompt += `\n\n⚡ ENDURANCE CHALLENGE: ${noiseElement}`;
    }

    // Task 10.7: Milestone tasks — don't label the capacity
    if (isMilestone) {
        parentPrompt = `This is a combined challenge. ${parentPrompt}`;
        // Remove capacity name references for unlabeled assessment
    }

    return {
        templateId: template.id,
        capacityId: template.capacity_id,
        capacityName: isMilestone ? 'Combined Challenge' : capacityName,
        taskType: template.task_type,
        parentPrompt,
        successCondition,
        failureCondition,
        reasoningCheck,
        materials,
        arcStage,
        cognitiveLevel,
        isNoiseInjected: isEndurance,
        isMilestone,
        noiseElement,
    };
}

/**
 * Generate a system instruction for the AI agent based on the task.
 */
export function generateSystemInstruction(task: GeneratedTask, learnerName: string, age: number): string {
    const base = `You are evaluating ${learnerName} (age ${age}) on: ${task.taskType}.

CONSTRAINT TO ENFORCE:
${task.parentPrompt}

SUCCESS CONDITION: ${task.successCondition}
FAILURE CONDITION: ${task.failureCondition}
REASONING CHECK: Ask the child — "${task.reasoningCheck}"

RULES:
- You are an Evidence Witness, not a teacher
- Observe silently. Do not coach or hint
- Log whether the child meets the success condition
- Note any evidence of the failure condition`;

    if (task.isNoiseInjected) {
        return base + `\n\nENDURANCE MODE: The task includes a distractor: "${task.noiseElement}". The child must complete the core task correctly DESPITE the noise. If they get confused by the noise, that counts as not yet ready.`;
    }

    if (task.isMilestone) {
        return base + `\n\nMILESTONE MODE: Do NOT tell the child which capacity is being tested. This is a cross-strand assessment. Evaluate holistically.`;
    }

    return base;
}
