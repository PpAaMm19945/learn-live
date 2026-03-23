# 🎓 Learn Live — Biblical African History AI Tutor

**One deeply researched African History source, AI-adapted for any age.**

[![Cloudflare Workers](https://img.shields.io/badge/Edge-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloud Run](https://img.shields.io/badge/Agent-Google%20Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

---

## 💡 What Is This?

Learn Live is a supplementary African History course designed for homeschool families. A single 9-chapter, university-level textbook is AI-adapted into 6 age-appropriate bands (ages 3–18+).

A parent who starts a child at Band 0 (age 3) and continues through Band 5 (age 17) uses this product for 14 years on the same core content. Only the vocabulary, length, and visual style change. Never the theology, never the facts.

Written from a 1689 Reformed Baptist perspective with Young Earth Creation (YEC) chronology. Conventional dates are provided transparently for reference.

### Core Principles

- 🏛️ **Parental Sovereignty** — Parents observe and guide; AI does not auto-advance or act as a gatekeeper.
- 🎓 **Age-Appropriate by Default** — Band is set once per child, and the curriculum adapts automatically.
- 🌍 **Interactive Teaching Canvas** — A live, programmable vector map (MapLibre GL JS) controlled by the AI narrator as it teaches.
- 📖 **Theological Guardrails** — Scripture references and biblical chronology are foundational and never downplayed.
- 🔒 **Privacy by Design** — Per-family evidence isolation and custom JWT sessions.

---

## 🏗️ Architecture

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | React 18 · Vite · Tailwind CSS · Zustand | Deployed to Cloudflare Pages |
| **Data** | Cloudflare D1 (SQLite) | Families, learners, progress, sessions, curriculum |
| **Content Storage**| Cloudflare R2 | Master text, maps, audio, generated assets |
| **AI Bridge** | Google Cloud Run · Express | Gemini Live for narration & oral examination |
| **Content Engine** | Gemini 2.5 Flash | RAG-based band adaptation, quiz generation |
| **Teaching Canvas**| MapLibre GL JS | Programmable vector maps with live AI tool calls |
| **Auth** | Custom on Workers | Magic link, Google OAuth, email/password, JWT |

---

## 🚀 The Band Model

The curriculum uses learning bands (0-5) to dictate visual components and text complexity:

| Band | Ages | Label | Delivery |
|------|------|-------|----------|
| 0 | 3–5 | Picture Book | StorybookPlayer. Full-screen illustrations, read-aloud, tap to advance. |
| 1 | 6–7 | Storybook+ | StorybookPlayer with more detail, simple review questions. |
| 2 | 8–9 | Adapted Textbook | LessonPlayer. Simplified text, all visual components (map, single timeline). |
| 3 | 10–12 | Full Textbook | LessonPlayer. Unabridged text, dual timeline, full components. |
| 4 | 13–17 | Academic | LessonPlayer + ComparisonView. Socratic dialogue, debate mode. |
| 5 | 18+ | Seminar | LessonPlayer. Verbatim text, student-led seminar, essay prompts. |

---

## 📂 Project Structure

```
learn-live/
├── src/                    # Frontend React app (AppShell, Canvas, Players)
├── worker/                 # Cloudflare Worker (API, Auth, D1/R2 routing)
├── agent/                  # Cloud Run Express agent (Gemini Live WebSocket)
├── docs/                   # Curriculum content, component data, architecture docs
├── tools/                  # Developer tools (e.g., SVG aligner)
├── archive/                # Archived legacy math/english/science curriculum
└── .antigravity/           # Engineering docs (roadmap, issues, prompts, changelog)
```

---

## 🛠️ How to Run

### Prerequisites

- **Node.js** v22.22.1
- **Bun** v1.2.14
- **Wrangler CLI** (for Cloudflare Worker)
- **Google Cloud** credentials (for the Agent service)

### Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/learn-live.git
cd learn-live

# 2. Install all dependencies
bun install
cd agent && npm install --package-lock-only && cd ..
cd worker && bun install && cd ..

# 3. Configure environment files
cp .env.example .env
cp agent/.env.example agent/.env
# Fill in required variables (GEMINI_API_KEY, WORKER_API_URL, etc.)
```

### Development

The Vite dev server automatically proxies `/api` requests to the Worker and `/v1/agent/session` WebSocket connections to the Agent.

```bash
# Start frontend
npm run dev:frontend

# For full local setup, see scripts in package.json
```

### Database & Seeding

For Cloudflare D1 local setup (using Wrangler):
```bash
cd worker
wrangler d1 execute learn-live-db --local --file=../db/schema.sql
```

---

*Note: The project recently pivoted from a general-purpose math curriculum to this focused African History curriculum. Legacy math code and DAG systems are preserved in the `archive/` directory.*
