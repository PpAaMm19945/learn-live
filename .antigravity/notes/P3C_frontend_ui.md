# P3C Frontend UI

1. Replaced `Dashboard.tsx` with a topic grid that fetches from `GET /api/topics`.
2. Created `TopicDetail.tsx` to display topic info and a list of lesson cards fetching from `GET /api/topics/:id`.
3. Created `LessonView.tsx` to show lesson narratives, sidebars, and completion POST fetching from `GET /api/lessons/:id`.
4. Added new `/topics/:topicId` and `/lessons/:lessonId` routes to `App.tsx` inside `<ProtectedRoute>`.
5. Applied semantic design tokens using Tailwind class names across all new components.