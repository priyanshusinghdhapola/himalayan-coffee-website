"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

type SplitHeadingProps = {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

/** Heading whose lines rise out of a mask as it enters the viewport. */
export function SplitHeading({ as: Tag = "h2", children, className, delay = 0, id }: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate these descendants (staggered) instead of the wrapper itself. */
  selector?: string;
  y?: number;
  delay?: number;
  stagger?: number;
};

/** Fade-and-rise on first entry into the viewport. */
export function Reveal({ children, className, selector, y = 36, delay = 0, stagger = 0.08 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = selector ? gsap.utils.toArray<HTMLElement>(selector, el) : [el];
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay,
          stagger,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Words brighten one by one as the block is scrolled through (scrubbed). */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}

/** Scroll-linked vertical drift. Positive speed moves slower than the page (recedes). */
export function Parallax({ children, speed = 0.2, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${Math.round(n).toLocaleString("en-IN")}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { n: 0 };
        el.textContent = format(0);
        gsap.to(state, {
          n: value,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = format(state.n);
          },
          onComplete: () => {
            el.textContent = format(value);
          },
        });
        return () => {
          el.textContent = format(value);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
