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
        "strand": 4,
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

# --- P2a: Data Collection (surveys, counting, recording) ---

# Encounter
p2a_enc_A = create_template(
    "P2a", "Encounter", "A", "Physical data collection", ["Paper", "pencil"],
    "Say: 'Go to three different rooms. Count how many chairs are in each room and write the numbers down.'",
    "Child correctly counts and records the number of chairs for each of the three rooms.",
    "Child guesses without counting, or forgets to record the numbers.",
    "If someone else looked at your paper, would they know which room has the most chairs? Why?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_enc_B = create_template(
    "P2a", "Encounter", "B", "Physical data collection", ["Handful of mixed coins or small objects"],
    "Put a handful of mixed items on the table. Say: 'Group these by type. Count how many are in each group and tell me the totals.'",
    "Child physically sorts the items, counts them accurately, and reports the totals.",
    "Child miscounts, or doesn't separate the items before counting.",
    "Why is it easier to count them after you sort them into piles?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_enc_C = create_template(
    "P2a", "Encounter", "C", "Physical data collection", ["Paper", "pencil"],
    "Say: 'Ask three people in the house (or family members) what their favorite color is. Write down their answers.'",
    "Child successfully conducts the survey and records the responses.",
    "Child makes up answers instead of asking, or forgets the responses.",
    "How did you make sure you remembered everyone's answer correctly?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2a_exe_A = create_template(
    "P2a", "Execute", "A", "Data recording", [],
    "Say: 'I am going to name some animals: Dog, Cat, Dog, Bird, Dog, Cat. Make a list showing how many of each animal I said.'",
    "Child correctly records 3 Dogs, 2 Cats, 1 Bird using numbers, tally marks, or pictures.",
    "Child misses an animal or counts incorrectly.",
    "How can you check if your total matches the number of animals I named?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "If I say Apple, Banana, Apple, you write: Apple - 2, Banana - 1.",
        "execution_problems": ["Record: Red, Blue, Red, Red, Green.", "Record: Car, Bus, Car, Bike, Car.", "Record: Yes, No, Yes, Yes, Yes."],
        "endurance_problems": ["Record: Dog (bark), Cat (meow), Dog (bark). Ignore the sounds, just count the animals.", "Record: Big apple, Small apple, Banana. Just count the fruit types, ignore the sizes."]
    }
)
p2a_exe_B = create_template(
    "P2a", "Execute", "B", "Data recording", [],
    "Show a picture with various shapes (e.g., 4 circles, 3 squares, 5 triangles). Say: 'Make a table to show how many of each shape there are.'",
    "Child creates a basic table or list correctly identifying the quantities of each shape.",
    "Child miscounts or organizes the data in a confusing way.",
    "If I add one more square to the picture, how do you change your table?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Circles: 4. Squares: 3. Triangles: 5.",
        "execution_problems": ["Count 3 cars, 2 trucks, 4 bikes in a picture.", "Count 5 red balls, 2 blue balls in a picture.", "Count 1 sun, 3 clouds, 2 trees."],
        "endurance_problems": ["Count 4 red cars and 2 blue trucks. Group them just by color.", "Count 3 big stars and 4 small stars. Group them all as stars."]
    }
)
p2a_exe_C = create_template(
    "P2a", "Execute", "C", "Data recording", [],
    "Say: 'Look at your bookshelf or a stack of books. Count how many are thick and how many are thin. Write it down.'",
    "Child correctly categorizes and counts the books based on the given constraint.",
    "Child counts all books together without categorizing.",
    "What rule did you use to decide if a book was thick or thin?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Thick books: 5. Thin books: 7.",
        "execution_problems": ["Count long pencils vs short pencils.", "Count plates vs bowls in the kitchen.", "Count shoes with laces vs no laces."],
        "endurance_problems": ["Count thick books, thin books, and magazines.", "Count red thick books vs blue thick books."]
    }
)

# Discern
p2a_dis_A = create_template(
    "P2a", "Discern", "A", "Error detection", [],
    "Show a list: 'Dogs: 3, Cats: 2, Dogs: 1'. Say: 'My friend counted pets, but their list looks funny. What is wrong with how they recorded the data?'",
    "Child points out that 'Dogs' should be combined into a single total of 4.",
    "Child doesn't see a problem with having multiple entries for the same category.",
    "Why is it confusing to have 'Dogs' written in two different places on a list?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_dis_B = create_template(
    "P2a", "Discern", "B", "Error detection", [],
    "Say: 'I asked 5 people their favorite fruit. Here is my data: 2 said Apple, 2 said Banana. What is wrong?'",
    "Child realizes the total only adds up to 4, so one person's answer is missing.",
    "Child thinks the data is fine.",
    "If you know how many people you asked, how can you check if your data is complete?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_dis_C = create_template(
    "P2a", "Discern", "C", "Error detection", [],
    "Say: 'I want to know the most popular game in your class. I only asked my 2 best friends. Is this a good way to find out what the WHOLE class likes? Why?'",
    "Child explains that 2 people do not represent the whole class.",
    "Child thinks asking friends is sufficient.",
    "Who else should you ask to get a better answer?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2a_own_A = create_template(
    "P2a", "Own", "A", "Design and Justification", [],
    "Say: 'Design a survey to find out what we should have for dinner tomorrow. Tell me exactly what question you will ask and how you will record the answers.'",
    "Child proposes a clear question (e.g., 'Do you want pizza or pasta?') and a method to record votes.",
    "Child just picks a dinner without surveying, or has no plan for recording.",
    "If someone changes their mind, how will you fix your data?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_own_B = create_template(
    "P2a", "Own", "B", "Design and Justification", [],
    "Say: 'Invent a way to keep track of how many glasses of water you drink today without using numbers.'",
    "Child suggests drawing tally marks, moving a pebble for each glass, or coloring sections of a paper.",
    "Child insists on using numbers, or cannot think of an alternative tracking method.",
    "How will you know the total at the end of the day using your method?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2a_own_C = create_template(
    "P2a", "Own", "C", "Design and Justification", [],
    "Say: 'You need to figure out which drawer in the kitchen has the most things in it. Tell me your step-by-step plan.'",
    "Child explains a process of opening each drawer, counting the items, writing down the total for each, and then comparing the numbers.",
    "Child guesses based on drawer size, or doesn't include a recording step.",
    "Why is it important to write the numbers down instead of just trying to remember them?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2a_milestone = create_template(
    "P2a", "Milestone", "M", "Real-world situation", [],
    "We are going to the store to buy snacks for the family movie night. How do we make sure we get something everyone actually wants to eat, without just guessing?",
    "Child suggests asking everyone what they want and writing it down (taking a survey/collecting data).",
    "Child just lists things they personally like, or says 'buy everything'.",
    "If two people want the same thing, how do we make sure we get enough?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You want to prove to me that you have more toy cars than I have pens. What do you need to do?"}
)

templates.extend([
    p2a_enc_A, p2a_enc_B, p2a_enc_C,
    p2a_exe_A, p2a_exe_B, p2a_exe_C,
    p2a_dis_A, p2a_dis_B, p2a_dis_C,
    p2a_own_A, p2a_own_B, p2a_own_C,
    p2a_milestone
])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_4_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_4_templates.json with partial capacity data.")

# --- P2b: Bar Graphs & Tally Charts (reading AND creating) ---

# Encounter
p2b_enc_A = create_template(
    "P2b", "Encounter", "A", "Physical bar graph", ["Blocks", "books"],
    "Put 3 red blocks, 5 blue blocks, and 2 yellow blocks on the table. Say: 'Stack the blocks by color to see which color makes the tallest tower.'",
    "Child physically stacks the blocks and visually compares the heights.",
    "Child mixes the colors, or can't see the connection between tower height and quantity.",
    "Without counting the blocks, which color has the most? How do you know?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_enc_B = create_template(
    "P2b", "Encounter", "B", "Physical tally marks", ["Popsicle sticks", "pencils"],
    "Give the child a bunch of sticks. Say: 'We need to count these. Put down one stick for every finger on one hand. Then put another stick across them. This is a group of 5.'",
    "Child arranges sticks into a tally group of 4 straight lines and 1 diagonal line.",
    "Child makes a group of 5 parallel lines, or random piles.",
    "Why is grouping sticks like this faster than just putting them in a straight line?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_enc_C = create_template(
    "P2b", "Encounter", "C", "Physical bar graph", ["Coins", "buttons"],
    "Say: 'Line up all the big coins in a row starting at this line. Now line up the small coins next to them. Let's see which line goes further.'",
    "Child creates parallel lines of objects to compare lengths visually.",
    "Child makes lines of unequal starting points or spaces the items inconsistently.",
    "Why do the lines need to start at exactly the same place to be fair?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2b_exe_A = create_template(
    "P2b", "Execute", "A", "Tally reading", [],
    "Show a picture of tally marks (e.g., 3 groups of five, plus 2). Say: 'How many marks are here?'",
    "Child correctly identifies the tally marks representing 17, preferably by counting 5, 10, 15, 16, 17.",
    "Child counts every single mark by 1s, or misinterprets the cross line.",
    "How does the slanted line help you count faster?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "One bundle with a line across is 5. Two bundles is 10. Add 3 loose ones, that's 13.",
        "execution_problems": ["Read tally marks: one group of 5 and 4 lines.", "Read tally marks: 3 groups of 5.", "Read tally marks: 2 groups of 5 and 1 line.", "Read tally marks: 4 groups of 5."],
        "endurance_problems": ["Read tally marks: 5 groups of 5 and 2 lines.", "Read tally marks: 6 groups of 5 and 4 lines."]
    }
)
p2b_exe_B = create_template(
    "P2b", "Execute", "B", "Graph reading", [],
    "Show a simple bar graph (e.g., Cats: 4, Dogs: 6). Say: 'Look at the bar for Dogs. How many people chose Dogs?'",
    "Child correctly reads the value 6 from the axis aligned with the top of the bar.",
    "Child guesses, or counts the boxes incorrectly if there's a scale.",
    "How do you use the numbers on the side to find out how tall the bar is?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The bar for Dogs goes up to the line next to the number 6. So 6 people chose Dogs.",
        "execution_problems": ["Read bar graph: Apples: 3, Bananas: 5. How many Bananas?", "Read bar graph: Red: 7, Blue: 2. How many Red?", "Read bar graph: Car: 1, Bus: 4. How many Bus?", "Read bar graph: Yes: 8, No: 3. How many Yes?"],
        "endurance_problems": ["Read bar graph: Pizza: 6, Pasta: 4. How many more people like Pizza than Pasta?", "Read bar graph: Milk: 5, Juice: 5. Which is more popular?"]
    }
)
p2b_exe_C = create_template(
    "P2b", "Execute", "C", "Graph creation", [],
    "Say: 'I have 3 red apples and 5 green apples. Draw a bar graph to show this. Make sure the bars start at the bottom.'",
    "Child draws two bars, labeling one Red and one Green, with the Green bar noticeably taller.",
    "Child draws the bars sideways or floating, or makes them the same height.",
    "If I get 3 more red apples, what will you have to do to your drawing?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Draw a baseline. Write 'Red' and 'Green'. Draw a short box above Red for 3. Draw a taller box above Green for 5.",
        "execution_problems": ["Draw a bar graph: 4 cats, 2 dogs.", "Draw a bar graph: 1 car, 5 bikes.", "Draw a bar graph: 6 yes votes, 3 no votes."],
        "endurance_problems": ["Draw a bar graph: 2 big dogs, 4 small dogs, 1 cat.", "Draw a bar graph: 5 boys, 5 girls."]
    }
)

# Discern
p2b_dis_A = create_template(
    "P2b", "Discern", "A", "Error detection", [],
    "Show a bar graph where the numbers on the side skip around (1, 5, 2, 8). Say: 'What is wrong with the numbers on the side of this graph?'",
    "Child identifies that the scale is out of order, making the bar heights meaningless.",
    "Child thinks the numbers just show the exact values of the bars.",
    "Why must the numbers on the side go in order like a ruler?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_dis_B = create_template(
    "P2b", "Discern", "B", "Error detection", [],
    "Show tally marks: IIII I. Say: 'My friend tried to make a group of 5, but didn't put the line across. Is this still 5?'",
    "Child understands it represents 5 items, but points out it's not the correct way to make a tally bundle for easy counting.",
    "Child thinks it represents 6, or that it's wrong because it doesn't look like a bundle.",
    "If you have a lot of marks, why is it better to put the line across instead of just leaving a space?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_dis_C = create_template(
    "P2b", "Discern", "C", "Error detection", [],
    "Show two bar graphs. Graph 1 has a tall bar for 3 (each line is 1). Graph 2 has a short bar for 50 (each line is 10). Say: 'Which number is bigger? But which bar is taller? Why?'",
    "Child explains that the tallness depends on the numbers on the side (the scale), not just the number of items.",
    "Child insists the taller bar always means more items.",
    "If you want to trick someone into thinking 3 is bigger than 50, how would you draw the graph?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2b_own_A = create_template(
    "P2b", "Own", "A", "Design and Justification", [],
    "Say: 'Create a tally chart to show how many shirts, pants, and socks you are wearing right now.'",
    "Child correctly identifies and records the quantities using tally marks.",
    "Child uses numbers instead of tallies, or miscounts.",
    "If you put on a jacket, how would you update your chart?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_own_B = create_template(
    "P2b", "Own", "B", "Design and Justification", [],
    "Say: 'I want you to make a bar graph showing the favorite colors of 4 imaginary friends. You decide the colors and the numbers. Make sure one color is a tie with another.'",
    "Child creates a complete graph with labels, an ordered scale, and two bars of equal height.",
    "Child forgets labels, scale, or doesn't include a tie.",
    "How can someone tell just by looking at the graph that there is a tie, without reading the numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2b_own_C = create_template(
    "P2b", "Own", "C", "Design and Justification", [],
    "Say: 'Teach me how to read a bar graph using a drawing of two towers.'",
    "Child explains that the taller tower means more, and shows how to check the numbers on the side.",
    "Child just says 'the big one wins' without explaining how to read the actual values.",
    "What do the words at the bottom of the towers tell us?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2b_milestone = create_template(
    "P2b", "Milestone", "M", "Real-world situation", [],
    "You are counting passing cars: 12 red, 15 blue, and 8 white. What is the fastest way to write this down quickly while they drive by, so you don't lose count?",
    "Child suggests using tally marks.",
    "Child suggests writing full words or trying to remember them all.",
    "Why are tally marks faster than writing the number '12' and then erasing it to write '13'?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You want to show your family quickly who ate the most cookies this week. What picture could you draw to show them clearly?"}
)

templates.extend([
    p2b_enc_A, p2b_enc_B, p2b_enc_C,
    p2b_exe_A, p2b_exe_B, p2b_exe_C,
    p2b_dis_A, p2b_dis_B, p2b_dis_C,
    p2b_own_A, p2b_own_B, p2b_own_C,
    p2b_milestone
])

# --- P2c: Asking Good Questions (what question does this data answer?) ---

# Encounter
p2c_enc_A = create_template(
    "P2c", "Encounter", "A", "Physical matching", ["3 different items (e.g., shoe, spoon, book)", "3 sticky notes (labels)"],
    "Put the items out with sticky notes saying: 'Size 6', 'Silver', '100 pages'. Ask: 'Which question goes with each item? A) How long is it to read? B) What color is it? C) Will it fit my foot?'",
    "Child correctly matches the item, its property, and the corresponding question.",
    "Child mismatches properties and items, or cannot identify the correct question.",
    "Why does '100 pages' answer 'How long is it to read' and not 'Will it fit my foot'?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_enc_B = create_template(
    "P2c", "Encounter", "B", "Physical data translation", ["A small pile of 4 rocks and 2 leaves"],
    "Show the pile. Say: 'I have 4 rocks and 2 leaves. What is a question you could ask where the answer is 4?'",
    "Child asks a question like 'How many rocks are there?'",
    "Child asks 'How many leaves?' or 'What are these?'",
    "If the answer was 6, what question would you have asked?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_enc_C = create_template(
    "P2c", "Encounter", "C", "Physical data translation", ["A jar of water"],
    "Hold up the jar. Say: 'The answer is \"Half full.\" What was the question?'",
    "Child asks 'How full is the jar?' or 'How much water is in the jar?'",
    "Child asks 'Is it water?' or 'Is it empty?'",
    "If the answer was 'Water,' what would the question be?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2c_exe_A = create_template(
    "P2c", "Execute", "A", "Question identification", [],
    "Say: 'Here is some data: 12 people took the bus, 5 people walked, 3 people rode bikes. Which of these questions does this data answer? A) What is the most popular color? B) How do people get to work? C) How many cars are there?'",
    "Child correctly identifies option B.",
    "Child chooses A or C.",
    "Why doesn't this data answer question C?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The data is about taking the bus, walking, and bikes. These are ways to get somewhere. So it answers 'How do people get to work?'",
        "execution_problems": ["Data: 5 apples, 3 bananas. Question: A) Favorite fruit? B) Favorite animal?", "Data: 10 cats, 2 dogs. Question: A) How many pets? B) What color are they?", "Data: 7 sunny days, 2 rainy days. Question: A) What is the weather? B) How hot is it?", "Data: 4 blue shirts, 1 red shirt. Question: A) What size are they? B) What color are they?"],
        "endurance_problems": ["Data: 5 tall buildings, 2 short buildings. Question: A) How high are they? B) How old are they?", "Data: 3 fast cars, 2 slow cars. Question: A) How much do they cost? B) How fast are they?"]
    }
)
p2c_exe_B = create_template(
    "P2c", "Execute", "B", "Question generation", [],
    "Say: 'The answer is 7. The data is: 3 boys and 4 girls. What is the question?'",
    "Child formulates a question like 'How many children are there in total?'",
    "Child asks 'How many girls?' or doesn't use the provided data.",
    "How did you know the question was asking for the total?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The data is 3 boys and 4 girls. The answer is 7. 3 + 4 = 7. So the question is 'How many children total?'",
        "execution_problems": ["Answer: 3. Data: 5 birds, 2 flew away. What is the question?", "Answer: 10. Data: 6 red cars, 4 blue cars. What is the question?", "Answer: 2. Data: 4 cookies, I ate 2. What is the question?", "Answer: 5. Data: 2 pens, 3 pencils. What is the question?"],
        "endurance_problems": ["Answer: 1. Data: 3 slices of pizza, 2 slices eaten. What is the question?", "Answer: 8. Data: 4 dogs, 4 cats. What is the question?"]
    }
)
p2c_exe_C = create_template(
    "P2c", "Execute", "C", "Question identification", [],
    "Show a simple bar graph with only two bars: 'Apples (6)' and 'Oranges (4)'. Say: 'Tell me two different questions this graph can answer.'",
    "Child asks 'Which fruit is more popular?' and 'How many people like apples?' or similar.",
    "Child asks questions not covered by the graph, like 'Are the apples red?'",
    "Can this graph tell us if they liked bananas? Why not?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "The graph shows 6 Apples and 4 Oranges. It answers: 1. How many like Apples? (6). 2. How many total? (10).",
        "execution_problems": ["Graph: 3 dogs, 2 cats. Give one question.", "Graph: 5 red shirts, 1 blue shirt. Give one question.", "Graph: 4 sunny days, 3 rainy days. Give one question."],
        "endurance_problems": ["Graph: 2 big trucks, 2 small trucks. Give a question about the total.", "Graph: 5 fast runners, 1 slow runner. Give a question comparing them."]
    }
)

# Discern
p2c_dis_A = create_template(
    "P2c", "Discern", "A", "Error detection", [],
    "Say: 'My friend collected data on the ages of everyone in our class. Then they said, \"This proves that our class loves pizza the most.\" Why are they wrong?'",
    "Child explains that age data cannot answer a question about food preferences.",
    "Child agrees with the friend, or is confused.",
    "What kind of data would you need to collect to prove what the class loves to eat?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_dis_B = create_template(
    "P2c", "Discern", "B", "Error detection", [],
    "Say: 'I want to know who the fastest runner is. So I measured how tall everyone is. Did I answer my question? Why?'",
    "Child explains that height does not equal speed, so the data doesn't answer the question.",
    "Child thinks tall people are always faster.",
    "What should I have measured instead?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_dis_C = create_template(
    "P2c", "Discern", "C", "Error detection", [],
    "Show a list: 'Apples: 5, Bananas: 3'. Say: 'Someone looked at this and asked: Are the apples red or green? Can this list tell them? Why?'",
    "Child explains the list only gives the number of apples, not their color.",
    "Child assumes a color based on the fruit name.",
    "If you wanted to know the color, how would you change the list?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2c_own_A = create_template(
    "P2c", "Own", "A", "Design and Justification", [],
    "Say: 'Think of a question about our family that you don't know the answer to. Tell me the question, and then tell me exactly what data you would need to collect to answer it.'",
    "Child formulates a measurable question (e.g., 'Who sleeps the longest?') and an appropriate data collection method (recording sleep times).",
    "Child asks an unmeasurable question ('Who is the best?'), or cannot link it to data.",
    "If you collected the data and two people had the exact same answer, what does that tell you?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_own_B = create_template(
    "P2c", "Own", "B", "Design and Justification", [],
    "Say: 'Create a short list of data (just 3 numbers and labels) that answers the question: What is the most common shoe size in this house?'",
    "Child creates relevant data, e.g., 'Size 3: 2 pairs. Size 8: 1 pair. Size 10: 1 pair.'",
    "Child lists random items or numbers unrelated to shoe sizes.",
    "Why must you include the labels (like 'Size 3') and not just the numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2c_own_C = create_template(
    "P2c", "Own", "C", "Design and Justification", [],
    "Say: 'Teach me why we need to ask the RIGHT question before we start counting things.'",
    "Child explains that if you count the wrong things (like counting colors when you want to know sizes), your numbers are useless.",
    "Child cannot articulate the connection between the goal and the method.",
    "Can you give me an example of counting the wrong thing?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2c_milestone = create_template(
    "P2c", "Milestone", "M", "Real-world situation", [],
    "We found a box of old keys. You want to figure out which room has the most doors. Can counting these keys tell you that?",
    "Child realizes keys do not equal doors, and that the keys might go to locks, cars, or other houses. The data doesn't answer the question.",
    "Child assumes more keys means more doors.",
    "What is the only way to truly find out which room has the most doors?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "A sign at a store says '100 Happy Customers!' Does this sign tell you what they bought? Why or why not?"}
)

templates.extend([
    p2c_enc_A, p2c_enc_B, p2c_enc_C,
    p2c_exe_A, p2c_exe_B, p2c_exe_C,
    p2c_dis_A, p2c_dis_B, p2c_dis_C,
    p2c_own_A, p2c_own_B, p2c_own_C,
    p2c_milestone
])

# --- P2d: Mode (which appears most often?) ---

# Encounter
p2d_enc_A = create_template(
    "P2d", "Encounter", "A", "Physical grouping", ["A handful of coins or small mixed items", "Paper"],
    "Put the coins in a pile. Say: 'Sort these by size. Which pile is the biggest? Without counting, just point to the group that has the most in it.'",
    "Child visually identifies the largest group after sorting.",
    "Child points to the largest coin instead of the largest group, or guesses without sorting.",
    "If you put the biggest pile next to the smallest pile, what do you notice?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_enc_B = create_template(
    "P2d", "Encounter", "B", "Physical grouping", ["Cards or pictures (e.g., 3 dogs, 1 cat, 4 birds)"],
    "Lay the cards out randomly. Say: 'Group all the same animals together. Which animal showed up the most often?'",
    "Child correctly groups the cards and identifies the birds as the most frequent.",
    "Child groups them incorrectly or guesses.",
    "If I hide one bird card, which animal shows up the most often now?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_enc_C = create_template(
    "P2d", "Encounter", "C", "Physical grouping", ["Mismatched socks from the laundry"],
    "Give the child a pile of socks (e.g., 5 white, 2 black, 1 striped). Say: 'Sort these by color. Which color do we have the most of right here?'",
    "Child sorts by color and correctly identifies white as the most common.",
    "Child tries to match pairs instead of grouping all similar colors, or guesses without sorting.",
    "Why is it easier to find out which color is most common by sorting them first?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2d_exe_A = create_template(
    "P2d", "Execute", "A", "Finding mode from a list", [],
    "Show a list of numbers: 2, 5, 2, 8, 2, 1. Say: 'Which number is in this list the most times?'",
    "Child identifies 2 as the most frequent number.",
    "Child points to 8 because it is the largest value, or guesses.",
    "How can you prove that 2 is there more times than 5?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The number 2 appears three times. The others appear once. So 2 is the most frequent.",
        "execution_problems": ["Find most frequent: 1, 1, 3, 4, 1.", "Find most frequent: 7, 6, 7, 7, 2.", "Find most frequent: 9, 9, 8, 5, 9.", "Find most frequent: 3, 3, 3, 3, 2."],
        "endurance_problems": ["Find most frequent: 1, 2, 1, 2, 1, 3, 1.", "Find most frequent: 5, 5, 6, 6, 6."]
    }
)
p2d_exe_B = create_template(
    "P2d", "Execute", "B", "Finding mode from a tally chart", [],
    "Show a tally chart: Apples (II), Bananas (IIII), Grapes (I). Say: 'Which fruit is the most popular according to the tallies?'",
    "Child identifies Bananas by finding the category with the most tally marks.",
    "Child counts incorrectly or picks the first item.",
    "How did you know without counting every single mark?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Bananas has the most tally marks, so it's the most popular.",
        "execution_problems": ["Chart: Red (IIII), Blue (II), Green (III). Which is most popular?", "Chart: Dog (I), Cat (IIII I), Fish (II). Which is most popular?", "Chart: Car (III), Bus (II), Bike (IIII). Which is most popular?", "Chart: Yes (IIII), No (II). Which is most popular?"],
        "endurance_problems": ["Chart: Pizza (IIII II), Pasta (IIII). Which is most popular?", "Chart: Vanilla (III), Chocolate (IIII I). Which is most popular?"]
    }
)
p2d_exe_C = create_template(
    "P2d", "Execute", "C", "Finding mode from a bar graph", [],
    "Show a simple bar graph (e.g., Cats: 3, Dogs: 5, Birds: 2). Say: 'Which bar is the tallest? What animal does that bar stand for?'",
    "Child identifies the tallest bar and reads the corresponding label (Dogs) at the bottom.",
    "Child identifies the highest number on the axis rather than the category, or misreads the label.",
    "If the Birds bar grew to be exactly as tall as the Dogs bar, which one would be the most popular?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "The tallest bar is above 'Dogs'. So 'Dogs' is the answer.",
        "execution_problems": ["Graph: Apples: 2, Oranges: 6. Which is taller?", "Graph: Red: 4, Blue: 5. Which is taller?", "Graph: Car: 1, Bus: 7. Which is taller?", "Graph: Yes: 8, No: 3. Which is taller?"],
        "endurance_problems": ["Graph: Pizza: 5, Pasta: 5. Which is taller?", "Graph: Milk: 3, Juice: 6. Which is taller?"]
    }
)

# Discern
p2d_dis_A = create_template(
    "P2d", "Discern", "A", "Error detection", [],
    "Show a list: 3, 8, 3, 5, 3. Say: 'My friend says 8 is the most popular number because it is the biggest. Are they right? Why or why not?'",
    "Child explains the difference between 'the biggest value' and 'the value that appears most often'.",
    "Child agrees with the friend.",
    "Can you have a list where a tiny number like 1 is the most popular?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_dis_B = create_template(
    "P2d", "Discern", "B", "Error detection", [],
    "Show a list: 2, 4, 6, 8. Say: 'What number appears most often here?'",
    "Child recognizes that all numbers appear exactly once, so there is no single number that appears most often.",
    "Child picks a random number or the biggest one.",
    "If I add another 4 to the list, what happens?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_dis_C = create_template(
    "P2d", "Discern", "C", "Error detection", [],
    "Show a tally chart where two categories tie: Red (III), Blue (III). Say: 'My friend says Red won because it is first on the list. Is that fair?'",
    "Child explains that it is a tie because both have the same number of marks.",
    "Child agrees because Red is listed first.",
    "What would you have to do to break the tie?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2d_own_A = create_template(
    "P2d", "Own", "A", "Design and Justification", [],
    "Say: 'Create a list of 5 numbers where 7 is the number that shows up the most often.'",
    "Child generates a list like 7, 2, 7, 4, 7.",
    "Child creates a list with no repeats, or where another number appears more often.",
    "How could you change your list so that 7 is NO LONGER the number that shows up most often?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_own_B = create_template(
    "P2d", "Own", "B", "Design and Justification", [],
    "Say: 'Imagine a race with 10 cars. Only red and blue cars are racing. Tell me a story about the cars crossing the finish line so that Red is the most common color to finish.'",
    "Child creates a scenario where more than 5 red cars finish, e.g., '6 red cars finish, and 4 blue cars finish.'",
    "Child tells a story where blue wins or where the total is wrong.",
    "If exactly 5 red and 5 blue cars cross the line, what happens to the most common color?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2d_own_C = create_template(
    "P2d", "Own", "C", "Design and Justification", [],
    "Say: 'Draw a very simple bar graph with 3 bars where two of the bars tie for being the tallest.'",
    "Child draws a graph with labels and ensures two bars are exactly the same height and taller than the third.",
    "Child forgets labels, makes all bars different, or makes the tie shorter than the third bar.",
    "If you asked one more person to vote, could there still be a tie?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2d_milestone = create_template(
    "P2d", "Milestone", "M", "Real-world situation", [],
    "You are in charge of buying new shoes for your soccer team. You look at everyone's current shoes: Size 4, Size 5, Size 4, Size 6, Size 4. You can only afford to buy ONE extra pair just in case someone's breaks. What size should you buy and why?",
    "Child identifies Size 4 because it is the most common size worn by the team.",
    "Child picks the largest size, or a random size.",
    "If three more kids join and they all wear Size 6, what size should you buy as the backup then?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You open a bag of candy: 10 red, 2 green, 3 yellow. If you close your eyes and pick one, what color are you probably going to get?"}
)

templates.extend([
    p2d_enc_A, p2d_enc_B, p2d_enc_C,
    p2d_exe_A, p2d_exe_B, p2d_exe_C,
    p2d_dis_A, p2d_dis_B, p2d_dis_C,
    p2d_own_A, p2d_own_B, p2d_own_C,
    p2d_milestone
])

# --- P2e: Likely vs Unlikely (probability as everyday language) ---

# Encounter
p2e_enc_A = create_template(
    "P2e", "Encounter", "A", "Physical sorting", ["Cards with events (e.g., Sun rising, raining frogs, eating lunch)"],
    "Show the cards. Say: 'Sort these into two piles: Things that are very likely to happen tomorrow, and things that are very unlikely to happen tomorrow.'",
    "Child correctly categorizes everyday events vs absurd or rare events.",
    "Child thinks impossible events are likely, or puts everything in one pile.",
    "Is 'raining frogs' just unlikely, or is it actually impossible?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_enc_B = create_template(
    "P2e", "Encounter", "B", "Physical sorting", ["A bag", "10 red blocks", "1 blue block"],
    "Put the blocks in the bag and shake it. Say: 'If I close my eyes and pull out one block, am I likely to get a red one or a blue one?'",
    "Child identifies red as the likely outcome because there are many more of them.",
    "Child guesses blue because it is their favorite color.",
    "If I want to make pulling a blue block likely, what do I need to do to the bag?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_enc_C = create_template(
    "P2e", "Encounter", "C", "Physical sorting", ["A spinner with unequal sections (e.g., 3/4 red, 1/4 blue)"],
    "Show the spinner. Say: 'Spin this 5 times. Before you spin, which color is more likely to win?'",
    "Child predicts the larger section (red) will win.",
    "Child thinks the small section is just as likely to win.",
    "If you spin and it lands on blue, does that mean the spinner is broken?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2e_exe_A = create_template(
    "P2e", "Execute", "A", "Categorizing probability", [],
    "Say: 'I am going to read a sentence. Tell me if it is Certain, Likely, Unlikely, or Impossible: You will drink water sometime this week.'",
    "Child categorizes the statement as 'Certain' (or very likely depending on the child's interpretation, but 'Certain' is technically correct for biological needs over a week).",
    "Child says Impossible or Unlikely.",
    "Why isn't it just 'likely'?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Drinking water in a week is Certain. You need it to live.",
        "execution_problems": ["Categorize: A dinosaur will walk into our house. (Impossible)", "Categorize: It will be dark tonight. (Certain)", "Categorize: You will find a dollar on the sidewalk today. (Unlikely)", "Categorize: You will eat dinner tonight. (Likely/Certain)"],
        "endurance_problems": ["Categorize: It will snow in the desert tomorrow. (Unlikely/Impossible depending on desert)", "Categorize: You will roll a 7 on a normal 6-sided dice. (Impossible)"]
    }
)
p2e_exe_B = create_template(
    "P2e", "Execute", "B", "Categorizing probability", [],
    "Show a bag with 9 green marbles and 1 yellow marble. Say: 'Is pulling a green marble likely, unlikely, or certain?'",
    "Child identifies 'Likely'.",
    "Child says 'Certain' (forgetting the yellow marble) or 'Unlikely'.",
    "Why isn't it 'Certain'?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "There are many green marbles, so it is Likely. But not Certain, because the yellow one is there.",
        "execution_problems": ["Bag: 10 red, 0 blue. Pulling red? (Certain)", "Bag: 2 black, 8 white. Pulling black? (Unlikely)", "Bag: 5 red, 5 blue. Pulling red? (Equally likely)", "Bag: 0 yellow, 5 green. Pulling yellow? (Impossible)"],
        "endurance_problems": ["Bag: 99 red, 1 blue. Pulling blue? (Unlikely)", "Bag: 100 green, 0 red. Pulling red? (Impossible)"]
    }
)
p2e_exe_C = create_template(
    "P2e", "Execute", "C", "Categorizing probability", [],
    "Show a spinner that is half red, half blue. Say: 'Is spinning red likely, unlikely, or equally likely as spinning blue?'",
    "Child identifies 'Equally likely'.",
    "Child guesses one color over the other.",
    "If I color a little more of the spinner red, what happens to the chances?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Both sides are exactly the same size. So it is equally likely.",
        "execution_problems": ["Spinner: 3/4 Green, 1/4 Yellow. Spinning Green? (Likely)", "Spinner: 1/4 Blue, 3/4 Red. Spinning Blue? (Unlikely)", "Spinner: All Orange. Spinning Orange? (Certain)"],
        "endurance_problems": ["Spinner: 1/8 Black, 7/8 White. Spinning Black? (Unlikely)", "Spinner: 1/2 Purple, 1/2 Pink. Spinning Purple? (Equally likely)"]
    }
)

# Discern
p2e_dis_A = create_template(
    "P2e", "Discern", "A", "Error detection", [],
    "Say: 'My friend bought one lottery ticket. They said, \"I am likely to win because there are only two choices: win or lose.\" Are they right? Why?'",
    "Child explains that 'two choices' does not mean 'equally likely', and losing is much more likely because there are millions of losing tickets.",
    "Child agrees with the friend.",
    "If there is 1 winning ticket and 100 losing tickets, is it still a 50/50 chance?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_dis_B = create_template(
    "P2e", "Discern", "B", "Error detection", [],
    "Show a bag with 5 red blocks and 5 blue blocks. Say: 'My friend reached in 3 times and pulled out a red block every time. They say, \"The bag must have more red blocks.\" Are they right? Why?'",
    "Child explains that it is possible to pull the same color multiple times even if the amounts are equal, so the friend isn't necessarily right.",
    "Child agrees with the friend.",
    "If they pulled 100 blocks, do you think they would all be red?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_dis_C = create_template(
    "P2e", "Discern", "C", "Error detection", [],
    "Show a picture of a six-sided die. Say: 'Someone says it is impossible to roll a 7. Is that true? Why?'",
    "Child confirms it is true because the numbers only go up to 6.",
    "Child thinks a 7 can be rolled if they throw it hard enough.",
    "What would you have to do to the dice to make rolling a 7 possible?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2e_own_A = create_template(
    "P2e", "Own", "A", "Design and Justification", [],
    "Say: 'Tell me something that is impossible to happen today, and something that is certain to happen today.'",
    "Child generates two accurate statements demonstrating understanding of the extremes of probability.",
    "Child confuses likely/unlikely with certain/impossible.",
    "If you say 'The sun will shine today', is that certain or just likely?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_own_B = create_template(
    "P2e", "Own", "B", "Design and Justification", [],
    "Say: 'Draw a spinner with three colors: Red, Blue, and Green. Make it so that spinning Red is very likely, spinning Blue is unlikely, and spinning Green is impossible.'",
    "Child draws a spinner mostly Red, a small sliver of Blue, and no Green section.",
    "Child draws equal sections, or includes Green.",
    "How would you change the drawing to make Blue and Red equally likely?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2e_own_C = create_template(
    "P2e", "Own", "C", "Design and Justification", [],
    "Say: 'Make up a game with a coin where you have an unfair advantage over me. Explain the rules.'",
    "Child creates rules where their winning condition has higher probability (e.g., 'If it lands heads OR tails, I win. If it lands on its edge, you win.').",
    "Child creates a fair game (e.g., heads I win, tails you win), or impossible rules.",
    "How would you fix the game to make it fair for both of us?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2e_milestone = create_template(
    "P2e", "Milestone", "M", "Real-world situation", [],
    "You are planning a picnic for Saturday. The weather report says there is a 90% chance of heavy rain. Should you plan to have the picnic outside or inside? Why?",
    "Child chooses inside because heavy rain is very likely.",
    "Child chooses outside because they like picnics, ignoring the high probability of rain.",
    "If the report said there was a 10% chance of rain, would you change your mind? Why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You buy one raffle ticket out of a thousand. You start planning how to spend the prize money. Is this a good idea? Why?"}
)

templates.extend([
    p2e_enc_A, p2e_enc_B, p2e_enc_C,
    p2e_exe_A, p2e_exe_B, p2e_exe_C,
    p2e_dis_A, p2e_dis_B, p2e_dis_C,
    p2e_own_A, p2e_own_B, p2e_own_C,
    p2e_milestone
])

# --- P2f: Simple Experiments (flip coins, roll dice, record results) ---

# Encounter
p2f_enc_A = create_template(
    "P2f", "Encounter", "A", "Physical experiment", ["A coin", "Paper", "Pencil"],
    "Say: 'Flip this coin 10 times. Draw a tally mark for each Head and each Tail you get.'",
    "Child successfully completes the physical experiment and records the 10 results.",
    "Child predicts the outcome without flipping, loses count, or records incorrectly.",
    "Did you get exactly 5 Heads and 5 Tails? Why or why not?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_enc_B = create_template(
    "P2f", "Encounter", "B", "Physical experiment", ["A 6-sided die", "Paper", "Pencil"],
    "Say: 'Roll the die 6 times. Write down the numbers you roll.'",
    "Child completes the rolling and accurately records the 6 numbers.",
    "Child expects to get 1, 2, 3, 4, 5, 6 in order or stops after fewer rolls.",
    "Did you roll every number from 1 to 6? Why do you think that happened?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_enc_C = create_template(
    "P2f", "Encounter", "C", "Physical experiment", ["A bag", "3 red blocks", "1 blue block", "Paper", "Pencil"],
    "Put the blocks in the bag. Say: 'Without looking, pull a block out, write down its color, and put it back. Do this 5 times.'",
    "Child pulls, records, replaces the block, and repeats 5 times.",
    "Child doesn't replace the block, altering the probability for subsequent pulls.",
    "Why is it important to put the block back in the bag every time?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2f_exe_A = create_template(
    "P2f", "Execute", "A", "Analyzing experiment data", [],
    "Say: 'I flipped a coin 20 times. Here are my results: 14 Heads, 6 Tails. Did I get the expected 10 Heads and 10 Tails?'",
    "Child correctly identifies that the results were not 10 and 10, recognizing variance.",
    "Child thinks the coin must be broken or rigged.",
    "If you flipped a coin 100 times, do you think you would get exactly 50 Heads?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "No, you got 14 Heads and 6 Tails. That's not 10 and 10. Coins don't remember the last flip.",
        "execution_problems": ["Flipped 10 times: 8 Heads, 2 Tails. Expected 5 and 5? (No)", "Flipped 30 times: 15 Heads, 15 Tails. Expected 15 and 15? (Yes, surprisingly!)", "Flipped 50 times: 20 Heads, 30 Tails. Expected 25 and 25? (No)"],
        "endurance_problems": ["Flipped 100 times: 49 Heads, 51 Tails. Expected 50 and 50? (No, but close)", "Flipped 1,000 times: 400 Heads, 600 Tails. Expected 500 and 500? (No, surprisingly far off)"]
    }
)
p2f_exe_B = create_template(
    "P2f", "Execute", "B", "Analyzing experiment data", [],
    "Show a tally chart for rolling a die 12 times: 1 (II), 2 (I), 3 (IIII), 4 (II), 5 (I), 6 (II). Say: 'Which number was rolled the most? Which the least?'",
    "Child identifies 3 as most (4 rolls) and 2 or 5 as least (1 roll).",
    "Child identifies 6 as most because it's the highest number on the die.",
    "Why didn't every number get rolled 2 times?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "3 has the most tallies (4). 2 and 5 have the fewest tallies (1).",
        "execution_problems": ["Chart: 1(III), 2(II), 3(I), 4(II), 5(I), 6(III). Most? Least?", "Chart: 1(I), 2(I), 3(IIII I), 4(I), 5(I), 6(I). Most? Least?", "Chart: 1(IIII), 2(II), 3(II), 4(I), 5(III), 6(I). Most? Least?"],
        "endurance_problems": ["Chart: 1(II), 2(II), 3(II), 4(II), 5(II), 6(II). Most? Least? (Tie)", "Chart: 1(III), 2(III), 3(III), 4(III), 5(III), 6(III). Most? Least? (Tie)"]
    }
)
p2f_exe_C = create_template(
    "P2f", "Execute", "C", "Analyzing experiment data", [],
    "Say: 'I pulled a block from a bag 10 times, replacing it each time. I got Red 8 times and Blue 2 times. If you reached in, what color do you think you would probably get?'",
    "Child infers that Red is the most likely color in the bag and predicts pulling Red.",
    "Child predicts Blue, or cannot articulate why Red is more likely.",
    "Are you absolutely certain you will pull a Red block next time?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Red happened 8 times, Blue only 2 times. So there are probably more Red blocks. I predict Red.",
        "execution_problems": ["Pulled: Green 9 times, Yellow 1 time. Predict next pull?", "Pulled: Black 1 time, White 9 times. Predict next pull?", "Pulled: Purple 8 times, Orange 2 times. Predict next pull?"],
        "endurance_problems": ["Pulled: Red 50 times, Blue 50 times. Predict next pull? (Equally likely)", "Pulled: Green 99 times, Yellow 1 time. Predict next pull? (Highly likely Green)"]
    }
)

# Discern
p2f_dis_A = create_template(
    "P2f", "Discern", "A", "Error detection", [],
    "Say: 'My friend flipped a coin 5 times and got Heads every time. They say the 6th flip WILL definitely be Tails because it's \"due\". Why is this wrong?'",
    "Child explains that the coin does not have a memory, so the chance is still equal.",
    "Child agrees with the friend.",
    "Does the coin remember what it did before?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_dis_B = create_template(
    "P2f", "Discern", "B", "Error detection", [],
    "Say: 'We rolled a die 6 times and never rolled a 4. My friend said, \"The die is broken! It should have landed on 4 once!\" Are they right? Why?'",
    "Child explains that rolling each number exactly once in 6 rolls is unlikely, and variance is normal.",
    "Child thinks the die must be flawed.",
    "If you rolled it 100 times, do you think a 4 would show up?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_dis_C = create_template(
    "P2f", "Discern", "C", "Error detection", [],
    "Show a bag of 5 red blocks and 1 blue block. Say: 'My friend pulled a blue block on their first try! They said, \"Wow, blue must be the most common color in the bag.\" Why are they wrong?'",
    "Child points out that pulling a rare color on the first try is possible, but it doesn't change the actual amount in the bag.",
    "Child agrees with the friend's conclusion based on the single pull.",
    "If they pulled 10 more blocks, what color do you think they would mostly get?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2f_own_A = create_template(
    "P2f", "Own", "A", "Design and Justification", [],
    "Say: 'Design a simple experiment using a coin to decide who gets to go first in a game. Then play it out to show me the result.'",
    "Child assigns Heads to one person and Tails to another, flips the coin, and declares the winner.",
    "Child flips the coin without assigning outcomes, or creates an unfair rule.",
    "If the coin lands on the floor and you can't see it, what should you do?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_own_B = create_template(
    "P2f", "Own", "B", "Design and Justification", [],
    "Say: 'Make up an experiment with a six-sided die where I have a likely chance of winning, and you have an unlikely chance of winning.'",
    "Child creates rules such as 'If it lands on 1, 2, 3, 4, or 5, you win. If it lands on 6, I win.'",
    "Child creates a fair game (e.g., odds vs evens) or an impossible game.",
    "How many winning numbers do you have compared to my winning numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2f_own_C = create_template(
    "P2f", "Own", "C", "Design and Justification", [],
    "Say: 'Explain why flipping a coin 100 times gives you a better idea of what to expect than flipping it just 2 times.'",
    "Child explains that small amounts of flips can have streaks, but more flips show the true, steady pattern (closer to half and half).",
    "Child cannot articulate the difference, saying it's just 'more work'.",
    "If you flip it twice and get 2 Heads, does that mean the coin ONLY lands on Heads?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2f_milestone = create_template(
    "P2f", "Milestone", "M", "Real-world situation", [],
    "You and your friend both want to sit in the front seat of the car. You suggest flipping a coin: 'Heads I win, Tails I win.' Is that a fair way to decide? Why or why not?",
    "Child recognizes the trick and states it is unfair because the friend has zero chance of winning.",
    "Child agrees, missing the linguistic trick.",
    "What rule would make it exactly fair for both of you?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "A cereal box says '1 in 4 boxes wins a toy!' You buy 4 boxes. Are you guaranteed to win a toy? Why or why not?"}
)

templates.extend([
    p2f_enc_A, p2f_enc_B, p2f_enc_C,
    p2f_exe_A, p2f_exe_B, p2f_exe_C,
    p2f_dis_A, p2f_dis_B, p2f_dis_C,
    p2f_own_A, p2f_own_B, p2f_own_C,
    p2f_milestone
])

# --- P2g: Comparing Data Sets (our class vs their class) ---

# Encounter
p2g_enc_A = create_template(
    "P2g", "Encounter", "A", "Physical comparison", ["Two handfuls of coins or small items (one large pile, one small pile)"],
    "Show the two piles. Say: 'Pile A is my money. Pile B is your money. Without counting, whose pile looks like it has more? Now count them to prove it.'",
    "Child visually estimates correctly, then verifies by counting and comparing the two totals.",
    "Child counts but cannot articulate which is larger, or miscounts significantly.",
    "Did the larger looking pile actually have more when you counted it?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_enc_B = create_template(
    "P2g", "Encounter", "B", "Physical comparison", ["Two short lists of family/friends (e.g., 'People who like dogs', 'People who like cats')"],
    "Show the lists. Say: 'Look at the names under Dogs and the names under Cats. Which list is longer? Who has more people on their side?'",
    "Child compares the physical length of the lists or counts the names to determine the larger group.",
    "Child guesses or focuses on a specific name.",
    "If I add your name to the shorter list, which list has more people now?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_enc_C = create_template(
    "P2g", "Encounter", "C", "Physical comparison", ["Two small groups of objects representing votes (e.g., 5 red blocks for 'Pizza', 3 blue blocks for 'Burger')"],
    "Set up the blocks. Say: 'The red blocks are votes for Pizza. The blue blocks are votes for Burgers. Which food got more votes?'",
    "Child visually compares the groups and correctly identifies the larger one.",
    "Child guesses or misinterprets the colors.",
    "How many more votes did Pizza get than Burgers?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
p2g_exe_A = create_template(
    "P2g", "Execute", "A", "Comparing tally charts", [],
    "Show two tally charts. Chart 1 (Class A): Dogs(III), Cats(II). Chart 2 (Class B): Dogs(II), Cats(IIII). Say: 'Which class liked Dogs more?'",
    "Child reads both charts and identifies Class A (3 vs 2).",
    "Child looks at only one chart, or miscounts tallies.",
    "Which class liked Cats more?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Class A has 3 tallies for Dogs. Class B has 2. 3 is more than 2, so Class A liked Dogs more.",
        "execution_problems": ["Compare tally charts: A: Red(IIII), Blue(II). B: Red(I), Blue(III). Who likes Red more?", "Compare tally charts: A: Math(III), Art(II). B: Math(II), Art(IIII). Who likes Art more?", "Compare tally charts: A: Pizza(IIII), Pasta(III). B: Pizza(IIII), Pasta(IIII). Who likes Pizza more?", "Compare tally charts: A: Summer(II), Winter(I). B: Summer(III), Winter(I). Who likes Summer more?"],
        "endurance_problems": ["Compare tally charts: A: Dog(IIII II), Cat(III). B: Dog(IIII), Cat(IIII). Who likes Dogs more?", "Compare tally charts: A: Red(IIII I), Blue(II). B: Red(IIII), Blue(III). Who likes Red more?"]
    }
)
p2g_exe_B = create_template(
    "P2g", "Execute", "B", "Comparing bar graphs", [],
    "Show two simple bar graphs side-by-side. Graph 1 (Monday): Apples(4), Oranges(2). Graph 2 (Tuesday): Apples(1), Oranges(5). Say: 'On which day were more apples eaten?'",
    "Child reads the 'Apples' bar on both graphs and identifies Monday.",
    "Child looks at the tallest bar overall (Oranges on Tuesday), instead of the specific category requested.",
    "On which day were more oranges eaten?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Monday's bar for Apples is at 4. Tuesday's bar for Apples is at 1. Monday is higher.",
        "execution_problems": ["Compare graphs: Mon: Red(5), Blue(3). Tue: Red(2), Blue(6). Day with more Red?", "Compare graphs: Jan: Rain(2), Sun(8). Feb: Rain(7), Sun(3). Month with more Rain?", "Compare graphs: Team A: Goals(4), Saves(2). Team B: Goals(1), Saves(5). Team with more Goals?", "Compare graphs: Store A: Sales(10), Returns(2). Store B: Sales(5), Returns(8). Store with more Sales?"],
        "endurance_problems": ["Compare graphs: Mon: Red(10), Blue(5). Tue: Red(8), Blue(12). Day with more Red?", "Compare graphs: Jan: Rain(15), Sun(10). Feb: Rain(12), Sun(18). Month with more Rain?"]
    }
)
p2g_exe_C = create_template(
    "P2g", "Execute", "C", "Comparing totals from data", [],
    "Show two lists. Group 1: 3 boys, 4 girls. Group 2: 5 boys, 1 girl. Say: 'Which group has more children in total?'",
    "Child adds the numbers for each group (3+4=7, 5+1=6) and identifies Group 1 as larger.",
    "Child picks Group 2 because 5 is the biggest single number.",
    "How did you find the total for each group before comparing them?",
    {"exposure": 0, "execution": 3, "endurance": 2},
    {
        "worked_example": "Group 1 is 3+4=7. Group 2 is 5+1=6. 7 is more than 6, so Group 1 has more total children.",
        "execution_problems": ["Group 1: 2 red, 3 blue. Group 2: 4 red, 0 blue. Which has more total?", "Group A: 5 cats, 2 dogs. Group B: 1 cat, 7 dogs. Which has more total?", "Bag 1: 3 big, 3 small. Bag 2: 5 big, 2 small. Which has more total?"],
        "endurance_problems": ["Group 1: 10 red, 5 blue. Group 2: 8 red, 8 blue. Which has more total?", "Group A: 12 cats, 3 dogs. Group B: 5 cats, 11 dogs. Which has more total?"]
    }
)

# Discern
p2g_dis_A = create_template(
    "P2g", "Discern", "A", "Error detection", [],
    "Show two lists. Class A asked 10 kids: 6 like Red, 4 like Blue. Class B asked 100 kids: 50 like Red, 50 like Blue. Say: 'My friend says Red is more popular in Class B because 50 is bigger than 6. Are they right? Why?'",
    "Child explains that 50 out of 100 is half, while 6 out of 10 is more than half, so Red is more popular *in proportion* in Class A.",
    "Child agrees with the friend based only on the raw numbers.",
    "If Class A had asked 100 kids, and they all answered the same way, how many would like Red?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_dis_B = create_template(
    "P2g", "Discern", "B", "Error detection", [],
    "Show two bar graphs with different scales. Graph 1 (scale by 1s) shows a bar reaching the top line (value 5). Graph 2 (scale by 10s) shows a short bar (value 20). Say: 'My friend says the first graph has more because the bar is taller. Why are they wrong?'",
    "Child explains that the scale numbers determine the value, not just the physical height of the bar.",
    "Child agrees that the taller bar means more.",
    "What number should you look at to find out exactly how much each bar represents?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_dis_C = create_template(
    "P2g", "Discern", "C", "Error detection", [],
    "Show a tally chart for Class A (10 votes total) and Class B (5 votes total). Say: 'My friend compared these two classes and decided Class A likes Pizza more than Class B. But they asked twice as many people in Class A! Is this a fair comparison? Why?'",
    "Child recognizes that differing sample sizes can distort straight comparisons.",
    "Child thinks the comparison is fair.",
    "How could you make the comparison fair?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
p2g_own_A = create_template(
    "P2g", "Own", "A", "Design and Justification", [],
    "Say: 'Create two short lists of data (e.g., votes for games) for two different teams, where Team A has a higher total number of votes, but Team B has more votes for a specific game (like Tag).' ",
    "Child constructs data satisfying both conditions.",
    "Child creates data that violates one or both conditions, or uses abstract numbers without context.",
    "How did you make sure Team B had more votes for Tag even though Team A had more total votes?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_own_B = create_template(
    "P2g", "Own", "B", "Design and Justification", [],
    "Say: 'Draw two simple bar graphs next to each other that look identical, but tell me a story about why the first graph actually represents a much larger number than the second graph.'",
    "Child explains that the scales on the sides of the graphs would be different (e.g., one goes by 1s, the other by 100s).",
    "Child cannot explain how identical bars can represent different amounts.",
    "Where on the graph do you write the numbers that change the scale?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
p2g_own_C = create_template(
    "P2g", "Own", "C", "Design and Justification", [],
    "Say: 'Teach me the steps for comparing two different tally charts to find out which chart has the highest single category overall.'",
    "Child explains a systematic process of finding the highest tally in chart A, then finding the highest tally in chart B, and finally comparing those two numbers.",
    "Child gives a confusing or incomplete explanation, or suggests guessing.",
    "What if the highest category in Chart A is a tie? How does that change your steps?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone
p2g_milestone = create_template(
    "P2g", "Milestone", "M", "Real-world situation", [],
    "Two classes are collecting cans for recycling. Class A collected 2 bags, and Class B collected 4 boxes. Class B is celebrating because they think they collected more. What do they need to know before they celebrate?",
    "Child points out that they need to know how many cans are in a bag versus a box (the units/amounts are not directly comparable).",
    "Child agrees Class B won because 4 is more than 2.",
    "If one box holds 10 cans, and one bag holds 50 cans, who actually collected more?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You read a book with 5 chapters and your friend read a book with 10 chapters. Did your friend definitely read more pages than you? Why or why not?"}
)

templates.extend([
    p2g_enc_A, p2g_enc_B, p2g_enc_C,
    p2g_exe_A, p2g_exe_B, p2g_exe_C,
    p2g_dis_A, p2g_dis_B, p2g_dis_C,
    p2g_own_A, p2g_own_B, p2g_own_C,
    p2g_milestone
])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_4_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_4_templates.json successfully.")
