const fs = require('fs');

const indexContent = fs.readFileSync('worker/src/index.ts', 'utf8');

const existingRoutesStart = indexContent.indexOf('// ==================== EXISTING ROUTES ====================');

if (existingRoutesStart === -1) {
    console.error("Could not find start of existing routes.");
    process.exit(1);
}

// Find the end of the fetch function
const fetchEnd = indexContent.lastIndexOf('    },');

const legacyContent = indexContent.substring(existingRoutesStart, fetchEnd);

const legacyFileContent = `import { Env } from '../index';
import { r2Helper } from '../lib/r2';
import { advanceArc } from '../lib/arc';
import { resolveDependencies } from '../lib/dag';
import { generateTask, generateSystemInstruction } from '../lib/taskGen';
import { generateDiagram } from '../lib/nanoBanana';
import { getSplitJudgmentMode, evaluateCompetence } from '../lib/splitJudgment';
import { generateParentPrimer } from '../lib/parentPrimer';
import { checkAIPermission } from '../lib/aiPermissions';
import { getOrCreateWeeklyPlan, completeWeeklyTask } from '../lib/weeklyPlan';
import { getEnrichedTask } from '../lib/enrichTask';
import { evaluateEvidence } from '../lib/evaluateEvidence';
import { authenticateRequest, requireAuth } from '../lib/auth/middleware';

// Cache for parsed JSON fields to avoid redundant parsing overhead
const jsonCache = new Map<string, any>();

function cachedJSONParse(jsonString: string | null): any {
    if (!jsonString) return null;
    const cached = jsonCache.get(jsonString);
    if (cached !== undefined) return cached;
    try {
        const parsed = JSON.parse(jsonString);
        jsonCache.set(jsonString, parsed);
        return parsed;
    } catch (error) {
        console.error('[JSON Cache] Failed to parse JSON:', error);
        return null;
    }
}

function addCors(response: Response, corsHeaders: Record<string, string>): Response {
    const newResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(corsHeaders)) {
        newResponse.headers.set(key, value);
    }
    return newResponse;
}

export async function handleLegacyMathRoutes(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response | null> {
    const url = new URL(request.url);

${legacyContent.replace(/^/gm, '    ')}

    return null;
}
`;

fs.writeFileSync('worker/src/archive/legacyMathRoutes.ts', legacyFileContent);
console.log('Legacy math routes extracted to worker/src/archive/legacyMathRoutes.ts');
