# Phase 13 Fixes

## Instance A: Frontend Resilience (Code Change)

**Goal:** Make the reading experience work even when no `Adapted_Content` row exists for the requested band.

**Files modified:**

1. **`worker/src/routes/content.ts`** — In `handleGetAdaptedContent`, when `adaptedContent` is null, included `narrative_text` from the Lessons table as a fallback in the response.

2. **`src/components/content/AdaptedContentReader.tsx`** — Removed the `throw` when content is null. Showed a subtle banner if fallback is true.

3. **`src/components/content/WorldContextSidebar.tsx`** — Wrapped the query in try-catch so a 500 from the world-context API returns `[]` gracefully.

## Instance B: Missing D1 Migrations (Manual Action)

**Status**: Executed remotely via wrangler.

```bash
# Verified these tables exist — ran:
cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/012_glossary.sql
cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=db/migrations/013_world_context.sql
```

## Instance C: Glossary Handler Fix (Code Change)

**File:** `worker/src/routes/glossary.ts`

Fixed the `bind(...params)` call when params array is empty.
