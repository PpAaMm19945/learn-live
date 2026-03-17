-- Strip markdown bold markers from lesson titles
UPDATE Lessons SET title = REPLACE(REPLACE(title, '**', ''), '*', '') WHERE title LIKE '%**%' OR title LIKE '%*%';