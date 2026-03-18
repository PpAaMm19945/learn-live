

# Phase 15: Visual Identity Overhaul

Based on your design direction document, this is a systematic plan to replace the current generic SaaS aesthetic with the culturally grounded Learn Live identity. The document specifies a clear priority order — we follow it.

---

## Phase 15A: Foundation (Highest Impact, Fewest Lines)

These changes transform the entire app's character before any component is touched.

### 1. Fonts — Replace Inter with Instrument Serif + DM Sans + DM Mono

**`index.html`**: Add Google Fonts link:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

**`tailwind.config.ts`**: Add font families to `theme.extend`:
```
fontFamily: {
  display: ['"Instrument Serif"', 'Georgia', 'serif'],
  sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
  mono: ['"DM Mono"', '"Courier New"', 'monospace'],
}
```

**`src/index.css`**: Change `font-family` on body from `'Inter'` to `'"DM Sans"'`. Set `line-height: 1.6`.

### 2. Colours — Replace Google Blue / White with the African Palette

**`src/index.css`** — Replace all `:root` CSS variables:

| Token | Old | New (HSL) | Hex |
|---|---|---|---|
| `--background` | white | `42 47% 90%` | #F5ECD7 (Papyrus) |
| `--foreground` | dark charcoal | `233 27% 14%` | #1A1A2E (Night Ink) |
| `--card` | faint gray | `40 33% 96%` | #FAF7F2 (Cream) |
| `--primary` | Google Blue | `19 65% 47%` | #C4622D (Laterite) |
| `--accent` | faint blue | `37 74% 56%` | #E8A838 (Amber) |
| `--destructive` | red | `4 62% 46%` | #C0392B (Ochre Red) |
| `--muted-foreground` | gray | `20 18% 37%` | #7A5C44 (Umber) |
| `--secondary` | light gray | `20 22% 27%` | #5C3D2E (Dark Earth) |
| `--border` | subtle gray | `0 0% 83%` | #D4D4D4 (Stone) |

Update sidebar variables to match (Papyrus background, Laterite primary, Umber text).

Also update the `.dark` theme for the Witness/Exam screens:
- `--background`: Void `#0D0D0D`
- `--accent`: Amber `#E8A838`

### 3. Border Radius Scale

**`src/index.css`**: Change `--radius` from `0.5rem` to `0.75rem` (12px — "relaxed" for primary cards).

**`tailwind.config.ts`**: Add explicit radius tokens:
```
borderRadius: {
  none: '0',
  tight: '4px',
  DEFAULT: '8px',
  relaxed: '12px',
  full: '9999px',
}
```

### 4. Spacing & Max Width

**`tailwind.config.ts`**: Change container max-width from `1400px` to `1200px`.

---

## Phase 15B: Typography Application

Apply the three-font system across existing components. No layout changes — just font swaps.

### Files to modify:
- **AppShell.tsx** — "Learn Live" wordmark: `font-display` class. All labels: already `font-sans` (DM Sans is now the default).
- **AppSidebar.tsx** — Wordmark: `font-display text-xl`. Nav items stay sans.
- **Dashboard.tsx** — Section headings, topic titles, lesson names: `font-display`. Metadata (era, band, time): `font-sans text-sm font-medium`.
- **LessonView.tsx** — Lesson title: `font-display text-3xl`. Step labels: `font-display text-xl`. Body: `font-sans`.
- **ReadingView.tsx** — Lesson title: `font-display`. Body prose inherits `font-sans`.
- **AdaptedContentReader.tsx** — Reading time metadata: `font-sans text-sm`. Prose body: `font-sans`.
- **BandBadge.tsx** — `font-sans text-xs font-medium tracking-wider uppercase`.
- **ExamView.tsx** — Status HUD: `font-mono`. Timestamps: `font-mono text-xs`.

### Type rules enforced:
- Display (Instrument Serif): never below 18px. Used for titles and names only.
- Line height: 1.6 body, 1.1 display. Apply via Tailwind `leading-tight` / `leading-relaxed`.
- Max prose width: `max-w-prose` (65ch) on all reading content.

---

## Phase 15C: Component Reskinning

### 1. App Shell & Sidebar
- Sidebar background: Papyrus (no border — disappears into page). Active item: Laterite left bar (4px `border-l-4 border-primary`) + Night Ink text. Remove `bg-sidebar-accent` highlight, use left-bar only.
- Mobile bottom nav: Cream background. Laterite active icon. `font-sans text-xs font-medium`.
- Header: Solid Papyrus. Remove `backdrop-blur-xl` and glassmorphism (`bg-card/60`). Replace with `bg-background`.

### 2. Lesson & Topic Cards (Dashboard)
- Background: Cream. Left accent bar: 4px `border-l-4` colour-coded by era.
- Title: `font-display text-lg`. Metadata: `font-sans text-xs font-medium text-muted-foreground`.
- Remove all `shadow` classes. Depth comes from background contrast only.
- Card entrance: stagger animation — each card fades + rises 12px over 300ms, 40ms stagger.

### 3. Band Badges — Colour-Coded
Update `BandBadge.tsx` with per-band colours:

| Band | Fill | Text |
|---|---|---|
| 0 | Amber #E8A838 | Night Ink #1A1A2E |
| 1 | Laterite #C4622D | Cream #FAF7F2 |
| 2 | Dark Earth #5C3D2E | Papyrus #F5ECD7 |
| 3 | Umber #7A5C44 | Cream #FAF7F2 |
| 4 | Charcoal #3A3A3A | Amber #E8A838 |
| 5 | Void #0D0D0D | Amber #E8A838 |

### 4. Prepare / Learn / Prove Flow (LessonView)
- Connecting timeline line: Laterite coloured.
- Step numbers: `font-display text-2xl`.
- Step 2 (Learn) card: Laterite left border, slightly larger.

### 5. Elevation
- Remove all `shadow-*` classes from cards across the app. Depth = Papyrus bg vs Cream card surfaces.
- One exception: Witness screen amber glow (`shadow-[0_0_80px_rgba(232,168,56,0.4)]`).

---

## Phase 15D: Language & Tone Cleanup

### Terminology renames across all components:
- "Evidence Witness" → "The Witness"
- "Explainer Canvas" → "The Session"
- "Requires Revision" → "Send Back"
- "Approve (Unlock Next)" → "Witness Approved"

### Tone fixes:
- Error states: Remove "Oops!" language. Use direct, warm statements.
- Empty states: Remove emoji. Use typographic weight.
- Judgment complete: "Amara's lesson has been approved." Not "Great job!"

### Files to audit: ExamView, ParentReviewModal, NarratedLessonView, Dashboard, any toast messages.

---

## Phase 15E: Motion (Polish)

### CSS keyframes to add in `src/index.css`:

1. **Card entrance stagger**: `@keyframes card-enter { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }` — 300ms ease-out, 40ms stagger via `animation-delay` utility.

2. **Awaiting judgment pulse**: `@keyframes judgment-pulse { 0%, 100% { border-color: #E8A838 } 50% { border-color: rgba(232,168,56,0.3) } }` — 2s ease-in-out infinite, applied to left accent bar of pending cards.

3. Onboarding page slide: Adjust existing framer-motion to 350ms ease-out.

4. Remove: Any pulsing skeleton animations. Use static skeleton blocks.

---

## Execution Strategy

The document's own priority order:

1. **Phase 15A** (Foundation) — Single prompt. Fonts + colours + radius + spacing. Transforms everything immediately.
2. **Phase 15B** (Typography) — Single prompt. Apply `font-display` / `font-sans` / `font-mono` across all components.
3. **Phase 15C** (Components) — Can be split into 2 prompts: (C1: Shell + Cards + Badges) and (C2: Lesson flow + elevation cleanup).
4. **Phase 15D** (Language) — Single prompt. Find-and-replace terminology + tone audit.
5. **Phase 15E** (Motion) — Single prompt. CSS keyframes + animation classes.

**Parallel groups:**
- Group 1: 15A (standalone, no dependencies)
- Group 2: 15B + 15D (parallel — typography and language are independent)
- Group 3: 15C + 15E (after 15A completes — need new colours/fonts in place)

