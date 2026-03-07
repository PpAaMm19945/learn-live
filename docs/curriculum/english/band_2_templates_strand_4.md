# Band 2 English Templates — Strand 4: Composition & Writing

## CW2a: Sentence Writing

### Encounter Level (Multisensory)

**CW2a-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Show the picture of a boy running. Tell me a complete sentence about what you see.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know that is a complete sentence?",
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

**CW2a-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to this: 'The big dog.' Is that a complete sentence? What is missing?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What does a sentence need to be complete?",
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

**CW2a-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Look at these word cards. Arrange them to make a complete sentence.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read your sentence. Does it make sense on its own?",
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

**CW2a-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at the picture of the market. Say a complete sentence about it. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Tell me a complete sentence about your favorite animal. Now write it down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Say a complete sentence about what you did today. Then, write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2a-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this: 'ran fast to the park.' What is wrong? Fix it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you make that change?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Look at this sentence: 'The cat sleeps on the mat' What is missing at the end?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you make that change?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Read this: 'the sun is hot.' What is wrong at the beginning?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you make that change?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Own Level (Production)

**CW2a-4A: Own Variation A**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write two complete sentences about a friend. Tell them to me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me the capital letter and full stop in your sentences.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-4B: Own Variation B**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write three complete sentences about a place you like. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me the capital letter and full stop in your sentences.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2a-4C: Own Variation C**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a complete sentence that asks a question, and another that answers it. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me the capital letter and full stop in your sentences.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Milestone Task

**CW2a-M: Milestone Production**
```json
{
  "capacity_id": "CW2a",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2a: Write a short note to your friend telling them what you played today.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

## CW2b: Paragraph Writing — Guided

### Encounter Level (Multisensory)

**CW2b-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sentence strips",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Here are 4 sentences. Three are about a dog, one is about a car. Which one doesn't belong?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you remove the sentence about the car?",
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

**CW2b-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sentence strips",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to this paragraph. Does every sentence talk about the same main idea?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What was the main idea of that paragraph?",
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

**CW2b-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sentence strips",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Sort these sentence strips into two groups: one about eating, one about playing.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know those sentences go together?",
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

**CW2b-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me 3 sentences about a monkey. Make sure they are all about the monkey. Now write them.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say 3 sentences describing your house. Write them down in order.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a short paragraph (3-4 sentences) about what you eat for lunch. Write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2b-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this paragraph. Which sentence does not belong to the topic?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why you fixed it that way.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Read these sentences. Are they in an order that makes sense?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why you fixed it that way.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: This paragraph has a beginning and an end, but no middle. What is missing?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why you fixed it that way.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

### Own Level (Production)

**CW2b-4A: Own Variation A**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a 4-sentence paragraph about a fun day. Tell me the sentences first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know all your sentences are about the same topic?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-4B: Own Variation B**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a paragraph describing your favorite toy. Make sure all sentences stick to the topic. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know all your sentences are about the same topic?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

**CW2b-4C: Own Variation C**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a paragraph explaining how to wash your hands. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know all your sentences are about the same topic?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

### Milestone Task

**CW2b-M: Milestone Production**
```json
{
  "capacity_id": "CW2b",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2b: Write a short description of your favorite place to show to a family member.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2e",
    "constraint": "Must apply grammar rules from GM2e correctly in writing."
  }
}
```

## CW2c: Topic Sentences

### Encounter Level (Multisensory)

**CW2c-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paragraph cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this paragraph. Which sentence tells you what the WHOLE paragraph is about?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does that sentence prepare you for the rest of the paragraph?",
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

**CW2c-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paragraph cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to this paragraph. I left out the first sentence. What do you think it should be?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why does the paragraph need a strong start?",
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

**CW2c-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paragraph cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Here are 3 sentences. Which one would make the best starting sentence for a paragraph about lions?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What makes that a good topic sentence?",
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

**CW2c-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: We are writing a paragraph about rain. Tell me a good topic sentence. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say a topic sentence for a paragraph about playing a game. Write it down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a sentence that introduces the topic of 'school'. Write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2c-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this paragraph. Is the first sentence a good topic sentence, or just a detail?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why your topic sentence is better.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Here are two topic sentences for a paragraph about baking. Which one is better?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why your topic sentence is better.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: The topic sentence says 'I like dogs', but the paragraph is about cats. Fix the topic sentence.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain why your topic sentence is better.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Own Level (Production)

**CW2c-4A: Own Variation A**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a topic sentence for a paragraph about a holiday, then write two more sentences. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Does your topic sentence tell the reader what to expect?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-4B: Own Variation B**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Choose a topic you like. Write a topic sentence for it. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Does your topic sentence tell the reader what to expect?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2c-4C: Own Variation C**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a topic sentence that makes someone want to read more about spiders. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Does your topic sentence tell the reader what to expect?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Milestone Task

**CW2c-M: Milestone Production**
```json
{
  "capacity_id": "CW2c",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2c: Write a short introduction for a poster about your favorite animal.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

## CW2d: Sequenced Narrative

### Encounter Level (Multisensory)

**CW2d-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Story picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Here are 3 pictures from a story. Put them in order: beginning, middle, and end.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you put the pictures in that order?",
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

**CW2d-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Story picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to this story. Tell me what happened first, next, and last.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know what part was the middle?",
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

**CW2d-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Story picture cards",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: I will tell you the beginning and end of a story. You tell me what happens in the middle.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Does your middle connect the beginning to the end?",
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

**CW2d-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a short story with a clear beginning, middle, and end. Now write it in 3 parts.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say a story about finding a lost toy. What happened first, next, last? Write it down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me a story about a rainy day. Make sure it has 3 parts. Write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2d-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this story. The middle is at the end! Fix the order.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the order of events important in a story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: This story has a beginning and middle, but stops suddenly. What is wrong?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the order of events important in a story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Read this story. Does the beginning make sense with the end?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the order of events important in a story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Own Level (Production)

**CW2d-4A: Own Variation A**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a 3-part story about an adventure. Tell me the sequence first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me where your story transitions from the beginning to the middle.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-4B: Own Variation B**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a story about a brave animal. Use a paragraph for the beginning, middle, and end. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me where your story transitions from the beginning to the middle.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2d-4C: Own Variation C**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Make up a story with a problem and a solution. Write it in 3 parts. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me where your story transitions from the beginning to the middle.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Milestone Task

**CW2d-M: Milestone Production**
```json
{
  "capacity_id": "CW2d",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2d: Write a story to entertain your younger sibling.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

## CW2e: Descriptive Writing

### Encounter Level (Multisensory)

**CW2e-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Objects with different textures/smells",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Touch this object with your eyes closed. Tell me 3 words that describe how it feels.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do those words help someone imagine the object?",
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

**CW2e-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Objects with different textures/smells",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Look at this picture of a forest. Tell me what you might hear and smell if you were there.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we use words about smell and sound?",
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

**CW2e-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Objects with different textures/smells",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen to this sentence: 'The boy ate the apple.' Let's add describing words. 'The ___ boy ate the ___ apple.'",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did the describing words change the picture in your mind?",
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

**CW2e-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a sentence describing a scary monster using 3 describing words. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say two sentences describing your favorite food, including how it tastes and looks. Write them.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Describe a cold day using sensory details. Write it down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2e-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this description. Which words are describing words?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you choose those describing words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: This sentence is boring: 'The dog barked.' Add two describing words to make it better.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you choose those describing words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Read this: 'The hot snow fell.' What is wrong with the describing word?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why did you choose those describing words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

### Own Level (Production)

**CW2e-4A: Own Variation A**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a short paragraph describing a hidden treasure. Use at least 4 adjectives. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Point to the sensory details you used in your writing.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-4B: Own Variation B**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Describe a busy street market so that I can see and hear it in my mind. Write it down. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Point to the sensory details you used in your writing.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

**CW2e-4C: Own Variation C**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a description of a quiet place. Use words that make it feel calm. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Point to the sensory details you used in your writing.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

### Milestone Task

**CW2e-M: Milestone Production**
```json
{
  "capacity_id": "CW2e",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2e: Write a description of a lost item so someone can help you find it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2d",
    "constraint": "Must apply grammar rules from GM2d correctly in writing."
  }
}
```

## CW2f: Personal Narrative

### Encounter Level (Multisensory)

**CW2f-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Photographs of the child/family",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this photo of you. Tell me the story of what happened that day.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you remember what happened first?",
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

**CW2f-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Photographs of the child/family",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to my story about when I was little. Now tell me a story about something that happened to you.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it easier to tell a story that really happened to you?",
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

**CW2f-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Photographs of the child/family",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Think of a time you were very happy. Tell me who was there and what you did.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What details make your memory clear?",
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

**CW2f-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me a story about a time you got hurt. Include what happened and how you felt. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say a story about a fun trip you took. Make sure it has a beginning, middle, and end. Write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me about a time you learned something new. Write the story down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2f-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this personal narrative. Did the writer include how they felt?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to include details in a personal story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: This story jumps around. How can we put the events in the right order?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to include details in a personal story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: The story says 'We went to the park. It was fun.' How can we add more detail?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to include details in a personal story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Own Level (Production)

**CW2f-4A: Own Variation A**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a personal narrative about a surprising day. Tell me the story first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include how you felt at the end of the story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-4B: Own Variation B**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write about a time you helped someone. Use details to describe what happened. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include how you felt at the end of the story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

**CW2f-4C: Own Variation C**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a story about your first memory. Make it 3 paragraphs. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include how you felt at the end of the story?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

### Milestone Task

**CW2f-M: Milestone Production**
```json
{
  "capacity_id": "CW2f",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2f: Write a letter to a grandparent telling them about something exciting you did recently.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2g",
    "constraint": "Must apply grammar rules from GM2g correctly in writing."
  }
}
```

## CW2g: Informational Writing — Simple

### Encounter Level (Multisensory)

**CW2g-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Non-fiction books/pictures",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this picture of a lion. Tell me 3 true facts about lions.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How do you know those are facts?",
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

**CW2g-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Non-fiction books/pictures",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen to this paragraph. Is it telling a made-up story or giving true facts?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What is the difference between a fact and a story?",
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

**CW2g-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Non-fiction books/pictures",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Sort these statements into 'Facts about the Sun' and 'Made-up stories about the Sun'.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we read informational books?",
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

**CW2g-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Tell me 3 facts about cows. Make sure they are true. Now write them.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Say 3 facts about what plants need to grow. Write them down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Tell me 3 facts about your school. Write them.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2g-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Read this paragraph about frogs. One sentence is a silly made-up story. Find it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why shouldn't we put opinions in a list of facts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: These facts about the moon are out of order. How should we group them?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why shouldn't we put opinions in a list of facts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: This sentence says 'I think spiders are scary.' Is that a fact or an opinion?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why shouldn't we put opinions in a list of facts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

### Own Level (Production)

**CW2g-4A: Own Variation A**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Choose an animal you know a lot about. Write a paragraph with 4 facts about it. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you make sure your information was accurate?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-4B: Own Variation B**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write an informational paragraph explaining how to make a sandwich. Tell me the steps first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you make sure your information was accurate?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

**CW2g-4C: Own Variation C**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write 4 facts about your city or town. Group them into a paragraph. Tell me first.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you make sure your information was accurate?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

### Milestone Task

**CW2g-M: Milestone Production**
```json
{
  "capacity_id": "CW2g",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2g: Write a short guide to teach someone how to play your favorite game.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2b",
    "constraint": "Must apply grammar rules from GM2b correctly in writing."
  }
}
```

## CW2h1: Letter Formation — Print

### Encounter Level (Multisensory)

**CW2h1-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sand/salt tray or textured letters",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Trace this letter 'a' in the sand with your finger. Feel how you go around, up, and down.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we start letters at the top?",
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
  "oral_component": false
}
```

**CW2h1-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sand/salt tray or textured letters",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Watch me write the letter 'B'. Where did I start? Now you trace it in the air.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does tracing help your hand learn?",
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
  "oral_component": false
}
```

**CW2h1-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sand/salt tray or textured letters",
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Here are some letters made of clay. Close your eyes and feel this one. What letter is it?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What shape is the letter 'o'?",
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
  "oral_component": false
}
```

### Execute Level (Say It, Then Write It)

**CW2h1-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write the uppercase and lowercase 'A' three times correctly on the lines.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
  "oral_component": false
}
```

**CW2h1-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write the letters 'b', 'd', 'p', and 'q'. Make sure the circles are on the correct side.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
  "oral_component": false
}
```

**CW2h1-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write the letters that have 'tails' hanging below the line (g, j, p, q, y).",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
  "oral_component": false
}
```

### Discern Level (Error Detection)

**CW2h1-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at these three 'a's. Which one is formed the best? Why?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to form letters correctly?",
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
  "oral_component": false
}
```

**CW2h1-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: This 'd' looks like a 'b'. How can we fix it?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to form letters correctly?",
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
  "oral_component": false
}
```

**CW2h1-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: The letter 'h' has a short stick here. Does it look like an 'n' by mistake?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to form letters correctly?",
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
  "oral_component": false
}
```

### Own Level (Production)

**CW2h1-4A: Own Variation A**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write the whole alphabet in uppercase. Take your time.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me your best letter and explain why it is good.",
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
  "oral_component": false
}
```

**CW2h1-4B: Own Variation B**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write the whole alphabet in lowercase. Make sure tall letters touch the top line.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me your best letter and explain why it is good.",
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
  "oral_component": false
}
```

**CW2h1-4C: Own Variation C**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write your full name, making sure every letter is formed perfectly.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Show me your best letter and explain why it is good.",
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
  "oral_component": false
}
```

### Milestone Task

**CW2h1-M: Milestone Production**
```json
{
  "capacity_id": "CW2h1",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2h1: Write a short, neat label for a box of your things.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
  "oral_component": false
}
```

## CW2h2: Spacing & Sizing

### Encounter Level (Multisensory)

**CW2h2-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Lined paper",
    "Pencil",
    "Finger spacer (optional)"
  ],
  "parent_prompt": "Variation A: Look at this sentence. The words are squished together. Can you read it easily?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we need spaces between words?",
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
  "oral_component": false
}
```

**CW2h2-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Lined paper",
    "Pencil",
    "Finger spacer (optional)"
  ],
  "parent_prompt": "Variation B: Look at this sentence. Some letters are flying above the line! Show me where they should sit.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What happens if all the letters are different sizes?",
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
  "oral_component": false
}
```

**CW2h2-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Lined paper",
    "Pencil",
    "Finger spacer (optional)"
  ],
  "parent_prompt": "Variation C: Put your finger between these words to show the 'finger space'.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we write on the baseline?",
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
  "oral_component": false
}
```

### Execute Level (Say It, Then Write It)

**CW2h2-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Copy this sentence. Use a finger space between every word.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
  "oral_component": false
}
```

**CW2h2-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Copy these words. Make sure the tall letters (t, l, h) are taller than the short letters (a, e, i).",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
  "oral_component": false
}
```

**CW2h2-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a sentence. Make sure every letter sits firmly on the bottom line.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
  "oral_component": false
}
```

### Discern Level (Error Detection)

**CW2h2-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this writing. Circle the places where words are too close together.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does spacing make writing easier to understand?",
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
  "oral_component": false
}
```

**CW2h2-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Find the letters that are sinking below the line when they shouldn't.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does spacing make writing easier to understand?",
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
  "oral_component": false
}
```

**CW2h2-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Which of these two sentences is easier to read? Why?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does spacing make writing easier to understand?",
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
  "oral_component": false
}
```

### Own Level (Production)

**CW2h2-4A: Own Variation A**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a 3-sentence story. Focus on perfect spacing between words.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Check your work. Are all your spaces even?",
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
  "oral_component": false
}
```

**CW2h2-4B: Own Variation B**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a list of your favorite foods. Keep all your lowercase letters exactly the same size.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Check your work. Are all your spaces even?",
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
  "oral_component": false
}
```

**CW2h2-4C: Own Variation C**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a paragraph. Make sure the margins are straight on the left side.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Check your work. Are all your spaces even?",
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
  "oral_component": false
}
```

### Milestone Task

**CW2h2-M: Milestone Production**
```json
{
  "capacity_id": "CW2h2",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2h2: Write a neat sign for your bedroom door.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
  "oral_component": false
}
```

## CW2h3: Handwriting Speed

### Encounter Level (Multisensory)

**CW2h3-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Timer",
    "Paper",
    "Pencil",
    "Familiar text"
  ],
  "parent_prompt": "Variation A: Watch me write a sentence slowly, then quickly. Is the quick one still neat?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to write quickly AND neatly?",
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
  "oral_component": false
}
```

**CW2h3-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Timer",
    "Paper",
    "Pencil",
    "Familiar text"
  ],
  "parent_prompt": "Variation B: Listen to this song. I will write words to the beat of the song.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What happens to your letters if you rush too much?",
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
  "oral_component": false
}
```

**CW2h3-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Timer",
    "Paper",
    "Pencil",
    "Familiar text"
  ],
  "parent_prompt": "Variation C: Let's see how many times you can write your name neatly in 30 seconds.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does holding the pencil correctly help you write faster?",
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
  "oral_component": false
}
```

### Execute Level (Say It, Then Write It)

**CW2h3-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Copy this short poem as quickly as you can while keeping it neat. I will time you for 1 minute.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
  "oral_component": false
}
```

**CW2h3-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: I will say 10 simple words. Write them down as fast as you can neatly.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
  "oral_component": false
}
```

**CW2h3-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write the alphabet from A to Z as quickly as possible. Ensure it is legible.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
  "oral_component": false
}
```

### Discern Level (Error Detection)

**CW2h3-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Look at this fast writing. Which letters became messy because of rushing?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How can you keep your writing neat when you write faster?",
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
  "oral_component": false
}
```

**CW2h3-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Compare your fast writing to your slow writing. What is the difference?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How can you keep your writing neat when you write faster?",
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
  "oral_component": false
}
```

**CW2h3-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: If you want to speed up, which letter shapes slow you down the most?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How can you keep your writing neat when you write faster?",
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
  "oral_component": false
}
```

### Own Level (Production)

**CW2h3-4A: Own Variation A**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a full paragraph about a sport. Focus on smooth, steady speed without stopping. (Target: 10 wpm)",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you keep a steady pace, or did you stop and start?",
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
  "oral_component": false
}
```

**CW2h3-4B: Own Variation B**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write down everything you can remember about a movie in 3 minutes. Focus on steady writing.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you keep a steady pace, or did you stop and start?",
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
  "oral_component": false
}
```

**CW2h3-4C: Own Variation C**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a letter to a friend as quickly and neatly as you can. Time yourself.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you keep a steady pace, or did you stop and start?",
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
  "oral_component": false
}
```

### Milestone Task

**CW2h3-M: Milestone Production**
```json
{
  "capacity_id": "CW2h3",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2h3: Take quick notes while I read a short list of instructions.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
  "oral_component": false
}
```

## CW2i: Revision — Guided

### Encounter Level (Multisensory)

**CW2i-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sample draft with obvious errors",
    "Colored pencil"
  ],
  "parent_prompt": "Variation A: Read this sentence: 'the dog bark.' What two things are wrong? Let's fix them with a colored pencil.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do we check our work after we finish writing?",
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

**CW2i-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sample draft with obvious errors",
    "Colored pencil"
  ],
  "parent_prompt": "Variation B: Listen to me read this paragraph aloud. Raise your hand when something sounds wrong.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does reading aloud help us find mistakes?",
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

**CW2i-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Sample draft with obvious errors",
    "Colored pencil"
  ],
  "parent_prompt": "Variation C: Look at this messy paper. What is the first thing we should check? (Capitals and full stops).",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "What does revision mean?",
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

**CW2i-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a sentence. Now, use your colored pencil to check for a capital letter and a full stop.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a short paragraph. Read it aloud to me and point out any missing words.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write two sentences. I will put a dot next to the line with a mistake. You find it and fix it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2i-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Here is a story. Find 3 spelling mistakes and fix them.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the revised version better than the first draft?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Read this sentence aloud. Does it make sense? Add a word to fix it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the revised version better than the first draft?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: This paragraph is boring. Let's revise it by adding two describing words.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is the revised version better than the first draft?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Own Level (Production)

**CW2i-4A: Own Variation A**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Write a 3-sentence story. Then, independently revise it: check capitals, punctuation, and spelling. Show me the changes.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain what you changed during your revision and why.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-4B: Own Variation B**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Write a description. Revise it to add better adjectives. Show me your edits.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain what you changed during your revision and why.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2i-4C: Own Variation C**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Write a paragraph. Read it aloud to yourself, find two ways to improve it, and make the changes.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Explain what you changed during your revision and why.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Milestone Task

**CW2i-M: Milestone Production**
```json
{
  "capacity_id": "CW2i",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2i: Write a thank-you note, check it for mistakes, and rewrite a clean final copy.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

## CW2j: Dictation

### Encounter Level (Multisensory)

**CW2j-1A: Encounter Variation A**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "A",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Listen to this short sentence. Repeat it back to me. Now let's write it together.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it important to repeat the sentence before writing?",
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

**CW2j-1B: Encounter Variation B**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "B",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: I will say a sentence. You count how many words are in the sentence on your fingers.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How does counting words help you remember the sentence?",
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

**CW2j-1C: Encounter Variation C**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 1,
  "variation_id": "C",
  "task_type": "Multisensory Encounter",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen carefully. I will say a sentence. Which word is the longest?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why do you have to hold the whole sentence in your mind?",
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

**CW2j-2A: Execute Variation A**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "A",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: Listen: 'The big cat sat.' Repeat it. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did saying it first help you write it?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-2B: Execute Variation B**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "B",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Listen: 'I like to run and play.' Repeat it. Now write it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Did you include all the necessary parts?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-2C: Execute Variation C**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 2,
  "variation_id": "C",
  "task_type": "Oral->Written Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: Listen: 'Did the dog see the bird?' Repeat it. Now write it with the correct punctuation.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Read back what you wrote.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Discern Level (Error Detection)

**CW2j-3A: Discern Variation A**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "A",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: I said: 'The red bus stopped.' You wrote: 'The bus stop.' What did you miss?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it tricky to listen and write at the same time?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-3B: Discern Variation B**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "B",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: Look at your dictation. Did you remember the capital letter at the beginning?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it tricky to listen and write at the same time?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-3C: Discern Variation C**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 3,
  "variation_id": "C",
  "task_type": "Error Detection",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: I said 'dogs' (more than one). Look at what you wrote. Is the 's' there?",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "Why is it tricky to listen and write at the same time?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Own Level (Production)

**CW2j-4A: Own Variation A**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "A",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation A: I will read a short, 2-sentence story. Listen to the whole thing. Then I will dictate it sentence by sentence. Write it perfectly.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you check your spelling for the tricky words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-4B: Own Variation B**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "B",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation B: I will dictate a paragraph of 3 sentences. Write them down, remembering all punctuation and spelling.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you check your spelling for the tricky words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

**CW2j-4C: Own Variation C**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "C",
  "task_type": "Creative Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Variation C: I will dictate a question and an answer. Write both correctly.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
  "reasoning_check": "How did you check your spelling for the tricky words?",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```

### Milestone Task

**CW2j-M: Milestone Production**
```json
{
  "capacity_id": "CW2j",
  "strand": 4,
  "band": 2,
  "cognitive_level": 4,
  "variation_id": "M",
  "task_type": "Milestone Production",
  "materials": [
    "Paper",
    "Pencil"
  ],
  "parent_prompt": "Real-world task for CW2j: Write down this phone message exactly as I say it.",
  "success_condition": "Child correctly identifies or produces the target writing structure.",
  "failure_condition": "If incorrect, provide guidance and ask them to try again.",
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
      "criterion": "Did the child say it out loud first? (If applicable)",
      "type": "yes_no"
    },
    {
      "criterion": "Is the required structural element present (e.g., topic sentence, details)?",
      "type": "yes_no"
    },
    {
      "criterion": "Are spelling and basic punctuation reasonably correct for Band 2?",
      "type": "yes_no"
    }
  ],
  "revision_trigger": "If any box is unchecked → child revises before advancing.",
  "grammar_integration": {
    "required_capacity": "GM2a",
    "constraint": "Must apply grammar rules from GM2a correctly in writing."
  }
}
```
