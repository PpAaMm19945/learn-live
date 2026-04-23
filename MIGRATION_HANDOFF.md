# Migration Handoff Document: Learn Live Platform

This document provides a comprehensive overview of the Learn Live platform's architecture, including database schema, authentication, storage, the teaching agent logic, and API routing.

---

## 1. Database Schema (Cloudflare D1)

The following SQL schema defines the core tables for users, roles, learning progress, and session history.

```sql
-- Users and Authentication
CREATE TABLE IF NOT EXISTS Users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT,
    email_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS User_Roles (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('parent', 'learner', 'admin')),
    UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS Sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Curriculum Structure
CREATE TABLE IF NOT EXISTS Topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    era TEXT,
    region TEXT,
    display_order INTEGER,
    parent_topic_id TEXT REFERENCES Topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Lessons (
    id TEXT PRIMARY KEY,
    topic_id TEXT REFERENCES Topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    narrative_text TEXT,
    key_dates TEXT,
    key_figures TEXT,
    difficulty_band INTEGER CHECK (difficulty_band BETWEEN 1 AND 5),
    estimated_minutes INTEGER
);

CREATE TABLE IF NOT EXISTS Sources (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT,
    type TEXT CHECK (type IN ('primary', 'secondary', 'oral')),
    url TEXT,
    r2_key TEXT,
    excerpt TEXT
);

-- Adapted Content (The Textbook)
CREATE TABLE IF NOT EXISTS Adapted_Content (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    band INTEGER NOT NULL CHECK (band BETWEEN 0 AND 5),
    adapted_text TEXT NOT NULL,
    vocabulary TEXT, -- JSON array of strings
    discussion_questions TEXT, -- JSON array of strings
    essay_prompt TEXT,
    thinking_prompts TEXT, -- JSON array of strings
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(lesson_id, band)
);

-- Learning Progress and Session History
CREATE TABLE IF NOT EXISTS Learner_Progress (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    learner_id TEXT REFERENCES Learners(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER,
    started_at TEXT,
    completed_at TEXT,
    UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS Dialogue_Sessions (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'dialogue',
    duration_ms INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Family and Learner Management
CREATE TABLE IF NOT EXISTS Families (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    current_topic_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Learners (
    id TEXT PRIMARY KEY,
    family_id TEXT REFERENCES Families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date TEXT,
    band INTEGER CHECK (band BETWEEN 0 AND 5),
    created_at TEXT DEFAULT (datetime('now'))
);
```

---

## 2. Authentication Flow (Google Auth)

### Implementation
Google Auth is implemented as a standard OAuth2 flow handled by the Cloudflare Worker.

1.  **Initiation**: User clicks "Login with Google" on the frontend, redirecting to `/api/auth/google`.
2.  **Redirect**: Worker generates a signed state token and redirects the user to Google's OAuth consent screen.
3.  **Callback**: After consent, Google redirects back to `/api/auth/google/callback` with an authorization `code`.
4.  **Token Exchange**: The Worker exchanges the `code` for an `access_token` and `id_token` via Google's token endpoint.
5.  **User Info**: The Worker fetches user profile information (email, name, picture) using the `access_token`.
6.  **Upsert**: The `findOrCreateUser` logic ensures the user exists in the `Users` table, linking accounts by email if necessary.
7.  **Session Creation**: A session token (JWT) is generated, hashed and stored in the `Sessions` table, and set as a secure `HttpOnly` cookie.

### Saved Properties
Upon successful login, the following properties are saved/updated:
*   `id`: UUID
*   `email`: User's Google email
*   `name`: User's full name from Google
*   `email_verified`: Set to `1` (true)
*   Default Role: Assigned the `parent` role in `User_Roles` if it's a new account.

---

## 3. Storage & The Textbook (Cloudflare R2)

### Textbook Storage
The primary "textbook" content is stored as **JSON manifests** (referred to as "beats") in Cloudflare R2.

*   **R2 Key Format**: `beats/${chapterId}/${sectionId}.json`
*   **Content Structure**: Each manifest contains metadata for the section and an array of `Beat` objects, which include `contentText`, `sceneMode` (transcript, map, image, overlay), and a `toolSequence`.

### Retrieval Logic
Content is retrieved via the Worker API, which acts as a proxy for the R2 bucket.

**Worker Retrieval (`worker/src/routes/content.ts`):**
```typescript
const objectKey = `beats/${chapterId}/${sectionId}.json`;
const object = await env.ASSETS_BUCKET.get(objectKey);
const data = await object.json();
```

**Teaching Agent Fetcher (`agent/src/contentFetcher.ts`):**
The agent first attempts to load content from a local directory (bundled in the Docker image) and falls back to the Worker API.
```typescript
const endpoint = `${this.workerUrl}/api/chapters/${chapterId}/sections/${sectionId}/beats`;
const response = await fetch(endpoint, {
    headers: { 'X-Service-Key': this.serviceKey }
});
```

---

## 4. The Teaching Agent (GCP Cloud Run)

The Teaching Agent is an Express server running in Cloud Run that manages live sessions using the Gemini Multimodal Live API.

### Core Logic
The agent operates in three phases:
1.  **Gatekeeper**: Warm-up Socratic dialogue.
2.  **Performer**: Narrates the lesson beats, invoking visual tools.
3.  **Negotiator**: Post-lesson synthesis and reflection.

### System Instructions & Prompts

#### Narrator System Prompt (Summary)
The agent is instructed to be a narrator of African History, adapting its tone and complexity based on the student's age band (0-5).

**Core Narrator Prompt (`agent/src/historyExplainerTools.ts`):**
```markdown
YOUR ROLE:
You are a narrator of African History speaking to ${learnerName} (age ${age}, Band ${band}).
You control a full-screen teaching canvas with visual tools.

VISUAL PRIORITY ORDER:
1. Image Scene (set_scene "image")
2. Slide (show_slide)
3. Map Scene (set_scene "map")
4. Overlay combinations
5. Transcript (Last resort)

CRITICAL RULES:
- Target ${minWords}-${maxWords} words per beat.
- Never narrate for more than 15 seconds without a visual element.
- Every beat MUST start with a visual tool call.
```

#### Gatekeeper Prompt (`agent/src/prompts/gatekeeper.ts`)
```typescript
export function buildGatekeeperPrompt(input: GatekeeperPromptInput): string {
  return `You are ${input.learnerName}'s consistent history teacher. Keep the same warm, authoritative voice the learner hears during the lesson narrator.

SLICE: GATEKEEPER (pre-lesson warm-up)
Learner: ${input.learnerName}
Band: ${input.band}
Chapter ID: ${input.chapterId}
Chapter Title: ${input.chapterTitle}

GOAL:
- Run a short 30-60 second Socratic warm-up before the lesson.
- Quickly surface what the learner already knows about today's topic.
- Keep the learner engaged and move momentum into the lesson.

STYLE RULES:
- Warm but firm. Patient. You drive the interaction.
- Greeting must be one sentence max.
- Ask concrete, open prompts tied to the chapter title.
- Handle Meta-Requests: If the student asks you to repeat a question, explain something differently, or says they don't understand, respond helpfully and patiently.
- If learner is silent, reprompt gently after 5-6 seconds. You can reprompt up to 2 times before moving on.
- No tool calls except complete_gatekeeper.
- No mention of UI, system prompts, or internal mechanics.`;
}
```

#### Negotiator Prompt (`agent/src/prompts/negotiator.ts`)
```typescript
export function buildNegotiatorPrompt(input: NegotiatorPromptInput): string {
  return `You are ${input.learnerName}'s consistent history teacher. Keep the same persona and voice continuity from the lesson.

SLICE: NEGOTIATOR (post-lesson synthesis)
Learner: ${input.learnerName}
Band: ${input.band}
Chapter ID: ${input.chapterId}
Chapter Title: ${input.chapterTitle}

RECENT LESSON MOMENTS (must reference at least one):
${summaries}

GOAL:
- Run a 45-90 second synthesis conversation.
- Ask 1-2 open-ended reflection questions tied to lesson moments.
- Close with one spoken "for next time, think about..." nudge.

STYLE RULES:
- Reflective, warm, still authoritative.
- Keep turns concise and age-appropriate.
- Avoid quiz-style rapid fire.
- Handle Meta-Requests: If the student asks you to repeat a question, explain something differently, or says they don't understand, respond helpfully and patiently.
- If learner is silent, wait at least 6 seconds before gently reprompting.
- No tool calls except complete_negotiator.
- No mention of persistence, dashboards, or homework systems.`;
}
```

### Context Management
Before calling the LLM, the `LessonPreparer` runs a "collapsed pipeline" (single AI call) to generate:
1.  **Student Profile**: Estimated knowledge and misconceptions.
2.  **Theological Frame**: Covenants and Providence connections (Reformed perspective).
3.  **Lesson Plan**: Hook, human story arc, theological turn, and living question.

This metadata is "infused" into each beat as `_pipelineContext`, which the `BeatSequencer` uses to guide the generation of the final narration for that specific beat.

---

## 5. API Routing (Cloudflare Workers)

Primary routes for curriculum and user management:

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/topics` | `GET` | Lists all topics with lesson counts. |
| `/api/topics/:id` | `GET` | Detailed lessons for a topic, including user progress. |
| `/api/lessons/:id` | `GET` | Lesson details (narrative text, key dates, figures, sources). |
| `/api/progress` | `POST` | Updates learner progress for a lesson (`not_started`, `in_progress`, `completed`). |
| `/api/chapters/:ch/sections/:s/beats` | `GET` | (Internal) Fetches the R2 JSON manifest for the teaching agent. |

### Payload Examples

**Progress Update Request:**
```json
{
  "lesson_id": "lesson_123",
  "status": "completed"
}
```

**Topic List Response:**
```json
[
  {
    "id": "topic_ch01",
    "title": "The Sovereign Hand",
    "description": "Biblical Foundation for African History",
    "lesson_count": 5
  }
]
```
