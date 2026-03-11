import type { Env } from '../../index';

export interface RAGChunk {
    id: string;
    source_id: string;
    chunk_text: string;
    chunk_index: number;
}

export interface Source {
    id: string;
    lesson_id: string;
    title: string;
    author: string;
    type: string;
    url: string | null;
    r2_key: string;
    excerpt: string | null;
}

/**
 * Searches for relevant chunks based on a simple keyword query.
 * Future upgrade: replace LIKE with Vector Search.
 */
export async function searchChunks(env: Env, query: string, limit: number = 5): Promise<RAGChunk[]> {
    // Basic full-text search implementation (LIKE query)
    const searchTerms = query.split(' ').filter(term => term.length > 2);

    if (searchTerms.length === 0) {
        return [];
    }

    // Build conditions for LIKE query
    const conditions = searchTerms.map(() => 'chunk_text LIKE ?').join(' OR ');
    const params = searchTerms.map(term => `%${term}%`);

    const result = await env.DB.prepare(`
        SELECT id, source_id, chunk_text, chunk_index
        FROM RAG_Chunks
        WHERE ${conditions}
        LIMIT ?
    `).bind(...params, limit).all<RAGChunk>();

    return result.results;
}

/**
 * Fetches the complete source records associated with the given chunk IDs.
 */
export async function getSourceContext(env: Env, chunkIds: string[]): Promise<Source[]> {
    if (chunkIds.length === 0) {
        return [];
    }

    const placeholders = chunkIds.map(() => '?').join(',');

    const result = await env.DB.prepare(`
        SELECT DISTINCT s.*
        FROM Sources s
        JOIN RAG_Chunks c ON s.id = c.source_id
        WHERE c.id IN (${placeholders})
    `).bind(...chunkIds).all<Source>();

    return result.results;
}

/**
 * Builds a formatted context string suitable for RAG LLM prompts.
 */
export async function buildRAGContext(env: Env, query: string): Promise<string> {
    const chunks = await searchChunks(env, query);

    if (chunks.length === 0) {
        return "No relevant context found.";
    }

    const chunkIds = chunks.map(c => c.id);
    const sources = await getSourceContext(env, chunkIds);

    // Map sources for quick lookup
    const sourceMap = new Map<string, Source>();
    for (const source of sources) {
        sourceMap.set(source.id, source);
    }

    // Build context string
    let contextString = "### Context Information ###\n\n";

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const source = sourceMap.get(chunk.source_id);

        contextString += `--- Chunk ${i + 1} ---\n`;
        if (source) {
            contextString += `Source: ${source.title} by ${source.author} (${source.type})\n`;
        }
        contextString += `Text: ${chunk.chunk_text}\n\n`;
    }

    return contextString;
}
