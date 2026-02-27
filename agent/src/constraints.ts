import { validateConstraint } from './validate';

export async function fetchAndAssembleInstruction(taskId: string): Promise<string> {
    const workerUrl = process.env.WORKER_API_URL || 'http://127.0.0.1:8787';
    const response = await fetch(`${workerUrl}/api/task/${taskId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch task ${taskId} from Worker: ${response.statusText}`);
    }

    const task = await response.json();

    const constraint = {
        constraint_to_enforce: task.constraint_to_enforce,
        failure_condition: task.failure_condition,
        success_condition: task.success_condition,
        role_instruction: task.role_instruction,
    };

    if (!validateConstraint(constraint)) {
        throw new Error('INVALID_CONSTRAINT');
    }

    const { role_instruction, constraint_to_enforce, failure_condition, success_condition } = constraint;

    let systemInstruction = `Role: ${role_instruction.role}\n`;
    systemInstruction += `Instruction: ${role_instruction.instruction}\n`;
    systemInstruction += `Greeting: ${role_instruction.greeting}\n\n`;

    systemInstruction += "Constraints to Enforce:\n" + constraint_to_enforce.map((c: string) => `- ${c}`).join('\n') + "\n\n";
    systemInstruction += "Failure Conditions:\n" + failure_condition.map((c: string) => `- ${c}`).join('\n') + "\n\n";
    systemInstruction += "Success Conditions:\n" + success_condition.map((c: string) => `- ${c}`).join('\n') + "\n";

    // Log assembled instruction (truncated)
    console.log(`[AGENT] System instruction assembled for task: ${taskId} (${systemInstruction.substring(0, 100).replace(/\n/g, ' ')}...)`);

    return systemInstruction;
}
