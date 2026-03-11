// Utility functions for base64url encoding/decoding
function bufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64UrlToBuffer(base64Url: string): ArrayBuffer {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

async function importKey(secret: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
        'raw',
        textEncoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

export interface JWTPayload {
    sub: string;
    email: string;
    role?: string;
    iat?: number;
    exp?: number;
    [key: string]: any;
}

export async function signToken(
    payload: { sub: string; email: string; role?: string },
    secret: string,
    expiresInSeconds: number = 7 * 24 * 60 * 60 // Default: 7 days
): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };

    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JWTPayload = {
        ...payload,
        iat: now,
        exp: now + expiresInSeconds
    };

    const encodedHeader = bufferToBase64Url(textEncoder.encode(JSON.stringify(header)));
    const encodedPayload = bufferToBase64Url(textEncoder.encode(JSON.stringify(fullPayload)));

    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const key = await importKey(secret);

    const signatureBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        textEncoder.encode(dataToSign)
    );

    const encodedSignature = bufferToBase64Url(signatureBuffer);

    return `${dataToSign}.${encodedSignature}`;
}

export async function verifyToken(token: string, secret: string): Promise<JWTPayload | null> {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null; // Invalid token format
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    try {
        const key = await importKey(secret);
        const signatureBuffer = base64UrlToBuffer(encodedSignature);

        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBuffer,
            textEncoder.encode(dataToVerify)
        );

        if (!isValid) {
            return null; // Invalid signature
        }

        const payloadStr = textDecoder.decode(base64UrlToBuffer(encodedPayload));
        const payload: JWTPayload = JSON.parse(payloadStr);

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return null; // Token expired
        }

        return payload;
    } catch (e) {
        // Log error if needed, but returning null ensures token is considered invalid
        return null;
    }
}
