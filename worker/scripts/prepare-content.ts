import fs from 'fs';
import path from 'path';

// Read metadata
const METADATA_PATH = path.join(process.cwd(), '../docs/curriculum/history/my-first-textbook/metadata.json');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts/output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'content-manifest.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const metadataStr = fs.readFileSync(METADATA_PATH, 'utf-8');
const metadata = JSON.parse(metadataStr);

interface Section {
  heading: string;
  text: string;
  keyDates: string[];
  keyFigures: string[];
  thinkItThrough: string;
}

interface Chapter {
  id: string;
  title: string;
  era: string;
  region: string;
  summary: string;
  sections: Section[];
}

const manifest: { chapters: Chapter[] } = { chapters: [] };

function inferEraAndRegion(content: string, chapterNumber: number): { era: string, region: string } {
  let era = '';
  let region = '';

  const eraMatch = content.match(/c\.\s*\d+\s*(?:BC|AD)/i);
  if (eraMatch) {
    era = eraMatch[0];
  } else {
    era = "Unknown Era";
  }

  if (chapterNumber === 1) {
    era = "Origins \u2013 c. 2242 BC";
    region = "Pan-African";
  } else if (content.match(/egypt|nile/i)) {
    region = "Egypt / Nile Valley";
  } else if (content.match(/carthage|numidia|desert/i)) {
    region = "North Africa";
  } else if (content.match(/aksum|ethiopia/i)) {
    region = "Ethiopia / Horn of Africa";
  } else if (content.match(/bantu/i)) {
    region = "Sub-Saharan Africa";
  } else {
    region = "Africa";
  }

  return { era, region };
}

for (const chapter of metadata.chapters) {
  const chapterNumber = chapter.chapterNumber;
  const title = chapter.title;
  const filepath = path.join(process.cwd(), '../docs/curriculum/history/my-first-textbook', chapter.filepath);

  if (!fs.existsSync(filepath)) {
    console.warn(`File not found: ${filepath}`);
    continue;
  }

  const content = fs.readFileSync(filepath, 'utf-8');

  const chapterId = `ch${chapterNumber.toString().padStart(2, '0')}`;

  const { era, region } = inferEraAndRegion(content, chapterNumber);

  // Extract Frontmatter/Quick Start metadata
  let summary = '';
  const summaryMatch = content.match(/\*\*Chapter Summary[^*]*\*\*:\s*(.+)/i);
  if (summaryMatch) summary = summaryMatch[1].trim();

  // Extract explicit chapter title if present (# Chapter X: Title)
  let extractedTitle = title;
  const titleMatch = content.match(/^#\s+\*\*Chapter\s+\d+:\s*(.+)\*\*/m) || content.match(/^#\s+Chapter\s+\d+:\s*(.+)/m);
  if (titleMatch) {
    extractedTitle = titleMatch[1].replace(/\*\*/g, '').trim();
  } else if (chapterNumber === 2 && content.match(/Egypt \/ Nile Valley/i)) {
      // Just some fallback for chap 2 if it's missing the actual # Title block
      extractedTitle = "Foundations After Babel: Egypt";
  }

  // Split content by ## headings
  // We use regex to find all sections.
  const sectionRegex = /^##\s+(.+)$/gm;

  let match;
  const sectionsData: { heading: string, startIndex: number, endIndex: number }[] = [];

  while ((match = sectionRegex.exec(content)) !== null) {
    sectionsData.push({
      heading: match[1].trim(),
      startIndex: match.index,
      endIndex: -1
    });
  }

  for (let i = 0; i < sectionsData.length; i++) {
    sectionsData[i].endIndex = (i + 1 < sectionsData.length) ? sectionsData[i+1].startIndex : content.length;
  }

  const sections: Section[] = [];

  for (const sData of sectionsData) {
    const sectionContent = content.substring(sData.startIndex, sData.endIndex);

    // Extract think it through
    let thinkItThrough = '';
    const thinkRegex = />\s*\*\*Think It Through:\*\*(.*?)(?=\n>|\n\n|\n\*|\n##|\n###|$)/is;
    const thinkMatch = sectionContent.match(thinkRegex);
    if (thinkMatch) {
      thinkItThrough = thinkMatch[1].trim();
    } else {
      // Try alternative format
      const altThinkRegex = /###\s*\*\*Think It Through\*\*(.*?)(?=\n###|\n##|$)/is;
      const altThinkMatch = sectionContent.match(altThinkRegex);
      if (altThinkMatch) {
        thinkItThrough = altThinkMatch[1].trim();
      }
    }

    // Extract key dates / figures from text (simple heuristic)
    const keyDates: string[] = [];
    const dateRegex = /\bc\.\s*\d+\s*(?:BC|AD)\b/g;
    let dMatch;
    while ((dMatch = dateRegex.exec(sectionContent)) !== null) {
      if (!keyDates.includes(dMatch[0])) {
         keyDates.push(dMatch[0]);
      }
    }

    // Naive key figures - words starting with capital letters after "King", "Pharaoh", etc.
    const keyFigures: string[] = [];
    const figureRegex = /\b(?:King|Pharaoh|Queen)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    let fMatch;
    while ((fMatch = figureRegex.exec(sectionContent)) !== null) {
      if (!keyFigures.includes(fMatch[1])) {
         keyFigures.push(fMatch[1]);
      }
    }

    sections.push({
      heading: sData.heading,
      text: sectionContent.replace(/^##\s+.+\n/, '').trim(),
      keyDates,
      keyFigures,
      thinkItThrough
    });
  }

  // If no sections found with ##, wrap the whole content
  if (sections.length === 0) {
    sections.push({
      heading: "Overview",
      text: content.trim(),
      keyDates: [],
      keyFigures: [],
      thinkItThrough: ''
    });
  }

  manifest.chapters.push({
    id: chapterId,
    title: extractedTitle,
    era,
    region,
    summary,
    sections
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`Manifest written to ${OUTPUT_FILE}`);
