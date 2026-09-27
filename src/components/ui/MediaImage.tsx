import Image from "next/image";
import type { ReactNode } from "react";
import { HimalayaRidges, type RidgePalette } from "@/components/brand/HimalayaRidges";
import { cn } from "@/lib/cn";
import { mediaSrc, type MediaId } from "@/lib/media";

type MediaImageProps = {
  id: MediaId;
  /** From mediaAvailability() on the server. */
  available: boolean | undefined;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  fallback: ReactNode;
};

/** next/image for a registry asset, or its designed fallback when the file isn't there yet. */
export function MediaImage({ id, available, alt, sizes, preload, className, fallback }: MediaImageProps) {
  if (!available) return <>{fallback}</>;
  return <Image src={mediaSrc(id)} alt={alt} fill sizes={sizes} preload={preload} className={cn("object-cover", className)} />;
}

type ArtFallbackProps = {
  id: MediaId;
  tint?: string;
  palette?: RidgePalette;
  className?: string;
};

/**
 * Intentional-looking stand-in for a missing Higgsfield still: a tinted dusk
 * sky over the Himalaya ridges. In development it also labels which prompt
 * (see docs/02-higgsfield-prompts.md) produces the real asset.
 */
export function ArtFallback({ id, tint = "#c9a46a", palette = "ink", className }: ArtFallbackProps) {
  // Vary framing per asset so a grid of fallbacks doesn't repeat the same range.
  const hash = [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const flip = hash % 2 === 1 ? -1 : 1;
  // Mirrored copies already sit left of centre; only unmirrored ones slide.
  const shift = flip === 1 ? (hash % 3) * 14 : 0;
  const glowX = 25 + (hash % 5) * 12;
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background: `radial-gradient(120% 90% at ${glowX}% 10%, ${tint}55 0%, #1a1511 45%, #0b0907 100%)` }}
    >
      <HimalayaRidges
        id={`fb-${id}`}
        palette={palette}
        className="absolute bottom-0 left-0 h-[70%] w-[145%]"
        style={{ transform: `translateX(-${shift}%) scaleX(${flip})`, transformOrigin: "35% 100%" }}
      />
      {process.env.NODE_ENV === "development" && (
        <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] tracking-wider text-gold">
          Higgsfield · {id}
        </span>
      )}
    </div>
  );
}
