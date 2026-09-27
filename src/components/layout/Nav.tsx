"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { Emblem } from "@/components/brand/Emblem";
import { TransitionLink } from "@/components/providers/PageTransition";
import { buttonClasses } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { brand, navLinks } from "@/content/brand";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis(({ scroll, direction }) => {
    setScrolled(scroll > 40);
    // Tuck away while reading downward, return on any upward scroll.
    setHidden(direction === 1 && scroll > 480);
  });

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  useGSAP(
    () => {
      if (!open) return;
      gsap.from("[data-menu-item]", { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.15 });
    },
    { dependencies: [open], scope: menuRef },
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-700 ease-expo md:px-6 md:pt-4",
          hidden && !open && "-translate-y-[130%]",
        )}
      >
        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between rounded-full px-4 py-2 md:px-6">
          <div
            aria-hidden
            className={cn("glass absolute inset-0 rounded-full transition-opacity duration-700", scrolled || open ? "opacity-100" : "opacity-0")}
          />
          <TransitionLink href="/" aria-label={`${brand.fullName} — home`} className="relative flex items-center gap-3" onClick={() => setOpen(false)}>
            <Emblem decorative className="size-10" />
            <span className="font-caps text-lg tracking-[0.24em] text-cream">MAHVÉ</span>
          </TransitionLink>

          <nav aria-label="Primary" className="relative hidden md:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="eyebrow relative text-cream/75 transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-expo hover:text-gold-bright hover:after:origin-left hover:after:scale-x-100"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative flex items-center gap-2">
            <Magnetic className="hidden sm:inline-block">
              <TransitionLink href="/#collection" className={buttonClasses("outline", "px-6 py-2.5")}>
                <span className="relative z-10">Shop</span>
              </TransitionLink>
            </Magnetic>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="grid size-11 place-items-center md:hidden"
            >
              <span className="relative block h-3 w-6">
                <span className={cn("absolute left-0 top-0 h-px w-full bg-cream transition-transform duration-500 ease-expo", open && "translate-y-1.5 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-cream transition-transform duration-500 ease-expo", open && "-translate-y-1.5 -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-32 md:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-2">
            {navLinks.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <TransitionLink
                  data-menu-item
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 font-display text-5xl font-light text-cream"
                >
                  <span className="font-caps text-xs text-gold">0{i + 1}</span>
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-6">
          <p className="font-deva text-2xl text-gold/80">{brand.devanagari}</p>
          <p className="eyebrow text-mist">
            {brand.tagline} · {brand.taglineSecond}
          </p>
          <div className="kullu-band h-3" />
        </div>
      </div>
    </>
  );
}
