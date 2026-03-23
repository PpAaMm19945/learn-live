# Learn Live

**Biblical African History AI Tutor** — One deeply researched source, AI-adapted for any age.

---

## What Is This?

Learn Live is a supplementary African History course for homeschool families. A single 9-chapter, university-level textbook is AI-adapted into 6 age-appropriate bands (ages 3–18+). A parent who starts a child at Band 0 (age 3) and continues through Band 5 (age 17) uses this product for 14 years on the same content — only vocabulary, length, and visual style change. Never the theology, never the facts.

Written from a 1689 Reformed Baptist perspective with YEC chronology. Conventional dates provided transparently for reference.

---

## Architecture

- **Frontend:** React + Vite + Tailwind → Cloudflare Pages
- **Backend:** Cloudflare Workers + D1 (SQLite) + R2 (object storage)
- **AI Agent:** Google Cloud Run (Express + Gemini Live) for narration & oral examination
- **Teaching Canvas:** MapLibre GL JS (programmable vector maps with live AI tool calls)
- **Auth:** Custom JWT sessions — magic link, Google OAuth, email/password

---

## Current Status

**Chapter 1** has full text, maps, component data (genealogy, timeline, definitions, figures), and a Band 3 lesson script. The teaching canvas is being rebuilt on MapLibre GL JS to replace the previous PNG+SVG overlay approach.

**Chapters 2–9** have full text, maps, and extracted component data. Lesson scripts and audio are pending.

---

## Detailed Engineering Roadmap

See [`.antigravity/ROADMAP.md`](.antigravity/ROADMAP.md) for the full phase-by-phase engineering plan, architecture decisions, band specifications, and theological guardrails.

---

## Repository Structure

```
src/               Frontend React app
worker/             Cloudflare Worker (API, auth, content serving)
agent/              Cloud Run Express agent (Gemini Live)
docs/               Curriculum content & architecture docs
tools/              Developer tools (SVG aligner)
archive/            Archived legacy curriculum (math/english/science)
.antigravity/       Engineering docs (roadmap, issues, prompts, changelog)
```
