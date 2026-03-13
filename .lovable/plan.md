

# Phase 8 Integration — Audit & Plan

## Audit Results (Instances A-C)

### Instance A — Content Pipeline: DONE
- `worker/scripts/prepare-content.ts` — parses 10 chapters into `content-manifest.json`
- `worker/scripts/prepare-maps.ts` — parses 34 maps into `map-manifest.json`
- `worker/scripts/upload-to-r2.ts` — uploads to R2
- `worker/scripts/seed-curriculum.ts` — generates seed SQL from manifest
- `worker/db/seeds/` — all 3 seed files present
- **Note:** These are build-time scripts run locally via `npx tsx`. They have NOT been executed against production D1/R2. This is expected — they are deployment-time tasks, not Lovable tasks.

### Instance B — Admin Analytics: DONE
- `worker/src/routes/analytics.ts` — 3 endpoints (overview, engagement, families) with admin role check
- `worker/src/lib/analytics/logger.ts` — `logActivity()` utility with fire-and-forget
- `worker/db/migrations/010_analytics.sql` — Activity_Log table
- `src/pages/admin/Dashboard.tsx` — overview cards, recharts charts, families table
- `src/lib/auth.ts` — `useIsAdmin()` hook
- `logActivity()` wired into `curriculum.ts` and `examiner.ts`

### Instance C — Onboarding & Feedback: DONE
- `src/pages/Register.tsx` — no invite code field (open registration)
- `src/pages/Onboarding.tsx` — 5-step wizard with band calculator, family/learner creation
- `src/lib/bandCalculator.ts` — age-to-band mapping
- `worker/src/routes/feedback.ts` — create, list, update feedback
- `worker/db/migrations/011_feedback.sql` — Feedback table
- `src/components/feedback/FeedbackWidget.tsx` — floating widget
- `src/components/ProtectedRoute.tsx` — renders FeedbackWidget (excluded on /onboarding)

### Frontend Routing: DONE
- `/onboarding` — protected, Onboarding component
- `/admin` — protected with `allowedRoles={['admin', 'parent']}` (see issue below)
- FeedbackWidget in ProtectedRoute layout

### Route Wiring: DONE
- `worker/src/routes/index.ts` — analytics and feedback routes imported and wired
- `worker/src/index.ts` — clean, 72 lines

---

## Issues Found

### 1. Missing `logActivity` in auth.ts, content.ts, artifacts.ts
The Phase 8 prompt specified wiring `logActivity()` into login (auth.ts), content view (content.ts), and artifact upload (artifacts.ts). Currently only `curriculum.ts` and `examiner.ts` have it. Three handlers are missing activity logging.

### 2. Admin route allows `parent` role
Line 92 of `App.tsx`: `allowedRoles={['admin', 'parent']}`. This means ANY parent can access the admin dashboard. The backend protects the API (analytics routes check admin role), so the data won't load, but the page renders. Should be `allowedRoles={['admin']}` only.

### 3. `run-migrations.sh` missing 010 and 011
The migration script only lists migrations 003-009. It needs `010_analytics.sql` and `011_feedback.sql` added.

### 4. Dashboard family redirect works
Dashboard fetches `/api/family`, and on 404 navigates to `/onboarding`. This is correctly implemented.

### 5. Learner selector in Dashboard works
Dashboard has `selectedLearnerId` state and fetches family data with learner list.

### 6. Admin link in Dashboard
Need to verify the Dashboard shows an admin link. The `useIsAdmin` hook is imported.

---

## Integration Plan

### Fix 1: Add `logActivity` to auth.ts
Import `logActivity` from `../lib/analytics/logger`. After successful login in the login handler, add:
```ts
logActivity(env, user.id, 'login', 'auth', user.id);
```

### Fix 2: Add `logActivity` to content.ts
Import logger. After content is served in `handleGetAdaptedContent` and `handleGetChapterContent`, add:
```ts
logActivity(env, userId, 'content_viewed', 'lesson', lessonId);
```

### Fix 3: Add `logActivity` to artifacts.ts
Import logger. After successful artifact upload in `handleUploadArtifact`, add:
```ts
logActivity(env, userId, 'artifact_uploaded', 'artifact', artifactId);
```
Note: `handleUploadArtifact` doesn't currently receive `userId` — will need to pass it through from the router or extract from the request context.

### Fix 4: Restrict admin route
In `App.tsx` line 92, change `allowedRoles={['admin', 'parent']}` to `allowedRoles={['admin']}`.

### Fix 5: Update `run-migrations.sh`
Add `010_analytics.sql` and `011_feedback.sql` to the MIGRATIONS array.

### Fix 6: Documentation
- Update `ROADMAP.md`: Phase 8 → COMPLETE
- Update `.antigravity/prompts.md` with Phase 8 completion log
- Create `.antigravity/notes/P8_integration.md` documenting all integration fixes
- Update `docs/deployment-checklist.md` with migrations 010, 011

### Fix 7: Verify admin link visibility in Dashboard
Check that the parent Dashboard shows "Admin Dashboard" link only when `isAdmin` is true. (Already imported — just confirm rendering.)

