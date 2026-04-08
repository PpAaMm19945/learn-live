import fs from 'fs';
import path from 'path';
import { SectionManifest } from './content';

export class ContentFetcher {
    private cache = new Map<string, SectionManifest>();
    private localContentDir = path.join(process.cwd(), '../docs/curriculum/history');

    constructor(
        private workerUrl: string,
        private serviceKey: string
    ) {}

    async fetchSection(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
        const cacheKey = `${chapterId}_${sectionId}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        let manifest: SectionManifest | null = null;

        if (this.workerUrl === 'local' || !this.workerUrl) {
            manifest = await this.fetchFromLocal(chapterId, sectionId);
        } else {
            manifest = await this.fetchFromWorker(chapterId, sectionId);
        }

        if (manifest) {
            this.cache.set(cacheKey, manifest);
        }

        return manifest;
    }

    private async fetchFromLocal(chapterId: string, sectionId: string): Promise<SectionManifest | null> {
        const filename = `${chapterId}_${sectionId}.json`;
        const fullPath = path.join(this.localContentDir, filename);

        console.log(`[CONTENT_FETCHER] Loading local file: ${fullPath}`);
        
        if (!fs.existsSync(fullPath)) {
            console.warn(`[CONTENT_FETCHER] Local file not found: ${fullPath}`);
            return null;
        }

        try {
            const data = fs.readFileSync(fullPath, 'utf8');
            return JSON.parse(data) as SectionManifest;
        } catch (e) {
            console.error(`[CONTENT_FETCHER] Failed to parse local JSON: ${sectionId}`, e);
            return null;
        }
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
