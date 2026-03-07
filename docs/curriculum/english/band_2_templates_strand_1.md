# Band 2 English Templates — Strand 1: Phonics & Word Study

## PS2a: Short Vowel Mastery

### Encounter Level (Multisensory)

**PS2a-1A: Auditory & Verbal Encounter**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "I am going to say three words. Two words have the same middle sound, but one is different. Listen: 'bat', 'cat', 'bit'. Which word sounds different in the middle?",
  "success_condition": "Child correctly identifies 'bit'.",
  "failure_condition": "If wrong, stretch the words: 'b-aaaa-t', 'c-aaaa-t', 'b-iiii-t'. Ask them to try again.",
  "reasoning_check": "What sound did you hear in the middle of 'bat'? What about 'bit'?",
  "context_variants": {
    "default": {
      "words": [
        [
          "bat",
          "cat",
          "bit"
        ],
        [
          "hop",
          "mop",
          "cup"
        ],
        [
          "sit",
          "fit",
          "set"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "pan",
          "fan",
          "pin"
        ],
        [
          "pot",
          "hot",
          "hut"
        ],
        [
          "tin",
          "bin",
          "ten"
        ]
      ]
    }
  },
  "L1_interference": {
    "target_sounds": [
      "/ɪ/",
      "/æ/"
    ],
    "likely_substitutions": [
      "/i:/ for /ɪ/",
      "/a:/ for /æ/"
    ],
    "parent_notes": "Pay special attention to the difference between 'bit' and 'beat', and 'bat' and 'but'."
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2a-1B: Physical Encounter**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Sorting",
  "materials": [
    "5 small containers or drawn circles",
    "Small objects or drawn pictures representing short vowel CVC words (e.g., pen, pin, pot, pan, cup)"
  ],
  "parent_prompt": "We have 5 boxes, one for each short vowel sound: /a/, /e/, /i/, /o/, /u/. Pick up an object, say its name, and put it in the box with the matching middle sound.",
  "success_condition": "Child sorts the objects into the correct vowel categories.",
  "failure_condition": "If wrong, ask them to say the word slowly and isolate the middle sound.",
  "reasoning_check": "Why did you put the 'pen' in that box? What sound is in the middle?",
  "context_variants": {
    "default": {
      "objects": [
        "pen",
        "pin",
        "pot",
        "pan",
        "cup"
      ]
    },
    "ug": {
      "objects": [
        "tin",
        "pot",
        "pan",
        "cup",
        "bed"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2a-1C: Verbal Production**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Verbal Substitution",
  "materials": [
    "None"
  ],
  "parent_prompt": "Say the word 'mat'. Now, change the /a/ sound in the middle to an /o/ sound. What is the new word?",
  "success_condition": "Child successfully produces the new word ('mot' or similar, depending on prompt). Focus is on sound manipulation, not real words necessarily.",
  "failure_condition": "If incorrect, say the sounds individually: /m/ /a/ /t/, now /m/ /o/ /t/. Blend them for the child.",
  "reasoning_check": "How did the word change when we swapped the middle sound?",
  "context_variants": {
    "default": {
      "prompts": [
        [
          "mat",
          "/o/",
          "mot"
        ],
        [
          "sit",
          "/e/",
          "set"
        ]
      ]
    },
    "ug": {
      "prompts": [
        [
          "pan",
          "/i/",
          "pin"
        ],
        [
          "pot",
          "/u/",
          "put"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2a-2A: Dictation & Encoding**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I will say a word. You will say the sounds you hear, and then write the letters. The word is 'dog'.",
  "success_condition": "Child says /d/ /o/ /g/ and writes 'dog'.",
  "failure_condition": "If spelled wrong, point to the incorrect letter and ask: 'What sound does this letter make? Does that match the word we want?'",
  "reasoning_check": "How did you know which vowel to use in the middle?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "dog",
        "cat",
        "pig",
        "sun",
        "hen"
      ]
    },
    "ug": {
      "words": [
        "cat",
        "dog",
        "pig",
        "sun",
        "hen"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2a-2B: Word Building**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Building",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Let's build a word ladder. Start by writing the word 'sit'. Read it aloud. Now change one letter to make it say 'sat'. Say the word, then write it.",
  "success_condition": "Child writes 'sit', says 'sat', then writes 'sat'.",
  "failure_condition": "If they change the wrong letter, have them point to each letter and sound out what they wrote.",
  "reasoning_check": "Which part of the word did you change? Why?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "ladders": [
        [
          "sit",
          "sat",
          "mat",
          "map"
        ],
        [
          "pin",
          "pan",
          "pat",
          "pot"
        ]
      ]
    },
    "ug": {
      "ladders": [
        [
          "pin",
          "pan",
          "pat",
          "pot"
        ],
        [
          "tin",
          "tan",
          "tap",
          "top"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2a-2C: Sentence Dictation**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I will read a short sentence. Repeat it back to me, then write it down. 'The big pig sat in the mud.'",
  "success_condition": "Child repeats the sentence correctly and writes it with mostly accurate phonetic spelling for CVC words.",
  "failure_condition": "If they miss words, repeat the sentence. If CVC words are misspelled, guide them to sound it out.",
  "reasoning_check": "Read the sentence back to me. Did you include all the words?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "The big pig sat in the mud.",
        "A red bug is on the rug."
      ]
    },
    "ug": {
      "sentences": [
        "The big pig sat in the mud.",
        "A red bug is on the mat."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2a-3A: Visual Error Detection**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Look at this sentence: 'The c-o-t ran after the mouse.' There is a spelling mistake that changes the meaning. Find the mistake and fix it.",
  "success_condition": "Child identifies 'cot' as incorrect and changes it to 'cat'.",
  "failure_condition": "If they can't find it, ask them to read the sentence aloud exactly as it is written.",
  "reasoning_check": "Why doesn't 'cot' make sense in this sentence? What is the correct word?",
  "context_variants": {
    "default": {
      "sentences": [
        {
          "text": "The c-o-t ran after the mouse.",
          "error": "cot",
          "fix": "cat"
        }
      ]
    },
    "ug": {
      "sentences": [
        {
          "text": "The c-o-t ran after the rat.",
          "error": "cot",
          "fix": "cat"
        }
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2a-3B: Auditory Error Detection**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "I'm going to say a sentence, but I will make a mistake with one of the words. Listen: 'I used a p-e-n to hold the papers together.' Did I say that right?",
  "success_condition": "Child identifies that 'pen' is the wrong word and suggests 'pin'.",
  "failure_condition": "If they miss it, repeat the sentence emphasizing the incorrect word.",
  "reasoning_check": "What does a 'pen' do? What did I actually need?",
  "context_variants": {
    "default": {
      "sentences": [
        {
          "text": "I used a p-e-n to hold the papers together.",
          "error": "pen",
          "fix": "pin"
        }
      ]
    },
    "ug": {
      "sentences": [
        {
          "text": "I used a p-e-n to hold the cloth together.",
          "error": "pen",
          "fix": "pin"
        }
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2a-3C: Nonsense Word Evaluation**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Nonsense Word Reading",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Here is a list of words. Some are real words, and some are nonsense (silly) words. Read each one and tell me if it is real or nonsense: 'bim', 'cat', 'zug', 'mop'.",
  "success_condition": "Child correctly reads the words and categorizes them.",
  "failure_condition": "If they misread a word, ask them to point to each letter and say the sound, then blend.",
  "reasoning_check": "How do you know 'zug' isn't a real word?",
  "context_variants": {
    "default": {
      "words": [
        "bim",
        "cat",
        "zug",
        "mop"
      ]
    },
    "ug": {
      "words": [
        "bim",
        "cat",
        "zug",
        "mop"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2a-4A: Teaching the Rule**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Imagine you are teaching a younger child what a 'short a' sound is. Explain it to them, and write down three example words to show them.",
  "success_condition": "Child can articulate the sound and provides three accurate CVC words with short 'a'.",
  "failure_condition": "If they struggle to explain, ask them to make the sound first, then think of words that have it in the middle.",
  "reasoning_check": "Why did you choose those three words to show the short 'a' sound?",
  "context_variants": {
    "default": {
      "target_vowel": "short a"
    },
    "ug": {
      "target_vowel": "short a"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2a-4B: Silly Sentence Creation**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the silliest sentence you can using as many short 'i' CVC words as possible. Say the sentence out loud before you write it.",
  "success_condition": "Child orally composes and then writes a sentence containing multiple short 'i' words.",
  "failure_condition": "If they struggle, provide a starting word like 'The pig...'",
  "reasoning_check": "Read your sentence to me. Which words have the short 'i' sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "target_vowel": "short i"
    },
    "ug": {
      "target_vowel": "short i"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2a-4C: Word Family Sorting**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Categorisation & Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Create two lists. At the top of one, write '-at'. At the top of the other, write '-in'. Now, write down as many words as you can think of that fit into these two families.",
  "success_condition": "Child successfully generates at least 3-4 words for each word family.",
  "failure_condition": "If they get stuck, offer a starting sound: 'What if we put a /p/ sound in front of -at?'",
  "reasoning_check": "What do all the words in the '-at' list have in common?",
  "context_variants": {
    "default": {
      "families": [
        "-at",
        "-in"
      ]
    },
    "ug": {
      "families": [
        "-at",
        "-in"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

### Milestone Task

**PS2a-M: Real-World Decoding/Encoding**
```json
{
  "capacity_id": "PS2a",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We are going to write a short shopping list. I need a pen, a pan, and a mop. Say the items back to me, and then write the list.",
  "success_condition": "Child accurately repeats the items and spells 'pen', 'pan', and 'mop' correctly on the list.",
  "failure_condition": "Do not correct them during the task. If failed, return to Execute level tasks focusing on those specific vowel sounds.",
  "reasoning_check": "Read your list back to me to make sure we have everything.",
  "oral_component": true,
  "context_variants": {
    "default": {
      "list": [
        "pen",
        "pan",
        "mop"
      ]
    },
    "ug": {
      "list": [
        "tin",
        "pan",
        "cup"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2b: Consonant Blends

### Encounter Level (Multisensory)

**PS2b-1A: Auditory Blending**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to the start of these two words: 'stop' and 'sop'. In one of these words, I hear two consonant sounds pushed together at the beginning. Which word is it?",
  "success_condition": "Child identifies 'stop' and can isolate the /s/ and /t/ sounds.",
  "failure_condition": "If incorrect, exaggerate the sounds: /s/-/t/-op vs /s/-op.",
  "reasoning_check": "What two sounds did you hear at the start of 'stop'?",
  "context_variants": {
    "default": {
      "word_pairs": [
        [
          "stop",
          "sop"
        ],
        [
          "play",
          "pay"
        ],
        [
          "fast",
          "fat"
        ]
      ]
    },
    "ug": {
      "word_pairs": [
        [
          "stop",
          "sop"
        ],
        [
          "play",
          "pay"
        ],
        [
          "fast",
          "fat"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2b-1B: Physical Blending**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Two small objects (like stones or beads)"
  ],
  "parent_prompt": "Place the two stones far apart. Say /s/ for one stone, and /p/ for the other. Now push the stones together quickly and say the sounds together: /sp/. What word starts with /sp/?",
  "success_condition": "Child successfully blends the sounds and suggests a word like 'spot' or 'spin'.",
  "failure_condition": "If they struggle, guide their hands to push the stones while you say the sounds with them.",
  "reasoning_check": "How is /sp/ different from just /s/ or /p/?",
  "context_variants": {
    "default": {
      "blends": [
        "sp",
        "cl",
        "tr"
      ]
    },
    "ug": {
      "blends": [
        "sp",
        "cl",
        "tr"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2b-1C: Verbal Blending Identification**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Verbal Identification",
  "materials": [
    "None"
  ],
  "parent_prompt": "I'm going to say a word slowly: /f/ /l/ /a/ /g/. Can you push those sounds together and tell me the word?",
  "success_condition": "Child says 'flag'.",
  "failure_condition": "If incorrect, say it a bit faster: /fl/ /ag/.",
  "reasoning_check": "What two sounds do you hear at the very beginning of the word?",
  "context_variants": {
    "default": {
      "words": [
        "flag",
        "crab",
        "jump"
      ]
    },
    "ug": {
      "words": [
        "flag",
        "crab",
        "jump"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2b-2A: Dictation & Encoding Blends**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I will say a word. You say the sounds, and then write it. The word is 'frog'. Make sure you hear all the sounds at the beginning.",
  "success_condition": "Child says /f/ /r/ /o/ /g/ and writes 'frog'.",
  "failure_condition": "If they write 'fog', ask: 'Read what you wrote. Does that say frog or fog?'",
  "reasoning_check": "What two letters are making the beginning sounds?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "frog",
        "slip",
        "tent"
      ]
    },
    "ug": {
      "words": [
        "frog",
        "slip",
        "tent"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2b-2B: Adding Blends**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'lap'. Say it aloud. Now, put a 'c' sound at the beginning. Say the new word, then write it.",
  "success_condition": "Child writes 'lap', says 'clap', and writes 'clap'.",
  "failure_condition": "If incorrect, segment the sounds for them: /c/ /l/ /a/ /p/.",
  "reasoning_check": "What happened to the word when we added the 'c'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "transformations": [
        [
          "lap",
          "clap"
        ],
        [
          "pot",
          "spot"
        ]
      ]
    },
    "ug": {
      "transformations": [
        [
          "lap",
          "clap"
        ],
        [
          "pot",
          "spot"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2b-2C: Sentence Dictation with Blends**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Repeat this sentence, then write it: 'The frog sat on the log.'",
  "success_condition": "Child repeats and accurately spells 'frog' including the blend.",
  "failure_condition": "If 'frog' is misspelled, focus just on that word and have them stretch out the sounds.",
  "reasoning_check": "Read the sentence. Does the word start with an 'f' sound and an 'r' sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "The frog sat on the log.",
        "The crab ran fast."
      ]
    },
    "ug": {
      "sentences": [
        "The frog sat on the log.",
        "The crab ran fast."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2b-3A: Visual Blend Error**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Look at this sentence: 'I have a red s-l-e-d for the snow.' Wait, that's not right. It should say 'I have a red s-e-d for the snow.' Or should it? Which word is correct?",
  "success_condition": "Child identifies 'sled' as the correct word.",
  "failure_condition": "If unsure, have them read both 'sled' and 'sed' and see which makes sense.",
  "reasoning_check": "Why do we need the 'l' in sled?",
  "context_variants": {
    "default": {
      "words": [
        "sled",
        "sed"
      ]
    },
    "ug": {
      "words": [
        "drum",
        "dum"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2b-3B: Auditory Blend Error**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this sentence: 'The baby will c-r-e-e-p on the floor.' Now listen to this one: 'The baby will c-e-e-p on the floor.' Which one sounds right?",
  "success_condition": "Child identifies 'creep'.",
  "failure_condition": "If they miss the blend, repeat both words emphasizing the /r/.",
  "reasoning_check": "What sound was missing in the second word?",
  "context_variants": {
    "default": {
      "sentences": [
        "The baby will creep on the floor.",
        "The baby will ceep on the floor."
      ]
    },
    "ug": {
      "sentences": [
        "The baby will creep on the mat.",
        "The baby will ceep on the mat."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2b-3C: Identifying the Missing Blend**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Fill in the blank",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Here is a word with a blank at the beginning: '__op'. Should we put 'st', 'fl', or 'cr' at the beginning to make it the word for what you do at a red light?",
  "success_condition": "Child selects 'st' to make 'stop'.",
  "failure_condition": "If they guess wrong, sound out the incorrect options with them: 'fl-op? cr-op?'",
  "reasoning_check": "Why wouldn't 'flop' work for a red light?",
  "context_variants": {
    "default": {
      "target": "stop",
      "options": [
        "st",
        "fl",
        "cr"
      ],
      "clue": "red light"
    },
    "ug": {
      "target": "stop",
      "options": [
        "st",
        "fl",
        "cr"
      ],
      "clue": "red light"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2b-4A: Blend Brainstorming**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the blend 'pl' at the top of your paper. Say the sound out loud. Now, write three real words that start with that blend.",
  "success_condition": "Child accurately generates and writes three words starting with 'pl' (e.g., play, plum, plan).",
  "failure_condition": "If they write words that just start with 'p', remind them to make the /p/ /l/ sound together.",
  "reasoning_check": "Read your words. Do they all start with the same two sounds?",
  "context_variants": {
    "default": {
      "blend": "pl"
    },
    "ug": {
      "blend": "pl"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2b-4B: Descriptive Sentence Creation**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of an animal whose name starts with a blend, like a frog or a crab. Tell me a sentence about what that animal is doing, and then write it down.",
  "success_condition": "Child orally composes and writes a sentence featuring an animal name with an initial blend.",
  "failure_condition": "If they choose an animal without a blend (like 'dog'), redirect them: 'Dog starts with one consonant sound. Can you think of one with two, like sn-ake?'",
  "reasoning_check": "Which word in your sentence has a consonant blend?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "theme": "animals with blends"
    },
    "ug": {
      "theme": "animals with blends"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2b-4C: Teaching the Concept**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Explain to me the difference between the word 'tap' and the word 'trap'. What extra sound did we add, and where is it?",
  "success_condition": "Child clearly explains that the /r/ sound was added after the /t/.",
  "failure_condition": "If they can't explain, ask them to write both words and circle the difference.",
  "reasoning_check": "How does adding that one letter change the meaning of the word?",
  "context_variants": {
    "default": {
      "word_pair": [
        "tap",
        "trap"
      ]
    },
    "ug": {
      "word_pair": [
        "tap",
        "trap"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

### Milestone Task

**PS2b-M: Real-World Reporting**
```json
{
  "capacity_id": "PS2b",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Look around the room or outside. Tell me one thing you see that has a consonant blend in its name (like a plant, a step, or the sky). Say it in a sentence, and then write the sentence.",
  "success_condition": "Child successfully identifies an object with a blend, composes a sentence orally, and writes it accurately.",
  "failure_condition": "Do not correct during the task. If they fail to identify a blend or spell it correctly, review Execute level tasks.",
  "reasoning_check": "Show me the word in your sentence that has the blend. What two sounds are pushed together?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "prompt": "Look around the room or outside."
    },
    "ug": {
      "prompt": "Look around the room or outside."
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2c: Consonant Digraphs

### Encounter Level (Multisensory)

**PS2c-1A: Auditory Digraph Identification**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to these words: 'ship', 'shoe', 'sun'. Two of these words start with a special sound made by two letters working together to make one new sound: /sh/. Which word does NOT start with the /sh/ sound?",
  "success_condition": "Child identifies 'sun'.",
  "failure_condition": "If incorrect, emphasize the initial sounds: /sh/-ip, /sh/-oe, /s/-un.",
  "reasoning_check": "What sound did 'sun' start with? How is it different from the other two?",
  "context_variants": {
    "default": {
      "words": [
        "ship",
        "shoe",
        "sun"
      ]
    },
    "ug": {
      "words": [
        "shop",
        "shoe",
        "sun"
      ]
    }
  },
  "L1_interference": {
    "target_sounds": [
      "/ʃ/",
      "/s/"
    ],
    "likely_substitutions": [
      "/s/ for /ʃ/"
    ],
    "parent_notes": "Watch for confusion between 'sh' and 's', especially in some L1 backgrounds where 'sh' is not common."
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2c-1B: Physical Digraph Building**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Letter tiles or cards: c, s, h, t"
  ],
  "parent_prompt": "Put the 's' tile and the 'h' tile together. When they stand next to each other, they don't say /s/ /h/ anymore. They make a totally new sound: /sh/ (like telling someone to be quiet). Now put 'c' and 'h' together. They say /ch/ (like a train). Pick up the tiles that make the /sh/ sound.",
  "success_condition": "Child selects 'sh'.",
  "failure_condition": "If wrong, repeat the sound association (quiet vs train).",
  "reasoning_check": "Why do these two letters make only one sound now?",
  "context_variants": {
    "default": {
      "digraphs": [
        "sh",
        "ch"
      ]
    },
    "ug": {
      "digraphs": [
        "sh",
        "ch"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2c-1C: Verbal Digraph Matching**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Verbal Identification",
  "materials": [
    "None"
  ],
  "parent_prompt": "I will say a word. If it starts with the /ch/ sound, say 'choo choo!'. If it doesn't, just shake your head. Ready? 'Chip'.",
  "success_condition": "Child responds appropriately ('choo choo!').",
  "failure_condition": "If they miss it, exaggerate the /ch/ sound.",
  "reasoning_check": "What sound did you hear at the beginning of 'chip'?",
  "context_variants": {
    "default": {
      "words": [
        [
          "chip",
          true
        ],
        [
          "cat",
          false
        ],
        [
          "chop",
          true
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "chop",
          true
        ],
        [
          "cup",
          false
        ],
        [
          "chin",
          true
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2c-2A: Dictation with Digraphs**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a word. You say the sounds, and then write the letters. Remember, some sounds need two letters! The word is 'shop'.",
  "success_condition": "Child says /sh/ /o/ /p/ and writes 'shop'.",
  "failure_condition": "If they write 'sop', ask: 'Does your word say shop or sop?' Remind them of the two letters needed for /sh/.",
  "reasoning_check": "Which two letters work together to make the first sound in that word?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "shop",
        "chip",
        "thin"
      ]
    },
    "ug": {
      "words": [
        "shop",
        "chip",
        "thin"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2c-2B: Digraph Word Ladders**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'ship'. Say it loud. Now, change the /sh/ sound to a /ch/ sound. Say the new word, then write it.",
  "success_condition": "Child writes 'ship', says 'chip', and writes 'chip'.",
  "failure_condition": "If incorrect, point to the 'sh' and ask what it says, then ask what 'ch' says.",
  "reasoning_check": "What letters did you have to change to make the new word?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "ladders": [
        [
          "ship",
          "chip"
        ],
        [
          "thin",
          "chin"
        ]
      ]
    },
    "ug": {
      "ladders": [
        [
          "shop",
          "chop"
        ],
        [
          "thin",
          "chin"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2c-2C: Sentence Dictation (Final Digraphs)**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Listen to this sentence: 'The fish took a bath.' Say it back to me, then write it down.",
  "success_condition": "Child repeats and accurately spells 'fish' (ending 'sh') and 'bath' (ending 'th').",
  "failure_condition": "If digraphs are misspelled, isolate the word: 'What two letters make the /sh/ sound at the end of fish?'",
  "reasoning_check": "Look at the end of the word 'bath'. What two letters are making the final sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "The fish took a bath."
      ]
    },
    "ug": {
      "sentences": [
        "The fish took a bath."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2c-3A: Visual Digraph Error**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Read this sentence carefully: 'The dog sat in the s-a-d-e.' That doesn't look right. What word should it be, and how do we spell the sound at the beginning?",
  "success_condition": "Child identifies the word should be 'shade' and that 'sh' is missing.",
  "failure_condition": "If they read it as 'shade', ask them to look at the letters again. 'Does s-a-d-e say shade?'",
  "reasoning_check": "Why do we need an 'h' after the 's' in this word?",
  "context_variants": {
    "default": {
      "sentence": "The dog sat in the sade.",
      "error": "sade",
      "fix": "shade"
    },
    "ug": {
      "sentence": "The dog sat in the sade.",
      "error": "sade",
      "fix": "shade"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2c-3B: Auditory Digraph Confusion**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this silly sentence: 'I need to s-o-p vegetables for dinner.' Did I say that correctly?",
  "success_condition": "Child identifies the error and corrects it to 'chop'.",
  "failure_condition": "If missed, repeat: 'Does s-o-p sound like what you do to vegetables?'",
  "reasoning_check": "What two letters should be at the beginning of 'chop'?",
  "context_variants": {
    "default": {
      "sentence": "I need to sop vegetables for dinner.",
      "error": "sop",
      "fix": "chop"
    },
    "ug": {
      "sentence": "I need to sop the cabbage for dinner.",
      "error": "sop",
      "fix": "chop"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2c-3C: Correct Digraph Selection**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Fill in the blank",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Here is a word: '__ip'. We want it to be the word for a big boat. Should we put 'sh', 'ch', or 'th' at the beginning?",
  "success_condition": "Child selects 'sh' to make 'ship'.",
  "failure_condition": "If incorrect, read the options aloud: 'chip? thip?'",
  "reasoning_check": "Why wouldn't 'ch' work in this blank?",
  "context_variants": {
    "default": {
      "target": "ship",
      "options": [
        "sh",
        "ch",
        "th"
      ],
      "clue": "a big boat"
    },
    "ug": {
      "target": "ship",
      "options": [
        "sh",
        "ch",
        "th"
      ],
      "clue": "a big boat on the lake"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2c-4A: Digraph Teaching**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "How would you explain the difference between a blend (like 'sl') and a digraph (like 'sh') to someone learning to read? Write down one example of each.",
  "success_condition": "Child explains that a blend is two sounds pushed together, but a digraph is two letters making one completely new sound.",
  "failure_condition": "If they struggle, ask: 'In sl-, can you hear the s and the l? In sh-, can you hear the s and the h?'",
  "reasoning_check": "Why is 'sh' a digraph and not a blend?",
  "context_variants": {
    "default": {
      "concept": "blend vs digraph"
    },
    "ug": {
      "concept": "blend vs digraph"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2c-4B: Digraph Sentence Creation**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of a word that ends in 'th', like 'math' or 'bath'. Tell me a sentence using that word, and then write it down.",
  "success_condition": "Child orally composes and writes a sentence using a word with a final 'th' digraph.",
  "failure_condition": "If they pick a word starting with 'th' (like 'the'), redirect them to find one that ends with it.",
  "reasoning_check": "Point to the two letters that make the /th/ sound in your sentence.",
  "oral_component": true,
  "context_variants": {
    "default": {
      "target": "ends in 'th'"
    },
    "ug": {
      "target": "ends in 'th'"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2c-4C: Categorising Digraphs**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Categorisation & Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Make two columns on your paper. Label one 'Starts with CH' and the other 'Starts with SH'. Write two real words in each column. Say them aloud as you write them.",
  "success_condition": "Child accurately generates two 'ch' words and two 'sh' words and places them in the correct columns.",
  "failure_condition": "If they struggle to think of words, offer clues (e.g., 'What do you do with an axe?' -> chop).",
  "reasoning_check": "How are the sounds in the first column different from the sounds in the second column?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "columns": [
        "ch",
        "sh"
      ]
    },
    "ug": {
      "columns": [
        "ch",
        "sh"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Milestone Task

**PS2c-M: Real-World Communication**
```json
{
  "capacity_id": "PS2c",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We need to leave a short note. Think of a short sentence telling someone to do something, using a word with 'sh' or 'ch' (like 'shut the door' or 'chop the wood'). Say the sentence to me, then write the note.",
  "success_condition": "Child correctly composes and writes a functional sentence utilizing a digraph.",
  "failure_condition": "Do not correct during the task. If spelling or concept fails, review Execute level tasks.",
  "reasoning_check": "Read the note back to me. Did you use the two letters that work together to make one sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "examples": [
        "shut the door",
        "chop the wood"
      ]
    },
    "ug": {
      "examples": [
        "shut the door",
        "chop the wood"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2d: Long Vowel Patterns

### Encounter Level (Multisensory)

**PS2d-1A: Auditory Identification of 'Magic E'**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to the word 'mad'. Now listen to the word 'made'. How did the vowel sound in the middle change?",
  "success_condition": "Child identifies that 'mad' has a short /a/ and 'made' has a long /a/ (saying its name).",
  "failure_condition": "If they struggle, say 'm-aaaa-d' vs 'm-ayyyy-d' slowly.",
  "reasoning_check": "What is the difference between the vowel sound in mad and made?",
  "context_variants": {
    "default": {
      "pairs": [
        [
          "mad",
          "made"
        ],
        [
          "hop",
          "hope"
        ],
        [
          "sit",
          "site"
        ]
      ]
    },
    "ug": {
      "pairs": [
        [
          "tap",
          "tape"
        ],
        [
          "not",
          "note"
        ],
        [
          "bit",
          "bite"
        ]
      ]
    }
  },
  "L1_interference": {
    "target_sounds": [
      "/eɪ/",
      "/oʊ/",
      "/aɪ/"
    ],
    "likely_substitutions": [
      "/e/ for /eɪ/",
      "/o/ for /oʊ/"
    ],
    "parent_notes": "Emphasize that the long vowel says its own alphabet name clearly."
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2d-1B: Physical 'Magic E' Wand**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Paper",
    "Pencil",
    "A small stick or pencil to act as a 'magic wand'"
  ],
  "parent_prompt": "Write 'tap'. Now, use your 'magic e' wand (pencil) and point to the end of the word. The 'e' tells the vowel to say its name. Say the new word.",
  "success_condition": "Child touches the end of the word and says 'tape'.",
  "failure_condition": "If they say 'tap-e', remind them the 'e' is silent, it just does magic on the vowel.",
  "reasoning_check": "What does the magic 'e' tell the vowel to do?",
  "context_variants": {
    "default": {
      "words": [
        "tap",
        "kit",
        "rob"
      ]
    },
    "ug": {
      "words": [
        "tap",
        "kit",
        "not"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2d-1C: Visual Vowel Team Identification**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at these two words: 'ran' and 'rain'. In the second word, the 'a' and 'i' are a team working together. The first one does the talking and says its name. What does 'rain' say?",
  "success_condition": "Child correctly reads 'rain'.",
  "failure_condition": "If they read 'ran-in', explain the vowel team rule: 'When two vowels go walking, the first one does the talking.'",
  "reasoning_check": "Which letter does the talking in 'ai'?",
  "context_variants": {
    "default": {
      "words": [
        [
          "ran",
          "rain"
        ],
        [
          "met",
          "meet"
        ],
        [
          "got",
          "goat"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "ran",
          "rain"
        ],
        [
          "bed",
          "bead"
        ],
        [
          "cot",
          "coat"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2d-2A: Dictating 'Magic E' Words**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a word that has a long vowel sound. You need a magic 'e' at the end to make it happen. The word is 'cake'. Say it, stretch it, write it.",
  "success_condition": "Child says /c/ /a/ /k/ and writes 'cake'.",
  "failure_condition": "If they write 'cak', ask: 'Does this say cake or cak? What is missing?'",
  "reasoning_check": "Why did you put an 'e' at the end of the word?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "cake",
        "bike",
        "home",
        "cute"
      ]
    },
    "ug": {
      "words": [
        "cake",
        "bite",
        "hole",
        "tube"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2d-2B: Vowel Team Word Building**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write 'boat'. Now, change the first letter to make it say 'coat'. Say the new word, then write it. Remember the vowel team 'oa'.",
  "success_condition": "Child writes 'boat', says 'coat', and writes 'coat'.",
  "failure_condition": "If they spell 'cote', remind them we are using the vowel team 'oa' for this list.",
  "reasoning_check": "What two letters make the long /o/ sound in coat?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        [
          "boat",
          "coat"
        ],
        [
          "rain",
          "train"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "boat",
          "goat"
        ],
        [
          "rain",
          "train"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2d-2C: Sentence Dictation with Long Vowels**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Listen to this sentence: 'Take the bike to the gate.' Say it back to me, then write it down.",
  "success_condition": "Child repeats the sentence and correctly spells 'take', 'bike', and 'gate' using the magic 'e'.",
  "failure_condition": "If a word is spelled wrong, focus on the missing silent 'e'.",
  "reasoning_check": "Look at the words take, bike, and gate. What do they all have at the end?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "Take the bike to the gate."
      ]
    },
    "ug": {
      "sentences": [
        "Take the bike to the gate."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2d-3A: Visual 'Magic E' Error Detection**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Read this sentence: 'I h-o-p to see you soon.' Look at the word 'hop'. Should it be hop, or hope? How do we fix it?",
  "success_condition": "Child identifies the error, says 'hope', and adds an 'e'.",
  "failure_condition": "If they don't see it, ask them to read the sentence literally. 'I hop to see you soon.'",
  "reasoning_check": "Why does adding an 'e' change hop into hope?",
  "context_variants": {
    "default": {
      "sentence": "I hop to see you soon.",
      "error": "hop",
      "fix": "hope"
    },
    "ug": {
      "sentence": "I hop to see you soon.",
      "error": "hop",
      "fix": "hope"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2d-3B: Vowel Team Confusion Auditory Check**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to my sentence: 'The t-r-a-n is on the tracks.' Did I pronounce that correctly for a big machine on tracks?",
  "success_condition": "Child identifies the error and corrects it to 'train'.",
  "failure_condition": "If they agree, say: 'Tran? Or train?'",
  "reasoning_check": "What sound did I miss in the middle of 'train'?",
  "context_variants": {
    "default": {
      "sentence": "The t-r-a-n is on the tracks.",
      "error": "tran",
      "fix": "train"
    },
    "ug": {
      "sentence": "The b-o-t is on the lake.",
      "error": "bot",
      "fix": "boat"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2d-3C: Nonsense Long Vowels**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Read these nonsense words and tell me if the vowel says its name (long) or not: 'plame', 'snib', 'foat', 'drit'.",
  "success_condition": "Child correctly identifies 'plame' and 'foat' as having long vowels based on their spelling patterns.",
  "failure_condition": "If incorrect, point out the 'e' on 'plame' and the 'oa' in 'foat'.",
  "reasoning_check": "How did you know 'plame' has a long /a/ sound even though it's not a real word?",
  "context_variants": {
    "default": {
      "words": [
        "plame",
        "snib",
        "foat",
        "drit"
      ]
    },
    "ug": {
      "words": [
        "plame",
        "snib",
        "foat",
        "drit"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2d-4A: Long Vowel Rule Explanation**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Teach someone younger the 'magic e' rule. How does the 'e' at the end change the vowel in the middle? Write down two words to prove it, showing the short version and the long version.",
  "success_condition": "Child explains the rule accurately and provides examples like cap/cape, bit/bite.",
  "failure_condition": "If they struggle to explain, have them just do the example first.",
  "reasoning_check": "Does the 'e' make a sound itself?",
  "context_variants": {
    "default": {
      "concept": "magic e"
    },
    "ug": {
      "concept": "magic e"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2d-4B: Vowel Team Brainstorming**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the vowel team 'ee' at the top of your paper. Think of three words that use this team, say them out loud, and write them down.",
  "success_condition": "Child correctly generates and spells three words with 'ee' (e.g., tree, see, meet).",
  "failure_condition": "If they struggle, provide clues: 'What do you do with your eyes?'",
  "reasoning_check": "What sound does the 'ee' team make?",
  "context_variants": {
    "default": {
      "vowel_team": "ee"
    },
    "ug": {
      "vowel_team": "ee"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2d-4C: Long Vowel Sentence Composition**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Make up a short sentence that has at least two words with a magic 'e' (like 'bike' or 'gate'). Tell me the sentence, and then write it.",
  "success_condition": "Child composes and writes a sentence utilizing at least two CVCe words.",
  "failure_condition": "If they can't think of words, give them a list to choose from (make, time, nose, cute).",
  "reasoning_check": "Read your sentence back. Point to the words with the magic 'e'.",
  "oral_component": true,
  "context_variants": {
    "default": {
      "constraint": "two magic e words"
    },
    "ug": {
      "constraint": "two magic e words"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Milestone Task

**PS2d-M: Real-World Written Direction**
```json
{
  "capacity_id": "PS2d",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We need to make a sign for a game. Think of a short rule that uses a long vowel word (like 'Wait here' or 'Make a line'). Say your rule to me, then write the sign.",
  "success_condition": "Child orally composes and accurately spells a phrase using a long vowel pattern.",
  "failure_condition": "Do not correct during the task. If spelling or concept fails, review Execute level tasks.",
  "reasoning_check": "Show me the word in your sign that has a long vowel sound. How did you spell it?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "examples": [
        "Wait here",
        "Make a line"
      ]
    },
    "ug": {
      "examples": [
        "Wait here",
        "Make a line"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2e: R-Controlled Vowels

### Encounter Level (Multisensory)

**PS2e-1A: Auditory Bossy 'R'**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to these words: 'cat', 'car'. The 'r' in 'car' is bossy. It changes how the 'a' sounds. Which word has the bossy 'r' sound: 'mat' or 'star'?",
  "success_condition": "Child identifies 'star'.",
  "failure_condition": "If incorrect, exaggerate the sounds: /a/ vs /ar/.",
  "reasoning_check": "What does the bossy 'r' do to the vowel before it?",
  "context_variants": {
    "default": {
      "words": [
        [
          "mat",
          "star"
        ],
        [
          "hen",
          "her"
        ],
        [
          "sit",
          "sir"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "mat",
          "star"
        ],
        [
          "pen",
          "her"
        ],
        [
          "pit",
          "sir"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2e-1B: Verbal Pattern Matching**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Verbal Identification",
  "materials": [
    "None"
  ],
  "parent_prompt": "I will say a word. If it has the /ar/ sound like 'car', say 'vroom!'. Ready? 'Farm'. 'Pat'. 'Dark'.",
  "success_condition": "Child responds appropriately ('vroom' for farm, dark).",
  "failure_condition": "If they miss one, isolate the sound.",
  "reasoning_check": "What two letters make that /ar/ sound?",
  "context_variants": {
    "default": {
      "words": [
        [
          "farm",
          true
        ],
        [
          "pat",
          false
        ],
        [
          "dark",
          true
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "park",
          true
        ],
        [
          "pan",
          false
        ],
        [
          "dark",
          true
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2e-1C: Visual Sorting**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at these words: 'her', 'bird', 'fur'. They all sound exactly the same in the middle (/er/), but they are spelled differently. Which one uses 'i-r'?",
  "success_condition": "Child points to 'bird'.",
  "failure_condition": "If they misread, explain that er, ir, and ur all make the same bossy 'r' sound.",
  "reasoning_check": "Even though they are spelled differently, what sound do they all make?",
  "context_variants": {
    "default": {
      "words": [
        "her",
        "bird",
        "fur"
      ]
    },
    "ug": {
      "words": [
        "her",
        "bird",
        "fur"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2e-2A: Dictating /ar/ and /or/ Words**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a word. You say the sounds, and then write the letters. The word is 'star'. Remember the bossy 'r'!",
  "success_condition": "Child says /s/ /t/ /ar/ and writes 'star'.",
  "failure_condition": "If they write 'ster' or 'star', gently correct the spelling pattern.",
  "reasoning_check": "Which two letters made the /ar/ sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "star",
        "fork",
        "yard",
        "horn"
      ]
    },
    "ug": {
      "words": [
        "star",
        "fork",
        "yard",
        "horn"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2e-2B: Word Ladders (Adding 'r')**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'cat'. Now, insert an 'r' right after the 'a'. Say the new word, then write it.",
  "success_condition": "Child writes 'cat', says 'cart', and writes 'cart'.",
  "failure_condition": "If they put the 'r' at the end ('catr'), point to the spot after the 'a'.",
  "reasoning_check": "How did the vowel sound change when we added the 'r'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        [
          "cat",
          "cart"
        ],
        [
          "hut",
          "hurt"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "pot",
          "port"
        ],
        [
          "hut",
          "hurt"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2e-2C: Sentence Dictation with Bossy 'R'**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Repeat this sentence, then write it: 'The bird sat on the car.'",
  "success_condition": "Child repeats and spells 'bird' (ir) and 'car' (ar) correctly.",
  "failure_condition": "If they misspell 'bird' as 'berd' or 'burd', tell them 'bird uses the i-r pattern.'",
  "reasoning_check": "What letters make the bossy 'r' sound in 'bird'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "The bird sat on the car."
      ]
    },
    "ug": {
      "sentences": [
        "The bird sat on the car."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2e-3A: Visual Bossy 'R' Error**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Read this sentence: 'I want f-o-k with my dinner.' Wait, that's not how we spell the tool we eat with. What is missing?",
  "success_condition": "Child identifies that 'fork' needs an 'r'.",
  "failure_condition": "If they don't see it, read it out loud exactly as written.",
  "reasoning_check": "Why do we need the 'r' in fork?",
  "context_variants": {
    "default": {
      "sentence": "I want fok with my dinner.",
      "error": "fok",
      "fix": "fork"
    },
    "ug": {
      "sentence": "I want fok with my dinner.",
      "error": "fok",
      "fix": "fork"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2e-3B: Spelling Choice Auditory Confusion**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this: 'The dog began to b-a-c-k.' Did I use the right word for the sound a dog makes?",
  "success_condition": "Child identifies it should be 'bark'.",
  "failure_condition": "If they say yes, ask: 'Does a dog back or bark?'",
  "reasoning_check": "What sound did I forget to say?",
  "context_variants": {
    "default": {
      "sentence": "The dog began to b-a-c-k.",
      "error": "back",
      "fix": "bark"
    },
    "ug": {
      "sentence": "The dog began to b-a-c-k.",
      "error": "back",
      "fix": "bark"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2e-3C: Identifying the Correct Bossy 'R'**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Here are three ways someone tried to spell the word for a young girl: 'garl', 'gerl', 'girl'. Which one is the right spelling?",
  "success_condition": "Child selects 'girl'.",
  "failure_condition": "If they choose 'gerl', explain that ir, ur, and er sound the same, so we just have to memorize which one 'girl' uses.",
  "reasoning_check": "Why is it tricky to spell words with the /er/ sound?",
  "context_variants": {
    "default": {
      "word": "girl",
      "options": [
        "garl",
        "gerl",
        "girl"
      ]
    },
    "ug": {
      "word": "girl",
      "options": [
        "garl",
        "gerl",
        "girl"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2e-4A: Brainstorming Bossy 'R' Words**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write 'ar' at the top of your paper. Say the sound out loud. Now, write down three different words that have the 'ar' sound in them.",
  "success_condition": "Child successfully lists three words like car, far, star, park.",
  "failure_condition": "If they get stuck, give hints: 'Where do you play outside?'",
  "reasoning_check": "Read your words. Do they all have the bossy 'r' sound?",
  "context_variants": {
    "default": {
      "sound": "ar"
    },
    "ug": {
      "sound": "ar"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2e-4B: Bossy 'R' Sentences**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Tell me a short sentence about an animal using a word that has 'or' in it (like 'horse' or 'horn'). Say the sentence, then write it.",
  "success_condition": "Child orally composes and writes a sentence utilizing an 'or' word.",
  "failure_condition": "If they pick an animal without 'or', remind them of the rule.",
  "reasoning_check": "Which word has the 'or' sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "target": "or"
    },
    "ug": {
      "target": "or"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2e-4C: Explaining the Rule**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Explain to me what 'bossy r' means. What does the 'r' do to the vowel that comes right before it? Give me one example.",
  "success_condition": "Child explains that the 'r' changes the vowel's normal sound and provides a correct example.",
  "failure_condition": "If they can't explain, have them write 'cat' and 'cart' and explain the difference.",
  "reasoning_check": "Why do we call it bossy?",
  "context_variants": {
    "default": {
      "concept": "bossy r"
    },
    "ug": {
      "concept": "bossy r"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

### Milestone Task

**PS2e-M: Real-World Observation List**
```json
{
  "capacity_id": "PS2e",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We are going to make a short list of things outside. Think of two things you might see outside that have the bossy 'r' sound (like a car, a bird, or dirt). Say them to me, and then write them down.",
  "success_condition": "Child accurately identifies and spells two bossy 'r' words based on observation or recall.",
  "failure_condition": "Do not correct during the task. If spelling or concept fails, review Execute level tasks.",
  "reasoning_check": "Point to the letters in your words that are making the bossy 'r' sound.",
  "oral_component": true,
  "context_variants": {
    "default": {
      "examples": [
        "car",
        "bird",
        "dirt"
      ]
    },
    "ug": {
      "examples": [
        "car",
        "bird",
        "dirt"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2f: Syllable Types & Division

### Encounter Level (Multisensory)

**PS2f-1A: Auditory Syllable Clapping**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to the word 'basket'. Let's clap the parts we hear: bas-ket. How many claps was that?",
  "success_condition": "Child identifies 2 syllables/claps.",
  "failure_condition": "If they clap once or three times, model it again slowly.",
  "reasoning_check": "How many vowel sounds do you hear in 'basket'?",
  "context_variants": {
    "default": {
      "words": [
        [
          "basket",
          2
        ],
        [
          "cat",
          1
        ],
        [
          "banana",
          3
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "basket",
          2
        ],
        [
          "cup",
          1
        ],
        [
          "matooke",
          3
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2f-1B: Physical Syllable Division**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Paper",
    "Scissors (or pencil to draw a line)"
  ],
  "parent_prompt": "Write the word 'muffin' big on a piece of paper. Say it loud: muf-fin. Where do you hear the split? Use the scissors (or pencil) to cut the word right between the two syllables.",
  "success_condition": "Child cuts or draws a line between 'muf' and 'fin' (between the double consonants).",
  "failure_condition": "If they split it wrong, clap the syllables while looking at the word.",
  "reasoning_check": "Why did you split it right between the two 'f's?",
  "context_variants": {
    "default": {
      "word": "muffin"
    },
    "ug": {
      "word": "cotton"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2f-1C: Open vs Closed Syllables Visual Check**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at the word 'hi'. The vowel is at the very end, so it's 'open' and says its name. Look at 'him'. The 'm' closes the door, so the vowel is short. Which one has a closed door: 'me' or 'met'?",
  "success_condition": "Child identifies 'met' as having a closed door (consonant at the end).",
  "failure_condition": "If wrong, explain the 'door' analogy again.",
  "reasoning_check": "What letter closes the door in 'met'?",
  "context_variants": {
    "default": {
      "pairs": [
        [
          "me",
          "met"
        ],
        [
          "no",
          "not"
        ]
      ]
    },
    "ug": {
      "pairs": [
        [
          "me",
          "met"
        ],
        [
          "no",
          "not"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2f-2A: Dictating Two-Syllable Words**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a long word, but we will write it one chunk at a time. The word is 'sunset'. First, say 'sun' and write it. Now say 'set' and write it right next to it.",
  "success_condition": "Child writes 'sunset' accurately by dividing it orally.",
  "failure_condition": "If they miss letters, have them sound out each chunk separately.",
  "reasoning_check": "How does breaking a big word into chunks make it easier to spell?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "sunset",
        "picnic",
        "napkin"
      ]
    },
    "ug": {
      "words": [
        "sunset",
        "picnic",
        "dustbin"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2f-2B: Syllable Division Practice**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Visual Manipulation & Encoding",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'rabbit'. Now, draw a line to split it into two syllables. Read the first part, then the second part.",
  "success_condition": "Child writes 'rabbit' and draws a line between the b's (rab/bit).",
  "failure_condition": "If they split it ra/bbit, remind them to split between double consonants.",
  "reasoning_check": "What happens when we have two consonants between vowels? Where do we split it?",
  "oral_component": false,
  "context_variants": {
    "default": {
      "words": [
        "rabbit",
        "kitten",
        "sudden"
      ]
    },
    "ug": {
      "words": [
        "rabbit",
        "kitten",
        "sudden"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  }
}
```

**PS2f-2C: Open/Closed Syllable Writing**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'go'. Say it. Now, add a 't' to the end to close the door. What is the new word? Write it.",
  "success_condition": "Child writes 'go', says 'got', and writes 'got'.",
  "failure_condition": "If they say 'goat', remind them that closing the door makes the vowel short.",
  "reasoning_check": "How did the sound of the 'o' change when we closed the door?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        [
          "go",
          "got"
        ],
        [
          "be",
          "bed"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "so",
          "sop"
        ],
        [
          "he",
          "hen"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2f-3A: Visual Syllable Division Error**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Someone tried to split the word 'basket' into syllables. They wrote 'ba-sket'. Is that where the word splits?",
  "success_condition": "Child identifies that it should be 'bas-ket'.",
  "failure_condition": "If they agree with 'ba-sket', clap it out loud: bas-ket.",
  "reasoning_check": "Why do we split between the 's' and the 'k'?",
  "context_variants": {
    "default": {
      "word": "basket",
      "error": "ba-sket",
      "fix": "bas-ket"
    },
    "ug": {
      "word": "market",
      "error": "ma-rket",
      "fix": "mar-ket"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2f-3B: Auditory Syllable Count Error**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "I'm going to clap the syllables in the word 'butterfly'. *clap twice*. Did I get it right?",
  "success_condition": "Child says no and correctly claps three times.",
  "failure_condition": "If they miss it, say 'but-ter-fly' slowly while counting on fingers.",
  "reasoning_check": "How many parts does the word 'butterfly' have?",
  "context_variants": {
    "default": {
      "word": "butterfly",
      "error": 2,
      "fix": 3
    },
    "ug": {
      "word": "pineapple",
      "error": 2,
      "fix": 3
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2f-3C: Identifying the Open Syllable**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at these two words: 'robot' and 'rabbit'. Which word has an open first syllable (where the vowel says its name)?",
  "success_condition": "Child selects 'robot' (ro-bot).",
  "failure_condition": "If they choose 'rabbit' (rab-bit), remind them that the 'b' closes the door on the 'a'.",
  "reasoning_check": "Why does the 'o' in robot say its name?",
  "context_variants": {
    "default": {
      "options": [
        "robot",
        "rabbit"
      ]
    },
    "ug": {
      "options": [
        "robot",
        "rabbit"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2f-4A: Brainstorming Polysyllabic Words**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of three words that have exactly two syllables. Say them out loud, clap them to check, and then write them down.",
  "success_condition": "Child successfully lists three 2-syllable words.",
  "failure_condition": "If they pick 1-syllable words, remind them they need to clap twice.",
  "reasoning_check": "Read your words and clap as you read them.",
  "context_variants": {
    "default": {
      "constraint": "two syllables"
    },
    "ug": {
      "constraint": "two syllables"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2f-4B: Open/Closed Syllable Instruction**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Explain to me the difference between an open syllable (like 'no') and a closed syllable (like 'not'). Write the two words down to help you explain.",
  "success_condition": "Child accurately explains the concept of the consonant 'closing the door' and changing the vowel sound.",
  "failure_condition": "If they struggle, ask: 'Which one has a vowel that says its name?'",
  "reasoning_check": "What happens to the vowel sound when we close the syllable?",
  "context_variants": {
    "default": {
      "concept": "open vs closed syllables"
    },
    "ug": {
      "concept": "open vs closed syllables"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2f-4C: Inventing a Long Word**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Spelling",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Invent a silly, long alien name that has three syllables. Clap the syllables to me, and then write the name down spelling each chunk the way it sounds.",
  "success_condition": "Child claps 3 syllables and writes a phonetically plausible string of letters (e.g., Zib-lok-nam).",
  "failure_condition": "If they just write random letters, have them do one syllable at a time.",
  "reasoning_check": "Show me the three chunks you wrote. What vowels are in each chunk?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "theme": "alien name"
    },
    "ug": {
      "theme": "alien name"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Milestone Task

**PS2f-M: Real-World Multisyllabic Decoding/Encoding**
```json
{
  "capacity_id": "PS2f",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We are making a list of things to pack for a trip. Write down 'blanket' and 'jacket'. Think about how many syllables are in each word to help you spell them.",
  "success_condition": "Child writes 'blanket' and 'jacket' accurately, utilizing syllable division strategies if needed.",
  "failure_condition": "Do not correct during the task. If spelling fails heavily, review Execute level tasks.",
  "reasoning_check": "How did breaking the word into chunks help you spell it?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "blanket",
        "jacket"
      ]
    },
    "ug": {
      "words": [
        "blanket",
        "jacket"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2g: Common Spelling Patterns

### Encounter Level (Multisensory)

**PS2g-1A: Auditory Pattern Recognition (-ight)**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to these words: 'light', 'night', 'right'. They all rhyme. What sound do you hear at the end of all of them?",
  "success_condition": "Child identifies the /ite/ sound.",
  "failure_condition": "If they just say /t/, encourage them to listen to the whole chunk.",
  "reasoning_check": "What other word rhymes with light and night?",
  "context_variants": {
    "default": {
      "words": [
        "light",
        "night",
        "right"
      ]
    },
    "ug": {
      "words": [
        "light",
        "night",
        "right"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2g-1B: Visual Pattern Searching**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Visual Discrimination",
  "materials": [
    "A book or printed text"
  ],
  "parent_prompt": "Look at this page. The letters 'i-g-h-t' work together to make the /ite/ sound. Find a word on this page that has that pattern.",
  "success_condition": "Child locates a word with the -ight pattern.",
  "failure_condition": "If they can't find it, point out a few words and ask if they have the pattern.",
  "reasoning_check": "What do those four letters say when they are together?",
  "context_variants": {
    "default": {
      "pattern": "ight"
    },
    "ug": {
      "pattern": "ight"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2g-1C: Doubling Rule Physical Demonstration**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Physical Manipulation",
  "materials": [
    "Letter tiles: h, o, p, p, i, n, g"
  ],
  "parent_prompt": "Here is the word 'hop'. We want to make it 'hopping'. If we just add 'ing', the 'i' makes the 'o' long, and it says 'hoping'. We need an extra 'p' to act like a wall to protect the short 'o'. Put the extra 'p' in.",
  "success_condition": "Child physically places the second 'p' before the 'ing'.",
  "failure_condition": "If they don't understand, demonstrate with and without the extra 'p'.",
  "reasoning_check": "Why did we need two 'p's in hopping?",
  "context_variants": {
    "default": {
      "word": "hopping"
    },
    "ug": {
      "word": "hopping"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2g-2A: Dictating Pattern Words (-ight)**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "The letters i-g-h-t say /ite/. I am going to say a word. You say it, then write it. The word is 'might'.",
  "success_condition": "Child writes 'might' accurately.",
  "failure_condition": "If they write 'mite', remind them we are practicing the 4-letter pattern today.",
  "reasoning_check": "Which four letters make the /ite/ sound in this word?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "might",
        "high",
        "bright"
      ]
    },
    "ug": {
      "words": [
        "might",
        "high",
        "bright"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2g-2B: Applying the Doubling Rule**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the word 'run'. Say it loud. Now, we want to write 'running'. Remember, 'run' has a short vowel, so we must double the consonant before adding 'ing'. Write 'running'.",
  "success_condition": "Child writes 'run', says 'running', and writes 'running' with a double 'n'.",
  "failure_condition": "If they write 'runing', ask: 'Did you build the wall to protect the short u?'",
  "reasoning_check": "Why did we need two 'n's?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        [
          "run",
          "running"
        ],
        [
          "sit",
          "sitting"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "run",
          "running"
        ],
        [
          "sit",
          "sitting"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2g-2C: Sentence Dictation with Patterns**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Listen to this sentence: 'Turn on the bright light.' Say it back to me, then write it.",
  "success_condition": "Child repeats and spells 'bright' and 'light' using the -ight pattern.",
  "failure_condition": "If misspelled, isolate the word and ask what 4 letters make that sound.",
  "reasoning_check": "What spelling pattern do bright and light share?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "Turn on the bright light."
      ]
    },
    "ug": {
      "sentences": [
        "Turn on the bright light."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2g-3A: Visual Pattern Error**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Read this: 'We look at the stars at n-i-t-e.' Is that the standard way to spell the word 'night'?",
  "success_condition": "Child identifies it should be spelled 'night'.",
  "failure_condition": "If they think 'nite' is fine, explain that while people sometimes write it that way, the correct pattern is i-g-h-t.",
  "reasoning_check": "What four letters should make the /ite/ sound in night?",
  "context_variants": {
    "default": {
      "sentence": "We look at the stars at nite.",
      "error": "nite",
      "fix": "night"
    },
    "ug": {
      "sentence": "We look at the stars at nite.",
      "error": "nite",
      "fix": "night"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2g-3B: Doubling Rule Error**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at these two words: 'hoping' and 'hopping'. Which one means you are jumping up and down on one foot?",
  "success_condition": "Child selects 'hopping'.",
  "failure_condition": "If they choose 'hoping', review the short vowel vs long vowel doubling rule.",
  "reasoning_check": "What does the word 'hoping' mean?",
  "context_variants": {
    "default": {
      "options": [
        "hoping",
        "hopping"
      ],
      "target": "jumping"
    },
    "ug": {
      "options": [
        "hoping",
        "hopping"
      ],
      "target": "jumping"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2g-3C: Auditory Rule Application**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "If I want to write the word 'cutting', do I need two 't's in the middle, or just one? Listen to the vowel sound in 'cut'.",
  "success_condition": "Child states two 't's are needed.",
  "failure_condition": "If they say one, ask: 'Is the u in cut short or long? If it's short, we need to protect it with two consonants.'",
  "reasoning_check": "Why do we need two 't's for cutting?",
  "context_variants": {
    "default": {
      "word": "cutting"
    },
    "ug": {
      "word": "cutting"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2g-4A: Pattern Brainstorming**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write '-ight' at the top of your paper. Write three words that rhyme with 'light' using that pattern.",
  "success_condition": "Child accurately lists three -ight words.",
  "failure_condition": "If stuck, offer initial sounds (f, m, s).",
  "reasoning_check": "Read your words. Do they all rhyme?",
  "context_variants": {
    "default": {
      "pattern": "ight"
    },
    "ug": {
      "pattern": "ight"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2g-4B: Teaching the Doubling Rule**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Explain to me the rule for adding '-ing' to a word like 'sit'. What do you have to do before you add the '-ing'? Write the word down to show me.",
  "success_condition": "Child explains that the 't' must be doubled, and writes 'sitting'.",
  "failure_condition": "If they can't explain it, prompt them: 'What happens if we don't add the second t?'",
  "reasoning_check": "Why do we double the last letter?",
  "context_variants": {
    "default": {
      "concept": "doubling rule"
    },
    "ug": {
      "concept": "doubling rule"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2g-4C: Pattern Sentences**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Make up a sentence using the word 'swimming'. Think carefully about the spelling rule before you write it down.",
  "success_condition": "Child composes and accurately spells a sentence containing 'swimming' (double m).",
  "failure_condition": "If they write 'swiming', ask them to review the doubling rule.",
  "reasoning_check": "How did you spell swimming? Why did you spell it that way?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "target": "swimming"
    },
    "ug": {
      "target": "swimming"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Milestone Task

**PS2g-M: Real-World Reporting**
```json
{
  "capacity_id": "PS2g",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write a short sentence about something you like doing (like 'running' or 'reading'). Think carefully about whether you need to double any letters before adding '-ing'. Say the sentence to me, then write it.",
  "success_condition": "Child composes a sentence and accurately applies or avoids the doubling rule when adding -ing to their chosen verb.",
  "failure_condition": "Do not correct during the task. If spelling fails, review Execute level tasks.",
  "reasoning_check": "Show me the word ending in '-ing'. Did you double the consonant? Why or why not?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "examples": [
        "running",
        "reading"
      ]
    },
    "ug": {
      "examples": [
        "running",
        "reading"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2h: Word Families & Morphemes

### Encounter Level (Multisensory)

**PS2h-1A: Auditory Prefix/Suffix Awareness**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to the word 'happy'. Now listen to 'unhappy'. What little chunk of sound did I add to the beginning of the second word?",
  "success_condition": "Child identifies 'un'.",
  "failure_condition": "If they don't catch it, say 'un-happy'.",
  "reasoning_check": "What does 'un' mean when we put it in front of happy?",
  "context_variants": {
    "default": {
      "words": [
        "happy",
        "unhappy"
      ]
    },
    "ug": {
      "words": [
        "happy",
        "unhappy"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2h-1B: Physical Root + Affix Joining**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Three small pieces of paper with 'un', 'do', and 'ing' written on them"
  ],
  "parent_prompt": "The middle paper says 'do'. That is the root word. If we put 'un' in front of it, what does it say? If we take 'un' away and put 'ing' at the end, what does it say?",
  "success_condition": "Child physically moves the papers and reads 'undo' and 'doing'.",
  "failure_condition": "If they misread, point to each part: un + do.",
  "reasoning_check": "How does the meaning of 'do' change when we add 'un'?",
  "context_variants": {
    "default": {
      "root": "do",
      "affixes": [
        "un",
        "ing"
      ]
    },
    "ug": {
      "root": "do",
      "affixes": [
        "un",
        "ing"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2h-1C: Visual Suffix Matching**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at these words: 'help', 'helpful', 'helpless'. They all share the same root word. Circle the root word 'help' hidden inside the two longer words.",
  "success_condition": "Child successfully circles 'help' inside 'helpful' and 'helpless'.",
  "failure_condition": "If they circle the whole word, show them how to cover up the ending to see the root.",
  "reasoning_check": "What does the ending '-ful' mean? What does '-less' mean?",
  "context_variants": {
    "default": {
      "words": [
        "help",
        "helpful",
        "helpless"
      ]
    },
    "ug": {
      "words": [
        "help",
        "helpful",
        "helpless"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2h-2A: Dictating Prefix Words**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I will say a word with a prefix. Think of the root word first, then add the prefix chunk. The word is 'rebuild'. Say it, then write it.",
  "success_condition": "Child writes 'rebuild' accurately.",
  "failure_condition": "If misspelled, isolate the chunks: 'How do you spell the prefix re-? How do you spell the root build?'",
  "reasoning_check": "What does the prefix 're-' mean in the word rebuild?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "rebuild",
        "unlock",
        "remake"
      ]
    },
    "ug": {
      "words": [
        "rebuild",
        "unlock",
        "remake"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2h-2B: Word Building with Suffixes**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Manipulation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the root word 'hope'. Now, we want to add the suffix '-ful'. Remember, when the root ends in a magic 'e' and the suffix starts with a consonant, we just stick them together. Write 'hopeful'.",
  "success_condition": "Child writes 'hope', says 'hopeful', and writes 'hopeful'.",
  "failure_condition": "If they drop the 'e' ('hopful'), remind them of the rule.",
  "reasoning_check": "Did we keep the 'e' or drop it? Why?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        [
          "hope",
          "hopeful"
        ],
        [
          "care",
          "careless"
        ]
      ]
    },
    "ug": {
      "words": [
        [
          "hope",
          "hopeful"
        ],
        [
          "care",
          "careless"
        ]
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2h-2C: Sentence Dictation with Morphemes**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Listen to this sentence: 'He was very helpful.' Say it back to me, then write it down.",
  "success_condition": "Child repeats and spells 'helpful' correctly, identifying root and suffix.",
  "failure_condition": "If they misspell 'helpful' (e.g., 'helpfull'), point out that the suffix '-ful' only has one 'l'.",
  "reasoning_check": "What is the root word in 'helpful'? What is the suffix?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "He was very helpful."
      ]
    },
    "ug": {
      "sentences": [
        "He was very helpful."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2h-3A: Suffix Spelling Error**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Look at this sentence: 'The puppy is very playfull.' Find the mistake in how the suffix is spelled.",
  "success_condition": "Child identifies that the suffix '-ful' should only have one 'l'.",
  "failure_condition": "If they miss it, write 'full' and '-ful' side by side and explain the difference.",
  "reasoning_check": "When '-ful' is attached to a word as a suffix, how many 'l's does it have?",
  "context_variants": {
    "default": {
      "sentence": "The puppy is very playfull.",
      "error": "playfull",
      "fix": "playful"
    },
    "ug": {
      "sentence": "The dog is very playfull.",
      "error": "playfull",
      "fix": "playful"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2h-3B: Meaning/Prefix Error**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this sentence: 'I tied my shoes, but then I had to re-tie them because I did it wrong.' Does 're-tie' make sense there? What does 're-' mean?",
  "success_condition": "Child confirms 're-tie' makes sense and means 'tie again'.",
  "failure_condition": "If they say 'un-tie', explain: 'If I did it wrong, I want to do it again (re-), not undo it (un-).'",
  "reasoning_check": "If I wanted to take my shoes off, what prefix would I use instead of 're-'?",
  "context_variants": {
    "default": {
      "word": "re-tie",
      "meaning": "tie again"
    },
    "ug": {
      "word": "re-tie",
      "meaning": "tie again"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2h-3C: Root Word Identification**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Here are three words: 'unlock', 'under', 'unhappy'. Two of these words have the prefix 'un-'. One of them just starts with the letters 'u-n' but doesn't have a prefix. Which one is the trick word?",
  "success_condition": "Child identifies 'under' because 'der' is not a root word.",
  "failure_condition": "If they struggle, ask them to read the root word of each (lock, der, happy).",
  "reasoning_check": "Why isn't 'un-' a prefix in the word 'under'?",
  "context_variants": {
    "default": {
      "options": [
        "unlock",
        "under",
        "unhappy"
      ],
      "target": "under"
    },
    "ug": {
      "options": [
        "unlock",
        "under",
        "unhappy"
      ],
      "target": "under"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2h-4A: Morpheme Brainstorming**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write the prefix 'un-' at the top of your page. Now, list three root words that you can add 'un-' to, to make real words (like 'un-do' or 'un-lock'). Write the full words.",
  "success_condition": "Child successfully lists three valid words starting with 'un-'.",
  "failure_condition": "If they list words like 'under' or 'uncle', remind them to check if the root is a real word.",
  "reasoning_check": "Cover up the 'un-' in each of your words. Are the words underneath real words?",
  "context_variants": {
    "default": {
      "prefix": "un-"
    },
    "ug": {
      "prefix": "un-"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2h-4B: Morpheme Sentence Creation**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of a word that ends with the suffix '-less' (like 'careless' or 'fearless'). Tell me a sentence using that word, and then write it down.",
  "success_condition": "Child composes and writes a sentence utilizing a word ending in '-less'.",
  "failure_condition": "If they don't know the meaning, remind them that '-less' means 'without'.",
  "reasoning_check": "What does your word mean in that sentence? (e.g., fearless = without fear).",
  "oral_component": true,
  "context_variants": {
    "default": {
      "suffix": "-less"
    },
    "ug": {
      "suffix": "-less"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2h-4C: Teaching Affixes**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Explain the difference between a prefix (like 're-') and a suffix (like '-ful'). Where do they go on a root word, and what do they do? Write an example of each.",
  "success_condition": "Child explains that prefixes go at the beginning, suffixes at the end, and both change the meaning of the root.",
  "failure_condition": "If they get confused, have them draw a train with an engine (prefix), car (root), and caboose (suffix).",
  "reasoning_check": "How does adding an affix change a word?",
  "context_variants": {
    "default": {
      "concept": "prefix vs suffix"
    },
    "ug": {
      "concept": "prefix vs suffix"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

### Milestone Task

**PS2h-M: Real-World Communication**
```json
{
  "capacity_id": "PS2h",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write a short note telling someone not to do something again. Use a word that starts with the prefix 're-' (like 'rebuild', 'rewrite', or 'remake'). Say the sentence, then write it.",
  "success_condition": "Child orally composes and accurately writes a sentence using a word with the prefix 're-'.",
  "failure_condition": "Do not correct during the task. If spelling or concept fails, review Execute level tasks.",
  "reasoning_check": "Show me the word with the prefix. What is the root word hiding inside it?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "constraint": "use 're-' prefix"
    },
    "ug": {
      "constraint": "use 're-' prefix"
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2i: High-Frequency Sight Words — Extended

### Encounter Level (Multisensory)

**PS2i-1A: Auditory Sight Word Identification**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this sentence: 'I was going to the store.' Listen again: 'I was going to the store.' Which word sounds like /wuz/?",
  "success_condition": "Child identifies 'was'.",
  "failure_condition": "If they say 'wuz' is not in the sentence, repeat the sentence slowly.",
  "reasoning_check": "Why is 'was' a tricky word to spell?",
  "context_variants": {
    "default": {
      "sentence": "I was going to the store."
    },
    "ug": {
      "sentence": "I was going to the shop."
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2i-1B: Physical Sight Word Tracing**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "Paper",
    "Pencil or finger"
  ],
  "parent_prompt": "Look at the word 'said'. It is a tricky word because it doesn't follow the rules. Trace the letters with your finger while you spell it out loud: s-a-i-d. What does it say?",
  "success_condition": "Child traces the letters and reads 'said'.",
  "failure_condition": "If they try to sound it out phonetically (/s/ /a/ /i/ /d/), remind them it's a 'heart word' we have to memorize by heart.",
  "reasoning_check": "Which part of the word 'said' is the tricky part?",
  "context_variants": {
    "default": {
      "word": "said"
    },
    "ug": {
      "word": "said"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2i-1C: Visual Sight Word Search**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "A book or printed text"
  ],
  "parent_prompt": "Look at this page in your book. The word 'they' is spelled t-h-e-y. It's very common. See how many times you can find the word 'they' on this page in one minute.",
  "success_condition": "Child locates the word 'they' multiple times.",
  "failure_condition": "If they miss it, write 'they' big on a piece of paper to act as a model to match.",
  "reasoning_check": "How do you spell the word 'they'?",
  "context_variants": {
    "default": {
      "word": "they"
    },
    "ug": {
      "word": "they"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2i-2A: Dictating Tricky Words**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a tricky sight word. Say the letters out loud as you write it. The word is 'could'. (c-o-u-l-d).",
  "success_condition": "Child writes 'could' from memory.",
  "failure_condition": "If misspelled, show them the correct spelling, have them trace it 3 times saying the letters, then hide it and try again.",
  "reasoning_check": "What are the tricky silent letters in the middle of 'could'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "could",
        "would",
        "should"
      ]
    },
    "ug": {
      "words": [
        "could",
        "would",
        "should"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2i-2B: Sentence Dictation with Sight Words**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Listen to this sentence: 'They went to the park.' Say it back, then write it.",
  "success_condition": "Child accurately spells the high-frequency words 'they', 'went', 'to', 'the'.",
  "failure_condition": "If 'they' is spelled 'thay', review the specific spelling of 'they'.",
  "reasoning_check": "Point to the word 'they'. How did you spell it?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "They went to the park.",
        "He said to come here."
      ]
    },
    "ug": {
      "sentences": [
        "They went to the park.",
        "He said to come here."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2i-2C: Memory Writing Game**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Visual Memory Dictation",
  "materials": [
    "Paper",
    "Pencil",
    "Flashcard with the word 'because'"
  ],
  "parent_prompt": "Look at the word 'because'. I'm going to hide it in 3 seconds. Try to take a picture of it in your brain. 1... 2... 3... (hide it). Now write it down.",
  "success_condition": "Child writes 'because' accurately from visual memory.",
  "failure_condition": "If misspelled, show the card again, point out the tricky part (a-u-s-e), and try again.",
  "reasoning_check": "What trick helps you remember how to spell 'because'?",
  "oral_component": false,
  "context_variants": {
    "default": {
      "words": [
        "because",
        "people",
        "friend"
      ]
    },
    "ug": {
      "words": [
        "because",
        "people",
        "friend"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  }
}
```

### Discern Level (Error Detection)

**PS2i-3A: Visual Sight Word Error**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Read this sentence: 'My f-r-e-n-d is nice.' That word is spelled how it sounds, but it's a tricky word so that spelling is wrong. How do we actually spell 'friend'?",
  "success_condition": "Child identifies the missing 'i' and spells 'friend'.",
  "failure_condition": "If they don't know, write it out for them: 'f-r-i-e-n-d'.",
  "reasoning_check": "Why can't we just sound out the word 'friend'?",
  "context_variants": {
    "default": {
      "sentence": "My frend is nice.",
      "error": "frend",
      "fix": "friend"
    },
    "ug": {
      "sentence": "My frend is nice.",
      "error": "frend",
      "fix": "friend"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2i-3B: Auditory Meaning/Context Error**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen to this: 'I have two eyes, so I can see.' Now listen to this: 'I went two the store.' Did I use the right 'two/to/too' in both sentences?",
  "success_condition": "Child identifies that 'went two the store' is incorrect in meaning/spelling.",
  "failure_condition": "If they miss the homophone difference, explain two (number), too (also), and to (direction).",
  "reasoning_check": "Which 'to' means direction?",
  "context_variants": {
    "default": {
      "sentences": [
        "I went two the store.",
        "I went to the store."
      ]
    },
    "ug": {
      "sentences": [
        "I went two the shop.",
        "I went to the shop."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2i-3C: Tricky Letter Selection**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Which is the correct way to spell the word that means a group of humans: 'peeple' or 'people'?",
  "success_condition": "Child selects 'people'.",
  "failure_condition": "If they choose 'peeple', remind them it's a 'heart word' that doesn't follow the normal 'ee' rule.",
  "reasoning_check": "What are the tricky vowels in the middle of the word 'people'?",
  "context_variants": {
    "default": {
      "options": [
        "peeple",
        "people"
      ]
    },
    "ug": {
      "options": [
        "peeple",
        "people"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2i-4A: Brainstorming Sight Words**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of three tricky sight words that you can't just sound out perfectly (like 'was', 'said', or 'they'). Say them, then write them down from memory.",
  "success_condition": "Child lists three non-phonetic high-frequency words.",
  "failure_condition": "If they write phonetic words (like 'cat'), ask: 'Can you sound out every letter in cat perfectly? Yes. Find a word where the letters lie to you.'",
  "reasoning_check": "Pick one of your words. Which part of it is tricky?",
  "context_variants": {
    "default": {
      "constraint": "non-phonetic words"
    },
    "ug": {
      "constraint": "non-phonetic words"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

**PS2i-4B: Homophone Sentences**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Tell me a sentence using the word 'their' (like 'their dog'). Then tell me a sentence using the word 'there' (like 'over there'). Write both sentences.",
  "success_condition": "Child orally composes and writes sentences using correct contextual spelling of there/their.",
  "failure_condition": "If they confuse them, review: 'their' has an 'i' for 'heir/person'; 'there' has 'here' inside it.",
  "reasoning_check": "How do you remember which spelling to use for 'over there'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "target": "there vs their"
    },
    "ug": {
      "target": "there vs their"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2i-4C: Sight Word Story**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Story",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Write a short, two-sentence story. You must use the words 'because' and 'friend' in your story. Tell it to me first, then write it.",
  "success_condition": "Child orally composes and writes a short story utilizing and correctly spelling the target words.",
  "failure_condition": "If they misspell the target words, have them erase and correct just those words.",
  "reasoning_check": "Point to the word 'because'. Read the letters to me.",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "because",
        "friend"
      ]
    },
    "ug": {
      "words": [
        "because",
        "friend"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Milestone Task

**PS2i-M: Real-World Functional Writing**
```json
{
  "capacity_id": "PS2i",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We need to write a quick note to a friend. Write: 'I like you because you are fun.' Say it out loud, then write it.",
  "success_condition": "Child accurately spells the high-frequency words 'you', 'because', 'are'.",
  "failure_condition": "Do not correct during the task. If spelling fails heavily, review Execute level tasks.",
  "reasoning_check": "Show me the word 'because' on your note. How did you remember the tricky parts?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentence": "I like you because you are fun."
    },
    "ug": {
      "sentence": "I like you because you are fun."
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

## PS2j: Spelling as Encoding

### Encounter Level (Multisensory)

**PS2j-1A: Auditory Phoneme Segmentation**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Auditory Discrimination",
  "materials": [
    "None"
  ],
  "parent_prompt": "I'm going to say a big word: 'trumpet'. Let's count the sounds we hear in the first chunk, 'trum'. T-r-u-m. How many sounds is that?",
  "success_condition": "Child identifies 4 individual sounds.",
  "failure_condition": "If they say 1 or 2, stretch the sounds out very slowly while holding up a finger for each one.",
  "reasoning_check": "What is the very first sound in 'trum'? What is the last sound?",
  "context_variants": {
    "default": {
      "word": "trumpet"
    },
    "ug": {
      "word": "trumpet"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2j-1B: Physical Sound Mapping**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Physical Manipulation",
  "materials": [
    "4 small items (coins, blocks, or drawn boxes on paper)"
  ],
  "parent_prompt": "We are going to map the word 'frog'. Say the word slowly and push a coin forward for every sound you hear: /f/ /r/ /o/ /g/. How many coins did you push?",
  "success_condition": "Child pushes 4 coins, one for each phoneme.",
  "failure_condition": "If they push one coin for 'fr', remind them that a blend is two separate sounds pushed together.",
  "reasoning_check": "Which sound does the second coin stand for?",
  "context_variants": {
    "default": {
      "word": "frog",
      "phonemes": 4
    },
    "ug": {
      "word": "frog",
      "phonemes": 4
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

**PS2j-1C: Visual Spelling Check**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "Look at the word 's-w-i-m'. Read the letters out loud. Does that word have all the sounds we need to say 'swim'?",
  "success_condition": "Child confirms yes.",
  "failure_condition": "If they are confused, point to each letter while saying the sounds slowly.",
  "reasoning_check": "What sound does the 'w' make in that word?",
  "context_variants": {
    "default": {
      "word": "swim"
    },
    "ug": {
      "word": "swim"
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  }
}
```

### Execute Level (Say It, Then Write It)

**PS2j-2A: Phonetic Encoding Dictation**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a word you might not know how to spell. But you can figure it out. The word is 'pumpkin'. Say the first chunk ('pump'), say the sounds, write it. Then the next chunk ('kin').",
  "success_condition": "Child accurately segments and writes 'pumpkin'.",
  "failure_condition": "If they miss the 'p' in 'pump', have them stretch the sounds again: p-u-m-p.",
  "reasoning_check": "How did breaking the word into chunks help you spell it?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "pumpkin",
        "plastic"
      ]
    },
    "ug": {
      "words": [
        "plastic",
        "dustbin"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2j-2B: Sound Mapping to Letters**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Word Building",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Draw four little lines on your paper like this: _ _ _ _. We are going to spell 'stop'. What is the first sound? Write the letter on the first line. Next sound? Write it.",
  "success_condition": "Child maps the 4 phonemes to the 4 lines accurately to spell 'stop'.",
  "failure_condition": "If they struggle, say the word extremely slowly so they hear every distinct sound.",
  "reasoning_check": "Why do we need 4 lines for the word 'stop'?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "words": [
        "stop",
        "jump"
      ]
    },
    "ug": {
      "words": [
        "stop",
        "jump"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2j-2C: Complex Sentence Encoding**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Sentence Dictation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Repeat this sentence: 'The small crab hid in the sand.' Say it back, then write it.",
  "success_condition": "Child encodes complex consonant clusters (sm-, cr-, -nd) and digraphs accurately.",
  "failure_condition": "If they write 'cab' for 'crab', point to the word and ask what sounds are missing.",
  "reasoning_check": "Look at the word 'crab'. Did you remember both sounds at the beginning?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "sentences": [
        "The small crab hid in the sand."
      ]
    },
    "ug": {
      "sentences": [
        "The small crab hid in the sand."
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 5,
    "endurance": "speed_drill",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

### Discern Level (Error Detection)

**PS2j-3A: Visual Encoding Error**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper with printed sentence"
  ],
  "parent_prompt": "Someone tried to sound out the word 'jump'. They wrote 'j-u-p'. Read that word. What sound did they forget to encode?",
  "success_condition": "Child identifies that 'm' is missing.",
  "failure_condition": "If they can't tell, stretch 'jump' slowly and count the sounds on your fingers.",
  "reasoning_check": "Why is it easy to forget the 'm' in 'jump'?",
  "context_variants": {
    "default": {
      "word": "jump",
      "error": "jup",
      "fix": "jump"
    },
    "ug": {
      "word": "jump",
      "error": "jup",
      "fix": "jump"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2j-3B: Auditory Omission Error**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Auditory Error Detection",
  "materials": [
    "None"
  ],
  "parent_prompt": "Listen: 'I am going to d-r-i-n the water from the cup.' Did I say 'drink' correctly? What was missing?",
  "success_condition": "Child identifies the missing /k/ sound at the end.",
  "failure_condition": "If they say yes, emphasize the end of the word 'drin-K'.",
  "reasoning_check": "What letter makes the sound I forgot at the end?",
  "context_variants": {
    "default": {
      "word": "drink",
      "error": "drin"
    },
    "ug": {
      "word": "drink",
      "error": "drin"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

**PS2j-3C: Evaluating Invented Spelling**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Visual Discrimination",
  "materials": [
    "Paper with printed words"
  ],
  "parent_prompt": "A little kid tried to write the word 'elephant'. They wrote 'e-l-e-f-i-n-t'. It's not spelled perfectly, but did they do a good job capturing all the sounds they heard?",
  "success_condition": "Child confirms yes, it phonetically makes sense.",
  "failure_condition": "If they just say 'it's spelled wrong', explain that encoding is about getting the sounds down first, even if the spelling rules are tricky (like ph for f).",
  "reasoning_check": "Which part did they spell differently from the dictionary, but it still makes the same sound?",
  "context_variants": {
    "default": {
      "word": "elephant",
      "invented": "elefint"
    },
    "ug": {
      "word": "elephant",
      "invented": "elefint"
    }
  },
  "repetition_arc": {
    "execution_count": 4,
    "endurance": "mixed_errors",
    "milestone": "M"
  }
}
```

### Own Level (Production)

**PS2j-4A: Phonetic Spelling of Unknown Words**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Spelling",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "I am going to say a very long word you probably haven't spelled before: 'fantastic'. Break it into chunks. Clap the syllables. Now write it down just by listening to the sounds.",
  "success_condition": "Child claps fan-tas-tic and writes 'fantastic' (or highly accurate phonetic equivalent).",
  "failure_condition": "If they freeze, guide them: 'What is the first chunk? Fan. Spell fan.'",
  "reasoning_check": "Read the chunks back to me. Did you capture every sound?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "word": "fantastic"
    },
    "ug": {
      "word": "fantastic"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2j-4B: Descriptive Spelling**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Sentence Creation",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Think of an animal that lives in the ocean (like a shark, a crab, or a dolphin). Tell me a sentence about what it does. Then write it down, sounding out any hard words as best you can.",
  "success_condition": "Child orally composes and writes a sentence, utilizing phonetic encoding strategies for unknown words.",
  "failure_condition": "If they ask 'how do I spell...', tell them 'Stretch the sounds and write what you hear.'",
  "reasoning_check": "Show me a word you had to stretch out to spell. How did you figure it out?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "theme": "ocean animal"
    },
    "ug": {
      "theme": "lake animal (like a fish or hippo)"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```

**PS2j-4C: Teaching Encoding Strategies**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Instructional Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "If your little sibling asks you 'how do you spell blanket?', what steps would you tell them to follow so they can figure it out themselves?",
  "success_condition": "Child articulates strategies: say it slowly, chop it into syllables, listen for each sound, write the letters for those sounds.",
  "failure_condition": "If they just say 'I would tell them b-l-a...', remind them they are supposed to teach the *strategy*, not just give the answer.",
  "reasoning_check": "Why is it better to listen to the sounds instead of just trying to memorize every word?",
  "context_variants": {
    "default": {
      "concept": "how to spell an unknown word"
    },
    "ug": {
      "concept": "how to spell an unknown word"
    }
  },
  "repetition_arc": {
    "execution_count": 2,
    "endurance": "independent_creation",
    "milestone": "M"
  }
}
```

### Milestone Task

**PS2j-M: Independent Writing Application**
```json
{
  "capacity_id": "PS2j",
  "strand": 1,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "We are making a list of three things you want to do this weekend. Say them out loud to me, then write them down. Don't worry about perfect spelling—just stretch the sounds and write what you hear.",
  "success_condition": "Child orally composes and independently writes a list, demonstrating functional phonetic spelling without freezing or constantly asking for help.",
  "failure_condition": "Do not correct during the task. The goal is confident, readable phonetic encoding.",
  "reasoning_check": "Read your list back to me. Did you get all the sounds down?",
  "oral_component": true,
  "context_variants": {
    "default": {
      "prompt": "three things you want to do this weekend"
    },
    "ug": {
      "prompt": "three things you want to do this weekend"
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "parent_rubric": [
    {
      "criterion": "Did the child say the word/sentence out loud before writing?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target phonics pattern spelled correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the handwriting legible (letters formed correctly)?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → guide the child to fix the specific error before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Sentence must begin with a capital letter and end with a full stop."
  }
}
```
