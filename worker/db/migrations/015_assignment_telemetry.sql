CREATE TABLE IF NOT EXISTS assignment_telemetry (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES learner_assignments(id),
  comprehension_avg REAL,
  scaffolding_triggered INTEGER DEFAULT 0,
  raise_hand_count INTEGER DEFAULT 0,
  session_duration_seconds INTEGER,
  beats_completed INTEGER,
  recorded_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_telemetry_assignment ON assignment_telemetry(assignment_id);

