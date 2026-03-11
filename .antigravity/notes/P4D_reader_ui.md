# P4D Reader UI Implementation

1. Created `BandSelector` (horizontal toggle for bands 0-5) with `localStorage` persistence.
2. Built `VocabularyCard` (inline popovers and block cards) for terms and `DiscussionQuestions` (accordion).
3. Created `AdaptedContentReader` that fetches `/api/lessons/:lessonId/content?band=X` and renders based on band.
4. Added `ReadingView` page (`/read/:lessonId`) combining selector and reader with a sticky header.
5. All components utilize shadcn/ui and semantic design tokens for styling and responsiveness.
