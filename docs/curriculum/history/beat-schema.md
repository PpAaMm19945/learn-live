# History Curriculum: Beat Data Schema

## Overview

The `learn-live` architecture relies on a **Beat Sequencer**. Instead of giving the LLM the entire section at once, the teaching material is broken down into structured "beats." The agent will narrate one beat at a time.

This ensures the LLM stays strictly within the canonical path, allowing precise geographic/visual synchronicity without hallucinating or skipping material.

## Schema Definition

### 1. Section Level Wrapper
Each section (e.g., 1.1, 1.2) is a JSON object.

```json
{
  "sectionId": "ch01_s01",
  "chapterId": "ch01",
  "heading": "1.1 In the Beginning: God, Man, and the Meaning of History",
  "totalBeats": 6,
  "estimatedTotalDurationSec": 720,
  "thinkItThrough": [
    "What is the ultimate starting point for understanding all of history?",
    "Why does the textbook call Genesis 3 the 'fracture of creation'?",
    "How does the account of Babel set the stage for African history?"
  ],
  "beats": [ 
    // Array of Beat Objects
  ]
}
```

### 2. Beat Object Definition

```json
{
  "beatId": "ch01_s01_b01",
  "sectionId": "ch01_s01",
  "sequence": 1,
  "title": "History's True Beginning",
  "contentText": "The core paragraph(s) the AI should narrate for this beat.",
  "sceneMode": "transcript", // transcript, map, image, overlay
  "toolSequence": [
    {
      "tool": "show_scripture",
      "args": { "reference": "Genesis 1:1", "text": "In the beginning..." },
      "syncTrigger": "start_of_beat"
    },
    {
       "tool": "show_timeline",
       "args": { "events": [{ "year": -4004, "label": "Creation" }] },
       "syncTrigger": "start_of_beat"
    }
  ],
  "estimatedDurationSec": 90,
  "bandOverrides": {
    "2": { "contentText": "Simplified version for younger learners." },
    "5": { "contentText": "Full academic text with additional analysis." }
  },
  "reformedReflection": {
    "source": "askpuritans.com",
    "theologian": "Jonathan Edwards",
    "insight": "Edwards on God's sovereignty...",
    "applicationPrompt": "How does this view change how you see the Fall?"
  },
  "realLifeApplication": "Consider how brokenness manifests in your community...",
  "researchPrompt": "Research one example of the Creation-Fall-Redemption framework.",
  "homework": {
    "reading": "Westminster Shorter Catechism Q.17-19",
    "writing": "Write a 200-word reflection.",
    "discussion": "Discuss with your family..."
  }
}
```

## Schema Enforcement Rules
1. **Young Earth Timeline Anchoring:** The `show_timeline` tool MUST exclusively use Ussher/Answers-in-Genesis dates (e.g. Creation at 4004 BC, Flood at ~2348 BC). The LLM is expressly forbidden from injecting secular timeline estimates.
2. **Audio Tool Synchronization (Beat-Boundary):** Because basic TTS engines do not reliably return accurate SSML word-level timestamps alongside PCM chunks, we utilize a **Beat-Boundary** sync model for Version 1. Tools arrayed in a beat execute simultaneously at the `start_of_beat`, synchronously with the beginning of the audio playback for that beat. Beat content should be kept short (10-20 seconds) to implicitly mask minor contextual time offsets.

## Worked Example: Chapter 1, Section 1.1

> **Human Task:** Provide the complete worked example sequence (approx. 5-7 beats) for Section 1.1 combining the actual textbook content, the map tools (Babel, Mizraim, Cush, Phut), and the Reformed theological perspectives.

### Draft JSON Structure to fill:

```json
{
  "sectionId": "ch01_s01",
  "chapterId": "ch01",
  "heading": "1.1 In the Beginning: God, Man, and the Meaning of History",
  "totalBeats": 5,
  "beats": [
    {
      "beatId": "ch01_s01_b01",
      "sequence": 1,
      "title": "History's True Beginning",
      "contentText": "[Add foundational paragraph about Gen 1:1]",
      "sceneMode": "transcript",
      "reformedReflection": {
         // Add theological context
      }
    },
    // Add additional beats for The Fracture of Creation, God's Unfolding Plan, Babel, and the Sons of Ham (Mizraim, Cush, Phut, Canaan).
  ]
}
```
