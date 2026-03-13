import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.join(process.cwd(), 'scripts/output/content-manifest.json');
const OUTPUT_FILE = path.join(process.cwd(), 'scripts/output/seed_curriculum.sql');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`Manifest file not found at ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifestStr = fs.readFileSync(MANIFEST_PATH, 'utf-8');
const manifest = JSON.parse(manifestStr);

let sqlOutput = `-- Phase 3A History Curriculum Seed\n-- Generated from content-manifest.json\n\n`;

function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL';
  // Replace single quotes with double single quotes for SQL escaping
  return "'" + str.replace(/'/g, "''") + "'";
}

for (let i = 0; i < manifest.chapters.length; i++) {
  const chapter = manifest.chapters[i];
  const topicId = `topic_ch${(i + 1).toString().padStart(2, '0')}`;
  const displayOrder = i + 1;
  const summary = chapter.summary || `${chapter.title} - ${chapter.era} - ${chapter.region}`; // Simplified summary

  sqlOutput += `-- =========================================\n`;
  sqlOutput += `-- Chapter ${displayOrder}: ${chapter.title}\n`;
  sqlOutput += `-- =========================================\n\n`;

  sqlOutput += `INSERT OR IGNORE INTO Topics (id, title, era, region, summary, display_order, parent_topic_id)\n`;
  sqlOutput += `VALUES ('${topicId}', ${escapeSql(chapter.title)}, ${escapeSql(chapter.era)}, ${escapeSql(chapter.region)}, ${escapeSql(summary)}, ${displayOrder}, NULL);\n\n`;

  for (let j = 0; j < chapter.sections.length; j++) {
    const section = chapter.sections[j];
    const lessonId = `lesson_ch${(i + 1).toString().padStart(2, '0')}_s${(j + 1).toString().padStart(2, '0')}`;

    // Calculate word count and estimated minutes (~200 words/min)
    const wordCount = section.text.split(/\s+/).length;
    const estimatedMinutes = Math.max(1, Math.round(wordCount / 200));

    // Serialize key_dates and key_figures to JSON string
    const keyDatesJson = escapeSql(JSON.stringify(section.keyDates));
    const keyFiguresJson = escapeSql(JSON.stringify(section.keyFigures));
    const narrativeText = escapeSql(section.text);
    const lessonTitle = escapeSql(section.heading);

    sqlOutput += `INSERT OR IGNORE INTO Lessons (id, topic_id, title, narrative_text, key_dates, key_figures, difficulty_band, estimated_minutes)\n`;
    sqlOutput += `VALUES ('${lessonId}', '${topicId}', ${lessonTitle}, ${narrativeText}, ${keyDatesJson}, ${keyFiguresJson}, 5, ${estimatedMinutes});\n\n`;
  }
}

fs.writeFileSync(OUTPUT_FILE, sqlOutput);
console.log(`Seed SQL written to ${OUTPUT_FILE}`);
