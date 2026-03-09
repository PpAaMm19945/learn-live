

# Audit Results: What's Fixed vs What's Still Broken

## Verification of Walkthrough Claims

| Claim | Status | Evidence |
|-------|--------|----------|
| `sendImage` added to `gemini.ts` | FIXED | Lines 103-114 — method exists and works |
| `sendToolResponse` added | FIXED | Lines 116-129 — method exists with `SILENT` scheduling |
| Tool calls forwarded (not filtered) | FIXED | Lines 48-60 — all tool calls forwarded with `id` |
| `server.ts` handles image messages | FIXED | Line 105-106 — `else if (msg.type === 'image')` present |
| Tool response sent after `evaluate_constraint` | FIXED | Lines 88-92 in `server.ts` |
| Explainer sends tool responses | FIXED | Lines 181-185 in `explainerSession.ts` |
| Graceful farewell (5s timeout) | FIXED | Line 93 — `setTimeout(() => ws.close(), 5000)` |
| Dynamic learner context in Explainer | FIXED | Lines 143-161 — fetches from Worker API with fallback |
| PIN not leaked in profile responses | FIXED | Lines 1372-1373, 1402-1404 — `pin: null` in responses |
| Server-side PIN verification | FIXED | Lines 1416-1435 — `POST /api/family/verify-pin` exists |
| `ProfileSelect.tsx` uses verify-pin API | FIXED | Lines 80-84 — calls the endpoint |
| Family code derivation consistent | FIXED | Both lines 1309 and 1357 use `replace(/-/g, '_')` |
| `evaluateEvidence` wired into portfolio flow | FIXED | Lines 307-323 — called during `POST /api/portfolio` |
| Session summaries written | FIXED | Lines 349-362 — inserted into `Session_Summaries` after portfolio creation |
| `maxLength` on Login input | FIXED | Line 66 — `maxLength={10}` |

---

## Still Broken — Issues Remaining

### P0: Hardcoded Auth Token in Frontend

**`src/components/learner/ExplainerCanvas.tsx` line 263** still contains:
```
Authorization: 'Bearer development_secret_token'
```
This is the only remaining instance in frontend code. All other components correctly use `import.meta.env.VITE_API_AUTH_TOKEN`. This is a direct security leak — anyone can call the `/api/generate-diagram` endpoint.

**Fix:** Replace with `` `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || ''}` ``

### P1: Worker Fallback Token Still Exists

**`worker/src/index.ts` line 44:**
```typescript
const expectedToken = env.API_AUTH_TOKEN || 'development_secret_token';
```
If `API_AUTH_TOKEN` is not set in the Cloudflare environment, the worker falls back to a publicly known secret. This means auth is effectively disabled in any deployment that forgets to set the secret.

**Fix:** Remove the fallback. If `API_AUTH_TOKEN` is unset, reject all authenticated requests.

### P1: No Auth on Public Data Endpoints

These endpoints have zero authorization — anyone with a family ID can read all data:
- `GET /api/learner/:id/tasks`
- `GET /api/learner/:id/portfolio`
- `GET /api/parent/:id/judgments`
- `GET /api/family/:id/profiles`

For the pilot this is acceptable if family IDs are unguessable, but they follow a predictable pattern (`family_ll_xxxxx`).

**Fix (pilot-minimal):** Add a lightweight check: require `familyId` as a query param or header and verify the requested resource belongs to that family.

### P1: PINs Stored in Plaintext

`worker/src/index.ts` line 1324 stores PINs as plaintext in D1. Line 1428 compares with `===`. For a 4-digit PIN this is low risk, but it's a bad practice.

**Fix (deferred):** Not blocking for pilot. Note for post-pilot: hash PINs before storage.

### P2: Family PIN Not Stored

The `familyPin` from onboarding is used as a default for children's PINs (line 1320: `child.pin || familyPin`) but is never stored separately for parent authentication. Currently parents bypass PIN entirely (line 56-61 in `ProfileSelect.tsx`). This is fine for pilot but means there's no parent-level gate.

### P2: Explainer Missing Error Handler on WebSocket

`explainerSession.ts` has `ws.on('close')` but no `ws.on('error')` handler. If the WebSocket errors, the Gemini session leaks.

**Fix:** Add `ws.on('error', () => gemini.close())`.

### P2: No Rate Limiting on Registration

`POST /api/family/register` has no rate limiting. An attacker could spam-create thousands of families. The invite code (`LEARNLIVE2026`) provides some protection but it's a fixed string.

---

## Implementation Plan

### 1. Fix ExplainerCanvas hardcoded token
**File:** `src/components/learner/ExplainerCanvas.tsx` line 263
Replace `'Bearer development_secret_token'` with template literal using `VITE_API_AUTH_TOKEN`.

### 2. Remove worker auth fallback
**File:** `worker/src/index.ts` line 44
Change to: `const expectedToken = env.API_AUTH_TOKEN;` and return 401 if unset.

### 3. Add error handler to explainer WebSocket
**File:** `agent/src/explainerSession.ts`
Add `ws.on('error', (err) => { console.error(...); gemini.close(); })` after the `ws.on('close')` block.

### 4. Update judgment.md
Reflect the current state — most P0s are resolved, note remaining items.

Total: 4 small, targeted fixes. Everything else from the original audit is confirmed resolved.

