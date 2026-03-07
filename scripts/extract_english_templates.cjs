const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../docs/curriculum/english');
const OUTPUT_DIR = path.join(__dirname, '../curriculum_data');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const files = [
    'band_2_templates_strand_1.md',
    'band_2_templates_strand_2.md',
    'band_2_templates_strand_3.md',
    'band_2_templates_strand_4.md',
    'band_2_templates_strand_5.md'
];

const capacityNames = {};

files.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Extract capacity names from headers like "## PS2a: Short Vowel Mastery"
    const headerRegex = /^##\s+([A-Za-z0-9]+):\s+(.*)$/gm;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(content)) !== null) {
        capacityNames[headerMatch[1]] = headerMatch[2].trim();
    }

    const jsonBlocks = [];
    const regex = /```json\s*[\r\n]+([\s\S]*?)[\r\n]+```/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        try {
            const json = JSON.parse(match[1]);
            jsonBlocks.push(json);
        } catch (e) {
            console.error(`Error parsing JSON in ${file}:`, e.message);
        }
    }

    if (jsonBlocks.length > 0) {
        const strandNum = file.match(/strand_(\d)/)[1];
        const outputFilename = `english_band_2_strand_${strandNum}.json`;
        const outputPath = path.join(OUTPUT_DIR, outputFilename);
        fs.writeFileSync(outputPath, JSON.stringify(jsonBlocks, null, 2));
        console.log(`Extracted ${jsonBlocks.length} templates to ${outputFilename}`);
    } else {
        console.warn(`No JSON blocks found in ${file}`);
    }
});

fs.writeFileSync(path.join(OUTPUT_DIR, 'english_capacity_names.json'), JSON.stringify(capacityNames, null, 2));
console.log(`Extracted ${Object.keys(capacityNames).length} capacity names.`);
