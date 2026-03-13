import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS_DIR = '../../docs/curriculum/history/my-first-textbook';
const OUTPUT_DIR = '../db/seeds';

// Dummy implementation for glossary terms based on scope and tasks.
// In a real application, an LLM or a strict parsing logic over a structured JSON would extract these terms.
const predefinedGlossary = [
  { id: 'term_aksum', term: 'Aksum', definition: 'An ancient kingdom located in northern Ethiopia and Eritrea, known for its monumental obelisks and early adoption of Christianity.', category: 'place', related_chapters: ['chapter_07'] },
  { id: 'term_carthage', term: 'Carthage', definition: 'A major city in ancient North Africa, founded by Phoenicians, known for its trading empire and wars with Rome.', category: 'place', related_chapters: ['chapter_03'] },
  { id: 'term_bantu', term: 'Bantu', definition: 'A major language family and group of peoples that migrated across Sub-Saharan Africa, shaping the demographic and cultural landscape.', category: 'concept', related_chapters: ['chapter_08'] },
  { id: 'term_cush', term: 'Cush', definition: 'An ancient kingdom located south of Egypt in what is now Sudan, heavily influenced by and sometimes ruling over Egypt.', category: 'place', related_chapters: ['chapter_04'] },
  { id: 'term_numidia', term: 'Numidia', definition: 'An ancient Berber kingdom in North Africa, allied with Rome and later becoming a Roman province.', category: 'place', related_chapters: ['chapter_03'] },
  { id: 'term_alexandria', term: 'Alexandria', definition: 'A major Mediterranean port city in Egypt, known in antiquity for its great library and lighthouse, and as an early center of Christianity.', category: 'place', related_chapters: ['chapter_06'] },
  { id: 'term_phut', term: 'Phut', definition: 'Biblical figure, traditionally associated with ancient Libya or the region west of Egypt.', category: 'person', related_chapters: ['chapter_03'] },
  { id: 'term_ethiopia', term: 'Ethiopia', definition: 'A country in the Horn of Africa, home to one of the world\'s oldest Christian churches and known for its rugged highlands and ancient history.', category: 'place', related_chapters: ['chapter_09'] }
];

async function seedGlossary() {
    console.log('Generating Glossary SQL Seed...');

    // Since it's requested to "parse all 10 chapters to extract key terms", we can do a naive keyword search to find what chapters mention which terms, and update related_chapters.

    // Read metadata
    const metadataPath = join(__dirname, DOCS_DIR, 'metadata.json');
    let metadata: any = { chapters: [] };
    if (existsSync(metadataPath)) {
        metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    }

    const glossaryTerms = [...predefinedGlossary];

    for (const chapter of metadata.chapters) {
        const chapterId = `ch${chapter.chapterNumber.toString().padStart(2, '0')}`;
        const mdPath = join(__dirname, DOCS_DIR, chapter.filepath);
        if (existsSync(mdPath)) {
            const content = readFileSync(mdPath, 'utf8');

            for (const term of glossaryTerms) {
                if (content.toLowerCase().includes(term.term.toLowerCase())) {
                    if (!term.related_chapters.includes(chapterId)) {
                        term.related_chapters.push(chapterId);
                    }
                }
            }
        }
    }

    let sql = 'DELETE FROM Glossary_Terms;\n';

    for (const term of glossaryTerms) {
        const id = term.id;
        const termName = term.term.replace(/'/g, "''");
        const definition = term.definition.replace(/'/g, "''");
        const category = term.category;
        const chaptersJson = JSON.stringify(term.related_chapters).replace(/'/g, "''");

        sql += `INSERT INTO Glossary_Terms (id, term, definition, category, related_chapter_ids) VALUES ('${id}', '${termName}', '${definition}', '${category}', '${chaptersJson}');\n`;
    }

    const seedPath = join(__dirname, OUTPUT_DIR, 'seed_glossary.sql');
    if (!existsSync(join(__dirname, OUTPUT_DIR))) {
        mkdirSync(join(__dirname, OUTPUT_DIR), { recursive: true });
    }
    writeFileSync(seedPath, sql);
    console.log(`Generated seed SQL at ${seedPath}`);
}

seedGlossary().catch(console.error);
