/**
 * Account Linking — single entry point for user resolution across all auth methods.
 * All auth flows (magic link, Google OAuth, email+password) call findOrCreateUser
 * so that duplicate accounts are impossible when email matches.
 */

export interface FindOrCreateOptions {
    name?: string;
    passwordHash?: string;
    emailVerified?: boolean;
}

export interface FindOrCreateResult {
    id: string;
    isNew: boolean;
}

export async function findOrCreateUser(
    db: D1Database,
    email: string,
    options: FindOrCreateOptions = {}
): Promise<FindOrCreateResult> {
    const existing = await db.prepare(
        'SELECT id, name, password_hash FROM Users WHERE email = ?'
    ).bind(email).first<{ id: string; name: string | null; password_hash: string | null }>();

    if (existing) {
        // Link password to an OAuth/magic-link account that doesn't have one yet
        if (options.passwordHash && !existing.password_hash) {
            await db.prepare('UPDATE Users SET password_hash = ? WHERE id = ?')
                .bind(options.passwordHash, existing.id).run();
        }

        // Fill in name if missing
        if (options.name && !existing.name) {
            await db.prepare('UPDATE Users SET name = ? WHERE id = ?')
                .bind(options.name, existing.id).run();
        }

        // If email was previously unverified and this flow verifies it, update
        if (options.emailVerified) {
            await db.prepare('UPDATE Users SET email_verified = 1 WHERE id = ?')
                .bind(existing.id).run();
        }

        return { id: existing.id, isNew: false };
    }

    // Create new user
    const userId = crypto.randomUUID();
    await db.prepare(
        'INSERT INTO Users (id, email, name, password_hash, email_verified) VALUES (?, ?, ?, ?, ?)'
    ).bind(
        userId,
        email,
        options.name || null,
        options.passwordHash || null,
        options.emailVerified ? 1 : 0
    ).run();

    // Assign default 'parent' role
    await db.prepare(
        'INSERT INTO User_Roles (id, user_id, role) VALUES (?, ?, ?)'
    ).bind(crypto.randomUUID(), userId, 'parent').run();

    return { id: userId, isNew: true };
}
