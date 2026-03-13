CREATE TABLE IF NOT EXISTS Glossary_Terms (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  category TEXT, -- 'person', 'place', 'event', 'concept', 'date'
  related_chapter_ids TEXT, -- JSON array of chapter IDs
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_glossary_term ON Glossary_Terms(term);
CREATE INDEX IF NOT EXISTS idx_glossary_category ON Glossary_Terms(category);