interface FamilySessionStatus {
    count: number;
    date: string; // YYYY-MM-DD
}

const sessions = new Map<string, FamilySessionStatus>();
const MAX_SESSIONS_PER_DAY = 10;

function getCurrentDateStr(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function checkRateLimit(familyId: string): boolean {
    const today = getCurrentDateStr();
    const status = sessions.get(familyId);

    if (!status || status.date !== today) {
        sessions.set(familyId, { count: 1, date: today });
        console.log(`[AGENT] Rate limit: family ${familyId} has used 1/${MAX_SESSIONS_PER_DAY} sessions today`);
        return true;
    }

    if (status.count >= MAX_SESSIONS_PER_DAY) {
        console.log(`[AGENT] Rate limit: family ${familyId} has exceeded max sessions (${MAX_SESSIONS_PER_DAY})`);
        return false;
    }

    status.count += 1;
    console.log(`[AGENT] Rate limit: family ${familyId} has used ${status.count}/${MAX_SESSIONS_PER_DAY} sessions today`);
    return true;
}
