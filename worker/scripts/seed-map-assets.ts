import fs from 'fs';
import path from 'path';

const MANIFEST_PATH = path.join(process.cwd(), 'scripts/output/map-manifest.json');
const TEXTBOOK_DIR = path.join(process.cwd(), 'docs/curriculum/history/my-first-textbook');
const OUTPUT_FILE = path.join(process.cwd(), 'scripts/output/seed_map_assets.sql');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`Map manifest file not found at ${MANIFEST_PATH}`);
  process.exit(1);
}

const mapManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

// Helper to escape SQL strings
function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

// Function to find which chapter folder a map belongs to
function findChapterForMap(mapId: string): number {
  if (!fs.existsSync(TEXTBOOK_DIR)) return 1;

  const folders = fs.readdirSync(TEXTBOOK_DIR).filter(f => f.startsWith('chapter_'));

  for (const folder of folders) {
    const chapterMatch = folder.match(/chapter_(\d+)/);
    if (!chapterMatch) continue;

    const chapterNum = parseInt(chapterMatch[1], 10);
    const mapsDir = path.join(TEXTBOOK_DIR, folder, 'maps');

    if (fs.existsSync(mapsDir)) {
      const mapFiles = fs.readdirSync(mapsDir);
      if (mapFiles.some(f => f.includes(mapId))) {
        return chapterNum;
      }
    }
  }

  return 1; // Default to chapter 1 if not found
}

let sqlOutput = `-- Phase 6 History Explainer Canvas Map Assets Seed\n-- Generated from map-manifest.json\n\n`;

for (let i = 0; i < mapManifest.length; i++) {
  const mapData = mapManifest[i];
  const mapId = mapData.id;

  // Try to use the pre-calculated chapter_id from map-manifest, else fallback
  const chapterNumberMatch = mapData.chapter_id ? mapData.chapter_id.match(/ch(\d+)/) : null;
  const chapterNumber = chapterNumberMatch ? parseInt(chapterNumberMatch[1], 10) : findChapterForMap(mapId);
  const lessonId = mapData.lesson_id || `lesson_ch${chapterNumber.toString().padStart(2, '0')}_s01`;

  const title = escapeSql(mapData.title);
  const era = escapeSql(mapData.era);
  const r2BaseMapKey = escapeSql(mapData.image_path || `assets/maps/${mapId}.png`);

  // Create dummy markers/metadata based on the parsed data or leave empty JSON
  const metadataObj = {
    bounds: [-180, -90, 180, 90],
    defaultCenter: [0, 0],
    defaultZoom: 4,
    region: 'Africa',
    era: mapData.era
  };
  const metadata = escapeSql(JSON.stringify(metadataObj));

  // Only some markers mapped for demonstration from geographicFeatures if any exist
  const markersArray = mapData.geographicFeatures?.settlements?.map((s: any) => ({
    x: s.coordinates?.[0] || 0,
    y: s.coordinates?.[1] || 0,
    label: s.name || s.label || 'Unknown',
    type: s.type || 'settlement'
  })) || [];
  const markers = escapeSql(JSON.stringify(markersArray));

  sqlOutput += `INSERT OR REPLACE INTO Map_Assets (id, lesson_id, chapter_number, title, era, r2_base_map_key, r2_overlay_key, markers, metadata, display_order)\n`;
  sqlOutput += `VALUES ('${mapId}', '${lessonId}', ${chapterNumber}, ${title}, ${era}, ${r2BaseMapKey}, NULL, ${markers}, ${metadata}, ${i + 1});\n\n`;
}

fs.writeFileSync(OUTPUT_FILE, sqlOutput);
console.log(`Seed SQL written to ${OUTPUT_FILE}`);
