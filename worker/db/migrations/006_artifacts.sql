CREATE TABLE IF NOT EXISTS Artifacts (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'approved', 'rejected')),
    score INTEGER,
    feedback TEXT,
    areas_to_improve TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
