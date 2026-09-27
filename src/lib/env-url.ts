/**
 * Lenient parsing for URL-valued environment variables. Dashboard and .env
 * values often arrive as a bare host ("shop.example"), wrapped in quotes or
 * padded with whitespace — `new URL()` throws on all of those and takes the
 * whole build down. These helpers normalise what they safely can and return
 * null for anything else, so callers can fall back instead of crashing.
 *
 * Dependency-free on purpose: next.config.ts imports it too.
 */

const EDGE_QUOTES_AND_SPACE = /^\s*["']?|["']?\s*$/g;
const HAS_SCHEME = /^[a-z][a-z\d+.-]*:\/\//i;

/** A dotted domain, localhost or an IP — rules out placeholders like "changeme" becoming https://changeme. */
function isRealHost(hostname: string) {
  return hostname.includes(".") || hostname === "localhost" || hostname.startsWith("[");
}

export function parseHttpUrl(raw: string | null | undefined): URL | null {
  if (!raw) return null;
  const value = raw.replace(EDGE_QUOTES_AND_SPACE, "");
  if (!value) return null;
  try {
    const url = new URL(HAS_SCHEME.test(value) ? value : `https://${value}`);
    const ok =
      (url.protocol === "https:" || url.protocol === "http:") &&
      isRealHost(url.hostname) &&
      // "mailto:a@b.c" would otherwise parse as credentials + host.
      !url.username &&
      !url.password;
    return ok ? url : null;
  } catch {
    return null;
  }
}

/** "shop.example/" → "https://shop.example". Null if unusable. */
export function toOrigin(raw: string | null | undefined): string | null {
  return parseHttpUrl(raw)?.origin ?? null;
}

/** Origin plus path without a trailing slash — for prefixes like a CDN base. Null if unusable. */
export function toBaseUrl(raw: string | null | undefined): string | null {
  const url = parseHttpUrl(raw);
  return url ? `${url.origin}${url.pathname.replace(/\/+$/, "")}` : null;
}
