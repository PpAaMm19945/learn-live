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

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function keyToUrl(key: string): string {
  return `${WORKER_URL}/api/assets/${key.replace(/^\/+/, '')}`;
}

/**
 * Expand an asset path into likely R2 key variants.
 * This makes the frontend resilient while the bucket is being normalized.
 */
export function resolveImageCandidates(path: string): string[] {
  if (!path) return [];
  if (path.startsWith('http://') || path.startsWith('https://')) return [path];

  const raw = path.replace(/^\/+/, '');
  const keys: string[] = [raw];

  if (raw.startsWith('assets/')) {
    const withoutAssets = raw.slice('assets/'.length);
    keys.push(withoutAssets);

    if (withoutAssets.startsWith('images/')) {
      keys.push(withoutAssets.slice('images/'.length));
    }
    if (withoutAssets.startsWith('maps/')) {
      keys.push(`images/${withoutAssets}`);
    }
    if (withoutAssets.startsWith('storybook/')) {
      keys.push(`images/${withoutAssets}`);
    }
  }

  if (raw.startsWith('images/')) {
    const withoutImages = raw.slice('images/'.length);
    keys.push(withoutImages);
    keys.push(`assets/${raw}`);
    keys.push(`assets/${withoutImages}`);
  }

  if (raw.startsWith('maps/') || raw.startsWith('storybook/')) {
    keys.push(`assets/${raw}`);
    keys.push(`images/${raw}`);
  }

  return unique(keys).map(keyToUrl);
}

/** Resolve an R2 key to a full URL served by the Worker */
export function r2Url(r2Key: string): string {
  return resolveImageCandidates(r2Key)[0] || keyToUrl(r2Key);
}

/**
 * Convert a legacy local path (e.g. /images/storybook/ch01/band0_page01.jpg)
 * to an R2 URL. Handles both old local paths and already-resolved R2 keys.
 */
export function resolveImageUrl(path: string): string {
  return resolveImageCandidates(path)[0] || path;
}

/** Preload an image into browser cache. Returns a promise that resolves when loaded. */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const candidates = resolveImageCandidates(url);
    let index = 0;

    const tryNext = () => {
      const candidate = candidates[index++];
      if (!candidate) {
        reject(new Error(`Failed to preload: ${url}`));
        return;
      }

      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => tryNext();
      img.src = candidate;
    };

    tryNext();
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
