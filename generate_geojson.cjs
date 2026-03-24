const fs = require('fs');

const ch06Regions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[36, 16], [42, 16], [42, 12], [36, 12], [36, 16]]] },
      properties: { id: "aksumite_empire", name: "Aksumite Empire", color: "#c4a87c", chapter: 6, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[43, 16], [46, 16], [46, 13], [43, 13], [43, 16]]] },
      properties: { id: "himyarite_yemen", name: "Himyarite Yemen", color: "#a87cc4", chapter: 6, type: "territory" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[39, 15.5], [43, 15.5], [43, 11], [39, 11], [39, 15.5]]] },
      properties: { id: "adulis_trade_zone", name: "Adulis Trade Zone", color: "#7cc4c4", chapter: 6, type: "region" }
    }
  ]
};

const ch06Routes = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[39.66, 15.37], [45.0, 12.0], [55.0, 12.0]] },
      properties: { id: "red_sea_trade", name: "Red Sea Trade", color: "#5eaef0", chapter: 6, type: "trade" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[35.2, 33.27], [35.0, 25.0], [39.66, 15.37], [38.72, 14.13]] },
      properties: { id: "frumentius_journey", name: "Frumentius' Journey", color: "#f0c75e", chapter: 6, type: "journey" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[38.72, 14.13], [39.66, 15.37], [43.0, 14.0]] },
      properties: { id: "aksum_yemen_campaign", name: "Aksum-Yemen Campaign", color: "#e85454", chapter: 6, type: "conquest" }
    }
  ]
};

const ch06Markers = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [38.72, 14.13] }, properties: { id: "aksum", name: "Aksum", chapter: 6, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.66, 15.37] }, properties: { id: "adulis", name: "Adulis", chapter: 6, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.04, 12.03] }, properties: { id: "lalibela", name: "Lalibela", chapter: 6, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [37.47, 12.6] }, properties: { id: "gondar", name: "Gondar", chapter: 6, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.02, 14.28] }, properties: { id: "yeha", name: "Yeha", chapter: 6, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.5, 14.7] }, properties: { id: "matara", name: "Matara", chapter: 6, type: "city" } }
  ]
};

const ch07Regions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[28.0, 31.5], [32.0, 31.5], [34.0, 31.0], [34.0, 29.0], [35.0, 29.0], [35.0, 28.0], [34.0, 28.0], [34.0, 24.0], [28.0, 24.0], [28.0, 31.5]]] },
      properties: { id: "rashidun_umayyad_egypt", name: "Rashidun/Umayyad Egypt", color: "#7cc48a", chapter: 7, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[-8, 37], [25, 37], [25, 30], [-8, 30], [-8, 37]]] },
      properties: { id: "maghreb_conquest", name: "Maghreb Conquest", color: "#8ac47c", chapter: 7, type: "territory" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[10, 35], [34, 35], [34, 25], [10, 25], [10, 35]]] },
      properties: { id: "fatimid_caliphate", name: "Fatimid Caliphate", color: "#c4c47c", chapter: 7, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[-15, 38], [0, 38], [0, 20], [-15, 20], [-15, 38]]] },
      properties: { id: "almoravid_empire", name: "Almoravid Empire", color: "#c4a87c", chapter: 7, type: "empire" }
    }
  ]
};

const ch07Routes = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[40, 25], [31.23, 30.05], [10.1, 35.67], [5.0, 34.03], [-4.78, 37.88]] },
      properties: { id: "arab_conquest", name: "Arab Conquest", color: "#e85454", chapter: 7, type: "conquest" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[-4.28, 31.28], [-3.0, 16.77], [-7.97, 15.77]] },
      properties: { id: "trans_saharan_trade", name: "Trans-Saharan Trade", color: "#f0c75e", chapter: 7, type: "trade" }
    }
  ]
};

const ch07Markers = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [31.23, 30.05] }, properties: { id: "fustat_cairo", name: "Fustat/Cairo", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [10.1, 35.67] }, properties: { id: "kairouan", name: "Kairouan", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [5.0, 34.03] }, properties: { id: "fez", name: "Fez", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-8.0, 31.63] }, properties: { id: "marrakesh", name: "Marrakesh", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-3.0, 16.77] }, properties: { id: "timbuktu", name: "Timbuktu", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-4.78, 37.88] }, properties: { id: "cordoba", name: "Córdoba", chapter: 7, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-4.28, 31.28] }, properties: { id: "sijilmasa", name: "Sijilmasa", chapter: 7, type: "city" } }
  ]
};

const ch08Regions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[7, 8], [12, 8], [12, 4], [7, 4], [7, 8]]] },
      properties: { id: "bantu_homeland", name: "Bantu Homeland", color: "#c47c7c", chapter: 8, type: "region" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[28, 2], [35, 2], [35, -4], [28, -4], [28, 2]]] },
      properties: { id: "urewe_culture", name: "Urewe Culture Zone", color: "#7c8ec4", chapter: 8, type: "region" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[25, -15], [35, -15], [35, -25], [25, -25], [25, -15]]] },
      properties: { id: "southern_expansion", name: "Southern Expansion", color: "#7cc4a8", chapter: 8, type: "region" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[15, -20], [30, -20], [30, -35], [15, -35], [15, -20]]] },
      properties: { id: "khoisan_territory", name: "Khoisan Territory", color: "#e8c87c", chapter: 8, type: "territory" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[15, 5], [30, 5], [30, -5], [15, -5], [15, 5]]] },
      properties: { id: "congo_basin", name: "Congo Basin", color: "#4a8c5e", chapter: 8, type: "region" }
    }
  ]
};

const ch08Routes = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[10, 6], [25, 2], [30, 0], [33, -2], [35, -6], [35, -10]] },
      properties: { id: "eastern_stream", name: "Eastern Stream", color: "#7c8ec4", chapter: 8, type: "migration" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[10, 6], [15, 2], [18, -2], [20, -5], [22, -8]] },
      properties: { id: "western_stream", name: "Western Stream", color: "#c47c7c", chapter: 8, type: "migration" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[33, -6], [33, -10], [32, -15], [30, -20], [28, -24]] },
      properties: { id: "southern_stream", name: "Southern Stream", color: "#7cc4a8", chapter: 8, type: "migration" }
    }
  ]
};

const ch08Markers = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [7.5, 9.5] }, properties: { id: "nok_region", name: "Nok Region", chapter: 8, type: "site" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [30.9, -20.3] }, properties: { id: "great_zimbabwe_precursor", name: "Great Zimbabwe (precursor)", chapter: 8, type: "site" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [33.0, -1.0] }, properties: { id: "lake_victoria", name: "Lake Victoria", chapter: 8, type: "site" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [30.0, -23.5] }, properties: { id: "limpopo_river", name: "Limpopo River", chapter: 8, type: "site" } }
  ]
};

const ch09Regions = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[-15, 18], [-5, 18], [-5, 12], [-15, 12], [-15, 18]]] },
      properties: { id: "ghana_empire", name: "Ghana Empire", color: "#c4a87c", chapter: 9, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[-15, 20], [5, 20], [5, 10], [-15, 10], [-15, 20]]] },
      properties: { id: "mali_empire", name: "Mali Empire", color: "#e8c87c", chapter: 9, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[-5, 20], [10, 20], [10, 12], [-5, 12], [-5, 20]]] },
      properties: { id: "songhai_empire", name: "Songhai Empire", color: "#c48a7c", chapter: 9, type: "empire" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[28, -18], [33, -18], [33, -22], [28, -22], [28, -18]]] },
      properties: { id: "great_zimbabwe", name: "Great Zimbabwe", color: "#7c8ec4", chapter: 9, type: "kingdom" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[38, 2], [42, 2], [40, -20], [36, -20], [38, 2]]] },
      properties: { id: "swahili_coast", name: "Swahili Coast", color: "#7cc4c4", chapter: 9, type: "region" }
    },
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[10, 15], [18, 15], [18, 10], [10, 10], [10, 15]]] },
      properties: { id: "kanem_bornu", name: "Kanem-Bornu", color: "#a8c47c", chapter: 9, type: "empire" }
    }
  ]
};

const ch09Routes = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[-4.28, 31.28], [-3.0, 16.77], [-4.55, 13.91]] },
      properties: { id: "gold_salt_trade", name: "Gold-Salt Trade", color: "#f0c75e", chapter: 9, type: "trade" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[39.52, -8.96], [45.34, 2.05], [55.0, 15.0]] },
      properties: { id: "indian_ocean_trade", name: "Indian Ocean Trade", color: "#5eaef0", chapter: 9, type: "trade" }
    },
    {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [[-11.42, 11.42], [-3.0, 16.77], [31.23, 30.05], [39.83, 21.42]] },
      properties: { id: "mansa_musa_hajj", name: "Mansa Musa's Hajj", color: "#c47cb8", chapter: 9, type: "journey" }
    }
  ]
};

const ch09Markers = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", geometry: { type: "Point", coordinates: [-7.97, 15.77] }, properties: { id: "koumbi_saleh", name: "Koumbi Saleh", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-11.42, 11.42] }, properties: { id: "niani", name: "Niani", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [0.08, 16.27] }, properties: { id: "gao", name: "Gao", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-3.0, 16.77] }, properties: { id: "timbuktu", name: "Timbuktu", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [-4.55, 13.91] }, properties: { id: "djenne", name: "Djenné", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [30.93, -20.27] }, properties: { id: "great_zimbabwe", name: "Great Zimbabwe", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.52, -8.96] }, properties: { id: "kilwa", name: "Kilwa", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [34.74, -20.15] }, properties: { id: "sofala", name: "Sofala", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [45.34, 2.05] }, properties: { id: "mogadishu", name: "Mogadishu", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [39.66, -4.05] }, properties: { id: "mombasa", name: "Mombasa", chapter: 9, type: "city" } },
    { type: "Feature", geometry: { type: "Point", coordinates: [17.0, 13.0] }, properties: { id: "njimi", name: "Njimi", chapter: 9, type: "city" } }
  ]
};

const writeJson = (filename, data) => {
  fs.writeFileSync(`src/data/geojson/${filename}.json`, JSON.stringify(data, null, 2));
};

writeJson('ch06_regions', ch06Regions);
writeJson('ch06_routes', ch06Routes);
writeJson('ch06_markers', ch06Markers);
writeJson('ch07_regions', ch07Regions);
writeJson('ch07_routes', ch07Routes);
writeJson('ch07_markers', ch07Markers);
writeJson('ch08_regions', ch08Regions);
writeJson('ch08_routes', ch08Routes);
writeJson('ch08_markers', ch08Markers);
writeJson('ch09_regions', ch09Regions);
writeJson('ch09_routes', ch09Routes);
writeJson('ch09_markers', ch09Markers);
