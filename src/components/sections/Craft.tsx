import { Rosette } from "@/components/brand/Rosette";
import { ArtFallback, MediaImage } from "@/components/ui/MediaImage";
import { Reveal, SplitHeading } from "@/components/ui/motion";
import { craftIntro, craftSteps } from "@/content/craft";
import type { MediaAvailability } from "@/lib/media";
import { cn } from "@/lib/cn";

const LAYOUT = {
  hero: "aspect-square md:aspect-auto md:col-span-2 md:row-span-2",
  wide: "aspect-[2/1] md:aspect-auto md:col-span-2",
  small: "aspect-square md:aspect-auto md:col-span-1",
} as const;

const SIZES = {
  hero: "(min-width: 768px) 50vw, 92vw",
  wide: "(min-width: 768px) 50vw, 92vw",
  small: "(min-width: 768px) 25vw, 92vw",
} as const;

const TINTS = ["#b6453f", "#d98e32", "#a8412c", "#c9a46a"];

export function Craft({ media }: { media: MediaAvailability }) {
  return (
    <section id="craft" aria-labelledby="craft-title" className="relative bg-night py-28 md:py-40">
      <div aria-hidden className="kullu-band absolute inset-x-0 top-0 h-3" />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="eyebrow flex items-center gap-3">
          <Rosette /> {craftIntro.eyebrow}
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SplitHeading id="craft-title" className="font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl lg:col-span-7 lg:text-8xl">
            Slow by <em className="text-gold-bright">design</em>
          </SplitHeading>
          <Reveal className="lg:col-span-5">
            <p className="max-w-md leading-relaxed text-mist lg:ml-auto">{craftIntro.body}</p>
          </Reveal>
        </div>
      </div>

      <Reveal
        selector="[data-tile]"
        stagger={0.12}
        className="mx-auto mt-16 grid max-w-[1440px] gap-4 px-5 md:mt-24 md:grid-cols-4 md:grid-rows-[repeat(2,minmax(0,25rem))] md:px-10"
      >
        {craftSteps.map((step, i) => (
          <article
            key={step.index}
            data-tile
            className={cn("group relative overflow-hidden rounded-[28px] border border-gold/10 bg-stone", LAYOUT[step.layout])}
          >
            <div className="absolute inset-0 transition-transform duration-[1600ms] ease-expo group-hover:scale-[1.06]">
              <MediaImage
                id={step.image}
                available={media[step.image]}
                alt={step.title}
                sizes={SIZES[step.layout]}
                fallback={<ArtFallback id={step.image} tint={TINTS[i]} />}
              />
            </div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="eyebrow">{step.index}</p>
              <h3 className={cn("mt-3 font-display font-light leading-tight text-cream", step.layout === "hero" ? "text-4xl md:text-5xl" : "text-3xl")}>
                {step.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-parchment/80">{step.body}</p>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
