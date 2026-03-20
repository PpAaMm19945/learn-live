import fs from 'fs';
import path from 'path';

function getChapterId(chapterNum: number) {
  return `ch${chapterNum.toString().padStart(2, '0')}`;
}

const definitionsMap: Record<number, any[]> = {
  1: [
    {
      id: "def_01_001",
      term: "Sovereignty",
      definition: "God's absolute right and power to govern all things. He is not bound by any external standard but acts according to His own perfect will.",
      scriptureRef: "Daniel 4:35",
      originalLanguage: null
    },
    {
      id: "def_01_002",
      term: "Covenant",
      definition: "A binding agreement between two parties. In the Bible, God makes covenants with His people, establishing the terms of their relationship with Him.",
      scriptureRef: "Genesis 9:9-11",
      originalLanguage: null
    },
    {
      id: "def_01_003",
      term: "Mishpat",
      definition: "Hebrew term for justice, referring to fair judgment and restoring order.",
      scriptureRef: "Micah 6:8",
      originalLanguage: { script: "מִשְׁפָּט", transliteration: "mishpat", language: "Hebrew" }
    },
    {
      id: "def_01_004",
      term: "Tzedakah",
      definition: "Hebrew term for righteousness, meaning living in right relationship with God and others.",
      scriptureRef: "Micah 6:8",
      originalLanguage: { script: "צְדָקָה", transliteration: "tzedakah", language: "Hebrew" }
    },
    {
      id: "def_01_005",
      term: "Common Grace",
      definition: "God's general goodness shown to all humanity, regardless of their faith. It allows for art, science, and stable societies to flourish even in a fallen world.",
      scriptureRef: "Matthew 5:45",
      originalLanguage: null
    },
    {
      id: "def_01_006",
      term: "Curse",
      definition: "In the Bible, a curse is not a magical spell. It's a formal, prophetic declaration of divine judgment in response to sin, often pronounced by a patriarch.",
      scriptureRef: "Genesis 12:3",
      originalLanguage: null
    }
  ],
  2: [
    {
      id: "def_02_001",
      term: "Ma’at",
      definition: "A deep concept in Egyptian religion representing harmony, truth, and justice—the predictable, life-sustaining rhythm of the Nile.",
      scriptureRef: null,
      originalLanguage: null
    },
    {
      id: "def_02_002",
      term: "Isfet",
      definition: "The ever-present threat of the harsh desert, of famine, and of death, representing chaos in opposition to Ma'at.",
      scriptureRef: null,
      originalLanguage: null
    },
    {
      id: "def_02_003",
      term: "Pharaoh",
      definition: "The ruler of Egypt, considered not merely a king, but a god on earth, the living bridge between the heavens and humanity, often embodying Horus.",
      scriptureRef: null,
      originalLanguage: null
    },
    {
      id: "def_02_004",
      term: "Hieroglyphs",
      definition: "A beautiful and complex script ('sacred carvings') created by Egyptians, used to record laws, accounts, and inscribe sacred texts on temple and tomb walls.",
      scriptureRef: null,
      originalLanguage: null
    },
    {
      id: "def_02_005",
      term: "Hyksos",
      definition: "Meaning 'foreign rulers', a group of Semitic/Canaanite people who swept into Lower Egypt around 1650 BC and established their capital at Avaris.",
      scriptureRef: null,
      originalLanguage: null
    }
  ],
  3: [
    {
      id: "def_03_001",
      term: "Carthage (Qart-Hadasht)",
      definition: "Founded c. 814 BC on the North African coast, Carthage became the capital of a vast maritime empire, featuring the Cothon harbor, Byrsa Hill citadel, and the Tophet.",
      scriptureRef: null,
      originalLanguage: { script: "Qart-Hadasht", transliteration: "Qart-Hadasht", language: "Punic" }
    },
    {
      id: "def_03_002",
      term: "Ships of Tarshish",
      definition: "Heavy, ocean-going freighters used by the Phoenicians and Carthaginians for long-distance trade, often symbolizing human commercial ambition and seafaring pride.",
      scriptureRef: "Ezekiel 27:25",
      originalLanguage: null
    },
    {
      id: "def_03_003",
      term: "Berbers (Amazigh)",
      definition: "The indigenous peoples of North Africa, speaking languages of the Berber family. Descendants of Phut, they distinctively refer to themselves as 'free people'.",
      scriptureRef: null,
      originalLanguage: { script: "Amazigh", transliteration: "Amazigh", language: "Berber" }
    },
    {
      id: "def_03_004",
      term: "Foggara (Qanat)",
      definition: "An underground irrigation system consisting of a gently sloping tunnel that taps into an aquifer to channel water to surface irrigation channels.",
      scriptureRef: null,
      originalLanguage: null
    }
  ]
};

const figuresMap: Record<number, any[]> = {
  1: [
    {
      id: "fig_01_001",
      name: "Mizraim",
      title: "Father of Egypt",
      dates: "c. 2250–2100 BC",
      quote: "The sons of Ham: Cush, Mizraim, Phut, and Canaan. — Genesis 10:6",
      summary: "Son of Ham whose descendants settled the Nile Delta, establishing Egypt.",
      imageSlug: "mizraim"
    },
    {
      id: "fig_01_002",
      name: "Cush",
      title: "Patriarch of Nubia",
      dates: "c. 2250–2100 BC",
      quote: "The sons of Ham: Cush, Mizraim, Phut, and Canaan. — Genesis 10:6",
      summary: "Son of Ham whose descendants settled south of Egypt in Nubia.",
      imageSlug: "cush"
    },
    {
      id: "fig_01_003",
      name: "Phut",
      title: "Patriarch of North Africa",
      dates: "c. 2250–2100 BC",
      quote: "The sons of Ham: Cush, Mizraim, Phut, and Canaan. — Genesis 10:6",
      summary: "Son of Ham whose descendants settled westward in Libya and North Africa.",
      imageSlug: "phut"
    },
    {
      id: "fig_01_004",
      name: "Taharqa",
      title: "Cushite Pharaoh",
      dates: "c. 690-664 BC",
      quote: "And the king heard concerning Tirhakah king of Ethiopia, 'He has come out to fight against you.' — 2 Kings 19:9",
      summary: "A powerful Cushite Pharaoh during the 25th Dynasty who challenged the Assyrian empire.",
      imageSlug: "taharqa"
    }
  ],
  2: [
    {
      id: "fig_02_001",
      name: "Narmer",
      title: "Uniter of Egypt",
      dates: "c. 2900 BC",
      quote: null,
      summary: "King who united Upper and Lower Egypt into the world's first centralized monarchy, marking the birth of the Old Kingdom.",
      imageSlug: "narmer"
    },
    {
      id: "fig_02_002",
      name: "Joseph",
      title: "Hebrew Vizier",
      dates: "c. 1650-1550 BC (Hyksos Era)",
      quote: "God sent me before you to preserve for you a remnant on earth, and to keep alive for you many survivors. — Genesis 45:7",
      summary: "Rose from slavery to become vizier in Egypt, saving the nation from famine and providing refuge for his family.",
      imageSlug: "joseph"
    },
    {
      id: "fig_02_003",
      name: "Akhenaten",
      title: "The Heretic King",
      dates: "c. 1352-1336 BC",
      quote: null,
      summary: "Pharaoh who radically attempted to overturn Egyptian tradition by promoting the exclusive worship of the Aten, a self-serving reform.",
      imageSlug: "akhenaten"
    },
    {
      id: "fig_02_004",
      name: "Cleopatra VII",
      title: "The Last Pharaoh",
      dates: "69-30 BC",
      quote: null,
      summary: "A brilliant political strategist and linguist who navigated Roman politics to protect her kingdom but ultimately fell to Octavian.",
      imageSlug: "cleopatra"
    }
  ],
  3: [
    {
      id: "fig_03_001",
      name: "Dido (Elissa)",
      title: "Founder of Carthage",
      dates: "c. 814 BC",
      quote: null,
      summary: "A Tyrian princess who fled a power struggle and founded Carthage, building it into a powerful maritime empire.",
      imageSlug: "dido"
    },
    {
      id: "fig_03_002",
      name: "Hannibal Barca",
      title: "Carthaginian General",
      dates: "247-183 BC",
      quote: "Let us relieve the Romans from the anxiety they have so long experienced, since they think it tries their patience too much to wait for an old man's death.",
      summary: "One of history's greatest military commanders, who led an audacious invasion of Italy over the Alps during the Second Punic War.",
      imageSlug: "hannibal"
    },
    {
      id: "fig_03_003",
      name: "Massinissa",
      title: "The Cavalry King",
      dates: "c. 238–148 BC",
      quote: null,
      summary: "A Numidian king who allied with Rome, providing decisive cavalry support at the Battle of Zama, and united Numidia.",
      imageSlug: "massinissa"
    },
    {
      id: "fig_03_004",
      name: "Jugurtha",
      title: "Guerrilla King of Numidia",
      dates: "c. 160–104 BC",
      quote: "Rome is a city for sale, and doomed to perish as soon as it finds a buyer.",
      summary: "A brilliant tactician who waged a guerrilla war against Rome, exposing its corruption before being captured.",
      imageSlug: "jugurtha"
    },
    {
      id: "fig_03_005",
      name: "Juba II",
      title: "Scholar King of Mauretania",
      dates: "c. 48 BC – 23 AD",
      quote: null,
      summary: "A Hellenistic scholar installed as a client king by Augustus, he brought a multicultural renaissance to North Africa.",
      imageSlug: "juba_ii"
    }
  ]
};

const timelinesMap: Record<number, any[]> = {
  1: [
    {
      id: "evt_01_001",
      title: "The Creation",
      biblicalDate: "c. 4004 BC",
      conventionalDate: "N/A",
      description: "God created the heavens and the earth, setting the foundation for history.",
      scriptureRef: "Genesis 1:1",
      category: "biblical"
    },
    {
      id: "evt_01_002",
      title: "The Fall",
      biblicalDate: "Shortly after Creation",
      conventionalDate: "N/A",
      description: "Sin enters the world through Adam's disobedience in the garden.",
      scriptureRef: "Genesis 3",
      category: "biblical"
    },
    {
      id: "evt_01_003",
      title: "The Flood",
      biblicalDate: "c. 2348 BC",
      conventionalDate: "N/A",
      description: "Global flood destroys humanity except Noah's family.",
      scriptureRef: "Genesis 7-8",
      category: "biblical"
    },
    {
      id: "evt_01_004",
      title: "The Curse on Canaan",
      biblicalDate: "c. 2347 BC",
      conventionalDate: "N/A",
      description: "Noah curses Canaan with servitude following Ham's sinful disrespect.",
      scriptureRef: "Genesis 9:20-27",
      category: "biblical"
    },
    {
      id: "evt_01_005",
      title: "Tower of Babel Dispersion",
      biblicalDate: "c. 2242 BC",
      conventionalDate: "N/A",
      description: "Humanity is scattered across the earth and languages are confused.",
      scriptureRef: "Genesis 11",
      category: "biblical"
    },
    {
      id: "evt_01_006",
      title: "Settlement of Mizraim (Egypt)",
      biblicalDate: "c. 2250–2100 BC",
      conventionalDate: "c. 3100 BC",
      description: "Ham's descendants settle the Nile Delta establishing Egypt.",
      scriptureRef: "Genesis 10:6",
      category: "conventional"
    },
    {
      id: "evt_01_007",
      title: "Settlement of Cush",
      biblicalDate: "c. 2250–2100 BC",
      conventionalDate: "c. 2500 BC",
      description: "Ham's descendants establish settlements in the Upper Nile Valley.",
      scriptureRef: "Genesis 10:6",
      category: "conventional"
    },
    {
      id: "evt_01_008",
      title: "Settlement of Phut",
      biblicalDate: "c. 2250–2100 BC",
      conventionalDate: "c. 2000 BC",
      description: "Ham's descendants establish settlements in North Africa and the Sahara.",
      scriptureRef: "Genesis 10:6",
      category: "conventional"
    },
    {
      id: "evt_01_009",
      title: "Rise of the 25th Dynasty",
      biblicalDate: "c. 744-656 BC",
      conventionalDate: "744-656 BC",
      description: "Cushite Pharaohs rule the entire Nile Valley.",
      scriptureRef: "2 Kings 19:9",
      category: "conventional"
    }
  ],
  2: [
    {
      id: "evt_02_001",
      title: "Unification of Egypt",
      biblicalDate: "c. 2100 BC",
      conventionalDate: "c. 2900 BC",
      description: "Narmer unifies Upper and Lower Egypt into the world's first nation-state.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_02_002",
      title: "The Old Kingdom",
      biblicalDate: "N/A",
      conventionalDate: "c. 2686–2181 BC",
      description: "The Pyramid Age marked by divine kingship and monumental construction.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_02_003",
      title: "The Middle Kingdom",
      biblicalDate: "N/A",
      conventionalDate: "c. 2055–1650 BC",
      description: "Egypt's Classical Age characterized by literature and rulers acting as 'shepherds'.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_02_004",
      title: "Abraham in Egypt",
      biblicalDate: "c. 1921 BC",
      conventionalDate: "N/A",
      description: "Abraham seeks refuge in Egypt during a famine; Pharaoh's house is plagued.",
      scriptureRef: "Genesis 12",
      category: "biblical"
    },
    {
      id: "evt_02_005",
      title: "Hyksos Rule (Second Intermediate Period)",
      biblicalDate: "N/A",
      conventionalDate: "c. 1650–1550 BC",
      description: "Foreign rulers introduce the chariot; Joseph likely rises to power during this era.",
      scriptureRef: "Genesis 41",
      category: "conventional"
    },
    {
      id: "evt_02_006",
      title: "The New Kingdom",
      biblicalDate: "N/A",
      conventionalDate: "c. 1550–1069 BC",
      description: "The Empire Age, marked by great wealth, warrior-kings, and monumental temples.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_02_007",
      title: "The Exodus",
      biblicalDate: "c. 1446 BC",
      conventionalDate: "c. 1250 BC",
      description: "God liberates Israel from Egyptian bondage.",
      scriptureRef: "Exodus",
      category: "biblical"
    },
    {
      id: "evt_02_008",
      title: "Alexander the Great Conquers Egypt",
      biblicalDate: "N/A",
      conventionalDate: "332 BC",
      description: "Egypt is liberated from Persian rule and the Hellenistic period begins.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_02_009",
      title: "Death of Cleopatra VII",
      biblicalDate: "N/A",
      conventionalDate: "30 BC",
      description: "End of the Ptolemaic dynasty; Egypt becomes a Roman province.",
      scriptureRef: null,
      category: "conventional"
    }
  ],
  3: [
    {
      id: "evt_03_001",
      title: "Founding of Carthage",
      biblicalDate: "N/A",
      conventionalDate: "814 BC",
      description: "Dido founds the Phoenician colony that becomes a maritime empire.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_002",
      title: "First Punic War",
      biblicalDate: "N/A",
      conventionalDate: "264-241 BC",
      description: "Rome fights Carthage for control of Sicily, ultimately seizing the island.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_003",
      title: "Second Punic War",
      biblicalDate: "N/A",
      conventionalDate: "218-201 BC",
      description: "Hannibal crosses the Alps and ravages Italy.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_004",
      title: "Battle of Zama",
      biblicalDate: "N/A",
      conventionalDate: "202 BC",
      description: "Scipio defeats Hannibal with the aid of Massinissa's Numidian cavalry.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_005",
      title: "Destruction of Carthage",
      biblicalDate: "N/A",
      conventionalDate: "146 BC",
      description: "End of the Third Punic War; Carthage is utterly destroyed by Rome.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_006",
      title: "Jugurthine War",
      biblicalDate: "N/A",
      conventionalDate: "112-105 BC",
      description: "Rome fights a difficult guerrilla war against Jugurtha of Numidia.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_007",
      title: "Juba II Installed",
      biblicalDate: "N/A",
      conventionalDate: "25 BC",
      description: "Augustus makes Juba II the client king of Mauretania.",
      scriptureRef: null,
      category: "conventional"
    },
    {
      id: "evt_03_008",
      title: "Roman Annexation of Mauretania",
      biblicalDate: "N/A",
      conventionalDate: "40 AD",
      description: "Caligula murders Ptolemy, leading to the formal division and annexation of Mauretania.",
      scriptureRef: null,
      category: "conventional"
    }
  ]
};

const scriptureRefsMap: Record<number, any[]> = {
  1: [
    {
      id: "sc_01_001",
      reference: "Genesis 1:1",
      text: "In the beginning, God created the heavens and the earth.",
      connection: "Provides the foundational worldview that history unfolds under divine sovereignty, not random chaos.",
      cueContext: "Used when establishing the biblical foundation of history."
    },
    {
      id: "sc_01_002",
      reference: "Genesis 10:6",
      text: "The sons of Ham: Cush, Mizraim, Phut, and Canaan.",
      connection: "Identifies the founders of African civilizations according to the Table of Nations.",
      cueContext: "Shown during the discussion of the African Founders."
    },
    {
      id: "sc_01_003",
      reference: "Genesis 9:25",
      text: "Cursed be Canaan; a servant of servants he shall be to his brothers.",
      connection: "Clarifies that the curse was on Canaan, refuting the racist 'Curse of Ham' myth used to justify slavery.",
      cueContext: "Used when debunking the Curse of Ham."
    },
    {
      id: "sc_01_004",
      reference: "Galatians 6:7-8",
      text: "Do not be deceived: God is not mocked, for whatever one sows, that will he also reap.",
      connection: "Explains how the great African civilizations flourished through common grace but faced judgment for their idolatry.",
      cueContext: "Shown when discussing the spiritual legacy of Egypt, Cush, and Phut."
    }
  ],
  2: [
    {
      id: "sc_02_001",
      reference: "Deuteronomy 17:14-20",
      text: "When you come to the land that the LORD your God is giving you... you may indeed set a king over you whom the LORD your God will choose.",
      connection: "Contrasts the biblical view of kingship as a servant role with the Egyptian view of the Pharaoh as a divine god on earth.",
      cueContext: "Used in the comparison between Pharaonic and Biblical Kingship."
    },
    {
      id: "sc_02_002",
      reference: "Genesis 12:17",
      text: "But the LORD afflicted Pharaoh and his house with great plagues because of Sarai, Abram's wife.",
      connection: "Shows an early confrontation demonstrating that Yahweh's power over the world's superpower.",
      cueContext: "Displayed during the discussion of Abraham's sojourn in Egypt."
    },
    {
      id: "sc_02_003",
      reference: "Exodus 1:8",
      text: "Now there arose a new king over Egypt, who did not know Joseph.",
      connection: "Signals Egypt's willful forgetting of God's mercy through Joseph, leading directly to the oppression of Israel.",
      cueContext: "Used when discussing the darkness of the New Kingdom."
    },
    {
      id: "sc_02_004",
      reference: "Ezekiel 29:6",
      text: "Then all the inhabitants of Egypt shall know that I am the LORD. Because you have been a staff of reed to the house of Israel.",
      connection: "A prophetic verdict illustrating Egypt's decline into a broken and unreliable power.",
      cueContext: "Shown during the discussion of Egypt's Late Period."
    }
  ],
  3: [
    {
      id: "sc_03_001",
      reference: "Genesis 10:15",
      text: "Canaan fathered Sidon his firstborn and Heth...",
      connection: "Establishes that the Phoenicians (founders of Carthage) were descendants of Canaan.",
      cueContext: "Used when discussing the origins of Carthage."
    },
    {
      id: "sc_03_002",
      reference: "Jeremiah 19:5",
      text: "They have built the high places of Baal to burn their sons in the fire as burnt offerings to Baal, which I did not command or decree...",
      connection: "A biblical condemnation of the very practices (like child sacrifice) found archaeologically at the Tophet in Carthage.",
      cueContext: "Shown during the discussion of Carthage's religion."
    },
    {
      id: "sc_03_003",
      reference: "Jeremiah 46:9",
      text: "Come up, O horses, and rage, O chariots! And let the mighty men come forth: the Ethiopians and the Libyans (Put) who handle the shield...",
      connection: "Biblically identifies the descendants of Phut as light-shield warriors, accurately matching the historical Numidian cavalry.",
      cueContext: "Displayed when introducing the Berber kingdoms."
    },
    {
      id: "sc_03_004",
      reference: "Deuteronomy 8:15",
      text: "who led you through the great and terrifying wilderness... who brought you water out of the flinty rock.",
      connection: "Thematically connects God's provision in the wilderness to the foggara system created by the Garamantes under the dominion mandate.",
      cueContext: "Used when discussing the Foggara miracle of the Garamantes."
    }
  ]
};

const genealogiesMap: Record<number, any> = {
  1: {
    chapterId: "ch01",
    title: "Table of Nations — Ham's Line",
    nodes: [
      { id: "noah", name: "Noah", parent: null, dates: "c. 2950–2000 BC (YEC)", descriptor: "Patriarch" },
      { id: "ham", name: "Ham", parent: "noah", dates: null, descriptor: "Son of Noah" },
      { id: "mizraim", name: "Mizraim", parent: "ham", dates: "c. 2250 BC", descriptor: "Father of Egypt" },
      { id: "cush", name: "Cush", parent: "ham", dates: "c. 2250 BC", descriptor: "Patriarch of Nubia" },
      { id: "phut", name: "Phut", parent: "ham", dates: "c. 2250 BC", descriptor: "Patriarch of North Africa" },
      { id: "canaan", name: "Canaan", parent: "ham", dates: "c. 2250 BC", descriptor: "Cursed Son" }
    ]
  },
  2: {
    chapterId: "ch02",
    title: "Pharaohs of Egypt",
    nodes: [
      { id: "mizraim", name: "Mizraim", parent: null, dates: "c. 2250 BC", descriptor: "Founder of Egypt" },
      { id: "narmer", name: "Narmer", parent: "mizraim", dates: "c. 2900 BC", descriptor: "Uniter of Egypt" },
      { id: "mentuhotep", name: "Mentuhotep II", parent: "mizraim", dates: "c. 2050 BC", descriptor: "Middle Kingdom Founder" },
      { id: "ahmose", name: "Ahmose I", parent: "mizraim", dates: "c. 1550 BC", descriptor: "New Kingdom Founder" },
      { id: "cleopatra", name: "Cleopatra VII", parent: "mizraim", dates: "69-30 BC", descriptor: "The Last Pharaoh" }
    ]
  },
  3: {
    chapterId: "ch03",
    title: "The Lines of Canaan and Phut",
    nodes: [
      { id: "ham", name: "Ham", parent: null, dates: null, descriptor: "Son of Noah" },
      { id: "canaan", name: "Canaan", parent: "ham", dates: null, descriptor: "Father of Phoenicians" },
      { id: "sidon", name: "Sidon", parent: "canaan", dates: null, descriptor: "Firstborn of Canaan" },
      { id: "dido", name: "Dido", parent: "sidon", dates: "c. 814 BC", descriptor: "Founder of Carthage" },
      { id: "phut", name: "Phut", parent: "ham", dates: null, descriptor: "Father of Berbers" },
      { id: "massinissa", name: "Massinissa", parent: "phut", dates: "c. 238-148 BC", descriptor: "King of Numidia" }
    ]
  }
};

const comparisonsMap: Record<number, any[]> = {
  1: [
    {
      id: "cmp_01_001",
      topic: "Bantu Origins",
      biblical: {
        date: "Post-Babel",
        framework: "North-to-South migration from the Nile Valley",
        evidence: "Sudden appearance of Urewe pottery, metallurgical skills carried from advanced civilizations, oral traditions citing 'Misri'."
      },
      conventional: {
        date: "c. 1000 BC",
        framework: "Gradual West-to-East expansion over thousands of years",
        evidence: "Linguistic spread from West Africa, evolutionary assumptions of independent development."
      },
      resolution: "The biblical model accounts for the rapidity of skill transfer across vast distances, supported by African oral traditions that secular models dismiss."
    }
  ],
  2: [
    {
      id: "cmp_02_001",
      topic: "Pharaonic Kingship vs Biblical Kingship",
      biblical: {
        date: "N/A",
        framework: "The king is chosen by God, accountable to God's law, and serves to maintain covenant justice.",
        evidence: "Deuteronomy 17 warnings against kingly pride."
      },
      conventional: {
        date: "N/A",
        framework: "The king (Pharaoh) is a god on earth, unaccountable, whose word is law.",
        evidence: "Old Kingdom Pyramid Texts, divine status of Horus."
      },
      resolution: "Pharaonic kingship represents the archetypal 'kingdom of man' built on pride, while biblical kingship provides a servant-leader model under divine law."
    }
  ],
  3: [
    {
      id: "cmp_03_001",
      topic: "Destruction of Carthage vs Jerusalem",
      biblical: {
        date: "146 BC / 586 BC & 70 AD",
        framework: "God's judgment on nations persisting in abominations or rejecting His covenant.",
        evidence: "The long-delayed fulfillment of the curse on Canaan."
      },
      conventional: {
        date: "146 BC",
        framework: "A geopolitical necessity for Roman security ('Carthago delenda est').",
        evidence: "Roman historical accounts of the Third Punic War."
      },
      resolution: "While Rome acted out of self-interest, biblically the destruction serves as the final judgment against Canaanite idolatry, showing God's sovereign orchestration of history."
    }
  ]
};

for (let i = 1; i <= 3; i++) {
  const c = getChapterId(i);
  const outPath = path.join(process.cwd(), `../docs/curriculum/history/component-data/chapter_${i.toString().padStart(2, '0')}`);
  fs.mkdirSync(outPath, { recursive: true });

  fs.writeFileSync(path.join(outPath, 'definitions.json'), JSON.stringify({ chapterId: c, terms: definitionsMap[i] }, null, 2));
  fs.writeFileSync(path.join(outPath, 'figures.json'), JSON.stringify({ chapterId: c, figures: figuresMap[i] }, null, 2));
  fs.writeFileSync(path.join(outPath, 'timeline.json'), JSON.stringify({ chapterId: c, events: timelinesMap[i] }, null, 2));
  fs.writeFileSync(path.join(outPath, 'scripture_refs.json'), JSON.stringify({ chapterId: c, cards: scriptureRefsMap[i] }, null, 2));
  fs.writeFileSync(path.join(outPath, 'genealogy.json'), JSON.stringify(genealogiesMap[i], null, 2));
  fs.writeFileSync(path.join(outPath, 'comparisons.json'), JSON.stringify({ chapterId: c, comparisons: comparisonsMap[i] }, null, 2));
  console.log(`Generated JSONs for Chapter ${i}`);
}
