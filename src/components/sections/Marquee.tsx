"use client";

import { useLenis } from "lenis/react";
import { Fragment, useRef } from "react";
import { Rosette } from "@/components/brand/Rosette";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const REPEAT = 3;

/** Endless ribbon of the brand's own lines. Scrolling faster makes it run faster. */
export function Marquee({ words }: { words: readonly string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        tweenRef.current = gsap.to(trackRef.current, { xPercent: -50, duration: 42, ease: "none", repeat: -1 });
        return () => {
          tweenRef.current = null;
        };
      });
    },
    { scope: trackRef },
  );

  useLenis(({ velocity }) => {
    const tween = tweenRef.current;
    if (!tween) return;
    gsap.to(tween, { timeScale: 1 + Math.min(Math.abs(velocity) / 4, 6), duration: 0.5, ease: "power2.out", overwrite: true });
  });

  // Repeat the phrases so each half of the loop is wider than any screen.
  const sequence = Array.from({ length: REPEAT }, () => words).flat();
  const run = (copy: number) =>
    sequence.map((word, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span
          className={cn(
            "font-display text-5xl font-light italic md:text-7xl",
            i % 2 === 1 ? "text-transparent [-webkit-text-stroke:1px_var(--color-gold)]" : "text-cream",
          )}
        >
          {word}
        </span>
        <Rosette className="mx-8 size-4 shrink-0 md:mx-12 md:size-5" />
      </Fragment>
    ));

  return (
    <section aria-label="Mahvé Coffee — Rooted in the Hills. Brewed for the Soul." className="relative overflow-hidden border-y border-gold/10 bg-ink py-8 md:py-10">
      {/* Decorative repetition — the section label carries the words for assistive tech. */}
      <div ref={trackRef} aria-hidden className="flex w-max items-center whitespace-nowrap will-change-transform">
        <div className="flex items-center">{run(0)}</div>
        <div className="flex items-center">{run(1)}</div>
      </div>
    </section>
  );
}
