import fs from 'fs';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
let chapterArg: string | null = null;
let bandArg: number | null = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--chapter' && i + 1 < args.length) {
    chapterArg = args[i + 1];
  }
  if (args[i] === '--band' && i + 1 < args.length) {
    bandArg = parseInt(args[i + 1], 10);
  }
}

if (!chapterArg || bandArg === null) {
  console.error("Usage: npx tsx scripts/generate_lesson_script.ts --chapter <num> --band <num>");
  process.exit(1);
}

const chapterNumStr = chapterArg.padStart(2, '0');
const chapterId = `ch${chapterNumStr}`;
const band = bandArg;

console.log(`Generating Lesson Script for Chapter ${chapterArg}, Band ${band}...`);

// Paths
const basePath = process.cwd();
const chapterDir = path.join(basePath, `docs/curriculum/history/my-first-textbook/chapter_${chapterNumStr}`);
const componentDir = path.join(basePath, `docs/curriculum/history/component-data/chapter_${chapterNumStr}`);
const pronunciationFile = path.join(basePath, `src/data/pronunciation.json`);
const outputDir = path.join(basePath, `docs/curriculum/history/generated_scripts`);

// Load Data
function loadJson(filePath: string) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return null;
}

const genealogy = loadJson(path.join(componentDir, 'genealogy.json'));
const timeline = loadJson(path.join(componentDir, 'timeline.json'));
const scriptureRefs = loadJson(path.join(componentDir, 'scripture_refs.json'));
const figures = loadJson(path.join(componentDir, 'figures.json'));
const definitions = loadJson(path.join(componentDir, 'definitions.json'));
let comparisons = loadJson(path.join(componentDir, 'comparisons.json'));
if (comparisons && !Array.isArray(comparisons.comparisons) && comparisons.biblical) {
  comparisons = { comparisons: [ comparisons ] };
}

const pronunciations = loadJson(pronunciationFile) || {};

// Read markdown files
let markdownContent = '';
if (fs.existsSync(chapterDir)) {
  // Read either multiple section files (Ch 1) or a single Chapter_XX.md (Ch 2-9)
  let files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.md') && !f.includes('_UPGRADED'));

  // If no md files in root, look in chapters/ subdirectory (Ch 2-9 structure)
  if (files.length === 0) {
    const chaptersSubDir = path.join(chapterDir, 'chapters');
    if (fs.existsSync(chaptersSubDir)) {
      const subFiles = fs.readdirSync(chaptersSubDir).filter(f => f.endsWith('.md') && !f.includes('_BACKUP_ORIGINAL'));
      subFiles.sort();
      for (const file of subFiles) {
        markdownContent += fs.readFileSync(path.join(chaptersSubDir, file), 'utf-8') + '\n\n';
      }
    }
  } else {
    files.sort();
    for (const file of files) {
      markdownContent += fs.readFileSync(path.join(chapterDir, file), 'utf-8') + '\n\n';
    }
  }
} else {
  console.warn(`Chapter directory not found: ${chapterDir}`);
  markdownContent = "This is a fallback text mentioning Mizraim and Genesis 1:1. It also discusses Sovereignty.";
}

// Split into paragraphs (heuristics)
const paragraphs = markdownContent
  .split(/\n\s*\n/)
  .map(p => p.trim())
  .filter(p => p.length > 0 && !p.startsWith('#') && !p.startsWith('![') && !p.startsWith('[!'));

const cues: any[] = [];
let currentTimeMs = 0;
let cueIndex = 1;
const pronunciationOverrides: Record<string, string> = {};

// Helper to calculate duration
function getDuration(text: string) {
  const wordCount = text.split(/\s+/).length;
  return wordCount * 80; // ~150 WPM -> 80ms per word
}

// Helper to format cue
function addToolCallCue(tool: string, args: any) {
  cues.push({
    type: 'tool_call',
    tool,
    args,
    timestamp: currentTimeMs
  });
}

function addSpeakCue(text: string) {
  cues.push({
    type: 'speak',
    text,
    timestamp: currentTimeMs
  });
}

// Apply Band rules
// Get Named Locations for Zooming
const locationsFile = path.join(basePath, 'src/data/geojson/locations.ts');
let namedLocationKeys: string[] = [];
if (fs.existsSync(locationsFile)) {
  const locationsContent = fs.readFileSync(locationsFile, 'utf-8');
  const match = locationsContent.match(/NAMED_LOCATIONS: Record<string, \[number, number\]> = \{([^}]+)\}/);
  if (match && match[1]) {
    namedLocationKeys = match[1].split(',')
      .map(line => line.split(':')[0].trim())
      .filter(key => key.length > 0);
  }
}

// Apply Band rules
const canShowGenealogy = (band === 1 || band >= 3) && genealogy?.trees; // Band 2 skips genealogy per instructions
const canShowTimeline = band >= 4 && timeline?.events; // Band 4+ has timeline
const canShowComparisons = band >= 4 && comparisons?.comparisons;

let sectionCount = 0;

for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
  let para = paragraphs[pIdx];

  if (band <= 2) {
    para = para.replace(/\bprogenitor\b/gi, 'ancestor').replace(/\bprogenitors\b/gi, 'ancestors');
  }

  // Clear canvas at the start of major section
  addToolCallCue('clear_canvas', {});

  // Check for named locations to zoom
  for (const locKey of namedLocationKeys) {
    // Check if the location key (e.g. 'babel', 'memphis', 'nile_delta') is mentioned in the paragraph
    const normalizedKey = locKey.replace(/_/g, ' ');
    const regex = new RegExp(`\\b${normalizedKey}\\b`, 'i');
    if (regex.test(para)) {
      addToolCallCue('zoom_to', { location: locKey });
      break; // Only zoom to the first found location per paragraph to avoid jumping around
    }
  }

  // Scriptures (Band 1+)
  if (band >= 1 && scriptureRefs?.cards) {
    for (const sc of scriptureRefs.cards) {
      if (para.includes(sc.reference) || (sc.text && para.includes(sc.text.substring(0, 15)))) {
        addToolCallCue('show_scripture', {
          reference: sc.reference,
          text: sc.text,
          connection: sc.connection
        });
      }
    }
  }

  // Figures (Band 2+)
  if (band >= 2 && figures?.figures) {
    for (const fig of figures.figures) {
      if (para.includes(fig.name)) {
        addToolCallCue('show_figure', {
          name: fig.name,
          title: fig.title,
          imageUrl: `/assets/images/figures/${fig.imageSlug || fig.name.toLowerCase()}.jpg`
        });
      }
    }
  }

  // Collect pronunciations
  for (const [key, val] of Object.entries(pronunciations)) {
    if (para.includes(key)) {
      pronunciationOverrides[key] = (val as any).ssml || (val as any).phonetic || key;
    }
  }

  // Band 4 Additions
  if (band === 4 && pIdx === 2) {
    para += " Notice how the Table of Nations in Genesis 10 correlates with ancient geography. Why do you think Moses organized the nations this way?";
  }

  // Band 5 Additions
  if (band === 5 && pIdx === 3) {
    para += " Scholars like Kenneth Kitchen argue that these early genealogies reflect historically reliable ancient Near Eastern transmission patterns.";
  }

  if (band === 5 && pIdx % 10 === 9) {
    para += " Consider this as an essay prompt: How does the dispersion at Babel influence modern interpretations of ancient migrations?";
  }

  // Speak Cue logic for Band 2 (Shorter segments)
  if (band === 2) {
    // split into 2 sentences max per cue
    const sentences = para.match(/[^\.!\?]+[\.!\?]+/g) || [para];
    for (let i = 0; i < sentences.length; i += 2) {
      const chunk = sentences.slice(i, i + 2).join(' ').trim();
      if (chunk.length > 0) {
        addSpeakCue(chunk);
        currentTimeMs += getDuration(chunk) + 1000; // Slower pacing
      }
    }
  } else {
    // Normal speak cue
    addSpeakCue(para);
    currentTimeMs += getDuration(para);
    currentTimeMs += 500;
  }
}

// Add Genealogy / Timeline at the end if applicable
if (canShowGenealogy && genealogy?.trees && genealogy.trees.length > 0) {
  addToolCallCue('clear_canvas', {});
  const tree = genealogy.trees[0];
  const dur = 5000;

  // Extract root name and nodes from existing tree structure
  const rootNode = tree.nodes.find((n: any) => !n.parent);
  const rootName = rootNode ? rootNode.name : "Genealogy";

  addToolCallCue('show_genealogy', {
    rootName,
    nodes: tree.nodes
  });
  currentTimeMs += dur;
}

if (canShowComparisons && comparisons?.comparisons) {
  addToolCallCue('clear_canvas', {});
  addToolCallCue('show_comparison', {
    comparisons: comparisons.comparisons
  });
  currentTimeMs += 5000;
}

if (canShowTimeline && timeline?.events) {
  addToolCallCue('clear_canvas', {});
  const dur = 5000;
  addToolCallCue('show_timeline', {
    events: timeline.events
  });
  currentTimeMs += dur;
}

const lessonScript = {
  version: "1.0",
  chapterId,
  band,
  title: `Chapter ${chapterArg} Lesson`,
  estimatedDurationMs: currentTimeMs,
  pronunciationOverrides,
  cues
};

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, `lesson_${chapterId}_band${band}.json`);
fs.writeFileSync(outputPath, JSON.stringify(lessonScript, null, 2));

console.log(`Successfully generated script with ${cues.length} cues.`);
console.log(`Estimated duration: ${(currentTimeMs / 1000).toFixed(1)} seconds.`);
console.log(`Output saved to: ${outputPath}`);
