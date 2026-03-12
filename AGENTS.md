# AGENTS.md

## Project: Learn Live

- Frontend: React + Vite + Tailwind (root)
- Backend: Cloudflare Worker (worker/)
- Agent: Express + Gemini (agent/)

## Running Migrations

```bash
cd worker
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/<FILENAME>.sql
```

## Environment

- `CLOUDFLARE_API_TOKEN` must be set for wrangler commands
- D1 database config is in `worker/wrangler.toml`

## Build

- Frontend: `npm run build` (root)
- Worker: `cd worker && npx wrangler deploy --dry-run`
