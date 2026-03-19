# Phase 13B: Pronunciation Dictionary — Chunked Jules Prompts

> **Type:** Heavy content extraction task. 9 chapters of proper nouns need phonetic mappings.
> **Strategy:** Work in batches of 3 chapters per Jules instance. 3 batches total.
> **Output:** A single growing JSON file at `src/data/pronunciation.json`

---

## CRITICAL INSTRUCTIONS FOR ALL INSTANCES

### Documentation Requirements
Every Jules instance MUST:
- Update `.antigravity/logs/phase13b_pronunciation_progress.md`
- Log every name added, the chapter source, and any pronunciation decisions
- Pass the Handoff Prompt to the owner for the next instance

### Pronunciation Dictionary Specification

The file at `src/data/pronunciation.json` is a flat JSON object mapping proper nouns to objects:

```json
{
  "Mizraim": {
    "phonetic": "miz-RAY-im",
    "ssml": "<phoneme alphabet=\"ipa\" ph=\"mɪzˈreɪɪm\">Mizraim</phoneme>",
    "language_origin": "Hebrew",
    "chapter_first_appears": 1
  },
  "Taharqa": {
    "phonetic": "tah-HAR-kah",
    "ssml": "<phoneme alphabet=\"ipa\" ph=\"tɑːˈhɑːrkɑː\">Taharqa</phoneme>",
    "language_origin": "Egyptian/Cushitic",
    "chapter_first_appears": 3
  }
}
```

### Source Material
- Chapter texts are at `docs/curriculum/history/my-first-textbook/chapter_{NN}/`
- Map specs at `docs/curriculum/history/Maps/map_{NNN}_*.md` contain additional names
- Existing seed at `src/data/pronunciation.json` (if it exists — check first, don't overwrite)

### Extraction Rules
1. Extract ALL proper nouns: people, places, ethnic groups, kingdoms, cities, rivers, mountains
2. Skip common English words even if capitalized (e.g., "The", "God", "Bible")
3. Skip names with obvious English pronunciation (e.g., "Egypt", "Moses", "David")
4. INCLUDE names from: Hebrew, Arabic, Egyptian, Cushitic, Ge'ez, Bantu, Berber, Greek, Latin origins
5. For disputed pronunciations, prefer the biblical/Semitic pronunciation over the modern English academic convention
6. Alphabetize entries within the JSON

---

## BATCH A — Chapters 1–3

### Steps
1. Read all chapter content files in `docs/curriculum/history/my-first-textbook/chapter_01/` through `chapter_03/`
2. Read map specs for maps referenced in those chapters
3. Extract all proper nouns
4. Research/determine phonetic pronunciation for each
5. Generate IPA for SSML tags
6. Create or update `src/data/pronunciation.json`
7. Log to `.antigravity/logs/phase13b_pronunciation_progress.md`

### Handoff Prompt for Next Instance (Batch B)

```
## Context
You are continuing Phase 13B: Pronunciation Dictionary for Learn Live.
Batch A (chapters 1–3) has been completed.

Read:
1. `.antigravity/prompts-phase13-pronunciation.md` — Full spec
2. `.antigravity/logs/phase13b_pronunciation_progress.md` — Previous progress
3. `src/data/pronunciation.json` — Current dictionary (DO NOT overwrite, only append new entries)

Your task: Complete BATCH B (chapters 4–6). Add entries for all new proper nouns not already in the dictionary.
After completing, provide the Handoff Prompt for Batch C.
Document everything.
```

---

## BATCH B — Chapters 4–6

### Handoff Prompt for Batch C (Final)

```
## Context
You are continuing Phase 13B: Pronunciation Dictionary for Learn Live.
Batches A–B (chapters 1–6) have been completed.

Read the prompts file, progress log, and current dictionary.
Your task: Complete BATCH C (chapters 7–9, FINAL BATCH).
After completing, mark Phase 13B as COMPLETE in `.antigravity/progress.md`.
Do NOT provide a handoff prompt — this is the last batch.
```

---

## BATCH C — Chapters 7–9 (Final)

### Final Steps
- Verify dictionary has no duplicate keys
- Alphabetize all entries
- Log final count and summary
- Mark Phase 13B as ✅ COMPLETE in `.antigravity/progress.md`
