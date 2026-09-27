import { Emblem } from "@/components/brand/Emblem";
import { Rosette } from "@/components/brand/Rosette";
import { Wordmark } from "@/components/brand/Wordmark";
import { ArtFallback, MediaImage } from "@/components/ui/MediaImage";
import { CountUp, Parallax, Reveal, ScrubText } from "@/components/ui/motion";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { brand, story } from "@/content/brand";
import type { MediaAvailability } from "@/lib/media";
import { cn } from "@/lib/cn";

/** Signage-style plate shown until the brand render (L1) is in place. */
function EmblemPlate() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5"
      style={{ background: "radial-gradient(90% 80% at 30% 20%, #2a221b 0%, #14100c 60%, #0b0907 100%)" }}
    >
      <Emblem decorative className="w-[42%]" />
      <Wordmark withCoffee className="text-[clamp(1.8rem,4vw,3.2rem)] text-gold" />
      <p className="eyebrow mt-2 text-center text-[0.6rem] text-gold/70">
        {brand.tagline}
        <br />
        {brand.taglineSecond}
      </p>
    </div>
  );
}

export function Story({ media }: { media: MediaAvailability }) {
  const hasStats = story.stats.length > 0;
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ink pt-28 md:pt-40">
      <Parallax speed={0.5} className="pointer-events-none absolute -right-[4vw] top-10 select-none">
        <span lang="hi" aria-hidden className="block font-deva text-[30vw] leading-none text-gold/[0.045]">
          पहाड़
        </span>
      </Parallax>

      <div className="relative mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3">
            <Rosette /> {story.eyebrow}
          </p>
          {story.placeholder && <PlaceholderTag className="mt-5">Placeholder copy — brand story not yet verified</PlaceholderTag>}
          <h2 id="story-title" className="sr-only">
            Our story
          </h2>
          <ScrubText
            text={story.statement}
            className="mt-8 font-display text-4xl font-light leading-[1.08] text-cream md:text-6xl xl:text-7xl"
          />
          <Reveal selector="p" className="mt-12 max-w-xl space-y-5 leading-relaxed text-mist md:text-lg">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </Reveal>
        </div>

        <figure className="lg:col-span-5 lg:pt-28">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-gold/15 bg-stone">
            <Parallax speed={-0.14} className="absolute -inset-y-[8%] inset-x-0">
              <MediaImage
                id="BRAND"
                available={media.BRAND}
                alt="The Mahvé Coffee mark in brass on dark stone, beside a carved Pahari window that opens onto the snow peaks of the Himalaya."
                sizes="(min-width: 1024px) 38vw, 92vw"
                fallback={<EmblemPlate />}
              />
            </Parallax>
          </div>
          <figcaption className="mt-4 max-w-sm text-sm leading-relaxed text-smoke">{story.plateCaption}</figcaption>
        </figure>
      </div>

      {/* Establishing plate; the stats panel appears only once verified figures exist in content/brand.ts. */}
      <div className={cn("relative mt-28 overflow-hidden md:mt-40", hasStats ? "h-[82svh] min-h-[560px]" : "h-[60svh] min-h-[420px]")}>
        <Parallax speed={0.22} className="absolute -inset-y-[12%] inset-x-0">
          <MediaImage
            id="S1"
            available={media.S1}
            alt="A Himalayan hill village of stone-and-timber houses on terraced slopes at dawn, snow peaks glowing behind."
            sizes="100vw"
            fallback={<ArtFallback id="S1" palette="dawn" tint="#d98e32" />}
          />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/10 to-ink" />
        {hasStats && (
          <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-16">
            <div className="mx-auto max-w-[1440px] px-5 md:px-10">
              <Reveal>
                <dl className="glass grid grid-cols-2 overflow-hidden rounded-[28px] md:grid-cols-4">
                  {story.stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`flex flex-col-reverse gap-2 p-6 md:p-8 ${i % 2 === 1 ? "border-l border-gold/10" : ""} ${i >= 2 ? "border-t border-gold/10 md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
                    >
                      <dt className="eyebrow text-[0.6rem] text-mist">{stat.label}</dt>
                      <dd className="font-display text-4xl font-light text-cream md:text-6xl">
                        <CountUp value={stat.value} suffix={stat.suffix} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
