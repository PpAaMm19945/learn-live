-- Phase 7 Learner-scoped Progress Schema Migration

-- Add learner_id to Learner_Progress table
ALTER TABLE Learner_Progress ADD COLUMN learner_id TEXT REFERENCES Learners(id) ON DELETE CASCADE;
