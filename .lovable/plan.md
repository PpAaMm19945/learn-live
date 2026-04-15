

# Fix Failing Test + Address Jules Report

## Summary

One code fix and a summary of the Jules findings. The failing test predates the Sprint 1 band config and uses an incorrect assumption. The manifest warnings and lint issues are expected — they document work needed on curriculum content, not code bugs.

---

## Task 1: Fix the failing test

**File:** `src/test/historySessionContract.test.ts`, line 66

The test creates `new HistorySessionController(2)` and expects `band_restricted`, but Band 2 (`Explorer`, ages 7-8) has `raiseHand: 'guided'` — not `'disabled'`. Only Bands 0 and 1 are disabled.

**Fix:** Change the test to use band 0 or 1 (which are actually restricted), or update the assertion to match `'guided'` behavior. Since the test's intent is to verify band restriction works, change the constructor arg from `2` to `1`:

```ts
const controller = new HistorySessionController(1);  // Band 1 has raiseHand: 'disabled'
```

No other changes needed — the rest of the test logic (expecting `accepted: false, reason: 'band_restricted'`) is correct for bands 0-1.

---

## Jules Report Summary (no code changes needed)

| Finding | Action |
|---|---|
| **1 failing test** | Fix above |
| **354 ESLint `any` errors** | Known tech debt — not blocking |
| **Dependency vulnerabilities** | Run `npm audit fix` across root/agent/worker — safe to do in a separate pass |
| **96 manifest lint warnings** | Expected — confirms the lint script works. Curriculum authors need to add `bandOverrides` to `ch01_s01.json` for bands 0-2 |
| **Cloud Run deployment** | Verified healthy at revision 00083 |

---

## Files Changed

| File | Change |
|---|---|
| `src/test/historySessionContract.test.ts` | Line 66: `HistorySessionController(2)` → `HistorySessionController(1)` |

