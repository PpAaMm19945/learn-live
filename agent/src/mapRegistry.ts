/**
 * Map Registry — Canonical mapping of R2 map assets to chapters/sections.
 * 
 * R2 bucket: learnlive-assets-prod
 * Map prefix: maps/ (NOT assets/maps/)
 * 
 * Each entry describes a map file in R2 with its geographic coverage,
 * relevant chapters, and a description the agent can use to decide
 * when to display it.
 */

export interface MapSpec {
  /** R2 key (relative to bucket root) */
  r2Key: string;
  /** Human-readable title */
  title: string;
  /** Geographic region covered */
  region: string;
  /** Time period / era */
  era: string;
  /** Chapters where this map is PRIMARY (shown by default) */
  primaryChapters: string[];
  /** Chapters where this map is RELEVANT (agent may choose to show it) */
  relevantChapters: string[];
  /** Description for the agent to understand what the map shows */
  description: string;
  /** Key locations/cities visible on this map */
  keyLocations: string[];
  /** Orientation: landscape maps need AutoScrollMap treatment */
  orientation: 'landscape' | 'portrait' | 'square';
}

/**
 * The canonical map registry. ONLY maps with confirmed PNG files in R2.
 * R2 path: learnlive-assets-prod/maps/map_XXX_*.png
 */
export const MAP_REGISTRY: MapSpec[] = [
  {
    r2Key: 'assets/maps/map_001_post_babel_dispersion.png',
    title: 'The Table of Nations — Sons of Noah',
    region: 'Ancient Near East & Northeast Africa',
    era: 'Post-Flood / Pre-Babel (~2348–2242 BC biblical chronology)',
    primaryChapters: ['ch01'],
    relevantChapters: ['ch02', 'ch04', 'ch08'],
    description: 'Shows the dispersion of Noah\'s three sons (Shem, Ham, Japheth) and their descendants across the ancient world. Highlights the Hamitic peoples — Mizraim (Egypt), Cush (Nubia/Ethiopia), Phut (Libya), and Canaan.',
    keyLocations: ['Babel/Shinar', 'Ararat', 'Canaan', 'Egypt/Mizraim', 'Cush', 'Phut', 'Mesopotamia'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_002_ancient_egypt_overview.png',
    title: 'Ancient Egypt — The Nile Kingdoms',
    region: 'Egypt & Nile Valley',
    era: 'Old Kingdom through Ptolemaic (~3100–30 BC)',
    primaryChapters: ['ch02'],
    relevantChapters: ['ch01', 'ch05', 'ch06'],
    description: 'The Nile Valley from the Delta to Upper Egypt and Nubia. Shows major cities, pyramids, and the geographic relationship between Lower Egypt (Delta) and Upper Egypt.',
    keyLocations: ['Memphis', 'Thebes', 'Alexandria', 'Nile Delta', 'Giza', 'Aswan', 'Nubia'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_004_north_africa_regional_overview.png',
    title: 'North Africa — Carthage, Numidia & the Desert Kingdoms',
    region: 'North Africa (modern Tunisia, Algeria, Libya)',
    era: 'Phoenician colonies through Roman conquest (~814–146 BC)',
    primaryChapters: ['ch03'],
    relevantChapters: ['ch05', 'ch02'],
    description: 'The lands of Phut — showing Carthage, Numidia, and the Berber/Amazigh territories. Illustrates the Phoenician trading network and Hannibal\'s domain.',
    keyLocations: ['Carthage', 'Numidia', 'Leptis Magna', 'Cyrene', 'Sahara', 'Strait of Gibraltar'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_015_meroe_red_sea_trade.png',
    title: 'The Lands of Cush — Nubia, Kush & Meroë',
    region: 'Upper Nile / Sudan / Ethiopia',
    era: 'Kingdom of Kush (~2500 BC–350 AD)',
    primaryChapters: ['ch04'],
    relevantChapters: ['ch02', 'ch07', 'ch09'],
    description: 'The Cushite kingdoms along the Upper Nile — Kerma, Napata, and Meroë. Shows the relationship between Kush and Egypt, the iron-smelting centers, and the trade routes.',
    keyLocations: ['Meroë', 'Napata', 'Kerma', 'Jebel Barkal', 'Axum', 'Nile cataracts'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_006_roman_north_africa.png',
    title: 'Roman Africa — Province & Church',
    region: 'North Africa under Rome',
    era: 'Roman period (~146 BC–430 AD)',
    primaryChapters: ['ch05'],
    relevantChapters: ['ch03', 'ch06'],
    description: 'Roman provinces of Africa Proconsularis, Numidia, Mauretania, and Cyrenaica. Shows the key cities of the early African church — Carthage, Hippo, Thagaste.',
    keyLocations: ['Hippo Regius', 'Thagaste', 'Carthage', 'Leptis Magna', 'Cyrene', 'Alexandria'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_007_roman_egypt.png',
    title: 'Alexandrian Egypt — Rome, Faith & Philosophy',
    region: 'Egypt under Rome',
    era: 'Roman & Byzantine Egypt (~30 BC–642 AD)',
    primaryChapters: ['ch06'],
    relevantChapters: ['ch02', 'ch05', 'ch07'],
    description: 'Egypt under Roman and Byzantine rule. Shows Alexandria as a center of Christian theology, the Catechetical School, the Desert Fathers, and the Coptic heartland.',
    keyLocations: ['Alexandria', 'Cairo/Fustat', 'Wadi Natrun', 'Scetis', 'Nitria', 'Oxyrhynchus'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_008_aksum_red_sea_trade.png',
    title: 'The Ethiopian Highlands — Aksum & the Solomonic Legacy',
    region: 'Horn of Africa / Ethiopian Highlands',
    era: 'Aksumite Kingdom (~100–940 AD)',
    primaryChapters: ['ch07'],
    relevantChapters: ['ch04', 'ch09', 'ch10'],
    description: 'The Aksumite Empire at its height — showing Aksum, Adulis (the Red Sea port), trade routes to India and Arabia, and the Ethiopian highlands.',
    keyLocations: ['Aksum', 'Adulis', 'Lalibela', 'Lake Tana', 'Gondar', 'Red Sea'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_003_bantu_migration_biblical_model.png',
    title: 'The Bantu Migrations',
    region: 'Sub-Saharan Africa',
    era: 'Bantu expansion (~1000 BC–1500 AD)',
    primaryChapters: ['ch08'],
    relevantChapters: ['ch04', 'ch10'],
    description: 'The great Bantu migration routes from the Niger-Congo homeland across central, eastern, and southern Africa. Shows the spread of iron-working, agriculture, and language families.',
    keyLocations: ['Niger-Benue confluence', 'Great Lakes', 'Congo Basin', 'Great Zimbabwe', 'Kilimanjaro'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_017_highland_monastic_centers_ethiopia.png',
    title: 'Ethiopia Alone — The Hidden Kingdom',
    region: 'Ethiopian Highlands & surrounds',
    era: 'Zagwe dynasty through Solomonic restoration (~940–1530 AD)',
    primaryChapters: ['ch09'],
    relevantChapters: ['ch07', 'ch10'],
    description: 'Medieval Ethiopia — isolated but enduring. Shows the rock-hewn churches of Lalibela, the Zagwe and Solomonic territories, Muslim sultanates on the coast.',
    keyLocations: ['Lalibela', 'Gondar', 'Harar', 'Ifat', 'Adal', 'Shewa'],
    orientation: 'landscape',
  },
  {
    r2Key: 'assets/maps/map_022_trans_saharan_trade_routes.png',
    title: 'Trade Winds & Stone Cities — The Swahili Coast',
    region: 'East African Coast & Indian Ocean',
    era: 'Swahili civilization (~800–1500 AD)',
    primaryChapters: ['ch10'],
    relevantChapters: ['ch08', 'ch09'],
    description: 'Trans-Saharan and Indian Ocean trade networks linking Africa to Arabia, Persia, India, and China. Shows monsoon wind patterns and gold/ivory trade routes.',
    keyLocations: ['Kilwa', 'Mombasa', 'Zanzibar', 'Great Zimbabwe', 'Mogadishu', 'Sofala', 'Timbuktu'],
    orientation: 'landscape',
  },
];

/**
 * Get the primary map for a chapter (shown by default when lesson starts).
 * Falls back to Map 001 (overview) if no primary is found.
 */
export function getPrimaryMapForChapter(chapterId: string): MapSpec {
  const primary = MAP_REGISTRY.find(m => m.primaryChapters.includes(chapterId));
  if (primary) return primary;
  return MAP_REGISTRY[0]; // fallback to ch01 overview
}

/**
 * Get all relevant maps for a chapter (primary + related).
 */
export function getRelevantMapsForChapter(chapterId: string): MapSpec[] {
  return MAP_REGISTRY.filter(
    m => m.primaryChapters.includes(chapterId) || m.relevantChapters.includes(chapterId)
  );
}

/**
 * Build a concise map context string for the agent's system prompt.
 */
export function buildMapContextForAgent(chapterId: string): string {
  const primary = getPrimaryMapForChapter(chapterId);
  const relevant = getRelevantMapsForChapter(chapterId).filter(m => m.r2Key !== primary.r2Key);

  let context = `\n═══════════════════════════════
MAP ASSETS AVAILABLE FOR THIS LESSON
═══════════════════════════════
PRIMARY MAP (shown by default when lesson starts — student is already looking at this):
  Title: "${primary.title}"
  R2 Key: ${primary.r2Key}
  Region: ${primary.region}
  Era: ${primary.era}
  Description: ${primary.description}
  Key Locations Visible: ${primary.keyLocations.join(', ')}

IMPORTANT: The primary map is ALREADY displayed as a slowly auto-scrolling landscape image when the lesson begins. The student can see it. You do NOT need to call set_scene("image") for this map — it's already there.

When you want to INTERACT with the map (zoom, mark cities, draw routes), call set_scene("map") to switch to the interactive MapLibre view, then use zoom_to, place_marker, draw_route, etc.

To show a DIFFERENT map image, use: set_scene("image", imageUrl="${primary.r2Key}", caption="...")
`;

  if (relevant.length > 0) {
    context += `\nADDITIONAL MAPS AVAILABLE (use set_scene("image") to show these):`;
    for (const m of relevant) {
      context += `\n  - "${m.title}" (${m.r2Key}): ${m.description.slice(0, 120)}...`;
      context += `\n    Locations: ${m.keyLocations.join(', ')}`;
    }
  }

  context += `\n\nMAP USAGE RULES:
1. The primary map auto-scrolls on screen from lesson start — reference it in your narration ("As you can see on the map before you...")
2. Use set_scene("image", imageUrl) to swap to a different map when the topic shifts geographically.
3. Use set_scene("map") + zoom_to + place_marker for interactive exploration.
4. After interactive map work, use set_scene("transcript") briefly, then the primary map auto-restores.
5. NEVER leave a blank or loading map on screen. Always have visual content.
`;

  return context;
}
