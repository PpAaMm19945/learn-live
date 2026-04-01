interface FamilySessionStatus {
    count: number;
    date: string; // YYYY-MM-DD
}

const sessions = new Map<string, FamilySessionStatus>();
const MAX_SESSIONS_PER_DAY = 20;

function getCurrentDateStr(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Check whether a family is under its daily session limit.
 * Does NOT increment the counter — call recordSession() once
 * the session has actually been established successfully.
 */
export function checkRateLimit(familyId: string): boolean {
    const today = getCurrentDateStr();
    const status = sessions.get(familyId);

    // New day or first-ever session — allow
    if (!status || status.date !== today) {
        return true;
    }

    if (status.count >= MAX_SESSIONS_PER_DAY) {
        console.log(`[AGENT] Rate limit: family ${familyId} has exceeded max sessions (${MAX_SESSIONS_PER_DAY})`);
        return false;
    }

    return true;
}

/**
 * Record a session as started for a family. Call this AFTER the
 * session is successfully established (Gemini connected, content fetched).
 */
export function recordSession(familyId: string): void {
    const today = getCurrentDateStr();
    const status = sessions.get(familyId);

    if (!status || status.date !== today) {
        sessions.set(familyId, { count: 1, date: today });
    } else {
        status.count += 1;
    }

    const current = sessions.get(familyId)!;
    console.log(`[AGENT] Rate limit: family ${familyId} has used ${current.count}/${MAX_SESSIONS_PER_DAY} sessions today`);
}
