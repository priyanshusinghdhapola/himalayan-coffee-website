import registry from "@/config/media-registry.json";
import { toBaseUrl } from "@/lib/env-url";

export type MediaId = keyof typeof registry.assets;
export type MediaAvailability = Partial<Record<MediaId, boolean>>;

// An unusable CDN value falls back to serving from /public (next.config.ts warns).
const BASE = toBaseUrl(process.env.NEXT_PUBLIC_MEDIA_BASE_URL) ?? "";
const VERSION = (process.env.NEXT_PUBLIC_MEDIA_VERSION ?? "1").trim() || "1";

/**
 * Public URL for a file under public/media (or the CDN mirror of it).
 * /media is served with an immutable one-year cache, so the version query is
 * what busts caches when a file is replaced — bump NEXT_PUBLIC_MEDIA_VERSION.
 */
export function mediaUrl(relPath: string): string {
  return `${BASE}/media/${relPath.replace(/^\/+/, "")}?v=${encodeURIComponent(VERSION)}`;
}

export function mediaPath(id: MediaId): string {
  return registry.assets[id].path;
}

export function mediaSrc(id: MediaId): string {
  return mediaUrl(mediaPath(id));
}

export const usesRemoteMedia = BASE.length > 0;
