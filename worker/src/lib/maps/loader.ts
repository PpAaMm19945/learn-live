import { MapAsset, MapAssetResponse, MapMetadata, MapMarker } from './types';
import { r2Helper } from '../r2';

export function parseMapMetadata(raw: string | null): MapMetadata {
    if (!raw) {
        return {};
    }
    try {
        return JSON.parse(raw) as MapMetadata;
    } catch (e) {
        console.warn('Failed to parse map metadata JSON', e);
        return {};
    }
}

export function parseMapMarkers(raw: string | null): MapMarker[] {
    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw) as MapMarker[];
    } catch (e) {
        console.warn('Failed to parse map markers JSON', e);
        return [];
    }
}

export async function getMapAssetUrl(bucket: R2Bucket, r2Key: string | null): Promise<string> {
    if (!r2Key) {
        // Handle graceful fallback when images are not yet uploaded
        return '/api/evidence/placeholder.png';
    }

    // Use existing r2Helper to check if the file actually exists before returning the URL
    // This allows for graceful fallback if images haven't been uploaded to R2 yet
    const exists = await r2Helper.fileExists(bucket, r2Key);
    if (!exists) {
        return '/api/evidence/placeholder.png';
    }

    return `/api/evidence/${r2Key}`;
}

export async function getMapAssetsForLesson(db: D1Database, bucket: R2Bucket, lessonId: string): Promise<MapAssetResponse[]> {
    const { results } = await db.prepare(
        `SELECT * FROM Map_Assets WHERE lesson_id = ? ORDER BY display_order ASC`
    ).bind(lessonId).all();

    if (!results || results.length === 0) {
        return [];
    }

    const mapAssetResponses: MapAssetResponse[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of results as any[]) {
        const metadata = parseMapMetadata(row.metadata);
        const markers = parseMapMarkers(row.markers);

        const response: MapAssetResponse = {
            id: row.id,
            title: row.title,
            era: row.era,
            baseMapUrl: await getMapAssetUrl(bucket, row.r2_base_map_key),
            markers,
            metadata,
            displayOrder: row.display_order
        };

        if (row.r2_overlay_key) {
            response.overlaySvgUrl = await getMapAssetUrl(bucket, row.r2_overlay_key);
        }

        mapAssetResponses.push(response);
    }

    return mapAssetResponses;
}
