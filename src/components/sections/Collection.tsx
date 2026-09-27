import { Rosette } from "@/components/brand/Rosette";
import { Reveal, SplitHeading } from "@/components/ui/motion";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { products } from "@/content/products";
import type { MediaAvailability } from "@/lib/media";
import { CollectionExplorer } from "./CollectionExplorer";

export function Collection({ media }: { media: MediaAvailability }) {
  const hasPlaceholders = products.some((p) => p.placeholder);
  return (
    <section id="collection" aria-labelledby="collection-title" className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto mb-16 max-w-[1440px] px-5 md:mb-24 md:px-10">
        <p className="eyebrow flex items-center gap-3">
          <Rosette /> The Collection
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SplitHeading id="collection-title" className="font-display text-5xl font-light leading-[0.95] text-cream md:text-7xl lg:col-span-7 lg:text-8xl">
            Our <em className="text-gold-bright">coffees</em>
          </SplitHeading>
          <Reveal className="lg:col-span-5">
            <div className="flex max-w-md flex-col gap-4 lg:ml-auto">
              <p className="leading-relaxed text-mist">Each named for something that grows in the hills.</p>
              {hasPlaceholders && (
                <PlaceholderTag>Placeholder lineup — origins, notes and process not yet verified</PlaceholderTag>
              )}
            </div>
          </Reveal>
        </div>
      </div>
      <CollectionExplorer products={products} media={media} />
    </section>
  );
}
