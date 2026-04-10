/**
 * R2 Asset Resolver
 * 
 * Single source of truth for resolving asset paths to R2-backed URLs.
 * All assets are served via the Worker: GET /api/assets/{r2Key}
 * 
 * R2 Bucket: learnlive-assets-prod
 * Key structure:
 *   - assets/storybook/{chapterId}/{bandX_pageYY}.jpg
 *   - assets/maps/{mapId}.png
 *   - assets/maps/{mapId}.json          (map metadata)
 *   - assets/maps/transforms/{mapId}.json
 *   - assets/maps/overlays/{mapId}.svg
 *   - assets/images/{filename}           (textbook illustrations)
 *   - content/chapters/chapter_XX.md     (master curriculum markdown)
 */

const WORKER_URL =
  import.meta.env.VITE_WORKER_URL ||
  'https://learn-live.antmwes104-1.workers.dev';

/** Resolve an R2 key to a full URL served by the Worker */
export function r2Url(r2Key: string): string {
  // Strip leading slash if present
  const key = r2Key.startsWith('/') ? r2Key.slice(1) : r2Key;
  return `${WORKER_URL}/api/assets/${key}`;
}

/**
 * Convert a legacy local path (e.g. /images/storybook/ch01/band0_page01.jpg)
 * to an R2 URL. Handles both old local paths and already-resolved R2 keys.
 */
export function resolveImageUrl(path: string): string {
  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Already an R2 key (starts with assets/)
  if (path.startsWith('assets/')) return r2Url(path);

  // Legacy local path: /images/storybook/ch01/band0_page01.jpg → assets/storybook/ch01/band0_page01.jpg
  if (path.startsWith('/images/')) {
    return r2Url(`assets${path.replace('/images', '')}`);
  }

  // Fallback — treat as R2 key
  return r2Url(path);
}

/** Preload an image into browser cache. Returns a promise that resolves when loaded. */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
    img.src = url;
  });
}

/** Preload the next N images from a list of URLs */
export function preloadAhead(urls: string[], currentIndex: number, count = 2): void {
  for (let i = 1; i <= count; i++) {
    const idx = currentIndex + i;
    if (idx < urls.length) {
      preloadImage(urls[idx]).catch(() => {
        // Silent fail for preloading — image will just load on demand
      });
    }
  }
}
