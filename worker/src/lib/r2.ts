/**
 * Helper utility to interact with the Cloudflare R2 EVIDENCE_VAULT.
 */

export interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

export const r2Helper = {
    /**
     * Uploads a file buffer/stream to the given R2 Bucket.
     * @param bucket The R2Bucket binding from the env
     * @param key The destination path/filename (e.g., 'snapshots/123.jpg')
     * @param body The file content as an ArrayBuffer or ReadableStream
     * @param contentType The MIME type (e.g., 'image/jpeg', 'application/json')
     * @returns UploadResult
     */
    async uploadFile(bucket: R2Bucket, key: string, body: ArrayBuffer | ReadableStream, contentType: string): Promise<UploadResult> {
        try {
            await bucket.put(key, body, {
                httpMetadata: { contentType },
            });
            return {
                success: true,
                key,
                // In a real scenario with a custom domain on R2, return the public URL.
                // For now, we return the relative path.
                url: `/api/evidence/${key}`
            };
        } catch (error: any) {
            console.error(`[R2 Upload Error] Key: ${key}`, error);
            return {
                success: false,
                error: error.message || 'Unknown R2 upload error',
            };
        }
    },

    /**
     * Retrieves an object from the given R2 Bucket.
     * @param bucket The R2Bucket binding from the env
     * @param key The file key/path to retrieve
     * @returns R2ObjectBody or null if not found
     */
    async getFile(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
        try {
            return await bucket.get(key);
        } catch (error) {
            console.error(`[R2 Get Error] Key: ${key}`, error);
            return null;
        }
    }
};
