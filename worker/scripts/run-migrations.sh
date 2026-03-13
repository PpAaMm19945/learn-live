#!/bin/bash
# Exit on any error
set -e

# Define D1 database name (from wrangler.toml)
DB_NAME="learnlive-db-prod"

echo "Applying migrations to D1 Database: $DB_NAME"

# Array of migrations in order
MIGRATIONS=(
    "worker/db/migrations/003_history_curriculum.sql"
    "worker/db/migrations/004_adaptation_cache.sql"
    "worker/db/migrations/005_exam_sessions.sql"
    "worker/db/migrations/006_artifacts.sql"
    "worker/db/migrations/007_map_assets.sql"
    "worker/db/migrations/008_families.sql"
    "worker/db/migrations/009_progress_learner.sql"
    "worker/db/migrations/010_analytics.sql"
    "worker/db/migrations/011_feedback.sql"
    "worker/db/migrations/013_world_context.sql"
    "worker/db/migrations/012_glossary.sql"
)

# Apply migrations
for MIGRATION in "${MIGRATIONS[@]}"; do
    if [ -f "$MIGRATION" ]; then
        echo "Applying migration: $MIGRATION"
        npx wrangler d1 execute "$DB_NAME" --remote --file="$MIGRATION"
    else
        echo "Warning: Migration file $MIGRATION not found!"
    fi
done

echo "Migrations completed successfully!"

echo "Applying seed data..."

SEEDS=(
    "worker/db/seeds/seed_curriculum.sql"
    "worker/db/seeds/seed_rag_chunks.sql"
    "worker/db/seeds/seed_map_assets.sql"
    "worker/db/seeds/seed_world_context.sql"
    "worker/db/seeds/seed_glossary.sql"
)

# Apply seeds
for SEED in "${SEEDS[@]}"; do
    if [ -f "$SEED" ]; then
        echo "Applying seed: $SEED"
        npx wrangler d1 execute "$DB_NAME" --remote --file="$SEED"
    else
        echo "Warning: Seed file $SEED not found!"
    fi
done

echo "Seeding completed successfully!"
