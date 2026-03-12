CREATE TABLE IF NOT EXISTS Families (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_email TEXT UNIQUE NOT NULL,
    secondary_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Learners (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    name TEXT NOT NULL,
    pin_code TEXT,
    birth_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES Families(id) ON DELETE CASCADE
);
