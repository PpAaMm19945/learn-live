# Phase 10: UI/UX Overhaul — Jules Prompts

> **Context for all instances:** Learn Live is an African History curriculum app. Parents sign in, add learners (children) during onboarding, and explore a 10-chapter curriculum adapted by band (age-appropriate reading level). The app has two revenue-generating AI features: (1) Live Narrated Lessons (Explainer Canvas — AI narrates over interactive maps) and (2) Live Oral Exams (AI conducts Socratic questioning). Everything else is preparation for those two experiences. The tech stack is React + Vite + Tailwind + shadcn/ui (frontend) and Cloudflare Workers + D1 (backend).

---

## Instance A — Global Learner Context Store (Task 10.1)

### Goal
Create a Zustand store that holds the active learner's identity and band, replacing all scattered localStorage reads and component-level band state.

### Files to Create/Modify
- **CREATE** `src/lib/learnerStore.ts`
- **MODIFY** `src/pages/parent/Dashboard.tsx` — remove local `selectedLearnerId` state, use store instead
- **MODIFY** `src/pages/ReadingView.tsx` — remove `useState(0)` for band, read from store
- **MODIFY** `src/pages/NarratedLessonView.tsx` — remove `useState(0)` for band, read from store  
- **MODIFY** `src/pages/ExamView.tsx` — remove `localStorage.getItem('learn-live-band')`, read from store

### Specifications

```typescript
// src/lib/learnerStore.ts
interface LearnerState {
  familyId: string | null;
  familyName: string | null;
  learners: Array<{ id: string; name: string; band: number }>;
  activeLearnerId: string | null;
  activeLearnerName: string | null;
  activeLearnerBand: number;
  setActiveLearner: (learnerId: string) => void;
  loadFamily: () => Promise<void>;
  isLoaded: boolean;
}
```

- `loadFamily()` calls `GET /api/family` (with `credentials: 'include'`) and populates the store.
- If `activeLearnerId` is null and learners exist, auto-select the first learner.
- `setActiveLearner(id)` updates `activeLearnerId`, `activeLearnerName`, and `activeLearnerBand` from the learners array.
- Export a convenience hook: `useActiveBand()` that returns `activeLearnerBand`.
- Persist `activeLearnerId` to `localStorage` so page reloads remember the selected learner (but band always comes from the store's learner data, never from localStorage directly).

### Integration Rules
- `Dashboard.tsx`: Call `loadFamily()` on mount (or check `isLoaded`). Use `setActiveLearner` for the learner dropdown. Remove `selectedLearnerId` state and `familyData` query — the store handles it.
- `ReadingView.tsx`: Replace `const [currentBand, setCurrentBand] = useState<number>(0)` with `const band = useActiveBand()`. Remove `BandSelector` import and rendering.
- `NarratedLessonView.tsx`: Same as ReadingView — replace local band state with store.
- `ExamView.tsx`: Remove `localStorage.getItem('learn-live-band')` and `setBand` state. Use `useActiveBand()`.

### Testing
- Verify: Selecting a different learner on Dashboard immediately changes the band shown on ReadingView without page reload.
- Verify: Refreshing the page on ReadingView retains the correct learner and band.

---

## Instance B — Unified App Shell with Persistent Navigation (Task 10.2 + 10.9)

### Goal
Replace all per-page `<header>` blocks with a single `AppShell` layout that provides persistent navigation across all authenticated pages.

### Files to Create/Modify
- **CREATE** `src/components/layout/AppShell.tsx`
- **CREATE** `src/components/layout/AppSidebar.tsx` (using shadcn Sidebar)
- **MODIFY** `src/App.tsx` — wrap all `<ProtectedRoute>` children in `<AppShell>`
- **MODIFY** `src/pages/parent/Dashboard.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/TopicDetail.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/LessonView.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/ReadingView.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/NarratedLessonView.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/ExamView.tsx` — remove local `<header>`, render only `<main>` content
- **MODIFY** `src/pages/Glossary.tsx` — replace `<DashboardLayout>` wrapper with just content (AppShell handles layout)
- **DELETE** or **ARCHIVE** `src/components/layout/DashboardLayout.tsx` — superseded by AppShell

### AppShell Specifications

```
┌─────────────────────────────────────────────────┐
│ [☰] Learn Live          [Learner: Amara ▾] [⚙] │  ← Sticky top header
├──────────┬──────────────────────────────────────┤
│ Dashboard│                                      │
│ ────────── │         Page Content               │  ← Desktop: sidebar + content
│ Glossary │                                      │
│ ────────── │                                    │
│ Progress │                                      │
│ ────────── │                                    │
│ Sign Out │                                      │
└──────────┴──────────────────────────────────────┘

Mobile (< 768px):
┌──────────────────────────┐
│ [☰]  Learn Live    [👤]  │  ← Sticky header
├──────────────────────────┤
│                          │
│      Page Content        │
│                          │
├──────────────────────────┤
│ 🏠  📖  📊  ⚙️          │  ← Fixed bottom nav
└──────────────────────────┘
```

### Implementation Details
- Use shadcn `SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarTrigger` from `@/components/ui/sidebar`.
- Sidebar items: Dashboard (`/dashboard`), Glossary (`/glossary`), Progress (future — can be a placeholder for now).
- The header should show the active learner name + band badge, with a dropdown to switch learners (reads from `useLearnerStore`).
- Use `collapsible="icon"` so sidebar collapses to icons on smaller screens.
- Admin link should only appear if `isAdmin` is true (from `useIsAdmin()`).
- Use `NavLink` component for active route highlighting.
- Breadcrumbs should still appear within page content (not in the shell) for contextual navigation within the topic → lesson → read/exam flow.

### Design Tokens
- Use `bg-sidebar`, `text-sidebar-foreground` etc. from the existing shadcn sidebar tokens.
- Header: `bg-card/60 backdrop-blur-xl border-b border-border/50` (consistent with current style).
- All colors must use semantic tokens (`--background`, `--foreground`, `--primary`, etc.), never hardcoded.

### Responsive Rules
- Desktop (≥1024px): Sidebar visible, collapsible to icon strip.
- Tablet (768–1023px): Sidebar collapsed to icon strip by default.
- Mobile (<768px): No sidebar. Fixed bottom navigation bar with 4 icons: Home, Glossary, Progress, Profile.

---

## Instance C — Dashboard & Lesson Flow Redesign (Tasks 10.3 + 10.4)

### Goal
Redesign the Dashboard from a flat topic grid to a guided learning journey that funnels parents toward Live Lessons and Live Exams.

### Files to Modify
- **MODIFY** `src/pages/parent/Dashboard.tsx` — complete redesign of the main content area
- **MODIFY** `src/pages/LessonView.tsx` — redesign from header-button layout to 3-step vertical flow

### Dashboard Redesign Specifications

**Hero Section (top of dashboard):**
```
┌─────────────────────────────────────────────────────┐
│  👋 Welcome back, Anthony!                          │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │ 📚 Learning as: Amara (Band 0 · Picture │        │
│  │    Book)                                 │        │
│  │                                          │        │
│  │ Currently on: Creation, Babel & the      │        │
│  │ Table of Nations                         │        │
│  │                                          │        │
│  │ [▶ Start Live Lesson]  [📖 Read First]   │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
```

- Show the active learner prominently (name, band label, band number).
- "Continue Learning" card shows the learner's current/next incomplete lesson.
- Primary CTA: "Start Live Lesson" (links to `/narrate/:lessonId`). Secondary: "Read First" (links to `/read/:lessonId`).
- If no progress exists yet, show the first lesson of the first topic (or the topic selected during onboarding).

**Topic List (below hero):**
- Display topics as a **vertical timeline** or **ordered list**, not a grid.
- Each topic card shows: title, era badge, progress bar (X/Y lessons complete), and a "View Lessons" expand/link.
- Topics should feel like chapters in a book — sequential, not random tiles.
- Use `Accordion` or expandable cards so lessons within each topic are visible without navigating away.

**Learner Switcher:**
- This is now handled by the AppShell header (Instance B), so the Dashboard no longer needs its own learner dropdown. Remove the inline `<Select>` component for learner selection.

### LessonView Redesign Specifications

Replace the current layout (header buttons + narrative + sidebar) with a clear **3-step guided flow**:

```
┌──────────────────────────────────────────────┐
│ 📖 Lesson: In the Beginning                 │
│ Topic: Creation, Babel & the Table of Nations│
├──────────────────────────────────────────────┤
│                                              │
│  Step 1: PREPARE                             │
│  ┌────────────────────────────────────────┐  │
│  │ Read the lesson text adapted for       │  │
│  │ Amara's level (Picture Book).          │  │
│  │                                        │  │
│  │ [📖 Read Lesson]                       │  │
│  │                        ✓ Completed     │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Step 2: LEARN  ⭐ RECOMMENDED              │
│  ┌────────────────────────────────────────┐  │
│  │ Watch the interactive narrated lesson  │  │
│  │ with maps and animations.              │  │
│  │                                        │  │
│  │ [▶ Start Live Lesson]  ← BIG PRIMARY   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Step 3: PROVE                               │
│  ┌────────────────────────────────────────┐  │
│  │ Take an oral exam with AI. Parent      │  │
│  │ reviews the assessment.                │  │
│  │                                        │  │
│  │ [🎤 Start Oral Exam]                   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ── Key Dates ──  ── Key Figures ──          │
│  (collapsible reference sections below)      │
└──────────────────────────────────────────────┘
```

- **Step 2 (Live Lesson)** should be visually dominant — larger card, primary color border, recommended badge.
- **Step 3 (Oral Exam)** should indicate it requires parent presence ("Sit with your child for this step").
- Key Dates and Key Figures move to collapsible sections at the bottom, not a sidebar.
- Remove the raw narrative display from LessonView — reading happens in ReadingView (`/read/:lessonId`).
- Remove the "Mark Complete" button from LessonView — completion is tracked per-step (reading done, lesson watched, exam passed).

### Design Guidelines
- Use semantic tokens throughout. No hardcoded colors.
- Cards should use `bg-card`, borders `border-border/50`.
- Primary CTAs use `bg-primary text-primary-foreground`.
- Step indicators: use numbered circles or checkmarks for completion state.
- Responsive: single column on mobile, the 3-step flow stacks vertically (it already should, since it's vertical by design).

---

## Instance D — Pre-Generate Content & Fix Markdown Rendering (Tasks 10.5 + 10.7)

### Goal
1. Create a script to pre-generate all band adaptations at seed time.
2. Remove the AI fallback from the content serving API.
3. Add markdown rendering to narrative content display.

### Files to Create/Modify

**Pre-generation:**
- **CREATE** `worker/scripts/pre-generate-content.ts` — Script that iterates all lessons × bands 0-4 and calls the adaptation engine, storing results in `Adapted_Content`.
- **MODIFY** `worker/src/lib/content/serve.ts` — Remove AI fallback. If cache miss, return master text with a flag `{ pre_generated: false }`.

**Markdown rendering:**
- **ADD DEPENDENCY** `react-markdown` (frontend)
- **MODIFY** `src/pages/LessonView.tsx` — Replace `<div className="... whitespace-pre-wrap">{lesson.narrative}</div>` with `<ReactMarkdown>{lesson.narrative}</ReactMarkdown>` styled with prose classes.
- **MODIFY** `src/components/content/AdaptedContentReader.tsx` — Same treatment for adapted text display.

### Pre-Generation Script Specifications

```typescript
// worker/scripts/pre-generate-content.ts
// Usage: npx tsx worker/scripts/pre-generate-content.ts
//
// 1. Connect to D1 (via wrangler or REST API)
// 2. Fetch all lesson IDs from Lessons table
// 3. For each lesson, for each band [0, 1, 2, 3, 4]:
//    a. Check if Adapted_Content row exists for (lesson_id, band)
//    b. If not, call the adaptation pipeline (same as serveAdaptedContent but without the HTTP layer)
//    c. Insert the result into Adapted_Content
// 4. Band 5 is always the master text — generate a row that just copies narrative_text
// 5. Log progress: "Generated band 2 for lesson abc123 (14/60)"
```

### Content API Change

In `worker/src/lib/content/serve.ts`, change the flow:

```
BEFORE:
1. Check cache → 2. If miss, call AI → 3. Cache result → 4. Return

AFTER:
1. Check cache → 2. If miss, return master text with { fallback: true } → 3. No AI call
```

This ensures zero AI latency for content reading. The pre-generation script handles populating the cache offline.

### Markdown Rendering

In LessonView, replace:
```tsx
<div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-foreground whitespace-pre-wrap">
  {lesson.narrative}
</div>
```

With:
```tsx
import ReactMarkdown from 'react-markdown';

<div className="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed text-foreground">
  <ReactMarkdown>{lesson.narrative}</ReactMarkdown>
</div>
```

Same pattern for `AdaptedContentReader.tsx`.

### Testing
- Verify: ReadingView renders bold, headings, lists, blockquotes correctly from markdown content.
- Verify: No raw `**`, `#`, `---` symbols visible in any content view.
- Verify: Content API returns pre-generated content without any Gemini API calls for reading requests.

---

## Instance E — Remove BandSelector from Content Views & Onboarding Continuity (Tasks 10.6 + 10.8)

### Goal
1. Remove the `BandSelector` toggle from ReadingView and NarratedLessonView.
2. Show a read-only band indicator instead.
3. Connect onboarding topic selection to dashboard state.

### Files to Modify
- **MODIFY** `src/pages/ReadingView.tsx` — Remove `BandSelector` import and usage. Add a read-only band badge.
- **MODIFY** `src/pages/NarratedLessonView.tsx` — Same treatment.
- **MODIFY** `src/pages/Onboarding.tsx` — On finish, save `selectedTopicId` to the family record via API.
- **MODIFY** worker route for `POST /api/family` or create `PATCH /api/family` — accept `current_topic_id` field.
- **MODIFY** `GET /api/family` response — include `current_topic_id`.

### Band Badge Component

Create a simple read-only component to replace the BandSelector:

```tsx
// src/components/content/BandBadge.tsx
import { Badge } from '@/components/ui/badge';
import { useActiveBand } from '@/lib/learnerStore';

const BAND_LABELS = ['Picture Book', 'Story Mode', 'Explorer', 'Scholar', 'Apprentice', 'University'];

export function BandBadge() {
  const band = useActiveBand();
  return (
    <Badge variant="secondary" className="text-xs">
      Reading as: {BAND_LABELS[band]} (Band {band})
    </Badge>
  );
}
```

### Onboarding → Dashboard Flow

In `Onboarding.tsx` `handleFinish()`, after creating the family and adding learners, make an additional API call:

```typescript
// After family + learner creation
await fetch(`${apiUrl}/api/family`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ current_topic_id: selectedTopicId }),
  credentials: 'include',
});
```

The Dashboard (Instance C) reads `familyData.current_topic_id` to determine which topic to highlight in the hero section and which lesson to suggest as "Continue Learning."

### Testing
- Verify: ReadingView no longer shows the 6-band toggle. Shows a badge like "Reading as: Picture Book (Band 0)".
- Verify: After onboarding, the Dashboard hero section shows the topic selected during onboarding.
- Verify: Switching learners in the header updates the band badge on ReadingView without any manual selection.

---

## Execution Order

These instances can run in parallel with the following dependency:

1. **Instance A (Learner Store)** — No dependencies. Run first or in parallel.
2. **Instance B (App Shell)** — Depends on Instance A for the learner switcher in the header.
3. **Instance C (Dashboard + Lesson Redesign)** — Depends on Instance A (reads active learner from store) and Instance B (no longer needs its own header).
4. **Instance D (Pre-gen + Markdown)** — Independent of A/B/C. Can run fully in parallel.
5. **Instance E (BandSelector removal + Onboarding)** — Depends on Instance A (uses `useActiveBand()` hook).

**Recommended parallel groups:**
- **Group 1:** Instance A + Instance D (fully independent)
- **Group 2:** Instance B + Instance E (after A completes)
- **Group 3:** Instance C (after A and B complete)
