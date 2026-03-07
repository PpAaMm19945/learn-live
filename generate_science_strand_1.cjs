const fs = require('fs');
const path = require('path');

const capacities = [
  { id: 'SE2a', name: 'Sensory Observation', risk: 'Risk_Level_A', materials: ['Ugandan fruit (e.g., jackfruit)', 'leaves', 'stone'], alternatives: ['any local fruit', 'grass', 'wood'], safety: 'Safe for independent work. Do not eat unknown plants.' },
  { id: 'SE2b', name: 'Asking Testable Questions', risk: 'Risk_Level_A', materials: ['2 different balls', 'ramp (book/board)'], alternatives: ['rolled socks', 'cardboard'], safety: 'Safe for independent work.' },
  { id: 'SE2c', name: 'Making Predictions (Hypothesis)', risk: 'Risk_Level_A', materials: ['cup of water', 'small objects (stone, leaf, coin)'], alternatives: ['basin of water', 'twigs', 'bottle caps'], safety: 'Safe for independent work.' },
  { id: 'SE2d', name: 'Recording Data', risk: 'Risk_Level_A', materials: ['paper', 'pencil', 'leaves of different sizes'], alternatives: ['chalkboard', 'stones of different sizes'], safety: 'Safe for independent work.' },
  { id: 'SE2e', name: 'Measurement & Quantification', risk: 'Risk_Level_A', materials: ['string', 'stick', 'cup'], alternatives: ['hand spans', 'local bowls'], safety: 'Safe for independent work.' },
  { id: 'SE2f', name: 'Control Variables (Fair Test)', risk: 'Risk_Level_A', materials: ['2 identical plants or 2 cups of water', 'sunlight/shade'], alternatives: ['2 seeds', 'wet/dry paper'], safety: 'Safe for independent work.' },
  { id: 'SE2g', name: 'Building Simple Models', risk: 'Risk_Level_A', materials: ['clay or mud', 'sticks', 'stones'], alternatives: ['recycled paper', 'wire'], safety: 'Wash hands after handling mud/clay.' },

  { id: 'LS2a', name: 'Living vs. Non-Living', risk: 'Risk_Level_A', materials: ['live insect or pet', 'rock', 'plant'], alternatives: ['bird outside', 'stick', 'shoe'], safety: 'Do not touch biting insects. Safe for observation.' },
  { id: 'LS2b', name: 'Plant Parts & Functions', risk: 'Risk_Level_B', materials: ['weed with roots', 'water'], alternatives: ['potted plant', 'vegetable scrap with roots'], safety: 'Wash hands after pulling weeds.' },
  { id: 'LS2c', name: 'Plant Life Cycles', risk: 'Risk_Level_B', materials: ['bean seeds', 'soil', 'small pot or cup'], alternatives: ['maize seeds', 'hollow gourd', 'garden patch'], safety: 'Wash hands after handling soil.' },
  { id: 'LS2d', name: 'Basic Animal Classification', risk: 'Risk_Level_A', materials: ['pictures of animals', 'local bones (if available, e.g. chicken bone)'], alternatives: ['drawings of animals', 'observation of insects/birds'], safety: 'Safe for independent work. Wash hands if handling clean bones.' },
  { id: 'LS2e', name: 'Animal Needs', risk: 'Risk_Level_A', materials: ['local pet (dog/chicken/goat) or observation of wild birds', 'water bowl'], alternatives: ['insects in garden', 'drawings'], safety: 'Do not disturb wild animals.' },
  { id: 'LS2f', name: 'Animal Adaptations', risk: 'Risk_Level_A', materials: ['tongs or clothes pegs (beak model)', 'seeds', 'cup'], alternatives: ['chopsticks', 'two sticks', 'small stones'], safety: 'Safe for independent work.' },
  { id: 'LS2g', name: 'Local Habitats', risk: 'Risk_Level_B', materials: ['access to garden or local wetland/savanna area', 'notebook'], alternatives: ['observation from window', 'local park'], safety: 'Adult supervision required near wetlands or tall grass.' },
  { id: 'LS2h', name: 'Simple Food Chains & Webs', risk: 'Risk_Level_A', materials: ['paper', 'string', 'cards with local animals (grass, grasshopper, lizard, hawk)'], alternatives: ['chalk on ground', 'sticks'], safety: 'Safe for independent work.' },
  { id: 'LS2i', name: 'Human Senses', risk: 'Risk_Level_A', materials: ['blindfold', 'different smelling foods (ginger, lemon, garlic)', 'bell'], alternatives: ['closing eyes', 'local herbs', 'clapping hands'], safety: 'Check for food allergies before smelling/tasting.' },
  { id: 'LS2j', name: 'Human Body — Movement', risk: 'Risk_Level_A', materials: ['own body', 'heavy object (book/rock)'], alternatives: ['water jug'], safety: 'Do not lift overly heavy objects. Safe for independent work.' },
  { id: 'LS2k', name: 'Human Body — Internal', risk: 'Risk_Level_A', materials: ['cardboard tube', 'timer'], alternatives: ['rolled paper', 'counting aloud'], safety: 'Safe for independent work.' },
  { id: 'LS2l', name: 'Basic Nutrition & Hygiene', risk: 'Risk_Level_A', materials: ['soap', 'water', 'glitter or dirt'], alternatives: ['ash', 'mud'], safety: 'Avoid getting soap in eyes.' }
];

const contextVariants = {
  default: { names: ["Alex", "Sam", "Pat"], settings: ["park", "school", "store"], food: ["apples", "bread", "milk"] },
  ug: { names: ["Amara", "Tendo", "Azie"], settings: ["Kampala market", "village", "garden", "savanna", "wetland"], food: ["matooke", "mangoes", "chapati", "jackfruit"] }
};

function generateTemplate(cap, level, variation, isMilestone) {
  let taskType = "Physical Observation";
  let promptStr = "";
  let successStr = "Child successfully completes the observation or explanation.";
  let failureStr = "Child needs guidance. Parent asks guiding questions.";
  let reasonStr = "Why did you observe that?";
  let worldviewStr = "";
  let observablePhenomenon = "";
  let modelType = "";
  let rubric = [];

  // Rules based on level
  if (level === 1) {
    taskType = "Encounter (Observation)";
    observablePhenomenon = `Direct physical observation of ${cap.name.toLowerCase()}`;
    reasonStr = "What do you see, hear, or feel?";
    if (variation === 'A') promptStr = `Variation A: Parent guides child to directly observe ${cap.name} using ${cap.materials[0]}. "Look closely at this. What do you notice?"`;
    else if (variation === 'B') promptStr = `Variation B: Parent sets up a sensory experience with ${cap.materials.join(', ')}. "Feel and listen to this. What is happening?"`;
    else promptStr = `Variation C: Take the child to the ${contextVariants.ug.settings[2]}. "Point out an example of ${cap.name} and describe it to me."`;
  } else if (level === 2) {
    taskType = "Execute (Experiment/Sorting)";
    reasonStr = "How did you record your data?";
    rubric = [
      { criterion: "Did the child safely handle materials?", type: "yes_no" },
      { criterion: "Did the child record their observations accurately?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Use the ${cap.materials[0]} to test ${cap.name}. Sort the results into two piles."`;
    else if (variation === 'B') promptStr = `Variation B: "Conduct a simple test on ${cap.name} using ${cap.alternatives[0]}. Draw what happened."`;
    else {
      promptStr = `Variation C: "Measure or count the outcomes of our ${cap.name} experiment. Create a simple tally chart."`;
    }
  } else if (level === 3) {
    taskType = "Discern (Anomaly Detection)";
    reasonStr = "What was the mechanical error?";
    worldviewStr = `Mechanism: Understanding how ${cap.name} works physically. Stewardship: We must know the true mechanism to care for it properly, not just guess.`;
    if (variation === 'A') promptStr = `Variation A: "Tendo tried to do an experiment on ${cap.name} but did it backwards. Why did it fail?"`;
    else if (variation === 'B') promptStr = `Variation B: "Amara claims that ${cap.name} works because of magic. Explain the real physical mechanism to her."`;
    else promptStr = `Variation C: "Look at this flawed setup for ${cap.name}. Spot the error and explain how to fix it."`;
  } else if (level === 4) {
    taskType = "Own (Model Building & Stewardship)";
    modelType = ["Physical", "Predictive", "System", "Diagrammatic"][Math.floor(Math.random() * 4)];
    reasonStr = "Explain your model and stewardship choice.";
    worldviewStr = `Mechanism: Accurate application of ${cap.name}. Stewardship: Using this knowledge to improve or protect our local environment/home.`;
    rubric = [
      { criterion: "Did the child build a functional model or clear prediction?", type: "yes_no" },
      { criterion: "Did the child explain the mechanism before the stewardship meaning?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Design a solution for our home using what you know about ${cap.name}. Build a model using ${cap.materials.join(', ')}."`;
    else if (variation === 'B') promptStr = `Variation B: "Predict what will happen if we change a major part of the ${cap.name} system. Draw your prediction and explain it to me."`;
    else promptStr = `Variation C: "We need to make a stewardship decision regarding ${cap.name}. Propose a plan and explain the physical mechanics behind why your plan will work."`;
  }

  if (isMilestone) {
    taskType = "Milestone (Real-World Application)";
    modelType = level === 4 ? "System" : undefined;
    promptStr = `Milestone: Present the child with an unlabeled real-world problem involving ${cap.name}. "We have a problem in the garden/house. Show me how to solve it."`;
    worldviewStr = `Mechanism: Real-world mechanics of ${cap.name}. Stewardship: Applying knowledge to serve the family.`;
  }

  let template = {
    capacity_id: cap.id,
    strand: 1, // Will map SE to 1 for this file, or we can use "SE" if we want, but schema says strand 1-3. We'll use 1.
    band: 2,
    cognitive_level: level,
    variation_id: variation,
    task_type: taskType,
    risk_level: cap.risk,
    safety_warning: cap.safety,
    scientific_materials: cap.materials,
    acceptable_alternatives: cap.alternatives,
    parent_prompt: promptStr,
    success_condition: successStr,
    failure_condition: failureStr,
    reasoning_check: reasonStr,
    context_variants: contextVariants,
    repetition_arc: {
      execution_count: isMilestone ? 1 : 3,
      endurance: isMilestone ? "none" : "noise_injection",
      milestone: "M"
    }
  };

  if (level === 2 && variation === 'C') {
    template.math_integration = {
      math_node: "P2a",
      bypass_instructions: "If child is below math band required for data/tally charts, parent should draw the chart and have the child only perform physical counting."
    };
  }

  if (level === 1) template.observable_phenomenon = observablePhenomenon;
  if (level === 4 || (isMilestone && level === 4)) template.model_type = modelType || "Physical";
  if (level === 2 || level === 4) template.parent_rubric = rubric;
  if (level === 3 || level === 4) template.worldview_connection = worldviewStr;

  return template;
}

let markdownContent = `# Band 2 Science Templates — Strand 1: Life Sciences & Scientific Inquiry

*Note: This file contains both the Scientific Inquiry (SE) cross-cutting progression capacities and the Strand 1 Life Sciences (LS) capacities.*

`;

capacities.forEach(cap => {
  markdownContent += `## ${cap.id}: ${cap.name}\n\n`;
  [1, 2, 3, 4].forEach(level => {
    let header = "";
    if (level === 1) header = "### Encounter Level (Physical Observation)";
    else if (level === 2) header = "### Execute Level (Experiment)";
    else if (level === 3) header = "### Discern Level (Anomaly Detection)";
    else if (level === 4) header = "### Own Level (Model Building & Stewardship)";
    markdownContent += `${header}\n\n`;

    ['A', 'B', 'C'].forEach(variation => {
      let tpl = generateTemplate(cap, level, variation, false);
      markdownContent += `**${cap.id}-${level}${variation}: ${header.split(' ')[1]} Variation ${variation}**\n\`\`\`json\n${JSON.stringify(tpl, null, 2)}\n\`\`\`\n\n`;
    });
  });

  let milestoneTpl = generateTemplate(cap, 4, 'M', true);
  markdownContent += `### Milestone Task\n\n**${cap.id}-M: Milestone Production**\n\`\`\`json\n${JSON.stringify(milestoneTpl, null, 2)}\n\`\`\`\n\n`;
});

const outputPath = path.join(__dirname, 'docs', 'curriculum', 'science', 'band_2_templates_strand_1.md');
fs.writeFileSync(outputPath, markdownContent);
console.log(`Generated Strand 1 templates at ${outputPath}`);
