const fs = require('fs');
const path = require('path');

const capacities = [
  { id: 'PS2a', name: 'States of Matter', risk: 'Risk_Level_A', materials: ['stone', 'water', 'inflated balloon'], alternatives: ['wood', 'juice', 'plastic bag with air'], safety: 'Safe for independent observation.' },
  { id: 'PS2b', name: 'Phase Changes', risk: 'Risk_Level_C', materials: ['ice cubes', 'saucepan', 'stove or fire'], alternatives: ['frozen juice', 'kettle'], safety: 'Adult MUST handle boiling water and fire. Child observes from a safe distance.' },
  { id: 'PS2c', name: 'Mixtures & Solutions', risk: 'Risk_Level_A', materials: ['salt or sugar', 'sand or soil', 'water', '2 clear cups'], alternatives: ['ash', 'maize flour', 'bowls'], safety: 'Do not drink the mixtures.' },
  { id: 'PS2d', name: 'Push, Pull & Force', risk: 'Risk_Level_A', materials: ['heavy box or chair', 'rope'], alternatives: ['large stone', 'sturdy string'], safety: 'Do not use rope around neck or pull too fast.' },
  { id: 'PS2e', name: 'Friction', risk: 'Risk_Level_A', materials: ['smooth surface (floor)', 'rough surface (mat/grass)', 'object to slide (block/book)'], alternatives: ['dirt patch', 'piece of wood'], safety: 'Safe for independent work.' },
  { id: 'PS2f', name: 'Gravity Basics', risk: 'Risk_Level_A', materials: ['feather or leaf', 'stone', 'crumpled paper'], alternatives: ['cloth', 'stick'], safety: 'Do not drop heavy objects on feet.' },
  { id: 'PS2g', name: 'Magnetism', risk: 'Risk_Level_A', materials: ['magnet', 'coins', 'nails/screws', 'plastic toys'], alternatives: ['fridge magnet', 'paperclips', 'keys'], safety: 'Do not swallow magnets.' },
  { id: 'PS2h', name: 'Energy Basics — Heat', risk: 'Risk_Level_B', materials: ['hands to rub together', 'dark cloth left in sun', 'warm water'], alternatives: ['metal spoon left in sun'], safety: 'Ensure water/sun-heated objects are not too hot to touch.' },
  { id: 'PS2i', name: 'Energy Basics — Light', risk: 'Risk_Level_B', materials: ['flashlight or sun', 'cardboard (opaque)', 'clear plastic (transparent)'], alternatives: ['candle', 'wood', 'glass jar'], safety: 'Do not look directly at the sun. Adult handles candle if used.' },
  { id: 'PS2j', name: 'Shadows', risk: 'Risk_Level_A', materials: ['flashlight', 'toy or hand'], alternatives: ['sunlight', 'stick'], safety: 'Safe for independent work.' },
  { id: 'PS2k', name: 'Energy Basics — Sound', risk: 'Risk_Level_A', materials: ['drum or pot', 'spoon', 'rice or small seeds'], alternatives: ['rubber band', 'box'], safety: 'Loud noises may bother siblings/pets.' },
  { id: 'PS2l', name: 'Introductory Systems (Causality)', risk: 'Risk_Level_A', materials: ['dominoes or blocks', 'marble'], alternatives: ['row of small stones'], safety: 'Safe for independent work.' }
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
    else promptStr = `Variation C: Explore the ${contextVariants.ug.settings[1]} or ${contextVariants.ug.settings[2]}. "Point out an example of ${cap.name} and describe it to me."`;
  } else if (level === 2) {
    taskType = "Execute (Experiment/Sorting)";
    reasonStr = "How did you record your data?";
    rubric = [
      { criterion: "Did the child safely handle materials?", type: "yes_no" },
      { criterion: "Did the child accurately record or sort the outcomes?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Use the ${cap.materials[0]} to test ${cap.name}. Sort the results into two piles."`;
    else if (variation === 'B') promptStr = `Variation B: "Conduct a simple test on ${cap.name} using ${cap.alternatives[0]}. Draw what happened."`;
    else {
      promptStr = `Variation C: "Measure or count the outcomes of our ${cap.name} experiment. Create a simple tally chart."`;
    }
  } else if (level === 3) {
    taskType = "Discern (Anomaly Detection)";
    reasonStr = "What was the mechanical error?";
    worldviewStr = `Mechanism: Understanding how ${cap.name} works physically. Stewardship: We must know the true mechanism to apply forces/energy safely.`;
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
      { criterion: "Did the child explain the physical mechanism before the stewardship meaning?", type: "yes_no" }
    ];
    if (variation === 'A') promptStr = `Variation A: "Design a solution for our home using what you know about ${cap.name}. Build a model using ${cap.materials.join(', ')}."`;
    else if (variation === 'B') promptStr = `Variation B: "Predict what will happen if we change a major part of the ${cap.name} system. Draw your prediction and explain it to me."`;
    else promptStr = `Variation C: "We need to make a stewardship decision regarding ${cap.name}. Propose a plan and explain the physical mechanics behind why your plan will work."`;
  }

  if (isMilestone) {
    taskType = "Milestone (Real-World Application)";
    modelType = level === 4 ? "System" : undefined;
    promptStr = `Milestone: Present the child with an unlabeled real-world problem involving ${cap.name}. "We have a problem with moving this heavy object / heating this water. Show me how to solve it."`;
    worldviewStr = `Mechanism: Real-world mechanics of ${cap.name}. Stewardship: Applying physics knowledge to serve the family.`;
  }

  let template = {
    capacity_id: cap.id,
    strand: 2,
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

let markdownContent = `# Band 2 Science Templates — Strand 2: Physical Sciences

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

const outputPath = path.join(__dirname, 'docs', 'curriculum', 'science', 'band_2_templates_strand_2.md');
fs.writeFileSync(outputPath, markdownContent);
console.log(`Generated Strand 2 templates at ${outputPath}`);
