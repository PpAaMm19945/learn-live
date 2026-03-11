# Phase 2 Auth Schema Design

This document details the database schema design for Phase 2's new authentication system. It explains the rationale behind the tables created in `worker/db/migrations/002_auth_tables.sql`.

## Schema Overview

The authentication schema introduces four new tables to handle users, their roles, active sessions, and multi-factor/magic-link authentication tokens.

### `Users` Table
* **Why nullable `password_hash`?** Not all users will have a password. Users who sign up exclusively via Google OAuth or Magic Link will have a `null` password hash. If a user later decides to set a password, this field can be updated. This design supports flexible, multi-modal authentication linking to a single user identity.

### `User_Roles` Table
* **Why separate `User_Roles` from the `Users` table?** A single user account might need multiple roles. For example, an adult could be both a 'parent' and potentially a 'learner' in a continuing education context, or roles might expand in the future (e.g., 'admin', 'teacher'). Normalizing roles into a separate table allows a one-to-many relationship and simplifies authorization checks without modifying the core `Users` table structure.

### `Sessions` Table
* **Why keep a `Sessions` table if we're using stateless JWTs?** While JWTs are great for distributed, stateless verification of claims (avoiding a DB lookup on every single request), they are inherently difficult to revoke before they expire. By maintaining a `Sessions` table, we can support explicit token revocation (e.g., "log out of all devices" or invalidating a compromised session). The application can choose to check the `Sessions` table periodically or on high-security actions to ensure the token hasn't been revoked.

### `Auth_Tokens` Table
* **Purpose:** This table manages ephemeral tokens used for actions like verifying email addresses, resetting passwords, and authenticating via Magic Link.
* **Design:** It includes a `type` constraint to ensure tokens are only used for their intended purpose, and explicit `expires_at` and `used_at` fields to enforce time bounds and single-use semantics.