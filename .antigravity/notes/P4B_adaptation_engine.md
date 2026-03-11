# Phase 4B: Adaptation Engine
Created the `adapt.ts`, `cache.ts`, and `serve.ts` utilities for adjusting history curriculum per age band.
The engine queries Gemini 2.5 Flash for targeted adaptations using targeted vocabulary, narrative styles, and interactive prompts.
A caching layer leverages a new `Adapted_Content_Cache` D1 table to optimize delivery for repeat requests.
Band 5 skips the AI and delivers the master `narrative_text` natively to limit API overhead.