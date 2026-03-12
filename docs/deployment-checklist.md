# Deployment Checklist

## Pre-deploy
- [ ] Run migrations: `worker/scripts/run-migrations.sh`
- [ ] Verify secrets: `worker/scripts/verify-env.sh`
- [ ] Ensure seed data has been imported properly.

## Deploy
- [ ] Deploy worker: `cd worker && npx wrangler deploy`
- [ ] Deploy frontend: Cloudflare Pages auto-deploy from main branch

## Post-deploy
- [ ] Verify `/api/auth/me` endpoint
- [ ] Verify `/api/topics` endpoint
- [ ] Verify `/api/lessons/:id/content?band=2` endpoint

## Rollback procedure
- [ ] In case of frontend issues, revert to previous Pages deployment via Cloudflare Dashboard.
- [ ] In case of worker issues, use `npx wrangler rollback` to restore previous worker version.
- [ ] In case of database issues, restore D1 backup from Cloudflare Dashboard.
