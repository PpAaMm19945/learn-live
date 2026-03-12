import { Env } from '../../index';
import { buildRAGContext } from '../content/retrieve';

export function buildExaminerSystemPrompt(
    band: number,
    lessonTitle: string,
    learnerName: string,
    ragContext: string
): string {
    let toneAndStyle = '';

    if (band <= 1) {
        toneAndStyle = `
Tone: Conversational, warm, and encouraging. Use simple words.
Style: Simple recall. Ask basic questions like "Can you tell me about...?" or "What happened when...?".
Focus on the most basic facts and narrative elements.
Praise effort and be very supportive.
        `.trim();
    } else if (band <= 3) {
        toneAndStyle = `
Tone: Guided discussion, curious, and thoughtful.
Style: Ask "Why do you think...?" and simple compare/contrast questions.
Help the learner connect different events or ideas.
Encourage them to explain their reasoning gently.
        `.trim();
    } else {
        toneAndStyle = `
Tone: Socratic, academic, and challenging but fair.
Style: Ask thesis-level questions. E.g., "How does [concept A] compare to [concept B]?" or "What are the implications of...?"
Require the learner to defend their claims with evidence from the text.
Challenge assumptions and push for deeper analysis of sources.
        `.trim();
    }

    return `
You are the Oral Examiner for Learn Live's history curriculum.
You are having a one-on-one spoken conversation with a learner to assess their understanding of a specific lesson.

LEARNER DETAILS:
- Name: ${learnerName}
- Band Level: ${band}
- Lesson Topic: ${lessonTitle}

YOUR ROLE:
- You act as a witness to their understanding, not as an authority grading them.
- Ask questions based on the provided RAG context for the lesson.
- ${toneAndStyle}

RULES:
- Keep your responses and questions relatively short since this is spoken dialogue.
- Ask ONE question at a time. Do not overwhelm the learner.
- Listen to their answer, acknowledge it briefly, and then ask the next question or probe deeper.
- If they are struggling, provide a small hint or rephrase the question according to their band level.
- When you have gathered enough evidence of their understanding (usually after 3-5 exchanges), conclude the exam smoothly and call the \`submit_assessment\` tool.
- Do NOT read the RAG context directly to the child. Use it to inform your questions.

LESSON CONTEXT:
${ragContext}
    `.trim();
}

export async function initializeExaminerSession(
    env: Env,
    lessonId: string,
    band: number,
    userId: string
): Promise<{ systemInstruction: string; ragContext: string }> {
    // 1. Fetch lesson details
    const lesson = await env.DB.prepare(
        'SELECT title, narrative_text FROM Lessons WHERE id = ?'
    ).bind(lessonId).first<{ title: string; narrative_text: string }>();

    if (!lesson) {
        throw new Error(`Lesson not found: ${lessonId}`);
    }

    // 2. Fetch user details (for name)
    const user = await env.DB.prepare(
        'SELECT name FROM Users WHERE id = ?'
    ).bind(userId).first<{ name: string | null }>();

    const learnerName = user?.name || 'Learner';

    // 3. Build RAG context
    // We use the lesson title to seed the search for relevant chunks
    const ragQuery = lesson.title;
    const ragContext = await buildRAGContext(env, ragQuery);

    // 4. Build System Prompt
    const systemInstruction = buildExaminerSystemPrompt(
        band,
        lesson.title,
        learnerName,
        ragContext
    );

    return { systemInstruction, ragContext };
}
