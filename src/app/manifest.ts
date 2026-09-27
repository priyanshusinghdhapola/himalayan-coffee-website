import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.fullName,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0907",
    theme_color: "#0b0907",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
