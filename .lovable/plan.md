

# Fix: Chapter ID Mismatch — `ch01` vs `topic_ch01`

## Root Cause

The database stores topic IDs as `topic_ch01`, `topic_ch02`, etc. But the frontend uses `ch01`, `ch02` as chapter IDs throughout the app (in the `CHAPTERS` constant, URL routes like `/play/ch01`, and WebSocket params). When the agent calls `/api/chapters/ch01/content`, the worker queries `SELECT ... FROM Topics WHERE id = 'ch01'` — which returns nothing because the actual ID is `topic_ch01`.

## Fix

Normalize the chapter ID in the worker's `handleGetChapterContent` handler. If the incoming `chapterId` doesn't start with `topic_`, prepend it before querying.

### File: `worker/src/routes/content.ts`

In `handleGetChapterContent`, after extracting `chapterId` on line 86, add normalization:

```typescript
const chapterId = chapterIdMatch[1];
// Normalize: frontend sends "ch01", DB stores "topic_ch01"
const topicId = chapterId.startsWith('topic_') ? chapterId : `topic_${chapterId}`;
```

Then replace all uses of `chapterId` in the DB queries with `topicId`:
- Line 98: `Topics WHERE id = ?` → bind `topicId`
- Line 103: `Lessons WHERE topic_id = ?` → bind `topicId`

Keep `chapterId` (the original value) in the JSON response so the frontend gets back what it sent.

This also fixes the `WorldContextSidebar` which calls `/api/chapters/ch01/world-context` — if that endpoint has the same pattern, apply the same normalization there.

### Scope check: other chapter endpoints

Search for any other worker routes that accept a chapter/topic ID and query the Topics table — apply the same `topic_` prefix normalization to each.

