import { r2Helper } from '../r2';
import type { Env } from '../../index';

export interface SourceMetadata {
    title: string;
    author: string;
    type: 'primary' | 'secondary' | 'oral';
    url?: string;
    excerpt?: string;
}

/**
 * Uploads a document to R2 and creates a Source record in D1.
 */
export async function uploadSourceDocument(
    env: Env,
    file: File,
    metadata: SourceMetadata & { lessonId: string }
): Promise<{ r2Key: string; sourceId: string }> {
    const timestamp = Date.now();
    const filename = file.name || `source_${timestamp}`;
    const r2Key = `content/sources/${timestamp}_${filename}`;

    const contentType = file.type || 'application/octet-stream';
    const uploadResult = await r2Helper.uploadFile(env.EVIDENCE_VAULT, r2Key, file.stream(), contentType);

    if (!uploadResult.success) {
        throw new Error(`Failed to upload to R2: ${uploadResult.error}`);
    }

    const sourceId = `src_${timestamp}_${Math.random().toString(36).substring(2, 9)}`;

    await env.DB.prepare(`
        INSERT INTO Sources (id, lesson_id, title, author, type, url, r2_key, excerpt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        sourceId,
        metadata.lessonId,
        metadata.title,
        metadata.author,
        metadata.type,
        metadata.url || null,
        r2Key,
        metadata.excerpt || null
    ).run();

    return { r2Key, sourceId };
}

/**
 * Splits text into overlapping chunks.
 */
export function chunkText(text: string, maxChunkSize: number = 500): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    // We'll use an overlap of about 20% of the maxChunkSize (in characters)
    // Approximate word length is ~5 characters + 1 space
    const overlapChars = Math.floor(maxChunkSize * 0.2);
    let overlapWordsCount = Math.floor(overlapChars / 6);
    if (overlapWordsCount < 1) overlapWordsCount = 1;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordLen = word.length + (currentChunk.length > 0 ? 1 : 0);

        if (currentLength + wordLen > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));

            // Start new chunk with overlap
            const overlapStartIdx = Math.max(0, currentChunk.length - overlapWordsCount);
            currentChunk = currentChunk.slice(overlapStartIdx);
            currentChunk.push(word);
            currentLength = currentChunk.join(' ').length;
        } else {
            currentChunk.push(word);
            currentLength += wordLen;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks;
}

/**
 * Inserts chunks into the RAG_Chunks table in D1.
 */
export async function indexChunks(env: Env, sourceId: string, chunks: string[]): Promise<void> {
    const stmt = env.DB.prepare(`
        INSERT INTO RAG_Chunks (id, source_id, chunk_text, chunk_index)
        VALUES (?, ?, ?, ?)
    `);

    const batchStmts = chunks.map((chunkText, index) => {
        const chunkId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        return stmt.bind(chunkId, sourceId, chunkText, index);
    });

    if (batchStmts.length > 0) {
        await env.DB.batch(batchStmts);
    }
}

/**
 * Orchestrates upload -> chunk -> index.
 */
export async function ingestDocument(
    env: Env,
    file: File,
    lessonId: string,
    metadata: SourceMetadata
): Promise<void> {
    // 1. Upload file and create source record
    const { sourceId } = await uploadSourceDocument(env, file, { ...metadata, lessonId });

    // 2. Extract text (assuming plain text for now, in a real system we'd parse PDF/Docx etc.)
    const text = await file.text();

    // 3. Chunk text
    const chunks = chunkText(text);

    // 4. Index chunks
    await indexChunks(env, sourceId, chunks);
}
