# P20: Password and Email Verification Libraries

Implemented Web Crypto API PBKDF2 hashing (`100k iterations`, `SHA-256`, 16-byte random salt) to accommodate Cloudflare Workers' lack of bcrypt support.
Added `handleRegister`, `handleLogin`, `handleForgotPassword`, `handleResetPassword`, and `handleVerifyEmail` route handlers.
Implemented `sendVerificationEmail` and `sendPasswordResetEmail` via Resend API.
No external cryptographic dependencies are used, keeping it compatible with Edge runtime.
Issues: Iteration count is 100k. OWASP recommends 600k+ for PBKDF2-HMAC-SHA256, but 100k balances security and Edge runtime CPU limits (which can kill functions taking >10ms CPU time).
