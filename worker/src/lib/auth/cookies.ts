export function setSessionCookie(response: Response, token: string): Response {
    // Clone the response so we can modify its headers
    const newResponse = new Response(response.body, response);

    // Set the cookie header with standard secure flags
    const cookieString = `session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`;
    newResponse.headers.append('Set-Cookie', cookieString);

    return newResponse;
}

export function getSessionToken(request: Request): string | null {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) {
        return null;
    }

    // Basic cookie parsing to find the "session" cookie
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
        if (cookie.startsWith('session=')) {
            return cookie.substring('session='.length);
        }
    }

    return null;
}

export function clearSessionCookie(response: Response): Response {
    // Clone the response to modify headers
    const newResponse = new Response(response.body, response);

    // Clear the cookie by setting it to empty with an expired max-age/expires date
    const cookieString = `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    newResponse.headers.append('Set-Cookie', cookieString);

    return newResponse;
}
