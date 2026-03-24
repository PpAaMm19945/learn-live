import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'src/data/geojson');

function createFeatureCollection(features: any[]) {
  return {
    type: 'FeatureCollection',
    features,
  };
}

function createRegion(id: string, name: string, color: string, chapter: number, regionType: string, coordinates: number[][][]) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates,
    },
    properties: {
      id,
      name,
      color,
      chapter,
      type: regionType,
    },
  };
}

function createRoute(id: string, name: string, color: string, chapter: number, routeType: string, coordinates: number[][]) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates,
    },
    properties: {
      id,
      name,
      color,
      chapter,
      type: routeType,
    },
  };
}

function createMarker(id: string, name: string, chapter: number, markerType: string, coordinates: [number, number]) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates,
    },
    properties: {
      id,
      name,
      chapter,
      type: markerType,
    },
  };
}

// Chapter 2
const ch02Regions = [
  createRegion('upper_egypt', 'Upper Egypt', '#e8a87c', 2, 'region', [
    [
      [32.65, 24.0],
      [33.15, 24.0],
      [31.75, 29.8],
      [31.25, 29.8],
      [32.65, 24.0]
    ]
  ]),
  createRegion('lower_egypt', 'Lower Egypt', '#7cb8e8', 2, 'region', [
    [
      [31.25, 29.8],
      [32.5, 31.2],
      [29.5, 31.2],
      [31.25, 29.8]
    ]
  ]),
  createRegion('sinai', 'Sinai', '#d4a574', 2, 'territory', [
    [
      [32.5, 31.2],
      [34.5, 31.2],
      [34.5, 29.5],
      [34.2, 27.8],
      [32.5, 31.2]
    ]
  ]),
  createRegion('fayum', 'Fayum', '#8bc48a', 2, 'region', [
    [
      [30.4, 29.2],
      [31.0, 29.5],
      [30.8, 29.0],
      [30.4, 29.2]
    ]
  ])
];

const ch02Routes = [
  createRoute('hyksos_invasion', 'Hyksos Invasion', '#e85454', 2, 'conquest', [
    [34.0, 34.0],
    [31.0, 30.5]
  ]),
  createRoute('exodus_route', 'Exodus Route', '#f0c75e', 2, 'journey', [
    [31.8, 30.8],
    [32.5, 30.0],
    [33.5, 29.0]
  ]),
  createRoute('nile_trade', 'Nile Trade', '#5eaef0', 2, 'trade', [
    [31.25, 29.85],
    [32.65, 25.7],
    [32.9, 24.09]
  ])
];

const ch02Markers = [
  createMarker('memphis', 'Memphis', 2, 'city', [31.25, 29.85]),
  createMarker('thebes', 'Thebes (Luxor)', 2, 'city', [32.65, 25.7]),
  createMarker('amarna', 'Amarna', 2, 'city', [30.9, 27.65]),
  createMarker('alexandria', 'Alexandria', 2, 'city', [29.9, 31.2]),
  createMarker('pi_ramesses', 'Pi-Ramesses', 2, 'city', [31.8, 30.8]),
  createMarker('avaris', 'Avaris', 2, 'city', [31.82, 30.79]),
  createMarker('giza', 'Giza', 2, 'site', [31.13, 29.98]),
  createMarker('karnak', 'Karnak', 2, 'site', [32.66, 25.72])
];

// Chapter 3
const ch03Regions = [
  createRegion('kerma_kingdom', 'Kerma Kingdom', '#c47cb8', 3, 'kingdom', [
    [
      [30.4, 19.6],
      [31.4, 19.6],
      [32.0, 18.0],
      [31.0, 18.0],
      [30.4, 19.6]
    ]
  ]),
  createRegion('napata_kingdom', 'Napata Kingdom', '#7c8ec4', 3, 'kingdom', [
    [
      [31.6, 18.5],
      [32.6, 18.5],
      [33.0, 16.0],
      [32.0, 16.0],
      [31.6, 18.5]
    ]
  ]),
  createRegion('meroe_kingdom', 'Meroë Kingdom', '#c4b87c', 3, 'kingdom', [
    [
      [33.7, 17.0],
      [35.0, 17.0],
      [34.5, 14.0],
      [33.0, 14.0],
      [33.7, 17.0]
    ]
  ]),
  createRegion('egypt_25th_dynasty', 'Egypt (25th Dynasty)', '#b87cc4', 3, 'empire', [
    [ // roughly same as combined upper/lower egypt
      [32.65, 24.0],
      [33.15, 24.0],
      [31.75, 29.8],
      [32.5, 31.2],
      [29.5, 31.2],
      [31.25, 29.8],
      [32.65, 24.0]
    ]
  ])
];

const ch03Routes = [
  createRoute('kerma_napata_expansion', 'Kerma Expansion', '#c47cb8', 3, 'migration', [
    [30.4, 19.6],
    [31.6, 18.5]
  ]),
  createRoute('piye_conquest', 'Piye\'s Conquest', '#e85454', 3, 'conquest', [
    [31.6, 18.5],
    [32.65, 25.7],
    [31.25, 29.85]
  ]),
  createRoute('meroe_trade', 'Meroë Trade Routes', '#5eaef0', 3, 'trade', [
    [37.5, 19.0],
    [33.7, 16.9],
    [38.7, 14.1]
  ])
];

const ch03Markers = [
  createMarker('kerma', 'Kerma', 3, 'city', [30.4, 19.6]),
  createMarker('napata', 'Napata', 3, 'city', [31.6, 18.5]),
  createMarker('jebel_barkal', 'Jebel Barkal', 3, 'site', [31.6, 18.53]),
  createMarker('meroe', 'Meroë', 3, 'city', [33.7, 16.9]),
  createMarker('musawwarat', 'Musawwarat', 3, 'site', [33.3, 16.4]),
  createMarker('naga', 'Naga', 3, 'site', [33.3, 16.3])
];

// Chapter 4
const ch04Regions = [
  createRegion('phoenicia', 'Phoenicia', '#7cc4a8', 4, 'territory', [
    [
      [35.2, 33.0],
      [36.0, 33.0],
      [36.0, 35.0],
      [35.2, 35.0],
      [35.2, 33.0]
    ]
  ]),
  createRegion('carthaginian_territory', 'Carthaginian Territory', '#c47c7c', 4, 'empire', [
    [
      [10.0, 37.0],
      [11.0, 33.0],
      [20.0, 33.0],
      [10.0, 37.0] // simplified polygon
    ]
  ]),
  createRegion('carthaginian_iberia', 'Carthaginian Iberia', '#c49a7c', 4, 'territory', [
    [
      [-2.0, 37.0],
      [3.0, 37.0],
      [3.0, 40.0],
      [-2.0, 40.0],
      [-2.0, 37.0]
    ]
  ])
];

const ch04Routes = [
  createRoute('tyre_carthage', 'Founding of Carthage', '#7cc4a8', 4, 'journey', [
    [35.2, 33.27],
    [25.0, 33.0],
    [15.0, 34.0],
    [10.18, 36.85]
  ]),
  createRoute('hannibal_route', 'Hannibal\'s Route', '#e85454', 4, 'conquest', [
    [0.0, 39.0],
    [3.0, 42.0],
    [6.0, 45.0],
    [12.0, 42.0]
  ]),
  createRoute('punic_trade', 'Punic Trade Network', '#5eaef0', 4, 'trade', [
    [10.18, 36.85],
    [13.0, 37.5],
    [9.0, 40.0],
    [0.0, 38.0],
    [10.18, 36.85]
  ])
];

const ch04Markers = [
  createMarker('tyre', 'Tyre', 4, 'city', [35.2, 33.27]),
  createMarker('sidon', 'Sidon', 4, 'city', [35.37, 33.56]),
  createMarker('carthage', 'Carthage', 4, 'city', [10.18, 36.85]),
  createMarker('zama', 'Zama', 4, 'battle', [8.3, 36.3]),
  createMarker('leptis_magna', 'Leptis Magna', 4, 'city', [14.28, 32.64]),
  createMarker('byblos', 'Byblos', 4, 'city', [35.65, 34.12]),
  createMarker('utica', 'Utica', 4, 'city', [10.06, 37.06])
];

// Chapter 5
const ch05Regions = [
  createRegion('africa_proconsularis', 'Africa Proconsularis', '#c4a87c', 5, 'region', [
    [
      [8.0, 37.0],
      [12.0, 37.0],
      [12.0, 32.0],
      [8.0, 32.0],
      [8.0, 37.0]
    ]
  ]),
  createRegion('numidia', 'Numidia', '#a8c47c', 5, 'region', [
    [
      [6.0, 37.0],
      [8.0, 37.0],
      [8.0, 34.0],
      [6.0, 34.0],
      [6.0, 37.0]
    ]
  ]),
  createRegion('cyrenaica', 'Cyrenaica', '#7cc4c4', 5, 'region', [
    [
      [20.0, 33.0],
      [25.0, 33.0],
      [25.0, 30.0],
      [20.0, 30.0],
      [20.0, 33.0]
    ]
  ]),
  createRegion('roman_egypt', 'Roman Egypt', '#c48a7c', 5, 'region', [
    [
      [32.65, 24.0],
      [33.15, 24.0],
      [31.75, 29.8],
      [32.5, 31.2],
      [29.5, 31.2],
      [31.25, 29.8],
      [32.65, 24.0]
    ]
  ])
];

const ch05Routes = [
  createRoute('augustine_journey', 'Augustine\'s Journey', '#c47cb8', 5, 'journey', [
    [7.95, 36.28],
    [10.18, 36.85],
    [9.19, 45.46],
    [7.77, 36.90]
  ]),
  createRoute('gospel_spread', 'Spread of Gospel', '#f0c75e', 5, 'journey', [
    [29.9, 31.2],
    [21.85, 32.82],
    [10.18, 36.85]
  ])
];

const ch05Markers = [
  createMarker('carthage', 'Carthage', 5, 'city', [10.18, 36.85]),
  createMarker('hippo_regius', 'Hippo Regius', 5, 'city', [7.77, 36.90]),
  createMarker('thagaste', 'Thagaste', 5, 'city', [7.95, 36.28]),
  createMarker('alexandria', 'Alexandria', 5, 'city', [29.9, 31.2]),
  createMarker('cyrene', 'Cyrene', 5, 'city', [21.85, 32.82]),
  createMarker('madauros', 'Madauros', 5, 'city', [8.23, 36.38])
];

const toWrite = [
  { file: 'ch02_regions.json', data: createFeatureCollection(ch02Regions) },
  { file: 'ch02_routes.json', data: createFeatureCollection(ch02Routes) },
  { file: 'ch02_markers.json', data: createFeatureCollection(ch02Markers) },

  { file: 'ch03_regions.json', data: createFeatureCollection(ch03Regions) },
  { file: 'ch03_routes.json', data: createFeatureCollection(ch03Routes) },
  { file: 'ch03_markers.json', data: createFeatureCollection(ch03Markers) },

  { file: 'ch04_regions.json', data: createFeatureCollection(ch04Regions) },
  { file: 'ch04_routes.json', data: createFeatureCollection(ch04Routes) },
  { file: 'ch04_markers.json', data: createFeatureCollection(ch04Markers) },

  { file: 'ch05_regions.json', data: createFeatureCollection(ch05Regions) },
  { file: 'ch05_routes.json', data: createFeatureCollection(ch05Routes) },
  { file: 'ch05_markers.json', data: createFeatureCollection(ch05Markers) }
];

for (const { file, data } of toWrite) {
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(data, null, 2));
  console.log(`Wrote ${file}`);
}
