-- Phase 3 Analytics Schema Migration

CREATE TABLE IF NOT EXISTS Activity_Log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON Activity_Log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON Activity_Log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON Activity_Log(action);
