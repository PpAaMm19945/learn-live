# Phase 8 Integration Notes

## Fixes Applied

### Fix 1: logActivity → auth.ts (login)
- `worker/src/lib/auth/password.ts` already imported `logActivity` but never called it
- Added `logActivity(env, user.id, 'login', 'auth', user.id)` after successful login, before setting cookie

### Fix 2: logActivity → content.ts (content_viewed)
- Added import of `logActivity` from `../lib/analytics/logger`
- Added logging after successful content fetch in both `handleGetAdaptedContent` and `handleGetChapterContent`
- Logs `content_viewed` with resource type `lesson` or `chapter`

### Fix 3: logActivity → artifacts.ts (artifact_uploaded)
- Added import of `logActivity`
- Changed `handleUploadArtifact` signature to accept optional `userId` parameter
- Updated `worker/src/routes/index.ts` to pass `authResult.userId` to `handleUploadArtifact`
- Logs `artifact_uploaded` after successful R2 upload

### Fix 4: Admin route restricted
- `src/App.tsx` line 92: Changed `allowedRoles={['admin', 'parent']}` → `allowedRoles={['admin']}`
- Backend analytics routes already checked admin role; this fixes the frontend gate

### Fix 5: run-migrations.sh updated
- Added `010_analytics.sql` and `011_feedback.sql` to MIGRATIONS array
- Script now runs migrations 003–011

### Fix 6: deployment-checklist.md updated
- Updated migration range reference from "003–009" to "003–011"

### Fix 7: Admin link in Dashboard — VERIFIED
- `src/pages/parent/Dashboard.tsx` imports `useIsAdmin` and conditionally renders "Admin Dashboard" button
- Only visible when `isAdmin` is true (checked via user roles API)

## Not Done (Deployment-Time Tasks)
- R2 upload scripts (`prepare-content.ts`, `upload-to-r2.ts`) have NOT been run against production
- D1 migrations 010–011 have NOT been applied to production
- These are deployment tasks, not code tasks
