"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Emblem } from "@/components/brand/Emblem";

type PreloaderProps = {
  /** 0–1: share of the hero's priming frames that have arrived. */
  progress: number;
  /** The hero can scrub — priming set loaded (or no sequence to load). */
  ready: boolean;
  onDone: () => void;
};

/** Hard cap so a slow network never holds the page hostage; loading continues behind the page. */
const MAX_WAIT_MS = 7000;

/**
 * The emblem draws itself while the hero's key frames stream in; the Kullu
 * band fills with real progress. Exits only once the brand moment has played
 * AND the hero is scrubbable (or the cap is hit).
 */
export function Preloader({ progress, ready, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const shown = useRef({ v: 0 });
  const onDoneRef = useRef(onDone);
  const [introDone, setIntroDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const leaving = introDone && (ready || timedOut);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const t = window.setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => window.clearTimeout(t);
  }, []);

  const paint = () => {
    const pct = Math.round(shown.current.v * 100);
    if (counterRef.current) counterRef.current.textContent = String(pct).padStart(3, "0");
    if (bandRef.current) bandRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            setIntroDone(true);
            return;
          }
          gsap.set("[data-draw]", { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap
            .timeline({ onComplete: () => setIntroDone(true) })
            .to("[data-draw]", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.07 }, 0.1)
            .from("[data-fade]", { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.7, stagger: 0.12 }, 1.1)
            .from("[data-pl-word]", { yPercent: 110, duration: 1.1, ease: "expo.out" }, 0.5)
            .from("[data-pl-sub]", { autoAlpha: 0, y: 10, duration: 0.8 }, 1.0);
        },
      );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      gsap.to(shown.current, { v: progress, duration: 0.6, ease: "power2.out", overwrite: true, onUpdate: paint });
    },
    { dependencies: [progress] },
  );

  useGSAP(
    () => {
      if (!leaving) return;
      gsap
        .timeline({ onComplete: () => onDoneRef.current() })
        .to(shown.current, { v: 1, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: paint })
        .to("[data-pl-inner]", { autoAlpha: 0, y: -24, duration: 0.6, ease: "power3.in" })
        .to(rootRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.15");
    },
    { dependencies: [leaving], scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="sr-only">Loading Mahvé Coffee</span>
      <div data-pl-inner className="flex flex-col items-center">
        <Emblem decorative className="size-28 md:size-36" />
        <div className="mt-6 overflow-hidden">
          <p data-pl-word className="font-caps text-3xl tracking-[0.28em] text-cream md:text-4xl">
            MAHVÉ
          </p>
        </div>
        <p data-pl-sub className="eyebrow mt-4 text-mist">
          Rooted in the hills
        </p>
      </div>

      <div data-pl-inner className="absolute inset-x-5 bottom-8 flex items-end justify-between md:inset-x-12">
        <span className="eyebrow text-mist">Descending</span>
        <span ref={counterRef} className="font-display text-5xl font-light tabular-nums text-gold md:text-6xl">
          000
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-3 bg-bark/60">
        <div ref={bandRef} className="kullu-band h-full" style={{ clipPath: "inset(0 100% 0 0)" }} />
      </div>
    </div>
  );
}
