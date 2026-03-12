

# Phase 4 Integration Plan

## The Rolled API Token

The token named "Learn-Live-API" is almost certainly a **Cloudflare API Token** used by wrangler for deployments and D1 migrations. It does **not** affect the running worker — the worker uses `API_AUTH_TOKEN`, `JWT_SECRET`, etc. as separate secrets. If your next `wrangler deploy` or `d1 execute` fails with a 401, you'll need to create a new API token in Cloudflare dashboard and update it wherever you use wrangler (locally, Jules environment, GitHub Actions).

No code changes needed for the rolled token.

---

## Phase 4 Integration — What Needs to Be Done

All 4 Jules instances delivered their files. The integration step wires them together.

### 1. Wire content routes into `worker/src/index.ts`

Import `routeRequest` from `worker/src/routes/index.ts` and call it early in the fetch handler (after CORS/OPTIONS, before the legacy switch). If it returns a `Response`, wrap with `addCors` and return. If `null`, fall through to existing routes.

**~5 lines added** to `worker/src/index.ts`.

### 2. Fix API response / frontend data mismatch

The content API returns `{ lesson, content, band }` where adapted text is nested under `content.adapted_text`. But `AdaptedContentReader.tsx` expects a flat object with a `content` string field.

**Fix in `AdaptedContentReader.tsx`:** Update the query to unwrap the nested response — extract `content.adapted_text` as `content`, `content.vocabulary`, `content.discussion_questions`, `content.essay_prompt` from the API response.

### 3. Add `/read/:lessonId` route to `src/App.tsx`

Add a protected route for `ReadingView` — import the page and add:
```
<Route path="/read/:lessonId" element={<ProtectedRoute><ReadingView /></ProtectedRoute>} />
```

### 4. Add "Read at my level" button to `LessonView.tsx`

Add a `BookOpen` icon button in the header that navigates to `/read/${lessonId}`. One line import, one `Button` component.

### 5. Update documentation

- **`ROADMAP.md`**: Mark Phase 4 tasks as complete. Add `004_adaptation_cache.sql` and seed SQL files to Current Blockers as pending migrations.
- **`.antigravity/prompts.md`**: Add Phase 4 completion log with all instance deliverables.
- **`issues.md`**: Log the data shape mismatch fix.

### 6. Write Phase 5 prompts

Create `.antigravity/prompts-phase5.md` for the **Assessment & Oral Examiner** phase per the roadmap (Phase 5). Structure as parallel Jules prompts following the established pattern.

---

## Files Modified

| File | Change |
|------|--------|
| `worker/src/index.ts` | Import and call `routeRequest` (~5 lines) |
| `src/App.tsx` | Add `/read/:lessonId` protected route |
| `src/pages/LessonView.tsx` | Add "Read at my level" navigation button |
| `src/components/content/AdaptedContentReader.tsx` | Fix response unwrapping to match API shape |
| `ROADMAP.md` | Mark Phase 4 complete, update blockers |
| `.antigravity/prompts.md` | Log Phase 4 completion |
| `issues.md` | Log mismatch fix |
| `.antigravity/prompts-phase5.md` | New: Phase 5 parallel prompts |

