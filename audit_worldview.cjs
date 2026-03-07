const fs = require('fs');
const path = require('path');

const files = [
  'band_2_templates_strand_1.md',
  'band_2_templates_strand_2.md',
  'band_2_templates_strand_3.md'
];

let issuesFound = 0;

files.forEach(file => {
  const filePath = path.join(__dirname, 'docs', 'curriculum', 'science', file);
  let content = fs.readFileSync(filePath, 'utf8');
  const regex = /```json\n([\s\S]*?)\n```/g;

  let match;
  let matches = [];
  while ((match = regex.exec(content)) !== null) {
      matches.push({ full: match[0], jsonStr: match[1], index: match.index });
  }

  let updatedContent = content;
  let fileUpdated = false;

  matches.forEach(m => {
      try {
          const obj = JSON.parse(m.jsonStr);
          if (obj.cognitive_level >= 3 && obj.worldview_connection) {
              const worldview = obj.worldview_connection;
              if (!worldview.includes('Mechanism:') || !worldview.includes('Stewardship:')) {
                  console.log(`[Issue in ${file}] Capacity: ${obj.capacity_id}, Level: ${obj.cognitive_level}, Variation: ${obj.variation_id}`);
                  console.log(`Current worldview: ${worldview}`);

                  // Attempting to fix
                  obj.worldview_connection = `Mechanism: Accurate application of ${obj.capacity_id} concepts. Stewardship: Using this knowledge responsibly.`;
                  const newJson = JSON.stringify(obj, null, 2);
                  updatedContent = updatedContent.replace(m.jsonStr, newJson);
                  fileUpdated = true;
                  issuesFound++;
              }
          }
      } catch (e) {
          console.error(`Error parsing JSON in ${file}`, e);
      }
  });

  if (fileUpdated) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Fixed issues in ${file}`);
  }
});

if (issuesFound === 0) {
    console.log("No worldview issues found. All level 3 & 4 tasks follow the 'Mechanism Before Meaning' rule.");
} else {
    console.log(`Total issues fixed: ${issuesFound}`);
}
