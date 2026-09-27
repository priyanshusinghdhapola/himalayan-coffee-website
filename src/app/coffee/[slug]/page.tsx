import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rosette } from "@/components/brand/Rosette";
import { JsonLd } from "@/components/JsonLd";
import { BagFallback } from "@/components/product/BagFallback";
import { FlavorProfile, NoteChips, RoastMeter, SpecList } from "@/components/product/ProductMeta";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { TransitionLink } from "@/components/providers/PageTransition";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { ArtFallback, MediaImage } from "@/components/ui/MediaImage";
import { Parallax, Reveal, SplitHeading } from "@/components/ui/motion";
import { brand, siteUrl } from "@/content/brand";
import { getProduct, products } from "@/content/products";
import { mediaSrc } from "@/lib/media";
import { mediaAvailability } from "@/lib/media-server";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.name} — ${product.roast}`;
  const description = `${product.headline} ${product.notes.join(", ")}. ${product.origin}, ${product.altitude}.`;
  return {
    title,
    description,
    alternates: { canonical: `/coffee/${product.slug}` },
    openGraph: { title: `${title} · ${brand.fullName}`, description, url: `/coffee/${product.slug}` },
  };
}

export default async function CoffeePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const media = mediaAvailability([product.pack, product.scene]);
  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <section className="relative min-h-svh overflow-hidden pt-32 md:pt-40">
        <Parallax speed={0.3} className="absolute -inset-y-[10%] inset-x-0">
          <MediaImage
            id={product.scene}
            available={media[product.scene]}
            alt=""
            sizes="100vw"
            preload
            fallback={<ArtFallback id={product.scene} tint={product.accent} palette="dawn" />}
          />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />

        <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 pb-24 md:px-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <TransitionLink href="/#collection" className={buttonClasses("ghost", "mb-10")}>
              <ArrowIcon className="rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" />
              <span className="relative z-10">The collection</span>
            </TransitionLink>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-gold/10 bg-stone/70">
              <MediaImage
                id={product.pack}
                available={media[product.pack]}
                alt={`${product.name} — ${product.roast}, 250 g bag`}
                sizes="(min-width: 1024px) 38vw, 92vw"
                preload
                className="object-contain p-[8%]"
                fallback={<BagFallback product={product} />}
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-20">
            <p className="eyebrow flex items-center gap-3">
              <Rosette /> {product.index} · {product.roast} · {product.process}
            </p>
            <SplitHeading as="h1" className="mt-5 font-display text-7xl font-light leading-[0.9] text-cream md:text-9xl">
              {product.name}
            </SplitHeading>
            <p className="mt-4 flex flex-wrap items-baseline gap-4 font-display text-xl italic text-mist">
              <span lang="hi" className="font-deva not-italic text-gold/80">
                {product.devanagari}
              </span>
              {product.meaning}
            </p>
            <Reveal>
              <p className="mt-10 font-display text-3xl leading-snug text-parchment md:text-4xl">{product.headline}</p>
              <p className="mt-5 max-w-2xl leading-relaxed text-mist md:text-lg">{product.description}</p>
              <NoteChips notes={product.notes} className="mt-8" />
            </Reveal>
            <div className="mt-12 rounded-[28px] border border-gold/10 bg-stone/70 p-6 backdrop-blur md:p-8">
              <PurchasePanel product={product} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="profile-title" className="relative bg-ink py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="profile-title" className="font-display text-4xl font-light text-cream md:text-5xl">
              In the cup
            </h2>
            <RoastMeter level={product.roastLevel} className="mt-8" />
            <FlavorProfile profile={product.profile} className="mt-8" />
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl font-light text-cream md:text-5xl">From the hills</h2>
            <SpecList product={product} className="mt-8" />
          </div>
        </div>
      </section>

      <section aria-labelledby="brew-title" className="relative bg-night py-24 md:py-32">
        <div aria-hidden className="kullu-band absolute inset-x-0 top-0 h-3" />
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <p className="eyebrow">Brew guide</p>
          <h2 id="brew-title" className="mt-4 font-display text-5xl font-light text-cream md:text-7xl">
            How we <em className="text-gold-bright">pour</em> it
          </h2>
          <Reveal selector="[data-brew]" className="mt-12 grid gap-5 md:grid-cols-2">
            {product.brew.map((b) => (
              <div key={b.method} data-brew className="rounded-[28px] border border-gold/10 bg-stone/60 p-8">
                <p className="font-display text-3xl text-cream">{b.method}</p>
                <p className="mt-3 font-caps text-xs tracking-[0.2em] text-gold">{b.recipe}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="more-title" className="bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 id="more-title" className="font-display text-4xl font-light text-cream md:text-5xl">
            Also from the hills
          </h2>
          <ul className="mt-10 divide-y divide-gold/10 border-y border-gold/10">
            {others.map((p) => (
              <li key={p.slug}>
                <TransitionLink
                  href={`/coffee/${p.slug}`}
                  className="group flex items-center justify-between gap-6 py-7 transition-colors duration-500 hover:bg-gold/[0.03]"
                >
                  <span className="flex items-baseline gap-5">
                    <span className="font-caps text-xs text-gold">{p.index}</span>
                    <span className="font-display text-4xl font-light text-cream transition-transform duration-700 ease-expo group-hover:translate-x-3 md:text-6xl">
                      {p.name}
                    </span>
                  </span>
                  <span className="hidden text-sm text-mist md:block">{p.notes.slice(0, 3).join(" · ")}</span>
                  <ArrowIcon className="size-5 text-gold" />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${brand.fullName} — ${product.name}`,
          description: product.description,
          brand: { "@type": "Brand", name: brand.fullName },
          category: "Coffee",
          image: media[product.pack] ? `${siteUrl}${mediaSrc(product.pack)}` : undefined,
          url: `${siteUrl}/coffee/${product.slug}`,
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "INR",
            lowPrice: Math.min(...Object.values(product.prices)),
            highPrice: Math.max(...Object.values(product.prices)),
            availability: "https://schema.org/PreOrder",
          },
        }}
      />
    </>
  );
}
