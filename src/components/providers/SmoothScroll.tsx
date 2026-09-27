"use client";

import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

function ScrollTriggerBridge() {
  // Lenis moves the native scroll position, so ScrollTrigger needs no
  // scrollerProxy — only a nudge to re-read it on every Lenis tick.
  useLenis(() => ScrollTrigger.update());
  return null;
}

/**
 * One clock for everything: Lenis is advanced from GSAP's ticker so smooth
 * scroll, scrubbed timelines and canvas draws all land in the same frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: !reducedMotion,
        wheelMultiplier: 0.9,
        anchors: true,
      }}
    >
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
