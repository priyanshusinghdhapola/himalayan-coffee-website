#!/usr/bin/env node
/**
 * Which Higgsfield assets are in place, which are missing, and how heavy they are.
 *
 *   npm run media:check              report only
 *   npm run media:check -- --strict  exit 1 if anything is missing (for CI)
 */
import fs from "node:fs";
import path from "node:path";
import { PUBLIC_MEDIA, ROOT, c, dirSize, formatBytes, parseArgs, readJson } from "./lib/shared.mjs";

const { flags } = parseArgs();
const registry = readJson(path.join(ROOT, "src", "config", "media-registry.json")).assets;
const hero = readJson(path.join(ROOT, "src", "config", "hero-sequence.json"));

console.log(c.bold("\nMahvé · media check\n"));
let missing = 0;
let total = 0;

console.log(c.bold("  Hero sequence (prompts HK0–HK4 + H1–H4 → npm run media:hero)"));
for (const [name, spec] of Object.entries({ landscape: hero.landscape, portrait: hero.portrait })) {
  const { count, bytes } = dirSize(path.join(PUBLIC_MEDIA, spec.dir), (f) => /^frame_\d+\.webp$/.test(f));
  total += bytes;
  const ok = spec.frames > 0 && count === spec.frames;
  if (!ok) missing++;
  const note =
    spec.frames === 0
      ? c.dim("not generated — hero shows the procedural Himalaya scene")
      : count !== spec.frames
        ? c.red(`config says ${spec.frames} frames, found ${count} — re-run npm run media:hero`)
        : `${count} frames · ${formatBytes(bytes)}`;
  console.log(`  ${ok ? c.green("✔") : c.red("✘")} ${name.padEnd(10)} public/media/${spec.dir}/  ${note}`);
}

console.log(c.bold("\n  Registry assets"));
for (const [id, asset] of Object.entries(registry)) {
  const file = path.join(PUBLIC_MEDIA, asset.path);
  const exists = fs.existsSync(file);
  if (!exists) {
    missing++;
    console.log(`  ${c.red("✘")} ${id.padEnd(5)} public/media/${asset.path.padEnd(34)} ${c.dim(`prompt ${asset.prompt} · ${asset.usedIn}`)}`);
    continue;
  }
  const size = fs.statSync(file).size;
  total += size;
  const heavy = asset.kind === "video" ? size > 10 * 1024 ** 2 : size > 450 * 1024;
  console.log(`  ${heavy ? c.gold("⚠") : c.green("✔")} ${id.padEnd(5)} public/media/${asset.path.padEnd(34)} ${formatBytes(size)}`);
}

console.log(`\n  ${missing === 0 ? c.green("All media in place.") : c.gold(`${missing} item(s) missing — the site renders designed fallbacks for them.`)}`);
console.log(`  Total public/media weight: ${formatBytes(total)}\n`);
if (flags.strict && missing > 0) process.exit(1);
