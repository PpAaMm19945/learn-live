# Band 2 English Templates — Strand 3: Grammar & Mechanics

## GM2a: Sentence Types

### Encounter Level (Multisensory)

**GM2a-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read these 3 strips aloud. Sort them into 'telling', 'asking', and 'exciting' piles.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do you know this one is a question?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2a-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen as I read these 3 sentences. One is a command. Point to the one that tells someone what to do.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What makes it a command?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2a-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Here are 4 sentence strips. Find the two that are questions and put them together.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What do the question strips have in common at the end?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2a-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this picture of a market. Tell me one asking sentence (question) about it. Now write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What punctuation mark goes at the end of a question?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me an exciting sentence about a dog. Say it with excitement! Now write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which punctuation mark shows excitement?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a telling sentence (statement) about the weather today. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What goes at the end of a telling sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2a-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this sentence: 'Are we going to the park.' What is wrong with the punctuation at the end? Fix it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why did you change the full stop to a question mark?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Read this sentence: 'Wow, that is a huge tree?' Find the mistake and fix it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't a question mark belong there?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Read this sentence: 'Go wash your hands?' Fix the incorrect punctuation.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Is 'Go wash your hands' asking or telling you to do something?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2a-4A: Own Variation A**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write three different types of sentences about a dog: a telling sentence, an asking sentence, and an exciting sentence. Tell them to me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Read your exciting sentence. Does your voice sound exciting when you read it?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-4B: Own Variation B**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a question about lunch, and then write a statement answering it. Tell them to me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Point to the different punctuation marks you used.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2a-4C: Own Variation C**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a command telling someone to stop, and an exclamation about why they should stop. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How are the punctuation marks different for these two sentences?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2a-M: Milestone Production**
```json
{
  "capacity_id": "GM2a",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2a: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2b: Nouns — Common & Proper

### Encounter Level (Multisensory)

**GM2b-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Here are cards with names of things (like 'dog') and specific names (like 'Tendo'). Sort them into 'any person/thing' and 'specific person/thing' piles.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does Tendo get a capital letter but dog does not?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2b-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to these words: 'city', 'Kampala'. Which one names a specific place?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do we write specific place names differently?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2b-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the specific name in this sentence: 'My sister Amara is tall.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why is 'Amara' capitalized but 'sister' is not?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2b-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence using the name of your city and the word 'market'. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which word needs a capital letter because it is a specific name?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about your friend using their specific name. Write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Did you use a capital letter for your friend's name?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence using the specific name of a day of the week. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does the day of the week start with a capital letter?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2b-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Find the mistake: 'my friend amara went to the store.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does Amara need a capital A?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this sentence: 'We live in the City.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't 'City' need a capital letter here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'I saw mr. smith at the park.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is wrong with 'mr. smith'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2b-4A: Own Variation A**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Invent a specific name for a pet. Write a sentence about it using its proper name and the common noun 'pet'. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me the proper noun in your sentence.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-4B: Own Variation B**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence naming a specific country and a common noun describing it (e.g. 'place'). Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Point out the proper noun and the common noun.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2b-4C: Own Variation C**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence using your specific school name. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why are the words in the school name capitalized?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2b-M: Milestone Production**
```json
{
  "capacity_id": "GM2b",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2b: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2c: Verbs — Action Words

### Encounter Level (Multisensory)

**GM2c-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: I will say some words. If it is something you can DO (an action), stand up. If not, sit down. 'Run', 'apple', 'jump', 'book'.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Can you 'apple'? Why not?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2c-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Show me an action with your body, and tell me the word for it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do you know that word is an action word?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2c-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen to this sentence: 'The cat sleeps.' What is the cat doing?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Is 'sleep' an action you can do?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2c-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence about what a bird does. Use a strong action word. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is the action word in your sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about a frog using an action word. Write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Circle the action word.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about what you do at the park. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What action word did you use?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2c-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this: 'The boy tall to the store.' What is missing or wrong?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't 'tall' work as an action word here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this sentence: 'The fish water in the pond.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Is 'water' an action word?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the missing action word: 'She quickly her food.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What word could we add to show what she did to the food?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2c-4A: Own Variation A**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence with two different action words about what you do in the morning. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me the two action words you chose.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-4B: Own Variation B**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence about an animal doing something surprising. Use a strong action word. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does the action word change the sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2c-4C: Own Variation C**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a short sentence with an action word. Then, rewrite it using a different action word. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does changing the action word change the meaning?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2c-M: Milestone Production**
```json
{
  "capacity_id": "GM2c",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2c: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2c",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2d: Adjectives — Describing Words

### Encounter Level (Multisensory)

**GM2d-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Hold this object. Tell me three words that describe how it feels, looks, or smells.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What does the word 'rough' tell us about the rock?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2d-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Look at this picture. Find two words to describe the color and size of the ball.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do those words help us imagine the ball?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2d-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen: 'The loud dog barked.' Which word describes the dog?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What does 'loud' tell us?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2d-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence about a tree using two describing words (adjectives). Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which words describe the tree?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about your favorite shirt using a describing word for its color. Write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What does the adjective tell us about the shirt?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about the weather using a describing word. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which word is the adjective?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2d-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this sentence: 'The red loud apple fell.' Which describing word doesn't make sense for an apple?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't 'loud' make sense for an apple?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this sentence: 'The hot ice cream was good.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't 'hot' make sense for ice cream?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'The tall bug crawled away.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Is a bug usually tall?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2d-4A: Own Variation A**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence describing your favorite food using at least two adjectives. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do your adjectives help me imagine the food?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-4B: Own Variation B**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence describing a scary monster using three adjectives. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which describing word makes the monster sound the scariest?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2d-4C: Own Variation C**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence about a quiet place using adjectives that make it sound peaceful. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do those describing words set the mood?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2d-M: Milestone Production**
```json
{
  "capacity_id": "GM2d",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2d: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2e: Subject-Verb Agreement

### Encounter Level (Multisensory)

**GM2e-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Listen: 'The dog run' vs 'The dog runs'. Which one sounds right?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why do we add an 's' to run when we talk about one dog?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2e-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen: 'They jumps' vs 'They jump'. Which is correct?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why don't we add an 's' when we talk about more than one?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2e-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: I will say a sentence with a missing word. 'The cat ___ (sleep/sleeps).' Which word fits?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do you know it's 'sleeps'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2e-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence starting with 'They' and the action 'jump'. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why did you write 'jump' instead of 'jumps'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence starting with 'He' and the action 'run'. Write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why did you add an 's' to run?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about what 'we' do. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Did you use an action word without an 's'? Why?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2e-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Fix this sentence: 'The boys runs to the park.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "If there is more than one boy, what happens to the action word?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this sentence: 'The girl play with the ball.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does the action word need an 's' here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'He walk to school every day.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is missing at the end of the action word?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2e-4A: Own Variation A**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write one sentence about one cat playing, and another sentence about two cats playing. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me how the action word changed in the second sentence.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-4B: Own Variation B**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence starting with 'She' and another starting with 'They' using the same action word. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain why the action words look different.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2e-4C: Own Variation C**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence about a team of players. Use the word 'team' (one group). Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Does the action word take an 's' for one team?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2e-M: Milestone Production**
```json
{
  "capacity_id": "GM2e",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2e: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2f: Singular & Plural Nouns

### Encounter Level (Multisensory)

**GM2f-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Here is one bean. Here are three beans. What sound did I add to the end of 'bean' to show there is more than one?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What letter usually shows us there is more than one?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2f-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to the words 'fox' and 'foxes'. What sound did we add?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why did we add an 'es' sound instead of just 's'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2f-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: I have a card that says 'tooth'. How do we say more than one tooth?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Does 'tooths' sound right?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2f-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence about three dogs. Now write it down.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How did you spell 'dogs' to show there are three?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about two boxes. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What two letters did you add to the end of box?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about your feet. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Did you write 'foots' or 'feet'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2f-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Find the mistake: 'I saw two bird in the tree.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does bird need an 's' here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this sentence: 'There are three branchs on the ground.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What letters do we add to words ending in 'ch'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'The childs are playing.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is the special plural word for child?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2f-4A: Own Variation A**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence that uses both the word 'child' and the word 'children'. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why didn't you write 'childs'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-4B: Own Variation B**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence about multiple mice. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is the special plural word for mouse?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2f-4C: Own Variation C**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence about a box and another sentence about many boxes. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me the plural form of box.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2f-M: Milestone Production**
```json
{
  "capacity_id": "GM2f",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2f: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2f",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2g: Verb Tenses — Simple

### Encounter Level (Multisensory)

**GM2g-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: If I say 'I walk today', but I want to talk about yesterday, what do I say? 'Yesterday, I...'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What sound did you add to the end of walk to make it happen yesterday?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2g-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen: 'I jump' vs 'I jumped'. Which one already happened?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does the word 'jumped' show the action is finished?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2g-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: If I say 'I am playing now', but I want to say I will do it tomorrow, what do I say?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What word did you add to show it happens in the future?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2g-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence about something you did yesterday using an action word ending in '-ed'. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What letters show that this happened in the past?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about something you will do tomorrow. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which word tells us this hasn't happened yet?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about something you are doing right now. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Does the action word end in '-ing'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2g-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Fix this sentence: 'Tomorrow I walked to the store.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does 'walked' not make sense with 'Tomorrow'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this: 'Yesterday I will play outside.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why doesn't 'will play' match 'Yesterday'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'I jumping right now.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What small word is missing before 'jumping'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2g-4A: Own Variation A**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence about what you will do tomorrow, and what you did yesterday. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How did the action word change between the two sentences?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-4B: Own Variation B**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a short story with three sentences, all happening in the past. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Point to the action words. Do they all show the past?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2g-4C: Own Variation C**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence about an action happening now, and another sentence about an action in the future. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the difference between the verb tenses.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2g-M: Milestone Production**
```json
{
  "capacity_id": "GM2g",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2g: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2h: Commas in Lists

### Encounter Level (Multisensory)

**GM2h-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: I have an apple, a banana, and a pear. When we write a list of three things, we need a little mark to separate them. It's called a comma. Point to where you think commas go in this sentence: 'I like apples bananas and pears.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why do we need commas in a list?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2h-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen as I read this sentence without pausing: 'I need milk eggs bread and cheese.' Now I'll read it with pauses for commas. Where did I pause?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do the pauses help us understand the list?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2h-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Look at this list: 'red, blue, and green'. Point to the commas.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Do we put a comma after the word 'and'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2h-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence listing three colors you like. Make sure to pause between them. Now write it, using commas where you paused.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Where did you put the commas?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence listing three animals. Write it down with commas.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Did you use a comma before 'and'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about three friends. Write it using commas.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How many commas did you need for a list of three?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2h-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Fix this sentence: 'I bought milk bread, and eggs.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Where is the missing comma?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this: 'We saw lions, tigers, bears at the zoo.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What word is missing before the last animal?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'I like, running, jumping, and playing.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why shouldn't there be a comma after 'like'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2h-4A: Own Variation A**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence listing four animals you might see on a farm. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How many commas did you use for four items?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-4B: Own Variation B**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence listing three things you do before bed. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me where the commas separate the actions.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2h-4C: Own Variation C**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence listing your three favorite foods. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain why we use commas in a list.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2h-M: Milestone Production**
```json
{
  "capacity_id": "GM2h",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2h: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2h",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2i: Apostrophes — Possession

### Encounter Level (Multisensory)

**GM2i-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: This is Tendo's toy. The little mark before the 's' is an apostrophe. It shows the toy belongs to Tendo. Show me another thing in the room and say who it belongs to.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What does the apostrophe tell us in 'Tendo's toy'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2i-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen: 'The dogs bone'. Does the bone belong to the dog? The apostrophe shows ownership.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Where does the apostrophe go?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2i-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Look at these cards: 'cat's' and 'cats'. Which one means 'belonging to the cat'?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is the difference between the two words?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2i-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence about a dog's bone. Write it down, and don't forget the apostrophe 's'.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Who does the bone belong to, and how does your writing show that?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence about your friend's house. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Where did you put the apostrophe?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence about a bird's nest. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What does the apostrophe 's' show?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2i-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: What is wrong with this sentence? 'The cats bowl is empty.' (Talking about one cat).",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Where does the apostrophe go to show the bowl belongs to the cat?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this: 'My sisters toy is broken.' (Talking about one sister).",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How do we show the toy belongs to the sister?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'That is the boy's' ball.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Is the apostrophe in the correct place?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2i-4A: Own Variation A**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence about something that belongs to your friend. Use their name and an apostrophe 's'. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Point to the apostrophe. What is its job in this sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-4B: Own Variation B**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence about an animal's habitat (like a bear's cave). Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How did you show possession?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2i-4C: Own Variation C**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence using a person's name to show they own something. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain why you used an apostrophe.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2i-M: Milestone Production**
```json
{
  "capacity_id": "GM2i",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2i: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2i",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2j: Conjunctions — Simple

### Encounter Level (Multisensory)

**GM2j-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Listen to these two short sentences: 'I like apples. I like bananas.' We can stick them together using the word 'and'. Say the new sentence.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What word did you use as glue to stick the sentences together?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2j-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen: 'I wanted to play outside. It was raining.' What word can we use to connect these? 'But' or 'and'?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why is 'but' a better glue word here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2j-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen: 'I am tired. I went to sleep.' What word explains why I went to sleep?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does 'because' connect the two ideas?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2j-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence that uses the word 'because' to explain why you are happy. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What is the glue word in your sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a sentence using 'but' to connect two different ideas. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does 'but' change the meaning of the sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence using 'and' to connect two things you like. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What two ideas did you join?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2j-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Fix this sentence: 'I wanted to go outside, because it was raining.' (Hint: wrong glue word).",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why does 'but' make more sense than 'because' here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this: 'I am hungry and I didn't eat breakfast.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Which word better explains the reason? 'And' or 'because'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Find the mistake: 'I like cats but I like dogs.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why is 'and' better than 'but' here?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2j-4A: Own Variation A**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write one long sentence using 'so' to connect two ideas. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What are the two ideas you connected with 'so'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-4B: Own Variation B**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a sentence using 'because' to answer a 'why' question. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the cause and effect in your sentence.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2j-4C: Own Variation C**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a compound sentence using 'and'. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me the two complete ideas that are connected.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2j-M: Milestone Production**
```json
{
  "capacity_id": "GM2j",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2j: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2j",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

## GM2k: Sentence Expansion

### Encounter Level (Multisensory)

**GM2k-1A: Encounter Variation A**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Start with this sentence: 'The boy ran.' Let's make it bigger. Tell me WHERE he ran. Now tell me WHEN he ran.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How does adding 'where' and 'when' make the sentence better?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2k-1B: Encounter Variation B**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Start with 'The dog barked.' Tell me WHY it barked.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Does adding 'why' give us more information?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2k-1C: Encounter Variation C**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Start with 'The car stopped.' Tell me HOW it stopped.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What word did you use to describe how it stopped?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
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

**GM2k-2A: Execute Variation A**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Start with 'The cat slept.' Tell me a longer sentence that adds where and how it slept. Now write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "What details did you add to the original sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-2B: Execute Variation B**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Start with 'The sun shines.' Tell me a longer sentence adding when and where. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Read your expanded sentence.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-2C: Execute Variation C**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Start with 'We play.' Add who you play with and when. Write it.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How much longer is your new sentence?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**GM2k-3A: Discern Variation A**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this: 'The dog barked loudly at the mailman in the morning yesterday.' This sentence is too crowded. How can we fix it?",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why shouldn't we put 'in the morning' and 'yesterday' right next to each other like that?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-3B: Discern Variation B**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Fix this: 'He ran fast quick to the house.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Why don't we need both 'fast' and 'quick'?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-3C: Discern Variation C**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Improve this sentence: 'The big large giant tree fell.'",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How many describing words do we really need?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Own Level (Production)

**GM2k-4A: Own Variation A**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a very short 3-word sentence. Then, rewrite it to be longer by adding 'who', 'where', and 'when'. Tell me both first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Show me the words that answer 'where' in your long sentence.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-4B: Own Variation B**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a basic sentence, then expand it by adding adjectives and an adverb. Tell me both first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How did the extra words change the picture in your mind?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

**GM2k-4C: Own Variation C**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a short sentence, then expand it using a conjunction. Tell me both first.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "How did the conjunction help you add more information?",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 3,
    "endurance": "noise_injection",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```

### Milestone Task

**GM2k-M: Milestone Production**
```json
{
  "capacity_id": "GM2k",
  "strand": 3,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for GM2k: We need to write a message or note. Apply the grammar rule without being told what the rule is. Think about how to write clearly.",
  "success_condition": "Child correctly identifies or produces the target grammar structure.",
  "failure_condition": "If incorrect, provide the rule simply and ask them to try again.",
  "reasoning_check": "Explain the choices you made in your writing.",
  "context_variants": {
    "default": {
      "names": [
        "Alex",
        "Sam",
        "Pat"
      ],
      "settings": [
        "park",
        "school",
        "store"
      ],
      "food": [
        "apples",
        "bread",
        "milk"
      ]
    },
    "ug": {
      "names": [
        "Amara",
        "Tendo",
        "Azie"
      ],
      "settings": [
        "Kampala market",
        "village",
        "garden"
      ],
      "food": [
        "matooke",
        "mangoes",
        "chapati"
      ]
    }
  },
  "repetition_arc": {
    "execution_count": 1,
    "endurance": "none",
    "milestone": "M"
  },
  "oral_component": true,
  "parent_rubric": [
    {
      "criterion": "Did the child say it out loud first?",
      "type": "yes_no"
    },
    {
      "criterion": "Is the target grammar rule applied correctly?",
      "type": "yes_no"
    },
    {
      "criterion": "Does the sentence start with a capital and end with correct punctuation?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2k",
    "constraint": "Must apply the target grammar rule correctly in writing."
  }
}
```
