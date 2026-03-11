-- Session Summaries table — feeds learner history into future AI sessions
-- Run: cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=../db/add_session_summaries.sql

CREATE TABLE IF NOT EXISTS Session_Summaries (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    capacity_id TEXT NOT NULL,
    session_type TEXT NOT NULL CHECK(session_type IN ('witness', 'explainer', 'async_evidence')),
    summary TEXT NOT NULL,         -- 2-sentence AI-generated summary of what happened
    ai_status TEXT,                -- 'success' | 'needs_revision' | 'inconclusive'
    parent_verdict TEXT,           -- 'approved' | 'rejected' | null (pending)
    revision_notes TEXT,           -- parent's notes if rejected
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learners(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_summaries_learner ON Session_Summaries(learner_id, created_at DESC);
