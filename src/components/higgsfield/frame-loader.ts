import { mediaUrl } from "@/lib/media";

/** Shape of each entry in src/config/hero-sequence.json. */
export type SequenceSpec = {
  frames: number;
  dir: string;
  ext: string;
  pad: number;
  width: number;
  height: number;
};

export function frameUrl(spec: SequenceSpec, index: number): string {
  return mediaUrl(`${spec.dir}/frame_${String(index + 1).padStart(spec.pad, "0")}.${spec.ext}`);
}

/**
 * Coarse-to-fine load order. The first pass (first frame, last frame and
 * ~24 evenly spaced key frames) is the "priming" set: once it has landed the
 * whole timeline is scrubbable, just at a lower temporal resolution. Each
 * later pass halves the stride until every frame is in.
 */
export function progressiveOrder(count: number): { order: number[]; priming: number } {
  const order: number[] = [];
  if (count <= 0) return { order, priming: 0 };
  const seen = new Uint8Array(count);
  const push = (i: number) => {
    if (!seen[i]) {
      seen[i] = 1;
      order.push(i);
    }
  };

  let stride = 2 ** Math.floor(Math.log2(Math.max(1, count / 24)));
  push(0);
  push(count - 1);
  for (let i = 0; i < count; i += stride) push(i);
  const priming = order.length;

  while (stride > 1) {
    stride /= 2;
    for (let i = 0; i < count; i += stride) push(i);
  }
  return { order, priming };
}

type LoaderOptions = {
  /** Parallel requests. HTTP/2 multiplexes, but decode work still lands on the main thread. */
  concurrency?: number;
  /** Stop after the priming pass (Data Saver). */
  primingOnly?: boolean;
  onFrame?: (index: number) => void;
  onPrimingProgress?: (fraction: number) => void;
  onPrimed?: (loadedCount: number) => void;
};

export class FrameSequenceLoader {
  readonly images: Array<HTMLImageElement | undefined>;
  loadedCount = 0;

  private readonly urls: string[];
  private readonly options: LoaderOptions;
  private readonly ready: Uint8Array;
  private readonly isPriming: Uint8Array;
  private readonly order: number[];
  private readonly primingTotal: number;
  private primingSettled = 0;
  private cursor = 0;
  private inFlight = 0;
  private destroyed = false;

  constructor(urls: string[], options: LoaderOptions = {}) {
    this.urls = urls;
    this.options = options;
    this.images = new Array(urls.length);
    this.ready = new Uint8Array(urls.length);
    this.isPriming = new Uint8Array(urls.length);
    const { order, priming } = progressiveOrder(urls.length);
    this.order = options.primingOnly ? order.slice(0, priming) : order;
    this.primingTotal = priming;
    for (let i = 0; i < priming; i++) this.isPriming[order[i]] = 1;
  }

  start() {
    this.pump();
  }

  /** Closest loaded frame to `target`, searching outward; -1 if none yet. */
  nearest(target: number): number {
    const n = this.urls.length;
    if (n === 0) return -1;
    const t = Math.min(n - 1, Math.max(0, target));
    if (this.ready[t]) return t;
    for (let d = 1; d < n; d++) {
      if (t - d >= 0 && this.ready[t - d]) return t - d;
      if (t + d < n && this.ready[t + d]) return t + d;
    }
    return -1;
  }

  destroy() {
    this.destroyed = true;
    // Abort anything still downloading.
    this.images.forEach((img, i) => {
      if (img && !this.ready[i]) img.src = "";
    });
  }

  private pump() {
    const limit = this.options.concurrency ?? 6;
    while (!this.destroyed && this.inFlight < limit && this.cursor < this.order.length) {
      this.load(this.order[this.cursor++]);
    }
  }

  private load(index: number) {
    const img = new Image();
    img.decoding = "async";
    if (index === 0) img.fetchPriority = "high";
    this.images[index] = img;
    this.inFlight++;
    img.onload = () => {
      // decode() moves the decode off the scroll path so the first drawImage
      // of this frame doesn't stall a scrub.
      img
        .decode()
        .catch(() => undefined)
        .then(() => this.settle(index, true));
    };
    img.onerror = () => this.settle(index, false);
    img.src = this.urls[index];
  }

  private settle(index: number, ok: boolean) {
    if (this.destroyed) return;
    this.inFlight--;
    if (ok) {
      this.ready[index] = 1;
      this.loadedCount++;
      this.options.onFrame?.(index);
    } else {
      this.images[index] = undefined;
    }
    if (this.isPriming[index]) {
      this.primingSettled++;
      this.options.onPrimingProgress?.(this.primingSettled / this.primingTotal);
      if (this.primingSettled === this.primingTotal) this.options.onPrimed?.(this.loadedCount);
    }
    this.pump();
  }
}
