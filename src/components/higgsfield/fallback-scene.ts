import { HIMALAYA_LAYERS, SNOW_LINE, mulberry32, ridgeHeights } from "@/lib/ridge";

/** Draws one frame of a procedural scene for scroll progress `p` (0–1). */
export type SceneRenderer = (ctx: CanvasRenderingContext2D, w: number, h: number, p: number, dpr: number) => void;

type RGB = [number, number, number];

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Sky over the scroll: pre-dawn → alpenglow → golden hour → ember dusk.
const SKY = [
  { at: 0, top: hex("#07070c"), bottom: hex("#1d1726"), snow: hex("#8f8ca3"), sun: hex("#f0b27a") },
  { at: 0.32, top: hex("#1b1931"), bottom: hex("#b0664a"), snow: hex("#f6c9a4"), sun: hex("#ffcf8a") },
  { at: 0.66, top: hex("#3b2b25"), bottom: hex("#e0a860"), snow: hex("#fbe8c8"), sun: hex("#fff0c8") },
  { at: 1, top: hex("#0d0907"), bottom: hex("#5b2d1b"), snow: hex("#cf8f66"), sun: hex("#ff9a52") },
];

function skyAt(p: number) {
  let i = 0;
  while (i < SKY.length - 2 && p > SKY[i + 1].at) i++;
  const a = SKY[i];
  const b = SKY[i + 1];
  const t = smooth(Math.min(1, Math.max(0, (p - a.at) / (b.at - a.at))));
  return { top: mix(a.top, b.top, t), bottom: mix(a.bottom, b.bottom, t), snow: mix(a.snow, b.snow, t), sun: mix(a.sun, b.sun, t) };
}

const ROCK = [hex("#3a2f2a"), hex("#221b17"), hex("#15110d"), hex("#0b0907")];
const HAZE = [0.5, 0.32, 0.16, 0];
/** How strongly each layer reacts to the "camera" flying forward. */
const DEPTH = [0.12, 0.32, 0.58, 1];

/**
 * The hero's stand-in until the Higgsfield sequence exists: the same Himalayan
 * ridges as the SVG artwork, flown through from pre-dawn to dusk as you
 * scroll. Keeps the core scrub mechanic demonstrable with zero assets.
 */
export function createHimalayaScene(): SceneRenderer {
  const layers = HIMALAYA_LAYERS.map((l) => ({ ...l, heights: ridgeHeights(l) }));
  const rand = mulberry32(7);
  const stars = Array.from({ length: 120 }, () => ({ x: rand(), y: rand() * 0.5, r: rand() * 1.1 + 0.35, tw: rand() }));
  const snowJitter = layers[0].heights.map(() => rand());

  return (ctx, w, h, p, dpr) => {
    const sky = skyAt(p);

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, rgba(sky.top));
    g.addColorStop(1, rgba(sky.bottom));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const starAlpha = Math.max(0, 1 - p / 0.3);
    if (starAlpha > 0) {
      ctx.fillStyle = "#f3ead9";
      for (const s of stars) {
        ctx.globalAlpha = starAlpha * (0.35 + s.tw * 0.65);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Sun climbs from behind the range, peaks at golden hour, then settles.
    const sunY = h * (p < 0.7 ? lerp(0.6, 0.2, smooth(p / 0.7)) : lerp(0.2, 0.33, smooth((p - 0.7) / 0.3)));
    const sunX = w * 0.72;
    const glowR = Math.max(w, h) * 0.5;
    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, glowR);
    glow.addColorStop(0, rgba(sky.sun, 0.45));
    glow.addColorStop(0.25, rgba(sky.sun, 0.12));
    glow.addColorStop(1, rgba(sky.sun, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = rgba(sky.sun, 0.95);
    ctx.beginPath();
    ctx.arc(sunX, sunY, Math.min(w, h) * 0.03, 0, Math.PI * 2);
    ctx.fill();

    // Keep mountain proportions on portrait screens: lay the ridges out on a
    // virtual landscape width and crop the sides.
    const vw = Math.max(w, h * 1.6);
    const ox = (w - vw) / 2;
    const anchorY = h * 0.55;

    layers.forEach((layer, li) => {
      const depth = DEPTH[li];
      const scale = 1 + p * 0.55 * depth;
      const dropY = p * h * 0.3 * depth * depth;
      const n = layer.heights.length - 1;
      const span = layer.bottom - layer.top;
      const X = (u: number) => w / 2 + (ox + u * vw - w / 2) * scale;
      const Y = (v: number) => anchorY + (v * h - anchorY) * scale + dropY;
      const ridgeY = (i: number) => Y(layer.top + (1 - layer.heights[i]) * span);

      ctx.beginPath();
      ctx.moveTo(X(0), h);
      for (let i = 0; i <= n; i++) ctx.lineTo(X(i / n), ridgeY(i));
      ctx.lineTo(X(1), h);
      ctx.closePath();
      ctx.fillStyle = rgba(mix(ROCK[li], sky.bottom, HAZE[li]));
      ctx.fill();

      if (li === 0) {
        const snowY = Y(layer.top + SNOW_LINE * span);
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const y = ridgeY(i);
          if (i === 0) ctx.moveTo(X(0), y);
          else ctx.lineTo(X(i / n), y);
        }
        for (let i = n; i >= 0; i--) {
          const y = ridgeY(i);
          const depthPx = Math.max(0, snowY - y);
          ctx.lineTo(X(i / n), y + depthPx * 0.85 + (depthPx > 0 ? snowJitter[i] * span * h * 0.07 * scale : 0));
        }
        ctx.closePath();
        ctx.fillStyle = rgba(sky.snow, 0.92);
        ctx.fill();
      }

      if (li === 1) {
        // Valley mist between the far range and the foothills.
        const mistY = Y(layer.bottom) - h * 0.02;
        const mist = ctx.createLinearGradient(0, mistY - h * 0.12, 0, mistY + h * 0.06);
        mist.addColorStop(0, rgba(sky.bottom, 0));
        mist.addColorStop(0.6, rgba(sky.bottom, 0.28));
        mist.addColorStop(1, rgba(sky.bottom, 0));
        ctx.fillStyle = mist;
        ctx.fillRect(0, mistY - h * 0.12, w, h * 0.18);
      }
    });

    // Vignette so overlay copy always has contrast.
    const v = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.8);
    v.addColorStop(0, "rgba(11,9,7,0)");
    v.addColorStop(1, "rgba(11,9,7,0.55)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  };
}
