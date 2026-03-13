-- Phase 3B World Context Schema Migration
-- Defines table for displaying parallel historical events globally.

CREATE TABLE IF NOT EXISTS World_Context (
    id TEXT PRIMARY KEY,
    chapter_id TEXT NOT NULL,
    region TEXT NOT NULL CHECK (region IN ('Europe', 'Asia', 'Americas', 'Middle East', 'Oceania', 'Global')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_year INTEGER,
    end_year INTEGER,
    display_order INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_world_context_chapter ON World_Context(chapter_id);
