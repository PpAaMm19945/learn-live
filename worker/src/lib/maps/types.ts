export interface MapMarker {
    x: number;
    y: number;
    label: string;
    type: string;
}

export interface MapMetadata {
    bounds?: [number, number, number, number]; // [west, south, east, north]
    defaultCenter?: [number, number];
    defaultZoom?: number;
    region?: string;
    era?: string;
}

export interface MapAsset {
    id: string;
    lesson_id: string;
    chapter_number: number;
    title: string;
    era: string;
    r2_base_map_key: string | null;
    r2_overlay_key: string | null;
    markers: MapMarker[];
    metadata: MapMetadata;
    display_order: number;
}

export interface MapAssetResponse {
    id: string;
    title: string;
    era: string;
    baseMapUrl: string;
    overlaySvgUrl?: string; // or overlaySvg: string depending on frontend, using url for consistency with getMapAssetUrl
    markers: MapMarker[];
    metadata: MapMetadata;
    displayOrder: number;
}
