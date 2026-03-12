Created four content preparation scripts in `scripts/`:
- `prepare-content.ts`: Parses 10 chapters from markdown into `content-manifest.json` with metadata.
- `seed-curriculum.ts`: Generates `seed_curriculum.sql` with Topics/Lessons inserts for the DB.
- `upload-to-r2.ts`: Extracts chunks from chapters into `seed_rag_chunks.sql` for vector indexing.
- `upload-maps.ts`: Parses metadata from 34 maps into `map-manifest.json`.
These tools standardize master texts and map metadata for the RAG-based history curriculum.