import { Emblem } from "@/components/brand/Emblem";
import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

/**
 * A rendered Mahvé pouch — stands in for the Higgsfield packshot (P1–P4) and
 * doubles as the packaging direction for those prompts: dark tinted body,
 * brass emblem, Kullu-weave band, Cinzel type.
 */
export function BagFallback({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("relative flex h-full w-full items-center justify-center", className)}>
      <div
        aria-hidden
        className="absolute inset-[10%] rounded-full opacity-60 blur-3xl"
        style={{ background: `radial-gradient(circle, ${product.accent} 0%, transparent 70%)` }}
      />
      <div
        role="img"
        aria-label={`${product.name} — illustrated bag of Mahvé Coffee`}
        className="relative flex aspect-[3/4] h-[84%] flex-col items-center overflow-hidden rounded-[16px_16px_22px_22px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
        style={{
          background: `linear-gradient(165deg, color-mix(in oklab, ${product.accent} 55%, #0b0907) 0%, color-mix(in oklab, ${product.accent} 30%, #0b0907) 55%, #0b0907 115%)`,
          ["--emblem-cut" as string]: `color-mix(in oklab, ${product.accent} 40%, #0b0907)`,
        }}
      >
        <div
          aria-hidden
          className="h-[8%] w-full bg-black/30"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 5px)" }}
        />
        <div aria-hidden className="kullu-band mt-[7%] h-[4.5%] w-full" />
        <Emblem decorative className="mt-[9%] w-[30%]" />
        <p className="mt-[3%] font-caps text-[clamp(0.6rem,1.5vw,0.95rem)] tracking-[0.34em] text-cream">MAHVÉ</p>
        <p className="font-caps text-[clamp(0.35rem,0.7vw,0.5rem)] tracking-[0.5em] text-gold/80">COFFEE</p>
        <div aria-hidden className="my-[5%] h-px w-[40%] bg-gold/40" />
        <p className="font-display text-[clamp(1.4rem,3.4vw,2.6rem)] font-light italic leading-none text-cream">{product.name}</p>
        <p lang="hi" className="mt-[2%] font-deva text-[clamp(0.6rem,1.2vw,0.9rem)] text-gold/80">
          {product.devanagari}
        </p>
        <p className="mt-auto mb-[9%] font-caps text-[clamp(0.35rem,0.7vw,0.5rem)] tracking-[0.35em] text-parchment/70">
          {product.roast.split("·")[0].trim()}
        </p>
        {/* Soft sheen down the left of the pouch. */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[10%] w-[16%] bg-gradient-to-r from-transparent via-white/8 to-transparent blur-md" />
      </div>
    </div>
  );
}
