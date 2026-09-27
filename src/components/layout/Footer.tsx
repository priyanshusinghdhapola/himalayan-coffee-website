import { Emblem } from "@/components/brand/Emblem";
import { TransitionLink } from "@/components/providers/PageTransition";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import { contact, footer, navLinks } from "@/content/brand";
import { products } from "@/content/products";
import { cn } from "@/lib/cn";
import { FooterRidges } from "./FooterRidges";

const linkClass = "text-sm text-parchment/80 transition-colors duration-300 hover:text-gold-bright";

export function Footer() {
  const hasContact = Boolean(contact.address || contact.email || contact.wholesaleEmail || contact.socials.length);
  return (
    <footer className="relative overflow-hidden bg-ink pt-28 md:pt-36">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Emblem decorative className="size-14" />
          <h2 className="mt-8 font-display text-4xl font-light leading-tight text-cream md:text-6xl">
            Letters from <em className="text-gold-bright">the hills</em>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-mist">{footer.newsletterBody}</p>
          <WaitlistForm
            list="newsletter"
            cta="Subscribe"
            successMessage="Thank you — you're on the list."
            className="mt-8 max-w-lg"
          />
        </div>

        <nav aria-label="Footer" className={cn("grid grid-cols-2 gap-10 lg:col-span-6", hasContact ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
          <div>
            <p className="eyebrow text-[0.6rem] text-mist">Explore</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className={linkClass}>
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-[0.6rem] text-mist">Coffees</p>
            <ul className="mt-5 space-y-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <TransitionLink href={`/coffee/${p.slug}`} className={linkClass}>
                    {p.name}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Only verified details from `contact` in content/brand.ts — the column is omitted while it's empty. */}
          {hasContact && (
            <div className="col-span-2 lg:col-span-1">
              <p className="eyebrow text-[0.6rem] text-mist">Contact</p>
              <ul className="mt-5 space-y-3">
                {contact.address && <li className="text-sm leading-relaxed text-parchment/80">{contact.address}</li>}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className={linkClass}>
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.wholesaleEmail && (
                  <li>
                    <a href={`mailto:${contact.wholesaleEmail}`} className={linkClass}>
                      Wholesale
                    </a>
                  </li>
                )}
                {contact.socials.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {social.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>

      <FooterRidges />
      <div aria-hidden className="kullu-band h-3" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-6 text-xs text-smoke md:flex-row md:justify-between md:px-10">
        <p>{footer.legal}</p>
        <p className="font-display text-sm italic text-mist">{footer.signoff}</p>
      </div>
    </footer>
  );
}
