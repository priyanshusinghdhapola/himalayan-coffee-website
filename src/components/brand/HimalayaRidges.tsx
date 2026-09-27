import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { HIMALAYA_LAYERS, SNOW_LINE, ridgeHeights, ridgePath, snowPath } from "@/lib/ridge";

const W = 1600;
const H = 600;

// Computed once per module load — deterministic, so SSR and client agree.
const HEIGHTS = HIMALAYA_LAYERS.map((layer) => ridgeHeights(layer));
const PATHS = HIMALAYA_LAYERS.map((layer, i) => ridgePath(HEIGHTS[i], W, H, layer.top * H, layer.bottom * H));
const FAR = HIMALAYA_LAYERS[0];
const SNOW = snowPath(HEIGHTS[0], W, FAR.top * H, FAR.bottom * H, SNOW_LINE, FAR.seed + 1);

type Palette = { snow: string; snowShade: string; rock: string; layers: [string, string, string] };

const PALETTES = {
  ink: { snow: "#efe6d6", snowShade: "#a89c8a", rock: "#342c26", layers: ["#241d18", "#16120e", "#0b0907"] },
  dawn: { snow: "#f8dfbf", snowShade: "#c1917a", rock: "#453536", layers: ["#2e2230", "#1c1520", "#0b0907"] },
  mist: { snow: "#eef2f3", snowShade: "#98a8b0", rock: "#353e46", layers: ["#232a30", "#151a1e", "#0b0907"] },
} satisfies Record<string, Palette>;

export type RidgePalette = keyof typeof PALETTES;

type HimalayaRidgesProps = {
  className?: string;
  style?: CSSProperties;
  palette?: RidgePalette;
  /** Unique per instance — scopes the gradient ids. */
  id: string;
};

/**
 * Four layered Himalayan silhouettes with terrain-following snow on the far
 * range. Layers carry data-ridge="0..3" so sections can parallax them.
 */
export function HimalayaRidges({ className, style, palette = "ink", id }: HimalayaRidgesProps) {
  const p = PALETTES[palette];
  const rockId = `${id}-rock`;
  const snowId = `${id}-snow`;
  const hazeId = `${id}-haze`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <defs>
        <linearGradient id={rockId} gradientUnits="userSpaceOnUse" x1="0" y1={FAR.top * H} x2="0" y2={FAR.bottom * H}>
          <stop offset="0" stopColor={p.rock} />
          <stop offset="1" stopColor={p.layers[0]} />
        </linearGradient>
        <linearGradient id={snowId} gradientUnits="userSpaceOnUse" x1="0" y1={FAR.top * H} x2="0" y2={FAR.bottom * H}>
          <stop offset="0" stopColor={p.snow} />
          <stop offset="0.55" stopColor={p.snowShade} />
        </linearGradient>
        <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.layers[2]} stopOpacity="0" />
          <stop offset="1" stopColor={p.layers[2]} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <g data-ridge="0">
        <path d={PATHS[0]} fill={`url(#${rockId})`} />
        <path d={SNOW} fill={`url(#${snowId})`} />
      </g>
      <rect x="0" y={H * 0.45} width={W} height={H * 0.3} fill={`url(#${hazeId})`} />
      <path data-ridge="1" d={PATHS[1]} fill={p.layers[0]} />
      <path data-ridge="2" d={PATHS[2]} fill={p.layers[1]} />
      <path data-ridge="3" d={PATHS[3]} fill={p.layers[2]} />
    </svg>
  );
}
