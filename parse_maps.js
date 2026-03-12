const fs = require('fs');

const mapsDir = 'docs/curriculum/history/Maps';
const mapFiles = fs.readdirSync(mapsDir).filter(f => f.startsWith('map_') && f.endsWith('.md'));

let maps = [];
for (const file of mapFiles) {
    const id = file.replace('.md', '');
    const numMatch = id.match(/map_(\d+)/);
    const num = numMatch ? parseInt(numMatch[1], 10) : 0;

    // Read file to find title/era
    const content = fs.readFileSync(`${mapsDir}/${file}`, 'utf8');
    const titleMatch = content.match(/title:\s*(.*)/);
    const eraMatch = content.match(/era:\s*(.*)/);

    // Heuristic for chapter: we'll check references in chapters
    maps.push({
        id,
        num,
        file,
        title: titleMatch ? titleMatch[1].replace(/["']/g, '') : `Map ${num}`,
        era: eraMatch ? eraMatch[1].replace(/["']/g, '') : '',
    });
}

// Write a simple SQL script
let sql = `-- Maps Seed\n\n`;

for (const m of maps) {
    // figure out chapter mapping based on name or number
    let ch = 1;
    if (m.num >= 1 && m.num <= 4) ch = 1; // approx
    if (m.id.includes('egypt_overview')) ch = 2;
    if (m.num >= 10 && m.num <= 12) ch = 3;
    if (m.num >= 13 && m.num <= 14) ch = 5; // Christian North Africa / Islamic Conquest
    if (m.num == 6 || m.num == 29) ch = 5; // Roman North Africa / Byzantine
    if (m.num == 7 || m.num == 9 || m.num == 32) ch = 6; // Roman Egypt / Monasticism / Coptic
    if (m.num == 5 || m.num == 15) ch = 4; // Upper Nile / Meroe
    if (m.num == 8 || m.num == 16 || m.num == 17 || m.num == 33 || m.num == 34) ch = 7; // Aksum / Zagwe / Solomonic
    if (m.num == 3 || m.num == 8 || m.id.includes('bantu') || m.id.includes('peopling')) ch = 8;
    if (m.num >= 26 && m.num <= 27) ch = 10;
    if (m.id.includes('zagwe') || m.id.includes('solomonic')) ch = 9;

    const lessonId = `lesson_ch${ch.toString().padStart(2, '0')}_s01`;

    sql += `INSERT OR REPLACE INTO Map_Assets (id, lesson_id, chapter_number, title, era, r2_base_map_key, r2_overlay_key, markers, metadata, display_order)
VALUES ('${m.id}', '${lessonId}', ${ch}, '${m.title}', '${m.era}', 'maps/chapter_${ch.toString().padStart(2, '0')}/${m.id}_base.png', NULL, '[]', '{"bounds":[-180,-90,180,90],"defaultCenter":[0,0],"defaultZoom":4,"region":"Africa","era":"${m.era}"}', ${m.num});\n\n`;
}

fs.writeFileSync('worker/db/seeds/seed_map_assets.sql', sql);
console.log(`Generated seed for ${maps.length} maps`);
