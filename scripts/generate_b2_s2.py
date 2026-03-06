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
        "strand": 2,
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

# --- B2: Unknown Quantities ---

# Encounter
b2_enc_A = create_template(
    "B2", "Encounter", "A", "Number riddle (Oral/Physical)", ["A small cup to hide objects"],
    "Hide 4 objects under a cup. Show 3 objects outside. Tell your child: 'Altogether, there are 7 objects. How many are hiding?'",
    "Child finds the hidden amount without lifting the cup first. Says 'because 4 and 3 make 7'.",
    "Child has to lift the cup to count, or guesses randomly.",
    "How did you know how many were hiding without looking? What did your brain do?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_enc_B = create_template(
    "B2", "Encounter", "B", "Number riddle (Oral/Physical)", ["A piece of cloth to cover items"],
    "Show your child 10 coins. Tell them to close their eyes. Hide 6 under the cloth. Let them open their eyes and see 4 left. Ask: 'How many did I hide?'",
    "Quickly identifies 6 are hidden based on knowing 10 - 4.",
    "Tries to peek or guesses without using the total.",
    "How did you figure it out so fast? Could there be any other number under there?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_enc_C = create_template(
    "B2", "Encounter", "C", "Number riddle (Oral/Physical)", ["Two hands"],
    "Hold 8 beans total. Put some in one hand, some in the other. Show them 5 in one open hand. Keep the other closed. 'I have 8 total. What's in the closed hand?'",
    "Says 3, using addition or subtraction fact families.",
    "Must open the hand to count.",
    "If I showed you the 3, would you know the other hand had 5 without looking? Why?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
b2_exe_A = create_template(
    "B2", "Execute", "A", "Symbolic representation", [],
    "Show your child equations with a missing piece represented by a box (Box - 5 = 12). Ask them to find the box without guessing randomly.",
    "Uses inverse operations (e.g., addition to solve subtraction) to find the unknown.",
    "Randomly plugs in numbers until one works.",
    "Why did you use that operation to find the missing number? Could you have used a different one?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Box - 5 = 12. I know that if I take 5 away from a number to get 12, I can add 12 and 5 to find the number. 12 + 5 = 17. The box is 17.",
        "execution_problems": ["Box + 8 = 15", "14 - Box = 9", "Box - 7 = 13", "6 + Box = 21", "Box - 10 = 35"],
        "endurance_problems": ["I have two bags with the SAME number of apples, plus 3 outside. I have 11 total. How many in each bag?", "Box + Box = 18. What is the Box?"]
    }
)
b2_exe_B = create_template(
    "B2", "Execute", "B", "Symbolic representation", [],
    "Give them problems like 'Triangle + 15 = 25'. Ask them to find Triangle.",
    "Correctly identifies Triangle is 10 by subtracting 15 from 25.",
    "Adds 15 and 25 to get 40.",
    "If Triangle + 15 = 25, what does 25 - Triangle equal?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Triangle + 15 = 25. 25 minus 15 is 10. So Triangle is 10.",
        "execution_problems": ["Triangle + 12 = 30", "18 + Triangle = 40", "Triangle - 9 = 20", "50 - Triangle = 25", "Triangle + 19 = 50"],
        "endurance_problems": ["Triangle + Triangle + 5 = 15. What is Triangle?", "If Triangle is 8, what is Triangle + Triangle?"]
    }
)
b2_exe_C = create_template(
    "B2", "Execute", "C", "Symbolic representation", [],
    "Present a word problem: 'A tree had some birds. 6 flew away. Now there are 14. How many were there at first?' Have them write the equation with a blank.",
    "Writes ___ - 6 = 14 and solves for 20.",
    "Writes 14 - 6 = 8.",
    "How does writing an equation with a blank help you see what happened?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Some birds - 6 flew away = 14 left. ___ - 6 = 14. 14 + 6 = 20.",
        "execution_problems": ["Some cars parked. 8 more came. Now there are 20. Equation?", "I had some money. Spent 15. Have 10 left. Equation?", "A book has 50 pages. I read some. 22 left. Equation?", "I baked cookies. Ate 4. 16 left. Equation?", "Some kids played. 5 went home. 11 left. Equation?"],
        "endurance_problems": ["I had some cards. Gave half away. Have 10 left. How many did I start with?", "I have a secret number. Add 5, then subtract 2. The answer is 10."]
    }
)

# Discern
b2_dis_A = create_template(
    "B2", "Discern", "A", "Constraints & Possibilities", [],
    "Show: Triangle + Square = 10. Ask: 'If Triangle is 4, what is Square? Can Triangle be 12? Why or why not?'",
    "Understands that variables can take different values, but are constrained by the equation (if one goes up, the other must go down to keep the balance of 10).",
    "Thinks Triangle and Square must always be the same number, or doesn't see why 12 is impossible.",
    "Why can't Triangle be 12 if Triangle + Square = 10? What rule is being broken?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_dis_B = create_template(
    "B2", "Discern", "B", "Constraints & Possibilities", [],
    "Say: 'Star - Moon = 5. If Star gets bigger, does Moon have to get bigger or smaller to keep the answer 5?'",
    "Realizes that if Star goes up, Moon must also go up (e.g., 10-5=5, 20-15=5).",
    "Thinks Moon must get smaller to balance it.",
    "If Star gets huge, like 100, what does Moon have to be?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_dis_C = create_template(
    "B2", "Discern", "C", "Constraints & Possibilities", [],
    "Show: Circle + Circle = 14. Ask: 'Can the first Circle be 8 and the second Circle be 6?'",
    "Explains that identical symbols must represent the same number, so it must be 7+7.",
    "Thinks 8+6 is fine because it equals 14.",
    "Why do mathematicians use the SAME shape if they want the number to be the same?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
b2_own_A = create_template(
    "B2", "Own", "A", "Riddle Generation", [],
    "Say: 'Write a number riddle for me where I have to figure out a secret number you are thinking of.' You must use two operations (like add and subtract).",
    "Creates a solvable, multi-step riddle (e.g., 'I multiply by 2, then add 1, and get 11. What's my number?').",
    "Creates a riddle with no answer, or only one step.",
    "Is your riddle solvable? How do you know someone can figure it out and not get stuck?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_own_B = create_template(
    "B2", "Own", "B", "Riddle Generation", [],
    "Ask: 'Make a puzzle with shapes instead of numbers. Make sure I have enough clues to find what every shape is worth.'",
    "Designs a logic puzzle (e.g., Triangle+Triangle=10, Triangle+Square=12).",
    "Creates a puzzle with missing information (e.g., Star+Moon=20, what are they?).",
    "If you only gave me Star + Moon = 20, why wouldn't I be able to solve it?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b2_own_C = create_template(
    "B2", "Own", "C", "Riddle Generation", [],
    "Tell your child: 'I have a magic box. Whatever number goes in, it adds 5. Write an equation with a blank to show how I would get 20 out.'",
    "Writes ___ + 5 = 20.",
    "Writes 20 + 5 = ___.",
    "Why does the blank go at the beginning instead of the end?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- B3: Function Machines ---

# Encounter
b3_enc_A = create_template(
    "B3", "Encounter", "A", "Physical or visual 'machine'", ["A cardboard box with an 'In' and 'Out' slot, or drawing"],
    "Say: 'This is a magic machine. If I put in 2, it spits out 5. If I put in 4, it spits out 7. What happens if I put in 10?'",
    "Discovers the rule is '+3' and applies it correctly to 10.",
    "Cannot find a consistent rule.",
    "How did you figure out the rule? What if I told you the rule was \u00d72 instead? Would it still work for all the numbers?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_enc_B = create_template(
    "B3", "Encounter", "B", "Physical or visual 'machine'", ["Paper with a drawn machine"],
    "Draw a machine. Say: 'I put in 10, out comes 5. I put in 8, out comes 3. What is the machine doing to the numbers?'",
    "Identifies the rule as 'subtract 5'.",
    "Thinks the rule changes every time.",
    "If I put in a 5, what do you think would happen?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_enc_C = create_template(
    "B3", "Encounter", "C", "Physical or visual 'machine'", ["Pairs of blocks (e.g. 1 and 2, 2 and 4, 3 and 6)"],
    "Show pairs of blocks: 1 gives 2. 2 gives 4. 3 gives 6. Ask: 'What rule is changing the first pile into the second pile?'",
    "Identifies the rule as 'double it' or 'multiply by 2' (or + same number).",
    "Doesn't see the multiplicative relationship.",
    "If I put in 5 blocks, how many will come out? Show me.",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
b3_exe_A = create_template(
    "B3", "Execute", "A", "Input/Output Tables", [],
    "Give your child an In/Out table. Ask them to find the missing numbers. Make sure they test their rule on EVERY row to make sure it works.",
    "Correctly identifies constant rate rules (+, -, or x) and applies them forward and backward.",
    "Guesses the rule based on only one row and gets the rest wrong.",
    "How do you know your rule works for EVERY row, not just the ones you checked?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "IN: 3 -> OUT: 7. IN: 5 -> OUT: 9. The rule is +4. If IN is 10, OUT is 14.",
        "execution_problems": ["Rule is +6. IN: 2, 5, 10. Find OUT.", "Rule is -3. IN: 10, 8, 15. Find OUT.", "IN: 2 -> OUT: 8. IN: 4 -> OUT: 10. Find rule.", "IN: 5 -> OUT: 1. IN: 8 -> OUT: 4. Find rule.", "Rule is x2. IN: 3, 6, 9. Find OUT."],
        "endurance_problems": ["IN: 2, 8, 5, 1 (Out of order!). OUT: 5, 11, 8, 4. What is the rule?", "If the rule is +10, and OUT is 25, what was IN?"]
    }
)
b3_exe_B = create_template(
    "B3", "Execute", "B", "Input/Output Tables", [],
    "Show a table with a 'times' rule. IN: 2 -> OUT: 6. IN: 4 -> OUT: 12. Find the missing OUT for IN: 5.",
    "Identifies the rule as 'multiply by 3' and gets 15.",
    "Thinks the rule is +4, and fails on the second row.",
    "Why didn't +4 work for the second row?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "IN: 2 -> OUT: 6. It could be +4. Let's check IN: 4 -> OUT: 12. 4+4 is 8, not 12. So it must be x3. 4x3=12. Rule is x3.",
        "execution_problems": ["Rule x4. IN: 2, 5, 10.", "IN: 3 -> OUT: 6. IN: 5 -> OUT: 10. Find OUT for 8.", "Rule \u00f72 (half). IN: 10, 16, 20. Find OUT.", "IN: 4 -> OUT: 8. IN: 7 -> OUT: 14. Find rule.", "IN: 1 -> OUT: 5. IN: 2 -> OUT: 10. Find OUT for 4."],
        "endurance_problems": ["IN: 5, 3, 8. OUT: 15, 9, 24. What is the rule?", "If rule is x5, and OUT is 40, what was IN?"]
    }
)
b3_exe_C = create_template(
    "B3", "Execute", "C", "Input/Output Tables", [],
    "Give an incomplete table: IN: __ -> OUT: 15. Rule is +7. 'Work backwards to find IN.'",
    "Uses subtraction (15 - 7) to find IN is 8.",
    "Adds 15 and 7.",
    "If the machine adds 7 on the way OUT, what does it do on the way back IN?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "Rule: +7. OUT is 15. Working backwards means I do the opposite. 15 - 7 = 8. IN is 8.",
        "execution_problems": ["Rule: +5. OUT: 12. Find IN.", "Rule: -4. OUT: 10. Find IN.", "Rule: x2. OUT: 18. Find IN.", "Rule: +9. OUT: 20. Find IN.", "Rule: -1. OUT: 99. Find IN."],
        "endurance_problems": ["Rule: +15. OUT: 50. Find IN.", "The rule is 'double it and add 1'. IN is 3. What is OUT?"]
    }
)

# Discern
b3_dis_A = create_template(
    "B3", "Discern", "A", "Counterexample & Falsification", [],
    "Show a table: IN(2)->OUT(4). Your friend says 'The rule is +2.' Do you agree? Show me another row that proves the rule could be 'multiply by 2' instead.",
    "Recognizes that a single data point is not enough to define a linear function. Provides an IN(3)->OUT(6) row to prove multiplication, or IN(3)->OUT(5) for addition.",
    "Agrees the rule MUST be +2.",
    "What's the minimum number of examples you need to be SURE of the rule? Is 1 enough? Is 2?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_dis_B = create_template(
    "B3", "Discern", "B", "Counterexample & Falsification", [],
    "Show a table: IN(1)->OUT(3), IN(2)->OUT(4), IN(4)->OUT(8). Ask: 'Someone says the rule is +2. Is there a mistake in this table?'",
    "Spots that the third row breaks the +2 rule (it should be 4->6).",
    "Doesn't check all rows and assumes the rule is fine.",
    "Why must a function machine always follow the exact same rule?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_dis_C = create_template(
    "B3", "Discern", "C", "Counterexample & Falsification", [],
    "Say: 'A machine takes in numbers and always spits out 10. Does this machine have a rule?'",
    "Realizes the rule is 'OUT is always 10' or 'multiply by 0 and add 10'.",
    "Says it's broken.",
    "Is a rule that ignores the input still a mathematical rule?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
b3_own_A = create_template(
    "B3", "Own", "A", "Rule Design & Obfuscation", [],
    "Say: 'Design a secret function machine rule. Give me 3 inputs and outputs, and see if I can guess it.' Try to make it tricky using subtraction.",
    "Creates a mathematically sound IN/OUT table and successfully validates the parent's answer.",
    "Makes a table with inconsistent rules.",
    "How do you know your machine has only ONE possible rule? Could there be a different rule that gives the same outputs?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_own_B = create_template(
    "B3", "Own", "B", "Rule Design & Obfuscation", [],
    "Ask: 'Create a 2-step machine. It multiplies by 2, then adds 1. Make a table of 4 inputs and outputs.'",
    "Correctly builds the table (e.g., IN: 3 -> OUT: 7).",
    "Forgets the second step or applies them in the wrong order.",
    "Does order matter? What if you added 1 first, THEN multiplied by 2?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b3_own_C = create_template(
    "B3", "Own", "C", "Rule Design & Obfuscation", [],
    "Say: 'Write an In/Out table where the input numbers go backwards (10, 9, 8, 7).'",
    "Creates a valid table matching a rule to descending inputs.",
    "Cannot handle descending inputs.",
    "If the inputs are going backwards, what pattern do you see in the outputs?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- B4: Generalization from Arithmetic ---

# Encounter
b4_enc_A = create_template(
    "B4", "Encounter", "A", "Physical manipulation", ["Small stones or beans", "An empty plate"],
    "Put 5 beans on the table. Ask your child to add the beans from the empty plate to the table. Ask: 'How many did you add? How many are there now?' Do this again with 10 beans.",
    "Understands that adding 'nothing' leaves the group exactly the same size (Identity Property of Addition).",
    "Needs to recount the beans every time to know the total.",
    "If we had a million beans and added the empty plate, would the number change?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_enc_B = create_template(
    "B4", "Encounter", "B", "Physical manipulation", ["10 identical objects (like spoons)"],
    "Put 10 spoons in a pile. Ask the child to take all 10 away to wash them. Ask: 'What is left?' Repeat with 3 objects.",
    "Realizes subtracting a group from an identical group always leaves 0.",
    "Does not recognize the structural certainty of 0.",
    "Is there ANY number of spoons where taking them all away wouldn't leave zero?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_enc_C = create_template(
    "B4", "Encounter", "C", "Physical manipulation", ["Two colors of blocks (e.g. 5 red, 8 blue)"],
    "Build a train of 5 red and 8 blue blocks. Note the total length. Then build a train of 8 blue and 5 red. Ask: 'Is one longer? Does the order of colors matter?'",
    "Observes that order doesn't change the total length (Commutative property).",
    "Re-counts the blocks for both trains instead of trusting the structure.",
    "If you know 99 red + 1 blue = 100 blocks, do you need to calculate 1 blue + 99 red?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
b4_exe_A = create_template(
    "B4", "Execute", "A", "Testing claims", [],
    "Give your child the claim: 'When you multiply any number by 1, you get the same number back.' Ask them to test it with small numbers, big numbers, and zero.",
    "Uses multiple test cases to verify a mathematical generalization.",
    "Only tests one number and stops.",
    "You tested 5 pairs. Is 5 enough to prove it's ALWAYS true? What would be enough?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Claim: Number x 1 = Number. Test 4: 4x1=4. Test 100: 100x1=100. It seems true.",
        "execution_problems": ["Test: Adding 1 always gives the next counting number.", "Test: Subtracting 0 leaves the number the same.", "Test: Even number + Even number = Even number.", "Test: Odd + Odd = Even.", "Test: Multiplying by 10 adds a zero to the end."],
        "endurance_problems": ["Someone says adding two odd numbers ALWAYS makes an even number. Test it with 5 different pairs.", "Test: Number minus half of itself equals half."]
    }
)
b4_exe_B = create_template(
    "B4", "Execute", "B", "Testing claims", [],
    "Claim: 'If you double a number, the answer is always even.' Have them test 3 odd numbers and 3 even numbers.",
    "Discovers the claim holds true regardless of what type of number you start with.",
    "Cannot follow the testing procedure.",
    "Why does multiplying by 2 always force the answer to be even?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Test doubling 3: 3+3=6 (even). Test doubling 4: 4+4=8 (even). It works.",
        "execution_problems": ["Test: Double 5", "Test: Double 7", "Test: Double 10", "Test: Double 11", "Test: Double 15"],
        "endurance_problems": ["Test this claim: Number x 2 is always bigger than Number.", "Does the double rule work for 0?"]
    }
)
b4_exe_C = create_template(
    "B4", "Execute", "C", "Testing claims", [],
    "Claim: 'Adding 9 is the same as adding 10 and subtracting 1.' Test this on 5, 12, and 24.",
    "Confirms the structural shortcut works in all cases.",
    "Calculates inconsistently.",
    "Why does this trick work for adding 9? Could you make a trick for adding 8?",
    {"exposure": 0, "execution": 4, "endurance": 2},
    {
        "worked_example": "Test on 5: 5+9=14. And 5+10-1 = 15-1 = 14. They match.",
        "execution_problems": ["Test on 8", "Test on 15", "Test on 22", "Test on 30", "Test on 45"],
        "endurance_problems": ["Test the claim: Subtracting 9 is like subtracting 10 and adding 1.", "Try the +9 trick on 99."]
    }
)

# Discern
b4_dis_A = create_template(
    "B4", "Discern", "A", "Falsification / Counterexamples", [],
    "Ask: 'Your friend says: When you multiply two numbers, the answer is ALWAYS bigger than both numbers. Is that true? Try to find just ONE example that proves them wrong.'",
    "Finds a counterexample: multiplying by 1 (4 x 1 = 4, not bigger) or by 0 (4 x 0 = 0).",
    "Believes the claim is true because they only test large numbers.",
    "You found one counterexample. Is one enough to prove the claim is false? Why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_dis_B = create_template(
    "B4", "Discern", "B", "Falsification / Counterexamples", [],
    "Claim: 'If a number ends in 3, it is odd. Therefore, all odd numbers end in 3.' Is this true? Find a counterexample.",
    "Finds an odd number not ending in 3 (e.g., 5, 7, 11).",
    "Agrees with the faulty logic.",
    "If the first sentence is true, why isn't the second sentence true?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_dis_C = create_template(
    "B4", "Discern", "C", "Falsification / Counterexamples", [],
    "Claim: 'Addition always makes the number bigger.' Find a counterexample.",
    "Adds 0 (e.g., 5 + 0 = 5) to show it doesn't get *bigger*.",
    "Agrees addition always makes it bigger.",
    "Why is zero always the best number to test when someone says 'always'?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
b4_own_A = create_template(
    "B4", "Own", "A", "Rule formulation", [],
    "Ask: 'Look at a calendar. Pick any 2x2 square of numbers. Add the diagonals. Try it on another square. Write a rule for what you found.'",
    "Formulates a general rule (the sums of the diagonals in a 2x2 calendar square are always equal) based on specific cases.",
    "Just adds them up without seeing the pattern.",
    "How do you know your calendar rule works for every 2x2 square, not just the ones you tried?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_own_B = create_template(
    "B4", "Own", "B", "Rule formulation", [],
    "Ask: 'What happens when you add three consecutive numbers (like 1+2+3, or 5+6+7)? What do you notice about the middle number?'",
    "Discovers the sum is always 3 times the middle number.",
    "Cannot form a rule.",
    "If I picked 10, 11, 12, what would the total be without adding them?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b4_own_C = create_template(
    "B4", "Own", "C", "Rule formulation", [],
    "Say: 'Create a math rule of your own that you think is ALWAYS true. Test it to prove it to me.'",
    "Comes up with a valid structural property (e.g., adding an even to an even makes an even).",
    "Just states a fact like 1+1=2.",
    "Could someone else find a counterexample to your rule?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# --- B5: Growing Patterns ---

# Encounter
b5_enc_A = create_template(
    "B5", "Encounter", "A", "Visual progression", ["Blocks, coins, or drawn shapes"],
    "Build step 1 (1 block), step 2 (3 blocks in a triangle), step 3 (6 blocks). Ask: 'How is this pattern growing? Build step 4.'",
    "Sees that each step adds a row with one more block than the last row (+2, +3, +4...).",
    "Randomly adds blocks without observing the structural change.",
    "What do you notice about how many NEW blocks you add each time? Is it always the same?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_enc_B = create_template(
    "B5", "Encounter", "B", "Visual progression", ["Pencils or sticks"],
    "Make a square with 4 sticks. Next to it, make two connected squares with 7 sticks. Next, three connected squares with 10 sticks. Ask: 'How many sticks for the next one?'",
    "Notices you only need 3 more sticks to add a square, not 4.",
    "Thinks you need 4 more sticks.",
    "Why do we only need 3 new sticks to make a whole new square?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_enc_C = create_template(
    "B5", "Encounter", "C", "Visual progression", ["Drawn dots"],
    "Draw an 'L' shape of dots: Step 1 has 3 dots (corner + 1 up + 1 right). Step 2 has 5 dots (corner + 2 up + 2 right). Step 3 has 7 dots. Ask: 'Draw step 4.'",
    "Draws corner + 4 up + 4 right (9 dots). Recognizes the +2 growth.",
    "Draws a random shape.",
    "Where are the new dots being added each time?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
b5_exe_A = create_template(
    "B5", "Execute", "A", "Near calculation", [],
    "Show the pattern. Ask your child to build or draw the next two steps, and then count the pieces.",
    "Accurately extends the pattern and identifies the constant rate of change (e.g., adding 2 each time).",
    "Cannot accurately extend the pattern.",
    "If I told you step 100, could you figure it out without drawing all 100 steps? How?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Pattern: 3, 5, 7. It adds 2 each time. Next is 9, then 11.",
        "execution_problems": ["Pattern: 4, 8, 12. Next two?", "Pattern: 1, 4, 7. Next two?", "Pattern: 10, 20, 30. Next two?", "Pattern: 2, 7, 12. Next two?", "Pattern: 5, 11, 17. Next two?"],
        "endurance_problems": ["A plant grows 2 leaves every week. It started with 3. Make a table for weeks 1 to 5.", "Pattern starts at 15 and goes down by 3. Next three steps?"]
    }
)
b5_exe_B = create_template(
    "B5", "Execute", "B", "Near calculation", [],
    "Give a sequence: 2, 6, 10, 14... Ask for the 6th number in the pattern.",
    "Identifies +4 rule, finds 5th is 18, 6th is 22.",
    "Finds the 5th and stops.",
    "Did you have to find the 5th number to know the 6th?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "2, 6, 10, 14. Rule is +4. 5th number is 14+4=18. 6th is 18+4=22.",
        "execution_problems": ["3, 6, 9... find 6th", "1, 5, 9... find 6th", "10, 15, 20... find 6th", "0, 7, 14... find 6th", "4, 10, 16... find 6th"],
        "endurance_problems": ["Pattern is +5. 3rd number is 16. What was the 1st number?", "Find the 7th number of: 100, 90, 80..."]
    }
)
b5_exe_C = create_template(
    "B5", "Execute", "C", "Near calculation", [],
    "Show a growing table: Day 1: $2. Day 2: $4. Day 3: $6. Ask: 'How much on Day 5?'",
    "Extends table to Day 5 ($10).",
    "Guesses a high number without pattern logic.",
    "What is the connection between the Day number and the Money amount?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Day 1=$2, Day 2=$4, Day 3=$6. Money is Day x 2. So Day 5 is $10.",
        "execution_problems": ["Day 1=3, Day 2=6, Day 3=9. Day 5?", "Week 1=5, Wk 2=10, Wk 3=15. Wk 5?", "Box 1=4, Box 2=8, Box 3=12. Box 5?", "Hour 1=10, Hr 2=20. Hr 4?", "Car 1=4 wheels, Car 2=8. Car 5?"],
        "endurance_problems": ["Day 1=10, Day 2=12, Day 3=14. What is Day 5? (Careful, it's not Day x 2!)", "If Day 5 is 20, what is Day 6?"]
    }
)

# Discern
b5_dis_A = create_template(
    "B5", "Discern", "A", "Far calculation / Rule finding", [],
    "Show a pattern that starts with 2 and adds 3 each time (2, 5, 8, 11...). Ask: 'Without drawing the whole thing, how many would be in step 10? How do you know?'",
    "Starts linking the step number to the total (e.g., '10 steps means I added 3 ten times, so 30, plus the 2 I started with' - intuitive y=mx+b).",
    "Tries to draw all 10 steps and makes a counting error.",
    "How did you find step 10 without building every step? What shortcut did you use?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_dis_B = create_template(
    "B5", "Discern", "B", "Far calculation / Rule finding", [],
    "Show a pattern: 4, 8, 12, 16. Someone says 'Step 10 will be 40 because 10 x 4 is 40.' Are they right?",
    "Understands the multiplicative relationship between the step number and the total.",
    "Doesn't trust the multiplication and tries to count by 4s.",
    "Why does multiplication work for this pattern, but not for a pattern like 5, 9, 13?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_dis_C = create_template(
    "B5", "Discern", "C", "Far calculation / Rule finding", [],
    "Show two patterns. A: 2, 4, 6, 8. B: 1, 3, 5, 7. Ask: 'How are these patterns similar, and how are they different?'",
    "Notes both grow by +2, but start at different numbers.",
    "Only sees that the numbers are different.",
    "Will pattern B ever catch up to pattern A? Why or why not?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
b5_own_A = create_template(
    "B5", "Own", "A", "Pattern generation", [],
    "Say: 'Design a growing pattern out of blocks where the 5th step has exactly 17 blocks. Draw it or build it for me.'",
    "Works backwards from the constraint to design a consistent linear pattern (e.g., starts with 1, adds 4 each step: 1, 5, 9, 13, 17 or starts with 5, adds 3: 5, 8, 11, 14, 17).",
    "Uses random numbers to get to 17, failing to make a consistent pattern.",
    "How do you know your pattern is the ONLY one that works? Could someone else design a different pattern that also reaches 17 at step 5?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_own_B = create_template(
    "B5", "Own", "B", "Pattern generation", [],
    "Ask: 'Create a repeating pattern (like red, blue, red, blue). Now create a growing pattern. Explain the difference.'",
    "Creates both and explains that repeating loops, while growing gets bigger.",
    "Confuses the two concepts.",
    "Can a pattern grow AND repeat at the same time?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
b5_own_C = create_template(
    "B5", "Own", "C", "Pattern generation", [],
    "Say: 'Make up a pattern that grows very slowly at first, but then grows very fast.'",
    "Creates a non-linear pattern (like 1, 2, 4, 8, 16 - doubling).",
    "Creates a standard +2 pattern.",
    "Why does doubling make the numbers explode so quickly compared to adding?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Milestone Tasks
b2_milestone = create_template(
    "B2", "Milestone", "M", "Real-world situation", [],
    "Tendo went to the market with some money. He came back with 500 UGX change and he bought groundnuts for 1,500 UGX. How much did he go with?",
    "Child recognises this is a missing-start problem (? - 1500 = 500). Finds 2000. Reasoning: explains how they worked backwards.",
    "Adds or subtracts randomly without understanding the story.",
    "Why did you add the change to what he spent?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Auntie had some eggs. She used 4 for baking. Now she has 8. How many did she have?"}
)
b3_milestone = create_template(
    "B3", "Milestone", "M", "Real-world situation", [],
    "Every week, Amara's sunflower grows taller. In week 1, it was 5 cm. In week 2, it was 8 cm. In week 3, it was 11 cm. Her grandmother asks: 'How tall will it be in week 6 without measuring?'",
    "Child identifies the constant growth rate (+3 per week), extends the table, and predicts 20 cm. Reasoning: explains the rule they discovered.",
    "Guesses randomly.",
    "How do you know it won't just suddenly grow 10 cm in week 4?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "A taxi charges a base fare of 2000 plus 500 for each kilometer. How much for 3 km?"}
)
b4_milestone = create_template(
    "B4", "Milestone", "M", "Real-world situation", [],
    "Your friend says 'If I add any two numbers and then subtract one of them, I always get the other one back.' Is that always true? How would you convince someone who doesn't believe it?",
    "Child tests multiple cases, then attempts a general argument ('because adding and then taking away undoes itself'). Does not need to be told this is about inverse operations.",
    "Only tests one case and stops.",
    "Can you find any numbers in the whole universe where this wouldn't work?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Prove this statement: A number multiplied by 2 is always even."}
)
b5_milestone = create_template(
    "B5", "Milestone", "M", "Real-world situation", [],
    "Nala is building a fence. Each section needs 4 posts. But the sections share posts \u2014 the last post of one section is the first post of the next. She has 25 posts. How many complete sections can she build?",
    "Child recognises the growing pattern (1st section = 4 posts, each additional section = 3 new posts). Calculates sections: 4 + 3(n-1) \u2264 25 \u2192 8 sections. Does not need 'algebra' vocabulary.",
    "Just divides 25 by 4 and gets 6.",
    "Why does the first section need 4 posts, but the next ones only need 3?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "We are making a chain of paper rings. First ring takes 1 piece of tape. Each new ring added to the chain takes 1 more piece. How much tape for 10 rings?"}
)

templates.extend([
    b2_enc_A, b2_enc_B, b2_enc_C, b2_exe_A, b2_exe_B, b2_exe_C, b2_dis_A, b2_dis_B, b2_dis_C, b2_own_A, b2_own_B, b2_own_C, b2_milestone,
    b3_enc_A, b3_enc_B, b3_enc_C, b3_exe_A, b3_exe_B, b3_exe_C, b3_dis_A, b3_dis_B, b3_dis_C, b3_own_A, b3_own_B, b3_own_C, b3_milestone,
    b4_enc_A, b4_enc_B, b4_enc_C, b4_exe_A, b4_exe_B, b4_exe_C, b4_dis_A, b4_dis_B, b4_dis_C, b4_own_A, b4_own_B, b4_own_C, b4_milestone,
    b5_enc_A, b5_enc_B, b5_enc_C, b5_exe_A, b5_exe_B, b5_exe_C, b5_dis_A, b5_dis_B, b5_dis_C, b5_own_A, b5_own_B, b5_own_C, b5_milestone
])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_2_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_2_templates.json with partial capacity data.")
