-- Phase 3A History Curriculum Schema Migration
-- Defines tables for the African History RAG-based curriculum.

-- Topics
-- Reads: Client (App) fetching curriculum structure, Agent for context
-- Writes: Admin/Curriculum Team (via future admin tools or seeds)
CREATE TABLE IF NOT EXISTS Topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    era TEXT,
    region TEXT,
    summary TEXT,
    display_order INTEGER,
    parent_topic_id TEXT REFERENCES Topics(id) ON DELETE CASCADE
);

-- Lessons
-- Reads: Client fetching lesson details, Agent for lesson context
-- Writes: Admin/Curriculum Team
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

-- Sources
-- Reads: Client displaying sources, Agent for RAG citation
-- Writes: Admin/Curriculum Team
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

-- RAG_Chunks
-- Reads: Vector Search/Agent for dynamic context retrieval
-- Writes: Background processing scripts (embedding generation)
CREATE TABLE IF NOT EXISTS RAG_Chunks (
    id TEXT PRIMARY KEY,
    source_id TEXT REFERENCES Sources(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding_key TEXT -- Placeholder for future vector DB reference
);

-- Learner_Progress
-- Reads: Client (App) for dashboard/progress tracking, Agent to adapt difficulty
-- Writes: Client (App) submitting completion, Agent updating status
CREATE TABLE IF NOT EXISTS Learner_Progress (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER,
    started_at TEXT,
    completed_at TEXT,
    UNIQUE(user_id, lesson_id)
);

-- Quiz_Questions
-- Reads: Client (App) generating quizzes, Agent checking knowledge
-- Writes: Admin/Curriculum Team
CREATE TABLE IF NOT EXISTS Quiz_Questions (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    distractors TEXT, -- JSON array of strings
    explanation TEXT,
    difficulty_band INTEGER CHECK (difficulty_band BETWEEN 1 AND 5)
);
