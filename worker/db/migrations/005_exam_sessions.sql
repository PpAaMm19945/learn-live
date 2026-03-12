-- Migration: 005_exam_sessions
-- Description: Creates tables for exam sessions and recordings.

CREATE TABLE IF NOT EXISTS Exam_Sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    band INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, completed, reviewed
    started_at DATETIME,
    completed_at DATETIME,
    ai_assessment_draft TEXT, -- TEXT/JSON
    parent_review TEXT, -- TEXT/JSON
    parent_approved BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (lesson_id) REFERENCES Lessons(id)
);

CREATE TABLE IF NOT EXISTS Exam_Recordings (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    duration_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES Exam_Sessions(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user ON Exam_Sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_lesson ON Exam_Sessions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exam_recordings_session ON Exam_Recordings(session_id);
