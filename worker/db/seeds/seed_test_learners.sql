-- Add one test learner per band (1-5) to the first family found
-- Band 0 already has a child, so we skip it

INSERT INTO Learners (id, family_id, name, birth_date, band)
SELECT 
    'test-learner-band-1',
    id,
    'Story Mode Child',
    '2018-06-15',
    1
FROM Families LIMIT 1;

INSERT INTO Learners (id, family_id, name, birth_date, band)
SELECT 
    'test-learner-band-2',
    id,
    'Explorer Child',
    '2015-03-20',
    2
FROM Families LIMIT 1;

INSERT INTO Learners (id, family_id, name, birth_date, band)
SELECT 
    'test-learner-band-3',
    id,
    'Scholar Child',
    '2012-09-10',
    3
FROM Families LIMIT 1;

INSERT INTO Learners (id, family_id, name, birth_date, band)
SELECT 
    'test-learner-band-4',
    id,
    'Apprentice Child',
    '2009-01-25',
    4
FROM Families LIMIT 1;

INSERT INTO Learners (id, family_id, name, birth_date, band)
SELECT 
    'test-learner-band-5',
    id,
    'Uni Prep Child',
    '2006-11-05',
    5
FROM Families LIMIT 1;
