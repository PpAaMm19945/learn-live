-- Seed initial Learner_Repetition_State rows for Pilot Learners: Azie and Arie
-- This populates their Dashboard with active Curriculum Tasks

-- Ensure the family and learners exist to satisfy foreign key constraints
INSERT OR IGNORE INTO Families (id, name, parent_email, secondary_email)
VALUES ('fam_mwesigwa', 'Mwesigwa Family', 'antmwes104.1@gmail.com', 'ataroprimah@gmail.com');

INSERT OR IGNORE INTO Learners (id, family_id, name, pin_code, birth_date)
VALUES
  ('learner_azie', 'fam_mwesigwa', 'Azie', '1234', '2022-03-15'),
  ('learner_arie', 'fam_mwesigwa', 'Arie', '5678', '2023-06-20');

-- Clear any existing curriculum states for these two learners to prevent duplicates
DELETE FROM Learner_Repetition_State WHERE learner_id IN ('learner_azie', 'learner_arie');

-- Initialize Learner_Repetition_State for Math and English starter capacities
INSERT INTO Learner_Repetition_State (id, learner_id, capacity_id, current_cognitive_level, current_arc_stage, execution_count, status) VALUES
-- Azie (learner_azie) - Math
('state_azie_d1', 'learner_azie', 'D1', 1, 'Exposure', 0, 'active'),
('state_azie_b2', 'learner_azie', 'B2', 1, 'Exposure', 0, 'active'),
('state_azie_g2a', 'learner_azie', 'G2a', 1, 'Exposure', 0, 'active'),
('state_azie_p2a', 'learner_azie', 'P2a', 1, 'Exposure', 0, 'active'),
-- Azie - English
('state_azie_eng_ps2a', 'learner_azie', 'ENG_PS2a', 1, 'Exposure', 0, 'active'),
('state_azie_eng_rc2a', 'learner_azie', 'ENG_RC2a', 1, 'Exposure', 0, 'active'),
('state_azie_eng_gm2a', 'learner_azie', 'ENG_GM2a', 1, 'Exposure', 0, 'active'),
('state_azie_eng_cw2a', 'learner_azie', 'ENG_CW2a', 1, 'Exposure', 0, 'active'),
('state_azie_eng_ol2a', 'learner_azie', 'ENG_OL2a', 1, 'Exposure', 0, 'active'),
-- Azie - Science
('state_azie_sci_se2a', 'learner_azie', 'SCI_SE2a', 1, 'Exposure', 0, 'active'),
('state_azie_sci_ls2a', 'learner_azie', 'SCI_LS2a', 1, 'Exposure', 0, 'active'),
('state_azie_sci_ps2a', 'learner_azie', 'SCI_PS2a', 1, 'Exposure', 0, 'active'),

-- Arie (learner_arie) - Math
('state_arie_d1', 'learner_arie', 'D1', 1, 'Exposure', 0, 'active'),
('state_arie_b2', 'learner_arie', 'B2', 1, 'Exposure', 0, 'active'),
('state_arie_g2a', 'learner_arie', 'G2a', 1, 'Exposure', 0, 'active'),
('state_arie_p2a', 'learner_arie', 'P2a', 1, 'Exposure', 0, 'active'),
-- Arie - English
('state_arie_eng_ps2a', 'learner_arie', 'ENG_PS2a', 1, 'Exposure', 0, 'active'),
('state_arie_eng_rc2a', 'learner_arie', 'ENG_RC2a', 1, 'Exposure', 0, 'active'),
('state_arie_eng_gm2a', 'learner_arie', 'ENG_GM2a', 1, 'Exposure', 0, 'active'),
('state_arie_eng_cw2a', 'learner_arie', 'ENG_CW2a', 1, 'Exposure', 0, 'active'),
('state_arie_eng_ol2a', 'learner_arie', 'ENG_OL2a', 1, 'Exposure', 0, 'active'),
-- Arie - Science
('state_arie_sci_se2a', 'learner_arie', 'SCI_SE2a', 1, 'Exposure', 0, 'active'),
('state_arie_sci_ls2a', 'learner_arie', 'SCI_LS2a', 1, 'Exposure', 0, 'active'),
('state_arie_sci_ps2a', 'learner_arie', 'SCI_PS2a', 1, 'Exposure', 0, 'active');
