import type { NextConfig } from "next";
import { parseHttpUrl } from "./src/lib/env-url";

// Misconfigured URL variables must never fail the build — they're ignored
// with a warning and the app falls back (see src/lib/site-url.ts, src/lib/media.ts).
const URL_VARS = {
  NEXT_PUBLIC_SITE_URL: "falling back to the Vercel production domain (or localhost)",
  NEXT_PUBLIC_MEDIA_BASE_URL: "serving media from /public instead",
} as const;
for (const [name, fallback] of Object.entries(URL_VARS)) {
  const raw = process.env[name];
  if (raw?.trim() && !parseHttpUrl(raw)) {
    console.warn(`⚠ ${name}=${JSON.stringify(raw)} is not a usable http(s) URL — ${fallback}.`);
  }
}

const remoteMedia = parseHttpUrl(process.env.NEXT_PUBLIC_MEDIA_BASE_URL);

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 160, 256, 384, 512, 768],
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // /media URLs carry a ?v= cache-busting version (NEXT_PUBLIC_MEDIA_VERSION),
    // so query strings must be allowed for local images under /media.
    localPatterns: [{ pathname: "/media/**" }],
    remotePatterns: remoteMedia
      ? [
          {
            protocol: remoteMedia.protocol.replace(":", "") as "http" | "https",
            hostname: remoteMedia.hostname,
            port: remoteMedia.port,
            pathname: `${remoteMedia.pathname.replace(/\/$/, "")}/media/**`,
          },
        ]
      : [],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Hero frames, loops and stills: cached for a year. Replacing a file?
        // Bump NEXT_PUBLIC_MEDIA_VERSION so the ?v= query changes.
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
