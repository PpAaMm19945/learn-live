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
  const files = fs.readdirSync(chapterDir).filter(f => f.endsWith('.md') && !f.includes('_UPGRADED'));
  files.sort();

  for (const file of files) {
    markdownContent += fs.readFileSync(path.join(chapterDir, file), 'utf-8') + '\n\n';
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

function addCue(action: string, params: any, durationMs: number = 0) {
  const idStr = cueIndex.toString().padStart(3, '0');
  cues.push({
    id: `${chapterId}_b${band}_cue_${idStr}`,
    timestampMs: currentTimeMs,
    durationMs: durationMs,
    action,
    params
  });
  cueIndex++;
}

// Apply Band rules
const canShowGenealogy = band >= 1 && genealogy?.trees;
const canShowTimeline = band >= 2 && timeline?.events;
const canShowComparisons = band >= 4 && comparisons?.comparisons;

for (const para of paragraphs) {
  const speakDuration = getDuration(para);
  const activeComponentIds: string[] = [];

  // Scriptures (Band 1+)
  if (band >= 1 && scriptureRefs?.cards) {
    for (const sc of scriptureRefs.cards) {
      if (para.includes(sc.reference) || (sc.text && para.includes(sc.text.substring(0, 15)))) {
        activeComponentIds.push(sc.id);
        addCue('show_component', {
          componentType: 'scripture_card',
          componentId: sc.id,
          data: {
            reference: sc.reference,
            text: sc.text,
            connection: sc.connection,
            band
          },
          transition: 'slide_up'
        }, speakDuration);
      }
    }
  }

  // Figures (Band 2+)
  if (band >= 2 && figures?.figures) {
    for (const fig of figures.figures) {
      if (para.includes(fig.name)) {
        activeComponentIds.push(fig.id);
        addCue('show_component', {
          componentType: 'portrait_card',
          componentId: fig.id,
          data: {
            name: fig.name,
            title: fig.title,
            dates: fig.dates,
            imageUrl: `/assets/images/figures/${fig.imageSlug || fig.name.toLowerCase()}.jpg`,
            quote: fig.quote
          },
          transition: 'fade'
        }, speakDuration);
      }
    }
  }

  // Definitions (Band 2+)
  if (band >= 2 && definitions?.terms) {
    for (const def of definitions.terms) {
      if (para.includes(def.term)) {
        activeComponentIds.push(def.id);
        addCue('show_component', {
          componentType: 'definition_card',
          componentId: def.id,
          data: {
            term: def.term,
            definition: def.definition,
            scriptureRef: def.scriptureRef,
            originalLanguage: def.originalLanguage,
            band
          },
          transition: 'fade'
        }, speakDuration);
      }
    }
  }

  // Collect pronunciations
  for (const [key, val] of Object.entries(pronunciations)) {
    if (para.includes(key)) {
      pronunciationOverrides[key] = (val as any).ssml || (val as any).phonetic || key;
    }
  }

  // Speak Cue
  const speakCueIdStr = cueIndex.toString().padStart(3, '0');
  addCue('speak', {
    text: para,
    audioFileId: `${chapterId}_b${band}_audio_${speakCueIdStr}`
  }, speakDuration);

  // Time advances for the speak cue
  currentTimeMs += speakDuration;

  // Hide components that were shown during this paragraph
  for (const compId of activeComponentIds) {
    addCue('hide_component', {
      componentId: compId,
      transition: 'fade'
    }, 0);
  }

  // Pause between paragraphs
  currentTimeMs += 500;
}

// Add Genealogy / Timeline / Comparisons at the end if applicable
if (canShowGenealogy && genealogy?.trees && genealogy.trees.length > 0) {
  const tree = genealogy.trees[0];
  const dur = 5000;
  addCue('show_component', {
    componentType: 'genealogy_tree',
    componentId: `gen_${chapterId}`,
    data: {
      treeData: { nodes: tree.nodes },
      band
    },
    transition: 'slide_up'
  }, dur);
  currentTimeMs += dur;
}

if (canShowTimeline && timeline?.events) {
  const dur = 5000;
  addCue('show_component', {
    componentType: 'dual_timeline',
    componentId: `time_${chapterId}`,
    data: {
      events: timeline.events,
      mode: band >= 3 ? 'dual' : 'biblical',
      band
    },
    transition: 'fade'
  }, dur);
  currentTimeMs += dur;
}

if (canShowComparisons && comparisons?.comparisons) {
  for (const cmp of comparisons.comparisons) {
    const dur = 6000;
    addCue('show_component', {
      componentType: 'comparison_view',
      componentId: cmp.id,
      data: {
        biblicalData: cmp.biblical,
        conventionalData: cmp.conventional,
        resolution: cmp.resolution
      },
      transition: 'slide_up'
    }, dur);
    currentTimeMs += dur;
  }
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
