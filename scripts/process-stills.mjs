#!/usr/bin/env node
/**
 * Higgsfield stills → optimised WebP at the exact path the site expects.
 *
 *   npm run media:stills
 *
 * Drop exports into media-src/stills/ named by prompt ID, any of
 * .png .jpg .jpeg .webp — e.g. P1.png, C3.jpg, U5.webp, S1.png.
 * Each is resized to the width in src/config/media-registry.json and written
 * to public/media/<path> (e.g. P1 → public/media/products/buransh-pack.webp).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { MEDIA_SRC, PUBLIC_MEDIA, ROOT, c, ensureDir, fail, formatBytes, readJson, rel } from "./lib/shared.mjs";

const registry = readJson(path.join(ROOT, "src", "config", "media-registry.json")).assets;
const srcDir = path.join(MEDIA_SRC, "stills");
if (!fs.existsSync(srcDir)) fail(`Create ${rel(srcDir)}/ and drop your Higgsfield stills in it, named by prompt ID (P1.png, C2.jpg …).`);

const files = fs.readdirSync(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
if (files.length === 0) fail(`No images in ${rel(srcDir)}/ — name them by prompt ID, e.g. P1.png`);

console.log(c.bold("\nMahvé · stills\n"));
let done = 0;
for (const file of files) {
  const id = path.parse(file).name.toUpperCase();
  const asset = registry[id];
  if (!asset || asset.kind !== "image" || !asset.width) {
    console.log(`  ${c.gold("–")} ${file.padEnd(16)} ${c.dim("skipped: not an image ID in media-registry.json")}`);
    continue;
  }
  const out = path.join(PUBLIC_MEDIA, asset.path);
  ensureDir(path.dirname(out));
  const info = await sharp(path.join(srcDir, file))
    .rotate()
    .resize({ width: asset.width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, smartSubsample: true })
    .toFile(out);
  const size = fs.statSync(out).size;
  const heavy = size > 450 * 1024;
  console.log(`  ${heavy ? c.gold("⚠") : c.green("✔")} ${id.padEnd(5)} → ${rel(out).padEnd(46)} ${info.width}×${info.height} · ${formatBytes(size)}`);
  done++;
}
console.log(c.dim(`\n  ${done} still(s) written. Rebuild (npm run build) so the site swaps fallbacks for real images.\n`));
