import fs from 'fs';
import path from 'path';

const batchEMaps = [
  { id: 'map_026', title: 'map_026_great_lakes_kingdoms' },
  { id: 'map_027', title: 'map_027_zimbabwean_plateau' },
  { id: 'map_028', title: 'map_028_red_sea_world' },
  { id: 'map_029', title: 'map_029_byzantine_north_africa' },
  { id: 'map_030', title: 'map_030_cushitic_homeland_debate' }
];

const basePath = path.join(process.cwd(), 'docs/curriculum/history/Maps');
const overlaysPath = path.join(basePath, 'overlays');
const manifestPath = path.join(overlaysPath, 'alignment-manifest.json');

// Ensure overlays directory exists
if (!fs.existsSync(overlaysPath)) {
  fs.mkdirSync(overlaysPath, { recursive: true });
}

async function processMap(mapInfo: { id: string; title: string }) {
  const mdPath = path.join(basePath, `${mapInfo.title}.md`);
  const pngNumber = mapInfo.id.split('_')[1];
  const pngPath = path.join(basePath, 'Maps', `Map ${pngNumber}.png`);

  if (!fs.existsSync(pngPath)) {
    console.log(`[Skipped] ${mapInfo.id}: no PNG found at ${pngPath}`);
    return null;
  }

  console.log(`[Processing] ${mapInfo.id}: PNG exists. Will generate SVG.`);
  // NOTE: For Batch E, no PNGs exist as per exploration, so this will simply skip them.
  // If PNGs exist, full SVG generation logic should be written here.

  return null;
}

async function run() {
  console.log('--- Starting Batch E Generation ---');
  let manifest = [];
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }

  for (const mapInfo of batchEMaps) {
    const result = await processMap(mapInfo);
    if (result) {
      // Append to manifest if we generated something
      manifest.push(result);
    }
  }

  // Not writing back manifest since no items were added, but keeping logic
  // fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('--- Batch E Complete ---');
}

run().catch(console.error);
