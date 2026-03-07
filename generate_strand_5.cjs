const fs = require('fs');
const path = require('path');

const capacities = [
  { id: 'OL2a', name: 'Following Multi-Step Directions' },
  { id: 'OL2b', name: 'Oral Retelling — Detailed' },
  { id: 'OL2c', name: 'Oral Narration — Personal' },
  { id: 'OL2d', name: 'Oral Narration — Fictional' },
  { id: 'OL2e', name: 'Vocabulary Use in Speech' },
  { id: 'OL2f', name: 'Active Listening' },
  { id: 'OL2g', name: 'Speaking to an Audience' },
  { id: 'OL2h', name: 'Explaining Reasoning' }
];

const contextVariants = {
  default: {
    names: ["Alex", "Sam", "Pat"],
    settings: ["park", "school", "store"],
    food: ["apples", "bread", "milk"]
  },
  ug: {
    names: ["Amara", "Tendo", "Azie"],
    settings: ["Kampala market", "village", "garden"],
    food: ["matooke", "mangoes", "chapati"]
  }
};

const levels = [
  { level: 1, type: "Multisensory Encounter" },
  { level: 2, type: "Verbal Execution" },
  { level: 3, type: "Verbal Discernment" },
  { level: 4, type: "Creative Verbal Production" }
];

const materialsEncounter = ["Everyday objects", "Toys or blocks", "Audio recordings"];
const materialsExecution = ["None (Verbal/Physical task)"];

function generatePrompts(capId, level, variation, isMilestone) {
  let promptStr = "";
  let successStr = "Child correctly performs the multi-step directions, verbalizes the narrative/reasoning, or identifies errors.";
  let failureStr = "Child misses steps, lacks sequence/detail, or does not clearly verbalize. Parent provides guidance and models correct output.";
  let reasonStr = "";
  let taskTypeStr = "Verbal/Physical Task";
  let materialsArr = materialsExecution;

  if (isMilestone) {
    taskTypeStr = "Milestone Verbal Production";
    reasonStr = "Explain the choices you made.";
    // Real-world, unlabeled tasks
    switch (capId) {
      case 'OL2a': promptStr = "Real-world task for OL2a: Ask your child to help make a simple snack or set the table using 3-4 unprompted sequential steps."; break;
      case 'OL2b': promptStr = "Real-world task for OL2b: Have your child call a grandparent or family member and retell a recent event they attended in detail."; break;
      case 'OL2c': promptStr = "Real-world task for OL2c: Ask your child to tell a friend about their favorite memory from this week, making sure it has a beginning, middle, and end."; break;
      case 'OL2d': promptStr = "Real-world task for OL2d: Ask your child to invent a bedtime story to tell a younger sibling or toy."; break;
      case 'OL2e': promptStr = "Real-world task for OL2e: While at the market or store, ask your child to describe an item using three new vocabulary words they learned recently."; break;
      case 'OL2f': promptStr = "Real-world task for OL2f: Listen to an announcement or short radio clip together. Ask your child to summarize what the speaker just said."; break;
      case 'OL2g': promptStr = "Real-world task for OL2g: Have your child present a drawing or project they made to the whole family after dinner, speaking clearly."; break;
      case 'OL2h': promptStr = "Real-world task for OL2h: Ask your child to choose which game to play today and explain exactly why they chose it using 'because'."; break;
    }
    return { promptStr, successStr, failureStr, reasonStr, taskTypeStr, materialsArr };
  }

  if (level === 1) { // Encounter
    taskTypeStr = "Auditory/Verbal Encounter";
    materialsArr = materialsEncounter;
    reasonStr = "What did you hear or notice? How did you know what to do?";
    if (capId === 'OL2a') {
      if (variation === 'A') promptStr = "Variation A: I will give you two instructions at once: 'Touch your nose, then clap your hands.' Do it.";
      if (variation === 'B') promptStr = "Variation B: Listen to these three instructions: 'Stand up, spin around, and sit back down.' Try it.";
      if (variation === 'C') promptStr = "Variation C: I'm going to hide a toy. Listen to my directions to find it (e.g., 'Go to the door, turn left, look under the chair').";
    } else if (capId === 'OL2b') {
      if (variation === 'A') promptStr = "Variation A: I will read a short fable. When I finish, tell me what happened first.";
      if (variation === 'B') promptStr = "Variation B: Listen to this story. Show me with these picture cards what happened in the middle.";
      if (variation === 'C') promptStr = "Variation C: I will tell you a story. Act out the ending for me.";
    } else if (capId === 'OL2c') {
      if (variation === 'A') promptStr = "Variation A: Think of a time you were very surprised. Draw a quick picture of it and tell me what the picture shows.";
      if (variation === 'B') promptStr = "Variation B: I will tell you a story about when I was little. Then, tell me if something similar ever happened to you.";
      if (variation === 'C') promptStr = "Variation C: Look at this old family photo. Tell me one thing you remember from that day.";
    } else if (capId === 'OL2d') {
      if (variation === 'A') promptStr = "Variation A: Look at this picture of a flying dog. Tell me one sentence about where he is going.";
      if (variation === 'B') promptStr = "Variation B: I am going to start a story: 'Once there was a tiny elephant...' You add the next sentence.";
      if (variation === 'C') promptStr = "Variation C: Pick two random objects from the room. Make up a short story linking them together.";
    } else if (capId === 'OL2e') {
      if (variation === 'A') promptStr = "Variation A: Listen to the word 'enormous'. It means very big. Tell me something that is enormous.";
      if (variation === 'B') promptStr = "Variation B: The word 'sprint' means to run very fast. Show me how you sprint, then say 'I am sprinting'.";
      if (variation === 'C') promptStr = "Variation C: Look at this picture of a sad boy. Instead of 'sad', let's use the word 'miserable'. Why is he miserable?";
    } else if (capId === 'OL2f') {
      if (variation === 'A') promptStr = "Variation A: I am going to read a short poem. Close your eyes and listen. When I finish, tell me one animal you heard.";
      if (variation === 'B') promptStr = "Variation B: Listen to this paragraph about elephants. I will ask you one question about what they eat.";
      if (variation === 'C') promptStr = "Variation C: I'm going to describe a secret object. Listen carefully and guess what it is.";
    } else if (capId === 'OL2g') {
      if (variation === 'A') promptStr = "Variation A: Stand up straight, look me in the eyes, and loudly say your full name and age.";
      if (variation === 'B') promptStr = "Variation B: Pretend you are a teacher. Tell your stuffed animals to sit down and be quiet, using a strong, clear voice.";
      if (variation === 'C') promptStr = "Variation C: Recite a short nursery rhyme or song for me while standing on this 'stage' (a rug or mat).";
    } else if (capId === 'OL2h') {
      if (variation === 'A') promptStr = "Variation A: Do you prefer apples or bananas? Tell me which one, and say 'because...' to explain why.";
      if (variation === 'B') promptStr = "Variation B: I think dogs make the best pets. I think this because they are friendly. Why do you think someone might want a cat instead?";
      if (variation === 'C') promptStr = "Variation C: Look outside. Is it a good day to play outside? Give me one reason why.";
    }
  } else if (level === 2) { // Execute
    taskTypeStr = "Verbal Execution";
    reasonStr = "Why did you sequence/say it that way? How do you know?";
    if (capId === 'OL2a') {
      if (variation === 'A') promptStr = "Variation A: Follow these 3 steps exactly: 1) Touch the wall, 2) Jump twice, 3) Say 'Done!'";
      if (variation === 'B') promptStr = "Variation B: Follow these 4 steps: 1) Pick up a pencil, 2) Put it on the chair, 3) Clap once, 4) Sit on the floor.";
      if (variation === 'C') promptStr = "Variation C: Give *me* 3 instructions to follow, and watch to see if I do them in the right order.";
    } else if (capId === 'OL2b') {
      if (variation === 'A') promptStr = "Variation A: I will read a short story. Retell it to me, making sure you include the beginning, middle, and end.";
      if (variation === 'B') promptStr = "Variation B: After we read this chapter, tell me who the main characters were and what problem they faced.";
      if (variation === 'C') promptStr = "Variation C: Retell the story of your favorite movie, making sure you tell the events in the order they happened.";
    } else if (capId === 'OL2c') {
      if (variation === 'A') promptStr = "Variation A: Tell me a story about something funny that happened to you at school or at home. Include a beginning, middle, and end.";
      if (variation === 'B') promptStr = "Variation B: Tell me about a time you were scared. Make sure to describe where you were and what happened.";
      if (variation === 'C') promptStr = "Variation C: Narrate the story of what we did yesterday morning, starting from when you woke up.";
    } else if (capId === 'OL2d') {
      if (variation === 'A') promptStr = "Variation A: Invent a short story about a magical tree. Make sure it has characters, a problem, and a solution.";
      if (variation === 'B') promptStr = "Variation B: Tell me a fictional story about an animal that gets lost in the city. Use a clear beginning, middle, and end.";
      if (variation === 'C') promptStr = "Variation C: Make up a story about a brave knight or warrior. Include at least three events in the story.";
    } else if (capId === 'OL2e') {
      if (variation === 'A') promptStr = "Variation A: Use the word 'exhausted' in a sentence to describe how you feel after running a lot.";
      if (variation === 'B') promptStr = "Variation B: We learned the word 'courageous'. Tell me a short story about someone being courageous.";
      if (variation === 'C') promptStr = "Variation C: Describe your favorite meal without using the words 'good', 'yummy', or 'nice'. Use more specific words instead.";
    } else if (capId === 'OL2f') {
      if (variation === 'A') promptStr = "Variation A: Listen to this paragraph. Without asking me to repeat it, answer these two questions about the details.";
      if (variation === 'B') promptStr = "Variation B: I will give you directions to an imaginary place. Listen carefully, and then tell me how to get there.";
      if (variation === 'C') promptStr = "Variation C: Listen to this short dialogue between two people. Tell me what they decided to do at the end.";
    } else if (capId === 'OL2g') {
      if (variation === 'A') promptStr = "Variation A: Stand up and clearly explain to the family how to make a sandwich. Speak loudly enough for everyone to hear.";
      if (variation === 'B') promptStr = "Variation B: Recite a short poem from memory to an 'audience' (stuffed animals or family members). Use expressive intonation.";
      if (variation === 'C') promptStr = "Variation C: Introduce yourself to an imaginary crowd, stating your name, age, and favorite hobby clearly and with eye contact.";
    } else if (capId === 'OL2h') {
      if (variation === 'A') promptStr = "Variation A: Explain why it is important to brush your teeth. Use the word 'because' in your explanation.";
      if (variation === 'B') promptStr = "Variation B: Tell me why you think it might rain today (or not rain). Give me two reasons.";
      if (variation === 'C') promptStr = "Variation C: Choose a rule we have in our house and explain the reasoning behind why we have that rule.";
    }
  } else if (level === 3) { // Discern
    taskTypeStr = "Verbal Error Detection";
    reasonStr = "Why is that wrong? How would you fix it?";
    if (capId === 'OL2a') {
      if (variation === 'A') promptStr = "Variation A: I was supposed to: 1) get a cup, 2) pour water, 3) drink. I poured water first. What did I do wrong?";
      if (variation === 'B') promptStr = "Variation B: Give me 3 instructions. I am going to do them in the wrong order. You must catch my mistake.";
      if (variation === 'C') promptStr = "Variation C: I need to put on my shoes and socks. I say, 'First I put on my shoes, then my socks.' Is that correct? Why not?";
    } else if (capId === 'OL2b') {
      if (variation === 'A') promptStr = "Variation A: We just read 'Goldilocks'. If I retell it and say she met three pigs, what error did I make in my retelling?";
      if (variation === 'B') promptStr = "Variation B: I will retell a story but I will skip the ending completely. Tell me what part I missed.";
      if (variation === 'C') promptStr = "Variation C: Listen to my retelling. I am going to tell the end of the story before the beginning. Tell me why this is confusing.";
    } else if (capId === 'OL2c') {
      if (variation === 'A') promptStr = "Variation A: I am telling a story about my trip to the store, but suddenly I start talking about space aliens. Does this belong in a personal narrative?";
      if (variation === 'B') promptStr = "Variation B: Listen to my story: 'I went to the park. It was fun. The end.' How could I make this personal narrative better and more detailed?";
      if (variation === 'C') promptStr = "Variation C: I'm telling a story about yesterday, but I say 'I will go to the market tomorrow.' What is wrong with my timeline?";
    } else if (capId === 'OL2d') {
      if (variation === 'A') promptStr = "Variation A: I am telling a fictional story about a brave knight, but the story has no problem or challenge. What is missing?";
      if (variation === 'B') promptStr = "Variation B: I tell a story where a cat is in a tree, and then the story just stops. How would you fix this incomplete story?";
      if (variation === 'C') promptStr = "Variation C: Listen to this story intro: 'Once upon a time...' and then I just list facts about real dogs. Is that a fictional story?";
    } else if (capId === 'OL2e') {
      if (variation === 'A') promptStr = "Variation A: I will use the word 'gigantic' incorrectly: 'The ant was gigantic.' Why is that funny/wrong?";
      if (variation === 'B') promptStr = "Variation B: I want to say I am very hungry. I say 'I am starving'. Is that a good word choice? What if I said 'I am sleepy' instead?";
      if (variation === 'C') promptStr = "Variation C: Listen to this sentence: 'The hot ice cream was melting.' What word doesn't make sense?";
    } else if (capId === 'OL2f') {
      if (variation === 'A') promptStr = "Variation A: I am going to tell you a short fact. Then I will pretend I didn't hear it. Tell me why active listening is important.";
      if (variation === 'B') promptStr = "Variation B: While you tell me a story, I am going to look away and play with a toy. Am I being an active listener? What should I do instead?";
      if (variation === 'C') promptStr = "Variation C: Listen to these directions. If I ask you to repeat them but I was mumbling, whose fault is it that communication failed?";
    } else if (capId === 'OL2g') {
      if (variation === 'A') promptStr = "Variation A: I am going to present a topic to you, but I will whisper and look at the floor. Give me feedback on my presentation skills.";
      if (variation === 'B') promptStr = "Variation B: I will speak very, very fast so you can barely understand me. Tell me how I should change my speaking pace.";
      if (variation === 'C') promptStr = "Variation C: I will stand in front of you and fidget wildly while talking. Why is this distracting for an audience?";
    } else if (capId === 'OL2h') {
      if (variation === 'A') promptStr = "Variation A: I say 'I like ice cream because it is a car.' Does my reasoning make sense? Fix it.";
      if (variation === 'B') promptStr = "Variation B: Someone asks why I am wearing a coat, and I say 'Because.' Is that a complete explanation? Give a better one.";
      if (variation === 'C') promptStr = "Variation C: I claim that the sky is green. When asked why, I say 'because I said so.' Is that good reasoning? Explain.";
    }
  } else if (level === 4) { // Own
    taskTypeStr = "Creative Verbal Production";
    reasonStr = "Explain the choices you made.";
    if (capId === 'OL2a') {
      if (variation === 'A') promptStr = "Variation A: Give me 4 sequential instructions to draw a simple house on a piece of paper. Make sure they are clear.";
      if (variation === 'B') promptStr = "Variation B: Invent a new handshake with 4 steps. Teach it to me using clear verbal directions.";
      if (variation === 'C') promptStr = "Variation C: Create a short obstacle course in the room. Give me multi-step directions on how to navigate it.";
    } else if (capId === 'OL2b') {
      if (variation === 'A') promptStr = "Variation A: Retell a story we read a long time ago from memory. Focus on providing rich details.";
      if (variation === 'B') promptStr = "Variation B: Retell a story from the perspective of a different character (e.g., tell Goldilocks from the bear's point of view).";
      if (variation === 'C') promptStr = "Variation C: Listen to a new, complex story. Summarize and retell only the most important parts clearly.";
    } else if (capId === 'OL2c') {
      if (variation === 'A') promptStr = "Variation A: Plan and tell a detailed personal narrative about a holiday or special event. Use descriptive language.";
      if (variation === 'B') promptStr = "Variation B: Tell a story about a time you made a mistake and what you learned from it. Speak clearly and sequence it well.";
      if (variation === 'C') promptStr = "Variation C: Narrate a typical day in your life, but make it sound as exciting as possible using great vocabulary.";
    } else if (capId === 'OL2d') {
      if (variation === 'A') promptStr = "Variation A: Make up a completely original fairy tale. Introduce a hero, a villain, and a magical item.";
      if (variation === 'B') promptStr = "Variation B: Tell a fictional story that explains why something is the way it is (e.g., 'Why the leopard has spots').";
      if (variation === 'C') promptStr = "Variation C: Create an oral story combining three random things: a key, a mountain, and a talking bird.";
    } else if (capId === 'OL2e') {
      if (variation === 'A') promptStr = "Variation A: Choose 3 difficult words you learned recently. Tell me a short, coherent story that uses all 3 words correctly.";
      if (variation === 'B') promptStr = "Variation B: I will give you a boring word like 'good'. Give me 3 better, more descriptive words that mean the same thing, and use one in a sentence.";
      if (variation === 'C') promptStr = "Variation C: Invent a completely new machine. Describe what it does using precise, complex vocabulary.";
    } else if (capId === 'OL2f') {
      if (variation === 'A') promptStr = "Variation A: Have a 2-minute conversation with me. You must wait for me to finish, summarize what I said, and then reply.";
      if (variation === 'B') promptStr = "Variation B: I am going to talk about a topic for 1 minute. Take notes (mental or physical), and then tell me my 3 main points.";
      if (variation === 'C') promptStr = "Variation C: Listen to a short audio clip (podcast/story). Formulate and ask two thoughtful questions about what you heard.";
    } else if (capId === 'OL2g') {
      if (variation === 'A') promptStr = "Variation A: Prepare a 1-minute 'speech' about your favorite animal. Deliver it standing up, with a loud voice and good posture.";
      if (variation === 'B') promptStr = "Variation B: Do a 'show and tell' presentation for the family. Explain what the object is, where you got it, and why it's special.";
      if (variation === 'C') promptStr = "Variation C: Pretend you are a news reporter. Give a 30-second news report on what happened in our house today.";
    } else if (capId === 'OL2h') {
      if (variation === 'A') promptStr = "Variation A: Argue for why you should be allowed to stay up 15 minutes later tonight. Provide clear, logical reasoning.";
      if (variation === 'B') promptStr = "Variation B: Explain to a younger child why they shouldn't touch a hot stove, using clear cause-and-effect reasoning.";
      if (variation === 'C') promptStr = "Variation C: If you could change one rule in the house, what would it be? Defend your choice with solid reasons.";
    }
  }

  return { promptStr, successStr, failureStr, reasonStr, taskTypeStr, materialsArr };
}


function createTemplate(cap, levelObj, variationId, isMilestone = false) {
  const generated = generatePrompts(cap.id, levelObj.level, variationId, isMilestone);

  return {
    capacity_id: cap.id,
    strand: 5,
    band: 2,
    cognitive_level: levelObj.level,
    variation_id: variationId,
    task_type: generated.taskTypeStr,
    materials: generated.materialsArr,
    parent_prompt: generated.promptStr,
    success_condition: generated.successStr,
    failure_condition: generated.failureStr,
    reasoning_check: generated.reasonStr,
    context_variants: contextVariants,
    repetition_arc: {
      execution_count: isMilestone ? 1 : 3,
      endurance: isMilestone ? "none" : "noise_injection",
      milestone: "M"
    }
  };
}

let markdownContent = `# Band 2 English Templates — Strand 5: Oral Language & Listening

*Note: Strand 5 focuses on Oral Language and Listening. By default, these tasks do not require written output unless a bypass or specific contextual application demands it. Tasks are heavily focused on auditory input and verbal/physical output. Writing-specific constraints (parent_rubric, grammar_integration, oral_component: true) are omitted in accordance with Strand 5 rules.*

`;

capacities.forEach(cap => {
  markdownContent += `## ${cap.id}: ${cap.name}\n\n`;
  levels.forEach(levelObj => {
    let header = "";
    if (levelObj.level === 1) header = "### Encounter Level (Multisensory)";
    else if (levelObj.level === 2) header = "### Execute Level (Verbal)";
    else if (levelObj.level === 3) header = "### Discern Level (Error Detection)";
    else if (levelObj.level === 4) header = "### Own Level (Production)";
    markdownContent += `${header}\n\n`;

    ['A', 'B', 'C'].forEach(variation => {
      let tpl = createTemplate(cap, levelObj, variation);
      markdownContent += `**${cap.id}-${levelObj.level}${variation}: ${header.split(' ')[1]} Variation ${variation}**\n\`\`\`json\n${JSON.stringify(tpl, null, 2)}\n\`\`\`\n\n`;
    });
  });

  let milestoneObj = { level: 4, type: "Milestone Verbal Production" };
  let milestoneTpl = createTemplate(cap, milestoneObj, 'M', true);
  markdownContent += `### Milestone Task\n\n**${cap.id}-M: Milestone Production**\n\`\`\`json\n${JSON.stringify(milestoneTpl, null, 2)}\n\`\`\`\n\n`;
});

const outputPath = path.join(__dirname, 'docs', 'curriculum', 'english', 'band_2_templates_strand_5.md');
fs.writeFileSync(outputPath, markdownContent);
console.log(`Generated Strand 5 templates at ${outputPath}`);
