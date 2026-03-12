-- Phase 7 Family and Learner Management Schema Migration
CREATE TABLE IF NOT EXISTS Families (
    id TEXT PRIMARY KEY,
    owner_user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
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