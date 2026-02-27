-- =============================================================================
-- Learn Live — D1 Seed Data
-- =============================================================================
-- Populates the Hackathon MVP demo: one family, two learners, and four
-- Language & Literacy tasks covering the vertical slice described in the
-- Master Blueprint (Azie @ L2, Arie @ L1).
--
-- Run with:
--   npx wrangler d1 execute learnlive-db-prod --remote --file=./db/seed.sql
-- =============================================================================

-- ── Family ──────────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO Families (id, name, parent_email, secondary_email)
VALUES ('fam_mwesigwa', 'Mwesigwa Family', 'antmwes104.1@gmail.com', 'ataroprimah@gmail.com');

-- ── Learners ────────────────────────────────────────────────────────────────

INSERT OR IGNORE INTO Learners (id, family_id, name, pin_code, birth_date)
VALUES
  ('learner_azie', 'fam_mwesigwa', 'Azie', '1234', '2022-03-15'),
  ('learner_arie', 'fam_mwesigwa', 'Arie', '5678', '2023-06-20');

-- ── Matrix Tasks — Language & Literacy (MVP Vertical Slice) ─────────────────
--
-- Naming convention:  LANG-<capacity_short>-<level>-<arena_short>-<arc_short>-<seq>
-- Domain:             Language & Literacy
-- Capacities:         Narrative Sequencing
-- Responsibility:     L1 (Arie, age 3)  /  L2 (Azie, age 4)
-- Arenas:             Analytical  /  Artistic
-- Arc stages:         Exposure (1×)  /  Execution (5×)

-- ─── L1 Tasks (Arie) ───────────────────────────────────────────────────────

INSERT OR IGNORE INTO Matrix_Tasks (
  id, domain, capacity, responsibility_level, arena, arc_stage,
  constraint_to_enforce, failure_condition, success_condition, role_instruction
) VALUES (
  'LANG-SEQ-L1-ANA-EXPO-01',
  'Language & Literacy',
  'Narrative Sequencing',
  'L1',
  'Analytical',
  'Exposure',
  '{"type":"picture_card_identification","description":"The learner is shown 3 picture cards depicting a simple chronological sequence (morning routine: wake up, brush teeth, eat breakfast). The learner must point to each card and name what is happening.","required_evidence":["audio_transcript","snapshot"],"timeout_seconds":180}',
  '{"condition":"The learner cannot name at least 2 of the 3 actions after 2 gentle prompts.","action":"Log the attempt and encourage the learner to try again later."}',
  '{"condition":"The learner correctly names all 3 actions on the cards, in any order.","action":"Praise the effort, note which card they found easiest, and close the session."}',
  '{"role":"You are the Evidence Witness. You are speaking to 3-year-old Arie.","personality":"Warm, patient, and encouraging. Use simple words and short sentences.","instruction":"Show enthusiasm for each card Arie identifies. If he hesitates, gently describe what you see in the card to help him. Never give the answer directly — let him try.","greeting":"Hi Arie! I can see your picture cards. Can you show me the first one and tell me what is happening?"}'
);

INSERT OR IGNORE INTO Matrix_Tasks (
  id, domain, capacity, responsibility_level, arena, arc_stage,
  constraint_to_enforce, failure_condition, success_condition, role_instruction
) VALUES (
  'LANG-SEQ-L1-ART-EXEC-01',
  'Language & Literacy',
  'Narrative Sequencing',
  'L1',
  'Artistic',
  'Execution',
  '{"type":"physical_card_sort","description":"The learner must physically arrange 3 picture cards in the correct chronological order and explain their choice. Cards depict: a seed being planted, rain falling, a flower blooming.","required_evidence":["audio_transcript","snapshot"],"timeout_seconds":240}',
  '{"condition":"The learner places the cards out of order AND cannot self-correct after 2 prompts.","action":"Log the attempt, note which step confused them, and end the session gently."}',
  '{"condition":"The learner arranges the cards in the correct order (seed → rain → flower) and verbalises a reason for at least one transition.","action":"Celebrate the success, ask which picture is their favourite, and close the session."}',
  '{"role":"You are the Evidence Witness. You are speaking to 3-year-old Arie.","personality":"Gentle and firm. Praise effort, not speed.","instruction":"Ask Arie to hold up the cards one at a time in order. If the order is wrong, say: I see! Can you look again and think about what comes first? Do not rearrange for him.","greeting":"Hello Arie! I see you have your picture cards ready. Can you put them in order and show me — what happens first?"}'
);

-- ─── L2 Tasks (Azie) ───────────────────────────────────────────────────────

INSERT OR IGNORE INTO Matrix_Tasks (
  id, domain, capacity, responsibility_level, arena, arc_stage,
  constraint_to_enforce, failure_condition, success_condition, role_instruction
) VALUES (
  'LANG-SEQ-L2-ANA-EXPO-01',
  'Language & Literacy',
  'Narrative Sequencing',
  'L2',
  'Analytical',
  'Exposure',
  '{"type":"verbal_retelling","description":"Without visual aids, the learner must verbally reconstruct a 3-part story they heard earlier (beginning, middle, end). The story is: A boy finds a lost kitten, takes it home, and the kitten falls asleep on his bed.","required_evidence":["audio_transcript"],"timeout_seconds":300}',
  '{"condition":"The learner omits an entire story part (beginning, middle, or end) and cannot supply it after 2 guiding questions.","action":"Log which part was missed, note the learner''s attempt, and end the session with encouragement."}',
  '{"condition":"The learner recounts all 3 parts in roughly correct order. Minor details may differ.","action":"Ask the learner what they think happens next in the story, praise their memory, and close the session."}',
  '{"role":"You are the Evidence Witness. You are speaking to 4-year-old Azie.","personality":"Calm, warm, and curious. You genuinely want to hear the story.","instruction":"Listen carefully. If Azie skips a part, ask: And what happened before that? or Then what? Never retell the story for them.","greeting":"Hello Azie! I heard you listened to a great story today. Can you tell it to me from the very beginning?"}'
);

INSERT OR IGNORE INTO Matrix_Tasks (
  id, domain, capacity, responsibility_level, arena, arc_stage,
  constraint_to_enforce, failure_condition, success_condition, role_instruction
) VALUES (
  'LANG-SEQ-L2-ART-EXEC-01',
  'Language & Literacy',
  'Narrative Sequencing',
  'L2',
  'Artistic',
  'Execution',
  '{"type":"draw_and_explain","description":"The learner draws a 3-panel story (beginning, middle, end) and then explains each panel to the Evidence Witness via the camera. The AI must verify the drawing has 3 distinct elements and the verbal story matches them.","required_evidence":["audio_transcript","snapshot"],"timeout_seconds":420}',
  '{"condition":"The drawing has fewer than 3 panels, OR the verbal story does not correspond to what is drawn, AND the learner cannot self-correct after 2 prompts.","action":"Log the mismatch, note which part was missing or inconsistent, and end with encouragement to try again."}',
  '{"condition":"The drawing has 3 distinct panels, the verbal story covers beginning, middle, end, and the story matches the drawings.","action":"Ask which panel was the most fun to draw, praise creativity and effort, and close the session."}',
  '{"role":"You are the Evidence Witness. You are speaking to 4-year-old Azie.","personality":"Enthusiastic about art. Visually observant.","instruction":"Ask Azie to hold up the drawing so you can see all 3 parts. Comment on specific things you see in the drawing to show you are paying attention. If a panel is missing, ask: I see two pictures — is there another one?","greeting":"Hi Azie! I am so excited to see your drawing. Can you hold it up for me so I can see the whole thing?"}'
);
