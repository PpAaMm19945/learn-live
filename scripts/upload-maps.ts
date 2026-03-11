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
  geographicFeatures: {
    highlighted_regions: any[];
    settlements: any[];
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
  const eraMatch = content.match(/\*\*Young Earth Dating:\*\*\s*(.+)/) || content.match(/Era:\s*(.+)/i);
  if (eraMatch) {
    era = eraMatch[1].trim();
  } else if (parsedJson && parsedJson.annotations) {
    const titleCartouche = parsedJson.annotations.find((a: any) => a.type === 'title_cartouche');
    if (titleCartouche && titleCartouche.content) {
      const eMatch = titleCartouche.content.match(/c\.\s*\d+\s*(?:BC|AD)/i);
      if (eMatch) era = eMatch[0];
    }
  }

  let highlighted_regions: any[] = [];
  let settlements: any[] = [];

  if (parsedJson) {
    if (parsedJson.highlighted_regions) highlighted_regions = parsedJson.highlighted_regions;
    if (parsedJson.settlements) settlements = parsedJson.settlements;
  }

  mapManifest.push({
    id: mapId,
    filename: file,
    title,
    era,
    geographicFeatures: {
      highlighted_regions,
      settlements
    }
  });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapManifest, null, 2));
console.log(`Map manifest written to ${OUTPUT_FILE} (${mapManifest.length} maps processed)`);
