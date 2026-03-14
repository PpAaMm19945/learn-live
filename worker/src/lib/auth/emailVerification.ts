import type { Env } from '../../index';

// Use verified sender email - can be updated when you get a custom domain
const SENDER_EMAIL = 'antmwes104.1@gmail.com';

export async function sendVerificationEmail(email: string, token: string, env: Env): Promise<boolean> {
    try {
        const verifyUrl = `https://learn-live.antmwes104-1.workers.dev/api/auth/verify-email?token=${token}`;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.Resend_API_Key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Learn Live <${SENDER_EMAIL}>`,
                to: email,
                subject: 'Verify your Learn Live account',
                html: `
                    <h1>Welcome to Learn Live!</h1>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${verifyUrl}">Verify Email</a>
                `
            })
        });

        if (!response.ok) {
            console.error('[EmailVerification] Failed to send verification email:', await response.text());
            return false;
        }

        return true;
    } catch (e) {
        console.error('[EmailVerification] Error sending verification email:', e);
        return false;
    }
}

export async function sendPasswordResetEmail(email: string, token: string, env: Env): Promise<boolean> {
    try {
        const resetUrl = `https://learn-live-4az.pages.dev/reset-password?token=${token}`;

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.Resend_API_Key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Learn Live <${SENDER_EMAIL}>`,
                to: email,
                subject: 'Reset your Learn Live password',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>You recently requested to reset your password for your Learn Live account. Click the link below to reset it:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                `
            })
        });

        if (!response.ok) {
            console.error('[EmailVerification] Failed to send password reset email:', await response.text());
            return false;
        }

        return true;
    } catch (e) {
        console.error('[EmailVerification] Error sending password reset email:', e);
        return false;
    }
}
