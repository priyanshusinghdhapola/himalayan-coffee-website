"use client";

import { useRef, useState } from "react";
import { Rosette } from "@/components/brand/Rosette";
import { NoteChips } from "@/components/product/ProductMeta";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Dialog } from "@/components/ui/Dialog";
import { ArtFallback, MediaImage } from "@/components/ui/MediaImage";
import { Reveal, SplitHeading } from "@/components/ui/motion";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { nextDrop, releases, upcomingIntro, type Release, type ReleaseStatus } from "@/content/upcoming";
import { gsap, useGSAP } from "@/lib/gsap";
import type { MediaAvailability } from "@/lib/media";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "blend", label: "Concept blends" },
  { id: "object", label: "Objects" },
] as const;

const STATUS_STYLE: Record<ReleaseStatus, string> = {
  Concept: "border-glacier/30 text-glacier",
  "In development": "border-saffron/40 text-saffron",
  "Final tastings": "border-gold/50 text-gold-bright",
  "Limited drop": "border-kullu/60 text-cream bg-kullu/30",
};

function StatusBadge({ status }: { status: ReleaseStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] tracking-wider", STATUS_STYLE[status])}>
      <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-current" />
      {status}
    </span>
  );
}

export function UpcomingContent({ media }: { media: MediaAvailability }) {
  const [tab, setTab] = useState<Release["kind"]>("blend");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);
  const visible = releases.filter((r) => r.kind === tab);
  const open = releases.find((r) => r.slug === openSlug) ?? null;
  const hasPlaceholders = releases.some((r) => r.placeholder);
  const drop = nextDrop;

  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo("[data-release]", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08 });
    },
    { dependencies: [tab], scope: gridRef },
  );

  return (
    <div className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3">
            <Rosette /> {upcomingIntro.eyebrow}
          </p>
          {hasPlaceholders && <PlaceholderTag className="mt-5">Placeholder concepts — not announced products</PlaceholderTag>}
          <SplitHeading id="upcoming-title" className="mt-6 font-display text-5xl font-light leading-[0.95] text-cream text-shadow-soft md:text-7xl lg:text-8xl">
            Upcoming <em className="text-gold-bright">releases</em>
          </SplitHeading>
          <Reveal>
            <p className="mt-6 max-w-lg leading-relaxed text-parchment/85 text-shadow-soft">{upcomingIntro.body}</p>
          </Reveal>
        </div>

        {/* Countdown only exists once a confirmed date is set in content/upcoming.ts. */}
        {drop && (
          <Reveal className="lg:col-span-5">
            <div className="glass rounded-[28px] p-6 md:p-8">
              <p className="eyebrow text-[0.6rem]">Next drop</p>
              <p className="mt-2 font-display text-2xl text-cream md:text-3xl">{drop.name}</p>
              <Countdown to={drop.date} className="mt-6" />
              <button type="button" onClick={() => setOpenSlug(drop.slug)} className={buttonClasses("gold", "mt-7")}>
                <span className="relative z-10">Notify me</span>
                <ArrowIcon />
              </button>
            </div>
          </Reveal>
        )}
      </div>

      <div role="tablist" aria-label="Release type" className="glass mt-20 inline-flex rounded-full p-1.5">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`release-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="release-panel"
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
              e.preventDefault();
              const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
              setTab(next.id);
              document.getElementById(`release-tab-${next.id}`)?.focus();
            }}
            className={cn(
              "rounded-full px-6 py-2.5 font-caps text-[0.68rem] tracking-[0.24em] transition-colors duration-500",
              tab === t.id ? "bg-gold text-ink" : "text-cream/80 hover:text-gold-bright",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        id="release-panel"
        role="tabpanel"
        aria-labelledby={`release-tab-${tab}`}
        className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {visible.map((release) => (
          <article key={release.slug} data-release className="glass group flex flex-col overflow-hidden rounded-[28px]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1400ms] ease-expo group-hover:scale-105">
                <MediaImage
                  id={release.image}
                  available={media[release.image]}
                  alt={release.name}
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
                  fallback={<ArtFallback id={release.image} tint={release.kind === "blend" ? "#d98e32" : "#c9a46a"} palette="mist" />}
                />
              </div>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute left-5 top-5">
                <StatusBadge status={release.status} />
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-7">
              {release.placeholder && <PlaceholderTag className="mb-4">Placeholder concept</PlaceholderTag>}
              <p className="eyebrow text-[0.6rem] text-mist">{release.window}</p>
              <h3 className="mt-3 flex items-baseline gap-3 font-display text-3xl font-light text-cream">
                {release.name}
                {release.devanagari && (
                  <span lang="hi" className="font-deva text-base text-gold/70">
                    {release.devanagari}
                  </span>
                )}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-parchment/80">{release.short}</p>
              {release.notes && <NoteChips notes={release.notes} className="mt-5" />}
              <button type="button" onClick={() => setOpenSlug(release.slug)} className={buttonClasses("outline", "mt-7 self-start")}>
                <span className="relative z-10">Details & waitlist</span>
                <ArrowIcon />
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={open !== null} onClose={() => setOpenSlug(null)} labelledBy="release-dialog-title">
        {open && (
          <>
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-[28px]">
              <MediaImage
                id={open.image}
                available={media[open.image]}
                alt={open.name}
                sizes="760px"
                fallback={<ArtFallback id={open.image} palette="mist" />}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            </div>
            <div className="p-7 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                {open.placeholder && <PlaceholderTag>Placeholder concept — details not verified</PlaceholderTag>}
                <StatusBadge status={open.status} />
                <span className="eyebrow text-[0.6rem] text-mist">{open.window}</span>
              </div>
              <h2 id="release-dialog-title" className="mt-4 font-display text-4xl font-light text-cream md:text-5xl">
                {open.name}
              </h2>
              <p className="mt-4 leading-relaxed text-parchment/85">{open.description}</p>
              <dl className="mt-6 divide-y divide-gold/10 border-y border-gold/10">
                {open.details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="eyebrow text-[0.6rem] text-mist">{d.label}</dt>
                    <dd className="text-right text-cream">{d.value}</dd>
                  </div>
                ))}
              </dl>
              {open.notes && <NoteChips notes={open.notes} className="mt-6" />}
              <p className="mt-8 text-sm text-mist">Leave your email to hear when there&apos;s news about {open.name}.</p>
              <WaitlistForm key={open.slug} list={`upcoming:${open.slug}`} className="mt-4" />
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
