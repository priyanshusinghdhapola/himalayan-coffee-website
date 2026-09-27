import type { NextConfig } from "next";

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
const remoteMedia = mediaBase ? new URL(mediaBase) : null;

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
