-- Phase 11: Add portal access level column to Learners table
-- Controls child's access to the Child Portal
-- Values: 'none', 'read_only', 'task_execution', 'child_led'
ALTER TABLE Learners ADD COLUMN portal_access_level TEXT DEFAULT 'read_only';
