-- =============================================================================
-- Learn Live — DAG Dependency Seeds (Band 2)
-- Defines prerequisite gates between capacities across strands
-- =============================================================================

-- ── Math Strand 1: Number & Quantity ─────────────────────────────────────────
-- D1 (Place Value) is the root — no prerequisites
-- D2 (Addition) requires D1
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D1', 'D2', 1);
-- D3 (Subtraction) requires D2
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'D3', 1);
-- D4 (Multiplication) requires D2 (Addition)
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'D4', 1);
-- D5 (Division) requires D4 (Multiplication)
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D4', 'D5', 1);
-- D6 (Number Line) requires D1
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D1', 'D6', 1);
-- D7 (Properties of Operations) requires D2 and D4
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'D7', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D4', 'D7', 1);
-- D8 (Equivalence) requires D2 and D3
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'D8', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D3', 'D8', 1);
-- D9 (Estimation) requires D2
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'D9', 1);

-- ── Math Strand 2: Algebraic Thinking ────────────────────────────────────────
-- B2 (Unknown Quantities) requires D2 (Addition) — cross-strand!
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D2', 'B2', 1);
-- B3 (Function Machines) requires B2
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('B2', 'B3', 1);
-- B4 (Generalization) requires B2 and D7
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('B2', 'B4', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D7', 'B4', 1);
-- B5 (Growing Patterns) requires B2
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('B2', 'B5', 1);

-- ── Math Strand 3: Spatial Reasoning ─────────────────────────────────────────
-- G2a (2D Shapes) is root for spatial
-- G2b (3D Shapes) requires G2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2a', 'G2b', 1);
-- G2c (Length) requires D1 (Place Value) — cross-strand!
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D1', 'G2c', 1);
-- G2d (Mass & Capacity) requires G2c
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2c', 'G2d', 1);
-- G2e (Perimeter) requires G2a and G2c
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2a', 'G2e', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2c', 'G2e', 1);
-- G2f (Area) requires G2e
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2e', 'G2f', 1);
-- G2g (Symmetry) requires G2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2a', 'G2g', 1);
-- G2h (Maps) requires G2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('G2a', 'G2h', 1);

-- ── Math Strand 4: Data & Probability ────────────────────────────────────────
-- P2a (Data Collection) is root
-- P2b (Bar Graphs) requires P2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2a', 'P2b', 1);
-- P2c (Good Questions) requires P2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2a', 'P2c', 1);
-- P2d (Mode) requires P2b
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2b', 'P2d', 1);
-- P2e (Likely vs Unlikely) requires P2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2a', 'P2e', 1);
-- P2f (Simple Experiments) requires P2e
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2e', 'P2f', 1);
-- P2g (Comparing Data) requires P2b and D3 — cross-strand!
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2b', 'P2g', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('D3', 'P2g', 1);

-- ── English: Phonics (ENG_S1) ────────────────────────────────────────────────
-- ENG_PS2a (Short Vowels) is root
-- ENG_PS2b (Consonant Blends) requires ENG_PS2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2a', 'ENG_PS2b', 1);
-- ENG_PS2c (Digraphs) requires ENG_PS2b
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2b', 'ENG_PS2c', 1);
-- ENG_PS2d (Long Vowels) requires ENG_PS2a
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2a', 'ENG_PS2d', 1);
-- ENG_PS2e (R-Controlled) requires ENG_PS2d
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2d', 'ENG_PS2e', 1);
-- ENG_PS2f (Syllables) requires ENG_PS2c and ENG_PS2d
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2c', 'ENG_PS2f', 1);
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2d', 'ENG_PS2f', 1);
-- ENG_PS2g (Spelling Patterns) requires ENG_PS2f
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2f', 'ENG_PS2g', 1);
-- ENG_PS2h (Word Families) requires ENG_PS2g
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2g', 'ENG_PS2h', 1);
-- ENG_PS2i (Sight Words) requires ENG_PS2a — can run in parallel
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2a', 'ENG_PS2i', 1);
-- ENG_PS2j (Spelling as Encoding) requires ENG_PS2g
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2g', 'ENG_PS2j', 1);

-- ── English: Reading Comprehension feeds off Phonics ─────────────────────────
-- ENG_RC2a (Literal Comprehension) requires ENG_PS2a — cross-strand!
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('ENG_PS2a', 'ENG_RC2a', 1);

-- ── Science: cross-domain dependencies ───────────────────────────────────────
-- SCI_SE2a (Scientific Exploration) requires P2a (Data Collection) — cross-domain!
INSERT INTO Capacity_Dependencies (source_capacity_id, target_capacity_id, is_hard_gate) VALUES ('P2a', 'SCI_SE2a', 1);
