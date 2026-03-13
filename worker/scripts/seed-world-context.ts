import fs from 'fs';
import path from 'path';

const OUTPUT_FILE = path.join(process.cwd(), 'scripts/output/seed_world_context.sql');
const SEED_OUTPUT_FILE = path.join(process.cwd(), 'db/seeds/seed_world_context.sql');

const worldContextData = [
  // Chapter 1: The Cradle of Humankind (c. 300,000 BCE - 10,000 BCE)
  {
    chapter_id: 'topic_ch01',
    events: [
      {
        region: 'Europe',
        title: 'Neanderthals in Europe',
        description: 'Neanderthals, a distinct species of hominid, populate Europe and parts of Asia, eventually overlapping and interbreeding with early Homo sapiens before going extinct around 40,000 BCE.',
        start_year: -300000,
        end_year: -40000,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Migration into Asia',
        description: 'Early human populations begin their migration out of Africa, reaching the Middle East and expanding into South Asia and the Far East, adapting to diverse climates.',
        start_year: -70000,
        end_year: -50000,
        display_order: 2
      },
      {
        region: 'Americas',
        title: 'Peopling of the Americas',
        description: 'Hunter-gatherer groups cross the Bering Land Bridge from Siberia into North America during the last Ice Age, becoming the first human inhabitants of the Americas.',
        start_year: -20000,
        end_year: -15000,
        display_order: 3
      }
    ]
  },
  // Chapter 2: Ancient Egypt (c. 3100 BCE - 332 BCE)
  {
    chapter_id: 'topic_ch02',
    events: [
      {
        region: 'Middle East',
        title: 'Sumerian Civilization',
        description: 'The Sumerians in Mesopotamia develop cuneiform writing, construct ziggurats, and establish early city-states like Uruk, contemporaneous with early Egyptian dynasties.',
        start_year: -3500,
        end_year: -2000,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Indus Valley Civilization flourishes',
        description: 'A sophisticated bronze-age civilization with advanced urban planning and drainage systems thrives along the Indus River in modern-day Pakistan and northwest India.',
        start_year: -2600,
        end_year: -1900,
        display_order: 2
      },
      {
        region: 'Europe',
        title: 'Minoan civilization on Crete',
        description: 'The Minoans build palace complexes like Knossos on the island of Crete, developing a distinct culture and trade network across the Mediterranean.',
        start_year: -2700,
        end_year: -1450,
        display_order: 3
      },
      {
        region: 'Asia',
        title: 'Shang Dynasty in China',
        description: 'The Shang Dynasty establishes the first recorded Chinese state, characterized by advanced bronze work, oracle bone script, and complex social structures.',
        start_year: -1600,
        end_year: -1046,
        display_order: 4
      }
    ]
  },
  // Chapter 3: The Kingdom of Kush (c. 1070 BCE - 350 CE)
  {
    chapter_id: 'topic_ch03',
    events: [
      {
        region: 'Europe',
        title: 'Classical Greece',
        description: 'Greek city-states like Athens and Sparta rise to prominence, developing democracy, philosophy, and classical art, culminating in the golden age of Athens.',
        start_year: -500,
        end_year: -323,
        display_order: 1
      },
      {
        region: 'Middle East',
        title: 'Achaemenid Persian Empire',
        description: 'Cyrus the Great founds the first Persian Empire, becoming one of the largest empires in history, connecting diverse regions from the Indus Valley to the Balkans.',
        start_year: -550,
        end_year: -330,
        display_order: 2
      },
      {
        region: 'Europe',
        title: 'Rise of the Roman Republic',
        description: 'Rome transitions from a kingdom to a republic, expanding its control over the Italian peninsula and beginning its rise as a dominant Mediterranean power.',
        start_year: -509,
        end_year: -27,
        display_order: 3
      },
      {
        region: 'Asia',
        title: 'Mauryan Empire in India',
        description: 'Chandragupta Maurya unifies much of the Indian subcontinent, and his grandson Ashoka promotes Buddhism and establishes vast administrative reforms.',
        start_year: -322,
        end_year: -185,
        display_order: 4
      }
    ]
  },
  // Chapter 4: The Kingdom of Aksum (c. 100 CE - 940 CE)
  {
    chapter_id: 'topic_ch04',
    events: [
      {
        region: 'Europe',
        title: 'Roman Empire at its Peak',
        description: 'The Roman Empire reaches its maximum territorial extent under Emperor Trajan, encompassing the Mediterranean basin, Europe, and parts of the Middle East.',
        start_year: 98,
        end_year: 117,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Han Dynasty in China',
        description: 'The Eastern Han Dynasty experiences a period of economic prosperity, technological advancements (like papermaking), and the expansion of the Silk Road trade network.',
        start_year: 25,
        end_year: 220,
        display_order: 2
      },
      {
        region: 'Middle East',
        title: 'Sasanian Empire',
        description: 'The Sasanian Empire emerges as a major world power in Persia, engaging in prolonged conflicts with the Roman and Byzantine empires while fostering Zoroastrianism.',
        start_year: 224,
        end_year: 651,
        display_order: 3
      },
      {
        region: 'Americas',
        title: 'Classic Maya Period',
        description: 'The Maya civilization in Mesoamerica reaches its zenith, characterized by large-scale urban centers, monumental architecture, and advancements in mathematics and astronomy.',
        start_year: 250,
        end_year: 900,
        display_order: 4
      }
    ]
  },
  // Chapter 5: The Empire of Ghana (c. 300 CE - 1200 CE)
  {
    chapter_id: 'topic_ch05',
    events: [
      {
        region: 'Europe',
        title: 'Early Middle Ages',
        description: 'Following the fall of the Western Roman Empire, Europe experiences a period of political fragmentation, the rise of the Franks, and the spread of Christianity.',
        start_year: 476,
        end_year: 1000,
        display_order: 1
      },
      {
        region: 'Middle East',
        title: 'Rise of Islam and the Caliphates',
        description: 'Islam is founded by the Prophet Muhammad, leading to the rapid expansion of the Rashidun, Umayyad, and Abbasid caliphates across the Middle East, North Africa, and Spain.',
        start_year: 610,
        end_year: 1258,
        display_order: 2
      },
      {
        region: 'Asia',
        title: 'Tang Dynasty in China',
        description: 'The Tang Dynasty is considered a golden age of Chinese cosmopolitan culture, characterized by military expansion, flourishing poetry, and vibrant trade along the Silk Road.',
        start_year: 618,
        end_year: 907,
        display_order: 3
      },
      {
        region: 'Americas',
        title: 'Mississippian Culture',
        description: 'A mound-building Native American civilization flourishes in the Midwestern, Eastern, and Southeastern United States, centering around the major city of Cahokia.',
        start_year: 800,
        end_year: 1600,
        display_order: 4
      }
    ]
  },
  // Chapter 6: The Mali Empire (c. 1230 CE - 1600 CE)
  {
    chapter_id: 'topic_ch06',
    events: [
      {
        region: 'Asia',
        title: 'Mongol Empire',
        description: 'Genghis Khan and his successors conquer vast territories, creating the largest contiguous land empire in history, stretching from Eastern Europe to East Asia.',
        start_year: 1206,
        end_year: 1368,
        display_order: 1
      },
      {
        region: 'Europe',
        title: 'The Black Death',
        description: 'A devastating global epidemic of bubonic plague strikes Europe and Asia, resulting in the death of an estimated 75 to 200 million people and reshaping medieval society.',
        start_year: 1346,
        end_year: 1353,
        display_order: 2
      },
      {
        region: 'Americas',
        title: 'Rise of the Aztec Empire',
        description: 'The Mexica people establish the city of Tenochtitlan and form the Triple Alliance, dominating central Mexico through military conquest and a complex tribute system.',
        start_year: 1325,
        end_year: 1521,
        display_order: 3
      },
      {
        region: 'Europe',
        title: 'Italian Renaissance begins',
        description: 'A period of intense cultural, artistic, political, and economic "rebirth" begins in Italy, marking the transition from the Middle Ages to modernity.',
        start_year: 1300,
        end_year: 1600,
        display_order: 4
      }
    ]
  },
  // Chapter 7: The Songhai Empire (c. 1464 CE - 1591 CE)
  {
    chapter_id: 'topic_ch07',
    events: [
      {
        region: 'Europe',
        title: 'Age of Discovery',
        description: 'European nations, led by Portugal and Spain, begin global exploration, establishing new maritime trade routes and encountering the Americas.',
        start_year: 1400,
        end_year: 1600,
        display_order: 1
      },
      {
        region: 'Americas',
        title: 'Inca Empire at its peak',
        description: 'The Inca Empire, centered in the Andes, becomes the largest empire in pre-Columbian America, known for its monumental architecture and extensive road network.',
        start_year: 1438,
        end_year: 1533,
        display_order: 2
      },
      {
        region: 'Middle East',
        title: 'Ottoman Empire expands',
        description: 'The Ottoman Empire captures Constantinople in 1453, ending the Byzantine Empire, and expands its control over Southeast Europe, Western Asia, and North Africa.',
        start_year: 1453,
        end_year: 1566,
        display_order: 3
      },
      {
        region: 'Europe',
        title: 'Protestant Reformation',
        description: 'Martin Luther publishes his Ninety-five Theses, sparking a major religious and political upheaval that splinters Catholic Europe and leads to the formation of Protestantism.',
        start_year: 1517,
        end_year: 1648,
        display_order: 4
      }
    ]
  },
  // Chapter 8: The Swahili Coast (c. 8th Century CE - 16th Century CE)
  {
    chapter_id: 'topic_ch08',
    events: [
      {
        region: 'Asia',
        title: 'Chola Dynasty in India',
        description: 'The Tamil Chola dynasty reaches its height, dominating the Indian Ocean trade, conducting naval campaigns in Southeast Asia, and building magnificent Hindu temples.',
        start_year: 850,
        end_year: 1279,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Srivijaya Empire',
        description: 'A maritime and commercial kingdom flourishes in Indonesia, controlling the Strait of Malacca and serving as a major center for Buddhist expansion.',
        start_year: 650,
        end_year: 1377,
        display_order: 2
      },
      {
        region: 'Middle East',
        title: 'The Crusades',
        description: 'A series of religious wars initiated by the Latin Church in the medieval period, primarily aimed at recovering the Holy Land from Islamic rule.',
        start_year: 1095,
        end_year: 1291,
        display_order: 3
      },
      {
        region: 'Asia',
        title: 'Zheng He\'s Voyages',
        description: 'Ming dynasty admiral Zheng He leads seven epic naval expeditions across the Indian Ocean, reaching Southeast Asia, India, the Middle East, and the East African coast.',
        start_year: 1405,
        end_year: 1433,
        display_order: 4
      }
    ]
  },
  // Chapter 9: Great Zimbabwe (c. 11th Century CE - 15th Century CE)
  {
    chapter_id: 'topic_ch09',
    events: [
      {
        region: 'Europe',
        title: 'High Middle Ages',
        description: 'Europe experiences significant population growth, the rise of the first universities, the building of great Gothic cathedrals, and increased urbanization.',
        start_year: 1000,
        end_year: 1300,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Kamakura Shogunate in Japan',
        description: 'Japan transitions to a feudal military government under the Kamakura shogunate, marked by the rise of the samurai class and repelling Mongol invasions.',
        start_year: 1185,
        end_year: 1333,
        display_order: 2
      },
      {
        region: 'Middle East',
        title: 'Ayyubid Dynasty',
        description: 'Saladin founds the Ayyubid dynasty, uniting Egypt and Syria, and famously recaptures Jerusalem from the Crusaders in 1187.',
        start_year: 1171,
        end_year: 1260,
        display_order: 3
      },
      {
        region: 'Americas',
        title: 'Puebloan Culture in North America',
        description: 'Ancestral Puebloans build complex cliff dwellings and large great houses, such as those at Chaco Canyon and Mesa Verde, in the American Southwest.',
        start_year: 900,
        end_year: 1300,
        display_order: 4
      }
    ]
  },
  // Chapter 10: The Kongo Kingdom (c. 1390 CE - 1914 CE)
  {
    chapter_id: 'topic_ch10',
    events: [
      {
        region: 'Europe',
        title: 'Scientific Revolution',
        description: 'A series of events marks the emergence of modern science, fundamentally transforming societal views about nature with figures like Copernicus, Galileo, and Newton.',
        start_year: 1543,
        end_year: 1687,
        display_order: 1
      },
      {
        region: 'Asia',
        title: 'Tokugawa Shogunate',
        description: 'Japan enters a period of prolonged peace and stability, accompanied by strict isolationist policies (Sakoku), economic growth, and cultural flourishing.',
        start_year: 1603,
        end_year: 1868,
        display_order: 2
      },
      {
        region: 'Americas',
        title: 'European Colonization of the Americas',
        description: 'European powers establish widespread colonies across North and South America, profoundly disrupting indigenous societies and creating new transatlantic trade networks.',
        start_year: 1492,
        end_year: 1800,
        display_order: 3
      },
      {
        region: 'Global',
        title: 'Industrial Revolution',
        description: 'The transition to new manufacturing processes in Great Britain, continental Europe, and the United States leads to profound economic, social, and technological changes.',
        start_year: 1760,
        end_year: 1840,
        display_order: 4
      }
    ]
  }
];

function escapeSql(str: string | null | undefined): string {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

let sqlOutput = `-- Phase 3B World Context Seed\n-- Generated parallel historical events.\n\n`;

for (const chapter of worldContextData) {
  sqlOutput += `-- =========================================\n`;
  sqlOutput += `-- Chapter: ${chapter.chapter_id}\n`;
  sqlOutput += `-- =========================================\n\n`;

  for (let i = 0; i < chapter.events.length; i++) {
    const event = chapter.events[i];
    const id = `${chapter.chapter_id}_ctx${(i + 1).toString().padStart(2, '0')}`;

    sqlOutput += `INSERT INTO World_Context (id, chapter_id, region, title, description, start_year, end_year, display_order)\n`;
    sqlOutput += `VALUES ('${id}', '${chapter.chapter_id}', ${escapeSql(event.region)}, ${escapeSql(event.title)}, ${escapeSql(event.description)}, ${event.start_year}, ${event.end_year}, ${event.display_order});\n\n`;
  }
}

// Make sure output directories exist
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, sqlOutput);
console.log(`Seed SQL written to ${OUTPUT_FILE}`);

// Also copy directly to worker/db/seeds for convenience as required by the instruction
const seedsDir = path.dirname(SEED_OUTPUT_FILE);
if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
}
fs.writeFileSync(SEED_OUTPUT_FILE, sqlOutput);
console.log(`Seed SQL also written to ${SEED_OUTPUT_FILE}`);
