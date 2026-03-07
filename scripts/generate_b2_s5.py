import json
import os

templates = []

# Base context variants for reuse
default_context = {
    "default": {
      "objects": ["blocks", "tiles", "cards"],
      "currency": "dollars",
      "names": ["Alex", "Sam", "Pat"],
      "food": ["apples", "oranges"]
    },
    "ug": {
      "objects": ["stones", "bottle caps", "sticks"],
      "currency": "UGX",
      "names": ["Amara", "Tendo", "Nala"],
      "food": ["mangoes", "matooke", "groundnuts"]
    }
}

def create_template(cap_id, cog_level, var_id, task_type, materials, parent_prompt, success, fail, reasoning, rep_arc, worksheet, parent_primer=""):
    return {
        "capacity_id": cap_id,
        "strand": 5,
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

# --- M2: Structured Modeling (Translating word problems into math models) ---
# Note: As per the spine, Band 2 Strand 5 tasks involve translating a word problem into math.
# They require capacities from Strands 1-4.
# Example from spine: "The school garden has 3 rows with 8 plants each. How many plants? Draw it. Write the equation."
# Integrates: D4 (Multiplication as Equal Groups), G2f (Area - Conceptual)

# Encounter
m2_enc_A = create_template(
    "M2", "Encounter", "A", "Physical modeling", ["24 small objects (e.g., beans or blocks)"],
    "Say: 'We are planting a small garden. Make 3 rows, and put 4 plants in each row. How many plants did we use in total?'",
    "Child arranges objects into a 3x4 array and correctly counts 12 total.",
    "Child makes uneven rows, random groups, or miscounts.",
    "How does arranging them in rows make it easier to count them all?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_enc_B = create_template(
    "M2", "Encounter", "B", "Physical modeling", ["A box or outline on paper", "Small square tiles or blocks"],
    "Say: 'This box is the floor of a new room. We are laying square tiles. Put 5 tiles in a row along one wall, and keep making rows until you have 4 rows. How many tiles cover the floor?'",
    "Child creates a 4x5 array inside the boundary and counts 20 total tiles.",
    "Child places tiles randomly without rows, or miscounts the total.",
    "If we took away one entire row, how many tiles would be left?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_enc_C = create_template(
    "M2", "Encounter", "C", "Physical modeling", ["Paper", "Pencil", "15 small objects"],
    "Say: 'We have 15 books. We want to put them on shelves so that every shelf has exactly 5 books. Make the piles, then draw a picture of the shelves.'",
    "Child makes 3 equal piles of 5, then draws a representation showing 3 shelves with 5 items each.",
    "Child makes unequal piles, or draws a picture that doesn't match the physical model.",
    "How did you know you needed exactly 3 shelves?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
m2_exe_A = create_template(
    "M2", "Execute", "A", "Structured translation", [],
    "Say: 'A baker has 4 trays of cookies. Each tray holds 6 cookies. Draw a picture of the trays, then write a math sentence (equation) that shows how to find the total number of cookies.'",
    "Child draws 4 groups of 6 and writes '4 x 6 = 24' or '6 + 6 + 6 + 6 = 24'.",
    "Child writes the wrong numbers, adds 4 and 6 to get 10, or draws an incorrect picture.",
    "Why did you use the number 6 four times in your model?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Draw 4 boxes. Put 6 dots in each box. The equation is 4 x 6 = 24.",
        "execution_problems": ["3 cars, 4 wheels each. Draw and write the equation.", "5 boxes of crayons, 8 crayons per box. Draw and write the equation.", "2 bags of apples, 7 apples per bag. Draw and write the equation.", "6 rows of chairs, 5 chairs per row. Draw and write the equation."],
        "endurance_problems": ["4 trays, 5 cookies each, and 1 extra cookie on a plate. Draw and write the equation for the total.", "3 dogs, 4 legs each, and 1 bird with 2 legs. Draw and write the equation for the total legs."]
    }
)
m2_exe_B = create_template(
    "M2", "Execute", "B", "Structured translation", [],
    "Say: 'We are building a fence. The yard is shaped like a rectangle. It is 5 steps long and 3 steps wide. Draw the yard and write an equation to show how many steps of fence we need to go all the way around.'",
    "Child draws a rectangle, labels the sides (5, 3, 5, 3), and writes an equation like '5 + 3 + 5 + 3 = 16'.",
    "Child only adds 5 + 3 = 8, forgetting the other two sides.",
    "Why are there four numbers in your addition sentence instead of just two?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Draw a rectangle. Top is 5, bottom is 5. Left is 3, right is 3. Perimeter is 5 + 5 + 3 + 3 = 16.",
        "execution_problems": ["A rectangular garden is 4 meters long and 2 meters wide. Draw and find the perimeter.", "A square rug is 3 feet on one side. Draw and find the perimeter.", "A rectangular pool is 6 meters long and 4 meters wide. Draw and find the perimeter.", "A triangular sign has sides of 3, 4, and 5 inches. Draw and find the perimeter."],
        "endurance_problems": ["A rectangular park is 10 steps long and 5 steps wide. There is a gate that is 2 steps wide. Draw and find how much fence is needed. (10+10+5+5-2=28)", "A rectangular table is 6 feet long and 3 feet wide. You want to put a border around it, but one 3-foot side is against the wall. Find the border length."]
    }
)
m2_exe_C = create_template(
    "M2", "Execute", "C", "Structured translation", [],
    "Say: 'I asked 5 friends what their favorite color is. 3 said Red, 2 said Blue. Draw a bar graph to show this data, then write a math sentence showing the total number of friends I asked.'",
    "Child draws a bar graph with 'Red' at 3 and 'Blue' at 2, and writes '3 + 2 = 5'.",
    "Child draws the graph incorrectly (e.g., no labels, wrong heights) or writes an incorrect equation.",
    "How does your graph show the same information as your math sentence?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Draw a baseline. Label Red and Blue. Draw Red bar up to 3, Blue bar up to 2. Equation: 3 + 2 = 5.",
        "execution_problems": ["4 cats, 1 dog. Draw a bar graph and write the total equation.", "2 people like apples, 4 like bananas. Draw a bar graph and write the total equation.", "3 sunny days, 3 rainy days. Draw a bar graph and write the total equation."],
        "endurance_problems": ["5 red cars, 2 blue cars, 1 green car. Draw a bar graph and write the total equation.", "4 boys, 3 girls, 2 adults. Draw a bar graph and write the total equation."]
    }
)

# Discern
m2_dis_A = create_template(
    "M2", "Discern", "A", "Error detection", [],
    "Say: 'A word problem says: There are 5 cars. Each car has 4 wheels. My friend drew 5 circles and 4 circles, and wrote 5 + 4 = 9 wheels. What is wrong with their model?'",
    "Child explains that the friend added cars and wheels together, instead of putting 4 wheels ON EACH of the 5 cars.",
    "Child thinks the math is correct because 5 + 4 is 9.",
    "How should the drawing look to correctly show wheels on cars?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_dis_B = create_template(
    "M2", "Discern", "B", "Error detection", [],
    "Say: 'The problem is to find the perimeter of a rectangular field that is 6 meters long and 2 meters wide. My friend wrote 6 + 2 = 8 meters. What part of the real world did they forget?'",
    "Child identifies that a rectangle has four sides, and the friend only accounted for two of them.",
    "Child agrees with the friend's answer.",
    "If you only build 8 meters of fence, what will the field look like?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_dis_C = create_template(
    "M2", "Discern", "C", "Error detection", [],
    "Say: 'My friend collected data on favorite pets. They tallied 4 Dogs, 3 Cats, and 2 Fish. To find the total, they multiplied 4 x 3 x 2. Why does their math model not fit the real world?'",
    "Child explains that to find a total number of different things combined, you must add, not multiply.",
    "Child thinks multiplying is just another way to get a big total.",
    "If you actually multiply 4 x 3 x 2, you get 24. Do you have 24 pets here?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
m2_own_A = create_template(
    "M2", "Own", "A", "Design and Justification", [],
    "Say: 'Invent a word problem about our house that requires multiplication to solve it. Tell me the problem, draw a picture to model it, and write the math equation.'",
    "Child creates a valid scenario involving equal groups (e.g., 'There are 3 windows, and each has 2 curtains'), models it accurately, and writes the correct equation.",
    "Child creates an addition problem (e.g., '3 windows and 2 doors'), or the model/equation doesn't match the story.",
    "How do you know for sure your story requires multiplication and not just addition?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_own_B = create_template(
    "M2", "Own", "B", "Design and Justification", [],
    "Say: 'I will give you an equation: 4 + 4 + 4 + 4 = 16. Write a short story about building something that uses this equation. Then draw a diagram of what you built.'",
    "Child invents a story involving four sides of equal length (like a square fence) or four groups of four items, and draws a matching model.",
    "Child just writes an abstract story ('I had 4 numbers and added them') without a real-world object or diagram.",
    "If you changed your story to be about a triangle, what would the equation look like?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
m2_own_C = create_template(
    "M2", "Own", "C", "Design and Justification", [],
    "Say: 'Design a simple map of a small park with a path running through it. Write down a set of instructions using steps and directions (left/right) so someone can walk the path. Then, write an equation to show how many total steps long the path is.'",
    "Child draws a map, writes clear directional instructions (e.g., 'Walk 10 steps, turn right, walk 5 steps'), and provides the correct total sum.",
    "Child's instructions don't match the map, or the equation is missing/incorrect.",
    "If I walked the path backwards, would the total number of steps be the same? Why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
m2_milestone = create_template(
    "M2", "Milestone", "M", "Real-world situation", [],
    "We need to buy new tiles to cover the bathroom floor completely. We don't want to buy too many, and we don't want to run out. What exactly do you need to do to figure out how many tiles to buy?",
    "Child describes a process of modeling the area: counting how many tiles fit along the length and width, and multiplying them (or drawing a grid to count the total).",
    "Child suggests guessing, or just measuring one side.",
    "If you know the floor is 6 tiles long and 5 tiles wide, why do you multiply them instead of adding 6 and 5?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You want to figure out how many total wheels are on all the bicycles parked at the school. You can't count them one by one because there are too many. What is a faster way to find out?"}
)

templates.extend([
    m2_enc_A, m2_enc_B, m2_enc_C,
    m2_exe_A, m2_exe_B, m2_exe_C,
    m2_dis_A, m2_dis_B, m2_dis_C,
    m2_own_A, m2_own_B, m2_own_C,
    m2_milestone
])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_5_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_5_templates.json successfully.")
