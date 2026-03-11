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

-- ==========================================
-- PHASE 10: CURRICULUM SPINE & CONTENT MODEL
-- ==========================================

DROP TABLE IF EXISTS Constraint_Templates;
DROP TABLE IF EXISTS Learner_Repetition_State;
DROP TABLE IF EXISTS Capacity_Dependencies;
DROP TABLE IF EXISTS Capacities;
DROP TABLE IF EXISTS Strands;
DROP TABLE IF EXISTS Developmental_Bands;

CREATE TABLE Developmental_Bands (
    id TEXT PRIMARY KEY, -- e.g., 'Band_0', 'Band_2'
    name TEXT NOT NULL,
    age_range TEXT NOT NULL,
    description TEXT
);

CREATE TABLE Strands (
    id TEXT PRIMARY KEY, -- e.g., 'Strand_1'
    name TEXT NOT NULL, -- e.g., 'Number & Quantity'
    description TEXT
);

CREATE TABLE Capacities (
    id TEXT PRIMARY KEY, -- e.g., 'D1', 'C8'
    strand_id TEXT NOT NULL,
    band_id TEXT NOT NULL,
    name TEXT NOT NULL, -- e.g., 'Place Value as Grouping'
    description TEXT,
    FOREIGN KEY (strand_id) REFERENCES Strands(id),
    FOREIGN KEY (band_id) REFERENCES Developmental_Bands(id)
);

-- For the DAG (Directed Acyclic Graph)
CREATE TABLE Capacity_Dependencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_capacity_id TEXT NOT NULL, -- Prerequisite
    target_capacity_id TEXT NOT NULL, -- Dependent
    is_hard_gate BOOLEAN DEFAULT 1, -- Usually 1 based on Part VIf
    FOREIGN KEY (source_capacity_id) REFERENCES Capacities(id),
    FOREIGN KEY (target_capacity_id) REFERENCES Capacities(id)
);

CREATE TABLE Constraint_Templates (
    id TEXT PRIMARY KEY, -- e.g., 'D1_L2_A'
    capacity_id TEXT NOT NULL,
    cognitive_level INTEGER NOT NULL CHECK(cognitive_level IN (1, 2, 3, 4)), -- 1=Encounter, 2=Execute, 3=Discern, 4=Own
    variation_id TEXT NOT NULL, -- 'A', 'B', etc.
    task_type TEXT NOT NULL,
    materials TEXT,
    scientific_materials TEXT,
    acceptable_alternatives TEXT,
    risk_level TEXT,
    safety_warning TEXT,
    parent_prompt TEXT NOT NULL,
    success_condition TEXT NOT NULL,
    failure_condition TEXT, -- relevant for Encounter/Discern
    reasoning_check TEXT NOT NULL,
    context_variants TEXT NOT NULL, -- Localisation payload
    requires_parent_primer BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capacity_id) REFERENCES Capacities(id)
);

-- Tracks where a learner is on the Repetition Arc for a specific capacity
CREATE TABLE Learner_Repetition_State (
    id TEXT PRIMARY KEY,
    learner_id TEXT NOT NULL,
    capacity_id TEXT NOT NULL,
    current_cognitive_level INTEGER DEFAULT 1, -- Starts at 1 (Encounter)
    current_arc_stage TEXT DEFAULT 'Exposure' CHECK(current_arc_stage IN ('Exposure', 'Execution', 'Endurance', 'Milestone')),
    execution_count INTEGER DEFAULT 0, -- How many executions completed
    status TEXT DEFAULT 'locked' CHECK(status IN ('locked', 'active', 'awaiting_judgment', 'completed')),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learner_id) REFERENCES Learners(id) ON DELETE CASCADE,
    FOREIGN KEY (capacity_id) REFERENCES Capacities(id)
);
