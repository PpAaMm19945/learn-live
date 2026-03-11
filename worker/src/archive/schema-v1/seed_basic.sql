-- =============================================================================
-- Learn Live — Curriculum Spine Basic Data
-- =============================================================================

DELETE FROM Learner_Repetition_State;
DELETE FROM Constraint_Templates;
DELETE FROM Capacity_Dependencies;
DELETE FROM Capacities;
DELETE FROM Strands;
DELETE FROM Developmental_Bands;

-- ── Developmental Bands ─────────────────────────────────────────────────────
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_0', 'Infant/Toddler', '0-3');
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_1', 'Early Childhood', '3-6');
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_2', 'Early Primary', '6-9');
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_3', 'Upper Primary', '9-12');
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_4', 'Middle School', '12-15');
INSERT INTO Developmental_Bands (id, name, age_range) VALUES ('Band_5', 'High School', '15-18');

-- ── Strands ─────────────────────────────────────────────────────────────────
-- Math Strands
INSERT INTO Strands (id, name) VALUES ('MATH_S1', 'Number & Quantity');
INSERT INTO Strands (id, name) VALUES ('MATH_S2', 'Algebraic Thinking & Structure');
INSERT INTO Strands (id, name) VALUES ('MATH_S3', 'Spatial Reasoning & Geometry');
INSERT INTO Strands (id, name) VALUES ('MATH_S4', 'Data, Probability & Statistics');
INSERT INTO Strands (id, name) VALUES ('MATH_S5', 'Mathematical Modeling & Systems');
-- English Strands
INSERT INTO Strands (id, name) VALUES ('ENG_S1', 'Phonics & Word Study');
INSERT INTO Strands (id, name) VALUES ('ENG_S2', 'Reading Comprehension');
INSERT INTO Strands (id, name) VALUES ('ENG_S3', 'Grammar & Mechanics');
INSERT INTO Strands (id, name) VALUES ('ENG_S4', 'Composition & Writing');
INSERT INTO Strands (id, name) VALUES ('ENG_S5', 'Oral Language & Listening');
