#!/usr/bin/env node
/**
 * Higgsfield hero clips → scroll-scrub WebP frame sequences.
 *
 *   npm run media:hero
 *   npm run media:hero -- --frames 220 --quality 74
 *
 * Input (ordered by filename — 01.mp4, 02.mp4 …):
 *   media-src/hero/landscape/*.mp4   16:9 clips, required
 *   media-src/hero/portrait/*.mp4    9:16 clips, optional — if absent, the
 *                                    portrait sequence is centre-cropped from
 *                                    the landscape clips (--focus 0–1 moves the crop)
 * Output:
 *   public/media/hero/desktop/frame_0001.webp …
 *   public/media/hero/mobile/frame_0001.webp …
 *   src/config/hero-sequence.json   (frame counts the site reads at build time)
 *
 * Flags: --frames (200)  --portrait-frames (150)  --width (1600)
 *        --portrait-width (720)  --quality (72)  --focus (0.5)
 */
import fs from "node:fs";
import path from "node:path";
import {
  MEDIA_SRC,
  PUBLIC_MEDIA,
  ROOT,
  c,
  dirSize,
  ensureDir,
  fail,
  ffmpeg,
  formatBytes,
  listVideos,
  parseArgs,
  probeDuration,
  readJson,
  rel,
  requireFfmpeg,
  writeJson,
} from "./lib/shared.mjs";

const { flags } = parseArgs();
const opts = {
  frames: Number(flags.frames ?? 200),
  portraitFrames: Number(flags["portrait-frames"] ?? 150),
  width: Number(flags.width ?? 1600),
  portraitWidth: Number(flags["portrait-width"] ?? 720),
  quality: Number(flags.quality ?? 72),
  focus: Math.min(1, Math.max(0, Number(flags.focus ?? 0.5))),
};

requireFfmpeg({ encoders: ["libwebp"] });

const landscapeClips = listVideos(path.join(MEDIA_SRC, "hero", "landscape"));
const portraitClips = listVideos(path.join(MEDIA_SRC, "hero", "portrait"));
if (landscapeClips.length === 0) {
  fail(`No clips found. Export your Higgsfield hero clips (H1 → H4) into ${rel(path.join(MEDIA_SRC, "hero", "landscape"))}/ as 01.mp4, 02.mp4 …`);
}

const even = (n) => Math.round(n / 2) * 2;

/**
 * Normalise every clip to the same size/fps/SAR (concat requires it), join
 * them into one continuous shot, resample to exactly `count` frames and write
 * numbered WebPs.
 */
function extract({ clips, outDir, count, width, height, cropFocus }) {
  ensureDir(outDir);
  for (const f of fs.readdirSync(outDir)) if (/^frame_\d+\.webp$/.test(f)) fs.unlinkSync(path.join(outDir, f));

  const total = clips.reduce((sum, clip) => sum + probeDuration(clip), 0);
  const fps = count / total;
  const inputs = clips.flatMap((clip) => ["-i", clip]);
  const cropX = `(iw-${width})*${cropFocus}`;
  const normalise = clips
    .map(
      (_, i) =>
        `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height}:${cropX}:(ih-${height})/2,setsar=1,fps=30[v${i}]`,
    )
    .join(";");
  const join = `${clips.map((_, i) => `[v${i}]`).join("")}concat=n=${clips.length}:v=1:a=0,fps=${fps.toFixed(6)}[out]`;

  ffmpeg(
    [
      ...inputs,
      "-filter_complex",
      `${normalise};${join}`,
      "-map",
      "[out]",
      "-frames:v",
      String(count),
      "-c:v",
      "libwebp",
      "-quality",
      String(opts.quality),
      "-compression_level",
      "5",
      "-preset",
      "photo",
      "-start_number",
      "1",
      path.join(outDir, "frame_%04d.webp"),
    ],
    `${clips.length} clip(s) → ${count} frames @ ${width}×${height}`,
  );

  const { count: written, bytes } = dirSize(outDir, (f) => f.endsWith(".webp"));
  return { written, bytes, total };
}

console.log(c.bold("\nMahvé · hero sequence\n"));

const landscape = extract({
  clips: landscapeClips,
  outDir: path.join(PUBLIC_MEDIA, "hero", "desktop"),
  count: opts.frames,
  width: even(opts.width),
  height: even((opts.width * 9) / 16),
  cropFocus: 0.5,
});
console.log(`  ${c.green("✔")} desktop  ${landscape.written} frames · ${formatBytes(landscape.bytes)} · from ${landscape.total.toFixed(1)} s of footage`);

const portraitWidth = even(opts.portraitWidth);
const portraitHeight = even((opts.portraitWidth * 16) / 9);
const portrait = extract({
  clips: portraitClips.length ? portraitClips : landscapeClips,
  outDir: path.join(PUBLIC_MEDIA, "hero", "mobile"),
  count: opts.portraitFrames,
  width: portraitWidth,
  height: portraitHeight,
  cropFocus: portraitClips.length ? 0.5 : opts.focus,
});
console.log(
  `  ${c.green("✔")} mobile   ${portrait.written} frames · ${formatBytes(portrait.bytes)}${portraitClips.length ? "" : c.dim(" · centre-cropped from landscape")}`,
);

const configPath = path.join(ROOT, "src", "config", "hero-sequence.json");
const config = readJson(configPath);
config.landscape = { ...config.landscape, frames: landscape.written, width: even(opts.width), height: even((opts.width * 9) / 16) };
config.portrait = { ...config.portrait, frames: portrait.written, width: portraitWidth, height: portraitHeight };
writeJson(configPath, config);
console.log(`  ${c.green("✔")} updated ${rel(configPath)}`);

const budget = 25 * 1024 ** 2;
if (landscape.bytes > budget) {
  console.log(c.gold(`\n  ⚠ Desktop sequence is ${formatBytes(landscape.bytes)}. Consider --frames 160 or --quality 65 to stay near 20 MB.`));
}
console.log(c.dim("\n  Next: bump NEXT_PUBLIC_MEDIA_VERSION if these frames replace older ones, then rebuild.\n"));
