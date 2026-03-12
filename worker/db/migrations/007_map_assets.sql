-- Phase 6 History Explainer Canvas Map Assets
-- Defines the Map_Assets table for the R2 map asset pipeline

CREATE TABLE IF NOT EXISTS Map_Assets (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES Lessons(id) ON DELETE CASCADE,
    chapter_number INTEGER,
    title TEXT NOT NULL,
    era TEXT,
    r2_base_map_key TEXT,      -- R2 key for base map image
    r2_overlay_key TEXT,       -- R2 key for SVG overlay (optional)
    markers TEXT,              -- JSON array of { x, y, label, type }
    metadata TEXT,             -- JSON: { bounds, defaultCenter, defaultZoom, region }
    display_order INTEGER
);
