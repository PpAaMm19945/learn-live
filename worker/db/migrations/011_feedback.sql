-- Migration: 011_feedback
-- Creates Feedback table for the in-app feedback widget

CREATE TABLE IF NOT EXISTS Feedback (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    page_url TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON Feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON Feedback(status);
