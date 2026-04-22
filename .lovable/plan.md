

# Plan — Rotate Leaked Gemini Key (You) + Wire Lesson Progression Persistence (Me)

Two independent issues. One requires action outside Lovable (you/Jules). One is a focused frontend fix I can implement now.

---

## Issue 1 — Audio falling back to browser TTS

### Root cause
The Cloud Run agent is hitting `403 PERMISSION_DENIED` on every Gemini TTS call and `404 NOT_FOUND` on `gemini-1.5-flash`. Google has flagged the current `GEMINI_API_KEY` as leaked (matches Jules' deploy report exactly). The frontend correctly detects no audio bytes arrive and falls back to `window.speechSynthesis` — that branch is at `useSession.ts:833`. The frontend code is fine.

### Required action — outside Lovable
You (or Jules) must rotate the key. Lovable cannot reach Google Cloud Secret Manager.

1. Generate a fresh API key in Google AI Studio (https://aistudio.google.com/apikey) under project `learn-live-488609`. Make it unrestricted, or restrict it only to `generativelanguage.googleapis.com` — never paste it into git, README, or chat.
2. Push it into Secret Manager:
   ```bash
   echo -n "NEW_KEY" | gcloud secrets versions add GEMINI_API_KEY \
     --data-file=- --project=learn-live-488609
   ```
3. Force the Cloud Run service to pick up the new version (no code change needed, but the running revision caches the secret on cold start):
   ```bash
   gcloud run services update learnlive-agent \
     --region=us-central1 --project=learn-live-488609 \
     --update-secrets=GEMINI_API_KEY=GEMINI_API_KEY:latest
   ```
4. Confirm by visiting `/health` and starting a fresh lesson. `[TTS]` and `[LIVE_GATEKEEPER]` log lines should stop emitting `PERMISSION_DENIED`.

### Also worth fixing while the key is rotating
The agent has `gemini-1.5-flash` hardcoded somewhere returning `404 NOT_FOUND` on `v1beta`. That model name was retired by Google and now requires `v1` or should be moved to `gemini-2.5-flash` / `gemini-2.0-flash`. Have Jules grep `agent/src/` for `gemini-1.5-flash` and bump it to `gemini-2.5-flash` (or `gemini-2.0-flash` if cost matters more than quality). This is unrelated to the leaked key — it would have surfaced anyway.

---

## Issue 2 — Lesson completion doesn't unlock the next lesson on Dashboard

### Root cause (verified in code)
- The worker has `POST /api/progress` (`worker/src/routes/curriculum.ts:155`) and the `Learner_Progress` table from migration `009_progress_learner.sql` is already deployed.
- **No frontend code ever calls it.** A grep across all of `src/` for `/api/progress` returns only the read path in `ProgressOverview.tsx`.
- `LessonPlayerPage.onComplete` (line 93/102) just calls `navigate('/dashboard')`. `SessionCanvas` never tells the player a session ended; it surfaces a completion card but no callback fires when the learner clicks "Done".
- Dashboard's "Continue Lesson" (`Dashboard.tsx:108`) finds the next lesson via `lesson.status === 'in_progress' || 'not_started'`, and the topic-detail endpoint joins `Learner_Progress` (`curriculum.ts:88`). Since nothing ever writes there, every lesson is permanently `not_started` and the picker keeps returning the same one.

### No new migration needed
Tables and endpoint exist. This is purely a missing frontend write.

### What I'll build

**File: `src/lib/lessonProgress.ts`** (new)
Tiny helper that POSTs to `/api/progress` with credentials. Two exports:
- `markLessonStarted(lessonId)` → `{ status: 'in_progress' }`
- `markLessonCompleted(lessonId)` → `{ status: 'completed' }`
Both swallow errors quietly with a `Logger.warn` so a transient worker hiccup never blocks navigation.

**File: `src/components/session/SessionCanvas.tsx`**
- Accept new optional prop `onComplete?: () => void`.
- Add a `useEffect` watching `status === 'ended'` (terminal state already set by `useSession` on `lesson_complete` / `session_complete` after audio drains). When it flips to `ended`, fire `onComplete()` exactly once via a ref guard.
- Wire a "Continue" button in the existing completion card / end-of-session screen that also calls `onComplete()`. Today the user is stranded on the completion card with no way back; this fixes that too.

**File: `src/pages/LessonPlayerPage.tsx`**
- Add a `useEffect` on mount: derive the lesson id from `chapterId` (`lesson_${chapterId}` shape, matching the worker's IDs from migration 003) and call `markLessonStarted(lessonId)`. This guarantees the topic-detail page shows the correct in-progress state even if the learner exits early.
- Define a single `handleComplete` that calls `markLessonCompleted(lessonId)` then `navigate('/dashboard')`. Pass it as `onComplete` to `SessionCanvas`, `StorybookPlayer`, and `LiveStorybookPlayer` (the last two already accept `onComplete`).

**File: `src/pages/parent/Dashboard.tsx`**
- Already does the right lookup. After progress writes start landing, "Continue Lesson" will naturally walk forward to `lesson_ch01_s02`, `s03`, etc. No change needed here beyond reusing the existing query — the React Query cache already invalidates when the user returns to `/dashboard`.

**Optional small polish**
On the topic-detail page (`TopicDetail.tsx`), the lesson cards already render status pills from the same join. Once writes land, completed lessons pick up the green pill automatically. If you'd like, I can also add a lightweight cache-bust on `/api/topics/:id` after returning from a lesson — but it's not necessary because navigating back triggers a refetch.

### Acceptance
1. Open `/play/ch01_s01`, finish the lesson → return to `/dashboard` → "Continue Lesson" now shows `Section 2`, not `Section 1`.
2. Topic detail for Chapter 1 shows `s01` with the "Completed" pill and `s02` as "In progress" if you've opened it.
3. Exit a lesson midway → that lesson appears as "In progress" on next visit.
4. No new migrations required.

---

## Files I will change

| File | Change |
|---|---|
| `src/lib/lessonProgress.ts` | NEW — `markLessonStarted` / `markLessonCompleted` helpers |
| `src/components/session/SessionCanvas.tsx` | Accept `onComplete`, fire once when `status === 'ended'`, add Continue button on completion card |
| `src/pages/LessonPlayerPage.tsx` | Mark started on mount; mark completed in `handleComplete`; thread to all three player components |

No agent changes. No worker changes. No migrations.

## What I will NOT do

- Touch the Gemini API key (cannot — that's Google Cloud Secret Manager).
- Modify the agent or worker.
- Add new tables or migrations.
- Re-architect the audio engine — the recovery pass we just shipped is correct; the silence is purely the leaked key.

---

## Recommended order of operations

1. **First**, you (or Jules) rotate the `GEMINI_API_KEY` and bump `gemini-1.5-flash` → `gemini-2.5-flash` in the agent. That restores real TTS so you stop hearing the browser robot voice.
2. **Then approve this plan** and I'll ship the progress-write changes so Chapter 1 actually walks forward section-by-section without manual selection.

The two are independent — you can do them in either order — but doing the key first means your next lesson test will sound right *and* advance properly.

