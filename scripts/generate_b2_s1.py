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
        "strand": 1,
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

# --- D1: Place Value as Grouping ---

# Encounter
d1_enc_A = create_template(
    "D1", "Encounter", "A", "Physical manipulation", ["30-50 small objects (beans, sticks)", "rubber bands or small cups"],
    "Give your child 34 objects. Ask them: 'How can we count these quickly without losing track?' Let them try. If they don't group by 10s, suggest: 'What if we put them in groups of 10?'",
    "Child groups objects into 10s and counts the leftover ones.",
    "Child insists on counting by 1s and loses track, or cannot form a group of 10.",
    "Why is grouping by 10 faster than counting by 1?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_enc_B = create_template(
    "D1", "Encounter", "B", "Physical manipulation", ["30-50 blocks or beads", "small containers"],
    "Give your child 42 objects. Say: 'We need to count these, but my eyes get tired counting one by one. Can you find a way to make little groups so it is easier to see how many we have?'",
    "Child makes consistent groups (ideally 10s) and identifies the total by counting groups.",
    "Child makes random sized groups or continues to count by ones.",
    "Why did you choose to put that many in each group? Does it make counting faster?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_enc_C = create_template(
    "D1", "Encounter", "C", "Physical manipulation", ["40-50 bottle caps", "small bags"],
    "Scatter 48 objects on the floor. Ask: 'Imagine you have to tell me how many there are in 5 seconds. How can we organize them so we can count them super fast?'",
    "Child organizes items into piles of 10 for quick counting.",
    "Child leaves them scattered and points one by one.",
    "How does putting them in groups help us not make mistakes?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
d1_exe_A = create_template(
    "D1", "Execute", "A", "Physical to symbolic translation", ["Bundles of 10", "single objects", "paper"],
    "Tell your child to build the number 42. Watch if they use the bundles correctly.",
    "Correctly represents the number with tens and ones. Handles the endurance 'unbundling' task.",
    "Reverses tens and ones, or counts out 42 individual items.",
    "If I have 2 bundles of 10 and 15 loose beans, what number is that? How do you know?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "Build 34: Get 3 bundles of 10. Get 4 loose beans. Total is 34.",
        "execution_problems": ["Build 25", "Build 51", "Build 19", "Build 63", "Build 8"],
        "endurance_problems": ["Build 35, but you only have two 10-bundles. What do you do?", "Build 40 using exactly 14 loose beans."]
    }
)
d1_exe_B = create_template(
    "D1", "Execute", "B", "Physical to symbolic translation", ["Sticks bundled in 10s", "loose sticks"],
    "Ask your child to show you the number 65 using the bundles and loose sticks, then write the number down.",
    "Selects 6 bundles and 5 loose sticks, writing '65'.",
    "Writes '605' or '56'.",
    "If you drop one bundle, what number do you have now?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "To show 28, I need 2 bundles of 10 (which is 20) and 8 single sticks.",
        "execution_problems": ["Show 14", "Show 72", "Show 39", "Show 50", "Show 5"],
        "endurance_problems": ["Show 42, but use only 3 bundles. How many single sticks do you need?", "If you have 5 bundles and 12 loose sticks, what number is that?"]
    }
)
d1_exe_C = create_template(
    "D1", "Execute", "C", "Physical to symbolic translation", ["10-frames drawn on paper", "counters"],
    "Ask your child to fill 10-frames to show the number 53.",
    "Fills 5 complete 10-frames and puts 3 counters in the 6th frame.",
    "Only fills 5 counters total and 3 counters total.",
    "Why don't we just count out 53 counters without the frames?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "For 41, fill 4 complete frames, and put 1 counter in the next frame.",
        "execution_problems": ["Show 22", "Show 68", "Show 15", "Show 91", "Show 30"],
        "endurance_problems": ["You have 3 full frames and 16 loose counters. What number is that?", "Show 54 but one of your frames is broken. How do you do it?"]
    }
)

# Discern
d1_dis_A = create_template(
    "D1", "Discern", "A", "Error detection", [],
    "Show your child this drawing: 3 bundles of 10 and 12 loose sticks. Say: 'Your friend wrote that this is the number 3012. Is that right? What should it be?'",
    "Identifies that 10 loose sticks make a new bundle, so it's 4 bundles and 2 sticks = 42.",
    "Agrees with 3012, treating tens and ones as separate numbers rather than a combined quantity.",
    "Can you ever have 12 single ones in the 'ones' place? Why not?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_dis_B = create_template(
    "D1", "Discern", "B", "Error detection", [],
    "Show your child a paper that says: '5 tens and 14 ones = 64'. Ask: 'Is this math right? How did they get 64 from 5 and 14?'",
    "Explains that 14 ones is one ten and four ones, so 5 tens + 1 ten = 6 tens, making 64.",
    "Says it is wrong because 5+14 is 19.",
    "What happens when the 'ones' pile gets to be 10 or more?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_dis_C = create_template(
    "D1", "Discern", "C", "Error detection", [],
    "Say: 'Someone tried to build 45. They used 5 bundles of ten and 4 loose sticks. Did they do it right?'",
    "Recognizes they built 54 instead of 45 by swapping the tens and ones.",
    "Agrees they built 45.",
    "Why does it matter which number is the bundles and which is the loose sticks?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
d1_own_A = create_template(
    "D1", "Own", "A", "System design", [],
    "Ask your child: 'If we were aliens with only 4 fingers on each hand, how would we bundle our sticks? Show me what the number 23 would look like for them.'",
    "Child bundles by 8s (or 4s). Realizes that '10' is just a convention, not a magic number.",
    "Cannot conceptualize grouping by anything other than 10.",
    "Can you prove that base-8 works the same way as base-10? What's the rule that all bases share?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_own_B = create_template(
    "D1", "Own", "B", "System design", [],
    "Say: 'Imagine a factory that packs boxes of biscuits. But they only pack them in boxes of 6. How would they write down that they have 15 biscuits?'",
    "Shows they have 2 boxes and 3 loose biscuits (like base 6).",
    "Tries to force them into groups of 10.",
    "If they had 6 boxes of 6, what would they need to do next?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d1_own_C = create_template(
    "D1", "Own", "C", "System design", [],
    "Ask: 'Design a money system for a new country where you only have 5-coin coins and 1-coin coins. How would you pay for something that costs 17?'",
    "Uses three 5-coins and two 1-coins.",
    "Just uses seventeen 1-coins without grouping.",
    "What is the biggest number of 1-coins you would ever need to carry in your pocket in this country?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

templates.extend([d1_enc_A, d1_enc_B, d1_enc_C, d1_exe_A, d1_exe_B, d1_exe_C, d1_dis_A, d1_dis_B, d1_dis_C, d1_own_A, d1_own_B, d1_own_C])

# --- D2: Addition as Combining ---

# Encounter
d2_enc_A = create_template(
    "D2", "Encounter", "A", "Physical storytelling", ["Two disparate groups of items (e.g., 7 rocks, 5 leaves)"],
    "Present 7 rocks and 5 leaves. Ask: 'If we put all of these into one big pile, how many things do we have total? Don't count from 1. Can you start from the bigger group?'",
    "Starts with 7 and counts on: '8, 9, 10, 11, 12'. Understands addition is joining.",
    "Counts every item starting from 1.",
    "Does it matter if we start with the rocks or the leaves? Why?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_enc_B = create_template(
    "D2", "Encounter", "B", "Physical storytelling", ["8 spoons", "4 forks"],
    "Show 8 spoons in one hand and 4 forks in the other. Ask: 'If I put all these in the washing bowl, how many utensils are there? Try counting on from the 8 spoons.'",
    "Says '8', then counts the forks '9, 10, 11, 12'.",
    "Refuses to count on, insists on recounting the spoons.",
    "If I hid the 8 spoons under a cloth but you knew they were there, could you still find the total?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_enc_C = create_template(
    "D2", "Encounter", "C", "Physical storytelling", ["9 small blocks", "6 large blocks"],
    "Build a tower of 9 small blocks. Hand them 6 large blocks. Ask: 'If we put these on top, how many blocks tall is the tower? Remember we already know the bottom is 9.'",
    "Counts up from 9: '10, 11, 12, 13, 14, 15'.",
    "Takes the tower apart to count them all.",
    "Why don't we need to count the bottom blocks again?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
d2_exe_A = create_template(
    "D2", "Execute", "A", "Mental / Written execution", [],
    "Ask your child to solve 8+6. Watch how they do it. Do they use their fingers? Do they group tens?",
    "Correct sum, ideally using a strategy like 'make a 10' (8+6 -> 8+2+4 -> 10+4 = 14) rather than counting by ones.",
    "Counts by ones using fingers for every problem.",
    "Why does this strategy work? Could you use a different strategy and get the same answer?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "8 + 6: I know 8 needs 2 to make 10. I take 2 from the 6, which leaves 4. So 10 + 4 = 14.",
        "execution_problems": ["7 + 5", "9 + 4", "6 + 8", "5 + 9", "7 + 7"],
        "endurance_problems": ["Add 24 and 37 mentally, then explain your steps.", "Solve 48 + 5 without writing it down."]
    }
)
d2_exe_B = create_template(
    "D2", "Execute", "B", "Mental / Written execution", [],
    "Give your child the problem 9+7. See if they recognize that 9 is very close to 10.",
    "Uses compensation: 9+7 is like 10+6, so 16.",
    "Relies entirely on counting by ones.",
    "If the problem was 99 + 7, how would you solve it?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "9 + 7: I make the 9 a 10 by taking 1 from the 7. Now I have 10 + 6, which is 16.",
        "execution_problems": ["9 + 5", "9 + 8", "8 + 7", "9 + 3", "8 + 5"],
        "endurance_problems": ["Add 39 and 15 in your head.", "What is 19 + 18?"]
    }
)
d2_exe_C = create_template(
    "D2", "Execute", "C", "Mental / Written execution", [],
    "Ask them to solve 15 + 8. Do they split the 8 into 5 and 3?",
    "Solves by getting to the next decade (15+5=20, 20+3=23).",
    "Makes calculation errors due to counting by ones.",
    "How does finding the next 'ten' make adding easier?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "15 + 8: I know 15 + 5 is 20. That leaves 3 more from the 8. 20 + 3 = 23.",
        "execution_problems": ["16 + 7", "25 + 6", "38 + 5", "47 + 4", "59 + 6"],
        "endurance_problems": ["Solve 45 + 18 using the 'make a ten' method.", "If I have 28 and add 24, how can I do it fast?"]
    }
)

# Discern
d2_dis_A = create_template(
    "D2", "Discern", "A", "Strategy comparison", [],
    "Say: 'I need to add 48 + 35. Person A says: add 40+30, then 8+5. Person B says: take 2 from 35, give it to 48 to make 50, then add the left over 33. Which way is better? Why?'",
    "Child recognizes BOTH are correct. Can explain how Person B's 'compensation' strategy works.",
    "Thinks one person is wrong, or cannot explain Person B's logic.",
    "Is one way always better, or does it depend on the numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_dis_B = create_template(
    "D2", "Discern", "B", "Strategy comparison", [],
    "Ask: 'To solve 29 + 16, someone did 30 + 16 = 46, and then added 1 to get 47. Are they right?'",
    "Spots the error: they should have subtracted 1 at the end, not added 1, because they made the 29 bigger.",
    "Agrees the answer is 47.",
    "If you make one number bigger to make it easy to add, what do you have to do at the end?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_dis_C = create_template(
    "D2", "Discern", "C", "Strategy comparison", [],
    "Say: 'Someone wrote: 14 + 17 = 10 + 10 + 4 + 7 = 20 + 11 = 31. Do you agree with how they split the numbers?'",
    "Understands the decomposition of tens and ones.",
    "Gets confused by breaking the numbers apart.",
    "Can you split the numbers a different way? (Like 14 + 10 + 7?)",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
d2_own_A = create_template(
    "D2", "Own", "A", "Word problem creation", [],
    "Tell your child: 'Write a story problem that results in the equation 18 + 15 = 33. It cannot be about buying things or eating food.'",
    "Creates a logically sound word problem requiring addition.",
    "Creates a subtraction problem, or can't think of a non-shopping context.",
    "Read your story problem back to me. How do you know someone HAS to add to solve it?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_own_B = create_template(
    "D2", "Own", "B", "Word problem creation", [],
    "Say: 'Create a math story for 25 + 14 = 39 about animals in a forest.'",
    "Writes a story involving two groups of animals coming together.",
    "Writes a story where animals leave.",
    "Why does combining groups always mean addition?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d2_own_C = create_template(
    "D2", "Own", "C", "Word problem creation", [],
    "Ask: 'Make up a story problem where the answer is 50, but you have to add THREE numbers together to get it.'",
    "Creates a scenario with three addends that sum to 50.",
    "Only uses two numbers, or the sum is incorrect.",
    "How did you choose the three numbers to make exactly 50?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

templates.extend([d2_enc_A, d2_enc_B, d2_enc_C, d2_exe_A, d2_exe_B, d2_exe_C, d2_dis_A, d2_dis_B, d2_dis_C, d2_own_A, d2_own_B, d2_own_C])

# --- D3: Subtraction as Separating (and Comparing) ---
# Encounter
d3_enc_A = create_template("D3", "Encounter", "A", "Physical manipulation", ["Number line (drawn on floor) or physical blocks"],
    "Ask: 'You have 8. You need to get to 15. How many steps to get there?'",
    "Understands subtraction can mean 'how much more do I need?' and finds the difference.",
    "Tries to take 15 away from 8.",
    "What do you notice about where you started and where you ended up? What does 'the gap' mean?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_enc_B = create_template("D3", "Encounter", "B", "Physical manipulation", ["10 blocks of one color, 6 of another"],
    "Line up 10 red blocks. Line up 6 blue blocks underneath. Ask: 'How many MORE red blocks are there than blue blocks?'",
    "Matches them one-to-one and counts the extra red blocks.",
    "Just counts all 16 blocks.",
    "Why did you just count the ones that didn't have a partner?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_enc_C = create_template("D3", "Encounter", "C", "Physical manipulation", ["A piece of string", "scissors"],
    "Cut a piece of string. Say: 'This was 20cm long. Now it is 12cm long. How much got cut off?'",
    "Recognizes this is finding the missing part.",
    "Does not understand how to find the missing length.",
    "If we taped the missing piece back on, how long would it be?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Execute
d3_exe_A = create_template("D3", "Execute", "A", "Written/Mental execution", [],
    "Ask your child to solve 15-8. Can they solve it by counting up from the smaller number?",
    "Uses strategies like 'counting up' (8 + ? = 15) instead of just taking away.",
    "Relies entirely on counting backward by ones.",
    "Why does counting up from the smaller number give the same answer as taking away?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "15 - 8: I start at 8. 8 + 2 is 10. 10 + 5 is 15. So 2 + 5 = 7.",
        "execution_problems": ["13 - 6", "17 - 9", "14 - 8", "12 - 5", "16 - 7"],
        "endurance_problems": ["Solve 40 - 15 without crossing out or borrowing.", "What is 100 - 85? Think about money."]
    }
)
d3_exe_B = create_template("D3", "Execute", "B", "Written/Mental execution", [],
    "Ask them to solve 52 - 29. Suggest they make the 29 a 30 first.",
    "Uses compensation: 52 - 30 = 22. But I took away one too many, so add 1 back = 23.",
    "Tries to set up standard algorithm in their head and gets lost.",
    "If you subtract a bigger number to make it easy, what do you do at the end?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "52 - 29: 29 is close to 30. 52 - 30 = 22. I took away 1 too many, so 22 + 1 = 23.",
        "execution_problems": ["45 - 19", "63 - 28", "81 - 39", "74 - 48", "36 - 17"],
        "endurance_problems": ["Solve 80 - 41 using the round-up trick.", "Solve 102 - 98. (Hint: don't subtract, count up!)"]
    }
)
d3_exe_C = create_template("D3", "Execute", "C", "Written/Mental execution", [],
    "Have them solve 34 - 16 by subtracting in chunks.",
    "Subtracts 10 (gets 24), then subtracts 4 (gets 20), then subtracts 2 (gets 18).",
    "Cannot hold the intermediate numbers in their head.",
    "How do you decide what size 'chunk' to take away first?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "34 - 16: Take away 10 to get 24. Take away 4 to get 20. Take away 2 more to get 18.",
        "execution_problems": ["42 - 15", "55 - 26", "61 - 33", "76 - 48", "23 - 14"],
        "endurance_problems": ["Solve 95 - 47 mentally.", "Subtract 50 - 24."]
    }
)

# Discern
d3_dis_A = create_template("D3", "Discern", "A", "Error detection", [],
    "Show your child: 52 - 28. Someone wrote the answer is 36. Ask: 'What mistake did they make?'",
    "Identifies that the person subtracted the smaller digit from the larger digit in both columns (5-2=3, 8-2=6) instead of regrouping.",
    "Thinks 36 is correct.",
    "How do you know 36 is wrong without even doing the problem yourself first?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_dis_B = create_template("D3", "Discern", "B", "Error detection", [],
    "Show: 40 - 15 = 35. Ask: 'Why is this wrong? What did they forget?'",
    "Points out they just subtracted the tens (40-10) and brought down the 5, instead of taking 5 away from 30.",
    "Cannot explain the error.",
    "If you have 40 and take away MORE than 10, can the answer be in the 30s?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_dis_C = create_template("D3", "Discern", "C", "Error detection", [],
    "Say: 'Someone solved 82 - 79 by lining them up and borrowing. It took a long time. Was there a faster way?'",
    "Recognizes the numbers are very close, so counting up (79, 80, 81, 82 -> difference of 3) is better.",
    "Insists standard algorithm is the only way.",
    "When are two numbers too close to bother subtracting the long way?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)

# Own
d3_own_A = create_template("D3", "Own", "A", "Teaching / Reversibility", [],
    "Ask your child: 'Can you prove to me that your subtraction answer (12-5=7) is right using addition? Teach me how they are opposites.'",
    "Explains that if A - B = C, then C + B must equal A.",
    "Cannot relate addition to subtraction.",
    "If A - B = C, does B - A also = C? Prove it with blocks.",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_own_B = create_template("D3", "Own", "B", "Teaching / Reversibility", [],
    "Ask: 'Write a rule for how to check ANY subtraction problem to make sure the answer is right.'",
    "States that adding the answer to the amount taken away must give the starting number.",
    "Says 'do it again'.",
    "Why does adding it back together prove it's right?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d3_own_C = create_template("D3", "Own", "C", "Teaching / Reversibility", [],
    "Ask: 'Create a puzzle where someone has to figure out what was taken away: I started with 50, now I have 32. What happened?'",
    "Creates a missing subtrahend problem.",
    "Creates a standard subtraction problem.",
    "Is finding the missing piece the same as subtraction?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d3_enc_A, d3_enc_B, d3_enc_C, d3_exe_A, d3_exe_B, d3_exe_C, d3_dis_A, d3_dis_B, d3_dis_C, d3_own_A, d3_own_B, d3_own_C])

# --- D4: Multiplication as Equal Groups ---
# Encounter
d4_enc_A = create_template("D4", "Encounter", "A", "Visual array", ["Grid paper or a tray of organized objects (e.g., an egg carton)"],
    "Show an array of 4 rows and 6 columns. Ask: 'How can we count these fast without counting by 1s?'",
    "Recognizes they can skip count by rows or columns.",
    "Counts every single item.",
    "What do you notice about the number of rows and the number in each row? Why is that important?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_enc_B = create_template("D4", "Encounter", "B", "Visual array", ["Coins or identical small items"],
    "Arrange 15 coins into 3 neat rows. Ask: 'Without pointing to every coin, how do we know how many there are?'",
    "Notices there are 5 in each row and adds 5+5+5.",
    "Breaks the array to count.",
    "If we pushed the rows together, would there be the same number?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_enc_C = create_template("D4", "Encounter", "C", "Visual array", ["A building with windows, or a drawing of one"],
    "Look at a building with windows arranged in a grid (e.g., 3 floors, 4 windows per floor). Ask: 'How many windows are there? Use the floors to help you count.'",
    "Uses skip counting to find the total windows.",
    "Cannot see the grid structure.",
    "Why do windows get placed like that instead of scattered randomly?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d4_enc_A, d4_enc_B, d4_enc_C])

# Execute
d4_exe_A = create_template("D4", "Execute", "A", "Model translation", [],
    "Ask your child to draw a picture for 4 x 6. Watch to ensure they draw equal groups or an array, not just random dots.",
    "Accurately translates the expression into equal groups or an area model.",
    "Draws random dots or 4 and 6 dots separately.",
    "How do you know your drawing is right? Can you check it a different way?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "4 x 6: Draw 4 circles, put 6 dots in each. Or draw a rectangle 4 blocks high and 6 blocks wide.",
        "execution_problems": ["Draw 3 x 5", "Draw 2 x 8", "Draw 5 x 4", "Draw 6 x 3", "Draw 7 x 2"],
        "endurance_problems": ["Draw a rectangle that is 4 units wide and 6 units long. How many squares inside?", "Show 3 x 7 using tally marks in groups."]
    }
)
d4_exe_B = create_template("D4", "Execute", "B", "Model translation", [],
    "Say: 'Show me 5 groups of 3 using your fingers or drawings.'",
    "Accurately models the groups and counts them.",
    "Cannot represent the multiplication.",
    "Is 5 groups of 3 the same as 3 groups of 5? How?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "5 x 3: Hold up 5 fingers on one hand, imagine 3 dots on each finger. 3, 6, 9, 12, 15.",
        "execution_problems": ["Show 4 x 4", "Show 2 x 9", "Show 6 x 2", "Show 3 x 6", "Show 8 x 3"],
        "endurance_problems": ["Draw 5 x 5, but you can only draw stars.", "What is 10 x 4? Do you need to draw it?"]
    }
)
d4_exe_C = create_template("D4", "Execute", "C", "Model translation", [],
    "Ask: 'Write the math equation for this: 7 bicycles, how many wheels total?'",
    "Writes 7 x 2 = 14 and explains why.",
    "Cannot translate the real world situation to multiplication.",
    "Why didn't you write 7 + 2?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "7 x 2: Seven bikes, two wheels each. 2, 4, 6, 8, 10, 12, 14.",
        "execution_problems": ["4 cars, how many wheels?", "5 hands, how many fingers?", "3 spiders, how many legs (8)?", "6 pairs of shoes, how many shoes?", "2 weeks, how many days?"],
        "endurance_problems": ["5 tricycles (3 wheels). How many wheels?", "10 insects (6 legs)."]
    }
)
templates.extend([d4_exe_A, d4_exe_B, d4_exe_C])

# Discern
d4_dis_A = create_template("D4", "Discern", "A", "Structural property analysis", [],
    "Ask: 'If you know 4 x 6 = 24, do you also know 6 x 4? Why? Can you prove it with your drawing?'",
    "Rotates the array drawing 90 degrees to prove commutativity.",
    "Does not understand that the product is the same.",
    "You just showed 4x6 = 6x4. Does that work for subtraction too? (5-3 vs 3-5?)",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_dis_B = create_template("D4", "Discern", "B", "Structural property analysis", [],
    "Say: 'A child drew 5 groups of 4 as 5 circles, but one circle only has 3 dots. The answer they got is 19. Is this multiplication?'",
    "Explains that multiplication REQUIRES equal groups, so 19 is just addition.",
    "Thinks it's a multiplication error, not a structural failure.",
    "What makes multiplication special compared to just adding numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_dis_C = create_template("D4", "Discern", "C", "Structural property analysis", [],
    "Show: 3 x 0 = 3. Ask: 'Why is this wrong? What does 3 x 0 mean?'",
    "Explains that 3 groups of nothing is nothing.",
    "Believes 3 x 0 = 3, confusing it with addition.",
    "If I have 0 plates with 3 cookies each, how many cookies do I have?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d4_dis_A, d4_dis_B, d4_dis_C])

# Own
d4_own_A = create_template("D4", "Own", "A", "Distributive property design", [],
    "Ask: 'We don't know what 7 x 8 is. But we know 5 x 8 and 2 x 8. Can we use those to find 7 x 8? Show me with a drawing.'",
    "Breaks a 7x8 array into a 5x8 and a 2x8 array, demonstrating the distributive property conceptually.",
    "Cannot relate the two smaller facts to the larger one.",
    "Will breaking a big rectangle into smaller ones ALWAYS give you the same total? Why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_own_B = create_template("D4", "Own", "B", "Distributive property design", [],
    "Ask: 'How can knowing 10 x 6 help you figure out 9 x 6?'",
    "Explains that 9 x 6 is just 10 x 6 minus one group of 6 (60 - 6 = 54).",
    "Does not understand the connection.",
    "How does the '10 times' trick help you with '9 times' for any number?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d4_own_C = create_template("D4", "Own", "C", "Distributive property design", [],
    "Say: 'Make a hard multiplication problem using 12. Then show me how to solve it by breaking the 12 into a 10 and a 2.'",
    "Sets up a problem like 12 x 7, and solves it as (10x7) + (2x7).",
    "Fails to distribute the multiplication over addition.",
    "Why break it into 10 and 2 instead of 6 and 6?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d4_own_A, d4_own_B, d4_own_C])

# --- D5: Division as Equal Partitioning ---
# Encounter
d5_enc_A = create_template("D5", "Encounter", "A", "Physical manipulation", ["Countable objects (beans, blocks)", "cups"],
    "Your child needs to divide 12 beans equally into 3 cups. Ask them to explain why the groups are equal.",
    "Each cup has exactly 4 items AND child uses words like 'same', 'equal', 'fair'.",
    "Groups are unequal OR learner cannot explain after 2 prompts.",
    "Are they equal? How do you know?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_enc_B = create_template("D5", "Encounter", "B", "Physical manipulation", ["15 small items", "5 plates"],
    "Give the child 15 items to share on 5 plates like dealing cards. 'One for you, one for you...' Tell them to stop when they run out.",
    "Deals items one by one until all plates have 3.",
    "Puts random amounts on plates until they are gone.",
    "Why did you put one on each plate before giving anyone a second one?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_enc_C = create_template("D5", "Encounter", "C", "Physical manipulation", ["20 identical objects"],
    "Say: 'I have 20 objects. I want to make little piles of 4. How many piles can I make?' (This is quotative division).",
    "Makes 5 groups of 4 by pulling 4 away at a time.",
    "Gets confused and tries to make 4 groups.",
    "How is this different from sharing them into 4 cups?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d5_enc_A, d5_enc_B, d5_enc_C])

# Execute
d5_exe_A = create_template("D5", "Execute", "A", "Physical manipulation with recording", [],
    "Ask your child to divide 13 objects into 4 groups. Ask: 'What about the extra one? Is that fair?'",
    "Correct partitioning in 5/5 cases, including articulating remainder as 'leftover'.",
    "Tries to cut the object, or ignores the remainder.",
    "If we had one more object, could we make the groups fair?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "13 into 4 groups: I put 3 in each group, which uses 12. I have 1 left over.",
        "execution_problems": ["15 into 3 groups", "18 into 6 groups", "14 into 4 groups (remainder)", "20 into 5 groups", "22 into 7 groups (remainder)"],
        "endurance_problems": ["Divide 15 beans into 4 groups. What happens with the extra? Is it fair to give it to one group?", "Divide 9 into 2 groups."]
    }
)
d5_exe_B = create_template("D5", "Execute", "B", "Physical manipulation with recording", [],
    "Have them draw 24 cookies shared among 6 kids. 'Draw circles for kids, put dots for cookies.'",
    "Draws 6 circles with 4 dots each.",
    "Draws 24 circles.",
    "How did you know how many dots to put in each circle without dealing them one by one?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "24 cookies, 6 kids. I know 6 x 4 is 24, so each kid gets 4.",
        "execution_problems": ["16 shared by 4", "25 shared by 5", "30 shared by 6", "21 shared by 3", "18 shared by 2"],
        "endurance_problems": ["Share 20 among 3 kids.", "Share 100 among 10 kids (don't draw it!)."]
    }
)
d5_exe_C = create_template("D5", "Execute", "C", "Physical manipulation with recording", [],
    "Ask: 'If I have 16 wheels, how many cars can I build?'",
    "Writes 16 ÷ 4 = 4 cars.",
    "Adds 16 + 4.",
    "Is this finding the number of groups or the size of the group?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "16 wheels, 4 wheels per car. 16 ÷ 4 = 4.",
        "execution_problems": ["12 eggs, 6 per box. How many boxes?", "20 legs, 4 per dog. How many dogs?", "15 days, 5 days per week. How many weeks?", "18 socks, 2 per pair. How many pairs?", "24 cans, 6 per pack. How many packs?"],
        "endurance_problems": ["17 wheels, how many cars?", "25 socks, how many pairs?"]
    }
)
templates.extend([d5_exe_A, d5_exe_B, d5_exe_C])

# Discern
d5_dis_A = create_template("D5", "Discern", "A", "Error detection + comparison", [],
    "Set up a wrong partition (e.g., 15 objects in 4 groups: 4, 4, 4, 3). Ask the child to find the mistake and fix it. Also ask: 'Someone says 12 ÷ 3 = 5. Without counting, can you tell if that's right or wrong? How?'",
    "Identifies error, explains reasoning, uses inverse relationship ('3 x 5 = 15, not 12').",
    "Thinks 12 ÷ 3 = 5 because they don't know multiplication facts.",
    "If you know 3 x 4 = 12, what else do you automatically know about dividing?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_dis_B = create_template("D5", "Discern", "B", "Error detection + comparison", [],
    "Say: 'I shared 10 sweets between 2 children. One got 6, one got 4. Is that division?'",
    "Explains that division must be fair/equal, so this is not division.",
    "Agrees it's division because things were split up.",
    "What's the difference between sharing and dividing?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_dis_C = create_template("D5", "Discern", "C", "Error detection + comparison", [],
    "Show: 14 ÷ 4 = 3 remainder 2. Say: 'Someone else got 14 ÷ 4 = 2 remainder 6. Why is the second one wrong even though 2x4+6=14?'",
    "Explains that a remainder cannot be bigger than the divisor (you can make another group of 4).",
    "Cannot explain why the remainder is too big.",
    "If you are putting things in groups of 4, why can you never have 6 leftover?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d5_dis_A, d5_dis_B, d5_dis_C])

# Own
d5_own_A = create_template("D5", "Own", "A", "Design + Teaching", [],
    "Say: 'Create a sharing problem for your sibling that has a remainder. Make sure it's fair. Explain your problem and why the answer must be what it is.'",
    "Creates a valid division problem, predicts the answer, explains the structure.",
    "Creates a problem without a remainder, or one that cannot be solved.",
    "Why do some division problems have remainders and some don't?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_own_B = create_template("D5", "Own", "B", "Design + Teaching", [],
    "Ask: 'Design a game where players have to divide numbers by 2. What happens if they get an odd number?'",
    "Designs a game with a rule for remainders (e.g., skip a turn, save the remainder).",
    "Doesn't understand odd numbers leave remainders when divided by 2.",
    "What do we call numbers that can be divided by 2 with no remainder?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d5_own_C = create_template("D5", "Own", "C", "Design + Teaching", [],
    "Say: 'Teach me how multiplication and division are opposites. Use 5, 4, and 20.'",
    "Explains that 5x4=20, 4x5=20, 20/4=5, 20/5=4 (fact family).",
    "Can't relate the operations.",
    "Does division have a commutative property like multiplication (is 20/4 the same as 4/20)?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d5_own_A, d5_own_B, d5_own_C])

# --- D6: Number Line as Model ---
# Encounter
d6_enc_A = create_template("D6", "Encounter", "A", "Physical movement", ["Tape on floor or drawn chalk line"],
    "Draw a line with marks 0 to 10. Ask your child to stand on 3. Then say: 'Walk to 7. How many steps did you take?'",
    "Child counts the *steps* (the spaces between numbers), not the tick marks.",
    "Child counts the numbers themselves (3, 4, 5, 6, 7 = 5).",
    "What's the difference between counting the marks and counting the jumps? Which one tells you the distance?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_enc_B = create_template("D6", "Encounter", "B", "Physical movement", ["A long ruler or tape measure"],
    "Show a measuring tape. Ask: 'If a bug walks from the 10cm mark to the 15cm mark, how far did it walk?'",
    "Sees the space between 10 and 15 is 5 units.",
    "Says 15cm.",
    "Does it matter where the bug started?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_enc_C = create_template("D6", "Encounter", "C", "Physical movement", ["Floor tiles or paving stones"],
    "Have them stand on a tile. Call it 'Tile 0'. Ask: 'Jump 4 tiles forward. Now jump 2 tiles back. Where are you?'",
    "Models 4 - 2 = 2 on the physical grid.",
    "Gets lost making the jumps.",
    "How is jumping forward and backward like math?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d6_enc_A, d6_enc_B, d6_enc_C])

# Execute
d6_exe_A = create_template("D6", "Execute", "A", "Abstract representation", [],
    "Ask your child to place 48 and 60 on a blank line with 50 in the middle. Check if the distance makes sense.",
    "Numbers are in the correct order, and the proportional distance is roughly accurate.",
    "Places 48 to the right of 50, or puts 60 right next to 50.",
    "Why does the spacing between numbers matter? What happens if you make the spaces uneven?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "50 is in the middle. 48 is just a little to the left. 60 is further to the right.",
        "execution_problems": ["Place 10 and 90 on a line 0-100", "Place 25 on 0-100", "Place 75 on 0-100", "Place 45 on 40-50", "Place 99 on 0-100"],
        "endurance_problems": ["Put 10 and 20 on the line. Now put 100. Is your spacing right?", "Draw an empty line. Put 0, then put 1000."]
    }
)
d6_exe_B = create_template("D6", "Execute", "B", "Abstract representation", [],
    "Draw an open number line. Ask: 'Solve 34 + 12 using jumps on this line.'",
    "Starts at 34, jumps 10 to 44, jumps 2 to 46.",
    "Tries to draw 46 individual tick marks.",
    "Why is it better to jump by 10s than by 1s?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "34 + 12: Start at 34. Big jump of +10 to 44. Small jump of +2 to 46.",
        "execution_problems": ["25 + 15", "42 + 20", "56 + 11", "73 + 15", "18 + 22"],
        "endurance_problems": ["Solve 48 + 35 using jumps.", "Solve 90 - 45 using jumps backward."]
    }
)
d6_exe_C = create_template("D6", "Execute", "C", "Abstract representation", [],
    "Draw a line with marks at 0, 10, 20. Ask them to point to approximately where 17 is.",
    "Points closer to 20 than to 10.",
    "Points in the exact middle or close to 10.",
    "How did you know it was closer to the 20?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "17 is between 10 and 20. Halfway is 15. 17 is a little past 15.",
        "execution_problems": ["Point to 8", "Point to 12", "Point to 24 (on 0,10,20,30)", "Point to 29", "Point to 5"],
        "endurance_problems": ["Where is 50 on a line from 0 to 1000?", "Where is 99?"]
    }
)
templates.extend([d6_exe_A, d6_exe_B, d6_exe_C])

# Discern
d6_dis_A = create_template("D6", "Discern", "A", "Error detection", [],
    "Show a number line where the distance from 0 to 10 is the same size as the distance from 10 to 12. Ask: 'What is wrong with this picture?'",
    "Recognizes the scale is broken (10 steps shouldn't take the same space as 2 steps).",
    "Thinks it's fine because the numbers are in order.",
    "Why is a broken scale confusing when you try to solve a math problem?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_dis_B = create_template("D6", "Discern", "B", "Error detection", [],
    "Show a number line that goes 10, 20, 30, 50, 60. Ask: 'What's missing and why is that a problem?'",
    "Notices 40 is missing, creating a jump of 20 instead of 10.",
    "Doesn't notice the skip.",
    "Can a number line skip numbers if the spaces change size?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_dis_C = create_template("D6", "Discern", "C", "Error detection", [],
    "Say: 'Someone tried to solve 50 - 20 by jumping forward instead of backward. Does that work?'",
    "Understands that distance is distance, so starting at 20 and jumping to 50 gives the same answer (30).",
    "Thinks subtraction MUST move left.",
    "Is 'taking away' the only way to subtract?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d6_dis_A, d6_dis_B, d6_dis_C])

# Own
d6_own_A = create_template("D6", "Own", "A", "System creation", [],
    "Ask: 'Design a number line that only shows multiples of 5 (0, 5, 10...). Use it to show someone how to solve 15 + 10.'",
    "Creates a consistent scale stepping by 5s and models an operation on it.",
    "Draws a line with 1s but only labels the 5s.",
    "How does changing the scale (what each tick mark means) make math easier for big numbers?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_own_B = create_template("D6", "Own", "B", "System creation", [],
    "Ask: 'Draw a number line that goes backward, starting at 100 and ending at 0. Use it to solve 80 - 15.'",
    "Draws the line correctly with 100 on the left and 0 on the right (unconventional but valid).",
    "Cannot conceptualize a reversed line.",
    "Does math still work if the line goes the other way? Why?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d6_own_C = create_template("D6", "Own", "C", "System creation", [],
    "Say: 'Create a thermometer using a number line. Make sure it has numbers below zero.'",
    "Extends the number line to the left of zero with negative numbers.",
    "Stops at zero.",
    "What do the numbers on the other side of zero mean?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d6_own_A, d6_own_B, d6_own_C])

# --- D7: Properties of Operations ---
# Encounter
d7_enc_A = create_template("D7", "Encounter", "A", "Observation", ["3 rocks, 4 leaves"],
    "Show 3 rocks and 4 leaves. Count them (7). Now swap them: show 4 leaves and 3 rocks. Count them. Ask: 'Did the total change? Does the order matter?'",
    "Recognizes order doesn't change the sum (Commutative property).",
    "Thinks the new order makes a new amount.",
    "If we had 100 rocks and 2 leaves, which is easier to start counting from?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_enc_B = create_template("D7", "Encounter", "B", "Observation", ["3 types of objects (e.g. 2 spoons, 3 forks, 4 cups)"],
    "Put 2 spoons and 3 forks in one group, 4 cups in another. Count total. Then put 2 spoons alone, and 3 forks + 4 cups together. Count total. Ask: 'Did the total change?'",
    "Notices grouping differently doesn't change the sum (Associative property).",
    "Believes moving the items changes the total.",
    "Does it matter who is grouped with who, if they all go in the same pot?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_enc_C = create_template("D7", "Encounter", "C", "Observation", ["Blocks or legos"],
    "Build a 2x5 rectangle of blocks. Ask how many. Then turn it 90 degrees to be 5x2. Ask how many. 'Did I add any blocks? Did the total change?'",
    "Sees that 2x5 is the same amount as 5x2.",
    "Has to recount the blocks when it turns.",
    "Does standing a rectangle up make it bigger than laying it down?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d7_enc_A, d7_enc_B, d7_enc_C])

# Execute
d7_exe_A = create_template("D7", "Execute", "A", "Relational thinking", [],
    "Give your child the problem 2 + 7 + 8. Ask: 'Which two numbers should you add first to be fast?'",
    "Uses properties (associative/commutative) to group 2+8=10, then add 7 to get 17.",
    "Works left to right (2+7=9, 9+8=17), missing the structure.",
    "Why is finding a 10 always a good first step?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "2 + 7 + 8: I see 2 and 8 make 10. 10 + 7 = 17.",
        "execution_problems": ["4 + 9 + 6", "5 + 3 + 5", "1 + 8 + 9", "3 + 7 + 4", "6 + 6 + 4"],
        "endurance_problems": ["If 58 + 42 = 100, what is 42 + 58? Don't add it!", "Solve 13 + 99 + 87 by grouping."]
    }
)
d7_exe_B = create_template("D7", "Execute", "B", "Relational thinking", [],
    "Say: 'I know 8 x 5 is 40. What is 5 x 8?'",
    "Answers 40 immediately without calculating.",
    "Tries to count by 5s eight times.",
    "If you forget what 7 x 3 is, what other problem could you solve to find the answer?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "If 8 x 5 = 40, then 5 x 8 = 40. The order doesn't change the answer.",
        "execution_problems": ["If 6x4=24, what is 4x6?", "If 9x2=18, what is 2x9?", "If 7x5=35, what is 5x7?", "If 3x8=24, what is 8x3?", "If 10x4=40, what is 4x10?"],
        "endurance_problems": ["If A x B = 100, what is B x A?", "What is 100 x 0? What is 0 x 100?"]
    }
)
d7_exe_C = create_template("D7", "Execute", "C", "Relational thinking", [],
    "Show the problem (4 + 6) + 5 = 15. Ask: 'If I move the parentheses to 4 + (6 + 5), what will the answer be?'",
    "Knows it will still be 15.",
    "Calculates 6+5=11, then 11+4=15 to check.",
    "Why do parentheses matter in math, and why do they NOT change the answer in addition?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "(4 + 6) + 5 = 15. So 4 + (6 + 5) must also be 15. Grouping doesn't change the sum.",
        "execution_problems": ["If (3+2)+8=13, what is 3+(2+8)?", "If (5+5)+7=17, what is 5+(5+7)?", "Solve (1+9)+4. Now solve 1+(9+4).", "Solve (6+4)+2.", "Solve 6+(4+2)."],
        "endurance_problems": ["(12 + 88) + 5 = 105. What is 12 + (88 + 5)?", "Why doesn't this trick work for 10 - (5 - 2)?"]
    }
)
templates.extend([d7_exe_A, d7_exe_B, d7_exe_C])

# Discern
d7_dis_A = create_template("D7", "Discern", "A", "Boundary testing", [],
    "Ask: 'You know 5 + 3 is the same as 3 + 5. Is 5 - 3 the same as 3 - 5? Let's check with blocks.'",
    "Discovers that subtraction is NOT commutative.",
    "Assumes the rule applies to everything.",
    "Why does order matter when you take away, but not when you put together?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_dis_B = create_template("D7", "Discern", "B", "Boundary testing", [],
    "Ask: 'Is 10 ÷ 2 the same as 2 ÷ 10?'",
    "Understands that sharing 10 things among 2 people is very different from sharing 2 things among 10 people.",
    "Thinks the answer is 5 both ways.",
    "Which operation is division like: addition or subtraction? (Order matters for both subtraction and division).",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_dis_C = create_template("D7", "Discern", "C", "Boundary testing", [],
    "Say: 'Someone wrote: (10 - 5) - 2 = 10 - (5 - 2). Let's solve both sides. Do they equal the same thing?'",
    "Calculates left side as 3, right side as 7. Realizes the associative property does NOT work for subtraction.",
    "Assumes they must be equal without checking.",
    "Why can't you just move parentheses around in a subtraction problem?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d7_dis_A, d7_dis_B, d7_dis_C])

# Own
d7_own_A = create_template("D7", "Own", "A", "Generalization", [],
    "Ask: 'Can you write a rule about adding? Something that is ALWAYS true for any numbers you ever find?'",
    "States a rule like 'You can always switch the numbers when adding and get the same answer.'",
    "Writes a specific math fact like 2+2=4.",
    "Can you prove your rule works for a giant number, like 1,000,000 + 1?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_own_B = create_template("D7", "Own", "B", "Generalization", [],
    "Ask: 'Make up a trick to help a younger kid remember which math signs let you swap the numbers around.'",
    "Creates a memory aid distinguishing + and x from - and ÷.",
    "Is confused about which operations allow swapping.",
    "Why are + and x 'friendly' to swapping, but - and ÷ aren't?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d7_own_C = create_template("D7", "Own", "C", "Generalization", [],
    "Say: 'Show me why adding zero to a number never changes it, but multiplying a number by zero changes it to zero.'",
    "Explains that adding zero means putting nothing in the pile. Multiplying by zero means having NO piles.",
    "Mixes up the rules for zero.",
    "What is the 'magic number' you multiply by to keep a number the same? (Identity property of multiplication = 1).",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d7_own_A, d7_own_B, d7_own_C])

# --- D8: Equivalence ---
# Encounter
d8_enc_A = create_template("D8", "Encounter", "A", "Physical balance", ["A hanger balance or visual balance scale", "identical items"],
    "Put 4 identical blocks on the left, 4 on the right. It balances. Add 1 block to the left. Ask: 'What do I have to do to the right to make it balance again?'",
    "Understands that whatever happens to one side must happen to the other.",
    "Takes a block away from the right.",
    "Why does the equal sign mean 'balance' and not just 'here comes the answer'?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_enc_B = create_template("D8", "Encounter", "B", "Physical balance", ["Two transparent cups", "water"],
    "Pour water into two cups so they are exactly even. Say: 'These are equal.' Take a sip from one cup. Ask: 'Are they still equal? How do I make them equal again?'",
    "Says you must take the same size sip from the other cup.",
    "Suggests adding water to the first cup (this is correct, but doesn't show equivalence of action).",
    "If I do something to the left side, what is the golden rule for the right side?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_enc_C = create_template("D8", "Encounter", "C", "Physical balance", ["Scale", "different sized objects"],
    "Put a heavy object on the left. Put 5 light objects on the right so it balances. Ask: 'Is 1 heavy thing equal to 5 light things?'",
    "Understands that 1 can equal 5 if the total weight is the same.",
    "Says it's not equal because 1 is not the number 5.",
    "Can a big number like 10 be equal to a bunch of small numbers? How?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d8_enc_A, d8_enc_B, d8_enc_C])

# Execute
d8_exe_A = create_template("D8", "Execute", "A", "Symbolic balance", [],
    "Write 5 + 4 = 6 + ___. Remind them: '=' means BALANCE, not 'write the answer here'.",
    "Finds the missing number (3) without adding all visible numbers together.",
    "Writes 9 or 15 in the blank.",
    "How did you figure out the blank without just guessing?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "5 + 4 = 6 + ___. The left side is 9. So the right side MUST be 9. 6 + 3 = 9. So the blank is 3.",
        "execution_problems": ["3 + 5 = 4 + ___", "7 + 2 = ___ + 1", "6 + 6 = 10 + ___", "8 + ___ = 5 + 5", "___ + 4 = 7 + 3"],
        "endurance_problems": ["___ + 2 = 5 + 3. The blank is first!", "10 - 2 = 4 + ___"]
    }
)
d8_exe_B = create_template("D8", "Execute", "B", "Symbolic balance", [],
    "Write 10 = ___ + 4. Ask them to solve it.",
    "Understands that the equation can be 'backwards'. Blank is 6.",
    "Gets confused because the answer is on the left.",
    "Does the = sign care which side the math problem is on?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "10 = ___ + 4. The left side is 10. The right side needs to be 10. 6 + 4 is 10.",
        "execution_problems": ["12 = 8 + ___", "15 = ___ + 5", "9 = 4 + ___", "20 = ___ + 10", "14 = 7 + ___"],
        "endurance_problems": ["___ + ___ = 10. Find three different ways to answer this.", "20 = ___ - 5"]
    }
)
d8_exe_C = create_template("D8", "Execute", "C", "Symbolic balance", [],
    "Ask: 'Is this true or false? 4 + 4 = 4 + 4'",
    "Recognizes it is true because both sides are identical.",
    "Says it's false because there's no single answer.",
    "What about 4 + 4 = 8 + 0? Is that true?",
    {"exposure": 0, "execution": 5, "endurance": 3},
    {
        "worked_example": "4 + 4 = 4 + 4 is TRUE. Left side is 8, right side is 8.",
        "execution_problems": ["True or false? 5+2 = 7", "True or false? 3+3 = 2+4", "True or false? 9 = 8+1", "True or false? 10+2 = 10", "True or false? 6+0 = 0+6"],
        "endurance_problems": ["True or false? 15 + 5 = 5 + 15", "True or false? 20 - 5 = 10 + 5"]
    }
)
templates.extend([d8_exe_A, d8_exe_B, d8_exe_C])

# Discern
d8_dis_A = create_template("D8", "Discern", "A", "Error detection", [],
    "Show this: 8 + 4 = 12 + 2 = 14. Ask: 'Your friend wrote this. What did they think the '=' sign meant? How would you explain they are wrong?'",
    "Understands the friend thought '=' meant 'compute', creating a run-on equation (8+4 != 14). Fixes it by separating into two equations.",
    "Doesn't see the problem because 12+2 is 14.",
    "Can you ever have two '=' signs in a row like that if the ends don't match?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_dis_B = create_template("D8", "Discern", "B", "Error detection", [],
    "Say: 'A student saw 7 + 5 = ___ + 4. They wrote 12 in the blank. Why did they write 12?'",
    "Explains that the student just added 7 and 5 and ignored the '+ 4'.",
    "Thinks 12 is correct.",
    "If we put 12 in the blank, what is the total on the right side? Does 12 balance 16?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_dis_C = create_template("D8", "Discern", "C", "Error detection", [],
    "Show: ___ = 5 + 3. 'Someone says you can't start with a blank. Are they right?'",
    "Explains that an equation is a balance, so you can start with the total.",
    "Agrees you can't start with a blank.",
    "If a scale balances, does it matter which side you look at first?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d8_dis_A, d8_dis_B, d8_dis_C])

# Own
d8_own_A = create_template("D8", "Own", "A", "Design", [],
    "Ask: 'Create the longest balancing equation you can using addition and subtraction. Like 5 + 5 = 12 - 2 = 6 + 4.'",
    "Creates a true, multi-term equation demonstrating deep understanding of equivalence.",
    "Makes calculation errors or creates a run-on equation.",
    "How can you check every part of your long equation to make sure it's perfect?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_own_B = create_template("D8", "Own", "B", "Design", [],
    "Ask: 'Write an equation where the answer is 20, but the number 20 is not allowed to be written anywhere.'",
    "Writes something like 10 + 10 = 15 + 5.",
    "Cannot conceptualize an equation without the final answer written.",
    "Why don't you need to write the answer to show that they are equal?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d8_own_C = create_template("D8", "Own", "C", "Design", [],
    "Say: 'Make a puzzle for me like 7 + ___ = 10 + 2. Don't make it too easy!'",
    "Sets up an equivalent expression with one missing variable.",
    "Sets up a standard 7 + 2 = ___ problem.",
    "What happens if I guess a number that is too big for your puzzle?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d8_own_A, d8_own_B, d8_own_C])

# --- D9: Estimation & Reasonableness ---
# Encounter
d9_enc_A = create_template("D9", "Encounter", "A", "Magnitude guessing", ["A clear jar with items (e.g., beans)"],
    "Show the jar. Ask: 'Are there about 10, about 100, or about 1000 in here? Why do you think that?'",
    "Picks the right order of magnitude without counting.",
    "Insists on opening the jar to count exactly.",
    "How does looking at the size of one bean help you guess the total?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_enc_B = create_template("D9", "Encounter", "B", "Magnitude guessing", ["A book"],
    "Show a thick book. Ask: 'Does this book have about 20 pages, 200 pages, or 2000 pages? Don't open it.'",
    "Guesses reasonably based on thickness.",
    "Cannot connect thickness to quantity.",
    "If a book had 2000 pages, how heavy would it be?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_enc_C = create_template("D9", "Encounter", "C", "Magnitude guessing", ["Outdoors or looking out a window"],
    "Point to a large tree. Ask: 'Does that tree have about 50 leaves, 500 leaves, or more than 5000 leaves?'",
    "Understands that natural objects often exist in very large, uncountable quantities.",
    "Guesses a small number like 50.",
    "Why is it impossible to know the exact number? Does it matter?",
    {"exposure": 1, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d9_enc_A, d9_enc_B, d9_enc_C])

# Execute
d9_exe_A = create_template("D9", "Execute", "A", "Rounding basics", [],
    "Ask: 'Is 48 closer to 40 or 50?'",
    "Identifies 50 because 8 is closer to the next ten.",
    "Guesses randomly.",
    "Is your estimate a guess, or did you use a strategy? What's the difference?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "48 is on the number line. 45 is the middle. 48 is past the middle, so it's closer to 50.",
        "execution_problems": ["Is 21 closer to 20 or 30?", "Is 67 closer to 60 or 70?", "Is 89 closer to 80 or 90?", "Is 12 closer to 10 or 20?", "Is 93 closer to 90 or 100?"],
        "endurance_problems": ["If you want to buy two toys that cost 18 and 21, will 30 be enough? Just guess by looking!", "Is 35 closer to 30 or 40? (What is the rule?)"]
    }
)
d9_exe_B = create_template("D9", "Execute", "B", "Rounding basics", [],
    "Say: 'I have 52 coins. My friend has 39 coins. About how many do we have together: 80, 90, or 100?'",
    "Rounds 52 to 50, 39 to 40. 50+40 = 90.",
    "Tries to calculate 52+39 exactly and gets lost.",
    "Why is 90 a good enough answer for this question?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "52 + 39. 52 is about 50. 39 is about 40. 50 + 40 is 90.",
        "execution_problems": ["Estimate 28 + 31", "Estimate 49 + 12", "Estimate 61 + 18", "Estimate 78 - 21", "Estimate 53 - 29"],
        "endurance_problems": ["Estimate 19 + 21 + 38", "Will 42 + 45 be more or less than 100?"]
    }
)
d9_exe_C = create_template("D9", "Execute", "C", "Rounding basics", [],
    "Ask: 'If you take 19 away from 82, will the answer be in the 50s, 60s, or 70s?'",
    "Uses estimation (80 - 20 = 60) to find the right decade.",
    "Calculates exactly.",
    "How does knowing the 'tens' help you check your exact answer later?",
    {"exposure": 0, "execution": 5, "endurance": 2},
    {
        "worked_example": "82 - 19. 80 minus 20 is 60. So the answer is in the 60s.",
        "execution_problems": ["Will 51 + 29 be in the 70s or 80s?", "Will 92 - 18 be in the 60s or 70s?", "Will 38 + 43 be in the 70s or 80s?", "Will 71 - 39 be in the 30s or 40s?", "Will 22 + 69 be in the 80s or 90s?"],
        "endurance_problems": ["Estimate 104 - 12.", "Estimate 99 + 99."]
    }
)
templates.extend([d9_exe_A, d9_exe_B, d9_exe_C])

# Discern
d9_dis_A = create_template("D9", "Discern", "A", "Checking calculations", [],
    "Say: 'Someone added 42 + 59 and got 81. Before adding it yourself, how do you know their answer MUST be wrong?'",
    "Notes that 40 + 50 is 90, so the answer must be bigger than 90.",
    "Must calculate exactly to know it's wrong.",
    "If you know the real answer has to be bigger than 90, why did they get 81? (They didn't carry the ten).",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_dis_B = create_template("D9", "Discern", "B", "Checking calculations", [],
    "Show: 83 - 28 = 65. Ask: 'Use estimation to prove if this answer is reasonable.'",
    "Estimates 80 - 30 = 50. Since 65 is nowhere near 50, it is unreasonable.",
    "Calculates exactly instead of estimating.",
    "Why is it a good habit to estimate the answer in your head before you start doing the math on paper?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_dis_C = create_template("D9", "Discern", "C", "Checking calculations", [],
    "Say: 'A machine said 102 - 98 = 104. How do you know that's crazy without calculating?'",
    "Recognizes the numbers are very close together, so the difference must be tiny.",
    "Cannot explain why it's wrong conceptually.",
    "When numbers are close together on the number line, is the difference big or small?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d9_dis_A, d9_dis_B, d9_dis_C])

# Own
d9_own_A = create_template("D9", "Own", "A", "Problem generation", [],
    "Ask: 'Tell me a story where someone SHOULD estimate instead of counting exactly. Why is it better to estimate there?'",
    "Identifies real-world situations (e.g., crowds, distant trees) where estimation is preferred or necessary.",
    "Gives a situation like paying for groceries where exactness is required.",
    "Can you tell me a rule for when estimation is good enough and when you NEED the exact answer?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_own_B = create_template("D9", "Own", "B", "Problem generation", [],
    "Ask: 'Write a math problem where estimating gives you 100, but the exact answer is 92.'",
    "Creates a problem like 51 + 41.",
    "Cannot reverse engineer a problem from an estimate.",
    "Why does 51 + 41 estimate to 100?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
d9_own_C = create_template("D9", "Own", "C", "Problem generation", [],
    "Say: 'Imagine you are building a bridge. Should you estimate how long it needs to be, or measure exactly? Why?'",
    "Explains that some things must be exact because mistakes are dangerous or expensive.",
    "Says estimate because it's faster.",
    "If you had to guess the cost of the bridge, would you estimate the cost higher or lower than you think? (Safety margin).",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": ""}
)
templates.extend([d9_own_A, d9_own_B, d9_own_C])

# Milestone Tasks
d1_milestone = create_template("D1", "Milestone", "M", "Real-world situation", [],
    "Your grandmother asks you to count the chickens on the farm. There are many. She needs to know how many there are so she can tell the vet. How would you count them so you don't lose track and don't have to start over?",
    "Child proposes grouping by 10s or another systematic method. Reasoning: explains why grouping prevents double-counting.",
    "Counts by 1s or proposes random methods.",
    "Why does your method work better than just pointing at them?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "How would you count 150 scattered seeds quickly?"}
)
d2_milestone = create_template("D2", "Milestone", "M", "Real-world situation", [],
    "Your family is travelling. In the morning, you drove past 28 road signs. After lunch, you drove past 34 more. Grandmother wants to know the total so she can tell a story about it. Figure it out.",
    "Child combines the quantities without being told to 'add'. Uses a strategy (make-a-ten, decomposition) and explains why the total must be more than 50.",
    "Waits to be told what operation to use.",
    "How did you know you needed to put those numbers together?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "We bought 45 bags of cement, and then 20 more. What do we do to find the total?"}
)
d3_milestone = create_template("D3", "Milestone", "M", "Real-world situation", [],
    "There were 43 chapatis on the plate this morning. Now there are 17. Your aunt wants to know what happened. Help her figure it out.",
    "Child recognises this is a comparison/difference situation. Finds the gap (26). Reasoning: explains that the missing chapatis are the difference between what was there and what's left.",
    "Adds the numbers together.",
    "Why did you find the difference instead of adding?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "You had 500 shillings. Now you have 150. Figure out what happened."}
)
d4_milestone = create_template("D4", "Milestone", "M", "Real-world situation", [],
    "We are planting a garden. We have 6 rows, and each row has space for 8 seedlings. Tendo wants to buy the seedlings at the market. How many should he buy?",
    "Child identifies the array/equal groups structure. Calculates 48. Does not need to be told 'multiply'.",
    "Adds 6 + 8.",
    "How did you know to count by 8s instead of just adding 6 and 8?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "We need 5 buses. Each bus holds 40 people. How many people can go?"}
)
d5_milestone = create_template("D5", "Milestone", "M", "Real-world situation", [],
    "Nala brought 30 groundnuts to share with her 5 friends (not including herself). She wants everyone to have the same amount. What should she do?",
    "Child partitions 30 into 6 equal groups (Nala + 5 friends). Each gets 5. Reasoning: explains why 6 groups, not 5.",
    "Divides by 5, forgetting Nala, or doesn't know to divide.",
    "How do you ensure everyone gets a fair share?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "We have 45 books to put on 5 shelves. Make them even."}
)
d6_milestone = create_template("D6", "Milestone", "M", "Real-world situation", [],
    "The school is at the 15-kilometre marker on the road. The market is at the 42-kilometre marker. Your uncle wants to know how far it is from school to the market.",
    "Child finds the distance (27 km) by subtraction or counting up. Reasoning: explains this is a 'how far between' problem, not 'what is 15 plus 42'.",
    "Adds 15 and 42.",
    "Why does finding the space between two markers tell you the distance?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "The bus starts at stop 10 and ends at stop 35. How many stops?"}
)
d7_milestone = create_template("D7", "Milestone", "M", "Real-world situation", [],
    "You need to count the total legs on 3 tables and 7 chairs. Tables have 4 legs each and chairs have 4 legs each. Amara says you should count the table legs first, then the chair legs. Tendo says just count all the furniture and multiply by 4. Who gets the answer faster? Do they get the same answer?",
    "Child recognises the distributive property/commutativity in action. Both methods work. Explains why.",
    "Only calculates one way and thinks the other is wrong.",
    "Why do both methods give the exact same total?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Should I multiply 5 x 9 first, or 9 x 5 first? Does it matter?"}
)
d8_milestone = create_template("D8", "Milestone", "M", "Real-world situation", [],
    "Your mother gave your brother 6 sweets in the morning and 4 at lunch. She gave you some sweets at lunch only. You both have the same total. How many did she give you?",
    "Child sets up the balance (6 + 4 = ?). Finds 10. Key reasoning: the child is not looking for '= means write the answer' — they are solving for balance.",
    "Adds all numbers they hear (6+4+10).",
    "How did you know you needed 10 to make it fair?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Team A scored 3 and 2. Team B scored 1 and what else, to be tied?"}
)
d9_milestone = create_template("D9", "Milestone", "M", "Real-world situation", [],
    "Aunt Prossy says there are about 200 people at the wedding, but Uncle Joseph says there are 500. You look at the crowd. The chairs have 10 rows of 10. Some people are standing. Who do you think is closer to right? Why?",
    "Child uses the anchor (100 chairs × occupancy) to estimate. Recognises that 200 is more plausible than 500, given the visible reference point. Does NOT try to count every head.",
    "Tries to guess without using the anchor information.",
    "How did the rows of chairs help you prove Uncle Joseph wrong?",
    {"exposure": 0, "execution": 0, "endurance": 0},
    {"worked_example": "", "execution_problems": [], "endurance_problems": [], "milestone_problem": "Is this jar of 100 beans closer to 50 or 500?"}
)

templates.extend([d1_milestone, d2_milestone, d3_milestone, d4_milestone, d5_milestone, d6_milestone, d7_milestone, d8_milestone, d9_milestone])

# Output generation
os.makedirs("curriculum_data", exist_ok=True)
with open("curriculum_data/band_2_strand_1_templates.json", "w") as f:
    json.dump(templates, f, indent=2)

print("Generated band_2_strand_1_templates.json with partial capacity data.")
