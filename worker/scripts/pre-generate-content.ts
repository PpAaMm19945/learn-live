import { execSync } from 'child_process';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

// Read path to root
import path from 'path';

// Setup basic imports
// In a standalone script like this, we'll implement a simple version of adaptContent
// or use the imported one. The issue with importing adaptContent is that it expects Env
// with DB binding. Since we are outside the worker, we can't easily provide a real DB binding
// for the `buildRAGContext` function. However, the plan states we just need to call the adaptation pipeline.
// Looking at adaptContent, it expects Env.GEMINI_API_KEY.
import { adaptContent } from '../src/lib/content/adapt.js';
import { getBandPrompt } from '../src/lib/content/adapt.js';

// Ensure we can load env vars whether run from root or worker dir
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.production') });
dotenv.config({ path: path.join(process.cwd(), '../.env') });
dotenv.config({ path: path.join(process.cwd(), '../.env.production') });
dotenv.config();

const DB_NAME = "learnlive-db-prod";

import fs from 'fs';
import os from 'os';
import path from 'path';

// Define a simple executeSql using wrangler
async function executeSql(query: string, raw: boolean = false): Promise<unknown> {
    const tmpFile = path.join(os.tmpdir(), `query_${Date.now()}.sql`);
    try {
        fs.writeFileSync(tmpFile, query);

        // use --json flag to parse output more easily when we need rows
        let command = `npx wrangler d1 execute ${DB_NAME} --file="${tmpFile}" --remote`;
        if (raw) {
            command += ' --json';
        }

        // Ensure we specify the project root or run it correctly
        const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });

        if (raw) {
            // Find the array part of wrangler output (sometimes wrangler adds logs before)
            const match = result.match(/\[.*\]/s);
            if (match) {
                try {
                    const parsed = JSON.parse(match[0]) as { results?: unknown[] }[];
                    return parsed[0]?.results || [];
                } catch (e) {
                     console.error("Failed to parse JSON from wrangler output:", match[0]);
                     return [];
                }
            }
            return [];
        }
        return result;
    } catch (error: unknown) {
        console.error(`Error executing query: ${query}`);
        if (error instanceof Error) {
            const execError = error as { stdout?: string, stderr?: string };
            if (execError.stdout) console.error(execError.stdout);
            if (execError.stderr) console.error(execError.stderr);
        }
        throw error;
    } finally {
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
    }
}

async function main() {
    // If running from root, process.env.GEMINI_API_KEY might be loaded
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing. Please set it in your environment.");
        process.exit(1);
    }

    // Mock env for adaptContent
    const mockEnv = {
        GEMINI_API_KEY: apiKey
    } as unknown as import('../src/index.js').Env;

    console.log("Fetching all lessons from D1...");

    let lessons: Array<{ id: string, title: string, narrative_text: string }> = [];
    try {
         // Query all lessons
         lessons = (await executeSql("SELECT id, title, narrative_text FROM Lessons", true)) as Array<{ id: string, title: string, narrative_text: string }>;
    } catch (e) {
         console.error("Failed to fetch lessons. Ensure you are authenticated with Cloudflare and the DB exists.");
         process.exit(1);
    }

    if (!lessons || lessons.length === 0) {
        console.log("No lessons found.");
        return;
    }

    console.log(`Found ${lessons.length} lessons to process.`);

    let lessonCount = 0;
    const totalLessons = lessons.length;

    for (const lesson of lessons) {
        lessonCount++;
        const { id: lessonId, title, narrative_text } = lesson;

        // Skip if narrative text is missing
        if (!narrative_text) {
             console.log(`\nSkipping Lesson [${lessonCount}/${totalLessons}]: ${title} (${lessonId}) - No narrative text`);
             continue;
        }

        console.log(`\nProcessing Lesson [${lessonCount}/${totalLessons}]: ${title} (${lessonId})`);

        // Get existing adaptations for this lesson to skip already generated ones
        let existingBands: number[] = [];
        try {
            const existingBandsData = (await executeSql(`SELECT band FROM Adapted_Content WHERE lesson_id = '${lessonId}'`, true)) as Array<{ band: number }>;
            existingBands = existingBandsData.map((r) => r.band);
        } catch (e) {
             console.log("Failed to fetch existing bands, assuming none exist.");
        }

        // 3. For each band [0, 1, 2, 3, 4]
        for (const band of [0, 1, 2, 3, 4]) {
            if (existingBands.includes(band)) {
                console.log(`  Skipping Band ${band} - Already generated.`);
                continue;
            }

            console.log(`  Generating Band ${band}...`);
            try {
                // b. Call adaptation pipeline
                // In pre-gen, we use a simple context since buildRAGContext needs D1 bindings
                const chapterContext = `Context: Lesson title is ${title}`;

                const result = await adaptContent(mockEnv, narrative_text, band, chapterContext);

                // c. Insert into Adapted_Content
                const uuid = `adapted_${crypto.randomUUID()}`;

                // Helper to format string or JSON safely for SQL
                const formatSqlString = (str: string | undefined | null) => {
                    if (!str) return 'NULL';
                    return `'${str.replace(/'/g, "''")}'`;
                };

                const formatSqlJson = (obj: unknown) => {
                    if (!obj) return 'NULL';
                    return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
                };

                const escapedText = result.text.replace(/'/g, "''");
                const vocabJson = formatSqlJson(result.vocabulary);
                const qsJson = formatSqlJson(result.discussionQuestions);
                const promptsJson = formatSqlJson(result.thinkingPrompts);
                const essayPromptStr = formatSqlString(result.essayPrompt);

                const insertQuery = `
                    INSERT INTO Adapted_Content (id, lesson_id, band, adapted_text, vocabulary, discussion_questions, essay_prompt, thinking_prompts)
                    VALUES ('${uuid}', '${lessonId}', ${band}, '${escapedText}', ${vocabJson}, ${qsJson}, ${essayPromptStr}, ${promptsJson});
                `;

                await executeSql(insertQuery);
                console.log(`  Successfully generated and saved band ${band}`);

                // Add a small delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error: unknown) {
                console.error(`  Failed to generate band ${band}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }

        // 4. Band 5 is always the master text
        if (!existingBands.includes(5)) {
            console.log(`  Generating Band 5 (Master Text)...`);
            try {
                const uuid = `adapted_${crypto.randomUUID()}`;
                const escapedText = narrative_text.replace(/'/g, "''");
                const insertBand5Query = `
                    INSERT INTO Adapted_Content (id, lesson_id, band, adapted_text)
                    VALUES ('${uuid}', '${lessonId}', 5, '${escapedText}');
                `;
                await executeSql(insertBand5Query);
                console.log(`  Successfully saved band 5 (Master Text)`);
            } catch (error: unknown) {
                 console.error(`  Failed to save band 5: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    console.log("\nPre-generation complete!");
}

main().catch(console.error);
