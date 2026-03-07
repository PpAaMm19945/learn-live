-- =============================================================================
-- Learn Live — Curriculum Spine Seed Data
-- Auto-generated from Jules JSON template files on 2026-03-07T22:17:36.894Z
-- =============================================================================

-- Clear existing data (in order of dependencies)
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
INSERT INTO Strands (id, name) VALUES ('MATH_S1', 'Number & Quantity');
INSERT INTO Strands (id, name) VALUES ('MATH_S2', 'Algebraic Thinking & Structure');
INSERT INTO Strands (id, name) VALUES ('MATH_S3', 'Spatial Reasoning & Geometry');
INSERT INTO Strands (id, name) VALUES ('MATH_S4', 'Data, Probability & Statistics');
INSERT INTO Strands (id, name) VALUES ('MATH_S5', 'Mathematical Modeling & Systems');
INSERT INTO Strands (id, name) VALUES ('ENG_S1', 'Phonics & Word Study');
INSERT INTO Strands (id, name) VALUES ('ENG_S2', 'Reading Comprehension');
INSERT INTO Strands (id, name) VALUES ('ENG_S3', 'Grammar & Mechanics');
INSERT INTO Strands (id, name) VALUES ('ENG_S4', 'Composition & Writing');
INSERT INTO Strands (id, name) VALUES ('ENG_S5', 'Oral Language & Listening');
INSERT INTO Strands (id, name) VALUES ('SCI_S1', 'Life Sciences & Inquiry');
INSERT INTO Strands (id, name) VALUES ('SCI_S2', 'Physical Sciences');
INSERT INTO Strands (id, name) VALUES ('SCI_S3', 'Earth & Space Sciences');

-- ── Capacities ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D1', 'MATH_S1', 'Band_2', 'Place Value as Grouping');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D2', 'MATH_S1', 'Band_2', 'Addition as Combining');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D3', 'MATH_S1', 'Band_2', 'Subtraction as Separating');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D4', 'MATH_S1', 'Band_2', 'Multiplication as Equal Groups');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D5', 'MATH_S1', 'Band_2', 'Division as Equal Partitioning');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D6', 'MATH_S1', 'Band_2', 'Number Line as Model');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D7', 'MATH_S1', 'Band_2', 'Properties of Operations');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D8', 'MATH_S1', 'Band_2', 'Equivalence');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('D9', 'MATH_S1', 'Band_2', 'Estimation & Reasonableness');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('B2', 'MATH_S2', 'Band_2', 'Unknown Quantities');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('B3', 'MATH_S2', 'Band_2', 'Function Machines');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('B4', 'MATH_S2', 'Band_2', 'Generalization from Arithmetic');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('B5', 'MATH_S2', 'Band_2', 'Growing Patterns');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2a', 'MATH_S3', 'Band_2', '2D Shape Classification');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2b', 'MATH_S3', 'Band_2', '3D Shape Recognition');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2c', 'MATH_S3', 'Band_2', 'Standard Measurement — Length');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2d', 'MATH_S3', 'Band_2', 'Standard Measurement — Mass & Capacity');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2e', 'MATH_S3', 'Band_2', 'Perimeter');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2f', 'MATH_S3', 'Band_2', 'Area — Conceptual');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2g', 'MATH_S3', 'Band_2', 'Line Symmetry');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('G2h', 'MATH_S3', 'Band_2', 'Directions & Simple Maps');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2a', 'MATH_S4', 'Band_2', 'Data Collection');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2b', 'MATH_S4', 'Band_2', 'Bar Graphs & Tally Charts');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2c', 'MATH_S4', 'Band_2', 'Asking Good Questions');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2d', 'MATH_S4', 'Band_2', 'Mode');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2e', 'MATH_S4', 'Band_2', 'Likely vs Unlikely');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2f', 'MATH_S4', 'Band_2', 'Simple Experiments');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('P2g', 'MATH_S4', 'Band_2', 'Comparing Data Sets');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('M2', 'MATH_S5', 'Band_2', 'Physical modeling');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2a', 'ENG_S1', 'Band_2', 'Short Vowel Mastery');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2b', 'ENG_S1', 'Band_2', 'Consonant Blends');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2c', 'ENG_S1', 'Band_2', 'Consonant Digraphs');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2d', 'ENG_S1', 'Band_2', 'Long Vowel Patterns');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2e', 'ENG_S1', 'Band_2', 'R-Controlled Vowels');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2f', 'ENG_S1', 'Band_2', 'Syllable Types & Division');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2g', 'ENG_S1', 'Band_2', 'Common Spelling Patterns');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2h', 'ENG_S1', 'Band_2', 'Word Families & Morphemes');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2i', 'ENG_S1', 'Band_2', 'High-Frequency Sight Words — Extended');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_PS2j', 'ENG_S1', 'Band_2', 'Spelling as Encoding');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2a', 'ENG_S2', 'Band_2', 'Literal Comprehension');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2b', 'ENG_S2', 'Band_2', 'Retelling with Detail');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2c', 'ENG_S2', 'Band_2', 'Main Idea Identification');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2d', 'ENG_S2', 'Band_2', 'Supporting Details');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2e', 'ENG_S2', 'Band_2', 'Cause and Effect');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2f', 'ENG_S2', 'Band_2', 'Character Traits & Feelings');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2g', 'ENG_S2', 'Band_2', 'Making Inferences');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2h', 'ENG_S2', 'Band_2', 'Comparing Texts');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2i', 'ENG_S2', 'Band_2', 'Text Features');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RF2a', 'ENG_S2', 'Band_2', 'Phrase Chunking');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RF2b', 'ENG_S2', 'Band_2', 'Reading Rate');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RF2c', 'ENG_S2', 'Band_2', 'Prosody & Expression');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_RC2j', 'ENG_S2', 'Band_2', 'Poetry & Rhythmic Text');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2a', 'ENG_S3', 'Band_2', 'Sentence Types');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2b', 'ENG_S3', 'Band_2', 'Nouns — Common & Proper');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2c', 'ENG_S3', 'Band_2', 'Verbs — Action Words');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2d', 'ENG_S3', 'Band_2', 'Adjectives — Describing Words');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2e', 'ENG_S3', 'Band_2', 'Subject-Verb Agreement');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2f', 'ENG_S3', 'Band_2', 'Singular & Plural Nouns');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2g', 'ENG_S3', 'Band_2', 'Verb Tenses — Simple');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2h', 'ENG_S3', 'Band_2', 'Commas in Lists');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2i', 'ENG_S3', 'Band_2', 'Apostrophes — Possession');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2j', 'ENG_S3', 'Band_2', 'Conjunctions — Simple');
INSERT OR IGNORE INTO Capacities (id, strand_id, band_id, name) VALUES ('ENG_GM2k', 'ENG_S3', 'Band_2', 'Sentence Expansion');