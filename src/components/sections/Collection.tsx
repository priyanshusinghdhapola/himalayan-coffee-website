import { Rosette } from "@/components/brand/Rosette";
import { Reveal, SplitHeading } from "@/components/ui/motion";
import { products } from "@/content/products";
import type { MediaAvailability } from "@/lib/media";
import { CollectionExplorer } from "./CollectionExplorer";

export function Collection({ media }: { media: MediaAvailability }) {
  return (
    <section id="collection" aria-labelledby="collection-title" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto mb-16 max-w-[1440px] px-5 md:mb-24 md:px-10">
        <p className="eyebrow flex items-center gap-3">
          <Rosette /> The Collection
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SplitHeading id="collection-title" className="font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl lg:col-span-7 lg:text-8xl">
            What we&apos;re <em className="text-gold-bright">pouring</em> now
          </SplitHeading>
          <Reveal className="lg:col-span-5">
            <p className="max-w-md leading-relaxed text-mist lg:ml-auto">
              Four coffees, each named for something that grows in the hills. Small lots, roasted every Monday and shipped within 48
              hours — with a brew recipe on every bag.
            </p>
          </Reveal>
        </div>
      </div>
      <CollectionExplorer products={products} media={media} />
    </section>
  );
}
