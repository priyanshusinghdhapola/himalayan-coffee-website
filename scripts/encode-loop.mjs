#!/usr/bin/env node
/**
 * Higgsfield background loop → seamless, web-ready loop files.
 *
 *   npm run media:loop
 *   npm run media:loop -- --crossfade 0      (clip already loops: start frame = end frame)
 *
 * Input:
 *   media-src/upcoming/loop.mp4            16:9, required
 *   media-src/upcoming/loop-portrait.mp4   9:16, optional (else centre-cropped)
 * Output (public/media/upcoming/):
 *   loop-desktop.webm   VP9, 1920×1080   (preferred by Chrome/Firefox/Edge)
 *   loop-desktop.mp4    H.264, 1920×1080 (Safari + fallback)
 *   loop-mobile.mp4     H.264, 720×1280
 *   loop-poster.webp    first frame — shown before playback / with reduced motion
 *
 * The seam is hidden by cross-fading the clip's last --crossfade seconds
 * (default 1.2) into its first, so the final frame flows straight back into
 * frame one.
 */
import fs from "node:fs";
import path from "node:path";
import { MEDIA_SRC, PUBLIC_MEDIA, c, ensureDir, fail, ffmpeg, formatBytes, parseArgs, probeDuration, rel, requireFfmpeg } from "./lib/shared.mjs";

const { flags } = parseArgs();
const crossfade = Number(flags.crossfade ?? 1.2);
const srcDir = path.join(MEDIA_SRC, "upcoming");
const landscapeSrc = path.join(srcDir, "loop.mp4");
const portraitSrc = path.join(srcDir, "loop-portrait.mp4");
const outDir = path.join(PUBLIC_MEDIA, "upcoming");

requireFfmpeg({ encoders: ["libx264", "libvpx-vp9", "libwebp"] });
if (!fs.existsSync(landscapeSrc)) fail(`Export the Higgsfield loop (prompt U1) to ${rel(landscapeSrc)}`);
ensureDir(outDir);

/** Filter that normalises, crops to size and (optionally) builds the seamless crossfade. */
function loopFilter(file, width, height) {
  const duration = probeDuration(file);
  const base = `fps=30,scale=${width}:${height}:force_original_aspect_ratio=increase:flags=lanczos,crop=${width}:${height},setsar=1`;
  if (crossfade <= 0) return { filter: `[0:v]${base},format=yuv420p[v]`, duration };
  if (duration <= crossfade * 3) fail(`${rel(file)} is ${duration.toFixed(1)} s — too short for a ${crossfade} s crossfade. Use --crossfade 0.5 or a longer clip.`);
  const offset = (duration - 2 * crossfade).toFixed(3);
  return {
    filter:
      `[0:v]${base},split[m][h];` +
      `[m]trim=start=${crossfade},setpts=PTS-STARTPTS[main];` +
      `[h]trim=duration=${crossfade},setpts=PTS-STARTPTS[head];` +
      `[main][head]xfade=transition=fade:duration=${crossfade}:offset=${offset},format=yuv420p[v]`,
    duration: duration - crossfade,
  };
}

const h264 = ["-c:v", "libx264", "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-tag:v", "avc1", "-an"];

console.log(c.bold("\nMahvé · background loop\n"));

const desktop = loopFilter(landscapeSrc, 1920, 1080);
ffmpeg(["-i", landscapeSrc, "-filter_complex", desktop.filter, "-map", "[v]", ...h264, "-crf", "24", path.join(outDir, "loop-desktop.mp4")], "desktop H.264");
ffmpeg(
  ["-i", landscapeSrc, "-filter_complex", desktop.filter, "-map", "[v]", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", path.join(outDir, "loop-desktop.webm")],
  "desktop VP9",
);

const mobileSrc = fs.existsSync(portraitSrc) ? portraitSrc : landscapeSrc;
const mobile = loopFilter(mobileSrc, 720, 1280);
ffmpeg(["-i", mobileSrc, "-filter_complex", mobile.filter, "-map", "[v]", ...h264, "-crf", "26", path.join(outDir, "loop-mobile.mp4")], "mobile H.264");

ffmpeg(["-i", path.join(outDir, "loop-desktop.mp4"), "-frames:v", "1", "-c:v", "libwebp", "-quality", "80", path.join(outDir, "loop-poster.webp")], "poster");

for (const f of ["loop-desktop.webm", "loop-desktop.mp4", "loop-mobile.mp4", "loop-poster.webp"]) {
  const size = fs.statSync(path.join(outDir, f)).size;
  const warn = f.endsWith(".mp4") || f.endsWith(".webm") ? size > 10 * 1024 ** 2 : size > 400 * 1024;
  console.log(`  ${warn ? c.gold("⚠") : c.green("✔")} ${f.padEnd(20)} ${formatBytes(size)}`);
}
console.log(c.dim(`\n  Loop length ${desktop.duration.toFixed(1)} s${fs.existsSync(portraitSrc) ? "" : " · mobile centre-cropped from landscape"}.\n`));
