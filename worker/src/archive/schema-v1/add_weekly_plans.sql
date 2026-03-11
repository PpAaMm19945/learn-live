-- Weekly Plan & AI Enrichment tables
-- Run: cd worker && npx wrangler d1 execute learnlive-db-prod --remote --file=../db/add_weekly_plans.sql

-- Tracks weekly plans per learner
CREATE TABLE IF NOT EXISTS Weekly_Plans (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    family_id TEXT NOT NULL,
    week_start DATE NOT NULL,  -- Monday of the week
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learners(id) ON DELETE CASCADE,
    UNIQUE(learner_id, week_start)
);

-- Individual task assignments within a weekly plan
CREATE TABLE IF NOT EXISTS Weekly_Plan_Tasks (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL,
    template_id TEXT NOT NULL,
    capacity_id TEXT NOT NULL,
    strand_name TEXT NOT NULL,
    day_of_week INTEGER,  -- 0=Mon, 1=Tue, ... 4=Fri (NULL = unscheduled)
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'skipped')),
    carryover_count INTEGER DEFAULT 0,  -- how many weeks this has been carried over
    completed_at DATETIME,
    FOREIGN KEY (plan_id) REFERENCES Weekly_Plans(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES Constraint_Templates(id)
);

-- Cached AI enrichment per template (call Gemini once, reuse forever)
CREATE TABLE IF NOT EXISTS Enriched_Task_Cache (
    template_id TEXT PRIMARY KEY,
    concept_context TEXT NOT NULL,
    suggested_approaches TEXT NOT NULL,  -- JSON array
    what_to_look_for TEXT NOT NULL,
    fun_fact TEXT,
    quiz_questions TEXT,  -- JSON array of {question, answer}
    child_prompt TEXT,    -- rewritten child-friendly prompt
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES Constraint_Templates(id)
);
