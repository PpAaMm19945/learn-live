-- Seed script for 10 Pilot Families and their starting Curriculum State

-- Clear any previous pilot data safely
DELETE FROM Learner_Repetition_State WHERE learner_id LIKE 'learner_pilot_%';
DELETE FROM Learners WHERE id LIKE 'learner_pilot_%';
DELETE FROM Families WHERE id LIKE 'family_pilot_%';

-- Insert 10 Pilot Families
INSERT INTO Families (id, name, parent_email) VALUES
('family_pilot_1', 'Pilot Family 1', 'pilot1@learnlive.app'),
('family_pilot_2', 'Pilot Family 2', 'pilot2@learnlive.app'),
('family_pilot_3', 'Pilot Family 3', 'pilot3@learnlive.app'),
('family_pilot_4', 'Pilot Family 4', 'pilot4@learnlive.app'),
('family_pilot_5', 'Pilot Family 5', 'pilot5@learnlive.app'),
('family_pilot_6', 'Pilot Family 6', 'pilot6@learnlive.app'),
('family_pilot_7', 'Pilot Family 7', 'pilot7@learnlive.app'),
('family_pilot_8', 'Pilot Family 8', 'pilot8@learnlive.app'),
('family_pilot_9', 'Pilot Family 9', 'pilot9@learnlive.app'),
('family_pilot_10', 'Pilot Family 10', 'pilot10@learnlive.app');

-- Insert 1 Learner per Pilot Family (Ages 6-9, Band 2 focus)
INSERT INTO Learners (id, family_id, name, pin_code) VALUES
('learner_pilot_1a', 'family_pilot_1', 'Child 1', '1234'),
('learner_pilot_2a', 'family_pilot_2', 'Child 2', '1234'),
('learner_pilot_3a', 'family_pilot_3', 'Child 3', '1234'),
('learner_pilot_4a', 'family_pilot_4', 'Child 4', '1234'),
('learner_pilot_5a', 'family_pilot_5', 'Child 5', '1234'),
('learner_pilot_6a', 'family_pilot_6', 'Child 6', '1234'),
('learner_pilot_7a', 'family_pilot_7', 'Child 7', '1234'),
('learner_pilot_8a', 'family_pilot_8', 'Child 8', '1234'),
('learner_pilot_9a', 'family_pilot_9', 'Child 9', '1234'),
('learner_pilot_10a', 'family_pilot_10', 'Child 10', '1234');

-- Initialize Learner_Repetition_State for D1, B2, G2a, P2a, M2 (First capacity of each Strand)
-- This makes the Dashboard UI populate for the pilot users.
INSERT INTO Learner_Repetition_State (id, learner_id, capacity_id, current_cognitive_level, current_arc_stage, execution_count, status) VALUES
-- Child 1
('state_p1_d1', 'learner_pilot_1a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p1_b2', 'learner_pilot_1a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p1_g2a', 'learner_pilot_1a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 2
('state_p2_d1', 'learner_pilot_2a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p2_b2', 'learner_pilot_2a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p2_g2a', 'learner_pilot_2a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 3
('state_p3_d1', 'learner_pilot_3a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p3_b2', 'learner_pilot_3a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p3_g2a', 'learner_pilot_3a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 4
('state_p4_d1', 'learner_pilot_4a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p4_b2', 'learner_pilot_4a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p4_g2a', 'learner_pilot_4a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 5
('state_p5_d1', 'learner_pilot_5a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p5_b2', 'learner_pilot_5a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p5_g2a', 'learner_pilot_5a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 6
('state_p6_d1', 'learner_pilot_6a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p6_b2', 'learner_pilot_6a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p6_g2a', 'learner_pilot_6a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 7
('state_p7_d1', 'learner_pilot_7a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p7_b2', 'learner_pilot_7a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p7_g2a', 'learner_pilot_7a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 8
('state_p8_d1', 'learner_pilot_8a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p8_b2', 'learner_pilot_8a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p8_g2a', 'learner_pilot_8a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 9
('state_p9_d1', 'learner_pilot_9a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p9_b2', 'learner_pilot_9a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p9_g2a', 'learner_pilot_9a', 'G2a', 1, 'Exposure', 0, 'active'),
-- Child 10
('state_p10_d1', 'learner_pilot_10a', 'D1', 1, 'Exposure', 0, 'active'),
('state_p10_b2', 'learner_pilot_10a', 'B2', 1, 'Exposure', 0, 'active'),
('state_p10_g2a', 'learner_pilot_10a', 'G2a', 1, 'Exposure', 0, 'active');
