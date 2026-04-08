import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const systemPrompt = `You are a history teacher for ages 10-12 (Band 3). You are narrating a lesson
about "In the Beginning: God, Man, and the Meaning of History" from an African
History textbook written from a Reformed Christian perspective.

YOUR TASK: Narrate ALL of the following content as one continuous lesson. Do NOT stop
after one paragraph. Do NOT ask questions and wait for a response. Cover every
paragraph from start to finish in one continuous narration.

NARRATION STYLE:
- Speak as if you are delivering a lecture to a class of 10-12 year olds
- Engage with the content, add color and context, but cover ALL the material
- Use the available tools naturally when content calls for visual illustration
- Your narration should be at least 800 words covering all four paragraphs

Available tools: set_scene, zoom_to, highlight_region, show_scripture, show_timeline.
Use them naturally when the content calls for geographic or visual illustration.
Call set_scene("map") before any map tools. Call set_scene("transcript") to return focus to your narration.`;

const contentText = `Section 1.1: In the Beginning: God, Man, and the Meaning of History

History's True Beginning — In the beginning, God created the heavens and the
earth (Genesis 1:1). This is not merely a theological statement — it is the
opening line of history itself. Before there were empires, before there were
migrations, before the first city rose beside the first river, God spoke the
universe into being. Every chapter of human history that follows is a chapter
in His story.

The Fracture of Creation — But the story of creation is also the story of
fracture. In Genesis 3, humanity chose autonomy over obedience, and the
consequences rippled through every dimension of existence. Death entered.
Relationships fractured. The ground itself was cursed. This is not ancient
mythology — it is the diagnosis that explains everything that follows in
human history.

God's Unfolding Plan — Yet even in judgment, God revealed mercy. The
protoevangelium of Genesis 3:15 — "He shall bruise your head, and you shall
bruise his heel" — is the first announcement of redemption. From this point
forward, all of history moves toward the fulfillment of this promise.

Judgment and Mercy at Babel — The account of Babel (Genesis 11) is the pivot
point for African history. When God scattered the nations and confused their
languages, He was not merely punishing pride. He was setting the stage for the
peopling of the entire earth — including Africa. The sons of Ham — Mizraim,
Cush, Phut, and Canaan — went forth to establish the civilizations we will
study in this course.`;

// Simplified tool declarations with proper typing for the SDK
const tools = [{
    functionDeclarations: [
        {
            name: 'set_scene',
            description: 'Switch the canvas between visual modes.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    mode: { type: Type.STRING, description: 'transcript, map, image, or overlay' }
                },
                required: ['mode'],
            },
        },
        {
            name: 'zoom_to',
            description: 'Fly the map camera to a named location.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    location: { type: Type.STRING, description: 'Named location e.g. "babel", "egypt"' }
                },
                required: ['location'],
            },
        },
        {
            name: 'highlight_region',
            description: 'Fill an ancient kingdom boundary with color.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    regionId: { type: Type.STRING, description: 'Region ID e.g. "mizraim", "cush"' },
                    color: { type: Type.STRING, description: 'Fill color e.g. "#fac775"' }
                },
                required: ['regionId', 'color'],
            },
        },
        {
            name: 'show_scripture',
            description: 'Display a scripture reference card.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    reference: { type: Type.STRING, description: 'e.g. "Genesis 1:1"' },
                    text: { type: Type.STRING, description: 'The scripture text' },
                    connection: { type: Type.STRING, description: 'How this connects to the lesson' }
                },
                required: ['reference', 'text'],
            },
        },
        {
            name: 'show_timeline',
            description: 'Display a timeline bar with events.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    events: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                year: { type: Type.NUMBER },
                                label: { type: Type.STRING }
                            },
                            required: ['year', 'label'],
                        },
                    }
                },
                required: ['events'],
            },
        },
    ]
}];

async function main() {
    console.log("=== TEST A: Narration via generateContent Streaming ===\n");

    let totalText = '';
    let totalThinking = '';
    let toolCallCount = 0;
    const allToolCalls: any[] = [];

    // Build conversation history for multi-turn (tool call loop)
    const contents: any[] = [
        { role: "user", parts: [{ text: contentText }] }
    ];

    let turn = 0;
    const MAX_TURNS = 10; // Safety limit

    while (turn < MAX_TURNS) {
        turn++;
        console.log(`\n--- Turn ${turn} ---`);

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: systemPrompt,
                tools: tools,
                temperature: 0.7,
                thinkingConfig: { thinkingBudget: 1024 },
            },
            contents: contents,
        });

        let turnText = '';
        const turnToolCalls: any[] = [];

        for await (const chunk of responseStream) {
            // Stream thinking content (model's internal reasoning)
            if (chunk.candidates?.[0]?.content?.parts) {
                for (const part of chunk.candidates[0].content.parts) {
                    if (part.thought === true && part.text) {
                        process.stdout.write(`\x1b[90m[THINKING] ${part.text}\x1b[0m`);
                        totalThinking += part.text;
                    }
                }
            }
            if (chunk.text) {
                process.stdout.write(chunk.text);
                turnText += chunk.text;
            }
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                for (const call of chunk.functionCalls) {
                    console.log(`\n[TOOL] ${call.name}(${JSON.stringify(call.args)})`);
                    turnToolCalls.push(call);
                    toolCallCount++;
                    allToolCalls.push(call);
                }
            }
        }

        totalText += turnText;

        // If no tool calls this turn, the model is done narrating
        if (turnToolCalls.length === 0) {
            console.log("\n\n[DONE] Model finished narrating (no more tool calls).");
            break;
        }

        // Build the model's response for conversation history
        const modelParts: any[] = [];
        if (turnText) {
            modelParts.push({ text: turnText });
        }
        for (const call of turnToolCalls) {
            modelParts.push({
                functionCall: { name: call.name, args: call.args }
            });
        }
        contents.push({ role: "model", parts: modelParts });

        // Build tool responses (acknowledge all tool calls)
        const toolResponseParts = turnToolCalls.map(call => ({
            functionResponse: {
                name: call.name,
                response: { success: true, message: `${call.name} executed successfully` }
            }
        }));
        contents.push({ role: "user", parts: toolResponseParts });

        console.log(`[INFO] Sent ${turnToolCalls.length} tool response(s), continuing narration...`);
    }

    // Final summary
    console.log("\n\n========= SUMMARY =========");
    console.log(`Total narration text: ${totalText.length} characters`);
    console.log(`Total word count: ~${totalText.split(/\s+/).length} words`);
    console.log(`Total thinking text: ${totalThinking.length} characters`);
    console.log(`Number of turns: ${turn}`);
    console.log(`Number of tool calls: ${toolCallCount}`);
    console.log("\nTool calls:");
    allToolCalls.forEach((call, i) => {
        console.log(`  ${i + 1}. ${call.name}: ${JSON.stringify(call.args)}`);
    });

    // Check pass criteria
    console.log("\n========= PASS/FAIL CRITERIA =========");
    const hasEnoughText = totalText.length > 500;
    const hasToolCalls = toolCallCount >= 1;
    // Markdown emphasis (**bold**) is fine — it's normal formatting.
    // What we're checking for is the broken audio model pattern where
    // ALL output was wrapped in ** markers with no actual narration.
    const boldCount = (totalText.match(/\*\*/g) || []).length;
    const textToMarkdownRatio = totalText.length / Math.max(boldCount, 1);
    const hasCleanText = textToMarkdownRatio > 50; // Plenty of real text per bold marker
    const coversAllParagraphs = totalText.toLowerCase().includes('babel') || totalText.toLowerCase().includes('ham');

    console.log(`[${hasEnoughText ? '✅' : '❌'}] Text output > 500 chars (got ${totalText.length})`);
    console.log(`[${hasToolCalls ? '✅' : '❌'}] At least 1 tool call (got ${toolCallCount})`);
    console.log(`[${hasCleanText ? '✅' : '❌'}] Clean structured text (${boldCount} markdown emphasis markers, ratio: ${Math.round(textToMarkdownRatio)} chars/marker — fine if ratio > 50)`);
    console.log(`[${coversAllParagraphs ? '✅' : '❌'}] Content covers Babel/Ham paragraphs`);

    const allPass = hasEnoughText && hasToolCalls && hasCleanText && coversAllParagraphs;
    console.log(`\nOVERALL: ${allPass ? '✅ PASS' : '❌ FAIL (see above)'}`);
}

main().catch(console.error);
