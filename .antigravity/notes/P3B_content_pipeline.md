# P3B: R2 Content Ingestion Utilities

- Implemented `uploadSourceDocument` to store files in R2 `content/sources/` and insert `Source` records into D1.
- Created `chunkText` and `indexChunks` to split large texts into manageable overlapping segments and store them in the `RAG_Chunks` table.
- Added `searchChunks` to perform keyword-based full-text searches (LIKE query) across the indexed chunks.
- Developed `buildRAGContext` to fetch retrieved chunks and their source metadata, formatting them as context for LLM prompts.