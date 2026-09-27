"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { BagFallback } from "@/components/product/BagFallback";
import { FlavorProfile, NoteChips, RoastMeter, SpecList } from "@/components/product/ProductMeta";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Product } from "@/content/products";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MediaAvailability } from "@/lib/media";
import { cn } from "@/lib/cn";

type CollectionExplorerProps = {
  products: Product[];
  media: MediaAvailability;
};

export function CollectionExplorer({ products, media }: CollectionExplorerProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstRun = useRef(true);
  const product = products[active];

  // Pointer tilt + idle float on the product stage.
  useGSAP(
    () => {
      const tilt = tiltRef.current;
      if (!tilt) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-float]", { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(tilt, { transformPerspective: 1000 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
        const stage = tilt.parentElement!;
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });
      // Section entrance.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-stage]", {
          clipPath: "inset(18% 12% 18% 12% round 32px)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  // Swap animation whenever the selected coffee changes (skipped on mount).
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      const visuals = gsap.utils.toArray<HTMLElement>("[data-visual]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        visuals.forEach((el, i) => gsap.set(el, { autoAlpha: i === active ? 1 : 0 }));
        return;
      }
      visuals.forEach((el, i) => {
        if (i === active) {
          gsap.fromTo(
            el,
            { autoAlpha: 0, yPercent: 12, rotate: -5, scale: 0.92 },
            { autoAlpha: 1, yPercent: 0, rotate: 0, scale: 1, duration: 1.2, ease: "expo.out", overwrite: true },
          );
        } else {
          gsap.to(el, { autoAlpha: 0, yPercent: -8, rotate: 4, scale: 0.95, duration: 0.5, ease: "power3.in", overwrite: true });
        }
      });
      gsap.fromTo(
        "[data-detail]",
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, overwrite: true },
      );
      gsap.fromTo("[data-glow]", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" });
    },
    { dependencies: [active], scope: rootRef },
  );

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? products.length - 1 : (i + delta + products.length) % products.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className="mx-auto grid max-w-[1440px] gap-10 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
      {/* Stage — min-w-0 stops the scrolling tab row from widening the grid track on phones. */}
      <div className="min-w-0 lg:col-span-6">
        <div className="lg:sticky lg:top-24">
          <div
            data-stage
            className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-gold/10 bg-stone"
            style={{ clipPath: "inset(0% 0% 0% 0% round 32px)" }}
          >
            <div
              data-glow
              aria-hidden
              className="absolute inset-0 transition-[background] duration-1000"
              style={{ background: `radial-gradient(70% 55% at 50% 45%, ${product.accent}40 0%, transparent 70%)` }}
            />
            <div ref={tiltRef} className="absolute inset-0 [transform-style:preserve-3d]">
              {products.map((p, i) => (
                <div
                  key={p.slug}
                  data-visual
                  className={cn("absolute inset-0", i !== active && "invisible opacity-0")}
                  aria-hidden={i !== active}
                >
                  <div data-float className="absolute inset-0">
                    <MediaImage
                      id={p.pack}
                      available={media[p.pack]}
                      alt={`${p.name} — bag of Mahvé Coffee`}
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      className="object-contain p-[8%]"
                      fallback={<BagFallback product={p} />}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
              <p className="eyebrow text-mist">
                {product.index} / {String(products.length).padStart(2, "0")}
              </p>
              <p lang="hi" className="font-deva text-2xl text-gold/70">
                {product.devanagari}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector + details */}
      <div className="min-w-0 lg:col-span-6">
        <div role="tablist" aria-label="Current coffees" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
          {products.map((p, i) => (
            <button
              key={p.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`coffee-tab-${p.slug}`}
              aria-selected={i === active}
              aria-controls="coffee-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-full border px-5 py-2.5 transition-all duration-500 ease-expo",
                i === active ? "border-gold bg-gold/10" : "border-gold/15 hover:border-gold/45",
              )}
            >
              <span className="size-2.5 rounded-full" style={{ background: p.accent }} aria-hidden />
              <span className="font-caps text-[0.7rem] tracking-[0.22em] text-cream">{p.name}</span>
            </button>
          ))}
        </div>

        <div id="coffee-panel" role="tabpanel" aria-labelledby={`coffee-tab-${product.slug}`} className="mt-10">
          {product.placeholder && (
            <div data-detail className="mb-5">
              <PlaceholderTag>Placeholder — details not verified</PlaceholderTag>
            </div>
          )}
          <p data-detail className="eyebrow">
            {product.roast} · {product.process}
          </p>
          <h3 data-detail className="mt-4 font-display text-6xl font-light leading-[0.95] text-cream md:text-8xl">
            {product.name}
          </h3>
          <p data-detail className="mt-3 font-display text-lg italic text-mist">
            {product.meaning}
          </p>
          <p data-detail className="mt-8 font-display text-2xl leading-snug text-parchment md:text-3xl">
            {product.headline}
          </p>
          <p data-detail className="mt-4 max-w-xl leading-relaxed text-mist">
            {product.description}
          </p>
          <div data-detail className="mt-8">
            <NoteChips notes={product.notes} />
          </div>
          <div data-detail className="mt-10 grid gap-10 md:grid-cols-2">
            <SpecList product={product} />
            <div className="space-y-8">
              <RoastMeter level={product.roastLevel} />
              <FlavorProfile profile={product.profile} />
            </div>
          </div>
          <div data-detail className="mt-10 rounded-[28px] border border-gold/10 bg-stone/60 p-6 md:p-8">
            <PurchasePanel key={product.slug} product={product} />
          </div>
          <div data-detail className="mt-6">
            <TransitionLink href={`/coffee/${product.slug}`} className={buttonClasses("ghost")}>
              <span className="relative z-10">Brew guide & full notes</span>
              <ArrowIcon />
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}
