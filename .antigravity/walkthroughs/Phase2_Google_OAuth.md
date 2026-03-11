# Phase 2: Google OAuth Implementation (Task 2.4)

## Overview

This walkthrough details the implementation of the Google OAuth flow within the Cloudflare Worker, as specified in Task 2.4. The objective was to create a modular library for handling Google login and signup, independent of the main `worker/src/index.ts` file initially.

## Key Components (`worker/src/lib/auth/google.ts`)

The implementation introduces several key functions that encapsulate the OAuth 2.0 authorization code flow:

1. **`getGoogleAuthURL(env: Env, state: string): string`**:
   - Constructs the consent URL redirecting the user to `https://accounts.google.com/o/oauth2/v2/auth`.
   - Includes essential parameters: `client_id`, `redirect_uri` (`https://learn-live.antmwes104-1.workers.dev/api/auth/google/callback`), `scope` (`openid email profile`), `response_type` (`code`), and the CSRF `state` token.

2. **`exchangeCodeForTokens(code: string, env: Env): Promise<GoogleTokens>`**:
   - After the user consents and Google redirects back to the callback URL with an authorization code, this function makes a `POST` request to `https://oauth2.googleapis.com/token` to exchange the code for an `access_token` and `id_token`.

3. **`getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo>`**:
   - Uses the retrieved `access_token` to make a `GET` request to `https://www.googleapis.com/oauth2/v2/userinfo` to fetch the user's basic profile details (email, name, picture).

4. **`upsertGoogleUser(db: D1Database, userInfo: { email: string; name: string }): Promise<string>`**:
   - **Account Linking Behavior**: This function is crucial for preventing duplicate accounts. It queries the `Users` table by the provided `email`.
   - If a user already exists (e.g., they previously signed up using a magic link with the same email), the function simply returns their existing `id`. This achieves seamless account linking.
   - If no user exists, it generates a new UUID, creates a new record in the `Users` table (marking `email_verified` as true), and assigns them the default `parent` role in the `User_Roles` table.

## Route Handlers

The file also exports two asynchronous functions designed to be plugged into the main Worker router:

- **`handleGoogleAuth(request: Request, env: Env): Promise<Response>`**:
  - Initiates the flow. It generates a state payload, signs it as a short-lived JSON Web Token (JWT) using the utility from `jwt.ts` (acting as a CSRF token), and redirects the client to the URL constructed by `getGoogleAuthURL`.

- **`handleGoogleCallback(request: Request, env: Env): Promise<Response>`**:
  - The redirect target from Google. It performs several critical steps:
    1. Extracts the `code` and `state` from the URL parameters.
    2. Validates the `state` JWT to ensure the request originated from our application and hasn't expired.
    3. Exchanges the `code` for tokens.
    4. Retrieves the user's information.
    5. Calls `upsertGoogleUser` to handle the database logic (including account linking).
    6. Generates a new 7-day session JWT (`sessionToken`) for the user.
    7. Optionally hashes and stores the token in the `Sessions` table for potential future revocation.
    8. Sets a secure HTTP-only cookie (`Set-Cookie`) containing the session token using the `setSessionCookie` utility.
    9. Redirects the user to the frontend application (`https://learn-live-4az.pages.dev`).

## Environment Setup

The module defines its own local `Env` interface mirroring the main application's environment bindings, ensuring type safety when accessing `Google_Client_ID`, `Google_Client_Secret`, the D1 Database (`DB`), and the `JWT_SECRET` for signing tokens.

## Next Steps

These functions are currently standalone exports. The next phase will involve wiring `handleGoogleAuth` and `handleGoogleCallback` into the main routing logic within `worker/src/index.ts` to expose the endpoints.