import fs from 'fs';
import path from 'path';

// Using local implementation of chunkText to avoid ts-node import issues and environmental mismatch
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    // We'll use an overlap of about 20% of the maxChunkSize (in characters)
    // Approximate word length is ~5 characters + 1 space
    const overlapChars = Math.floor(maxChunkSize * 0.2);
    let overlapWordsCount = Math.floor(overlapChars / 6);
    if (overlapWordsCount < 1) overlapWordsCount = 1;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordLen = word.length + (currentChunk.length > 0 ? 1 : 0);

        if (currentLength + wordLen > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));

            // Start new chunk with overlap
            const overlapStartIdx = Math.max(0, currentChunk.length - overlapWordsCount);
            currentChunk = currentChunk.slice(overlapStartIdx);
            currentChunk.push(word);
            currentLength = currentChunk.join(' ').length;
        } else {
            currentChunk.push(word);
            currentLength += wordLen;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks;
}

const METADATA_PATH = path.join(process.cwd(), 'docs/curriculum/history/my-first-textbook/metadata.json');
const OUTPUT_FILE = path.join(process.cwd(), 'scripts/output/seed_rag_chunks.sql');

if (!fs.existsSync(METADATA_PATH)) {
  console.error(`Metadata file not found at ${METADATA_PATH}`);
  process.exit(1);
}

const metadataStr = fs.readFileSync(METADATA_PATH, 'utf-8');
const metadata = JSON.parse(metadataStr);

let sqlOutput = `-- Phase 3A History RAG Chunks Seed\n-- Generated from textbook markdown files\n\n`;

function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

let totalChunks = 0;
let chaptersProcessed = 0;
let totalChunkSize = 0;

for (let i = 0; i < metadata.chapters.length; i++) {
  const chapter = metadata.chapters[i];
  const filepath = path.join(process.cwd(), 'docs/curriculum/history/my-first-textbook', chapter.filepath);

  if (!fs.existsSync(filepath)) {
    console.warn(`File not found: ${filepath}`);
    continue;
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const sourceId = `src_ch${(i + 1).toString().padStart(2, '0')}`;

  // NOTE: In a real environment, lesson_id would be matched correctly, but here we link the source to the first lesson of the chapter or null.
  // We'll set lesson_id to NULL here, or we could link to lesson_ch01_s01. Linking to NULL if lesson isn't strictly 1:1 with source.
  const r2Key = escapeSql(`content/sources/${chapter.filepath}`);
  const title = escapeSql(chapter.title);

  sqlOutput += `-- =========================================\n`;
  sqlOutput += `-- Chapter ${i + 1} Source & Chunks\n`;
  sqlOutput += `-- =========================================\n\n`;

  sqlOutput += `INSERT INTO Sources (id, lesson_id, title, author, type, url, r2_key, excerpt)\n`;
  sqlOutput += `VALUES ('${sourceId}', NULL, ${title}, 'Learn Live Curriculum', 'primary', NULL, ${r2Key}, NULL);\n\n`;

  const chunks = chunkText(content);
  totalChunks += chunks.length;
  chaptersProcessed++;

  for (let j = 0; j < chunks.length; j++) {
    const chunk = chunks[j];
    totalChunkSize += chunk.length;
    const chunkId = `chk_ch${(i + 1).toString().padStart(2, '0')}_${(j + 1).toString().padStart(4, '0')}`;
    const chunkTextEscaped = escapeSql(chunk);

    sqlOutput += `INSERT INTO RAG_Chunks (id, source_id, chunk_text, chunk_index, embedding_key)\n`;
    sqlOutput += `VALUES ('${chunkId}', '${sourceId}', ${chunkTextEscaped}, ${j}, NULL);\n`;
  }

  sqlOutput += `\n`;
}

fs.writeFileSync(OUTPUT_FILE, sqlOutput);

const averageChunkSize = totalChunks > 0 ? Math.round(totalChunkSize / totalChunks) : 0;

console.log(`\n================================`);
console.log(`       RAG CHUNKING REPORT      `);
console.log(`================================`);
console.log(`Chapters Processed:  ${chaptersProcessed}`);
console.log(`Total Chunks:        ${totalChunks}`);
console.log(`Average Chunk Size:  ${averageChunkSize} characters`);
console.log(`Output SQL written to: ${OUTPUT_FILE}`);
console.log(`================================\n`);
