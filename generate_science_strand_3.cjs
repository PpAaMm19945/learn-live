const fs = require('fs');
const path = require('path');

const capacities = [
  { id: 'ES2a', name: 'Soil Composition', risk: 'Risk_Level_B', materials: ['handful of soil (garden/path)', 'white paper'], alternatives: ['sand', 'clay'], safety: 'Wash hands after handling soil.' },
  { id: 'ES2b', name: 'Soil & Water (Agriculture)', risk: 'Risk_Level_A', materials: ['2 types of soil (sand/clay)', 'water', '2 clear cups'], alternatives: ['cut plastic bottles', 'mud'], safety: 'Wash hands after handling soil.' },
  { id: 'ES2c', name: 'Rocks & Minerals', risk: 'Risk_Level_A', materials: ['5 different rocks from outside'], alternatives: ['pebbles', 'stones from road'], safety: 'Do not throw rocks.' },
  { id: 'ES2d', name: 'Water Cycle & Local Context', risk: 'Risk_Level_A', materials: ['clear plastic bag or cup', 'water', 'sunlight'], alternatives: ['glass jar', 'puddle observation'], safety: 'Safe for independent work.' },
  { id: 'ES2e', name: 'Weather Tracking', risk: 'Risk_Level_A', materials: ['notebook', 'pencil', 'view of the sky'], alternatives: ['chalk on wall'], safety: 'Safe for independent work.' },
  { id: 'ES2f', name: 'Seasons', risk: 'Risk_Level_A', materials: ['observation of local plants/ground', 'calendar'], alternatives: ['parent discussion of rain/dry'], safety: 'Safe for independent work.' },
  { id: 'ES2g', name: 'Sun, Earth, Moon', risk: 'Risk_Level_A', materials: ['large ball (Earth)', 'flashlight or smaller ball (Sun)'], alternatives: ['orange', 'stone'], safety: 'Safe for independent work.' },
  { id: 'ES2h', name: 'Solar Energy', risk: 'Risk_Level_A', materials: ['sunlight', 'stone or metal object', 'water in shallow dish'], alternatives: ['cloth', 'leaf'], safety: 'Check that objects heated by sun are not too hot.' },
  { id: 'ES2i', name: 'Lunar Phases', risk: 'Risk_Level_B', materials: ['night sky observation'], alternatives: ['drawing of moon', 'ball and flashlight in dark room'], safety: 'Night observation requires parent supervision.' },
  { id: 'ES2j', name: 'Natural Resources & Stewardship', risk: 'Risk_Level_B', materials: ['water from tap/jerrycan', 'cup', 'soil patch'], alternatives: ['bucket of water'], safety: 'Do not waste essential household drinking water.' },
  { id: 'ES2k', name: 'Ecosystem Disruption', risk: 'Risk_Level_A', materials: ['small patch of grass/weeds', 'heavy board or box to cover it'], alternatives: ['pot with weed', 'dark cloth'], safety: 'Wash hands after touching plants/soil.' },
  { id: 'ES2l', name: 'Conservation & Recycling', risk: 'Risk_Level_A', materials: ['used plastic bottle', 'scissors'], alternatives: ['old paper', 'cardboard box'], safety: 'Parent supervision required when using scissors.' }
];

const contextVariants = {
  default: { names: ["Alex", "Sam", "Pat"], settings: ["park", "school", "store"], food: ["apples", "bread", "milk"] },
  ug: { names: ["Amara", "Tendo", "Azie"], settings: ["Kampala market", "village", "garden", "savanna", "wetland", "shamba"], food: ["matooke", "mangoes", "chapati", "jackfruit"] }
};

function generateTemplate(cap, level, variation, isMilestone) {
  let taskType = "Physical Observation";
  let promptStr = "";
  let successStr = "";
  let failureStr = "";
  let reasonStr = "Why did you observe that?";
  let worldviewStr = "";
  let observablePhenomenon = "";
  let modelType = "";
  let rubric = [];

  if (level === 1) {
    taskType = "Encounter (Observation)";
    observablePhenomenon = `Direct physical observation of ${cap.name.toLowerCase()}`;
    reasonStr = "What do you see, hear, or feel?";
    successStr = `Child completes the observation and describes the physical traits of ${cap.name}.`;
    failureStr = `Child struggles to engage. Parent asks guiding questions about what they see.`;
    if (variation === 'A') promptStr = `Variation A: Parent guides child to directly observe ${cap.name} outside. "Look closely at this. What do you notice?"`;
    else if (variation === 'B') promptStr = `Variation B: Parent sets up an observation with ${cap.materials.join(', ')}. "Feel and listen to this. What is happening?"`;
    else promptStr = `Variation C: Go to the ${contextVariants.ug.settings[5]} or nearby dirt path. "Point out an example of ${cap.name} and describe it to me."`;
  } else if (level === 2) {
    taskType = "Execute (Experiment/Sorting)";
    reasonStr = "How did you record your data?";
    successStr = `Child successfully uses materials to test ${cap.name} and records the data.`;
    failureStr = `Child plays with materials without testing. Parent must redirect.`;
    rubric = [
      { criterion: "Did the child safely handle materials?", type: "yes_no" },
      { criterion: "Did the child accurately track or sort the natural items?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Use the ${cap.materials[0]} to test ${cap.name}. Sort the rocks/soil into two piles."`;
    else if (variation === 'B') promptStr = `Variation B: "Track the weather or ${cap.name} using ${cap.alternatives[0]}. Draw what happened today."`;
    else {
      promptStr = `Variation C: "Measure or count the outcomes of our ${cap.name} observation. Create a simple tally chart over 3 days."`;
    }
  } else if (level === 3) {
    taskType = "Discern (Anomaly Detection)";
    reasonStr = "What was the mechanical error?";
    successStr = `Child identifies the mechanical error and explains how ${cap.name} really works.`;
    failureStr = `Child agrees with the flawed reasoning. Parent prompts them to think about physical variables.`;
    worldviewStr = `Mechanism: Understanding how ${cap.name} works physically. Stewardship: We must know the true mechanism of the earth to farm or build properly.`;
    if (variation === 'A') promptStr = `Variation A: "Show me how ${cap.name} works physically. If I do [X], what should happen according to the rules of science?"`;
    else if (variation === 'B') promptStr = `Variation B: "Amara tried to do an experiment on ${cap.name} but it failed. Why did she fail physically?"`;
    else promptStr = `Variation C: "Look at this flawed reasoning about ${cap.name}. Spot the error and explain the real mechanism."`;
  } else if (level === 4) {
    taskType = "Own (Model Building & Stewardship)";
    modelType = ["Physical", "Predictive", "System", "Diagrammatic"][Math.floor(Math.random() * 4)];
    reasonStr = "Explain your model and stewardship choice.";
    successStr = `Child designs a working model or plan and explains the physical mechanism before the stewardship meaning.`;
    failureStr = `Child proposes a magic solution or cannot map the physical variables to a local problem.`;
    worldviewStr = `Mechanism: Accurate application of earth science mechanics (${cap.name}). Stewardship: Using this knowledge to protect our soil, water, or crops.`;
    rubric = [
      { criterion: "Did the child build a functional model or clear prediction?", type: "yes_no" },
      { criterion: "Did the child explain the physical mechanism before the stewardship meaning?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Design a plan to protect our home's soil or water using what you know about ${cap.name}. Build a small physical model using ${cap.materials.join(', ')}."`;
    else if (variation === 'B') promptStr = `Variation B: "Predict what will happen to a local farm if we experience a disruption in ${cap.name}. Draw your predictive model and explain it."`;
    else promptStr = `Variation C: "We need to make a stewardship decision regarding our water usage or garden (${cap.name}). Propose a plan and explain the physical mechanics behind why your plan will work."`;
  }

  if (isMilestone) {
    taskType = "Milestone (Real-World Application)";
    modelType = level === 4 ? "System" : undefined;
    promptStr = `Milestone: Present the child with an unlabeled real-world problem involving the garden or weather (${cap.name}). "We have a problem with our crops / yard. Show me how to fix or prepare for it."`;
    successStr = `Child independently applies ${cap.name} to solve the real-world problem.`;
    failureStr = `Child cannot transfer knowledge to the unlabeled problem.`;
    worldviewStr = `Mechanism: Real-world mechanics of ${cap.name}. Stewardship: Applying earth science knowledge to serve the family's land/resources.`;
  }

  let template = {
    capacity_id: cap.id,
    strand: 3,
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

let markdownContent = `# Band 2 Science Templates — Strand 3: Earth & Space Sciences

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

const markdownPath = path.join(__dirname, 'docs', 'curriculum', 'science', 'band_2_templates_strand_3.md');
fs.writeFileSync(markdownPath, markdownContent);
console.log(`Generated Strand 3 Markdown at ${markdownPath}`);

// Also generate JSON for seeding
const allTemplates = [];
capacities.forEach(cap => {
  [1, 2, 3, 4].forEach(level => {
    ['A', 'B', 'C'].forEach(variation => {
      allTemplates.push(generateTemplate(cap, level, variation, false));
    });
  });
  allTemplates.push(generateTemplate(cap, 4, 'M', true));
});

const jsonPath = path.join(__dirname, 'curriculum_data', 'science_band_2_strand_3.json');
fs.writeFileSync(jsonPath, JSON.stringify(allTemplates, null, 2));
console.log(`Generated Strand 3 JSON at ${jsonPath}`);
