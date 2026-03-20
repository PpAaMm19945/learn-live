const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'docs/curriculum/history/Maps/overlays/alignment-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const batchCMaps = ['011', '012', '013', '014', '015'];

batchCMaps.forEach(num => {
  manifest.push({
    mapId: `map_${num}`,
    pngPath: `docs/curriculum/history/Maps/Maps/Map ${num}.png`,
    svgPath: `docs/curriculum/history/Maps/overlays/map_${num}_overlay.svg`,
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
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Appended Batch C to manifest.');
