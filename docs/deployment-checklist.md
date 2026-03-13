# Deployment Checklist

## Pre-Deploy

- [ ] Ensure `bun run test` passes without errors.
- [ ] Run `npm run build` locally to verify the frontend builds properly.
- [ ] Verify `worker/src/index.ts` has been refactored correctly and the modular routes are imported cleanly.
- [ ] Run `bun x tsc --noEmit` to verify there are no TypeScript errors.
- [ ] Check required secrets: Execute `bash worker/scripts/verify-env.sh` to confirm `JWT_SECRET`, `Google_Client_ID`, `Google_Client_Secret`, `Resend_API_Key`, `GEMINI_API_KEY`, and `PILOT_INVITE_CODE` are properly configured in Cloudflare.

## Deploy

- [ ] Execute `npx wrangler deploy` from within the `worker/` directory.
- [ ] Wait for Cloudflare to finish deploying the Worker.
- [ ] Make sure Cloudflare Pages auto-deploys the frontend changes via Git integration (or trigger manually if needed).

## Post-Deploy

- [ ] Run database migrations: Execute `bash worker/scripts/run-migrations.sh` from the root to run `003` through `011` (including analytics and feedback tables) and insert seed data.
- [ ] Verify the `/api/health` endpoint returns a `200 OK`.
- [ ] Log in via the production URL and check the dashboard to ensure the African History topics render.
- [ ] Verify family / learner selector integration is displayed and correctly updating the URL.
- [ ] Check that `API` calls work as expected.

## Rollback Steps

- [ ] If the Worker fails, rollback to the previous deployment via Cloudflare Dashboard -> Workers & Pages -> learn-live -> Deployments -> Rollback.
- [ ] If database issues occur, identify the specific table and fix via D1 SQL console in Cloudflare Dashboard (or manually fix via `npx wrangler d1 execute`).
- [ ] If frontend fails, rollback via Cloudflare Pages -> Deployments -> Rollback.
