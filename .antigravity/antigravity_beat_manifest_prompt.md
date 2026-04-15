# Antigravity: Beat Manifest Generation Prompt

## Mission

You are generating structured **beat manifests** for the Learn Live curriculum — an AI-powered African History course built on a biblical framework. You will work through the textbook **one section at a time**, producing a JSON manifest that the teaching agent uses to narrate lessons.

After each section is complete, **stop and wait for Lovable + the author to audit** before proceeding to the next.

---

## Your Working Directory

All output goes to: `.antigravity/manifests/`  
Naming convention: `ch{NN}_s{NN}.json` (e.g., `ch02_s01.json`)

Also maintain a progress log at: `.antigravity/antigravity_manifest_log.md`

---

## Source Material

The canonical textbook is located at:
```
docs/curriculum/history/my-first-textbook/chapter_{NN}/chapters/Chapter_{NN}.md
```

For chapters with UPGRADED section files, prefer those:
```
docs/curriculum/history/my-first-textbook/chapter_{NN}/chapter_{NN}_section_{N}_UPGRADED.md
```

---

## Chapter & Section Map

Work through these in order. Start with **Chapter 2, Section 1**.

| Chapter | Sections to Process |
|---------|-------------------|
| 2 — Egypt: Gift of the Nile | 9 sections (## 1 through ## 9) |
| 3 — Lands of Phut | 4 sections (Intro, 3.1, 3.2, 3.3 + summary as final beat of 3.3) |
| 4 — Lands of Cush | ~6 sections (estimate from source text headings) |
| 5 — Church in Roman Africa | 8 sections (5.1 through 5.8) |
| 6 — Egypt under Rome | ~7 sections (parse from source headings) |
| 7 — Churches of the Highlands | 9 core sections (## 1 through ## 9) |
| 8 — Bantu Migrations | 8 core sections (## I through ## VIII) |
| 9 — Ethiopia Alone | ~7 sections (parse from source headings) |

---

## JSON Schema (STRICT)

Every manifest MUST conform to this exact schema. Reference the working examples in `docs/curriculum/history/ch01_s01.json` through `ch01_s05.json`.

```json
{
  "sectionId": "ch02_s01",
  "chapterId": "ch02",
  "heading": "2.1 Foundations After Babel (c. 3200–2900 BC)",
  "totalBeats": 6,
  "estimatedTotalDurationSec": 480,
  "thinkItThrough": [
    "Question 1 for student reflection?",
    "Question 2?",
    "Question 3?"
  ],
  "beats": [
    {
      "beatId": "ch02_s01_b01",
      "sectionId": "ch02_s01",
      "sequence": 1,
      "title": "Short Descriptive Title",
      "contentText": "The narration text for band 3 (default). 2-4 sentences. Must be factual, from the textbook. No speculation.",
      "sceneMode": "transcript",
      "toolSequence": [
        {
          "tool": "show_scripture",
          "args": { "reference": "Genesis 10:6", "text": "The sons of Ham: Cush, Mizraim, Phut, and Canaan." },
          "syncTrigger": "start_of_beat"
        }
      ],
      "estimatedDurationSec": 60
    }
  ]
}
```

### Beat Object Fields

| Field | Required | Rules |
|-------|----------|-------|
| `beatId` | ✅ | Format: `ch{NN}_s{NN}_b{NN}` |
| `sectionId` | ✅ | Must match parent |
| `sequence` | ✅ | 1-indexed, sequential |
| `title` | ✅ | 3-6 words, descriptive |
| `contentText` | ✅ | Band 3 (default) narration. 2-4 sentences from textbook. No hallucination. |
| `sceneMode` | ✅ | One of: `transcript`, `map`, `image`, `overlay` |
| `toolSequence` | ✅ | Array of tool calls (may be empty `[]`). Every tool must have `syncTrigger: "start_of_beat"` |
| `estimatedDurationSec` | ✅ | 45-120 seconds per beat |

### Available Tools

Use these tools in `toolSequence` as appropriate for the content:

| Tool | When to Use |
|------|-------------|
| `set_scene` | Switch visual mode. Args: `{ "mode": "map" \| "image" \| "transcript", "imageKey?": "assets/..." }` |
| `show_scripture` | Biblical references. Args: `{ "reference": "Gen 1:1", "text": "..." }` |
| `show_timeline` | Chronological events. Args: `{ "events": [{ "year": -2348, "label": "The Flood" }] }` |
| `show_key_term` | Vocabulary. Args: `{ "term": "Pharaoh", "definition": "...", "etymology?": "..." }` |
| `show_slide` | Summary bullets. Args: `{ "title": "...", "bullets": ["..."] }` |
| `zoom_to` | Map focus. Args: `{ "lat": 30.0, "lng": 31.2, "zoom": 6 }` |
| `highlight_region` | Map region. Args: `{ "regionId": "ancient_egypt" }` |
| `draw_route` | Migration/trade path. Args: `{ "points": [[lat,lng], ...], "label": "..." }` |
| `place_marker` | Map pin. Args: `{ "lat": 30.0, "lng": 31.2, "label": "Memphis", "description": "..." }` |
| `show_quote` | Historical/theological quote. Args: `{ "text": "...", "attribution": "..." }` |
| `show_question` | Check understanding. Args: `{ "type": "check" \| "reflection", "question": "...", "options?": ["..."] }` |
| `show_comparison` | Compare concepts. Args: `{ "title": "...", "points": [{ "left": "...", "right": "..." }] }` |
| `show_genealogy` | Family trees. Args: `{ "nodes": [{ "name": "...", "parent?": "..." }] }` |

---

## Content Rules (NON-NEGOTIABLE)

1. **Young Earth Creationist chronology ONLY.** Use Ussher/AiG dates. Creation ~4004 BC, Flood ~2348 BC. Never inject secular dates as authoritative.
2. **Textbook fidelity.** Every `contentText` must be drawn from or faithful to the source chapter. Do not invent historical claims.
3. **Beat length.** Keep beats short — 2-4 sentences of narration (10-20 seconds of speech). This ensures precise audio-visual sync.
4. **Tool density.** Most beats should have 1-3 tools. Don't overload. Empty `toolSequence: []` is acceptable for pure narration beats.
5. **Map beats.** When the content references a geographic location, set `sceneMode: "map"` and include `zoom_to` or `place_marker` tools. Reference existing maps from `docs/curriculum/history/Maps/`.
6. **Scripture beats.** When the textbook cites a Bible verse, always include `show_scripture`.
7. **3 thinkItThrough questions** per section — drawn from the textbook's "Think It Through" boxes or inferred from the content.
8. **No bandOverrides yet.** Leave those out for now. They will be added in a separate pass after audit.

---

## Quality Checklist (Run After Each Section)

Before submitting each section manifest, verify:

- [ ] `sectionId` and `chapterId` are correct
- [ ] `beatId` values are unique and sequential
- [ ] `totalBeats` matches actual array length
- [ ] Every `toolSequence` entry has `syncTrigger: "start_of_beat"`
- [ ] `sceneMode` is valid (`transcript`, `map`, `image`, or `overlay`)
- [ ] `estimatedTotalDurationSec` ≈ sum of individual beat durations
- [ ] No secular dates presented as authoritative
- [ ] No hallucinated historical claims
- [ ] `thinkItThrough` has exactly 3 questions
- [ ] JSON is valid (parseable)

---

## Workflow

### For each section:

1. **Read** the corresponding textbook section from the source markdown
2. **Outline** the beats — identify 5-8 natural teaching moments
3. **Draft** the JSON manifest following the schema above
4. **Validate** against the quality checklist
5. **Write** the file to `.antigravity/manifests/ch{NN}_s{NN}.json`
6. **Log** the completion in `.antigravity/antigravity_manifest_log.md`:
   ```
   ## ch02_s01 — Foundations After Babel
   - Beats: 7
   - Tools used: show_scripture, show_timeline, place_marker, zoom_to
   - Status: ✅ Ready for audit
   - Notes: [any observations]
   ```
7. **STOP.** Wait for audit confirmation before proceeding to the next section.

---

## Starting Point

Begin with: **Chapter 2, Section 1 — "Foundations After Babel"**

Source file: `docs/curriculum/history/my-first-textbook/chapter_02/chapters/Chapter_02.md`  
Look for: `## 1. Foundations After Babel (c. 3200–2900 BC, conventional estimate)`

Good luck. Produce excellent, auditable work.
