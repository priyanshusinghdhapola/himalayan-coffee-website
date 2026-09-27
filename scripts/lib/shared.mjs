import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const PUBLIC_MEDIA = path.join(ROOT, "public", "media");
export const MEDIA_SRC = path.join(ROOT, "media-src");

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || "ffprobe";

export const c = {
  gold: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

export function fail(message) {
  console.error(`\n${c.red("✘")} ${message}\n`);
  process.exit(1);
}

/** Tiny argv parser: positional args + --flag value / --flag. */
export function parseArgs(argv = process.argv.slice(2)) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, flags };
}

export function requireFfmpeg({ encoders = [] } = {}) {
  const probe = spawnSync(FFMPEG, ["-hide_banner", "-encoders"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) {
    fail(
      [
        "ffmpeg was not found.",
        "  Windows:  winget install Gyan.FFmpeg   (then open a new terminal)",
        "  macOS:    brew install ffmpeg",
        "  Linux:    sudo apt install ffmpeg",
        "Or point FFMPEG_PATH / FFPROBE_PATH at the binaries.",
      ].join("\n"),
    );
  }
  for (const enc of encoders) {
    if (!probe.stdout.includes(` ${enc} `)) fail(`Your ffmpeg build has no "${enc}" encoder. Install a full build (e.g. Gyan.FFmpeg on Windows).`);
  }
}

export function ffmpeg(args, label) {
  console.log(c.dim(`  › ffmpeg ${label ?? ""}`));
  const res = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
  if (res.status !== 0) fail(`ffmpeg failed${label ? ` (${label})` : ""}.`);
}

export function probeDuration(file) {
  const res = spawnSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  const seconds = parseFloat(res.stdout);
  if (!Number.isFinite(seconds)) fail(`Could not read the duration of ${file}`);
  return seconds;
}

export function listVideos(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(mp4|mov|webm|mkv)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => path.join(dir, f));
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function dirSize(dir, filter = () => true) {
  if (!fs.existsSync(dir)) return { count: 0, bytes: 0 };
  let count = 0;
  let bytes = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!filter(f)) continue;
    count++;
    bytes += fs.statSync(path.join(dir, f)).size;
  }
  return { count, bytes };
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
