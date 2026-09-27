/**
 * Deterministic Himalayan ridgelines (midpoint displacement + a few dominant
 * massifs). Seeded, so server and client produce identical SVG paths and the
 * canvas fallback matches the SVG silhouettes used elsewhere on the site.
 */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Peak = { x: number; height: number; width: number };

export type RidgeSpec = {
  seed: number;
  /** 2^detail segments across the width. */
  detail?: number;
  /** 0.4 = smooth foothills, 0.65 = jagged rock. */
  roughness?: number;
  peaks?: Peak[];
};

/** Heights in [0, 1] (1 = tallest point) at 2^detail + 1 evenly spaced samples. */
export function ridgeHeights({ seed, detail = 7, roughness = 0.52, peaks = [] }: RidgeSpec): number[] {
  const n = 2 ** detail;
  const rand = mulberry32(seed);
  const h = new Array<number>(n + 1).fill(0);
  h[0] = 0.25 + rand() * 0.35;
  h[n] = 0.25 + rand() * 0.35;

  let step = n;
  let scale = 0.62;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < n; i += step) {
      h[i] = (h[i - half] + h[i + half]) / 2 + (rand() - 0.5) * scale;
    }
    step = half;
    scale *= roughness;
  }

  for (const peak of peaks) {
    for (let i = 0; i <= n; i++) {
      const d = Math.abs(i / n - peak.x) / peak.width;
      if (d < 1) h[i] += peak.height * Math.pow(1 - d, 1.35);
    }
  }

  let min = Infinity;
  let max = -Infinity;
  for (const v of h) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  return h.map((v) => (v - min) / range);
}

/** Closed SVG area path: ridge between `top` (peaks) and `bottom` (lowest saddle), filled down to `height`. */
export function ridgePath(heights: number[], width: number, height: number, top: number, bottom: number): string {
  const n = heights.length - 1;
  const span = bottom - top;
  let d = `M0 ${height}`;
  for (let i = 0; i <= n; i++) {
    d += `L${((i / n) * width).toFixed(1)} ${(top + (1 - heights[i]) * span).toFixed(1)}`;
  }
  return `${d}L${width} ${height}Z`;
}

/**
 * Snow cap for a ridge: hugs the ridgeline and thins out toward `snowLine`
 * (0 = summit height, 1 = lowest saddle), with streaks down the gullies —
 * reads as real snow cover rather than a flat horizontal cut.
 */
export function snowPath(
  heights: number[],
  width: number,
  top: number,
  bottom: number,
  snowLine: number,
  seed: number,
): string {
  const n = heights.length - 1;
  const span = bottom - top;
  const snowY = top + snowLine * span;
  const rand = mulberry32(seed);
  const ridge: Array<[number, number]> = heights.map((v, i) => [(i / n) * width, top + (1 - v) * span]);
  const lower = ridge.map(([x, y]) => {
    const depth = Math.max(0, snowY - y);
    const streak = depth > 0 ? rand() * span * 0.07 : 0;
    return [x, y + depth * 0.85 + streak] as [number, number];
  });
  let d = `M${ridge[0][0].toFixed(1)} ${ridge[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) d += `L${ridge[i][0].toFixed(1)} ${ridge[i][1].toFixed(1)}`;
  for (let i = n; i >= 0; i--) d += `L${lower[i][0].toFixed(1)} ${lower[i][1].toFixed(1)}`;
  return `${d}Z`;
}

/** Shared layer definitions — the SVG ridges and the canvas fallback both draw these. */
export const HIMALAYA_LAYERS: Array<RidgeSpec & { top: number; bottom: number }> = [
  {
    seed: 11,
    detail: 8,
    roughness: 0.6,
    peaks: [
      { x: 0.62, height: 0.95, width: 0.15 },
      { x: 0.37, height: 0.6, width: 0.11 },
      { x: 0.83, height: 0.55, width: 0.1 },
      { x: 0.16, height: 0.4, width: 0.1 },
    ],
    top: 0.12,
    bottom: 0.56,
  },
  {
    seed: 29,
    detail: 7,
    roughness: 0.55,
    peaks: [
      { x: 0.2, height: 0.45, width: 0.16 },
      { x: 0.74, height: 0.3, width: 0.14 },
    ],
    top: 0.42,
    bottom: 0.7,
  },
  { seed: 47, detail: 7, roughness: 0.5, top: 0.58, bottom: 0.82 },
  { seed: 83, detail: 8, roughness: 0.64, top: 0.74, bottom: 0.93 },
];

/** Far-range snow line as a fraction of that layer's height span. */
export const SNOW_LINE = 0.5;
