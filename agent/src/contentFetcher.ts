import fs from 'fs';
import path from 'path';
import { SectionManifest } from './content';

export class ContentFetcher {
    private cache = new Map<string, SectionManifest>();

    /**
     * Local content directories to search — tried in order.
     * In Docker: docs/ is copied into the image at build time.
     * In dev: ../docs/curriculum/history relative to agent/.
     */
    private localDirs = [
        path.join(process.cwd(), 'docs/curriculum/history'),
        path.join(process.cwd(), '../docs/curriculum/history'),
    ];

    constructor(
        private workerUrl: string,
        private serviceKey: string
    ) {}

    async fetchSection(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
        const cacheKey = `${chapterId}_${sectionId}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        // ALWAYS try local first (bundled JSON in Docker image), then Worker API fallback
        let manifest = await this.fetchFromLocal(chapterId, sectionId);

        if (!manifest && this.workerUrl && this.workerUrl !== 'local') {
            console.log(`[CONTENT_FETCHER] Local miss — falling back to Worker API`);
            manifest = await this.fetchFromWorker(chapterId, sectionId);
        }

        if (manifest) {
            this.cache.set(cacheKey, manifest);
        }

        return manifest;
    }

    private async fetchFromLocal(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
        const filename = `${chapterId}_${sectionId}.json`;

        for (const dir of this.localDirs) {
            const fullPath = path.join(dir, filename);
            if (fs.existsSync(fullPath)) {
                try {
                    const data = fs.readFileSync(fullPath, 'utf8');
                    console.log(`[CONTENT_FETCHER] Loaded local file: ${fullPath}`);
                    return JSON.parse(data) as SectionManifest;
                } catch (e) {
                    console.error(`[CONTENT_FETCHER] Failed to parse local JSON: ${fullPath}`, e);
                }
            }
        }

        console.log(`[CONTENT_FETCHER] No local file found for ${filename}`);
        return null;
    }

    private async fetchFromWorker(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
        const endpoint = `${this.workerUrl}/api/chapters/${chapterId}/sections/${sectionId}/beats`;
        console.log(`[CONTENT_FETCHER] Fetching from worker: ${endpoint}`);

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'X-Service-Key': this.serviceKey,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                console.warn(`[CONTENT_FETCHER] Section not found on worker: ${sectionId}`);
                return null;
            }

            if (!response.ok) {
                const err = await response.text();
                console.error(`[CONTENT_FETCHER] Worker error (${response.status}):`, err);
                return null;
            }

            return await response.json() as SectionManifest;
        } catch (e) {
            console.error(`[CONTENT_FETCHER] Network failure during fetch: ${sectionId}`, e);
            return null;
        }
    }
}
