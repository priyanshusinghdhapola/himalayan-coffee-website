"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Emblem } from "@/components/brand/Emblem";

type TransitionContextValue = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionContextValue | null>(null);

/**
 * Curtain page transitions for the App Router: the curtain rises over the
 * old page, the route changes behind it, then it lifts off the new one.
 * Same-page anchors skip the curtain and smooth-scroll instead.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const curtainRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    lenisRef.current = lenis;
  });

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.assign(href);
        return;
      }

      if (url.pathname === window.location.pathname) {
        const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
        if (lenisRef.current) lenisRef.current.scrollTo(target ?? 0, { duration: 1.6 });
        else (target ?? document.body).scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (busyRef.current) return;
      busyRef.current = true;
      lenisRef.current?.stop();
      const curtain = curtainRef.current;
      gsap
        .timeline()
        .set(curtain, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
        .to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
        .fromTo(curtain?.querySelector("[data-curtain-mark]") ?? null, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.3")
        .add(() => router.push(`${url.pathname}${url.search}${url.hash}`, { scroll: false }));
    },
    [router],
  );

  useEffect(() => {
    if (!busyRef.current) return;
    const curtain = curtainRef.current;
    const l = lenisRef.current;
    const target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;

    l?.start();
    if (l) l.scrollTo(target ?? 0, { immediate: true, force: true });
    else window.scrollTo(0, target?.offsetTop ?? 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const tl = gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.set(curtain, { visibility: "hidden" });
          busyRef.current = false;
        },
      })
      .to(curtain?.querySelector("[data-curtain-mark]") ?? null, { autoAlpha: 0, y: -20, duration: 0.3 })
      .to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "<0.1");
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden
        className="invisible fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink"
      >
        <div data-curtain-mark className="flex flex-col items-center gap-4">
          <Emblem decorative className="size-20" />
          <p className="eyebrow">Rooted in the hills</p>
        </div>
        <div className="kullu-band absolute inset-x-0 bottom-0 h-4" />
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** next/link that plays the curtain transition (falls back to a normal Link outside the provider). */
export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const ctx = useContext(TransitionContext);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !ctx) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === "_blank") return;
    e.preventDefault();
    ctx.navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
