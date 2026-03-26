-- Dialogue session tracking for live AI narration sessions
CREATE TABLE IF NOT EXISTS Dialogue_Sessions (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'dialogue',
    duration_ms INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_dialogue_sessions_learner ON Dialogue_Sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_dialogue_sessions_lesson ON Dialogue_Sessions(lesson_id);
