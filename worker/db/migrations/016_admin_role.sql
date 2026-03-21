-- Phase 17: Admin Role Support
-- Adds 'admin' to the allowed roles and elevates antmwes104.1@gmail.com

-- 1. Recreate User_Roles with admin support (SQLite cannot ALTER CHECK constraints)
CREATE TABLE User_Roles_new (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES Users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('parent', 'learner', 'admin')),
    UNIQUE(user_id, role)
);
INSERT INTO User_Roles_new SELECT * FROM User_Roles;
DROP TABLE User_Roles;
ALTER TABLE User_Roles_new RENAME TO User_Roles;

-- 2. Grant admin role to owner
INSERT OR IGNORE INTO User_Roles (id, user_id, role)
SELECT hex(randomblob(16)), id, 'admin'
FROM Users WHERE email = 'antmwes104.1@gmail.com';
