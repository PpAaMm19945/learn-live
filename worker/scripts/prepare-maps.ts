import fs from 'fs';
import path from 'path';

const MAPS_DIR = path.join(process.cwd(), 'docs/curriculum/history/Maps');
const OUTPUT_FILE = path.join(process.cwd(), 'scripts/output/map-manifest.json');

if (!fs.existsSync(MAPS_DIR)) {
  console.error(`Maps directory not found at ${MAPS_DIR}`);
  process.exit(1);
}

const mapFiles = fs.readdirSync(MAPS_DIR).filter(f => f.endsWith('.md'));

interface MapManifestEntry {
  id: string;
  filename: string;
  title: string;
  era: string;
  image_path: string;
  chapter_id: string;
  lesson_id: string;
  geographicFeatures: {
    highlighted_regions: any[];
    settlements: any[];
    climate_zones: any[];
    trade_routes: any[];
    vegetation: any[];
  };
}

const mapManifest: MapManifestEntry[] = [];

for (const file of mapFiles) {
  const filepath = path.join(MAPS_DIR, file);
  const content = fs.readFileSync(filepath, 'utf-8');

  // Attempt to parse JSON block
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
  let parsedJson: any = null;
  if (jsonMatch) {
    try {
      parsedJson = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn(`Failed to parse JSON in ${file}`);
    }
  }

  // Extract metadata
  // First try JSON, then fallback to markdown headers/regex
  const mapId = file.replace('.md', '');

  let title = "Unknown Title";
  const titleMatch = content.match(/#\s*(.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  let era = "Unknown Era";
  const eraMatch = content.match(/\*\*Young Earth Dating:\*\*\s*(.+)/) || content.match(/Era:\s*(.+)/i) || content.match(/Young Earth Dating:\*\*\s*([^\n]+)/);
  if (eraMatch) {
    era = eraMatch[1].trim();
  } else if (parsedJson && parsedJson.annotations) {
    const titleCartouche = parsedJson.annotations.find((a: any) => a.type === 'title_cartouche');
    if (titleCartouche && titleCartouche.content) {
      const eMatch = titleCartouche.content.match(/c\.\s*\d+\s*(?:BC|AD)/i);
      if (eMatch) era = eMatch[0];
    }
  }

  // Derive chapter and lesson IDs
  let chapter_id = "";
  let lesson_id = "";
  const matchNum = mapId.match(/map_(\d+)/);
  if (matchNum) {
      const mNum = parseInt(matchNum[1], 10);
      let chNum = 1;

      // Simple heuristic mapping
      if (mNum >= 2 && mNum <= 3) chNum = 2;
      else if (mNum >= 4 && mNum <= 10) chNum = 3;
      else if (mNum >= 11 && mNum <= 15) chNum = 4;
      else if (mNum >= 16 && mNum <= 20) chNum = 5;
      else if (mNum >= 21 && mNum <= 25) chNum = 6;
      else if (mNum >= 26 && mNum <= 30) chNum = 7;
      else if (mNum >= 31 && mNum <= 34) chNum = 8;

      chapter_id = `ch${chNum.toString().padStart(2, '0')}`;
      lesson_id = `lesson_ch${chNum.toString().padStart(2, '0')}_s01`; // Defaulting to s01
  }

  let highlighted_regions: any[] = [];
  let settlements: any[] = [];
  let climate_zones: any[] = [];
  let trade_routes: any[] = [];
  let vegetation: any[] = [];

  if (parsedJson) {
    if (parsedJson.highlighted_regions) highlighted_regions = parsedJson.highlighted_regions;
    if (parsedJson.settlements) settlements = parsedJson.settlements;
    if (parsedJson.paths) {
       trade_routes = parsedJson.paths.filter((p: any) => p.type?.includes('trade') || p.type?.includes('route'));
    }
    // Very basic extraction from text if JSON missing
  } else {
     const regionsMatch = content.match(/Regions:\s*([\s\S]*?)(?=\n\n|\n[A-Z])/);
     if (regionsMatch) {
         highlighted_regions = regionsMatch[1].split(',').map(s => s.trim());
     }
  }

  mapManifest.push({
    id: mapId,
    filename: file,
    title,
    era,
    image_path: `assets/maps/${mapId}.png`,
    chapter_id,
    lesson_id,
    geographicFeatures: {
      highlighted_regions,
      settlements,
      climate_zones,
      trade_routes,
      vegetation
    }
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapManifest, null, 2));
console.log(`Map manifest written to ${OUTPUT_FILE} (${mapManifest.length} maps processed)`);
