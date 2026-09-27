import registry from "@/config/media-registry.json";
import { JsonLd } from "@/components/JsonLd";
import { Collection } from "@/components/sections/Collection";
import { Craft } from "@/components/sections/Craft";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Story } from "@/components/sections/Story";
import { Upcoming } from "@/components/sections/Upcoming";
import { brand, marqueeWords, siteUrl } from "@/content/brand";
import type { MediaId } from "@/lib/media";
import { mediaAvailability } from "@/lib/media-server";

export default function HomePage() {
  // Stat'd once at build time: missing Higgsfield files render designed fallbacks.
  const media = mediaAvailability(Object.keys(registry.assets) as MediaId[]);

  return (
    <>
      <Hero />
      <Marquee words={marqueeWords} />
      <Story media={media} />
      <Collection media={media} />
      <Craft media={media} />
      <Upcoming media={media} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brand.fullName,
          slogan: `${brand.tagline}. ${brand.taglineSecond}.`,
          description: brand.description,
          url: siteUrl,
          logo: `${siteUrl}/icon.svg`,
          email: brand.email,
          sameAs: [brand.instagram],
        }}
      />
    </>
  );
}
