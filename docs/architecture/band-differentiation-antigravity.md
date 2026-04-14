# Band Differentiation Implementation Plan

## Problem Statement

The Learn Live agent currently treats all 6 age bands (0–5) identically: same tools fire, same narration length, same TTS voice, same visual strategy. The `bandOverrides` field in beat manifests only swaps `contentText` — it doesn't filter tool calls, constrain narration, adjust voice, or change the delivery model. A 3-year-old and a 17-year-old receive the same canvas experience.

## Proposed Changes

### Three-Phase Delivery

| Phase | Scope | Ship Target |
|-------|-------|-------------|
| **Phase 1** | Agent-side differentiation (tool filter, narration constraints, TTS voice) | 1 week |
| **Phase 2** | Frontend delivery modes (Storybook player for 0-1, interactivity for 3+) | 2 weeks |
| **Phase 3** | Advanced pedagogy (debate mode, essay mode, comprehension scoring) | 3 weeks |

---

## Phase 1: Agent-Side Differentiation

### 1.1 Band Configuration Module

#### [NEW] [bandConfig.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/bandConfig.ts)

A single source of truth for all band-specific parameters. This replaces scattered `if (band <= 1)` checks with a declarative config object.

```typescript
export interface BandProfile {
  band: number;
  label: string;
  ages: string;

  // ── Narration Constraints ──
  narration: {
    maxWordsPerBeat: number;
    maxSentenceLength: number;  // words per sentence
    vocabularyLevel: 'concrete-only' | 'simple' | 'moderate' | 'academic' | 'theological';
    toneDirective: string;     // injected into narration prompt
    useSecondPerson: boolean;  // "you" vs "we" vs third-person
  };

  // ── Tool Filtering ──
  tools: {
    allowed: string[];         // whitelist of tool names
    blocked: string[];         // explicit blacklist
    maxTimelineEvents: number;
    maxGenealogyNodes: number;
    maxComparisonPoints: number;
    simplifyScripture: boolean; // strip etymology, shorten text
  };

  // ── TTS ──
  tts: {
    voiceName: string;         // Gemini TTS voice
    speakingRate: number;      // 0.8 = slower, 1.2 = faster
    maxChunkChars: number;     // shorter chunks for younger bands
  };

  // ── Visual Strategy ──
  visuals: {
    imagePercent: number;      // % of beats that should be image scenes
    mapPercent: number;
    overlayPercent: number;
    transcriptMaxPercent: number;
    preferStorybook: boolean;  // prefer storybook/ images over illustration/
  };

  // ── Interactivity ──
  interactivity: {
    liveQAEnabled: boolean;
    raiseHandEnabled: boolean;
    comprehensionChecks: boolean;
    questionTypes: ('rhetorical' | 'reflection' | 'check' | 'debate' | 'essay')[];
    debateBoxEnabled: boolean;
    essayModeEnabled: boolean;
  };

  // ── Delivery Model ──
  delivery: {
    mode: 'storybook' | 'canvas';
    tapToAdvance: boolean;      // storybook: tap for next page
    autoAdvance: boolean;       // canvas: auto-advance beats
    interBeatDelayMs: number;
  };
}
```

The concrete values per band:

| Parameter | Band 0 (3-4) | Band 1 (5-6) | Band 2 (7-8) | Band 3 (9-11) | Band 4 (12-14) | Band 5 (15-17+) |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **maxWordsPerBeat** | 40 | 60 | 100 | 150 | 200 | 280 |
| **maxSentenceLength** | 8 | 10 | 14 | 18 | 22 | 30 |
| **vocabularyLevel** | concrete-only | simple | moderate | academic | academic | theological |
| **voiceName** | Puck | Kore | Kore | Charon | Charon | Charon |
| **speakingRate** | 0.85 | 0.9 | 0.95 | 1.0 | 1.05 | 1.1 |
| **maxTimelineEvents** | 0 | 2 | 4 | 6 | 10 | 15 |
| **maxGenealogyNodes** | 3 | 4 | 5 | 8 | 12 | 20 |
| **maxComparisonPoints** | 0 | 0 | 3 | 4 | 5 | 6 |
| **imagePercent** | 90 | 80 | 60 | 50 | 40 | 30 |
| **mapPercent** | 0 | 5 | 15 | 20 | 25 | 25 |
| **overlayPercent** | 10 | 15 | 20 | 25 | 30 | 40 |
| **transcriptMaxPercent** | 0 | 0 | 5 | 5 | 5 | 5 |
| **delivery mode** | storybook | storybook | canvas | canvas | canvas | canvas |
| **liveQAEnabled** | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| **comprehensionChecks** | ✗ | ✗ | ✓ (simple) | ✓ | ✓ | ✓ |
| **debateBoxEnabled** | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |

---

### 1.2 Tool Filtering in BeatSequencer

#### [MODIFY] [beatSequencer.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/beatSequencer.ts)

**What changes:**
- Import `getBandProfile` from `bandConfig.ts`
- In `prepareBeat()` (line 144), after building `toolCalls` from `beat.toolSequence` (line 191), run them through a new `filterToolsForBand()` function
- Transform tool args to respect band limits (truncate timeline events, simplify genealogy, etc.)

```typescript
// New function in beatSequencer.ts or extracted to toolFilter.ts
function filterToolsForBand(toolCalls: ToolCall[], profile: BandProfile): ToolCall[] {
  return toolCalls
    .filter(t => !profile.tools.blocked.includes(t.tool))
    .filter(t => profile.tools.allowed.length === 0 || profile.tools.allowed.includes(t.tool))
    .map(t => {
      // Truncate timeline events
      if (t.tool === 'show_timeline' && t.args.events) {
        t.args.events = t.args.events.slice(0, profile.tools.maxTimelineEvents);
      }
      // Truncate genealogy nodes
      if (t.tool === 'show_genealogy' && t.args.nodes) {
        t.args.nodes = t.args.nodes.slice(0, profile.tools.maxGenealogyNodes);
      }
      // Truncate comparison points
      if (t.tool === 'show_comparison') {
        if (t.args.columnA?.points) t.args.columnA.points = t.args.columnA.points.slice(0, profile.tools.maxComparisonPoints);
        if (t.args.columnB?.points) t.args.columnB.points = t.args.columnB.points.slice(0, profile.tools.maxComparisonPoints);
      }
      // Strip etymology from key terms for young bands
      if (t.tool === 'show_key_term' && profile.tools.simplifyScripture) {
        delete t.args.etymology;
        delete t.args.pronunciation;
      }
      return t;
    });
}
```

**Concrete tool whitelists per band:**

| Tool | B0 | B1 | B2 | B3 | B4 | B5 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|
| `set_scene` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `show_slide` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `show_key_term` | ✓* | ✓* | ✓ | ✓ | ✓ | ✓ |
| `show_scripture` | ✓* | ✓ | ✓ | ✓ | ✓ | ✓ |
| `show_question` | ✗ | ✗ | ✓ (rhetorical only) | ✓ | ✓ | ✓ |
| `show_timeline` | ✗ | ✓ (≤2) | ✓ (≤4) | ✓ (≤6) | ✓ | ✓ |
| `show_genealogy` | ✓ (≤3) | ✓ (≤4) | ✓ (≤5) | ✓ | ✓ | ✓ |
| `show_comparison` | ✗ | ✗ | ✓ (≤3) | ✓ | ✓ | ✓ |
| `show_quote` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| `show_figure` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `zoom_to` / map tools | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `clear_canvas` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `dismiss_overlay` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

\* = simplified (no etymology, shorter text)

---

### 1.3 Narration Prompt Constraints

#### [MODIFY] [historyExplainerTools.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/historyExplainerTools.ts)

**What changes to `buildNarrationPrompt()` (line 382):**

Replace the generic `"Narrate this for age-band ${band}"` instruction with concrete, per-band constraints from the config:

```typescript
// Injected into every narration prompt based on band profile
function buildNarrationConstraints(profile: BandProfile): string {
  const { narration } = profile;
  return `
NARRATION CONSTRAINTS (STRICT — DO NOT EXCEED):
- Maximum ${narration.maxWordsPerBeat} words for this beat.
- Maximum ${narration.maxSentenceLength} words per sentence.
- Vocabulary level: ${narration.vocabularyLevel}.
${narration.vocabularyLevel === 'concrete-only' ? '- Use ONLY concrete nouns and simple action verbs. No abstract concepts.\n- Relate everything to things a 3-year-old can see, touch, or feel.' : ''}
${narration.vocabularyLevel === 'simple' ? '- Define any word a 6-year-old might not know inline.\n- Use storytelling structure: "Once, there was... And then... Because of that..."' : ''}
${narration.vocabularyLevel === 'moderate' ? '- Introduce 1-2 new vocabulary words per beat, defined in context.\n- Begin connecting cause and effect explicitly.' : ''}
${narration.vocabularyLevel === 'academic' ? '- Use precise historical and theological terminology.\n- Expect the student to handle multi-clause sentences.' : ''}
${narration.vocabularyLevel === 'theological' ? '- Full theological vocabulary. Reference covenants, providence, typology.\n- Engage with historiographic debates. Cite primary sources.' : ''}
- ${narration.toneDirective}
`;
}
```

**Concrete tone directives per band:**

| Band | Tone Directive |
|------|---------------|
| 0 | "Speak warmly but with energy, like a beloved uncle telling a story. Use exclamations! Use repetition for emphasis. Address the child directly." |
| 1 | "Tell a vivid story with characters and dialogue. Use sensory language — what people saw, heard, felt. Build suspense." |
| 2 | "Narrate with clear structure: what happened, why it matters, what came next. Begin using 'because' and 'as a result' connectors." |
| 3 | "Teach with authority. Pose questions and then answer them. Make causal chains explicit: 'Because X happened, Y followed.'" |
| 4 | "Analyze patterns across events. Compare and contrast. Challenge the student: 'Notice how this mirrors what we saw in...'" |
| 5 | "Engage as a scholarly equal. Present evidence, weigh interpretations, and invite critical thinking. Reference historiographic debates." |

**What changes to `buildHistoryExplainerPrompt()` (line 246):**

Replace the crude 3-tier `if/else` (lines 252-273) with a call to `getBandProfile()` and generate band-specific system instructions dynamically, including the tool whitelist so the AI knows what tools are available for this band.

---

### 1.4 TTS Voice Differentiation

#### [MODIFY] [tts.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/tts.ts)

**What changes:**
- The `TTSService.synthesize()` method (line 31) already accepts `TTSOptions` with `voiceName` and `speakingRate`
- Currently `beatSequencer.ts` line 185 calls `this.tts.synthesize(narratedText)` with **no options** — always uses default `Charon`
- Change `BeatSequencer` constructor to accept a `BandProfile` and pass `{ voiceName, speakingRate }` to every `synthesize()` call

```typescript
// In beatSequencer.ts prepareBeat():
const audioBase64 = await this.tts.synthesize(narratedText, {
  voiceName: this.bandProfile.tts.voiceName,
  speakingRate: this.bandProfile.tts.speakingRate,
}) || '';
```

**Voice rationale:**

| Band | Voice | Rationale |
|------|-------|-----------|
| 0 | **Puck** | Warm, playful, slightly higher pitch — ideal for picture-book delivery |
| 1 | **Kore** | Clear, narrative female voice — storybook narrator feel |
| 2 | **Kore** | Same warmth, slightly faster for expanded narrative |
| 3-5 | **Charon** | Authoritative male voice matching the "commanding professor" persona |

> [!IMPORTANT]
> **Voice selection requires user testing.** Gemini TTS voice characteristics may not perfectly match these descriptions. I recommend generating a 30-second sample in each voice before committing. We could also add `voiceName` to the `BandProfile` config so parents can override per-learner.

---

### 1.5 LessonPreparer Band Awareness

#### [MODIFY] [lessonPreparer.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/lessonPreparer.ts)

**What changes:**
- Replace the local `BAND_AGE_MAP` (line 68) with the centralized `bandConfig` import
- In `phaseCombined()`, inject band-specific depth and vocabulary constraints into the AI planning prompt
- Skip Phase 4 (critique) for bands 0-2 (already done at line 113) — no change needed

---

## Phase 2: Frontend Delivery Modes

### 2.1 Storybook Player for Bands 0-1

> [!IMPORTANT]
> **Design Decision Required:** Should Bands 0-1 bypass the canvas entirely and use a dedicated Storybook player? My recommendation: **Yes, absolutely.** Here's why:
> 
> - The split-panel canvas (60% visual / 40% transcript) is cognitively inappropriate for 3-6 year olds
> - These bands need **full-bleed illustrations + audio + tap-to-advance** — like a digital picture book
> - The overlay system (scripture cards, timelines, comparisons) is meaningless for pre-readers
> - The tools that DO fire for bands 0-1 (set_scene image, show_slide, show_figure) can be re-mapped to page transitions in a simpler player

#### [NEW] [StoryBookPlayer.tsx](file:///home/mwesigwaanthony/Documents/Github/learn-live/src/components/session/StoryBookPlayer.tsx)

A full-screen, immersive picture-book experience:

- **Full-bleed illustration** fills the entire viewport
- **Audio plays automatically** (narration for the page)
- **Large, simple text** overlaid at the bottom in a semi-transparent bar (like a picture book caption)
- **Tap/click anywhere to advance** to the next page (or auto-advance when audio ends)
- **No overlays, no transcript panel, no map panel, no controls except back arrow and pause**
- **Page turn animation** (swipe or dissolve)
- **Progress dots** at the bottom showing current page

```
┌──────────────────────────────────────┐
│                                      │
│          [FULL-BLEED IMAGE]          │
│                                      │
│                                      │
│                                      │
│──────────────────────────────────────│
│  "God made the whole world, and      │
│   it was very, very good."           │
│                            ● ● ○ ○   │
└──────────────────────────────────────┘
```

#### [MODIFY] [SessionCanvas.tsx](file:///home/mwesigwaanthony/Documents/Github/learn-live/src/components/session/SessionCanvas.tsx)

Add a delivery mode gate at the top of the component:

```tsx
const profile = getBandProfile(band);

if (profile.delivery.mode === 'storybook') {
  return <StoryBookPlayer chapterId={chapterId} band={band} onExit={onExit} />;
}

// ... existing canvas code
```

#### [MODIFY] [beatSequencer.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/beatSequencer.ts)

For storybook mode, the beat payload shape changes slightly:

```typescript
// Storybook beats emit a simpler payload:
{
  type: 'storybook_page',
  beatId: string,
  text: string,        // Short caption (40-60 words max)
  audioData: string,   // Base64 TTS
  imageUrl: string,    // Full-bleed illustration
  pageNumber: number,
  totalPages: number,
}
```

The sequencer already handles this — we just need the frontend `StoryBookPlayer` to listen for `storybook_page` messages instead of `beat_payload`.

---

### 2.2 Interactivity Spectrum

#### [MODIFY] [historySessionController.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/historySessionController.ts)

Expand beyond the current binary `canAcceptRaiseHand()` gating:

| Band | Interaction Pattern | Implementation |
|------|-------------------|----------------|
| 0 | **Tap to advance** — No other interaction | Frontend only (StoryBookPlayer) |
| 1 | **Tap to advance** + **"Tap the picture"** prompts | Frontend only (StoryBookPlayer with hotspots) |
| 2 | **Comprehension checks** — Simple "yes/no" or "pick the right answer" after key beats | New `show_comprehension_check` tool |
| 3 | **Raise Hand Q&A** + **Comprehension checks** (short-answer) | Existing + new tool |
| 4 | **All of Band 3** + **Debate Box** — "Present your argument for/against..." | New `show_debate_prompt` tool |
| 5 | **All of Band 4** + **Essay Mode** — "Write a 200-word reflection" | New `show_essay_prompt` tool |

#### [NEW] New interaction tools to add to [historyExplainerTools.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/historyExplainerTools.ts)

```typescript
// Band 2+ comprehension check
{
  name: 'show_comprehension_check',
  description: 'Display a quick comprehension check question with multiple choices.',
  parameters: {
    type: 'OBJECT',
    properties: {
      question: { type: 'STRING' },
      choices: { type: 'ARRAY', items: { type: 'STRING' } },
      correctIndex: { type: 'NUMBER' },
      explanation: { type: 'STRING' },
    },
    required: ['question', 'choices', 'correctIndex'],
  },
}

// Band 4+ debate prompt
{
  name: 'show_debate_prompt',
  description: 'Present a debate topic with two positions for the student to argue.',
  parameters: {
    type: 'OBJECT',
    properties: {
      topic: { type: 'STRING' },
      positionA: { type: 'STRING' },
      positionB: { type: 'STRING' },
      evidence: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['topic', 'positionA', 'positionB'],
  },
}

// Band 5+ essay prompt
{
  name: 'show_essay_prompt',
  description: 'Present an essay writing prompt with scaffolding guidelines.',
  parameters: {
    type: 'OBJECT',
    properties: {
      prompt: { type: 'STRING' },
      wordCount: { type: 'NUMBER' },
      guidelines: { type: 'ARRAY', items: { type: 'STRING' } },
      sources: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['prompt', 'wordCount'],
  },
}
```

---

### 2.3 Frontend Overlay Rendering for New Tools

#### [MODIFY] [CanvasOverlays.tsx](file:///home/mwesigwaanthony/Documents/Github/learn-live/src/components/canvas/CanvasOverlays.tsx)

Add new overlay renderers:
- `ComprehensionCheckOverlay` — Multiple-choice card with tap-to-answer, shows ✓/✗ feedback
- `DebatePromptOverlay` — Split card with two positions, student can tap to select and type their argument
- `EssayPromptOverlay` — Full-screen writing prompt with text area

#### [MODIFY] [SessionCanvas.tsx](file:///home/mwesigwaanthony/Documents/Github/learn-live/src/components/session/SessionCanvas.tsx)

Wire up `handleAgentToolCall` for the three new tools, similar to existing overlay handling.

---

## Phase 3: Advanced Pedagogy

### 3.1 Comprehension Check Scoring

#### [NEW] [comprehensionTracker.ts](file:///home/mwesigwaanthony/Documents/Github/learn-live/agent/src/comprehensionTracker.ts)

Track student responses to comprehension checks within a session:

- Store correct/incorrect count
- If student gets < 50% correct, dynamically slow down narration and add more scaffolding
- Report scores to the worker API for parent dashboard visibility

### 3.2 Debate Box (Band 4+)

When `show_debate_prompt` fires:
1. Sequencer pauses
2. Student types or speaks their argument
3. LiveQAHandler evaluates the argument against the evidence provided
4. AI responds with feedback and the lesson resumes

### 3.3 Essay Mode (Band 5+)

When `show_essay_prompt` fires:
1. Sequencer pauses
2. Student writes in a text area (no word limit timer, but suggested word count shown)
3. On submit, the essay is sent to Gemini for formative feedback
4. Feedback displayed, lesson resumes

---

## Visual Strategy Summary

The recommended visual composition per band:

```
Band 0: ████████████████████░░ 90% image, 10% simple overlay (key term)
Band 1: ████████████████░░░░░ 80% image, 15% slide, 5% timeline
Band 2: ████████████░░░░░░░░ 60% image, 15% map, 20% overlay, 5% transcript
Band 3: ██████████░░░░░░░░░░ 50% image, 20% map, 25% overlay, 5% transcript
Band 4: ████████░░░░░░░░░░░░ 40% image, 25% map, 30% overlay, 5% transcript
Band 5: ██████░░░░░░░░░░░░░░ 30% image, 25% map, 40% overlay, 5% transcript
```

This is enforced via the system prompt in `buildHistoryExplainerPrompt()`, not via code filtering — the AI uses the percentages as guidance for choosing which tools to fire.

---

## Open Questions

> [!IMPORTANT]
> **Q1: Storybook player scope.** Should the StoryBookPlayer support *only* pre-rendered storybook images from `imageRegistry.ts`, or should it also accept AI-generated images in real-time? Pre-rendered is simpler and faster but requires every chapter to have band-specific storybook art.

> [!WARNING]
> **Q2: Voice testing.** The Gemini TTS voice names (Puck, Kore, Charon) were selected based on descriptions, but I haven't heard them in context. Should we add a voice preview feature to the parent dashboard so families can pick their preferred narrator voice?

> [!IMPORTANT]
> **Q3: Band 2 delivery mode.** Band 2 (ages 7-8) is on the border. Should they get the full canvas, or a simplified canvas without the transcript panel (visual-only + audio)? The current plan puts them on the full canvas, but 7-year-olds may be overwhelmed by the split view.

> [!IMPORTANT]
> **Q4: `bandOverrides` in manifests.** Currently beats only override `contentText` per band. Should we also support `toolSequenceOverrides` per band in the JSON manifests? This would let manifest authors specify entirely different tool sequences for different bands (e.g., Band 0 gets `set_scene(image)` while Band 4 gets `set_scene(map) + show_comparison`). The alternative is leaving tool selection to the AI via prompt guidance.

---

## Verification Plan

### Automated Tests

```bash
# Unit tests for tool filtering
cd agent && npx jest --testPathPattern=bandConfig.test.ts

# Unit tests for narration constraint injection
cd agent && npx jest --testPathPattern=narrationPrompt.test.ts

# Integration test: run sequencer with ch01_s01 for each band, verify:
#   - Band 0 emits no timeline/comparison/quote tools
#   - Band 0 narration < 40 words per beat
#   - Band 5 narration uses theological vocabulary
cd agent && npx jest --testPathPattern=bandDifferentiation.integration.test.ts
```

### Manual Verification

1. **Browser test**: Start a lesson as Band 0 — verify StoryBookPlayer renders (Phase 2)
2. **Browser test**: Start a lesson as Band 3 — verify full canvas with Raise Hand enabled
3. **Audio test**: Compare TTS output for Band 0 (Puck, 0.85x) vs Band 5 (Charon, 1.1x)
4. **Content test**: Log narration word counts for 7 beats × 6 bands and verify they fall within constraints
5. **Tool test**: Log filtered tool calls for each band and verify whitelist/truncation rules apply
