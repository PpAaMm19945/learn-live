-- Core schema for Learn Live / Learn Live

DROP TABLE IF EXISTS Portfolios;
DROP TABLE IF EXISTS Matrix_Tasks;
DROP TABLE IF EXISTS Learners;
DROP TABLE IF EXISTS Families;

CREATE TABLE Families (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_email TEXT UNIQUE NOT NULL,
    secondary_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Learners (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT NOT NULL,
    pin_code TEXT, -- specific pin for learner to switch profiles quickly
    birth_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES Families(id) ON DELETE CASCADE
);

CREATE TABLE Matrix_Tasks (
    id TEXT PRIMARY KEY,
    domain TEXT NOT NULL, -- e.g., 'Language & Literacy'
    capacity TEXT NOT NULL, -- e.g., 'Narrative Sequencing'
    responsibility_level TEXT NOT NULL, -- e.g., 'L1', 'L2'
    arena TEXT NOT NULL, -- e.g., 'Artistic', 'Analytical'
    arc_stage TEXT NOT NULL, -- e.g., 'Execution', 'Endurance'
    constraint_to_enforce TEXT NOT NULL,
    failure_condition TEXT NOT NULL,
    success_condition TEXT NOT NULL,
    role_instruction TEXT NOT NULL, -- Setup instructions for AI acting as Evidence Witness
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Portfolios (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    evidence_url TEXT,
    ai_confidence_score REAL,
    transcript_summary TEXT,
    status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learners(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES Matrix_Tasks(id)
);
