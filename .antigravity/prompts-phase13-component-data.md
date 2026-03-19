# Phase 13C: Component Data Extraction — Chunked Jules Prompts

> **Type:** Heavy content extraction task. Extract structured data for all 9 visual components from chapter text.
> **Strategy:** Work chapter-by-chapter. Each Jules instance does 2–3 chapters.
> **Output:** JSON data files at `docs/curriculum/history/component-data/chapter_{NN}/`

---

## CRITICAL INSTRUCTIONS FOR ALL INSTANCES

### Documentation Requirements
Every Jules instance MUST:
- Update `.antigravity/logs/phase13c_component_data_progress.md`
- Pass the Handoff Prompt to the owner for the next instance

### Data Extraction Specification

For each chapter, extract data for these component types and save as separate JSON files:

#### 1. `genealogy.json` — GenealogyTree data
```json
{
  "chapterId": "ch01",
  "title": "Table of Nations — Ham's Line",
  "nodes": [
    { "id": "noah", "name": "Noah", "parent": null, "dates": "c. 2950–2000 BC (YEC)", "descriptor": "Patriarch" },
    { "id": "ham", "name": "Ham", "parent": "noah", "dates": null, "descriptor": "Son of Noah" },
    { "id": "mizraim", "name": "Mizraim", "parent": "ham", "dates": null, "descriptor": "Father of Egypt" }
  ]
}
```

#### 2. `timeline.json` — DualTimeline events
```json
{
  "chapterId": "ch01",
  "events": [
    {
      "id": "evt_001",
      "title": "The Flood",
      "biblicalDate": "c. 2350 BC",
      "conventionalDate": "N/A (denied)",
      "description": "Global flood; Noah's family survives",
      "scriptureRef": "Genesis 7-8",
      "category": "biblical"
    }
  ]
}
```

#### 3. `scripture_refs.json` — ScriptureCard data
```json
{
  "chapterId": "ch01",
  "cards": [
    {
      "id": "sc_001",
      "reference": "Genesis 10:6",
      "text": "The sons of Ham: Cush, Mizraim, Phut, and Canaan.",
      "connection": "This verse establishes the four branches of Ham's descendants who populated Africa and the Levant.",
      "cueContext": "Shown when AI introduces Ham's sons"
    }
  ]
}
```

#### 4. `figures.json` — PortraitCard data
```json
{
  "chapterId": "ch01",
  "figures": [
    {
      "id": "fig_001",
      "name": "Nimrod",
      "title": "Empire-Builder of Shinar",
      "dates": "c. 2200 BC (YEC)",
      "quote": "He was a mighty hunter before the LORD. — Genesis 10:9",
      "summary": "Grandson of Ham through Cush. Built Babel, Erech, Akkad, and Nineveh.",
      "imageSlug": "nimrod"
    }
  ]
}
```

#### 5. `definitions.json` — DefinitionCard data
```json
{
  "chapterId": "ch01",
  "terms": [
    {
      "id": "def_001",
      "term": "Mizraim",
      "definition": "The Hebrew name for Egypt, used over 680 times in Scripture. The dual form suggests Upper and Lower Egypt were recognized as distinct regions from the earliest period.",
      "scriptureRef": "Genesis 10:6",
      "originalLanguage": { "script": "מִצְרַיִם", "transliteration": "Mitzrayim", "language": "Hebrew" }
    }
  ]
}
```

#### 6. `comparisons.json` — ComparisonView data (Bands 4–5 only)
```json
{
  "chapterId": "ch01",
  "comparisons": [
    {
      "id": "cmp_001",
      "topic": "Egyptian Pre-Dynastic Dating",
      "biblical": { "date": "c. 2200–2100 BC", "framework": "Post-Babel settlement, rapid civilization development", "evidence": "Compressed chronology based on biblical genealogies" },
      "conventional": { "date": "c. 4000–3100 BC", "framework": "Gradual development over millennia", "evidence": "C-14 dating of Naqada culture artifacts" },
      "resolution": "YEC argues C-14 dates are inflated due to post-Flood atmospheric conditions and that co-regencies compress the Egyptian king lists."
    }
  ]
}
```

### Source Material
- Chapter content at `docs/curriculum/history/my-first-textbook/chapter_{NN}/`
- Map specs for geographic/settlement data
- Extract EVERYTHING mentioned in the chapter text — don't skip minor references

---

## BATCH A — Chapters 1–3

### Steps
1. Read all content files for chapters 1–3
2. For each chapter, create the output directory: `docs/curriculum/history/component-data/chapter_{NN}/`
3. Extract all 6 data types from the chapter text
4. Save each as the corresponding JSON file
5. Log progress

### Handoff Prompt for Batch B

```
## Context
You are continuing Phase 13C: Component Data Extraction for Learn Live.
Batch A (chapters 1–3) has been completed.

Read:
1. `.antigravity/prompts-phase13-component-data.md` — Full spec
2. `.antigravity/logs/phase13c_component_data_progress.md` — Previous progress
3. One completed chapter's data (e.g., `docs/curriculum/history/component-data/chapter_01/`) — Style reference

Your task: Complete BATCH B (chapters 4–6).
After completing, provide the Handoff Prompt for Batch C.
Document everything.
```

---

## BATCH B — Chapters 4–6

### Handoff Prompt for Batch C (Final)

```
You are continuing Phase 13C. Batches A–B (chapters 1–6) done.
Complete BATCH C (chapters 7–9, FINAL). Mark Phase 13C COMPLETE.
```

---

## BATCH C — Chapters 7–9 (Final)

### Final Steps
- Verify all chapters have all 6 data files
- Log final summary with counts per chapter
- Mark Phase 13C as ✅ COMPLETE in `.antigravity/progress.md`
