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

export interface RAGChunkWithScore extends RAGChunk {
    score: number;
}

/**
 * Searches for relevant chunks based on a simple keyword query.
 * Filters by lessonId if provided, then falls back to full corpus if no results or lessonId is missing.
 * Includes a basic relevance scoring mechanism based on keyword matches and proximity.
 * Future upgrade: replace LIKE with Vector Search.
 */
export async function searchChunks(env: Env, query: string, limit: number = 5, lessonId?: string): Promise<RAGChunkWithScore[]> {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);

    if (searchTerms.length === 0) {
        return [];
    }

    let chunks: RAGChunk[] = [];

    // 1. If lessonId is provided, first search within chunks linked to this lesson.
    // For now, chunks are linked to sources, and sources are linked to lessons or NULL (if chapter-wide).
    // Let's get chunks that belong to the specific lesson or its chapter.
    const baseQuery = `
        SELECT c.id, c.source_id, c.chunk_text, c.chunk_index
        FROM RAG_Chunks c
        JOIN Sources s ON c.source_id = s.id
    `;

    let whereClause = "";
    const queryParams: string[] = [];

    if (lessonId) {
        // Find the chapter prefix (e.g., 'lesson_ch01_s01' -> 'ch01')
        const chapterMatch = lessonId.match(/_ch(\d+)_/);
        if (chapterMatch) {
             const chapterNum = chapterMatch[1];
             // In our seed, source IDs are like 'src_ch01'
             whereClause = `WHERE (s.lesson_id = ? OR s.id = ?) AND (`;
             queryParams.push(lessonId, `src_ch${chapterNum}`);
        } else {
             whereClause = `WHERE s.lesson_id = ? AND (`;
             queryParams.push(lessonId);
        }
    } else {
        whereClause = `WHERE (`;
    }

    const likeConditions = searchTerms.map(() => 'c.chunk_text LIKE ?').join(' OR ');
    whereClause += likeConditions + ')';

    const likeParams = searchTerms.map(term => `%${term}%`);
    queryParams.push(...likeParams);

    const result = await env.DB.prepare(baseQuery + " " + whereClause).bind(...queryParams).all<RAGChunk>();
    chunks = result.results || [];

    // 2. If no chunks found within the lesson context, fallback to full corpus search
    if (chunks.length === 0 && lessonId) {
         const fullCorpusConditions = searchTerms.map(() => 'chunk_text LIKE ?').join(' OR ');
         const fullResult = await env.DB.prepare(`
             SELECT id, source_id, chunk_text, chunk_index
             FROM RAG_Chunks
             WHERE ${fullCorpusConditions}
         `).bind(...likeParams).all<RAGChunk>();
         chunks = fullResult.results || [];
    }

    // 3. Simple relevance scoring (keyword match count)
    const scoredChunks: RAGChunkWithScore[] = chunks.map(chunk => {
        let score = 0;
        const textLower = chunk.chunk_text.toLowerCase();

        for (const term of searchTerms) {
            // Count occurrences of term
            let pos = -1;
            while ((pos = textLower.indexOf(term, pos + 1)) !== -1) {
                score += 1;
            }
        }

        return { ...chunk, score };
    });

    // Sort by score descending and return top 'limit'
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, limit);
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
export async function buildRAGContext(env: Env, query: string, lessonId?: string): Promise<string> {
    const chunks = await searchChunks(env, query, 5, lessonId);

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
