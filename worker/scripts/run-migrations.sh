#!/bin/bash
set -e
cd "$(dirname "$0")/.."
echo "Running all pending D1 migrations..."
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/003_history_curriculum.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/004_adaptation_cache.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/005_exam_sessions.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/006_artifacts.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/007_map_assets.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/008_families.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/009_progress_learner.sql
echo "Running seed data..."
npx wrangler d1 execute learnlive-db-prod --remote --file=db/seeds/seed_curriculum.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/seeds/seed_rag_chunks.sql
npx wrangler d1 execute learnlive-db-prod --remote --file=db/seeds/seed_map_assets.sql
echo "All migrations complete!"
