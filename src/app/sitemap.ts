import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/brand";
import { products } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...products.map((p) => ({
      url: `${siteUrl}/coffee/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
