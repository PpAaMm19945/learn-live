import { execSync } from 'child_process';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { adaptContent } from '../src/lib/content/adapt.js';

// Ensure we can load env vars whether run from root or worker dir
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env.production') });
dotenv.config({ path: path.join(process.cwd(), '../.env') });
dotenv.config({ path: path.join(process.cwd(), '../.env.production') });
dotenv.config();

const DB_NAME = "learnlive-db-prod";
const IS_LOCAL = process.env.USE_LOCAL_DB === 'true';

// Define a simple executeSql using wrangler
async function executeSql(query: string, raw: boolean = false): Promise<unknown> {
    const tmpFile = path.join(os.tmpdir(), `query_${Date.now()}.sql`);
    try {
        fs.writeFileSync(tmpFile, query);

        // use --json flag to parse output more easily when we need rows
        let command = `npx wrangler d1 execute ${DB_NAME} --file="${tmpFile}" ${IS_LOCAL ? '--local' : '--remote'}`;
        if (raw) {
            command += ' --json';
        }

        // Ensure we specify the project root or run it correctly
        const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });

        if (raw) {
            // Find the array part of wrangler output (sometimes wrangler adds logs before)
            // Using a simpler regex that doesn't use 's' flag
            const match = result.match(/\[[\s\S]*\]/);
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

// Helper for exponential backoff retry on adaptation
async function adaptWithBackoff(mockEnv: any, narrative_text: string, band: number, chapterContext: string, maxRetries = 5) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await adaptContent(mockEnv, narrative_text, band, chapterContext);
        } catch (error: any) {
            attempt++;
            console.error(`  [Attempt ${attempt}/${maxRetries}] Failed to adapt band ${band}: ${error?.message || error}`);
            if (attempt >= maxRetries) {
                throw error;
            }
            // Exponential backoff: 2s, 4s, 8s, 16s...
            const delay = Math.pow(2, attempt) * 1000;
            console.log(`  Waiting ${delay}ms before retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Adaptation failed unexpectedly.');
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
    let newAdaptations = 0;
    let existingAdaptations = 0;
    let failedAdaptations = 0;

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
        // Also check if they exist in Adapted_Content_Cache
        let existingBands: number[] = [];
        try {
            const existingBandsData = (await executeSql(`SELECT band FROM Adapted_Content_Cache WHERE lesson_id = '${lessonId}'`, true)) as Array<{ band: number }>;
            existingBands = existingBandsData.map((r) => r.band);
        } catch (e) {
             console.log("Failed to fetch existing bands, assuming none exist.");
        }

        // 3. For each band [0, 1, 2, 3, 4]
        for (const band of [0, 1, 2, 3, 4]) {
            if (existingBands.includes(band)) {
                console.log(`  Skipping Band ${band} - Already generated.`);
                existingAdaptations++;
                continue;
            }

            console.log(`  Generating Band ${band}...`);
            try {
                // b. Call adaptation pipeline
                // In pre-gen, we use a simple context since buildRAGContext needs D1 bindings
                const chapterContext = `Context: Lesson title is ${title}`;

                // Call the actual adaptation logic with exponential backoff
                const result = await adaptWithBackoff(mockEnv, narrative_text, band, chapterContext);

                // Ensure it's in JSON string since Adapted_Content_Cache stores `content` string
                const contentStr = JSON.stringify(result).replace(/'/g, "''");

                const insertQuery = `
                    INSERT INTO Adapted_Content_Cache (lesson_id, band, content, updated_at)
                    VALUES ('${lessonId}', ${band}, '${contentStr}', CURRENT_TIMESTAMP)
                    ON CONFLICT(lesson_id, band) DO UPDATE SET
                        content = excluded.content,
                        updated_at = excluded.updated_at;
                `;

                await executeSql(insertQuery);
                console.log(`  Successfully generated and saved band ${band}`);
                newAdaptations++;

                // Add a small standard delay to avoid hitting rate limits normally
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error: unknown) {
                console.error(`  Failed to generate band ${band} after retries: ${error instanceof Error ? error.message : String(error)}`);
                failedAdaptations++;
            }
        }

        // 4. Band 5 is always the master text
        if (!existingBands.includes(5)) {
            console.log(`  Generating Band 5 (Master Text)...`);
            try {
                const resultObj = {
                    text: narrative_text,
                    pre_generated: true,
                    fallback: false
                };

                const contentStr = JSON.stringify(resultObj).replace(/'/g, "''");

                const insertBand5Query = `
                    INSERT INTO Adapted_Content_Cache (lesson_id, band, content, updated_at)
                    VALUES ('${lessonId}', 5, '${contentStr}', CURRENT_TIMESTAMP)
                    ON CONFLICT(lesson_id, band) DO UPDATE SET
                        content = excluded.content,
                        updated_at = excluded.updated_at;
                `;
                await executeSql(insertBand5Query);
                console.log(`  Successfully saved band 5 (Master Text)`);
                newAdaptations++;
            } catch (error: unknown) {
                 console.error(`  Failed to save band 5: ${error instanceof Error ? error.message : String(error)}`);
                 failedAdaptations++;
            }
        } else {
            console.log(`  Skipping Band 5 - Already generated.`);
            existingAdaptations++;
        }
    }

    console.log(`\nSummary: Generated ${newAdaptations} new adaptations, ${existingAdaptations} already existed, ${failedAdaptations} failed.`);
}

main().catch(console.error);
