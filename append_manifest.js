import fs from 'fs';
import path from 'path';

const manifestPath = 'docs/curriculum/history/Maps/overlays/alignment-manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (let i = 6; i <= 10; i++) {
  const numStr = i.toString().padStart(3, '0');
  manifest.push({
    mapId: `map_${numStr}`,
    pngPath: `docs/curriculum/history/Maps/Maps/Map ${numStr}.png`,
    svgPath: `docs/curriculum/history/Maps/overlays/map_${numStr}_overlay.svg`,
    transform: {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      rotate: 0
    },
    status: "draft",
    notes: "Initial generation. Needs manual alignment with alignment tool."
  });
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
