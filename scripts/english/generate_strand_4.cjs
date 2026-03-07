const fs = require('fs');
const path = require('path');

const capacities = [
  {
    id: 'CW2a',
    title: 'Sentence Writing',
    description: 'Writes complete, grammatically correct sentences independently',
    encounterMaterials: ['Picture cards', 'Paper', 'Pencil'],
    encounterA: "Show the picture of a boy running. Tell me a complete sentence about what you see.",
    encounterB: "Listen to this: 'The big dog.' Is that a complete sentence? What is missing?",
    encounterC: "Look at these word cards. Arrange them to make a complete sentence.",
    reasoningA: "How do you know that is a complete sentence?",
    reasoningB: "What does a sentence need to be complete?",
    reasoningC: "Read your sentence. Does it make sense on its own?",
    executeA: "Look at the picture of the market. Say a complete sentence about it. Now write it.",
    executeB: "Tell me a complete sentence about your favorite animal. Now write it down.",
    executeC: "Say a complete sentence about what you did today. Then, write it.",
    discernA: "Read this: 'ran fast to the park.' What is wrong? Fix it.",
    discernB: "Look at this sentence: 'The cat sleeps on the mat' What is missing at the end?",
    discernC: "Read this: 'the sun is hot.' What is wrong at the beginning?",
    discernReasoning: "Why did you make that change?",
    ownA: "Write two complete sentences about a friend. Tell them to me first.",
    ownB: "Write three complete sentences about a place you like. Tell me first.",
    ownC: "Write a complete sentence that asks a question, and another that answers it. Tell me first.",
    ownReasoning: "Show me the capital letter and full stop in your sentences.",
    milestonePrompt: "Write a short note to your friend telling them what you played today.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2b',
    title: 'Paragraph Writing — Guided',
    description: '3-5 sentences on one topic, with a topic sentence',
    encounterMaterials: ['Sentence strips', 'Paper', 'Pencil'],
    encounterA: "Here are 4 sentences. Three are about a dog, one is about a car. Which one doesn't belong?",
    encounterB: "Listen to this paragraph. Does every sentence talk about the same main idea?",
    encounterC: "Sort these sentence strips into two groups: one about eating, one about playing.",
    reasoningA: "Why did you remove the sentence about the car?",
    reasoningB: "What was the main idea of that paragraph?",
    reasoningC: "How do you know those sentences go together?",
    executeA: "Tell me 3 sentences about a monkey. Make sure they are all about the monkey. Now write them.",
    executeB: "Say 3 sentences describing your house. Write them down in order.",
    executeC: "Tell me a short paragraph (3-4 sentences) about what you eat for lunch. Write it.",
    discernA: "Read this paragraph. Which sentence does not belong to the topic?",
    discernB: "Read these sentences. Are they in an order that makes sense?",
    discernC: "This paragraph has a beginning and an end, but no middle. What is missing?",
    discernReasoning: "Explain why you fixed it that way.",
    ownA: "Write a 4-sentence paragraph about a fun day. Tell me the sentences first.",
    ownB: "Write a paragraph describing your favorite toy. Make sure all sentences stick to the topic. Tell me first.",
    ownC: "Write a paragraph explaining how to wash your hands. Tell me first.",
    ownReasoning: "How do you know all your sentences are about the same topic?",
    milestonePrompt: "Write a short description of your favorite place to show to a family member.",
    grammarRef: "GM2e"
  },
  {
    id: 'CW2c',
    title: 'Topic Sentences',
    description: 'The first sentence tells the reader what the paragraph is about',
    encounterMaterials: ['Paragraph cards', 'Paper', 'Pencil'],
    encounterA: "Read this paragraph. Which sentence tells you what the WHOLE paragraph is about?",
    encounterB: "Listen to this paragraph. I left out the first sentence. What do you think it should be?",
    encounterC: "Here are 3 sentences. Which one would make the best starting sentence for a paragraph about lions?",
    reasoningA: "How does that sentence prepare you for the rest of the paragraph?",
    reasoningB: "Why does the paragraph need a strong start?",
    reasoningC: "What makes that a good topic sentence?",
    executeA: "We are writing a paragraph about rain. Tell me a good topic sentence. Now write it.",
    executeB: "Say a topic sentence for a paragraph about playing a game. Write it down.",
    executeC: "Tell me a sentence that introduces the topic of 'school'. Write it.",
    discernA: "Read this paragraph. Is the first sentence a good topic sentence, or just a detail?",
    discernB: "Here are two topic sentences for a paragraph about baking. Which one is better?",
    discernC: "The topic sentence says 'I like dogs', but the paragraph is about cats. Fix the topic sentence.",
    discernReasoning: "Explain why your topic sentence is better.",
    ownA: "Write a topic sentence for a paragraph about a holiday, then write two more sentences. Tell me first.",
    ownB: "Choose a topic you like. Write a topic sentence for it. Tell me first.",
    ownC: "Write a topic sentence that makes someone want to read more about spiders. Tell me first.",
    ownReasoning: "Does your topic sentence tell the reader what to expect?",
    milestonePrompt: "Write a short introduction for a poster about your favorite animal.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2d',
    title: 'Sequenced Narrative',
    description: 'Beginning, middle, end — 3 paragraphs',
    encounterMaterials: ['Story picture cards', 'Paper', 'Pencil'],
    encounterA: "Here are 3 pictures from a story. Put them in order: beginning, middle, and end.",
    encounterB: "Listen to this story. Tell me what happened first, next, and last.",
    encounterC: "I will tell you the beginning and end of a story. You tell me what happens in the middle.",
    reasoningA: "Why did you put the pictures in that order?",
    reasoningB: "How do you know what part was the middle?",
    reasoningC: "Does your middle connect the beginning to the end?",
    executeA: "Tell me a short story with a clear beginning, middle, and end. Now write it in 3 parts.",
    executeB: "Say a story about finding a lost toy. What happened first, next, last? Write it down.",
    executeC: "Tell me a story about a rainy day. Make sure it has 3 parts. Write it.",
    discernA: "Read this story. The middle is at the end! Fix the order.",
    discernB: "This story has a beginning and middle, but stops suddenly. What is wrong?",
    discernC: "Read this story. Does the beginning make sense with the end?",
    discernReasoning: "Why is the order of events important in a story?",
    ownA: "Write a 3-part story about an adventure. Tell me the sequence first.",
    ownB: "Write a story about a brave animal. Use a paragraph for the beginning, middle, and end. Tell me first.",
    ownC: "Make up a story with a problem and a solution. Write it in 3 parts. Tell me first.",
    ownReasoning: "Show me where your story transitions from the beginning to the middle.",
    milestonePrompt: "Write a story to entertain your younger sibling.",
    grammarRef: "GM2g"
  },
  {
    id: 'CW2e',
    title: 'Descriptive Writing',
    description: 'Uses adjectives and sensory details',
    encounterMaterials: ['Objects with different textures/smells', 'Paper', 'Pencil'],
    encounterA: "Touch this object with your eyes closed. Tell me 3 words that describe how it feels.",
    encounterB: "Look at this picture of a forest. Tell me what you might hear and smell if you were there.",
    encounterC: "Listen to this sentence: 'The boy ate the apple.' Let's add describing words. 'The ___ boy ate the ___ apple.'",
    reasoningA: "How do those words help someone imagine the object?",
    reasoningB: "Why do we use words about smell and sound?",
    reasoningC: "How did the describing words change the picture in your mind?",
    executeA: "Tell me a sentence describing a scary monster using 3 describing words. Now write it.",
    executeB: "Say two sentences describing your favorite food, including how it tastes and looks. Write them.",
    executeC: "Describe a cold day using sensory details. Write it down.",
    discernA: "Read this description. Which words are describing words?",
    discernB: "This sentence is boring: 'The dog barked.' Add two describing words to make it better.",
    discernC: "Read this: 'The hot snow fell.' What is wrong with the describing word?",
    discernReasoning: "Why did you choose those describing words?",
    ownA: "Write a short paragraph describing a hidden treasure. Use at least 4 adjectives. Tell me first.",
    ownB: "Describe a busy street market so that I can see and hear it in my mind. Write it down. Tell me first.",
    ownC: "Write a description of a quiet place. Use words that make it feel calm. Tell me first.",
    ownReasoning: "Point to the sensory details you used in your writing.",
    milestonePrompt: "Write a description of a lost item so someone can help you find it.",
    grammarRef: "GM2d"
  },
  {
    id: 'CW2f',
    title: 'Personal Narrative',
    description: 'Writes about a real experience with detail',
    encounterMaterials: ['Photographs of the child/family', 'Paper', 'Pencil'],
    encounterA: "Look at this photo of you. Tell me the story of what happened that day.",
    encounterB: "Listen to my story about when I was little. Now tell me a story about something that happened to you.",
    encounterC: "Think of a time you were very happy. Tell me who was there and what you did.",
    reasoningA: "How do you remember what happened first?",
    reasoningB: "Why is it easier to tell a story that really happened to you?",
    reasoningC: "What details make your memory clear?",
    executeA: "Tell me a story about a time you got hurt. Include what happened and how you felt. Now write it.",
    executeB: "Say a story about a fun trip you took. Make sure it has a beginning, middle, and end. Write it.",
    executeC: "Tell me about a time you learned something new. Write the story down.",
    discernA: "Read this personal narrative. Did the writer include how they felt?",
    discernB: "This story jumps around. How can we put the events in the right order?",
    discernC: "The story says 'We went to the park. It was fun.' How can we add more detail?",
    discernReasoning: "Why is it important to include details in a personal story?",
    ownA: "Write a personal narrative about a surprising day. Tell me the story first.",
    ownB: "Write about a time you helped someone. Use details to describe what happened. Tell me first.",
    ownC: "Write a story about your first memory. Make it 3 paragraphs. Tell me first.",
    ownReasoning: "Did you include how you felt at the end of the story?",
    milestonePrompt: "Write a letter to a grandparent telling them about something exciting you did recently.",
    grammarRef: "GM2g"
  },
  {
    id: 'CW2g',
    title: 'Informational Writing — Simple',
    description: 'Writes 3-5 facts about a topic in order',
    encounterMaterials: ['Non-fiction books/pictures', 'Paper', 'Pencil'],
    encounterA: "Look at this picture of a lion. Tell me 3 true facts about lions.",
    encounterB: "Listen to this paragraph. Is it telling a made-up story or giving true facts?",
    encounterC: "Sort these statements into 'Facts about the Sun' and 'Made-up stories about the Sun'.",
    reasoningA: "How do you know those are facts?",
    reasoningB: "What is the difference between a fact and a story?",
    reasoningC: "Why do we read informational books?",
    executeA: "Tell me 3 facts about cows. Make sure they are true. Now write them.",
    executeB: "Say 3 facts about what plants need to grow. Write them down.",
    executeC: "Tell me 3 facts about your school. Write them.",
    discernA: "Read this paragraph about frogs. One sentence is a silly made-up story. Find it.",
    discernB: "These facts about the moon are out of order. How should we group them?",
    discernC: "This sentence says 'I think spiders are scary.' Is that a fact or an opinion?",
    discernReasoning: "Why shouldn't we put opinions in a list of facts?",
    ownA: "Choose an animal you know a lot about. Write a paragraph with 4 facts about it. Tell me first.",
    ownB: "Write an informational paragraph explaining how to make a sandwich. Tell me the steps first.",
    ownC: "Write 4 facts about your city or town. Group them into a paragraph. Tell me first.",
    ownReasoning: "How did you make sure your information was accurate?",
    milestonePrompt: "Write a short guide to teach someone how to play your favorite game.",
    grammarRef: "GM2b"
  },
  {
    id: 'CW2h1',
    title: 'Letter Formation — Print',
    description: 'Correct formation of all 26 uppercase and lowercase letters',
    encounterMaterials: ['Sand/salt tray or textured letters', 'Paper', 'Pencil'],
    encounterA: "Trace this letter 'a' in the sand with your finger. Feel how you go around, up, and down.",
    encounterB: "Watch me write the letter 'B'. Where did I start? Now you trace it in the air.",
    encounterC: "Here are some letters made of clay. Close your eyes and feel this one. What letter is it?",
    reasoningA: "Why do we start letters at the top?",
    reasoningB: "How does tracing help your hand learn?",
    reasoningC: "What shape is the letter 'o'?",
    executeA: "Write the uppercase and lowercase 'A' three times correctly on the lines.",
    executeB: "Write the letters 'b', 'd', 'p', and 'q'. Make sure the circles are on the correct side.",
    executeC: "Write the letters that have 'tails' hanging below the line (g, j, p, q, y).",
    discernA: "Look at these three 'a's. Which one is formed the best? Why?",
    discernB: "This 'd' looks like a 'b'. How can we fix it?",
    discernC: "The letter 'h' has a short stick here. Does it look like an 'n' by mistake?",
    discernReasoning: "Why is it important to form letters correctly?",
    ownA: "Write the whole alphabet in uppercase. Take your time.",
    ownB: "Write the whole alphabet in lowercase. Make sure tall letters touch the top line.",
    ownC: "Write your full name, making sure every letter is formed perfectly.",
    ownReasoning: "Show me your best letter and explain why it is good.",
    milestonePrompt: "Write a short, neat label for a box of your things.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2h2',
    title: 'Spacing & Sizing',
    description: 'Consistent letter size, word spacing, baseline alignment',
    encounterMaterials: ['Lined paper', 'Pencil', 'Finger spacer (optional)'],
    encounterA: "Look at this sentence. The words are squished together. Can you read it easily?",
    encounterB: "Look at this sentence. Some letters are flying above the line! Show me where they should sit.",
    encounterC: "Put your finger between these words to show the 'finger space'.",
    reasoningA: "Why do we need spaces between words?",
    reasoningB: "What happens if all the letters are different sizes?",
    reasoningC: "Why do we write on the baseline?",
    executeA: "Copy this sentence. Use a finger space between every word.",
    executeB: "Copy these words. Make sure the tall letters (t, l, h) are taller than the short letters (a, e, i).",
    executeC: "Write a sentence. Make sure every letter sits firmly on the bottom line.",
    discernA: "Look at this writing. Circle the places where words are too close together.",
    discernB: "Find the letters that are sinking below the line when they shouldn't.",
    discernC: "Which of these two sentences is easier to read? Why?",
    discernReasoning: "How does spacing make writing easier to understand?",
    ownA: "Write a 3-sentence story. Focus on perfect spacing between words.",
    ownB: "Write a list of your favorite foods. Keep all your lowercase letters exactly the same size.",
    ownC: "Write a paragraph. Make sure the margins are straight on the left side.",
    ownReasoning: "Check your work. Are all your spaces even?",
    milestonePrompt: "Write a neat sign for your bedroom door.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2h3',
    title: 'Handwriting Speed',
    description: 'Writes legibly at >=10 words per minute by end of Band 2',
    encounterMaterials: ['Timer', 'Paper', 'Pencil', 'Familiar text'],
    encounterA: "Watch me write a sentence slowly, then quickly. Is the quick one still neat?",
    encounterB: "Listen to this song. I will write words to the beat of the song.",
    encounterC: "Let's see how many times you can write your name neatly in 30 seconds.",
    reasoningA: "Why is it important to write quickly AND neatly?",
    reasoningB: "What happens to your letters if you rush too much?",
    reasoningC: "How does holding the pencil correctly help you write faster?",
    executeA: "Copy this short poem as quickly as you can while keeping it neat. I will time you for 1 minute.",
    executeB: "I will say 10 simple words. Write them down as fast as you can neatly.",
    executeC: "Write the alphabet from A to Z as quickly as possible. Ensure it is legible.",
    discernA: "Look at this fast writing. Which letters became messy because of rushing?",
    discernB: "Compare your fast writing to your slow writing. What is the difference?",
    discernC: "If you want to speed up, which letter shapes slow you down the most?",
    discernReasoning: "How can you keep your writing neat when you write faster?",
    ownA: "Write a full paragraph about a sport. Focus on smooth, steady speed without stopping. (Target: 10 wpm)",
    ownB: "Write down everything you can remember about a movie in 3 minutes. Focus on steady writing.",
    ownC: "Write a letter to a friend as quickly and neatly as you can. Time yourself.",
    ownReasoning: "Did you keep a steady pace, or did you stop and start?",
    milestonePrompt: "Take quick notes while I read a short list of instructions.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2i',
    title: 'Revision — Guided',
    description: 'Re-reads own work, fixes errors with adult guidance',
    encounterMaterials: ['Sample draft with obvious errors', 'Colored pencil'],
    encounterA: "Read this sentence: 'the dog bark.' What two things are wrong? Let's fix them with a colored pencil.",
    encounterB: "Listen to me read this paragraph aloud. Raise your hand when something sounds wrong.",
    encounterC: "Look at this messy paper. What is the first thing we should check? (Capitals and full stops).",
    reasoningA: "Why do we check our work after we finish writing?",
    reasoningB: "How does reading aloud help us find mistakes?",
    reasoningC: "What does revision mean?",
    executeA: "Write a sentence. Now, use your colored pencil to check for a capital letter and a full stop.",
    executeB: "Write a short paragraph. Read it aloud to me and point out any missing words.",
    executeC: "Write two sentences. I will put a dot next to the line with a mistake. You find it and fix it.",
    discernA: "Here is a story. Find 3 spelling mistakes and fix them.",
    discernB: "Read this sentence aloud. Does it make sense? Add a word to fix it.",
    discernC: "This paragraph is boring. Let's revise it by adding two describing words.",
    discernReasoning: "Why is the revised version better than the first draft?",
    ownA: "Write a 3-sentence story. Then, independently revise it: check capitals, punctuation, and spelling. Show me the changes.",
    ownB: "Write a description. Revise it to add better adjectives. Show me your edits.",
    ownC: "Write a paragraph. Read it aloud to yourself, find two ways to improve it, and make the changes.",
    ownReasoning: "Explain what you changed during your revision and why.",
    milestonePrompt: "Write a thank-you note, check it for mistakes, and rewrite a clean final copy.",
    grammarRef: "GM2a"
  },
  {
    id: 'CW2j',
    title: 'Dictation',
    description: 'Parent reads aloud, child writes what they hear — tests phonics, spelling, grammar, listening simultaneously',
    encounterMaterials: ['Paper', 'Pencil'],
    encounterA: "Listen to this short sentence. Repeat it back to me. Now let's write it together.",
    encounterB: "I will say a sentence. You count how many words are in the sentence on your fingers.",
    encounterC: "Listen carefully. I will say a sentence. Which word is the longest?",
    reasoningA: "Why is it important to repeat the sentence before writing?",
    reasoningB: "How does counting words help you remember the sentence?",
    reasoningC: "Why do you have to hold the whole sentence in your mind?",
    executeA: "Listen: 'The big cat sat.' Repeat it. Now write it.",
    executeB: "Listen: 'I like to run and play.' Repeat it. Now write it.",
    executeC: "Listen: 'Did the dog see the bird?' Repeat it. Now write it with the correct punctuation.",
    discernA: "I said: 'The red bus stopped.' You wrote: 'The bus stop.' What did you miss?",
    discernB: "Look at your dictation. Did you remember the capital letter at the beginning?",
    discernC: "I said 'dogs' (more than one). Look at what you wrote. Is the 's' there?",
    discernReasoning: "Why is it tricky to listen and write at the same time?",
    ownA: "I will read a short, 2-sentence story. Listen to the whole thing. Then I will dictate it sentence by sentence. Write it perfectly.",
    ownB: "I will dictate a paragraph of 3 sentences. Write them down, remembering all punctuation and spelling.",
    ownC: "I will dictate a question and an answer. Write both correctly.",
    ownReasoning: "How did you check your spelling for the tricky words?",
    milestonePrompt: "Write down this phone message exactly as I say it.",
    grammarRef: "GM2a"
  }
];

const generateTemplates = (capacity) => {
  const templates = [];

  const addTemplate = (level, variation, taskType, materials, prompt, reasoning, repetition, isMilestone = false) => {
    let template = {
      capacity_id: capacity.id,
      strand: 4,
      band: 2,
      cognitive_level: level,
      variation_id: variation,
      task_type: taskType,
      materials: materials,
      parent_prompt: prompt,
      success_condition: "Child correctly identifies or produces the target writing structure.",
      failure_condition: "If incorrect, provide guidance and ask them to try again.",
      reasoning_check: reasoning,
      context_variants: {
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
      },
      repetition_arc: repetition
    };

    if (level >= 2 && !capacity.id.startsWith('CW2h')) {
      template.oral_component = true;
      template.parent_rubric = [
        { criterion: "Did the child say it out loud first? (If applicable)", type: "yes_no" },
        { criterion: "Is the required structural element present (e.g., topic sentence, details)?", type: "yes_no" },
        { criterion: "Are spelling and basic punctuation reasonably correct for Band 2?", type: "yes_no" }
      ];
      template.revision_trigger = "If any box is unchecked → child revises before advancing.";
      template.grammar_integration = {
        required_capacity: capacity.grammarRef,
        constraint: `Must apply grammar rules from ${capacity.grammarRef} correctly in writing.`
      };
    } else if (capacity.id.startsWith('CW2h')) {
        template.oral_component = false;
    }

    templates.push(template);
  };

  // Encounter
  addTemplate(1, 'A', 'Multisensory Encounter', capacity.encounterMaterials, `Variation A: ${capacity.encounterA}`, capacity.reasoningA, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(1, 'B', 'Multisensory Encounter', capacity.encounterMaterials, `Variation B: ${capacity.encounterB}`, capacity.reasoningB, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(1, 'C', 'Multisensory Encounter', capacity.encounterMaterials, `Variation C: ${capacity.encounterC}`, capacity.reasoningC, { execution_count: 3, endurance: "noise_injection", milestone: "M" });

  // Execute
  addTemplate(2, 'A', 'Oral->Written Production', ['Paper', 'Pencil'], `Variation A: ${capacity.executeA}`, "How did saying it first help you write it?", { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(2, 'B', 'Oral->Written Production', ['Paper', 'Pencil'], `Variation B: ${capacity.executeB}`, "Did you include all the necessary parts?", { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(2, 'C', 'Oral->Written Production', ['Paper', 'Pencil'], `Variation C: ${capacity.executeC}`, "Read back what you wrote.", { execution_count: 3, endurance: "noise_injection", milestone: "M" });

  // Discern
  addTemplate(3, 'A', 'Error Detection', ['Paper', 'Pencil'], `Variation A: ${capacity.discernA}`, capacity.discernReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(3, 'B', 'Error Detection', ['Paper', 'Pencil'], `Variation B: ${capacity.discernB}`, capacity.discernReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(3, 'C', 'Error Detection', ['Paper', 'Pencil'], `Variation C: ${capacity.discernC}`, capacity.discernReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });

  // Own
  addTemplate(4, 'A', 'Creative Production', ['Paper', 'Pencil'], `Variation A: ${capacity.ownA}`, capacity.ownReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(4, 'B', 'Creative Production', ['Paper', 'Pencil'], `Variation B: ${capacity.ownB}`, capacity.ownReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });
  addTemplate(4, 'C', 'Creative Production', ['Paper', 'Pencil'], `Variation C: ${capacity.ownC}`, capacity.ownReasoning, { execution_count: 3, endurance: "noise_injection", milestone: "M" });

  // Milestone
  addTemplate(4, 'M', 'Milestone Production', ['Paper', 'Pencil'], `Real-world task for ${capacity.id}: ${capacity.milestonePrompt}`, "Explain the choices you made in your writing.", { execution_count: 1, endurance: "none", milestone: "M" }, true);

  return templates;
};

let output = `# Band 2 English Templates — Strand 4: Composition & Writing\n\n`;

capacities.forEach(cap => {
  output += `## ${cap.id}: ${cap.title}\n\n`;
  const templates = generateTemplates(cap);

  output += `### Encounter Level (Multisensory)\n\n`;
  templates.slice(0, 3).forEach(t => {
    output += `**${t.capacity_id}-1${t.variation_id}: Encounter Variation ${t.variation_id}**\n\`\`\`json\n${JSON.stringify(t, null, 2)}\n\`\`\`\n\n`;
  });

  output += `### Execute Level (Say It, Then Write It)\n\n`;
  templates.slice(3, 6).forEach(t => {
    output += `**${t.capacity_id}-2${t.variation_id}: Execute Variation ${t.variation_id}**\n\`\`\`json\n${JSON.stringify(t, null, 2)}\n\`\`\`\n\n`;
  });

  output += `### Discern Level (Error Detection)\n\n`;
  templates.slice(6, 9).forEach(t => {
    output += `**${t.capacity_id}-3${t.variation_id}: Discern Variation ${t.variation_id}**\n\`\`\`json\n${JSON.stringify(t, null, 2)}\n\`\`\`\n\n`;
  });

  output += `### Own Level (Production)\n\n`;
  templates.slice(9, 12).forEach(t => {
    output += `**${t.capacity_id}-4${t.variation_id}: Own Variation ${t.variation_id}**\n\`\`\`json\n${JSON.stringify(t, null, 2)}\n\`\`\`\n\n`;
  });

  output += `### Milestone Task\n\n`;
  const m = templates[12];
  output += `**${m.capacity_id}-M: Milestone Production**\n\`\`\`json\n${JSON.stringify(m, null, 2)}\n\`\`\`\n\n`;
});

fs.writeFileSync(path.join(__dirname, '../../docs/curriculum/english/band_2_templates_strand_4.md'), output);
console.log('Strand 4 templates generated successfully.');
