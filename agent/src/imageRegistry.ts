/**
 * ImageRegistry — Catalog of all verified images in the R2 bucket.
 * Used to inject available illustration assets into the agent system prompt.
 *
 * R2 bucket: learnlive-assets-prod
 * Key prefixes:
 *   assets/images/       — encyclopedia-style illustrations
 *   assets/storybook/    — generated storybook illustrations per chapter/band
 */

export interface ImageEntry {
  /** Exact R2 key (e.g. "assets/images/Narmer_Palette.jpg") */
  r2Key: string;
  /** Short human-readable description */
  description: string;
  /** Which chapters this image is relevant to */
  chapters: string[];
  /** Category for filtering */
  category: 'illustration' | 'storybook';
  /** Minimum band where this is appropriate (0 = all) */
  minBand: number;
  /** Maximum band where this is appropriate (5 = all) */
  maxBand: number;
}

export const IMAGE_REGISTRY: ImageEntry[] = [
  // ──────────────────────────────────────────────
  // Encyclopedia / reference illustrations
  // ──────────────────────────────────────────────
  { r2Key: 'assets/images/Narmer_Palette.jpg', description: 'The Narmer Palette — unification of Upper and Lower Egypt', chapters: ['ch01', 'ch02'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/Rosetta_Stone.jpg', description: 'The Rosetta Stone', chapters: ['ch02'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch02_narmer_palette.jpg', description: 'The Narmer Palette (chapter 2 copy)', chapters: ['ch02'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch02_rosetta_stone.jpg', description: 'The Rosetta Stone (high-res, chapter 2)', chapters: ['ch02'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch02_ipuwer_papyrus.jpg', description: 'The Ipuwer Papyrus — possible parallel to the Exodus plagues', chapters: ['ch02'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch03_leptis_magna_arch.jpg', description: 'Arch of Septimius Severus at Leptis Magna', chapters: ['ch03'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch03_tassili_rock_art.jpg', description: 'Tassili n\'Ajjer rock art — prehistoric Saharan paintings', chapters: ['ch03'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch04_aksumite_coin.jpg', description: 'Aksumite coin', chapters: ['ch04'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch05_augustine_manuscript.jpg', description: 'Augustine manuscript page', chapters: ['ch05'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch05_perpetua_martyrdom.jpg', description: 'Perpetua\'s martyrdom', chapters: ['ch05'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch05_vandal_coin.jpg', description: 'Vandal coin from North Africa', chapters: ['ch05'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch06_coptic_manuscript.jpg', description: 'Coptic manuscript', chapters: ['ch06'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch06_philae_temple.jpg', description: 'Temple of Philae — last hieroglyphic inscription', chapters: ['ch06'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_aksum_obelisk.jpg', description: 'Aksum obelisk (stelae)', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_debre_damo.jpg', description: 'Debre Damo monastery', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_ezana_coin.jpg', description: 'Coin of King Ezana', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_ezana_stone.jpg', description: 'Ezana Stone inscription', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_geez_manuscript.jpg', description: 'Ge\'ez manuscript', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_kaleb_invasion_map.jpg', description: 'King Kaleb\'s invasion of Himyar map', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_philip_eunuch_icon.jpg', description: 'Philip and the Ethiopian eunuch icon', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch07_red_sea_winds_map.jpg', description: 'Red Sea trade winds map', chapters: ['ch07'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch08_nok_terracotta.jpg', description: 'Nok terracotta head sculpture', chapters: ['ch08'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch08_urewe_pottery.jpg', description: 'Urewe pottery — early Bantu ironworking', chapters: ['ch08'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch09_geez_manuscript.jpg', description: 'Ge\'ez manuscript (Zagwe era)', chapters: ['ch09'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch09_highland_shift_map.jpg', description: 'Highland shift map — Aksumite to Zagwe transition', chapters: ['ch09'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/ch09_lalibela_church.jpg', description: 'Rock-hewn church of Lalibela', chapters: ['ch09'], category: 'illustration', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/images/church_of_saint_george.jpg', description: 'Church of Saint George, Lalibela (aerial view)', chapters: ['ch09'], category: 'illustration', minBand: 0, maxBand: 5 },

  // ──────────────────────────────────────────────
  // Storybook — Chapter 1, Band 0
  // ──────────────────────────────────────────────
  { r2Key: 'assets/storybook/ch01/band0_page01.jpg', description: 'God creating the world — creation scene', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page02.jpg', description: 'The Fall of Man — Adam and Eve', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page03.jpg', description: 'The Tower of Babel — people building the tower', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page04.jpg', description: 'The promise of redemption — protoevangelium', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page05.jpg', description: 'Noah\'s Ark and the Flood', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page06.jpg', description: 'The sons of Noah — Shem, Ham, and Japheth', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page07.jpg', description: 'The scattering of nations from Babel', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band0_page08.jpg', description: 'The sons of Ham — founders of African civilizations', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },

  // Storybook — Chapter 1, Band 1
  { r2Key: 'assets/storybook/ch01/band1_page01.jpg', description: 'Creation — illustrated for Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page02.jpg', description: 'The Garden of Eden — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page03.jpg', description: 'The Fall — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page04.jpg', description: 'Cain and Abel — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page05.jpg', description: 'Noah and the Flood — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page06.jpg', description: 'The covenant rainbow — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page07.jpg', description: 'Table of Nations — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page08.jpg', description: 'Tower of Babel — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page09.jpg', description: 'The scattering — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page10.jpg', description: 'Mizraim settles Egypt — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page11.jpg', description: 'Cush settles Nubia — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page12.jpg', description: 'Phut settles Libya — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page13.jpg', description: 'Canaan settles the coast — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page14.jpg', description: 'God\'s plan for the nations — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
  { r2Key: 'assets/storybook/ch01/band1_page15.jpg', description: 'Looking ahead to Africa\'s story — Band 1', chapters: ['ch01'], category: 'storybook', minBand: 0, maxBand: 5 },
];

/**
 * Build a prompt block listing available images for a given chapter and band.
 * Injected into the agent system instruction alongside map context.
 */
export function buildImageContextForAgent(chapterId: string, band: number): string {
  const relevant = IMAGE_REGISTRY.filter(
    (img) => img.chapters.includes(chapterId) && band >= img.minBand && band <= img.maxBand
  );

  if (relevant.length === 0) {
    return '\nILLUSTRATION ASSETS: None available for this chapter/band.\n';
  }

  const lines = relevant.map(
    (img) => `  - ${img.r2Key} — "${img.description}" [${img.category}]`
  );

  return `
ILLUSTRATION ASSETS AVAILABLE (${relevant.length} images):
${lines.join('\n')}

To display an illustration, use:
  set_scene("image", imageUrl="<r2Key from list above>")
Use the EXACT r2Key values listed. Do NOT invent filenames.
For Bands 0-1, prefer storybook images. For Bands 2+, prefer illustration images when available.
`;
}
