import { toOrigin } from "./env-url";

/**
 * Canonical origin used for metadataBase, canonical links, the sitemap,
 * robots.txt and JSON-LD. The first usable value wins:
 *
 *   1. NEXT_PUBLIC_SITE_URL           your own domain — set this for production
 *   2. VERCEL_PROJECT_PRODUCTION_URL  the project's production domain (set by Vercel on
 *                                     every deployment, previews included, so previews
 *                                     canonicalise to production)
 *   3. VERCEL_URL                     this deployment's own *.vercel.app host
 *   4. http://localhost:3000          local builds
 *
 * Invalid values are skipped (next.config.ts prints a warning) rather than
 * failing the build. Server-only: the VERCEL_* variables never reach the browser.
 */
export const siteUrl: string =
  toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  toOrigin(process.env.VERCEL_URL) ??
  "http://localhost:3000";
