import fs from "node:fs";
import path from "node:path";
import registry from "@/config/media-registry.json";
import { usesRemoteMedia, type MediaAvailability, type MediaId } from "@/lib/media";

const MEDIA_ROOT = path.join(process.cwd(), "public", "media");

/**
 * Server-only. Pages are prerendered at build time, so this runs once per
 * build: every asset that is missing from public/media renders its designed
 * fallback instead of a broken image. With a CDN base URL we can't stat the
 * files, so we trust that they were uploaded.
 */
export function hasMedia(id: MediaId): boolean {
  if (usesRemoteMedia) return true;
  return fs.existsSync(path.join(MEDIA_ROOT, registry.assets[id].path));
}

export function mediaAvailability(ids: readonly MediaId[]): MediaAvailability {
  return Object.fromEntries(ids.map((id) => [id, hasMedia(id)]));
}
