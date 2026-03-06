import json
import os

templates = []

# Base context variants for reuse
default_context = {
    "default": {
      "objects": ["beans", "blocks", "buttons"],
      "currency": "dollars",
      "names": ["Alex", "Sam", "Pat"],
      "food": ["apples", "oranges"]
    },
    "ug": {
      "objects": ["beans", "stones", "bottle caps"],
      "currency": "UGX",
      "names": ["Amara", "Tendo", "Nala"],
      "food": ["mangoes", "matooke", "groundnuts"]
    }
}

def create_template(cap_id, cog_level, var_id, task_type, materials, parent_prompt, success, fail, reasoning, rep_arc, worksheet, parent_primer=""):
    return {
        "capacity_id": cap_id,
        "strand": 3,
        "band": 2,
        "cognitive_level": cog_level,
        "variation_id": var_id,
        "task_type": task_type,
        "materials": materials,
        "parent_prompt": parent_prompt,
        "success_condition": success,
        "failure_condition": fail,
        "reasoning_check": reasoning,
        "repetition_arc": rep_arc,
        "context_variants": default_context,
        "worksheet": worksheet,
        "parent_primer": parent_primer
    }

# --- G2a: 2D Shape Classification ---

# Encounter
g2a_enc_A = create_template(
    "G2a", "Encounter", "A", "Physical classification", ["Assorted real-world flat objects (e.g., paper, coasters, signs, cutouts)"],
    "Put all the items on the table. Say: 'Sort these objects into two piles: those with exactly 4 straight sides, and everything else.'",
    "Child accurately sorts all quadrilaterals into one pile, regardless of shape (square, rectangle, rhombus).",
    "Child puts all 'regular' shapes in one pile, ignoring the 4-side constraint, or counts curved edges.",
    "Look at this pile with 4 straight sides. Do they all look the same? Why are they in the same pile?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_enc_B = create_template(
    "G2a", "Encounter", "B", "Physical classification", ["Sticks or pencils of varying lengths"],
    "Give the child sticks. Say: 'Build a shape with exactly 3 straight sides that are closed up tight. Now build a shape with 5 straight sides.'",
    "Constructs a triangle and a pentagon. Ensures all corners meet.",
    "Constructs open shapes, or uses the wrong number of sticks.",
    "If you have 4 sticks, can you only make one type of shape, or many different looking ones?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_enc_C = create_template(
    "G2a", "Encounter", "C", "Physical classification", ["Paper and scissors"],
    "Cut out a large triangle. Say: 'Cut one corner off this shape. Now count the sides of the new shape. How many are there?'",
    "Child cuts a corner, counts the newly created edge, and realizes the new shape has 4 sides (quadrilateral).",
    "Child still thinks it's a triangle because it used to be one.",
    "When you cut off one corner, what happens to the number of straight sides?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2a_exe_A = create_template(
    "G2a", "Execute", "A", "Property Identification", [],
    "Show the child 5 different drawn shapes (e.g., square, irregular hexagon, triangle, circle, rhombus). Ask them to count the sides and corners of each, and name them if they can.",
    "Correctly counts sides and corners for all shapes, identifying the relationship (sides = corners for polygons).",
    "Miscounts sides on irregular shapes, or guesses based on appearance.",
    "What do you notice about the number of sides and the number of corners on every shape with straight lines?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Look at the triangle. I touch the lines: 1, 2, 3 sides. I touch the points: 1, 2, 3 corners. 3 sides, 3 corners.",
        "execution_problems": ["Count sides/corners of a square", "Count sides/corners of a pentagon", "Count sides/corners of a hexagon", "Count sides/corners of an octagon", "Count sides/corners of a very skinny rectangle"],
        "endurance_problems": ["Count sides/corners of a circle. What happens?", "Draw a shape with 10 straight sides. Count the corners."]
    }
)
g2a_exe_B = create_template(
    "G2a", "Execute", "B", "Property Identification", [],
    "Give a description: 'I am thinking of a shape. It has exactly 4 sides. Not all sides are the same length. What shape could it be? Draw one.'",
    "Draws a rectangle, trapezoid, or irregular quadrilateral.",
    "Draws a square (violating the 'not all same length' rule) or a triangle.",
    "Why couldn't the shape I'm thinking of be a square?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "A shape with 4 sides could be a square. But not all sides are the same. So it could be a rectangle, where two sides are long and two are short.",
        "execution_problems": ["Draw a 3-sided shape", "Draw a 5-sided shape", "Draw a 4-sided shape where all sides are the same length", "Draw a 6-sided shape", "Draw a shape with 0 straight sides"],
        "endurance_problems": ["Draw a shape with 4 sides that is NOT a rectangle or a square.", "Draw a shape with 3 sides where one corner looks like an 'L'."]
    }
)
g2a_exe_C = create_template(
    "G2a", "Execute", "C", "Property Identification", [],
    "Say: 'Look around the room. Find 3 things that are rectangles and 1 thing that is a circle. What makes the rectangles different from the circle?'",
    "Identifies correct real-world items. Articulates that rectangles have straight edges and corners, while circles are one continuous curve.",
    "Picks random items, or cannot explain the difference structurally.",
    "Does a rectangle always have to be lying down, or is a tall skinny door still a rectangle?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "A door is a rectangle because it has 4 straight sides. A plate is a circle because it has one curved edge and no corners.",
        "execution_problems": ["Find a square", "Find a triangle", "Find a rectangle", "Find another circle", "Find a shape with more than 4 sides"],
        "endurance_problems": ["Find a shape that is made of TWO other shapes joined together.", "Find something that is almost a rectangle but has curved corners."]
    }
)

# Discern
g2a_dis_A = create_template(
    "G2a", "Discern", "A", "Error detection", [],
    "Show a drawing of a 'square' where one corner doesn't quite close. Say: 'My friend says this is a square. Are they right?'",
    "Identifies that it is not a polygon because it is not closed.",
    "Agrees it is a square because of the general shape.",
    "If an ant was walking on the lines of this shape, what would happen when it gets to the gap?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_dis_B = create_template(
    "G2a", "Discern", "B", "Error detection", [],
    "Show a diamond (rhombus) and say: 'Someone told me this is a diamond, not a square. But if I turn my head, it looks like a square. What makes a square a square?'",
    "Explains that a square must have 'L' shaped corners (right angles), while a diamond can have squished corners.",
    "Thinks any tilted square is a diamond.",
    "If I take a square piece of paper and turn it, does it stop being a square?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_dis_C = create_template(
    "G2a", "Discern", "C", "Error detection", [],
    "Draw a very wide, short rectangle. Draw a tall, skinny rectangle. Say: 'A child says these are different shapes entirely. What would you tell them?'",
    "Explains they are both rectangles because they both have 4 straight sides and 4 'L' corners.",
    "Agrees they are different shapes.",
    "What rules do both of these shapes follow?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2a_own_A = create_template(
    "G2a", "Own", "A", "Design and Justification", [],
    "Ask: 'Draw an alien shape that has exactly 7 straight sides. Make it look as weird as possible, but it MUST be closed. How do you know it's a polygon?'",
    "Draws a closed 7-sided figure. Explains it's a polygon because it has straight sides and is closed.",
    "Draws curved lines, open shapes, or fewer/more than 7 sides.",
    "If you showed this to someone, how would you prove it has 7 sides? Can you number them?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_own_B = create_template(
    "G2a", "Own", "B", "Design and Justification", [],
    "Say: 'Teach me the difference between a square and a rectangle using two drawings and words.'",
    "Draws both correctly. Explains that a square MUST have all 4 sides equal length, while a rectangle can have 2 long and 2 short sides.",
    "Cannot articulate the difference in side lengths.",
    "Is every square also a type of rectangle? Why or why not?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2a_own_C = create_template(
    "G2a", "Own", "C", "Design and Justification", [],
    "Ask: 'Create a sorting game. Draw 5 different shapes. Tell me the secret rule you used to group them into two piles.'",
    "Creates a set of shapes and a valid rule (e.g., 'has 4 sides vs doesn't', or 'all sides equal vs different').",
    "Cannot formulate a consistent sorting rule.",
    "Could someone else figure out your secret rule just by looking at your piles?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2b: 3D Shape Recognition ---

# Encounter
g2b_enc_A = create_template(
    "G2b", "Encounter", "A", "Physical exploration", ["Various 3D objects (ball, box, can, cone/party hat)"],
    "Give the child the objects. Ask: 'Which of these can roll across the floor? Which can slide? Which can stack on top of each other?' Let them test.",
    "Categorizes correctly by testing. Notices that round surfaces roll, flat surfaces slide and stack.",
    "Guesses without testing, or cannot find the pattern.",
    "Why can the can slide AND roll, but the box can only slide?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_enc_B = create_template(
    "G2b", "Encounter", "B", "Physical exploration", ["A small box", "a can", "paper", "crayon or pencil"],
    "Have the child trace the bottom of the box and the bottom of the can on paper. Ask: 'What 2D shape did you make from the 3D shape?'",
    "Recognizes the flat faces of 3D objects are 2D shapes (square/rectangle for the box, circle for the can).",
    "Traces poorly or cannot name the resulting 2D shapes.",
    "If a shape is completely round like a ball, can you trace a flat side?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_enc_C = create_template(
    "G2b", "Encounter", "C", "Physical exploration", ["Playdough or clay"],
    "Ask the child to make a cube out of playdough. Ask: 'How many flat sides did you have to press to make it look like a block?'",
    "Creates a rough cube and counts the 6 faces.",
    "Makes a sphere or a flat square.",
    "If you rolled it in your hands like a snowball, what shape would it become?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2b_exe_A = create_template(
    "G2b", "Execute", "A", "Shape Identification", [],
    "Show pictures or name objects (e.g., 'a dice', 'a soup can', 'a basketball', 'a tent'). Ask the child to name the mathematical 3D shape.",
    "Correctly identifies cube, cylinder, sphere, and triangular prism/cone.",
    "Uses 2D names for 3D objects (e.g., calls a sphere a 'circle').",
    "Why is a basketball called a sphere and not a circle?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "A dice is a cube because all its faces are squares. A soup can is a cylinder because it has circles on top and bottom.",
        "execution_problems": ["What shape is a box of cereal?", "What shape is a globe?", "What shape is a party hat?", "What shape is a new unsharpened pencil?", "What shape is a block of butter?"],
        "endurance_problems": ["What shape is a book?", "If I stack 5 coins, what 3D shape do they make?"]
    }
)
g2b_exe_B = create_template(
    "G2b", "Execute", "B", "Shape Identification", [],
    "Ask: 'Find something in this room that is a cylinder. Now find a rectangular prism.'",
    "Finds appropriate objects and justifies the choice based on faces.",
    "Cannot find the shapes, or confuses cylinders with spheres.",
    "How many circular faces does your cylinder have?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "My water bottle is a cylinder. The book is a rectangular prism.",
        "execution_problems": ["Find a sphere", "Find a cube", "Find a cylinder", "Find a rectangular prism", "Find a cone (or something close)"],
        "endurance_problems": ["Find a 3D shape that has NO straight edges.", "Find an object made of TWO different 3D shapes."]
    }
)
g2b_exe_C = create_template(
    "G2b", "Execute", "C", "Shape Identification", [],
    "Say: 'I am thinking of a 3D shape. It has 6 faces, and they are all exactly the same square. What is it?'",
    "Identifies a cube.",
    "Guesses a rectangle or a sphere.",
    "How is a cube different from a rectangular prism like a cereal box?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "6 identical square faces make a cube. A dice is a cube.",
        "execution_problems": ["I have 0 flat faces. What am I? (Sphere)", "I have 2 circular faces and can roll. What am I? (Cylinder)", "I have 1 circular face and a point. What am I? (Cone)", "I have 6 rectangular faces. What am I? (Rectangular prism)"],
        "endurance_problems": ["I have 5 faces. Two are triangles, three are rectangles. What am I? (Triangular prism)", "Can a cylinder have square faces?"]
    }
)

# Discern
g2b_dis_A = create_template(
    "G2b", "Discern", "A", "Error detection", [],
    "Show a drawing of a cube. Say: 'Someone says this shape has only 3 faces because that is all they can see in the picture. How do you explain they are wrong?'",
    "Explains that 3D shapes have a back, bottom, and hidden sides. Uses a real object to prove 6 faces.",
    "Agrees there are only 3 faces.",
    "Why can't we draw all the sides of a box on a flat piece of paper at the same time?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_dis_B = create_template(
    "G2b", "Discern", "B", "Error detection", [],
    "Say: 'My friend says a sphere is the best shape for building a tall tower. Why is that a terrible idea?'",
    "Explains that spheres have no flat faces to stack, so they will roll away.",
    "Doesn't understand the physical properties of stacking.",
    "What is the best shape for building a wall, and why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_dis_C = create_template(
    "G2b", "Discern", "C", "Error detection", [],
    "Say: 'Someone looked at a cylinder from the top down and said 'That's a circle!' Are they right or wrong?'",
    "Explains that the *face* is a circle, but the whole object is a cylinder.",
    "Agrees it is just a circle.",
    "If you look at a cube straight on, what 2D shape do you see?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2b_own_A = create_template(
    "G2b", "Own", "A", "Design", [],
    "Ask: 'Design a robot using 3D shapes. Tell me which shape you used for the head, the body, and the wheels. Why did you choose those shapes?'",
    "Designs a model, naming the 3D shapes and justifying their physical properties (e.g., cylinders for wheels so it can roll).",
    "Just draws a flat picture and uses 2D names.",
    "Could your robot stand up if its feet were spheres?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_own_B = create_template(
    "G2b", "Own", "B", "Design", [],
    "Ask: 'If you had to invent a new box for shipping balls, what 3D shape would the box be and why?'",
    "Suggests a rectangular prism (or a larger cylinder) and explains how spheres fit inside.",
    "Cannot conceptualize a container.",
    "Why are most shipping boxes rectangular prisms instead of cylinders?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2b_own_C = create_template(
    "G2b", "Own", "C", "Design", [],
    "Say: 'Write a riddle for a 3D shape. Give 3 clues about its faces, edges, or if it can roll. Let me guess.'",
    "Writes a solvable riddle using structural properties of a 3D shape.",
    "Gives vague clues like 'it's blue'.",
    "What is the most helpful clue you gave me?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2c: Standard Measurement - Length ---

# Encounter
g2c_enc_A = create_template(
    "G2c", "Encounter", "A", "Physical measurement", ["A ruler with cm markings", "a book", "a pencil"],
    "Show the child how to line up the '0' mark of the ruler with the edge of the book. Ask them to measure the book and the pencil.",
    "Lines up the 0 mark (not the edge of the ruler itself if different) and reads the closest cm mark at the other end.",
    "Starts measuring from the '1' mark, or reads the wrong side of the ruler (inches).",
    "Why do we start at the zero line instead of the edge of the stick?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_enc_B = create_template(
    "G2c", "Encounter", "B", "Physical measurement", ["String", "scissors", "ruler"],
    "Ask the child to cut a piece of string that is exactly 15 cm long.",
    "Measures the string against the ruler starting at 0, and cuts accurately.",
    "Cuts first and measures later, or measures from 1.",
    "If you wanted a string twice as long, how many cm would it be?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_enc_C = create_template(
    "G2c", "Encounter", "C", "Physical measurement", ["A meter stick or measuring tape"],
    "Show how big 1 meter is. Ask: 'Find 3 things in this room that are longer than 1 meter, and 3 things that are shorter.'",
    "Uses the meter as a benchmark to compare lengths.",
    "Guesses wildly without comparing.",
    "Is your bed longer or shorter than a meter? How do you know?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2c_exe_A = create_template(
    "G2c", "Execute", "A", "Measurement estimation and calculation", [],
    "Show a picture of a pencil lying next to a broken ruler. The pencil starts at the 3cm mark and ends at the 10cm mark. Ask: 'How long is the pencil?'",
    "Subtracts 3 from 10 (or counts the spaces) to find the length is 7cm.",
    "Says the pencil is 10cm long.",
    "If the pencil moved to start at the 5cm mark, where would it end?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The pencil starts at 3 and ends at 10. I count the jumps: 4, 5, 6, 7, 8, 9, 10. That's 7 jumps. Or I do 10 - 3 = 7cm.",
        "execution_problems": ["Starts at 2cm, ends at 8cm. How long?", "Starts at 5cm, ends at 14cm. How long?", "Starts at 10cm, ends at 20cm. How long?", "Starts at 1cm, ends at 6cm. How long?", "Starts at 8cm, ends at 15cm. How long?"],
        "endurance_problems": ["A pencil is 6cm long. It ends at the 10cm mark. Where did it start?", "Starts at 95cm, ends at 102cm."]
    }
)
g2c_exe_B = create_template(
    "G2c", "Execute", "B", "Measurement estimation and calculation", [],
    "Ask: 'If you have a string that is 12 cm long, and you tie it to a string that is 8 cm long, how long is the new string?'",
    "Adds 12 + 8 = 20 cm.",
    "Subtracts them.",
    "Does tying them together make a bigger number or a smaller number?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Joining strings means adding their lengths. 12 cm + 8 cm = 20 cm.",
        "execution_problems": ["15 cm + 5 cm", "20 cm string, cut off 6 cm. What's left?", "10 m + 14 m", "30 cm - 12 cm", "8 cm + 9 cm"],
        "endurance_problems": ["I have three strings: 5cm, 10cm, 15cm. Total?", "I need 50cm of tape. I have 24cm. How much more do I need?"]
    }
)
g2c_exe_C = create_template(
    "G2c", "Execute", "C", "Measurement estimation and calculation", [],
    "Ask: 'Would you measure a football field in centimeters or meters? Why?'",
    "Chooses meters, explaining that cm are too small and would take too long/be a huge number.",
    "Chooses centimeters.",
    "What would be a good thing to measure in centimeters?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Centimeters are small (like a finger width). Meters are big (like a giant step). Measure a field with meters.",
        "execution_problems": ["Measure a pencil: cm or m?", "Measure the height of a house: cm or m?", "Measure a bug: cm or m?", "Measure a car: cm or m?", "Measure a book: cm or m?"],
        "endurance_problems": ["Is it possible to measure a house in cm? Why don't we do it?", "Measure the distance to the next town: meters or something else?"]
    }
)

# Discern
g2c_dis_A = create_template(
    "G2c", "Discern", "A", "Error detection", [],
    "Show a drawing of a stick being measured. The ruler's '1' mark is lined up with the left edge of the stick. The right edge is at '8'. Someone says the stick is 8cm long. Are they right?",
    "Explains that because they started at 1 instead of 0, the stick is actually 7cm long.",
    "Agrees the stick is 8cm long.",
    "If you start counting from 1 instead of 0, what happens to your final answer?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_dis_B = create_template(
    "G2c", "Discern", "B", "Error detection", [],
    "Say: 'My friend measured a table and said it is 50 long. What is wrong with their answer?'",
    "Notices the missing unit (cm vs m).",
    "Thinks 50 is a fine answer.",
    "Why is '50' a useless answer if you want to buy a tablecloth?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_dis_C = create_template(
    "G2c", "Discern", "C", "Error detection", [],
    "Show a ruler drawn with unequal spacing between the numbers. Say: 'Can I use this to measure my shoe?'",
    "Explains that standard measurement requires equal units. A 'cm' must always be exactly the same size.",
    "Says yes, just count the numbers.",
    "Why did people invent rulers instead of just using their feet to measure things?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2c_own_A = create_template(
    "G2c", "Own", "A", "Design and application", [],
    "Ask: 'If we didn't have a ruler, invent a new standard unit of measurement using something in this room. Tell me how you would make sure everyone measures the exact same way.'",
    "Chooses an object (e.g., a specific block) and explains how to lay it end-to-end with no gaps or overlaps.",
    "Suggests using something variable (like hands) without standardizing.",
    "If your friend used THEIR thumb, and you used YOUR thumb, would you get the same number?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_own_B = create_template(
    "G2c", "Own", "B", "Design and application", [],
    "Ask: 'Draw a map showing a path from a tree to a house. Write a math problem about how long the total path is.'",
    "Draws a path with multiple segments, labels them with lengths (e.g., 5m, 10m), and creates an addition problem.",
    "Draws a path without numbers or units.",
    "If someone walks there and back, how far do they walk?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2c_own_C = create_template(
    "G2c", "Own", "C", "Design and application", [],
    "Say: 'Teach me how to measure a curvy line, like a snake drawn on paper, using a piece of string and a straight ruler.'",
    "Explains laying the string along the curve, marking it, then straightening the string against the ruler.",
    "Tries to bend the ruler or says it's impossible.",
    "Why can't you just measure the snake from head to tail with the straight ruler?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2d: Standard Measurement - Mass & Capacity ---

# Encounter
g2d_enc_A = create_template(
    "G2d", "Encounter", "A", "Physical comparison", ["A 1kg bag of sugar or flour", "a small toy", "a large empty box"],
    "Let the child hold the 1kg bag in one hand. Call this 'one kilogram'. Let them hold the small toy, then the empty box. Ask: 'Which is heavier than 1kg? Which is lighter?'",
    "Uses the 1kg bag as a benchmark to compare mass, realizing the large box can be lighter than the small bag.",
    "Guesses the box is heavier just because it is bigger.",
    "Does being bigger always mean being heavier?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_enc_B = create_template(
    "G2d", "Encounter", "B", "Physical comparison", ["A 1-litre bottle of water", "a small cup", "a large bowl", "water"],
    "Show the 1-litre bottle. Ask: 'Do you think this water will fit in the small cup? What about the big bowl? Let's pour it to find out.'",
    "Observes that 'capacity' means how much it holds, and visually estimates if containers hold more or less than 1 litre.",
    "Thinks the tall skinny cup holds more than the wide bowl.",
    "If I pour the water from the tall bottle into the wide bowl, is there still 1 litre of water?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_enc_C = create_template(
    "G2d", "Encounter", "C", "Physical measurement", ["Kitchen scale", "various household items"],
    "Show how to put an item on the scale and read the number in grams/kg. Ask them to weigh 3 different items.",
    "Places items correctly and reads the number.",
    "Pushes down on the scale or doesn't look at the numbers.",
    "What happens to the numbers on the scale when you add another item?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2d_exe_A = create_template(
    "G2d", "Execute", "A", "Estimation and calculation", [],
    "Ask: 'If a bag of rice is 5 kg, and a bag of beans is 3 kg, how many kg of food do we have altogether?'",
    "Adds 5 + 3 = 8 kg.",
    "Just adds numbers without understanding the context.",
    "If we ate 2 kg of rice, how much food would be left?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "We have 5 kg of rice and 3 kg of beans. 5 + 3 = 8. So we have 8 kg total.",
        "execution_problems": ["10 kg + 4 kg", "15 litres - 5 litres", "8 kg + 9 kg", "20 litres + 10 litres", "12 kg - 6 kg"],
        "endurance_problems": ["I buy three bags of sugar: 2kg, 3kg, and 5kg. Total?", "I have a 10-litre bucket. I put in 4 litres, then 5 litres. Is it full?"]
    }
)
g2d_exe_B = create_template(
    "G2d", "Execute", "B", "Estimation and calculation", [],
    "Say: 'A recipe needs 2 litres of water. You have a 1-litre jug. How many jugs do you need to pour in?'",
    "Understands the unit translation (1+1=2).",
    "Cannot figure out how to use the 1-litre jug.",
    "What if the recipe needed 5 litres?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "I need 2 litres. My jug holds 1 litre. So I pour 1 jug, then a 2nd jug.",
        "execution_problems": ["Need 4 litres. Use a 2-litre jug. How many pours?", "Need 10 kg. Have 2 kg weights. How many?", "Need 6 litres. Have 1-litre jug. How many?", "Need 15 kg. Have 5 kg bags. How many?", "Need 8 litres. Have 4-litre jug. How many?"],
        "endurance_problems": ["Need 5 litres. I have a 2-litre jug. Can I get exactly 5 litres easily?", "I have a 10kg bag of flour. I want to split it into two equal bags. How many kg in each?"]
    }
)
g2d_exe_C = create_template(
    "G2d", "Execute", "C", "Estimation and calculation", [],
    "Ask: 'Which is a better estimate for the weight of a bicycle: 15 kg or 150 kg?'",
    "Chooses 15 kg, relating 150 kg to something impossibly heavy (like a car or huge animal).",
    "Guesses 150 kg.",
    "What is something that might weigh 150 kg?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "A big bag of rice is 10 kg. A bike is a little heavier than that, so 15 kg. 150 kg would be like 15 bags of rice!",
        "execution_problems": ["Weight of a cat: 4 kg or 40 kg?", "Capacity of a bathtub: 15 litres or 150 litres?", "Weight of an apple: 200 grams or 20 kg?", "Capacity of a teacup: 2 litres or 200 milliliters?", "Weight of a car: 10 kg or 1000 kg?"],
        "endurance_problems": ["Is it possible for a balloon to be bigger than a brick but weigh less?", "Which is heavier: 1 kg of rocks or 1 kg of feathers?"]
    }
)

# Discern
g2d_dis_A = create_template(
    "G2d", "Discern", "A", "Error detection", [],
    "Say: 'A child says: 'My glass is taller than your mug, so my glass definitely holds more water.' Are they right?'",
    "Explains that capacity depends on width AND height. A short, wide mug can hold more than a tall, skinny glass.",
    "Agrees the taller glass holds more.",
    "How could we prove which one holds more water?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_dis_B = create_template(
    "G2d", "Discern", "B", "Error detection", [],
    "Say: 'Someone wrote: 5 kg + 3 litres = 8. What is wrong with this math?'",
    "Explains you cannot add mass (kg) and capacity (litres) together.",
    "Thinks it's fine because 5+3=8.",
    "If I have 5 apples and 3 rocks, do I have 8 apple-rocks?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_dis_C = create_template(
    "G2d", "Discern", "C", "Error detection", [],
    "Show two boxes of the same size. One is full of books, one is empty. Say: 'My friend says these weigh the same because they are the same size.'",
    "Explains that volume (size) is not the same as mass (weight).",
    "Agrees they weigh the same.",
    "If I filled one box with air and one with water, which would be heavier?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2d_own_A = create_template(
    "G2d", "Own", "A", "Design", [],
    "Ask: 'Write a recipe for a magic potion. You must include 3 liquids measured in litres and 2 solid ingredients measured in kg. What is the total volume of liquid?'",
    "Creates a recipe with appropriate units and correctly sums the liquid volumes.",
    "Mixes up kg and litres, or cannot add them.",
    "Why didn't you add the kg to the litres to find the total liquid?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_own_B = create_template(
    "G2d", "Own", "B", "Design", [],
    "Ask: 'Design a challenge for me where I have to figure out how many 2-litre bottles I need to fill a giant 20-litre fish tank.'",
    "Creates the division/repeated addition problem (10 bottles).",
    "Makes an unsolvable problem.",
    "What if I only had a 5-litre bucket? How many times would I fill it?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2d_own_C = create_template(
    "G2d", "Own", "C", "Design", [],
    "Say: 'Teach me how to balance a scale if I put a 5 kg weight on one side, but I only have 1 kg and 2 kg weights to put on the other side.'",
    "Suggests combinations like five 1kg weights, or two 2kg and one 1kg weight.",
    "Cannot find a combination to equal 5.",
    "Is there more than one way to make 5 kg with those smaller weights?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2e: Perimeter ---

# Encounter
g2e_enc_A = create_template(
    "G2e", "Encounter", "A", "Physical measurement", ["A book", "string or yarn"],
    "Ask: 'Can you use this string to measure exactly how far it is to walk all the way around the edge of this book?' Let them wrap the string and then stretch it out.",
    "Wraps the string tightly around the perimeter, then measures the full string length, understanding it represents the continuous boundary.",
    "Only measures one side, or doesn't keep the string tight on the corners.",
    "Why does the string get so long when we straighten it out?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_enc_B = create_template(
    "G2e", "Encounter", "B", "Physical measurement", ["A rectangular table", "hands/spans"],
    "Say: 'Let's measure the distance around the edge of this table using only our hands. Walk all the way around it placing hand over hand. How many hands is it?'",
    "Understands that 'around' means adding up all four sides continuously.",
    "Only measures the two long sides.",
    "If an ant wanted to walk the edge of the table and get back to where it started, would it have to walk all four sides?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_enc_C = create_template(
    "G2e", "Encounter", "C", "Physical measurement", ["Grid paper or floor tiles"],
    "Tape a square on the floor tiles. Say: 'Walk the line of the tape. How many steps (tiles) did you take to get all the way back to the start?'",
    "Counts the total steps around the boundary.",
    "Counts the tiles inside the square.",
    "Are you walking on the inside or on the edge? Why does that matter?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2e_exe_A = create_template(
    "G2e", "Execute", "A", "Calculation from drawing", [],
    "Show a drawing of a triangle with sides labeled 5cm, 6cm, and 7cm. Ask: 'What is the distance around this whole shape?'",
    "Adds all three sides (5+6+7=18cm) to find the perimeter.",
    "Only adds two sides, or multiplies.",
    "If you only added 5 and 6, where would the ant stop walking?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The shape has 3 sides: 5, 6, and 7. I add them: 5 + 6 = 11. 11 + 7 = 18. The perimeter is 18.",
        "execution_problems": ["Triangle: 3cm, 4cm, 5cm", "Rectangle: 10m, 5m, 10m, 5m", "Square: 2cm, 2cm, 2cm, 2cm", "Pentagon: all sides are 3cm", "Hexagon: all sides are 1m"],
        "endurance_problems": ["A rectangle has sides 4cm and 6cm. Only two sides have numbers written on them. What is the total perimeter?", "A triangle has sides 10cm, 10cm, and 5cm."]
    }
)
g2e_exe_B = create_template(
    "G2e", "Execute", "B", "Calculation from drawing", [],
    "Say: 'A square has one side that is 4 cm long. What is the distance all the way around?'",
    "Knows that a square has 4 equal sides, so 4+4+4+4=16cm.",
    "Says 4cm, or asks for the other sides.",
    "Why didn't I need to tell you how long the other three sides are?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "A square has 4 sides that are all the same. If one is 4, they are all 4. 4 + 4 + 4 + 4 = 16.",
        "execution_problems": ["Square with side 5", "Square with side 2", "Square with side 10", "Square with side 3", "Square with side 6"],
        "endurance_problems": ["A square has a perimeter of 20cm. How long is ONE side?", "If a triangle has 3 equal sides and the perimeter is 15, how long is one side?"]
    }
)
g2e_exe_C = create_template(
    "G2e", "Execute", "C", "Calculation from drawing", [],
    "Show a rectangle where only the top (8cm) and left side (3cm) are labeled. Ask: 'What is the perimeter?'",
    "Knows opposite sides are equal. Calculates 8+3+8+3=22cm.",
    "Only adds 8+3=11cm.",
    "What do you know about the top and bottom of a rectangle?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The top is 8, so the bottom is 8. The left is 3, so the right is 3. 8+8+3+3 = 22.",
        "execution_problems": ["Rectangle: Top 5, Side 2", "Rectangle: Top 10, Side 4", "Rectangle: Top 6, Side 6", "Rectangle: Top 7, Side 1", "Rectangle: Top 12, Side 5"],
        "endurance_problems": ["A rectangle has perimeter 14. The top is 4. What is the side? (Hard!)", "A rectangle has perimeter 20. The top is 8."]
    }
)

# Discern
g2e_dis_A = create_template(
    "G2e", "Discern", "A", "Error detection", [],
    "Show a rectangle labeled 5 and 3. Someone calculated the perimeter as 5 + 3 = 8. Ask: 'What did they forget?'",
    "Explains they only measured halfway around the shape.",
    "Agrees the perimeter is 8.",
    "If they only walked 8 steps, did they make it back to the start?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_dis_B = create_template(
    "G2e", "Discern", "B", "Error detection", [],
    "Draw two different shapes: a long skinny rectangle (10x1) and a square (3x3). Both have perimeter ~22-24, but look different. Say: 'Can two shapes that look completely different have the exact same perimeter?'",
    "Yes, perimeter is just the length of the string needed to go around. You can bend that string into any shape.",
    "No, different shapes must have different perimeters.",
    "If I take a string loop and stretch it into a triangle, then a square, did the string change length?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_dis_C = create_template(
    "G2e", "Discern", "C", "Error detection", [],
    "Show an 'L' shaped room. The perimeter is calculated by adding all 6 sides. Say: 'A builder only added the 4 outside corners. Is that the perimeter?'",
    "Explains you MUST count every single straight edge that touches the outside.",
    "Agrees you only need 4 numbers.",
    "What happens to the fence if you skip those inner walls?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2e_own_A = create_template(
    "G2e", "Own", "A", "Design", [],
    "Ask: 'Draw three completely different shapes that ALL have a perimeter of 12 cm.'",
    "Draws varied polygons (e.g., 3x3 square, 4x2 rectangle, 5+4+3 triangle) where sides sum to 12.",
    "Draws shapes without checking the sum.",
    "How did you make sure the string going around them would be exactly 12 for all of them?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_own_B = create_template(
    "G2e", "Own", "B", "Design", [],
    "Ask: 'Design a garden where the perimeter is exactly 20 meters, but it is NOT a square.'",
    "Designs a rectangle (e.g., 6x4) or another shape where sides sum to 20.",
    "Cannot break away from the square (5x5) or gets the sum wrong.",
    "If the top is 7m, what MUST the other sides be to make exactly 20m?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2e_own_C = create_template(
    "G2e", "Own", "C", "Design", [],
    "Say: 'Write a word problem about building a fence for a goat. The person solving it has to find the perimeter to get the right amount of fence.'",
    "Writes a problem defining the side lengths of an area and asks for total boundary length.",
    "Writes an area problem or forgets to ask a question.",
    "Why is a fence a perimeter problem and not an area problem?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2f: Area - Conceptual ---

# Encounter
g2f_enc_A = create_template(
    "G2f", "Encounter", "A", "Physical covering", ["A book", "identical playing cards or small square tiles"],
    "Ask the child: 'How many cards do we need to completely cover the front of this book without leaving any spaces?'",
    "Lays out the cards in a grid, covering the surface with no gaps or overlaps. Counts the total.",
    "Leaves gaps, overlaps cards, or only lines the edges.",
    "Why can't we leave spaces between the cards if we want to know how big the cover is?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_enc_B = create_template(
    "G2f", "Encounter", "B", "Physical covering", ["Two pieces of paper (one long skinny, one short fat)", "small blocks"],
    "Say: 'Which piece of paper is bigger? Let's prove it by seeing how many blocks it takes to cover each one.'",
    "Uses the blocks as a standard unit of area to compare two different shapes.",
    "Guesses based on length alone without covering.",
    "Even though this one is longer, why did the other one need more blocks?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_enc_C = create_template(
    "G2f", "Encounter", "C", "Physical covering", ["Grid paper", "crayons"],
    "Draw a large rectangle on the grid paper. Say: 'Color the inside of this shape. Count how many little squares you colored.'",
    "Colors the interior and counts the squares, understanding that area is the 2D space inside.",
    "Only colors the outline (perimeter).",
    "What is the difference between coloring the line around the shape, and coloring the squares inside?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2f_exe_A = create_template(
    "G2f", "Execute", "A", "Counting area", [],
    "Show a picture of a rectangle drawn on a grid. Ask the child to find the area by counting the squares.",
    "Accurately counts all the squares inside the boundary.",
    "Miscounts, or counts the perimeter lines.",
    "Is there a faster way to count them instead of 1 by 1? (Looking for rows/columns).",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The shape covers 12 squares on the grid. So the area is 12 square units.",
        "execution_problems": ["Find area of a 3x3 square on grid", "Find area of a 2x5 rectangle on grid", "Find area of a 4x4 square on grid", "Find area of a 1x8 rectangle on grid", "Find area of an L-shape made of 6 squares"],
        "endurance_problems": ["Find the area of a shape where 2 squares are cut out of the middle.", "Find the area of a large 5x6 rectangle without counting every single one."]
    }
)
g2f_exe_B = create_template(
    "G2f", "Execute", "B", "Counting area", [],
    "Show an irregular shape made of straight lines on a grid (like a cross or stairs). Ask for the area.",
    "Carefully counts all the full squares.",
    "Tries to multiply length x width on a shape that isn't a rectangle.",
    "Why can't we just multiply the sides on this shape?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "This is a staircase shape. I count the blocks: 1, 2, 3, 4, 5, 6. The area is 6.",
        "execution_problems": ["Area of a 'T' shape", "Area of a 'C' shape", "Area of a plus sign", "Area of a hollow square (frame)", "Area of a random blob on grid"],
        "endurance_problems": ["Area of a shape where two 'half squares' make a whole.", "Draw a shape with an area of exactly 8."]
    }
)
g2f_exe_C = create_template(
    "G2f", "Execute", "C", "Array connection", [],
    "Show a 3x4 rectangle on a grid. Ask: 'How many squares? Can you write a multiplication equation for this?'",
    "Connects the concept of area to the array model of multiplication (3 x 4 = 12).",
    "Just counts by 1s and cannot write the equation.",
    "How does knowing your times tables help you find the area faster?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The rectangle has 3 rows of 4. 3 x 4 = 12 squares.",
        "execution_problems": ["Equation for a 2x6 area", "Equation for a 5x5 area", "Equation for a 4x2 area", "Equation for a 3x5 area", "Equation for a 1x10 area"],
        "endurance_problems": ["A rectangle has an area of 20. The top row has 5 squares. How many rows are there?", "Can a shape with area 12 be a square?"]
    }
)

# Discern
g2f_dis_A = create_template(
    "G2f", "Discern", "A", "Error detection", [],
    "Show a rectangle covered with coins, but there are big gaps between the coins. Someone says 'The area is 10 coins.' Is that accurate?",
    "Explains that area requires covering the surface completely. Circles leave gaps, so they are bad for measuring area.",
    "Agrees the area is 10.",
    "Why do we use squares to measure area instead of circles?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_dis_B = create_template(
    "G2f", "Discern", "B", "Error detection", [],
    "Show two shapes on a grid. A 4x4 square, and a 8x2 rectangle. Ask: 'My friend says the square is bigger because it's taller. Is she right?'",
    "Calculates the area of both (16) and proves they take up the exact same amount of space.",
    "Agrees the square is 'bigger'.",
    "Can two shapes look totally different but use the same amount of paint to cover?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_dis_C = create_template(
    "G2f", "Discern", "C", "Error detection", [],
    "Draw a shape on a grid and count the perimeter. Say: 'The area is 14.'",
    "Corrects the error: you counted the lines around the outside, not the squares inside.",
    "Agrees with the perimeter count as area.",
    "If we were building a house, what is the perimeter, and what is the area?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2f_own_A = create_template(
    "G2f", "Own", "A", "Design", [],
    "Ask: 'Draw a house on grid paper. Make sure the area of the house is exactly 24 squares.'",
    "Creates a composite shape (e.g., rectangle with a triangle roof) where the total interior is 24 units.",
    "Draws a house without counting, or counts the perimeter.",
    "How did you keep track of the squares to make sure you didn't go over 24?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_own_B = create_template(
    "G2f", "Own", "B", "Design", [],
    "Say: 'I want to build a rectangular dog pen with an area of 12 squares. Draw all the different ways I could build it.'",
    "Draws 1x12, 2x6, and 3x4 rectangles.",
    "Only finds one way.",
    "Which of these pens would give the dog the most room to run in a straight line?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2f_own_C = create_template(
    "G2f", "Own", "C", "Design", [],
    "Ask: 'Explain the difference between perimeter and area to someone who has never heard those words before.'",
    "Uses a clear real-world analogy (e.g., perimeter is the fence, area is the grass).",
    "Uses confusing math jargon or gets them mixed up.",
    "If I want to put a carpet in my room, do I need to know the area or the perimeter?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2g: Line Symmetry ---

# Encounter
g2g_enc_A = create_template(
    "G2g", "Encounter", "A", "Physical folding", ["Paper cutouts of shapes (square, circle, irregular triangle)"],
    "Say: 'Fold these shapes in half so that both sides match perfectly. Which ones work and which ones don't?'",
    "Folds the symmetrical shapes correctly to demonstrate matching halves. Cannot fold the irregular triangle perfectly.",
    "Folds the shapes randomly without matching the edges.",
    "Why does the circle fold perfectly, but the weird triangle leaves parts sticking out?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_enc_B = create_template(
    "G2g", "Encounter", "B", "Physical creation", ["Paint", "paper"],
    "Have the child paint a design on one half of a piece of paper. Fold the paper in half and press down. Open it up. Ask: 'What happened to the painting?'",
    "Observes that folding creates an exact mirror image on the other side.",
    "Smears the paint without noticing the reflection.",
    "If you drew a bird wing on one side, what would happen on the other side when you fold it?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_enc_C = create_template(
    "G2g", "Encounter", "C", "Physical exploration", ["A small mirror", "various pictures or objects"],
    "Put a mirror straight down the middle of a picture of a face, or a butterfly. Ask: 'Does the mirror show the whole picture or something different?'",
    "Uses the mirror to find the line of symmetry where the reflection completes the original image perfectly.",
    "Cannot align the mirror properly.",
    "What happens if you put the mirror across the butterfly's wing instead of its body?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2g_exe_A = create_template(
    "G2g", "Execute", "A", "Identifying symmetry", [],
    "Show drawings of a heart, a capital 'A', a capital 'R', and a star. Ask the child to draw the line of symmetry on the ones that have it.",
    "Correctly draws the vertical line on the heart and 'A'. Recognizes 'R' has none.",
    "Draws a line on 'R', or draws horizontal lines on 'A'.",
    "How can you check if your line is in the right place? (Imagine folding it).",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The letter A has a line of symmetry straight down the middle. If I fold it there, the left side matches the right side perfectly.",
        "execution_problems": ["Draw line of symmetry on an 'M'", "Draw line of symmetry on a 'C'", "Draw line of symmetry on a rectangle", "Does an 'S' have a line of symmetry?", "Draw line of symmetry on a smiley face"],
        "endurance_problems": ["Find all the lines of symmetry on a square. (There are 4!)", "Does a circle have 1 line of symmetry, 2, or more?"]
    }
)
g2g_exe_B = create_template(
    "G2g", "Execute", "B", "Identifying symmetry", [],
    "Show half a drawing on a grid (e.g., half a house). The line of symmetry is drawn. Ask the child to complete the drawing on the other side.",
    "Mirrors the drawing accurately across the line.",
    "Copies the drawing exactly instead of mirroring it (e.g., drawing two left halves).",
    "If the roof goes UP and to the LEFT on this side, where does it go on the other side?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The line is in the middle. The drawing goes 2 squares left. So on the other side, I draw a line 2 squares RIGHT.",
        "execution_problems": ["Complete half a tree", "Complete half a butterfly", "Complete half a square", "Complete half a star", "Complete a zig-zag line"],
        "endurance_problems": ["Complete a drawing where the line of symmetry is horizontal (like a reflection in water).", "Complete half a complex shape (like a robot)."]
    }
)
g2g_exe_C = create_template(
    "G2g", "Execute", "C", "Identifying symmetry", [],
    "Ask: 'Find 3 things in this room that are symmetrical. Show me where the line is.'",
    "Identifies symmetrical objects (e.g., a chair, a window, a face) and traces the center line.",
    "Picks asymmetrical objects (like a shoe facing sideways).",
    "Is a shoe symmetrical by itself? What about a PAIR of shoes?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The TV screen is symmetrical. The line goes straight down the middle.",
        "execution_problems": ["Is a fork symmetrical?", "Is a cup with one handle symmetrical?", "Is a door symmetrical?", "Is a plain plate symmetrical?", "Is your hand symmetrical?"],
        "endurance_problems": ["Find something that is symmetrical top-to-bottom but NOT left-to-right.", "Is a person symmetrical from the side?"]
    }
)

# Discern
g2g_dis_A = create_template(
    "G2g", "Discern", "A", "Error detection", [],
    "Show a rectangle with a diagonal line drawn from corner to corner. Someone says: 'This is a line of symmetry because both sides are the same triangle.' Is that right?",
    "Explains that while they are the same triangle, folding them on that line does not make them match up perfectly (the points stick out).",
    "Agrees it is a line of symmetry.",
    "If you actually folded a piece of paper on that line, what would it look like?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_dis_B = create_template(
    "G2g", "Discern", "B", "Error detection", [],
    "Show a picture of a face with a mole on one cheek. The line of symmetry is drawn down the nose. Ask: 'Is this perfectly symmetrical?'",
    "Notices the mole breaks the symmetry.",
    "Ignores the small detail and says it's symmetrical.",
    "What has to happen for something to be PERFECTLY symmetrical?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_dis_C = create_template(
    "G2g", "Discern", "C", "Error detection", [],
    "Show a drawing of an arrow pointing right. A vertical line is drawn through the middle. Is it a line of symmetry?",
    "Explains no, because the left side is flat and the right side is pointy.",
    "Guesses yes.",
    "Where would you draw the line so that both halves DO match?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2g_own_A = create_template(
    "G2g", "Own", "A", "Design", [],
    "Ask: 'Draw a completely new shape that has exactly TWO lines of symmetry (like a cross or a rectangle). Show me both lines.'",
    "Designs an appropriate shape and draws both a vertical and horizontal line of symmetry.",
    "Draws a square (4 lines) or a shape with 1 or 0.",
    "How do you know there aren't any MORE lines of symmetry hiding in your shape?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_own_B = create_template(
    "G2g", "Own", "B", "Design", [],
    "Say: 'Create a secret code or drawing where half of it is covered. I have to guess what it is using symmetry.'",
    "Draws half a recognizable symmetrical object.",
    "Draws half an asymmetrical object, making it impossible to guess.",
    "Why does your drawing HAVE to be symmetrical for me to guess the other half?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2g_own_C = create_template(
    "G2g", "Own", "C", "Design", [],
    "Ask: 'Write your name in capital letters. Which letters have lines of symmetry? Draw them in.'",
    "Analyzes their own name and finds lines of symmetry (e.g., A, H, I, M, O, T, U, V, W, X, Y).",
    "Draws lines on letters that don't have them (like J or L).",
    "Can any letter have a horizontal line of symmetry? (Like B or C or D or E or H or I or K or O or X).",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- G2h: Directions & Simple Maps ---

# Encounter
g2h_enc_A = create_template(
    "G2h", "Encounter", "A", "Physical navigation", ["An open space (room or yard)"],
    "Play 'Robot'. Say: 'I am the remote control. You are the robot. Take 3 steps forward. Turn right. Take 2 steps forward. Turn left.'",
    "Follows instructions accurately, distinguishing left from right and forward/backward.",
    "Confuses left and right, or turns the wrong way.",
    "If I say 'turn around', how is that different from 'turn right'?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_enc_B = create_template(
    "G2h", "Encounter", "B", "Physical navigation", ["A grid drawn on the floor (or floor tiles)", "a toy"],
    "Place a toy on the grid. Stand on a different tile. Ask: 'Tell me exactly how to walk to the toy using only the words: forward, backward, left, right, and a number of squares.'",
    "Gives a valid sequence of instructions (e.g., 'Forward 3 squares, turn right, forward 2 squares').",
    "Uses pointing, or non-specific language ('go that way').",
    "Why do you have to tell me to 'turn' before telling me to go forward again?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_enc_C = create_template(
    "G2h", "Encounter", "C", "Physical navigation", ["A simple drawn map of a room or yard"],
    "Draw a quick map of the room with a few key features (door, window, table). Put an 'X' on the map. Ask: 'Walk to the spot in the real room where the X is on the map.'",
    "Translates the 2D bird's-eye view into 3D physical space and navigates to the correct location.",
    "Cannot orient the map to the room.",
    "How did you know you had to walk past the table to get there?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
g2h_exe_A = create_template(
    "G2h", "Execute", "A", "Map reading", [],
    "Show a simple grid map (like a town). A car is at position A1. The school is at C4. Ask: 'Give me directions to drive the car to school.'",
    "Provides a step-by-step path (e.g., 'Go right 2 blocks, go up 3 blocks').",
    "Draws a diagonal line, ignoring the grid structure (buildings).",
    "If the road going 'up' was blocked, could you find another way?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Start at the car. Move right 1, 2 blocks. Now turn and move up 1, 2, 3 blocks to the school.",
        "execution_problems": ["Map: Park to House", "Map: Shop to Library", "Map: House to Lake", "Map: Lake to Park", "Map: Library to Shop"],
        "endurance_problems": ["Find two DIFFERENT paths to get from the House to the Park.", "Give directions, but you are not allowed to go 'Up' on the first move."]
    }
)
g2h_exe_B = create_template(
    "G2h", "Execute", "B", "Grid References", [],
    "Show a grid with letters (A-D) on the bottom and numbers (1-4) on the side. Ask: 'What is located at square B3?'",
    "Correctly finds the intersection of column B and row 3.",
    "Looks at B or 3 independently, finding the wrong object.",
    "Why do we need BOTH a letter and a number to find something on a map?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Find B on the bottom. Move your finger up. Stop when you are next to the 3 on the side. The object is a tree.",
        "execution_problems": ["What is at A1?", "What is at C4?", "What is at D2?", "What is at B2?", "What is at A4?"],
        "endurance_problems": ["Where is the house located? (Give the coordinates)", "Is B3 the same as 3B?"]
    }
)
g2h_exe_C = create_template(
    "G2h", "Execute", "C", "Compass Basics", [],
    "Show a map with a compass rose (North, South, East, West). Ask: 'If you are at the lake, which direction do you walk to get to the mountains?'",
    "Uses the compass rose to identify the correct cardinal direction.",
    "Uses 'up' or 'down' instead of North/South.",
    "If North is 'up' on the map, does that mean you are walking uphill?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The mountains are at the bottom of the map. The compass shows 'South' points to the bottom. So walk South.",
        "execution_problems": ["Which direction from Forest to City?", "Which direction from City to Lake?", "Which direction from Lake to Forest?", "Which direction is the river flowing?", "If you walk East from the mountains, what do you hit?"],
        "endurance_problems": ["You walk North, then turn East. Where are you now?", "If you are facing North, what direction is behind you?"]
    }
)

# Discern
g2h_dis_A = create_template(
    "G2h", "Discern", "A", "Error detection", [],
    "Say: 'A pirate wrote a treasure map: Start at the big rock. Walk 10 steps. Dig.' What is wrong with these instructions?",
    "Identifies that the instructions are missing a direction (which way to walk).",
    "Thinks the instructions are fine.",
    "If you just walked 10 steps any way you wanted, would you find the treasure?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_dis_B = create_template(
    "G2h", "Discern", "B", "Error detection", [],
    "Show a map of a classroom. The door is at the top. The teacher's desk is at the bottom. The instructions say 'Walk straight out the door to get to the teacher's desk.' Is this right?",
    "Notices the map is oriented differently than the instructions assume, or the starting point is confused.",
    "Agrees with the instructions blindly.",
    "When you hold a map, why does it help to turn the map so it matches the room?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_dis_C = create_template(
    "G2h", "Discern", "C", "Error detection", [],
    "Say: 'My friend gave coordinates for the hidden toy as 'B'. Why can't I find it?'",
    "Explains that 'B' is a whole column, so you need a number to know which specific square in column B.",
    "Looks in square B1 by default.",
    "How many different squares are in column B?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
g2h_own_A = create_template(
    "G2h", "Own", "A", "Design", [],
    "Ask: 'Draw a map of your bedroom. Include a grid (like A, B, C and 1, 2, 3) over it. Tell me the coordinates of your bed.'",
    "Creates a functional map with a coordinate system and accurately locates an object.",
    "Draws a picture without top-down perspective or forgets the grid.",
    "If you moved your bed to the other side of the room, what would the new coordinates be?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_own_B = create_template(
    "G2h", "Own", "B", "Design", [],
    "Ask: 'Hide a toy somewhere in the house. Write down 3 directional clues (using left, right, forward, or North/South) for me to find it.'",
    "Generates clear, sequential, and accurate spatial instructions from a fixed starting point.",
    "Uses relative/unhelpful clues ('it's near the couch').",
    "Why is it important to tell me exactly where to start before I read your clues?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
g2h_own_C = create_template(
    "G2h", "Own", "C", "Design", [],
    "Say: 'Invent a new compass. Instead of North, South, East, West, use 4 landmarks around our house/school (like 'Towards the road', 'Towards the big tree'). Draw it.'",
    "Creates a localized orientation system based on stable landmarks.",
    "Uses things that move (like 'towards the car').",
    "Why do real compasses use magnetic North instead of landmarks like trees?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone Tasks
g2a_milestone = create_template(
    "G2a", "Milestone", "M", "Real-world situation", [],
    "You are helping build a new table. The carpenter says, 'I need a piece of wood for the top. It has 4 straight sides, but only two of them are the same length.' What does the piece of wood look like?",
    "Child describes or draws a trapezoid or irregular quadrilateral, recognizing it cannot be a square or rectangle.",
    "Describes a rectangle or square.",
    "If it was a rectangle, how many sides would be the same length?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "A stop sign has 8 sides. If a car crashes into it and breaks off one corner straight across, how many sides does the sign have now?"}
)
g2b_milestone = create_template(
    "G2b", "Milestone", "M", "Real-world situation", [],
    "We need to pack these delicate glass spheres into a box. If we just put them in a big square box, they will roll around and break. What should we do to pack them safely?",
    "Child suggests using cylinders (like tubes) or creating smaller cube compartments to hold them still.",
    "Suggests just putting them in the box.",
    "Why does a sphere roll, and how does a tube stop it?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "If you stack three cylinders on top of each other, what new shape do you get?"}
)
g2c_milestone = create_template(
    "G2c", "Milestone", "M", "Real-world situation", [],
    "Aunty needs a new string for her clothesline. The distance between the two poles is exactly 5 giant steps. She wants to go to the shop to buy the string. What should she tell the shopkeeper?",
    "Child realizes 'giant steps' is not a standard unit and suggests measuring the steps with a ruler or meter stick first to get a number in meters or cm.",
    "Says 'buy 5 giant steps of string'.",
    "Will the shopkeeper's giant step be the same size as Aunty's?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You need a piece of wood exactly as long as your arm. You only have a ruler that is shorter than your arm. How do you measure it?"}
)
g2d_milestone = create_template(
    "G2d", "Milestone", "M", "Real-world situation", [],
    "We are going on a long hike. We have a big, light sleeping bag and a small, heavy rock. Which one should go in the backpack to make it easier to carry?",
    "Child distinguishes between mass (heavy rock) and volume (big sleeping bag), choosing to leave the heavy rock behind.",
    "Leaves the sleeping bag because it is 'bigger'.",
    "Does taking up a lot of space mean something is hard to carry?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You have a 5-litre bucket of water and need exactly 3 litres. You only have an empty 2-litre jug. How do you do it?"}
)
g2e_milestone = create_template(
    "G2e", "Milestone", "M", "Real-world situation", [],
    "Uncle wants to put a new wooden frame around his rectangular picture. The picture is 10 hands wide and 15 hands long. He has a piece of wood that is 40 hands long. Is it enough?",
    "Child calculates the perimeter (10+15+10+15 = 50) and realizes 40 is not enough.",
    "Only adds 10+15 and says yes.",
    "If he only uses 25 hands of wood, what parts of the picture won't have a frame?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "A farmer has 12 pieces of fence. What is the best shape to put them in to hold the most sheep?"}
)
g2f_milestone = create_template(
    "G2f", "Milestone", "M", "Real-world situation", [],
    "We spilled juice all over the table! We need to wipe it up. Should we use the long piece of string or the flat towel? Why?",
    "Child chooses the towel because it covers a surface (area), while the string only covers a line.",
    "Chooses the string because it is long.",
    "Can a string cover the whole spill at the exact same time?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You want to paint one wall of your room. How do you figure out how much paint to buy?"}
)
g2g_milestone = create_template(
    "G2g", "Milestone", "M", "Real-world situation", [],
    "You are making a butterfly mask out of paper. You want the left wing to look EXACTLY like the right wing. What is the fastest way to cut it out?",
    "Child suggests folding the paper in half and cutting both sides at once.",
    "Suggests drawing it very carefully twice.",
    "Why does folding it guarantee that the sides match perfectly?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Look at a leaf from a tree. Is it perfectly symmetrical? Why or why not?"}
)
g2h_milestone = create_template(
    "G2h", "Milestone", "M", "Real-world situation", [],
    "A stranger asks you how to get to the hospital. You tell them 'Go straight, then turn left.' They get lost. What important information did you forget to tell them?",
    "Child realizes the instructions lack a distance/landmark (e.g., 'go straight for 2 blocks' or 'turn left at the big tree').",
    "Cannot identify the missing information.",
    "How do they know WHEN to turn left?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "If you are facing the rising sun, and you turn right, what direction are you facing?"}
)

templates.extend([
    g2a_enc_A, g2a_enc_B, g2a_enc_C, g2a_exe_A, g2a_exe_B, g2a_exe_C, g2a_dis_A, g2a_dis_B, g2a_dis_C, g2a_own_A, g2a_own_B, g2a_own_C, g2a_milestone,
    g2b_enc_A, g2b_enc_B, g2b_enc_C, g2b_exe_A, g2b_exe_B, g2b_exe_C, g2b_dis_A, g2b_dis_B, g2b_dis_C, g2b_own_A, g2b_own_B, g2b_own_C, g2b_milestone,
    g2c_enc_A, g2c_enc_B, g2c_enc_C, g2c_exe_A, g2c_exe_B, g2c_exe_C, g2c_dis_A, g2c_dis_B, g2c_dis_C, g2c_own_A, g2c_own_B, g2c_own_C, g2c_milestone,
    g2d_enc_A, g2d_enc_B, g2d_enc_C, g2d_exe_A, g2d_exe_B, g2d_exe_C, g2d_dis_A, g2d_dis_B, g2d_dis_C, g2d_own_A, g2d_own_B, g2d_own_C, g2d_milestone,
    g2e_enc_A, g2e_enc_B, g2e_enc_C, g2e_exe_A, g2e_exe_B, g2e_exe_C, g2e_dis_A, g2e_dis_B, g2e_dis_C, g2e_own_A, g2e_own_B, g2e_own_C, g2e_milestone,
    g2f_enc_A, g2f_enc_B, g2f_enc_C, g2f_exe_A, g2f_exe_B, g2f_exe_C, g2f_dis_A, g2f_dis_B, g2f_dis_C, g2f_own_A, g2f_own_B, g2f_own_C, g2f_milestone,
    g2g_enc_A, g2g_enc_B, g2g_enc_C, g2g_exe_A, g2g_exe_B, g2g_exe_C, g2g_dis_A, g2g_dis_B, g2g_dis_C, g2g_own_A, g2g_own_B, g2g_own_C, g2g_milestone,
    g2h_enc_A, g2h_enc_B, g2h_enc_C, g2h_exe_A, g2h_exe_B, g2h_exe_C, g2h_dis_A, g2h_dis_B, g2h_dis_C, g2h_own_A, g2h_own_B, g2h_own_C, g2h_milestone
])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_3_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_3_templates.json with partial capacity data.")
