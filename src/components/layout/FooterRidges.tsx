"use client";

import { useRef } from "react";
import { HimalayaRidges } from "@/components/brand/HimalayaRidges";
import { gsap, useGSAP } from "@/lib/gsap";

/** The range rises into place, layer by layer, as the page reaches its end. */
export function FooterRidges() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: true },
        });
        gsap.utils.toArray<SVGElement>("[data-ridge]").forEach((layer, i) => {
          tl.fromTo(layer, { yPercent: 10 + i * 9 }, { yPercent: 0 }, 0);
        });
        tl.fromTo("[data-footer-word]", { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="relative h-[46vw] max-h-[560px] min-h-[240px] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(60% 70% at 62% 100%, rgba(217,142,50,0.18) 0%, transparent 70%)" }}
      />
      <p
        data-footer-word
        className="absolute inset-x-0 top-[6%] text-center font-caps text-[18vw] leading-none tracking-[0.08em] text-gold/[0.09]"
      >
        MAHVÉ
      </p>
      <HimalayaRidges id="footer" palette="ink" className="absolute inset-0 size-full" />
    </div>
  );
}
