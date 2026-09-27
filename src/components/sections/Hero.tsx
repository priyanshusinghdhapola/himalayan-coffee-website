"use client";

import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import heroSequence from "@/config/hero-sequence.json";
import { Emblem } from "@/components/brand/Emblem";
import { createHimalayaScene } from "@/components/higgsfield/fallback-scene";
import { frameUrl } from "@/components/higgsfield/frame-loader";
import { HiggsfieldCanvas, PORTRAIT_QUERY, type HiggsfieldCanvasHandle } from "@/components/higgsfield/HiggsfieldCanvas";
import { Preloader } from "@/components/layout/Preloader";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { brand, heroChapters } from "@/content/brand";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

// Module-level so the object identity is stable across renders.
const SEQUENCES = { landscape: heroSequence.landscape, portrait: heroSequence.portrait };
const HAS_FRAMES = SEQUENCES.landscape.frames > 0;
const HAS_PORTRAIT = SEQUENCES.portrait.frames > 0;

/** Timeline units: the whole scroll distance maps onto 0 → 10. Chapter i owns [start, end]. */
const CHAPTER_SLOTS: Array<[number, number]> = [
  [1.3, 3.5],
  [3.7, 5.8],
  [6.0, 8.0],
  [8.2, 10],
];

/** The preloader plays once per page load — not again on client-side returns to "/". */
let preloaderPlayed = false;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HiggsfieldCanvasHandle>(null);
  const [withPreloader] = useState(() => !preloaderPlayed);
  const [entered, setEntered] = useState(!withPreloader);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (entered) lenis.start();
    else lenis.stop();
  }, [entered, lenis]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleEntered = useCallback(() => {
    preloaderPlayed = true;
    setEntered(true);
  }, []);

  // Scroll → frames + chapters. Both use the same trigger so copy and footage stay in lockstep in both directions.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollTrigger = { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 };

      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger,
        onUpdate: () => canvasRef.current?.setProgress(proxy.p),
      });

      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger });
      tl.to("[data-hero-intro]", { autoAlpha: 0, y: -80, duration: 0.9 }, 0.2);
      tl.fromTo("[data-rail-fill]", { scaleY: 0 }, { scaleY: 1, duration: 10 }, 0);

      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el, i) => {
        const [start, end] = CHAPTER_SLOTS[i];
        tl.fromTo(el, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.7 }, start);
        tl.to(`[data-rail-mark="${i}"]`, { color: "#e6c68e", duration: 0.2 }, start);
        if (i < CHAPTER_SLOTS.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -60, duration: 0.7 }, end - 0.7);
          tl.to(`[data-rail-mark="${i}"]`, { color: "#6f655b", duration: 0.2 }, end - 0.2);
        }
      });
      tl.set({}, {}, 10);
    },
    { scope: sectionRef },
  );

  // Entrance once the preloader lifts.
  useGSAP(
    () => {
      if (!entered) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-hero-title]", { type: "chars", mask: "chars" });
        // The tight 0.9 line-height would clip the accent on É — grow each mask upward without moving the text.
        gsap.set(split.masks, { paddingTop: "0.3em", marginTop: "-0.3em" });
        gsap.set("[data-hero-emblem] [data-draw]", { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap
          .timeline({ delay: 0.1 })
          .from(split.chars, { yPercent: 115, duration: 1.5, ease: "expo.out", stagger: 0.07 })
          .to("[data-hero-emblem] [data-draw]", { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.05 }, 0)
          .from("[data-hero-emblem] [data-fade]", { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.8)
          .from("[data-hero-sub] > *", { autoAlpha: 0, y: 24, duration: 1.1, ease: "expo.out", stagger: 0.12 }, 0.5)
          .from("[data-hero-cue]", { autoAlpha: 0, duration: 1 }, 1.2);
        return () => split.revert();
      });
    },
    { dependencies: [entered], scope: sectionRef },
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="top"
        aria-label={`${brand.fullName} — from the Himalaya to your cup`}
        className="relative h-[420svh] bg-ink md:h-[520svh]"
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {HAS_FRAMES && (
            // First frame as a real <img>: paints before any JS runs (LCP) and sits under the canvas.
            <picture>
              {HAS_PORTRAIT && <source media={PORTRAIT_QUERY} srcSet={frameUrl(SEQUENCES.portrait, 0)} />}
              {/* Plain <img>: frames are pre-optimised WebP and must match the canvas URLs exactly (shared cache). */}
              <img
                src={frameUrl(SEQUENCES.landscape, 0)}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
          )}
          <HiggsfieldCanvas
            ref={canvasRef}
            sequences={SEQUENCES}
            fallback={createHimalayaScene}
            onLoadProgress={setLoadProgress}
            onReady={handleReady}
            label="A single unbroken shot: dawn over the Himalaya, down through deodar forest to a hill village, beans roasting in brass, and espresso poured into glass."
            className="absolute inset-0"
          />

          {/* Scrims keep every line of copy legible over any frame. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/5 to-ink/85" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink/65 via-ink/15 to-transparent md:w-3/4" />

          <div data-hero-intro className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <div data-hero-emblem>
              <Emblem decorative className="mb-5 size-20 md:mb-7 md:size-28" />
            </div>
            <p className="eyebrow mb-5 md:mb-7">Himalayan specialty coffee</p>
            <h1 data-hero-title className="font-caps text-[clamp(3.6rem,15vw,13.5rem)] font-normal leading-[0.9] tracking-[0.1em] text-cream text-shadow-soft">
              MAHVÉ
            </h1>
            <div data-hero-sub className="mt-6 flex flex-col items-center gap-3 md:mt-8">
              <p className="font-display text-2xl font-light italic text-parchment md:text-4xl">
                {brand.tagline}. {brand.taglineSecond}.
              </p>
              <p lang="hi" className="font-deva text-lg text-gold/80 md:text-xl">
                {brand.devanagari}
              </p>
            </div>
            <div data-hero-cue className="absolute bottom-8 flex flex-col items-center gap-3">
              <span className="eyebrow text-[0.6rem] text-mist">Scroll to descend</span>
              <span aria-hidden className="block h-12 w-px overflow-hidden bg-gold/15">
                <span className="block h-full w-full animate-scroll-cue bg-gold" />
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-5 pb-14 md:px-14 md:pb-20">
            <div className="relative max-w-2xl">
              {heroChapters.map((chapter, i) => (
                <article key={chapter.numeral} data-chapter className="invisible absolute bottom-0 left-0 w-full">
                  <p className="eyebrow mb-4">Chapter {chapter.numeral}</p>
                  <h2 className="font-display text-5xl font-light leading-[0.95] text-cream text-shadow-soft md:text-7xl lg:text-8xl">
                    {chapter.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-parchment/90 md:text-lg">{chapter.body}</p>
                  {i === heroChapters.length - 1 && (
                    <div className="mt-8 flex flex-wrap items-center gap-5">
                      <Magnetic>
                        <TransitionLink href="/#collection" className={buttonClasses("gold")}>
                          <span className="relative z-10">Explore the collection</span>
                          <ArrowIcon />
                        </TransitionLink>
                      </Magnetic>
                      <TransitionLink href="/#story" className={buttonClasses("ghost")}>
                        <span className="relative z-10">Our story</span>
                      </TransitionLink>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div aria-hidden className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex lg:right-10">
            {heroChapters.map((chapter, i) => (
              <span key={chapter.numeral} data-rail-mark={i} className="font-caps text-[0.65rem] tracking-[0.2em] text-smoke">
                {chapter.numeral}
              </span>
            ))}
            <span className="relative mt-2 block h-40 w-px bg-gold/15">
              <span data-rail-fill className="absolute inset-0 origin-top bg-gold" />
            </span>
          </div>
        </div>
      </section>

      {withPreloader && !entered && <Preloader progress={loadProgress} ready={ready} onDone={handleEntered} />}
    </>
  );
}
