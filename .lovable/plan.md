

# Audit Report: All 3 Previous Fixes — Status

## Fix 1: Capacity ID Collision (English PS2* vs Science PS2*) — FIXED

The critical bug is resolved. The seed script now correctly prefixes:
- English: `ENG_PS2a` → `ENG_S1` → "Short Vowel Mastery"
- Science: `SCI_PS2a` → `SCI_S2` → "States of Matter"

No collisions remain. All 3 subjects have unique capacity IDs in the generated SQL.

## Fix 2: Learner States for All 3 Subjects — FIXED

`seed_azie_arie_states.sql` now includes:
- 4 Math capacities (D1, B2, G2a, P2a) per learner
- 5 English capacities (ENG_PS2a, ENG_RC2a, ENG_GM2a, ENG_CW2a, ENG_OL2a) per learner
- 3 Science capacities (SCI_SE2a, SCI_LS2a, SCI_PS2a) per learner
- Total: 24 active states across 2 learners

## Fix 3: Login.tsx forwardRef — FIXED

Properly wrapped with `React.forwardRef<HTMLDivElement>`, `ref` applied to root div, `displayName` set.

## Fix 4: Capacity Names — MOSTLY FIXED

English and Science capacities all show proper names via the `capacity_names.json` lookup files. Math capacities also show proper names via `MATH_CAPACITIES` map.

**One remaining miss:** `M2` on line 66 still shows "Physical modeling" (generic `task_type` fallback) because `M2` is not in `MATH_CAPACITIES`. This is a single capacity — add `'M2': 'Mathematical Modeling'` to the map.

## Remaining Items (Minor)

| Item | Severity | Detail |
|------|----------|--------|
| `M2` capacity name | Low | Add `'M2': 'Mathematical Modeling'` to `MATH_CAPACITIES` in `seed_curriculum.ts`, regenerate SQL |
| Science strands misassigned | Low | All `SCI_SE*` and `SCI_LS*` capacities go to `SCI_S1` ("Life Sciences & Inquiry"). Scientific Inquiry (SE) nodes are conceptually cross-cutting, not "Life Sciences." Consider adding a `SCI_S0` strand or renaming `SCI_S1` to "Scientific Inquiry & Life Sciences." This is cosmetic for hackathon purposes. |
| `STRAND_ID_MAP` dead code | Trivial | Lines 26-32 define `STRAND_ID_MAP` but it is never used. The script builds strand IDs inline via `${prefix}${t.strand}`. Can be removed. |

## Verdict

All three critical fixes from the previous audit have been correctly implemented. The data pipeline is clean and ready for production seeding. Only one trivial capacity name (`M2`) needs updating.

