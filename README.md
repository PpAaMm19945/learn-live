# 🎓 Learn Live

**Bridging Offline Context with AI Witnessing**

> *An African-centric, faith-rooted platform that uses Google's Gemini Live API as an "Evidence Witness" — observing children perform real-world tasks through camera and microphone, while parents retain full moral authority over progression.*

[![Built with Gemini](https://img.shields.io/badge/Built%20with-Gemini%20Live%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Cloudflare Workers](https://img.shields.io/badge/Edge-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloud Run](https://img.shields.io/badge/Agent-Google%20Cloud%20Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

---

## 💡 The Concept

**Learn Live** reimagines education for contexts where structured schooling is inaccessible — starting with African households where children learn through daily life, not classrooms.

### The Problem

Millions of children develop real skills — cooking, storytelling, building things — but have **no formal way to capture and credential that growth**. Traditional ed-tech assumes a school context. Learn Live assumes a *home* context.

### The Solution

A parent defines learning tasks within a **3D Responsibility Matrix** (Domain × Capacity × Repetition Arc). When a child is ready to demonstrate mastery, they tap the **"Summon Witness"** button. The AI — powered by **Gemini Live** — observes through the device's camera and microphone in real-time, prompts the child, evaluates structured constraints, and packages the evidence into an immutable portfolio.

**But the AI never judges.** Only the parent can authorize advancement. The AI is a *Witness*, not an *Authority*.

### Core Principles

- 🏛️ **Parental Sovereignty** — AI cannot auto-advance, grade, or bypass human judgment
- 👁️ **Evidence Witnessing** — Gemini observes and logs, but holds no moral authority
- 🌍 **Offline-First Design** — Built for shared devices and low-bandwidth African contexts
- 🔒 **Privacy by Design** — Per-family evidence isolation, no cross-family data leakage

---

## 🏗️ Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | React 18 · Vite · Tailwind CSS · Zustand | Spartan learner UI + Parent Command Center |
| **Edge API** | Cloudflare Worker · D1 · R2 | Family/task/portfolio CRUD + evidence vault |
| **AI Bridge** | Google Cloud Run · Express · WebSocket | Real-time bridge to Gemini Live API |
| **AI Engine** | Gemini Live API (`@google/genai`) | Multimodal Evidence Witness (audio + video) |
| **Hosting** | Cloudflare Pages | Static frontend deployment |

### Architecture

The system uses a **Dual-Cloud Architecture** — Cloudflare handles edge data and static hosting, while Google Cloud bridges the Gemini Live API for real-time AI sessions.

> 📐 See the full sequence diagram and component details in [`docs/Architecture.md`](docs/Architecture.md)

```
┌─────────────┐     REST API      ┌───────────────────┐
│  React SPA  │ ◄──────────────► │ Cloudflare Worker  │
│  (Learner   │                  │  ┌─────┐  ┌─────┐ │
│   + Parent) │                  │  │ D1  │  │ R2  │ │
└──────┬──────┘                  │  └─────┘  └─────┘ │
       │ WebSocket               └───────────────────┘
       │                                ▲
       ▼                                │ Constraint Fetch
┌──────────────┐    Bidi Stream   ┌─────┴────────────┐
│ Cloud Run    │ ◄─────────────► │ Gemini Live API   │
│ Agent Server │                  │ (Evidence Witness)│
└──────────────┘                  └──────────────────┘
```

---

## 🚀 How to Run

### Prerequisites

- **Node.js** ≥ 18 (with npm)
- **Wrangler CLI** — `npm install -g wrangler` (for Cloudflare Worker)
- **Google Cloud** credentials (for the Agent service)

### Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/learn-live.git
cd learn-live

# 2. Install all dependencies
npm install
cd agent && npm install && cd ..
cd worker && npm install && cd ..

# 3. Configure environment files
cp .env.example .env
cp agent/.env.example agent/.env
# Fill in: GEMINI_API_KEY, WORKER_API_URL, etc.
```

### One-Command Development

```bash
npm run dev:all
```

This concurrently starts:

| Service | Port | Description |
|---------|------|-------------|
| **Vite Dev Server** | `8080` | React frontend with HMR |
| **Cloudflare Worker** | `8787` | D1/R2 edge API (via Wrangler) |
| **Agent Server** | `8081` | Cloud Run bridge (WebSocket) |

> The Vite dev server automatically proxies `/api` requests to the Worker and `/v1/agent/session` WebSocket connections to the Agent.

### Seed the Database

```bash
cd worker
wrangler d1 execute learn-live-db --local --file=../db/schema.sql
wrangler d1 execute learn-live-db --local --file=../db/seed.sql
```

---

## 🏆 Hackathon Configuration

> **Important for Judges**: The demo uses a **mocked L1 → L2 progression** to showcase the full loop within a single session.

### What's Mocked

- **Gemini Session**: The `GeminiSession` in `agent/src/gemini.ts` currently uses a mock that auto-triggers `evaluate_constraint` after 8 seconds (simulating a successful Evidence Witness observation)
- **Progression Logic**: When a parent approves a task, `advanceLearner()` activates the next stalled task in the 3D Matrix, demonstrating the L1 → L2 flow

### What's Real

- ✅ Full WebRTC camera/mic capture pipeline
- ✅ WebSocket session handshake and lifecycle management
- ✅ Constraint validation and system instruction assembly
- ✅ R2 evidence upload and D1 portfolio storage
- ✅ Parent judgment UI with evidence review
- ✅ 3D Matrix progression mechanics
- ✅ Rate limiting and session timeout controls

### Demo Flow

1. **Login** → Select Parent or Learner profile
2. **Learner** → View active tasks → Tap "Summon Witness" → Grant camera/mic → Session completes → Evidence uploaded
3. **Parent** → Review "Awaiting Judgment" items → View transcript + confidence score → Approve or Revise → Learner advances to next task

---

## 📁 Project Structure

```
learn-live/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   │   ├── learner/        # EvidenceWitness, TaskCard, Portfolio
│   │   └── parent/         # JudgmentModal, evidence review
│   ├── pages/              # Route-level pages
│   │   ├── learner/        # LearnerDashboard
│   │   └── parent/         # Parent Dashboard
│   └── lib/                # State stores, utilities, logger
├── worker/                 # Cloudflare Worker (Edge API)
│   └── src/
│       ├── index.ts        # All API endpoints
│       └── lib/r2.ts       # R2 storage helper
├── agent/                  # Cloud Run Agent (AI Bridge)
│   └── src/
│       ├── server.ts       # WebSocket server
│       ├── gemini.ts       # Gemini Live SDK wrapper
│       ├── constraints.ts  # Constraint fetcher + assembler
│       ├── validate.ts     # Constraint schema validator
│       └── rateLimit.ts    # Per-family rate limiter
├── db/
│   ├── schema.sql          # D1 table definitions
│   └── seed.sql            # Hackathon seed data
├── docs/
│   ├── Architecture.md     # System architecture + Mermaid diagram
│   ├── API_Contract.md     # Frontend ↔ Backend API contract
│   └── Matrix_Schema.md    # 3D Responsibility Matrix design
└── package.json            # Root scripts including dev:all
```

---

## 📜 License

Built for the **Google Cloud / Gemini API Hackathon 2026**.

Made with ❤️ from Kampala, Uganda.
