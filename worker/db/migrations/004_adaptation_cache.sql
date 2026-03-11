-- Phase 4C Adaptation Cache Schema Migration
-- Defines table for storing band-adapted history content.

-- Adapted_Content
-- Reads: Client (App) fetching adapted content for reading/tasks, Agent for task context
-- Writes: Background processing scripts (adaptation generation via Agent)
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
