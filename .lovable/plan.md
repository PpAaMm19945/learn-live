

# Plan: Fix Build Error + Admin Dashboard Access

## Summary

Two items to address: (1) a TypeScript build error in `RouteAnimation.tsx`, and (2) confirming admin dashboard navigation works end-to-end.

## Navigation Check (Already Done)

Admin access is already fully wired:
- **Sidebar**: `AppSidebar.tsx` shows an "Admin" link when `isAdmin` is true
- **Routes**: `App.tsx` has `/admin` and `/admin/content` routes wrapped in `ProtectedRoute` with `allowedRoles={['admin']}`
- **Protection**: `ProtectedRoute.tsx` checks the user's `roles` array against `allowedRoles`

No navigation changes needed. Once your D1 database has the admin role for your user (the migration you're working on), the sidebar will show the Admin link and the routes will grant access.

## Fix 1: RouteAnimation.tsx Build Error

**File**: `src/components/visuals/RouteAnimation.tsx`, line 23

**Problem**: `document.getElementById()` returns `HTMLElement | null`, and TypeScript won't allow a direct cast to `SVGPathElement` because the types don't overlap.

**Fix**: Cast through `unknown` first:
```typescript
const pathElement = document.getElementById(svgPathId) as unknown as SVGPathElement | null;
```

This is a single-line change on line 23.

## What You Need To Do (Migration)

Run this command to grant yourself admin access in the production D1 database:

```bash
npx wrangler d1 execute learnlive-db-prod --remote --command="INSERT OR IGNORE INTO User_Roles (id, user_id, role) VALUES (hex(randomblob(16)), '4be4d08b-235e-4165-89a6-0e7b60565977', 'admin')"
```

Adjust the database name if it differs from `learnlive-db-prod`. You can verify with:
```bash
npx wrangler d1 execute learnlive-db-prod --remote --command="SELECT * FROM User_Roles WHERE role = 'admin'"
```

## Technical Details

- The `ProtectedRoute` component defaults `allowedRoles` to `['parent', 'learner']` — admin routes explicitly pass `['admin']`
- The `useIsAdmin` hook (used in `AppSidebar`) fetches `/api/admin/check` from the worker, which calls `requireAdmin` → checks `User_Roles` table
- The SVG cast fix is safe because the component only targets SVG path elements by design

