import registry from "@/config/media-registry.json";
import { JsonLd } from "@/components/JsonLd";
import { Collection } from "@/components/sections/Collection";
import { Craft } from "@/components/sections/Craft";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Story } from "@/components/sections/Story";
import { Upcoming } from "@/components/sections/Upcoming";
import { brand, contact, marqueeWords } from "@/content/brand";
import { siteUrl } from "@/lib/site-url";
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
          url: siteUrl,
          logo: `${siteUrl}/icon.svg`,
          // Contact details only when verified ones are configured in content/brand.ts.
          ...(contact.email ? { email: contact.email } : {}),
          ...(contact.socials.length ? { sameAs: contact.socials.map((s) => s.href) } : {}),
        }}
      />
    </>
  );
}
