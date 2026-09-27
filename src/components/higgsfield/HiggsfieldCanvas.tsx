"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { cn } from "@/lib/cn";
import { prefersSaveData } from "@/hooks/useMediaQuery";
import { FrameSequenceLoader, frameUrl, type SequenceSpec } from "./frame-loader";
import type { SceneRenderer } from "./fallback-scene";

export type HiggsfieldCanvasHandle = {
  /** Drive the sequence: 0 = first frame, 1 = last frame. Cheap — coalesced into one rAF draw. */
  setProgress: (progress: number) => void;
};

type HiggsfieldCanvasProps = {
  ref?: Ref<HiggsfieldCanvasHandle>;
  /** Landscape sequence plus an optional portrait cut for phones (from hero-sequence.json). Must be referentially stable. */
  sequences: { landscape: SequenceSpec; portrait?: SequenceSpec };
  /** Factory for the procedural stand-in shown when there are no frames. Must be referentially stable (module-level). */
  fallback?: () => SceneRenderer;
  /** Focal point kept in frame when cover-cropping (0–1). */
  focusX?: number;
  focusY?: number;
  /** Cap on devicePixelRatio. On moving footage 1.5× is indistinguishable from 3× at ~¼ of the pixels. */
  maxDpr?: number;
  onLoadProgress?: (fraction: number) => void;
  onReady?: () => void;
  className?: string;
  label: string;
};

export const PORTRAIT_QUERY = "(max-aspect-ratio: 4/5)";

export function pickSequence(sequences: HiggsfieldCanvasProps["sequences"], portrait: boolean): SequenceSpec {
  return portrait && sequences.portrait && sequences.portrait.frames > 0 ? sequences.portrait : sequences.landscape;
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, fx: number, fy: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const s = Math.max(w / iw, h / ih);
  const dw = iw * s;
  const dh = ih * s;
  ctx.drawImage(img, (w - dw) * fx, (h - dh) * fy, dw, dh);
}

/**
 * Renders a Higgsfield clip — exported as a numbered WebP sequence — into a
 * <canvas>. Scroll-scrubbing an image sequence is deterministic in both
 * directions (frame N is always frame N), whereas seeking an MP4 depends on
 * keyframe spacing and stutters badly when scrubbed backwards.
 *
 * The component knows nothing about scrolling; the parent drives it through
 * `ref.setProgress()`, usually from a GSAP ScrollTrigger.
 */
export function HiggsfieldCanvas({
  ref,
  sequences,
  fallback,
  focusX = 0.5,
  focusY = 0.5,
  maxDpr = 1.5,
  onLoadProgress,
  onReady,
  className,
  label,
}: HiggsfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const scheduleRef = useRef<() => void>(() => undefined);
  const callbacksRef = useRef({ onLoadProgress, onReady });

  useEffect(() => {
    callbacksRef.current = { onLoadProgress, onReady };
  });

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress: number) {
        progressRef.current = Math.min(1, Math.max(0, progress));
        scheduleRef.current();
      },
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Chosen once per mount: swapping sequences mid-scroll would throw away
    // everything already decoded.
    const spec = pickSequence(sequences, window.matchMedia(PORTRAIT_QUERY).matches);
    const count = spec.frames;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let drawn = -1;
    let dirty = true;
    let scene: SceneRenderer | null = count === 0 && fallback ? fallback() : null;

    const target = () => Math.round(progressRef.current * (count - 1));

    const render = () => {
      raf = 0;
      if (scene) {
        scene(ctx, width, height, progressRef.current, dpr);
        return;
      }
      if (!loader) return;
      const idx = loader.nearest(target());
      if (idx < 0 || (idx === drawn && !dirty)) return;
      const img = loader.images[idx];
      if (!img) return;
      drawCover(ctx, img, width, height, focusX, focusY);
      drawn = idx;
      dirty = false;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const loader =
      count > 0
        ? new FrameSequenceLoader(
            Array.from({ length: count }, (_, i) => frameUrl(spec, i)),
            {
              primingOnly: prefersSaveData(),
              onFrame: (i) => {
                const t = target();
                if (drawn < 0 || Math.abs(i - t) < Math.abs(drawn - t)) schedule();
              },
              onPrimingProgress: (f) => callbacksRef.current.onLoadProgress?.(f),
              onPrimed: (loaded) => {
                // Frames listed in the JSON but missing on the server: fall
                // back to the procedural scene rather than a blank hero.
                if (loaded === 0 && fallback) {
                  scene = fallback();
                  schedule();
                }
                callbacksRef.current.onReady?.();
              },
            },
          )
        : null;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      width = w;
      height = h;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      dirty = true;
      schedule();
    };

    scheduleRef.current = schedule;
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (loader) {
      loader.start();
    } else {
      callbacksRef.current.onLoadProgress?.(1);
      callbacksRef.current.onReady?.();
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      loader?.destroy();
      scheduleRef.current = () => undefined;
    };
  }, [sequences, fallback, focusX, focusY, maxDpr]);

  return <canvas ref={canvasRef} role="img" aria-label={label} className={cn("block size-full", className)} />;
}
